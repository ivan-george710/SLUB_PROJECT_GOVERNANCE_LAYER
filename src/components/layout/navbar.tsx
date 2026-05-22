'use client';

import { Activity, Sun, Moon, LogOut, MessageSquare, Home, MonitorPlay, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { theme, toggleTheme, isPresentationMode, togglePresentationMode, isMobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const clearChat = useChatStore((state) => state.clearChat);
  const router = useRouter();
  return (
    <div className="h-16 bg-[#131b2f] border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
      
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={24} />
        </button>
        <div className="text-cyan-400">
          <Activity size={24} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide hidden sm:block">
          SULB Insights AI
        </h1>
      </div>

      {/* Right: User Info & Actions */}
      <div className="flex items-center gap-6">
        
        {/* User Info */}
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-slate-200">Test user</p>
          <p className="text-xs text-slate-400">testuser@email.com</p>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 text-slate-400">
          <button 
            onClick={togglePresentationMode} 
            className={`transition-colors ${isPresentationMode ? 'text-cyan-400' : 'hover:text-white'}`}
            title="Presentation Mode"
          >
            <MonitorPlay size={20} />
          </button>
          <button onClick={toggleTheme} className="hover:text-white transition-colors hidden sm:block">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => { clearChat(); router.push('/login'); }} className="hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-slate-700"></div>

        {/* Home / Clear Chat Button */}
        <button 
          onClick={() => { clearChat(); router.push('/dashboard'); }} 
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Home size={18} />
          <span className="text-sm font-medium">Home</span>
        </button>

        {/* Chat Interface Label */}
        <div className="flex items-center gap-2 text-slate-500">
          <MessageSquare size={18} />
          <span className="text-sm font-medium">Chat Interface</span>
        </div>

      </div>

    </div>
  );
}
