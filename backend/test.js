import { GoogleGenerativeAI } from "@google/generative-ai";


const gen = new GoogleGenerativeAI();

async function test() {
    const model = gen.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log(result.response.text());
}

test();