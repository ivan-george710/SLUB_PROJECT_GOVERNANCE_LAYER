'use client';

import { BarChart3, Download, LineChart, ArrowRight } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

const SUGGESTED_QUERIES = [
  "Show total loan disbursed by product in a bar graph",
  "Show top 5 cities with highest loan disbursement as a pie chart",
  "What is the NPA percentage trend in a line chart?",
  "Give me a summary of disbursement this year vs last year"
];

export function ChatLanding() {
  const { processUserQuery } = useChatStore();

  const handleSuggestClick = (query: string) => {
    processUserQuery(query);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6 pt-10 pb-32">
      
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
          SULB Insights AI
        </h1>
        <p className="text-xl text-slate-400 mb-6 font-medium">
          Smart Insights. Better Decisions.
        </p>
        <p className="text-slate-500 max-w-lg mx-auto">
          Leverage AI-driven insights to query and analyze LAP, MSME, and other lending datasets in real time.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
        
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-2 mb-3 text-cyan-400">
            <BarChart3 size={20} />
            <h3 className="font-semibold text-white">Portfolio Insights</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Analyze 34,000+ loan records across products and regions.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-2 mb-3 text-red-400">
            <Download size={20} />
            <h3 className="font-semibold text-white">Export Data</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Download reports as Excel instantly.
          </p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-2 mb-3 text-indigo-400">
            <LineChart size={20} />
            <h3 className="font-semibold text-white">Visual Analytics</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Auto-generated charts for trends and distributions.
          </p>
        </div>

      </div>

      {/* Suggested Questions */}
      <div className="w-full">
        <p className="text-slate-400 text-sm font-medium mb-4">Try these questions:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SUGGESTED_QUERIES.map((query, i) => (
            <button
              key={i}
              onClick={() => handleSuggestClick(query)}
              className="flex items-center justify-between p-4 bg-[#131b2f] border border-slate-700 rounded-lg text-left text-sm text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all group"
            >
              <span>{query}</span>
              <ArrowRight size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
