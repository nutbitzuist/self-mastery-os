'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from './ui';
import { dataStore } from '@/lib/store';
import { formatDate, getTodayDate } from '@/lib/utils';
import { format, addDays, subDays, parseISO, isWeekend } from 'date-fns';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Check,
  Clock,
  Target,
  Trash2,
  GripVertical,
} from 'lucide-react';

interface TimeBlock {
  id: string;
  time: string;
  task: string;
  completed: boolean;
  category: 'routine' | 'work' | 'personal' | 'health' | 'other';
}

interface DailySchedule {
  date: string;
  timeBlocks: TimeBlock[];
  topPriorities: string[];
}

// Generate time slots every 15 minutes from 5am to 9pm (to support exact times like 5:15, 7:15, 8:40)
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 5; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 21 && minute > 0) break; // Stop at 9:00 PM
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }
  return slots;
}

// Default weekday time blocks template (exact times as specified)
const DEFAULT_WEEKDAY_BLOCKS: Record<string, Omit<TimeBlock, 'id' | 'time'>> = {
  '05:00': { task: 'Wake up', completed: false, category: 'routine' },
  '05:15': { task: 'Exercise', completed: false, category: 'health' },
  '06:00': { task: 'Shower', completed: false, category: 'routine' },
  '06:30': { task: 'Matcha', completed: false, category: 'routine' },
  '07:15': { task: 'Morning meetings', completed: false, category: 'work' },
  '08:00': { task: 'WhatsApp notes', completed: false, category: 'work' },
  '08:40': { task: 'Morning calls', completed: false, category: 'work' },
  '09:00': { task: 'Sales note', completed: false, category: 'work' },
  '09:30': { task: 'Morning calls', completed: false, category: 'work' },
  '10:00': { task: '', completed: false, category: 'work' },
  '10:30': { task: '', completed: false, category: 'work' },
  '11:00': { task: '', completed: false, category: 'work' },
  '11:30': { task: '', completed: false, category: 'work' },
  '12:00': { task: '', completed: false, category: 'work' },
  '12:30': { task: 'Lunch', completed: false, category: 'routine' },
  '13:00': { task: '', completed: false, category: 'work' },
  '13:30': { task: '', completed: false, category: 'work' },
  '14:00': { task: '', completed: false, category: 'work' },
  '14:30': { task: '', completed: false, category: 'work' },
  '15:00': { task: '', completed: false, category: 'work' },
  '15:30': { task: '', completed: false, category: 'work' },
  '16:00': { task: '', completed: false, category: 'work' },
  '16:30': { task: 'Leave from office', completed: false, category: 'work' },
  '17:00': { task: '', completed: false, category: 'work' },
  '17:15': { task: 'Self improvement', completed: false, category: 'personal' },
  '18:00': { task: 'Deep work / Side project', completed: false, category: 'personal' },
  '18:30': { task: 'Deep work / Side project', completed: false, category: 'personal' },
  '19:00': { task: 'Shower', completed: false, category: 'routine' },
  '19:30': { task: '', completed: false, category: 'routine' },
  '20:00': { task: 'Prepare for next day', completed: false, category: 'routine' },
  '20:30': { task: 'No screen time / Read', completed: false, category: 'health' },
  '21:00': { task: 'Meditation & Sleep', completed: false, category: 'health' },
};

// Default weekend time blocks template (exact times as specified)
const DEFAULT_WEEKEND_BLOCKS: Record<string, Omit<TimeBlock, 'id' | 'time'>> = {
  '05:00': { task: 'Wake up', completed: false, category: 'routine' },
  '05:15': { task: 'Exercise', completed: false, category: 'health' },
  '06:00': { task: 'Shower', completed: false, category: 'routine' },
  '06:30': { task: 'Matcha', completed: false, category: 'routine' },
  '07:00': { task: '', completed: false, category: 'personal' },
  '07:30': { task: '', completed: false, category: 'personal' },
  '08:00': { task: '', completed: false, category: 'personal' },
  '08:30': { task: '', completed: false, category: 'personal' },
  '09:00': { task: '', completed: false, category: 'personal' },
  '09:30': { task: '', completed: false, category: 'personal' },
  '10:00': { task: '', completed: false, category: 'personal' },
  '10:30': { task: '', completed: false, category: 'personal' },
  '11:00': { task: '', completed: false, category: 'personal' },
  '11:30': { task: 'Lunch', completed: false, category: 'routine' },
  '12:00': { task: '', completed: false, category: 'personal' },
  '12:30': { task: '', completed: false, category: 'personal' },
  '13:00': { task: '', completed: false, category: 'personal' },
  '13:30': { task: '', completed: false, category: 'personal' },
  '14:00': { task: '', completed: false, category: 'personal' },
  '14:30': { task: '', completed: false, category: 'personal' },
  '15:00': { task: '', completed: false, category: 'personal' },
  '15:30': { task: 'Dinner', completed: false, category: 'routine' },
  '16:00': { task: '', completed: false, category: 'personal' },
  '16:30': { task: '', completed: false, category: 'personal' },
  '17:00': { task: '', completed: false, category: 'personal' },
  '17:30': { task: '', completed: false, category: 'personal' },
  '18:00': { task: '', completed: false, category: 'personal' },
  '18:30': { task: '', completed: false, category: 'personal' },
  '19:00': { task: 'Shower', completed: false, category: 'routine' },
  '19:30': { task: '', completed: false, category: 'routine' },
  '20:00': { task: 'Prepare for next day', completed: false, category: 'routine' },
  '20:30': { task: 'No screen time / Read', completed: false, category: 'health' },
  '21:00': { task: 'Meditation & Sleep', completed: false, category: 'health' },
};

