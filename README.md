# 🎓 Sharda University AI Ambassador

An intelligent chatbot powered by Google Gemini AI and Retrieval-Augmented Generation (RAG) to help Bangladeshi students with admissions, visa processes, fees, scholarships, and university information for Sharda University, India.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://ai-ambassador-chat.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Features

### 🤖 AI-Powered Assistance
- **Google Gemini AI** integration for intelligent conversations
- **RAG (Retrieval-Augmented Generation)** with 7,110+ Q&A entries from Hugging Face
- **395 verified Q&A pairs** with priority for accuracy on fees, scholarships, and visa
- Context-aware responses with semantic search
- Markdown rendering for formatted responses

### 📚 Comprehensive Information
- **Fees & Scholarships**: Detailed breakdown for 135+ programs, up to 50% scholarship
- **IVAC Visa Process**: Complete 15-document checklist and step-by-step guide
- **Admission Process**: From application to enrollment in 5 simple steps
- **University Details**: Rankings (QS Asia 219), facilities, 450-bed hospital on campus
- **Why Sharda**: Benefits for Bangladeshi students, cultural fit, affordability

### 💾 Smart Caching
- **IndexedDB storage** for large datasets (supports 7,110+ entries)
- **Incremental loading** continues from last cached position
- **7-day cache expiry** with automatic refresh
- Offline-first approach after initial load

### 🎨 Modern UI/UX
- Beautiful gradient design with glassmorphism effects
- Responsive layout for all devices
- Dark mode optimized
- Real-time typing indicators
- Chat history persistence in localStorage
- Clear chat functionality

### 🔧 Developer Tools
- **Email preparation** tool for admission queries
- **PDF generation** for brochures and documents
- Video content gallery for campus tours

## 🚀 Live Demo

