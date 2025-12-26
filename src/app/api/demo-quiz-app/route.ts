import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { questions } from "@/questions/questions";

const model = google("gemini-2.5-flash-lite");

// ✅ Define CORS headers
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*", // ❗ change this in production to your app domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ Utility to add CORS headers to any response
function withCORS(response: NextResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// ✅ Handle preflight OPTIONS requests
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 200 }));
}

const systemMessage = `You are an English driving theory test instructor. Use the provided questions, images, options, and correct answers exactly as given.

Your role:
Use Markdown formatting throughout.

After each user answer:
If correct: provide brief, encouraging feedback 🎉
If incorrect: provide supportive feedback 💡 and explain why the correct answer is right ✅

If the quiz is not yet complete, present the next question using this format:

**Question**: [question text]  
![Question Image]([image URL])  
- A) [option 1]  
- B) [option 2]  
- C) [option 3]  
- D) [option 4]  

When the quiz is complete, show:  
✅: **Quiz Complete!**  
You've reached the end of this demo session.  

**Score**: [X] out of 6  

📈 **Nice try—this is a great start!**  
Most learners don't ace it on the first go. With the right prep and repetition, your score will improve. Keep going! 💪
 Do not add anything after the options like "Please choose A, B, C, or D." etc
`;

let quizState = {
  currentQuestion: 0,
  score: 0,
  answerHistory: [] as string[],
};

// Helper to format options
function formatOptions(options: string[]) {
  const labels = ["A", "B", "C", "D"];
  return options.map((opt, idx) => `- ${labels[idx]}) ${opt}`).join("\n");
}

// Helper to convert option letter to actual answer text
function getAnswerTextFromLetter(letter: string, options: string[]): string {
  const normalizedLetter = letter.trim().toUpperCase();
  const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  const index = letterMap[normalizedLetter];
  return index !== undefined && index < options.length ? options[index] : "";
}

export async function POST(req: NextRequest) {
  // ✅ Handle preflight manually (just in case)
  if (req.method === "OPTIONS") {
    return withCORS(new NextResponse(null, { status: 200 }));
  }

  try {
    const body = await req.json();
    const { messages } = body;
    console.log("Received messages:", messages);

    if (!messages || !Array.isArray(messages)) {
      return withCORS(
        NextResponse.json({ error: "Invalid request format" }, { status: 400 })
      );
    }

    // Start or reset quiz
    if (
      messages.length === 1 ||
      messages[messages.length - 1].content.toLowerCase() === "start"
    ) {
      quizState = { currentQuestion: 0, score: 0, answerHistory: [] };
      const firstQuestion = questions[0];

      const prompt = `Start the quiz with this question:
**Question**: ${firstQuestion.question}
![Question Image](${firstQuestion.image})
${formatOptions(firstQuestion.options)}`;

      const result = await generateText({
        model,
        system: systemMessage,
        messages: [{ role: "user", content: prompt }],
      });

      const responseToSent = result.text;
      console.log("Starting new quiz");

      return withCORS(NextResponse.json(responseToSent, { status: 200 }));
    }

    // Process user answer
    const lastMessage = messages[messages.length - 1];
    const selectedOption = lastMessage.content.trim();

    let feedbackPrompt = "";
    let isLastQuestion = false;

    if (quizState.currentQuestion < questions.length) {
      const currentQuestion = questions[quizState.currentQuestion];

      // Get the text of the selected option based on the letter
      const selectedAnswerText = getAnswerTextFromLetter(
        selectedOption,
        currentQuestion.options
      );
      const isCorrect = selectedAnswerText === currentQuestion.correctAnswer;

      if (isCorrect) quizState.score += 1;
      quizState.answerHistory.push(selectedOption);

      console.log(
        `Question ${
          quizState.currentQuestion + 1
        }: User chose ${selectedOption} (${selectedAnswerText}), correct was ${
          currentQuestion.correctAnswer
        }, isCorrect: ${isCorrect}`
      );

      feedbackPrompt = `The user answered "${selectedOption}" to:
**Question**: ${currentQuestion.question}
Correct answer: ${currentQuestion.correctAnswer}
Provide feedback in Markdown.`;

      isLastQuestion = quizState.currentQuestion >= questions.length - 1;
      if (!isLastQuestion) {
        const nextQuestion = questions[quizState.currentQuestion + 1];
        feedbackPrompt += `
Then present the next question in Markdown:
**Question**: ${nextQuestion.question}
![Question Image](${nextQuestion.image})
${formatOptions(nextQuestion.options)}`;
        console.log(
          `🔜 Preparing next question ${quizState.currentQuestion + 1}`
        );
      } else {
        // For the final question, explicitly include the updated score
        const finalScore = quizState.score;
        feedbackPrompt += `
The quiz is complete. Provide the final score in Markdown: **Score**: ${finalScore} out of ${questions.length}.`;
        console.log(
          `🏁 Quiz complete: Score ${finalScore}/${questions.length}`
        );
      }

      quizState.currentQuestion += 1;
    } else {
      // If we're already past the questions length, use the stored score
      feedbackPrompt = `The quiz is complete. Provide the final score in Markdown: **Score**: ${quizState.score} out of ${questions.length}.`;
      console.log("🏁 Quiz already complete - showing final score");
    }

    const result = await generateText({
      model,
      system: systemMessage,
      messages: [
        ...messages.slice(0, -1),
        { role: "user", content: feedbackPrompt },
      ],
    });
    console.log("Current quiz state:", quizState);

    const responseToSent = result.text;

    // Only reset the quiz state after sending the response and only if the quiz is complete
    if (isLastQuestion || quizState.currentQuestion >= questions.length) {
      // Reset after response is sent
      setTimeout(() => {
        quizState = { currentQuestion: 0, score: 0, answerHistory: [] };
        console.log("🔄 Quiz state reset after completion");
      }, 100);
    }

    return withCORS(NextResponse.json(responseToSent, { status: 200 }));
  } catch (error) {
    console.error("❌ Error in POST:", error);
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}, message: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    }

    return withCORS(
      NextResponse.json(
        { error: "Something went wrong", details: String(error) },
        { status: 500 }
      )
    );
  }
}
