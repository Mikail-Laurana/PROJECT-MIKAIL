import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import * as dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";

console.log("🚀 Starting WhatsApp Bot with Groq AI...");

// ===== AI MODE TRACKING - FITUR BARU =====
const aiModeGroups = new Set(); // Set untuk menyimpan grup yang dalam AI mode
const aiModeActivatedBy = new Map(); // Map untuk menyimpan siapa yang mengaktifkan AI mode
const aiModeTimestamps = new Map(); // Map untuk menyimpan waktu aktivasi AI mode

// Konfigurasi AI Mode
const AI_MODE_TIMEOUT = 30 * 60 * 1000; // 30 menit timeout otomatis
const AI_MODE_MAX_RESPONSES = 50; // Maximum 50 respon per sesi AI mode
const aiModeResponseCount = new Map(); // Counter respon per grup

// ===== WhatsApp Setup dengan Konfigurasi yang Diperbaiki =====
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './whatsapp-session'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-images',
      '--mute-audio',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ],
    timeout: 120000,
    slowMo: 50
  },
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html',
  },
  qrMaxRetries: 5,
  authTimeoutMs: 60000,
  takeoverOnConflict: true,
  takeoverTimeoutMs: 60000
});

// Timeout untuk loading yang terlalu lama
let loadingTimeout;
let isReady = false;
let loadingStartTime = null;

// Get your WhatsApp number (will be set after ready)
let myNumber = '';

// Tambahkan timeout untuk loading yang terlalu lama
const MAX_LOADING_TIME = 180000; // 3 menit

// ===== FUNGSI AI MODE MANAGEMENT =====
const activateAIMode = (groupId, activatorName) => {
  aiModeGroups.add(groupId);
  aiModeActivatedBy.set(groupId, activatorName);
  aiModeTimestamps.set(groupId, Date.now());
  aiModeResponseCount.set(groupId, 0);
  
  console.log(`🤖 AI Mode ACTIVATED untuk grup ${groupId} oleh ${activatorName}`);
  
  // Set timeout otomatis
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
    console.log(`🤖 AI Mode DEACTIVATED untuk grup ${groupId} (${reason})`);
    
    // Kirim notifikasi ke grup
    try {
      let message = "🤖 *AI Mode NONAKTIF*\n\n";
      if (reason === 'timeout') {
        message += "⏰ AI Mode otomatis dinonaktifkan karena timeout (30 menit).";
      } else if (reason === 'limit') {
        message += "📊 AI Mode dinonaktifkan karena mencapai batas maksimum respon.";
      } else {
        message += "✅ AI Mode dinonaktifkan.";
      }
      message += "\n\n_Ketik /AI untuk mengaktifkan lagi._";
      
      await client.sendMessage(groupId, message);
    } catch (error) {
      console.error("Error sending AI mode deactivation message:", error);
    }
  }
};

const isAIModeActive = (groupId) => {
  return aiModeGroups.has(groupId);
};

const getAIModeStatus = (groupId) => {
  if (!isAIModeActive(groupId)) return null;
  
  const activatedBy = aiModeActivatedBy.get(groupId);
  const timestamp = aiModeTimestamps.get(groupId);
  const responseCount = aiModeResponseCount.get(groupId) || 0;
  const timeRemaining = AI_MODE_TIMEOUT - (Date.now() - timestamp);
  
  return {
    activatedBy,
    timestamp,
    responseCount,
    timeRemaining: Math.max(0, timeRemaining),
    maxResponses: AI_MODE_MAX_RESPONSES
  };
};

// ===== AUTO CLEANUP AI MODE =====
setInterval(() => {
  const now = Date.now();
  for (const [groupId, timestamp] of aiModeTimestamps.entries()) {
    if (now - timestamp > AI_MODE_TIMEOUT) {
      deactivateAIMode(groupId, 'timeout');
    }
  }
}, 60000); // Check setiap menit

// QR Code handler dengan retry logic
client.on("qr", (qr) => {
  console.log("📱 Scan QR code ini:");
  qrcode.generate(qr, { small: true });
  console.log("⏰ QR akan expired, scan sekarang!");
  
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
  }
  
  loadingStartTime = Date.now();
});

