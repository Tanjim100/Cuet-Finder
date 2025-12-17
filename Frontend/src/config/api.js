// API Configuration
export const API_BASE_URL = 'http://localhost:5001';

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
};
