import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import * as dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";


// LangGraph imports (StateGraph + MemorySaver)
import { StateGraph, MemorySaver } from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { getDataTool } from "./dbtool(Lama).js";

console.log("🚀 Starting WhatsApp Bot (LangGraph + Checkpointer)...");

// ===== AI MODE TRACKING =====
const aiModeGroups = new Set();
const aiModeActivatedBy = new Map();
const aiModeTimestamps = new Map();
const aiModeResponseCount = new Map();

const AI_MODE_TIMEOUT = 30 * 60 * 1000; // 30 menit
const AI_MODE_MAX_RESPONSES = 50;

// ===== WhatsApp Setup =====
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './whatsapp-session' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  }
});

let isReady = false;
let myNumber = '';
let executor; // akan berisi compiled graph runnable (LangGraph)

// ===== Utility: checkPointer (guard) =====
function checkPointer(obj, name = "variable") {
  if (obj === null || obj === undefined) {
    console.error(`❌ ${name} is null/undefined`);
    return false;
  }
  return true;
}

// ===== AI MODE FUNCTIONS =====
const activateAIMode = (groupId, activatorName) => {
  aiModeGroups.add(groupId);
  aiModeActivatedBy.set(groupId, activatorName);
  aiModeTimestamps.set(groupId, Date.now());
  aiModeResponseCount.set(groupId, 0);
  
  setTimeout(() => {
    if (aiModeGroups.has(groupId)) {
      deactivateAIMode(groupId, 'timeout');
    }
  }, AI_MODE_TIMEOUT);
};

const deactivateAIMode = async (groupId, reason = 'manual') => {
  const wasActive = aiModeGroups.has(groupId);
  aiModeGroups.delete(groupId);
  aiModeActivatedBy.delete(groupId);
  aiModeTimestamps.delete(groupId);
  aiModeResponseCount.delete(groupId);
  
  if (wasActive) {
    try {
      let message = "🤖 *AI Mode NONAKTIF*\n\n";
      if (reason === 'timeout') {
        message += "⏰ Timeout (30 menit).";
      } else if (reason === 'limit') {
        message += "📊 Mencapai batas maksimum respon.";
      } else {
        message += "✅ Dinonaktifkan manual.";
      }
      message += "\n\n_Ketik /ai untuk mengaktifkan lagi._";
      
      await client.sendMessage(groupId, message);
    } catch (error) {
      console.error("Error sending deactivation message:", error);
    }
  }
};

const isAIModeActive = (groupId) => aiModeGroups.has(groupId);

const getAIModeStatus = (groupId) => {
  if (!isAIModeActive(groupId)) return null;
  
  const activatedBy = aiModeActivatedBy.get(groupId);
  const timestamp = aiModeTimestamps.get(groupId);
  const responseCount = aiModeResponseCount.get(groupId) || 0;
  const timeRemaining = AI_MODE_TIMEOUT - (Date.now() - timestamp);
  
  return {
    activatedBy,
    responseCount,
    timeRemaining: Math.max(0, timeRemaining),
    maxResponses: AI_MODE_MAX_RESPONSES
  };
};

// ===== WhatsApp Event Handlers =====
client.on("qr", (qr) => {
  console.log("📱 Scan QR code:");
  qrcode.generate(qr, { small: true });
});

client.on("loading_screen", (percent, message) => {
  console.log(`📱 Loading: ${percent}% - ${message}`);
});

client.on("authenticated", () => {
  console.log("🔐 Authenticated successfully");
});

client.on("ready", async () => {
  isReady = true;
  console.log("✅ WhatsApp ready!");
  
  try {
    const clientInfo = client.info;
    myNumber = clientInfo?.wid?.user || "unknown";
    console.log("📞 Bot number:", myNumber);
  } catch (error) {
    console.error("❌ Error getting bot number:", error);
    myNumber = "unknown";
  }
  
  try {
    await setupAgent();
    console.log("🎉 Bot fully operational!");
  } catch (error) {
    console.error("❌ Failed to setup agent:", error);
    console.log("🔄 Bot will work without AI features");
  }
});

