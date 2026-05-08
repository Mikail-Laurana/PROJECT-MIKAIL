import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import * as dotenv from "dotenv";
import { getDataTool } from "./lama/dbtool(Lama).js";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

// LangGraph imports (StateGraph + MemorySaver)
import { StateGraph, MemorySaver } from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

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
// Bagian yang perlu diperbaiki di setupAgent function
const setupAgent = async () => {
  try {
    console.log("🔧 Starting setupAgent with /db trigger...");
    
    if (!process.env.OPENAI_API_KEY || !process.env.TAVILY_API_KEY) {
      throw new Error("❌ API keys not found in .env file");
    }

    // Model
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
    });

    const tools = [getDataTool];
    const checkpointer = new MemorySaver();

    // StateGraph
    const workflow = new StateGraph({
      channels: {
        messages: {
          reducer: (x, y) => {
            if (!x || x.length === 0) return y || [];
            if (!y || y.length === 0) return x;
            return [...x, ...y];
          },
          default: () => []
        }
      }
    });

    // FIXED: Chat node dengan deteksi yang lebih pintar
    workflow.addNode("chat", async (state) => {
      try {
        const messages = state.messages || [];
        const lastMessage = messages[messages.length - 1];
        const userInput = lastMessage?.content || "";
        
        console.log("🎯 User input:", userInput);
        
        if (!userInput) {
          return { messages: [...messages, new AIMessage("Tidak ada input.")] };
        }
        
        // DETEKSI EKSPLISIT untuk perintah /db
        const dbPattern = /^\/db\s+\w+/i;
        const isDbCommand = dbPattern.test(userInput.trim());
        console.log("🔍 Is /db command?", isDbCommand);
        
        if (isDbCommand) {
          // PANGGIL DATABASE TOOL LANGSUNG
          console.log("🔧 Executing /db command...");
          try {
            const toolResult = await getDataTool.invoke({ userQuery: userInput });
            console.log("✅ Database tool executed successfully");
            return { 
              messages: [...messages, new AIMessage(toolResult)]
            };
          } catch (toolError) {
            console.error("❌ Database tool error:", toolError);
            return { 
              messages: [...messages, new AIMessage(`❌ Error database: ${toolError.message}`)]
            };
          }
        }
        
        // DETEKSI untuk perintah help atau /db yang salah format
        const lowerInput = userInput.toLowerCase().trim();
        
        if (lowerInput === '/help' || lowerInput === 'help') {
          const response = `📚 **BANTUAN DATABASE BOT**\n\n🔹 **Database Access:**\n\`/db [NAMA_TABEL]\` - Lihat data tabel\n\nContoh:\n• \`/db Siswas\` - Data tabel Siswas\n• \`/db GURU\` - Data tabel GURU\n• \`/db kelas_10a\` - Data tabel kelas_10a\n\n⚠️ **Penting:** Nama tabel case sensitive!\n\n💬 **Chat Biasa:** Tanya apa saja tentang topik umum!`;
          return { messages: [...messages, new AIMessage(response)] };
        }
        
        if (lowerInput.startsWith('/db') && !isDbCommand) {
          const response = "❌ **Format salah!**\n\nGunakan: `/db [NAMA_TABEL]`\nContoh: `/db Siswas`";
          return { messages: [...messages, new AIMessage(response)] };
        }
        
        // CHAT BIASA - Gunakan AI untuk menjawab
        console.log("💬 Regular chat - using AI");
        try {
          const modelWithTools = model.bindTools(tools);
          const response = await modelWithTools.invoke([
            {
              role: "system",
              content: `Anda adalah asisten AI yang membantu pengguna dengan berbagai pertanyaan. 

PENTING: 
- Hanya gunakan tool database jika pengguna EKSPLISIT menggunakan format "/db [NAMA_TABEL]"
- Untuk pertanyaan umum seperti "siapa jokowi", "apa itu AI", "cuaca hari ini", dll, jawab langsung dengan pengetahuan Anda
- Jangan sarankan penggunaan /db kecuali pengguna bertanya tentang database secara spesifik
- Berikan jawaban yang informatif dan membantu

Jawab dalam bahasa Indonesia dengan ramah dan informatif.`
            },
            ...messages.map(msg => ({
              role: msg.constructor.name === 'HumanMessage' ? 'user' : 'assistant',
              content: msg.content
            }))
          ]);

          return { 
            messages: [...messages, new AIMessage(response.content)]
          };
          
        } catch (aiError) {
          console.error("❌ AI chat error:", aiError);
          return { 
            messages: [...messages, new AIMessage("Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Coba lagi nanti.")]
          };
        }
        
      } catch (error) {
        console.error("❌ Chat node error:", error);
        return { 
          messages: [...(state.messages || []), new AIMessage("❌ Terjadi error. Ketik `/help` untuk bantuan.")]
        };
      }
    });

    workflow.setEntryPoint("chat");
    workflow.setFinishPoint("chat");

    executor = workflow.compile({ checkpointer });
    console.log("✅ Workflow compiled with smart chat detection");

    console.log("🎉 Smart Database Bot ready! Can handle both /db commands and regular chat!");
    
  } catch (error) {
    console.error("❌ Setup error:", error.message);
    throw error;
  }
};

