"use client";
import { useState, FormEvent } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = "You are Anas's AI assistant. You help visitors learn about Anas Ahmed, a Full Stack Developer with 11+ years of experience building ERP systems, Ecommerce platforms, and AI applications. His email is anasbinsabiet@gmail.com, phone +8801793478194. He is from Dhaka, Bangladesh. You can view his projects on the portfolio site. Keep responses concise and helpful.";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Anas's AI Assistant. Ask me about his experience, projects, or how to contact him!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chatMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
        userMsg,
      ];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error fetching AI response", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 p-4 rounded-full shadow-lg hover:bg-indigo-500 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-sm bg-slate-900 border border-indigo-500/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md"
          >
            <div className="bg-indigo-600/20 p-4 border-b border-indigo-500/30">
              <h3 className="text-white font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                AI Assistant
              </h3>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 text-sm">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-200"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-slate-400 text-xs">Typing...</div>}
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-slate-700 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-800 text-white rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Ask anything..."
              />
              <button type="submit" className="bg-indigo-600 p-2 rounded-md hover:bg-indigo-500">
                <Send className="w-5 h-5 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
