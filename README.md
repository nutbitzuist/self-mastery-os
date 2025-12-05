# Self Mastery OS 🚀

Your Personal Life Operating System - Track, measure, and optimize every dimension of your life.

![Dashboard Preview](https://via.placeholder.com/800x400/1f2937/22c55e?text=Self+Mastery+OS)

## Features

### 🤖 AI Coach (NEW!)
- **Claude-powered insights** analyzing your data
- Pattern detection across habits and metrics
- Personalized action recommendations
- Weekly challenges to push your growth
- Works in demo mode without API key

### 📅 Daily Planner (NEW!)
- **5am-9pm time blocks** like your Notion setup
- Top 3 priorities for each day
- Task completion tracking
- Category color coding (Work, Health, Personal, Routine)
- Navigate between days easily

### 📊 Life Dimensions Scorecard
- **8 core dimensions** with auto-calculated scores
- Visual radar chart overview
- Trend tracking vs previous week
- Focus area recommendations
- Detailed breakdown for each dimension

### 📊 Daily Cockpit
- Today's Top 3 Priorities
- Quick stats (streaks, averages, weight)
- AI-powered insights (3 areas to improve)
- Goal progress tracking
- Habit completion visualization

### 📝 Daily Log
- Morning routine tracking (sleep, exercise)
- Physical health metrics (weight, protein, calories)
- Habit tracking (meditation, reading, AI skills)
- Productivity metrics (deep work hours, tasks)
- Energy & mood monitoring
- Daily reflections

### 📅 Weekly Review
- Relationship tracking (lunch with loved ones, family dinner)
- Business metrics (YouTube videos, client outreach)
- Weekly reflection and rating
- "One Big Decision" documentation

### 📈 Monthly Review
- Income tracking by stream (salary, trading, business)
- Life dimensions scoring (12 dimensions, 1-10 scale)
- Monthly wins and lessons
- Progress toward annual goals

### 🎯 Goals
- Track major goals with progress bars
- Leading indicators vs lagging indicators
- Quick value updates
- Category-based organization

### 📖 Principles
- Store your guiding principles
- Daily principle reminder
- Category organization
- Easy add/edit/delete

### 📊 Analytics
- Sleep & deep work trends (14-day chart)
- Habit completion rates
- Energy vs stress visualization
- Life dimensions radar chart
- Key insights summary

### ⚙️ Settings
- Customize all targets
- Export/import data backup
- Reset data option

---

## Tech Stack

- **Frontend**: Next.js 14.2 + TypeScript + Tailwind CSS
- **AI**: Anthropic Claude API (optional)
- **State**: Local Storage (upgradeable to Supabase)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## Quick Start

### 1. Clone and Install

```bash
# Clone or unzip the project
cd self-mastery-os

# Install dependencies
npm install
```

### 2. Set Up Environment (Optional)

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Anthropic API key for AI Coach
ANTHROPIC_API_KEY=your-key-here
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard for AI Coach
```

---

## Navigation Structure

```
📱 Self Mastery OS
├── 🏠 Dashboard      - Daily cockpit with quick stats
├── 🤖 AI Coach       - Personalized insights & recommendations
├── 📅 Daily Planner  - 5am-9pm schedule with time blocks
├── 📊 Scorecard      - 8 life dimensions with scores
├── 📝 Daily Log      - Log habits, health, productivity
├── 📅 Weekly Review  - Relationships, business, reflection
├── 📈 Monthly Review - Income, dimension scores, wins
├── 🎯 Goals          - Track major goals
├── 📊 Analytics      - Charts and trends
├── 📖 Principles     - Your guiding values
└── ⚙️ Settings       - Customize targets
```

---

## AI Coach Setup

The AI Coach provides personalized insights by analyzing your tracking data. To enable it:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com/)
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Or add in Vercel Dashboard → Settings → Environment Variables

**Without an API key**, the AI Coach runs in demo mode with sample insights.

---

## Your Targets (Pre-configured)

| Target | Value |
|--------|-------|
| Sleep | 8 hours (9pm-5am) |
| Deep Work | 1.5 hours/day |
| Protein | 150g/day |
| Weight Goal | 60kg by Dec 2026 |
| Income Goal | 1M THB/month by Dec 2026 |

---

## Upgrading to Multi-User (Supabase)

When ready for multiple users:

1. Create account at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in SQL Editor
3. Add environment variables
4. Update `store.ts` to use Supabase

---

## Roadmap

- [x] AI Coach with Claude API
- [x] Daily Planner with time blocks
- [x] Life Dimensions Scorecard
- [ ] Google Calendar integration
- [ ] Push notifications
- [ ] Mobile app (PWA)
- [ ] Correlation analysis
- [ ] Achievement badges

---

## License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ for high performers who want to level up every dimension of their life.

**Happy, Healthy, Wealthy** 🌟
