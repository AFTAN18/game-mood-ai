# GameMood AI - Smart Game Recommendations Based on Your Mood

A sophisticated AI-powered game recommendation system that analyzes your emotional state and suggests the perfect games to match your current mood.

## 🚀 Features

### 1. Quick Assessment
- **Simple Mood Sliders**: Adjust energy, social, challenge, and creativity levels
- **Instant Results**: Get game recommendations based on your basic mood profile
- **Perfect for**: Quick mood checks and casual gaming sessions

### 2. Advanced Analysis
- **Multi-Parameter Detection**: 
  - **Typing Speed Analysis**: Measures typing patterns and stress indicators
  - **Click Intensity Detection**: Analyzes mouse click patterns and intensity
  - **Text Sentiment Analysis**: Evaluates emotional content in your text
- **AI Processing**: Combines all data for accurate emotional state assessment
- **Confidence Scoring**: Provides reliability metrics for your mood analysis

### 3. Smart Game Recommendations
- **5 Mood Categories**: CALM, MILD, MODERATE, HIGH, EXTREME
- **Curated Game Database**: 20+ carefully selected games across all genres
- **Mood-Based Filtering**: Games are matched to your emotional state
- **Detailed Game Cards**: Complete information including ratings, playtime, and match reasons

## 🎮 How It Works

1. **Choose Your Assessment Type**:
   - **Quick Assessment**: Simple sliders for basic mood understanding
   - **Advanced Analysis**: Comprehensive multi-parameter analysis

2. **Complete the Assessment**:
   - Follow the step-by-step process
   - Complete all required tests for accurate results

3. **Get Personalized Recommendations**:
   - View games matched to your mood
   - See detailed explanations of why each game fits
   - Access game information, ratings, and platforms

## 🛠️ Technical Features

- **React 18** with TypeScript
- **Tailwind CSS** with custom gaming theme
- **Advanced AI Algorithms** for mood detection
- **Responsive Design** for all devices
- **Real-time Analysis** with live feedback

## 🎯 Mood Categories & Game Types

### CALM (0-20 anger score)
- **Games**: Stardew Valley, Animal Crossing, Minecraft, Civilization VI
- **Perfect for**: Relaxation, creativity, low-stress gaming

### MILD (21-40 anger score)
- **Games**: Hades, Fall Guys, Forza Horizon 5, EA FC 24
- **Perfect for**: Balanced challenge, social gaming, moderate excitement

### MODERATE (41-60 anger score)
- **Games**: Devil May Cry 5, Street Fighter 6, Need for Speed Heat
- **Perfect for**: Action gaming, skill expression, energy release

### HIGH (61-80 anger score)
- **Games**: Journey, ABZÛ, Flower
- **Perfect for**: Stress relief, meditation, peaceful experiences

### EXTREME (81-100 anger score)
- **Games**: Headspace, Calm, Proteus
- **Perfect for**: Wellness, meditation, complete relaxation

## 🚀 Deployment

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/game-mood-ai.git
   cd game-mood-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Deploying to Netlify

1. Push your code to a GitHub/GitLab repository
2. Sign in to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables from your `.env` file in the Netlify dashboard
7. Deploy!

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_api_base_url
```

## 🛠️ Development

```bash
# Start development server
npm run dev
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**: Navigate to `http://localhost:8080`

4. **Start Using**:
   - Click "Quick Assessment" for simple mood check
   - Click "Advanced Analysis" for comprehensive mood analysis
   - Click "How It Works" to learn about the system

## 🔧 Troubleshooting

### Website Not Opening
- Ensure all dependencies are installed: `npm install`
- Check if the dev server is running: `npm run dev`
- Verify the correct port (usually 8080)

### Assessment Not Working
- Complete all required fields in each step
- Ensure you're following the step-by-step process
- Check browser console for any error messages

### No Game Recommendations
- Complete the full assessment process
- Ensure all mood parameters are captured
- Check if the mood mapping is working correctly

## 🎨 Customization

- **Colors**: Modify CSS variables in `src/index.css`
- **Games**: Add new games to `src/lib/gameDatabase.ts`
- **Algorithms**: Adjust mood detection in `src/lib/angerScoring.ts`
- **UI Components**: Modify components in `src/components/`

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all dependencies are properly installed
4. Try clearing browser cache and cookies

---

**GameMood AI** - Discover your perfect game match based on your current mood! 🎮✨
