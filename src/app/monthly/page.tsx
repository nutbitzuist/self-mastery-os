'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card, Button, Input, Slider } from '@/components/ui';
import { dataStore } from '@/lib/store';
import { MonthlyEntry, LIFE_DIMENSIONS } from '@/types';
import { formatTHB } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarRange, Save, Check, Coins, Target, TrendingUp, MessageSquare } from 'lucide-react';

export default function MonthlyReviewPage() {
  const [entry, setEntry] = useState<MonthlyEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const monthlyEntries = dataStore.getMonthlyEntries();
    const existing = monthlyEntries.find(e => e.year === currentYear && e.month === currentMonth);
    
    if (existing) {
      setEntry(existing);
    } else {
      setEntry({
        year: currentYear,
        month: currentMonth,
        salary_income: null,
        trading_income: null,
        business_income: null,
        other_income: null,
        score_physical_health: 5,
        score_mental_health: 5,
        score_career: 5,
        score_business: 5,
        score_wealth: 5,
        score_relationships: 5,
        score_productivity: 5,
        score_self_awareness: 5,
        score_life_vision: 5,
        score_learning: 5,
        score_fun: 5,
        score_contribution: 5,
        month_rating: 5,
        wins: null,
        lessons: null,
        focus_next_month: null,
      });
    }
  }, []);

  const updateEntry = <K extends keyof MonthlyEntry>(field: K, value: MonthlyEntry[K]) => {
    if (entry) setEntry({ ...entry, [field]: value });
  };

  const handleSave = () => {
    if (!entry) return;
    setIsSaving(true);
    try {
      dataStore.saveMonthlyEntry(entry);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const totalIncome = entry ? (entry.salary_income || 0) + (entry.trading_income || 0) + (entry.business_income || 0) + (entry.other_income || 0) : 0;
  const nonSalaryIncome = entry ? (entry.trading_income || 0) + (entry.business_income || 0) + (entry.other_income || 0) : 0;

  if (!entry) {
    return <MainLayout><div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
              <CalendarRange className="w-8 h-8 text-cyan-400" />
              Monthly Review
            </h1>
            <p className="text-gray-400 mt-1">{format(new Date(currentYear, currentMonth - 1), 'MMMM yyyy')}</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {showSuccess ? <><Check className="w-5 h-5" />Saved!</> : <><Save className="w-5 h-5" />Save</>}
          </Button>
        </div>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Income This Month</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Salary Income (THB)" type="number" value={entry.salary_income || ''} onChange={(e) => updateEntry('salary_income', e.target.value ? Number(e.target.value) : null)} />
            <Input label="Trading Income (THB)" type="number" value={entry.trading_income || ''} onChange={(e) => updateEntry('trading_income', e.target.value ? Number(e.target.value) : null)} />
            <Input label="Business Income (THB)" type="number" value={entry.business_income || ''} onChange={(e) => updateEntry('business_income', e.target.value ? Number(e.target.value) : null)} />
            <Input label="Other Income (THB)" type="number" value={entry.other_income || ''} onChange={(e) => updateEntry('other_income', e.target.value ? Number(e.target.value) : null)} />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
            <div className="p-3 rounded-lg bg-gray-800/30">
              <p className="text-sm text-gray-400">Total Income</p>
              <p className="text-xl font-bold text-gray-100">{formatTHB(totalIncome)}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-400">Non-Salary Income</p>
              <p className="text-xl font-bold text-amber-400">{formatTHB(nonSalaryIncome)}</p>
              <p className="text-xs text-gray-500 mt-1">{((nonSalaryIncome / 1000000) * 100).toFixed(1)}% of 1M goal</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Life Dimensions Score (1-10)</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {LIFE_DIMENSIONS.map((dim) => {
              const fieldName = `score_${dim.key}` as keyof MonthlyEntry;
              return (
                <Slider
                  key={dim.key}
                  label={dim.name}
                  value={(entry[fieldName] as number) || 5}
                  onChange={(value) => updateEntry(fieldName, value)}
                  min={1}
                  max={10}
                />
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Monthly Reflection</h3>
          </div>
          <div className="space-y-4">
            <Slider label="Month Rating" value={entry.month_rating || 5} onChange={(value) => updateEntry('month_rating', value)} min={1} max={10} />
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Wins This Month</label>
              <textarea value={entry.wins || ''} onChange={(e) => updateEntry('wins', e.target.value)} placeholder="What did you accomplish?" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Lessons Learned</label>
              <textarea value={entry.lessons || ''} onChange={(e) => updateEntry('lessons', e.target.value)} placeholder="What did you learn?" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Focus for Next Month</label>
              <textarea value={entry.focus_next_month || ''} onChange={(e) => updateEntry('focus_next_month', e.target.value)} placeholder="What will you prioritize?" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" rows={2} />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {showSuccess ? <><Check className="w-5 h-5" />Saved!</> : <><Save className="w-5 h-5" />Save Monthly Review</>}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
