'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Modal, Input, Select } from './ui';
import { dataStore } from '@/lib/store';
import { Goal, LeadingIndicator } from '@/types';
import { formatTHB, formatDate } from '@/lib/utils';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  Coins,
  Scale,
  Briefcase,
  Heart,
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  wealth: <Coins className="w-5 h-5 text-amber-400" />,
  health: <Heart className="w-5 h-5 text-red-400" />,
  career: <Briefcase className="w-5 h-5 text-blue-400" />,
  business: <TrendingUp className="w-5 h-5 text-emerald-400" />,
};

const categoryColors: Record<string, string> = {
  wealth: 'from-amber-500 to-yellow-400',
  health: 'from-red-500 to-pink-400',
  career: 'from-blue-500 to-cyan-400',
  business: 'from-emerald-500 to-teal-400',
};

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_value: '',
    target_unit: '',
    current_value: '',
    deadline: '',
    category: 'wealth',
    goal_type: 'yearly' as Goal['goal_type'],
  });

  useEffect(() => {
    const loaded = dataStore.getGoals();
    setGoals(loaded);
  }, []);

  const handleSave = () => {
    if (!formData.title || !formData.target_value) return;

    const goal: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description || null,
      target_value: Number(formData.target_value),
      target_unit: formData.target_unit,
      current_value: Number(formData.current_value) || 0,
      goal_type: formData.goal_type,
      deadline: formData.deadline,
      category: formData.category,
      leading_indicators: editingGoal?.leading_indicators || [],
      is_active: true,
    };

    const updated = editingGoal
      ? goals.map(g => g.id === editingGoal.id ? goal : g)
      : [...goals, goal];

    setGoals(updated);
    dataStore.setGoals(updated);
    
    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      target_value: '',
      target_unit: '',
      current_value: '',
      deadline: '',
      category: 'wealth',
      goal_type: 'yearly',
    });
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      target_value: goal.target_value.toString(),
      target_unit: goal.target_unit,
      current_value: goal.current_value.toString(),
      deadline: goal.deadline,
      category: goal.category,
      goal_type: goal.goal_type,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    dataStore.setGoals(updated);
  };

  const updateCurrentValue = (goalId: string, newValue: number) => {
    const updated = goals.map(g => 
      g.id === goalId ? { ...g, current_value: newValue } : g
    );
    setGoals(updated);
    dataStore.setGoals(updated);
  };

  const calculateProgress = (goal: Goal) => {
    if (goal.category === 'health' && goal.target_unit === 'kg') {
      // For weight loss, progress is inverse
      const startWeight = 81; // Starting weight
      const lost = startWeight - goal.current_value;
      const tolose = startWeight - goal.target_value;
      return Math.min((lost / tolose) * 100, 100);
    }
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  const activeGoals = goals.filter(g => g.is_active);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
            <Target className="w-8 h-8 text-brand-400" />
            Goals
          </h1>
          <p className="text-gray-400 mt-1">
            Track your progress toward life-changing goals
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Goal
        </Button>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6">
        {activeGoals.map(goal => {
          const progress = calculateProgress(goal);
          const isWeightGoal = goal.category === 'health' && goal.target_unit === 'kg';
          
          return (
            <Card key={goal.id} className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[goal.category] || 'from-gray-500 to-gray-400'} bg-opacity-20 flex items-center justify-center`}>
                    {categoryIcons[goal.category] || <Target className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id!)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3 mb-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Current</p>
                    <p className="text-2xl font-bold text-gray-100">
                      {goal.target_unit === 'THB/month' 
                        ? formatTHB(goal.current_value)
                        : `${goal.current_value} ${goal.target_unit}`
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Target</p>
                    <p className="text-lg font-semibold text-gray-300">
                      {goal.target_unit === 'THB/month' 
                        ? formatTHB(goal.target_value)
                        : `${goal.target_value} ${goal.target_unit}`
                      }
                    </p>
                  </div>
                </div>
                <ProgressBar
                  value={progress}
                  max={100}
                  color={`bg-gradient-to-r ${categoryColors[goal.category] || 'from-gray-500 to-gray-400'}`}
                  showValue={false}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{progress.toFixed(1)}% complete</span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {formatDate(goal.deadline, 'MMM d, yyyy')}
                  </span>
                </div>
              </div>

              {/* Quick Update */}
              <div className="pt-4 border-t border-gray-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">Quick update:</span>
                  <input
                    type="number"
                    value={goal.current_value}
                    onChange={(e) => updateCurrentValue(goal.id!, Number(e.target.value))}
                    className="w-32 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
                  />
                  <span className="text-sm text-gray-400">{goal.target_unit}</span>
                </div>
              </div>

              {/* Leading Indicators */}
              {goal.leading_indicators && goal.leading_indicators.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <p className="text-sm font-medium text-gray-300 mb-3">Leading Indicators This Week</p>
                  <div className="grid grid-cols-2 gap-3">
                    {goal.leading_indicators.map((indicator, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30">
                        {indicator.current_this_week >= indicator.target_per_week ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-500" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 truncate">{indicator.name}</p>
                          <p className="text-sm font-medium text-gray-200">
                            {indicator.current_this_week}/{indicator.target_per_week}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {activeGoals.length === 0 && (
        <Card className="text-center py-12">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No goals yet</h3>
          <p className="text-gray-500 mb-4">Set ambitious goals to track your progress.</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Add Your First Goal
          </Button>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingGoal ? 'Edit Goal' : 'Add New Goal'}
        className="max-w-xl"
      >
        <div className="space-y-4">
          <Input
            label="Goal Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., 1M THB Monthly Income"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your goal..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Value"
              type="number"
              value={formData.target_value}
              onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
              placeholder="1000000"
            />
            <Input
              label="Unit"
              value={formData.target_unit}
              onChange={(e) => setFormData({ ...formData, target_unit: e.target.value })}
              placeholder="THB/month, kg, etc."
            />
          </div>

          <Input
            label="Current Value"
            type="number"
            value={formData.current_value}
            onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
            placeholder="87500"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'wealth', label: '💰 Wealth' },
                { value: 'health', label: '❤️ Health' },
                { value: 'career', label: '💼 Career' },
                { value: 'business', label: '📈 Business' },
              ]}
            />
            <Select
              label="Goal Type"
              value={formData.goal_type}
              onChange={(e) => setFormData({ ...formData, goal_type: e.target.value as Goal['goal_type'] })}
              options={[
                { value: 'yearly', label: 'Yearly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'weekly', label: 'Weekly' },
              ]}
            />
          </div>

          <Input
            label="Deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingGoal ? 'Update' : 'Add'} Goal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
