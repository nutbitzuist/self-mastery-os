import { DailyEntry, WeeklyEntry, DimensionScore, WeeklyScorecard, ScoreBreakdown, getScoreStatus, LIFE_DIMENSIONS_8 } from '@/types';
import { startOfWeek, endOfWeek, parseISO, format } from 'date-fns';

// Calculate score for Physical Health dimension
function calculatePhysicalHealthScore(weekEntries: DailyEntry[]): DimensionScore {
  const breakdown: ScoreBreakdown[] = [];
  let totalPoints = 0;
  const maxPoints = 100;

  // Exercise days (target: 6/7) - 25 points
  const exerciseDays = weekEntries.filter(e => e.exercise_done).length;
  const exercisePoints = exerciseDays >= 6 ? 25 : Math.round((exerciseDays / 6) * 25);
  breakdown.push({
    metric: 'Exercise days',
    value: exerciseDays,
    target: 6,
    points: exercisePoints,
    maxPoints: 25,
    met: exerciseDays >= 6
  });
  totalPoints += exercisePoints;

  // Protein target (target: 6/7 days) - 25 points
  const proteinDays = weekEntries.filter(e => e.protein_target_hit).length;
  const proteinPoints = proteinDays >= 6 ? 25 : Math.round((proteinDays / 6) * 25);
  breakdown.push({
    metric: 'Protein target hit',
    value: proteinDays,
    target: 6,
    points: proteinPoints,
    maxPoints: 25,
    met: proteinDays >= 6
  });
  totalPoints += proteinPoints;

  // Sleep on schedule (target: 6/7 days) - 25 points
  const sleepOnScheduleDays = weekEntries.filter(e => e.sleep_schedule_status === 'as_scheduled').length;
  const sleepPoints = sleepOnScheduleDays >= 6 ? 25 : Math.round((sleepOnScheduleDays / 6) * 25);
  breakdown.push({
    metric: 'Sleep on schedule (9pm-5am)',
    value: sleepOnScheduleDays,
    target: 6,
    points: sleepPoints,
    maxPoints: 25,
    met: sleepOnScheduleDays >= 6
  });
  totalPoints += sleepPoints;

  // Energy level average (target: 8+) - 25 points
  const energyValues = weekEntries.map(e => e.energy_level).filter((v): v is number => v !== null);
  const avgEnergy = energyValues.length > 0 ? energyValues.reduce((a, b) => a + b, 0) / energyValues.length : 0;
  const energyPoints = avgEnergy >= 8 ? 25 : Math.round((avgEnergy / 8) * 25);
  breakdown.push({
    metric: 'Avg energy level',
    value: Number(avgEnergy.toFixed(1)),
    target: 8,
    points: energyPoints,
    maxPoints: 25,
    met: avgEnergy >= 8
  });
  totalPoints += energyPoints;

  const percentage = (totalPoints / maxPoints) * 100;

  return {
    key: 'physical_health',
    name: 'Physical Health',
    color: '#10b981',
    score: totalPoints,
    maxScore: maxPoints,
    percentage,
    trend: 'stable',
    trendValue: 0,
    status: getScoreStatus(percentage),
    breakdown
  };
}

