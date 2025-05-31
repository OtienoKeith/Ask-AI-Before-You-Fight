
import OpenAI from "openai";

// Initialize OpenAI with your API key
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Create a more graceful error message for missing API key
const getErrorMessage = () => {
  return {
    title: "API Key Missing",
    message: "Please add your OpenAI API key to continue.",
    instructions: [
      "1. Go to Secrets (🔒) in the left sidebar",
      "2. Add a new secret: NEXT_PUBLIC_OPENAI_API_KEY",
      "3. Get your API key from: https://platform.openai.com/api-keys",
      "4. Click the Run button to restart the app"
    ].join("\n")
  };
};

// Initialize the OpenAI client with a fallback for development
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
}) : null;

export async function generateAIResponse(userInput: string): Promise<string> {
  try {
    if (!apiKey || !openai) {
      const error = getErrorMessage();
      console.error(error.title, "\n", error.message, "\n", error.instructions);
      return `⚠️ ${error.title}\n\n${error.message}\n\n${error.instructions}`;
    }

    const prompt = `You are a witty AI that gives savage but playful roasts in response to people's complaints or 'beef'. Use Bronx slang and keep it entertaining but not truly mean. Limit responses to 2-3 sentences.

User's complaint: "${userInput}"`;

    console.log("Sending request to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a witty AI that gives savage but playful roasts in response to people's complaints or 'beef'. Use Bronx slang and keep it entertaining but not truly mean. Limit responses to 2-3 sentences."
        },
        {
          role: "user",
          content: userInput
        }
      ],
      max_tokens: 150,
      temperature: 0.9
    });

    const text = response.choices[0]?.message?.content || "Sorry, I couldn't think of a good roast right now!";
    console.log("Received response from OpenAI");

    return text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("unauthorized")) {
        const errorInfo = getErrorMessage();
        return `⚠️ ${errorInfo.title}\n\n${errorInfo.message}\n\n${errorInfo.instructions}`;
      }
      return `Sorry, I couldn't process that right now: ${error.message}`;
    }
    return "Sorry, I couldn't process that right now. Try again?";
  }
}
