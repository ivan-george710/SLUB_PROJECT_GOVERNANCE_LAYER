'use client';

import { Send } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "@/store/useChatStore";

export function ChatInput() {
  const [input, setInput] = useState("");
  const { isTyping, processUserQuery } = useChatStore();

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    
    const query = input.trim();
    setInput("");
    
    // Defer to the store for all logic
    processUserQuery(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-[#0b1120] p-4 shrink-0 flex justify-center">
      <div className="relative w-full max-w-4xl flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SULB Insights AI..."
          disabled={isTyping}
          className="w-full bg-[#1e293b]/80 backdrop-blur-md border border-slate-700/50 rounded-xl py-4 pl-5 pr-16 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all duration-300 disabled:opacity-50"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(2,132,199,0.4)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed group"
        >
          <Send size={18} className="group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
