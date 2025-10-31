# UniFace AI Ambassador Chat

A modern React application for connecting students with AI ambassadors, built with React 19, TypeScript, and Vite.

## Features

- Interactive chat with AI ambassadors powered by Google Gemini
- Student and staff browsing
- Content management system
- Scholarship information
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 6.2.0
- **Language**: TypeScript 5.8.2
- **AI Integration**: Google Gemini API
- **Styling**: Tailwind CSS (CDN)

## Local Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
   Get your API key from: https://aistudio.google.com/app/apikey

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

### Manual Deployment

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from CLI**:
   ```bash
   vercel
   ```
   
   Or for production:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your_api_key_here`

### Deploy via GitHub

1. Push your code to GitHub
2. Import your repository in Vercel Dashboard
3. Vercel will auto-detect Vite configuration
4. Add `GEMINI_API_KEY` environment variable
5. Deploy!

### Build Configuration

The project includes `vercel.json` with optimal settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite
- SPA routing enabled

## Project Structure

```
Unibro/
├── components/          # React components
│   ├── ChatView.tsx    # Chat interface
│   ├── ContentView.tsx # Content display
│   ├── Icons.tsx       # Icon components
│   ├── RightSidebar.tsx
│   ├── SignInView.tsx
│   └── StudentCard.tsx
├── services/
│   └── geminiService.ts # AI service integration
├── App.tsx             # Main app component
├── constants.ts        # App constants
├── types.ts           # TypeScript types
├── index.tsx          # App entry point
├── index.html         # HTML template
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript config
└── vercel.json        # Vercel deployment config
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI chat functionality | Yes |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved

## Support

For issues or questions, please contact the development team.

