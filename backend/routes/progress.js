const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's overall progress
router.get('/overview', auth, async (req, res) => {
  try {
    // Total lessons available
    const totalLessonsResult = await pool.query(
      'SELECT COUNT(*) as total FROM lessons WHERE is_published = true'
    );

    // User's completed lessons
    const completedResult = await pool.query(
      'SELECT COUNT(*) as completed FROM user_progress WHERE user_id = $1 AND completion_percentage >= 100',
      [req.user.id]
    );

    // Total time spent learning
    const timeResult = await pool.query(
      'SELECT COALESCE(SUM(time_spent), 0) as total_time FROM user_progress WHERE user_id = $1',
      [req.user.id]
    );

    // Average score
    const scoreResult = await pool.query(
      'SELECT COALESCE(AVG(score), 0) as avg_score FROM user_progress WHERE user_id = $1 AND score IS NOT NULL',
      [req.user.id]
    );

    // Current streak (consecutive days)
    const streakResult = await pool.query(
      `SELECT COUNT(DISTINCT DATE(last_accessed)) as streak
       FROM user_progress
       WHERE user_id = $1
       AND last_accessed >= (
         SELECT COALESCE(MAX(last_accessed), NOW())
         FROM user_progress
         WHERE user_id = $1
         AND last_accessed < CURRENT_DATE
       )`,
      [req.user.id]
    );

    res.json({
      overview: {
        totalLessons: parseInt(totalLessonsResult.rows[0].total),
        completedLessons: parseInt(completedResult.rows[0].completed),
        totalTimeSpent: parseInt(timeResult.rows[0].total_time),
        averageScore: parseFloat(scoreResult.rows[0].avg_score),
        currentStreak: parseInt(streakResult.rows[0].streak),
        completionRate: totalLessonsResult.rows[0].total > 0 
          ? Math.round((completedResult.rows[0].completed / totalLessonsResult.rows[0].total) * 100)
          : 0
      }
    });
  } catch (error) {
    console.error('Get progress overview error:', error);
    res.status(500).json({ error: 'Failed to fetch progress overview' });
  }
});

// Get progress by category
router.get('/by-category', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        l.category,
        COUNT(*) as total_lessons,
        COUNT(CASE WHEN up.completion_percentage >= 100 THEN 1 END) as completed_lessons,
        COALESCE(AVG(up.completion_percentage), 0) as avg_completion,
        COALESCE(AVG(up.score), 0) as avg_score,
        COALESCE(SUM(up.time_spent), 0) as total_time
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       WHERE l.is_published = true
       GROUP BY l.category
       ORDER BY l.category`,
      [req.user.id]
    );

    res.json({ progressByCategory: result.rows });
  } catch (error) {
    console.error('Get progress by category error:', error);
    res.status(500).json({ error: 'Failed to fetch progress by category' });
  }
});

// Get progress by level
router.get('/by-level', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        l.level,
        COUNT(*) as total_lessons,
        COUNT(CASE WHEN up.completion_percentage >= 100 THEN 1 END) as completed_lessons,
        COALESCE(AVG(up.completion_percentage), 0) as avg_completion,
        COALESCE(AVG(up.score), 0) as avg_score,
        COALESCE(SUM(up.time_spent), 0) as total_time
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       WHERE l.is_published = true
       GROUP BY l.level
       ORDER BY 
         CASE l.level 
           WHEN 'beginner' THEN 1 
           WHEN 'intermediate' THEN 2 
           WHEN 'advanced' THEN 3 
         END`,
      [req.user.id]
    );

    res.json({ progressByLevel: result.rows });
  } catch (error) {
    console.error('Get progress by level error:', error);
    res.status(500).json({ error: 'Failed to fetch progress by level' });
  }
});

