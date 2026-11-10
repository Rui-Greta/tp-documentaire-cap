/* TP documentaire n°1 – CAP Électricien – Préparer une installation en sécurité
   Contenu des missions. Types : qcm, tf (vrai/faux), match (associer), order (remettre dans l'ordre),
   num (réponse numérique), gen (exercice généré aléatoirement), pick (repérer les erreurs), open (réponse libre), task (tâche avec le téléphone). */
window.TPDOC = {
  id: "cap-elec-tpdoc1-v1",
  titre: "Préparer une installation en sécurité",
  sousTitre: "TP documentaire n°1 · CAP Électricien · Jeudis 1 à 4",
  duree: "3 h 30",
  missions: [
    {
      id: "m1", num: 1, titre: "Le CAP et ton poste de travail", duree: "15 min", competences: "CO1 · CO8",
      intro: "Retrouve dans la présentation (partie 01) ce que tu dois savoir sur ton diplôme, tes épreuves et les règles de l'atelier.",
      source: "Présentation, diapositives 3 à 12",
      ex: [
        { type: "qcm", q: "Combien de compétences dois-tu valider pour l'épreuve EP1 ?", options: ["3", "4", "7", "9"], answer: 1,
          explain: "4 compétences : CO1, CO2, CO3 et CO8." },
        { type: "qcm", q: "Quelle est la durée de l'épreuve pratique EP1 en ponctuel ?", options: ["2 h", "4 h", "8 h", "12 h"], answer: 2,
          explain: "EP1 – Réalisation d'une installation : 8 h de pratique." },
        { type: "qcm", q: "L'épreuve EP2 consiste à…", options: ["réaliser une installation", "mettre en service une installation", "remplacer un matériel", "communiquer avec le client"], answer: 1,
          explain: "EP2 – Mettre en service une installation (CO4, CO5, CO7), 2 h de pratique." },
        { type: "match", q: "Associe chaque compétence à ce que tu fais.", pairs: [
          ["CO1 Analyser", "Lire le dossier, repérer les contraintes et les risques"],
          ["CO2 Organiser", "Préparer le poste, vérifier la liste du matériel"],
          ["CO3 Réaliser", "Implanter, poser, câbler, raccorder, trier ses déchets"],
          ["CO4 Contrôler", "Mesurer, vérifier hors et sous tension"],
          ["CO5 Valider", "Régler, essayer, valider le fonctionnement"],
          ["CO8 Communiquer", "Rendre compte à son chef d'équipe"]] },
        { type: "tf", q: "Les règles de l'atelier : vrai ou faux ?", items: [
          ["Je peux mettre le box sous tension seul quand j'ai fini mon câblage.", false],
          ["Je vérifie l'absence de tension au VAT avant d'intervenir.", true],
          ["Les chutes de cuivre vont à la poubelle.", false],
          ["Un outil isolé abîmé peut encore servir pour les petits travaux.", false],
          ["Je range et nettoie mon poste en fin de séance.", true]],
          explain: "Mise sous tension uniquement avec le formateur ; cuivre trié et réemployé ; jamais d'outil isolé abîmé." },
        { type: "task", phone: true, q: "Inventaire de ta caisse à outils", steps: [
          "Ouvre ta caisse à outils et compare-la à la liste de la diapositive « Inventaire de ta caisse à outils ».",
          "Prends une photo de ta caisse ouverte avec ton téléphone.",
          "Note ci-dessous les outils qui manquent ou qui sont abîmés (sinon écris « complet »)."], note: "Outils manquants ou abîmés" }
      ]
    },
    {
      id: "m2", num: 2, titre: "Risque électrique et prévention", duree: "45 min", competences: "CO1 · CO2 · CO3",
      intro: "Le danger électrique, l'habilitation, la consignation, les autres risques du chantier et le tri des déchets.",
      source: "Présentation, partie 02 (diapositives 13 à 25)",
      ex: [
        { type: "match", q: "Associe chaque intensité (courant alternatif 50 Hz) à son effet sur le corps humain.", pairs: [
          ["0,5 mA", "Seuil de perception"], ["10 mA", "Contraction : on ne peut plus lâcher"],
          ["30 mA", "Paralysie respiratoire possible"], ["75 mA", "Fibrillation cardiaque"]] },
        { type: "qcm", q: "Pourquoi une peau mouillée rend-elle le contact plus dangereux ?", options: ["La tension du réseau augmente", "La résistance du corps diminue, donc le courant augmente", "Le courant change de fréquence", "Le disjoncteur ne peut plus déclencher"], answer: 1,
          explain: "Loi d'Ohm : I = U / R. Si R diminue, I augmente." },
        { type: "match", q: "Contact direct ou contact indirect ?", pairs: [
          ["Un tournevis touche une borne de prise sous tension", "Contact direct"],
          ["La carcasse d'un lave-linge est sous tension à cause d'un défaut", "Contact indirect"],
          ["Toucher un conducteur dénudé", "Contact direct"],
          ["Un radiateur métallique dont un fil touche la carcasse", "Contact indirect"]] },
        { type: "qcm", q: "Le réseau 230 V / 400 V d'un logement appartient au domaine de tension…", options: ["TBT", "BT", "HTA", "HTB"], answer: 1,
          explain: "BT en alternatif : 50 V < U ≤ 1 000 V (les anciens domaines BTA et BTB sont regroupés)." },
        { type: "qcm", q: "Une sonnette alimentée en 12 V appartient au domaine…", options: ["TBT", "BT", "HTA", "HTB"], answer: 0, explain: "TBT : U ≤ 50 V en alternatif." },
        { type: "qcm", research: "Recherche sur ton téléphone ou le PC : « habilitation électrique INRS ».",
          q: "Dans le symbole d'habilitation B1V, que signifie la lettre V ?", options: ["Vérification", "Voisinage", "Validé", "Ventilation"], answer: 1,
          explain: "V = travaux au voisinage de pièces nues sous tension." },
        { type: "match", q: "Associe chaque symbole d'habilitation à ce qu'il autorise.", pairs: [
          ["B0", "Travaux non électriques au voisinage (peintre, maçon)"],
          ["BS", "Interventions élémentaires : lampe, fusible, réarmement"],
          ["B1V", "Exécuter des travaux électriques, y compris au voisinage"],
          ["B2V", "Diriger des travaux électriques"],
          ["BC", "Réaliser une consignation"],
          ["BR", "Interventions BT générales : dépannage, raccordement"]] },
        { type: "num", q: "Jusqu'à quelle distance des pièces nues sous tension se trouve la zone de voisinage renforcé en BT (zone 4) ?", answer: 0.3, tol: 0.001, unit: "m",
          explain: "0,30 m : en dessous, il faut l'habilitation adaptée et les EPI." },
        { type: "order", q: "Remets les étapes de la consignation dans l'ordre.", items: ["Séparer", "Condamner", "Identifier", "Vérifier l'absence de tension (VAT)", "Mettre à la terre et en court-circuit (MALT-CC)"] },
        { type: "order", q: "Remets dans l'ordre les étapes d'une VAT correcte.", items: ["Contrôler le VAT sur une source connue sous tension", "Mesurer entre phase et neutre", "Mesurer entre chaque conducteur actif et la terre", "Recontrôler le VAT sur la source connue"] },
        { type: "match", q: "Où vont ces déchets de chantier ?", pairs: [
          ["Chutes de câble en cuivre", "Bac cuivre (revendu ou réemployé)"],
          ["Tube fluorescent usagé", "Filière DEEE (collecte agréée)"],
          ["Emballages carton", "Benne carton"],
          ["Gravats de saignées", "Benne inertes"],
          ["Chutes de gaine et de conduit", "Bac plastiques"]] },
        { type: "order", q: "En cas d'accident électrique, remets les actions dans l'ordre.", items: ["Protéger : couper le courant", "Alerter : 15, 18 ou 112", "Secourir : gestes SST"] },
        { type: "task", phone: true, q: "Repérage sécurité dans ton centre", steps: [
          "Trouve le défibrillateur et la trousse de secours les plus proches de ta salle.",
          "Photographie-les avec ton téléphone.",
          "Note ci-dessous où ils se trouvent."], note: "Emplacement du défibrillateur et de la trousse de secours" }
      ]
    },
    {
      id: "m3", num: 3, titre: "Lire un dossier d'opération", duree: "40 min", competences: "CO1",
      intro: "Les trois dossiers, l'échelle d'un plan, les symboles normalisés et la lecture d'un schéma.",
      source: "Présentation, partie 03 (diapositives 26 à 35) · guide NF C 15-100 Schneider (dossier ressources)",
      ex: [
        { type: "match", q: "Dans quel dossier trouves-tu chaque document ?", pairs: [
          ["Plans et schémas", "Dossier technique"],
          ["Fiche d'autocontrôle", "Enregistrement et communication"],
          ["Plan de prévention (PPSPS)", "Santé-sécurité-environnement"],
          ["Notices des matériels", "Dossier technique"],
          ["PV de réception", "Enregistrement et communication"],
          ["Consignes du site, gestion des déchets", "Santé-sécurité-environnement"]] },
        { type: "gen", gen: "scale", n: 3, q: "Calcule la longueur réelle à partir de la mesure sur le plan." },
        { type: "match", q: "Nomme chaque symbole normalisé.", imgs: true, pairs: [
          ["assets/sym01.png", "Interrupteur simple allumage"], ["assets/sym02.png", "Interrupteur va-et-vient"],
          ["assets/sym03.png", "Bouton-poussoir"], ["assets/sym06.png", "Point lumineux"],
          ["assets/sym07.png", "Socle de prise 2P+T"], ["assets/sym08.png", "Disjoncteur"],
          ["assets/sym09.png", "Interrupteur différentiel"], ["assets/sym10.png", "Télérupteur"],
          ["assets/sym11.png", "Minuterie"], ["assets/sym13.png", "Prise de terre"]] },
        { type: "match", q: "Quel schéma utilises-tu ?", pairs: [
          ["Pour implanter les appareils sur les murs", "Schéma architectural"],
          ["Pour répartir les circuits dans le tableau", "Schéma unifilaire"],
          ["Pour câbler et raccorder les appareils", "Schéma multifilaire"],
          ["Pour comprendre le fonctionnement et dépanner", "Schéma développé"]] },
        { type: "qcm", img: "assets/simple_allumage.png", q: "Observe le schéma : quel conducteur l'interrupteur S1 coupe-t-il ?", options: ["Le neutre", "La phase", "Le conducteur PE", "La phase et le neutre"], answer: 1,
          explain: "L'interrupteur coupe toujours la phase : on suit L → Q1 → S1 → E1 → N." },
        { type: "qcm", img: "assets/simple_allumage.png", q: "Sur le même schéma, que représente Q1 ?", options: ["Un interrupteur", "Un disjoncteur 1P+N de 10 A", "Un interrupteur différentiel", "Un télérupteur"], answer: 1 },
        { type: "match", q: "Associe chaque repère à l'appareil.", pairs: [
          ["Q", "Disjoncteur"], ["S", "Organe de commande"], ["E", "Point lumineux"], ["X", "Prise de courant"], ["TL", "Télérupteur"], ["KM", "Contacteur"]] },
        { type: "qcm", q: "Le conducteur vert-jaune sert…", options: ["de phase quand on manque de fil", "de neutre", "uniquement de conducteur de protection (PE)", "de retour lampe"], answer: 2 },
        { type: "qcm", q: "À quelle hauteur place-t-on les commandes manuelles (interrupteurs) ?", options: ["Entre 0,30 m et 0,90 m", "Entre 0,90 m et 1,30 m", "Entre 1,30 m et 1,80 m", "À 2 m"], answer: 1 },
        { type: "num", research: "Recherche dans le guide NF C 15-100 Schneider (PDF du dossier ressources, sur le PC).",
          q: "Quelle est la largeur minimale de l'ETEL (espace technique électrique du logement) ?", answer: 600, tol: 0, unit: "mm",
          explain: "600 mm de large, du sol au plafond, près de l'entrée." }
      ]
    },
    {
      id: "m4", num: 4, titre: "Les bases de la NF C 15-100", duree: "50 min", competences: "CO1 · CO2",
      intro: "Équipement minimal du logement, sections et calibres, protection différentielle, salle d'eau, GTL et terre.",
      source: "Présentation, partie 04 (diapositives 36 à 45) · guides NF C 15-100 Schneider, Hager, Legrand",
      ex: [
        { type: "gen", gen: "socles", n: 3, q: "Calcule le nombre minimal de socles 16 A dans le séjour." },
        { type: "match", q: "Associe chaque circuit à sa section et à son disjoncteur.", pairs: [
          ["Prises 16 A (8 socles maxi)", "1,5 mm² – 16 A"],
          ["Prises 16 A (12 socles maxi)", "2,5 mm² – 20 A"],
          ["Lave-linge", "2,5 mm² – 20 A"],
          ["Plaque de cuisson monophasée", "6 mm² – 32 A"],
          ["VMC, fil pilote", "1,5 mm² – 2 A"]] },
        { type: "qcm", q: "Combien de points d'éclairage au maximum sur un même circuit ?", options: ["5", "8", "10", "12"], answer: 1 },
        { type: "qcm", q: "Combien de circuits au maximum sous un même interrupteur différentiel ?", options: ["4", "6", "8", "12"], answer: 2 },
        { type: "qcm", q: "Quels circuits doivent obligatoirement être sous un interrupteur différentiel de type A ?", options: ["Éclairage et prises", "Plaque de cuisson et lave-linge", "VMC et volets roulants", "Chauffe-eau et radiateurs"], answer: 1,
          explain: "Type A : plaque de cuisson, lave-linge (et prise de recharge du véhicule électrique)." },
        { type: "gen", gen: "idcal", n: 2, q: "Choisis le calibre de l'interrupteur différentiel." },
        { type: "match", q: "Salle d'eau : associe chaque volume à ce qu'on peut y installer.", pairs: [
          ["Volume 0 (dans la baignoire)", "IPX7, uniquement TBTS 12 V"],
          ["Volume 1 (au-dessus, jusqu'à 2,25 m)", "IPX4, TBTS ou chauffe-eau sous DDR 30 mA"],
          ["Volume 2 (0,60 m autour)", "IPX4, classe II sous DDR 30 mA"],
          ["Hors volumes", "Prises de courant et commandes"]] },
        { type: "tf", q: "ETEL, GTL et tableau : vrai ou faux ?", items: [
          ["Le tableau doit garder 20 % de modules libres.", true],
          ["On peut installer l'ETEL dans la salle de bain.", false],
          ["Un passage libre d'au moins 70 cm est nécessaire devant la GTL.", true],
          ["Dans la GTL, le tableau de communication se place au-dessus du tableau de répartition.", false],
          ["Chaque circuit doit être repéré au tableau.", true]],
          explain: "De haut en bas dans la GTL : AGCP, tableau de répartition, tableau de communication." },
        { type: "num", q: "Résistance de terre maximale avec un AGCP 500 mA :", answer: 100, tol: 0, unit: "Ω",
          explain: "R × 0,5 A ≤ 50 V, donc R ≤ 100 Ω." },
        { type: "pick", q: "Cette liste de matériel contient des erreurs. Coche les lignes qui ne respectent pas la norme.", items: [
          ["2 interrupteurs différentiels 40 A 30 mA, tous les deux de type AC", true],
          ["Lave-linge : circuit dédié en 2,5 mm² protégé par un disjoncteur 20 A", false],
          ["Plaque de cuisson : câble 3G2,5 mm² et disjoncteur 20 A", true],
          ["VMC : 1,5 mm² protégé par un disjoncteur 2 A", false],
          ["Éclairage du séjour : 9 points lumineux sur le même circuit", true],
          ["Tableau avec 20 % de modules libres", false],
          ["Prise de courant de la salle d'eau placée dans le volume 2", true],
          ["Chambre : 3 socles 16 A", false]],
          explain: "Il faut au moins un ID de type A ; plaque en 6 mm² / 32 A ; 8 points maxi par circuit ; prises hors volumes." }
      ]
    },
    {
      id: "m5", num: 5, titre: "Étude de cas : le studio de Léa", duree: "40 min", competences: "CO1 · CO2 · CO8",
      intro: "Léa fait rénover son studio. Pièces : séjour-chambre de 22 m², cuisine fermée de 7 m², salle d'eau de 4,5 m², entrée de 2 m² et WC séparé. Ton chef d'équipe te demande de préparer le chantier.",
      source: "Toute la présentation · guides NF C 15-100",
      ex: [
        { type: "num", q: "Combien de socles 16 A au minimum dans le séjour-chambre de 22 m² ?", answer: 6, tol: 0, unit: "socles",
          explain: "1 par tranche de 4 m², minimum 5 : 22 / 4 = 5,5, arrondi à 6." },
        { type: "num", q: "Combien de socles 16 A au minimum dans la cuisine de 7 m² ?", answer: 6, tol: 0, unit: "socles",
          explain: "Cuisine de plus de 4 m² : 6 socles, dont 4 au-dessus du plan de travail." },
        { type: "num", q: "Combien de socles 16 A au minimum pour tout le studio (séjour, cuisine, salle d'eau, entrée, WC) ?", answer: 13, tol: 0, unit: "socles",
          explain: "6 + 6 + 1 (salle d'eau, hors volumes) + 0 (entrée ≤ 4 m²) + 0 (WC) = 13." },
        { type: "qcm", q: "Une rangée du tableau alimente : convecteurs 20 A, chauffe-eau 20 A, prises 20 A, éclairage 16 A. Quel interrupteur différentiel choisir ?", options: ["25 A", "40 A", "63 A", "80 A"], answer: 2,
          explain: "20 + 20 + 0,5 × (20 + 16) = 58 A → calibre normalisé immédiatement supérieur : 63 A." },
        { type: "qcm", q: "L'immeuble de Léa date de 1975. Avant de faire une saignée, tu dois…", options: ["Mettre des gants isolants", "Demander le repérage amiante", "Prévenir le CONSUEL", "Couper l'eau"], answer: 1,
          explain: "Bâtiment d'avant 1997 : repérage amiante obligatoire avant de percer ou de saigner." },
        { type: "open", q: "Méthode du dossier en 15 minutes : résume en 3 phrases ce que tu vas faire sur ce chantier, avec quoi et dans quel ordre.", hint: "Survoler, repérer, surligner, questionner, résumer." },
        { type: "task", phone: true, q: "Compte rendu oral (CO8) avec ton téléphone", steps: [
          "Ouvre le dictaphone de ton téléphone.",
          "Enregistre un compte rendu de 2 minutes de ce TP comme si tu parlais à ton chef d'équipe.",
          "Point 1 : ce que j'ai fait.", "Point 2 : ce qui reste à faire.", "Point 3 : les problèmes rencontrés.",
          "Point 4 : les décisions à prendre par le chef d'équipe.", "Point 5 : la sécurité et l'état du poste.",
          "Envoie l'enregistrement à ton formateur (ou fais-le écouter en fin de séance)."], note: "Durée de ton enregistrement et remarques" }
      ]
    }
  ]
};