// Enhanced loading screen handler dengan timeout
client.on("loading_screen", (percent, message) => {
  console.log(`📱 Loading WhatsApp: ${percent}% - ${message}`);
  
  if (!loadingTimeout && percent < 100) {
    loadingTimeout = setTimeout(() => {
      if (!isReady) {
        console.log("⏰ Loading terlalu lama (3 menit), restarting client...");
        restartClient();
      }
    }, MAX_LOADING_TIME);
  }
  
  if (percent >= 100 && loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
});

// Fungsi untuk restart client
const restartClient = async () => {
  console.log("🔄 Restarting WhatsApp client...");
  isReady = false;
  
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  
  try {
    await client.destroy();
    console.log("🗑️ Client destroyed");
  } catch (error) {
    console.log("⚠️ Error destroying client:", error.message);
  }
  
  setTimeout(() => {
    console.log("🔄 Reinitializing client...");
    client.initialize().catch(error => {
      console.error("❌ Reinitialization failed:", error.message);
      console.log("🔄 Retrying in 10 seconds...");
      setTimeout(() => restartClient(), 10000);
    });
  }, 5000);
};

// Set your number after client is ready
client.on("ready", async () => {
  isReady = true;
  
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  
  const loadingTime = loadingStartTime ? (Date.now() - loadingStartTime) / 1000 : 'unknown';
  console.log(`✅ WhatsApp ready! Loading time: ${loadingTime}s`);
  
  try {
    const clientInfo = client.info;
    if (clientInfo && clientInfo.wid) {
      myNumber = clientInfo.wid.user;
      console.log("📞 My WhatsApp number (method 1):", myNumber);
    } else {
      try {
        const me = await client.getState();
        console.log("📱 Client state:", me);
        
        const contacts = await client.getContacts();
        const meContact = contacts.find(contact => contact.isMe);
        if (meContact) {
          myNumber = meContact.number;
          console.log("📞 My WhatsApp number (method 2):", myNumber);
        }
      } catch (altError) {
        console.log("⚠️ Alternative methods failed:", altError.message);
      }
    }
    
    if (!myNumber) {
      console.log("⚠️ Could not detect bot number automatically");
      console.log("🔧 Setting manual fallback number");
      myNumber = "6285877158827";
      console.log("📞 Using manual number:", myNumber);
    }
  } catch (error) {
    console.error("❌ Error getting bot number:", error);
    myNumber = "6285877158827";
    console.log("📞 Using fallback number:", myNumber);
  }
  
  console.log("🤖 Initializing Groq AI Agent...");
  
  try {
    await setupAgent();
    console.log("🎉 Bot fully operational with Groq AI! Ready for groups and private chats!");
    console.log("📋 Bot is ready to receive messages!");
  } catch (error) {
    console.error("❌ Failed to initialize Groq AI Agent:", error);
    console.log("🔄 Bot will work without AI features");
  }
});

client.on("authenticated", () => {
  console.log("🔐 WhatsApp authenticated successfully");
});

client.on("auth_failure", (msg) => {
  console.error("❌ Authentication failed:", msg);
  console.log("🗑️ Try deleting ./whatsapp-session folder and restart");
  
  setTimeout(() => {
    console.log("🔄 Auto-restarting after auth failure...");
    restartClient();
  }, 10000);
});

client.on("disconnected", (reason) => {
  console.log("🔌 WhatsApp disconnected:", reason);
  isReady = false;
  
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  
  setTimeout(() => {
    console.log("🔄 Attempting to reconnect after disconnect...");
    client.initialize().catch(error => {
      console.error("❌ Reconnection failed:", error.message);
      setTimeout(() => restartClient(), 10000);
    });
  }, 5000);
});

client.on('change_state', state => {
  console.log('📱 WhatsApp connection state changed:', state);
  
  if (state === 'CONFLICT') {
    console.log('⚠️ Multiple WhatsApp sessions detected');
    console.log('🔄 Taking over session...');
  }
  
  if (state === 'UNPAIRED') {
    console.log('⚠️ WhatsApp session unpaired');
    isReady = false;
  }
});

// ===== LangChain Setup dengan Groq =====
let model, tavily, memory, executor;

const setupAgent = async () => {
  try {
    console.log("🔍 Checking API keys...");
    
    if (!process.env.GROQ_API_KEY) {
      throw new Error("❌ GROQ_API_KEY not found in .env file");
    }
    if (!process.env.TAVILY_API_KEY) {
      throw new Error("❌ TAVILY_API_KEY not found in .env file");
    }

    console.log("✅ API keys found");
    console.log("🔧 Setting up Groq model...");
    
    model = new ChatGroq({
      model: "llama-3.3-70b-versatile", // Model Groq yang powerful
      temperature: 0.3,
      apiKey: process.env.GROQ_API_KEY,
      timeout: 30000,
      streaming: false, // Disable streaming untuk response yang lebih konsisten
      maxRetries: 3,
    });

    console.log("🔍 Setting up Tavily search...");
    tavily = new TavilySearchResults({
      maxResults: 3,
      apiKey: process.env.TAVILY_API_KEY,
    });

    console.log("🧠 Setting up memory...");
    memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
    });

    console.log("🤖 Initializing agent executor with Groq...");
    executor = await initializeAgentExecutorWithOptions(
      [tavily],
      model,
      {
        agentType: "chat-conversational-react-description",
        verbose: false,
        memory,
        maxIterations: 3,
        maxExecutionTime: 30000,
        agentKwargs: {
          systemMessage: "Kamu adalah asisten AI yang selalu menjawab dalam bahasa Indonesia. Berikan jawaban yang informatif, ramah, dan mudah dipahami. Jika ada pertanyaan dalam bahasa asing, tetap jawab dalam bahasa Indonesia. Kamu menggunakan model Groq Llama 3.1 70B yang sangat cepat dan akurat."
        }
      }
    );
    
    console.log("✅ Groq LangChain Agent ready!");
    return true;
  } catch (error) {
    console.error("❌ Error setting up Groq agent:", error.message);
    throw error;
  }
};

