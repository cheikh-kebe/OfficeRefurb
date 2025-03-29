# Évaluateur de Rentabilité pour Meubles de Bureau Reconditionnés

Une application web pour évaluer la rentabilité du reconditionnement de meubles de bureau usagés. Cette application permet aux utilisateurs d'évaluer les coûts associés à la réparation, au nettoyage et à la main-d'œuvre nécessaires pour reconditionner des meubles, puis de comparer ces coûts aux prix de vente prévus pour déterminer la viabilité financière.

## Fonctionnalités

- **Évaluation des meubles** : Saisie des détails du meuble, y compris le type, la marque, le modèle et l'état.
- **Gestion des réparations** : Ajout et suivi des réparations nécessaires avec estimation des coûts et du temps.
- **Gestion du nettoyage** : Suivi des tâches de nettoyage avec estimation des coûts et du temps.
- **Analyse de la rentabilité** : Calcul automatique des coûts totaux, des bénéfices et des marges.
- **Gestion des photos** : Téléchargement et gestion des photos avant/après pour documenter le processus de reconditionnement.
- **Catalogue** : Vue d'ensemble de tous les meubles en stock avec leurs détails.
- **Rapports** : Tableaux de bord avec statistiques et visualisations pour analyser la rentabilité par type de meuble.

## Structure du projet

Le projet utilise une architecture full-stack JavaScript avec React pour le frontend et Express pour le backend.

### Structure des dossiers

```
/
├── client/                  # Code frontend React
│   ├── src/
│   │   ├── components/      # Composants UI réutilisables
│   │   │   ├── furniture/   # Composants liés aux meubles
│   │   │   ├── layout/      # Composants de mise en page
│   │   │   ├── profitability/ # Composants d'analyse de rentabilité
│   │   │   └── ui/          # Composants d'interface utilisateur (shadcn)
│   │   ├── hooks/           # Hooks React personnalisés
│   │   ├── lib/             # Fonctions utilitaires et types
│   │   └── pages/           # Pages de l'application
│   └── index.html
├── server/                  # Code backend Express
│   ├── index.ts             # Point d'entrée du serveur
│   ├── routes.ts            # Routes API
│   ├── storage.ts           # Couche d'accès aux données
│   └── vite.ts              # Configuration Vite pour le serveur
├── shared/                  # Code partagé entre frontend et backend
│   └── schema.ts            # Schémas de données et types
└── [fichiers de configuration] 
```

### Technologies utilisées

- **Frontend** :
  - React
  - TanStack Query (React Query) pour la gestion des données
  - Shadcn UI pour les composants
  - Tailwind CSS pour le styling
  - Recharts pour les visualisations
  - React Hook Form pour la gestion des formulaires

- **Backend** :
  - Express.js
  - Système de stockage en mémoire (MemStorage)
  - Validation avec Zod

## Comment exécuter localement

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation

1. Clonez le dépôt :
   ```bash
   git clone [URL_DU_REPO]
   cd [NOM_DU_DOSSIER]
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

### Démarrage du serveur de développement

Pour démarrer l'application en mode développement :

```bash
npm run dev
```

Cela lancera à la fois le serveur backend Express et le serveur de développement frontend Vite.

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Flux d'utilisation typique

1. **Ajouter un nouveau meuble** : Accédez à la page d'évaluation et entrez les détails du meuble.
2. **Définir les tâches de reconditionnement** : Ajoutez les réparations et les tâches de nettoyage nécessaires.
3. **Projeter les ventes** : Entrez le prix de vente prévu et les informations de vente.
4. **Analyser la rentabilité** : Examinez l'analyse de rentabilité générée automatiquement.
5. **Ajouter des photos** : Téléchargez des photos avant/après ou des photos de dommages.
6. **Consulter les rapports** : Explorez les tableaux de bord pour analyser les performances globales.

## Structure des données

- **Meubles** : Informations de base sur chaque meuble (type, marque, état, etc.)
- **Réparations** : Tâches de réparation liées à un meuble
- **Nettoyage** : Tâches de nettoyage liées à un meuble
- **Évaluations** : Analyse de rentabilité pour un meuble
- **Photos** : Images du meuble (avant, après, dommages)

## Contribution

Pour contribuer au projet :

1. Forker le dépôt
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/ma-nouvelle-fonctionnalite`)
3. Committer vos changements (`git commit -m 'Ajout de ma nouvelle fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request