import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import AccountsPage from "@/pages/AccountsPage";
import ContactsPage from "@/pages/ContactsPage";
import OpportunitiesPage from "@/pages/OpportunitiesPage";
import TasksPage from "@/pages/TasksPage";
import ChatPage from "@/pages/ChatPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/accounts" replace />} />
          <Route path="/accounts" element={<Layout><AccountsPage /></Layout>} />
          <Route path="/contacts" element={<Layout><ContactsPage /></Layout>} />
          <Route path="/opportunities" element={<Layout><OpportunitiesPage /></Layout>} />
          <Route path="/tasks" element={<Layout><TasksPage /></Layout>} />
          <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