client.on("auth_failure", (msg) => {
  console.error("❌ Authentication failed:", msg);
  console.log("💡 Try deleting ./whatsapp-session folder and restart");
});

client.on("disconnected", (reason) => {
  console.log("🔌 Disconnected:", reason);
  isReady = false;
  
  // Simple reconnection attempt
  setTimeout(() => {
    console.log("🔄 Attempting to reconnect...");
    client.initialize().catch(err => {
      console.error("❌ Reconnection failed:", err.message);
    });
  }, 5000);
});

// ===== LangGraph Setup (setupAgent) - FIXED WITH PROPER MEMORY =====
const setupAgent = async () => {
  try {
    if (!process.env.OPENAI_API_KEY || !process.env.TAVILY_API_KEY) {
      throw new Error("❌ API keys not found in .env file");
    }

    // Model (ChatOpenAI)
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
    });

    // Tool: Tavily (search)
    const tavily = new TavilySearchResults({
      maxResults: 3,
      apiKey: process.env.TAVILY_API_KEY,
    });

    const tools = [tavily, getDataTool];

    const modelWithTools = model.bindTools(tools);

    // Checkpointer
    const checkpointer = new MemorySaver();

    // StateGraph dengan state definition yang BENAR untuk menyimpan messages
    const workflow = new StateGraph({
      channels: {
        messages: {
          reducer: (x, y) => {
            // Jika x kosong/undefined, gunakan y
            if (!x || x.length === 0) return y || [];
            // Jika y kosong/undefined, gunakan x
            if (!y || y.length === 0) return x;
            // Gabungkan messages, pastikan tidak duplikat
            const combined = [...x, ...y];
            return combined;
          },
          default: () => []
        }
      }
    });

    // Node untuk processing dengan proper conversation memory
    workflow.addNode("chat", async (state) => {
      try {
        const messages = state.messages || [];
        console.log("🔄 Processing with", messages.length, "previous messages");
        
        // Ambil pesan terakhir (user input terbaru)
        const lastMessage = messages[messages.length - 1];
        const userInput = lastMessage?.content || "";
        const modelWithTools = model.bindTools([getDataTool]);
        
        if (!userInput) {
          return { messages: [...messages, new AIMessage("Tidak ada input yang diterima.")] };
        }
        
        // Direct chat dengan model menggunakan conversation history
        const conversationMessages = [
          ...messages.slice(-10), // Ambil 10 pesan terakhir untuk context
        ];
        
        const response = await modelWithTools.invoke(conversationMessages);
        const result = response?.content || "Tidak dapat memproses permintaan.";

        if (response.tool_calls && response.tool_calls.length > 0) {
          console.log("🔧 Tool dipanggil:", response.tool_calls);
          result = JSON.stringify(response.tool_calls, null, 2);
        } else {
          result = response?.content || "Tidak dapat memproses permintaan.";
        }
        // Return messages dengan menambahkan AI response
        return { 
          messages: [...messages, new AIMessage(result)]
        };
        
      } catch (error) {
        console.error("❌ Error in chat node:", error);
        const errorMessage = new AIMessage("Maaf, terjadi error saat memproses permintaan.");
        return { 
          messages: [...(state.messages || []), errorMessage]
        };
      }
    });

    // Set entry point ke node 'chat'
    workflow.setEntryPoint("chat");
    workflow.setFinishPoint("chat");

    // Compile workflow dengan checkpointer
    executor = workflow.compile({ checkpointer });

    console.log("✅ LangGraph Agent with Memory ready!");
  } catch (error) {
    console.error("❌ Error setting up agent:", error.message || error);
    throw error;
  }
};

// ===== Session Management =====
const privateChatMode = new Map();

