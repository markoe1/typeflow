// TypeFlow - Lessons Logic
class LessonsManager {
  constructor() {
    this.totalLessons = 8;
    this.masteryThreshold = 90; // 90% accuracy required
    this.init();
  }

  init() {
    this.loadProgress();
    this.updateLessonStates();
  }

  loadProgress() {
    const savedProgress = localStorage.getItem('typeflow-lessons-progress');
    this.progress = savedProgress ? JSON.parse(savedProgress) : {
      completed: [], // Array of completed lesson numbers
      scores: {} // Object with lesson numbers as keys and accuracy scores as values
    };
  }

  saveProgress() {
    localStorage.setItem('typeflow-lessons-progress', JSON.stringify(this.progress));
  }

  updateLessonStates() {
    for (let i = 1; i <= this.totalLessons; i++) {
      const lessonCard = document.querySelector(`[data-lesson="${i}"]`);
      if (!lessonCard) continue;

      const isUnlocked = this.isLessonUnlocked(i);
      const isCompleted = this.isLessonCompleted(i);

      if (isUnlocked) {
        this.unlockLesson(lessonCard, i);
        
        if (isCompleted) {
          this.markLessonCompleted(lessonCard, i);
        }
      } else {
        this.lockLesson(lessonCard, i);
      }
    }
  }

  isLessonUnlocked(lessonNumber) {
    // Lesson 1 is always unlocked
    if (lessonNumber === 1) return true;
    
    // Other lessons are unlocked if the previous lesson is completed with 90%+ accuracy
    const previousLesson = lessonNumber - 1;
    return this.isLessonCompleted(previousLesson);
  }

  isLessonCompleted(lessonNumber) {
    return this.progress.completed.includes(lessonNumber);
  }

  getLessonScore(lessonNumber) {
    return this.progress.scores[lessonNumber] || 0;
  }

  completeLesson(lessonNumber, accuracy) {
    // Save the score
    this.progress.scores[lessonNumber] = accuracy;
    
    // Mark as completed if accuracy is 90% or higher
    if (accuracy >= this.masteryThreshold && !this.progress.completed.includes(lessonNumber)) {
      this.progress.completed.push(lessonNumber);
    }
    
    this.saveProgress();
    this.updateLessonStates();
  }

  unlockLesson(lessonCard, lessonNumber) {
    lessonCard.classList.remove('locked');
    
    // Update the link
    if (lessonCard.tagName.toLowerCase() !== 'a') {
      const newLink = document.createElement('a');
      newLink.href = `lesson-detail.html?lesson=${lessonNumber}`;
      newLink.className = lessonCard.className;
      newLink.dataset.lesson = lessonNumber;
      newLink.innerHTML = lessonCard.innerHTML;
      lessonCard.parentNode.replaceChild(newLink, lessonCard);
      lessonCard = newLink;
    }
    
    // Update the number display
    const numberElement = lessonCard.querySelector('.lesson-number');
    const arrowElement = lessonCard.querySelector('.lesson-arrow');
    
    if (numberElement) {
      numberElement.textContent = lessonNumber;
    }
    
    if (arrowElement) {
      arrowElement.textContent = '→';
    }
  }

  lockLesson(lessonCard, lessonNumber) {
    lessonCard.classList.add('locked');
    
    // Remove link functionality
    if (lessonCard.tagName.toLowerCase() === 'a') {
      const newDiv = document.createElement('div');
      newDiv.className = lessonCard.className;
      newDiv.dataset.lesson = lessonNumber;
      newDiv.innerHTML = lessonCard.innerHTML;
      lessonCard.parentNode.replaceChild(newDiv, lessonCard);
      lessonCard = newDiv;
    }
    
    // Update the display
    const numberElement = lessonCard.querySelector('.lesson-number');
    const arrowElement = lessonCard.querySelector('.lesson-arrow');
    
    if (numberElement) {
      numberElement.textContent = '🔒';
    }
    
    if (arrowElement) {
      arrowElement.textContent = '🔒';
    }
  }

  markLessonCompleted(lessonCard, lessonNumber) {
    const score = this.getLessonScore(lessonNumber);
    
    // Add completion indicator (could be a checkmark or different styling)
    lessonCard.classList.add('completed');
    
    // Optionally show the score
    const titleElement = lessonCard.querySelector('.lesson-title');
    if (titleElement && score >= this.masteryThreshold) {
      titleElement.innerHTML += ` <span class="completion-badge">✓ ${score}%</span>`;
    }
  }

  resetProgress() {
    if (confirm('Are you sure you want to reset all lesson progress? This cannot be undone.')) {
      this.progress = {
        completed: [],
        scores: {}
      };
      this.saveProgress();
      this.updateLessonStates();
    }
  }

  getNextUnlockedLesson() {
    for (let i = 1; i <= this.totalLessons; i++) {
      if (this.isLessonUnlocked(i) && !this.isLessonCompleted(i)) {
        return i;
      }
    }
    return null; // All lessons completed
  }

  getTotalProgress() {
    return {
      completed: this.progress.completed.length,
      total: this.totalLessons,
      percentage: Math.round((this.progress.completed.length / this.totalLessons) * 100)
    };
  }
}

// Initialize lessons manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.lessonsManager = new LessonsManager();
  
  // Add some additional styling for completion badges
  const style = document.createElement('style');
  style.textContent = `
    .lesson-card.completed {
      border-color: var(--correct) !important;
    }
    
    .completion-badge {
      font-size: 0.8rem;
      color: var(--correct);
      font-weight: 600;
    }
    
    .lesson-card:hover.locked {
      transform: none;
      border-color: var(--border);
    }
  `;
  document.head.appendChild(style);
});

// Export for use in lesson detail page
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LessonsManager;
}