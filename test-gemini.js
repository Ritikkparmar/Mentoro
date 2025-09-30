// test-gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAgg1qDroNZsyDDm9l8h9yJBQvaRaeT1Xo"; // replace with env var in real app
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


async function test() {
  try {
    const result = await model.generateContent("Say hello!");
    console.log(result.response.text());
  } catch (e) {
    console.error("Gemini API error:", e);
  }
}

test();