// Calculate score for Mental Health dimension
function calculateMentalHealthScore(weekEntries: DailyEntry[]): DimensionScore {
  const breakdown: ScoreBreakdown[] = [];
  let totalPoints = 0;
  const maxPoints = 100;

  // Meditation days (target: 7/7) - 30 points
  const meditationDays = weekEntries.filter(e => e.meditation_done).length;
  const meditationPoints = meditationDays >= 7 ? 30 : Math.round((meditationDays / 7) * 30);
  breakdown.push({
    metric: 'Meditation days',
    value: meditationDays,
    target: 7,
    points: meditationPoints,
    maxPoints: 30,
    met: meditationDays >= 7
  });
  totalPoints += meditationPoints;

  // Stress level average (target: <4) - 30 points
  const stressValues = weekEntries.map(e => e.stress_level).filter((v): v is number => v !== null);
  const avgStress = stressValues.length > 0 ? stressValues.reduce((a, b) => a + b, 0) / stressValues.length : 5;
  const stressPoints = avgStress <= 4 ? 30 : Math.max(0, Math.round((1 - (avgStress - 4) / 6) * 30));
  breakdown.push({
    metric: 'Avg stress level',
    value: Number(avgStress.toFixed(1)),
    target: '≤4',
    points: stressPoints,
    maxPoints: 30,
    met: avgStress <= 4
  });
  totalPoints += stressPoints;

  // Sleep quality average (target: 8+) - 20 points
  const sleepQualityValues = weekEntries.map(e => e.sleep_quality).filter((v): v is number => v !== null);
  const avgSleepQuality = sleepQualityValues.length > 0 ? sleepQualityValues.reduce((a, b) => a + b, 0) / sleepQualityValues.length : 0;
  const sleepQualityPoints = avgSleepQuality >= 8 ? 20 : Math.round((avgSleepQuality / 8) * 20);
  breakdown.push({
    metric: 'Avg sleep quality',
    value: Number(avgSleepQuality.toFixed(1)),
    target: 8,
    points: sleepQualityPoints,
    maxPoints: 20,
    met: avgSleepQuality >= 8
  });
  totalPoints += sleepQualityPoints;

  // Reading days (for mental stimulation) - 20 points
  const readingDays = weekEntries.filter(e => e.reading_done).length;
  const readingPoints = readingDays >= 5 ? 20 : Math.round((readingDays / 5) * 20);
  breakdown.push({
    metric: 'Reading days',
    value: readingDays,
    target: 5,
    points: readingPoints,
    maxPoints: 20,
    met: readingDays >= 5
  });
  totalPoints += readingPoints;

  const percentage = (totalPoints / maxPoints) * 100;

  return {
    key: 'mental_health',
    name: 'Mental Health',
    color: '#8b5cf6',
    score: totalPoints,
    maxScore: maxPoints,
    percentage,
    trend: 'stable',
    trendValue: 0,
    status: getScoreStatus(percentage),
    breakdown
  };
}

// Calculate score for Career/Business dimension
function calculateCareerBusinessScore(weekEntries: DailyEntry[]): DimensionScore {
  const breakdown: ScoreBreakdown[] = [];
  let totalPoints = 0;
  const maxPoints = 100;

  // Deep work hours (target: 1.5 hrs/day, 5 days) - 30 points
  const deepWorkDays = weekEntries.filter(e => (e.deep_work_hours || 0) >= 1.5).length;
  const deepWorkPoints = deepWorkDays >= 5 ? 30 : Math.round((deepWorkDays / 5) * 30);
  breakdown.push({
    metric: 'Days with 1.5+ hrs deep work',
    value: deepWorkDays,
    target: 5,
    points: deepWorkPoints,
    maxPoints: 30,
    met: deepWorkDays >= 5
  });
  totalPoints += deepWorkPoints;

  // Tasks completion rate (target: 80%+) - 30 points
  const tasksPlanned = weekEntries.reduce((sum, e) => sum + (e.tasks_planned || 0), 0);
  const tasksCompleted = weekEntries.reduce((sum, e) => sum + (e.tasks_completed || 0), 0);
  const completionRate = tasksPlanned > 0 ? (tasksCompleted / tasksPlanned) * 100 : 0;
  const taskPoints = completionRate >= 80 ? 30 : Math.round((completionRate / 80) * 30);
  breakdown.push({
    metric: 'Task completion rate',
    value: `${Math.round(completionRate)}%`,
    target: '80%',
    points: taskPoints,
    maxPoints: 30,
    met: completionRate >= 80
  });
  totalPoints += taskPoints;

  // AI skills practice (for career growth) - 20 points
  const aiSkillsDays = weekEntries.filter(e => e.ai_skills_done).length;
  const aiSkillsPoints = aiSkillsDays >= 5 ? 20 : Math.round((aiSkillsDays / 5) * 20);
  breakdown.push({
    metric: 'AI skills practice days',
    value: aiSkillsDays,
    target: 5,
    points: aiSkillsPoints,
    maxPoints: 20,
    met: aiSkillsDays >= 5
  });
  totalPoints += aiSkillsPoints;

  // Total deep work hours (target: 7.5 hrs/week) - 20 points
  const totalDeepWork = weekEntries.reduce((sum, e) => sum + (e.deep_work_hours || 0), 0);
  const totalDeepWorkPoints = totalDeepWork >= 7.5 ? 20 : Math.round((totalDeepWork / 7.5) * 20);
  breakdown.push({
    metric: 'Total deep work hours',
    value: Number(totalDeepWork.toFixed(1)),
    target: 7.5,
    points: totalDeepWorkPoints,
    maxPoints: 20,
    met: totalDeepWork >= 7.5
  });
  totalPoints += totalDeepWorkPoints;

  const percentage = (totalPoints / maxPoints) * 100;

  return {
    key: 'career_business',
    name: 'Career/Business',
    color: '#3b82f6',
    score: totalPoints,
    maxScore: maxPoints,
    percentage,
    trend: 'stable',
    trendValue: 0,
    status: getScoreStatus(percentage),
    breakdown
  };
}

