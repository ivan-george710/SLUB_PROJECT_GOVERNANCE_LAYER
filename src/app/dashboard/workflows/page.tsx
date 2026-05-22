'use client';

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function WorkflowsPage() {
  const [approvals, setApprovals] = useState([
    { id: "EX-1042", type: "Interest Rate Override", applicant: "Acme Corp", amount: "$1.2M", status: "Pending" },
    { id: "EX-1043", type: "LTV Exception", applicant: "John Doe", amount: "$450K", status: "Pending" },
    { id: "EX-1044", type: "Policy Waiver", applicant: "XYZ Logistics", amount: "$2.5M", status: "Pending" },
  ]);

  const [escalations, setEscalations] = useState([
    { id: "ESC-901", type: "High Risk Sector", applicant: "Global Trade Ltd", amount: "$5.0M", level: "L3 Manager" },
    { id: "ESC-902", type: "Credit Score < 600", applicant: "Jane Smith", amount: "$120K", level: "L2 Supervisor" },
  ]);

  const handleAction = (id: string, action: string) => {
    // Basic mock logic to remove item on action
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    setEscalations((prev) => prev.filter((item) => item.id !== id));
    alert(`Successfully ${action} rule for ${id}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0b1120] p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Workflows & Approvals</h1>
        <p className="text-slate-400">Manage pending exceptions and Business Rule Engine (BRE) escalations.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full h-full flex flex-col">
        <TabsList className="bg-slate-800 border border-slate-700 w-fit mb-6">
          <TabsTrigger value="pending" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
            Pending Approvals
            <Badge variant="secondary" className="ml-2 bg-slate-700 text-cyan-400">{approvals.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="escalated" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Escalations
            <Badge variant="secondary" className="ml-2 bg-slate-700 text-red-400">{escalations.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="flex-1 mt-0">
          <div className="border border-slate-700 rounded-lg bg-[#131b2f] overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800">
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="text-slate-300">Request ID</TableHead>
                  <TableHead className="text-slate-300">Exception Type</TableHead>
                  <TableHead className="text-slate-300">Applicant</TableHead>
                  <TableHead className="text-slate-300">Amount</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">No pending approvals.</TableCell>
                  </TableRow>
                ) : (
                  approvals.map((item) => (
                    <TableRow key={item.id} className="border-slate-700/50 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-cyan-400">{item.id}</TableCell>
                      <TableCell className="text-slate-300">{item.type}</TableCell>
                      <TableCell className="text-slate-300">{item.applicant}</TableCell>
                      <TableCell className="text-slate-300">{item.amount}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" onClick={() => handleAction(item.id, 'Approved')} className="bg-green-600 hover:bg-green-500 text-white h-8 px-2 gap-1">
                          <CheckCircle size={14} /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAction(item.id, 'Rejected')} className="border-red-900 text-red-400 hover:bg-red-900/30 hover:text-red-300 h-8 px-2 gap-1">
                          <XCircle size={14} /> Reject
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleAction(item.id, 'Escalated')} className="text-amber-400 hover:bg-amber-900/30 hover:text-amber-300 h-8 px-2 gap-1">
                          <AlertTriangle size={14} /> Escalate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="escalated" className="flex-1 mt-0">
          <div className="border border-slate-700 rounded-lg bg-[#131b2f] overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-800">
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="text-slate-300">Escalation ID</TableHead>
                  <TableHead className="text-slate-300">Risk Factor</TableHead>
                  <TableHead className="text-slate-300">Applicant</TableHead>
                  <TableHead className="text-slate-300">Required Level</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escalations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">No active escalations.</TableCell>
                  </TableRow>
                ) : (
                  escalations.map((item) => (
                    <TableRow key={item.id} className="border-slate-700/50 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-red-400">{item.id}</TableCell>
                      <TableCell className="text-slate-300">{item.type}</TableCell>
                      <TableCell className="text-slate-300">{item.applicant}</TableCell>
                      <TableCell className="text-slate-300">
                        <Badge variant="outline" className="border-amber-700 text-amber-500">{item.level}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" onClick={() => handleAction(item.id, 'Approved')} className="bg-green-600 hover:bg-green-500 text-white h-8 px-2 gap-1">
                          <CheckCircle size={14} /> Override & Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAction(item.id, 'Rejected')} className="border-red-900 text-red-400 hover:bg-red-900/30 hover:text-red-300 h-8 px-2 gap-1">
                          <XCircle size={14} /> Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
