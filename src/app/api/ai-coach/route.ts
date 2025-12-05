import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Types for the request
interface DailyEntryData {
  date: string;
  exercise_done: boolean;
  meditation_done: boolean;
  reading_done: boolean;
  protein_target_hit: boolean;
  sleep_hours: number | null;
  sleep_schedule_status: string | null;
  deep_work_hours: number | null;
  energy_level: number | null;
  stress_level: number | null;
  tasks_completed: number | null;
  tasks_planned: number | null;
}

interface WeeklyEntryData {
  loved_one_lunch: boolean;
  family_dinner: boolean;
  youtube_video_posted: boolean;
  client_outreach_count: number;
  week_rating: number | null;
}

interface ScorecardData {
  overallPercentage: number;
  dimensions: {
    name: string;
    percentage: number;
    trend: string;
  }[];
  lowestDimensions: string[];
}

interface AICoachRequest {
  dailyEntries: DailyEntryData[];
  weeklyEntry?: WeeklyEntryData;
  scorecard: ScorecardData;
  userGoals: {
    incomeGoal: number;
    currentIncome: number;
    weightGoal: number;
    currentWeight: number;
  };
  principles: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: AICoachRequest = await request.json();
    
    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      // Return mock response if no API key (for demo/development)
      return NextResponse.json({
        success: true,
        insights: generateMockInsights(body),
        isMock: true,
      });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Build the prompt
    const prompt = buildCoachPrompt(body);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      system: `You are a personal performance coach helping a high-achieving professional optimize their life across 8 dimensions: Physical Health, Mental Health, Career/Business, Wealth, Relationships, Productivity, Life Vision, and Self Awareness.

Your coaching style:
- Be direct and actionable (no fluff)
- Reference specific data from their tracking
- Connect insights to their stated principles and goals
- Focus on high-leverage improvements
- Be encouraging but honest about gaps
- Limit response to 3-5 key insights

Format your response as JSON with this structure:
{
  "weekSummary": "One sentence overall assessment",
  "topInsights": [
    {
      "dimension": "dimension name",
      "insight": "specific observation",
      "action": "concrete next step",
      "impact": "high/medium/low"
    }
  ],
  "patterns": [
    "Pattern 1 you noticed",
    "Pattern 2 you noticed"
  ],
  "weeklyChallenge": "One specific challenge for next week",
  "encouragement": "One sentence of genuine encouragement"
}`,
    });

    // Extract text from response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse JSON from response
    let insights;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      // If parsing fails, return a structured version of the raw response
      insights = {
        weekSummary: 'Analysis complete',
        topInsights: [{
          dimension: 'General',
          insight: responseText.slice(0, 500),
          action: 'Review the detailed analysis',
          impact: 'medium'
        }],
        patterns: [],
        weeklyChallenge: 'Focus on consistency',
        encouragement: 'Keep tracking and improving!'
      };
    }

    return NextResponse.json({
      success: true,
      insights,
      isMock: false,
    });

  } catch (error) {
    console.error('AI Coach error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate insights',
        insights: generateMockInsights({} as AICoachRequest),
        isMock: true,
      },
      { status: 500 }
    );
  }
}

