import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini AI client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// AI Summarize PDF
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No document text provided." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `You are FDP AI Assistant, a professional PDF analysis engine built into Adobe Acrobat-style editor FDP. Please provide a comprehensive executive summary of the following document text, followed by 3-5 key takeaways, and a brief classification of document type.\n\nDocument Text:\n${text.substring(
        0,
        25000
      )}`,
      config: {
        systemInstruction:
          "You provide structured, professional document summaries with clear headings for Executive Summary, Key Takeaways, and Document Type.",
      },
    });

    res.json({ summary: response.text || "No summary generated." });
  } catch (error: any) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize document." });
  }
});

// AI Document Chat / Q&A
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { text, question, history = [] } = req.body;
    if (!text || !question) {
      return res.status(400).json({ error: "Document text and question are required." });
    }

    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      config: {
        systemInstruction: `You are FDP AI Expert, an intelligent PDF assistant. Answer the user's questions strictly based on the provided document context. If the answer is not in the document, politely state that it is not covered in this PDF.\n\nDocument Context:\n${text.substring(
          0,
          25000
        )}`,
      },
    });

    // We can seed or send message
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Context:\n${text.substring(0, 25000)}\n\nQuestion: ${question}`,
            },
          ],
        },
      ],
    });

    res.json({ answer: response.text || "I couldn't generate an answer." });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to answer question." });
  }
});

// AI Smart Redaction (PII Detection)
app.post("/api/ai/redact", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided for redaction." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Analyze the following document text and identify all sensitive PII (Personally Identifiable Information) such as Social Security Numbers, Credit Card numbers, Phone numbers, Email addresses, Passports, and confidential financial figures. Return a JSON array of objects with fields: "text" (the exact sensitive text snippet found), "category" (e.g., SSN, Email, Phone, Financial, PII), and "reason" (why it should be redacted).\n\nText:\n${text.substring(
        0,
        25000
      )}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    let redactions = [];
    try {
      redactions = JSON.parse(response.text || "[]");
    } catch {
      redactions = [];
    }

    res.json({ redactions });
  } catch (error: any) {
    console.error("Redact error:", error);
    res.status(500).json({ error: error.message || "Failed to detect redactions." });
  }
});

// AI Translate Document
app.post("/api/ai/translate", async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Text and target language are required." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Translate the following PDF text into ${targetLanguage}. Maintain professional formatting, headings, and structure.\n\nText:\n${text.substring(
        0,
        25000
      )}`,
    });

    res.json({ translatedText: response.text || "Translation failed." });
  } catch (error: any) {
    console.error("Translate error:", error);
    res.status(500).json({ error: error.message || "Translation error." });
  }
});

// AI Proofreader & Rewrite
app.post("/api/ai/proofread", async (req, res) => {
  try {
    const { text, tone = "professional" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Proofread and rewrite the following PDF text to be clear, polished, and written in a ${tone} tone. Fix any grammatical errors and improve flow while retaining all key facts.\n\nText:\n${text.substring(
        0,
        25000
      )}`,
    });

    res.json({ rewrittenText: response.text || text });
  } catch (error: any) {
    console.error("Proofread error:", error);
    res.status(500).json({ error: error.message || "Proofreading error." });
  }
});

// AI Table Extractor
app.post("/api/ai/extract-table", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Extract any tabular data or financial figures from this document text and format them as structured JSON containing an array of tables, where each table has "title", "headers" (array of strings), and "rows" (array of string arrays).\n\nText:\n${text.substring(
        0,
        25000
      )}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    let tables = [];
    try {
      tables = JSON.parse(response.text || "[]");
    } catch {
      tables = [];
    }

    res.json({ tables });
  } catch (error: any) {
    console.error("Extract table error:", error);
    res.status(500).json({ error: error.message || "Table extraction error." });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FDP Server running on http://localhost:${PORT}`);
  });
}

startServer();
