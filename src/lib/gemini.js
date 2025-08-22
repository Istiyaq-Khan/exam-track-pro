import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getMotivationalQuote() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "Give me a short, motivational quote (2-3 lines) for SSC students preparing for exams. Make it inspiring and practical.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error fetching motivational quote:', error);
    return "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill";
  }
}

export async function getMotivationalAdvice(problem) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `A student has shared this problem: "${problem}". Please provide motivational advice and practical tips on how to pass SSC exams and live a better life. Keep it encouraging and actionable (3-4 sentences).`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error fetching motivational advice:', error);
    return "Remember, every challenge is an opportunity to grow. Stay focused on your goals, maintain a positive mindset, and believe in your ability to succeed. You've got this!";
  }
} 