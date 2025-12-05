'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button } from './ui';
import { dataStore } from '@/lib/store';
import { calculateWeeklyScorecard } from '@/lib/scorecard';
import { startOfWeek } from 'date-fns';
import {
  Bot,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Target,
  Lightbulb,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface AIInsight {
  dimension: string;
  insight: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
}

interface AICoachResponse {
  weekSummary: string;
  topInsights: AIInsight[];
  patterns: string[];
  weeklyChallenge: string;
  encouragement: string;
}

export function AICoach() {
  const [insights, setInsights] = useState<AICoachResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Gather data
      const dailyEntries = dataStore.getDailyEntries();
      const weeklyEntries = dataStore.getWeeklyEntries();
      const goals = dataStore.getGoals();
      const principles = dataStore.getPrinciples();

      // Get current week's data
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const scorecard = calculateWeeklyScorecard(dailyEntries, weeklyEntries, weekStart);

      // Filter to this week's entries
      const thisWeekEntries = dailyEntries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= weekStart;
      });

      const currentWeeklyEntry = weeklyEntries.find(w => {
        const wStart = new Date(w.week_start_date);
        return wStart.getTime() === weekStart.getTime();
      });

      // Get goals data
      const incomeGoal = goals.find(g => g.category === 'wealth')?.target_value || 1000000;
      const currentIncome = goals.find(g => g.category === 'wealth')?.current_value || 87500;
      const weightGoal = goals.find(g => g.category === 'health')?.target_value || 60;
      const currentWeight = dailyEntries
        .filter(e => e.weight_kg)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.weight_kg || 81;

      // Prepare request
      const requestBody = {
        dailyEntries: thisWeekEntries.map(e => ({
          date: e.date,
          exercise_done: e.exercise_done,
          meditation_done: e.meditation_done,
          reading_done: e.reading_done,
          protein_target_hit: e.protein_target_hit,
          sleep_hours: e.sleep_hours,
          sleep_schedule_status: e.sleep_schedule_status,
          deep_work_hours: e.deep_work_hours,
          energy_level: e.energy_level,
          stress_level: e.stress_level,
          tasks_completed: e.tasks_completed,
          tasks_planned: e.tasks_planned,
        })),
        weeklyEntry: currentWeeklyEntry ? {
          loved_one_lunch: currentWeeklyEntry.loved_one_lunch,
          family_dinner: currentWeeklyEntry.family_dinner,
          youtube_video_posted: currentWeeklyEntry.youtube_video_posted,
          client_outreach_count: currentWeeklyEntry.client_outreach_count,
          week_rating: currentWeeklyEntry.week_rating,
        } : undefined,
        scorecard: {
          overallPercentage: scorecard.overallPercentage,
          dimensions: scorecard.dimensions.map(d => ({
            name: d.name,
            percentage: d.percentage,
            trend: d.trend,
          })),
          lowestDimensions: scorecard.lowestDimensions,
        },
        userGoals: {
          incomeGoal,
          currentIncome,
          weightGoal,
          currentWeight,
        },
        principles: principles.map(p => p.content),
      };

      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setInsights(data.insights);
        setIsMock(data.isMock);
      } else {
        throw new Error(data.error || 'Failed to get insights');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">AI Coach</h2>
            <p className="text-sm text-gray-400">
              {isMock ? 'Demo insights (add API key for personalized analysis)' : 'Powered by Claude'}
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={fetchInsights}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        </Card>
      )}

      {isLoading && !insights && (
        <Card className="text-center py-12">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Analyzing your data...</p>
        </Card>
      )}

      {insights && (
        <>
          {/* Week Summary */}
          <Card className="bg-gradient-to-r from-brand-500/10 to-emerald-500/10 border-brand-500/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-1">This Week's Summary</h3>
                <p className="text-gray-300">{insights.weekSummary}</p>
              </div>
            </div>
          </Card>

          {/* Top Insights */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Top Insights
            </h3>
            <div className="space-y-4">
              {insights.topInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-brand-400">{insight.dimension}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactColor(insight.impact)}`}>
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="text-gray-200 mb-3">{insight.insight}</p>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-900/50">
                    <Target className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-emerald-400 font-medium">ACTION</span>
                      <p className="text-sm text-gray-300">{insight.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Patterns */}
          {insights.patterns.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Patterns Detected
              </h3>
              <div className="space-y-3">
                {insights.patterns.map((pattern, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">{pattern}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Weekly Challenge */}
          <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-1">This Week's Challenge</h3>
                <p className="text-gray-300">{insights.weeklyChallenge}</p>
              </div>
            </div>
          </Card>

          {/* Encouragement */}
          <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-1">Keep Going!</h3>
                <p className="text-gray-300">{insights.encouragement}</p>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* API Key Notice */}
      {isMock && (
        <Card className="bg-gray-800/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400">
                <strong className="text-gray-300">Want personalized AI insights?</strong> Add your Anthropic API key to the environment variables:
              </p>
              <code className="text-xs text-brand-400 mt-2 block">
                ANTHROPIC_API_KEY=your-api-key-here
              </code>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
