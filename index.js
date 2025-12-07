// backend/index.js
import express from "express";
import cors from "cors";
import twilio from "twilio";

const app = express();
app.use(cors());
app.use(express.json());

// =============================
//  TWILIO CLIENT
// =============================
console.log("SID:", process.env.TWILIO_ID);
console.log("TOKEN:", process.env.TWILIO_TOKEN);
console.log("FROM:", process.env.TWILIO_WHATSAPP);

const client = twilio(process.env.TWILIO_ID, process.env.TWILIO_TOKEN);

// =============================
//  RUTA RAÍZ (Render test)
// =============================
app.get("/", (req, res) => {
  res.send("Backend Portafolio - WhatsApp API OK");
});

// =============================
//  ENDPOINT: /send-whatsapp
// =============================
app.post("/send-whatsapp", async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ ok: false, error: "Faltan parámetros" });
  }

  try {
    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP,
      to: `whatsapp:${to}`,
      body: message
    });

    console.log("WhatsApp enviado SID:", result.sid);

    return res.json({ ok: true, sid: result.sid });

  } catch (error) {
    console.error("Error enviando WhatsApp:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

// =============================
//  START SERVER
// =============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(" Backend escuchando en puerto", PORT);
});