// Calculate score for Wealth dimension
function calculateWealthScore(weekEntries: DailyEntry[], weeklyEntry?: WeeklyEntry): DimensionScore {
  const breakdown: ScoreBreakdown[] = [];
  let totalPoints = 0;
  const maxPoints = 100;

  // YouTube video posted (leading indicator) - 25 points
  const youtubePosted = weeklyEntry?.youtube_video_posted ?? false;
  const youtubePoints = youtubePosted ? 25 : 0;
  breakdown.push({
    metric: 'YouTube video posted',
    value: youtubePosted ? 'Yes' : 'No',
    target: 'Yes',
    points: youtubePoints,
    maxPoints: 25,
    met: youtubePosted
  });
  totalPoints += youtubePoints;

  // Client outreach (target: 10/week) - 25 points
  const clientOutreach = weeklyEntry?.client_outreach_count ?? 0;
  const outreachPoints = clientOutreach >= 10 ? 25 : Math.round((clientOutreach / 10) * 25);
  breakdown.push({
    metric: 'Client outreach count',
    value: clientOutreach,
    target: 10,
    points: outreachPoints,
    maxPoints: 25,
    met: clientOutreach >= 10
  });
  totalPoints += outreachPoints;

  // Business development (deep work on business) - 25 points
  // Using AI skills and deep work as proxy for business development
  const aiDays = weekEntries.filter(e => e.ai_skills_done).length;
  const bizDevPoints = aiDays >= 5 ? 25 : Math.round((aiDays / 5) * 25);
  breakdown.push({
    metric: 'Business development days',
    value: aiDays,
    target: 5,
    points: bizDevPoints,
    maxPoints: 25,
    met: aiDays >= 5
  });
  totalPoints += bizDevPoints;

  // Consistent productivity (enables wealth building) - 25 points
  const productiveDays = weekEntries.filter(e => (e.tasks_completed || 0) >= 3).length;
  const productivePoints = productiveDays >= 5 ? 25 : Math.round((productiveDays / 5) * 25);
  breakdown.push({
    metric: 'Productive days (3+ tasks)',
    value: productiveDays,
    target: 5,
    points: productivePoints,
    maxPoints: 25,
    met: productiveDays >= 5
  });
  totalPoints += productivePoints;

  const percentage = (totalPoints / maxPoints) * 100;

  return {
    key: 'wealth',
    name: 'Wealth',
    color: '#eab308',
    score: totalPoints,
    maxScore: maxPoints,
    percentage,
    trend: 'stable',
    trendValue: 0,
    status: getScoreStatus(percentage),
    breakdown
  };
}

// Calculate score for Relationships dimension
function calculateRelationshipsScore(weeklyEntry?: WeeklyEntry): DimensionScore {
  const breakdown: ScoreBreakdown[] = [];
  let totalPoints = 0;
  const maxPoints = 100;

  // Lunch with loved one - 30 points
  const lovedOneLunch = weeklyEntry?.loved_one_lunch ?? false;
  const lunchPoints = lovedOneLunch ? 30 : 0;
  breakdown.push({
    metric: 'Lunch with loved one',
    value: lovedOneLunch ? 'Yes' : 'No',
    target: 'Yes',
    points: lunchPoints,
    maxPoints: 30,
    met: lovedOneLunch
  });
  totalPoints += lunchPoints;

  // Family dinner - 30 points
  const familyDinner = weeklyEntry?.family_dinner ?? false;
  const dinnerPoints = familyDinner ? 30 : 0;
  breakdown.push({
    metric: 'Family dinner',
    value: familyDinner ? 'Yes' : 'No',
    target: 'Yes',
    points: dinnerPoints,
    maxPoints: 30,
    met: familyDinner
  });
  totalPoints += dinnerPoints;

  // Quality time hours (target: 5 hrs/week) - 40 points
  const qualityTime = weeklyEntry?.quality_time_hours ?? 0;
  const qualityPoints = qualityTime >= 5 ? 40 : Math.round((qualityTime / 5) * 40);
  breakdown.push({
    metric: 'Quality time hours',
    value: qualityTime,
    target: 5,
    points: qualityPoints,
    maxPoints: 40,
    met: qualityTime >= 5
  });
  totalPoints += qualityPoints;

  const percentage = (totalPoints / maxPoints) * 100;

  return {
    key: 'relationships',
    name: 'Relationships',
    color: '#ec4899',
    score: totalPoints,
    maxScore: maxPoints,
    percentage,
    trend: 'stable',
    trendValue: 0,
    status: getScoreStatus(percentage),
    breakdown
  };
}

