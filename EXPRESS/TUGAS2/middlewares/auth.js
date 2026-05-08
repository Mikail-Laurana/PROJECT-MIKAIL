const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek apakah header Authorization ada
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan atau format salah" });
  }

  const token = authHeader.split(" ")[1];

  // Verifikasi token
  jwt.verify(token, "rahasia", (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err.message); // log error
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token sudah kadaluarsa" });
      } else {
        return res.status(403).json({ message: "Token tidak valid" });
      }
    }

    // Jika valid, masukkan user ke req.user
    req.user = decoded;
    next();
  });
};

module.exports = auth;
