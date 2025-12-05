import { format, startOfWeek, endOfWeek, subDays, differenceInDays, parseISO } from 'date-fns';
import { TimeOfDay, DailyEntry, DashboardStats } from '@/types';
import { clsx, type ClassValue } from 'clsx';

// Tailwind class merger utility
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Get time of day for personalized greetings
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Get greeting based on time of day
export function getGreeting(name: string = 'Nut'): string {
  const timeOfDay = getTimeOfDay();
  const greetings: Record<TimeOfDay, string> = {
    morning: `Good morning, ${name}! ☀️`,
    afternoon: `Good afternoon, ${name}! 🌤️`,
    evening: `Good evening, ${name}! 🌅`,
    night: `Good night, ${name}! 🌙`,
  };
  return greetings[timeOfDay];
}

// Format date for display
export function formatDate(date: Date | string, formatStr: string = 'EEEE, MMMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

// Get current week's start and end dates
export function getCurrentWeekRange(): { start: Date; end: Date } {
  const today = new Date();
  return {
    start: startOfWeek(today, { weekStartsOn: 1 }), // Monday start
    end: endOfWeek(today, { weekStartsOn: 1 }),
  };
}

// Calculate streak from array of entries
export function calculateStreak(entries: DailyEntry[], field: keyof DailyEntry): number {
  if (!entries.length) return 0;
  
  // Sort entries by date descending (most recent first)
  const sorted = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = getTodayDate();
  let expectedDate = parseISO(today);
  
  for (const entry of sorted) {
    const entryDate = parseISO(entry.date);
    const dayDiff = differenceInDays(expectedDate, entryDate);
    
    // Allow for today not being logged yet
    if (dayDiff > 1) break;
    
    if (entry[field] === true) {
      streak++;
      expectedDate = subDays(entryDate, 1);
    } else if (dayDiff <= 1) {
      // Today or yesterday not done - check if it's today (might not be logged yet)
      if (entry.date === today) {
        expectedDate = subDays(entryDate, 1);
        continue;
      }
      break;
    }
  }
  
  return streak;
}

// Calculate average from array of numbers
export function calculateAverage(values: (number | null)[]): number {
  const validValues = values.filter((v): v is number => v !== null);
  if (!validValues.length) return 0;
  return Number((validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(1));
}

// Calculate stats from daily entries
export function calculateDashboardStats(
  dailyEntries: DailyEntry[],
  currentMonthlyIncome: number = 87500
): DashboardStats {
  // Filter to this week's entries
  const { start, end } = getCurrentWeekRange();
  const weekEntries = dailyEntries.filter(e => {
    const d = parseISO(e.date);
    return d >= start && d <= end;
  });
  
  // Calculate streaks from all entries
  const exerciseStreak = calculateStreak(dailyEntries, 'exercise_done');
  const meditationStreak = calculateStreak(dailyEntries, 'meditation_done');
  const readingStreak = calculateStreak(dailyEntries, 'reading_done');
  
  // Calculate averages for the week
  const avgSleepHours = calculateAverage(weekEntries.map(e => e.sleep_hours));
  const avgDeepWorkHours = calculateAverage(weekEntries.map(e => e.deep_work_hours));
  const avgEnergyLevel = calculateAverage(weekEntries.map(e => e.energy_level));
  const avgStressLevel = calculateAverage(weekEntries.map(e => e.stress_level));
  
  // Count days for habits this week
  const proteinTargetHitDays = weekEntries.filter(e => e.protein_target_hit).length;
  const exerciseDays = weekEntries.filter(e => e.exercise_done).length;
  const meditationDays = weekEntries.filter(e => e.meditation_done).length;
  const readingDays = weekEntries.filter(e => e.reading_done).length;
  const aiSkillsDays = weekEntries.filter(e => e.ai_skills_done).length;
  
  // Weight tracking
  const latestWeight = dailyEntries
    .filter(e => e.weight_kg !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.weight_kg || null;
  
  const weekAgoWeight = dailyEntries
    .filter(e => e.weight_kg !== null && differenceInDays(new Date(), parseISO(e.date)) >= 7)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.weight_kg || null;
  
  const monthAgoWeight = dailyEntries
    .filter(e => e.weight_kg !== null && differenceInDays(new Date(), parseISO(e.date)) >= 30)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.weight_kg || null;
  
  // Goal progress (1M THB target)
  const targetIncome = 1000000;
  const incomeGoalProgress = (currentMonthlyIncome / targetIncome) * 100;
  
  return {
    exercise_streak: exerciseStreak,
    meditation_streak: meditationStreak,
    reading_streak: readingStreak,
    avg_sleep_hours: avgSleepHours,
    avg_deep_work_hours: avgDeepWorkHours,
    avg_energy_level: avgEnergyLevel,
    avg_stress_level: avgStressLevel,
    protein_target_hit_days: proteinTargetHitDays,
    exercise_days: exerciseDays,
    meditation_days: meditationDays,
    reading_days: readingDays,
    ai_skills_days: aiSkillsDays,
    current_weight: latestWeight,
    weight_change_week: latestWeight && weekAgoWeight ? Number((latestWeight - weekAgoWeight).toFixed(1)) : null,
    weight_change_month: latestWeight && monthAgoWeight ? Number((latestWeight - monthAgoWeight).toFixed(1)) : null,
    income_goal_progress: Number(incomeGoalProgress.toFixed(1)),
    current_monthly_income: currentMonthlyIncome,
    youtube_videos_this_week: 0, // Will be populated from weekly entries
    client_outreach_this_week: 0, // Will be populated from weekly entries
  };
}

// Format number with Thai Baht
export function formatTHB(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Get progress bar color based on percentage
export function getProgressColor(percent: number): string {
  if (percent >= 80) return 'bg-green-500';
  if (percent >= 60) return 'bg-emerald-500';
  if (percent >= 40) return 'bg-yellow-500';
  if (percent >= 20) return 'bg-orange-500';
  return 'bg-red-500';
}

// Get score color based on 1-10 scale
export function getScoreColor(score: number): string {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-emerald-400';
  if (score >= 4) return 'text-yellow-400';
  if (score >= 2) return 'text-orange-400';
  return 'text-red-400';
}

// Generate motivational message based on stats
export function getMotivationalMessage(stats: DashboardStats): string {
  const messages: string[] = [];
  
  if (stats.exercise_streak >= 7) {
    messages.push(`🔥 Amazing ${stats.exercise_streak}-day exercise streak! Keep it up!`);
  }
  
  if (stats.avg_sleep_hours >= 7.5) {
    messages.push("😴 Great sleep habits this week - that's fueling your success!");
  }
  
  if (stats.avg_deep_work_hours >= 1.5) {
    messages.push("🎯 Crushing your deep work target - focused work leads to results!");
  }
  
  if (stats.meditation_days >= 5) {
    messages.push("🧘 Consistent meditation practice - your mental clarity shows!");
  }
  
  if (messages.length === 0) {
    messages.push("💪 Every day is a new opportunity to level up. Let's make today count!");
  }
  
  return messages[Math.floor(Math.random() * messages.length)];
}

// Local storage helpers for persisting data before database is connected
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

// Storage keys
export const STORAGE_KEYS = {
  DAILY_ENTRIES: 'selfmastery_daily_entries',
  WEEKLY_ENTRIES: 'selfmastery_weekly_entries',
  MONTHLY_ENTRIES: 'selfmastery_monthly_entries',
  GOALS: 'selfmastery_goals',
  USER_SETTINGS: 'selfmastery_user_settings',
  PRINCIPLES: 'selfmastery_principles',
};

// Debounce utility for auto-save
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
