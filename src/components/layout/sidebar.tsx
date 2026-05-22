'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut, CheckSquare, MessageSquare } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function Sidebar() {
  const { chatHistory, clearChat, loadChat } = useChatStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    // Basic sign out - clear chat and redirect to login
    clearChat();
    router.push('/login');
  };

  return (
    <div className="w-[280px] h-screen bg-[#131b2f] flex flex-col border-r border-slate-800 text-slate-300">
      
      {/* Top Section: New Chat */}
      <div className="p-4 space-y-4">
        <Button 
          onClick={clearChat}
          className="w-full bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-medium py-6 h-auto rounded-lg shadow-[0_0_15px_rgba(2,132,199,0.3)] transition-all duration-300 border border-cyan-500/30"
        >
          <Plus size={18} className="mr-2" />
          New Chat
        </Button>
      </div>

      <div className="px-4">
        <Link 
          href="/dashboard/workflows"
          className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300 ${
            pathname === '/dashboard/workflows' 
              ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-800/50 shadow-inner' 
              : 'text-slate-300 hover:bg-slate-800/80 hover:border-slate-700 border border-transparent'
          }`}
        >
          <CheckSquare size={18} />
          <span className="font-medium">Approvals & Workflow</span>
        </Link>
      </div>

      {/* Middle Section: Chat History List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 mt-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        
        {/* Dynamic History */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 mb-3 px-2 uppercase tracking-widest">Recent Chats</p>
          <div className="space-y-1">
            {chatHistory.length === 0 ? (
              <p className="text-xs text-slate-600 px-3 py-2 italic">No previous chats...</p>
            ) : (
              chatHistory.map((session) => (
                <button 
                  key={session.id}
                  onClick={() => {
                    loadChat(session.id);
                    if (pathname !== '/dashboard') router.push('/dashboard');
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800/60 hover:text-cyan-400 rounded-md transition-all duration-200 truncate flex items-center gap-2 group"
                >
                  <MessageSquare size={14} className="opacity-50 group-hover:opacity-100" />
                  {session.title}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: User Profile & Sign Out */}
      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-2">
          <p className="text-sm font-bold text-slate-200">Test user</p>
          <p className="text-xs text-slate-400">testuser@email.com</p>
        </div>
        
        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-red-900/50 hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>

    </div>
  );
}
