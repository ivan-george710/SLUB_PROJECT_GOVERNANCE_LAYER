import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MessageRole = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  isChart?: boolean;
  chartType?: 'bar' | 'pie' | 'line';
  chartData?: any;
  tableData?: any[];
  sqlQuery?: string;
  sqlQuery?: string;
  followUps?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessage[];
  chatHistory: ChatSession[];
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearChat: () => void;
  loadChat: (sessionId: string) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  processUserQuery: (query: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      chatHistory: [],
      isTyping: false,
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now().toString() }]
  })),

  clearChat: () => set((state) => {
    if (state.messages.length > 0) {
      const firstUserMsg = state.messages.find(m => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '') : 'New Chat';
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title,
        messages: [...state.messages],
        timestamp: new Date()
      };
      return { 
        messages: [], 
        isTyping: false,
        chatHistory: [newSession, ...state.chatHistory]
      };
    }
    return { messages: [], isTyping: false };
  }),
  
  loadChat: (sessionId: string) => set((state) => {
    const session = state.chatHistory.find(s => s.id === sessionId);
    if (session) {
      return { messages: session.messages, isTyping: false };
    }
    return state;
  }),
  
  setIsTyping: (isTyping) => set({ isTyping }),

  processUserQuery: (query: string) => {
    const { addMessage } = get();
    
    // Add User Message
    addMessage({ role: 'user', content: query });
    set({ isTyping: true });

    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const isError = lowerQuery.includes("error");
      
      if (isError) {
        addMessage({ 
          role: 'ai', 
          content: "Error: Failed to fetch data from the database. Please check your query syntax and try again." 
        });
        set({ isTyping: false });
        return;
      }

      // Check for chart intent
      let isChart = lowerQuery.includes("chart") || lowerQuery.includes("graph") || lowerQuery.includes("plot");
      let chartType: 'bar' | 'pie' | 'line' = 'bar'; // default

      if (lowerQuery.includes("pie")) chartType = 'pie';
      else if (lowerQuery.includes("line") || lowerQuery.includes("trend")) chartType = 'line';
      else if (lowerQuery.includes("bar")) chartType = 'bar';

      // Advanced Context: If no new context keyword, try to reuse the last dataset
      const prevAiMessage = get().messages.slice().reverse().find(m => m.role === 'ai' && m.tableData);
      
      let tableData: any[] = [];
      let chartData: any[] = [];
      let sqlQuery = "";
      
      if (lowerQuery.includes("region") || lowerQuery.includes("city")) {
        // Dataset 1: Region
        tableData = [
          { region: "North Zone", amount: "$8.5M", accounts: 320 },
          { region: "South Zone", amount: "$6.2M", accounts: 250 },
          { region: "East Zone", amount: "$4.1M", accounts: 180 },
          { region: "West Zone", amount: "$3.8M", accounts: 150 },
        ];
        chartData = tableData.map(d => ({ name: d.region, value: parseFloat(d.amount.replace('$', '').replace('M', '')) * 1000000 }));
        sqlQuery = "SELECT region, SUM(disbursed) as amount, COUNT(id) as accounts FROM loan_portfolio GROUP BY region ORDER BY amount DESC;";
        isChart = true; // Auto-show chart for this query
      } else if (lowerQuery.includes("trend") || lowerQuery.includes("year") || lowerQuery.includes("percentage")) {
        // Dataset 2: Trend
        tableData = [
          { period: "Q1 2024", amount: "$12.1M", npa: "2.1%" },
          { period: "Q2 2024", amount: "$15.4M", npa: "1.9%" },
          { period: "Q3 2024", amount: "$18.2M", npa: "1.8%" },
          { period: "Q4 2024", amount: "$22.5M", npa: "1.6%" },
        ];
        chartData = tableData.map(d => ({ name: d.period, value: parseFloat(d.amount.replace('$', '').replace('M', '')) * 1000000 }));
        sqlQuery = "SELECT quarter as period, SUM(disbursed) as amount, AVG(npa) as npa FROM loan_portfolio GROUP BY quarter ORDER BY quarter ASC;";
        isChart = true;
        if (!lowerQuery.includes("pie") && !lowerQuery.includes("bar")) chartType = 'line'; // default to line for trends
      } else if (isChart && prevAiMessage && !lowerQuery.includes("product")) {
        // Inherit previous data context if user just asks "show as pie chart"
        tableData = prevAiMessage.tableData || [];
        chartData = prevAiMessage.chartData || [];
        sqlQuery = prevAiMessage.sqlQuery || "";
      } else {
        // Dataset 3: Default Product Data
        tableData = [
          { product: "Home Loan", amount: "$5.2M", accounts: 120 },
          { product: "Auto Loan", amount: "$2.1M", accounts: 85 },
          { product: "Personal Loan", amount: "$1.4M", accounts: 200 },
          { product: "Education", amount: "$0.8M", accounts: 45 },
        ];
        chartData = tableData.map(d => ({ name: d.product, value: parseFloat(d.amount.replace('$', '').replace('M', '')) * 1000000 }));
        sqlQuery = "SELECT product_name, SUM(disbursed) as amount, COUNT(id) as accounts FROM loan_portfolio WHERE status = 'ACTIVE' GROUP BY product_name ORDER BY amount DESC;";
        isChart = true;
      }

      const followUps = [
        chartType === 'pie' ? "Show as Bar Graph" : "Show as Pie Chart", 
        chartType === 'line' ? "Show as Bar Graph" : "Show as Line Chart",
        "Breakdown by Region", 
        "Export to PDF"
      ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3); // max 3 unique

      addMessage({ 
        role: 'ai', 
        content: `Based on your query regarding "${query}", I have processed the request. Here is the corresponding data and visualization.`,
        isChart: isChart,
        chartType: chartType,
        chartData: chartData,
        tableData: tableData,
        sqlQuery: sqlQuery,
        followUps: followUps
      });
      
        set({ isTyping: false });
      }, 1500);
    }
  }),
  {
    name: 'datagpt-chat-storage',
  }
));
