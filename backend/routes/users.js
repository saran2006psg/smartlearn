const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, email, name, profile_image, role, preferences, 
        created_at, updated_at,
        (SELECT COUNT(*) FROM user_progress WHERE user_id = users.id) as lessons_completed,
        (SELECT COUNT(*) FROM translations WHERE user_id = users.id) as translations_count,
        (SELECT COUNT(*) FROM user_activities WHERE user_id = users.id) as activities_count
      FROM users 
      WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, profile_image, preferences } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           profile_image = COALESCE($2, profile_image), 
           preferences = COALESCE($3, preferences),
           updated_at = NOW()
       WHERE id = $4 
       RETURNING id, email, name, profile_image, role, preferences, created_at, updated_at`,
      [name, profile_image, JSON.stringify(preferences), req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user progress overview
router.get('/progress', auth, async (req, res) => {
  try {
    // Get overall progress
    const progressResult = await pool.query(
      `SELECT 
        COUNT(*) as total_lessons,
        COUNT(CASE WHEN completion_percentage = 100 THEN 1 END) as completed_lessons,
        AVG(completion_percentage) as average_progress,
        SUM(time_spent) as total_time_spent
      FROM user_progress 
      WHERE user_id = $1`,
      [req.user.id]
    );

    // Get progress by category
    const categoryProgress = await pool.query(
      `SELECT 
        l.category,
        COUNT(up.id) as total_lessons,
        COUNT(CASE WHEN up.completion_percentage = 100 THEN 1 END) as completed_lessons,
        AVG(up.completion_percentage) as average_progress
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
      WHERE l.is_published = true
      GROUP BY l.category`,
      [req.user.id]
    );

    // Get recent activity
    const recentActivity = await pool.query(
      `SELECT 
        activity_type,
        activity_data,
        timestamp
      FROM user_activities 
      WHERE user_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 10`,
      [req.user.id]
    );

    res.json({
      overview: progressResult.rows[0],
      byCategory: categoryProgress.rows,
      recentActivity: recentActivity.rows
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress data' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Learning streak
    const streakResult = await pool.query(
      `SELECT COUNT(DISTINCT DATE(timestamp)) as current_streak
       FROM user_activities 
       WHERE user_id = $1 
       AND activity_type = 'lesson_completed'
       AND timestamp >= CURRENT_DATE - INTERVAL '7 days'`,
      [req.user.id]
    );

    // Weekly progress
    const weeklyProgress = await pool.query(
      `SELECT 
        DATE(timestamp) as date,
        COUNT(*) as activities_count
       FROM user_activities 
       WHERE user_id = $1 
       AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(timestamp)
       ORDER BY date`,
      [req.user.id]
    );

    // Achievement stats
    const achievements = await pool.query(
      `SELECT 
        COUNT(CASE WHEN completion_percentage = 100 THEN 1 END) as lessons_completed,
        COUNT(CASE WHEN score >= 80 THEN 1 END) as high_scores,
        COUNT(DISTINCT lesson_id) as unique_lessons
       FROM user_progress 
       WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({
      streak: streakResult.rows[0].current_streak,
      weeklyProgress: weeklyProgress.rows,
      achievements: achievements.rows[0]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});

// Get user learning timeline
router.get('/timeline', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const timeline = await pool.query(
      `SELECT 
        DATE(timestamp) as date,
        activity_type,
        activity_data,
        COUNT(*) as activity_count
       FROM user_activities 
       WHERE user_id = $1 
       AND timestamp >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(timestamp), activity_type, activity_data
       ORDER BY date DESC, activity_count DESC`,
      [req.user.id]
    );

    res.json({ timeline: timeline.rows });
  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({ error: 'Failed to get learning timeline' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;

    const result = await pool.query(
      'UPDATE users SET preferences = $1, updated_at = NOW() WHERE id = $2 RETURNING preferences',
      [JSON.stringify(preferences), req.user.id]
    );

    res.json({ preferences: result.rows[0].preferences });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get user achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const achievements = [
      {
        id: 'first_lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        unlocked: false
      },
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        unlocked: false
      },
      {
        id: 'lessons_10',
        title: 'Dedicated Learner',
        description: 'Complete 10 lessons',
        icon: '📚',
        unlocked: false
      },
      {
        id: 'perfect_score',
        title: 'Perfect Score',
        description: 'Get 100% on any lesson',
        icon: '⭐',
        unlocked: false
      },
      {
        id: 'translations_50',
        title: 'Language Explorer',
        description: 'Use translation tool 50 times',
        icon: '🌍',
        unlocked: false
      }
    ];

    // Check which achievements are unlocked
    const stats = await pool.query(
      `SELECT 
        COUNT(CASE WHEN completion_percentage = 100 THEN 1 END) as completed_lessons,
        COUNT(CASE WHEN score = 100 THEN 1 END) as perfect_scores,
        (SELECT COUNT(*) FROM translations WHERE user_id = $1) as translations_count
       FROM user_progress 
       WHERE user_id = $1`,
      [req.user.id]
    );

    const userStats = stats.rows[0];

    // Update achievement status
    achievements.forEach(achievement => {
      switch (achievement.id) {
        case 'first_lesson':
          achievement.unlocked = userStats.completed_lessons > 0;
          break;
        case 'lessons_10':
          achievement.unlocked = userStats.completed_lessons >= 10;
          break;
        case 'perfect_score':
          achievement.unlocked = userStats.perfect_scores > 0;
          break;
        case 'translations_50':
          achievement.unlocked = userStats.translations_count >= 50;
          break;
      }
    });

    res.json({ achievements });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

// Get all users (admin only)
router.get('/', auth, requireRole(['hr']), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role (admin only)
router.put('/:id/role', auth, requireRole(['hr']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'teacher', 'parent', 'hr'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await pool.query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, name, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

module.exports = router; 