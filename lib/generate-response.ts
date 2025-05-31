import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with your API key
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Create a more graceful error message for missing API key
const getErrorMessage = () => {
  return {
    title: "API Key Missing",
    message: "Please add your Gemini API key to continue.",
    instructions: [
      "1. Go to Secrets (🔒) in the left sidebar",
      "2. Add a new secret: NEXT_PUBLIC_GEMINI_API_KEY",
      "3. Get your API key from: https://aistudio.google.com/app/apikey",
      "4. Click the Run button to restart the app"
    ].join("\n")
  };
};

// Initialize the Gemini client with a fallback for development
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateAIResponse(userInput: string): Promise<string> {
  try {
    if (!apiKey || !genAI) {
      const error = getErrorMessage();
      console.error(error.title, "\n", error.message, "\n", error.instructions);
      return `⚠️ ${error.title}\n\n${error.message}\n\n${error.instructions}`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a witty AI that gives savage but playful roasts in response to people's complaints or 'beef'. Use Bronx slang and keep it entertaining but not truly mean. Limit responses to 2-3 sentences.

User's complaint: "${userInput}"`;

    console.log("Sending request to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Received response from Gemini");
    return text || "Sorry, I couldn't think of a good roast right now!";
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (error instanceof Error) {
      if (error.message.includes("API_KEY") || error.message.includes("401")) {
        const errorInfo = getErrorMessage();
        return `⚠️ ${errorInfo.title}\n\n${errorInfo.message}\n\n${errorInfo.instructions}`;
      }
      return `Sorry, I couldn't process that right now: ${error.message}`;
    }
    return "Sorry, I couldn't process that right now. Try again?";
  }
}