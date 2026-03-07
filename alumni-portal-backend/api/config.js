/**
 * Frontend configuration file for accessing stored user data
 * This module provides utilities for accessing and managing user information
 * stored in localStorage in the browser
 */

/**
 * Retrieves the current logged-in user from localStorage
 * @returns {Object|null} User object with properties like email, fullName, profilePhoto, userId, etc.
 *                        Returns null if no user is logged in
 */
export const getStoredUser = () => {
  // Check if running in browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
};

/**
 * Stores user data in localStorage after successful login
 * @param {Object} userData - User object to store
 */
export const storeUser = (userData) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('user', JSON.stringify(userData));
    // Trigger a custom event so other components can listen for user updates
    window.dispatchEvent(new Event('userUpdated'));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Updates specific fields of the stored user data
 * @param {Object} updates - Object containing fields to update
 */
export const updateStoredUser = (updates) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const currentUser = getStoredUser() || {};
    const updatedUser = { ...currentUser, ...updates };
    storeUser(updatedUser);
  } catch (error) {
    console.error('Error updating stored user data:', error);
  }
};

/**
 * Clears all user data from localStorage (used on logout)
 */
export const clearStoredUser = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userUpdated'));
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};