// ===== Session Management =====
const privateChatMode = new Map();

// ===== Trigger Detection =====
const checkTriggers = (body) => {
  const lowerBody = body.toLowerCase().trim();
  
  const triggers = {
    ai: ['ai', '/ai', '@ai', 'bot', '/bot', '@bot', 'ask', '/ask', 'tanya', '/tanya'],
    quiz: ['/quiz', '/kuis', 'quiz', 'kuis'],
    sports: ['/bola', '/sepakbola', '/football', 'bola'],
    news: ['/news', '/berita', 'news', 'berita'],
    weather: ['/cuaca', '/weather', 'cuaca', 'weather'],
    translate: ['/translate', '/terjemah', 'translate', 'terjemah'],
    crypto: ['/crypto', '/bitcoin', 'crypto', 'bitcoin'],
    help: ['/help', '/menu', 'help', 'menu']
  };
  
  for (const [type, triggerList] of Object.entries(triggers)) {
    for (const trigger of triggerList) {
      if (lowerBody.startsWith(trigger.toLowerCase() + ' ') || lowerBody === trigger.toLowerCase()) {
        return { 
          isTriggered: true, 
          triggerType: type, 
          cleanInput: body.substring(trigger.length).trim() 
        };
      }
    }
  }
  
  return { isTriggered: false, triggerType: '', cleanInput: '' };
};

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
    
    const { isTriggered, triggerType, cleanInput } = checkTriggers(body);
    
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

    // ===== AI MODE PROCESSING (group) - FIXED WITH MEMORY =====
    const isAIActive = isGroupMsg && isAIModeActive(from);
    
    if (isGroupMsg && isAIActive) {
      if (lowerBody === "/stop") {
        await deactivateAIMode(from, 'user');
        return;
      }
      
      if (!isTriggered) {
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
    }
    
    // ===== PRIVATE CHAT HANDLER - FIXED WITH MEMORY =====
    if (!isGroupMsg) {
      const mode = privateChatMode.get(from);

      if (lowerBody === "reset") {
        privateChatMode.delete(from);
        await msg.reply("🔄 Mode direset.\n\n1️⃣ Chat dengan AI\n2️⃣ Menunggu manual\n\n💡 _Atau langsung gunakan /help_");
        privateChatMode.set(from, "waiting_choice");
        return;
      }

      if (isTriggered) {
        await processTrigger(msg, triggerType, cleanInput, false);
        return;
      }

      if (!mode) {
        await msg.reply("Halo! Pilih mode:\n\n1️⃣ Chat dengan AI\n2️⃣ Menunggu manual\n\n💡 _Atau gunakan /help_");
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
          await msg.reply("⚠️ Pilih 1 atau 2");
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
    
    // ===== GROUP TRIGGERS =====
    if (isGroupMsg && !isTriggered && !isAIActive) return;
    
    if (isTriggered) {
      await processTrigger(msg, triggerType, cleanInput, isGroupMsg);
    }

  } catch (err) {
    console.error("❌ Error:", err);
    try {
      await msg.reply("❌ Terjadi error. Ketik /help untuk bantuan.");
    } catch (replyError) {
      console.error("❌ Error sending error message:", replyError);
    }
  }
});