// ===== Session Management =====
const sessions = {};

setInterval(() => {
  const now = Date.now();
  Object.keys(sessions).forEach(userId => {
    if (sessions[userId].lastActivity && (now - sessions[userId].lastActivity > 24 * 60 * 60 * 1000)) {
      delete sessions[userId];
      console.log("🧹 Cleaned old session for", userId);
    }
  });
}, 60 * 60 * 1000);

const privateChatMode = new Map();

// ===== FUNGSI HELPER UNTUK CHECK TRIGGER =====
const checkTriggers = (body) => {
  const lowerBody = body.toLowerCase().trim();
  
  // AI CHAT TRIGGERS
  const aiTriggers = ['ai', '/ai', '@ai', 'bot', '/bot', '@bot', 'ask', '/ask', 'tanya', '/tanya', 'chat', '/chat'];
  for (const trigger of aiTriggers) {
    if (lowerBody.startsWith(trigger.toLowerCase() + ' ') || lowerBody === trigger.toLowerCase()) {
      return { isTriggered: true, triggerType: 'ai', cleanInput: body.substring(trigger.length).trim() };
    }
  }
  
  // QUIZ TRIGGERS
  const quizTriggers = ['/quiz', '/kuis', 'quiz', 'kuis', '/trivia'];
  for (const trigger of quizTriggers) {
    if (lowerBody.startsWith(trigger.toLowerCase())) {
      return { isTriggered: true, triggerType: 'quiz', cleanInput: body.substring(trigger.length).trim() };
    }
  }
  
  // SPORTS/BOLA TRIGGERS
  const sportsTriggers = ['/bola', '/sepakbola', '/football', '/soccer', '/sport', 'bola', 'sepakbola'];
  for (const trigger of sportsTriggers) {
    if (lowerBody.startsWith(trigger.toLowerCase())) {
      return { isTriggered: true, triggerType: 'sports', cleanInput: body.substring(trigger.length).trim() };
    }
  }
  
  // NEWS TRIGGERS
  const newsTriggers = ['/news', '/berita', '/breaking', 'news', 'berita'];
  for (const trigger of newsTriggers) {
    if (lowerBody.startsWith(trigger.toLowerCase())) {
      return { isTriggered: true, triggerType: 'news', cleanInput: body.substring(trigger.length).trim() };
    }
  }
  
  // WEATHER TRIGGERS
  const weatherTriggers = ['/cuaca', '/weather', 'cuaca', 'weather'];
  for (const trigger of weatherTriggers) {
    if (lowerBody.startsWith(trigger.toLowerCase())) {
      return { isTriggered: true, triggerType: 'weather', cleanInput: body.substring(trigger.length).trim() };
    }
  }
  
  // TRANSLATE TRIGGERS
  const translateTriggers = ['/translate', '/terjemah', 'translate', 'terjemah'];
  for (const trigger of translateTriggers) {
    if (lowerBody.startsWith(trigger.toLowerCase())) {
      return { isTriggered: true, triggerType: 'translate', cleanInput: body.substring(trigger.length).trim() };
    }
  }
  
  // CRYPTO TRIGGERS
  const cryptoTriggers = ['/crypto', '/bitcoin', '/btc', 'crypto', 'bitcoin'];
  for (const trigger of cryptoTriggers) {
    if (lowerBody.startsWith(trigger.toLowerCase())) {
      return { isTriggered: true, triggerType: 'crypto', cleanInput: body.substring(trigger.length).trim() };
    }
  }
  
  // HELP/MENU TRIGGERS
  const helpTriggers = ['/help', '/menu', '/start', 'help', 'menu', 'start', '/commands'];
  for (const trigger of helpTriggers) {
    if (lowerBody === trigger.toLowerCase()) {
      return { isTriggered: true, triggerType: 'help', cleanInput: '' };
    }
  }
  
  return { isTriggered: false, triggerType: '', cleanInput: '' };
};

