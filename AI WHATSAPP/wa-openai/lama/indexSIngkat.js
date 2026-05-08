import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import * as dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";

console.log("🚀 Starting WhatsApp Bot...");

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
let executor;

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
    myNumber = clientInfo?.wid?.user || "6285877158827";
    console.log("📞 Bot number:", myNumber);
  } catch (error) {
    console.error("❌ Error getting bot number:", error);
    myNumber = "6285877158827";
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

// ===== LangChain Setup =====
const setupAgent = async () => {
  try {
    if (!process.env.OPENAI_API_KEY || !process.env.TAVILY_API_KEY) {
      throw new Error("❌ API keys not found in .env file");
    }

    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
    });

    const tavily = new TavilySearchResults({
      maxResults: 3,
      apiKey: process.env.TAVILY_API_KEY,
    });

    const memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
    });

    executor = await initializeAgentExecutorWithOptions([tavily], model, {
      agentType: "chat-conversational-react-description",
      verbose: false,
      memory,
      maxIterations: 3,
      maxExecutionTime: 30000,
      agentKwargs: {
        systemMessage: "Kamu adalah asisten AI yang selalu menjawab dalam bahasa Indonesia. Berikan jawaban yang informatif, ramah, dan mudah dipahami."
      }
    });
    
    console.log("✅ LangChain Agent ready!");
  } catch (error) {
    console.error("❌ Error setting up agent:", error.message);
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
    const body = msg.body.trim();
    const isGroupMsg = msg.from.includes("@g.us");
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

    // ===== AI MODE PROCESSING =====
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

        try {
          const response = await Promise.race([
            executor.invoke({ input: `Jawab dari ${authorName}: ${body}` }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 45000))
          ]);

          await msg.reply(`🤖 ${response.output || "Maaf, tidak bisa memproses pesan itu."}`);
          
          if (currentCount + 1 >= AI_MODE_MAX_RESPONSES - 5) {
            await msg.reply(`⚠️ Sisa ${AI_MODE_MAX_RESPONSES - (currentCount + 1)} respon`);
          }
        } catch (error) {
          await handleAIError(msg, error);
        }
        return;
      }
    }
    
    // ===== PRIVATE CHAT HANDLER =====
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
        try {
          const response = await Promise.race([
            executor.invoke({ input: body }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 45000))
          ]);
          await msg.reply(`🤖 ${response.output || "Maaf, tidak bisa memproses."}`);
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

// ===== Process Trigger =====
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
      `*💰 Crypto:* /crypto`;
    
    await msg.reply(helpMessage);
    return;
  }
  
  if (!executor) {
    await msg.reply("⏳ AI sedang dipersiapkan...");
    await setupAgent();
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
    const response = await Promise.race([
      executor.invoke({ input: prompts[triggerType] }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 45000))
    ]);
    
    const icons = { ai: '🤖', quiz: '🎯', sports: '⚽', news: '📰', weather: '🌤️', translate: '🔄', crypto: '💰' };
    const titles = { ai: 'AI', quiz: 'QUIZ TIME!', sports: 'HASIL BOLA', news: 'BERITA TERKINI', weather: `CUACA ${(cleanInput || 'JAKARTA').toUpperCase()}`, translate: 'TRANSLATE', crypto: 'HARGA CRYPTO' };
    
    await msg.reply(`${icons[triggerType]} *${titles[triggerType]}*\n\n${response.output || "Maaf, tidak bisa memproses permintaan."}`);
    
  } catch (error) {
    await handleAIError(msg, error);
  }
};

// ===== Error Handler =====
const handleAIError = async (msg, error) => {
  console.error("❌ AI Error:", error.message);
  
  let errorMsg = "❌ Terjadi error dengan AI.";
  if (error.message.includes("timeout")) {
    errorMsg += "\n⏰ Timeout, coba lagi.";
  } else if (error.message.includes("rate limit")) {
    errorMsg += "\n📊 API limit, coba lagi nanti.";
  }
  
  await msg.reply(errorMsg);
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

// Auto cleanup AI mode every minute
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