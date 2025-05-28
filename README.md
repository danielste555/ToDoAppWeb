Application de gestion de tâches
Ce projet est une application web complète permettant aux utilisateurs de gérer efficacement leurs tâches quotidiennes.

Fonctionnalités principales :
              
            Création de tâches avec titre, description, date d’échéance, priorité, etc.
            
            Modification et suppression des tâches existantes.
            
            Affichage des tâches du jour, des tâches à venir, et des tâches marquées comme "Fait".
            
            Recherche et filtres dynamiques par date, statut, ou mot-clé pour une navigation rapide.
            
            Statistiques dynamiques sur le nombre de tâches selon leur statut.

  Frontend : React.js

            Utilisation de React Router pour la navigation entre les pages (Aujourd’hui, Prochainement, Achevées, Filtres).
            
            Architecture modulaire avec composants réutilisables (Sidebar, TaskCard, AddTaskModal, etc.).
            
            Utilisation de hooks personnalisés (useEffect, useState) pour gérer le cycle de vie et l’état des tâches.
            
            Communication avec le backend via Axios.
            
            Utilisation de Bootstrap et de CSS personnalisé pour un design responsive, professionnel et moderne.
            
            Gestion du token JWT dans le localStorage pour la persistance de l’authentification.

Backend : ASP.NET Core (C#)

            Architecture en couches (Layered Architecture) avec séparation claire entre :
            
            Controllers (exposition des endpoints HTTP),
            
            Services (logique métier),
            
            Repositories (accès aux données via Entity Framework),
            
            DTOs et mapping pour le transfert de données.
            
            Mise en place de JWT Authentication pour sécuriser l’accès aux API.
            
            Endpoints RESTful pour toutes les opérations CRUD.

  Base de données : SQL Server
  
            Modélisation relationnelle : entités User, Task, etc., avec gestion des relations.
            
            Utilisation d’Entity Framework Core avec migrations pour gérer la création et l’évolution du schéma de base de données.
            
            Génération automatique de la base à partir des classes C# (Code First).
            
