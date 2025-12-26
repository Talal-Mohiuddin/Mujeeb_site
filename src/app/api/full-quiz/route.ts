import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { Allquestions as questions } from "@/questions/Allquestions";

const model = google("gemini-2.5-flash");
const QUIZ_LENGTH = 25;

const systemMessage = `You are an English driving theory test instructor. Use the provided questions, images, options, and correct answers exactly as given. Your role is to:
1. Provide brief, encouraging feedback on each answer (correct or incorrect) in Markdown.
2. If the answer is wrong, briefly explain why the correct answer is right.
3. If the quiz is not complete, present the next question with its image and options in this Markdown format:
   **Question**: [question text]
   ![Question Image]([image URL])
   - A) [option 1]
   - B) [option 2]
   - C) [option 3]
   - D) [option 4]
4. When the quiz is complete after ${QUIZ_LENGTH} questions, provide a final score summary in Markdown and instruct the user to enter "start" to restart the quiz.
5. Keep responses concise and supportive, maintaining an educational tone.
6. Do not generate new questions or deviate from the provided questions.`;

// Helper to shuffle array and select unique items
function getRandomQuestions(allQuestions: typeof questions, count: number) {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Helper to format options dynamically
function formatOptions(options: string[]) {
  const labels = ["A", "B", "C", "D"];
  return options.map((opt, idx) => `- ${labels[idx]}) ${opt}`).join("\n");
}

// Helper to convert option letter to answer index (A→0, B→1, etc.)
function getAnswerIndexFromLetter(letter: string): number {
  const normalizedLetter = letter.trim().toUpperCase();
  const letterMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  return letterMap[normalizedLetter] ?? -1;
}

// Helper to convert option letter to actual answer text
function getAnswerTextFromLetter(letter: string, options: string[]): string {
  const normalizedLetter = letter.trim().toUpperCase();
  const letterMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  const index = letterMap[normalizedLetter];
  return index !== undefined && index < options.length ? options[index] : "";
}

interface QuizState {
  currentQuestion: number;
  score: number;
  answerHistory: string[];
  selectedQuestions: typeof questions;
}

let quizState: QuizState = {
  currentQuestion: 0,
  score: 0,
  answerHistory: [],
  selectedQuestions: [],
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Handle initial start or reset
    if (
      messages.length === 1 ||
      messages[messages.length - 1].content.toLowerCase() === "start"
    ) {
      quizState = {
        currentQuestion: 0,
        score: 0,
        answerHistory: [],
        selectedQuestions: getRandomQuestions(questions, QUIZ_LENGTH),
      };
      const firstQuestion = quizState.selectedQuestions[0];
      const prompt = `Start the quiz with this question:
**Question**: ${firstQuestion.question}
![Question Image](${firstQuestion.image})
${formatOptions(firstQuestion.options)}`;

      const response = await streamText({
        model,
        system: systemMessage,
        messages: [{ role: "user", content: prompt }],
      });

      const streamResponse = response.toDataStreamResponse();
      return new NextResponse(streamResponse.body, {
        headers: streamResponse.headers,
        status: streamResponse.status,
      });
    }

    // Process user answer
    const lastMessage = messages[messages.length - 1];
    const selectedOption = lastMessage.content.trim();
    let feedbackPrompt = "";
    let isLastQuestion = false;

    if (quizState.currentQuestion < quizState.selectedQuestions.length) {
      const currentQuestion = quizState.selectedQuestions[quizState.currentQuestion];
      
      // Get the text of the selected option based on the letter
      const selectedAnswerText = getAnswerTextFromLetter(selectedOption, currentQuestion.options);
      const isCorrect = selectedAnswerText === currentQuestion.correctAnswer;

      if (isCorrect) {
        quizState.score += 1;
      }
      quizState.answerHistory.push(selectedOption);
      
      console.log(`Question ${quizState.currentQuestion + 1}: User chose ${selectedOption} (${selectedAnswerText}), correct was ${currentQuestion.correctAnswer}, isCorrect: ${isCorrect}`);

      feedbackPrompt = `The user answered "${selectedOption}" to:
**Question**: ${currentQuestion.question}
Correct answer: ${currentQuestion.correctAnswer}
Provide feedback in Markdown.`;

      // Check if this was the last question
      isLastQuestion = quizState.currentQuestion >= quizState.selectedQuestions.length - 1;
      if (!isLastQuestion) {
        const nextQuestion = quizState.selectedQuestions[quizState.currentQuestion + 1];
        feedbackPrompt += `
Then present the next question in Markdown:
**Question**: ${nextQuestion.question}
![Question Image](${nextQuestion.image})
${formatOptions(nextQuestion.options)}`;
      } else {
        feedbackPrompt += `
The quiz is complete. Provide the final score in Markdown: **Score**: ${quizState.score} out of ${QUIZ_LENGTH}. Then, instruct the user to enter "start" to restart the quiz.`;
      }

      quizState.currentQuestion += 1;
    } else {
      feedbackPrompt = `
The quiz is complete. Provide the final score in Markdown: **Score**: ${quizState.score} out of ${QUIZ_LENGTH}. Then, instruct the user to enter "start" to restart the quiz.`;
    }

    const response = await streamText({
      model,
      system: systemMessage,
      messages: [
        ...messages.slice(0, -1),
        { role: "user", content: feedbackPrompt },
      ],
    });

    const streamResponse = response.toDataStreamResponse();
    return new NextResponse(streamResponse.body, {
      headers: streamResponse.headers,
      status: streamResponse.status,
    });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status:500 });
  }
}
