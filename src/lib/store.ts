import { DailyEntry, WeeklyEntry, MonthlyEntry, Goal, UserSettings, Principle, DEFAULT_USER_SETTINGS, DEFAULT_DAILY_ENTRY } from '@/types';
import { storage, STORAGE_KEYS, getTodayDate } from './utils';

// Initialize default data with sample entries for demonstration
const SAMPLE_DAILY_ENTRIES: DailyEntry[] = [
  {
    date: '2024-12-05',
    wake_time: '05:00',
    bed_time: '21:00',
    exercise_done: true,
    workout_duration_mins: 15,
    weight_kg: 81.0,
    protein_target_hit: true,
    protein_grams: 155,
    calories: 1800,
    sleep_hours: 8,
    sleep_schedule_status: 'as_scheduled',
    sleep_quality: 8,
    meditation_done: true,
    meditation_minutes: 5,
    reading_done: true,
    reading_minutes: 20,
    ai_skills_done: true,
    deep_work_hours: 1.5,
    tasks_completed: 5,
    tasks_planned: 6,
    nutrition_status: 'as_plan',
    energy_level: 8,
    stress_level: 3,
    best_of_day: 'Completed MT4 dashboard optimization',
    top_3_priorities: ['MT4 dashboard', 'Client outreach', 'YouTube script'],
    top_3_tomorrow: ['Record YouTube video', 'Follow up with clients', 'Review trading system'],
    reflection_good: 'Stayed focused during deep work session',
    reflection_improve: 'Could have started earlier on the main task',
  },
  {
    date: '2024-12-04',
    wake_time: '05:15',
    bed_time: '21:30',
    exercise_done: true,
    workout_duration_mins: 15,
    weight_kg: 81.2,
    protein_target_hit: false,
    protein_grams: 120,
    calories: 1900,
    sleep_hours: 7.5,
    sleep_schedule_status: 'not_scheduled',
    sleep_quality: 7,
    meditation_done: false,
    meditation_minutes: null,
    reading_done: true,
    reading_minutes: 15,
    ai_skills_done: true,
    deep_work_hours: 1,
    tasks_completed: 4,
    tasks_planned: 5,
    nutrition_status: 'partial',
    energy_level: 7,
    stress_level: 4,
    best_of_day: 'Great lunch meeting with client',
    top_3_priorities: ['Client meeting', 'Trading review', 'Planning'],
    top_3_tomorrow: ['MT4 dashboard', 'Client outreach', 'YouTube script'],
    reflection_good: 'Client meeting went very well',
    reflection_improve: 'Missed meditation - felt more stressed',
  },
  {
    date: '2024-12-03',
    wake_time: '05:00',
    bed_time: '21:00',
    exercise_done: true,
    workout_duration_mins: 15,
    weight_kg: 81.3,
    protein_target_hit: true,
    protein_grams: 160,
    calories: 1750,
    sleep_hours: 8,
    sleep_schedule_status: 'as_scheduled',
    sleep_quality: 9,
    meditation_done: true,
    meditation_minutes: 5,
    reading_done: true,
    reading_minutes: 30,
    ai_skills_done: true,
    deep_work_hours: 2,
    tasks_completed: 6,
    tasks_planned: 6,
    nutrition_status: 'as_plan',
    energy_level: 9,
    stress_level: 2,
    best_of_day: 'Excellent deep work session - 2 full hours!',
    top_3_priorities: ['Deep work on business', 'Exercise', 'Family call'],
    top_3_tomorrow: ['Client meeting', 'Trading review', 'Planning'],
    reflection_good: 'Perfect morning routine execution',
    reflection_improve: null,
  },
  {
    date: '2024-12-02',
    wake_time: '05:00',
    bed_time: '21:00',
    exercise_done: true,
    workout_duration_mins: 15,
    weight_kg: 81.4,
    protein_target_hit: true,
    protein_grams: 150,
    calories: 1800,
    sleep_hours: 8,
    sleep_schedule_status: 'as_scheduled',
    sleep_quality: 8,
    meditation_done: true,
    meditation_minutes: 5,
    reading_done: false,
    reading_minutes: null,
    ai_skills_done: false,
    deep_work_hours: 1.5,
    tasks_completed: 5,
    tasks_planned: 5,
    nutrition_status: 'as_plan',
    energy_level: 8,
    stress_level: 3,
    best_of_day: 'Family dinner was wonderful',
    top_3_priorities: ['Weekly planning', 'Family time', 'Rest'],
    top_3_tomorrow: ['Deep work on business', 'Exercise', 'Family call'],
    reflection_good: 'Good balance between work and family',
    reflection_improve: 'Skipped reading - need to make time',
  },
  {
    date: '2024-12-01',
    wake_time: '06:00',
    bed_time: '22:00',
    exercise_done: false,
    workout_duration_mins: null,
    weight_kg: 81.5,
    protein_target_hit: false,
    protein_grams: 100,
    calories: 2100,
    sleep_hours: 7,
    sleep_schedule_status: 'less_than_8',
    sleep_quality: 6,
    meditation_done: false,
    meditation_minutes: null,
    reading_done: false,
    reading_minutes: null,
    ai_skills_done: false,
    deep_work_hours: 0.5,
    tasks_completed: 2,
    tasks_planned: 4,
    nutrition_status: 'skip',
    energy_level: 5,
    stress_level: 6,
    best_of_day: 'Managed to do some work despite feeling tired',
    top_3_priorities: ['Rest', 'Light work', 'Recovery'],
    top_3_tomorrow: ['Weekly planning', 'Family time', 'Rest'],
    reflection_good: 'Listened to my body and rested',
    reflection_improve: 'Stayed up too late the night before',
  },
];

