## Readme du projet Cloud_Typescript

Ce projet a pour but de mettre en place les principales requêtes HTTP en Typescript avec un Swagger.

## 1. Instalation du projet.

Pour installer le projet faites : npm install
Pour générer le projet : npm build
Pour lancer le projet : npm run dev

se connecter à : http://localhost:3000/ => Pour vérifier que le local marche
puis à: localhost:3000/api-doc => pour accéder au Swagger et pour voir tester les requêtes

## 2.Explications des requêtes du projet

Le projet est divisé en plusieurs dossiers contenant des fichiers "route.ts" ces routes contiennent les logiques de requêtes en Typescript.
Vous trouverez les 4 requêtes principales qui sont : GET/POST/DELETE/PUT. Ces requêtes permettent d' Obtenir/Poster/Supprimer/Changer des données contenus dans le cloud sur MongoDbAtlas.
Pour chacune de ses requêtes est mise une annotations @swagger avant la création de méthode, cette annotation permet de documenter l'api dans un swagger, les paramètres (non exhaustifs) sont donc a but informatifs pour générer le swagger et non techniques.

## 3.User et authentification

Un système de logg in et logg out a été créé ainsi qu'un refresh. Ces fichiers restent encore à améliorer.