// ===== Message Handler =====
client.on("message", async (msg) => {
  try {
    if (msg.from === "status@broadcast" || !isReady) return;

    const from = msg.from;
    const body = (msg.body || "").trim();
    const isGroupMsg = from.includes("@g.us");
    const lowerBody = body.toLowerCase().trim();
    
    // Get author info for groups
    let authorName = '';
    if (isGroupMsg && msg.author) {
      try {
        const contact = await client.getContactById(msg.author);
        authorName = contact.pushname || contact.name || contact.number;
      } catch (error) {
        authorName = msg.author;
      }
    }
    
    console.log(`📩 Message from ${from} ${isGroupMsg ? `(${authorName})` : ''}: "${body}"`);
    
    // ===== AI MODE CONTROLS (Groups Only) =====
    if (isGroupMsg && lowerBody === '/ai') {
      if (isAIModeActive(from)) {
        const status = getAIModeStatus(from);
        const timeLeft = Math.ceil(status.timeRemaining / (1000 * 60));
        await msg.reply(`🤖 *AI Mode sudah AKTIF*\n\n` +
          `👤 Oleh: ${status.activatedBy}\n` +
          `⏰ Sisa: ${timeLeft} menit\n` +
          `📊 Respon: ${status.responseCount}/${status.maxResponses}\n\n` +
          `_Ketik /stop untuk nonaktifkan_`);
      } else {
        activateAIMode(from, authorName);
        await msg.reply(`🤖 *AI Mode AKTIF!*\n\n` +
          `✅ Oleh: ${authorName}\n` +
          `⏰ Durasi: 30 menit\n` +
          `📊 Max: ${AI_MODE_MAX_RESPONSES} respon\n\n` +
          `_Ketik /stop untuk nonaktifkan_`);
      }
      return;
    }

    // ===== AI MODE PROCESSING (group) =====
    const isAIActive = isGroupMsg && isAIModeActive(from);
    
    if (isGroupMsg && isAIActive) {
      if (lowerBody === "/stop") {
        await deactivateAIMode(from, 'user');
        return;
      }
      
      const currentCount = aiModeResponseCount.get(from) || 0;
      if (currentCount >= AI_MODE_MAX_RESPONSES) {
        await deactivateAIMode(from, 'limit');
        return;
      }

      if (msg.author === myNumber + '@c.us' || body.length < 2) return;

      aiModeResponseCount.set(from, currentCount + 1);

      // Pastikan executor siap
      if (!checkPointer(executor, "Executor")) {
        await msg.reply("⏳ AI belum siap. Coba lagi sebentar...");
        return;
      }

      try {
        // Jalankan graph dengan thread_id = from dan tambahkan user message ke state
        const userMessage = new HumanMessage(`${authorName || 'User'}: ${body}`);
        
        const response = await Promise.race([
          executor.invoke(
            { messages: [userMessage] },
            { configurable: { thread_id: from } }
          ),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 45000))
        ]);

        // Ambil pesan AI terakhir dari response
        const aiMessages = response?.messages || [];
        const lastAiMessage = aiMessages[aiMessages.length - 1];
        const output = lastAiMessage?.content || "Maaf, tidak bisa memproses pesan itu.";
        
        await msg.reply(` ${output}`);
        
        if (currentCount + 1 >= AI_MODE_MAX_RESPONSES - 5) {
          await msg.reply(`⚠️ Sisa ${AI_MODE_MAX_RESPONSES - (currentCount + 1)} respon`);
        }
      } catch (error) {
        await handleAIError(msg, error);
      }
      return;
    }
    
    // ===== PRIVATE CHAT HANDLER =====
    if (!isGroupMsg) {
      const mode = privateChatMode.get(from);

      if (lowerBody === "reset") {
        privateChatMode.delete(from);
        await msg.reply("🔄 Mode direset.\n\n1️⃣ Chat dengan AI\n2️⃣ Menunggu manual\n\n💡 _Ketik /ai untuk mode AI_");
        privateChatMode.set(from, "waiting_choice");
        return;
      }

      // Handle /ai trigger untuk private chat
      if (lowerBody === '/ai' || lowerBody === 'ai') {
        privateChatMode.set(from, "ai_mode");
        await msg.reply("✅ Mode AI aktif.\n\nKetik *reset* untuk ganti mode.");
        return;
      }

      if (!mode) {
        await msg.reply("Halo! Pilih mode:\n\n1️⃣ Chat dengan AI\n2️⃣ Menunggu manual\n\n💡 _Atau ketik /ai untuk langsung ke mode AI_");
        privateChatMode.set(from, "waiting_choice");
        return;
      }

      if (mode === "waiting_choice") {
        if (body === "1") {
          privateChatMode.set(from, "ai_mode");
          await msg.reply("✅ Mode AI aktif.\n\nKetik *reset* untuk ganti mode.");
          return;
        } else if (body === "2") {
          privateChatMode.set(from, "manual_mode");
          await msg.reply("🙏 Mode manual aktif.\n\nKetik *reset* untuk ganti mode.");
          return;
        } else {
          await msg.reply("⚠️ Pilih 1 atau 2, atau ketik /ai");
          return;
        }
      }

      if (mode === "ai_mode") {
        if (!checkPointer(executor, "Executor")) {
          await msg.reply("⏳ AI belum siap. Coba lagi sebentar...");
          return;
        }

        try {
          // Gunakan memory untuk private chat juga
          const userMessage = new HumanMessage(body);
          
          const response = await Promise.race([
            executor.invoke(
              { messages: [userMessage] },
              { configurable: { thread_id: from } }
            ),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 45000))
          ]);
          
          const aiMessages = response?.messages || [];
          const lastAiMessage = aiMessages[aiMessages.length - 1];
          const output = lastAiMessage?.content || "Maaf, tidak bisa memproses.";
          
          await msg.reply(` ${output}`);
        } catch (error) {
          await handleAIError(msg, error);
        }
        return;
      }

      if (mode === "manual_mode") {
        return; // No auto reply
      }
    }
    
    // ===== GROUP NON-AI MODE (tidak merespons otomatis) =====
    if (isGroupMsg && !isAIActive) {
      return; // Tidak ada respons otomatis di grup jika AI mode tidak aktif
    }

  } catch (err) {
    console.error("❌ Error:", err);
    try {
      await msg.reply("❌ Terjadi error. Ketik /ai untuk mengaktifkan AI mode.");
    } catch (replyError) {
      console.error("❌ Error sending error message:", replyError);
    }
  }
});

