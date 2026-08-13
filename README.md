# Algo_Qain

A modern full-stack project combining React 19, Vite 6, TypeScript, Express, and Google GenAI for AI-powered applications.

## Features

- �� ⚡��️ **Lightning Fast**: Built with Vite 6 for instant server start and instant HMR
- �� 🚀 **Modern Stack**: React 19, TypeScript, Express, Tailwind CSS
- �� 🤖 **AI Powered**: Integrated Google Gemini API for intelligent capabilities
- �� 🔧 **Developer Experience**: ESLint, Prettier, Bun-powered tooling
- �� 📦 **Optimized Production Build**: Vite + esbuild for minimal bundle size
- �� 🛡��️ **Type Safety**: End-to-end TypeScript support
- �� 📱 **Responsive Design**: Tailwind CSS for mobile-first layouts

## Project Structure

```
qalgo/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── src/
│   ├── App.tsx                 # Root React component
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utility functions and services
│   ├── index.css               # Global styles
│   ├── main.tsx                # React entry point
│   └── types.ts                # Shared TypeScript types
├── server.ts                   # Express server with AI integration
├── vite.config.ts              # Vite configuration with plugins
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── package-lock.json           # Dependency lockfile
├── README.md                   # This file
�└── .gitignore                  # Ignored files
```

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- Git
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/elon00/Algo_Qain.git
   cd Algo_Qain
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (Vite + esbuild)
- `npm run lint` - TypeScript type checking
- `npm run preview` - Preview production build locally

## Production Build

To create a production build:

```bash
npm run build
```

This will:
1. Build the React application with Vite
2. Bundle the Express server with esbuild
3. Output to the `dist/` directory

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |

## Deployment

The project is configured for easy deployment to any Node.js hosting service (Vercel, Netlify, AWS, etc.) or Docker.

## CI/CD

This repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically runs on every push and pull request to:
- Install dependencies with `npm ci`
- Run TypeScript linting (`npm run lint`)
- Build the project (`npm run build`)

## License

MIT

Feel free to contribute, open issues, or submit pull requests!