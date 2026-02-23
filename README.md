# TypeFlow - Typing Speed Test and Lessons Platform

TypeFlow is a comprehensive online typing platform designed to help users improve their typing speed and accuracy through structured lessons and practice tests.

## 🚀 Features

### Typing Speed Test
- **Flexible Testing**: Choose between time-based (15, 30, 60, 120 seconds) or word-based (10, 25, 50, 100 words) tests
- **Difficulty Levels**: Easy, Medium, and Hard word lists to match your skill level
- **Real-time Feedback**: Live accuracy tracking with visual indicators for correct/incorrect characters
- **Detailed Results**: WPM, accuracy percentage, correct words, errors, and retry options

### Practice Mode
- **No Time Pressure**: Focus on accuracy without timer constraints
- **Live Accuracy Display**: Real-time accuracy percentage updates as you type
- **Continuous Text Generation**: Text automatically extends as you progress
- **Difficulty Selection**: Same easy/medium/hard word lists as the speed test

### Structured Lessons System
- **8 Progressive Lessons**: From basic home row keys to full sentences with punctuation
- **90% Mastery Requirement**: Each lesson must be completed with 90% accuracy to unlock the next
- **Progress Tracking**: All lesson progress saved locally with completion indicators
- **Lesson Content**:
  1. Home Row Keys (A S D F J K L ;)
  2. Top Row Keys (Q W E R T Y U I O P)  
  3. Bottom Row Keys (Z X C V B N M)
  4. Numbers Row (0-9)
  5. Common English Words
  6. Capital Letters and Shift Key
  7. Punctuation and Special Characters
  8. Full Sentences

### Theme System
- **3 Visual Themes**: Dark (default), Light, and Retro
- **Persistent Settings**: Theme preference saved across sessions
- **Accessibility**: High contrast options and comfortable color schemes

### Mobile Responsive Design
- **Cross-Device Support**: Works on desktop, tablet, and mobile devices
- **Adaptive Layout**: UI adjusts for different screen sizes
- **Touch-Friendly**: Optimized for mobile interaction

## 🛠 Technology Stack

- **Frontend**: Plain HTML5, CSS3, JavaScript (ES6+)
- **Fonts**: Inter (UI), JetBrains Mono (typing area)
- **Storage**: localStorage for progress and preferences
- **Responsive**: CSS Grid and Flexbox
- **Monetization**: Google AdSense integration ready

## 📁 Project Structure

```
typeflow/
├── index.html              # Main typing test page
├── practice.html           # Practice mode page
├── lessons.html           # Lessons overview page
├── lesson-detail.html     # Individual lesson page
├── about.html             # About page (AdSense required)
├── privacy-policy.html    # Privacy policy (AdSense required)
├── css/
│   └── styles.css         # Complete styling system
├── js/
│   ├── typing-test.js     # Main typing test logic
│   ├── practice.js        # Practice mode functionality
│   ├── lessons.js         # Lessons progress management
│   └── themes.js          # Theme switching system
└── README.md              # This file
```

## 🎯 Getting Started

### For Users
1. Open `index.html` in a web browser
2. Choose your preferred test settings (time/words, difficulty)
3. Start typing when ready - timer begins automatically
4. View results and try to improve your score
5. Use Practice Mode for pressure-free improvement
6. Work through Lessons for structured learning

### For Development
1. Clone or download the project files
2. Open in any web server or directly in browser
3. No build process required - pure HTML/CSS/JS
4. Modify styles in `css/styles.css`
5. Update functionality in respective JS files

## 📊 AdSense Integration

### Current Setup
- AdSense placeholder divs positioned strategically
- Placeholder client ID: `ca-pub-XXXXXXXXXX`
- Ad units: Leaderboard (728x90), Rectangle (300x250)
- Required compliance pages: about.html, privacy-policy.html

### For Production
1. Apply for Google AdSense approval
2. Replace placeholder client ID with real AdSense ID
3. Replace placeholder ad divs with actual ad code
4. Ensure ads don't interfere with typing functionality

### Ad Placement
- **Leaderboard**: Between hero and controls, footer
- **Rectangle**: Below results screen, lessons sidebar
- **Critical**: Ads never overlap typing areas

## 🔧 Configuration

### Word Lists
Word lists are defined in the JavaScript files and can be customized:
- **Easy**: Short, common words (3-4 characters)
- **Medium**: Standard vocabulary (5-7 characters)  
- **Hard**: Complex words and longer terms (7+ characters)

### Lesson Content
Lesson text is defined in `lesson-detail.html` and follows the specified curriculum from the original requirements.

### Themes
Themes use CSS custom properties and can be extended by:
1. Adding new theme data attributes
2. Defining CSS variables for the theme
3. Adding theme button in navigation

## 📱 Browser Support

- **Modern Browsers**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Features Used**: 
  - CSS Custom Properties
  - localStorage API
  - ES6+ JavaScript
  - CSS Grid and Flexbox

## ✅ Acceptance Criteria Status

All specified acceptance tests pass:

- ✅ Timer auto-starts on first keystroke, stops at 0, shows results screen
- ✅ Results screen shows WPM, accuracy, errors, retry button
- ✅ Word mode counts words not time
- ✅ All 3 themes (dark/light/retro) switch and persist via localStorage
- ✅ Lesson 1 unlocked, lessons 2-8 locked until previous passed at 90%+
- ✅ Lesson progress saves to localStorage (refresh preserves progress)
- ✅ Practice mode has no timer, accuracy updates live
- ✅ about.html and privacy-policy.html exist with real written content
- ✅ AdSense placeholder divs on every page, NOT blocking typing area
- ✅ Site is fully mobile responsive

## 🚀 Deployment

### GitHub Pages
1. Create repository: `github.com/markoe1/typeflow`
2. Upload all project files
3. Enable GitHub Pages in repository settings
4. Site will be available at: `https://markoe1.github.io/typeflow`

### Other Hosting
- Upload all files to web hosting provider
- Ensure server serves `.html` files properly
- No server-side processing required
- Works with any static hosting (Netlify, Vercel, etc.)

## 🎨 Customization

### Colors and Styling
All visual customization can be done through CSS custom properties in `styles.css`:
```css
:root {
  --bg-primary: #0f0f0f;
  --accent-primary: #f59e0b;
  /* etc... */
}
```

### Content Updates
- **Word Lists**: Update arrays in JavaScript files
- **Lesson Content**: Modify lesson objects in `lesson-detail.html`
- **About Content**: Edit `about.html` for site description
- **Privacy Policy**: Update `privacy-policy.html` for legal compliance

## 🐛 Known Issues & Limitations

- **Mobile Typing**: Physical keyboards work best for lessons
- **Word Lists**: Currently English-only vocabulary
- **Offline Mode**: Requires internet for fonts and potential AdSense
- **Data Export**: No built-in progress export functionality

## 📈 Future Enhancements

- User accounts and cloud progress sync
- Additional language support
- Detailed analytics and progress charts
- Multiplayer typing races
- Custom lesson creation
- Typing games and challenges

## 📞 Support

For questions or issues:
- **Email**: support@typeflow.com
- **Privacy**: privacy@typeflow.com

## 📄 License

This project is open source and available for educational and commercial use. Please maintain attribution to TypeFlow when using or modifying the code.

---

**TypeFlow** - Master your typing, one key at a time. 🎯