const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, profileImage } = req.body;

    if (!googleId || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    let result = await pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [googleId, email]
    );

    let user;

    if (result.rows.length > 0) {
      // User exists, update if needed
      user = result.rows[0];
      if (user.google_id !== googleId || user.name !== name || user.profile_image !== profileImage) {
        await pool.query(
          'UPDATE users SET google_id = $1, name = $2, profile_image = $3, updated_at = NOW() WHERE id = $4',
          [googleId, name, profileImage, user.id]
        );
        user = { ...user, google_id: googleId, name, profile_image: profileImage };
      }
    } else {
      // Create new user
      result = await pool.query(
        'INSERT INTO users (google_id, email, name, profile_image) VALUES ($1, $2, $3, $4) RETURNING *',
        [googleId, email, name, profileImage]
      );
      user = result.rows[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Store session
    await pool.query(
      'INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)] // 7 days
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profile_image,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      await pool.query(
        'DELETE FROM user_sessions WHERE token = $1',
        [token]
      );
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, profile_image, role, preferences, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
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

module.exports = router; 