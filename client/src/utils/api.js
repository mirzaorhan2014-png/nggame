import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  guestLogin: () => api.post('/auth/guest'),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me')
};

export const gamesAPI = {
  getAll: () => api.get('/games'),
  getGame: (gameId) => api.get(`/games/${gameId}`),
  createRoom: (gameId) => api.post('/games/room/create', { gameId })
};

export const storeAPI = {
  getItems: () => api.get('/store'),
  purchase: (itemId, itemType) => api.post('/store/purchase', { itemId, itemType }),
  getInventory: () => api.get('/store/inventory')
};

export const leaderboardAPI = {
  getGlobal: (limit = 100) => api.get(`/leaderboard/global?limit=${limit}`),
  getCountry: (country, limit = 100) => api.get(`/leaderboard/country/${country}?limit=${limit}`),
  getGame: (gameId, limit = 100) => api.get(`/leaderboard/game/${gameId}?limit=${limit}`),
  getClans: (country = null, limit = 100) => {
    const params = country ? `?country=${country}&limit=${limit}` : `?limit=${limit}`;
    return api.get(`/leaderboard/clans${params}`);
  },
  submitScore: (gameId, score) => api.post('/leaderboard/submit', { gameId, score })
};

export const clanAPI = {
  create: (clanData) => api.post('/clans', clanData),
  get: (clanId) => api.get(`/clans/${clanId}`),
  join: (clanId) => api.post(`/clans/${clanId}/join`),
  leave: () => api.post('/clans/leave')
};

export const tournamentAPI = {
  getAll: () => api.get('/tournaments'),
  get: (tournamentId) => api.get(`/tournaments/${tournamentId}`),
  register: (tournamentId) => api.post(`/tournaments/${tournamentId}/register`)
};

export const socialAPI = {
  sendFriendRequest: (userId) => api.post('/social/friends/request', { userId }),
  acceptFriendRequest: (requestId) => api.post('/social/friends/accept', { requestId }),
  getFriends: () => api.get('/social/friends'),
  sendMessage: (receiverId, content) => api.post('/social/messages', { receiverId, content }),
  getMessages: (userId, limit = 50) => api.get(`/social/messages/${userId}?limit=${limit}`),
  blockUser: (userId) => api.post('/social/block', { userId })
};

export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getStats: (userId) => api.get(`/users/${userId}/stats`)
};

export const achievementAPI = {
  getAll: () => api.get('/achievements'),
  getUserAchievements: (userId) => api.get(`/achievements/user/${userId}`)
};

export default api;
