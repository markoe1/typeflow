// TypeFlow - Typing Test Logic
class TypingTest {
  constructor() {
    this.currentMode = 'time';
    this.currentTime = 30;
    this.currentWords = 25;
    this.currentDifficulty = 'medium';
    this.timer = null;
    this.timeLeft = 30;
    this.isRunning = false;
    this.hasStarted = false;
    this.currentIndex = 0;
    this.errors = 0;
    this.correctChars = 0;
    this.totalChars = 0;
    this.startTime = null;
    this.endTime = null;
    this.currentText = '';
    
    // Word lists by difficulty
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
    this.updateDisplay();
  }

  setupElements() {
    this.elements = {
      // Mode controls
      timeMode: document.getElementById('timeMode'),
      wordsMode: document.getElementById('wordsMode'),
      timeOptions: document.getElementById('timeOptions'),
      wordOptions: document.getElementById('wordOptions'),
      
      // Timer
      timerDisplay: document.getElementById('timerDisplay'),
      
      // Typing area
      typingCard: document.getElementById('typingCard'),
      typingText: document.getElementById('typingText'),
      typingInput: document.getElementById('typingInput'),
      
      // Results
      results: document.getElementById('results'),
      wpmResult: document.getElementById('wpmResult'),
      accuracyResult: document.getElementById('accuracyResult'),
      correctWordsResult: document.getElementById('correctWordsResult'),
      totalWordsResult: document.getElementById('totalWordsResult'),
      errorsResult: document.getElementById('errorsResult'),
      tryAgainBtn: document.getElementById('tryAgainBtn'),
      
      // Controls
      resetBtn: document.getElementById('resetBtn')
    };
  }

  setupEventListeners() {
    // Mode toggle
    this.elements.timeMode.addEventListener('click', () => this.setMode('time'));
    this.elements.wordsMode.addEventListener('click', () => this.setMode('words'));
    
    // Time options
    document.querySelectorAll('[data-time]').forEach(btn => {
      btn.addEventListener('click', () => {
        const time = parseInt(btn.dataset.time);
        this.setTime(time);
        this.updateActiveButtons('[data-time]', btn);
      });
    });
    
    // Word options
    document.querySelectorAll('[data-words]').forEach(btn => {
      btn.addEventListener('click', () => {
        const words = parseInt(btn.dataset.words);
        this.setWords(words);
        this.updateActiveButtons('[data-words]', btn);
      });
    });
    
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
    
    // Reset and try again
    this.elements.resetBtn.addEventListener('click', () => this.reset());
    this.elements.tryAgainBtn.addEventListener('click', () => this.reset());
    
    // Auto-focus on load
    setTimeout(() => this.elements.typingInput.focus(), 100);
  }

  setMode(mode) {
    this.currentMode = mode;
    this.elements.timeMode.classList.toggle('active', mode === 'time');
    this.elements.wordsMode.classList.toggle('active', mode === 'words');
    this.elements.timeOptions.classList.toggle('hidden', mode !== 'time');
    this.elements.wordOptions.classList.toggle('hidden', mode !== 'words');
    this.generateText();
    this.updateDisplay();
    this.reset();
  }

  setTime(time) {
    this.currentTime = time;
    this.timeLeft = time;
    this.updateDisplay();
  }

  setWords(words) {
    this.currentWords = words;
    this.generateText();
  }

  setDifficulty(difficulty) {
    this.currentDifficulty = difficulty;
    this.generateText();
  }

  updateActiveButtons(selector, activeBtn) {
    document.querySelectorAll(selector).forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }

  generateText() {
    const wordList = this.wordLists[this.currentDifficulty];
    const wordCount = this.currentMode === 'words' ? this.currentWords : 100; // Generate more for time mode
    const words = [];
    
    for (let i = 0; i < wordCount; i++) {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      words.push(randomWord);
    }
    
    this.currentText = words.join(' ');
    this.displayText();
  }

  displayText() {
    const textElement = this.elements.typingText;
    textElement.innerHTML = '';
    
    for (let i = 0; i < this.currentText.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char');
      span.textContent = this.currentText[i];
      textElement.appendChild(span);
    }
    
    // Highlight first character
    if (textElement.children.length > 0) {
      textElement.children[0].classList.add('current');
    }
  }

