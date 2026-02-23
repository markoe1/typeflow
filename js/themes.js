// Theme Management for TypeFlow
class ThemeManager {
  constructor() {
    this.themes = ['dark', 'light', 'retro'];
    this.currentTheme = this.loadTheme();
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeButtons();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('typeflow-theme');
    return this.themes.includes(savedTheme) ? savedTheme : 'dark';
  }

  saveTheme(theme) {
    localStorage.setItem('typeflow-theme', theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.updateActiveButton();
    this.saveTheme(theme);
  }

  setupThemeButtons() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        if (this.themes.includes(theme)) {
          this.applyTheme(theme);
        }
      });
    });

    this.updateActiveButton();
  }

  updateActiveButton() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
      const theme = button.dataset.theme;
      button.classList.toggle('active', theme === this.currentTheme);
    });
  }

  switchTheme(theme) {
    if (this.themes.includes(theme)) {
      this.applyTheme(theme);
    }
  }

  getTheme() {
    return this.currentTheme;
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}