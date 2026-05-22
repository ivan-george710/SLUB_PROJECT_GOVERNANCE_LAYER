'use client';

import { useChatStore } from "@/store/useChatStore";
import { ChatLanding } from "@/components/chat/chat-landing";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { messages, isTyping } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const showLanding = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-[#0b1120] relative">
      
      {/* Scrollable Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scroll-smooth pb-24" // padding bottom for fixed input
      >
        {showLanding ? (
          <ChatLanding />
        ) : (
          <div className="max-w-4xl mx-auto pt-10 pb-10">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <div className="flex justify-start mb-6 px-6">
                <div className="bg-[#1e293b] border border-slate-700/50 p-4 rounded-xl shadow-md flex items-center gap-3">
                  <Loader2 size={16} className="text-cyan-400 animate-spin" />
                  <span className="text-sm text-slate-400">Processing query...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="absolute bottom-0 w-full">
        {/* Gradient overlay to make scrolling text fade out smoothly at the bottom */}
        <div className="h-12 bg-gradient-to-t from-[#0b1120] to-transparent w-full pointer-events-none"></div>
        <ChatInput />
      </div>

    </div>
  );
}
