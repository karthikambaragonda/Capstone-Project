import express from "express";
import axios from "axios";
import pool from "../config/db.js";   // <-- ensure this path is correct

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✔ Correct REST API client for Gemini v1
const gemini = axios.create({
    baseURL: "https://generativelanguage.googleapis.com/v1/",
    headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
    },
});
function cleanMarkdown(text) {
    if (!text) return "";

    return text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/_(.*?)_/g, "$1")

        // headings (##, ###)
        .replace(/^#+\s*(.*)$/gm, "$1")

        // code blocks and inline code
        .replace(/`{1,3}(.*?)`{1,3}/g, "$1")

        // Convert bullet types "* " or "- " → "• "
        .replace(/^\s*[\*\-]\s+/gm, "• ")

        // Fix spacing
        .replace(/\n{3,}/g, "\n\n")

        .trim();
}

/* -----------------------------------------------------------
   HELPER: Make Gemini text request
----------------------------------------------------------- */
async function generateText(prompt, model = "gemini-2.5-flash") {
    try {
        const body = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
        };

        const res = await gemini.post(`models/${model}:generateContent`, body);

        return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (err) {
        console.error("Gemini API Error:", err.response?.data || err);
        throw new Error("Gemini request failed");
    }
}

/* -----------------------------------------------------------
   LOAD PRODUCT DATA FOR STORE-RESTRICTED AI
----------------------------------------------------------- */
async function loadStoreData() {
    const [products] = await pool.query("SELECT * FROM products");
    const [categories] = await pool.query("SELECT * FROM categories");

    return { products, categories };
}

/* -----------------------------------------------------------
   1️⃣ AI CHAT — Store-restricted
----------------------------------------------------------- */
router.post("/chat", async (req, res) => {
    try {
        const { message, history = [], username = "" } = req.body;
        const { products, categories } = await loadStoreData();

        const prompt = `
You are ShopNest AI, a smart shopping assistant.
You MUST answer ONLY using the product & category data below.
If username is given, address the user by name.
Username: "${username}"

------------------------
PRODUCTS:
${JSON.stringify(products, null, 2)}

CATEGORIES:
${JSON.stringify(categories, null, 2)}
------------------------

STRICT RULES:
- DO NOT use global or online knowledge.
- Talk with user if username is provided else use customer
- If the user asks something unrelated to ShopNest products, reply:
  "I can only answer based on ShopNest products and categories."
- Always prefer store data: prices, categories, descriptions, features.
- Suggest products ONLY from the list provided.
- For comparisons: compare only actual product attributes from database.
- If unsure, say: "This information is not available in ShopNest catalog.
- if user greets or talks introduce yourself as ShopNest Ai"

Chat History:
${JSON.stringify(history, null, 2)}

User Message:
${message}
`;

        let reply = await generateText(prompt);

        reply = cleanMarkdown(reply);

        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: "AI chat failed" });
    }
});

/* -----------------------------------------------------------
   2️⃣ AI SEARCH (Store-restricted)
----------------------------------------------------------- */
router.post("/search", async (req, res) => {
    try {
        const { query, products } = req.body;

        const prompt = `
You are an AI filter for ShopNest.  
You must search ONLY inside this product list:

${JSON.stringify(products)}

User search: "${query}"

STRICT OUTPUT RULES:
- Return ONLY JSON.
- Format: [1, 2, 3]
- No text, no explanation, no markdown.
- IDs must exist in the product list.
- If no matches, return [].
`;

        let text = await generateText(prompt);

        text = text.trim();
        text = text.replace(/```json/gi, "");
        text = text.replace(/```/g, "");
        text = text.replace(/[\n\r]/g, "");

        let ids = [];

        try {
            const parsed = JSON.parse(text);

            if (Array.isArray(parsed)) {
                ids = parsed
                    .map(Number)
                    .filter((id) => products.some((p) => p.id === id));
            }
        } catch (e) {
            console.log("AI Search Parse Fail:", text);
        }

        return res.json({ ids });
    } catch (err) {
        console.error("AI Search Error:", err);
        return res.json({ ids: [] });
    }
});

/* -----------------------------------------------------------
   3️⃣ AI SORT (Store-restricted)
----------------------------------------------------------- */
router.post("/sort", async (req, res) => {
    try {
        const { products, criteria } = req.body;

        const prompt = `
Sort ONLY these products:

${JSON.stringify(products)}

Sorting criteria: "${criteria}"

Rules:
- DO NOT use outside knowledge.
- Use only product fields: price, description, name, etc.
- Return ONLY a JSON array of product IDs sorted according to the criteria.
`;

        const text = await generateText(prompt);

        let ids = [];
        try {
            ids = JSON.parse(text);
        } catch { }

        res.json({ ids });
    } catch {
        res.json({ ids: [] });
    }
});

/* -----------------------------------------------------------
   4️⃣ AI TAG GENERATION (Store-restricted)
----------------------------------------------------------- */
router.post("/tags", async (req, res) => {
    try {
        const { name, description } = req.body;

        const prompt = `
Generate exactly 5 SEO tags ONLY using this product's actual info.
NO external knowledge allowed.

Name: ${name}
Description: ${description}

Return ONLY a JSON array of 5 short tags.
`;

        const text = await generateText(prompt);

        let tags = [];
        try {
            tags = JSON.parse(text);
        } catch { }

        res.json({ tags });
    } catch {
        res.json({ tags: [] });
    }
});

/* -----------------------------------------------------------
   5️⃣ AI DESCRIPTION (Store-restricted)
----------------------------------------------------------- */
router.post("/describe", async (req, res) => {
    try {
        const { name, baseDescription } = req.body;

        const prompt = `
Rewrite this product description using ONLY the info provided.
Do NOT invent any new features.

Product: ${name}

Original description:
${baseDescription}

Write a clean 2–3 sentence professional description using ONLY this data.
`;

        const description = await generateText(prompt);

        res.json({ description });
    } catch {
        res.json({ description: "" });
    }
});

export default router;
