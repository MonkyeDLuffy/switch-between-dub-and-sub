import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 REDIRECT METHOD (supports sub/dub)
app.get("/api/stream", (req, res) => {
  const { id, lang = "sub" } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing episode ID" });
  }

  // sanitize lang
  const type = lang === "dub" ? "dub" : "sub";

  const embedUrl = `https://megaplay.buzz/stream/s-2/${id}/${type}`;

  res.redirect(embedUrl);
});

// 🔥 PROXY PLAYER PAGE (NOW SUPPORTS SUB/DUB)
app.get("/watch/:id", (req, res) => {
  const { id } = req.params;
  const { lang = "sub" } = req.query;

  if (!id) {
    return res.status(400).send("Missing episode ID");
  }

  // sanitize lang
  const type = lang === "dub" ? "dub" : "sub";

  const embedUrl = `https://megaplay.buzz/stream/s-2/${id}/${type}`;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Player</title>
      <style>
        body { margin:0; background:black; }
        iframe { width:100%; height:100vh; border:none; }
      </style>
    </head>
    <body>
      <iframe 
        src="${embedUrl}" 
        allowfullscreen 
        allow="autoplay; encrypted-media"
      ></iframe>
    </body>
    </html>
  `);
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
