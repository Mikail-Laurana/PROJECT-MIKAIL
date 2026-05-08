import 'dotenv/config';
import readline from 'readline';
import { DataSource } from 'typeorm';
import { ChatGroq } from '@langchain/groq';
import { SqlDatabase } from 'langchain/sql_db';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

// 1. Koneksi PostgreSQL lokal
const datasource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

await datasource.initialize();
console.log('✅ Terhubung ke PostgreSQL Lokal');

// 2. LLM Groq
const llm = new ChatGroq({
  model: "llama3-8b-8192",  // bisa ganti ke "mixtral-8x7b-32768"
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});

// 3. Database
const sqlDb = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});
const schema = await sqlDb.getTableInfo();

// 4. Prompt untuk generate SQL
const sqlPrompt = PromptTemplate.fromTemplate(`
Kamu adalah AI yang menulis query SQL PostgreSQL.
Tabel yang tersedia:
{schema}

Pertanyaan pengguna:
{question}

⚠️ Keluarkan hanya query SQL valid, tanpa penjelasan tambahan.
`);
const sqlChain = new LLMChain({ llm, prompt: sqlPrompt });

// 5. Prompt untuk jawaban natural language
const answerPrompt = PromptTemplate.fromTemplate(`
Pertanyaan pengguna: {question}
Hasil query (JSON): {result}

Buat jawaban yang jelas dalam bahasa Indonesia.
`);
const answerChain = new LLMChain({ llm, prompt: answerPrompt });

// 6. Fungsi untuk proses pertanyaan
async function processQuestion(question) {
  try {
    // Generate SQL
    const response = await sqlChain.invoke({ schema, question });
    const sqlQuery = response.text.trim();
    console.log("📝 Query SQL:", sqlQuery);

    // Jalankan query
    const result = await sqlDb.run(sqlQuery);
    console.log("📊 Hasil Query (mentah):", result);

    // Jawaban natural language
    const finalAnswer = await answerChain.invoke({ question, result: JSON.stringify(result) });
    console.log("🤖 Jawaban AI:", finalAnswer.text, "\n");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// 7. Setup input interaktif (chat di terminal)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("💬 Chatbot SQL siap. Tulis pertanyaanmu (ketik 'exit' untuk keluar).");

rl.on("line", async (input) => {
  if (input.toLowerCase() === "exit") {
    console.log("👋 Bye!");
    rl.close();
    process.exit(0);
  }
  await processQuestion(input);
});
