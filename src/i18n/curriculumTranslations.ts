import type {Lesson} from '../types/trading';
import type {Language} from './types';

export type LessonOverlay = Pick<Lesson, 'moduleTitle' | 'title' | 'summary' | 'sections'> & {
  quiz: Array<{
    id: string;
    question: string;
    options: string[];
    explanation: string;
  }>;
};

export const INSTRUMENT_NOTES_I18N: Record<Exclude<Language, 'en'>, Record<string, string>> = {
  fr: {
    'BTC/USD': 'La plus grande cryptomonnaie. Très liquide, négociée 24h/24 et 7j/7.',
    'ETH/USD': 'Principal réseau de contrats intelligents. Suit souvent le Bitcoin avec des variations plus amples.',
    'SOL/USD': 'Blockchain rapide connue pour sa forte volatilité quotidienne — gardez des tailles modestes.',
    'XRP/USD': 'Jeton de paiements transfrontaliers avec un prix unitaire bas et des seuils ronds nets.',
    'ADA/USD': 'Actif blockchain adapté pour s’entraîner aux mouvements intermédiaires.',
    'AVAX/USD': 'Plateforme réactive lors des grandes tendances du marché crypto.',
    'EUR/USD': 'La paire de devises la plus échangée au monde. Spreads très faibles et mouvements fluides.',
    'GBP/USD': 'Surnommée « Cable ». Plus active pendant l’ouverture conjointe de Londres et New York.',
    'USD/JPY': 'Attention : 1 pip correspond à 0,01 (2e décimale) au lieu de 0,0001.',
    'AUD/USD': 'Paire liée aux matières premières, idéale pour pratiquer le suivi de tendance.',
    'USD/CHF': 'Paire européenne refuge qui évolue souvent à l’inverse de l’EUR/USD.',
    'EUR/GBP': 'Paire européenne stable avec des amplitudes journalières modérées pour débuter sereinement.',
  },
  es: {
    'BTC/USD': 'La mayor criptomoneda por capitalización. Alta liquidez, opera 24/7.',
    'ETH/USD': 'Red líder de contratos inteligentes. Suele moverse junto a Bitcoin con mayor variación porcentual.',
    'SOL/USD': 'Blockchain rápida conocida por su fuerte volatilidad diaria — usa montos pequeños.',
    'XRP/USD': 'Token de pagos internacionales con precio unitario bajo y niveles redondos claros.',
    'ADA/USD': 'Activo blockchain útil para practicar operaciones de varios días.',
    'AVAX/USD': 'Plataforma que reacciona con fuerza en los giros del mercado cripto.',
    'EUR/USD': 'El par de divisas más operado del mundo. Spreads mínimos y movimientos ordenados.',
    'GBP/USD': 'Conocido como «Cable». Más activo durante el cruce de Londres y Nueva York.',
    'USD/JPY': 'Nota: 1 pip equivale a 0.01 (2.º decimal) en lugar de 0.0001.',
    'AUD/USD': 'Par ligado a materias primas, muy usado para aprender a seguir tendencias.',
    'USD/CHF': 'Par refugio europeo que a menudo se mueve en dirección opuesta al EUR/USD.',
    'EUR/GBP': 'Par cruzado europeo estable con rangos diarios moderados para practicar con calma.',
  },
  ar: {
    'BTC/USD': 'أكبر عملة رقمية من حيث القيمة السوقية. سيولة عالية وتداول متواصل ٢٤/٧.',
    'ETH/USD': 'شبكة العقود الذكية الرائدة. غالباً ما تتحرك مع البيتكوين بتقلبات نسبية أكبر.',
    'SOL/USD': 'شبكة سريعة معروفة بتقلباتها اليومية القوية — يُنصح بأحجام صفقات أصغر.',
    'XRP/USD': 'عملة مدفوعات دولية بسعر منخفض للوحدة ومستويات دعم واضحة.',
    'ADA/USD': 'أصل رقمي مناسب للتدرّب على التداول المتوسط المدى.',
    'AVAX/USD': 'منصة تتفاعل بقوة مع تحركات الزخم العامة في سوق العملات الرقمية.',
    'EUR/USD': 'أكثر زوج عملات تداولاً في العالم. أقل سبريد وحركات سعرية منظمة للمبتدئين.',
    'GBP/USD': 'يُعرف باسم «الكيبل». يزداد نشاطه خلال تداخل جلستي لندن ونيويورك.',
    'USD/JPY': 'ملاحظة: النقطة الواحدة (Pip) هي 0.01 (الخانة العشرية الثانية) بدلاً من 0.0001.',
    'AUD/USD': 'زوج مرتبط بالسلع يُستخدم كثيراً لتعلّم متابعة الاتجاهات.',
    'USD/CHF': 'زوج أوروبي ملاذ آمن يتحرك غالباً عكس اتجاه EUR/USD.',
    'EUR/GBP': 'زوج أوروبي هادئ بنطاق حركة يومي معتدل ومناسب للتمرين الهادئ.',
  },
};

