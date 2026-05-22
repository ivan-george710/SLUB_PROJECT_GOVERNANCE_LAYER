'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code, Database, Play } from "lucide-react";
import { useState } from "react";

export function SqlPreviewModal({ sqlQuery }: { sqlQuery: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2 h-7 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300" />}>
        <Database size={12} />
        View SQL
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-400">
            <Code size={18} />
            Generated SQL Query
          </DialogTitle>
        </DialogHeader>
        <div className="bg-black/50 p-4 rounded-md border border-slate-800 font-mono text-sm overflow-x-auto text-green-400">
          <pre>{sqlQuery}</pre>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2" onClick={() => setOpen(false)}>
            <Play size={14} />
            Approve & Execute
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
