"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi there! I'm here to help you practice for your Danish driving theory test. Whenever you're ready, just type 'Start' and we'll begin. Good luck!",
      },
    ]);
    setTimeout(scrollToBottom, 0);
  }, []);

  useEffect(() => {
    if (isUserNearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messageAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageAreaRef.current;
      const bottomThreshold = 100;
      setIsUserNearBottom(
        scrollHeight - (scrollTop + clientHeight) < bottomThreshold
      );
    }
  };

  const formatResponse = (text: string) => {
    let formattedText = text.replace(/\*\*/g, "");

    // Format images first - handle both markdown and custom formats
    formattedText = formattedText.replace(
      /!\[([^\]]*)\](?:\((.*?)\)|$$(.*?)$$)/g,
      '<div class="image-wrapper"><img src="$2$3" alt="$1" class="rounded-lg shadow-md my-4 max-w-full h-auto" /></div>'
    );

    // Format options
    formattedText = formattedText.replace(
      /Options:([\s\S]*?)(?=\n\n|$)/,
      (match, p1) => {
        const options = p1
          .trim()
          .split("\n")
          .filter((option: string) => option.trim() !== "")
          .map((option: string, index: number) => {
            const letter = String.fromCharCode(65 + index);
            return `${letter}) ${option.trim().replace(/^[A-Z]\)\s*/, "")}`;
          })
          .join("\n");
        return `Options:\n${options}`;
      }
    );

    // Clean up extra option letters and instructions
    formattedText = formattedText.replace(/[E-Z]\).*\n?/g, "");
    formattedText = formattedText.replace(
      /Please select the correct answer (?:\$\$)?A, B,( or)? C(?:\$\$)?\.?/g,
      ""
    );

    // Convert newlines to <br> tags last
    formattedText = formattedText.replace(/\n/g, "<br>");

    return formattedText;
  };

  const sendMessageToLangbase = async (messages: Message[]) => {
    const apiUrl = "https://api.langbase.com/beta/pipes/run";
    const apiKey = `Bearer pipe_48BNbNX9NVqkSTSWozAbQqhR4W8cxVHwwKerKDTP4v31XpDeGerAjdHjPw92FhTqhYpMigqE3gwNvX2QxRu2t4Gj`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ messages }),
      });

      const result = await response.json();
      console.log("Result:", result);
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const result = await sendMessageToLangbase([...messages, userMessage]);
      const formattedResponse = formatResponse(result.completion);
      const assistantMessage: Message = {
        role: "assistant",
        content: formattedResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Theory Test Prep</h1>
          <nav>
            <ul className="flex space-x-4 sm:space-x-6">
              <li>
                <a href="/" className="hover:text-blue-200">
                  Home
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        ref={messageAreaRef}
        onScroll={handleScroll}
        className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col-reverse"
      >
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 max-w-[85%] p-3 rounded-lg bg-gray-200">
              <div
                className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                style={{ animationDelay: "-0.32s" }}
              />
              <div
                className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                style={{ animationDelay: "-0.16s" }}
              />
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        {messages
          .slice()
          .reverse()
          .map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 ml-2"
                      : "bg-gray-600 mr-2"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    "AI"
                  )}
                </div>
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: message.content }}
                    className="w-full overflow-hidden"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>

      <footer className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
