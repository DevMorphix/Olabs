import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const getGeminiAPI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key is missing. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Generate chapter questions with Gemini AI
 */
export async function generateChapterQuestions(content: string, description?: string): Promise<{ question: string; answer: string; revealed: boolean; }[]> {
  const genAI = getGeminiAPI();
  if (!genAI) throw new Error("Gemini API not initialized");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    Based on the following chapter content and description, generate 4 meaningful questions and their detailed answers:
    
    ${description ? `CHAPTER DESCRIPTION: ${description}\n\n` : ''}
    CHAPTER CONTENT: ${content.substring(0, 10000)}
    
    Format your response EXACTLY as a JSON array with objects containing 'question' and 'answer' properties:
    [
      {"question": "Question 1", "answer": "Answer to question 1"},
      {"question": "Question 2", "answer": "Answer to question 2"},
      ...
    ]
    
    Make sure the questions cover:
    - Main concepts
    - Connections to prior knowledge
    - Practical applications
    - Critical insights
    
    DO NOT include any text before or after the JSON array. Return ONLY the properly formatted JSON array.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    const jsonStart = responseText.indexOf('[');
    const jsonEnd = responseText.lastIndexOf(']') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error("Failed to parse Gemini response as JSON", responseText);
      throw new Error("Invalid response format from Gemini");
    }
    
    const jsonText = responseText.substring(jsonStart, jsonEnd);
    const questions = JSON.parse(jsonText);
    
    // Add revealed property to each question
    return questions.map((q: any) => ({
      question: q.question,
      answer: q.answer,
      revealed: false
    }));
  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    throw error;
  }
}

/**
 * Generate chapter references with Gemini AI
 */
export async function generateChapterReferences(content: string, description?: string): Promise<{ title: string; description: string; url: string; }[]> {
  const genAI = getGeminiAPI();
  if (!genAI) throw new Error("Gemini API not initialized");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    Based on the following chapter content and description, suggest 4 relevant academic resources or references that would complement this material:
    
    ${description ? `CHAPTER DESCRIPTION: ${description}\n\n` : ''}
    CHAPTER CONTENT: ${content.substring(0, 10000)}
    
    Format your response EXACTLY as a JSON array with objects containing 'title', 'description', and 'url' properties:
    [
      {"title": "Resource title", "description": "Brief description of the resource and its relevance", "url": "https://example.com/resource"},
      {"title": "Resource title", "description": "Brief description of the resource and its relevance", "url": "https://example.com/resource"},
      ...
    ]
    
    Include a mix of:
    - Textbooks
    - Academic articles
    - Online courses
    - Video lectures
    
    For URLs, create plausible links to reputable sites like university domains, established publishers, or educational platforms.
    DO NOT include any text before or after the JSON array. Return ONLY the properly formatted JSON array.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    const jsonStart = responseText.indexOf('[');
    const jsonEnd = responseText.lastIndexOf(']') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error("Failed to parse Gemini response as JSON", responseText);
      throw new Error("Invalid response format from Gemini");
    }
    
    const jsonText = responseText.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating references with Gemini:", error);
    throw error;
  }
}

/**
 * Generate chapter evaluation questions with Gemini AI
 */
export async function generateChapterEvaluation(content: string, description?: string): Promise<{ question: string; options: string[]; correctAnswer: number; explanation: string; selected: number | null; }[]> {
  const genAI = getGeminiAPI();
  if (!genAI) throw new Error("Gemini API not initialized");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    Based on the following chapter content and description, create 3 multiple-choice questions to evaluate understanding:
    
    ${description ? `CHAPTER DESCRIPTION: ${description}\n\n` : ''}
    CHAPTER CONTENT: ${content.substring(0, 10000)}
    
    Format your response EXACTLY as a JSON array with objects containing 'question', 'options' (array of 4 strings), 'correctAnswer' (index 0-3), and 'explanation' properties:
    [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 2,
        "explanation": "Explanation of why the correct answer is right"
      },
      ...
    ]
    
    Make sure:
    - Questions test conceptual understanding, not just memorization
    - Options are plausible but only one is clearly correct
    - The explanation clarifies why the correct answer is right and others are wrong
    
    DO NOT include any text before or after the JSON array. Return ONLY the properly formatted JSON array.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    const jsonStart = responseText.indexOf('[');
    const jsonEnd = responseText.lastIndexOf(']') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error("Failed to parse Gemini response as JSON", responseText);
      throw new Error("Invalid response format from Gemini");
    }
    
    const jsonText = responseText.substring(jsonStart, jsonEnd);
    const questions = JSON.parse(jsonText);
    
    // Add selected property to each question
    return questions.map((q: any) => ({
      ...q,
      selected: null
    }));
  } catch (error) {
    console.error("Error generating evaluation with Gemini:", error);
    throw error;
  }
}

/**
 * Ask a question about chapter content with Gemini AI
 */
export async function askQuestionAboutChapter(content: string, question: string, description?: string): Promise<string> {
  const genAI = getGeminiAPI();
  if (!genAI) throw new Error("Gemini API not initialized");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    You're assisting a student who has asked a question about a chapter they're studying.
    
    ${description ? `Chapter description: ${description}\n\n` : ''}
    Chapter content (excerpt):
    ${content.substring(0, 10000)}
    
    Student's question:
    ${question}
    
    Answer the student's question specifically and concisely based on the chapter content.
    If the answer isn't directly in the content, say so but provide the most relevant information.
    Use clear, educational language and highlight key concepts.
    Limit your answer to 3-4 paragraphs maximum.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error asking question with Gemini:", error);
    throw error;
  }
}
