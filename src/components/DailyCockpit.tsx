'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Card, 
  StatCard, 
  Streak, 
  PriorityItem, 
  ProgressBar, 
  InsightCard,
  Button,
  DimensionBadge 
} from './ui';
import { 
  getGreeting, 
  formatDate, 
  formatTHB, 
  calculateDashboardStats,
  getMotivationalMessage 
} from '@/lib/utils';
import { dataStore } from '@/lib/store';
import { DailyEntry, DashboardStats, Goal, WeeklyEntry } from '@/types';
import { startOfWeek, format } from 'date-fns';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Scale,
  Moon,
  Zap,
  Brain,
  Target,
  Youtube,
  Users,
  ArrowRight,
  Flame,
  BookOpen,
  Dumbbell,
  Sparkles,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

// Helper to generate insights from real data
function generateInsightsFromData(stats: DashboardStats): Array<{dimension: string; reason: string; suggestion: string}> {
  const insights: Array<{dimension: string; reason: string; suggestion: string}> = [];
  
  // Only show insights if there's actual data
  if (stats.meditation_days < 5 && stats.meditation_days > 0) {
    insights.push({
      dimension: 'mental_health',
      reason: `Meditation completed only ${stats.meditation_days}/7 days this week.`,
      suggestion: 'Try a 5-min morning meditation right after waking up.',
    });
  }
  
  if (stats.avg_deep_work_hours < 1.5 && stats.avg_deep_work_hours > 0) {
    insights.push({
      dimension: 'productivity',
      reason: `Deep work averaged ${stats.avg_deep_work_hours.toFixed(1)} hrs vs your 1.5 hr target.`,
      suggestion: 'Block 5:30-7:00am for deep work before morning meetings.',
    });
  }
  
  if (stats.protein_target_hit_days < 6 && stats.protein_target_hit_days > 0) {
    insights.push({
      dimension: 'physical_health',
      reason: `Protein target hit only ${stats.protein_target_hit_days}/7 days this week.`,
      suggestion: 'Add a protein shake post-workout to close the gap.',
    });
  }
  
  // If no insights yet but have data, show encouraging message
  if (insights.length === 0 && (stats.meditation_days > 0 || stats.avg_deep_work_hours > 0 || stats.protein_target_hit_days > 0)) {
    insights.push({
      dimension: 'general',
      reason: 'Keep up the great work! Your habits are on track.',
      suggestion: 'Continue logging daily to track your progress.',
    });
  }
  
  return insights.slice(0, 3); // Max 3 insights
}

