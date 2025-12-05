'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card, Button, Input, Select } from '@/components/ui';
import { dataStore } from '@/lib/store';
import { supabaseStore } from '@/lib/supabase-store';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { UserSettings, DEFAULT_USER_SETTINGS } from '@/types';
import { Settings, Save, Check, Download, Upload, Trash2, User, Target, Moon, Scale, Mail } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const useSupabase = isSupabaseConfigured();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        if (useSupabase && user) {
          const loaded = await supabaseStore.getUserSettings();
          setSettings(loaded);
        } else {
          const loaded = dataStore.getUserSettings();
          setSettings(loaded);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // Fallback to localStorage
        const loaded = dataStore.getUserSettings();
        setSettings(loaded);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [useSupabase, user]);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (useSupabase && user) {
        await supabaseStore.setUserSettings(settings);
      } else {
        dataStore.setUserSettings(settings);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings. Please try again.';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const data = dataStore.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `self-mastery-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [importError, setImportError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        dataStore.importData(data);
        setShowSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        setImportError('Error importing data. Please check the file format.');
        setTimeout(() => setImportError(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (showResetConfirm) {
      dataStore.clearAllData();
      setShowSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand-400" />
            Settings
          </h1>
          <p className="text-gray-400 mt-1">Configure your targets and preferences</p>
          {useSupabase && (
            <p className="text-xs text-green-400 mt-1">✓ Multi-user mode enabled (Supabase)</p>
          )}
          {!useSupabase && (
            <p className="text-xs text-amber-400 mt-1">⚠ Local mode (localStorage)</p>
          )}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <Card className="bg-green-500/10 border border-green-500/50">
            <p className="text-green-400">✓ Settings saved successfully!</p>
          </Card>
        )}

        {/* Error Messages */}
        {error && (
          <Card className="bg-red-500/10 border border-red-500/50">
            <p className="text-red-400">✗ {error}</p>
          </Card>
        )}
        {importError && (
          <Card className="bg-red-500/10 border border-red-500/50">
            <p className="text-red-400">✗ {importError}</p>
          </Card>
        )}
        {showResetConfirm && (
          <Card className="bg-amber-500/10 border border-amber-500/50">
            <p className="text-amber-400 mb-2">⚠ Are you sure you want to reset ALL data? This cannot be undone!</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="primary" onClick={handleReset} className="bg-red-500 hover:bg-red-600">
                Yes, Reset All Data
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* User Profile Section (only in Supabase mode) */}
        {useSupabase && user && (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">User Profile</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
              </div>
              {user.user_metadata?.name && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Name</label>
                  <div className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300">
                    {user.user_metadata.name}
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-500">
                User ID: {user.id.substring(0, 8)}...
              </div>
            </div>
          </Card>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Sleep Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Sleep Settings</h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Target Sleep Hours"
              type="number"
              min="4"
              max="12"
              step="0.5"
              value={settings.sleep_target_hours}
              onChange={(e) => updateSetting('sleep_target_hours', Number(e.target.value))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Target Bedtime"
                type="time"
                value={settings.sleep_target_bedtime}
                onChange={(e) => updateSetting('sleep_target_bedtime', e.target.value)}
              />
              <Input
                label="Target Wake Time"
                type="time"
                value={settings.sleep_target_waketime}
                onChange={(e) => updateSetting('sleep_target_waketime', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Productivity Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Productivity Settings</h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Deep Work Target (hours/day)"
              type="number"
              min="0.5"
              max="8"
              step="0.5"
              value={settings.deep_work_target_hours}
              onChange={(e) => updateSetting('deep_work_target_hours', Number(e.target.value))}
            />
            <Input
              label="Protein Target (grams/day)"
              type="number"
              min="50"
              max="300"
              value={settings.protein_target_grams}
              onChange={(e) => updateSetting('protein_target_grams', Number(e.target.value))}
            />
          </div>
        </Card>

        {/* Goal Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Goal Settings</h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Weight Goal (kg)"
              type="number"
              min="40"
              max="150"
              value={settings.weight_goal_kg}
              onChange={(e) => updateSetting('weight_goal_kg', Number(e.target.value))}
            />
            <Input
              label="Income Goal (THB/month)"
              type="number"
              min="0"
              step="10000"
              value={settings.income_goal_thb}
              onChange={(e) => updateSetting('income_goal_thb', Number(e.target.value))}
            />
            <Select
              label="Week Starts On"
              value={settings.week_start_day}
              onChange={(e) => updateSetting('week_start_day', e.target.value as 'monday' | 'sunday')}
              options={[
                { value: 'monday', label: 'Monday' },
                { value: 'sunday', label: 'Sunday' },
              ]}
            />
          </div>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="w-full">
          {showSuccess ? <><Check className="w-5 h-5" />Settings Saved!</> : <><Save className="w-5 h-5" />Save Settings</>}
        </Button>

        {/* Data Management */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Data Management</h3>
          <div className="space-y-3">
            <Button variant="secondary" onClick={handleExport} className="w-full justify-center">
              <Download className="w-5 h-5" />
              Export All Data (Backup)
            </Button>
            
            <label className="block cursor-pointer">
              <div className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 bg-gray-700 hover:bg-gray-600 text-gray-100">
                <Upload className="w-5 h-5" />
                Import Data
              </div>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            
            <Button 
              variant="ghost" 
              onClick={handleReset} 
              className="w-full justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10"
              disabled={showResetConfirm}
            >
              <Trash2 className="w-5 h-5" />
              {showResetConfirm ? 'Confirm Reset' : 'Reset All Data'}
            </Button>
          </div>
        </Card>

        {/* Version Info */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>Self Mastery OS v1.0.0</p>
          <p className="mt-1">Built with ❤️ for high performers</p>
        </div>
      </div>
    </MainLayout>
  );
}
