import baileys from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import pino from "pino";
import readline from "readline";

const { default: makeWASocket, Browsers, useMultiFileAuthState, DisconnectReason } = baileys;

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    browser: Browsers.macOS("Chrome"),
    printQRInTerminal: false
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.clear();
      console.log("=============== QR WA ===============");
      qrcode.generate(qr, { small: true });
      console.log("=====================================\n");
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Session expired. Hapus folder session & login ulang.");
      } else {
        console.log("⚠️ Reconnecting...");
        start();
      }
    }

    if (connection === "open") {
      console.log("✅ WA Web Connected!\n");
      askPhone(sock);
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

function askPhone(sock) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Masukkan nomor WA (628xxx): ", async (phone) => {
    const number = phone.replace(/\D/g, "") + "@s.whatsapp.net";

    await sock.sendMessage(number, {
      text: "Halo! Ini pesan otomatis."
    });

    console.log("📨 Pesan berhasil dikirim!");
    rl.close();
  });
}

start();
