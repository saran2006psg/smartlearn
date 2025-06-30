const express = require('express');
const pool = require('../config/database');
const { auth, optionalAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all lessons with filters
router.get('/', auth, async (req, res) => {
  try {
    const { category, level, search, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        l.*,
        COALESCE(up.completion_percentage, 0) as user_progress,
        COALESCE(up.score, 0) as user_score,
        COALESCE(up.last_accessed, NULL) as last_accessed
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
      WHERE l.is_published = true
    `;
    
    const params = [req.user.id];
    let paramCount = 1;

    if (category) {
      paramCount++;
      query += ` AND l.category = $${paramCount}`;
      params.push(category);
    }

    if (level) {
      paramCount++;
      query += ` AND l.level = $${paramCount}`;
      params.push(level);
    }

    if (search) {
      paramCount++;
      query += ` AND (l.title ILIKE $${paramCount} OR l.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY l.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    
    res.json({ lessons: result.rows });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Get lesson by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT 
        l.*,
        COALESCE(up.completion_percentage, 0) as user_progress,
        COALESCE(up.score, 0) as user_score,
        COALESCE(up.time_spent, 0) as time_spent,
        COALESCE(up.last_accessed, NULL) as last_accessed,
        COALESCE(up.completed_at, NULL) as completed_at
      FROM lessons l
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
      WHERE l.id = $2 AND l.is_published = true`,
      [req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Record activity
    await pool.query(
      'INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES ($1, $2, $3)',
      [req.user.id, 'lesson_viewed', JSON.stringify({ lesson_id: id, lesson_title: result.rows[0].title })]
    );

    res.json({ lesson: result.rows[0] });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Create new lesson (admin/teacher only)
router.post('/', auth, requireRole(['teacher', 'hr']), async (req, res) => {
  try {
    const { title, description, category, level, duration, videoUrl, avatarData, content } = req.body;

    if (!title || !category || !level) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO lessons (title, description, category, level, duration, video_url, avatar_data, content, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, description, category, level, duration, videoUrl, avatarData, content, req.user.id]
    );

    res.status(201).json({ lesson: result.rows[0] });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Update lesson (admin/teacher only)
router.put('/:id', auth, requireRole(['teacher', 'hr']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, level, duration, videoUrl, avatarData, content, isPublished } = req.body;

    const result = await pool.query(
      `UPDATE lessons 
       SET title = $1, description = $2, category = $3, level = $4, duration = $5, 
           video_url = $6, avatar_data = $7, content = $8, is_published = $9, updated_at = NOW()
       WHERE id = $10 RETURNING *`,
      [title, description, category, level, duration, videoUrl, avatarData, content, isPublished, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ lesson: result.rows[0] });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete lesson (admin/teacher only)
router.delete('/:id', auth, requireRole(['teacher', 'hr']), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM lessons WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Update lesson progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { completion_percentage, score, time_spent } = req.body;

    // Check if lesson exists
    const lessonCheck = await pool.query(
      'SELECT id, title FROM lessons WHERE id = $1 AND is_published = true',
      [id]
    );

    if (lessonCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Update or insert progress
    const result = await pool.query(
      `INSERT INTO user_progress (user_id, lesson_id, completion_percentage, score, time_spent, last_accessed)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id, lesson_id) 
       DO UPDATE SET 
         completion_percentage = EXCLUDED.completion_percentage,
         score = EXCLUDED.score,
         time_spent = user_progress.time_spent + EXCLUDED.time_spent,
         last_accessed = NOW(),
         completed_at = CASE WHEN EXCLUDED.completion_percentage = 100 THEN NOW() ELSE user_progress.completed_at END
       RETURNING *`,
      [req.user.id, id, completion_percentage, score, time_spent]
    );

    // Record activity
    const activityType = completion_percentage === 100 ? 'lesson_completed' : 'lesson_progress';
    await pool.query(
      'INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES ($1, $2, $3)',
      [req.user.id, activityType, JSON.stringify({ 
        lesson_id: id, 
        lesson_title: lessonCheck.rows[0].title,
        completion_percentage,
        score,
        time_spent
      })]
    );

    res.json({ progress: result.rows[0] });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Get lesson categories
router.get('/categories/list', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT category, COUNT(*) as lesson_count
       FROM lessons 
       WHERE is_published = true 
       GROUP BY category 
       ORDER BY category`
    );
    
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get lesson levels
router.get('/levels/list', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT level, COUNT(*) as lesson_count
       FROM lessons 
       WHERE is_published = true 
       GROUP BY level 
       ORDER BY 
         CASE level 
           WHEN 'beginner' THEN 1 
           WHEN 'intermediate' THEN 2 
           WHEN 'advanced' THEN 3 
         END`
    );
    
    res.json({ levels: result.rows });
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ error: 'Failed to fetch levels' });
  }
});

// Get recommended lessons
router.get('/recommended/list', auth, async (req, res) => {
  try {
    // Get lessons based on user's progress and preferences
    const result = await pool.query(
      `SELECT 
        l.*,
        COALESCE(up.completion_percentage, 0) as user_progress
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       WHERE l.is_published = true 
       AND (up.id IS NULL OR up.completion_percentage < 100)
       ORDER BY 
         CASE 
           WHEN up.id IS NULL THEN 1
           ELSE 2
         END,
         l.created_at DESC
       LIMIT 10`,
      [req.user.id]
    );
    
    res.json({ recommended: result.rows });
  } catch (error) {
    console.error('Get recommended error:', error);
    res.status(500).json({ error: 'Failed to fetch recommended lessons' });
  }
});

// Initialize sample lessons (admin only)
router.post('/initialize-sample', auth, async (req, res) => {
  try {
    // Check if user is admin
    const userCheck = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userCheck.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const sampleLessons = [
      {
        title: 'Basic Alphabets - Hindi',
        description: 'Learn the fundamental Hindi alphabets with interactive exercises',
        category: 'alphabets',
        level: 'beginner',
        duration: 15,
        content: {
          slides: [
            { type: 'text', content: 'Welcome to Hindi Alphabets!', duration: 3 },
            { type: 'video', content: 'https://example.com/hindi-alphabets.mp4', duration: 5 },
            { type: 'quiz', content: { question: 'Which letter comes after अ?', options: ['आ', 'इ', 'ई', 'उ'], correct: 0 }, duration: 7 }
          ],
          exercises: [
            { type: 'matching', content: 'Match letters with their sounds' },
            { type: 'writing', content: 'Practice writing letters' }
          ]
        }
      },
      {
        title: 'Numbers 1-10 - English',
        description: 'Master counting from 1 to 10 in English',
        category: 'numbers',
        level: 'beginner',
        duration: 10,
        content: {
          slides: [
            { type: 'text', content: 'Let\'s learn numbers 1 to 10!', duration: 2 },
            { type: 'image', content: 'https://example.com/numbers-1-10.png', duration: 4 },
            { type: 'audio', content: 'https://example.com/numbers-pronunciation.mp3', duration: 3 },
            { type: 'quiz', content: { question: 'What comes after 5?', options: ['4', '6', '7', '8'], correct: 1 }, duration: 6 }
          ],
          exercises: [
            { type: 'counting', content: 'Count objects in the image' },
            { type: 'sequence', content: 'Arrange numbers in order' }
          ]
        }
      },
      {
        title: 'Simple Sentences - Gujarati',
        description: 'Learn to form basic sentences in Gujarati',
        category: 'sentences',
        level: 'beginner',
        duration: 20,
        content: {
          slides: [
            { type: 'text', content: 'Building sentences in Gujarati', duration: 3 },
            { type: 'video', content: 'https://example.com/gujarati-sentences.mp4', duration: 8 },
            { type: 'interactive', content: 'Drag and drop words to form sentences', duration: 9 }
          ],
          exercises: [
            { type: 'translation', content: 'Translate simple sentences' },
            { type: 'construction', content: 'Build your own sentences' }
          ]
        }
      },
      {
        title: 'Basic Math - Addition',
        description: 'Learn addition with visual aids and interactive problems',
        category: 'math',
        level: 'beginner',
        duration: 25,
        content: {
          slides: [
            { type: 'text', content: 'Let\'s add numbers together!', duration: 2 },
            { type: 'animation', content: 'https://example.com/addition-animation.mp4', duration: 6 },
            { type: 'quiz', content: { question: 'What is 3 + 4?', options: ['5', '6', '7', '8'], correct: 2 }, duration: 7 },
            { type: 'interactive', content: 'Use the number line to solve problems', duration: 10 }
          ],
          exercises: [
            { type: 'word_problems', content: 'Solve real-world addition problems' },
            { type: 'speed_math', content: 'Quick addition practice' }
          ]
        }
      },
      {
        title: 'Science - Parts of a Plant',
        description: 'Explore the different parts of plants and their functions',
        category: 'science',
        level: 'intermediate',
        duration: 30,
        content: {
          slides: [
            { type: 'text', content: 'Discover the amazing world of plants!', duration: 3 },
            { type: '3d_model', content: 'https://example.com/plant-3d-model.glb', duration: 10 },
            { type: 'video', content: 'https://example.com/plant-parts-explanation.mp4', duration: 8 },
            { type: 'quiz', content: { question: 'Which part carries water to the leaves?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], correct: 1 }, duration: 9 }
          ],
          exercises: [
            { type: 'labeling', content: 'Label the parts of a plant' },
            { type: 'experiment', content: 'Virtual plant dissection' }
          ]
        }
      }
    ];

    for (const lesson of sampleLessons) {
      await pool.query(
        `INSERT INTO lessons (title, description, category, level, duration, content, is_published, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, true, $7)
         ON CONFLICT (title) DO NOTHING`,
        [lesson.title, lesson.description, lesson.category, lesson.level, lesson.duration, JSON.stringify(lesson.content), req.user.id]
      );
    }

    res.json({ message: 'Sample lessons initialized successfully' });
  } catch (error) {
    console.error('Initialize sample lessons error:', error);
    res.status(500).json({ error: 'Failed to initialize sample lessons' });
  }
});

module.exports = router; 