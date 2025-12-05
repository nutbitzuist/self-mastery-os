'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  Toggle, 
  Slider,
} from './ui';
import { formatDate, getTodayDate, debounce } from '@/lib/utils';
import { dataStore } from '@/lib/store';
import { DailyEntry, DEFAULT_DAILY_ENTRY } from '@/types';
import {
  Save,
  ArrowLeft,
  Sun,
  Moon,
  Dumbbell,
  Scale,
  Utensils,
  Brain,
  BookOpen,
  Sparkles,
  Timer,
  ListChecks,
  Zap,
  Heart,
  Target,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';

interface DailyEntryFormProps {
  date?: string;
}

export function DailyEntryForm({ date }: DailyEntryFormProps) {
  const router = useRouter();
  const [entry, setEntry] = useState<DailyEntry>({ ...DEFAULT_DAILY_ENTRY, date: date || getTodayDate() });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    morning: true,
    physical: true,
    habits: true,
    productivity: true,
    energy: true,
    reflection: true,
  });

  useEffect(() => {
    const targetDate = date || getTodayDate();
    const existingEntry = dataStore.getDailyEntry(targetDate);
    if (existingEntry) {
      setEntry(existingEntry);
    } else {
      setEntry({ ...DEFAULT_DAILY_ENTRY, date: targetDate });
    }
  }, [date]);

  const updateEntry = <K extends keyof DailyEntry>(field: K, value: DailyEntry[K]) => {
    setEntry(prev => ({ ...prev, [field]: value }));
  };

  const updatePriority = (index: number, value: string, field: 'top_3_priorities' | 'top_3_tomorrow') => {
    setEntry(prev => {
      const newPriorities = [...prev[field]];
      newPriorities[index] = value;
      return { ...prev, [field]: newPriorities };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      dataStore.saveDailyEntry(entry);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({ 
    id, 
    icon, 
    title, 
    iconColor 
  }: { 
    id: string; 
    icon: React.ReactNode; 
    title: string; 
    iconColor: string;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-2 text-left"
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      </div>
      {expandedSections[id] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Daily Log</h1>
            <p className="text-gray-400">{formatDate(entry.date)}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : showSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save
            </>
          )}
        </Button>
      </div>

      {/* Top 3 Priorities Today */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Today's Top 3 Priorities</h3>
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map(index => (
            <Input
              key={index}
              placeholder={`Priority ${index + 1}`}
              value={entry.top_3_priorities[index] || ''}
              onChange={(e) => updatePriority(index, e.target.value, 'top_3_priorities')}
            />
          ))}
        </div>
      </Card>

      {/* Morning Routine */}
      <Card>
        <SectionHeader 
          id="morning" 
          icon={<Sun className="w-5 h-5 text-amber-400" />}
          title="Morning Routine"
          iconColor="bg-amber-500/20"
        />
        {expandedSections.morning && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Wake Time"
                type="time"
                value={entry.wake_time || ''}
                onChange={(e) => updateEntry('wake_time', e.target.value)}
              />
              <Input
                label="Bed Time (Last Night)"
                type="time"
                value={entry.bed_time || ''}
                onChange={(e) => updateEntry('bed_time', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sleep Hours"
                type="number"
                step="0.5"
                min="0"
                max="12"
                value={entry.sleep_hours || ''}
                onChange={(e) => updateEntry('sleep_hours', e.target.value ? Number(e.target.value) : null)}
              />
              <Select
                label="Sleep Schedule"
                value={entry.sleep_schedule_status || ''}
                onChange={(e) => updateEntry('sleep_schedule_status', e.target.value as DailyEntry['sleep_schedule_status'])}
                options={[
                  { value: '', label: 'Select...' },
                  { value: 'as_scheduled', label: '8hrs as scheduled (9pm-5am)' },
                  { value: 'not_scheduled', label: '8hrs but not scheduled' },
                  { value: 'less_than_8', label: 'Less than 8 hours' },
                ]}
              />
            </div>
            <Slider
              label="Sleep Quality"
              value={entry.sleep_quality || 5}
              onChange={(value) => updateEntry('sleep_quality', value)}
              min={1}
              max={10}
            />
          </div>
        )}
      </Card>

      {/* Physical Health */}
      <Card>
        <SectionHeader 
          id="physical" 
          icon={<Dumbbell className="w-5 h-5 text-orange-400" />}
          title="Physical Health"
          iconColor="bg-orange-500/20"
        />
        {expandedSections.physical && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-5 h-5 text-orange-400" />
                <span className="text-gray-200">Exercise Done</span>
              </div>
              <Toggle
                checked={entry.exercise_done}
                onChange={(checked) => updateEntry('exercise_done', checked)}
              />
            </div>
            
            {entry.exercise_done && (
              <Input
                label="Workout Duration (minutes)"
                type="number"
                min="0"
                max="180"
                value={entry.workout_duration_mins || ''}
                onChange={(e) => updateEntry('workout_duration_mins', e.target.value ? Number(e.target.value) : null)}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                min="40"
                max="150"
                value={entry.weight_kg || ''}
                onChange={(e) => updateEntry('weight_kg', e.target.value ? Number(e.target.value) : null)}
              />
              <Input
                label="Protein (grams)"
                type="number"
                min="0"
                max="300"
                value={entry.protein_grams || ''}
                onChange={(e) => updateEntry('protein_grams', e.target.value ? Number(e.target.value) : null)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <div className="flex items-center gap-3">
                <Utensils className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-200">Protein Target Hit (150g)</span>
              </div>
              <Toggle
                checked={entry.protein_target_hit}
                onChange={(checked) => updateEntry('protein_target_hit', checked)}
              />
            </div>

            <Input
              label="Calories (optional)"
              type="number"
              min="0"
              max="5000"
              value={entry.calories || ''}
              onChange={(e) => updateEntry('calories', e.target.value ? Number(e.target.value) : null)}
            />

            <Select
              label="Nutrition Status"
              value={entry.nutrition_status || ''}
              onChange={(e) => updateEntry('nutrition_status', e.target.value as DailyEntry['nutrition_status'])}
              options={[
                { value: '', label: 'Select...' },
                { value: 'as_plan', label: 'As Plan ✓' },
                { value: 'partial', label: 'Partial' },
                { value: 'skip', label: 'Skip' },
              ]}
            />
          </div>
        )}
      </Card>

      {/* Habits */}
      <Card>
        <SectionHeader 
          id="habits" 
          icon={<Check className="w-5 h-5 text-brand-400" />}
          title="Daily Habits"
          iconColor="bg-brand-500/20"
        />
        {expandedSections.habits && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-gray-200">Meditation</span>
              </div>
              <Toggle
                checked={entry.meditation_done}
                onChange={(checked) => updateEntry('meditation_done', checked)}
              />
            </div>

            {entry.meditation_done && (
              <Input
                label="Meditation Minutes"
                type="number"
                min="1"
                max="60"
                value={entry.meditation_minutes || ''}
                onChange={(e) => updateEntry('meditation_minutes', e.target.value ? Number(e.target.value) : null)}
              />
            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="text-gray-200">Reading</span>
              </div>
              <Toggle
                checked={entry.reading_done}
                onChange={(checked) => updateEntry('reading_done', checked)}
              />
            </div>

            {entry.reading_done && (
              <Input
                label="Reading Minutes"
                type="number"
                min="1"
                max="120"
                value={entry.reading_minutes || ''}
                onChange={(e) => updateEntry('reading_minutes', e.target.value ? Number(e.target.value) : null)}
              />
            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-200">AI Skills Practice</span>
              </div>
              <Toggle
                checked={entry.ai_skills_done}
                onChange={(checked) => updateEntry('ai_skills_done', checked)}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Productivity */}
      <Card>
        <SectionHeader 
          id="productivity" 
          icon={<Timer className="w-5 h-5 text-cyan-400" />}
          title="Productivity"
          iconColor="bg-cyan-500/20"
        />
        {expandedSections.productivity && (
          <div className="mt-4 space-y-4">
            <Input
              label="Deep Work Hours"
              type="number"
              step="0.5"
              min="0"
              max="8"
              value={entry.deep_work_hours || ''}
              onChange={(e) => updateEntry('deep_work_hours', e.target.value ? Number(e.target.value) : null)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tasks Planned"
                type="number"
                min="0"
                max="20"
                value={entry.tasks_planned || ''}
                onChange={(e) => updateEntry('tasks_planned', e.target.value ? Number(e.target.value) : null)}
              />
              <Input
                label="Tasks Completed"
                type="number"
                min="0"
                max="20"
                value={entry.tasks_completed || ''}
                onChange={(e) => updateEntry('tasks_completed', e.target.value ? Number(e.target.value) : null)}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Energy & Mood */}
      <Card>
        <SectionHeader 
          id="energy" 
          icon={<Zap className="w-5 h-5 text-yellow-400" />}
          title="Energy & Mood"
          iconColor="bg-yellow-500/20"
        />
        {expandedSections.energy && (
          <div className="mt-4 space-y-6">
            <Slider
              label="Energy Level"
              value={entry.energy_level || 5}
              onChange={(value) => updateEntry('energy_level', value)}
              min={1}
              max={10}
            />
            <Slider
              label="Stress Level"
              value={entry.stress_level || 5}
              onChange={(value) => updateEntry('stress_level', value)}
              min={1}
              max={10}
            />
          </div>
        )}
      </Card>

      {/* Reflection */}
      <Card>
        <SectionHeader 
          id="reflection" 
          icon={<MessageSquare className="w-5 h-5 text-indigo-400" />}
          title="Reflection"
          iconColor="bg-indigo-500/20"
        />
        {expandedSections.reflection && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Best of the Day
              </label>
              <textarea
                value={entry.best_of_day || ''}
                onChange={(e) => updateEntry('best_of_day', e.target.value)}
                placeholder="What was the highlight of your day?"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                What went well?
              </label>
              <textarea
                value={entry.reflection_good || ''}
                onChange={(e) => updateEntry('reflection_good', e.target.value)}
                placeholder="Celebrate your wins..."
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                What could be improved?
              </label>
              <textarea
                value={entry.reflection_improve || ''}
                onChange={(e) => updateEntry('reflection_improve', e.target.value)}
                placeholder="What would you do differently?"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Tomorrow's Top 3 Priorities
              </label>
              <div className="space-y-3">
                {[0, 1, 2].map(index => (
                  <Input
                    key={index}
                    placeholder={`Priority ${index + 1} for tomorrow`}
                    value={entry.top_3_tomorrow[index] || ''}
                    onChange={(e) => updatePriority(index, e.target.value, 'top_3_tomorrow')}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="secondary" onClick={() => router.push('/')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : showSuccess ? (
            <>
              <Check className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Entry
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
