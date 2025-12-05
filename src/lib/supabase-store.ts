import { DailyEntry, WeeklyEntry, MonthlyEntry, Goal, UserSettings, Principle, DEFAULT_USER_SETTINGS, DEFAULT_DAILY_ENTRY } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';
import { getTodayDate } from './utils';

// Helper to get current user ID
async function getUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

// Supabase store implementation
class SupabaseStore {
  // Daily entries
  async getDailyEntries(): Promise<DailyEntry[]> {
    if (!isSupabaseConfigured()) return [];
    
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching daily entries:', error);
      return [];
    }

    return (data || []).map(this.mapDailyEntryFromDB);
  }

  async getDailyEntry(date: string): Promise<DailyEntry | null> {
    if (!isSupabaseConfigured()) return null;
    
    const userId = await getUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (error || !data) return null;
    return this.mapDailyEntryFromDB(data);
  }

  async saveDailyEntry(entry: DailyEntry): Promise<void> {
    if (!isSupabaseConfigured()) return;
    
    const userId = await getUserId();
    if (!userId) return;

    const dbEntry = this.mapDailyEntryToDB(entry, userId);

    const { error } = await supabase
      .from('daily_entries')
      .upsert(dbEntry, { onConflict: 'user_id,date' });

    if (error) {
      console.error('Error saving daily entry:', error);
      throw error;
    }
  }

  async getTodayEntry(): Promise<DailyEntry> {
    const today = getTodayDate();
    const existing = await this.getDailyEntry(today);
    if (existing) return existing;
    return { ...DEFAULT_DAILY_ENTRY, date: today };
  }

  // Weekly entries
  async getWeeklyEntries(): Promise<WeeklyEntry[]> {
    if (!isSupabaseConfigured()) return [];
    
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('weekly_entries')
      .select('*')
      .eq('user_id', userId)
      .order('week_start_date', { ascending: false });

    if (error) {
      console.error('Error fetching weekly entries:', error);
      return [];
    }

    return (data || []).map(this.mapWeeklyEntryFromDB);
  }

  async saveWeeklyEntry(entry: WeeklyEntry): Promise<void> {
    if (!isSupabaseConfigured()) return;
    
    const userId = await getUserId();
    if (!userId) return;

    const dbEntry = this.mapWeeklyEntryToDB(entry, userId);

    const { error } = await supabase
      .from('weekly_entries')
      .upsert(dbEntry, { onConflict: 'user_id,week_start_date' });

    if (error) {
      console.error('Error saving weekly entry:', error);
      throw error;
    }
  }

  // Monthly entries
  async getMonthlyEntries(): Promise<MonthlyEntry[]> {
    if (!isSupabaseConfigured()) return [];
    
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('monthly_entries')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) {
      console.error('Error fetching monthly entries:', error);
      return [];
    }

    return (data || []).map(this.mapMonthlyEntryFromDB);
  }

  async saveMonthlyEntry(entry: MonthlyEntry): Promise<void> {
    if (!isSupabaseConfigured()) return;
    
    const userId = await getUserId();
    if (!userId) return;

    const dbEntry = this.mapMonthlyEntryToDB(entry, userId);

    const { error } = await supabase
      .from('monthly_entries')
      .upsert(dbEntry, { onConflict: 'user_id,year,month' });

    if (error) {
      console.error('Error saving monthly entry:', error);
      throw error;
    }
  }

  // Goals
  async getGoals(): Promise<Goal[]> {
    if (!isSupabaseConfigured()) return [];
    
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }

    return (data || []).map(this.mapGoalFromDB);
  }

  async saveGoal(goal: Goal): Promise<void> {
    if (!isSupabaseConfigured()) return;
    
    const userId = await getUserId();
    if (!userId) return;

    const dbEntry = this.mapGoalToDB(goal, userId);

    if (goal.id) {
      const { error } = await supabase
        .from('goals')
        .update(dbEntry)
        .eq('id', goal.id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating goal:', error);
        throw error;
      }
    } else {
      const { data, error } = await supabase
        .from('goals')
        .insert(dbEntry)
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        throw error;
      }
    }
  }

  // User settings
  async getUserSettings(): Promise<UserSettings> {
    if (!isSupabaseConfigured()) return DEFAULT_USER_SETTINGS;
    
    const userId = await getUserId();
    if (!userId) return DEFAULT_USER_SETTINGS;

    const { data, error } = await supabase
      .from('profiles')
      .select('settings')
      .eq('id', userId)
      .single();

    if (error || !data) return DEFAULT_USER_SETTINGS;
    return (data.settings as UserSettings) || DEFAULT_USER_SETTINGS;
  }

  async setUserSettings(settings: UserSettings): Promise<void> {
    if (!isSupabaseConfigured()) return;
    
    const userId = await getUserId();
    if (!userId) return;

    const { error } = await supabase
      .from('profiles')
      .update({ settings })
      .eq('id', userId);

    if (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Principles
  async getPrinciples(): Promise<Principle[]> {
    if (!isSupabaseConfigured()) return [];
    
    const userId = await getUserId();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('principles')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching principles:', error);
      return [];
    }

    return (data || []).map(this.mapPrincipleFromDB);
  }

  async savePrinciple(principle: Principle): Promise<void> {
    if (!isSupabaseConfigured()) return;
    
    const userId = await getUserId();
    if (!userId) return;

    const dbEntry = this.mapPrincipleToDB(principle, userId);

    if (principle.id) {
      const { error } = await supabase
        .from('principles')
        .update(dbEntry)
        .eq('id', principle.id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating principle:', error);
        throw error;
      }
    } else {
      const { data, error } = await supabase
        .from('principles')
        .insert(dbEntry)
        .select()
        .single();

      if (error) {
        console.error('Error creating principle:', error);
        throw error;
      }
    }
  }

  async deletePrinciple(id: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    
    const userId = await getUserId();
    if (!userId) return;

    const { error } = await supabase
      .from('principles')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting principle:', error);
      throw error;
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    if (!isSupabaseConfigured()) return;
    
    const userId = await getUserId();
    if (!userId) return;

    // Delete all user data
    await Promise.all([
      supabase.from('daily_entries').delete().eq('user_id', userId),
      supabase.from('weekly_entries').delete().eq('user_id', userId),
      supabase.from('monthly_entries').delete().eq('user_id', userId),
      supabase.from('goals').delete().eq('user_id', userId),
      supabase.from('principles').delete().eq('user_id', userId),
    ]);
  }

  // Export all data
  async exportData(): Promise<object> {
    const [dailyEntries, weeklyEntries, monthlyEntries, goals, principles, settings] = await Promise.all([
      this.getDailyEntries(),
      this.getWeeklyEntries(),
      this.getMonthlyEntries(),
      this.getGoals(),
      this.getPrinciples(),
      this.getUserSettings(),
    ]);

    return {
      daily_entries: dailyEntries,
      weekly_entries: weeklyEntries,
      monthly_entries: monthlyEntries,
      goals,
      user_settings: settings,
      principles,
      exported_at: new Date().toISOString(),
    };
  }

  // Import data
  async importData(data: {
    daily_entries?: DailyEntry[];
    weekly_entries?: WeeklyEntry[];
    monthly_entries?: MonthlyEntry[];
    goals?: Goal[];
    user_settings?: UserSettings;
    principles?: Principle[];
  }): Promise<void> {
    if (data.daily_entries) {
      for (const entry of data.daily_entries) {
        await this.saveDailyEntry(entry);
      }
    }
    if (data.weekly_entries) {
      for (const entry of data.weekly_entries) {
        await this.saveWeeklyEntry(entry);
      }
    }
    if (data.monthly_entries) {
      for (const entry of data.monthly_entries) {
        await this.saveMonthlyEntry(entry);
      }
    }
    if (data.goals) {
      for (const goal of data.goals) {
        await this.saveGoal(goal);
      }
    }
    if (data.user_settings) {
      await this.setUserSettings(data.user_settings);
    }
    if (data.principles) {
      for (const principle of data.principles) {
        await this.savePrinciple(principle);
      }
    }
  }

  // Mapping functions
  private mapDailyEntryFromDB(row: any): DailyEntry {
    return {
      id: row.id,
      user_id: row.user_id,
      date: row.date,
      wake_time: row.wake_time,
      bed_time: row.bed_time,
      exercise_done: row.exercise_done || false,
      workout_duration_mins: row.workout_duration_mins,
      weight_kg: row.weight_kg ? parseFloat(row.weight_kg) : null,
      protein_target_hit: row.protein_target_hit || false,
      protein_grams: row.protein_grams,
      calories: row.calories,
      sleep_hours: row.sleep_hours ? parseFloat(row.sleep_hours) : null,
      sleep_schedule_status: row.sleep_schedule_status,
      sleep_quality: row.sleep_quality,
      meditation_done: row.meditation_done || false,
      meditation_minutes: row.meditation_minutes,
      reading_done: row.reading_done || false,
      reading_minutes: row.reading_minutes,
      ai_skills_done: row.ai_skills_done || false,
      deep_work_hours: row.deep_work_hours ? parseFloat(row.deep_work_hours) : null,
      tasks_completed: row.tasks_completed,
      tasks_planned: row.tasks_planned,
      nutrition_status: row.nutrition_status,
      energy_level: row.energy_level,
      stress_level: row.stress_level,
      best_of_day: row.best_of_day,
      top_3_priorities: (row.top_3_priorities as string[]) || [],
      top_3_tomorrow: (row.top_3_tomorrow as string[]) || [],
      reflection_good: row.reflection_good,
      reflection_improve: row.reflection_improve,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  private mapDailyEntryToDB(entry: DailyEntry, userId: string): any {
    return {
      user_id: userId,
      date: entry.date,
      wake_time: entry.wake_time,
      bed_time: entry.bed_time,
      exercise_done: entry.exercise_done,
      workout_duration_mins: entry.workout_duration_mins,
      weight_kg: entry.weight_kg,
      protein_target_hit: entry.protein_target_hit,
      protein_grams: entry.protein_grams,
      calories: entry.calories,
      sleep_hours: entry.sleep_hours,
      sleep_schedule_status: entry.sleep_schedule_status,
      sleep_quality: entry.sleep_quality,
      meditation_done: entry.meditation_done,
      meditation_minutes: entry.meditation_minutes,
      reading_done: entry.reading_done,
      reading_minutes: entry.reading_minutes,
      ai_skills_done: entry.ai_skills_done,
      deep_work_hours: entry.deep_work_hours,
      tasks_completed: entry.tasks_completed,
      tasks_planned: entry.tasks_planned,
      nutrition_status: entry.nutrition_status,
      energy_level: entry.energy_level,
      stress_level: entry.stress_level,
      best_of_day: entry.best_of_day,
      top_3_priorities: entry.top_3_priorities,
      top_3_tomorrow: entry.top_3_tomorrow,
      reflection_good: entry.reflection_good,
      reflection_improve: entry.reflection_improve,
    };
  }

  private mapWeeklyEntryFromDB(row: any): WeeklyEntry {
    return {
      id: row.id,
      user_id: row.user_id,
      week_start_date: row.week_start_date,
      year: row.year,
      week_number: row.week_number,
      loved_one_lunch: row.loved_one_lunch || false,
      family_dinner: row.family_dinner || false,
      quality_time_hours: row.quality_time_hours ? parseFloat(row.quality_time_hours) : null,
      youtube_video_posted: row.youtube_video_posted || false,
      youtube_video_count: row.youtube_video_count || 0,
      client_outreach_count: row.client_outreach_count || 0,
      product_offerings_count: row.product_offerings_count || 0,
      week_rating: row.week_rating,
      big_decision_made: row.big_decision_made,
      what_went_well: row.what_went_well,
      what_to_improve: row.what_to_improve,
      focus_next_week: row.focus_next_week,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  private mapWeeklyEntryToDB(entry: WeeklyEntry, userId: string): any {
    return {
      user_id: userId,
      week_start_date: entry.week_start_date,
      year: entry.year,
      week_number: entry.week_number,
      loved_one_lunch: entry.loved_one_lunch,
      family_dinner: entry.family_dinner,
      quality_time_hours: entry.quality_time_hours,
      youtube_video_posted: entry.youtube_video_posted,
      youtube_video_count: entry.youtube_video_count,
      client_outreach_count: entry.client_outreach_count,
      product_offerings_count: entry.product_offerings_count,
      week_rating: entry.week_rating,
      big_decision_made: entry.big_decision_made,
      what_went_well: entry.what_went_well,
      what_to_improve: entry.what_to_improve,
      focus_next_week: entry.focus_next_week,
    };
  }

  private mapMonthlyEntryFromDB(row: any): MonthlyEntry {
    return {
      id: row.id,
      user_id: row.user_id,
      year: row.year,
      month: row.month,
      salary_income: row.salary_income ? parseFloat(row.salary_income) : null,
      trading_income: row.trading_income ? parseFloat(row.trading_income) : null,
      business_income: row.business_income ? parseFloat(row.business_income) : null,
      other_income: row.other_income ? parseFloat(row.other_income) : null,
      score_physical_health: row.score_physical_health,
      score_mental_health: row.score_mental_health,
      score_career: row.score_career,
      score_business: row.score_business,
      score_wealth: row.score_wealth,
      score_relationships: row.score_relationships,
      score_productivity: row.score_productivity,
      score_self_awareness: row.score_self_awareness,
      score_life_vision: row.score_life_vision,
      score_learning: row.score_learning,
      score_fun: row.score_fun,
      score_contribution: row.score_contribution,
      month_rating: row.month_rating,
      wins: row.wins,
      lessons: row.lessons,
      focus_next_month: row.focus_next_month,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  private mapMonthlyEntryToDB(entry: MonthlyEntry, userId: string): any {
    return {
      user_id: userId,
      year: entry.year,
      month: entry.month,
      salary_income: entry.salary_income,
      trading_income: entry.trading_income,
      business_income: entry.business_income,
      other_income: entry.other_income,
      score_physical_health: entry.score_physical_health,
      score_mental_health: entry.score_mental_health,
      score_career: entry.score_career,
      score_business: entry.score_business,
      score_wealth: entry.score_wealth,
      score_relationships: entry.score_relationships,
      score_productivity: entry.score_productivity,
      score_self_awareness: entry.score_self_awareness,
      score_life_vision: entry.score_life_vision,
      score_learning: entry.score_learning,
      score_fun: entry.score_fun,
      score_contribution: entry.score_contribution,
      month_rating: entry.month_rating,
      wins: entry.wins,
      lessons: entry.lessons,
      focus_next_month: entry.focus_next_month,
    };
  }

  private mapGoalFromDB(row: any): Goal {
    return {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      description: row.description,
      target_value: parseFloat(row.target_value),
      target_unit: row.target_unit,
      current_value: parseFloat(row.current_value),
      goal_type: row.goal_type,
      deadline: row.deadline,
      category: row.category,
      leading_indicators: (row.leading_indicators as any[]) || [],
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  private mapGoalToDB(goal: Goal, userId: string): any {
    return {
      user_id: userId,
      title: goal.title,
      description: goal.description,
      target_value: goal.target_value,
      target_unit: goal.target_unit,
      current_value: goal.current_value,
      goal_type: goal.goal_type,
      deadline: goal.deadline,
      category: goal.category,
      leading_indicators: goal.leading_indicators,
      is_active: goal.is_active,
    };
  }

  private mapPrincipleFromDB(row: any): Principle {
    return {
      id: row.id,
      user_id: row.user_id,
      content: row.content,
      category: row.category,
      is_active: row.is_active,
      created_at: row.created_at,
    };
  }

  private mapPrincipleToDB(principle: Principle, userId: string): any {
    return {
      user_id: userId,
      content: principle.content,
      category: principle.category,
      is_active: principle.is_active,
    };
  }
}

export const supabaseStore = new SupabaseStore();