function buildCoachPrompt(data: AICoachRequest): string {
  const { dailyEntries, weeklyEntry, scorecard, userGoals, principles } = data;

  // Calculate weekly stats
  const exerciseDays = dailyEntries.filter(e => e.exercise_done).length;
  const meditationDays = dailyEntries.filter(e => e.meditation_done).length;
  const readingDays = dailyEntries.filter(e => e.reading_done).length;
  const proteinDays = dailyEntries.filter(e => e.protein_target_hit).length;
  
  const avgSleep = dailyEntries
    .map(e => e.sleep_hours)
    .filter((v): v is number => v !== null)
    .reduce((a, b, _, arr) => a + b / arr.length, 0);
  
  const avgDeepWork = dailyEntries
    .map(e => e.deep_work_hours)
    .filter((v): v is number => v !== null)
    .reduce((a, b, _, arr) => a + b / arr.length, 0);
  
  const avgEnergy = dailyEntries
    .map(e => e.energy_level)
    .filter((v): v is number => v !== null)
    .reduce((a, b, _, arr) => a + b / arr.length, 0);
  
  const avgStress = dailyEntries
    .map(e => e.stress_level)
    .filter((v): v is number => v !== null)
    .reduce((a, b, _, arr) => a + b / arr.length, 0);

  return `Analyze this week's performance data and provide coaching insights:

## Weekly Tracking Data (${dailyEntries.length} days logged)

**Habits:**
- Exercise: ${exerciseDays}/7 days
- Meditation: ${meditationDays}/7 days
- Reading: ${readingDays}/7 days
- Protein target: ${proteinDays}/7 days

**Averages:**
- Sleep: ${avgSleep.toFixed(1)} hours/night
- Deep work: ${avgDeepWork.toFixed(1)} hours/day
- Energy level: ${avgEnergy.toFixed(1)}/10
- Stress level: ${avgStress.toFixed(1)}/10

**Relationships (Weekly):**
- Lunch with loved one: ${weeklyEntry?.loved_one_lunch ? 'Yes' : 'No'}
- Family dinner: ${weeklyEntry?.family_dinner ? 'Yes' : 'No'}

**Wealth Building:**
- YouTube video posted: ${weeklyEntry?.youtube_video_posted ? 'Yes' : 'No'}
- Client outreach: ${weeklyEntry?.client_outreach_count || 0} contacts

**Week Rating:** ${weeklyEntry?.week_rating || 'Not rated'}/10

## Scorecard Summary
- Overall Score: ${scorecard.overallPercentage.toFixed(0)}%
- Lowest Dimensions: ${scorecard.lowestDimensions.join(', ')}
- Dimension Scores:
${scorecard.dimensions.map(d => `  - ${d.name}: ${d.percentage.toFixed(0)}% (${d.trend})`).join('\n')}

## User's Goals
- Income Goal: ${userGoals.incomeGoal.toLocaleString()} THB/month (currently ${userGoals.currentIncome.toLocaleString()})
- Weight Goal: ${userGoals.weightGoal}kg (currently ${userGoals.currentWeight}kg)

## User's Principles
${principles.slice(0, 5).map((p, i) => `${i + 1}. ${p}`).join('\n')}

Based on this data, provide your coaching analysis in the JSON format specified.`;
}

function generateMockInsights(data: AICoachRequest): object {
  // Generate reasonable mock insights based on data structure
  const scorecard = data?.scorecard;
  const lowestDims = scorecard?.lowestDimensions || ['Mental Health', 'Life Vision'];
  
  return {
    weekSummary: `Your overall performance is at ${scorecard?.overallPercentage?.toFixed(0) || 72}%. Focus on ${lowestDims[0]} and ${lowestDims[1]} to level up.`,
    topInsights: [
      {
        dimension: lowestDims[0] || 'Mental Health',
        insight: 'Meditation consistency dropped this week. On days you meditate, your stress levels are 30% lower.',
        action: 'Set a phone alarm for 5:05am with label "5-min meditation" right after waking.',
        impact: 'high'
      },
      {
        dimension: 'Physical Health',
        insight: 'Your exercise streak is building momentum. Energy levels correlate strongly with workout days.',
        action: 'Keep the 15-min morning workout consistent - it\'s your keystone habit.',
        impact: 'medium'
      },
      {
        dimension: 'Wealth',
        insight: 'Client outreach is below your 10/week target. This is a leading indicator for your 1M goal.',
        action: 'Block 30 mins on Tuesday and Thursday specifically for outreach.',
        impact: 'high'
      }
    ],
    patterns: [
      'Your best productivity days happen when you complete your morning routine by 6:30am.',
      'Stress spikes on days when you skip meditation AND have less than 7.5 hours of sleep.',
      'Deep work hours are highest on days with no meetings before 10am.'
    ],
    weeklyChallenge: 'Complete meditation every day this week. If you miss a day, do a 2-minute breathing exercise instead.',
    encouragement: 'You\'re building systems that compound over time. The fact that you\'re tracking this closely already puts you ahead of 95% of people. Keep going!'
  };
}