export const CURRICULUM_I18N: Record<Exclude<Language, 'en'>, Record<string, LessonOverlay>> = {
  fr: {
    'lesson-1': {
      moduleTitle: 'Module 1 : Bases du Trading',
      title: 'Achat, vente et fonctionnement du Spread',
      summary: 'Comprenez les prix Bid et Ask, pourquoi un trade démarre légèrement négatif et comment choisir un marché liquide.',
      sections: [
        {
          heading: 'Deux prix à l’écran : Bid et Ask',
          body: 'Sur Bitcoin comme sur l’EUR/USD, deux prix existent en même temps : le Bid (prix auquel vous pouvez vendre immédiatement) et l’Ask (prix auquel vous achetez immédiatement). L’Ask est toujours légèrement supérieur au Bid.',
          keyTakeaway: 'Vous achetez au prix Ask et vous vendez au prix Bid.',
        },
        {
          heading: 'Qu’est-ce que le Spread ?',
          body: 'L’écart entre l’Ask et le Bid s’appelle le Spread. C’est comme un bureau de change : il reprend vos devises un peu moins cher qu’il ne les vend. Les marchés populaires comme BTC/USD et EUR/USD ont des spreads minuscules, ce qui réduit vos coûts.',
          keyTakeaway: 'Un petit spread réduit vos frais d’entrée et accélère l’atteinte du seuil de rentabilité.',
        },
      ],
      quiz: [
        {
          id: 'l1-q1',
          question: 'Si EUR/USD affiche un Bid à 1,0580 et un Ask à 1,0582, à quel prix achetez-vous tout de suite ?',
          options: ['1,0580 (le Bid)', '1,0582 (l’Ask)', '1,0581 (le milieu)', 'Le prix d’hier'],
          explanation: 'Lorsque vous achetez immédiatement, vous payez le prix vendeur (Ask) à 1,0582.',
        },
        {
          id: 'l1-q2',
          question: 'Pourquoi un trade tout juste ouvert affiche-t-il souvent un léger montant négatif ?',
          options: [
            'Une erreur de calcul du serveur',
            'À cause du spread entre l’Ask d’achat et le Bid de revente',
            'Les prix chutent toujours après un achat',
            'Vous perdez automatiquement 10 % à l’ouverture',
          ],
          explanation: 'Vous achetez à l’Ask et votre valeur de sortie actuelle est mesurée au Bid ; le spread est ce petit écart initial.',
        },
        {
          id: 'l1-q3',
          question: 'Quel marché offre généralement le spread le plus faible pour débuter ?',
          options: [
            'Les paires très actives comme EUR/USD ou BTC/USD',
            'Les jetons rares très peu échangés',
            'Les marchés fermés un jour férié',
            'Tous les actifs ont exactement le même spread',
          ],
          explanation: 'Une forte liquidité rapproche acheteurs et vendeurs et réduit le spread.',
        },
        {
          id: 'l1-q4',
          question: 'Si vous pensez qu’un prix va BAISSER et voulez en profiter, que faites-vous ?',
          options: ['Acheter (Long)', 'Vendre (Short)', 'Attendre un spread plus large', 'Fermer le compte'],
          explanation: 'Vendre (Short) permet de gagner lorsque le prix baisse par rapport à votre entrée.',
        },
      ],
    },
    'lesson-2': {
      moduleTitle: 'Module 1 : Bases du Trading',
      title: 'Ordres Market, Limit, Stop-Loss & Take-Profit',
      summary: 'Maîtrisez les quatre types d’ordres essentiels pour ne jamais entrer au hasard ni oublier votre protection.',
      sections: [
        {
          heading: 'Ordre au Marché (Market) vs Ordre Limite',
          body: 'Un ordre Market exécute l’achat ou la vente immédiatement au meilleur prix disponible. Un ordre Limit vous permet de fixer votre prix : « Acheter du Bitcoin seulement s’il descend à 88 000 $ ». Vous contrôlez le prix, mais l’ordre ne se déclenche que si le marché l’atteint.',
          keyTakeaway: 'Utilisez Market pour entrer tout de suite ; utilisez Limit pour attendre un meilleur prix.',
        },
        {
          heading: 'Votre filet de sécurité : Stop-Loss & Take-Profit',
          body: 'Le Stop-Loss clôture automatiquement votre trade si le prix part dans le mauvais sens, empêchant une petite erreur de devenir une grosse perte. Le Take-Profit encaisse automatiquement vos gains dès que votre objectif est atteint.',
          keyTakeaway: 'N’ouvrez jamais un trade sans savoir où couper si vous avez tort (Stop-Loss).',
        },
      ],
      quiz: [
        {
          id: 'l2-q1',
          question: 'Le Bitcoin vaut 91 000 $ et vous voulez acheter uniquement s’il baisse à 89 500 $. Quel ordre placer ?',
          options: ['Ordre d’achat Market', 'Ordre d’achat Limite à 89 500 $', 'Stop-Loss', 'Ordre de vente Market'],
          explanation: 'Un achat Limite attend sous le prix actuel et s’exécute seulement si le cours atteint 89 500 $ ou moins.',
        },
        {
          id: 'l2-q2',
          question: 'Quel est le rôle principal d’un Stop-Loss ?',
          options: [
            'Garantir un gain sur chaque trade',
            'Clôturer automatiquement une position perdante au seuil fixé pour garder la perte petite',
            'Doubler automatiquement votre mise',
            'Mettre le graphique en pause',
          ],
          explanation: 'Le Stop-Loss agit comme une ceinture de sécurité qui plafonne votre perte maximale.',
        },
        {
          id: 'l2-q3',
          question: 'Vous achetez ETH à 3 000 $ avec un Take-Profit à 3 300 $. Que se passe-t-il si ETH atteint 3 300 $ en votre absence ?',
          options: [
            'Rien sans clic manuel',
            'Le trade se clôture automatiquement vers 3 300 $ et sécurise le gain',
            'Votre Stop-Loss est supprimé',
            'Le trade reste ouvert indéfiniment',
          ],
          explanation: 'Le Take-Profit exécute automatiquement la sortie dès que votre cible de gain est touchée.',
        },
        {
          id: 'l2-q4',
          question: 'Quand privilégier un ordre au Marché (Market) ?',
          options: [
            'Parce qu’il donne toujours un meilleur prix qu’un ordre Limite',
            'Quand la rapidité compte : il garantit l’exécution immédiate au prix Bid/Ask actuel',
            'Parce qu’il interdit le Stop-Loss',
            'Uniquement sur le Forex',
          ],
          explanation: 'L’ordre Market privilégie la vitesse d’exécution ; l’ordre Limite privilégie la précision du prix.',
        },
      ],
    },
    'lesson-3': {
      moduleTitle: 'Module 2 : Marchés Crypto',
      title: 'Essentiels Crypto : Volatilité 24/7 & Cycles',
      summary: 'Comprenez pourquoi la crypto ne ferme jamais, pourquoi les altcoins suivent le Bitcoin et comment gérer les fortes variations.',
      sections: [
        {
          heading: 'Ouvert en continu, mouvements plus rapides',
          body: 'Contrairement aux bourses traditionnelles, les cryptomonnaies s’échangent 24h/24 et 7j/7, week-ends inclus. Bitcoin ou Solana peuvent varier de 3 % à 8 % en une seule journée, contre souvent moins de 1 % sur les grandes paires Forex.',
          keyTakeaway: 'Comme la crypto bouge vite, les débutants doivent utiliser des montants plus modestes par trade.',
        },
        {
          heading: 'Le Bitcoin donne le rythme',
          body: 'Lorsque le Bitcoin fait un grand mouvement, les autres cryptos (ETH, SOL, ADA) suivent généralement la même direction, souvent avec des variations encore plus fortes. Regardez toujours BTC/USD avant d’acheter une autre crypto.',
          keyTakeaway: 'Observez d’abord la tendance du Bitcoin : il guide l’ensemble du marché crypto.',
        },
      ],
      quiz: [
        {
          id: 'l3-q1',
          question: 'À quelle heure ferme le marché des cryptomonnaies le week-end ?',
          options: ['Vendredi à 17h', 'Samedi à minuit', 'Jamais — il fonctionne 24h/24 et 7j/7', 'Les jours fériés bancaires'],
          explanation: 'Les réseaux crypto fonctionnent en continu toute l’année, jour et nuit.',
        },
        {
          id: 'l3-q2',
          question: 'Par rapport à EUR/USD, pourquoi réduire la taille de position sur SOL/USD ?',
          options: [
            'La crypto connaît des variations quotidiennes bien plus amples',
            'Solana ne se vend pas le mardi',
            'Les spreads crypto sont de 0 %',
            'Le Forex est plus cher par unité',
          ],
          explanation: 'Plus la volatilité est élevée, plus une petite taille suffit à générer gains ou pertes.',
        },
        {
          id: 'l3-q3',
          question: 'Pourquoi consulter BTC/USD avant d’acheter ADA/USD ?',
          options: [
            'Il faut posséder du BTC pour acheter ADA',
            'La direction du Bitcoin influence fortement tout le marché crypto',
            'Les altcoins ne bougent que si BTC est figé',
            'Bitcoin fixe les taux Forex',
          ],
          explanation: 'Le Bitcoin représente la plus grande part du marché et dicte le sentiment global.',
        },
        {
          id: 'l3-q4',
          question: 'Quelle est une bonne habitude crypto le week-end ?',
          options: [
            'Retirer tous les Stop-Loss',
            'Garder des Stop-Loss actifs car le volume réduit peut causer des pics soudains',
            'Passer au levier 20x',
            'Ignorer ses limites de risque',
          ],
          explanation: 'Une liquidité plus faible le week-end favorise des mèches brusques : les Stop-Loss vous protègent.',
        },
      ],
    },
    'lesson-4': {
      moduleTitle: 'Module 3 : Fondamentaux Forex',
      title: 'Paires de devises, Pips & Cotations Forex',
      summary: 'Décodez EUR/USD et USD/JPY simplement et calculez la valeur exacte d’un mouvement de 10 pips.',
      sections: [
        {
          heading: 'Toujours comparer deux monnaies',
          body: 'Sur le Forex, on échange toujours une devise contre une autre, comme EUR/USD. La première (EUR) est la devise de base ; la seconde (USD) est la devise de cotation. Si EUR/USD = 1,0600, 1 euro coûte 1,0600 dollar. Acheter signifie parier sur la hausse de l’euro face au dollar.',
          keyTakeaway: 'Acheter = la 1re devise monte face à la 2e. Vendre = la 1re devise baisse.',
        },
        {
          heading: 'Qu’est-ce qu’un Pip ?',
          body: 'Les devises bougent par fractions infimes, mesurées en « Pips ». Pour la plupart des paires comme EUR/USD, 1 pip correspond à la 4e décimale (0,0001). Pour les paires avec le yen japonais (USD/JPY), 1 pip correspond à la 2e décimale (0,01).',
          keyTakeaway: 'Si EUR/USD passe de 1,0600 à 1,0625, c’est une hausse de +25 pips.',
        },
      ],
      quiz: [
        {
          id: 'l4-q1',
          question: 'Dans la paire GBP/USD, quelle est la devise de base ?',
          options: ['USD (Dollar US)', 'GBP (Livre sterling)', 'EUR (Euro)', 'Les deux'],
          explanation: 'La première devise affichée dans une paire Forex est toujours la devise de base.',
        },
        {
          id: 'l4-q2',
          question: 'EUR/USD passe de 1,0550 à 1,0580. De combien de pips a-t-il monté ?',
          options: ['3 pips', '30 pips', '300 pips', '0,3 pip'],
          explanation: '0,0030 divisé par 0,0001 (1 pip) égale 30 pips.',
        },
        {
          id: 'l4-q3',
          question: 'Quelle paire mesure 1 pip à la 2e décimale (0,01) au lieu de la 4e ?',
          options: ['EUR/USD', 'AUD/USD', 'USD/JPY', 'GBP/USD'],
          explanation: 'Les paires en yen japonais (JPY) cotent autour de 100–160, donc 1 pip vaut 0,01.',
        },
        {
          id: 'l4-q4',
          question: 'Si vous pensez que le dollar US va se RENFORCER face à l’euro, que faites-vous sur EUR/USD ?',
          options: ['Acheter EUR/USD', 'Vendre (Short) EUR/USD', 'Acheter BTC', 'Attendre 0 pip'],
          explanation: 'Si le dollar monte, EUR/USD baisse : vendre EUR/USD génère alors un gain.',
        },
      ],
    },
    'lesson-5': {
      moduleTitle: 'Module 4 : Lire les Graphiques',
      title: 'Lire les bougies japonaises & les tendances',
      summary: 'Décryptez chaque bougie verte ou rouge : Ouverture, Plus Haut, Plus Bas, Clôture et pression acheteurs/vendeurs.',
      sections: [
        {
          heading: 'Les 4 chiffres dans chaque bougie',
          body: 'Chaque bougie résume l’activité pendant une durée choisie (15 min, 1h...). Le rectangle plein (« corps ») relie l’Ouverture et la Clôture. Bougie verte = clôture plus haute que l’ouverture ; bougie rouge = clôture plus basse.',
          keyTakeaway: 'Corps vert = acheteurs gagnants sur la période. Corps rouge = vendeurs gagnants.',
        },
        {
          heading: 'Que révèlent les longues mèches ?',
          body: 'Les traits fins au-dessus et en dessous sont les mèches : elles montrent les extrêmes atteints. Une longue mèche basse signifie que le prix a chuté, puis que les acheteurs ont vigoureusement repoussé le prix vers le haut.',
          keyTakeaway: 'Les longues mèches indiquent souvent un rejet sur un niveau clé.',
        },
      ],
      quiz: [
        {
          id: 'l5-q1',
          question: 'Sur un graphique 15 minutes, que représente une bougie verte ?',
          options: [
            'Un seul échange passé',
            'Ouverture, clôture plus haute, plus haut et plus bas durant ces 15 minutes',
            'Un gain garanti',
            'Un outil réservé au Forex',
          ],
          explanation: 'Chaque bougie affiche les quatre prix (Ouverture, Haut, Bas, Clôture) de son intervalle.',
        },
        {
          id: 'l5-q2',
          question: 'Que signale généralement une très longue mèche sous une bougie ?',
          options: [
            'Un bug d’affichage',
            'Le prix a baissé puis les acheteurs sont intervenus fortement pour le remonter',
            'Un volume nul',
            'Une victoire totale des vendeurs',
          ],
          explanation: 'Une longue mèche inférieure montre un fort rejet haussier après un creux.',
        },
        {
          id: 'l5-q3',
          question: 'Dans une tendance haussière saine, que forment les bougies ?',
          options: [
            'Sommets et creux de plus en plus bas',
            'Sommets et creux de plus en plus hauts',
            'Une ligne horizontale immobile',
            'Des sauts aléatoires',
          ],
          explanation: 'Une tendance haussière monte en escalier avec des sommets et creux ascendants.',
        },
        {
          id: 'l5-q4',
          question: 'Quelle unité de temps offre une vue plus calme et lisible aux débutants ?',
          options: ['1 minute', '1 heure (1H) ou 4 heures (4H)', '5 secondes', 'Carnet tick par tick'],
          explanation: 'Les unités 1H et 4H filtrent le bruit court terme et montrent des tendances plus nettes.',
        },
      ],
    },
    'lesson-6': {
      moduleTitle: 'Module 4 : Lire les Graphiques',
      title: 'Indicateurs simples : Moyennes Mobiles, Bollinger & RSI',
      summary: 'Activez les indicateurs utiles : repérez la tendance avec la SMA/EMA et évitez d’acheter au sommet avec le RSI.',
      sections: [
        {
          heading: 'Moyennes Mobiles (SMA 20 & EMA 50)',
          body: 'Une moyenne mobile trace la moyenne lissée des 20 ou 50 dernières bougies. Lorsque le prix reste au-dessus d’une moyenne qui monte, la tendance est haussière. Les débutants s’en servent pour éviter d’acheter contre la tendance.',
          keyTakeaway: 'Prix au-dessus d’une SMA/EMA montante = biais haussier.',
        },
        {
          heading: 'Bandes de Bollinger & RSI',
          body: 'Les bandes de Bollinger forment un canal qui s’élargit avec la volatilité. Le RSI (0 à 100) mesure la vitesse du mouvement : au-dessus de 70, la hausse est peut-être surchauffée ; sous 30, la baisse est peut-être excessive.',
          keyTakeaway: 'Les indicateurs confirment le prix — n’achetez jamais les yeux fermés sur un seul chiffre RSI.',
        },
      ],
      quiz: [
        {
          id: 'l6-q1',
          question: 'Si le prix évolue régulièrement AU-DESSUS d’une SMA 20 montante, quelle est la lecture la plus simple ?',
          options: ['Le marché est en tendance haussière', 'Le marché est figé', 'Il faut vendre immédiatement', 'Le volume est négatif'],
          explanation: 'Un cours qui se maintient au-dessus d’une moyenne mobile ascendante indique une dynamique haussière.',
        },
        {
          id: 'l6-q2',
          question: 'Que suggère traditionnellement un RSI supérieur à 70 ?',
          options: [
            'Une hausse très rapide pouvant être surachetée / proche d’une pause',
            'L’actif ne vaut rien',
            'Utiliser un levier 20x',
            'Le spread a doublé',
          ],
          explanation: 'Un RSI > 70 reflète une forte poussée haussière parfois étirée à court terme.',
        },
        {
          id: 'l6-q3',
          question: 'Pourquoi les bandes de Bollinger s’écartent-elles et se resserrent-elles ?',
          options: [
            'Elles s’adaptent aux variations de volatilité',
            'Elles changent au hasard à minuit',
            'Elles mesurent la taille du pip',
            'Elles affichent votre solde',
          ],
          explanation: 'Les bandes s’élargissent quand la volatilité augmente et se resserrent en phase calme.',
        },
        {
          id: 'l6-q4',
          question: 'Quelle est la meilleure façon d’utiliser RSI et moyennes mobiles ?',
          options: [
            'Ajouter 15 indicateurs sur le graphique',
            'Combiner 1 outil de tendance + 1 de momentum avec un Stop-Loss clair',
            'Supprimer le Stop-Loss quand RSI < 30',
            'Trader uniquement selon la couleur',
          ],
          explanation: 'La simplicité gagne : un indicateur de tendance, un oscillateur et une règle de risque stricte.',
        },
      ],
    },
    'lesson-7': {
      moduleTitle: 'Module 5 : Risque & Discipline',
      title: 'Règle des 1–2 %, Ratio Risque/Gain & Taille de position',
      summary: 'Découvrez la formule n°1 qui protège votre compte — même si la moitié de vos trades sont perdants.',
      sections: [
        {
          heading: 'Ne jamais tout miser sur une seule idée',
          body: 'Même les meilleurs traders perdent 40 à 50 % de leurs trades. Leur secret : ils ne risquent que 1 % à 2 % du compte total si leur Stop-Loss est touché. Sur 100 000 $, risquer 1 % signifie 1 000 $ de perte max : il faudrait 100 pertes d’affilée pour vider le compte.',
          keyTakeaway: 'Risquez 1 % ou moins par trade en débutant. Protéger le capital passe avant tout.',
        },
        {
          heading: 'Ratio Risque / Récompense (1:2 ou mieux)',
          body: 'Avant d’entrer, comparez votre perte possible au Stop-Loss face au gain visé au Take-Profit. Risquer 500 $ pour viser 1 000 $ donne un ratio de 1:2. Avec un ratio 1:2, gagner seulement 34 % de vos trades suffit à être à l’équilibre !',
          keyTakeaway: 'Visez des opportunités où le gain potentiel vaut au moins 2× le risque.',
        },
      ],
      quiz: [
        {
          id: 'l7-q1',
          question: 'Sur un compte de 100 000 $ avec la règle de 1 %, quelle perte maximale autoriser sur un trade ?',
          options: ['10 000 $', '1 000 $', '50 000 $', '100 $'],
          explanation: '1 % de 100 000 $ correspond exactement à 1 000 $ de perte maximale planifiée.',
        },
        {
          id: 'l7-q2',
          question: 'Chaque gain rapporte +600 $ et chaque perte coûte -300 $ (ratio 1:2). Si vous gagnez 50 % de 10 trades, quel est le bilan ?',
          options: ['0 $', '+1 500 $ de profit', '-1 500 $ de perte', '+3 000 $ de profit'],
          explanation: '5 gains × 600 $ = +3 000 $ ; 5 pertes × -300 $ = -1 500 $ ; Net = +1 500 $.',
        },
        {
          id: 'l7-q3',
          question: 'Quel est le danger caché d’un fort effet de levier (ex. 20x) pour un débutant ?',
          options: [
            'Il réduit les frais',
            'Un simple mouvement de 5 % contre vous peut effacer 100 % de la marge engagée',
            'Il désactive les bougies',
            'Il fonctionne uniquement en démo',
          ],
          explanation: 'Le levier multiplie les pertes autant que les gains : à 20x, 5 % × 20 = 100 %.',
        },
        {
          id: 'l7-q4',
          question: 'Quand faut-il éloigner son Stop-Loss pendant un trade perdant ?',
          options: [
            'Dès qu’on espère un rebond',
            'Jamais — déplacer le Stop-Loss brise votre plan et transforme une petite perte en grosse perte',
            'Le vendredi après-midi',
            'Quand le RSI dépasse 50',
          ],
          explanation: 'Respecter son Stop-Loss initial protège votre capital et garde vos statistiques fiables.',
        },
      ],
    },
    'lesson-8': {
      moduleTitle: 'Module 6 : Stratégies Pratiques',
      title: 'Deux stratégies simples à tester dès aujourd’hui',
      summary: 'Passez à la pratique avec deux plans étape par étape : Repli de tendance et Rebond sur bande.',
      sections: [
        {
          heading: 'Stratégie A : Repli sur tendance (Suivre le courant)',
          body: '1. Passez en 1H ou 4H avec la SMA 20. 2. Vérifiez que le prix est au-dessus d’une SMA 20 montante. 3. Attendez un léger repli calme près de la SMA 20 au lieu de courir après une grande bougie verte. 4. Achetez avec Stop-Loss sous le dernier creux et objectif 2× le risque.',
          keyTakeaway: 'Achetez les replis sains dans une tendance établie plutôt que les sommets.',
        },
        {
          heading: 'Stratégie B : Rebond Bollinger + RSI en range',
          body: 'Quand une paire comme EUR/USD oscille latéralement : 1. Activez Bandes de Bollinger et RSI. 2. Repérez le prix touchant la bande basse avec un RSI proche de 30–35 puis une bougie verte de rejet. 3. Visez la ligne centrale avec un Stop-Loss serré.',
          keyTakeaway: 'Analysez ensuite vos 10–20 trades dans le journal pour voir quel style vous réussit le mieux.',
        },
      ],
      quiz: [
        {
          id: 'l8-q1',
          question: 'Dans la stratégie de repli sur tendance, quel est le meilleur moment pour acheter ?',
          options: [
            'Après une immense bougie verte déjà loin de la SMA 20',
            'Après un repli calme ramenant le prix près de la SMA 20 montante',
            'Quand la SMA 20 chute fortement',
            'Sans Stop-Loss',
          ],
          explanation: 'Entrer sur un repli près du support offre un Stop-Loss plus court et un meilleur ratio gain/risque.',
        },
        {
          id: 'l8-q2',
          question: 'Pourquoi relire votre journal de trades après 10–20 opérations virtuelles ?',
          options: [
            'Pour mesurer votre vrai taux de réussite et identifier ce qui fonctionne',
            'Parce que le journal s’efface après 24h',
            'Pour supprimer les trades perdants',
            'Uniquement pour changer les couleurs',
          ],
          explanation: 'Vos statistiques transforment la pratique en progrès mesurable.',
        },
        {
          id: 'l8-q3',
          question: 'Comment les alertes de prix vous aident-elles à trader sereinement ?',
          options: [
            'Elles vous préviennent automatiquement quand le prix touche votre zone prévue sans fixer l’écran',
            'Elles passent des ordres au hasard',
            'Elles prédisent les journaux télévisés',
            'Elles suppriment le spread',
          ],
          explanation: 'Les alertes vous permettent d’agir uniquement lorsque vos conditions de prix sont réunies.',
        },
        {
          id: 'l8-q4',
          question: 'Quel est le meilleur signe de progrès dans votre compte virtuel ?',
          options: [
            'Un gros coup de chance avec levier maximal',
            'Respecter vos règles de taille et de Stop-Loss sur au moins 15–20 trades enregistrés',
            'Désactiver toutes les protections',
            'Choisir au hasard selon le logo',
          ],
          explanation: 'La régularité d’exécution sur un échantillon suffisant est la clé du trading durable.',
        },
      ],
    },
    'lesson-9': {
      moduleTitle: 'Module 7 : Structure, Sessions & Annonces',
      title: 'Supports, Résistances, Pièges & Volatilité des annonces',
      summary: 'Repérez les vrais planchers et plafonds, évitez les faux départs (fakeouts) et comprenez les heures de liquidité et le slippage.',
      sections: [
        {
          heading: 'Supports, Résistances et Faux Départs (Fakeouts)',
          body: 'Un Support est une zone où les acheteurs interviennent régulièrement ; une Résistance est un plafond vendeur. Acheter dès que le prix dépasse une Résistance d’un pip expose au « Fakeout » qui réintègre vite le range. Attendre la clôture franche de la bougie — ou un retest calme — évite la majorité des pièges.',
          keyTakeaway: 'Attendez une clôture confirmée et un retest plutôt qu’une simple mèche de cassure.',
        },
        {
          heading: 'Sessions de marché, Slippage & Annonces majeures',
          body: 'La liquidité varie selon l’heure. Sur le Forex, le chevauchement Londres–New York offre les spreads les plus serrés, tandis que la transition asiatique est plus fine. Lors d’annonces majeures (CPI, banques centrales), le spread s’élargit et les ordres peuvent glisser (« Slippage »).',
          keyTakeaway: 'Évitez d’ouvrir de nouveaux trades à court terme juste avant une annonce économique majeure.',
        },
      ],
      quiz: [
        {
          id: 'l9-q1',
          question: 'Comment réduire le risque de se faire piéger par une fausse cassure de Résistance ?',
          options: [
            'Acheter aveuglément dès la première seconde où le prix touche le niveau',
            'Attendre la clôture nette de la bougie au-dessus ou un retest transformé en Support',
            'Supprimer son Stop-Loss pour ne pas être sorti',
            'Trader uniquement en graphique 1 seconde',
          ],
          explanation: 'La clôture ou le retest confirment que les acheteurs acceptent vraiment le nouveau prix.',
        },
        {
          id: 'l9-q2',
          question: 'Qu’est-ce que le « Slippage » pendant une annonce macro comme l’inflation (CPI) ?',
          options: [
            'Une remise sur vos frais de courtage',
            'Une exécution à un prix moins favorable qu’attendu à cause d’un saut rapide sans liquidité',
            'Des bougies qui changent de couleur',
            'Un profit garanti sur les ordres au marché',
          ],
          explanation: 'Lors de secousses violentes, le prix saute entre deux cotations et déclenche un écart d’exécution.',
        },
        {
          id: 'l9-q3',
          question: 'Quand l’EUR/USD offre-t-il généralement la meilleure liquidité et les spreads les plus faibles ?',
          options: [
            'Pendant le chevauchement des sessions Londres et New York',
            'À minuit lors du rollover bancaire',
            'Les jours fériés bancaires majeurs',
            'Le spread ne change jamais',
          ],
          explanation: 'Les desks européens et américains sont actifs ensemble, maintenant des spreads serrés.',
        },
        {
          id: 'l9-q4',
          question: 'Quelle habitude prudente adopter 5 minutes avant une annonce de banque centrale ?',
          options: [
            'Passer au levier 20x pour deviner le sens',
            'Rester à l’écart et laisser passer les premiers allers-retours avant d’agir',
            'Effacer ses Take-Profit',
            'Passer des ordres au marché les yeux fermés',
          ],
          explanation: 'Les mèches violentes dans les deux sens piègent souvent acheteurs et vendeurs simultanément.',
        },
      ],
    },
    'lesson-10': {
      moduleTitle: 'Module 8 : Psychologie & Passage au Réel',
      title: 'Psychologie, Journal de Trading & Checklist avant le Réel',
      summary: 'Éliminez FOMO et trading de revanche, fixez une perte maximale quotidienne et validez votre préparation avant de passer au réel.',
      sections: [
        {
          heading: 'Vaincre le FOMO, la Revanche & la Pente Émotionnelle',
          body: 'La plupart des comptes échouent par émotion, pas à cause des indicateurs. Le FOMO pousse à acheter tardivement après une envolée ; le trading de revanche pousse à doubler la mise après une perte. Un plafond strict de perte journalière (ex. s’arrêter après 2 pertes ou -3 %) protège votre lucidité.',
          keyTakeaway: 'Ne doublez jamais la taille après une perte — coupez votre écran si le plafond du jour est atteint.',
        },
        {
          heading: 'Checklist Démo → Réel & Sécurité du Courtier',
          body: 'Avant d’engager du capital réel : 1. Enregistrez au moins 20–30 trades virtuels avec règle 1 % et Stop-Loss constant ; 2. Vérifiez que votre courtier est strictement régulé avec des frais transparents ; 3. N’utilisez jamais d’argent nécessaire au loyer ou aux urgences.',
          keyTakeaway: 'Passez du virtuel au réel avec une taille minuscule uniquement après 20+ trades disciplinés.',
        },
      ],
      quiz: [
        {
          id: 'l10-q1',
          question: 'Vous venez d’enchaîner deux Stop-Loss (-2 % au total sur la journée). Quelle est la bonne réaction ?',
          options: [
            'Doubler la mise au prochain trade pour tout récupérer avant ce soir',
            'Arrêter de trader pour la journée, analyser votre journal et revenir calme demain',
            'Retirer le Stop-Loss sur le troisième trade',
            'Passer en levier 25x sur un actif aléatoire',
          ],
          explanation: 'Respecter un plafond quotidien stoppe la spirale émotionnelle avant qu’elle ne détruise le capital.',
        },
        {
          id: 'l10-q2',
          question: 'À quoi ressemble généralement le « FOMO » sur un graphique ?',
          options: [
            'Attendre patiemment un repli sur support avec un ordre Limite',
            'Acheter tardivement en haut d’une immense bougie verte par peur de rater le train',
            'Encaisser au Take-Profit prévu',
            'Consulter le calendrier économique',
          ],
          explanation: 'Courir après une hausse déjà étirée détériore fortement le ratio risque/gain.',
        },
        {
          id: 'l10-q3',
          question: 'Quel repère prouve que vous êtes prêt à tester de très petits montants réels après la démo ?',
          options: [
            'Un gros coup de chance hier sans Stop-Loss',
            '20–30+ trades virtuels journalisés en respectant la règle 1 % et un Stop-Loss à chaque ordre',
            'Avoir mémorisé 12 noms d’indicateurs sans pratiquer',
            'Avoir emprunté de l’argent sur une carte de crédit',
          ],
          explanation: 'La régularité vérifiée sur un échantillon de 20–30 trades prouve la maîtrise du processus.',
        },
        {
          id: 'l10-q4',
          question: 'Que vérifier en priorité avant d’ouvrir un compte réel chez un courtier ou une plateforme ?',
          options: [
            'Un bonus de levier 500x très agressif',
            'Une régulation officielle stricte, la séparation des fonds clients et des frais transparents',
            'Des promesses de rendements garantis sur les réseaux sociaux',
            'L’absence de sécurité 2FA',
          ],
          explanation: 'La régulation fiable, la sécurité 2FA et la clarté des coûts passent toujours avant toute promesse marketing.',
        },
      ],
    },
  },

  es: {
    'lesson-1': {
      moduleTitle: 'Módulo 1: Bases del Trading',
      title: 'Cómo funcionan Compra, Venta y el Spread',
      summary: 'Aprende qué significan Bid y Ask, por qué las operaciones inician algo negativas y cómo elegir mercados líquidos.',
      sections: [
        {
          heading: 'Dos precios en pantalla: Bid y Ask',
          body: 'Al mirar Bitcoin o EUR/USD siempre hay dos precios: el Bid (lo que ofrecen los compradores si vendes ahora) y el Ask (lo que piden los vendedores si compras ahora). El Ask siempre es ligeramente más alto que el Bid.',
          keyTakeaway: 'Compras al precio Ask y vendes al precio Bid.',
        },
        {
          heading: '¿Qué es el Spread?',
          body: 'La pequeña diferencia entre Ask y Bid se llama Spread. Es como una casa de cambio: te compra divisa un poco más barata de lo que la vende. Pares muy populares como BTC/USD y EUR/USD tienen spreads muy pequeños, lo que reduce tus costos.',
          keyTakeaway: 'Un spread pequeño significa menores costos y alcanzar el punto de equilibrio más rápido.',
        },
      ],
      quiz: [
        {
          id: 'l1-q1',
          question: 'Si EUR/USD muestra Bid 1.0580 y Ask 1.0582, ¿a qué precio compras ahora mismo?',
          options: ['1.0580 (el Bid)', '1.0582 (el Ask)', '1.0581 (punto medio)', 'El precio de ayer'],
          explanation: 'Al comprar de inmediato aceptas el precio de los vendedores, que es el Ask (1.0582).',
        },
        {
          id: 'l1-q2',
          question: '¿Por qué una operación nueva suele empezar con una pequeña pérdida al abrirse?',
          options: [
            'Por un error de cálculo',
            'Por el spread entre el Ask al que compraste y el Bid al que podrías cerrar',
            'El precio siempre cae tras comprar',
            'Pierdes 10% automático en cada orden',
          ],
          explanation: 'Entras al Ask y tu valor de cierre inmediato se calcula al Bid; esa diferencia es el spread.',
        },
        {
          id: 'l1-q3',
          question: '¿Qué mercado suele tener el spread más bajo para principiantes?',
          options: [
            'Pares muy negociados como EUR/USD o BTC/USD',
            'Monedas raras sin apenas volumen',
            'Mercados cerrados en festivo',
            'Todos tienen exactamente el mismo spread',
          ],
          explanation: 'La alta liquidez acerca compradores y vendedores y encoge el spread.',
        },
        {
          id: 'l1-q4',
          question: 'Si crees que el precio va a BAJAR y quieres ganar con la caída, ¿qué haces?',
          options: ['Comprar (Long)', 'Vender (Short)', 'Esperar un spread mayor', 'Cerrar la cuenta'],
          explanation: 'Vender (ir en corto / Short) genera ganancia cuando el precio cae desde tu entrada.',
        },
      ],
    },
    'lesson-2': {
      moduleTitle: 'Módulo 1: Bases del Trading',
      title: 'Órdenes Market, Limit, Stop-Loss y Take-Profit',
      summary: 'Domina los cuatro tipos de órdenes clave para entrar con control y proteger siempre tu saldo.',
      sections: [
        {
          heading: 'Orden de Mercado (Market) vs. Orden Límite',
          body: 'Una orden Market compra o vende al instante al mejor precio actual. Una orden Limit te deja elegir tu precio y esperar: «Solo comprar Bitcoin si baja a $88,000». Controlas el precio, pero solo se ejecuta si el mercado llega allí.',
          keyTakeaway: 'Usa Market para entrar ya; usa Limit para esperar un mejor precio.',
        },
        {
          heading: 'Tu red de seguridad: Stop-Loss y Take-Profit',
          body: 'El Stop-Loss cierra automáticamente tu operación si el precio va en contra más de lo planeado, evitando grandes pérdidas. El Take-Profit asegura tus ganancias automáticamente cuando el precio toca tu objetivo.',
          keyTakeaway: 'Nunca abras una operación sin definir antes dónde salir si te equivocas (Stop-Loss).',
        },
      ],
      quiz: [
        {
          id: 'l2-q1',
          question: 'Bitcoin está en $91,000 y solo quieres comprar si baja a $89,500. ¿Qué orden usas?',
          options: ['Compra Market', 'Compra Límite en $89,500', 'Stop-Loss', 'Venta Market'],
          explanation: 'Una orden Compra Límite espera por debajo del precio actual y solo se llena en $89,500 o menos.',
        },
        {
          id: 'l2-q2',
          question: '¿Cuál es la función principal de un Stop-Loss?',
          options: [
            'Garantizar que todas las operaciones ganen',
            'Cerrar automáticamente una operación perdedora en tu límite para mantener pérdidas pequeñas',
            'Duplicar tu tamaño automáticamente',
            'Pausar el gráfico',
          ],
          explanation: 'El Stop-Loss actúa como cinturón de seguridad limitando tu pérdida máxima.',
        },
        {
          id: 'l2-q3',
          question: 'Compraste ETH en $3,000 con Take-Profit en $3,300. ¿Qué ocurre si ETH toca $3,300 mientras no miras?',
          options: [
            'Nada hasta que pulses Cerrar',
            'Se cierra automáticamente cerca de $3,300 asegurando tu ganancia',
            'Se borra tu Stop-Loss',
            'Queda abierta para siempre',
          ],
          explanation: 'El Take-Profit ejecuta la salida automáticamente al alcanzar tu meta de beneficio.',
        },
        {
          id: 'l2-q4',
          question: '¿Cuándo prefieren los traders una orden de Mercado (Market)?',
          options: [
            'Porque siempre da mejor precio que Limit',
            'Cuando importa la rapidez: garantiza ejecución inmediata al Bid/Ask actual',
            'Porque desactiva el Stop-Loss',
            'Solo en Forex',
          ],
          explanation: 'Las órdenes Market priorizan velocidad; las Limit priorizan el precio exacto.',
        },
      ],
    },
    'lesson-3': {
      moduleTitle: 'Módulo 2: Mercados Cripto',
      title: 'Esenciales Cripto: Volatilidad 24/7 y Ciclos',
      summary: 'Entiende por qué cripto nunca cierra, por qué las monedas siguen a Bitcoin y cómo dimensionar operaciones.',
      sections: [
        {
          heading: 'Abierto siempre, cambios más rápidos',
          body: 'A diferencia de bolsas y bancos, cripto opera 24 horas al día, los 7 días de la semana. Bitcoin o Solana pueden moverse 3% a 8% en un solo día, frente a menos del 1% típico en grandes pares Forex.',
          keyTakeaway: 'Como cripto oscila más fuerte, los principiantes deben usar montos menores por operación.',
        },
        {
          heading: 'Bitcoin marca el paso',
          body: 'Cuando Bitcoin da un giro brusco, otras criptos como ETH, SOL o ADA suelen seguir la misma dirección con porcentajes aún mayores. Revisa siempre BTC/USD antes de operar otra moneda.',
          keyTakeaway: 'Mira primero la tendencia de Bitcoin: marca el ánimo de todo el mercado cripto.',
        },
      ],
      quiz: [
        {
          id: 'l3-q1',
          question: '¿Cuándo cierra el mercado de criptomonedas el fin de semana?',
          options: ['Viernes 17:00', 'Sábado a medianoche', 'Nunca — opera 24/7 todo el año', 'Solo en festivos'],
          explanation: 'Las redes cripto funcionan de forma continua día y noche todo el año.',
        },
        {
          id: 'l3-q2',
          question: 'En comparación con EUR/USD, ¿por qué usar montos menores en SOL/USD?',
          options: [
            'Cripto tiene variaciones porcentuales diarias mucho mayores',
            'Solana no se vende los martes',
            'Los spreads cripto son 0%',
            'Forex cuesta más por unidad',
          ],
          explanation: 'Mayor volatilidad implica mayores ganancias y pérdidas posibles con el mismo dinero.',
        },
        {
          id: 'l3-q3',
          question: '¿Por qué revisar BTC/USD antes de comprar ADA/USD?',
          options: [
            'No puedes comprar ADA sin tener BTC',
            'La dirección de Bitcoin influye fuertemente en el resto del mercado cripto',
            'Las altcoins solo suben si BTC no se mueve',
            'Bitcoin fija tasas Forex',
          ],
          explanation: 'Bitcoin concentra la mayor parte del mercado y guía el sentimiento general.',
        },
        {
          id: 'l3-q4',
          question: '¿Qué buen hábito conviene mantener en cripto los fines de semana?',
          options: [
            'Quitar todos los Stop-Loss',
            'Mantener Stop-Loss activos porque el menor volumen provoca picos repentinos',
            'Usar apalancamiento 20x',
            'Ignorar límites de riesgo',
          ],
          explanation: 'Con menor liquidez en fin de semana pueden darse mechas bruscas; el Stop-Loss te protege.',
        },
      ],
    },
    'lesson-4': {
      moduleTitle: 'Módulo 3: Fundamentos Forex',
      title: 'Pares de Divisas, Pips y Cotizaciones Forex',
      summary: 'Aprende a leer EUR/USD y USD/JPY en lenguaje sencillo y calcula cuánto vale cada pip.',
      sections: [
        {
          heading: 'Siempre operas dos monedas a la vez',
          body: 'En Forex comparas una moneda frente a otra, como EUR/USD. La primera (EUR) es la moneda base; la segunda (USD) es la cotizada. Si EUR/USD = 1.0600, 1 euro cuesta 1.0600 dólares. Al comprar, apuestas a que el euro sube frente al dólar.',
          keyTakeaway: 'Comprar = la primera divisa sube frente a la segunda. Vender = la primera baja.',
        },
        {
          heading: '¿Qué es un Pip?',
          body: 'Las divisas cambian en fracciones pequeñas medidas en «Pips». En la mayoría de pares como EUR/USD, 1 pip es el 4.º decimal (0.0001). En pares con yen japonés (USD/JPY), 1 pip es el 2.º decimal (0.01).',
          keyTakeaway: 'Si EUR/USD sube de 1.0600 a 1.0625, avanzó +25 pips.',
        },
      ],
      quiz: [
        {
          id: 'l4-q1',
          question: 'En el par GBP/USD, ¿cuál es la moneda base?',
          options: ['USD (Dólar estadounidense)', 'GBP (Libra esterlina)', 'EUR (Euro)', 'Ambas'],
          explanation: 'La primera divisa escrita en cualquier par Forex es siempre la moneda base.',
        },
        {
          id: 'l4-q2',
          question: 'EUR/USD sube de 1.0550 a 1.0580. ¿Cuántos pips subió?',
          options: ['3 pips', '30 pips', '300 pips', '0.3 pips'],
          explanation: '0.0030 dividido entre 0.0001 (1 pip) equivale a 30 pips.',
        },
        {
          id: 'l4-q3',
          question: '¿Qué par mide 1 pip en el 2.º decimal (0.01) en lugar del 4.º?',
          options: ['EUR/USD', 'AUD/USD', 'USD/JPY', 'GBP/USD'],
          explanation: 'Los pares con yen japonés (JPY) cotizan cerca de 100–160, así que 1 pip es 0.01.',
        },
        {
          id: 'l4-q4',
          question: 'Si esperas que el dólar (USD) se FORTALEZCA frente al euro, ¿qué haces en EUR/USD?',
          options: ['Comprar EUR/USD', 'Vender (Short) EUR/USD', 'Comprar BTC', 'Esperar 0 pips'],
          explanation: 'Si el USD sube, EUR/USD baja; vender EUR/USD aprovecha esa caída.',
        },
      ],
    },
    'lesson-5': {
      moduleTitle: 'Módulo 4: Leer Gráficos',
      title: 'Cómo leer Velas Japonesas y Tendencias',
      summary: 'Descubre la historia de cada vela verde y roja: Apertura, Máximo, Mínimo, Cierre y presión del mercado.',
      sections: [
        {
          heading: 'Los 4 datos dentro de cada vela',
          body: 'Cada vela resume toda la actividad de un intervalo (15 min, 1h...). El rectángulo («cuerpo») muestra dónde abrió y cerró el precio. Vela verde = cerró más alto que abrió; vela roja = cerró más bajo.',
          keyTakeaway: 'Cuerpo verde = ganaron los compradores. Cuerpo rojo = ganaron los vendedores.',
        },
        {
          heading: '¿Qué indican las mechas largas?',
          body: 'Las líneas finas arriba y abajo son las mechas y muestran los extremos alcanzados. Una mecha inferior larga indica que el precio cayó, pero los compradores entraron con fuerza y lo impulsaron hacia arriba.',
          keyTakeaway: 'Las mechas largas suelen señalar rechazo en niveles importantes.',
        },
      ],
      quiz: [
        {
          id: 'l5-q1',
          question: 'En un gráfico de 15 minutos, ¿qué muestra una vela verde?',
          options: [
            'Solo una operación antigua',
            'Apertura, cierre superior, máximo y mínimo dentro de esos 15 minutos',
            'Ganancia asegurada',
            'Un indicador exclusivo de Forex',
          ],
          explanation: 'Cada vela resume los cuatro precios (Apertura, Máximo, Mínimo, Cierre) de su periodo.',
        },
        {
          id: 'l5-q2',
          question: '¿Qué suele significar una mecha muy larga por DEBAJO de la vela?',
          options: [
            'Error del gráfico',
            'El precio cayó con fuerza y luego los compradores lo empujaron hacia arriba',
            'Volumen cero',
            'Victoria total vendedora',
          ],
          explanation: 'Una mecha inferior larga refleja fuerte rechazo alcista tras una caída.',
        },
        {
          id: 'l5-q3',
          question: 'En una tendencia alcista sana, ¿qué patrón forman las velas?',
          options: [
            'Máximos y mínimos cada vez más bajos',
            'Máximos y mínimos cada vez más altos',
            'Línea totalmente plana',
            'Saltos aleatorios',
          ],
          explanation: 'Una tendencia alcista sube en escalera con máximos y mínimos crecientes.',
        },
        {
          id: 'l5-q4',
          question: '¿Qué temporalidad ofrece una lectura más tranquila y clara para principiantes?',
          options: ['1 minuto', '1 hora (1H) o 4 horas (4H)', '5 segundos', 'Registro tick a tick'],
          explanation: 'Los marcos 1H y 4H filtran el ruido corto y muestran tendencias más limpias.',
        },
      ],
    },
    'lesson-6': {
      moduleTitle: 'Módulo 4: Leer Gráficos',
      title: 'Indicadores simples: Medias Móviles, Bollinger y RSI',
      summary: 'Usa indicadores con propósito: detecta la dirección con SMA/EMA y evita perseguir precios estirados con RSI.',
      sections: [
        {
          heading: 'Medias Móviles (SMA 20 y EMA 50)',
          body: 'Una Media Móvil dibuja una línea suave con el promedio de las últimas 20 o 50 velas. Si el precio cotiza encima de una media que sube, la tendencia es alcista y ayuda a no comprar contra corriente.',
          keyTakeaway: 'Precio sobre SMA/EMA ascendente = sesgo alcista.',
        },
        {
          heading: 'Bandas de Bollinger y RSI',
          body: 'Las Bandas de Bollinger crean un canal dinámico según la volatilidad. El RSI (0–100) mide la velocidad: sobre 70 indica posible sobrecompra; bajo 30 indica posible sobreventa.',
          keyTakeaway: 'Los indicadores apoyan tu lectura del precio — nunca compres a ciegas solo por el RSI.',
        },
      ],
      quiz: [
        {
          id: 'l6-q1',
          question: 'Si el precio se mantiene POR ENCIMA de una SMA 20 que sube, ¿cuál es la lectura más directa?',
          options: ['El mercado está en tendencia alcista', 'El mercado está congelado', 'Debes vender ya', 'Volumen negativo'],
          explanation: 'Sostenerse encima de una media móvil ascendente confirma impulso alcista.',
        },
        {
          id: 'l6-q2',
          question: '¿Qué suele sugerir un RSI por encima de 70?',
          options: [
            'Que el precio subió muy rápido y podría estar sobrecomprado / próximo a pausar',
            'Que el activo no vale nada',
            'Que debes usar 20x',
            'Que el spread se duplicó',
          ],
          explanation: 'RSI > 70 refleja fuerte impulso alcista que puede estar estirado a corto plazo.',
        },
        {
          id: 'l6-q3',
          question: '¿Por qué las Bandas de Bollinger se ensanchan y estrechan?',
          options: [
            'Se ajustan a los cambios de volatilidad del mercado',
            'Cambian al azar a medianoche',
            'Miden el tamaño del pip',
            'Muestran tu saldo',
          ],
          explanation: 'Las bandas se expanden con alta volatilidad y se contraen en consolidaciones calmas.',
        },
        {
          id: 'l6-q4',
          question: '¿Cuál es la mejor forma de usar RSI y Medias Móviles?',
          options: [
            'Poner 15 indicadores juntos',
            'Usar 1 herramienta de tendencia + 1 de impulso junto a un Stop-Loss claro',
            'Quitar el Stop-Loss si RSI < 30',
            'Operar solo por colores',
          ],
          explanation: 'La simplicidad funciona mejor: tendencia + momento + control estricto del riesgo.',
        },
      ],
    },
    'lesson-7': {
      moduleTitle: 'Módulo 5: Riesgo y Disciplina',
      title: 'La regla del 1–2%, Riesgo/Beneficio y Tamaño',
      summary: 'Aprende la fórmula #1 que protege a los traders — incluso cuando pierden la mitad de sus operaciones.',
      sections: [
        {
          heading: 'Nunca arriesgues demasiado en una sola idea',
          body: 'Incluso los grandes traders pierden 40–50% de sus operaciones. Su secreto es el tamaño: arriesgan solo 1% a 2% de su cuenta si salta el Stop-Loss. En $100,000, arriesgar 1% significa perder máximo $1,000; necesitarías 100 pérdidas seguidas para quedar en cero.',
          keyTakeaway: 'Arriesga 1% o menos al empezar. Sobrevivir va antes que ganar rápido.',
        },
        {
          heading: 'Relación Riesgo / Beneficio (1:2 o mejor)',
          body: 'Antes de entrar, compara lo que arriesgas en tu Stop-Loss frente a tu meta en Take-Profit. Arriesgar $500 para buscar $1,000 es un ratio 1:2. ¡Con 1:2 solo necesitas acertar el 34% de tus operaciones para empatar!',
          keyTakeaway: 'Busca operaciones donde tu ganancia potencial sea al menos 2× tu riesgo.',
        },
      ],
      quiz: [
        {
          id: 'l7-q1',
          question: 'Con una cuenta de $100,000 y la regla del 1%, ¿cuál es la pérdida máxima permitida en una operación?',
          options: ['$10,000', '$1,000', '$50,000', '$100'],
          explanation: 'El 1% de $100,000 equivale a $1,000 de pérdida máxima planeada.',
        },
        {
          id: 'l7-q2',
          question: 'Cada acierto gana +$600 y cada fallo pierde -$300 (ratio 1:2). Si aciertas 50% de 10 operaciones, ¿cuál es tu resultado?',
          options: ['$0', '+$1,500 de ganancia', '-$1,500 de pérdida', '+$3,000 de ganancia'],
          explanation: '5 aciertos × $600 = +$3,000; 5 fallos × -$300 = -$1,500; Neto = +$1,500.',
        },
        {
          id: 'l7-q3',
          question: '¿Cuál es el peligro oculto de usar apalancamiento alto (como 20x) siendo principiante?',
          options: [
            'Baja las comisiones',
            'Un movimiento del 5% en contra puede borrar el 100% de tu margen',
            'Desactiva las velas',
            'Solo funciona en demo',
          ],
          explanation: 'El apalancamiento multiplica pérdidas igual que ganancias: 5% × 20 = 100%.',
        },
        {
          id: 'l7-q4',
          question: '¿Cuándo debes alejar tu Stop-Loss durante una operación perdedora?',
          options: [
            'Cuando tengas esperanza de rebote',
            'Nunca — alejar el Stop-Loss rompe tu plan y convierte pérdidas pequeñas en grandes',
            'Cada viernes',
            'Cuando el RSI pase de 50',
          ],
          explanation: 'Respetar tu Stop-Loss original protege tu capital y mantiene tus estadísticas honestas.',
        },
      ],
    },
    'lesson-8': {
      moduleTitle: 'Módulo 6: Estrategias Prácticas',
      title: 'Dos estrategias para practicar hoy mismo',
      summary: 'Aplica todo con dos listas claras: Retroceso en Tendencia y Rebote en Rango.',
      sections: [
        {
          heading: 'Estrategia A: Retroceso en Tendencia',
          body: '1. Cambia a gráfico 1H o 4H con SMA 20. 2. Confirma que el precio está encima de una SMA 20 ascendente. 3. Espera un retroceso calmado cerca de la SMA 20 en lugar de perseguir velas verdes largas. 4. Compra con Stop-Loss bajo el último mínimo y meta de 2× tu riesgo.',
          keyTakeaway: 'Compra retrocesos sanos dentro de una tendencia existente.',
        },
        {
          heading: 'Estrategia B: Rebote Bollinger + RSI',
          body: 'Cuando un par como EUR/USD se mueve lateralmente: 1. Activa Bandas de Bollinger y RSI. 2. Busca el precio tocando la banda inferior con RSI cerca de 30–35 y vela verde de giro. 3. Apunta a la línea media con Stop-Loss ajustado.',
          keyTakeaway: 'Revisa tus 10–20 operaciones en el historial para descubrir qué estrategia te funciona mejor.',
        },
      ],
      quiz: [
        {
          id: 'l8-q1',
          question: 'En la estrategia de Retroceso en Tendencia, ¿cuándo conviene entrar en Compra?',
          options: [
            'Tras una vela verde gigante muy lejos de la SMA 20',
            'Tras un retroceso tranquilo que acerca el precio a la SMA 20 ascendente',
            'Cuando la SMA 20 cae fuerte',
            'Sin Stop-Loss',
          ],
          explanation: 'Entrar en un retroceso cerca del soporte da un Stop-Loss más corto y mejor Riesgo/Beneficio.',
        },
        {
          id: 'l8-q2',
          question: '¿Por qué revisar tu historial tras 10–20 operaciones simuladas?',
          options: [
            'Para medir tu tasa real de acierto y descubrir qué patrones te funcionan',
            'Porque el historial caduca en 24h',
            'Para borrar las pérdidas',
            'Solo para cambiar colores',
          ],
          explanation: 'Tus estadísticas convierten la práctica en mejora medible.',
        },
        {
          id: 'l8-q3',
          question: '¿Cómo ayudan las alertas de precio a operar con calma?',
          options: [
            'Te avisan automáticamente cuando el precio toca tu zona planeada sin mirar la pantalla todo el día',
            'Abren operaciones al azar',
            'Predicen las noticias',
            'Eliminan el spread',
          ],
          explanation: 'Las alertas te dejan actuar únicamente cuando el mercado llega a tu nivel planeado.',
        },
        {
          id: 'l8-q4',
          question: '¿Cuál es la mejor señal de progreso en tu cuenta de práctica?',
          options: [
            'Un golpe de suerte con máximo apalancamiento',
            'Seguir tus reglas de tamaño y Stop-Loss de forma constante durante 15–20 operaciones',
            'Desactivar todas las salidas de seguridad',
            'Elegir monedas por su logotipo',
          ],
          explanation: 'La consistencia disciplinada a lo largo de varias operaciones es la base del éxito.',
        },
      ],
    },
    'lesson-9': {
      moduleTitle: 'Módulo 7: Estructura, Sesiones y Noticias',
      title: 'Soporte, Resistencia, Falsas Rupturas y Noticias',
      summary: 'Distingue pisos y techos reales, evita trampas (fakeouts) y comprende horarios de liquidez y deslizamiento (slippage).',
      sections: [
        {
          heading: 'Soporte, Resistencia y Trampas (Fakeouts)',
          body: 'Un Soporte es una zona donde aparecen compradores; una Resistencia es un techo vendedor. Comprar justo cuando una mecha perfora 1 pip la Resistencia suele atraparte en un «Fakeout». Esperar el cierre firme de la vela — o un retesteo ordenado — evita casi todas las trampas.',
          keyTakeaway: 'Espera confirmación al cierre de vela y retesteo en vez de perseguir mechas.',
        },
        {
          heading: 'Sesiones de Mercado, Slippage y Noticias de Alto Impacto',
          body: 'La liquidez cambia según la hora. En Forex, el cruce Londres–Nueva York ofrece los spreads más bajos, mientras horas asiáticas tardías tienen menos volumen. Durante anuncios clave (IPC/CPI o bancos centrales), los spreads se abren y puede haber deslizamiento («Slippage»).',
          keyTakeaway: 'Evita abrir operaciones nuevas justo minutos antes de grandes noticias programadas.',
        },
      ],
      quiz: [
        {
          id: 'l9-q1',
          question: '¿Cómo reducen los traders el riesgo de caer en una falsa ruptura de Resistencia?',
          options: [
            'Comprando al instante en que el precio toca el nivel por 1 segundo',
            'Esperando el cierre claro de la vela por encima o un retesteo tranquilo como nuevo Soporte',
            'Quitando el Stop-Loss para no ser sacado por mechas',
            'Operando solo gráficos de 1 segundo',
          ],
          explanation: 'El cierre confirmado o el retesteo demuestran que los compradores sostienen precios superiores.',
        },
        {
          id: 'l9-q2',
          question: '¿Qué es el «Slippage» durante un dato clave como inflación CPI o tipos de interés?',
          options: [
            'Un descuento en comisiones del bróker',
            'Cuando la poca liquidez hace que tu orden se ejecute a un precio peor del esperado en un salto brusco',
            'Cuando las velas cambian de color',
            'Ganancia garantizada en órdenes Market',
          ],
          explanation: 'En picos violentos de noticias el precio salta cotizaciones y las órdenes Market/Stop deslizan.',
        },
        {
          id: 'l9-q3',
          question: '¿Cuándo ofrece EUR/USD mayor liquidez y spreads más ajustados?',
          options: [
            'Durante el cruce de sesiones Londres–Nueva York',
            'En el rollover de medianoche cuando cierran los bancos',
            'En festivos bancarios globales',
            'El spread nunca cambia',
          ],
          explanation: 'Europa y Estados Unidos operan simultáneamente, estrechando el spread.',
        },
        {
          id: 'l9-q4',
          question: '¿Cuál es el hábito más seguro 5 minutos antes de una decisión importante de un Banco Central?',
          options: [
            'Subir a apalancamiento 20x para adivinar el giro',
            'Mantenerse fuera hasta que pase la sacudida inicial y vuelva la calma',
            'Borrar todos los Take-Profit',
            'Abrir órdenes a mercado sin Stop-Loss',
          ],
          explanation: 'Los latigazos en dos direcciones suelen barrer stops de ambos lados antes de definir tendencia.',
        },
      ],
    },
    'lesson-10': {
      moduleTitle: 'Módulo 8: Psicología y Paso a Real',
      title: 'Psicología del Trading, Diario y Lista Pre-Real',
      summary: 'Elimina el FOMO y la revancha, respeta un límite diario de pérdida y verifica tu lista antes de usar dinero real.',
      sections: [
        {
          heading: 'Superar el FOMO, la Revancha y el Descontrol Emocional',
          body: 'La mayoría de cuentas caen por emociones, no por indicadores. El FOMO te hace perseguir velas tarde; operar por revancha te empuja a doblar el tamaño tras perder. Un límite diario máximo (parar tras 2 pérdidas o -3%) frena cualquier espiral negativa.',
          keyTakeaway: 'Nunca dupliques tamaño tras perder — detente al tocar tu límite diario.',
        },
        {
          heading: 'Lista de Graduación Demo → Real y Seguridad del Bróker',
          body: 'Antes de arriesgar dinero real: 1. Registra 20–30 operaciones simuladas constantes con riesgo 1% y Stop-Loss siempre; 2. Elige un bróker regulado con tarifas claras; 3. Opera solo dinero libre que puedas permitirte perder, nunca alquiler ni deudas.',
          keyTakeaway: 'Pasa de demo a tamaño real mínimo solo tras demostrar disciplina en 20+ operaciones.',
        },
      ],
      quiz: [
        {
          id: 'l10-q1',
          question: 'Acabas de tener dos Stop-Loss seguidos (-2% hoy). ¿Cuál es la reacción disciplinada?',
          options: [
            'Doblar tu tamaño en la siguiente operación para empatar hoy mismo',
            'Dejar de operar por hoy, revisar tu diario con calma y volver mañana',
            'Quitar el Stop-Loss en el tercer intento',
            'Subir a apalancamiento 25x en otra moneda',
          ],
          explanation: 'Un límite de pérdida diaria corta el impulso emocional antes de dañar la cuenta.',
        },
        {
          id: 'l10-q2',
          question: '¿Cómo se ve normalmente el «FOMO» en un gráfico real?',
          options: [
            'Esperar con paciencia un retroceso con orden Límite',
            'Perseguir tarde una vela verde enorme lejos del soporte por miedo a quedarse fuera',
            'Cerrar con ganancia en Take-Profit',
            'Revisar el calendario económico antes de operar',
          ],
          explanation: 'Entrar tarde tras una subida vertical deja un riesgo alto y poca recompensa restante.',
        },
        {
          id: 'l10-q3',
          question: '¿Qué señal demuestra que estás listo para probar montos reales muy pequeños tras practicar?',
          options: [
            'Un acierto de suerte ayer sin Stop-Loss',
            'Registrar 20–30+ operaciones simuladas cumpliendo regla del 1% y Stop-Loss en cada entrada',
            'Memorizar 12 indicadores sin practicar',
            'Pedir un préstamo con tarjeta para depositar',
          ],
          explanation: 'La consistencia comprobada en una muestra amplia demuestra preparación real.',
        },
        {
          id: 'l10-q4',
          question: 'Al elegir un bróker o exchange real al terminar tu formación, ¿qué va primero?',
          options: [
            'Quien ofrezca mayor bono de apalancamiento 500x',
            'Regulación oficial estricta, fondos segregados y tarifas transparentes',
            'Promesas anónimas de ganancias diarias garantizadas',
            'Desactivar verificación 2FA',
          ],
          explanation: 'Prioriza siempre regulación sólida, seguridad 2FA y transparencia de costos.',
        },
      ],
    },
  },

  ar: {
    'lesson-1': {
      moduleTitle: 'الوحدة ١: أساسيات التداول',
      title: 'كيف يعمل الشراء والبيع وفارق السعر (Spread)',
      summary: 'تعلّم معنى سعري العرض والطلب (Bid و Ask)، ولماذا تبدأ الصفقة بخسارة طفيفة، وكيف تختار أسواقاً عالية السيولة.',
      sections: [
        {
          heading: 'سعران على كل شاشة: Bid و Ask',
          body: 'عندما تنظر إلى البيتكوين أو زوج EUR/USD، هناك دائماً سعران: سعر Bid (السعر الذي يمكنك البيع به فوراً) وسعر Ask (السعر الذي يمكنك الشراء به فوراً). ويكون سعر Ask دائماً أعلى بقليل من سعر Bid.',
          keyTakeaway: 'أنت تشتري بسعر Ask وتبيع بسعر Bid.',
        },
        {
          heading: 'ما هو السبريد (Spread)؟',
          body: 'الفارق البسيط بين Ask و Bid يُسمى السبريد. تخيّله مثل مكتب صرافة: يشتري العملة بسعر أقل قليلاً مما يبيعها به. الأسواق النشطة مثل BTC/USD و EUR/USD لها سبريد صغير جداً مما يقلل تكلفتك.',
          keyTakeaway: 'السبريد الأصغر يعني تكلفة دخول أقل ووصولاً أسرع لنقطة التعادل.',
        },
      ],
      quiz: [
        {
          id: 'l1-q1',
          question: 'إذا كان EUR/USD يعرض Bid عند 1.0580 و Ask عند 1.0582، بأي سعر تشتري الآن؟',
          options: ['1.0580 (سعر Bid)', '1.0582 (سعر Ask)', '1.0581 (المنتصف)', 'سعر الأمس'],
          explanation: 'عند الشراء الفوري تشتري من البائعين بسعر Ask وهو 1.0582.',
        },
        {
          id: 'l1-q2',
          question: 'لماذا تبدأ الصفقة الجديدة غالباً برقم سالب بسيط فور فتحها؟',
          options: [
            'بسبب خطأ في الحساب',
            'بسبب السبريد بين سعر الشراء (Ask) وسعر البيع الفوري (Bid)',
            'الأسعار تهبط دائماً بعد الشراء',
            'تخسر ١٠٪ تلقائياً في كل صفقة',
          ],
          explanation: 'أنت تدخل على سعر Ask ويُحسب تقييم خروجك اللحظي على سعر Bid، والسبريد هو هذا الفارق الأولي.',
        },
        {
          id: 'l1-q3',
          question: 'أي سوق يتميز عادةً بأصغر وأرخص سبريد للمبتدئين؟',
          options: [
            'الأزواج النشطة عالية السيولة مثل EUR/USD أو BTC/USD',
            'العملات النادرة التي بالكاد تتداول يومياً',
            'الأسواق المغلقة في العطلات',
            'جميع الأصول لها نفس السبريد دائماً',
          ],
          explanation: 'السيولة العالية تقرّب المشترين من البائعين فتقلّص الفارق السعري.',
        },
        {
          id: 'l1-q4',
          question: 'إذا توقعت هبوط السعر وأردت الربح من الهبوط، ماذا تفعل؟',
          options: ['شراء (Long)', 'بيع (Short)', 'انتظار سبريد أكبر', 'إغلاق الحساب'],
          explanation: 'صفقة البيع (Short) تحقق ربحاً عندما ينخفض السعر عن نقطة دخولك.',
        },
      ],
    },
    'lesson-2': {
      moduleTitle: 'الوحدة ١: أساسيات التداول',
      title: 'أوامر السوق والحد ووقف الخسارة وجني الأرباح',
      summary: 'أتقن الأوامر الأربعة الأساسية حتى لا تدخل عشوائياً ولا تنسى حماية رصيدك أبداً.',
      sections: [
        {
          heading: 'أمر السوق (Market) مقابل الأمر المحدد (Limit)',
          body: 'أمر Market ينفذ الشراء أو البيع فوراً بالسعر المتاح الآن. أما أمر Limit فيسمح لك بتحديد سعرك والانتظار بصبر، مثل: «اشترِ البيتكوين فقط إذا هبط إلى 88,000$». تتحكم بالسعر لكنه يُنفذ فقط إذا وصل السوق لهدفك.',
          keyTakeaway: 'استخدم Market للدخول الفوري، واستخدم Limit لانتظار سعر أفضل.',
        },
        {
          heading: 'شبكة الأمان: وقف الخسارة وجني الأرباح',
          body: 'وقف الخسارة (Stop-Loss) يغلق صفقتك تلقائياً إذا تحرك السعر ضدك بمقدار محدد ليمنع تحول الخطأ الصغير إلى خسارة كبيرة. جني الأرباح (Take-Profit) يغلق الصفقة ويحجز أرباحك تلقائياً عند الوصول لهدفك.',
          keyTakeaway: 'لا تفتح صفقة أبداً دون تحديد نقطة الخروج إذا كنت مخطئاً (Stop-Loss).',
        },
      ],
      quiz: [
        {
          id: 'l2-q1',
          question: 'البيتكوين الآن عند 91,000$ وتريد الشراء فقط إذا هبط إلى 89,500$. أي أمر تضع؟',
          options: ['أمر شراء Market', 'أمر شراء Limit عند 89,500$', 'أمر Stop-Loss', 'أمر بيع Market'],
          explanation: 'أمر الشراء المحدد (Buy Limit) ينتظر أسفل السعر الحالي ويُنفذ فقط عند 89,500$ أو أقل.',
        },
        {
          id: 'l2-q2',
          question: 'ما الوظيفة الأساسية لأمر وقف الخسارة (Stop-Loss)؟',
          options: [
            'ضمان ربح كل صفقة',
            'إغلاق الصفقة الخاسرة تلقائياً عند حدك المسبق لإبقاء الخسائر صغيرة',
            'مضاعفة حجم الصفقة تلقائياً',
            'إيقاف الرسم البياني',
          ],
          explanation: 'وقف الخسارة يعمل كحزام أمان يحدّ من أقصى خسارة ممكنة قبل تدخل العاطفة.',
        },
        {
          id: 'l2-q3',
          question: 'اشتريت ETH عند 3,000$ ووضعت جني الأرباح عند 3,300$. ماذا يحدث إذا وصل السعر إلى 3,300$ أثناء غيابك؟',
          options: [
            'لا يحدث شيء حتى تضغط إغلاق يدوياً',
            'تُغلق الصفقة تلقائياً قرب 3,300$ ويُحجز الربح',
            'يُحذف وقف الخسارة',
            'تبقى الصفقة مفتوحة للأبد',
          ],
          explanation: 'أمر Take-Profit ينفذ الإغلاق تلقائياً بمجرد ملامسة السعر لهدفك.',
        },
        {
          id: 'l2-q4',
          question: 'لماذا يُستخدم أمر السوق (Market) عند أهمية التوقيت؟',
          options: [
            'لأنه يعطي دائماً سعراً أفضل من Limit',
            'لأنه يضمن التنفيذ الفوري بالسعر الحالي للعرض أو الطلب',
            'لأنه يلغي وقف الخسارة',
            'يعمل فقط في الفوركس',
          ],
          explanation: 'أمر Market يعطي الأولوية للسرعة، بينما أمر Limit يعطي الأولوية للسعر الدقيق.',
        },
      ],
    },
    'lesson-3': {
      moduleTitle: 'الوحدة ٢: أسواق العملات الرقمية',
      title: 'أساسيات الكريبتو: تداول ٢٤/٧ والتقلبات والدورات',
      summary: 'افهم لماذا لا يُغلق سوق الكريبتو أبداً، وكيف تقود البيتكوين بقية العملات، وكيف تضبط حجم صفقاتك.',
      sections: [
        {
          heading: 'مفتوح دائماً بتحركات أسرع',
          body: 'بخلاف البورصات والبنوك، تعمل أسواق العملات الرقمية ٢٤ ساعة طوال أيام الأسبوع بما في ذلك العطلات. قد تتحرك بيتكوين أو سولانا بنسبة 3% إلى 8% في يوم واحد مقارنة بأقل من 1% عادة في أزواج الفوركس الرئيسية.',
          keyTakeaway: 'لأن تقلبات الكريبتو أكبر، يُنصح للمبتدئين التداول بمبالغ أصغر في كل صفقة.',
        },
        {
          heading: 'البيتكوين تقود السوق',
          body: 'عندما تتحرك البيتكوين بقوة صعوداً أو هبوطاً، غالباً ما تتبعها العملات البديلة مثل إيثيريوم وسولانا وكاردانو في نفس الاتجاه وبنسب أكبر. ألقِ نظرة دائماً على BTC/USD قبل تداول أي عملة أخرى.',
          keyTakeaway: 'تحقق من اتجاه البيتكوين أولاً — فهي تحدد المزاج العام لسوق الكريبتو.',
        },
      ],
      quiz: [
        {
          id: 'l3-q1',
          question: 'متى يُغلق سوق العملات الرقمية في عطلة نهاية الأسبوع؟',
          options: ['الجمعة ٥ مساءً', 'السبت منتصف الليل', 'لا يُغلق أبداً — يعمل ٢٤/٧', 'في العطل البنكية فقط'],
          explanation: 'تعمل شبكات العملات الرقمية بشكل متواصل طوال العام ليلاً ونهاراً.',
        },
        {
          id: 'l3-q2',
          question: 'مقارنة بزوج EUR/USD، لماذا يفضل المبتدئ تقليل حجم الصفقة على SOL/USD؟',
          options: [
            'العملات الرقمية تشهد تقلبات يومية أكبر بكثير',
            'لا يمكن بيع سولانا يوم الثلاثاء',
            'سبريد الكريبتو دائماً 0%',
            'الفوركس أغلى سعراً للوحدة',
          ],
          explanation: 'التقلب الأعلى يعني أرباحاً وخسائر أكبر لنفس المبلغ، لذا الحجم الأصغر يحفظ توازن المخاطرة.',
        },
        {
          id: 'l3-q3',
          question: 'لماذا تراقب BTC/USD قبل شراء عملة مثل ADA/USD؟',
          options: [
            'لا يمكن شراء ADA بدون امتلاك BTC',
            'اتجاه البيتكوين يؤثر بقوة على بقية سوق العملات الرقمية',
            'العملات البديلة لا تتحرك إلا عند ثبات BTC',
            'البيتكوين تحدد أسعار الفائدة',
          ],
          explanation: 'تمثل البيتكوين أكبر وزن في السوق وتقود المعنويات العامة.',
        },
        {
          id: 'l3-q4',
          question: 'ما العادة الذكية خلال عطلة نهاية الأسبوع في الكريبتو؟',
          options: [
            'إزالة جميع أوامر وقف الخسارة',
            'إبقاء وقف الخسارة مفعلاً لأن انخفاض السيولة قد يسبب قفزات حادة',
            'استخدام رافعة 20x',
            'تجاهل حدود المخاطرة',
          ],
          explanation: 'انخفاض السيولة في العطلات يزيد احتمالية التذبذب المفاجئ؛ وقف الخسارة يحميك.',
        },
      ],
    },
    'lesson-4': {
      moduleTitle: 'الوحدة ٣: أساسيات الفوركس',
      title: 'أزواج العملات والنقاط (Pips) وتسعير الفوركس',
      summary: 'افهم أزواج EUR/USD و USD/JPY ببساطة واحسب القيمة الدقيقة لحركة ١٠ نقاط.',
      sections: [
        {
          heading: 'تداول عملتين مقابل بعضهما دائماً',
          body: 'في الفوركس تقارن عملة بأخرى مثل EUR/USD. الأولى (EUR) هي العملة الأساسية، والثانية (USD) هي عملة التسعير. إذا كان السعر 1.0600 فهذا يعني أن ١ يورو يساوي 1.0600 دولار. الشراء يعني توقع ارتفاع اليورو مقابل الدولار.',
          keyTakeaway: 'الشراء = ارتفاع العملة الأولى مقابل الثانية. البيع = انخفاض العملة الأولى.',
        },
        {
          heading: 'ما هي النقطة (Pip)؟',
          body: 'تتحرك العملات بأجزاء صغيرة جداً تُقاس بـ«النقاط» (Pips). في معظم الأزواج مثل EUR/USD، النقطة الواحدة هي الخانة العشرية الرابعة (0.0001). أما في أزواج الين الياباني مثل USD/JPY، فالنقطة هي الخانة الثانية (0.01).',
          keyTakeaway: 'ارتفاع EUR/USD من 1.0600 إلى 1.0625 يعني ربح +٢٥ نقطة.',
        },
      ],
      quiz: [
        {
          id: 'l4-q1',
          question: 'في زوج GBP/USD، أي عملة هي العملة الأساسية (Base)؟',
          options: ['USD (الدولار الأمريكي)', 'GBP (الجنيه الإسترليني)', 'EUR (اليورو)', 'كلاهما معاً'],
          explanation: 'العملة المكتوبة أولاً في أي زوج فوركس هي دائماً العملة الأساسية.',
        },
        {
          id: 'l4-q2',
          question: 'ارتفع EUR/USD من 1.0550 إلى 1.0580. كم نقطة تحرك؟',
          options: ['3 نقاط', '30 نقطة', '300 نقطة', '0.3 نقطة'],
          explanation: '0.0030 مقسوماً على 0.0001 (قيمة النقطة) يساوي ٣٠ نقطة.',
        },
        {
          id: 'l4-q3',
          question: 'أي زوج يقيس النقطة الواحدة عند الخانة العشرية الثانية (0.01) بدلاً من الرابعة؟',
          options: ['EUR/USD', 'AUD/USD', 'USD/JPY', 'GBP/USD'],
          explanation: 'أزواج الين الياباني (JPY) تُسعّر قرب 100–160، لذا فإن النقطة هي 0.01.',
        },
        {
          id: 'l4-q4',
          question: 'إذا توقعت أن يقوى الدولار الأمريكي مقابل اليورو، ماذا تفعل على EUR/USD؟',
          options: ['شراء EUR/USD', 'بيع (Short) EUR/USD', 'شراء بيتكوين', 'انتظار 0 نقطة'],
          explanation: 'عندما يقوى الدولار ينخفض سعر EUR/USD، لذا يحقق البيع ربحاً.',
        },
      ],
    },
    'lesson-5': {
      moduleTitle: 'الوحدة ٤: قراءة الرسوم البيانية',
      title: 'قراءة الشموع اليابانية والاتجاهات',
      summary: 'اقرأ قصة كل شمعة خضراء وحمراء: الافتتاح والأعلى والأدنى والإغلاق وصراع المشترين والبائعين.',
      sections: [
        {
          heading: 'الأرقام الأربعة داخل كل شمعة',
          body: 'تلخص كل شمعة حركة التداول خلال فترة محددة (مثل ١٥ دقيقة أو ساعة). المستطيل («الجسم») يوضح سعر الافتتاح والإغلاق. الشمعة الخضراء تعني أن الإغلاق أعلى من الافتتاح، والحمراء تعني إغلاقاً أدنى.',
          keyTakeaway: 'جسم أخضر = انتصر المشترون في تلك الفترة. جسم أحمر = انتصر البائعون.',
        },
        {
          heading: 'ماذا تخبرنا الذيول الطويلة؟',
          body: 'الخطوط الرفيعة أعلى وأسفل الجسم هي «الذيول» وتُظهر أعلى وأدنى سعر تم الوصول إليه. الذيل السفلي الطويل يعني أن البائعين دفعوا السعر للهبوط، لكن المشترين تدخلوا بقوة وأعادوه للأعلى.',
          keyTakeaway: 'الذيول الطويلة تشير غالباً إلى رفض سعري عند مستويات الدعم أو المقاومة.',
        },
      ],
      quiz: [
        {
          id: 'l5-q1',
          question: 'على رسم ١٥ دقيقة، ماذا تمثل الشمعة الخضراء الواحدة؟',
          options: [
            'صفقة واحدة قديمة',
            'الافتتاح، والإغلاق الأعلى، وأعلى وأدنى سعر خلال تلك الـ١٥ دقيقة',
            'ربحاً مضموناً للساعة القادمة',
            'مؤشراً خاصاً بالفوركس فقط',
          ],
          explanation: 'تعرض كل شمعة الأسعار الأربعة (الافتتاح، الأعلى، الأدنى، الإغلاق) لإطارها الزمني.',
        },
        {
          id: 'l5-q2',
          question: 'ماذا يعني وجود ذيل طويل جداً أسفل الشمعة عادةً؟',
          options: [
            'عطل في الرسم البياني',
            'هبط السعر بقوة ثم تدخل المشترون بقوة ورفعوه مجدداً',
            'انعدام حجم التداول',
            'انتصار كامل للبائعين بلا مقاومة',
          ],
          explanation: 'الذيل السفلي الطويل يدل على رفض شرائي قوي بعد الهبوط.',
        },
        {
          id: 'l5-q3',
          question: 'في الاتجاه الصاعد الصحي، ما النمط الذي تشكله الشموع عادةً؟',
          options: [
            'قمم وقيعان هابطة',
            'قمم أعلى وقيعان أعلى',
            'خط أفقي تماماً',
            'فجوات عشوائية فقط',
          ],
          explanation: 'يصعد الاتجاه الصاعد كالسلالم بحيث تكون كل قمة وكل قاع أعلى من سابقه.',
        },
        {
          id: 'l5-q4',
          question: 'أي إطار زمني يمنح المبتدئين رؤية أهدأ وأوضح وأقل ضجيجاً؟',
          options: ['رسم ١ دقيقة', 'رسم ١ ساعة (1H) أو ٤ ساعات (4H)', '٥ ثوانٍ', 'سجل كل حركة لحظية'],
          explanation: 'الأطر الأكبر (1H و 4H) تزيل التذبذب العشوائي وتظهر اتجاهات أنظف.',
        },
      ],
    },
    'lesson-6': {
      moduleTitle: 'الوحدة ٤: قراءة الرسوم البيانية',
      title: 'مؤشرات مبسطة: المتوسطات المتحركة وبولينجر و RSI',
      summary: 'استخدم المؤشرات بوضوح: حدد الاتجاه بـ SMA/EMA وتجنب ملاحقة الارتفاعات المفرطة بمؤشر RSI.',
      sections: [
        {
          heading: 'المتوسطات المتحركة (SMA 20 و EMA 50)',
          body: 'يرسم المتوسط المتحرك خطاً سلساً لمتوسط السعر خلال آخر ٢٠ أو ٥٠ شمعة. عندما يكون السعر فوق متوسط صاعد، يكون الاتجاه صاعداً ويساعدك ذلك على تجنب الشراء عكس الاتجاه العام.',
          keyTakeaway: 'السعر فوق متوسط صاعد = ميل صعودي. تحت متوسط هابط = ميل هبوطي.',
        },
        {
          heading: 'حزم بولينجر ومؤشر RSI',
          body: 'ترسم حزم بولينجر قناة تتسع وتضيق حسب التقلب. ويقيس RSI (من 0 إلى 100) سرعة الحركة: فوق 70 يعني تشبعاً شرائياً محتملاً، وتحت 30 يعني تشبعاً بيعياً محتملاً.',
          keyTakeaway: 'المؤشرات تدعم قراءتك للسعر — لا تشترِ عشوائياً لمجرد وصول RSI إلى 30.',
        },
      ],
      quiz: [
        {
          id: 'l6-q1',
          question: 'إذا كان السعر يتداول بثبات فوق متوسط SMA 20 صاعد، ما أبسط تفسير؟',
          options: ['السوق في اتجاه صاعد', 'السوق متوقف', 'يجب البيع فوراً', 'الحجم سالب'],
          explanation: 'بقاء السعر فوق متوسط متحرك صاعد علامة كلاسيكية على الزخم الصعودي.',
        },
        {
          id: 'l6-q2',
          question: 'إلى ماذا يشير وصول RSI فوق 70 تقليدياً؟',
          options: [
            'تحرك السعر صعوداً بسرعة وقد يكون متشبعاً شرائياً وقريباً من تهدئة',
            'الأصل بلا قيمة',
            'يجب استخدام رافعة 20x',
            'تضاعف السبريد',
          ],
          explanation: 'RSI فوق 70 يعكس زخماً صاعداً قوياً قد يكون ممدداً على المدى القصير.',
        },
        {
          id: 'l6-q3',
          question: 'لماذا تتسع حزم بولينجر وتضيق بمرور الوقت؟',
          options: [
            'لأنها تتفاعل مع تغيرات تقلب السوق',
            'تتغير عشوائياً كل منتصف ليل',
            'تقيس حجم النقطة فقط',
            'تعرض رصيد حسابك',
          ],
          explanation: 'تتسع الحزم عند ارتفاع التقلب وتضيق أثناء الهدوء والتماسك.',
        },
        {
          id: 'l6-q4',
          question: 'ما أذكى طريقة لاستخدام مؤشرات مثل RSI والمتوسطات المتحركة؟',
          options: [
            'إضافة ١٥ مؤشراً فوق الرسم',
            'استخدام مؤشر اتجاه + مؤشر زخم مع وقف خسارة واضح',
            'تجاهل إدارة المخاطر عند RSI < 30',
            'التداول حسب الألوان فقط',
          ],
          explanation: 'البساطة تتفوق: أداة اتجاه واحدة + أداة زخم واحدة + قاعدة مخاطرة واضحة.',
        },
      ],
    },
    'lesson-7': {
      moduleTitle: 'الوحدة ٥: المخاطرة والانضباط',
      title: 'قاعدة 1–2%، نسبة العائد للمخاطرة، وحجم الصفقة',
      summary: 'تعلّم المعادلة الأولى التي تحفظ استمرارية المتداولين — حتى لو خسروا نصف صفقاتهم.',
      sections: [
        {
          heading: 'لا تخاطر برصيدك في فكرة واحدة',
          body: 'حتى المحترفون يخسرون 40–50% من صفقاتهم. سرّهم هو الحجم: يخاطرون فقط بنسبة 1% إلى 2% من الرصيد عند تفعيل وقف الخسارة. في حساب 100,000$، المخاطرة بـ 1% تعني خسارة قصوى 1,000$ — ستحتاج ١٠٠ خسارة متتالية لتفقد الحساب!',
          keyTakeaway: 'خاطر بـ 1% أو أقل كمبتدئ. حماية رأس المال أولاً.',
        },
        {
          heading: 'نسبة المخاطرة إلى العائد (1:2 أو أفضل)',
          body: 'قبل الشراء أو البيع، قارن خسارتك المحتملة عند وقف الخسارة بربحك المستهدف عند جني الأرباح. المخاطرة بـ 500$ لربح 1,000$ هي نسبة 1:2. عند هذه النسبة تحتاج الفوز في 34% فقط من صفقاتك للتعادل!',
          keyTakeaway: 'استهدف صفقات يكون فيها الربح المحتمل ضعف المخاطرة على الأقل.',
        },
      ],
      quiz: [
        {
          id: 'l7-q1',
          question: 'في حساب 100,000$ وباستخدام قاعدة 1%، ما أقصى خسارة تسمح بها في صفقة واحدة؟',
          options: ['10,000$', '1,000$', '50,000$', '100$'],
          explanation: '1% من 100,000$ يساوي 1,000$ كحد أقصى للخسارة عند وقف الخسارة.',
        },
        {
          id: 'l7-q2',
          question: 'كل صفقة رابحة تكسب +600$ وكل خاسرة تخسر -300$ (نسبة 1:2). إذا ربحت 50% من ١٠ صفقات، ما صافي الربح؟',
          options: ['0$', '+1,500$ ربح', '-1,500$ خسارة', '+3,000$ ربح'],
          explanation: '٥ أرباح × 600$ = +3,000$؛ ٥ خسائر × -300$ = -1,500$؛ الصافي = +1,500$.',
        },
        {
          id: 'l7-q3',
          question: 'ما الخطر الخفي للرافعة المالية العالية (مثل 20x) على المبتدئين؟',
          options: [
            'تقلل الرسوم',
            'تحرك بسيط بنسبة 5% ضدك قد يمحو 100% من هامش الصفقة',
            'تعطل الشموع',
            'تعمل في الحساب التجريبي فقط',
          ],
          explanation: 'الرافعة تضاعف الخسائر كما تضاعف الأرباح: 5% × 20 = 100%.',
        },
        {
          id: 'l7-q4',
          question: 'متى يجب إبعاد وقف الخسارة أكثر أثناء صفقة خاسرة؟',
          options: [
            'كلما تمنيت ارتداد السعر',
            'أبداً — تحريك وقف الخسارة بعيداً يكسر خطتك ويحول الخسارة الصغيرة لكبيرة',
            'كل يوم جمعة',
            'عندما يتجاوز RSI قيمة 50',
          ],
          explanation: 'الالتزام بوقف الخسارة الأصلي يحمي رأس مالك ويبقي تحليلاتك دقيقة.',
        },
      ],
    },
    'lesson-8': {
      moduleTitle: 'الوحدة ٦: خطط التدريب العملي',
      title: 'استراتيجيتان للمبتدئين يمكنك تجربتهما اليوم',
      summary: 'اجمع ما تعلمته في خطتين واضحتين: الارتداد مع الاتجاه والارتداد داخل النطاق.',
      sections: [
        {
          heading: 'الخطة أ: التراجع مع الاتجاه (Trend Pullback)',
          body: '١. انتقل لإطار 1H أو 4H وشغّل SMA 20. ٢. تأكد أن السعر فوق متوسط SMA 20 صاعد. ٣. انتظر تراجعاً هادئاً نحو المتوسط بدلاً من مطاردة الشموع الخضراء الكبيرة. ٤. اشترِ مع وقف خسارة أسفل القاع الأخير وهدف ضعف المخاطرة.',
          keyTakeaway: 'اشترِ التراجعات الصحية داخل اتجاه قائم بدلاً من ملاحقة القمم.',
        },
        {
          heading: 'الخطة ب: ارتداد بولينجر + RSI في النطاق العرضي',
          body: 'عندما يتحرك زوج مثل EUR/USD جانبياً بهدوء: ١. فعّل حزم بولينجر و RSI. ٢. ابحث عن ملامسة السعر للحد السفلي مع RSI قرب 30–35 ثم شمعة انعكاس خضراء. ٣. استهدف الخط الأوسط مع وقف خسارة قريب.',
          keyTakeaway: 'راجع سجل صفقاتك بعد ١٠–٢٠ صفقة تجريبية لتعرف أي أسلوب يناسبك أكثر.',
        },
      ],
      quiz: [
        {
          id: 'l8-q1',
          question: 'في خطة التراجع مع الاتجاه، ما التوقيت الأفضل للشراء؟',
          options: [
            'بعد شمعة خضراء ضخمة بعيدة جداً عن SMA 20',
            'بعد تراجع هادئ يعيد السعر قرب متوسط SMA 20 الصاعد',
            'عندما يهبط SMA 20 بحدة',
            'بدون وقف خسارة',
          ],
          explanation: 'الدخول عند تراجع قرب الدعم/SMA 20 يمنحك وقف خسارة أقرب ونسبة عائد أفضل.',
        },
        {
          id: 'l8-q2',
          question: 'لماذا تراجع سجل الصفقات التاريخي بعد ١٠–٢٠ صفقة تجريبية؟',
          options: [
            'لقياس نسبة نجاحك الفعلية ومعرفة الصفقات التي تناسبك',
            'لأن السجل يُحذف بعد ٢٤ ساعة',
            'لمسح الصفقات الخاسرة',
            'لتغيير ألوان الرسم فقط',
          ],
          explanation: 'تحليلات أدائك تحوّل التمرين إلى مهارة قابلة للقياس.',
        },
        {
          id: 'l8-q3',
          question: 'كيف تساعدك تنبيهات الأسعار على التداول بهدوء؟',
          options: [
            'تُعلمك تلقائياً عند وصول السعر لمنطقتك المخططة دون مراقبة الشاشة طوال اليوم',
            'تفتح صفقات عشوائية',
            'تتنبأ بالأخبار',
            'تلغي السبريد',
          ],
          explanation: 'التنبيهات تتيح لك التصرف فقط عند تحقق شروط السعر التي خططت لها.',
        },
        {
          id: 'l8-q4',
          question: 'ما أفضل علامة على تقدمك في الحساب التجريبي؟',
          options: [
            'ضربة حظ واحدة بأقصى رافعة',
            'الالتزام بقواعد حجم الصفقة ووقف الخسارة بانتظام خلال ١٥–٢٠ صفقة مسجلة',
            'تعطيل أوامر الحماية',
            'الاختيار العشوائي حسب الشعار',
          ],
          explanation: 'الاتساق والانضباط عبر عينة كافية من الصفقات هما أساس المهارة الحقيقية.',
        },
      ],
    },
    'lesson-9': {
      moduleTitle: 'الوحدة ٧: هيكل السوق والجلسات والأخبار',
      title: 'الدعم والمقاومة، الاختراقات الكاذبة وتقلبات الأخبار',
      summary: 'ميّز الدعوم والمقاومات الحقيقية، وتجنّب مصائد الاختراق الكاذب، وافهم أوقات السيولة والانزلاق السعري.',
      sections: [
        {
          heading: 'الدعم والمقاومة وتجنب الاختراقات الكاذبة (Fakeouts)',
          body: 'الدعم منطقة يتدخل فيها المشترون؛ والمقاومة سقف يظهر عنده البائعون. الشراء فور ملامسة المقاومة بنقطة واحدة يوقعك في «اختراق كاذب» يرتد سريعاً للداخل. انتظار إغلاق الشمعة بثبات خارج المستوى — أو إعادة اختباره بهدوء — يحميك من معظم المصائد.',
          keyTakeaway: 'انتظر إغلاق الشمعة وإعادة الاختبار بدلاً من مطاردة ذيل اختراق مفاجئ.',
        },
        {
          heading: 'جلسات التداول والانزلاق السعري (Slippage) والأخبار القوية',
          body: 'تتغير السيولة على مدار اليوم. في الفوركس يمنحك تداخل جلستي لندن ونيويورك أفضل سيولة وأقل سبريد، بينما تكون ساعات التبديل الليلية أضعف. وأثناء الأخبار الكبرى كالتضخم وقرارات الفائدة يتسع السبريد وقد تُنفذ الأوامر بسعر أبعد («انزلاق سعري»).',
          keyTakeaway: 'تجنب فتح صفقات قصيرة جديدة قبل دقائق من صدور أخبار اقتصادية كبرى.',
        },
      ],
      quiz: [
        {
          id: 'l9-q1',
          question: 'كيف يقلل المحترفون خطر الوقوع في مصيدة اختراق كاذب للمقاومة؟',
          options: [
            'الشراء فوراً بمجرد اختراق السعر للمقاومة لثانية واحدة',
            'انتظار إغلاق واضح للشمعة أعلى المقاومة أو إعادة اختبارها كدعم جديد',
            'حذف أمر وقف الخسارة تماماً',
            'التداول على إطار ثانية واحدة فقط',
          ],
          explanation: 'إغلاق الشمعة أو إعادة الاختبار يؤكدان قبول المشترين للأسعار الجديدة.',
        },
        {
          id: 'l9-q2',
          question: 'ما هو «الانزلاق السعري» (Slippage) أثناء صدور خبر قوي مثل التضخم؟',
          options: [
            'خصم ترويجي على عمولة الوسيط',
            'تنفيذ أمرك بسعر أسوأ من المتوقع بسبب فجوة سريعة وضعف السيولة اللحظية',
            'تغيّر ألوان الشموع تلقائياً',
            'ربح مضمون في أوامر السوق',
          ],
          explanation: 'أثناء القفزات العنيفة قد يقفز السعر متجاوزاً السعر المطلوب فينفذ الأمر على أقرب سعر متاح.',
        },
        {
          id: 'l9-q3',
          question: 'متى يوفر زوج EUR/USD عادةً أعلى سيولة وأقل سبريد؟',
          options: [
            'أثناء تداخل جلستي لندن ونيويورك',
            'عند منتصف الليل وقت إغلاق البنوك اليومي',
            'في العطل المصرفية العالمية الكبرى',
            'السبريد لا يتغير إطلاقاً',
          ],
          explanation: 'تعمل البنوك الأوروبية والأمريكية معاً في هذه الفترة مما يضيق السبريد.',
        },
        {
          id: 'l9-q4',
          question: 'ما التصرف الأكثر أماناً قبل ٥ دقائق من قرار بنك مركزي مهم؟',
          options: [
            'رفع الرافعة إلى 20x لتخمين الاتجاه',
            'البقاء خارج السوق حتى تهدأ التذبذبات المزدوجة الأولية',
            'إلغاء جميع أهداف جني الأرباح',
            'فتح صفقات عشوائية بدون وقف خسارة',
          ],
          explanation: 'التذبذب العنيف بالاتجاهين يضرب أوامر الوقف في الجهتين قبل استقرار الاتجاه الحقيقي.',
        },
      ],
    },
    'lesson-10': {
      moduleTitle: 'الوحدة ٨: نفسية التداول والجاهزية للحقيقي',
      title: 'نفسية التداول، التدوين وقائمة التحقق قبل الحساب الحقيقي',
      summary: 'تغلّب على الطمع والانتقام، وطبّق سقف الخسارة اليومي، وتحقق من كل بند قبل الانتقال للتداول الفعلي.',
      sections: [
        {
          heading: 'هزيمة الخوف من فوات الفرصة (FOMO) والتداول الانتقامي',
          body: 'معظم الخسائر الكبيرة سببها النفسية لا المؤشرات. يدفعك FOMO لملاحقة شمعة صاعدة متأخراً، ويدفعك التداول الانتقامي لمضاعفة الحجم بعد خسارة لاستردادها بسرعة. ضع سقف خسارة يومي صارم (مثلاً التوقف لبقية اليوم بعد خسارتين أو -3%).',
          keyTakeaway: 'لا تضاعف حجم الصفقة بعد الخسارة أبداً — توقف فوراً عند بلوغ حدك اليومي.',
        },
        {
          heading: 'قائمة الجاهزية من التجريبي للحقيقي وأمان الوسيط',
          body: 'قبل المخاطرة بأموال حقيقية: ١. سجّل ٢٠–٣٠ صفقة تجريبية متتالية ملتزماً بقاعدة ١٪ ووقف الخسارة؛ ٢. اختر وسيطاً مرخصاً برقابة قوية ورسوم واضحة؛ ٣. تداول فقط بفائض مالي يمكنك تحمّل خسارته — لا تستخدم أموال الإيجار أو الديون.',
          keyTakeaway: 'انتقل من التجريبي لحجم حقيقي صغير فقط بعد إثبات انضباطك في ٢٠+ صفقة مسجلة.',
        },
      ],
      quiz: [
        {
          id: 'l10-q1',
          question: 'تعرّضت لخسارتين متتاليتين عند وقف الخسارة (-2% اليوم). ما التصرف المنضبط؟',
          options: [
            'مضاعفة حجم الصفقة التالية لتعويض الخسارة قبل نهاية اليوم',
            'التوقف عن التداول اليوم، ومراجعة الصفقات في السجل، والعودة بهدوء غداً',
            'إزالة وقف الخسارة في الصفقة الثالثة',
            'الانتقال لرافعة 25x على عملة عشوائية',
          ],
          explanation: 'سقف الخسارة اليومي يكسر دوامة الانتقام قبل استنزاف الحساب.',
        },
        {
          id: 'l10-q2',
          question: 'كيف يظهر سلوك «FOMO» عادةً على الرسم البياني؟',
          options: [
            'الانتظار بصبر بأمر محدد عند مستوى الدعم',
            'مطاردة شمعة خضراء ضخمة متأخراً بعيداً عن الدعم خوفاً من فوات الحركة',
            'إغلاق صفقة رابحة عند جني الأرباح',
            'مراجعة المفكرة الاقتصادية',
          ],
          explanation: 'الدخول المتأخر بعد قفزة ممتدة يرفع مخاطرتك ويقلل العائد المحتمل.',
        },
        {
          id: 'l10-q3',
          question: 'ما الدليل الحقيقي على جاهزيتك لاختبار مبالغ حقيقية صغيرة بعد الحساب التجريبي؟',
          options: [
            'ربح صفقة حظ واحدة أمس بدون وقف خسارة',
            'تدوين ٢٠–٣٠+ صفقة تجريبية مع الالتزام بنسبة ١٪ ووقف الخسارة في كل صفقة',
            'حفظ أسماء ١٢ مؤشراً دون تطبيق عملي',
            'الاقتراض عبر بطاقة ائتمان للإيداع بسرعة',
          ],
          explanation: 'الجاهزية تُثبت بالتنفيذ المنضبط المتكرر عبر عينة صفقات كافية.',
        },
        {
          id: 'l10-q4',
          question: 'عند اختيار وسيط أو منصة تداول حقيقية بعد إتمام الدورات، ما الأولوية الأولى؟',
          options: [
            'من يقدم أعلى مكافأة ورافعة 500x',
            'الترخيص الرقابي الصارم، وفصل أموال العملاء، ووضوح الرسوم والسبريد',
            'حسابات مجهولة تعد بأرباح يومية مضمونة',
            'تجاهل المصادقة الثنائية 2FA',
          ],
          explanation: 'الرقابة التنظيمية الرسمية وأمان 2FA ووضوح التكاليف تأتي قبل أي عروض دعائية.',
        },
      ],
    },
  },
};