// Calculate score for Time Management & Productivity dimension
function calculateProductivityScore(weekEntries: DailyEntry[]): DimensionScore {
  const breakdown: ScoreBreakdown[] = [];
  let totalPoints = 0;
  const maxPoints = 100;

  // Morning routine (wake on time) - 30 points
  const wakeOnTime = weekEntries.filter(e => {
    if (!e.wake_time) return false;
    const [hours] = e.wake_time.split(':').map(Number);
    return hours <= 5; // Wake by 5am
  }).length;
  const wakePoints = wakeOnTime >= 6 ? 30 : Math.round((wakeOnTime / 6) * 30);
  breakdown.push({
    metric: 'Wake by 5am',
    value: wakeOnTime,
    target: 6,
    points: wakePoints,
    maxPoints: 30,
    met: wakeOnTime >= 6
  });
  totalPoints += wakePoints;

  // Top 3 priorities set - 25 points
  const prioritiesSet = weekEntries.filter(e => 
    e.top_3_priorities && e.top_3_priorities.filter(p => p && p.trim()).length >= 3
  ).length;
  const prioritiesPoints = prioritiesSet >= 5 ? 25 : Math.round((prioritiesSet / 5) * 25);
  breakdown.push({
    metric: 'Days with 3 priorities set',
    value: prioritiesSet,
    target: 5,
    points: prioritiesPoints,
    maxPoints: 25,
    met: prioritiesSet >= 5
  });
  totalPoints += prioritiesPoints;

  // Task completion rate - 25 points
  const tasksPlanned = weekEntries.reduce((sum, e) => sum + (e.tasks_planned || 0), 0);
  const tasksCompleted = weekEntries.reduce((sum, e) => sum + (e.tasks_completed || 0), 0);
  const completionRate = tasksPlanned > 0 ? (tasksCompleted / tasksPlanned) * 100 : 0;
  const taskPoints = completionRate >= 80 ? 25 : Math.round((completionRate / 80) * 25);
  breakdown.push({
    metric: 'Task completion rate',
    value: `${Math.round(completionRate)}%`,
    target: '80%',
    points: taskPoints,
    maxPoints: 25,
    met: completionRate >= 80
  });
  totalPoints += taskPoints;

  // Deep work consistency - 20 points
  const deepWorkDays = weekEntries.filter(e => (e.deep_work_hours || 0) >= 1).length;
  const deepWorkPoints = deepWorkDays >= 5 ? 20 : Math.round((deepWorkDays / 5) * 20);
  breakdown.push({
    metric: 'Days with 1+ hr deep work',
    value: deepWorkDays,
    target: 5,
    points: deepWorkPoints,
    maxPoints: 20,
    met: deepWorkDays >= 5
  });
  totalPoints += deepWorkPoints;

  const percentage = (totalPoints / maxPoints) * 100;

  return {
    key: 'productivity',
    name: 'Time Management & Productivity',
    color: '#06b6d4',
    score: totalPoints,
    maxScore: maxPoints,
    percentage,
    trend: 'stable',
    trendValue: 0,
    status: getScoreStatus(percentage),
    breakdown
  };
}

