const express = require('express');
const pool = require('../config/database');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Translate text with avatar support
router.post('/translate', auth, async (req, res) => {
  try {
    const { text, sourceLanguage = 'en', targetLanguage = 'isl', avatarType = 'default' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Generate avatar URL based on type and text
    const avatarUrl = generateAvatarUrl(text, avatarType, targetLanguage);

    // Create translation record
    const result = await pool.query(
      `INSERT INTO translations (user_id, original_text, source_language, target_language, translated_content, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.id,
        text.trim(),
        sourceLanguage,
        targetLanguage,
        JSON.stringify({
          original: text.trim(),
          translated: generateTranslation(text, sourceLanguage, targetLanguage),
          avatarUrl,
          timestamp: new Date().toISOString()
        }),
        avatarUrl
      ]
    );

    // Record activity
    await pool.query(
      'INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES ($1, $2, $3)',
      [req.user.id, 'translation_created', JSON.stringify({
        text_length: text.length,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        avatar_type: avatarType
      })]
    );

    res.json({
      translation: result.rows[0],
      avatarUrl,
      translatedText: generateTranslation(text, sourceLanguage, targetLanguage)
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Get translation history
router.get('/history', auth, async (req, res) => {
  try {
    const { limit = 20, offset = 0, language } = req.query;
    
    let query = `
      SELECT 
        id, original_text, source_language, target_language, 
        translated_content, avatar_url, created_at
      FROM translations 
      WHERE user_id = $1
    `;
    
    const params = [req.user.id];
    let paramCount = 1;

    if (language) {
      paramCount++;
      query += ` AND (source_language = $${paramCount} OR target_language = $${paramCount})`;
      params.push(language);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    
    res.json({ translations: result.rows });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch translation history' });
  }
});

// Get translation statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Overall stats
    const overallStats = await pool.query(
      `SELECT 
        COUNT(*) as total_translations,
        COUNT(DISTINCT DATE(created_at)) as active_days,
        AVG(LENGTH(original_text)) as avg_text_length
       FROM translations 
       WHERE user_id = $1`,
      [req.user.id]
    );

    // Language usage stats
    const languageStats = await pool.query(
      `SELECT 
        target_language,
        COUNT(*) as usage_count,
        AVG(LENGTH(original_text)) as avg_length
       FROM translations 
       WHERE user_id = $1 
       GROUP BY target_language 
       ORDER BY usage_count DESC`,
      [req.user.id]
    );

    // Recent activity
    const recentActivity = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as translations_count
       FROM translations 
       WHERE user_id = $1 
       AND created_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [req.user.id]
    );

    res.json({
      overall: overallStats.rows[0],
      byLanguage: languageStats.rows,
      recentActivity: recentActivity.rows
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch translation statistics' });
  }
});

// Delete translation
router.delete('/history/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM translations WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    res.json({ message: 'Translation deleted successfully' });
  } catch (error) {
    console.error('Delete translation error:', error);
    res.status(500).json({ error: 'Failed to delete translation' });
  }
});

// Get available avatar types
router.get('/avatars', auth, async (req, res) => {
  try {
    const avatarTypes = [
      {
        id: 'default',
        name: 'Default Avatar',
        description: 'Standard signing avatar',
        preview: '/api/translations/avatar/preview/default'
      },
      {
        id: 'friendly',
        name: 'Friendly Avatar',
        description: 'Warm and welcoming avatar',
        preview: '/api/translations/avatar/preview/friendly'
      },
      {
        id: 'professional',
        name: 'Professional Avatar',
        description: 'Formal and business-like',
        preview: '/api/translations/avatar/preview/professional'
      },
      {
        id: 'animated',
        name: 'Animated Avatar',
        description: 'Dynamic and expressive',
        preview: '/api/translations/avatar/preview/animated'
      },
      {
        id: 'custom',
        name: 'Custom Avatar',
        description: 'Personalized avatar settings',
        preview: '/api/translations/avatar/preview/custom'
      }
    ];

    res.json({ avatarTypes });
  } catch (error) {
    console.error('Get avatars error:', error);
    res.status(500).json({ error: 'Failed to fetch avatar types' });
  }
});

// Get avatar preview
router.get('/avatar/preview/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const { text = 'Hello World' } = req.query;

    const avatarUrl = generateAvatarUrl(text, type, 'isl');
    
    res.json({ 
      avatarUrl,
      type,
      sampleText: text
    });
  } catch (error) {
    console.error('Get avatar preview error:', error);
    res.status(500).json({ error: 'Failed to generate avatar preview' });
  }
});

// Favorite/unfavorite translation
router.post('/history/:id/favorite', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { favorite = true } = req.body;

    const result = await pool.query(
      `UPDATE translations 
       SET translated_content = jsonb_set(
         translated_content, 
         '{favorite}', 
         $1::jsonb
       )
       WHERE id = $2 AND user_id = $3
       RETURNING id`,
      [JSON.stringify(favorite), id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    res.json({ 
      message: favorite ? 'Translation favorited' : 'Translation unfavorited',
      favorite 
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Failed to update favorite status' });
  }
});

// Get favorite translations
router.get('/favorites', auth, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT 
        id, original_text, source_language, target_language, 
        translated_content, avatar_url, created_at
       FROM translations 
       WHERE user_id = $1 
       AND translated_content->>'favorite' = 'true'
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    res.json({ favorites: result.rows });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorite translations' });
  }
});

// Export translation history
router.get('/export', auth, async (req, res) => {
  try {
    const { format = 'json', language } = req.query;
    
    let query = `
      SELECT 
        original_text, source_language, target_language, 
        translated_content, created_at
      FROM translations 
      WHERE user_id = $1
    `;
    
    const params = [req.user.id];

    if (language) {
      query += ` AND (source_language = $2 OR target_language = $2)`;
      params.push(language);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);

    if (format === 'csv') {
      const csv = generateCSV(result.rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="translations.csv"');
      res.send(csv);
    } else {
      res.json({ translations: result.rows });
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export translations' });
  }
});

// Helper functions
function generateAvatarUrl(text, avatarType, language) {
  const baseUrl = 'https://api.smartlearn.com/avatars';
  const textHash = Buffer.from(text).toString('base64').substring(0, 10);
  
  return `${baseUrl}/${avatarType}/${language}/${textHash}.mp4`;
}

function generateTranslation(text, sourceLanguage, targetLanguage) {
  // This is a mock translation - in production, you'd integrate with a real translation service
  const translations = {
    'en-isl': {
      'hello': 'नमस्ते',
      'world': 'दुनिया',
      'thank you': 'धन्यवाद',
      'good morning': 'सुप्रभात',
      'how are you': 'कैसे हो आप'
    },
    'hi-isl': {
      'hello': 'Hello',
      'world': 'World',
      'thank you': 'Thank you',
      'good morning': 'Good morning',
      'how are you': 'How are you'
    }
  };

  const key = `${sourceLanguage}-${targetLanguage}`;
  const translationMap = translations[key] || {};
  
  return translationMap[text.toLowerCase()] || `[${targetLanguage.toUpperCase()}: ${text}]`;
}

function generateCSV(translations) {
  const headers = ['Original Text', 'Source Language', 'Target Language', 'Translated Text', 'Date'];
  const rows = translations.map(t => [
    t.original_text,
    t.source_language,
    t.target_language,
    JSON.parse(t.translated_content).translated,
    new Date(t.created_at).toISOString()
  ]);

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

module.exports = router; 