const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async googleLogin(googleData) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updatePreferences(preferences) {
    return this.request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  // User profile methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserProgress() {
    return this.request('/users/progress');
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async getUserTimeline(days = 30) {
    return this.request(`/users/timeline?days=${days}`);
  }

  async getUserAchievements() {
    return this.request('/users/achievements');
  }

  // Lesson methods
  async getLessons(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/lessons?${params}`);
  }

  async getLesson(id) {
    return this.request(`/lessons/${id}`);
  }

  async updateLessonProgress(lessonId, progress) {
    return this.request(`/lessons/${lessonId}/progress`, {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  }

  async getLessonCategories() {
    return this.request('/lessons/categories/list');
  }

  async getLessonLevels() {
    return this.request('/lessons/levels/list');
  }

  async getRecommendedLessons() {
    return this.request('/lessons/recommended/list');
  }

  async initializeSampleLessons() {
    return this.request('/lessons/initialize-sample', {
      method: 'POST',
    });
  }

  // Translation methods
  async translateText(text, sourceLanguage = 'en', targetLanguage = 'isl', avatarType = 'default') {
    return this.request('/translations/translate', {
      method: 'POST',
      body: JSON.stringify({ text, sourceLanguage, targetLanguage, avatarType }),
    });
  }

  async getTranslationHistory(limit = 20, offset = 0, language) {
    const params = new URLSearchParams({ limit, offset });
    if (language) params.append('language', language);
    return this.request(`/translations/history?${params}`);
  }

  async deleteTranslation(id) {
    return this.request(`/translations/history/${id}`, {
      method: 'DELETE',
    });
  }

  async getTranslationStats() {
    return this.request('/translations/stats');
  }

  async getAvatarTypes() {
    return this.request('/translations/avatars');
  }

  async getAvatarPreview(type, text = 'Hello World') {
    return this.request(`/translations/avatar/preview/${type}?text=${encodeURIComponent(text)}`);
  }

  async toggleTranslationFavorite(id, favorite = true) {
    return this.request(`/translations/history/${id}/favorite`, {
      method: 'POST',
      body: JSON.stringify({ favorite }),
    });
  }

  async getFavoriteTranslations(limit = 20, offset = 0) {
    const params = new URLSearchParams({ limit, offset });
    return this.request(`/translations/favorites?${params}`);
  }

  async exportTranslations(format = 'json', language) {
    const params = new URLSearchParams({ format });
    if (language) params.append('language', language);
    return this.request(`/translations/export?${params}`);
  }

  // Progress methods
  async getProgressOverview() {
    return this.request('/progress/overview');
  }

  async getProgressByCategory() {
    return this.request('/progress/by-category');
  }

  async getProgressByLevel() {
    return this.request('/progress/by-level');
  }

  async getRecentActivity(limit = 10) {
    return this.request(`/progress/recent-activity?limit=${limit}`);
  }

  async getLearningTimeline(days = 30) {
    return this.request(`/progress/timeline?days=${days}`);
  }

  async getPerformanceMetrics() {
    return this.request('/progress/performance');
  }

  async getAchievements() {
    return this.request('/progress/achievements');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // File upload methods
  async uploadFile(file, type = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = this.getAuthToken();
    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  }

  // Search methods
  async searchLessons(query, filters = {}) {
    const params = new URLSearchParams({ search: query, ...filters });
    return this.request(`/lessons?${params}`);
  }

  async searchTranslations(query, language) {
    const params = new URLSearchParams({ search: query });
    if (language) params.append('language', language);
    return this.request(`/translations/history?${params}`);
  }

  // Analytics methods
  async getLearningAnalytics(timeframe = '7d') {
    return this.request(`/analytics/learning?timeframe=${timeframe}`);
  }

  async getUsageStats() {
    return this.request('/analytics/usage');
  }

  // Notification methods
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async updateNotificationSettings(settings) {
    return this.request('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 