// SpeedyTyper - Typing Test
class TypingTest {
  constructor() {
    this.currentMode       = 'time';
    this.currentTime       = 30;
    this.currentWords      = 25;
    this.currentDifficulty = 'medium';
    this.punctuation       = false;
    this.numbers           = false;
    this.timer             = null;
    this.liveWpmTimer      = null;
    this.timeLeft          = 30;
    this.isRunning         = false;
    this.hasStarted        = false;
    this.currentIndex      = 0;
    this.errors            = 0;
    this.correctChars      = 0;
    this.totalChars        = 0;
    this.startTime         = null;
    this.endTime           = null;
    this.currentText       = '';
    this.isNewPB           = false;
    this.personalBest      = JSON.parse(localStorage.getItem('speedytyper-pb') || '{}');

    // ── Word lists (200+ per tier) ──────────────────────────────────────────
    this.wordLists = {
      easy: [
        'the','be','to','of','and','a','in','that','have','it','for','not','on',
        'with','he','as','you','do','at','this','but','his','by','from','they',
        'we','say','her','she','or','an','will','my','one','all','would','there',
        'their','what','so','up','out','if','about','who','get','which','go','me',
        'when','make','can','like','time','no','just','him','know','take','year',
        'your','good','some','could','them','see','other','than','then','now',
        'look','only','come','its','over','also','back','after','use','two','how',
        'our','work','well','way','even','new','want','any','give','day','most',
        'us','old','big','too','play','run','far','set','put','end','did','sit',
        'ask','few','eat','try','cut','why','let','long','here','left','hand',
        'real','read','live','move','hold','turn','keep','come','told','help',
        'kind','mind','find','form','near','once','open','full','meet','show',
        'feel','plan','city','fire','hard','hot','men','dog','cat','box','top',
        'sea','red','sun','car','bed','run','arm','leg','age','job','air','oil',
        'buy','buy','law','lay','led','lot','low','map','mix','net','nor','pay',
        'per','pig','pit','raw','row','saw','sky','spy','tax','ten','tie','tip',
        'toe','ton','toy','tub','van','via','war','wet','win','yes','yet','zoo'
      ],
      medium: [
        'about','above','across','after','again','along','always','another',
        'around','asked','before','being','between','black','bring','build',
        'built','called','carry','cause','change','check','child','claim','class',
        'clear','close','color','comes','could','cover','cross','daily','doing',
        'drink','drive','earth','eight','enjoy','enter','every','extra','field',
        'final','fixed','focus','force','found','frame','front','fully','given',
        'going','grace','great','green','group','grown','guard','guide','happy',
        'heard','heavy','holds','honor','horse','house','human','image','inner',
        'input','issue','judge','known','large','later','layer','learn','least',
        'leave','level','light','limit','local','logic','lower','major','match',
        'means','might','model','money','month','moved','music','never','night',
        'north','noted','often','order','other','paper','party','peace','phase',
        'phone','place','plain','plant','point','power','press','price','pride',
        'prior','proof','prove','quite','raise','range','reach','ready','refer',
        'reply','right','rough','round','route','rules','scale','scene','sense',
        'serve','seven','shape','share','shift','shown','since','skill','small',
        'solid','solve','south','space','speed','spend','sport','staff','stage',
        'stand','start','state','steps','still','store','story','study','style',
        'sugar','table','tasks','teach','terms','think','three','throw','title',
        'today','topic','total','touch','tough','track','trade','train','treat',
        'trial','truly','trust','truth','twice','under','union','until','upper',
        'using','usual','value','vital','voice','water','where','which','while',
        'white','whole','world','worry','would','write','wrong','young','yours'
      ],
      hard: [
        'abandoned','abundance','acceptance','accomplish','accounting','accumulate',
        'accurately','achievement','acknowledge','additional','adjustment',
        'administration','advancement','advantages','aftermath','aggregate',
        'aggressive','algorithm','alignment','allocation','allowance','alongside',
        'ambiguous','amendment','amplified','analysis','analytical','announced',
        'anticipate','apparently','appearance','applicable','approaching',
        'approximately','architecture','arguments','arrangement','associated',
        'assumption','atmosphere','attribute','available','awareness','background',
        'basically','beginning','behavior','benchmark','boundaries','broadcast',
        'calculate','capability','carefully','categorize','challenge','characters',
        'circulation','classification','collection','commitment','communicate',
        'community','comparison','competition','completely','complexity','component',
        'concentrate','conclusion','condition','conference','confidence','connection',
        'consequence','consistent','construction','contribution','convenience',
        'creativity','customize','decisions','definition','deployment','description',
        'determine','development','difference','discovery','discussion','distribution',
        'effectively','efficiency','eliminate','emphasize','environment','establish',
        'evaluation','excellent','exception','exclusive','existence','experience',
        'explanation','extremely','following','framework','frequency','functions',
        'fundamental','generally','government','guidelines','highlight','hypothesis',
        'illustrate','important','improvement','including','independent','individual',
        'information','innovation','integrate','interesting','investment','knowledge',
        'leadership','limitation','management','mechanism','methodology','motivation',
        'necessary','objective','otherwise','parameter','particular','percentage',
        'performance','perspective','philosophy','population','potential','priorities',
        'procedures','processes','production','professional','programming',
        'requirements','resistance','resources','responsibility','resulting',
        'significant','simulation','situation','sophisticated','structured',
        'successful','summarize','techniques','technology','understand','unlimited',
        'validation','variables','versatile','visualization','vulnerability'
      ]
    };

    this.quotes = [
      "The only way to do great work is to love what you do.",
      "In the middle of every difficulty lies opportunity.",
      "It does not matter how slowly you go as long as you do not stop.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "Do not watch the clock. Do what it does. Keep going.",
      "You miss one hundred percent of the shots you never take.",
      "Whether you think you can or you think you cannot, you are right.",
      "The best time to plant a tree was twenty years ago. The second best time is now.",
      "An investment in knowledge pays the best interest.",
      "Life is what happens when you are busy making other plans.",
      "The journey of a thousand miles begins with one step.",
      "That which does not kill us makes us stronger.",
      "In three words I can sum up everything I have learned about life: it goes on.",
      "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
      "Strive not to be a success but rather to be of value.",
      "You only live once, but if you do it right, once is enough.",
      "In order to succeed we must first believe that we can.",
      "The mind is everything. What you think you become.",
      "The best revenge is massive success.",
      "I have not failed. I have just found ten thousand ways that will not work.",
      "A person who never made a mistake never tried anything new.",
      "The secret of getting ahead is getting started.",
      "It always seems impossible until it is done.",
      "Do one thing every day that scares you.",
      "Well done is better than well said.",
      "The harder the conflict the more glorious the triumph.",
      "What we think we become.",
      "First they ignore you, then they laugh at you, then they fight you, then you win.",
      "You become what you believe.",
      "Not how long but how well you have lived is the main thing.",
      "Knowing is not enough we must apply. Wishing is not enough we must do.",
      "The two most important days in your life are the day you are born and the day you find out why.",
      "Nothing is impossible the word itself says I am possible.",
      "Life itself is the most wonderful fairy tale.",
      "May you live all the days of your life.",
      "Happiness is not something ready made. It comes from your own actions.",
      "When everything seems to be going against you remember that the airplane takes off against the wind.",
      "Too many of us are not living our dreams because we are living our fears.",
      "If you want to achieve greatness stop asking for permission.",
    ];

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
      timeMode:            document.getElementById('timeMode'),
      wordsMode:           document.getElementById('wordsMode'),
      quotesMode:          document.getElementById('quotesMode'),
      timeOptions:         document.getElementById('timeOptions'),
      wordOptions:         document.getElementById('wordOptions'),
      punctuationToggle:   document.getElementById('punctuationToggle'),
      numbersToggle:       document.getElementById('numbersToggle'),
      timerDisplay:        document.getElementById('timerDisplay'),
      liveWpm:             document.getElementById('liveWpm'),
      typingCard:          document.getElementById('typingCard'),
      typingText:          document.getElementById('typingText'),
      typingInput:         document.getElementById('typingInput'),
      results:             document.getElementById('results'),
      wpmResult:           document.getElementById('wpmResult'),
      accuracyResult:      document.getElementById('accuracyResult'),
      correctWordsResult:  document.getElementById('correctWordsResult'),
      totalWordsResult:    document.getElementById('totalWordsResult'),
      errorsResult:        document.getElementById('errorsResult'),
      pbResult:            document.getElementById('pbResult'),
      tryAgainBtn:         document.getElementById('tryAgainBtn'),
      resetBtn:            document.getElementById('resetBtn'),
      tabHint:             document.getElementById('tabHint'),
      shareTwitterBtn:     document.getElementById('shareTwitterBtn'),
      shareLinkBtn:        document.getElementById('shareLinkBtn'),
      startTestBtn:        document.getElementById('startTestBtn'),
    };
  }

  setupEventListeners() {
    // Mode toggle
    this.elements.timeMode?.addEventListener('click',   () => this.setMode('time'));
    this.elements.wordsMode?.addEventListener('click',  () => this.setMode('words'));
    this.elements.quotesMode?.addEventListener('click', () => this.setMode('quotes'));

    // Time options
    document.querySelectorAll('[data-time]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTime(parseInt(btn.dataset.time));
        this.updateActiveButtons('[data-time]', btn);
      });
    });

    // Word options
    document.querySelectorAll('[data-words]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setWords(parseInt(btn.dataset.words));
        this.updateActiveButtons('[data-words]', btn);
      });
    });

    // Difficulty options
    document.querySelectorAll('[data-difficulty]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setDifficulty(btn.dataset.difficulty);
        this.updateActiveButtons('[data-difficulty]', btn);
      });
    });

    // Punctuation & numbers toggles
    this.elements.punctuationToggle?.addEventListener('click', () => {
      this.punctuation = !this.punctuation;
      this.elements.punctuationToggle.classList.toggle('active', this.punctuation);
      this.reset();
    });
    this.elements.numbersToggle?.addEventListener('click', () => {
      this.numbers = !this.numbers;
      this.elements.numbersToggle.classList.toggle('active', this.numbers);
      this.reset();
    });

    // Typing input
    this.elements.typingInput.addEventListener('input',  (e) => this.handleInput(e));
    this.elements.typingInput.addEventListener('focus',  () => this.elements.typingCard.classList.add('focused'));
    this.elements.typingInput.addEventListener('blur',   () => this.elements.typingCard.classList.remove('focused'));
    this.elements.typingCard.addEventListener('click',   () => this.elements.typingInput.focus());

    // Reset / try again
    this.elements.resetBtn?.addEventListener('click', () => this.reset());
    this.elements.tryAgainBtn?.addEventListener('click', () => this.reset());

    // Tab to restart (MonkeyType's most loved shortcut)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        this.reset();
      }
    });

    // Share buttons
    this.elements.shareTwitterBtn?.addEventListener('click', () => this.shareScore());
    this.elements.shareLinkBtn?.addEventListener('click', () => {
      const text = `I just typed ${this.results.wpm} WPM with ${this.results.accuracy}% accuracy on SpeedyTyper! Check it out: speedytyper.com`;
      this.copyShare(text);
    });

    // Start test button
    this.elements.startTestBtn?.addEventListener('click', () => {
      this.elements.typingInput.focus();
    });

    setTimeout(() => this.elements.typingInput.focus(), 100);
  }

  setMode(mode) {
    this.currentMode = mode;
    this.elements.timeMode?.classList.toggle('active',   mode === 'time');
    this.elements.wordsMode?.classList.toggle('active',  mode === 'words');
    this.elements.quotesMode?.classList.toggle('active', mode === 'quotes');

    const timeOpts = document.getElementById('timeOptions');
    const wordOpts = document.getElementById('wordOptions');
    const diffOpts = document.getElementById('difficultyOptions');
    const punctRow = document.getElementById('modifierOptions');

    if (timeOpts) timeOpts.classList.toggle('hidden', mode !== 'time');
    if (wordOpts) wordOpts.classList.toggle('hidden', mode !== 'words');
    if (diffOpts) diffOpts.classList.toggle('hidden', mode === 'quotes');
    if (punctRow) punctRow.classList.toggle('hidden', mode === 'quotes');

    this.reset();
  }

  setTime(time)             { this.currentTime = time; this.timeLeft = time; this.reset(); }
  setWords(words)           { this.currentWords = words; this.reset(); }
  setDifficulty(difficulty) { this.currentDifficulty = difficulty; this.reset(); }

  updateActiveButtons(selector, activeBtn) {
    document.querySelectorAll(selector).forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  generateText() {
    if (this.currentMode === 'quotes') {
      this.currentText = this.quotes[Math.floor(Math.random() * this.quotes.length)];
      this.displayText();
      return;
    }

    const wordList  = this.wordLists[this.currentDifficulty];
    const wordCount = this.currentMode === 'words' ? this.currentWords : 150;
    let words = [];

    for (let i = 0; i < wordCount; i++) {
      let word = wordList[Math.floor(Math.random() * wordList.length)];

      // Numbers mode — replace ~15% of words with a number
      if (this.numbers && Math.random() < 0.15) {
        word = String(Math.floor(Math.random() * 999) + 1);
      }

      // Punctuation mode — append punctuation to ~25% of words
      if (this.punctuation && Math.random() < 0.25) {
        const punct = [',', '.', '!', '?', ';', ':'][Math.floor(Math.random() * 6)];
        word = word + punct;
      }

      words.push(word);
    }

    this.currentText = words.join(' ');
    this.displayText();
  }

  displayText() {
    const el = this.elements.typingText;
    el.innerHTML = '';
    for (let i = 0; i < this.currentText.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char');
      span.textContent = this.currentText[i];
      el.appendChild(span);
    }
    if (el.children.length > 0) el.children[0].classList.add('current');
  }

  handleInput(e) {
    const val = e.target.value;

    if (!this.hasStarted && val.length > 0) this.start();
    if (!this.isRunning) return;

    // Prevent paste / jumping ahead
    if (val.length > this.currentIndex + 1) {
      e.target.value = val.substring(0, this.currentIndex + 1);
      return;
    }

    if (val.length === this.currentIndex + 1) {
      this.totalChars++;
      const charEl = this.elements.typingText.children[this.currentIndex];
      const typed  = val[val.length - 1];
      const target = this.currentText[this.currentIndex];

      if (typed === target) {
        charEl.classList.add('correct');
        this.correctChars++;
      } else {
        charEl.classList.add('incorrect');
        this.errors++;
      }

      charEl.classList.remove('current');
      this.currentIndex++;

      if (this.currentIndex < this.currentText.length) {
        this.elements.typingText.children[this.currentIndex].classList.add('current');
        this.scrollToCurrent();
      }

      if (this.currentMode !== 'time' && this.currentIndex >= this.currentText.length) {
        this.finish();
      }

    } else if (val.length === this.currentIndex) {
      // Backspace
      if (this.currentIndex > 0) {
        const prev = this.elements.typingText.children[this.currentIndex - 1];
        prev.classList.remove('correct', 'incorrect');
        const curr = this.elements.typingText.children[this.currentIndex];
        if (curr) curr.classList.remove('current');
        this.currentIndex--;
        this.elements.typingText.children[this.currentIndex].classList.add('current');
      }
    }
  }

  scrollToCurrent() {
    const curr = this.elements.typingText.querySelector('.current');
    if (curr) curr.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  start() {
    this.hasStarted = true;
    this.isRunning  = true;
    this.startTime  = Date.now();
    if (this.elements.tabHint) this.elements.tabHint.style.display = 'none';
    if (this.currentMode === 'time') this.startTimer();
    this.startLiveWpm();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      if (this.timeLeft <= 0) this.finish();
    }, 1000);
  }

  startLiveWpm() {
    this.liveWpmTimer = setInterval(() => {
      if (!this.isRunning || !this.startTime) return;
      const elapsed = (Date.now() - this.startTime) / 1000 / 60;
      const wpm = elapsed > 0 ? Math.round((this.correctChars / 5) / elapsed) : 0;
      if (this.elements.liveWpm) this.elements.liveWpm.textContent = wpm + ' wpm';
    }, 500);
  }

  finish() {
    this.isRunning = false;
    this.endTime   = Date.now();
    clearInterval(this.timer);
    clearInterval(this.liveWpmTimer);
    this.timer = this.liveWpmTimer = null;
    this.calculateResults();
    this.checkPersonalBest();
    this.showResults();
  }

  calculateResults() {
    const elapsed     = (this.endTime - this.startTime) / 1000 / 60;
    const wpm         = elapsed > 0 ? Math.round((this.correctChars / 5) / elapsed) : 0;
    const accuracy    = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 0;
    const typedText   = this.elements.typingInput.value;
    const typedWords  = typedText.trim().split(' ').filter(w => w.length > 0);
    const correctWords = this.countCorrectWords(typedText);

    this.results = {
      wpm:          Math.max(0, wpm),
      accuracy,
      correctWords,
      totalWords:   typedWords.length,
      errors:       this.errors,
    };
  }

  countCorrectWords(typedText) {
    const orig  = this.currentText.substring(0, this.currentIndex).split(' ');
    const typed = typedText.split(' ');
    let correct = 0;
    for (let i = 0; i < Math.min(orig.length, typed.length); i++) {
      if (orig[i] === typed[i]) correct++;
    }
    return correct;
  }

  checkPersonalBest() {
    const key = `${this.currentMode}-${this.currentMode === 'time' ? this.currentTime : this.currentWords}-${this.currentDifficulty}`;
    const existing = this.personalBest[key];
    const prevWpm  = existing ? (typeof existing === 'object' ? existing.wpm : existing) : 0;
    if (this.results.wpm > prevWpm) {
      this.personalBest[key] = {
        wpm:  this.results.wpm,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      localStorage.setItem('speedytyper-pb', JSON.stringify(this.personalBest));
      this.isNewPB = true;
    } else {
      this.isNewPB = false;
    }
    this.currentPBKey = key;
  }

  showResults() {
    this.elements.results.classList.remove('hide');
    this.elements.results.classList.add('show');
    this.elements.wpmResult.textContent         = this.results.wpm;
    this.elements.accuracyResult.textContent    = this.results.accuracy + '%';
    this.elements.correctWordsResult.textContent = this.results.correctWords;
    this.elements.totalWordsResult.textContent  = this.results.totalWords;
    this.elements.errorsResult.textContent      = this.results.errors;

    // Personal best display
    if (this.elements.pbResult) {
      const pbData  = this.personalBest[this.currentPBKey];
      const pbWpm   = pbData ? (typeof pbData === 'object' ? pbData.wpm : pbData) : this.results.wpm;
      const pbDate  = (pbData && typeof pbData === 'object' && pbData.date) ? pbData.date : null;
      if (this.isNewPB) {
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        this.elements.pbResult.innerHTML = `🏆 <strong>New Personal Best!</strong> &nbsp;·&nbsp; ${today}`;
        this.elements.pbResult.style.color = 'var(--correct, #00c853)';
      } else {
        const dateStr = pbDate ? ` · set ${pbDate}` : '';
        this.elements.pbResult.textContent = `Best: ${pbWpm} wpm${dateStr}`;
        this.elements.pbResult.style.color = 'var(--text-secondary, #aaa)';
      }
    }

    this.addShareButton();
    this.elements.typingCard.style.display = 'none';
    if (this.elements.liveWpm) this.elements.liveWpm.textContent = '';
  }

  reset() {
    clearInterval(this.timer);
    clearInterval(this.liveWpmTimer);
    this.timer = this.liveWpmTimer = null;

    this.isRunning    = false;
    this.hasStarted   = false;
    this.currentIndex = 0;
    this.errors       = 0;
    this.correctChars = 0;
    this.totalChars   = 0;
    this.timeLeft     = this.currentTime;
    this.startTime    = null;
    this.endTime      = null;

    this.elements.typingInput.value = '';
    this.elements.results.classList.remove('show');
    this.elements.results.classList.add('hide');
    this.elements.typingCard.style.display = 'block';
    if (this.elements.liveWpm)  this.elements.liveWpm.textContent = '';
    if (this.elements.tabHint)  this.elements.tabHint.style.display = '';

    this.generateText();
    this.updateDisplay();
    setTimeout(() => this.elements.typingInput.focus(), 50);
  }

  updateDisplay() {
    if (this.currentMode === 'time') {
      this.elements.timerDisplay.textContent = this.timeLeft;
    } else if (this.currentMode === 'words') {
      const pct = Math.min(100, Math.round((this.currentIndex / this.currentText.length) * 100));
      this.elements.timerDisplay.textContent = pct + '%';
    } else {
      this.elements.timerDisplay.textContent = '';
    }
  }

  addShareButton() {
    if (document.getElementById('shareBtn')) return;
    const shareBtn = document.createElement('button');
    shareBtn.id = 'shareBtn';
    shareBtn.className = 'btn secondary';
    shareBtn.textContent = 'Share Score';
    shareBtn.style.marginLeft = '1rem';
    shareBtn.addEventListener('click', () => this.shareScore());
    this.elements.tryAgainBtn.parentNode.insertBefore(shareBtn, this.elements.tryAgainBtn.nextSibling);
  }

  shareScore() {
    const tweetText = encodeURIComponent(
      `I just typed ${this.results.wpm} WPM with ${this.results.accuracy}% accuracy on SpeedyTyper! 🎯 speedytyper.com`
    );
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  }

  copyShare(text) {
    navigator.clipboard?.writeText(text).then(() => {
      this.showToast('Score copied to clipboard!');
    }).catch(() => {
      prompt('Copy your score:', text);
    });
  }

  showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;top:20px;right:20px;z-index:9999;background:var(--correct,#00c853);color:#000;padding:.8rem 1.2rem;border-radius:8px;font-weight:700;font-size:.9rem;box-shadow:0 4px 20px rgba(0,0,0,.3)`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.typingTest = new TypingTest();
});
