// API configuration file for alumni portal
// Centralizes API calls used across the React frontend.  Updated to
// mirror the routes exposed by the alternate backend implementation.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// -----------------------------
// Authentication
// -----------------------------
export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error(`Invalid JSON from server (status ${res.status})`);
    }
    if (!res.ok) {
      // If backend provided a message, use it; otherwise fall back to status text.
      throw new Error(data.message || `Login failed with status ${res.status}`);
    }
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Register failed with status ${res.status}`);
    }
    return data;
  },
};

// -----------------------------
// Profile management
// -----------------------------
export const profileAPI = {
  getByEmail: (email) =>
    fetch(`${API_BASE_URL}/profile/${encodeURIComponent(email)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return res.json();
    }),

  save: (profileData) =>
    fetch(`${API_BASE_URL}/profile/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    }).then((res) => res.json()),

  uploadPhoto: (formData) =>
    fetch(`${API_BASE_URL}/profile/upload-photo`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json()),
};


// -----------------------------
// Posts / Home feed
// -----------------------------
export const postsAPI = {
  // payload is JSON object { userId, fullName, year, postDescription, postImagePath, imageUrl }
  create: (payload) =>
    fetch(`${API_BASE_URL}/posts/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json()),

  list: () =>
    fetch(`${API_BASE_URL}/posts`, { method: "GET" }).then((res) => res.json()),

  listByUser: (userId) =>
    fetch(`${API_BASE_URL}/posts/user/${userId}`, { method: "GET" }).then((res) => res.json()),

  delete: (postId, userId) =>
    fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).then((res) => res.json()),

  uploadImage: (formData) =>
    fetch(`${API_BASE_URL}/posts/upload-image`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json()),
};

// -----------------------------
// Admin endpoints (optional)
// -----------------------------
export const adminAPI = {
  getUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 404) {
      console.warn("admin/users endpoint not present");
      return [];
    }
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return res.json();
  },

  updateUserStatus: async (email, status) => {
    const res = await fetch(`${API_BASE_URL}/admin/update-status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, status }),
    });
    if (res.status === 404) {
      throw new Error("admin/update-status not available");
    }
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return res.json();
  },
};

// alumni endpoints
export const alumniAPI = {
  list: async (filters = {}) => {
    const url = new URL(`${API_BASE_URL}/alumni`);
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== 'all') url.searchParams.append(k, v);
    });
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Fetch alumni failed: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  },
  get: async (id) => {
    const res = await fetch(`${API_BASE_URL}/alumni/${id}`);
    if (!res.ok) throw new Error(`Fetch alumni ${id} failed: ${res.status}`);
    const data = await res.json();
    return data.data || data;
  },
};

// job postings endpoints
export const jobAPI = {
  create: async (postData) => {
    const res = await fetch(`${API_BASE_URL}/job-posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Job post failed with status ${res.status}`);
    }
    return data;
  },
  list: async () => {
    const res = await fetch(`${API_BASE_URL}/job-posts`, { method: "GET" });
    if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
    return res.json();
  },
};

// event endpoints (mirror database schema)
export const eventsAPI = {
  create: async (eventData) => {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Event creation failed with status ${res.status}`);
    }
    return data;
  },
  list: async () => {
    const res = await fetch(`${API_BASE_URL}/events`, { method: "GET" });
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
    return res.json();
  },
};

// helpers
export const getStoredUser = () => {
  try {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error reading stored user:", error);
    return null;
  }
};

export const setStoredUser = (user) => {
  try {
    if (!user) {
      localStorage.removeItem("user");
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
    // notify listeners in the same window/tab
    window.dispatchEvent(new CustomEvent('userUpdated', { detail: user }));
  } catch (error) {
    console.error("Error writing stored user:", error);
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export { API_BASE_URL };
export default API_BASE_URL;
