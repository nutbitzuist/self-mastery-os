// User profile type
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  settings: UserSettings;
}

export interface UserSettings {
  sleep_target_hours: number;
  sleep_target_bedtime: string;
  sleep_target_waketime: string;
  deep_work_target_hours: number;
  protein_target_grams: number;
  weight_goal_kg: number;
  weight_goal_deadline: string;
  income_goal_thb: number;
  income_goal_deadline: string;
  week_start_day: 'monday' | 'sunday';
}

// Daily entry type
export interface DailyEntry {
  id?: string;
  user_id?: string;
  date: string;
  
  // Morning Routine
  wake_time: string | null;
  bed_time: string | null;
  exercise_done: boolean;
  workout_duration_mins: number | null;
  
  // Physical
  weight_kg: number | null;
  protein_target_hit: boolean;
  protein_grams: number | null;
  calories: number | null;
  
  // Sleep
  sleep_hours: number | null;
  sleep_schedule_status: 'as_scheduled' | 'not_scheduled' | 'less_than_8' | null;
  sleep_quality: number | null;
  
  // Habits
  meditation_done: boolean;
  meditation_minutes: number | null;
  reading_done: boolean;
  reading_minutes: number | null;
  ai_skills_done: boolean;
  
  // Productivity
  deep_work_hours: number | null;
  tasks_completed: number | null;
  tasks_planned: number | null;
  
  // Nutrition
  nutrition_status: 'as_plan' | 'skip' | 'partial' | null;
  
  // Energy & Mood
  energy_level: number | null;
  stress_level: number | null;
  
  // Reflections
  best_of_day: string | null;
  top_3_priorities: string[];
  top_3_tomorrow: string[];
  reflection_good: string | null;
  reflection_improve: string | null;
  
  created_at?: string;
  updated_at?: string;
}

// Weekly entry type
export interface WeeklyEntry {
  id?: string;
  user_id?: string;
  week_start_date: string;
  year: number;
  week_number: number;
  
  // Relationships
  loved_one_lunch: boolean;
  family_dinner: boolean;
  quality_time_hours: number | null;
  
  // Business/Side Projects
  youtube_video_posted: boolean;
  youtube_video_count: number;
  client_outreach_count: number;
  product_offerings_count: number;
  
  // Review
  week_rating: number | null;
  big_decision_made: string | null;
  what_went_well: string | null;
  what_to_improve: string | null;
  focus_next_week: string | null;
  
  created_at?: string;
  updated_at?: string;
}

// Monthly entry type
export interface MonthlyEntry {
  id?: string;
  user_id?: string;
  year: number;
  month: number;
  
  // Income Streams
  salary_income: number | null;
  trading_income: number | null;
  business_income: number | null;
  other_income: number | null;
  
  // Life Dimensions Scores (1-10 each)
  score_physical_health: number | null;
  score_mental_health: number | null;
  score_career: number | null;
  score_business: number | null;
  score_wealth: number | null;
  score_relationships: number | null;
  score_productivity: number | null;
  score_self_awareness: number | null;
  score_life_vision: number | null;
  score_learning: number | null;
  score_fun: number | null;
  score_contribution: number | null;
  
  // Review
  month_rating: number | null;
  wins: string | null;
  lessons: string | null;
  focus_next_month: string | null;
  
  created_at?: string;
  updated_at?: string;
}