// Calculate score for Life Vision dimension
function calculateLifeVisionScore(weekEntries: DailyEntry[], weeklyEntry?: WeeklyEntry): DimensionScore {
  const breakdown: ScoreBreakdown[] = [];
  let totalPoints = 0;
  const maxPoints = 100;

  // Big decision made this week - 30 points
  const bigDecision = !!(weeklyEntry?.big_decision_made && weeklyEntry.big_decision_made.trim().length > 0);
  const decisionPoints = bigDecision ? 30 : 0;
  breakdown.push({
    metric: 'Big decision made',
    value: bigDecision ? 'Yes' : 'No',
    target: 'Yes',
    points: decisionPoints,
    maxPoints: 30,
    met: bigDecision
  });
  totalPoints += decisionPoints;

  // Weekly review completed - 25 points
  const weeklyReviewDone = weeklyEntry?.what_went_well && weeklyEntry.what_went_well.trim().length > 0;
  const reviewPoints = weeklyReviewDone ? 25 : 0;
  breakdown.push({
    metric: 'Weekly review completed',
    value: weeklyReviewDone ? 'Yes' : 'No',
    target: 'Yes',
    points: reviewPoints,
    maxPoints: 25,
    met: weeklyReviewDone
  });
  totalPoints += reviewPoints;

  // Focus for next week set - 25 points
  const focusSet = weeklyEntry?.focus_next_week && weeklyEntry.focus_next_week.trim().length > 0;
  const focusPoints = focusSet ? 25 : 0;
  breakdown.push({
    metric: 'Focus for next week set',
    value: focusSet ? 'Yes' : 'No',
    target: 'Yes',
    points: focusPoints,
    maxPoints: 25,
    met: focusSet
  });
  totalPoints += focusPoints;

  // Daily reflection (best of day) - 20 points
  const reflectionDays = weekEntries.filter(e => e.best_of_day && e.best_of_day.trim().length > 0).length;
  const reflectionPoints = reflectionDays >= 5 ? 20 : Math.round((reflectionDays / 5) * 20);
  breakdown.push({
    metric: 'Daily reflection done',
    value: reflectionDays,
    target: 5,
    points: reflectionPoints,
    maxPoints: 20,
    met: reflectionDays >= 5
  });
  totalPoints += reflectionPoints;

  const percentage = (totalPoints / maxPoints) * 100;

  return {
    key: 'life_vision',
    name: 'Life Vision',
    color: '#6366f1',
    score: totalPoints,
    maxScore: maxPoints,
    percentage,
    trend: 'stable',
    trendValue: 0,
    status: getScoreStatus(percentage),
    breakdown
  };
}

// Calculate score for Self Awareness dimension
function calculateSelfAwarenessScore(weekEntries: DailyEntry[]): DimensionScore {
  const breakdown: ScoreBreakdown[] = [];
  let totalPoints = 0;
  const maxPoints = 100;

  // Daily reflection done - 30 points
  const reflectionDays = weekEntries.filter(e => 
    (e.best_of_day && e.best_of_day.trim().length > 0) ||
    (e.reflection_good && e.reflection_good.trim().length > 0)
  ).length;
  const reflectionPoints = reflectionDays >= 5 ? 30 : Math.round((reflectionDays / 5) * 30);
  breakdown.push({
    metric: 'Daily reflection',
    value: reflectionDays,
    target: 5,
    points: reflectionPoints,
    maxPoints: 30,
    met: reflectionDays >= 5
  });
  totalPoints += reflectionPoints;

  // Reading for growth - 25 points
  const readingDays = weekEntries.filter(e => e.reading_done).length;
  const readingPoints = readingDays >= 5 ? 25 : Math.round((readingDays / 5) * 25);
  breakdown.push({
    metric: 'Reading days',
    value: readingDays,
    target: 5,
    points: readingPoints,
    maxPoints: 25,
    met: readingDays >= 5
  });
  totalPoints += readingPoints;

  // Meditation (self-awareness practice) - 25 points
  const meditationDays = weekEntries.filter(e => e.meditation_done).length;
  const meditationPoints = meditationDays >= 5 ? 25 : Math.round((meditationDays / 5) * 25);
  breakdown.push({
    metric: 'Meditation days',
    value: meditationDays,
    target: 5,
    points: meditationPoints,
    maxPoints: 25,
    met: meditationDays >= 5
  });
  totalPoints += meditationPoints;

  // Improvement reflection - 20 points
  const improveDays = weekEntries.filter(e => 
    e.reflection_improve && e.reflection_improve.trim().length > 0
  ).length;
  const improvePoints = improveDays >= 3 ? 20 : Math.round((improveDays / 3) * 20);
  breakdown.push({
    metric: 'Improvement reflection',
    value: improveDays,
    target: 3,
    points: improvePoints,
    maxPoints: 20,
    met: improveDays >= 3
  });
  totalPoints += improvePoints;

  const percentage = (totalPoints / maxPoints) * 100;

  return {
    key: 'self_awareness',
    name: 'Self Awareness',
    color: '#a855f7',
    score: totalPoints,
    maxScore: maxPoints,
    percentage,
    trend: 'stable',
    trendValue: 0,
    status: getScoreStatus(percentage),
    breakdown
  };
}

