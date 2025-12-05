'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card } from '@/components/ui';
import { dataStore } from '@/lib/store';
import { DailyEntry, LIFE_DIMENSIONS } from '@/types';
import { calculateDashboardStats } from '@/lib/utils';
import { calculateWeeklyScorecard } from '@/lib/scorecard';
import { startOfWeek } from 'date-fns';
import { BarChart3, TrendingUp, Activity, Moon, Brain, Scale, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

export default function AnalyticsPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = dataStore.getDailyEntries();
    setEntries(loaded.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <MainLayout><div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div></MainLayout>;
  }

  // Prepare chart data - last 14 days
  const last14Days = [...Array(14)].map((_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = entries.find(e => e.date === dateStr);
    return {
      date: format(date, 'MMM d'),
      sleep: entry?.sleep_hours || 0,
      deepWork: entry?.deep_work_hours || 0,
      energy: entry?.energy_level || 0,
      stress: entry?.stress_level || 0,
      weight: entry?.weight_kg || null,
    };
  });

  // Habit completion data for bar chart (last 30 days or all if less)
  const recentEntries = entries.length > 0 
    ? entries.slice(-30) 
    : entries;
  const habitData = [
    { name: 'Exercise', completed: recentEntries.filter(e => e.exercise_done).length, total: recentEntries.length, color: '#f97316' },
    { name: 'Meditation', completed: recentEntries.filter(e => e.meditation_done).length, total: recentEntries.length, color: '#8b5cf6' },
    { name: 'Reading', completed: recentEntries.filter(e => e.reading_done).length, total: recentEntries.length, color: '#3b82f6' },
    { name: 'AI Skills', completed: recentEntries.filter(e => e.ai_skills_done).length, total: recentEntries.length, color: '#06b6d4' },
    { name: 'Protein', completed: recentEntries.filter(e => e.protein_target_hit).length, total: recentEntries.length, color: '#22c55e' },
  ].map(h => ({ ...h, rate: recentEntries.length > 0 ? Math.round((h.completed / h.total) * 100) : 0 }));

  // Life dimensions radar data - use real scorecard data
  const weeklyEntries = dataStore.getWeeklyEntries();
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const scorecard = calculateWeeklyScorecard(entries, weeklyEntries, currentWeekStart);
  
  // Convert scorecard percentages (0-100) to 0-10 scale for radar chart
  const dimensionScores = scorecard.dimensions.map(dim => ({
    dimension: dim.name.split(' ')[0],
    score: Math.round((dim.percentage / 100) * 10 * 10) / 10, // Convert to 0-10 scale with 1 decimal
    fullMark: 10,
  }));

  const stats = calculateDashboardStats(entries, 87500);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-brand-400" />
            Analytics
          </h1>
          <p className="text-gray-400 mt-1">Track your progress and identify patterns</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <Moon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-100">{stats.avg_sleep_hours}h</p>
            <p className="text-sm text-gray-400">Avg Sleep</p>
          </Card>
          <Card className="text-center">
            <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-100">{stats.avg_deep_work_hours}h</p>
            <p className="text-sm text-gray-400">Avg Deep Work</p>
          </Card>
          <Card className="text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-100">{stats.avg_energy_level}/10</p>
            <p className="text-sm text-gray-400">Avg Energy</p>
          </Card>
          <Card className="text-center">
            <Scale className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-100">{stats.current_weight || '--'}kg</p>
            <p className="text-sm text-gray-400">Current Weight</p>
          </Card>
        </div>

        {/* Sleep & Deep Work Chart */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-400" />
            Sleep & Deep Work (Last 14 Days)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last14Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#f3f4f6' }} />
                <Line type="monotone" dataKey="sleep" stroke="#818cf8" strokeWidth={2} dot={{ fill: '#818cf8' }} name="Sleep (hrs)" />
                <Line type="monotone" dataKey="deepWork" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} name="Deep Work (hrs)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Habit Completion Rates */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Habit Completion Rate</h2>
            {recentEntries.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  No data yet. Start logging your daily entries to see your habit completion rates.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-2">
                  Based on {recentEntries.length} {recentEntries.length === 1 ? 'entry' : 'entries'} 
                  {recentEntries.length > 30 ? ' (last 30 days)' : ''}
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={habitData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={80} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} 
                        formatter={(value: number, name: string, props: any) => [
                          `${value}% (${props.payload.completed}/${props.payload.total})`, 
                          'Completion Rate'
                        ]} 
                      />
                      <Bar dataKey="rate" fill="#22c55e" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </Card>

          {/* Energy vs Stress */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Energy vs Stress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last14Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis domain={[0, 10]} stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="energy" stroke="#fbbf24" strokeWidth={2} name="Energy" />
                  <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Life Dimensions Radar */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            Life Dimensions Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dimensionScores}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="dimension" stroke="#9ca3af" fontSize={12} />
                <PolarRadiusAxis domain={[0, 10]} stroke="#9ca3af" fontSize={10} />
                <Radar name="Score" dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            {entries.length > 0 
              ? 'Based on your current week\'s scorecard (0-10 scale)' 
              : 'Start logging daily entries to see your dimension scores'}
          </p>
        </Card>

        {/* Insights */}
        <Card className="bg-gradient-to-r from-brand-500/10 to-emerald-500/10 border-brand-500/20">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">📊 Key Insights</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Your average sleep of {stats.avg_sleep_hours}h is {stats.avg_sleep_hours >= 7.5 ? 'meeting' : 'below'} your 8-hour target</li>
            <li>• Exercise streak: {stats.exercise_streak} days - {stats.exercise_streak >= 7 ? 'Excellent consistency!' : 'Keep building the habit!'}</li>
            <li>• Deep work average: {stats.avg_deep_work_hours}h/day - {stats.avg_deep_work_hours >= 1.5 ? 'On target!' : 'Try to increase focus time'}</li>
            <li>• Meditation done {stats.meditation_days}/7 days this week - {stats.meditation_days >= 5 ? 'Great consistency!' : 'Aim for daily practice'}</li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
}
