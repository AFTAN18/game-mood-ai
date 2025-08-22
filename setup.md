# 🚀 Game Mood Advisor - Setup Guide

## 🎯 What You Need

### **Prerequisites**
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (Comes with Node.js)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### **System Requirements**
- **Windows 10/11**, **macOS 10.15+**, or **Linux**
- **4GB RAM** minimum (8GB recommended)
- **1GB free disk space**

## 📥 Installation Steps

### **Step 1: Install Node.js**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer and follow the setup wizard
4. **Restart your terminal/command prompt** after installation

### **Step 2: Verify Installation**
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

### **Step 3: Navigate to Project**
```bash
# Navigate to the project directory
cd game-mood-advisor

# Verify you're in the right place
ls
# You should see: package.json, src/, public/, etc.
```

### **Step 4: Install Dependencies**
```bash
# Install all required packages
npm install

# This may take a few minutes...
```

### **Step 5: Start Development Server**
```bash
# Start the development server
npm run dev

# You should see output like:
# VITE v5.x.x ready in xxx ms
# ➜ Local: http://localhost:5173/
# ➜ Network: use --host to expose
```

### **Step 6: Open in Browser**
1. Open your web browser
2. Navigate to `http://localhost:5173`
3. You should see the Game Mood Advisor interface!

## 🔧 Troubleshooting

### **"node is not recognized"**
- **Solution:** Restart your terminal after Node.js installation
- **Alternative:** Use the full path: `C:\Program Files\nodejs\node.exe`

### **"npm is not recognized"**
- **Solution:** Restart your terminal after Node.js installation
- **Alternative:** Use the full path: `C:\Program Files\nodejs\npm.cmd`

### **Port 5173 already in use**
- **Solution:** The system will automatically use the next available port
- **Alternative:** Kill the process using port 5173

### **Installation fails**
- **Solution:** Clear npm cache: `npm cache clean --force`
- **Alternative:** Delete `node_modules/` and `package-lock.json`, then run `npm install` again

## 🎮 Using the Application

### **Quick Start**
1. **Choose Assessment Type:**
   - **Quick Assessment:** Simple mood questions
   - **Advanced Analysis:** Multi-parameter detection

2. **Complete the Assessment:**
   - Follow the step-by-step process
   - Provide real input for accurate results

3. **Get Recommendations:**
   - View your mood analysis
   - See recommended game categories
   - Get personalized game suggestions

### **Advanced Features**
- **Typing Speed Analysis:** Type the sample text to analyze stress patterns
- **Click Intensity Detection:** Click in designated areas to measure frustration
- **Text Sentiment Analysis:** Describe your feelings for emotional state analysis

## 🚀 Development Commands

### **Available Scripts**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### **Development Tips**
- **Hot reloading** is enabled - changes appear instantly
- **Console logs** show in browser DevTools
- **Error messages** appear in both terminal and browser
- **TypeScript errors** show in terminal during development

## 🔮 Next Steps

### **Explore the Code**
- **`src/components/`** - UI components
- **`src/lib/`** - Core logic and algorithms
- **`src/pages/`** - Main application pages
- **`src/assets/`** - Images and static files

### **Customize the System**
- **Modify anger detection algorithms** in `angerScoring.ts`
- **Adjust recommendation logic** in `recommendationEngine.ts`
- **Update UI components** in the components directory
- **Add new features** following the existing patterns

### **Deploy to Production**
- **Build the project:** `npm run build`
- **Deploy to Vercel, Netlify, or your preferred platform**
- **Configure environment variables** as needed

## 📚 Learn More

### **Documentation**
- **`ADVANCED_FEATURES.md`** - Complete feature overview
- **`README.md`** - Project overview and basic setup
- **Component files** - Inline documentation and comments

### **Technologies Used**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Vite** - Fast build tool and dev server

## 🆘 Need Help?

### **Common Issues**
1. **Node.js not found** → Restart terminal after installation
2. **Port conflicts** → System will auto-assign new port
3. **Build errors** → Check TypeScript compilation
4. **UI not loading** → Check browser console for errors

### **Getting Support**
- **Check the console** for error messages
- **Review the documentation** in this project
- **Search for similar issues** online
- **Create an issue** in the project repository

---

## 🎉 You're Ready to Go!

Once you have Node.js installed and the project running, you'll have access to one of the most advanced game recommendation systems ever built. 

**Happy gaming and mood analysis!** 🚀🎮
