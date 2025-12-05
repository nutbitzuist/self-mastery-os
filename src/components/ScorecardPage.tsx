'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar } from './ui';
import { dataStore } from '@/lib/store';
import { calculateWeeklyScorecard, calculateTrend } from '@/lib/scorecard';
import { WeeklyScorecard, SCORE_STATUS_CONFIG, DimensionScore } from '@/types';
import { formatDate } from '@/lib/utils';
import { startOfWeek, subWeeks, format } from 'date-fns';
import {
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Target,
  Lightbulb,
  Activity,
  Brain,
  Briefcase,
  Coins,
  Heart,
  Timer,
  Compass,
  Eye,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const dimensionIcons: Record<string, React.ReactNode> = {
  physical_health: <Activity className="w-5 h-5" />,
  mental_health: <Brain className="w-5 h-5" />,
  career_business: <Briefcase className="w-5 h-5" />,
  wealth: <Coins className="w-5 h-5" />,
  relationships: <Heart className="w-5 h-5" />,
  productivity: <Timer className="w-5 h-5" />,
  life_vision: <Compass className="w-5 h-5" />,
  self_awareness: <Eye className="w-5 h-5" />,
};

// Helper function to show where users can input data for each metric
function getDataInputHint(dimensionKey: string, metric: string): string | null {
  const hints: Record<string, Record<string, string>> = {
    physical_health: {
      'Exercise days': '→ Daily Log: Physical Health section',
      'Protein target hit': '→ Daily Log: Physical Health section',
      'Sleep on schedule (9pm-5am)': '→ Daily Log: Morning Routine section',
      'Energy level average': '→ Daily Log: Energy & Mood section',
    },
    mental_health: {
      'Meditation days': '→ Daily Log: Daily Habits section',
      'Reading days': '→ Daily Log: Daily Habits section',
      'Stress level average': '→ Daily Log: Energy & Mood section',
      'Sleep quality average': '→ Daily Log: Morning Routine section',
    },
    career_business: {
      'Days with 1.5+ hrs deep work': '→ Daily Log: Productivity section',
      'Task completion rate': '→ Daily Log: Productivity section',
      'AI skills practice days': '→ Daily Log: Daily Habits section',
      'Total deep work hours': '→ Daily Log: Productivity section',
    },
    wealth: {
      'YouTube video posted': '→ Weekly Review: Business & Side Projects',
      'Client outreach count': '→ Weekly Review: Business & Side Projects',
      'Business development days': '→ Daily Log: Daily Habits (AI Skills)',
      'Productive days (3+ tasks)': '→ Daily Log: Productivity section',
    },
    relationships: {
      'Lunch with loved one': '→ Weekly Review: Relationships section',
      'Family dinner': '→ Weekly Review: Relationships section',
      'Quality time hours': '→ Weekly Review: Relationships section',
    },
    productivity: {
      'Wake by 5am': '→ Daily Log: Morning Routine section',
      'Days with 3 priorities set': '→ Daily Log: Top 3 Priorities Today',
      'Task completion rate': '→ Daily Log: Productivity section',
      'Deep work consistency': '→ Daily Log: Productivity section',
    },
    life_vision: {
      'Big decision made': '→ Weekly Review: Weekly Reflection',
      'Weekly review completed': '→ Weekly Review: Weekly Reflection',
      'Focus for next week set': '→ Weekly Review: Weekly Reflection',
      'Daily reflection done': '→ Daily Log: Reflection section',
    },
    self_awareness: {
      'Daily reflection': '→ Daily Log: Reflection section',
      'Reading days': '→ Daily Log: Daily Habits section',
      'Meditation days': '→ Daily Log: Daily Habits section',
      'Improvement reflection': '→ Daily Log: Reflection section',
    },
  };

  return hints[dimensionKey]?.[metric] || null;
}

export function ScorecardPage() {
  const [scorecard, setScorecard] = useState<WeeklyScorecard | null>(null);
  const [previousScorecard, setPreviousScorecard] = useState<WeeklyScorecard | null>(null);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const dailyEntries = dataStore.getDailyEntries();
    const weeklyEntries = dataStore.getWeeklyEntries();

    // Current week
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const currentScorecard = calculateWeeklyScorecard(dailyEntries, weeklyEntries, currentWeekStart);

    // Previous week
    const previousWeekStart = subWeeks(currentWeekStart, 1);
    const prevScorecard = calculateWeeklyScorecard(dailyEntries, weeklyEntries, previousWeekStart);
    setPreviousScorecard(prevScorecard);

    // Calculate trends
    const scorecardWithTrends = calculateTrend(currentScorecard, prevScorecard);
    setScorecard(scorecardWithTrends);
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !scorecard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusConfig = SCORE_STATUS_CONFIG[scorecard.overallStatus];

  // Prepare radar chart data
  const radarData = scorecard.dimensions.map(d => ({
    dimension: d.name.split(' ')[0],
    score: d.percentage,
    fullMark: 100,
  }));

  const TrendIcon = ({ trend, value }: { trend: 'up' | 'down' | 'stable'; value: number }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getScoreBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
            <Gauge className="w-8 h-8 text-brand-400" />
            Life Dimensions Scorecard
          </h1>
          <p className="text-gray-400 mt-1">
            Week {scorecard.weekNumber} • {formatDate(scorecard.weekStartDate, 'MMM d')} - {formatDate(new Date(new Date(scorecard.weekStartDate).getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className={`${statusConfig.bg} border-2`} style={{ borderColor: statusConfig.color.replace('text-', '').replace('-400', '') }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-100">{scorecard.overallPercentage.toFixed(0)}</div>
              <div className="text-sm text-gray-400">out of 100</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${statusConfig.color} flex items-center gap-2`}>
                {statusConfig.emoji} {statusConfig.label}
              </div>
              <p className="text-gray-400 mt-1">Overall Performance</p>
              {previousScorecard && (
                <div className="flex items-center gap-2 mt-2">
                  <TrendIcon 
                    trend={scorecard.overallPercentage > previousScorecard.overallPercentage + 2 ? 'up' : 
                           scorecard.overallPercentage < previousScorecard.overallPercentage - 2 ? 'down' : 'stable'} 
                    value={scorecard.overallPercentage - previousScorecard.overallPercentage} 
                  />
                  <span className="text-sm text-gray-400">
                    {scorecard.overallPercentage > previousScorecard.overallPercentage ? '+' : ''}
                    {(scorecard.overallPercentage - previousScorecard.overallPercentage).toFixed(1)} vs last week
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="dimension" stroke="#9ca3af" fontSize={11} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#9ca3af" fontSize={10} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>

      {/* Focus Areas Alert */}
      <Card className="bg-amber-500/10 border border-amber-500/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-400 mb-1">Focus This Week</h3>
            <p className="text-gray-300">
              Your lowest scoring dimensions are <strong>{scorecard.lowestDimensions[0]}</strong> and <strong>{scorecard.lowestDimensions[1]}</strong>. 
              Prioritize these areas to raise your overall score.
            </p>
          </div>
        </div>
      </Card>

      {/* Dimensions Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100">8 Life Dimensions</h2>
        
        {scorecard.dimensions.map((dimension) => {
          const isExpanded = expandedDimension === dimension.key;
          const isLowest = scorecard.lowestDimensions.includes(dimension.name);
          
          return (
            <Card 
              key={dimension.key} 
              className={`transition-all duration-200 ${isLowest ? 'border-l-4 border-l-amber-500' : ''}`}
            >
              {/* Dimension Header */}
              <button
                onClick={() => setExpandedDimension(isExpanded ? null : dimension.key)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${dimension.color}20` }}
                  >
                    <span style={{ color: dimension.color }}>
                      {dimensionIcons[dimension.key]}
                    </span>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-100">{dimension.name}</span>
                      {isLowest && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                          Focus Area
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(dimension.percentage)}`}
                          style={{ width: `${dimension.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium" style={{ color: dimension.color }}>
                        {dimension.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Trend */}
                  <div className="flex items-center gap-1">
                    <TrendIcon trend={dimension.trend} value={dimension.trendValue} />
                    {dimension.trendValue !== 0 && (
                      <span className={`text-sm ${dimension.trend === 'up' ? 'text-green-400' : dimension.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                        {dimension.trendValue > 0 ? '+' : ''}{dimension.trendValue}
                      </span>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`text-xs px-2 py-1 rounded-full ${SCORE_STATUS_CONFIG[dimension.status].bg} ${SCORE_STATUS_CONFIG[dimension.status].color}`}>
                    {SCORE_STATUS_CONFIG[dimension.status].emoji}
                  </span>
                  
                  {/* Expand Icon */}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded Breakdown */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Score Breakdown</h4>
                  <div className="space-y-3">
                    {dimension.breakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.met ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                            {item.met ? (
                              <span className="text-green-400 text-xs">✓</span>
                            ) : (
                              <span className="text-gray-500 text-xs">○</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-gray-300">{item.metric}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({String(item.value)} / {String(item.target)})
                            </span>
                            {/* Show where to input this data */}
                            {getDataInputHint(dimension.key, item.metric) && (
                              <div className="text-xs text-gray-600 mt-0.5 italic">
                                {getDataInputHint(dimension.key, item.metric)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm flex-shrink-0">
                          <span className={item.met ? 'text-green-400' : 'text-gray-400'}>
                            {item.points}
                          </span>
                          <span className="text-gray-600">/{item.maxPoints}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Tips */}
                  {!dimension.breakdown.every(b => b.met) && (
                    <div className="mt-4 p-3 rounded-lg bg-gray-800/50">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5" />
                        <p className="text-sm text-gray-400">
                          <strong className="text-gray-300">Tip:</strong>{' '}
                          {dimension.key === 'physical_health' && 'Try setting a phone alarm for 9pm to maintain your sleep schedule.'}
                          {dimension.key === 'mental_health' && 'Start with just 5 minutes of meditation right after waking up.'}
                          {dimension.key === 'career_business' && 'Block your calendar for deep work before checking emails.'}
                          {dimension.key === 'wealth' && 'Schedule a specific time each week for client outreach.'}
                          {dimension.key === 'relationships' && 'Put family time in your calendar like an important meeting.'}
                          {dimension.key === 'productivity' && 'Prepare your top 3 priorities the night before.'}
                          {dimension.key === 'life_vision' && 'End each week with 15 minutes of reflection and planning.'}
                          {dimension.key === 'self_awareness' && 'Keep a small notebook to jot down reflections throughout the day.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* AI Insights */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Insights</h3>
        </div>
        <div className="space-y-3">
          {scorecard.insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30">
              <Info className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Score Legend */}
      <Card className="bg-gray-800/30">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Score Guide</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(SCORE_STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`text-sm ${config.bg} ${config.color} px-2 py-0.5 rounded-full`}>
                {config.emoji} {config.label}
              </span>
              <span className="text-xs text-gray-500">
                {key === 'excellent' && '90-100'}
                {key === 'good' && '80-89'}
                {key === 'okay' && '70-79'}
                {key === 'below' && '60-69'}
                {key === 'critical' && '<60'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
