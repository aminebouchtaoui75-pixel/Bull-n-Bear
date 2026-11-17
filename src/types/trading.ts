export type AssetClass = 'crypto' | 'forex';

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

export interface Instrument {
  symbol: string;
  name: string;
  base: string;
  quote: string;
  assetClass: AssetClass;
  decimals: number;
  pipSize: number;
  typicalSpreadPct: number;
  beginnerNote: string;
}

export interface MarketQuote {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  open24h: number;
  high24h: number;
  low24h: number;
  change24hPct: number;
  volume24h: number;
  source: 'live-api' | 'live-feed';
  updatedAt: number;
}

export interface Candle {
  time: number; // unix ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Position {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  side: OrderSide;
  quantity: number; // units of base asset
  notionalUsd: number;
  marginUsd: number;
  leverage: number;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  openedAt: number;
  strategyTag?: string;
}

export interface PendingOrder {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  side: OrderSide;
  notionalUsd: number;
  leverage: number;
  limitPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  createdAt: number;
}

export interface TradeLog {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  side: OrderSide;
  quantity: number;
  notionalUsd: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  realizedPnl: number;
  returnPct: number;
  closeReason: 'manual' | 'stop-loss' | 'take-profit' | 'liquidation';
  openedAt: number;
  closedAt: number;
  feeUsd: number;
}

export interface EquityPoint {
  time: number;
  equity: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  targetPrice: number;
  note?: string;
  active: boolean;
  recurring: boolean;
  createdAt: number;
  lastTriggeredAt?: number;
}

export interface AppNotification {
  id: string;
  category: 'market-alert' | 'portfolio-update' | 'learning';
  title: string;
  body: string;
  symbol?: string;
  timestamp: number;
  read: boolean;
}

export interface NotificationPrefs {
  pushEnabled: boolean;
  marketAlerts: boolean;
  orderFills: boolean;
  stopTakeTriggers: boolean;
  equityMilestones: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type SimulatorKind =
  | 'spread-lab'
  | 'order-sandbox'
  | 'pip-calculator'
  | 'candlestick-anatomy'
  | 'position-sizer'
  | 'indicator-lab'
  | 'session-news-lab'
  | 'readiness-checklist';

export interface LessonSection {
  heading: string;
  body: string;
  keyTakeaway: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  moduleTitle: string;
  number: number;
  title: string;
  level: 'Beginner' | 'Intermediate';
  durationMinutes: number;
  summary: string;
  practiceSymbol: string;
  sections: LessonSection[];
  simulator: SimulatorKind;
  quiz: QuizQuestion[];
}

export interface LessonProgress {
  completed: boolean;
  bestScore: number;
  totalQuestions: number;
  lastAttemptAt?: number;
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  activeDays: string[];
}

export type StrategyId =
  | 'head-shoulders'
  | 'double-bottom'
  | 'double-top'
  | 'breakout-retest'
  | 'bull-flag'
  | 'ema-pullback'
  | 'liquidity-sweep'
  | 'rsi-divergence'
  | 'bollinger-squeeze';

export type StrategyCategory = 'reversal' | 'continuation' | 'momentum';

export type DailyMissionId = 'long-trade' | 'risk-guard' | 'strategy-guide' | 'academy-quiz';

export interface DailyMissionsState {
  dateKey: string;
  totalXp: number;
  completedIds: DailyMissionId[];
  bonusClaimedDate: string | null;
}

export type AchievementId =
  | 'first-trade'
  | 'perfect-quiz'
  | 'streak-7'
  | 'risk-protector'
  | 'playbook-collector'
  | 'course-graduate';

export interface AchievementStatus {
  id: AchievementId;
  unlocked: boolean;
  unlockedAt?: number;
  current: number;
  target: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  lessonXp: number;
  missionXp: number;
  totalXp: number;
  level: number;
  rank: number;
  isCurrentUser: boolean;
}

export type ScenarioId = 'btcCrash2020' | 'eurShock2015' | 'solDeleveraging2021';

export interface ScenarioCandleEvent {
  barIndex: number;
  titleKey: 'ev1' | 'ev2' | 'ev3' | 'ev4';
}

export interface HistoricalScenario {
  id: ScenarioId;
  symbol: string;
  timeframeLabel: string;
  dateLabel: string;
  initialCapital: number;
  initialVisibleBars: number;
  candles: Candle[];
  events: ScenarioCandleEvent[];
}

export interface ScenarioTradeRecord {
  id: string;
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  notionalUsd: number;
  marginUsd: number;
  leverage: number;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  openedBar: number;
  closedBar?: number;
  exitPrice?: number;
  realizedPnl?: number;
  closeReason?: 'manual' | 'stop-loss' | 'take-profit' | 'liquidation' | 'end-of-scenario';
  plannedRiskReward: number | null;
}

export interface ScenarioGradeCriterion {
  id: 'stop-loss' | 'sizing-leverage' | 'risk-reward' | 'drawdown';
  score: number;
  maxScore: number;
  metricValue: string;
  status: 'strong' | 'fair' | 'weak';
  feedbackKey: string;
}

export interface ScenarioGradeReport {
  scenarioId: ScenarioId;
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  startingEquity: number;
  endingEquity: number;
  netPnl: number;
  netReturnPct: number;
  maxDrawdownPct: number;
  tradesCount: number;
  liquidatedCount: number;
  criteria: ScenarioGradeCriterion[];
  trades: ScenarioTradeRecord[];
}

export type AppTab = 'overview' | 'trade' | 'academy' | 'strategies' | 'alerts';