// Goal type
export interface Goal {
  id?: string;
  user_id?: string;
  title: string;
  description: string | null;
  target_value: number;
  target_unit: string;
  current_value: number;
  goal_type: 'yearly' | 'quarterly' | 'monthly' | 'weekly';
  deadline: string;
  category: string;
  leading_indicators: LeadingIndicator[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LeadingIndicator {
  name: string;
  target_per_week: number;
  current_this_week: number;
}

// AI Insight type
export interface AIInsight {
  id?: string;
  user_id?: string;
  insight_type: 'daily' | 'weekly' | 'monthly';
  insight_date: string;
  content: string;
  dimensions_to_improve: DimensionImprovement[];
  patterns_detected: Pattern[];
  recommendations: string[];
  created_at?: string;
}

export interface DimensionImprovement {
  dimension: string;
  current_score: number;
  reason: string;
  suggestion: string;
}

export interface Pattern {
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

// Principle type
export interface Principle {
  id?: string;
  user_id?: string;
  content: string;
  category: string;
  is_active: boolean;
  created_at?: string;
}

// Dashboard stats type
export interface DashboardStats {
  // Streaks
  exercise_streak: number;
  meditation_streak: number;
  reading_streak: number;
  
  // Averages (this week)
  avg_sleep_hours: number;
  avg_deep_work_hours: number;
  avg_energy_level: number;
  avg_stress_level: number;
  
  // Counts (this week)
  protein_target_hit_days: number;
  exercise_days: number;
  meditation_days: number;
  reading_days: number;
  ai_skills_days: number;
  
  // Weight
  current_weight: number | null;
  weight_change_week: number | null;
  weight_change_month: number | null;
  
  // Goal progress
  income_goal_progress: number;
  current_monthly_income: number;
  
  // Leading indicators this week
  youtube_videos_this_week: number;
  client_outreach_this_week: number;
}

// Life dimension for visualization
export interface LifeDimension {
  key: string;
  name: string;
  color: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

// Chart data types
export interface WeeklyTrendData {
  date: string;
  sleep_hours: number;
  deep_work_hours: number;
  energy_level: number;
  weight_kg: number;
}

export interface MonthlyIncomeData {
  month: string;
  salary: number;
  trading: number;
  business: number;
  other: number;
  total: number;
}

// Form state type
export interface DailyEntryFormState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

// Navigation type
export type NavigationItem = {
  name: string;
  href: string;
  icon: string;
  current: boolean;
};

// Time of day for greetings
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Default values
export const DEFAULT_USER_SETTINGS: UserSettings = {
  sleep_target_hours: 8,
  sleep_target_bedtime: '21:00',
  sleep_target_waketime: '05:00',
  deep_work_target_hours: 1.5,
  protein_target_grams: 150,
  weight_goal_kg: 60,
  weight_goal_deadline: '2026-12-31',
  income_goal_thb: 1000000,
  income_goal_deadline: '2026-12-31',
  week_start_day: 'monday',
};

export const DEFAULT_DAILY_ENTRY: DailyEntry = {
  date: new Date().toISOString().split('T')[0],
  wake_time: null,
  bed_time: null,
  exercise_done: false,
  workout_duration_mins: null,
  weight_kg: null,
  protein_target_hit: false,
  protein_grams: null,
  calories: null,
  sleep_hours: null,
  sleep_schedule_status: null,
  sleep_quality: null,
  meditation_done: false,
  meditation_minutes: null,
  reading_done: false,
  reading_minutes: null,
  ai_skills_done: false,
  deep_work_hours: null,
  tasks_completed: null,
  tasks_planned: null,
  nutrition_status: null,
  energy_level: null,
  stress_level: null,
  best_of_day: null,
  top_3_priorities: ['', '', ''],
  top_3_tomorrow: ['', '', ''],
  reflection_good: null,
  reflection_improve: null,
};

// Life dimensions configuration (8 core dimensions from Self Mastery framework)
export const LIFE_DIMENSIONS_8: LifeDimension[] = [
  { key: 'physical_health', name: 'Physical Health', color: '#10b981', score: 0, trend: 'stable' },
  { key: 'mental_health', name: 'Mental Health', color: '#8b5cf6', score: 0, trend: 'stable' },
  { key: 'career_business', name: 'Career/Business', color: '#3b82f6', score: 0, trend: 'stable' },
  { key: 'wealth', name: 'Wealth', color: '#eab308', score: 0, trend: 'stable' },
  { key: 'relationships', name: 'Relationships', color: '#ec4899', score: 0, trend: 'stable' },
  { key: 'productivity', name: 'Time Management & Productivity', color: '#06b6d4', score: 0, trend: 'stable' },
  { key: 'life_vision', name: 'Life Vision', color: '#6366f1', score: 0, trend: 'stable' },
  { key: 'self_awareness', name: 'Self Awareness', color: '#a855f7', score: 0, trend: 'stable' },
];

// Extended 12 dimensions for detailed tracking
export const LIFE_DIMENSIONS: LifeDimension[] = [
  { key: 'physical_health', name: 'Physical Health', color: '#10b981', score: 0, trend: 'stable' },
  { key: 'mental_health', name: 'Mental Health', color: '#8b5cf6', score: 0, trend: 'stable' },
  { key: 'career', name: 'Career', color: '#3b82f6', score: 0, trend: 'stable' },
  { key: 'business', name: 'Business', color: '#f59e0b', score: 0, trend: 'stable' },
  { key: 'wealth', name: 'Wealth', color: '#eab308', score: 0, trend: 'stable' },
  { key: 'relationships', name: 'Relationships', color: '#ec4899', score: 0, trend: 'stable' },
  { key: 'productivity', name: 'Productivity', color: '#06b6d4', score: 0, trend: 'stable' },
  { key: 'self_awareness', name: 'Self Awareness', color: '#a855f7', score: 0, trend: 'stable' },
  { key: 'life_vision', name: 'Life Vision', color: '#6366f1', score: 0, trend: 'stable' },
  { key: 'learning', name: 'Learning & Growth', color: '#14b8a6', score: 0, trend: 'stable' },
  { key: 'fun', name: 'Fun & Adventure', color: '#f97316', score: 0, trend: 'stable' },
  { key: 'contribution', name: 'Contribution', color: '#84cc16', score: 0, trend: 'stable' },
];

// Scorecard types
export interface DimensionScore {
  key: string;
  name: string;
  color: string;
  score: number;
  maxScore: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'excellent' | 'good' | 'okay' | 'below' | 'critical';
  breakdown: ScoreBreakdown[];
}

export interface ScoreBreakdown {
  metric: string;
  value: number | boolean | string;
  target: number | boolean | string;
  points: number;
  maxPoints: number;
  met: boolean;
}

export interface WeeklyScorecard {
  weekStartDate: string;
  weekNumber: number;
  year: number;
  overallScore: number;
  overallPercentage: number;
  overallStatus: 'excellent' | 'good' | 'okay' | 'below' | 'critical';
  dimensions: DimensionScore[];
  lowestDimensions: string[];
  insights: string[];
  focusAreas: string[];
}

export interface ScorecardHistory {
  weekStartDate: string;
  overallScore: number;
  dimensions: { [key: string]: number };
}

// Score status helper
export function getScoreStatus(percentage: number): 'excellent' | 'good' | 'okay' | 'below' | 'critical' {
  if (percentage >= 90) return 'excellent';
  if (percentage >= 80) return 'good';
  if (percentage >= 70) return 'okay';
  if (percentage >= 60) return 'below';
  return 'critical';
}

export const SCORE_STATUS_CONFIG = {
  excellent: { label: 'Excellent', emoji: '🌟', color: 'text-green-400', bg: 'bg-green-500/20' },
  good: { label: 'Good', emoji: '✅', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  okay: { label: 'Okay', emoji: '⚠️', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  below: { label: 'Below Standard', emoji: '🔶', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  critical: { label: 'Critical', emoji: '🔴', color: 'text-red-400', bg: 'bg-red-500/20' },
};
