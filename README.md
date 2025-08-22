# 🎮 GameMood AI - Intelligent Game Recommendations Based on Your Mood

> **Discover your perfect game match based on your current emotional state. Our AI analyzes how you're feeling and recommends games that fit your vibe.**

## ✨ Features

### 🧠 **Multi-Parameter Mood Analysis**
- **Typing Speed Detection** - Analyzes your typing patterns for stress levels
- **Click Intensity Monitoring** - Tracks mouse click pressure and frequency
- **Text Sentiment Analysis** - Evaluates your written responses
- **Advanced Assessment** - Comprehensive mood evaluation with confidence scoring

### 🎯 **Smart Game Recommendations**
- **Mood-Based Categorization** - Games organized by anger/stress levels
- **Real Game Database** - 15+ popular games with detailed information
- **Platform Integration** - Shows available platforms (PC, Switch, Xbox, PlayStation)
- **Personalized Matching** - Considers your gaming preferences and history

### 🎨 **Beautiful User Interface**
- **Modern Design** - Clean, responsive interface with gradient themes
- **Mobile Optimized** - Works perfectly on all devices
- **Real-Time Feedback** - Live metrics and progress tracking
- **Accessibility Features** - Inclusive design for all users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/game-mood-advisor.git
cd game-mood-advisor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## 🎮 Game Categories by Mood

| Mood Level | Anger Score | Recommended Games | Description |
|------------|-------------|-------------------|-------------|
| **CALM** | 0-20 | Stardew Valley, Animal Crossing, Minecraft, Civilization VI | Relaxing, creative, low-stress games |
| **MILD** | 21-40 | Hades, Fall Guys, Forza Horizon 5, FIFA 24 | Engaging, moderate challenge, social games |
| **MODERATE** | 41-60 | Devil May Cry 5, Street Fighter 6, Need for Speed Heat | High energy, skill-based, action games |
| **HIGH** | 61-80 | Journey, ABZÛ, Flower | Meditative, peaceful, artistic games |
| **EXTREME** | 81-100 | Headspace, Calm, Proteus | Wellness apps, meditation, stress relief |

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **UI Components**: Radix UI + Custom Components
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel/Netlify ready

## 📁 Project Structure

```
game-mood-advisor/
├── src/
│   ├── components/          # React components
│   ├── lib/                # Core logic and utilities
│   │   ├── gameDatabase.ts # Game data and recommendations
│   │   ├── angerScoring.ts # Mood analysis algorithms
│   │   └── recommendationEngine.ts # Game matching logic
│   ├── pages/              # Page components
│   └── integrations/       # External service integrations
├── supabase/               # Database schema and migrations
└── public/                 # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Create a new Supabase project
2. Run the migrations in `supabase/migrations/`
3. Update environment variables

## 📱 Screenshots

*[Add screenshots of your app here]*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Game Data**: Curated from popular gaming platforms and reviews
- **UI Components**: Built with Radix UI and Tailwind CSS
- **Icons**: Lucide React icon library
- **Design Inspiration**: Modern gaming and wellness applications

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/game-mood-advisor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/game-mood-advisor/discussions)
- **Email**: your.email@example.com

---

**Made with ❤️ for gamers who want to find their perfect mood match**
