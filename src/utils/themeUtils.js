/**
 * Theme utility functions
 */

/**
 * Get the current theme based on localStorage or system preference
 * @returns {'dark'|'light'} - Current theme
 */
export const getInitialTheme = () => {
  // Check if localStorage is available
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }
  }
  
  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  
  // Default to light theme
  return 'light';
};

/**
 * Set the theme
 * @param {'dark'|'light'} theme - Theme to set
 */
export const setTheme = (theme) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

/**
 * Toggle between dark and light themes
 */
export const toggleTheme = () => {
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
};

/**
 * Initialize theme listener for system preference changes
 */
export const initializeThemeListener = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Add listener to respond to system theme changes
    const handleChange = (e) => {
      const storedTheme = window.localStorage.getItem('theme');
      if (!storedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Newer browsers support addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Deprecated method for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Return cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }
  
  // No cleanup needed if media query not supported
  return () => {};
};

export default {
  getInitialTheme,
  setTheme,
  toggleTheme,
  initializeThemeListener
}; 