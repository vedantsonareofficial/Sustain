"use client";

import { useState } from "react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! I'm Annapurna — here to help you rescue food and reach the people who need it. What would you like to do?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Mock bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `Thank you for your message! Our team is processing: "${userMsg.text}". Annapurna AI is standing by.`,
        },
      ]);
    }, 1000);
  };

  const handleQuickReply = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `Here is the information about "${text}": FoodBridge connects event organizers with nearby verified NGOs. You can manage everything via your logistics dashboard.`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 font-body">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] max-w-[calc(100vw-32px)] bg-surface rounded-3xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col transition-all duration-300">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center gap-3 text-on-primary">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center relative">
              <span className="material-symbols-outlined text-on-secondary-fixed">eco</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary-fixed-dim border-2 border-primary rounded-full"></div>
            </div>
            <div>
              <p className="font-bold leading-tight">Annapurna</p>
              <p className="text-xs opacity-75">Your food-rescue guide</p>
            </div>
            <button
              className="ml-auto opacity-75 hover:opacity-100 p-1 rounded-full hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="p-4 h-80 overflow-y-auto flex flex-col gap-4 bg-surface-container-lowest custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 max-w-[85%] ${
                  msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-body-md ${
                    msg.sender === "user"
                      ? "bg-primary text-on-primary rounded-tr-none"
                      : "bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant/20"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="p-3 border-t border-outline-variant/30 bg-surface flex flex-wrap gap-2">
            {[
              "How do I post surplus food?",
              "How does NGO verification work?",
              "Track my pickup",
            ].map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-medium hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-pointer"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-outline-variant/30 bg-surface">
            <div className="relative flex items-center">
              <input
                className="w-full pl-4 pr-12 py-3 rounded-full border border-outline-variant/40 bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-body-md"
                placeholder="Ask Annapurna anything..."
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="absolute right-2 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center hover:brightness-110 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-surface-tint shadow-xl flex items-center justify-center text-on-primary relative hover:scale-110 transition-transform active:scale-95 group cursor-pointer"
        aria-label="Open Annapurna AI assistant"
      >
        <span className="material-symbols-outlined text-[32px] group-hover:rotate-12 transition-transform">
          soup_kitchen
        </span>
        <div className="absolute top-0 right-0 w-4 h-4 bg-primary-fixed border-2 border-background rounded-full"></div>
      </button>
    </div>
  );
}
