// TypeFlow - Practice Mode Logic
class PracticeMode {
  constructor() {
    this.currentDifficulty = 'medium';
    this.currentIndex = 0;
    this.correctChars = 0;
    this.totalChars = 0;
    this.currentText = '';
    this.wordsGenerated = 0;
    this.wordsPerGeneration = 50;
    
    // Word lists by difficulty (same as typing test)
    this.wordLists = {
      easy: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'],
      medium: ['about', 'after', 'again', 'before', 'being', 'between', 'called', 'during', 'every', 'first', 'found', 'great', 'group', 'house', 'large', 'later', 'little', 'never', 'other', 'place', 'right', 'should', 'since', 'small', 'sound', 'still', 'such', 'these', 'think', 'three', 'under', 'water', 'where', 'which', 'world', 'would', 'write', 'years'],
      hard: ['although', 'anything', 'appeared', 'around', 'because', 'become', 'before', 'beginning', 'between', 'business', 'cannot', 'certain', 'children', 'community', 'complete', 'consider', 'continued', 'different', 'during', 'everything', 'example', 'experience', 'following', 'government', 'however', 'important', 'including', 'interest', 'knowledge', 'language', 'information', 'nothing', 'opportunity', 'particular', 'political', 'possible', 'probably', 'problem', 'professional', 'question', 'remember', 'something', 'through', 'together', 'understand', 'without']
    };

    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.generateText();
    this.updateAccuracy();
  }

  setupElements() {
    this.elements = {
      // Typing area
      typingCard: document.getElementById('typingCard'),
      typingText: document.getElementById('typingText'),
      typingInput: document.getElementById('typingInput'),
      
      // Accuracy display
      accuracyDisplay: document.getElementById('accuracyDisplay'),
      
      // Controls
      resetBtn: document.getElementById('resetBtn')
    };
  }

  setupEventListeners() {
    // Difficulty options
    document.querySelectorAll('[data-difficulty]').forEach(btn => {
      btn.addEventListener('click', () => {
        const difficulty = btn.dataset.difficulty;
        this.setDifficulty(difficulty);
        this.updateActiveButtons('[data-difficulty]', btn);
      });
    });
    
    // Typing input
    this.elements.typingInput.addEventListener('input', (e) => this.handleInput(e));
    this.elements.typingInput.addEventListener('focus', () => this.elements.typingCard.classList.add('focused'));
    this.elements.typingInput.addEventListener('blur', () => this.elements.typingCard.classList.remove('focused'));
    
    // Focus typing area when clicked
    this.elements.typingCard.addEventListener('click', () => this.elements.typingInput.focus());
    
    // Reset
    this.elements.resetBtn.addEventListener('click', () => this.reset());
    
    // Auto-focus on load
    setTimeout(() => this.elements.typingInput.focus(), 100);
  }

  setDifficulty(difficulty) {
    this.currentDifficulty = difficulty;
    this.reset();
  }

  updateActiveButtons(selector, activeBtn) {
    document.querySelectorAll(selector).forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }

  generateText() {
    const wordList = this.wordLists[this.currentDifficulty];
    const words = [];
    
    for (let i = 0; i < this.wordsPerGeneration; i++) {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      words.push(randomWord);
    }
    
    this.currentText = words.join(' ');
    this.wordsGenerated += this.wordsPerGeneration;
    this.displayText();
  }

  appendMoreText() {
    const wordList = this.wordLists[this.currentDifficulty];
    const words = [];
    
    for (let i = 0; i < this.wordsPerGeneration; i++) {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      words.push(randomWord);
    }
    
    this.currentText += ' ' + words.join(' ');
    this.wordsGenerated += this.wordsPerGeneration;
    this.displayText();
  }

  displayText() {
    const textElement = this.elements.typingText;
    textElement.innerHTML = '';
    
    for (let i = 0; i < this.currentText.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char');
      span.textContent = this.currentText[i];
      
      // Apply existing states based on current progress
      if (i < this.currentIndex) {
        // Character has been typed
        const inputValue = this.elements.typingInput.value;
        if (i < inputValue.length) {
          if (inputValue[i] === this.currentText[i]) {
            span.classList.add('correct');
          } else {
            span.classList.add('incorrect');
          }
        }
      } else if (i === this.currentIndex) {
        // Current character
        span.classList.add('current');
      }
      
      textElement.appendChild(span);
    }
  }

  handleInput(e) {
    const inputValue = e.target.value;
    
    if (inputValue.length > this.currentIndex + 1) {
      // User typed too fast or pasted, limit to current position
      e.target.value = inputValue.substring(0, this.currentIndex + 1);
      return;
    }
    
    if (inputValue.length === this.currentIndex + 1) {
      // User typed a new character
      const currentChar = this.currentText[this.currentIndex];
      const typedChar = inputValue[inputValue.length - 1];
      
      this.totalChars++;
      
      const charElement = this.elements.typingText.children[this.currentIndex];
      
      if (typedChar === currentChar) {
        charElement.classList.add('correct');
        this.correctChars++;
      } else {
        charElement.classList.add('incorrect');
      }
      
      charElement.classList.remove('current');
      this.currentIndex++;
      
      // Move to next character
      if (this.currentIndex < this.currentText.length) {
        this.elements.typingText.children[this.currentIndex].classList.add('current');
      }
      
      // Check if we need to generate more text (when 80% complete)
      const progress = this.currentIndex / this.currentText.length;
      if (progress > 0.8) {
        this.appendMoreText();
      }
      
      this.updateAccuracy();
      
    } else if (inputValue.length === this.currentIndex) {
      // User backspaced
      if (this.currentIndex > 0) {
        const charElement = this.elements.typingText.children[this.currentIndex - 1];
        const wasCorrect = charElement.classList.contains('correct');
        const wasIncorrect = charElement.classList.contains('incorrect');
        
        charElement.classList.remove('correct', 'incorrect');
        
        // Adjust counters
        if (wasCorrect) {
          this.correctChars--;
        }
        this.totalChars--;
        
        const currentElement = this.elements.typingText.children[this.currentIndex];
        if (currentElement) {
          currentElement.classList.remove('current');
        }
        
        this.currentIndex--;
        this.elements.typingText.children[this.currentIndex].classList.add('current');
        
        this.updateAccuracy();
      }
    }
  }

  updateAccuracy() {
    const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
    this.elements.accuracyDisplay.textContent = accuracy + '%';
  }

  reset() {
    // Reset state
    this.currentIndex = 0;
    this.correctChars = 0;
    this.totalChars = 0;
    this.wordsGenerated = 0;
    
    // Reset UI
    this.elements.typingInput.value = '';
    
    // Generate new text
    this.generateText();
    this.updateAccuracy();
    
    // Focus input
    setTimeout(() => this.elements.typingInput.focus(), 100);
  }
}

// Initialize practice mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.practiceMode = new PracticeMode();
});