// ===== Message Handler - DENGAN AI MODE SUPPORT DAN PRIVATE CHAT =====
client.on("message", async (msg) => {
  try {
    console.log("🔔 RAW MESSAGE RECEIVED - Testing message handler!");
    
    // Skip status broadcast
    if (msg.from === "status@broadcast") {
      console.log("⏭️ Skipping status broadcast");
      return;
    }

    const from = msg.from;
    const body = msg.body.trim();
    const isGroupMsg = msg.from.includes("@g.us");
    
    // Get message author info untuk grup
    let authorName = '';
    let authorNumber = '';
    if (isGroupMsg && msg.author) {
      try {
        const contact = await client.getContactById(msg.author);
        authorName = contact.pushname || contact.name || contact.number;
        authorNumber = contact.number;
      } catch (error) {
        authorName = msg.author;
        authorNumber = msg.author;
      }
    }
    
    // Enhanced logging
    console.log(`📩 Pesan masuk dari ${from} (${isGroupMsg ? 'GRUP' : 'PRIVATE'})${isGroupMsg ? ` - ${authorName}` : ''}: "${body}"`);
    
    // If bot setup is not complete, give a basic response
    if (!isReady) {
      console.log("⚠️ Bot not fully ready, sending basic response");
      await msg.reply("🤖 Bot sedang loading dengan Groq AI, tunggu sebentar ya...");
      return;
    }
    
    // ===== CHECK TRIGGER SYSTEM =====
    const { isTriggered, triggerType, cleanInput } = checkTriggers(body);
    const lowerBody = body.toLowerCase().trim();
    
    // ===== PRIORITAS TERTINGGI: AI MODE CONTROLS =====
    
    // AI MODE ACTIVATION (/AI) - DENGAN PESAN YANG DIPERBARUI
    if (isGroupMsg && (lowerBody === '/ai' || lowerBody === 'ai mode' || lowerBody === '/aimode')) {
      if (isAIModeActive(from)) {
        const status = getAIModeStatus(from);
        const timeLeft = Math.ceil(status.timeRemaining / (1000 * 60));
        await msg.reply(`🤖 *AI Mode sudah AKTIF (Groq)*\n\n` +
          `👤 Diaktifkan oleh: ${status.activatedBy}\n` +
          `⏰ Waktu tersisa: ${timeLeft} menit\n` +
          `📊 Respon: ${status.responseCount}/${status.maxResponses}\n\n` +
          `_Ketik /stop untuk menonaktifkan_`);
      } else {
        activateAIMode(from, authorName);
        await msg.reply(`🤖 *AI Mode AKTIF! (Groq Llama 3.1 70B)*\n\n` +
          `✅ Diaktifkan oleh: ${authorName}\n` +
          `⏰ Durasi: 30 menit\n` +
          `📊 Max respon: ${AI_MODE_MAX_RESPONSES}\n` +
          `🎯 *Semua pesan di grup ini akan dijawab AI*\n\n` +
          `💡 _Gunakan /help untuk melihat semua fitur yang bisa dipakai menggunakan trigger khusus_\n\n` +
          `_Ketik /stop untuk menonaktifkan_`);
      }
      return;
    }

    // ===== CHECK AI MODE STATUS =====
    const isAIActive = isGroupMsg && isAIModeActive(from);
    
    // AI MODE PROCESSING
    if (isGroupMsg && isAIActive) {
      if (body.startsWith("/")) {
        if (body.toLowerCase() === "/stop") {
          console.log("🛑 Stop command detected, deactivating AI Mode...");
          await deactivateAIMode(from, 'user');
          return;
        } else {
          console.log(`📌 Other command detected in AI Mode: "${body}" -> lanjut ke trigger handler`);
          // biarkan lanjut ke bawah (biar /bola dll tetap jalan)
        }
      } else if (!isTriggered) {
        const currentCount = aiModeResponseCount.get(from) || 0;
        if (currentCount >= AI_MODE_MAX_RESPONSES) {
          await deactivateAIMode(from, 'limit');
          return;
        }

        if (msg.author === myNumber + '@c.us') return;
        if (body.length < 2) return;

        console.log(`🤖 AI Mode (Groq): Processing message from ${authorName}: "${body}"`);
        aiModeResponseCount.set(from, currentCount + 1);

        try {
          if (!executor) {
            await msg.reply("⏳ Groq AI sedang dipersiapkan, tunggu sebentar...");
            await setupAgent();
          }

          const response = await Promise.race([
            executor.invoke({
              input: `Jawab pesan dari ${authorName} dalam bahasa Indonesia dengan ramah dan informatif: ${body}`
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 45000))
          ]);

          const aiResponse = response.output || "Maaf, saya tidak bisa memproses pesan itu.";
          await msg.reply(`🤖 ${aiResponse}`);
          console.log(`✅ Groq AI Mode response sent (${currentCount + 1}/${AI_MODE_MAX_RESPONSES})`);

          if (currentCount + 1 >= AI_MODE_MAX_RESPONSES - 5) {
            await msg.reply(`⚠️ *AI Mode akan segera nonaktif*\n📊 Sisa ${AI_MODE_MAX_RESPONSES - (currentCount + 1)} respon`);
          }

        } catch (error) {
          await handleAIError(msg, error);
        }
        return;
      }
    }
    
    // ===== HANDLE PRIVATE CHAT - DENGAN DUKUNGAN TRIGGER =====
    if (!isGroupMsg) {
      const userId = from;
      const mode = privateChatMode.get(userId);

      // 🔄 Reset pilihan
      if (lowerBody === "reset") {
        privateChatMode.delete(userId);
        await msg.reply("🔄 Mode direset.\n\nPilih mode lagi ya:\n1️⃣ Chat dengan Groq AI\n2️⃣ Silahkan menunggu saya\n\n💡 _Atau langsung gunakan trigger seperti /help, /quiz, /bola, dll_");
        privateChatMode.set(userId, "waiting_choice");
        return;
      }

      // ===== PRIORITAS PERTAMA: JIKA ADA TRIGGER, PROSES LANGSUNG =====
      // Trigger bisa digunakan kapan saja, tidak peduli mode apa
      if (isTriggered) {
        console.log(`🎯 Private chat trigger detected: ${triggerType} - bypassing mode selection`);
        await processTrigger(msg, triggerType, cleanInput, false);
        return;
      }

      // ===== JIKA BELUM ADA MODE, MINTA PILIH DULU =====
      if (!mode) {
        await msg.reply("Halo! Pilih mode dulu ya:\n\n1️⃣ Chat dengan Groq AI\n2️⃣ Silahkan menunggu saya\n\n💡 _Atau langsung gunakan trigger seperti /help, /quiz, /bola, dll_");
        privateChatMode.set(userId, "waiting_choice");
        return;
      }

      // ===== PROSES PILIHAN MODE =====
      if (mode === "waiting_choice") {
        if (body === "1") {
          privateChatMode.set(userId, "ai_mode");
          await msg.reply("✅ Mode Groq AI aktif. Silakan chat saya, AI akan menjawab otomatis.\n\n⚡ Menggunakan Groq Llama 3.1 70B untuk respon super cepat!\n\nKetik *reset* untuk ganti mode.\n\n💡 _Trigger seperti /help, /quiz, /bola tetap bisa digunakan kapan saja_");
          return; // Jangan proses pesan "1" sebagai input AI
        } else if (body === "2") {
          privateChatMode.set(userId, "manual_mode");
          await msg.reply("🙏 Oke, silakan menunggu saya.\n\nKetik *reset* untuk ganti mode.\n\n💡 _Trigger seperti /help, /quiz, /bola tetap bisa digunakan kapan saja_");
          return; // Jangan proses pesan "2"
        } else {
          await msg.reply("⚠️ Pilih dulu ya:\n1️⃣ Chat dengan Groq AI\n2️⃣ Silahkan menunggu saya\n\n💡 _Atau langsung gunakan trigger seperti /help, /quiz, /bola, dll_");
          return;
        }
      }

      // ===== MODE AI AKTIF: JAWAB SEMUA PESAN NON-TRIGGER =====
      if (mode === "ai_mode") {
        // Setup AI jika belum ready
        if (!executor) {
          await msg.reply("⏳ Groq AI sedang dipersiapkan, tunggu sebentar...");
          try {
            await setupAgent();
          } catch (error) {
            await msg.reply("❌ Groq AI bermasalah saat ini. Coba lagi nanti.");
            return;
          }
        }

        try {
          console.log(`🤖 Private chat Groq AI mode - processing: "${body}"`);
          const response = await Promise.race([
            executor.invoke({ input: `Jawab dalam bahasa Indonesia dengan ramah: ${body}` }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 45000))
          ]);

          const aiResponse = response.output || "Maaf, saya tidak bisa memproses pesan itu.";
          await msg.reply(`🤖 ${aiResponse}`);
        } catch (error) {
          await handleAIError(msg, error);
        }
        return;
      }

      // ===== MODE MANUAL: JANGAN JAWAB OTOMATIS =====
      if (mode === "manual_mode") {
        // Pesan masuk tapi tidak dijawab otomatis
        console.log(`📨 Manual mode - message received but not replied: "${body}"`);
        return;
      }
    }
    
    // ===== IGNORE NON-TRIGGERED GROUP MESSAGES =====
    if (isGroupMsg && !isTriggered && !isAIActive) {
      console.log("❌ Group message ignored (no trigger & AI Mode off)");
      return;
    }
    
    // ===== PROCESS TRIGGERS =====
    if (isTriggered) {
      await processTrigger(msg, triggerType, cleanInput, isGroupMsg);
    }

  } catch (err) {
    console.error("❌ Error handling message:", err);
    try {
      await msg.reply("❌ Terjadi error sistem. Ketik /help untuk bantuan.");
    } catch (replyError) {
      console.error("❌ Error sending error message:", replyError);
    }
  }
});