Visit the live application: **[https://ai-ambassador-chat.vercel.app/](https://ai-ambassador-chat.vercel.app/)**

## 📋 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3 + PostCSS
- **AI Model**: Google Gemini 1.5 Pro
- **RAG Dataset**: Hugging Face ([millat/indian_university_guidance_for_bangladeshi_students](https://huggingface.co/datasets/millat/indian_university_guidance_for_bangladeshi_students))
- **Markdown**: react-markdown + remark-gfm + @tailwindcss/typography
- **Storage**: IndexedDB (primary) + localStorage (fallback)
- **Deployment**: Vercel
- **PDF Generation**: jsPDF

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/codermillat/ai-ambassador-chat.git
cd ai-ambassador-chat
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🌐 Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
4. Deploy (Vercel auto-deploys on every push to main)

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and add your environment variables when asked.

## 📁 Project Structure

```
Unibro/
├── public/
│   ├── data/
│   │   └── verified-fees-scholarships-2024.json  # 395 verified Q&A pairs
│   ├── fav.png                                    # Favicon
│   ├── logo.png                                   # Logo
│   ├── manifest.json                              # PWA manifest
│   ├── robots.txt                                 # SEO
│   └── sitemap.xml                                # SEO
├── services/
│   ├── datasetService.ts                          # RAG & caching logic
│   └── geminiService.ts                           # Gemini AI integration
├── components/
│   ├── ChatView.tsx                               # Main chat interface
│   ├── ContentView.tsx                            # Video gallery
│   ├── RightSidebar.tsx                           # Info sidebar
│   └── ...
├── App.tsx                                        # Main app component
├── index.tsx                                      # Entry point
├── styles.css                                     # Tailwind directives
├── tailwind.config.js                             # Tailwind config
├── vite.config.ts                                 # Vite config
├── vercel.json                                    # Vercel config
└── package.json                                   # Dependencies
```

## 🔑 Key Features Explained

### 1. RAG (Retrieval-Augmented Generation)

The chatbot uses a hybrid approach:
- **Verified local data** (395 Q&A pairs) loaded with **priority** for accuracy
- **Hugging Face dataset** (7,000+ entries) for comprehensive coverage
- **Semantic search** finds relevant context for each user query
- **Context augmentation** enhances AI responses with retrieved information

### 2. Smart Caching System

```typescript
// Automatic cache management
- Load from IndexedDB if cache exists and is fresh (< 7 days)
- Fetch missing entries from Hugging Face if cache is incomplete
- Save partial progress if API rate limit is hit
- Graceful fallback to localStorage for smaller datasets
```

### 3. Visa Information Coverage

Complete guidance for Bangladeshi students:
- ✅ 15-document IVAC checklist
- ✅ Bank statement (6 months, ₹1 lakh)
- ✅ Electricity bill (< 3 months)
- ✅ Step-by-step process (6 weeks timeline)
- ✅ Common mistakes to avoid
- ✅ FRRO registration after arrival

## 🎯 SEO Optimization

The app is optimized for search engines:
- **Meta tags**: Title, description, keywords targeting "Bangladeshi students", "Sharda University", "study in India"
- **Open Graph**: Social media preview with logo and description
- **Twitter Cards**: Enhanced Twitter sharing
- **Structured Data**: Schema.org for `EducationalOrganization` and `FAQPage`
- **Geo-targeting**: Bangladesh-specific meta tags
- **Sitemap & Robots.txt**: For better crawling
- **PWA manifest**: Installable on mobile devices

## 📊 Knowledge Base Statistics

| Category | Count | Details |
|----------|-------|---------|
| **Total Q&A Pairs** | 7,505 | 395 verified + 7,110 from Hugging Face |
| **Fee Information** | 60+ | All programs with scholarships |
| **Visa & Documents** | 30+ | IVAC, FRRO, common mistakes |
| **Admission Process** | 12+ | Step-by-step from Bangladesh |
| **University Info** | 80+ | Rankings, facilities, why Sharda |
| **Programs Covered** | 135+ | B.Tech, BBA, MBA, MBBS, etc. |

## 🎓 Scholarship Information

Bangladeshi students are eligible for scholarships based on HSC GPA:

| Program Group | GPA 3.5-5.0 | GPA 3.0-3.4 |
|--------------|-------------|-------------|
| **Group 1** (B.Tech, BBA, MBA, BCA, etc.) | 50% | 20% |
| **Group 2** (B.Sc Nursing) | 25% | 25% |
| **Group 3** (BA, B.Sc programs) | 20% | 20% |
| **Group 4** (MBBS, BDS, Pharmacy) | ❌ None | ❌ None |

## 🔧 Configuration

### Environment Variables

```env
# Required
VITE_GEMINI_API_KEY=your_api_key_here

# Optional (with defaults)
VITE_APP_NAME="Sharda University AI Ambassador"
VITE_CONTACT_WHATSAPP="+919289229881"
VITE_CONTACT_EMAIL="global@sharda.ac.in"
```

### Vercel Configuration

The `vercel.json` is pre-configured for:
- Static build output from Vite
- SPA routing (all routes → index.html)
- Environment variable support

## 🐛 Troubleshooting

### Chatbot not responding with visa information?

**Solution:** Clear browser cache and reload:
1. Open DevTools (F12)
2. Application tab → IndexedDB → Delete `AIAmbassadorDB`
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Build errors with Tailwind CSS?

**Solution:** Ensure you're using Tailwind CSS v3 (not v4):
```bash
npm install -D tailwindcss@^3.0.0 postcss autoprefixer
```

### Dataset not loading?

**Solution:** Check browser console for errors. The app falls back gracefully:
1. Tries to load from IndexedDB cache
2. Falls back to fetching from Hugging Face
3. Falls back to verified local data only
4. Never fails completely

## 🤝 Contributing

This is a private project for Sharda University's Bangladesh admissions. For inquiries:
- **WhatsApp**: +91 92892 29881
- **Email**: global@sharda.ac.in

## 📞 Contact & Support

### For Students (Admissions)
- **WhatsApp**: +91 92892 29881
- **Email**: global@sharda.ac.in
- **Website**: https://global.sharda.ac.in/bangladesh/

### For Technical Issues
- **GitHub**: [@codermillat](https://github.com/codermillat)
- **Repository**: [ai-ambassador-chat](https://github.com/codermillat/ai-ambassador-chat)

## 📄 License

This project is proprietary software for Sharda University's Bangladesh admissions program.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering intelligent conversations
- **Hugging Face** for dataset hosting
- **Sharda University** for providing verified information
- **Vercel** for free hosting and deployment

---

**Built with ❤️ for Bangladeshi students aspiring to study in India**

🔗 **Live App**: https://ai-ambassador-chat.vercel.app/
