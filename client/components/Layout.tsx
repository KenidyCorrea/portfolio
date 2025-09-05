import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const navigation = [
    { name: "Início", href: "#home" },
    { name: "Sobre", href: "#about" },
    { name: "Projetos", href: "#projects" },
    { name: "Contato", href: "#contact" },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('#')) {
      return false;
    }
    return location.pathname === path;
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center"
            >
              <img
                src="/logo.png"
                alt="Kenidy Corrêa Logo"
                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSectionClick(e, item.href)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  } cursor-pointer`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </a>
              ))}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="ml-4"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleSectionClick(e, item.href);
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10 rounded-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-border bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Portfolio. Desenvolvido com React, Vite e Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