const SAMPLE_PRINCIPLES: Principle[] = [
  { id: '1', content: 'Happy, healthy, wealthy', category: 'Core', is_active: true },
  { id: '2', content: 'Sleep-Eat-Exercise', category: 'Health', is_active: true },
  { id: '3', content: '1-year and 10-year target', category: 'Vision', is_active: true },
  { id: '4', content: 'Output plan for day, week, month, quarter, year', category: 'Planning', is_active: true },
  { id: '5', content: "Leverage from other people's time, money, knowledge, and energy", category: 'Leverage', is_active: true },
  { id: '6', content: 'Focus on high leverage activities; delegate, automate, eliminate', category: 'Productivity', is_active: true },
  { id: '7', content: 'Focus, take heavy and consistent action, no complain', category: 'Mindset', is_active: true },
  { id: '8', content: 'Spend money to save time', category: 'Leverage', is_active: true },
  { id: '9', content: 'Have a system, process and template for everything I do', category: 'Systems', is_active: true },
  { id: '10', content: 'Dedicate 3 hours a day to deep work, solving the bottleneck', category: 'Productivity', is_active: true },
  { id: '11', content: 'Focus on the critical decisions that matter most', category: 'Decision Making', is_active: true },
  { id: '12', content: 'Learn to work harder on yourself than you do on your job', category: 'Growth', is_active: true },
  { id: '13', content: 'To have more, you simply have to become more', category: 'Growth', is_active: true },
  { id: '14', content: 'Make one big decision a week', category: 'Decision Making', is_active: true },
  { id: '15', content: 'Solve a bigger problem, go for bigger goals', category: 'Vision', is_active: true },
];

const SAMPLE_GOALS: Goal[] = [
  {
    id: '1',
    title: '1M THB Monthly Non-Salary Income',
    description: 'Generate 1,000,000 THB per month from trading, business, and other sources by end of 2026',
    target_value: 1000000,
    target_unit: 'THB/month',
    current_value: 87500,
    goal_type: 'yearly',
    deadline: '2026-12-31',
    category: 'wealth',
    leading_indicators: [
      { name: 'YouTube videos posted', target_per_week: 1, current_this_week: 0 },
      { name: 'Client outreach', target_per_week: 10, current_this_week: 5 },
      { name: 'Trading system reviews', target_per_week: 2, current_this_week: 1 },
      { name: 'Business development hours', target_per_week: 5, current_this_week: 3 },
    ],
    is_active: true,
  },
  {
    id: '2',
    title: 'Reach 60kg Weight',
    description: 'Lose weight from 81kg to 60kg through consistent exercise and nutrition',
    target_value: 60,
    target_unit: 'kg',
    current_value: 81,
    goal_type: 'yearly',
    deadline: '2026-12-31',
    category: 'health',
    leading_indicators: [
      { name: 'Exercise days', target_per_week: 6, current_this_week: 4 },
      { name: 'Protein target hit days', target_per_week: 6, current_this_week: 3 },
      { name: 'Calories under budget', target_per_week: 6, current_this_week: 4 },
    ],
    is_active: true,
  },
];

// Data store class for managing application state
class DataStore {
  // Daily entries
  getDailyEntries(): DailyEntry[] {
    const stored = storage.get<DailyEntry[]>(STORAGE_KEYS.DAILY_ENTRIES, []);
    if (stored.length === 0) {
      // Return sample data for demo
      this.setDailyEntries(SAMPLE_DAILY_ENTRIES);
      return SAMPLE_DAILY_ENTRIES;
    }
    return stored;
  }

  setDailyEntries(entries: DailyEntry[]): void {
    storage.set(STORAGE_KEYS.DAILY_ENTRIES, entries);
  }

  getDailyEntry(date: string): DailyEntry | null {
    const entries = this.getDailyEntries();
    return entries.find(e => e.date === date) || null;
  }

  saveDailyEntry(entry: DailyEntry): void {
    const entries = this.getDailyEntries();
    const existingIndex = entries.findIndex(e => e.date === entry.date);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = { ...entry, updated_at: new Date().toISOString() };
    } else {
      entries.push({ ...entry, created_at: new Date().toISOString() });
    }
    
