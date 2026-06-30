"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "annapurna";
  text: string;
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "annapurna",
  text: "Welcome to SUSTAIN. I am Annapurna, your guide to food rescue. Ask me about donating surplus food, claiming dispatches as an NGO, or the global food crisis.",
};

function generateResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("donate") || q.includes("surplus") || q.includes("organizer") || q.includes("give")) {
    return "To donate surplus food, register as an Event Organizer through the Access Portal. Then navigate to the Dashboard to log your donation with title, quantity, and precise pickup coordinates (latitude and longitude).";
  }
  if (q.includes("claim") || q.includes("ngo") || q.includes("receive") || q.includes("collect")) {
    return "NGOs can browse all available dispatches on the Dashboard. Switch to 'NGO View' to see live listings. Click 'Claim Dispatch' on any available entry to coordinate pickup with the organizer.";
  }
  if (q.includes("crisis") || q.includes("waste") || q.includes("hunger") || q.includes("statistic")) {
    return "Over 1.3 billion tons of food is wasted annually while 828 million people face chronic hunger. If food waste were a country, it would be the third-largest greenhouse gas emitter. Visit /the-crisis for the full narrative.";
  }
  if (q.includes("globe") || q.includes("map") || q.includes("solution")) {
    return "The interactive 3D globe on /the-solution visualizes active food rescue missions worldwide. Each glowing pin represents a coordination point between organizers and NGOs.";
  }
  if (q.includes("vedant") || q.includes("founder") || q.includes("creator") || q.includes("who")) {
    return "SUSTAIN was founded by Vedant Sonare with a singular mission: to bridge the delta between food waste and community nourishment through premium digital infrastructure.";
  }
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return "Hello. I am Annapurna, named after the goddess of nourishment. How can I help you contribute to the food rescue mission today?";
  }

  return "Thank you for reaching out. I can help you with donating surplus food, claiming dispatches as an NGO, understanding the food waste crisis, or navigating the SUSTAIN platform. What would you like to know?";
}

export default function AnnapurnaChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const query = input;
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "annapurna", text: generateResponse(query) },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="w-[340px] h-[460px] glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl mb-4 bg-forest/95"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-beige/15 flex items-center justify-between bg-forest-deep/60">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-beige animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-beige">
                  Annapurna
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="text-beige/50 hover:text-beige transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] rounded-xl px-4 py-3 text-[13px] leading-relaxed ${
                      m.role === "user"
                        ? "bg-beige text-forest font-medium"
                        : "bg-beige/[0.06] border border-beige/10 text-beige/90"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="px-3 py-3 border-t border-beige/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Annapurna..."
                className="flex-1 bg-beige/[0.04] border border-beige/15 rounded-lg px-3.5 py-2.5 text-[13px] text-beige placeholder:text-beige/30 focus:outline-none focus:border-beige/40 transition-colors"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-lg bg-beige text-forest flex items-center justify-center hover:bg-beige-dim transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-beige text-forest flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
