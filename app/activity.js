window.ACTIVITY_CONFIG = {
  "title": "La roue des mythes et réalités",
  "organization": "Ergonomie",
  "questionsPerGame": 3,
  "statsPassword": "admin",
  "spinDurationMs": 4000,
  "selectedCategoryDelayMs": 1000,
  "welcome": {
    "title": "Ergonomie : mythe ou réalité?",
    "instructions": "Tournez la roue, puis répondez à trois affirmations pour tester vos connaissances sur les risques ergonomiques."
  },
  "categories": [
    {
      "id": "conduite", "name": "Conduite", "icon": "app/conduite.png", "iconAlt": "Camion", "color": "#3d842c",
      "questions": [
        { "text": "Conduire un véhicule lourd pendant de longues périodes peut augmenter le risque de douleurs et de blessures au dos.", "answer": "realite", "explanation": "Les vibrations et les secousses peuvent fatiguer le corps et causer des douleurs. Elles sont présentes lorsqu'on conduit longtemps un véhicule ou lorsqu'on utilise des outils vibrants. Avec le temps, elles peuvent contribuer au développement de troubles musculosquelettiques (TMS), surtout au dos, au cou, aux mains et aux bras.", "takeaway": "Même assis, le corps peut être exposé à des contraintes importantes." }
      ]
    },
    {
      "id": "pauses", "name": "Pauses", "icon": "app/pauses.png", "iconAlt": "Tasse", "color": "#07538a",
      "questions": [
        { "text": "Les meilleurs travailleurs sont ceux qui ne prennent jamais de pause.", "answer": "mythe", "explanation": "Travailler sans pause ne fait pas de quelqu'un un meilleur travailleur. La fatigue s'accumule au cours de la journée et peut augmenter les risques d'erreur, d'accident ou de blessure. Les pauses permettent au corps et au cerveau de récupérer pour rester concentré et efficace. Alterner les périodes de travail et les périodes de repos est une bonne façon de prévenir les blessures.", "takeaway": "Les pauses sont un outil de travail, pas une perte de temps." }
      ]
    },
    {
      "id": "douleur", "name": "Douleur et fatigue", "icon": "app/douleur-fatigue.png", "iconAlt": "Personne ayant mal à l'épaule", "color": "#e3a71a",
      "questions": [
        { "text": "La douleur et la fatigue font partie du métier, il faut apprendre à vivre avec.", "answer": "mythe", "explanation": "La douleur et la fatigue ne font pas simplement partie du travail. Elles peuvent être des signes que le corps est soumis à des contraintes excessives ou inadéquates. Ignorer ces signaux et continuer à travailler peut aggraver le problème et augmenter le risque de blessure. Reconnaître les premiers symptômes permet d'agir plus tôt et de prévenir des problèmes plus importants.", "takeaway": "La douleur et la fatigue ne sont pas banales : ce sont des signaux d'alerte." }
      ]
    },
    {
      "id": "position", "name": "Position assise", "icon": "app/position-assise.png", "iconAlt": "Chaise de bureau", "color": "#595b5d",
      "questions": [
        { "text": "Travailler assis toute la journée est sans danger pour le corps.", "answer": "mythe", "explanation": "Rester assis longtemps dans la même position peut causer de l'inconfort et des douleurs, surtout au dos, au cou et aux épaules. Même une bonne posture peut devenir fatigante lorsqu'elle est maintenue trop longtemps. Bouger régulièrement et changer de position aide le corps à récupérer.", "takeaway": "La meilleure posture est toujours la suivante." }
      ]
    },
    {
      "id": "mouvements", "name": "Mouvements répétitifs", "icon": "app/mouvements-repetitifs.png", "iconAlt": "Main en mouvement", "color": "#408b31",
      "questions": [
        { "text": "Faire toujours le même mouvement peut être aussi exigeant pour le corps que soulever des charges lourdes.", "answer": "realite", "explanation": "Répéter le même geste encore et encore sollicite toujours les mêmes muscles et les mêmes articulations. Avec le temps, cela peut causer de la fatigue, de l'inconfort ou des douleurs. Le risque de développer un trouble musculosquelettique (TMS) augmente lorsque les mouvements répétitifs sont fréquents ou combinés à des efforts importants ou à de mauvaises postures.", "takeaway": "La répétition use le corps, même sans charge lourde." }
      ]
    },
    {
      "id": "aides", "name": "Aides mécaniques", "icon": "app/aides-mecaniques.png", "iconAlt": "Chariot élévateur", "color": "#076795",
      "questions": [
        { "text": "Les aides mécaniques sont surtout utiles pour les personnes moins fortes.", "answer": "mythe", "explanation": "Les aides mécaniques ne sont pas un signe de faiblesse. Elles servent à réduire les efforts physiques, la fatigue et les risques de blessure. Les utiliser permet souvent de travailler de façon plus sécuritaire et plus efficace.", "takeaway": "La compétence, c'est aussi savoir utiliser les bonnes ressources." }
      ]
    },
    {
      "id": "charge", "name": "Charge de travail et soutien", "icon": "app/charge-travail.png", "iconAlt": "Graphique", "color": "#db7a24",
      "questions": [
        { "text": "Une charge de travail élevée et l'absence de soutien au travail peuvent augmenter les risques de TMS.", "answer": "realite", "explanation": "Lorsqu'une personne travaille sous pression, doit gérer beaucoup de demandes ou reçoit peu de soutien (tous des facteurs de risques psychosociaux), il y a des effets sur le corps. Par exemple, les tensions musculaires et la fatigue peuvent augmenter. Combinés aux efforts physiques, ces facteurs peuvent augmenter le risque de développer un trouble musculosquelettique (TMS).", "takeaway": "L'impact des facteurs de risques psychosociaux n'est pas seulement sur le moral, ils agissent aussi sur le corps." }
      ]
    },
    {
      "id": "condition", "name": "Condition physique", "icon": "app/condition-physique.png", "iconAlt": "Bras musclé", "color": "#3d842c",
      "questions": [
        { "text": "Plus on est en forme physiquement, plus on est protégé contre tous les TMS.", "answer": "mythe", "explanation": "Être en forme peut aider, mais cela ne protège pas contre tous les risques. Même une personne très active peut développer un TMS si elle répète souvent les mêmes gestes, fait beaucoup d'efforts ou travaille dans des postures contraignantes. La prévention repose d'abord sur l'élimination ou la maîtrise des risques présents dans le travail.", "takeaway": "La forme physique aide, mais elle ne remplace pas la prévention." }
      ]
    },
    {
      "id": "signaux", "name": "Signaux d'alerte", "icon": "app/signaux-alerte.png", "iconAlt": "Cloche", "color": "#07538a",
      "questions": [
        { "text": "Les premiers inconforts sont souvent des signaux d'alerte qu'il faut prendre au sérieux.", "answer": "realite", "explanation": "Les douleurs, les raideurs, les engourdissements ou une fatigue inhabituelle peuvent être les premiers signes d'un problème. Agir rapidement permet souvent d'éviter que la situation s'aggrave.", "takeaway": "Écouter son corps, c'est faire de la prévention." }
      ]
    },
    {
      "id": "causes", "name": "Causes des blessures", "icon": "app/causes-blessures.png", "iconAlt": "Pièces de casse-tête", "color": "#55595c",
      "questions": [
        { "text": "Les blessures arrivent surtout parce que les travailleurs commettent des erreurs ou travaillent mal.", "answer": "mythe", "explanation": "Les blessures sont rarement attribuables à une seule cause. Des équipements mal adaptés, des tâches mal conçues, un manque d'information ou des contraintes organisationnelles peuvent augmenter les risques, même lorsque les travailleurs sont expérimentés et prudents. Pour prévenir les blessures efficacement, il faut examiner l'ensemble de la situation de travail et agir sur les causes à la source.", "takeaway": "La prévention est une responsabilité partagée qui passe autant par les comportements sécuritaires que par des conditions de travail adéquates." }
      ]
    }
  ]
};
