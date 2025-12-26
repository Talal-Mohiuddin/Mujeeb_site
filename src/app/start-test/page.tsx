"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuthStore from "@/context/useAuthStore";
import { ChevronRight, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import RouteProtection from "@/components/RouteProtection";
import { useChat } from "@ai-sdk/react";

interface Message {
  id: string;
  role: "user" | "system" | "assistant" | "data";
  content: string;
}

function ChatInterface() {
  const [isLoading, setIsLoading] = useState(false);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleSubmit,
    handleInputChange,
    isLoading: chatIsLoading,
  } = useChat({
    api: "/api/full-quiz",
  });

  // Auto-start quiz when component mounts
  useEffect(() => {
    if (!hasStarted) {
      startNewQuiz();
    }
  }, [hasStarted]);

  const startNewQuiz = async () => {
    setMessages([]);
    setInput("start");
    setHasStarted(true);

    // Simulate form submission to start the quiz
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;

    setTimeout(() => {
      handleSubmit(syntheticEvent);
      setInput("");
    }, 100);
  };

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

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatIsLoading) return;

    handleSubmit(e);
  };

  // Helper function to extract content as string
  const getMessageContent = (message: any): string => {
    if (typeof message.content === "string") {
      return message.content;
    }
    if (message.content && typeof message.content === "object") {
      // Handle structured content - extract text from parts or other properties
      return JSON.stringify(message.content);
    }
    return "";
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            <h1>Theory Test Prep</h1>
          </Link>
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
        {/* Show default message if no messages yet */}
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full mt-3 flex items-center justify-center text-white font-bold text-sm bg-gray-600 mr-2">
              AI
            </div>
            <div className="md:max-w-[65%] max-w-[85%] p-3 rounded-lg my-3 bg-gray-200 text-gray-800">
              Please type <span className="font-semibold">start</span> to begin
              the test.
            </div>
          </div>
        )}
        {chatIsLoading && (
          <div className="flex justify-start">
            <div
              className={`w-8 h-8 rounded-full  flex items-center justify-center text-white font-bold text-sm bg-gray-600 mr-2`}
            >
              AI
            </div>
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
          </div>
        )}
        {messages
          .slice()
          .reverse()
          .map((message, index) => (
            <div
              key={message.id || index}
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
                  className={`w-8 h-8 rounded-full mt-3 flex items-center justify-center text-white font-bold text-sm ${
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
                  className={`md:max-w-[65%] max-w-[85%] p-3 rounded-lg my-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div className="w-full overflow-hidden">
                    {message.role === "user" ? (
                      // Plain text for user messages to preserve white color
                      getMessageContent(message)
                    ) : (
                      // ReactMarkdown with custom styling for assistant messages
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              className="text-blue-600 hover:text-blue-800 underline font-medium"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                          ul: ({ children }) => (
                            <div className="space-y-3 mt-4">{children}</div>
                          ),
                          li: ({ children }) => {
                            const content = children?.toString() || '';
                            // Check if this is a quiz option (starts with A), B), C), or D))
                            if (content.match(/^[A-D]\)/)) {
                              return (
                                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                      {content.charAt(0)}
                                    </div>
                                    <span className="text-gray-800 font-medium">
                                      {content.substring(3)}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                            // Regular list item for non-quiz content
                            return <li className="list-disc ml-6">{children}</li>;
                          },
                          img: ({ src, alt }) => (
                            <div className="my-4">
                              <img 
                                src={src} 
                                alt={alt || "Question image"} 
                                className="max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                              />
                            </div>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg font-bold text-gray-800 mb-3">
                              {children}
                            </h2>
                          ),
                          p: ({ children }) => (
                            <p className="text-gray-700 leading-relaxed mb-3">
                              {children}
                            </p>
                          ),
                        }}
                      >
                        {getMessageContent(message)}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <footer className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleCustomSubmit} className="flex space-x-2">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-grow"
            disabled={chatIsLoading}
          />
          <Button type="submit" disabled={chatIsLoading || !input.trim()}>
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
export default function ProtectedChatInterface() {
  return (
    <RouteProtection
      requireAuth={true}
      requireSubscription={true}
      redirectTo="/dashboard"
    >
      <ChatInterface />
    </RouteProtection>
  );
}