export function DailyCockpit() {
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [weeklyEntry, setWeeklyEntry] = useState<WeeklyEntry | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load data from store
    const entry = dataStore.getTodayEntry();
    const allEntries = dataStore.getDailyEntries();
    const calculatedStats = calculateDashboardStats(allEntries, 87500);
    const loadedGoals = dataStore.getGoals();
    
    // Get current week's weekly entry for real data
    const weeklyEntries = dataStore.getWeeklyEntries();
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekStartDate = format(currentWeekStart, 'yyyy-MM-dd');
    const currentWeeklyEntry = weeklyEntries.find(e => e.week_start_date === weekStartDate) || null;
    
    setTodayEntry(entry);
    setStats(calculatedStats);
    setGoals(loadedGoals);
    setWeeklyEntry(currentWeeklyEntry);
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const incomeGoal = goals.find(g => g.category === 'wealth' && g.is_active);
  const weightGoal = goals.find(g => g.category === 'health' && g.is_active);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
            {getGreeting('Nut')}
          </h1>
          <p className="text-gray-400 mt-1">{formatDate(new Date())}</p>
        </div>
        <Link href="/daily">
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Log Today
          </Button>
        </Link>
      </div>

      {/* Motivational message */}
      <Card className="bg-gradient-to-r from-brand-500/10 to-emerald-500/10 border-brand-500/20">
        <p className="text-brand-300 font-medium flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-400" />
          {getMotivationalMessage(stats)}
        </p>
      </Card>

      {/* Top 3 Priorities */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-400" />
            Today's Top 3 Priorities
          </h2>
          <Link href="/daily" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Edit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {(todayEntry?.top_3_priorities || ['', '', '']).map((priority, index) => (
            <PriorityItem
              key={index}
              text={priority || `Set priority ${index + 1}...`}
              index={index}
              completed={false}
            />
          ))}
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Exercise Streak"
          value={`${stats.exercise_streak} days`}
          icon={<Flame className="w-5 h-5 text-orange-400" />}
          color="text-orange-400"
          subtitle={stats.exercise_streak >= 7 ? '🔥 On fire!' : 'Keep it up!'}
        />
        <StatCard
          title="Avg Sleep"
          value={`${stats.avg_sleep_hours} hrs`}
          icon={<Moon className="w-5 h-5 text-indigo-400" />}
          color="text-indigo-400"
          trend={stats.avg_sleep_hours >= 7.5 ? 'up' : 'down'}
          trendValue={stats.avg_sleep_hours >= 7.5 ? 'On target' : 'Below 8hr goal'}
        />
        <StatCard
          title="Deep Work"
          value={`${stats.avg_deep_work_hours} hrs`}
          icon={<Brain className="w-5 h-5 text-purple-400" />}
          color="text-purple-400"
          subtitle={`Target: 1.5 hrs/day`}
        />
        <StatCard
          title="Current Weight"
          value={stats.current_weight ? `${stats.current_weight} kg` : '-- kg'}
          icon={<Scale className="w-5 h-5 text-cyan-400" />}
          color="text-cyan-400"
          trend={stats.weight_change_week && stats.weight_change_week < 0 ? 'up' : stats.weight_change_week && stats.weight_change_week > 0 ? 'down' : 'stable'}
          trendValue={stats.weight_change_week ? `${stats.weight_change_week > 0 ? '+' : ''}${stats.weight_change_week} kg this week` : 'No data'}
        />
      </div>

      {/* Insights from Real Data */}
      {generateInsightsFromData(stats).length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Insights: Areas to Focus On
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {generateInsightsFromData(stats).map((insight, index) => (
              <InsightCard
                key={index}
                dimension={insight.dimension}
                reason={insight.reason}
                suggestion={insight.suggestion}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Focus Areas */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* This Week's Habits */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-400" />
            This Week's Habits
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-gray-300">Exercise</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">{stats.exercise_days}/7</span>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < stats.exercise_days ? 'bg-orange-400' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-300">Meditation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">{stats.meditation_days}/7</span>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < stats.meditation_days ? 'bg-purple-400' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-gray-300">Protein Target</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">{stats.protein_target_hit_days}/7</span>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < stats.protein_target_hit_days ? 'bg-emerald-400' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-gray-300">Reading</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">{stats.reading_days}/7</span>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < stats.reading_days ? 'bg-blue-400' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-gray-300">AI Skills</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">{stats.ai_skills_days}/7</span>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < stats.ai_skills_days ? 'bg-cyan-400' : 'bg-gray-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Streaks */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Current Streaks
          </h2>
          <div className="space-y-4">
            <Streak count={stats.exercise_streak} label="Exercise streak" />
            <Streak count={stats.meditation_streak} label="Meditation streak" />
            <Streak count={stats.reading_streak} label="Reading streak" />
          </div>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-400" />
            Goal Progress: 1M THB/month by Dec 2026
          </h2>
          <Link href="/goals" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Income Goal */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Monthly Non-Salary Income</p>
                <p className="text-2xl font-bold text-amber-400">{formatTHB(stats.current_monthly_income)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Target</p>
                <p className="text-lg font-semibold text-gray-300">{formatTHB(1000000)}</p>
              </div>
            </div>
            <ProgressBar
              value={stats.income_goal_progress}
              max={100}
              color="bg-gradient-to-r from-amber-500 to-yellow-400"
              showValue={false}
            />
            <p className="text-sm text-gray-400">
              {stats.income_goal_progress.toFixed(1)}% of goal achieved
            </p>

            {/* Leading Indicators */}
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-sm font-medium text-gray-300 mb-3">Leading Indicators This Week</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30">
                  <Youtube className="w-4 h-4 text-red-400" />
                  <div>
                    <p className="text-xs text-gray-400">YouTube Videos</p>
                    <p className="text-sm font-medium text-gray-200">
                      {weeklyEntry ? `${weeklyEntry.youtube_video_count}/${incomeGoal?.leading_indicators?.find(li => li.name === 'YouTube videos posted')?.target_per_week || 1}` : '0/1'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30">
                  <Users className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">Client Outreach</p>
                    <p className="text-sm font-medium text-gray-200">
                      {weeklyEntry ? `${weeklyEntry.client_outreach_count}/${incomeGoal?.leading_indicators?.find(li => li.name === 'Client outreach')?.target_per_week || 10}` : '0/10'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weight Goal */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Weight</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.current_weight || 81} kg</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Target</p>
                <p className="text-lg font-semibold text-gray-300">60 kg</p>
              </div>
            </div>
            <ProgressBar
              value={81 - (stats.current_weight || 81)}
              max={21}
              color="bg-gradient-to-r from-cyan-500 to-teal-400"
              showValue={false}
            />
            <p className="text-sm text-gray-400">
              {((81 - (stats.current_weight || 81)) / 21 * 100).toFixed(1)}% progress ({(81 - (stats.current_weight || 81)).toFixed(1)} kg lost)
            </p>

            {/* Weight Stats */}
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-sm font-medium text-gray-300 mb-3">Weight Trends</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg bg-gray-800/30">
                  <p className="text-xs text-gray-400">This Week</p>
                  <p className={`text-sm font-medium ${stats.weight_change_week && stats.weight_change_week < 0 ? 'text-green-400' : 'text-gray-200'}`}>
                    {stats.weight_change_week ? `${stats.weight_change_week > 0 ? '+' : ''}${stats.weight_change_week} kg` : 'N/A'}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-gray-800/30">
                  <p className="text-xs text-gray-400">This Month</p>
                  <p className={`text-sm font-medium ${stats.weight_change_month && stats.weight_change_month < 0 ? 'text-green-400' : 'text-gray-200'}`}>
                    {stats.weight_change_month ? `${stats.weight_change_month > 0 ? '+' : ''}${stats.weight_change_month} kg` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/daily">
          <Card hover className="text-center py-6">
            <Calendar className="w-8 h-8 text-brand-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-200">Daily Log</p>
          </Card>
        </Link>
        <Link href="/weekly">
          <Card hover className="text-center py-6">
            <CheckCircle2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-200">Weekly Review</p>
          </Card>
        </Link>
        <Link href="/goals">
          <Card hover className="text-center py-6">
            <Target className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-200">Goals</p>
          </Card>
        </Link>
        <Link href="/principles">
          <Card hover className="text-center py-6">
            <BookOpen className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-200">Principles</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
