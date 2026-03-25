import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { RoleLayout } from "@/components/RoleLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminTasks from "@/pages/admin/AdminTasks";
import AdminTeam from "@/pages/admin/AdminTeam";
import AdminClients from "@/pages/admin/AdminClients";
import AdminInvoices from "@/pages/admin/AdminInvoices";
import AdminProposals from "@/pages/admin/AdminProposals";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminSettings from "@/pages/admin/AdminSettings";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientProjects from "@/pages/client/ClientProjects";
import ClientMessages from "@/pages/client/ClientMessages";
import ClientFiles from "@/pages/client/ClientFiles";
import ClientInvoices from "@/pages/client/ClientInvoices";
import ClientProposals from "@/pages/client/ClientProposals";
import TeamDashboard from "@/pages/team/TeamDashboard";
import TeamTasks from "@/pages/team/TeamTasks";
import TeamProjects from "@/pages/team/TeamProjects";
import TeamMessages from "@/pages/team/TeamMessages";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><RoleLayout><AdminDashboard /></RoleLayout></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={["admin"]}><RoleLayout><AdminProjects /></RoleLayout></ProtectedRoute>} />
            <Route path="/admin/tasks" element={<ProtectedRoute allowedRoles={["admin"]}><RoleLayout><AdminTasks /></RoleLayout></ProtectedRoute>} />
            <Route path="/admin/team" element={<ProtectedRoute allowedRoles={["admin"]}><RoleLayout><AdminTeam /></RoleLayout></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={["admin"]}><RoleLayout><AdminClients /></RoleLayout></ProtectedRoute>} />
            <Route path="/admin/invoices" element={<ProtectedRoute allowedRoles={["admin"]}><RoleLayout><AdminInvoices /></RoleLayout></ProtectedRoute>} />
            <Route path="/admin/proposals" element={<ProtectedRoute allowedRoles={["admin"]}><RoleLayout><AdminProposals /></RoleLayout></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute allowedRoles={["admin"]}><RoleLayout><AdminMessages /></RoleLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><RoleLayout><AdminSettings /></RoleLayout></ProtectedRoute>} />

            {/* Client Routes */}
            <Route path="/client" element={<ProtectedRoute allowedRoles={["client"]}><RoleLayout><ClientDashboard /></RoleLayout></ProtectedRoute>} />
            <Route path="/client/projects" element={<ProtectedRoute allowedRoles={["client"]}><RoleLayout><ClientProjects /></RoleLayout></ProtectedRoute>} />
            <Route path="/client/messages" element={<ProtectedRoute allowedRoles={["client"]}><RoleLayout><ClientMessages /></RoleLayout></ProtectedRoute>} />
            <Route path="/client/files" element={<ProtectedRoute allowedRoles={["client"]}><RoleLayout><ClientFiles /></RoleLayout></ProtectedRoute>} />
            <Route path="/client/invoices" element={<ProtectedRoute allowedRoles={["client"]}><RoleLayout><ClientInvoices /></RoleLayout></ProtectedRoute>} />
            <Route path="/client/proposals" element={<ProtectedRoute allowedRoles={["client"]}><RoleLayout><ClientProposals /></RoleLayout></ProtectedRoute>} />

            {/* Team Routes */}
            <Route path="/team" element={<ProtectedRoute allowedRoles={["team_member"]}><RoleLayout><TeamDashboard /></RoleLayout></ProtectedRoute>} />
            <Route path="/team/tasks" element={<ProtectedRoute allowedRoles={["team_member"]}><RoleLayout><TeamTasks /></RoleLayout></ProtectedRoute>} />
            <Route path="/team/projects" element={<ProtectedRoute allowedRoles={["team_member"]}><RoleLayout><TeamProjects /></RoleLayout></ProtectedRoute>} />
            <Route path="/team/messages" element={<ProtectedRoute allowedRoles={["team_member"]}><RoleLayout><TeamMessages /></RoleLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