// Get recent activity
router.get('/recent-activity', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await pool.query(
      `SELECT 
        ua.activity_type,
        ua.activity_data,
        ua.timestamp,
        l.title as lesson_title,
        l.category as lesson_category
       FROM user_activities ua
       LEFT JOIN lessons l ON (ua.activity_data->>'lessonId')::uuid = l.id
       WHERE ua.user_id = $1
       ORDER BY ua.timestamp DESC
       LIMIT $2`,
      [req.user.id, parseInt(limit)]
    );

    res.json({ recentActivity: result.rows });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Get learning timeline
router.get('/timeline', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT 
        DATE(up.last_accessed) as date,
        COUNT(*) as lessons_accessed,
        COUNT(CASE WHEN up.completion_percentage >= 100 THEN 1 END) as lessons_completed,
        COALESCE(SUM(up.time_spent), 0) as time_spent,
        COALESCE(AVG(up.score), 0) as avg_score
       FROM user_progress up
       WHERE up.user_id = $1
       AND up.last_accessed >= NOW() - INTERVAL '1 day' * $2
       GROUP BY DATE(up.last_accessed)
       ORDER BY date DESC`,
      [req.user.id, parseInt(days)]
    );

    res.json({ timeline: result.rows });
  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// Get performance metrics
router.get('/performance', auth, async (req, res) => {
  try {
    // Weekly performance
    const weeklyResult = await pool.query(
      `SELECT 
        COUNT(*) as lessons_completed,
        COALESCE(SUM(time_spent), 0) as time_spent,
        COALESCE(AVG(score), 0) as avg_score
       FROM user_progress
       WHERE user_id = $1
       AND last_accessed >= NOW() - INTERVAL '7 days'`,
      [req.user.id]
    );

    // Monthly performance
    const monthlyResult = await pool.query(
      `SELECT 
        COUNT(*) as lessons_completed,
        COALESCE(SUM(time_spent), 0) as time_spent,
        COALESCE(AVG(score), 0) as avg_score
       FROM user_progress
       WHERE user_id = $1
       AND last_accessed >= NOW() - INTERVAL '30 days'`,
      [req.user.id]
    );

    // Best performing category
    const bestCategoryResult = await pool.query(
      `SELECT 
        l.category,
        AVG(up.score) as avg_score
       FROM user_progress up
       JOIN lessons l ON up.lesson_id = l.id
       WHERE up.user_id = $1 AND up.score IS NOT NULL
       GROUP BY l.category
       ORDER BY avg_score DESC
       LIMIT 1`,
      [req.user.id]
    );

    res.json({
      performance: {
        weekly: {
          lessonsCompleted: parseInt(weeklyResult.rows[0].lessons_completed),
          timeSpent: parseInt(weeklyResult.rows[0].time_spent),
          averageScore: parseFloat(weeklyResult.rows[0].avg_score)
        },
        monthly: {
          lessonsCompleted: parseInt(monthlyResult.rows[0].lessons_completed),
          timeSpent: parseInt(monthlyResult.rows[0].time_spent),
          averageScore: parseFloat(monthlyResult.rows[0].avg_score)
        },
        bestCategory: bestCategoryResult.rows[0] || null
      }
    });
  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

// Get achievements/badges
router.get('/achievements', auth, async (req, res) => {
  try {
    const achievements = [];

    // Check for completion milestones
    const completionResult = await pool.query(
      'SELECT COUNT(*) as completed FROM user_progress WHERE user_id = $1 AND completion_percentage >= 100',
      [req.user.id]
    );

    const completedCount = parseInt(completionResult.rows[0].completed);
    
    if (completedCount >= 1) achievements.push({ type: 'first_lesson', title: 'First Step', description: 'Completed your first lesson' });
    if (completedCount >= 5) achievements.push({ type: 'five_lessons', title: 'Getting Started', description: 'Completed 5 lessons' });
    if (completedCount >= 10) achievements.push({ type: 'ten_lessons', title: 'Dedicated Learner', description: 'Completed 10 lessons' });
    if (completedCount >= 25) achievements.push({ type: 'twenty_five_lessons', title: 'Learning Champion', description: 'Completed 25 lessons' });

    // Check for time milestones
    const timeResult = await pool.query(
      'SELECT COALESCE(SUM(time_spent), 0) as total_time FROM user_progress WHERE user_id = $1',
      [req.user.id]
    );

    const totalTime = parseInt(timeResult.rows[0].total_time);
    const hoursSpent = Math.floor(totalTime / 3600);

    if (hoursSpent >= 1) achievements.push({ type: 'one_hour', title: 'Time Invested', description: 'Spent 1 hour learning' });
    if (hoursSpent >= 5) achievements.push({ type: 'five_hours', title: 'Dedicated Time', description: 'Spent 5 hours learning' });
    if (hoursSpent >= 10) achievements.push({ type: 'ten_hours', title: 'Learning Enthusiast', description: 'Spent 10 hours learning' });

    // Check for streak achievements
    const streakResult = await pool.query(
      `SELECT COUNT(DISTINCT DATE(last_accessed)) as streak
       FROM user_progress
       WHERE user_id = $1
       AND last_accessed >= (
         SELECT COALESCE(MAX(last_accessed), NOW())
         FROM user_progress
         WHERE user_id = $1
         AND last_accessed < CURRENT_DATE
       )`,
      [req.user.id]
    );

    const currentStreak = parseInt(streakResult.rows[0].streak);
    
    if (currentStreak >= 3) achievements.push({ type: 'three_day_streak', title: 'Consistent Learner', description: '3-day learning streak' });
    if (currentStreak >= 7) achievements.push({ type: 'week_streak', title: 'Weekly Warrior', description: '7-day learning streak' });
    if (currentStreak >= 30) achievements.push({ type: 'month_streak', title: 'Monthly Master', description: '30-day learning streak' });

    res.json({ achievements });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

module.exports = router; 