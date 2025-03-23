import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { label: "Évaluations", href: "/assessment" },
    { label: "Catalogue", href: "/catalog" },
    { label: "Rapports", href: "/reports" },
    { label: "Paramètres", href: "/settings" }
  ];

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-6 w-6 mr-3"
            >
              <path d="M5 11V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3z" />
              <path d="M5 11v6" />
              <path d="M19 11v6" />
              <path d="M5 17h14" />
            </svg>
            <h1 className="text-xl font-semibold">MeublePro</h1>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <div key={item.href} className="font-medium">
              <Link href={item.href}>
                <span className={`hover:text-gray-200 cursor-pointer transition-colors ${location === item.href ? 'text-white font-bold underline underline-offset-4' : ''}`}>
                  {item.label}
                </span>
              </Link>
            </div>
          ))}
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link href={item.href}>
                    <span 
                      className={`px-2 py-1 rounded-md font-medium cursor-pointer block hover:bg-primary-50 transition-colors ${
                        location === item.href ? 'bg-primary-100 text-primary' : ''
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </span>
                  </Link>
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
