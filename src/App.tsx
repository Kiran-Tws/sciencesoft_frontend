import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import CategoryDetail from "./pages/CategoryDetail";
import InquiryForm from "./pages/InquiryForm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import InquiryList from './pages/InquiryList';
import InquiryDetail from "./pages/InquiryDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/inquiries" element={<InquiryList />} />
          <Route path="/admin/inquiries/:sessionId" element={<InquiryDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/category/:categoryId" element={<CategoryDetail />} />
          {/* <Route path="/inquiry/:categoryId" element={<InquiryForm />} /> */}
          <Route path="/inquiry/:subcategoryId" element={<InquiryForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