// ===== Error Handler =====
const handleAIError = async (msg, error) => {
  console.error("❌ AI Error:", error.message || error);
  
  let errorMsg = "❌ Terjadi error dengan AI.";
  if ((error.message || '').includes("timeout")) {
    errorMsg += "\n⏰ Timeout, coba lagi.";
  } else if ((error.message || '').includes("rate limit")) {
    errorMsg += "\n📊 API limit, coba lagi nanti.";
  } else {
    // general
    errorMsg += `\n⚠️ ${error.message || error}`;
  }
  
  try {
    await msg.reply(errorMsg);
  } catch (e) {
    console.error("Error replying error message:", e);
  }
};

// ===== Cleanup & Start =====
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down...');
  
  for (const groupId of aiModeGroups) {
    try {
      await client.sendMessage(groupId, "🤖 Bot restart, AI Mode nonaktif sementara.");
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
  
  await client.destroy();
  process.exit(0);
});

// Auto cleanup AI mode every minute (timeout enforcement)
setInterval(() => {
  const now = Date.now();
  for (const [groupId, timestamp] of aiModeTimestamps.entries()) {
    if (now - timestamp > AI_MODE_TIMEOUT) {
      deactivateAIMode(groupId, 'timeout');
    }
  }
}, 60000);

console.log("🔧 Starting bot...");
client.initialize();