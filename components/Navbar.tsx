import { Bot } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* Professional SODA Logo */}
                <div className="w-10 h-10 bg-primary/15 border border-primary/30 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-inter font-bold text-sm">SODA</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success/80 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-inter font-bold text-primary">🥤 SODA</h1>
                <p className="text-xs text-muted-foreground">AI İçerik Üreticisi</p>
              </div>
            </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Özellikler</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Fiyatlandırma</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Destek</a>
          </div>
        </div>
      </div>
    </nav>
  );
};