// Main function to calculate weekly scorecard
export function calculateWeeklyScorecard(
  dailyEntries: DailyEntry[],
  weeklyEntries: WeeklyEntry[],
  weekStartDate?: Date
): WeeklyScorecard {
  const targetWeekStart = weekStartDate || startOfWeek(new Date(), { weekStartsOn: 1 });
  const targetWeekEnd = endOfWeek(targetWeekStart, { weekStartsOn: 1 });
  
  // Filter entries for this week
  const weekDailyEntries = dailyEntries.filter(e => {
    const entryDate = parseISO(e.date);
    return entryDate >= targetWeekStart && entryDate <= targetWeekEnd;
  });

  // Find weekly entry for this week
  const weekStartStr = format(targetWeekStart, 'yyyy-MM-dd');
  const weeklyEntry = weeklyEntries.find(e => e.week_start_date === weekStartStr);

  // Calculate all dimension scores
  const dimensions: DimensionScore[] = [
    calculatePhysicalHealthScore(weekDailyEntries),
    calculateMentalHealthScore(weekDailyEntries),
    calculateCareerBusinessScore(weekDailyEntries),
    calculateWealthScore(weekDailyEntries, weeklyEntry),
    calculateRelationshipsScore(weeklyEntry),
    calculateProductivityScore(weekDailyEntries),
    calculateLifeVisionScore(weekDailyEntries, weeklyEntry),
    calculateSelfAwarenessScore(weekDailyEntries),
  ];

  // Calculate overall score
  const totalScore = dimensions.reduce((sum, d) => sum + d.score, 0);
  const totalMaxScore = dimensions.reduce((sum, d) => sum + d.maxScore, 0);
  const overallPercentage = (totalScore / totalMaxScore) * 100;

  // Find lowest dimensions
  const sortedDimensions = [...dimensions].sort((a, b) => a.percentage - b.percentage);
  const lowestDimensions = sortedDimensions.slice(0, 2).map(d => d.name);

  // Generate insights
  const insights: string[] = [];
  
  // Find patterns
  const physicalHealth = dimensions.find(d => d.key === 'physical_health');
  const mentalHealth = dimensions.find(d => d.key === 'mental_health');
  
  if (physicalHealth && physicalHealth.percentage >= 80) {
    insights.push('Your physical health habits are strong - this is fueling your overall performance.');
  }
  
  if (mentalHealth && mentalHealth.percentage < 70) {
    const meditationBreakdown = mentalHealth.breakdown.find(b => b.metric === 'Meditation days');
    if (meditationBreakdown && !meditationBreakdown.met) {
      insights.push(`Meditation is at ${meditationBreakdown.value}/7 days. Studies show consistent meditation reduces stress by 30%.`);
    }
  }

  const relationships = dimensions.find(d => d.key === 'relationships');
  if (relationships && relationships.percentage >= 90) {
    insights.push('Excellent relationship investment this week - strong connections support all other areas.');
  }

  if (insights.length === 0) {
    insights.push('Keep tracking consistently to unlock personalized insights based on your patterns.');
  }

  // Focus areas
  const focusAreas = lowestDimensions;

  const weekNumber = Math.ceil((targetWeekStart.getTime() - new Date(targetWeekStart.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

  return {
    weekStartDate: weekStartStr,
    weekNumber,
    year: targetWeekStart.getFullYear(),
    overallScore: totalScore,
    overallPercentage: Number(overallPercentage.toFixed(1)),
    overallStatus: getScoreStatus(overallPercentage),
    dimensions,
    lowestDimensions,
    insights,
    focusAreas,
  };
}

// Calculate trend by comparing with previous week
export function calculateTrend(
  currentScorecard: WeeklyScorecard,
  previousScorecard?: WeeklyScorecard
): WeeklyScorecard {
  if (!previousScorecard) return currentScorecard;

  const updatedDimensions = currentScorecard.dimensions.map(dim => {
    const prevDim = previousScorecard.dimensions.find(d => d.key === dim.key);
    if (!prevDim) return dim;

    const diff = dim.percentage - prevDim.percentage;
    return {
      ...dim,
      trend: diff > 2 ? 'up' as const : diff < -2 ? 'down' as const : 'stable' as const,
      trendValue: Number(diff.toFixed(1)),
    };
  });

  return {
    ...currentScorecard,
    dimensions: updatedDimensions,
  };
}