  handleInput(e) {
    const inputValue = e.target.value;
    
    if (!this.hasStarted && inputValue.length > 0) {
      this.start();
    }
    
    if (!this.isRunning) return;
    
    const currentChar = this.currentText[this.currentIndex];
    const typedChar = inputValue[inputValue.length - 1];
    
    if (inputValue.length > this.currentIndex + 1) {
      // User typed too fast or pasted, limit to current position
      e.target.value = inputValue.substring(0, this.currentIndex + 1);
      return;
    }
    
    if (inputValue.length === this.currentIndex + 1) {
      // User typed a new character
      this.totalChars++;
      
      const charElement = this.elements.typingText.children[this.currentIndex];
      
      if (typedChar === currentChar) {
        charElement.classList.add('correct');
        this.correctChars++;
      } else {
        charElement.classList.add('incorrect');
        this.errors++;
      }
      
      charElement.classList.remove('current');
      this.currentIndex++;
      
      // Move to next character
      if (this.currentIndex < this.currentText.length) {
        this.elements.typingText.children[this.currentIndex].classList.add('current');
      }
      
      // Check if finished (for word mode)
      if (this.currentMode === 'words' && this.currentIndex >= this.currentText.length) {
        this.finish();
      }
    } else if (inputValue.length === this.currentIndex) {
      // User backspaced
      if (this.currentIndex > 0) {
        const charElement = this.elements.typingText.children[this.currentIndex - 1];
        charElement.classList.remove('correct', 'incorrect');
        
        const currentElement = this.elements.typingText.children[this.currentIndex];
        if (currentElement) {
          currentElement.classList.remove('current');
        }
        
        this.currentIndex--;
        this.elements.typingText.children[this.currentIndex].classList.add('current');
      }
    }
  }

  start() {
    this.hasStarted = true;
    this.isRunning = true;
    this.startTime = Date.now();
    
    if (this.currentMode === 'time') {
      this.startTimer();
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      
      if (this.timeLeft <= 0) {
        this.finish();
      }
    }, 1000);
  }

  finish() {
    this.isRunning = false;
    this.endTime = Date.now();
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    this.calculateResults();
    this.showResults();
  }

  calculateResults() {
    const timeElapsed = (this.endTime - this.startTime) / 1000 / 60; // in minutes
    const wordsTyped = this.currentIndex / 5; // Standard: 5 characters = 1 word
    const wpm = Math.round(wordsTyped / timeElapsed);
    const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 0;
    
    // Count words
    const typedText = this.elements.typingInput.value;
    const typedWords = typedText.trim().split(' ').filter(word => word.length > 0);
    const correctWords = this.countCorrectWords(typedText);
    
    this.results = {
      wpm: Math.max(0, wpm),
      accuracy,
      correctWords,
      totalWords: typedWords.length,
      errors: this.errors
    };
  }

  countCorrectWords(typedText) {
    const originalWords = this.currentText.substring(0, this.currentIndex).split(' ');
    const typedWords = typedText.split(' ');
    let correct = 0;
    
    for (let i = 0; i < Math.min(originalWords.length, typedWords.length); i++) {
      if (originalWords[i] === typedWords[i]) {
        correct++;
      }
    }
    
    return correct;
  }

  showResults() {
    this.elements.results.classList.remove('hide');
    this.elements.results.classList.add('show');
    
    this.elements.wpmResult.textContent = this.results.wpm;
    this.elements.accuracyResult.textContent = this.results.accuracy + '%';
    this.elements.correctWordsResult.textContent = this.results.correctWords;
    this.elements.totalWordsResult.textContent = this.results.totalWords;
    this.elements.errorsResult.textContent = this.results.errors;
    
    // Hide typing area
    this.elements.typingCard.style.display = 'none';
  }

  reset() {
    // Stop timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    // Reset state
    this.isRunning = false;
    this.hasStarted = false;
    this.currentIndex = 0;
    this.errors = 0;
    this.correctChars = 0;
    this.totalChars = 0;
    this.timeLeft = this.currentTime;
    this.startTime = null;
    this.endTime = null;
    
    // Reset UI
    this.elements.typingInput.value = '';
    this.elements.results.classList.remove('show');
    this.elements.results.classList.add('hide');
    this.elements.typingCard.style.display = 'block';
    
    // Generate new text and update display
    this.generateText();
    this.updateDisplay();
    
    // Focus input
    setTimeout(() => this.elements.typingInput.focus(), 100);
  }

  updateDisplay() {
    if (this.currentMode === 'time') {
      this.elements.timerDisplay.textContent = this.timeLeft;
    } else {
      const progress = Math.min(100, (this.currentIndex / this.currentText.length) * 100);
      this.elements.timerDisplay.textContent = Math.round(progress) + '%';
    }
  }
}

// Initialize typing test when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.typingTest = new TypingTest();
});