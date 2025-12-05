'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Flame,
  Target,
  Calendar,
  Clock,
  Activity,
  Brain,
  Heart,
  Briefcase,
  Building2,
  Coins,
  Users,
  Timer,
  Eye,
  Compass,
  BookOpen,
  Sparkles,
  HandHeart,
  ChevronRight,
  X
} from 'lucide-react';

// Card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className, hover = false, glow = false, style }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6',
        hover && 'glass-card-hover cursor-pointer',
        glow && 'glow-green',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

// Progress bar component
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  showValue = true, 
  size = 'md',
  color = 'bg-brand-500',
  className 
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };
  
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-gray-300">
              {value.toLocaleString()}{max !== 100 && ` / ${max.toLocaleString()}`}
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-700/50 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out progress-bar', color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// Toggle component
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, label, disabled = false, className }: ToggleProps) {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
          checked ? 'bg-brand-500' : 'bg-gray-600'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  );
}

// Stat card component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: string;
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, trendValue, color = 'text-brand-400', className }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className={cn('text-2xl font-bold', color)}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && trendValue && (
            <div className={cn('flex items-center gap-1 mt-2', trendColor)}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-2 rounded-lg bg-gray-800/50', color)}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

// Streak display component
interface StreakProps {
  count: number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Streak({ count, label, icon, className }: StreakProps) {
  const isActive = count > 0;
  
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'flex items-center justify-center w-10 h-10 rounded-xl',
        isActive ? 'bg-orange-500/20' : 'bg-gray-700/50'
      )}>
        {icon || <Flame className={cn('w-5 h-5', isActive ? 'text-orange-400 streak-fire' : 'text-gray-500')} />}
      </div>
      <div>
        <p className={cn('text-lg font-bold', isActive ? 'text-orange-400' : 'text-gray-500')}>
          {count} {count === 1 ? 'day' : 'days'}
        </p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  );
}

// Priority item component
interface PriorityItemProps {
  text: string;
  completed?: boolean;
  onChange?: (completed: boolean) => void;
  index: number;
  className?: string;
}

export function PriorityItem({ text, completed = false, onChange, index, className }: PriorityItemProps) {
  const Icon = completed ? CheckCircle2 : Circle;
  
  return (
    <div 
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl transition-all duration-200',
        completed ? 'bg-brand-500/10' : 'bg-gray-800/30 hover:bg-gray-800/50',
        className
      )}
      onClick={() => onChange?.(!completed)}
    >
      <Icon className={cn(
        'w-5 h-5 mt-0.5 flex-shrink-0 cursor-pointer transition-colors',
        completed ? 'text-brand-400' : 'text-gray-500 hover:text-brand-400'
      )} />
      <div className="flex-1 min-w-0">
        <span className={cn(
          'text-sm leading-relaxed',
          completed ? 'text-gray-400 line-through' : 'text-gray-200'
        )}>
          {text || `Priority ${index + 1}`}
        </span>
      </div>
    </div>
  );
}

// Dimension badge component
interface DimensionBadgeProps {
  dimension: string;
  score?: number;
  className?: string;
}

const dimensionIcons: Record<string, React.ReactNode> = {
  physical_health: <Activity className="w-4 h-4" />,
  mental_health: <Brain className="w-4 h-4" />,
  career: <Briefcase className="w-4 h-4" />,
  business: <Building2 className="w-4 h-4" />,
  wealth: <Coins className="w-4 h-4" />,
  relationships: <Users className="w-4 h-4" />,
  productivity: <Timer className="w-4 h-4" />,
  self_awareness: <Eye className="w-4 h-4" />,
  life_vision: <Compass className="w-4 h-4" />,
  learning: <BookOpen className="w-4 h-4" />,
  fun: <Sparkles className="w-4 h-4" />,
  contribution: <HandHeart className="w-4 h-4" />,
};

const dimensionNames: Record<string, string> = {
  physical_health: 'Physical Health',
  mental_health: 'Mental Health',
  career: 'Career',
  business: 'Business',
  wealth: 'Wealth',
  relationships: 'Relationships',
  productivity: 'Productivity',
  self_awareness: 'Self Awareness',
  life_vision: 'Life Vision',
  learning: 'Learning',
  fun: 'Fun & Adventure',
  contribution: 'Contribution',
};

export function DimensionBadge({ dimension, score, className }: DimensionBadgeProps) {
  const badgeClass = `badge-${dimension.replace('_', '-').replace('_health', '').replace('self_', '')}`;
  
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
      badgeClass,
      className
    )}>
      {dimensionIcons[dimension]}
      <span>{dimensionNames[dimension]}</span>
      {score !== undefined && (
        <span className="ml-1 font-bold">{score}/10</span>
      )}
    </div>
  );
}

// Insight card component
interface InsightCardProps {
  dimension: string;
  reason: string;
  suggestion: string;
  className?: string;
}

export function InsightCard({ dimension, reason, suggestion, className }: InsightCardProps) {
  return (
    <Card className={cn('border-l-4 border-amber-500', className)}>
      <DimensionBadge dimension={dimension} className="mb-3" />
      <p className="text-sm text-gray-300 mb-2">{reason}</p>
      <p className="text-xs text-amber-400 flex items-center gap-1">
        <Target className="w-3 h-3" />
        {suggestion}
      </p>
    </Card>
  );
}

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-300',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus-ring',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100',
          'placeholder-gray-500 transition-all duration-200',
          'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100',
          'transition-all duration-200 cursor-pointer',
          'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-gray-800">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Slider component
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function Slider({ 
  value, 
  onChange, 
  min = 1, 
  max = 10, 
  step = 1, 
  label, 
  showValue = true,
  className 
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;
  
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && (
            <span className="text-sm font-bold text-brand-400">{value}</span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-brand-500
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:shadow-brand-500/30
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110"
        style={{
          background: `linear-gradient(to right, #22c55e ${percent}%, #374151 ${percent}%)`
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{min}</span>
        <span className="text-xs text-gray-500">{max}</span>
      </div>
    </div>
  );
}

// Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        'relative w-full max-w-lg max-h-[90vh] overflow-auto glass-card rounded-2xl p-6',
        'animate-slide-up',
        className
      )}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// Tab component
interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 bg-gray-800/50 rounded-xl', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Empty state component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-200 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-400 mb-4 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