// ===== FUNGSI PROCESS TRIGGER =====
const processTrigger = async (msg, triggerType, cleanInput, isGroupMsg) => {
  // HELP/MENU HANDLER - UPDATED WITH AI MODE INFO
  if (triggerType === 'help') {
    const helpMessage = `🤖 *Bot AI Multi-Function (Groq Powered)*\n\n` +
      `⚡ *Powered by Groq Llama 3.1 70B Versatile*\n\n` +
      (isGroupMsg ? `*🚀 AI MODE (Khusus Grup):*\n` +
      `• /AI - Aktifkan AI mode (jawab semua pesan)\n` +
      `• /stop - Nonaktifkan AI mode\n` +
      `• /status - Cek status AI mode\n\n` : '') +
      `*🧠 AI Chat:*\n` +
      `• ai [pertanyaan] - Chat dengan Groq AI\n` +
      `• /ai, /bot, /ask, /tanya\n\n` +
      `*🎯 Quiz & Games:*\n` +
      `• /quiz - Quiz random\n` +
      `• /kuis, /trivia\n\n` +
      `*⚽ Olahraga:*\n` +
      `• /bola - Hasil pertandingan terbaru\n` +
      `• /sepakbola, /football\n\n` +
      `*📰 Berita:*\n` +
      `• /news - Berita terkini\n` +
      `• /berita, /breaking\n\n` +
      `*🌤️ Cuaca:*\n` +
      `• /cuaca [kota] - Info cuaca\n` +
      `• /weather\n\n` +
      `*🔄 Translate:*\n` +
      `• /translate [text] - Terjemahkan\n` +
      `• /terjemah\n\n` +
      `*💰 Crypto:*\n` +
      `• /crypto - Harga crypto\n` +
      `• /bitcoin, /btc\n\n` +
      (isGroupMsg ? '*🤖 AI Mode akan menjawab semua pesan selama 30 menit atau 50 respon.*' : 
      '*💡 Semua fitur bisa digunakan di private chat!*') +
      `\n\n⚡ *Super cepat dengan teknologi Groq!*`;
    
    await msg.reply(helpMessage);
    return;
  }
  
  // Setup AI if needed
  if (!executor && (triggerType === 'ai' || triggerType === 'quiz' || triggerType === 'sports' || triggerType === 'news' || triggerType === 'weather' || triggerType === 'translate' || triggerType === 'crypto')) {
    console.log("⚠️ Groq AI not ready, setting up...");
    await msg.reply("⏳ Groq AI sedang dipersiapkan, tunggu sebentar...");
    try {
      await setupAgent();
      console.log("✅ Groq AI setup completed");
    } catch (error) {
      console.error("❌ Groq AI setup failed:", error);
      await msg.reply("❌ Groq AI bermasalah saat ini. Coba lagi nanti.");
      return;
    }
  }
  
  // AI CHAT HANDLER
  if (triggerType === 'ai') {
    if (!cleanInput) {
      const promptMessage = isGroupMsg ?
        "🤖 Silakan ajukan pertanyaan setelah trigger.\n\nContoh: ai apa itu javascript?\n\n_Atau gunakan /AI untuk AI mode grup_\n\n⚡ *Powered by Groq Llama 3.1 70B*" :
        "🤖 Silakan ajukan pertanyaan Anda!\n\n⚡ *Powered by Groq Llama 3.1 70B*";
      await msg.reply(promptMessage);
      return;
    }
    
    try {
      console.log(`🤖 Processing Groq AI chat: "${cleanInput}"`);
      const response = await Promise.race([
        executor.invoke({ 
          input: `Jawab dalam bahasa Indonesia dengan ramah dan informatif: ${cleanInput}` 
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 45000))
      ]);
      
      const aiResponse = response.output || "Maaf, saya tidak bisa memproses pertanyaan itu.";
      await msg.reply(`🤖 ${aiResponse}\n\n⚡ _Powered by Groq_`);
      console.log(`✅ Groq AI chat response sent`);
    } catch (error) {
      await handleAIError(msg, error);
    }
    return;
  }
  
  // QUIZ HANDLER
  if (triggerType === 'quiz') {
    try {
      console.log(`🎯 Processing quiz request with Groq`);
      const topics = ['matematika', 'sejarah', 'geografi', 'sains', 'teknologi', 'olahraga', 'film', 'musik'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      const response = await Promise.race([
        executor.invoke({ 
          input: `Buatkan 1 soal quiz ${randomTopic} dalam bahasa Indonesia dengan format:
          
SOAL: [pertanyaan]
A. [pilihan A]
B. [pilihan B] 
C. [pilihan C]
D. [pilihan D]

JAWABAN: [huruf jawaban benar]
PENJELASAN: [penjelasan singkat]

Buat soal yang menarik dan tidak terlalu sulit.` 
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 45000))
      ]);
      
      const quizResponse = response.output || "Maaf, tidak bisa membuat quiz saat ini.";
      await msg.reply(`🎯 *QUIZ TIME!*\n\n${quizResponse}\n\n_Ketik /quiz untuk soal baru_\n⚡ _Powered by Groq_`);
      console.log(`✅ Groq quiz response sent`);
    } catch (error) {
      await handleAIError(msg, error);
    }
    return;
  }
  
  // SPORTS HANDLER
  if (triggerType === 'sports') {
    try {
      console.log(`⚽ Processing sports request with Groq`);
      const response = await Promise.race([
        executor.invoke({ 
          input: `Cari dan berikan informasi hasil pertandingan sepak bola terbaru dalam 24 jam terakhir. Berikan dalam format yang rapi dengan skor, tim, dan waktu pertandingan. Jika tidak ada pertandingan terbaru, berikan jadwal pertandingan yang akan datang. Jawab dalam bahasa Indonesia.` 
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 45000))
      ]);
      
      const sportsResponse = response.output || "Maaf, tidak bisa mengambil info olahraga saat ini.";
      await msg.reply(`⚽ *HASIL BOLA TERKINI*\n\n${sportsResponse}\n\n_Ketik /bola untuk update terbaru_\n⚡ _Powered by Groq_`);
      console.log(`✅ Groq sports response sent`);
    } catch (error) {
      await handleAIError(msg, error);
    }
    return;
  }
  
  // NEWS HANDLER
  if (triggerType === 'news') {
    try {
      console.log(`📰 Processing news request with Groq`);
      const response = await Promise.race([
        executor.invoke({ 
          input: `Cari dan berikan 3-5 berita terkini hari ini yang penting di Indonesia atau dunia. Berikan dalam format yang rapi dengan judul dan ringkasan singkat. Jawab dalam bahasa Indonesia.` 
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 45000))
      ]);
      
      const newsResponse = response.output || "Maaf, tidak bisa mengambil berita saat ini.";
      await msg.reply(`📰 *BERITA TERKINI*\n\n${newsResponse}\n\n_Ketik /news untuk update terbaru_\n⚡ _Powered by Groq_`);
      console.log(`✅ Groq news response sent`);
    } catch (error) {
      await handleAIError(msg, error);
    }
    return;
  }
  
  // WEATHER HANDLER
  if (triggerType === 'weather') {
    const city = cleanInput || 'Jakarta';
    try {
      console.log(`🌤️ Processing weather request for: ${city} with Groq`);
      const response = await Promise.race([
        executor.invoke({ 
          input: `Cari informasi cuaca terkini untuk kota ${city}. Berikan informasi suhu, kondisi cuaca, kelembaban, dan prakiraan singkat. Jawab dalam bahasa Indonesia dengan format yang mudah dibaca.` 
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 45000))
      ]);
      
      const weatherResponse = response.output || "Maaf, tidak bisa mengambil info cuaca saat ini.";
      await msg.reply(`🌤️ *CUACA ${city.toUpperCase()}*\n\n${weatherResponse}\n\n_Ketik /cuaca [kota] untuk kota lain_\n⚡ _Powered by Groq_`);
      console.log(`✅ Groq weather response sent`);
    } catch (error) {
      await handleAIError(msg, error);
    }
    return;
  }
  
  // TRANSLATE HANDLER
  if (triggerType === 'translate') {
    if (!cleanInput) {
      await msg.reply("🔄 Contoh: /translate hello world\natau /terjemah apa kabar\n\n⚡ _Powered by Groq_");
      return;
    }
    
    try {
      console.log(`🔄 Processing translate request: "${cleanInput}" with Groq`);
      const response = await Promise.race([
        executor.invoke({ 
          input: `Terjemahkan teks berikut dan deteksi bahasanya: "${cleanInput}". 
          Jika bahasa Indonesia, terjemahkan ke Inggris. 
          Jika bahasa Inggris, terjemahkan ke Indonesia. 
          Jika bahasa lain, terjemahkan ke Indonesia.
          Format: BAHASA ASAL: [bahasa] | TERJEMAHAN: [hasil terjemahan]` 
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 45000))
      ]);
      
      const translateResponse = response.output || "Maaf, tidak bisa menerjemahkan saat ini.";
      await msg.reply(`🔄 *TRANSLATE*\n\nTEKS ASLI: ${cleanInput}\n\n${translateResponse}\n\n⚡ _Powered by Groq_`);
      console.log(`✅ Groq translate response sent`);
    } catch (error) {
      await handleAIError(msg, error);
    }
    return;
  }
  
  // CRYPTO HANDLER
  if (triggerType === 'crypto') {
    try {
      console.log(`💰 Processing crypto request with Groq`);
      const response = await Promise.race([
        executor.invoke({ 
          input: `Cari harga cryptocurrency terkini untuk Bitcoin (BTC), Ethereum (ETH), dan beberapa coin populer lainnya. Berikan dalam format yang rapi dengan harga dalam USD dan perubahan 24 jam. Jawab dalam bahasa Indonesia.` 
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 45000))
      ]);
      
      const cryptoResponse = response.output || "Maaf, tidak bisa mengambil harga crypto saat ini.";
      await msg.reply(`💰 *HARGA CRYPTO TERKINI*\n\n${cryptoResponse}\n\n_Ketik /crypto untuk update terbaru_\n⚡ _Powered by Groq_`);
      console.log(`✅ Groq crypto response sent`);
    } catch (error) {
      await handleAIError(msg, error);
    }
    return;
  }
};

// ===== ERROR HANDLER FUNCTION =====
const handleAIError = async (msg, error) => {
  console.error("❌ Groq AI Error:", error.message);
  
  let errorMsg = "❌ Terjadi error dengan Groq AI.";
  if (error.message.includes("timeout")) {
    errorMsg += "\n⏰ AI membutuhkan waktu terlalu lama, coba lagi.";
  } else if (error.message.includes("rate limit") || error.message.includes("quota")) {
    errorMsg += "\n📊 API limit tercapai, coba lagi nanti.";
  } else {
    errorMsg += "\n🔄 Coba lagi dalam beberapa saat.";
  }
  errorMsg += "\n\n⚡ _Powered by Groq_";
  
  await msg.reply(errorMsg);
};

// ===== Global Error Handling =====
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
});

