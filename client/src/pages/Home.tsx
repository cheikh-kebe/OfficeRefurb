import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, PlusCircle, ClipboardList, Database } from "lucide-react";

const Home = () => {
  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
          Évaluation de Reconditionnement de Mobilier de Bureau
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Évaluez facilement la rentabilité du reconditionnement de votre mobilier de bureau usagé
          et prenez des décisions éclairées pour maximiser votre rentabilité.
        </p>
        <div className="mt-8">
          <Link href="/assessment">
            <Button size="lg" className="mr-4">
              <PlusCircle className="mr-2 h-5 w-5" />
              Nouvelle évaluation
            </Button>
          </Link>
          <Link href="/catalog">
            <Button variant="outline" size="lg">
              Voir le catalogue
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-primary-600" />
              Évaluation complète
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Évaluez tous les aspects du meuble: réparations nécessaires, nettoyage, coûts de main d'œuvre et prix de vente potentiel.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/assessment">
              <Button variant="ghost" size="sm">
                Commencer
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary-600" />
              Catalogue d'articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Consultez vos évaluations passées et accédez à une base de données d'articles reconditionnés avec leurs marges.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/catalog">
              <Button variant="ghost" size="sm">
                Explorer
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5 mr-2 text-primary-600"
              >
                <path d="M5 11V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3z" />
                <path d="M5 11v6" />
                <path d="M19 11v6" />
                <path d="M5 17h14" />
              </svg>
              Optimisez vos décisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Prenez des décisions basées sur des données concrètes. Notre outil identifie quels meubles valent la peine d'être reconditionnés.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/assessment">
              <Button variant="ghost" size="sm">
                En savoir plus
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;
