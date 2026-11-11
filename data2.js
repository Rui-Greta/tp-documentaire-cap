/* TP documentaire n°2 – CAP Électricien – Implanter et câbler l'éclairage (jeudis 5 à 8)
   Contenu des missions. Types : qcm, tf (vrai/faux), match (associer), order (remettre dans l'ordre),
   num (réponse numérique), gen (exercice généré aléatoirement), pick (repérer les erreurs), open (réponse libre), task (tâche avec le téléphone). */
window.TPDOC = {
  logo: "logo_greta.png",
  id: "cap-elec-tpdoc2-v1",
  num: 2,
  titre: "Implanter et câbler l'éclairage",
  sousTitre: "TP documentaire n°2 · CAP Électricien · Jeudis 5 à 8",
  duree: "3 h 30",
  lead: "Tu utilises la présentation « Implanter et câbler l'éclairage » (sur le PC), les notices des fabricants trouvées sur internet et ton téléphone.",
  missions: [
    {
      id: "m1", num: 1, titre: "Organiser son poste et implanter", duree: "45 min", competences: "CO2 · CO3",
      intro: "L'organisation du poste, les hauteurs, le traçage et les canalisations : encastrées en cloison sèche (ICTA) ou apparentes (goulotte, IRL).",
      source: "Présentation, partie 01 (diapositives 3 à 15)",
      ex: [
        { type: "order", q: "Avant de percer le premier trou : remets les 5 étapes dans l'ordre.", items: ["Lire le plan et le schéma", "Approvisionner le matériel", "Préparer l'outillage", "Sécuriser le poste", "Ordonner le travail"] },
        { type: "order", q: "Remets les étapes du chantier dans l'ordre.", items: ["Traçage", "Pose des supports", "Pose des canalisations", "Tirage des conducteurs", "Raccordement"] },
        { type: "tf", q: "Poste organisé ou poste qui pénalise : vrai ou faux ?", items: [
          ["Je range mon matériel par circuit dans des bacs.", true],
          ["Je pose mes outils au sol pour aller plus vite.", false],
          ["Je trie mes chutes de câble au fur et à mesure.", true],
          ["Je peux commencer le câblage avant d'avoir fini le traçage.", false],
          ["Le jury observe l'organisation du poste dès les premières minutes.", true]],
          explain: "Outils dans la caisse ou sur une servante ; traçage d'abord ; l'organisation du poste est évaluée (CO2)." },
        { type: "match", q: "Associe chaque équipement à sa hauteur réglementaire.", pairs: [
          ["Commandes manuelles (interrupteurs, BP)", "Entre 0,90 m et 1,30 m"],
          ["Axe des socles de prise < 32 A", "Au moins 5 cm du sol fini"],
          ["Axe des socles 32 A", "Au moins 12 cm du sol fini"],
          ["Organes de manœuvre du tableau", "Entre 0,90 m et 1,80 m"]] },
        { type: "num", q: "Sur ton box, à quelle hauteur est l'axe des commandes (interrupteurs, BP) ?", answer: 1100, tol: 0, unit: "mm",
          explain: "Axe à 1 100 mm : c'est dans la plage 0,90 m – 1,30 m." },
        { type: "num", q: "Sur ton box, à quelle hauteur est l'axe des points lumineux (DCL) ?", answer: 1780, tol: 0, unit: "mm" },
        { type: "match", q: "Associe chaque canalisation à son usage.", pairs: [
          ["Conduit ICTA (annelé souple)", "Encastré : cloisons, doublages, dalles"],
          ["Conduit IRL (rigide lisse)", "Apparent, cintré au ressort"],
          ["Goulotte", "Apparent, pour plusieurs circuits"],
          ["Câble U-1000 R2V sur colliers", "Apparent ou en vide technique"]] },
        { type: "order", q: "Encastrer une boîte en cloison sèche : remets les gestes dans l'ordre.", items: ["Repérer les montants de l'ossature", "Percer à la scie cloche", "Passer l'ICTA au tire-fil", "Engager l'ICTA dans la boîte", "Poser la boîte affleurante et serrer les griffes"] },
        { type: "num", q: "Quel diamètre de scie cloche pour une boîte cloison sèche Ø 67 mm ?", answer: 68, tol: 0, unit: "mm" },
        { type: "qcm", q: "La « règle du tiers » dit que dans un conduit, les conducteurs…", options: ["occupent au maximum un tiers de la section", "sont au maximum 3", "laissent 3 cm de mou", "sont fixés tous les 30 cm"], answer: 0,
          explain: "Les conducteurs n'occupent pas plus d'un tiers de la section du conduit : ils se tirent facilement et chauffent moins." },
        { type: "order", q: "Façonner un conduit IRL : remets les étapes dans l'ordre.", items: ["Mesurer sur le box", "Couper d'équerre et ébavurer", "Cintrer avec le ressort", "Assembler manchons et coudes", "Fixer avec des colliers"] },
        { type: "pick", q: "Ce stagiaire a fait son implantation. Coche les erreurs.", items: [
          ["Un ICTA par circuit", false],
          ["Un perçage fait sur un montant de l'ossature", true],
          ["Une goulotte posée en biais pour gagner du câble", true],
          ["15 cm d'attente laissés en sortie d'ICTA", false],
          ["Un conduit ICTA posé en apparent sur la face C", true],
          ["Des fixations de goulotte environ tous les 50 cm", false],
          ["Les courants faibles dans le même conduit que l'éclairage", true],
          ["Une boîte de dérivation accessible, couvercle affleurant", false]],
          explain: "Jamais de perçage sur un montant ; canalisations horizontales ou verticales ; ICTA jamais en apparent ; courants faibles séparés." },
        { type: "task", phone: true, q: "Recherche : la notice d'une boîte cloison sèche", steps: [
          "Sur ton téléphone, cherche la fiche produit d'une boîte d'encastrement pour cloison sèche Ø 67 (Legrand Batibox, Schneider Multifix, Hager…).",
          "Fais une capture d'écran de la fiche.",
          "Note ci-dessous la marque, le diamètre de perçage et la profondeur de la boîte."], note: "Marque, diamètre de perçage, profondeur" }
      ]
    },
    {
      id: "m2", num: 2, titre: "Conducteurs, raccordement et simple allumage", duree: "45 min", competences: "CO3",
      intro: "Choisir le bon conducteur, respecter les couleurs, dénuder et raccorder sans défaut, câbler un simple allumage et une prise commandée.",
      source: "Présentation, partie 02 (diapositives 16 à 25)",
      ex: [
        { type: "match", q: "Associe chaque conducteur à sa constitution ou à son usage.", pairs: [
          ["H07V-U", "Âme rigide massive, toujours sous conduit"],
          ["H07V-R", "Âme rigide câblée, fortes sections"],
          ["H07V-K", "Âme souple, câblage de tableau avec embout"],
          ["U-1000 R2V", "Câble avec gaine, sur colliers ou en goulotte"]] },
        { type: "match", q: "À quoi sert chaque couleur ?", pairs: [
          ["Vert-jaune", "Conducteur de protection (PE) uniquement"],
          ["Bleu clair", "Neutre"],
          ["Rouge, noir, marron…", "Phase, retours lampe, navettes"]] },
        { type: "qcm", q: "Quelle section pour un circuit d'éclairage ?", options: ["1 mm²", "1,5 mm²", "2,5 mm²", "6 mm²"], answer: 1 },
        { type: "qcm", q: "Quelle section pour un circuit de 12 socles de prise 16 A ?", options: ["1 mm²", "1,5 mm²", "2,5 mm²", "6 mm²"], answer: 2 },
        { type: "order", q: "Dénuder correctement : remets les étapes dans l'ordre.", items: ["Mesurer la longueur avec le gabarit du fabricant", "Dénuder avec la pince réglée à la section", "Contrôler : âme intacte, coupe nette", "Souple sur borne à vis : sertir un embout"] },
        { type: "tf", q: "Bornes automatiques et bornes à vis : vrai ou faux ?", items: [
          ["Le conducteur rigide s'insère jusqu'en butée dans une borne automatique.", true],
          ["Un peu de cuivre visible à l'entrée de la borne, ce n'est pas grave.", false],
          ["Pour retirer un conducteur d'une borne automatique, on tire fort dessus.", false],
          ["Un conducteur souple serré sous une vis reçoit un embout serti.", true],
          ["On serre une borne à vis au couple indiqué dans la notice.", true],
          ["Une âme entaillée au dénudage est sanctionnée à l'EP1.", true]],
          explain: "Aucun cuivre visible ; on libère une borne automatique avec son levier ou son poussoir ; une âme entaillée peut casser ou chauffer." },
        { type: "qcm", q: "Où se font les connexions entre conducteurs ?", options: ["Dans le conduit, avec du ruban isolant", "Dans une boîte ou un appareil, accessible", "Derrière le doublage, pour être propre", "N'importe où si la borne est de qualité"], answer: 1 },
        { type: "num", q: "Quelle longueur de mou laisses-tu dans les boîtes ? Donne une valeur de la fourchette du cours.", answer: 17.5, tol: 2.5, unit: "cm",
          explain: "15 à 20 cm de mou : de quoi reprendre un raccordement." },
        { type: "qcm", img: "simple_allumage.png", alt: "Schéma multifilaire du simple allumage", q: "Observe le schéma : où va le neutre ?", options: ["Sur l'interrupteur S1", "Directement au point lumineux E1", "Sur le PE", "Il n'est pas raccordé"], answer: 1,
          explain: "Le neutre va directement au point lumineux ; l'interrupteur coupe la phase." },
        { type: "qcm", q: "Un interrupteur peut commander au maximum…", options: ["1 socle", "2 socles, dans la même pièce", "4 socles", "8 socles"], answer: 1,
          explain: "Au-delà de 2 socles commandés : télérupteur ou contacteur." },
        { type: "tf", q: "La prise commandée : vrai ou faux ?", items: [
          ["Elle est alimentée par le circuit d'éclairage.", true],
          ["Un socle commandé compte comme un point d'éclairage.", true],
          ["Elle compte dans le nombre minimal de socles de la pièce.", false]] },
        { type: "pick", q: "Contrôle visuel du câblage d'un camarade : coche les défauts.", items: [
          ["L'interrupteur coupe le neutre", true],
          ["Le PE est raccordé à chaque socle", false],
          ["Un vert-jaune sert de retour lampe", true],
          ["Les prises sont câblées en 2,5 mm²", false],
          ["On voit 3 mm de cuivre à l'entrée d'une borne", true],
          ["Les départs sont repérés dans la GTL", false],
          ["Deux conducteurs souples sans embout sous la même vis", true],
          ["Les chutes de cuivre sont dans le bac de tri", false]],
          explain: "L'interrupteur coupe la phase ; vert-jaune = PE uniquement ; aucun cuivre visible ; embout sur les souples." },
        { type: "task", phone: true, q: "Recherche : la notice d'une borne de connexion", steps: [
          "Sur ton téléphone, cherche la notice d'une borne à levier (par exemple WAGO série 221).",
          "Trouve la longueur de dénudage et les sections admises.",
          "Note-les ci-dessous."], note: "Borne, longueur de dénudage, sections admises" }
      ]
    },
    {
      id: "m3", num: 3, titre: "Va-et-vient et double allumage", duree: "40 min", competences: "CO1 · CO3",
      intro: "Le rôle du commun, des navettes et du retour lampe, la table de fonctionnement, le double allumage et la méthode du schéma développé.",
      source: "Présentation, partie 03 (diapositives 26 à 32)",
      ex: [
        { type: "qcm", img: "tp2_va-et-vient.png", alt: "Schéma multifilaire du va-et-vient", q: "Observe le schéma : sur quelle borne de S1 arrive la phase ?", options: ["Sur la navette 1", "Sur la navette 2", "Sur le commun", "Sur la borne de terre"], answer: 2 },
        { type: "num", img: "tp2_va-et-vient.png", alt: "Schéma multifilaire du va-et-vient", q: "Combien de conducteurs relient S1 et S2 (sans compter le PE) ?", answer: 2, tol: 0, unit: "conducteurs",
          explain: "Les deux navettes." },
        { type: "match", q: "Associe chaque conducteur à son rôle.", pairs: [
          ["Commun de S1", "Reçoit la phase"],
          ["Navettes", "Relient les deux inverseurs"],
          ["Commun de S2", "Départ du retour lampe"],
          ["Neutre", "Va directement au point lumineux"]] },
        { type: "gen", gen: "vav", n: 4, q: "Table de fonctionnement : la lampe est-elle allumée ou éteinte ?" },
        { type: "match", q: "Associe chaque erreur à sa conséquence.", pairs: [
          ["La phase arrive sur une navette", "La lampe ne marche que dans certaines positions"],
          ["Navettes croisées", "Ça fonctionne, mais le dépannage est plus difficile"],
          ["Le neutre passe par les inverseurs", "Non conforme : le neutre va directement à la lampe"]] },
        { type: "qcm", q: "Sur un interrupteur double allumage, la phase arrive…", options: ["sur chaque retour lampe", "sur la borne commune", "sur le neutre", "sur une navette"], answer: 1 },
        { type: "num", q: "Combien de retours lampe partent d'un interrupteur double allumage ?", answer: 2, tol: 0, unit: "retours",
          explain: "Un retour vers chaque point lumineux." },
        { type: "order", q: "Dessiner un schéma développé : remets les 5 étapes dans l'ordre.", items: ["Tracer les rails : phase en haut, neutre en bas", "Placer les récepteurs près du neutre", "Placer les commandes entre la phase et le récepteur", "Tracer les liaisons et les points de dérivation", "Repérer les appareils, sections et calibres"] },
        { type: "match", q: "Quel montage choisir ?", pairs: [
          ["1 lampe commandée d'un seul endroit", "Simple allumage"],
          ["1 lampe commandée de 2 endroits", "Va-et-vient"],
          ["2 lampes commandées séparément depuis la même porte", "Double allumage"],
          ["1 lampe commandée de 4 endroits", "Télérupteur et boutons-poussoirs"]] },
        { type: "open", q: "Explique en 3 phrases, avec tes mots, comment fonctionne un va-et-vient.", hint: "Commun, navettes, même navette = lampe allumée." }
      ]
    },
    {
      id: "m4", num: 4, titre: "Le télérupteur", duree: "45 min", competences: "CO3 · CO8",
      intro: "Le principe du télérupteur, le circuit de commande et le circuit de puissance, les bornes A1-A2 et 1-2, les boutons-poussoirs lumineux.",
      source: "Présentation, partie 04 (diapositives 33 à 40) · notice d'un télérupteur (internet)",
      ex: [
        { type: "order", q: "Remets le fonctionnement du télérupteur dans l'ordre.", items: ["Un appui sur un BP alimente brièvement la bobine", "Le contact 1-2 change de position", "BP relâché, le contact garde sa position"] },
        { type: "match", q: "Circuit de commande ou circuit de puissance ?", pairs: [
          ["Les boutons-poussoirs", "Circuit de commande"],
          ["La bobine A1-A2", "Circuit de commande"],
          ["Le contact 1-2", "Circuit de puissance"],
          ["Les points lumineux", "Circuit de puissance"]] },
        { type: "qcm", img: "tp2_telerupteur.png", alt: "Schéma multifilaire du télérupteur commandé par 3 BP", q: "Observe le schéma : comment sont montés S1, S2 et S3 ?", options: ["En série", "En parallèle", "En série-parallèle", "Sur le neutre"], answer: 1,
          explain: "N'importe quel BP peut alimenter la bobine." },
        { type: "qcm", img: "tp2_telerupteur.png", alt: "Schéma multifilaire du télérupteur commandé par 3 BP", q: "Sur ce schéma, la borne A2 de la bobine est reliée…", options: ["à la phase", "au neutre", "au retour lampe", "au PE"], answer: 1 },
        { type: "qcm", img: "tp2_telerupteur.png", alt: "Schéma multifilaire du télérupteur commandé par 3 BP", q: "Sur ce schéma, que représente le trait pointillé entre TL1 et le contact ?", options: ["Un conducteur de terre", "Un câble enterré", "La liaison mécanique bobine → contact", "Une option à ne pas câbler"], answer: 2 },
        { type: "gen", gen: "tl", n: 3, q: "Une impulsion pour allumer, une impulsion pour éteindre : la lampe est-elle allumée ou éteinte ?" },
        { type: "tf", q: "Le télérupteur : vrai ou faux ?", items: [
          ["Le télérupteur garde sa position en mémoire.", true],
          ["La bobine est alimentée tant que la lampe est allumée.", false],
          ["Pour ajouter un BP, on le raccorde en parallèle sur les autres.", true],
          ["Les BP d'un télérupteur sont à ouverture.", false],
          ["Un télérupteur se repère TL sur le schéma et au tableau.", true]],
          explain: "La bobine n'est alimentée que pendant l'appui ; les BP sont à fermeture." },
        { type: "qcm", q: "Quand choisis-tu un télérupteur plutôt qu'un va-et-vient ?", options: ["Pour une seule commande", "Au-delà de 2 points de commande", "Uniquement dans une salle d'eau", "Pour une prise de courant"], answer: 1 },
        { type: "tf", q: "Les boutons-poussoirs lumineux : vrai ou faux ?", items: [
          ["Leur voyant est en parallèle sur le contact du BP.", true],
          ["On peut en mettre autant qu'on veut sur un télérupteur.", false],
          ["Le nombre maximal est donné par la notice du fabricant.", true]],
          explain: "Avec trop de BP lumineux, la bobine vibre ou reste excitée." },
        { type: "task", phone: true, q: "Recherche : la notice d'un télérupteur modulaire", steps: [
          "Sur ton téléphone, cherche la notice d'un télérupteur modulaire 16 A (Legrand, Schneider ou Hager).",
          "Trouve le nombre maximal de BP lumineux admis.",
          "Note la référence et ce nombre ci-dessous."], note: "Marque, référence, nombre maximal de BP lumineux" },
        { type: "task", phone: true, q: "Oral de 3 minutes (CO8) avec ton téléphone", steps: [
          "Ouvre le dictaphone de ton téléphone.",
          "Explique le montage du TP4 comme si tu parlais au jury, en 3 minutes maximum.",
          "Point 1 : le rôle de chaque appareil (BP, TL1, lampes, Q1).",
          "Point 2 : le chemin du courant dans le circuit de commande.",
          "Point 3 : le chemin du courant dans le circuit de puissance.",
          "Point 4 : ce qui se passe à chaque impulsion.",
          "Envoie l'enregistrement à ton formateur (ou fais-le écouter en fin de séance)."], note: "Durée de ton enregistrement et remarques" }
      ]
    },
    {
      id: "m5", num: 5, titre: "Étude de cas : l'appartement de Karim", duree: "25 min", competences: "CO1 · CO2 · CO8",
      intro: "Karim fait rénover l'éclairage de son appartement. Couloir : 3 portes (entrée, séjour, chambre) et 2 plafonniers. Séjour : 1 plafonnier commandé depuis ses 2 portes. Chambre : un plafonnier et une prise pour lampe de chevet, commandés séparément depuis la porte. Ton chef d'équipe te demande de choisir les montages.",
      source: "Toute la présentation",
      ex: [
        { type: "match", q: "Quel montage pour chaque pièce ?", pairs: [
          ["Couloir (3 portes)", "Télérupteur et 3 BP"],
          ["Séjour (2 portes)", "Va-et-vient"],
          ["Chambre (plafonnier + prise commandée)", "Double allumage"]] },
        { type: "num", q: "Séjour : combien de conducteurs entre les deux inverseurs (sans le PE) ?", answer: 2, tol: 0, unit: "conducteurs" },
        { type: "qcm", q: "Chambre : la prise commandée de la lampe de chevet est alimentée par…", options: ["le circuit des prises 16 A", "le circuit d'éclairage", "un circuit spécialisé 20 A", "le circuit du chauffage"], answer: 1 },
        { type: "qcm", q: "Karim voudrait 3 prises commandées par le même interrupteur dans le séjour. Tu lui réponds…", options: ["C'est possible avec un interrupteur double", "C'est possible si elles sont en 2,5 mm²", "Au-delà de 2 socles, il faut un télérupteur ou un contacteur", "C'est interdit dans un séjour"], answer: 2 },
        { type: "qcm", q: "Karim veut un 4e point de commande dans le couloir. Que fais-tu ?", options: ["Je change le télérupteur", "J'ajoute un BP en parallèle", "J'ajoute un BP en série", "J'ajoute un inverseur"], answer: 1 },
        { type: "pick", q: "Liste de matériel préparée pour ce chantier : coche les erreurs.", items: [
          ["2 inverseurs pour le séjour", false],
          ["3 boutons-poussoirs à ouverture pour le couloir", true],
          ["1 télérupteur modulaire pour le tableau", false],
          ["Du vert-jaune pour les navettes du séjour", true],
          ["H07V-U 1,5 mm² pour l'éclairage", false],
          ["Conduit ICTA pour une pose en apparent dans le couloir", true]],
          explain: "BP à fermeture ; vert-jaune = PE uniquement ; en apparent : IRL ou goulotte." },
        { type: "open", q: "Écris un message de 3 à 4 phrases à ton chef d'équipe pour lui expliquer les montages que tu as choisis chez Karim et pourquoi.", hint: "Pièce par pièce : le montage, le nombre de points de commande, le matériel principal." }
      ]
    }
  ]
};
