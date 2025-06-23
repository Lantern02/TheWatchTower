
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Store from "./pages/Store";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import DynamicSection from "./pages/DynamicSection";
import MediumEditor from "./components/MediumEditor";
import Trending from "./pages/Trending";
import Bookmarks from "./pages/Bookmarks";
import Drafts from "./pages/Drafts";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-900">
          <Header />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/store" element={<Store />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/bookmarks" element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              } />
              <Route path="/drafts" element={
                <ProtectedRoute>
                  <Drafts />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/posts/new" element={
                <ProtectedRoute>
                  <MediumEditor 
                    sectionId={new URLSearchParams(window.location.search).get('section') || ''} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/admin/posts/:postId" element={
                <ProtectedRoute>
                  <MediumEditor 
                    postId={window.location.pathname.split('/').pop()} 
                    sectionId=""
                  />
                </ProtectedRoute>
              } />
              <Route path="/:slug" element={<DynamicSection />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
