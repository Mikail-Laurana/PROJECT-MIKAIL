// dbtool.js - TRIGGER /db DENGAN CASE SENSITIVE
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import pkg from "pg";

const { Pool } = pkg;

console.log("🔧 Loading dbtool.js...");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sekolah_db",
  password: "1234",
  port: 5432,
});

export const getDataTool = tool(
  async ({ userQuery }) => {
    try {
      console.log(`📝 Database tool called with: "${userQuery}"`);
      
      // Cari pattern /db diikuti nama tabel
      const dbPattern = /\/db\s+(\w+)/i;
      const match = userQuery.match(dbPattern);
      
      if (!match || !match[1]) {
        console.log("❌ No /db command found");
        return "❌ **Gunakan format: /db [NAMA_TABEL]**\n\nContoh:\n• '/db Siswas'\n• '/db GURU'\n• '/db kelas_10a'";
      }
      
      // AMBIL NAMA TABEL PERSIS CASE SENSITIVE
      const tableName = match[1]; // Tidak diubah case-nya sama sekali
      console.log(`🔍 Table name (exact case): "${tableName}"`);
      
      // Query langsung dengan nama tabel PERSIS
      const sqlQuery = `SELECT * FROM "${tableName}" LIMIT 30`;
      console.log(`📊 Executing SQL: ${sqlQuery}`);
      
      const result = await pool.query(sqlQuery);
      console.log(`📊 Query returned ${result.rows.length} rows`);
      
      if (result.rows.length === 0) {
        return `❌ **Tabel '${tableName}' kosong atau tidak ada data**`;
      }
      
      // Format hasil dengan tabel yang rapi
      let response = `📊 **DATA TABEL: ${tableName}**\n`;
      response += `📈 Total: ${result.rows.length} record\n\n`;
      
      // Tampilkan dalam format tabel
      const columns = Object.keys(result.rows[0]);
      
      // Header tabel
      response += `| No | ${columns.join(' | ')} |\n`;
      response += `|${'-'.repeat(4)}|${columns.map(() => '-------').join('|')}|\n`;
      
      // Data rows
      result.rows.forEach((row, index) => {
        const values = columns.map(col => {
          let value = row[col];
          if (value === null) return 'NULL';
          if (value === undefined) return '-';
          // Truncate panjang value jika terlalu panjang
          return String(value).substring(0, 15);
        });
        
        response += `| ${index + 1} | ${values.join(' | ')} |\n`;
      });
      
      response += `\n🔍 **Perintah:** \`${userQuery}\``;
      response += `\n✅ **Query berhasil dieksekusi**`;
      
      console.log("✅ Database response formatted successfully");
      return response;
      
    } catch (error) {
      console.error("❌ Database tool error:", error.message);
      
      // Error handling untuk berbagai kasus
      if (error.message.includes('does not exist')) {
        return `❌ **Tabel '${match?.[1] || 'unknown'}' tidak ditemukan**\n\n💡 Tips:\n• Pastikan nama tabel benar\n• Perhatikan huruf besar/kecil (case sensitive)\n• Coba: /db Siswas (bukan /db siswas)`;
      }
      
      if (error.message.includes('syntax error')) {
        return `❌ **Error SQL syntax**\n\nNama tabel mungkin mengandung karakter khusus atau spasi.`;
      }
      
      if (error.message.includes('permission denied')) {
        return `❌ **Permission denied**\n\nTidak ada akses ke tabel '${match?.[1] || 'unknown'}'.`;
      }
      
      return `❌ **Database Error:** ${error.message}\n\nGunakan: /db [NAMA_TABEL]`;
    }
  },
  {
    name: "get_database",
    description: "Akses database menggunakan trigger /db diikuti nama tabel persis (case sensitive)",
    schema: z.object({
      userQuery: z.string().describe("Query dengan format /db [NAMA_TABEL]")
    }),
  }
);

console.log("✅ getDataTool created successfully");

// Test koneksi database
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

console.log("✅ dbtool.js loaded successfully");