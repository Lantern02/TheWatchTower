
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/store" element={<Store />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/drafts" element={<Drafts />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/posts/new" element={
                <MediumEditor 
                  sectionId={new URLSearchParams(window.location.search).get('section') || ''} 
                />
              } />
              <Route path="/admin/posts/:postId" element={
                <MediumEditor 
                  postId={window.location.pathname.split('/').pop()} 
                  sectionId=""
                />
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
