'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from './ui';
import { dataStore } from '@/lib/store';
import { Principle } from '@/types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Star,
  Quote,
} from 'lucide-react';

export function PrinciplesPage() {
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrinciple, setEditingPrinciple] = useState<Principle | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [dailyPrinciple, setDailyPrinciple] = useState<Principle | null>(null);

  useEffect(() => {
    const loaded = dataStore.getPrinciples();
    setPrinciples(loaded);
    
    // Select a random principle for the day
    if (loaded.length > 0) {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const index = dayOfYear % loaded.length;
      setDailyPrinciple(loaded[index]);
    }
  }, []);

  const handleSave = () => {
    if (!newContent.trim()) return;

    const principle: Principle = {
      id: editingPrinciple?.id || Date.now().toString(),
      content: newContent.trim(),
      category: newCategory.trim() || 'General',
      is_active: true,
    };

    const updated = editingPrinciple
      ? principles.map(p => p.id === editingPrinciple.id ? principle : p)
      : [...principles, principle];

    setPrinciples(updated);
    dataStore.setPrinciples(updated);
    
    setIsModalOpen(false);
    setEditingPrinciple(null);
    setNewContent('');
    setNewCategory('');
  };

  const handleEdit = (principle: Principle) => {
    setEditingPrinciple(principle);
    setNewContent(principle.content);
    setNewCategory(principle.category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = principles.filter(p => p.id !== id);
    setPrinciples(updated);
    dataStore.setPrinciples(updated);
  };

  const categories = Array.from(new Set(principles.map(p => p.category)));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-brand-400" />
            My Principles
          </h1>
          <p className="text-gray-400 mt-1">
            The guiding values that shape your decisions
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Add Principle
        </Button>
      </div>

      {/* Daily Principle */}
      {dailyPrinciple && (
        <Card className="bg-gradient-to-r from-brand-500/10 to-emerald-500/10 border-brand-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <p className="text-sm text-brand-400 font-medium mb-2">Today's Principle</p>
              <p className="text-lg text-gray-100 font-medium leading-relaxed">
                "{dailyPrinciple.content}"
              </p>
              <p className="text-sm text-gray-500 mt-2">{dailyPrinciple.category}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Principles by Category */}
      {categories.map(category => (
        <div key={category}>
          <h2 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            {category}
          </h2>
          <div className="grid gap-3">
            {principles
              .filter(p => p.category === category)
              .map(principle => (
                <Card key={principle.id} className="group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Quote className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-200 leading-relaxed">{principle.content}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(principle)}
                        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(principle.id!)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {principles.length === 0 && (
        <Card className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No principles yet</h3>
          <p className="text-gray-500 mb-4">Add your guiding principles to stay focused on what matters.</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Add Your First Principle
          </Button>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPrinciple(null);
          setNewContent('');
          setNewCategory('');
        }}
        title={editingPrinciple ? 'Edit Principle' : 'Add New Principle'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Principle
            </label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter your principle..."
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
              rows={3}
            />
          </div>
          <Input
            label="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g., Mindset, Health, Productivity"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingPrinciple(null);
                setNewContent('');
                setNewCategory('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingPrinciple ? 'Update' : 'Add'} Principle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
