# La roue des mythes et realites

Activite web autonome et configurable sur l'ergonomie au travail.

## Demarrage

Ouvrir directement `index.html` dans un navigateur. Aucun serveur local et aucune connexion Internet ne sont requis.

## Statistiques

Les statistiques de la journee sont conservees localement dans le navigateur. Le bouton avec l'icone d'engrenage affiche :

- le nombre de joueurs;
- le nombre de fois que chaque question est apparue;
- le nombre de bonnes reponses et le taux de reussite.

Le bouton `Exporter TXT` telecharge un rapport lisible nomme `stats-YYYY-MM-DD.txt`.

L'acces aux statistiques est protege par le mot de passe `statsPassword` dans `app/activity.js`.

## Configuration

Toute l'activite est definie dans `app/activity.js` :

- `title`, `organization` et `welcome` controlent les textes d'accueil;
- `questionsPerGame` determine le nombre de questions par partie; la valeur `0` active le mode infini, masque le suivi du nombre de questions et supprime l'ecran final;
- `resultAutoResetSeconds` determine le delai avant le retour automatique a l'accueil depuis l'ecran final ou depuis une question restee sans reponse;
- `sessionAutoResetSeconds` determine le delai d'attente d'un nouveau tour de roue avant d'abandonner et de remettre a zero une session ayant au moins une question completee; il ne s'active jamais avant le premier tour;
- la valeur `0` desactive la remise a zero automatique du timer concerne;
- `spinDurationMs` determine la duree exacte de rotation de la roue, en millisecondes;
- `selectedCategoryDelayMs` determine le temps d'affichage de la categorie choisie avant l'apparition de l'affirmation;
- `categories` alimente automatiquement les sections de la roue;
- chaque categorie definit `name`, `color`, le chemin PNG `icon`, son texte accessible `iconAlt` et sa liste `questions`;
- la reponse d'une question doit etre `mythe` ou `realite`.

Tout le code, les donnees et les images utilises par `index.html` se trouvent dans le dossier `app/`. Chaque valeur `icon` est un chemin vers un fichier PNG, par exemple :

```js
{
  "name": "Conduite",
  "icon": "app/conduite.png",
  "iconAlt": "Camion"
}
```

Les PNG a fond transparent sont recommandes. Pour une roue nette sur les ecrans haute densite, prevoir des fichiers d'au moins 128 x 128 px. Les noms de fichiers sont libres : seul le chemin declare dans la configuration doit correspondre.

Les couleurs acceptent toute valeur CSS valide, par exemple `#3d842c`.
