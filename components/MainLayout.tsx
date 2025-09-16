import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthHeader } from "@/components/auth/AuthHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        {/* Full Black Background */}
        <div className="min-h-screen flex w-full" style={{ backgroundColor: '#0f0f0f' }}>
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Top Header */}
            <header className="h-16 flex items-center justify-between border-b px-6" 
                    style={{ 
                      backgroundColor: '#0f0f0f', 
                      borderBottomColor: '#2c2c2e' 
                    }}>
              <div className="flex items-center">
                <button 
                  onClick={() => {
                    const triggerElement = document.querySelector('[data-sidebar="trigger"]') as HTMLElement;
                    if (triggerElement) {
                      triggerElement.click();
                    }
                  }}
                  className="mr-4 hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/lovable-uploads/b61922be-bdac-4412-a05d-3f4b27e49416.png" 
                    alt="SODA Logo" 
                    className="h-8 w-8 object-contain"
                  />
                </button>
                <span className="text-primary font-bold text-lg">SODA.AI</span>
                <SidebarTrigger className="hidden" />
              </div>
              
              {/* Auth Header */}
              <AuthHeader />
            </header>

            {/* Main Content - Full Width */}
            <main className="flex-1 overflow-auto w-full">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}