// Helper to create time blocks from template (only for times specified in template)
function createTimeBlocksFromTemplate(
  date: string,
  template: Record<string, Omit<TimeBlock, 'id' | 'time'>>
): TimeBlock[] {
  return Object.entries(template)
    .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
    .map(([time, block], index) => ({
      id: `${date}-${index}`,
      time,
      ...block,
    }));
}

const CATEGORY_COLORS: Record<string, string> = {
  routine: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
  work: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  personal: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
  health: 'bg-green-500/20 border-green-500/30 text-green-400',
  other: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
};

const STORAGE_KEY = 'selfmastery_daily_schedules';

export function DailyPlanner() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [schedule, setSchedule] = useState<DailySchedule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load schedule for selected date
  useEffect(() => {
    loadSchedule(selectedDate);
  }, [selectedDate]);

  const loadSchedule = (date: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const schedules: Record<string, DailySchedule> = stored ? JSON.parse(stored) : {};
    
    if (schedules[date]) {
      // Use existing schedule, ensuring IDs are set and sorted by time
      const existingBlocks = schedules[date].timeBlocks.map((block, index) => ({
        ...block,
        id: block.id || `${date}-${index}`,
      }));
      
      setSchedule({
        ...schedules[date],
        timeBlocks: existingBlocks.sort((a, b) => a.time.localeCompare(b.time)),
      });
    } else {
      // Create new schedule from template based on weekday/weekend
      const dateObj = parseISO(date);
      const isWeekendDay = isWeekend(dateObj);
      const template = isWeekendDay ? DEFAULT_WEEKEND_BLOCKS : DEFAULT_WEEKDAY_BLOCKS;
      
      const newSchedule: DailySchedule = {
        date,
        timeBlocks: createTimeBlocksFromTemplate(date, template),
        topPriorities: ['', '', ''],
      };
      setSchedule(newSchedule);
    }
  };

  const saveSchedule = () => {
    if (!schedule) return;
    
    setIsSaving(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    const schedules: Record<string, DailySchedule> = stored ? JSON.parse(stored) : {};
    schedules[selectedDate] = schedule;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    
    // Also update the daily entry top priorities
    const entry = dataStore.getDailyEntry(selectedDate) || { date: selectedDate };
    dataStore.saveDailyEntry({
      ...entry,
      date: selectedDate,
      top_3_priorities: schedule.topPriorities,
      wake_time: null,
      bed_time: null,
      exercise_done: false,
      workout_duration_mins: null,
      weight_kg: null,
      protein_target_hit: false,
      protein_grams: null,
      calories: null,
      sleep_hours: null,
      sleep_schedule_status: null,
      sleep_quality: null,
      meditation_done: false,
      meditation_minutes: null,
      reading_done: false,
      reading_minutes: null,
      ai_skills_done: false,
      deep_work_hours: null,
      tasks_completed: schedule.timeBlocks.filter(b => b.completed).length,
      tasks_planned: schedule.timeBlocks.filter(b => b.task.trim()).length,
      nutrition_status: null,
      energy_level: null,
      stress_level: null,
      best_of_day: null,
      top_3_tomorrow: ['', '', ''],
      reflection_good: null,
      reflection_improve: null,
    });
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsSaving(false);
    }, 2000);
  };

  const updateTimeBlock = (id: string, updates: Partial<TimeBlock>) => {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      timeBlocks: schedule.timeBlocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      ),
    });
  };

  const toggleBlockComplete = (id: string) => {
    if (!schedule) return;
    const block = schedule.timeBlocks.find(b => b.id === id);
    if (block) {
      updateTimeBlock(id, { completed: !block.completed });
    }
  };

  const updatePriority = (index: number, value: string) => {
    if (!schedule) return;
    const newPriorities = [...schedule.topPriorities];
    newPriorities[index] = value;
    setSchedule({ ...schedule, topPriorities: newPriorities });
  };

  const addTimeBlock = () => {
    if (!schedule) return;
    const newBlock: TimeBlock = {
      id: `${selectedDate}-custom-${Date.now()}`,
      time: '12:00',
      task: '',
      completed: false,
      category: 'other',
    };
    setSchedule({
      ...schedule,
      timeBlocks: [...schedule.timeBlocks, newBlock].sort((a, b) => a.time.localeCompare(b.time)),
    });
  };

  const deleteTimeBlock = (id: string) => {
    if (!schedule) return;
    setSchedule({
      ...schedule,
      timeBlocks: schedule.timeBlocks.filter(b => b.id !== id),
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const current = parseISO(selectedDate);
    const newDate = direction === 'prev' ? subDays(current, 1) : addDays(current, 1);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  const goToToday = () => {
    setSelectedDate(getTodayDate());
  };

  const isToday = selectedDate === getTodayDate();
  const completedBlocks = schedule?.timeBlocks.filter(b => b.completed).length || 0;
  const totalBlocks = schedule?.timeBlocks.filter(b => b.task.trim()).length || 0;

  if (!schedule) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-brand-400" />
            Daily Planner
          </h1>
          <p className="text-gray-400 mt-1">Plan your day from 5am to 9pm</p>
        </div>
        <Button onClick={saveSchedule} disabled={isSaving}>
          {showSuccess ? (
            <><Check className="w-5 h-5" /> Saved!</>
          ) : (
            <><Save className="w-5 h-5" /> Save</>
          )}
        </Button>
      </div>

      {/* Date Navigation */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="text-center min-w-[200px]">
            <p className="text-lg font-semibold text-gray-100">
              {formatDate(selectedDate, 'EEEE')}
            </p>
            <p className="text-sm text-gray-400">
              {formatDate(selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          {!isToday && (
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Go to Today
            </Button>
          )}
          <div className="text-sm text-gray-400">
            <span className="text-brand-400 font-semibold">{completedBlocks}</span>
            /{totalBlocks} tasks done
          </div>
        </div>
      </Card>

      {/* Top 3 Priorities */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100">Top 3 Priorities</h3>
        </div>
        <div className="space-y-3">
          {schedule.topPriorities.map((priority, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-sm font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <Input
                placeholder={`Priority ${index + 1}`}
                value={priority}
                onChange={(e) => updatePriority(index, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Time Blocks */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Clock className="w-6 h-6 text-cyan-200" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Schedule</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500">
              {isWeekend(parseISO(selectedDate)) ? 'Weekend Schedule' : 'Weekday Schedule'}
            </div>
            <Button variant="ghost" size="sm" onClick={addTimeBlock}>
              <Plus className="w-4 h-4" /> Add Time Block
            </Button>
          </div>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => (
            <span key={cat} className={`text-xs px-2 py-1 rounded-full border ${colors}`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </span>
          ))}
        </div>

        {/* Time Block List */}
        <div className="space-y-1.5">
          {schedule.timeBlocks.map((block) => (
            <div
              key={block.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                block.completed
                  ? 'bg-brand-500/10 border-brand-500/30'
                  : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'
              }`}
            >
              {/* Time - Editable */}
              <div className="w-36 flex-shrink-0">
                <input
                  type="time"
                  value={block.time}
                  onChange={(e) => updateTimeBlock(block.id, { time: e.target.value })}
                  step="60"
                  className="w-full px-4 py-2 bg-gray-800/70 border-2 border-gray-600 rounded-xl text-gray-100 text-base font-mono font-bold focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:bg-gray-800"
                  style={{ minWidth: '144px' }}
                />
              </div>

              {/* Checkbox */}
              <button
                onClick={() => toggleBlockComplete(block.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  block.completed
                    ? 'bg-brand-500 border-brand-500'
                    : 'border-gray-600 hover:border-brand-400'
                }`}
              >
                {block.completed && <Check className="w-4 h-4 text-white" />}
              </button>

              {/* Task */}
              <input
                type="text"
                value={block.task}
                onChange={(e) => updateTimeBlock(block.id, { task: e.target.value })}
                placeholder="What are you doing?"
                className={`flex-1 min-w-0 px-3 py-1.5 bg-transparent border-0 text-gray-200 placeholder-gray-500 focus:outline-none ${
                  block.completed ? 'line-through text-gray-400' : ''
                }`}
              />

              {/* Category */}
              <select
                value={block.category}
                onChange={(e) => updateTimeBlock(block.id, { category: e.target.value as TimeBlock['category'] })}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex-shrink-0 ${CATEGORY_COLORS[block.category]} bg-transparent cursor-pointer`}
              >
                <option value="routine">Routine</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>

              {/* Delete */}
              <button
                onClick={() => deleteTimeBlock(block.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                title="Delete time block"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-brand-400">{completedBlocks}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-amber-400">{totalBlocks - completedBlocks}</p>
          <p className="text-xs text-gray-400">Remaining</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-cyan-400">
            {totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-400">Progress</p>
        </Card>
      </div>
    </div>
  );
}
