import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { questions } from "@/questions/questions";

const model = google("gemini-2.5-flash");

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

🚗 **Want to pass your driving theory test on the first try?**  
Get full access to over **2,000 official-style questions** for just **99 kr**.  
You'll cover every topic and learn from detailed explanations—just like the one above.

👉 [**Unlock Full Access Now – Only 99 kr**](/?showSignuppop=true)

You've got this — let's get you on the road! 🛣️✨`;

// Keep quiz state in a module-level variable, but ensure we properly track
// what's happening with it
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
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
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

      const response = await streamText({
        model,
        system: systemMessage,
        messages: [{ role: "user", content: prompt }],
      });

      const streamResponse = response.toDataStreamResponse();
      console.log("Responding with first question");

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
        feedbackPrompt += `
The quiz is complete. Provide the final score in Markdown: **Score**: ${quizState.score} out of ${questions.length}.`;

        // Reset quiz state after the final question
        console.log(
          `🏁 Quiz complete: Score ${quizState.score}/${questions.length}`
        );
      }

      quizState.currentQuestion += 1;
    } else {
      feedbackPrompt = `The quiz is complete. Provide the final score in Markdown: **Score**: ${quizState.score} out of ${questions.length}.`;
      console.log("🏁 Quiz already complete - showing final score");
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

    // If this was the final question, reset the quiz state after sending response
    if (isLastQuestion || quizState.currentQuestion >= questions.length) {
      setTimeout(() => {
        quizState = { currentQuestion: 0, score: 0, answerHistory: [] };
        console.log("🔄 Quiz state reset after completion");
      }, 100);
    }

    return new NextResponse(streamResponse.body, {
      headers: streamResponse.headers,
      status: streamResponse.status,
    });
  } catch (error) {
    console.error("❌ Error in POST:", error);
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}, message: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    } else {
      console.error(`Unknown error type:`, error);
    }
    return NextResponse.json(
      { error: "Something went wrong", details: String(error) },
      { status: 500 }
    );
  }
}
