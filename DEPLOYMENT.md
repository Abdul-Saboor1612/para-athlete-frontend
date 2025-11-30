# Para Athlete Monitoring System - Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Run Development Server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Build for Production**
   ```bash
   pnpm run build
   # or
   npm run build
   ```
   This creates an optimized production build in the `dist` folder.

4. **Preview Production Build**
   ```bash
   pnpm run preview
   # or
   npm run preview
   ```

## Deployment Options

### Option 1: Static Hosting (Vercel, Netlify, GitHub Pages)

#### Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure:
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
4. Deploy!

#### Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and import your repository
3. Configure:
   - Build Command: `pnpm run build`
   - Publish Directory: `dist`
4. Deploy!

#### GitHub Pages
```bash
# Install gh-pages
pnpm add -D gh-pages

# Add to package.json scripts:
"predeploy": "pnpm run build",
"deploy": "gh-pages -d dist"

# Deploy
pnpm run deploy
```

### Option 2: Self-Hosted Server (Apache/Nginx)

1. Build the project:
   ```bash
   pnpm run build
   ```

2. Copy the `dist` folder to your web server:
   ```bash
   scp -r dist/* user@your-server:/var/www/html/
   ```

3. Configure your web server for SPA routing:

   **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

   **Apache Configuration (.htaccess):**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Option 3: Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:
```bash
docker build -t para-athlete-monitor .
docker run -p 80:80 para-athlete-monitor
```

## Backend Integration

This is a frontend skeleton with placeholder API calls. To integrate with your backend:

1. **Set up environment variables**
   Create a `.env` file:
   ```
   VITE_API_BASE_URL=https://your-api-url.com
   VITE_API_KEY=your-api-key
   ```

2. **Replace placeholder API calls**
   Look for comments marked with `// TODO: Replace with actual API call` in:
   - `src/components/AthleteForm.tsx` - Form submission
   - `src/components/CoachChat.tsx` - Message sending/receiving
   - Other components as needed

3. **Create an API service**
   Example `src/services/api.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

   export const api = {
     async createAthlete(data: AthleteFormData) {
       const response = await fetch(`${API_BASE_URL}/athletes`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
       });
       return response.json();
     },
     
     async getPrediction(athleteId: string) {
       const response = await fetch(`${API_BASE_URL}/predictions/${athleteId}`);
       return response.json();
     },
     
     // Add more API methods as needed
   };
   ```

## Project Structure

```
para-athlete-monitoring-system/
├── src/
│   ├── components/          # React components
│   │   ├── Layout/         # Layout components (Sidebar, Header, Footer)
│   │   ├── AthleteForm.tsx
│   │   ├── PredictionSummary.tsx
│   │   ├── NutritionHighlights.tsx
│   │   └── CoachChat.tsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Athletes.tsx
│   │   └── Chat.tsx
│   ├── types/              # TypeScript type definitions
│   ├── data/               # Mock data
│   └── App.tsx             # Main app component
├── public/                 # Static assets
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built UI components
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## Features

✅ Responsive design (mobile, tablet, desktop)
✅ Modern UI with cards, shadows, and gradients
✅ Color-coded risk indicators
✅ Form validation structure
✅ Chat interface with message bubbles
✅ Mock data for development
✅ TypeScript for type safety
✅ Component-based architecture

## Troubleshooting

**Issue: Blank page after deployment**
- Check that your web server is configured for SPA routing
- Ensure the base URL is correct in `vite.config.ts`

**Issue: API calls not working**
- Verify environment variables are set correctly
- Check CORS settings on your backend
- Ensure API endpoints are accessible

**Issue: Build fails**
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Check for TypeScript errors: `pnpm run type-check`

## Support

For issues or questions:
- Check the [React documentation](https://react.dev)
- Check the [Vite documentation](https://vitejs.dev)
- Check the [shadcn/ui documentation](https://ui.shadcn.com)

## License

This is a frontend skeleton for development purposes. Customize as needed for your project.