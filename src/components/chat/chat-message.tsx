'use client';

import { Copy, Activity, MessageCircle, FileText, Download } from "lucide-react";
import { ChatMessage as ChatMessageType, useChatStore } from "@/store/useChatStore";
import { DynamicChart } from "@/components/charts/dynamic-chart";
import { SqlPreviewModal } from "@/components/chat/sql-preview-modal";
import { downloadCSV, downloadPDF } from "@/lib/exportUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user';
  const { processUserQuery } = useChatStore();

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 w-full px-6">
        <div className="bg-[#0284c7] text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div className="text-[10px] text-cyan-100 mt-1 opacity-70 text-right">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className="flex justify-start mb-6 w-full px-6">
      <div className="flex flex-col max-w-[85%] w-full">
        
        {/* Error State Mock logic */}
        {message.content.startsWith("Error:") ? (
          <div className="bg-[#1e293b] border border-red-900/50 p-4 rounded-xl shadow-md">
            <p className="text-sm text-slate-300 mb-4">{message.content}</p>
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs px-3 py-1.5 rounded transition-colors">
              <Copy size={12} />
              Copy
            </button>
            <div className="text-[10px] text-slate-500 mt-2">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ) : (
          <div id={`chat-msg-${message.id}`} className="bg-[#1e293b]/60 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/30 p-5 rounded-2xl shadow-lg w-full relative group transition-all duration-300">
            
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-cyan-500/10 rounded-md">
                  <Activity size={16} className="text-cyan-400" />
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SULB Insights AI</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => downloadPDF(`chat-msg-${message.id}`, `report-${message.id}.pdf`)}
                  className="text-slate-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  title="Export as PDF"
                >
                  <FileText size={16} />
                </button>
                {message.sqlQuery && (
                  <SqlPreviewModal sqlQuery={message.sqlQuery} />
                )}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {message.content}
            </p>

            {message.isChart && (
              <div className="mb-6">
                <DynamicChart data={message.chartData} type={message.chartType} />
              </div>
            )}

            {/* Tabular Data Rendering */}
            {message.tableData && message.tableData.length > 0 && (
              <div className="mt-4 mb-6 border border-slate-700/50 rounded-lg overflow-hidden bg-slate-900/50">
                <div className="flex justify-end p-2 border-b border-slate-700/50 bg-slate-800/30">
                  <button 
                    onClick={() => downloadCSV(message.tableData!, `data-${message.id}.csv`)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-800/50">
                      <TableRow className="hover:bg-transparent border-slate-700/50">
                        {Object.keys(message.tableData[0]).map((key) => (
                          <TableHead key={key} className="text-slate-300 text-xs uppercase font-semibold whitespace-nowrap">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {message.tableData.map((row, idx) => (
                        <TableRow key={idx} className="border-slate-800/50 hover:bg-slate-800/30">
                          {Object.values(row).map((val: any, vIdx) => (
                            <TableCell key={vIdx} className="text-sm text-slate-300 py-2 whitespace-nowrap">
                              {val}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-700/50 pt-3 gap-2">
              
              {/* Follow Up Suggestions */}
              {message.followUps && message.followUps.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 w-full">
                  {message.followUps.map((suggestion, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="cursor-pointer border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 font-normal px-3 py-1 gap-1"
                      onClick={() => processUserQuery(suggestion)}
                    >
                      <MessageCircle size={12} />
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between w-full mt-1">
                <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-xs transition-colors">
                  <Copy size={14} />
                  Copy
                </button>
                <div className="text-[10px] text-slate-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
