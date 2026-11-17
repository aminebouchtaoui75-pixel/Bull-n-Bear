import type {Language} from '../i18n/types';
import type {StrategyCategory, StrategyId} from '../types/trading';

export interface StrategyLocalizedContent {
  name: string;
  tagline: string;
  plainSummary: string;
  correctSteps: [string, string, string];
  mistakeSteps: [string, string, string];
  correctOutcome: string;
  mistakeOutcome: string;
  checklist: [string, string, string];
  realExample: {
    title: string;
    timeframe: string;
    dateWindow: string;
    entryTrigger: string;
    entryPrice: string;
    stopLossPrice: string;
    takeProfitPrice: string;
    moveResult: string;
    whyItWorked: string;
  };
}

export interface StrategyDefinition {
  id: StrategyId;
  category: StrategyCategory;
  level: 'Beginner' | 'Intermediate';
  bias: 'bullish' | 'bearish';
  practiceSymbol: string;
  typicalRiskReward: string;
  /** Normalized 0..100 chart path for real-example visual mini-diagram */
  examplePath: Array<[number, number]>;
  exampleKeyLevels: {
    entryY: number;
    stopY: number;
    targetY: number;
    triggerX: number;
  };
  translations: Record<Language, StrategyLocalizedContent>;
}

export const TRADING_STRATEGIES: StrategyDefinition[] = [
  {
    id: 'head-shoulders',
    category: 'reversal',
    level: 'Beginner',
    bias: 'bearish',
    practiceSymbol: 'BTC/USD',
    typicalRiskReward: '1 : 2.0',
    examplePath: [
      [8, 72],
      [22, 36],
      [34, 62],
      [48, 18],
      [61, 62],
      [73, 38],
      [84, 64],
      [95, 88],
    ],
    exampleKeyLevels: {
      entryY: 62,
      stopY: 36,
      targetY: 88,
      triggerX: 83,
    },
    translations: {
      en: {
        name: 'Head & Shoulders',
        tagline: 'Spot when an uptrend runs out of buyers and prepares to reverse downward',
        plainSummary:
          'Price makes a peak (Left Shoulder), surges to a higher peak (Head), then fails to reach the high on a third bounce (Right Shoulder). When price breaks below the floor connecting the dips (Neckline), sellers take control.',
        correctSteps: [
          'Spot Left Shoulder, higher Head, and lower Right Shoulder testing the horizontal Neckline.',
          'Wait patiently for a clean candle break below the Neckline—never guess early.',
          'Sell on the breakdown or retest with Stop-Loss above the Right Shoulder and Target equal to Head-to-Neckline height.',
        ],
        mistakeSteps: [
          'Shorting blindly right at the top of the Head while buyers are still strongly pushing up.',
          'Ignoring the Neckline confirmation or trading without a protective Stop-Loss.',
          'Price rallies higher and wipes out the early short before the pattern even completes.',
        ],
        correctOutcome: 'Confirmed neckline break + defined Stop-Loss yields a clean 1:2.0 short trade.',
        mistakeOutcome: 'Guessing the top early gets squeezed out before the real reversal begins.',
        checklist: [
          'Right Shoulder peak is clearly lower than the Head.',
          'A full candle closes cleanly below the Neckline support.',
          'Distance from Neckline to Target is at least 1.5x–2x your Stop-Loss risk.',
        ],
        realExample: {
          title: 'BTC/USD 4H Breakdown Setup',
          timeframe: '4H Chart',
          dateWindow: 'Spring Cycle Peak',
          entryTrigger: '4H candle close below $67,200 neckline',
          entryPrice: '$67,100',
          stopLossPrice: '$69,750',
          takeProfitPrice: '$61,800',
          moveResult: '-7.9% drop (+2.0R gain)',
          whyItWorked:
            'Buyers failed to push Bitcoin back near $71,800 on the Right Shoulder bounce ($69,500), proving demand was exhausted. Once the $67,200 neckline cracked, trapped long positions triggered a fast drop straight to the measured target.',
        },
      },
      fr: {
        name: 'Épaule-Tête-Épaule',
        tagline: 'Repérez l’essoufflement d’une tendance haussière avant le retournement baissier',
        plainSummary:
          'Le prix forme un premier sommet (Épaule gauche), un sommet plus haut (Tête), puis un rebond plus faible (Épaule droite). La cassure de la ligne de cou valide la prise de contrôle des vendeurs.',
        correctSteps: [
          'Identifiez l’Épaule gauche, la Tête plus haute et l’Épaule droite plus basse sur la ligne de cou.',
          'Attendez la cassure nette sous la ligne de cou sans anticiper trop tôt.',
          'Vendez à la cassure ou au retest avec Stop-Loss au-dessus de l’Épaule droite et objectif égal à la hauteur Tête–Cou.',
        ],
        mistakeSteps: [
          'Vendre à découvert au sommet de la Tête alors que les acheteurs dominent encore.',
          'Ignorer la confirmation de la ligne de cou ou oublier le Stop-Loss.',
          'Le prix remonte brutalement et liquide la position avant la formation de l’Épaule droite.',
        ],
        correctOutcome: 'Cassure validée + Stop-Loss défini = ratio rendement/risque propre de 1:2.0.',
        mistakeOutcome: 'Anticiper le sommet trop tôt expose à un squeeze inutile.',
        checklist: [
          'Le sommet de l’Épaule droite est nettement inférieur à celui de la Tête.',
          'Une bougie complète clôture sous le support de la ligne de cou.',
          'L’objectif mesuré offre au moins 1,5x à 2x le risque du Stop-Loss.',
        ],
        realExample: {
          title: 'BTC/USD — Cassure en 4H',
          timeframe: 'Graphique 4H',
          dateWindow: 'Sommet de cycle',
          entryTrigger: 'Clôture 4H sous la ligne de cou à 67 200 $',
          entryPrice: '67 100 $',
          stopLossPrice: '69 750 $',
          takeProfitPrice: '61 800 $',
          moveResult: 'Baisse -7,9 % (+2.0R)',
          whyItWorked:
            'Les acheteurs n’ont pas réussi à ramener le Bitcoin vers 71 800 $ lors de l’Épaule droite (69 500 $). La rupture des 67 200 $ a déclenché les stops acheteurs jusqu’à l’objectif théorique.',
        },
      },
      es: {
        name: 'Hombro-Cabeza-Hombro',
        tagline: 'Detecta cuándo una tendencia alcista pierde fuerza antes de girar a la baja',
        plainSummary:
          'El precio forma un pico (Hombro izquierdo), un pico más alto (Cabeza) y un rebote más débil (Hombro derecho). Al romper la línea de cuello hacia abajo, los vendedores toman el mando.',
        correctSteps: [
          'Identifica Hombro izquierdo, Cabeza más alta y Hombro derecho más bajo sobre la línea de cuello.',
          'Espera con paciencia el cierre de vela debajo de la línea de cuello.',
          'Vende tras la ruptura o retesteo con Stop-Loss sobre el Hombro derecho y objetivo igual a la altura Cabeza–Cuello.',
        ],
        mistakeSteps: [
          'Entrar en venta justo en la cima de la Cabeza mientras la tendencia sigue fuerte.',
          'Operar sin esperar ruptura de cuello o sin Stop-Loss de protección.',
          'Un último impulso alcista te saca en pérdida antes de completarse el patrón.',
        ],
        correctOutcome: 'Ruptura confirmada + Stop-Loss claro ofrece una operación limpia 1:2.0.',
        mistakeOutcome: 'Adivinar el techo demasiado pronto termina en pérdida evitable.',
        checklist: [
          'El pico del Hombro derecho es claramente más bajo que la Cabeza.',
          'Una vela completa cierra por debajo de la línea de cuello.',
          'La distancia al objetivo es al menos 1.5x–2x tu riesgo en Stop-Loss.',
        ],
        realExample: {
          title: 'BTC/USD — Ruptura en 4H',
          timeframe: 'Gráfico 4H',
          dateWindow: 'Techo de ciclo',
          entryTrigger: 'Cierre 4H bajo línea de cuello en $67,200',
          entryPrice: '$67,100',
          stopLossPrice: '$69,750',
          takeProfitPrice: '$61,800',
          moveResult: 'Caída -7.9% (+2.0R)',
          whyItWorked:
            'Los compradores no lograron volver a $71,800 en el Hombro derecho ($69,500). Al perder $67,200, el precio aceleró directo al objetivo proyectado.',
        },
      },
      ar: {
        name: 'نموذج الرأس والكتفين',
        tagline: 'اكتشف ضعف المشترين ونهاية الاتجاه الصاعد قبل الانعكاس الهبوطي',
        plainSummary:
          'يشكّل السعر قمة أولى (الكتف الأيسر)، ثم قمة أعلى (الرأس)، ثم ارتداداً أضعف (الكتف الأيمن). عند كسر خط العنق للأسفل يسيطر البائعون.',
        correctSteps: [
          'حدّد الكتف الأيسر والرأس الأعلى والكتف الأيمن الأدنى فوق خط العنق.',
          'انتظر إغلاق شمعة واضحة أسفل خط العنق ولا تستعجل الدخول.',
          'ادخل بيعاً بعد الكسر مع وقف خسارة فوق الكتف الأيمن وهدف يساوي ارتفاع الرأس عن خط العنق.',
        ],
        mistakeSteps: [
          'البيع المبكر عند قمة الرأس أثناء اندفاع المشترين القوي.',
          'تجاهل كسر خط العنق أو التداول بدون وقف خسارة واضح.',
          'ارتداد السعر للأعلى يضرب الصفقة قبل اكتمال الكتف الأيمن.',
        ],
        correctOutcome: 'تأكيد كسر خط العنق مع وقف خسارة محدد يحقق صفقة بيع بنسبة عائد 1:2.0.',
        mistakeOutcome: 'محاولة تخمين القمة مبكراً تؤدي غالباً لخسارة سريعة.',
        checklist: [
          'قمة الكتف الأيمن أقل بوضوح من قمة الرأس.',
          'إغلاق شمعة كاملة أسفل دعم خط العنق.',
          'المسافة إلى الهدف لا تقل عن 1.5x إلى 2x من مسافة وقف الخسارة.',
        ],
        realExample: {
          title: 'مثال BTC/USD على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'قمة دورة سوقية',
          entryTrigger: 'إغلاق شمعة 4 ساعات أسفل خط العنق 67,200$',
          entryPrice: '$67,100',
          stopLossPrice: '$69,750',
          takeProfitPrice: '$61,800',
          moveResult: 'هبوط -7.9% (ربح +2.0R)',
          whyItWorked:
            'فشل المشترون في العودة لقمة 71,800$ عند الكتف الأيمن (69,500$). وبمجرد كسر 67,200$، تسارع الهبوط مباشرة نحو الهدف المحسوب.',
        },
      },
    },
  },
  {
    id: 'double-bottom',
    category: 'reversal',
    level: 'Beginner',
    bias: 'bullish',
    practiceSymbol: 'EUR/USD',
    typicalRiskReward: '1 : 2.2',
    examplePath: [
      [8, 28],
      [25, 76],
      [43, 48],
      [60, 75],
      [75, 48],
      [94, 18],
    ],
    exampleKeyLevels: {
      entryY: 48,
      stopY: 82,
      targetY: 18,
      triggerX: 75,
    },
    translations: {
      en: {
        name: 'Double Bottom ("W" Pattern)',
        tagline: 'Catch a strong floor bounce when sellers fail twice to break lower',
        plainSummary:
          'After a downtrend, price bounces off support (Bottom 1), peaks at a middle resistance (Neckline), drops back to test the same support (Bottom 2), and rallies cleanly above the Neckline.',
        correctSteps: [
          'Identify two distinct lows near the same support floor forming a clear "W" shape.',
          'Wait for price to break above the middle peak (Neckline) to confirm buyers won.',
          'Buy on breakout with Stop-Loss safely beneath Bottom 2 and Target equal to the "W" height.',
        ],
        mistakeSteps: [
          'Buying on the first drop before seeing whether the support floor actually holds.',
          'Entering while price is still trapped below the middle Neckline resistance.',
          'Price slices straight through support into a fresh downtrend.',
        ],
        correctOutcome: 'Confirmed "W" breakout protects downside and rides the new uptrend.',
        mistakeOutcome: 'Catching a falling knife without confirmation leads to avoidable losses.',
        checklist: [
          'Bottom 1 and Bottom 2 bounce off roughly the same horizontal support zone.',
          'Bullish candle closes above the middle "W" peak (Neckline).',
          'Stop-Loss sits safely below the lowest wick of the two bottoms.',
        ],
        realExample: {
          title: 'EUR/USD 4H Support Reversal',
          timeframe: '4H Forex Chart',
          dateWindow: 'Major Support Zone',
          entryTrigger: 'Break & close above 1.0745 mid-peak',
          entryPrice: '1.0750',
          stopLossPrice: '1.0645',
          takeProfitPrice: '1.0980',
          moveResult: '+230 pips (+2.2R gain)',
          whyItWorked:
            'Sellers pushed EUR/USD down to 1.0660 twice but ran out of momentum both times. Clearing 1.0745 flipped market structure bullish and kicked off a steady 230-pip rally.',
        },
      },
      fr: {
        name: 'Double Creux (Figure en "W")',
        tagline: 'Capturez un retournement haussier lorsque les vendeurs échouent deux fois sur un support',
        plainSummary:
          'Après une baisse, le prix rebondit sur un support (Creux 1), bloque sur un sommet intermédiaire (Ligne de cou), reteste le support (Creux 2) puis casse la ligne de cou vers le haut.',
        correctSteps: [
          'Repérez deux creux au même niveau de support formant un "W" lisible.',
          'Attendez la cassure au-dessus du sommet central pour valider la reprise acheteuse.',
          'Achetez à la cassure avec Stop-Loss sous le Creux 2 et objectif égal à la hauteur du "W".',
        ],
        mistakeSteps: [
          'Acheter dès la première chute avant de vérifier si le support tient vraiment.',
          'Entrer alors que le prix reste bloqué sous la résistance centrale.',
          'Le support cède immédiatement et la tendance baissière continue.',
        ],
        correctOutcome: 'La cassure du "W" limite le risque et suit le nouvel élan haussier.',
        mistakeOutcome: 'Rattraper un couteau qui tombe sans confirmation coûte cher.',
        checklist: [
          'Les deux creux rebondissent sur une même zone horizontale de support.',
          'Une bougie clôture nettement au-dessus du pic central du "W".',
          'Le Stop-Loss est placé sous la mèche la plus basse des deux creux.',
        ],
        realExample: {
          title: 'EUR/USD — Rebond 4H sur support',
          timeframe: 'Graphique 4H',
          dateWindow: 'Zone de support majeure',
          entryTrigger: 'Clôture au-dessus du pic 1,0745',
          entryPrice: '1.0750',
          stopLossPrice: '1.0645',
          takeProfitPrice: '1.0980',
          moveResult: '+230 pips (+2.2R)',
          whyItWorked:
            'Les vendeurs ont échoué deux fois autour de 1,0660. Le franchissement des 1,0745 a confirmé le retour des acheteurs pour une hausse propre de 230 pips.',
        },
      },
      es: {
        name: 'Doble Suelo (Patrón en "W")',
        tagline: 'Aprovecha el giro alcista cuando los vendedores fallan dos veces en romper un soporte',
        plainSummary:
          'Tras una caída, el precio rebota en un soporte (Suelo 1), marca un pico intermedio, vuelve a probar el mismo piso (Suelo 2) y rompe finalmente al alza por encima del pico central.',
        correctSteps: [
          'Localiza dos mínimos en la misma zona de soporte formando una "W".',
          'Espera la ruptura por encima del pico central (línea de cuello).',
          'Compra en la ruptura con Stop-Loss debajo del Suelo 2 y objetivo igual a la altura de la "W".',
        ],
        mistakeSteps: [
          'Comprar en la primera caída sin confirmar que el soporte resista.',
          'Entrar mientras el precio sigue atrapado debajo de la resistencia media.',
          'El soporte se rompe y la tendencia bajista continúa.',
        ],
        correctOutcome: 'La ruptura confirmada de la "W" protege tu capital y captura el impulso.',
        mistakeOutcome: 'Intentar atrapar un cuchillo cayendo sin señal suele acabar en Stop-Loss.',
        checklist: [
          'Los dos mínimos rebotan aproximadamente en la misma zona de soporte.',
          'Una vela alcista cierra por encima del pico central de la "W".',
          'El Stop-Loss queda por debajo de la mecha más baja de ambos suelos.',
        ],
        realExample: {
          title: 'EUR/USD — Reversión 4H',
          timeframe: 'Gráfico 4H Forex',
          dateWindow: 'Soporte clave',
          entryTrigger: 'Ruptura y cierre sobre 1.0745',
          entryPrice: '1.0750',
          stopLossPrice: '1.0645',
          takeProfitPrice: '1.0980',
          moveResult: '+230 pips (+2.2R)',
          whyItWorked:
            'Los vendedores testaron 1.0660 dos veces sin éxito. Superar 1.0745 confirmó el cambio de estructura y generó una subida limpia de 230 pips.',
        },
      },
      ar: {
        name: 'القاع المزدوج (نموذج W)',
        tagline: 'التقط ارتداداً صاعداً قوياً عندما يفشل البائعون مرتين في كسر الدعم',
        plainSummary:
          'بعد موجة هبوط، يرتد السعر من منطقة دعم (القاع الأول)، يلامس قمة وسطى، ثم يعود لاختبار نفس الدعم (القاع الثاني) قبل اختراق القمة الوسطى صعوداً.',
        correctSteps: [
          'حدّد قاعين متقاربين على نفس مستوى الدعم بشكل يشبه حرف W.',
          'انتظر اختراق القمة الوسطى (خط العنق) لتأكيد سيطرة المشترين.',
          'ادخل شراءً مع وقف خسارة أسفل القاع الثاني وهدف يساوي ارتفاع نموذج W.',
        ],
        mistakeSteps: [
          'الشراء أثناء الهبوط الأول قبل التأكد من تماسك الدعم.',
          'الدخول قبل اختراق المقاومة الوسطى أثناء بقاء السعر محصوراً.',
          'استمرار الهبوط وكسر الدعم فوراً بعد الدخول المتسرع.',
        ],
        correctOutcome: 'اختراق نموذج W بعد التأكيد يحمي حسابك ويستهدف بداية الصعود.',
        mistakeOutcome: 'الشراء العشوائي في منتصف الهبوط يؤدي لخسائر متكررة.',
        checklist: [
          'القاع الأول والثاني يرتدان من نفس منطقة الدعم الأفقية تقريباً.',
          'إغلاق شمعة صاعدة واضحة أعلى القمة الوسطى.',
          'وضع وقف الخسارة بأمان أسفل أدنى ذيل للقاعين.',
        ],
        realExample: {
          title: 'مثال EUR/USD على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'منطقة دعم رئيسية',
          entryTrigger: 'اختراق وإغلاق أعلى القمة الوسطى 1.0745',
          entryPrice: '1.0750',
          stopLossPrice: '1.0645',
          takeProfitPrice: '1.0980',
          moveResult: '+230 نقطة (ربح +2.2R)',
          whyItWorked:
            'اختبر البائعون مستوى 1.0660 مرتين دون كسره. اختراق 1.0745 حوّل الاتجاه إلى صاعد ودفع الزوج لصعود متواصل بمقدار 230 نقطة.',
        },
      },
    },
  },
  {
    id: 'breakout-retest',
    category: 'continuation',
    level: 'Beginner',
    bias: 'bullish',
    practiceSymbol: 'ETH/USD',
    typicalRiskReward: '1 : 2.8',
    examplePath: [
      [8, 72],
      [22, 56],
      [35, 68],
      [48, 56],
      [62, 36],
      [74, 56],
      [94, 16],
    ],
    exampleKeyLevels: {
      entryY: 56,
      stopY: 70,
      targetY: 16,
      triggerX: 74,
    },
    translations: {
      en: {
        name: 'Breakout & Retest',
        tagline: 'Wait for old resistance to flip into new support instead of chasing green candles',
        plainSummary:
          'Instead of buying at the top of a sudden breakout spike, patient traders let price pull back and bounce off the broken ceiling (retest). That bounce offers a tight Stop-Loss and much higher Reward.',
        correctSteps: [
          'Draw a clear horizontal ceiling where price got rejected at least twice.',
          'Let a strong candle break above the ceiling, then patiently wait for the pullback.',
          'Buy when the old ceiling holds as a new floor, placing Stop-Loss just beneath it.',
        ],
        mistakeSteps: [
          'Chasing FOMO at the very top of the initial breakout candle.',
          'Putting a wide random Stop-Loss or panicking out during the normal pullback.',
          'Selling in fear right where smart buyers enter on the retest.',
        ],
        correctOutcome: 'Retest entry gives a tiny Stop-Loss and high 1:2.8 Risk:Reward.',
        mistakeOutcome: 'Chasing spikes puts you underwater as soon as price pulls back to retest.',
        checklist: [
          'Resistance ceiling was tested clearly 2+ times before the breakout.',
          'Breakout candle closed decisively above the resistance zone.',
          'Retest candle shows buyers defending the flipped level (wick rejection or bounce).',
        ],
        realExample: {
          title: 'ETH/USD 4H Resistance Flip',
          timeframe: '4H Crypto Chart',
          dateWindow: 'Range Breakout',
          entryTrigger: 'Pullback bounce at flipped $3,220 level',
          entryPrice: '$3,225',
          stopLossPrice: '$3,135',
          takeProfitPrice: '$3,475',
          moveResult: '+7.8% rally (+2.8R gain)',
          whyItWorked:
            'Ethereum broke cleanly above its $3,220 ceiling to $3,330, then dipped back to $3,220 where buyers defended the level. Entering on the retest kept risk tight ($90) for a $250 upside move.',
        },
      },
      fr: {
        name: 'Cassure & Retest (Break & Retest)',
        tagline: 'Laissez l’ancienne résistance devenir un support au lieu d’acheter en plein FOMO',
        plainSummary:
          'Plutôt que d’acheter tout en haut d’une bougie explosive, attendez que le prix revienne tester l’ancien plafond cassé. Ce rebond offre un Stop-Loss très court et un excellent ratio.',
        correctSteps: [
          'Tracez un plafond horizontal ayant rejeté le prix au moins deux fois.',
          'Laissez une bougie forte casser le plafond, puis attendez le repli.',
          'Achetez quand l’ancien plafond rebondit comme nouveau plancher, avec Stop-Loss juste en dessous.',
        ],
        mistakeSteps: [
          'Acheter par FOMO tout en haut de la grande bougie verte de cassure.',
          'Paniquer et clôturer en perte pendant le pullback normal de retest.',
          'Vendre exactement là où les traders patients entrent à l’achat.',
        ],
        correctOutcome: 'Entrer sur le retest réduit le Stop-Loss pour un ratio de 1:2.8.',
        mistakeOutcome: 'Poursuivre le prix expose immédiatement au repli technique.',
        checklist: [
          'Le plafond de résistance a bloqué le prix au moins 2 fois avant la cassure.',
          'La bougie de cassure a clôturé franchement au-dessus du niveau.',
          'Le retest montre un rebond clair (mèche basse ou bougie verte).',
        ],
        realExample: {
          title: 'ETH/USD — Cassure & Retest 4H',
          timeframe: 'Graphique 4H',
          dateWindow: 'Sortie de range',
          entryTrigger: 'Rebond sur l’ancien plafond à 3 220 $',
          entryPrice: '3 225 $',
          stopLossPrice: '3 135 $',
          takeProfitPrice: '3 475 $',
          moveResult: 'Hausse +7,8 % (+2.8R)',
          whyItWorked:
            'Ethereum a cassé 3 220 $ jusqu’à 3 330 $, puis est revenu s’appuyer sur 3 220 $. L’entrée sur retest a limité le risque à 90 $ pour viser +250 $.',
        },
      },
      es: {
        name: 'Ruptura y Retesteo',
        tagline: 'Espera a que la antigua resistencia actúe como nuevo soporte en vez de perseguir velas',
        plainSummary:
          'En lugar de comprar en la cima de un impulso repentino, espera a que el precio retroceda hasta el techo roto y rebote. Ese apoyo permite un Stop-Loss ajustado y mayor beneficio.',
        correctSteps: [
          'Marca un techo horizontal claro que haya rechazado al precio al menos dos veces.',
          'Deja que una vela fuerte rompa el nivel y espera el retroceso.',
          'Compra cuando el antiguo techo sostenga al precio como piso, con Stop-Loss justo debajo.',
        ],
        mistakeSteps: [
          'Comprar por FOMO en la punta máxima de la vela de ruptura.',
          'Asustarse y vender en pérdida cuando ocurre el retroceso normal del retesteo.',
          'Salir justo en el nivel donde entran los compradores pacientes.',
        ],
        correctOutcome: 'Entrar en el retesteo ofrece un Stop-Loss corto y un ratio 1:2.8.',
        mistakeOutcome: 'Perseguir el precio te deja atrapado durante el retroceso sano.',
        checklist: [
          'La resistencia fue probada claramente 2 o más veces antes de romper.',
          'La vela de ruptura cerró con fuerza por encima de la zona.',
          'La vela de retesteo muestra rechazo bajista y rebote comprador.',
        ],
        realExample: {
          title: 'ETH/USD — Ruptura y Retesteo 4H',
          timeframe: 'Gráfico 4H Cripto',
          dateWindow: 'Ruptura de rango',
          entryTrigger: 'Rebote en nivel convertido a soporte $3,220',
          entryPrice: '$3,225',
          stopLossPrice: '$3,135',
          takeProfitPrice: '$3,475',
          moveResult: 'Subida +7.8% (+2.8R)',
          whyItWorked:
            'Ethereum rompió $3,220 hasta $3,330 y luego retrocedió a validar $3,220 como suelo. Entrar ahí redujo el riesgo a $90 para capturar $250.',
        },
      },
      ar: {
        name: 'الاختراق وإعادة الاختبار',
        tagline: 'انتظر تحوّل المقاومة السابقة إلى دعم جديد بدلاً من مطاردة الشموع الصاعدة',
        plainSummary:
          'بدلاً من الشراء عند قمة شمعة الاختراق المفاجئة، ينتظر المتداول الصبور عودة السعر لملامسة سقف المقاومة المكسور والارتداد منه، ما يمنح وقف خسارة صغيراً وعائداً أكبر.',
        correctSteps: [
          'ارسم خط مقاومة أفقياً واضحاً ردّ السعر مرتين على الأقل.',
          'دع شمعة قوية تخترق السقف ثم انتظر التراجع بهدوء.',
          'ادخل شراءً عند ارتداد السعر فوق المقاومة السابقة مع وقف خسارة أسفلها مباشرة.',
        ],
        mistakeSteps: [
          'مطاردة السعر بدافع الخوف من فوات الفرصة (FOMO) عند أعلى قمة.',
          'الذعر والبيع بخسارة أثناء التراجع الطبيعي لإعادة الاختبار.',
          'الخروج في النقطة نفسها التي يدخل عندها المشترون المحترفون.',
        ],
        correctOutcome: 'الدخول عند إعادة الاختبار يقلل وقف الخسارة ويحقق نسبة عائد 1:2.8.',
        mistakeOutcome: 'مطاردة الاندفاع المفاجئ تجعلك تحت الضغط فور بدء التراجع الطبيعي.',
        checklist: [
          'تم اختبار المقاومة مرتين على الأقل قبل الاختراق.',
          'أغلقت شمعة الاختراق بوضوح أعلى منطقة المقاومة.',
          'أظهرت شمعة إعادة الاختبار دفاع المشترين عن المستوى بذيل سفلي أو ارتداد قوي.',
        ],
        realExample: {
          title: 'مثال ETH/USD على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'اختراق نطاق عرضي',
          entryTrigger: 'ارتداد بعد إعادة اختبار مستوى 3,220$',
          entryPrice: '$3,225',
          stopLossPrice: '$3,135',
          takeProfitPrice: '$3,475',
          moveResult: 'صعود +7.8% (ربح +2.8R)',
          whyItWorked:
            'اخترق إيثيريوم سقف 3,220$ نحو 3,330$ ثم عاد لاختبار 3,220$ كدعم جديد. هذا الدخول أبقى المخاطرة عند 90$ مقابل ربح مستهدف 250$.',
        },
      },
    },
  },
  {
    id: 'bull-flag',
    category: 'continuation',
    level: 'Beginner',
    bias: 'bullish',
    practiceSymbol: 'SOL/USD',
    typicalRiskReward: '1 : 2.5',
    examplePath: [
      [10, 82],
      [30, 32],
      [42, 42],
      [52, 36],
      [64, 48],
      [74, 38],
      [94, 14],
    ],
    exampleKeyLevels: {
      entryY: 38,
      stopY: 50,
      targetY: 14,
      triggerX: 74,
    },
    translations: {
      en: {
        name: 'Bull Flag Continuation',
        tagline: 'Join a strong uptrend after a calm, orderly pause ("the Flag")',
        plainSummary:
          'A sharp rally (the Flagpole) pauses in a tight, slightly downward-sloping channel (the Flag) as early buyers take small profits. Breaking above the top of the Flag launches the next leg up.',
        correctSteps: [
          'Spot a steep upward surge (Flagpole) followed by a calm, narrow pullback channel.',
          'Wait for price to break out above the upper trendline of the Flag channel.',
          'Enter long with Stop-Loss under the Flag low and Target equal to the Flagpole move.',
        ],
        mistakeSteps: [
          'Shorting the gentle pullback inside the Flag thinking the uptrend is dead.',
          'Entering while price is drifting sideways inside the channel before breakout.',
          'Getting swept away when the main trend resumes violently upward.',
        ],
        correctOutcome: 'Trading with the Flagpole trend captures fast continuation gains (1:2.5).',
        mistakeOutcome: 'Betting against a healthy pause fights the dominant trend.',
        checklist: [
          'Flagpole shows a strong, clean upward impulse move.',
          'Pullback inside the Flag stays shallow (less than 38–50% of the pole).',
          'Entry triggers on a decisive candle break above the upper Flag line.',
        ],
        realExample: {
          title: 'SOL/USD 1H Trend Continuation',
          timeframe: '1H Crypto Chart',
          dateWindow: 'Momentum Rally',
          entryTrigger: 'Break above $201 upper flag channel',
          entryPrice: '$201.00',
          stopLossPrice: '$194.00',
          takeProfitPrice: '$218.50',
          moveResult: '+8.7% surge (+2.5R gain)',
          whyItWorked:
            'Solana surged from $182 to $204 (Flagpole), then drifted gently down to $195 in a neat parallel channel without heavy selling. Breaking $201 ignited the second wave straight past $218.',
        },
      },
      fr: {
        name: 'Drapeau Haussier (Bull Flag)',
        tagline: 'Rejoignez une tendance haussière forte après une pause calme et ordonnée',
        plainSummary:
          'Une forte impulsion (le Mât) est suivie d’un petit canal légèrement descendant (le Drapeau). La sortie par le haut du drapeau relance la tendance initiale.',
        correctSteps: [
          'Repérez une impulsion verticale (Mât) suivie d’un repli serré et ordonné.',
          'Attendez la cassure au-dessus de la borne haute du canal du drapeau.',
          'Achetez avec Stop-Loss sous le bas du drapeau et objectif égal à la taille du Mât.',
        ],
        mistakeSteps: [
          'Vendre à découvert la petite pause en pensant que la tendance est terminée.',
          'Entrer au hasard au milieu du canal avant la cassure haute.',
          'Subir la reprise brutale de la tendance haussière.',
        ],
        correctOutcome: 'Suivre le mât après cassure capture une continuation rapide (1:2.5).',
        mistakeOutcome: 'Parier contre une respiration saine expose au contre-pied.',
        checklist: [
          'Le mât montre une impulsion haussière franche.',
          'Le repli reste modéré (moins de 38–50 % du mât).',
          'Une bougie clôture clairement au-dessus de la ligne haute du drapeau.',
        ],
        realExample: {
          title: 'SOL/USD — Continuation 1H',
          timeframe: 'Graphique 1H',
          dateWindow: 'Tendance haussière',
          entryTrigger: 'Cassure du canal à 201,00 $',
          entryPrice: '201,00 $',
          stopLossPrice: '194,00 $',
          takeProfitPrice: '218,50 $',
          moveResult: 'Hausse +8,7 % (+2.5R)',
          whyItWorked:
            'Solana a grimpé de 182 $ à 204 $, puis s’est reposé calmement vers 195 $ sans pression vendeuse. La cassure des 201 $ a propulsé la seconde vague vers 218,50 $.',
        },
      },
      es: {
        name: 'Bandera Alcista (Bull Flag)',
        tagline: 'Súbete a una tendencia fuerte justo cuando termina una pausa ordenada',
        plainSummary:
          'Tras una subida rápida (el Mástil), el precio descansa en un canal estrecho levemente inclinado hacia abajo (la Bandera). Al romper por arriba, continúa el impulso.',
        correctSteps: [
          'Identifica un impulso fuerte (Mástil) seguido de una consolidación estrecha.',
          'Espera que el precio rompa por encima de la línea superior de la Bandera.',
          'Compra con Stop-Loss debajo de la Bandera y objetivo igual a la altura del Mástil.',
        ],
        mistakeSteps: [
          'Vender en corto durante el pequeño descanso pensando que ya terminó la subida.',
          'Entrar en medio del canal sin esperar la señal de ruptura.',
          'Quedar atrapado cuando la tendencia principal vuelve a acelerar.',
        ],
        correctOutcome: 'Seguir la dirección del mástil ofrece una continuación rápida (1:2.5).',
        mistakeOutcome: 'Ir contra una pausa saludable es operar en contra de la tendencia.',
        checklist: [
          'El mástil muestra un impulso comprador limpio y potente.',
          'El retroceso de la bandera es poco profundo (menos del 38–50% del mástil).',
          'Una vela rompe con claridad el techo diagonal de la bandera.',
        ],
        realExample: {
          title: 'SOL/USD — Continuación 1H',
          timeframe: 'Gráfico 1H Cripto',
          dateWindow: 'Impulso alcista',
          entryTrigger: 'Ruptura del canal superior en $201.00',
          entryPrice: '$201.00',
          stopLossPrice: '$194.00',
          takeProfitPrice: '$218.50',
          moveResult: 'Subida +8.7% (+2.5R)',
          whyItWorked:
            'Solana subió de $182 a $204 y descansó ordenadamente hacia $195 sin ventas agresivas. Superar $201 activó la segunda ola hasta $218.50.',
        },
      },
      ar: {
        name: 'نموذج العَلَم الصاعد (Bull Flag)',
        tagline: 'انضم إلى اتجاه صاعد قوي بعد استراحة هادئة ومنظمة',
        plainSummary:
          'بعد قفزة سعرية حادة (السارية)، يهدأ السعر داخل قناة ضيقة مائلة قليلاً للأسفل (العَلَم) لجني أرباح خفيف، ثم يخترق سقف القناة ليكمل الصعود.',
        correctSteps: [
          'لاحظ اندفاعاً قوياً للأعلى (السارية) يتبعه تراجع هادئ ومحدود.',
          'انتظر اختراق الحد العلوي لقناة العَلَم قبل الدخول.',
          'اشترِ عند الاختراق مع وقف خسارة أسفل العَلَم وهدف يساوي طول السارية.',
        ],
        mistakeSteps: [
          'البيع عكس الاتجاه داخل الاستراحة ظناً أن الصعود انتهى.',
          'الدخول العشوائي وسط القناة قبل تأكيد الاختراق.',
          'مواجهة موجة صعود سريعة تدفع الصفقة للخسارة.',
        ],
        correctOutcome: 'التداول مع اتجاه السارية يلتقط موجة استمرار سريعة بنسبة 1:2.5.',
        mistakeOutcome: 'معاكسة استراحة صحية في اتجاه صاعد خطأ شائع ومكلف.',
        checklist: [
          'وجود موجة صعود أولية قوية وواضحة (السارية).',
          'التراجع داخل العَلَم محدود (أقل من 38–50% من السارية).',
          'إغلاق شمعة واضحة أعلى الخط العلوي لنموذج العَلَم.',
        ],
        realExample: {
          title: 'مثال SOL/USD على إطار ساعة',
          timeframe: 'إطار ساعة واحدة',
          dateWindow: 'موجة زخم صاعدة',
          entryTrigger: 'اختراق سقف قناة العَلَم عند 201.00$',
          entryPrice: '$201.00',
          stopLossPrice: '$194.00',
          takeProfitPrice: '$218.50',
          moveResult: 'صعود +8.7% (ربح +2.5R)',
          whyItWorked:
            'قفزت سولانا من 182$ إلى 204$ ثم تراجعت بهدوء نحو 195$ دون بيع عنيف. اختراق 201$ أطلق الموجة الثانية مباشرة فوق 218$.',
        },
      },
    },
  },
  {
    id: 'rsi-divergence',
    category: 'momentum',
    level: 'Intermediate',
    bias: 'bullish',
    practiceSymbol: 'GBP/USD',
    typicalRiskReward: '1 : 2.3',
    examplePath: [
      [8, 30],
      [26, 62],
      [42, 46],
      [62, 74],
      [76, 54],
      [94, 24],
    ],
    exampleKeyLevels: {
      entryY: 54,
      stopY: 78,
      targetY: 24,
      triggerX: 76,
    },
    translations: {
      en: {
        name: 'Bullish RSI Divergence',
        tagline: 'See hidden buyer strength when price makes a lower low but RSI rises',
        plainSummary:
          'When price dips to a slightly Lower Low while the RSI(14) indicator prints a Higher Low, selling pressure is quietly fading. Wait for price to break a short-term bounce high to enter safely.',
        correctSteps: [
          'Compare two price lows: Price prints a Lower Low while RSI forms a Higher Low below 40.',
          'Wait for a bullish structure break (price clearing the small bounce high between lows).',
          'Enter long with Stop-Loss under the second low and Target at the prior swing resistance.',
        ],
        mistakeSteps: [
          'Buying instantly on RSI divergence alone while candles are still crashing vertically.',
          'Ignoring the trend context—divergence is an early warning, not a standalone buy button.',
          'Price keeps sliding deeper into oversold territory before any bounce happens.',
        ],
        correctOutcome: 'Divergence + price confirmation catches reversals right as sellers tire out.',
        mistakeOutcome: 'Trading RSI without price confirmation leads to early entries.',
        checklist: [
          'Price makes a clear Lower Low while RSI(14) makes a clear Higher Low.',
          'First RSI trough started in or near the oversold zone (< 35).',
          'A bullish candle breaks above the minor swing peak between the two lows.',
        ],
        realExample: {
          title: 'GBP/USD 4H Momentum Shift',
          timeframe: '4H Forex Chart',
          dateWindow: 'Oversold Exhaustion',
          entryTrigger: 'Bullish close above 1.2520 swing high',
          entryPrice: '1.2520',
          stopLossPrice: '1.2445',
          takeProfitPrice: '1.2695',
          moveResult: '+175 pips (+2.3R gain)',
          whyItWorked:
            'GBP/USD dipped from 1.2510 down to 1.2465, yet RSI jumped from 26 to 35—revealing sellers lost strength. Clearing 1.2520 confirmed the shift and carried the pair up 175 pips.',
        },
      },
      fr: {
        name: 'Divergence Haussière RSI',
        tagline: 'Détectez l’épuisement des vendeurs quand le prix baisse mais que le RSI remonte',
        plainSummary:
          'Si le prix inscrit un creux plus bas alors que le RSI(14) forme un creux plus haut, la pression vendeuse s’épuise. Attendez ensuite la cassure d’un petit sommet de prix pour entrer.',
        correctSteps: [
          'Repérez un creux plus bas sur le prix face à un creux plus haut sur le RSI.',
          'Attendez une bougie haussière cassant le petit rebond intermédiaire.',
          'Achetez avec Stop-Loss sous le second creux et objectif vers l’ancienne résistance.',
        ],
        mistakeSteps: [
          'Acheter immédiatement sur la divergence pendant que les bougies chutent encore.',
          'Oublier que le RSI est un avertissement, pas un signal d’achat sans confirmation du prix.',
          'Le prix continue de glisser avant de réellement se retourner.',
        ],
        correctOutcome: 'Divergence + cassure de structure = entrée précise dès l’essoufflement vendeur.',
        mistakeOutcome: 'Entrer sur le RSI seul expose à des entrées prématurées.',
        checklist: [
          'Prix en creux plus bas tandis que le RSI(14) trace un creux plus haut.',
          'Le premier creux du RSI était proche de la zone de survente (< 35).',
          'Le prix casse à la hausse le petit sommet entre les deux creux.',
        ],
        realExample: {
          title: 'GBP/USD — Divergence RSI 4H',
          timeframe: 'Graphique 4H',
          dateWindow: 'Zone de survente',
          entryTrigger: 'Clôture haussière au-dessus de 1,2520',
          entryPrice: '1.2520',
          stopLossPrice: '1.2445',
          takeProfitPrice: '1.2695',
          moveResult: '+175 pips (+2.3R)',
          whyItWorked:
            'GBP/USD a glissé de 1,2510 à 1,2465 pendant que le RSI remontait de 26 à 35. Le passage au-dessus de 1,2520 a validé le retournement pour +175 pips.',
        },
      },
      es: {
        name: 'Divergencia Alcista RSI',
        tagline: 'Detecta fuerza oculta cuando el precio hace un mínimo menor pero el RSI sube',
        plainSummary:
          'Cuando el precio marca un mínimo ligeramente más bajo mientras el RSI(14) marca un mínimo más alto, la fuerza vendedora se agota. Espera a que el precio supere un techo menor para entrar.',
        correctSteps: [
          'Compara dos mínimos: el precio cae más bajo mientras el RSI forma un mínimo más alto.',
          'Espera una vela alcista que rompa el pequeño rebote entre ambos mínimos.',
          'Compra con Stop-Loss bajo el segundo mínimo y objetivo en la resistencia previa.',
        ],
        mistakeSteps: [
          'Comprar al instante solo por el RSI mientras el precio sigue desplomándose.',
          'Usar el oscilador sin esperar confirmación en la acción del precio.',
          'El precio sigue cayendo en sobreventa antes de girar.',
        ],
        correctOutcome: 'Divergencia + ruptura de precio captura el giro justo al agotarse la venta.',
        mistakeOutcome: 'Entrar sin confirmación del precio suele provocar entradas adelantadas.',
        checklist: [
          'El precio forma un mínimo más bajo y el RSI(14) un mínimo más alto.',
          'El primer mínimo del RSI nació en o cerca de sobreventa (< 35).',
          'Una vela rompe al alza el pequeño pico intermedio entre ambos mínimos.',
        ],
        realExample: {
          title: 'GBP/USD — Divergencia 4H',
          timeframe: 'Gráfico 4H Forex',
          dateWindow: 'Agotamiento bajista',
          entryTrigger: 'Cierre alcista sobre 1.2520',
          entryPrice: '1.2520',
          stopLossPrice: '1.2445',
          takeProfitPrice: '1.2695',
          moveResult: '+175 pips (+2.3R)',
          whyItWorked:
            'GBP/USD bajó de 1.2510 a 1.2465 mientras el RSI subía de 26 a 35. Romper 1.2520 confirmó el giro y entregó 175 pips.',
        },
      },
      ar: {
        name: 'الدايفرجنس الإيجابي لمؤشر RSI',
        tagline: 'اكتشف ضعف البائعين الخفي عندما يهبط السعر لقاع أدنى بينما يصعد مؤشر RSI',
        plainSummary:
          'عندما يسجل السعر قاعاً أقل قليلاً بينما يسجل مؤشر RSI(14) قاعاً أعلى، فهذا يكشف تراجع قوة البيع. انتظر اختراق قمة ارتداد صغيرة لتأكيد الدخول الآمن.',
        correctSteps: [
          'قارن قاعين: السعر يصنع قاعاً أدنى بينما يصنع RSI قاعاً أعلى أسفل 40.',
          'انتظر شمعة صاعدة تخترق القمة الصغيرة الفاصلة بين القاعين.',
          'ادخل شراءً مع وقف خسارة أسفل القاع الثاني وهدف عند المقاومة السابقة.',
        ],
        mistakeSteps: [
          'الشراء فوراً بمجرد رؤية الدايفرجنس أثناء استمرار الهبوط الحاد.',
          'التعامل مع المؤشر كزر شراء تلقائي بدون تأكيد حركة السعر.',
          'استمرار السعر في الهبوط لمنطقة تشبع بيعي أعمق قبل الارتداد.',
        ],
        correctOutcome: 'الدايفرجنس مع كسر هيكل السعر يلتقط الانعكاس عند نفاد طاقة البائعين.',
        mistakeOutcome: 'الدخول عبر المؤشر وحده يؤدي غالباً لدخول مبكر وخسارة.',
        checklist: [
          'السعر يكوّن قاعاً أدنى بوضوح ومؤشر RSI(14) يكوّن قاعاً أعلى.',
          'القاع الأول للمؤشر بدأ داخل أو قرب منطقة التشبع البيعي (أقل من 35).',
          'شمعة صاعدة تخترق القمة القصيرة الواقعة بين القاعين.',
        ],
        realExample: {
          title: 'مثال GBP/USD على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'تشبع بيعي وانعكاس',
          entryTrigger: 'إغلاق صاعد أعلى القمة الصغيرة 1.2520',
          entryPrice: '1.2520',
          stopLossPrice: '1.2445',
          takeProfitPrice: '1.2695',
          moveResult: '+175 نقطة (ربح +2.3R)',
          whyItWorked:
            'هبط الجنيه من 1.2510 إلى 1.2465 بينما ارتفع مؤشر RSI من 26 إلى 35. تجاوز 1.2520 أكد تحوّل الزخم وصعد الزوج 175 نقطة.',
        },
      },
    },
  },
  {
    id: 'double-top',
    category: 'reversal',
    level: 'Beginner',
    bias: 'bearish',
    practiceSymbol: 'USD/JPY',
    typicalRiskReward: '1 : 2.1',
    examplePath: [
      [8, 74],
      [25, 22],
      [43, 52],
      [60, 23],
      [75, 52],
      [94, 84],
    ],
    exampleKeyLevels: {
      entryY: 52,
      stopY: 18,
      targetY: 84,
      triggerX: 75,
    },
    translations: {
      en: {
        name: 'Double Top ("M" Pattern)',
        tagline: 'Spot buyer exhaustion when price fails twice at the same ceiling before breaking down',
        plainSummary:
          'After an uptrend, price hits a resistance ceiling (Top 1), pulls back to a support trough (Neckline), bounces back to the same ceiling (Top 2), and drops cleanly beneath the Neckline.',
        correctSteps: [
          'Identify two distinct peaks halting near the same horizontal resistance ("M" shape).',
          'Wait patiently for a full candle close below the middle Neckline support.',
          'Sell on the breakdown with Stop-Loss above Top 2 and Target equal to the "M" height.',
        ],
        mistakeSteps: [
          'Shorting blindly at the first peak while momentum buyers are still pushing hard.',
          'Jumping in short while price sits right in the middle before the Neckline breaks.',
          'Price bounces off the Neckline and rockets past resistance, stopping out the early short.',
        ],
        correctOutcome: 'Confirmed "M" breakdown avoids fake tops and captures a clean 1:2.1 drop.',
        mistakeOutcome: 'Shorting strong resistance prematurely gets trapped by range bounces.',
        checklist: [
          'Top 1 and Top 2 reverse cleanly off roughly the same horizontal resistance ceiling.',
          'A bearish candle closes firmly beneath the middle "M" Neckline.',
          'Stop-Loss rests safely above the highest wick of both tops.',
        ],
        realExample: {
          title: 'USD/JPY 4H Ceiling Rejection',
          timeframe: '4H Forex Chart',
          dateWindow: 'Major Resistance Zone',
          entryTrigger: '4H close below 154.65 neckline support',
          entryPrice: '154.600',
          stopLossPrice: '155.850',
          takeProfitPrice: '151.950',
          moveResult: '-265 pips (+2.1R gain)',
          whyItWorked:
            'Buyers tried twice to break above 155.60 on USD/JPY and stalled both times. Losing 154.65 flipped structure bearish and triggered a swift 265-pip slide.',
        },
      },
      fr: {
        name: 'Double Sommet (Figure en "M")',
        tagline: 'Repérez l’essoufflement acheteur quand le prix bute deux fois sous un même plafond',
        plainSummary:
          'Après une hausse, le prix bloque sur une résistance (Sommet 1), se replie sur un creux central (Ligne de cou), reteste le plafond (Sommet 2) puis casse la ligne de cou vers le bas.',
        correctSteps: [
          'Identifiez deux sommets au même niveau de résistance formant un "M" net.',
          'Attendez une clôture complète sous le creux central (Ligne de cou).',
          'Vendez à la cassure avec Stop-Loss au-dessus du Sommet 2 et objectif égal à la hauteur du "M".',
        ],
        mistakeSteps: [
          'Vendre dès le premier sommet alors que la tendance haussière reste forte.',
          'Entrer avant la cassure réelle de la ligne de cou.',
          'Le prix rebondit sur le support et déclenche le Stop-Loss avant toute baisse.',
        ],
        correctOutcome: 'La cassure confirmée du "M" capture la baisse avec un ratio propre de 1:2.1.',
        mistakeOutcome: 'Anticiper le sommet sans cassure expose aux faux signaux.',
        checklist: [
          'Les deux sommets rejettent approximativement la même résistance horizontale.',
          'Une bougie baissière clôture nettement sous la ligne de cou centrale.',
          'Le Stop-Loss se place au-dessus de la mèche la plus haute des deux sommets.',
        ],
        realExample: {
          title: 'USD/JPY — Rejet 4H sous résistance',
          timeframe: 'Graphique 4H',
          dateWindow: 'Résistance majeure',
          entryTrigger: 'Clôture 4H sous le support 154,65',
          entryPrice: '154.600',
          stopLossPrice: '155.850',
          takeProfitPrice: '151.950',
          moveResult: '-265 pips (+2.1R)',
          whyItWorked:
            'Les acheteurs ont échoué deux fois sous 155,60 sur USD/JPY. La perte des 154,65 a libéré une baisse rapide de 265 pips.',
        },
      },
      es: {
        name: 'Doble Techo (Patrón en "M")',
        tagline: 'Detecta agotamiento comprador cuando el precio falla dos veces en el mismo techo',
        plainSummary:
          'Tras una subida, el precio choca con una resistencia (Techo 1), retrocede a un soporte medio (línea de cuello), vuelve a fallar arriba (Techo 2) y rompe finalmente hacia abajo.',
        correctSteps: [
          'Ubica dos picos deteniéndose en el mismo techo horizontal formando una "M".',
          'Espera el cierre de vela por debajo del soporte central de la "M".',
          'Vende tras la ruptura con Stop-Loss sobre el Techo 2 y objetivo igual a la altura de la "M".',
        ],
        mistakeSteps: [
          'Vender en corto en el primer techo mientras los compradores aún dominan.',
          'Entrar antes de que el precio rompa la línea de cuello central.',
          'Un rebote en soporte saca tu operación antes de que empiece la caída.',
        ],
        correctOutcome: 'La ruptura confirmada de la "M" evita techos falsos y captura 1:2.1.',
        mistakeOutcome: 'Vender por intuición sin confirmación termina atrapado en rebotes.',
        checklist: [
          'Techo 1 y Techo 2 giran prácticamente en el mismo nivel horizontal.',
          'Una vela bajista cierra con claridad bajo la línea de cuello central.',
          'El Stop-Loss queda por encima de la mecha más alta de ambos techos.',
        ],
        realExample: {
          title: 'USD/JPY — Rechazo 4H en techo',
          timeframe: 'Gráfico 4H Forex',
          dateWindow: 'Resistencia clave',
          entryTrigger: 'Cierre 4H bajo soporte 154.65',
          entryPrice: '154.600',
          stopLossPrice: '155.850',
          takeProfitPrice: '151.950',
          moveResult: '-265 pips (+2.1R)',
          whyItWorked:
            'Los compradores intentaron dos veces superar 155.60 en USD/JPY sin éxito. Perder 154.65 desencadenó una caída directa de 265 pips.',
        },
      },
      ar: {
        name: 'القمة المزدوجة (نموذج M)',
        tagline: 'اكتشف ضعف المشترين عندما يفشل السعر مرتين عند نفس سقف المقاومة قبل الهبوط',
        plainSummary:
          'بعد اتجاه صاعد، يصطدم السعر بمقاومة (القمة الأولى)، يتراجع لقاع أوسط (خط العنق)، ثم يفشل مجدداً عند نفس المقاومة (القمة الثانية) ويكسر خط العنق هبوطاً.',
        correctSteps: [
          'حدّد قمتين متقاربتين عند نفس مستوى المقاومة على شكل حرف M.',
          'انتظر إغلاق شمعة واضحة أسفل دعم خط العنق الأوسط.',
          'ادخل بيعاً عند الكسر مع وقف خسارة أعلى القمة الثانية وهدف يساوي ارتفاع نموذج M.',
        ],
        mistakeSteps: [
          'البيع مبكراً عند القمة الأولى أثناء استمرار قوة المشترين.',
          'الدخول بيعاً في المنتصف قبل كسر خط العنق.',
          'ارتداد السعر من الدعم وضرب وقف الخسارة قبل بدء الهبوط الفعلي.',
        ],
        correctOutcome: 'كسر نموذج M بعد التأكيد يتجنب القمم الكاذبة ويحقق عائداً بنسبة 1:2.1.',
        mistakeOutcome: 'تخمين القمة دون كسر خط العنق يعرّض الصفقة للارتدادات.',
        checklist: [
          'القمة الأولى والثانية ترتدان من نفس منطقة المقاومة الأفقية تقريباً.',
          'إغلاق شمعة هابطة واضحة أسفل خط العنق الأوسط.',
          'وضع وقف الخسارة أعلى أعلى ذيل للقمتين.',
        ],
        realExample: {
          title: 'مثال USD/JPY على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'منطقة مقاومة رئيسية',
          entryTrigger: 'إغلاق شمعة 4 ساعات أسفل دعم 154.65',
          entryPrice: '154.600',
          stopLossPrice: '155.850',
          takeProfitPrice: '151.950',
          moveResult: '-265 نقطة (ربح +2.1R)',
          whyItWorked:
            'حاول المشترون مرتين اختراق 155.60 في زوج الدولار/ين وفشلوا. كسر 154.65 حوّل الهيكل إلى هابط وأطلق تراجعاً سريعاً بمقدار 265 نقطة.',
        },
      },
    },
  },
  {
    id: 'ema-pullback',
    category: 'continuation',
    level: 'Beginner',
    bias: 'bullish',
    practiceSymbol: 'AUD/USD',
    typicalRiskReward: '1 : 2.4',
    examplePath: [
      [8, 84],
      [24, 62],
      [34, 68],
      [50, 46],
      [60, 54],
      [76, 30],
      [94, 16],
    ],
    exampleKeyLevels: {
      entryY: 54,
      stopY: 66,
      targetY: 22,
      triggerX: 60,
    },
    translations: {
      en: {
        name: '20 EMA Trend Pullback',
        tagline: 'Buy healthy dips into the rising 20 EMA instead of chasing overextended green candles',
        plainSummary:
          'In a clean uptrend, price breathes in waves: surging above the 20 EMA, then drifting gently back down to touch it like a moving trampoline. Buying the bounce off the 20 EMA keeps Stop-Losses small and entries high-probability.',
        correctSteps: [
          'Confirm a steady uptrend with Higher Highs and Higher Lows above a rising 20 EMA.',
          'Wait patiently for price to cool off and pull back gently onto the 20 EMA line.',
          'Buy on a bullish bounce candle off the EMA with Stop-Loss beneath the pullback swing low.',
        ],
        mistakeSteps: [
          'Buying blindly far above the 20 EMA after three big green candles in a row.',
          'Panicking when normal profit-taking pulls price back toward the average.',
          'Getting shaken out at the bottom of the dip right where trend traders enter.',
        ],
        correctOutcome: 'Pullback entry at the 20 EMA offers tight risk and smooth 1:2.4 continuation.',
        mistakeOutcome: 'Chasing overextended candles puts you underwater during routine pullbacks.',
        checklist: [
          '20 EMA slopes clearly upward and sits beneath recent swings.',
          'Pullback approaches the EMA calmly without heavy crash candles.',
          'A bullish rejection wick or close confirms buyers stepped back in at the EMA.',
        ],
        realExample: {
          title: 'AUD/USD 1H Moving Average Bounce',
          timeframe: '1H Forex Chart',
          dateWindow: 'Steady Uptrend Session',
          entryTrigger: 'Bullish engulfing candle off rising 20 EMA at 0.6640',
          entryPrice: '0.66400',
          stopLossPrice: '0.66080',
          takeProfitPrice: '0.67170',
          moveResult: '+77 pips (+2.4R gain)',
          whyItWorked:
            'AUD/USD respected the 1H 20 EMA three times during an orderly climb. Entering on the third dip kept risk at 32 pips and rode the next impulse wave up 77 pips.',
        },
      },
      fr: {
        name: 'Repli sur EMA 20 (Trend Pullback)',
        tagline: 'Achetez les respirations calmes sur la moyenne mobile 20 au lieu de courir après le prix',
        plainSummary:
          'Dans une tendance haussière saine, le prix revient régulièrement tester l’EMA 20 comme un tremplin dynamique. Entrer sur ce rebond permet un Stop-Loss court dans le sens de la tendance.',
        correctSteps: [
          'Vérifiez une tendance haussière régulière au-dessus d’une EMA 20 orientée vers le haut.',
          'Attendez patiemment que le prix revienne toucher calmement la ligne EMA 20.',
          'Achetez sur une bougie de rebond avec Stop-Loss sous le creux du repli.',
        ],
        mistakeSteps: [
          'Acheter très loin au-dessus de l’EMA 20 après plusieurs grandes bougies vertes.',
          'Paniquer lorsque le retour normal vers la moyenne fait passer le trade en rouge.',
          'Clôturer pile sur l’EMA 20 là où les acheteurs patients entrent.',
        ],
        correctOutcome: 'Entrer sur l’EMA 20 réduit le Stop-Loss pour viser un ratio de 1:2.4.',
        mistakeOutcome: 'Poursuivre un prix trop étiré expose au repli vers la moyenne.',
        checklist: [
          'L’EMA 20 monte régulièrement sous la structure haussière.',
          'Le repli reste ordonné sans bougies vendeuses violentes.',
          'Une bougie haussière confirme le rebond sur l’EMA 20.',
        ],
        realExample: {
          title: 'AUD/USD — Rebond 1H sur EMA 20',
          timeframe: 'Graphique 1H',
          dateWindow: 'Tendance haussière régulière',
          entryTrigger: 'Avalement haussier sur EMA 20 à 0,6640',
          entryPrice: '0.66400',
          stopLossPrice: '0.66080',
          takeProfitPrice: '0.67170',
          moveResult: '+77 pips (+2.4R)',
          whyItWorked:
            'AUD/USD a rebondi trois fois sur son EMA 20 en 1H. Ce repli limitait le risque à 32 pips pour capter +77 pips sur la vague suivante.',
        },
      },
      es: {
        name: 'Retroceso a la EMA 20',
        tagline: 'Compra retrocesos sanos hacia la EMA 20 ascendente en vez de perseguir velas verdes',
        plainSummary:
          'En una tendencia alcista clara, el precio avanza por impulsos y vuelve a tocar la EMA 20 como trampolín dinámico. Comprar el rebote en la media ofrece riesgo bajo y alta probabilidad.',
        correctSteps: [
          'Confirma una tendencia limpia con máximos y mínimos crecientes sobre la EMA 20.',
          'Espera con paciencia a que el precio retroceda suavemente hasta tocar la EMA 20.',
          'Compra con vela de rechazo alcista y Stop-Loss debajo del mínimo del retroceso.',
        ],
        mistakeSteps: [
          'Comprar lejos por encima de la EMA 20 tras varias velas alcistas seguidas.',
          'Asustarse cuando el precio retrocede normalmente hacia su media.',
          'Cerrar en pérdida justo donde los compradores de tendencia vuelven a entrar.',
        ],
        correctOutcome: 'Entrar en la EMA 20 mantiene el riesgo corto y logra un sólido 1:2.4.',
        mistakeOutcome: 'Perseguir precios extendidos te deja atrapado en retrocesos normales.',
        checklist: [
          'La EMA 20 apunta claramente hacia arriba debajo de los últimos impulsos.',
          'El retroceso baja con calma sin velas de pánico vendedoras.',
          'Una vela alcista o mecha inferior confirma el rebote en la EMA 20.',
        ],
        realExample: {
          title: 'AUD/USD — Rebote 1H en EMA 20',
          timeframe: 'Gráfico 1H Forex',
          dateWindow: 'Tendencia alcista estable',
          entryTrigger: 'Vela envolvente alcista sobre EMA 20 en 0.6640',
          entryPrice: '0.66400',
          stopLossPrice: '0.66080',
          takeProfitPrice: '0.67170',
          moveResult: '+77 pips (+2.4R)',
          whyItWorked:
            'AUD/USD respetó la EMA 20 en tres retrocesos seguidos. Entrar en el tercer toque limitó el riesgo a 32 pips para ganar 77 pips.',
        },
      },
      ar: {
        name: 'الارتداد من متوسط EMA 20',
        tagline: 'اشترِ التراجعات الهادئة نحو متوسط EMA 20 الصاعد بدلاً من مطاردة الشموع الممتدة',
        plainSummary:
          'في الاتجاه الصاعد الواضح، يتحرك السعر في موجات ثم يعود لملامسة متوسط EMA 20 وكأنه نقطة ارتكاز متحركة. الشراء عند الارتداد منه يمنح وقف خسارة صغيراً وفرصة عالية الجودة.',
        correctSteps: [
          'تأكد من وجود اتجاه صاعد بقمم وقيعان أعلى فوق متوسط EMA 20 الصاعد.',
          'انتظر بهدوء تراجع السعر لملامسة خط EMA 20.',
          'ادخل شراءً مع شمعة ارتداد واضحة وضع وقف الخسارة أسفل قاع التراجع.',
        ],
        mistakeSteps: [
          'الشراء بعيداً جداً فوق المتوسط بعد عدة شموع صاعدة متتالية.',
          'الذعر أثناء التصحيح الطبيعي للسعر نحو المتوسط.',
          'الخروج عند القاع تماماً في النقطة التي يدخل عندها متداولو الاتجاه.',
        ],
        correctOutcome: 'الدخول عند متوسط EMA 20 يقلل المخاطرة ويحقق استمراراً بنسبة 1:2.4.',
        mistakeOutcome: 'مطاردة السعر الممتد تضع صفقتك في خسارة مؤقتة مع أول تصحيح طبيعي.',
        checklist: [
          'خط EMA 20 يتجه صعوداً بوضوح أسفل الحركة السعرية.',
          'التراجع هادئ دون شموع بيع عنيفة.',
          'شمعة صاعدة أو ذيل رفض يؤكد عودة المشترين عند المتوسط.',
        ],
        realExample: {
          title: 'مثال AUD/USD على إطار ساعة',
          timeframe: 'إطار ساعة واحدة',
          dateWindow: 'اتجاه صاعد مستقر',
          entryTrigger: 'شمعة ابتلاعية صاعدة من EMA 20 عند 0.6640',
          entryPrice: '0.66400',
          stopLossPrice: '0.66080',
          takeProfitPrice: '0.67170',
          moveResult: '+77 نقطة (ربح +2.4R)',
          whyItWorked:
            'احترم الدولار الأسترالي متوسط EMA 20 ثلاث مرات خلال صعود منتظم. الدخول عند التراجع أبقى المخاطرة عند 32 نقطة مقابل هدف 77 نقطة.',
        },
      },
    },
  },
  {
    id: 'liquidity-sweep',
    category: 'reversal',
    level: 'Intermediate',
    bias: 'bullish',
    practiceSymbol: 'XRP/USD',
    typicalRiskReward: '1 : 3.0',
    examplePath: [
      [8, 36],
      [24, 66],
      [38, 46],
      [52, 66],
      [63, 82],
      [72, 62],
      [94, 18],
    ],
    exampleKeyLevels: {
      entryY: 62,
      stopY: 85,
      targetY: 18,
      triggerX: 72,
    },
    translations: {
      en: {
        name: 'Liquidity Sweep & Reclaim',
        tagline: 'Spot fake support breakdowns ("stop hunts") and ride the snap-back rally',
        plainSummary:
          'When an obvious support level draws lots of retail Stop-Losses, price often dips just below it to sweep those stops, then snaps immediately back above support. That reclaim signals trapped sellers and explosive upside.',
        correctSteps: [
          'Mark an obvious equal-low support floor where crowded Stop-Losses likely sit underneath.',
          'Wait for price to spike briefly below the floor and quickly close back above it (Reclaim).',
          'Buy the reclaim close with Stop-Loss under the sweep wick and Target at the range high.',
        ],
        mistakeSteps: [
          'Panic-selling your long or opening a short the second price pokes 1% below support.',
          'Mistaking a quick stop-sweep wick for a real breakdown without waiting for candle close.',
          'Getting trapped short as price snaps sharply back above the floor.',
        ],
        correctOutcome: 'Waiting for the reclaim candle turns a scary fakeout into a crisp 1:3.0 setup.',
        mistakeOutcome: 'Selling on an unconfirmed wick break sells right into smart-money liquidity.',
        checklist: [
          'Clear horizontal support had at least 2 prior touches before the sweep.',
          'Price pierced below support but failed to hold—closing firmly back above it.',
          'Stop-Loss goes cleanly below the sweep wick low so invalidation is exact.',
        ],
        realExample: {
          title: 'XRP/USD 1H Stop Sweep Reversal',
          timeframe: '1H Crypto Chart',
          dateWindow: 'Range Low Fakeout',
          entryTrigger: '1H reclaim close back above $0.5820 floor',
          entryPrice: '$0.5840',
          stopLossPrice: '$0.5690',
          takeProfitPrice: '$0.6290',
          moveResult: '+7.7% bounce (+3.0R gain)',
          whyItWorked:
            'XRP dipped below its crowded $0.5820 floor to $0.5705, triggering late shorts and stops, then closed the very same hour at $0.5840. Trapped sellers fueled a fast rally to $0.6290.',
        },
      },
      fr: {
        name: 'Chasse aux Stops & Réintégration (Sweep)',
        tagline: 'Repérez les fausses cassures de support avant le rebond brutal de réintégration',
        plainSummary:
          'Sous un support très visible s’accumulent de nombreux Stop-Loss. Le prix perce souvent brièvement ce seuil pour purger ces ordres, puis réintègre immédiatement le support—signal d’un fort rebond.',
        correctSteps: [
          'Tracez un plancher évident à creux égaux où les stops acheteurs sont regroupés.',
          'Attendez une mèche sous le support suivie d’une clôture nette au-dessus (Réintégration).',
          'Achetez à la clôture avec Stop-Loss sous la mèche et objectif vers le haut du range.',
        ],
        mistakeSteps: [
          'Vendre à découvert dès que le prix passe brièvement sous le support.',
          'Confondre une mèche rapide avec une vraie cassure sans attendre la clôture.',
          'Rester piégé à la vente lorsque le prix réintègre violemment le support.',
        ],
        correctOutcome: 'Attendre la bougie de réintégration transforme un faux signal en ratio 1:3.0.',
        mistakeOutcome: 'Vendre sur une mèche non confirmée alimente la liquidité des acheteurs.',
        checklist: [
          'Le support horizontal avait au moins 2 appuis clairs avant la purge.',
          'La bougie perce dessous puis clôture franchement au-dessus du niveau.',
          'Le Stop-Loss se place sous l’extrême bas de la mèche de purge.',
        ],
        realExample: {
          title: 'XRP/USD — Purge & Réintégration 1H',
          timeframe: 'Graphique 1H',
          dateWindow: 'Bas de range',
          entryTrigger: 'Clôture 1H de retour au-dessus de 0,5820 $',
          entryPrice: '$0.5840',
          stopLossPrice: '$0.5690',
          takeProfitPrice: '$0.6290',
          moveResult: 'Rebond +7,7 % (+3.0R)',
          whyItWorked:
            'XRP a brièvement chuté sous 0,5820 $ jusqu’à 0,5705 $ avant de clôturer la même heure à 0,5840 $, piégeant les vendeurs jusqu’à 0,6290 $.',
        },
      },
      es: {
        name: 'Barrido de Liquidez y Recuperación',
        tagline: 'Detecta falsas rupturas de soporte ("caza de stops") y aprovecha el rebote rápido',
        plainSummary:
          'Bajo un soporte muy evidente se acumulan muchos Stop-Loss. El precio suele perforar brevemente ese suelo para barrer liquidez y volver rápido por encima, atrapando a los vendedores.',
        correctSteps: [
          'Marca un suelo horizontal claro donde se acumulen mínimos iguales y stops.',
          'Espera una ruptura breve seguida de un cierre firme de vuelta sobre el soporte.',
          'Compra en la recuperación con Stop-Loss debajo de la mecha y objetivo en el techo del rango.',
        ],
        mistakeSteps: [
          'Vender en corto en cuanto una vela asoma apenas por debajo del soporte.',
          'Confundir un barrido rápido en mecha con una ruptura real sin esperar el cierre.',
          'Quedar atrapado vendido cuando el precio rebota con fuerza dentro del rango.',
        ],
        correctOutcome: 'Esperar la vela de recuperación convierte una trampa en un trade 1:3.0.',
        mistakeOutcome: 'Operar rupturas sin cierre confirmado vende justo en el fondo.',
        checklist: [
          'El soporte horizontal tuvo al menos 2 rebotes claros antes del barrido.',
          'El precio perforó abajo pero cerró con fuerza nuevamente por encima.',
          'Stop-Loss exacto justo debajo de la mecha mínima del barrido.',
        ],
        realExample: {
          title: 'XRP/USD — Barrido y Recuperación 1H',
          timeframe: 'Gráfico 1H Cripto',
          dateWindow: 'Falsa ruptura inferior',
          entryTrigger: 'Cierre 1H recuperando el soporte $0.5820',
          entryPrice: '$0.5840',
          stopLossPrice: '$0.5690',
          takeProfitPrice: '$0.6290',
          moveResult: 'Rebote +7.7% (+3.0R)',
          whyItWorked:
            'XRP bajó de $0.5820 hasta $0.5705 barriendo stops y cerró esa misma hora en $0.5840, impulsando un giro veloz hasta $0.6290.',
        },
      },
      ar: {
        name: 'كسر وهمي وسحب السيولة (Liquidity Sweep)',
        tagline: 'اكتشف الكسر الكاذب للدعم (صيد أوامر الوقف) واستفد من الارتداد السريع',
        plainSummary:
          'تتجمع أوامر وقف الخسارة أسفل مستويات الدعم الواضحة. أحياناً يهبط السعر سريعاً أسفل الدعم لسحب هذه الأوامر ثم يعود للإغلاق فوقه فوراً، ما يكشف مصيدة للبائعين وانطلاقة صاعدة قوية.',
        correctSteps: [
          'حدّد دعماً أفقياً واضحاً تكررت عنده القيعان وتتجمع تحته أوامر الوقف.',
          'انتظر كسراً سريعاً بذيل شمعة يتبعه إغلاق سريع أعلى مستوى الدعم (استرداد).',
          'ادخل شراءً بعد إغلاق الاسترداد مع وقف خسارة أسفل ذيل الكسر وهدف عند قمة النطاق.',
        ],
        mistakeSteps: [
          'البيع بدافع الذعر بمجرد لمس السعر أسفل الدعم بنسبة بسيطة.',
          'اعتبار الذيل السريع كسراً حقيقياً دون انتظار إغلاق الشمعة.',
          'الوقوع في مصيدة بيع مع ارتداد السعر بعنف فوق الدعم.',
        ],
        correctOutcome: 'انتظار شمعة الاسترداد يحوّل الكسر الكاذب إلى صفقة دقيقة بنسبة 1:3.0.',
        mistakeOutcome: 'البيع عند كسر غير مؤكد يضعك في أسوأ نقطة سعرية.',
        checklist: [
          'ارتكز الدعم الأفقي مرتين على الأقل قبل الكسر الوهمي.',
          'اخترق السعر الدعم مؤقتاً لكنه أغلق بقوة فوقه مجدداً.',
          'تحديد وقف الخسارة أسفل أدنى ذيل للكسر الوهمي.',
        ],
        realExample: {
          title: 'مثال XRP/USD على إطار ساعة',
          timeframe: 'إطار ساعة واحدة',
          dateWindow: 'كسر وهمي لقاع النطاق',
          entryTrigger: 'إغلاق شمعة ساعة أعلى مستوى 0.5820$ مجدداً',
          entryPrice: '$0.5840',
          stopLossPrice: '$0.5690',
          takeProfitPrice: '$0.6290',
          moveResult: 'ارتداد +7.7% (ربح +3.0R)',
          whyItWorked:
            'هبط XRP أسفل 0.5820$ إلى 0.5705$ لسحب أوامر الوقف ثم أغلق في الساعة نفسها عند 0.5840$، ما فجّر صعوداً سريعاً نحو 0.6290$.',
        },
      },
    },
  },
  {
    id: 'bollinger-squeeze',
    category: 'momentum',
    level: 'Intermediate',
    bias: 'bearish',
    practiceSymbol: 'AVAX/USD',
    typicalRiskReward: '1 : 2.6',
    examplePath: [
      [8, 40],
      [22, 46],
      [36, 41],
      [50, 45],
      [62, 42],
      [72, 56],
      [94, 88],
    ],
    exampleKeyLevels: {
      entryY: 56,
      stopY: 38,
      targetY: 88,
      triggerX: 72,
    },
    translations: {
      en: {
        name: 'Bollinger Squeeze Breakdown',
        tagline: 'Catch explosive volatility breakouts right after price coils inside tight bands',
        plainSummary:
          'Periods of calm, narrow sideways trading pinch the upper and lower Bollinger Bands tightly together ("the Squeeze"). When bands expand and a full candle closes outside the lower band, bearish momentum often accelerates fast.',
        correctSteps: [
          'Spot Bollinger Bands squeezing tightly around quiet sideways candles.',
          'Wait for the bands to flare open and a strong candle to close below the lower band.',
          'Enter short on confirmation with Stop-Loss above the squeeze ceiling and ride the expansion.',
        ],
        mistakeSteps: [
          'Trading randomly inside the tight sideways box where spreads and chop eat you alive.',
          'Guessing breakdown direction early before a candle closes outside the squeezed band.',
          'Getting whipped back and forth during the final quiet consolidation bars.',
        ],
        correctOutcome: 'Waiting for band expansion catches the real directional burst (1:2.6).',
        mistakeOutcome: 'Trading inside a tight squeeze wastes capital on sideways noise.',
        checklist: [
          'Bollinger Bands visibly narrowed to their tightest width in 20+ bars.',
          'A decisive candle closes cleanly outside the lower band as bands widen.',
          'Stop-Loss sits neatly above the opposite side of the squeeze range.',
        ],
        realExample: {
          title: 'AVAX/USD 4H Squeeze Expansion',
          timeframe: '4H Crypto Chart',
          dateWindow: 'Low-Volatility Compression',
          entryTrigger: '4H close below squeezed $35.10 lower band',
          entryPrice: '$34.80',
          stopLossPrice: '$36.50',
          takeProfitPrice: '$30.38',
          moveResult: '-12.7% drop (+2.6R gain)',
          whyItWorked:
            'AVAX traded inside a tight $1.40 band for three days, compressing Bollinger volatility. When $35.10 broke on expanding bands, sellers drove a swift 12.7% drop.',
        },
      },
      fr: {
        name: 'Compression Bollinger (Squeeze)',
        tagline: 'Capturez l’explosion de volatilité juste après un resserrement extrême des bandes',
        plainSummary:
          'Quand le marché devient très calme, les bandes de Bollinger se resserrent fortement (« Squeeze »). Dès qu’une bougie clôture franchement hors de la bande inférieure avec écartement des bandes, l’impulsion baissière démarre.',
        correctSteps: [
          'Repérez un fort pincement des bandes de Bollinger autour d’un range étroit.',
          'Attendez l’écartement des bandes et une clôture franche sous la bande basse.',
          'Vendez à la cassure avec Stop-Loss au-dessus du haut du range comprimé.',
        ],
        mistakeSteps: [
          'Multiplier les trades aléatoires à l’intérieur du petit range sans tendance.',
          'Anticiper le sens de sortie avant la vraie clôture hors bande.',
          'Subir des faux départs en pleine zone de compression.',
        ],
        correctOutcome: 'Attendre l’expansion capture le vrai mouvement directionnel (1:2.6).',
        mistakeOutcome: 'Trader au cœur d’un squeeze expose au bruit latéral.',
        checklist: [
          'Les bandes de Bollinger sont à leur largeur la plus étroite depuis 20+ bougies.',
          'Une bougie clôture hors de la bande basse pendant que les bandes s’ouvrent.',
          'Stop-Loss placé proprement au-dessus du plafond de la compression.',
        ],
        realExample: {
          title: 'AVAX/USD — Expansion Bollinger 4H',
          timeframe: 'Graphique 4H',
          dateWindow: 'Compression de volatilité',
          entryTrigger: 'Clôture 4H sous la bande basse à 35,10 $',
          entryPrice: '$34.80',
          stopLossPrice: '$36.50',
          takeProfitPrice: '$30.38',
          moveResult: 'Baisse -12,7 % (+2.6R)',
          whyItWorked:
            'AVAX a consolidé trois jours dans un couloir étroit de 1,40 $. La cassure des 35,10 $ avec réouverture des bandes a libéré -12,7 % rapidement.',
        },
      },
      es: {
        name: 'Compresión Bollinger (Squeeze)',
        tagline: 'Captura rupturas explosivas justo tras una compresión estrecha de volatilidad',
        plainSummary:
          'Cuando el mercado descansa en calma, las bandas de Bollinger se estrechan («Squeeze»). Al abrirse de nuevo con una vela cerrando bajo la banda inferior, suele iniciar un impulso rápido.',
        correctSteps: [
          'Detecta las bandas de Bollinger muy estrechas alrededor de velas laterales.',
          'Espera a que las bandas se abran y una vela fuerte cierre bajo la banda inferior.',
          'Vende tras la confirmación con Stop-Loss sobre el techo de la compresión.',
        ],
        mistakeSteps: [
          'Operar sin rumbo dentro de la caja lateral donde el ruido cobra comisiones.',
          'Adivinar la dirección antes de ver el cierre fuera de la banda.',
          'Quedar atrapado en vaivenes falsos antes de la expansión real.',
        ],
        correctOutcome: 'Esperar la expansión captura el movimiento fuerte con ratio 1:2.6.',
        mistakeOutcome: 'Operar dentro de la compresión desperdicia capital en ruido lateral.',
        checklist: [
          'Las bandas muestran su menor ancho de las últimas 20 o más velas.',
          'Una vela decisiva cierra fuera de la banda inferior mientras se expande.',
          'Stop-Loss ubicado sobre el límite opuesto del rango comprimido.',
        ],
        realExample: {
          title: 'AVAX/USD — Expansión Squeeze 4H',
          timeframe: 'Gráfico 4H Cripto',
          dateWindow: 'Compresión de baja volatilidad',
          entryTrigger: 'Cierre 4H bajo banda inferior en $35.10',
          entryPrice: '$34.80',
          stopLossPrice: '$36.50',
          takeProfitPrice: '$30.38',
          moveResult: 'Caída -12.7% (+2.6R)',
          whyItWorked:
            'AVAX osciló tres días en un rango estrecho de $1.40. Al romper $35.10 con expansión de bandas, cayó 12.7% directo al objetivo.',
        },
      },
      ar: {
        name: 'انفجار انضغاط بولينجر (Bollinger Squeeze)',
        tagline: 'التقط الانطلاقات القوية فور ضيق نطاق التذبذب بين حدود بولينجر',
        plainSummary:
          'عندما يهدأ السوق في حركة عرضية ضيقة، تقترب خطوط بولينجر من بعضها مثل النابض المضغوط. وعند اتساع الخطوط مع إغلاق شمعة واضحة خارج الحد السفلي، ينطلق زخم هبوطي سريع.',
        correctSteps: [
          'لاحظ تقارب حدي بولينجر العلوي والسفلي حول شموع هادئة ومتقاربة.',
          'انتظر بدء اتساع النطاق وإغلاق شمعة قوية أسفل الحد السفلي.',
          'ادخل بيعاً بعد التأكيد مع وقف خسارة أعلى سقف التماسك واستهدف موجة التمدد.',
        ],
        mistakeSteps: [
          'التداول العشوائي داخل النطاق الضيق وسط التذبذب الممل.',
          'تخمين اتجاه الكسر قبل إغلاق شمعة خارج الحد المضغوط.',
          'التعرض لضربات متكررة أثناء التماسك الهادئ قبل الانفجار.',
        ],
        correctOutcome: 'انتظار اتساع البولينجر يلتقط الحركة الاتجاهية الحقيقية بنسبة 1:2.6.',
        mistakeOutcome: 'التداول داخل الضيق السعري يستنزف الحساب بلا اتجاه واضح.',
        checklist: [
          'ضيق خطوط بولينجر إلى أضيق نطاق خلال آخر 20 شمعة على الأقل.',
          'إغلاق شمعة واضحة أسفل الحد السفلي بالتزامن مع اتساع البولينجر.',
          'وضع وقف الخسارة أعلى الحد المقابل لنطاق الانضغاط.',
        ],
        realExample: {
          title: 'مثال AVAX/USD على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'انضغاط تذبذب منخفض',
          entryTrigger: 'إغلاق 4 ساعات أسفل الحد السفلي عند 35.10$',
          entryPrice: '$34.80',
          stopLossPrice: '$36.50',
          takeProfitPrice: '$30.38',
          moveResult: 'هبوط -12.7% (ربح +2.6R)',
          whyItWorked:
            'تحركت AVAX ثلاثة أيام داخل نطاق ضيق لا يتجاوز 1.40$. بمجرد كسر 35.10$ مع توسع البولينجر، هبط السعر سريعاً بنسبة 12.7%.',
        },
      },
    },
  },
];
