import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const gemini = axios.create({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/",
    params: { key: GEMINI_API_KEY }
});

export async function generateText(model, prompt) {
    const body = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    const res = await gemini.post(`models/${model}:generateContent`, body);
    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
