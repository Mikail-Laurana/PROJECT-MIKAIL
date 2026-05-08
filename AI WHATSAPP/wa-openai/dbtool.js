// dbtool.js - Simplified Database Tool
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import pkg from "pg";

const { Pool } = pkg;

// Database connection
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
      // Extract table name from /db command (case sensitive)
      const match = userQuery.match(/\/db\s+(\w+)/i);
      
      if (!match) {
        return "❌ **Format: /db [NAMA_TABEL]**\nContoh: /db Siswas, /db GURU";
      }
      
      const tableName = match[1]; // Keep exact case
      
      // Execute query
      const result = await pool.query(`SELECT * FROM "${tableName}" LIMIT 30`);
      
      if (result.rows.length === 0) {
        return `❌ Tabel '${tableName}' kosong atau tidak ada`;
      }
      
      // Format response
      const columns = Object.keys(result.rows[0]);
      let response = `📊 **${tableName}** (${result.rows.length} records)\n\n`;
      
      // Create table header
      response += `| No | ${columns.join(' | ')} |\n`;
      response += `|${'-'.repeat(4)}|${columns.map(() => '-------').join('|')}|\n`;
      
      // Add data rows
      result.rows.forEach((row, i) => {
        const values = columns.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return '-';
          return String(val).substring(0, 15);
        });
        response += `| ${i + 1} | ${values.join(' | ')} |\n`;
      });
      
      return response;
      
    } catch (error) {
      // Handle common errors
      if (error.message.includes('does not exist')) {
        return `❌ Tabel '${match?.[1]}' tidak ditemukan\n💡 Periksa nama tabel (case sensitive)`;
      }
      
      if (error.message.includes('permission denied')) {
        return `❌ Tidak ada akses ke tabel '${match?.[1]}'`;
      }
      
      return `❌ Error: ${error.message}`;
    }
  },
  {
    name: "get_database",
    description: "Access database using /db command with exact table name (case sensitive)",
    schema: z.object({
      userQuery: z.string().describe("Query with format: /db [TABLE_NAME]")
    }),
  }
);

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
  } else {
    console.log('✅ DB connected');
    release();
  }
});