// ===== Process Trigger - FIXED WITH MEMORY =====
const processTrigger = async (msg, triggerType, cleanInput, isGroupMsg) => {
  if (triggerType === 'help') {
    const helpMessage = `🤖 *Bot AI Multi-Function*\n\n` +
      (isGroupMsg ? `*🚀 AI MODE (Grup):*\n/ai - Aktifkan AI mode\n/stop - Nonaktifkan\n\n` : '') +
      `*🧠 AI:* ai [pertanyaan]\n` +
      `*🎯 Quiz:* /quiz\n` +
      `*⚽ Bola:* /bola\n` +
      `*📰 News:* /news\n` +
      `*🌤️ Cuaca:* /cuaca [kota]\n` +
      `*🔄 Translate:* /translate [text]\n` +
      `*💰 Crypto:* /crypto`+
      `*📚 Database Access:**\n/db [NAMA_TABEL] - Lihat data tabel\n`;
    
    await msg.reply(helpMessage);
    return;
  }
  
  if (!checkPointer(executor, "Executor")) {
    await msg.reply("⏳ AI sedang dipersiapkan...");
    try { 
      await setupAgent(); 
    } catch(e) { 
      console.error("Retry setup failed:", e);
    }
    return;
  }
  
  const prompts = {
    ai: cleanInput || "Silakan ajukan pertanyaan!",
    quiz: "Buatkan 1 soal quiz random dengan 4 pilihan ganda dalam bahasa Indonesia. Format: SOAL, pilihan A-D, JAWABAN, PENJELASAN",
    sports: "Cari hasil pertandingan sepak bola terbaru dalam 24 jam atau jadwal yang akan datang",
    news: "Berikan 3-5 berita terkini hari ini di Indonesia atau dunia",
    weather: `Cari informasi cuaca terkini untuk ${cleanInput || 'Jakarta'} dengan suhu dan kondisi`,
    translate: cleanInput ? `Terjemahkan: "${cleanInput}" (deteksi bahasa otomatis)` : "Contoh: /translate hello world",
    crypto: "Cari harga cryptocurrency terkini untuk Bitcoin, Ethereum, dan coin populer lainnya"
  };

  if (!cleanInput && (triggerType === 'translate' || triggerType === 'ai')) {
    await msg.reply(triggerType === 'translate' ? 
      "🔄 Contoh: /translate hello world" : 
      "🤖 Silakan ajukan pertanyaan!");
    return;
  }

  try {
    // Gunakan memory untuk trigger juga
    const userMessage = new HumanMessage(prompts[triggerType]);
    
    const response = await Promise.race([
      executor.invoke(
        { messages: [userMessage] },
        { configurable: { thread_id: msg.from } }
      ),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 45000))
    ]);
    
    const icons = { ai: '🤖', quiz: '🎯', sports: '⚽', news: '📰', weather: '🌤️', translate: '🔄', crypto: '💰' };
    const titles = { ai: 'AI', quiz: 'QUIZ TIME!', sports: 'HASIL BOLA', news: 'BERITA TERKINI', weather: `CUACA ${(cleanInput || 'JAKARTA').toUpperCase()}`, translate: 'TRANSLATE', crypto: 'HARGA CRYPTO' };
    
    const aiMessages = response?.messages || [];
    const lastAiMessage = aiMessages[aiMessages.length - 1];
    const output = lastAiMessage?.content || "Maaf, tidak bisa memproses permintaan.";
    
    await msg.reply(`${icons[triggerType]} *${titles[triggerType]}*\n\n${output}`);
    
  } catch (error) {
    await handleAIError(msg, error);
  }
};

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