// ===== Graceful Shutdown dengan AI Mode Cleanup =====
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  
  // Cleanup AI Mode
  console.log('🧹 Cleaning up AI Mode sessions...');
  for (const groupId of aiModeGroups) {
    try {
      await client.sendMessage(groupId, "🤖 *Bot Shutdown*\n\nBot akan restart, AI Mode dinonaktifkan sementara.\n\n⚡ _Powered by Groq_");
    } catch (error) {
      console.log(`Error sending shutdown message to ${groupId}:`, error);
    }
  }
  
  aiModeGroups.clear();
  aiModeActivatedBy.clear();
  aiModeTimestamps.clear();
  aiModeResponseCount.clear();
  
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
  }
  
  try {
    await client.destroy();
    console.log('✅ WhatsApp client closed');
  } catch (error) {
    console.error('Error during shutdown:', error);
  }
  process.exit(0);
});

// ===== Start Application with Enhanced Setup =====
console.log("📱 Initializing WhatsApp client...");
console.log("🔑 Make sure your .env file contains GROQ_API_KEY and TAVILY_API_KEY");

// Enhanced start function
const startBot = async () => {
  try {
    console.log("🧹 Cleaning up any existing sessions...");
    
    // Reset states
    isReady = false;
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
      loadingTimeout = null;
    }
    
    console.log("🚀 Starting WhatsApp client initialization...");
    await client.initialize();
    console.log("✅ WhatsApp client initialization started");
    
    // Set a maximum wait time for the entire initialization
    setTimeout(() => {
      if (!isReady) {
        console.log("⏰ Maximum initialization time exceeded (5 minutes)");
        console.log("🔄 Force restarting...");
        restartClient();
      }
    }, 300000); // 5 minutes max
    
  } catch (error) {
    console.error("❌ Failed to initialize WhatsApp client:", error);
    console.log("🔄 Retrying in 15 seconds...");
    setTimeout(startBot, 15000);
  }
};

// Add battery info handler
client.on('change_battery', (batteryInfo) => {
  console.log('🔋 Phone battery:', batteryInfo);
});

// Handle remote session conflicts
client.on('remote_session_saved', () => {
  console.log('💾 Remote session saved');
});

console.log("🔧 Starting bot with Groq AI and AI Mode support...");
console.log("📋 AI Mode Features:");
console.log("   • /AI - Activate AI mode in groups");
console.log("   • /stop - Deactivate AI mode");
console.log("   • /status - Check AI mode status");
console.log("   • Auto timeout: 30 minutes");
console.log("   • Max responses: 50 per session");
console.log("📋 Private Chat Features:");
console.log("   • All triggers work in private chat");
console.log("   • Mode selection for non-trigger messages");
console.log("   • Direct trigger processing");
startBot();