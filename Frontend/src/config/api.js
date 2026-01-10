// API Configuration
export const API_BASE_URL = "http://localhost:5001";

export const apiEndpoints = {
  // Auth endpoints
  signup: `${API_BASE_URL}/signup`,
  login: `${API_BASE_URL}/login`,
  logout: `${API_BASE_URL}/logout`,
  validate: `${API_BASE_URL}/validate`,

  // Lost items endpoints
  reportLost: `${API_BASE_URL}/reportlost`,
  getAllLostPosts: `${API_BASE_URL}/alllostpost`,
  deleteLostPost: (id) => `${API_BASE_URL}/alllostpost/${id}`,
  updateLostPost: (id) => `${API_BASE_URL}/alllostpost/${id}`,

  // Found items endpoints
  postFound: `${API_BASE_URL}/postfound`,
  getAllFoundPosts: `${API_BASE_URL}/allfoundpost`,
  deleteFoundPost: (id) => `${API_BASE_URL}/allfoundpost/${id}`,
  updateFoundPost: (id) => `${API_BASE_URL}/allfoundpost/${id}`,

  // User endpoints
  getProfile: (id) => `${API_BASE_URL}/profile/${id}`,
  updateProfilePicture: (id) => `${API_BASE_URL}/update-profile-picture/${id}`,
  getAllUsers: `${API_BASE_URL}/users`,
  deleteUser: (id) => `${API_BASE_URL}/users/${id}`,

  // Categories
  getCategories: `${API_BASE_URL}/categories`,

  // Messaging
  getConversations: `${API_BASE_URL}/conversations`,
  createConversation: `${API_BASE_URL}/conversations`,
  getMessages: (conversationId) => `${API_BASE_URL}/messages/${conversationId}`,
  sendMessage: `${API_BASE_URL}/messages`,
  getUnreadCount: `${API_BASE_URL}/messages/unread/count`,

  // Smart Matching
  getMatchesForLost: (id) => `${API_BASE_URL}/match/lost/${id}`,
  getMatchesForFound: (id) => `${API_BASE_URL}/match/found/${id}`,

  // Bookmarks
  toggleBookmark: `${API_BASE_URL}/bookmarks`,
  addBookmark: `${API_BASE_URL}/bookmarks`,
  removeBookmark: `${API_BASE_URL}/bookmarks`,
  getBookmarks: `${API_BASE_URL}/bookmarks`,
  checkBookmark: (postId) => `${API_BASE_URL}/bookmarks/check/${postId}`,

  // Ratings & Thanks
  submitRating: `${API_BASE_URL}/ratings`,
  getUserRatings: (userId) => `${API_BASE_URL}/ratings/${userId}`,
  sendThanks: (userId) => `${API_BASE_URL}/thanks/${userId}`,

  // Claims
  submitClaim: `${API_BASE_URL}/claims`,
  getClaimsForPost: (postId) => `${API_BASE_URL}/claims/post/${postId}`,
  updateClaim: (id) => `${API_BASE_URL}/claims/${id}`,

  // Notifications
  getNotifications: `${API_BASE_URL}/notifications`,
  markNotificationsRead: `${API_BASE_URL}/notifications/read`,
  getNotificationCount: `${API_BASE_URL}/notifications/unread/count`,

  // Stats
  getStats: `${API_BASE_URL}/stats`,

  // Search
  advancedSearch: `${API_BASE_URL}/search`,

  // User Preferences
  updatePreferences: `${API_BASE_URL}/user/preferences`,
  getPreferences: `${API_BASE_URL}/user/preferences`,

  // Expiry cleanup
  cleanupExpired: `${API_BASE_URL}/cleanup-expired`,
};
