import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Catalog from "./pages/Catalog";
import Reports from "./pages/Reports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/assessment/:id" component={Assessment} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/reports" component={Reports} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
