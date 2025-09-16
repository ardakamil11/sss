import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MainLayout } from "@/components/MainLayout";
import Index from "./pages/Index";
import UrunReklama from "./pages/UrunReklama";
import FotografBirlestirme from "./pages/FotografBirlestirme";
import MetinGoruntu from "./pages/MetinGoruntu";
import GoruntuIyilestirme from "./pages/GoruntuIyilestirme";
import ComingSoon from "./pages/ComingSoon";
import TrendBulma from "./pages/TrendBulma";
import YoutubeInceleme from "./pages/YoutubeInceleme";
import NotFound from "./pages/NotFound";
import GizlilikPolitikasi from "./pages/GizlilikPolitikasi";
import MesafeliSatis from "./pages/MesafeliSatis";
import TeslimatIade from "./pages/TeslimatIade";
import Hakkimizda from "./pages/Hakkimizda";
import Iletisim from "./pages/Iletisim";
import { ImagePlus, Layers, TrendingUp, Users, Calendar } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                {/* Home Page */}
                <Route path="/" element={<Index />} />
                
                {/* GENERATE Section */}
                <Route path="/urun-reklama" element={<UrunReklama />} />
                <Route path="/fotograf-birlestirme" element={<FotografBirlestirme />} />
                <Route path="/metin-goruntu" element={<MetinGoruntu />} />
                <Route path="/goruntu-iyilestirme" element={<GoruntuIyilestirme />} />
                <Route path="/arka-plan-degistirme" element={
                  <ComingSoon 
                    title="Arka Plan Değiştirme" 
                    description="Arka plan değiştir/kaldır"
                    icon={Layers}
                  />
                } />
                
                {/* OTOMASYONLAR Section */}
                <Route path="/trend-bulma" element={<TrendBulma />} />
                <Route path="/youtube-inceleme" element={<YoutubeInceleme />} />
                <Route path="/rakip-analizi" element={
                  <ComingSoon 
                    title="Rakip Analizi" 
                    description="Rakip içerik analizi"
                    icon={Users}
                  />
                } />
                
                {/* CONTENT PLANNER Section */}
                <Route path="/icerik-takvimi" element={
                  <ComingSoon 
                    title="İçerik Takvimi" 
                    description="İçerik planlama ve takip araçları"
                    icon={Calendar}
                  />
                } />
                
                {/* Legal Pages */}
                <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
                <Route path="/mesafeli-satis" element={<MesafeliSatis />} />
                <Route path="/teslimat-iade" element={<TeslimatIade />} />
                <Route path="/hakkimizda" element={<Hakkimizda />} />
                <Route path="/iletisim" element={<Iletisim />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
