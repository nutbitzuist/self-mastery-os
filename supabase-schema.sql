-- Self Mastery OS - Supabase Database Schema
-- Run this in your Supabase SQL Editor when ready to go multi-user

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  settings JSONB DEFAULT '{
    "sleep_target_hours": 8,
    "sleep_target_bedtime": "21:00",
    "sleep_target_waketime": "05:00",
    "deep_work_target_hours": 1.5,
    "protein_target_grams": 150,
    "weight_goal_kg": 60,
    "weight_goal_deadline": "2026-12-31",
    "income_goal_thb": 1000000,
    "income_goal_deadline": "2026-12-31",
    "week_start_day": "monday"
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily entries table
CREATE TABLE public.daily_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  -- Morning Routine
  wake_time TIME,
  bed_time TIME,
  exercise_done BOOLEAN DEFAULT FALSE,
  workout_duration_mins INTEGER,
  
  -- Physical
  weight_kg DECIMAL(5,2),
  protein_target_hit BOOLEAN DEFAULT FALSE,
  protein_grams INTEGER,
  calories INTEGER,
  
  -- Sleep
  sleep_hours DECIMAL(3,1),
  sleep_schedule_status TEXT CHECK (sleep_schedule_status IN ('as_scheduled', 'not_scheduled', 'less_than_8')),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  
  -- Habits
  meditation_done BOOLEAN DEFAULT FALSE,
  meditation_minutes INTEGER,
  reading_done BOOLEAN DEFAULT FALSE,
  reading_minutes INTEGER,
  ai_skills_done BOOLEAN DEFAULT FALSE,
  
  -- Productivity
  deep_work_hours DECIMAL(3,1),
  tasks_completed INTEGER,
  tasks_planned INTEGER,
  
  -- Nutrition
  nutrition_status TEXT CHECK (nutrition_status IN ('as_plan', 'skip', 'partial')),
  
  -- Energy & Mood
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  
  -- Reflections
  best_of_day TEXT,
  top_3_priorities JSONB DEFAULT '[]'::jsonb,
  top_3_tomorrow JSONB DEFAULT '[]'::jsonb,
  reflection_good TEXT,
  reflection_improve TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- Weekly entries table
CREATE TABLE public.weekly_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  year INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  
  -- Relationships
  loved_one_lunch BOOLEAN DEFAULT FALSE,
  family_dinner BOOLEAN DEFAULT FALSE,
  quality_time_hours DECIMAL(4,1),
  
  -- Business/Side Projects
  youtube_video_posted BOOLEAN DEFAULT FALSE,
  youtube_video_count INTEGER DEFAULT 0,
  client_outreach_count INTEGER DEFAULT 0,
  product_offerings_count INTEGER DEFAULT 0,
  
  -- Review
  week_rating INTEGER CHECK (week_rating >= 1 AND week_rating <= 10),
  big_decision_made TEXT,
  what_went_well TEXT,
  what_to_improve TEXT,
  focus_next_week TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, week_start_date)
);

-- Monthly entries table
CREATE TABLE public.monthly_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  
  -- Income Streams
  salary_income DECIMAL(12,2),
  trading_income DECIMAL(12,2),
  business_income DECIMAL(12,2),
  other_income DECIMAL(12,2),
  
  -- Life Dimensions Scores (1-10 each)
  score_physical_health INTEGER CHECK (score_physical_health >= 1 AND score_physical_health <= 10),
  score_mental_health INTEGER CHECK (score_mental_health >= 1 AND score_mental_health <= 10),
  score_career INTEGER CHECK (score_career >= 1 AND score_career <= 10),
  score_business INTEGER CHECK (score_business >= 1 AND score_business <= 10),
  score_wealth INTEGER CHECK (score_wealth >= 1 AND score_wealth <= 10),
  score_relationships INTEGER CHECK (score_relationships >= 1 AND score_relationships <= 10),
  score_productivity INTEGER CHECK (score_productivity >= 1 AND score_productivity <= 10),
  score_self_awareness INTEGER CHECK (score_self_awareness >= 1 AND score_self_awareness <= 10),
  score_life_vision INTEGER CHECK (score_life_vision >= 1 AND score_life_vision <= 10),
  score_learning INTEGER CHECK (score_learning >= 1 AND score_learning <= 10),
  score_fun INTEGER CHECK (score_fun >= 1 AND score_fun <= 10),
  score_contribution INTEGER CHECK (score_contribution >= 1 AND score_contribution <= 10),
  
  -- Review
  month_rating INTEGER CHECK (month_rating >= 1 AND month_rating <= 10),
  wins TEXT,
  lessons TEXT,
  focus_next_month TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, year, month)
);

-- Goals table
CREATE TABLE public.goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(15,2) NOT NULL,
  target_unit TEXT NOT NULL,
  current_value DECIMAL(15,2) DEFAULT 0,
  goal_type TEXT CHECK (goal_type IN ('yearly', 'quarterly', 'monthly', 'weekly')) NOT NULL,
  deadline DATE NOT NULL,
  category TEXT NOT NULL,
  leading_indicators JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Principles table
CREATE TABLE public.principles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Insights table (for storing generated insights)
CREATE TABLE public.ai_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT CHECK (insight_type IN ('daily', 'weekly', 'monthly')) NOT NULL,
  insight_date DATE NOT NULL,
  content TEXT NOT NULL,
  dimensions_to_improve JSONB DEFAULT '[]'::jsonb,
  patterns_detected JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_daily_entries_user_date ON public.daily_entries(user_id, date DESC);
CREATE INDEX idx_weekly_entries_user_week ON public.weekly_entries(user_id, week_start_date DESC);
CREATE INDEX idx_monthly_entries_user_month ON public.monthly_entries(user_id, year DESC, month DESC);
CREATE INDEX idx_goals_user_active ON public.goals(user_id, is_active);
CREATE INDEX idx_principles_user ON public.principles(user_id);
CREATE INDEX idx_ai_insights_user_date ON public.ai_insights(user_id, insight_date DESC);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own daily entries" ON public.daily_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily entries" ON public.daily_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily entries" ON public.daily_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own daily entries" ON public.daily_entries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own weekly entries" ON public.weekly_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly entries" ON public.weekly_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weekly entries" ON public.weekly_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weekly entries" ON public.weekly_entries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own monthly entries" ON public.monthly_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own monthly entries" ON public.monthly_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own monthly entries" ON public.monthly_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own monthly entries" ON public.monthly_entries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own principles" ON public.principles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own principles" ON public.principles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own principles" ON public.principles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own principles" ON public.principles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own insights" ON public.ai_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insights" ON public.ai_insights FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_entries_updated_at BEFORE UPDATE ON public.daily_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_weekly_entries_updated_at BEFORE UPDATE ON public.weekly_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_monthly_entries_updated_at BEFORE UPDATE ON public.monthly_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
