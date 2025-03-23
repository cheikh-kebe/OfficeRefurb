const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-5 w-5 mr-2"
              >
                <path d="M5 11V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3z" />
                <path d="M5 11v6" />
                <path d="M19 11v6" />
                <path d="M5 17h14" />
              </svg>
              <span className="font-semibold">MeublePro</span>
            </div>
            <p className="text-sm mt-1">Solution d'évaluation pour reconditionnement de mobilier</p>
          </div>
          <div className="text-sm text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} MeublePro. Tous droits réservés.</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
