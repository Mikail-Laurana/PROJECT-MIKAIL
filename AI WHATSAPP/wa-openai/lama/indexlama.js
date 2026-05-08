import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import * as dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";

// ===== WhatsApp Setup =====
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => qrcode.generate(qr, { small: true }));
client.on("ready", () => console.log("✅ WhatsApp bot siap!"));

// ===== LangChain Setup =====
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
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

let executor;
const setupAgent = async () => {
  executor = await initializeAgentExecutorWithOptions(
    [tavily],
    model,
    {
      agentType: "chat-conversational-react-description",
      verbose: true,
      memory,
    }
  );
  console.log("🤖 LangChain Agent ready!");
};

await setupAgent();

// ===== Session per user =====
const sessions = {};

// ===== Handle pesan WhatsApp =====
client.on("message", async (msg) => {
  try {
    if (msg.from.includes("@g.us")) return; // hanya private chat

    const from = msg.from;
    const body = msg.body.trim();

    console.log("📩 Pesan masuk dari", from, ":", body);

    if (!sessions[from]) {
      sessions[from] = { mode: null, waiting: false };
      // Kirim menu awal
      await msg.reply(
        "Hai! Saya sedang tidak tersedia.\nPilih:\n1 = Bicara dengan AI\n2 = Menunggu saya"
      );
      return;
    }

    // Kalau user memilih mode
    if (!sessions[from].mode) {
      if (body === "1") {
        sessions[from].mode = "ai";
        await msg.reply("Mode AI dipilih ✅ Kamu bisa mulai chat sekarang.");
        return;
      } else if (body === "2") {
        sessions[from].mode = "wait";
        await msg.reply("Oke, kamu akan menunggu saya 😊");
        return;
      } else {
        await msg.reply("Pilih 1 atau 2 ya.");
        return;
      }
    }

    // Kalau mode AI, jalankan LangChain
    if (sessions[from].mode === "ai") {
      const response = await executor.invoke({ input: body });
      await msg.reply(response.output);
      return;
    }

    // Kalau mode menunggu, jangan reply
    if (sessions[from].mode === "wait") {
      return;
    }
  } catch (err) {
    console.error("❌ Error agent:", err);
    await msg.reply("Maaf, terjadi error saat memproses pesan.");
  }
});

client.initialize();