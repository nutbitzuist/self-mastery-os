'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card, Button, Toggle, Input, Slider } from '@/components/ui';
import { dataStore } from '@/lib/store';
import { WeeklyEntry } from '@/types';
import { formatDate } from '@/lib/utils';
import { format, startOfWeek } from 'date-fns';
import {
  CalendarDays,
  Save,
  Check,
  Users,
  Heart,
  Youtube,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Target,
} from 'lucide-react';

export default function WeeklyReviewPage() {
  const [entry, setEntry] = useState<WeeklyEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekNumber = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

  useEffect(() => {
    const weeklyEntries = dataStore.getWeeklyEntries();
    const weekStartDate = format(weekStart, 'yyyy-MM-dd');
    const existing = weeklyEntries.find(e => e.week_start_date === weekStartDate);
    
    if (existing) {
      setEntry(existing);
    } else {
      setEntry({
        week_start_date: weekStartDate,
        year: new Date().getFullYear(),
        week_number: weekNumber,
        loved_one_lunch: false,
        family_dinner: false,
        quality_time_hours: null,
        youtube_video_posted: false,
        youtube_video_count: 0,
        client_outreach_count: 0,
        product_offerings_count: 0,
        week_rating: null,
        big_decision_made: null,
        what_went_well: null,
        what_to_improve: null,
        focus_next_week: null,
      });
    }
  }, []);

  const updateEntry = <K extends keyof WeeklyEntry>(field: K, value: WeeklyEntry[K]) => {
    if (entry) {
      setEntry({ ...entry, [field]: value });
    }
  };

  const handleSave = () => {
    if (!entry) return;
    setIsSaving(true);
    try {
      dataStore.saveWeeklyEntry(entry);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!entry) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-purple-400" />
              Weekly Review
            </h1>
            <p className="text-gray-400 mt-1">
              Week {weekNumber} • {formatDate(weekStart, 'MMM d')} - {formatDate(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {showSuccess ? <><Check className="w-5 h-5" />Saved!</> : <><Save className="w-5 h-5" />Save</>}
          </Button>
        </div>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Relationships</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-pink-400" />
                <span className="text-gray-200">Lunch with loved one</span>
              </div>
              <Toggle checked={entry.loved_one_lunch} onChange={(checked) => updateEntry('loved_one_lunch', checked)} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-gray-200">Family dinner</span>
              </div>
              <Toggle checked={entry.family_dinner} onChange={(checked) => updateEntry('family_dinner', checked)} />
            </div>
            <Input label="Quality time hours" type="number" step="0.5" min="0" value={entry.quality_time_hours || ''} onChange={(e) => updateEntry('quality_time_hours', e.target.value ? Number(e.target.value) : null)} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Business & Side Projects</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <div className="flex items-center gap-3">
                <Youtube className="w-5 h-5 text-red-400" />
                <span className="text-gray-200">YouTube video posted</span>
              </div>
              <Toggle checked={entry.youtube_video_posted} onChange={(checked) => updateEntry('youtube_video_posted', checked)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="YouTube videos" type="number" min="0" value={entry.youtube_video_count || ''} onChange={(e) => updateEntry('youtube_video_count', Number(e.target.value) || 0)} />
              <Input label="Client outreach" type="number" min="0" value={entry.client_outreach_count || ''} onChange={(e) => updateEntry('client_outreach_count', Number(e.target.value) || 0)} />
            </div>
            <Input label="Product offerings" type="number" min="0" value={entry.product_offerings_count || ''} onChange={(e) => updateEntry('product_offerings_count', Number(e.target.value) || 0)} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Weekly Reflection</h3>
          </div>
          <div className="space-y-4">
            <Slider label="Week Rating" value={entry.week_rating || 5} onChange={(value) => updateEntry('week_rating', value)} min={1} max={10} />
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> One Big Decision Made
              </label>
              <textarea value={entry.big_decision_made || ''} onChange={(e) => updateEntry('big_decision_made', e.target.value)} placeholder="What major decision did you make?" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" rows={2} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">What went well?</label>
              <textarea value={entry.what_went_well || ''} onChange={(e) => updateEntry('what_went_well', e.target.value)} placeholder="Celebrate your wins..." className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" rows={3} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">What could be improved?</label>
              <textarea value={entry.what_to_improve || ''} onChange={(e) => updateEntry('what_to_improve', e.target.value)} placeholder="Areas for growth..." className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" rows={3} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-400" /> Focus for next week
              </label>
              <textarea value={entry.focus_next_week || ''} onChange={(e) => updateEntry('focus_next_week', e.target.value)} placeholder="What will you prioritize?" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" rows={2} />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {showSuccess ? <><Check className="w-5 h-5" />Saved!</> : <><Save className="w-5 h-5" />Save Weekly Review</>}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