    this.setDailyEntries(entries);
  }

  getTodayEntry(): DailyEntry {
    const today = getTodayDate();
    const existing = this.getDailyEntry(today);
    if (existing) return existing;
    return { ...DEFAULT_DAILY_ENTRY, date: today };
  }

  // Weekly entries
  getWeeklyEntries(): WeeklyEntry[] {
    return storage.get<WeeklyEntry[]>(STORAGE_KEYS.WEEKLY_ENTRIES, []);
  }

  setWeeklyEntries(entries: WeeklyEntry[]): void {
    storage.set(STORAGE_KEYS.WEEKLY_ENTRIES, entries);
  }

  saveWeeklyEntry(entry: WeeklyEntry): void {
    const entries = this.getWeeklyEntries();
    const existingIndex = entries.findIndex(
      e => e.week_start_date === entry.week_start_date
    );
    
    if (existingIndex >= 0) {
      entries[existingIndex] = { ...entry, updated_at: new Date().toISOString() };
    } else {
      entries.push({ ...entry, created_at: new Date().toISOString() });
    }
    
    this.setWeeklyEntries(entries);
  }

  // Monthly entries
  getMonthlyEntries(): MonthlyEntry[] {
    return storage.get<MonthlyEntry[]>(STORAGE_KEYS.MONTHLY_ENTRIES, []);
  }

  setMonthlyEntries(entries: MonthlyEntry[]): void {
    storage.set(STORAGE_KEYS.MONTHLY_ENTRIES, entries);
  }

  saveMonthlyEntry(entry: MonthlyEntry): void {
    const entries = this.getMonthlyEntries();
    const existingIndex = entries.findIndex(
      e => e.year === entry.year && e.month === entry.month
    );
    
    if (existingIndex >= 0) {
      entries[existingIndex] = { ...entry, updated_at: new Date().toISOString() };
    } else {
      entries.push({ ...entry, created_at: new Date().toISOString() });
    }
    
    this.setMonthlyEntries(entries);
  }

  // Goals
  getGoals(): Goal[] {
    const stored = storage.get<Goal[]>(STORAGE_KEYS.GOALS, []);
    if (stored.length === 0) {
      this.setGoals(SAMPLE_GOALS);
      return SAMPLE_GOALS;
    }
    return stored;
  }

  setGoals(goals: Goal[]): void {
    storage.set(STORAGE_KEYS.GOALS, goals);
  }

  saveGoal(goal: Goal): void {
    const goals = this.getGoals();
    const existingIndex = goals.findIndex(g => g.id === goal.id);
    
    if (existingIndex >= 0) {
      goals[existingIndex] = { ...goal, updated_at: new Date().toISOString() };
    } else {
      goals.push({ 
        ...goal, 
        id: goal.id || Date.now().toString(),
        created_at: new Date().toISOString() 
      });
    }
    
    this.setGoals(goals);
  }

  // User settings
  getUserSettings(): UserSettings {
    return storage.get<UserSettings>(STORAGE_KEYS.USER_SETTINGS, DEFAULT_USER_SETTINGS);
  }

  setUserSettings(settings: UserSettings): void {
    storage.set(STORAGE_KEYS.USER_SETTINGS, settings);
  }

  // Principles
  getPrinciples(): Principle[] {
    const stored = storage.get<Principle[]>(STORAGE_KEYS.PRINCIPLES, []);
    if (stored.length === 0) {
      this.setPrinciples(SAMPLE_PRINCIPLES);
      return SAMPLE_PRINCIPLES;
    }
    return stored;
  }

  setPrinciples(principles: Principle[]): void {
    storage.set(STORAGE_KEYS.PRINCIPLES, principles);
  }

  // Clear all data (for reset)
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => storage.remove(key));
  }

  // Export all data (for backup)
  exportData(): object {
    return {
      daily_entries: this.getDailyEntries(),
      weekly_entries: this.getWeeklyEntries(),
      monthly_entries: this.getMonthlyEntries(),
      goals: this.getGoals(),
      user_settings: this.getUserSettings(),
      principles: this.getPrinciples(),
      exported_at: new Date().toISOString(),
    };
  }

  // Import data (from backup)
  importData(data: {
    daily_entries?: DailyEntry[];
    weekly_entries?: WeeklyEntry[];
    monthly_entries?: MonthlyEntry[];
    goals?: Goal[];
    user_settings?: UserSettings;
    principles?: Principle[];
  }): void {
    if (data.daily_entries) this.setDailyEntries(data.daily_entries);
    if (data.weekly_entries) this.setWeeklyEntries(data.weekly_entries);
    if (data.monthly_entries) this.setMonthlyEntries(data.monthly_entries);
    if (data.goals) this.setGoals(data.goals);
    if (data.user_settings) this.setUserSettings(data.user_settings);
    if (data.principles) this.setPrinciples(data.principles);
  }
}

// Export singleton instance
export const dataStore = new DataStore();
