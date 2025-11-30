# Para Athlete Monitoring System - Frontend Skeleton

## Project Overview
A modern, responsive React.js dashboard for monitoring para athletes with placeholder components ready for backend integration.

## Web Design Style
- **Layout Style**: Modern dashboard with sidebar navigation, card-based content layout
- **Visual Elements**: Rounded corners (rounded-lg, rounded-xl), soft shadows (shadow-sm, shadow-md), gradient accents, color-coded badges
- **Color Scheme**: 
  - Primary: Blue gradient (from-blue-600 to-indigo-600)
  - Success: Green (for good metrics)
  - Warning: Yellow/Orange (for moderate risk)
  - Danger: Red (for high risk)
  - Background: Light gray with subtle gradients
- **Typography**: Clean sans-serif, hierarchical heading sizes, good line spacing

## File Structure

### Core Files
1. `src/App.tsx` - Main app with routing and layout
2. `src/pages/Dashboard.tsx` - Main dashboard page
3. `src/pages/Athletes.tsx` - Athletes management page
4. `src/pages/Chat.tsx` - Coach chat page
5. `index.html` - Update title and meta tags

### Components
6. `src/components/Layout/Sidebar.tsx` - Navigation sidebar
7. `src/components/Layout/Header.tsx` - Top header with user info
8. `src/components/AthleteForm.tsx` - Athlete data input form with validation structure
9. `src/components/PredictionSummary.tsx` - Stamina, fatigue, injury risk display
10. `src/components/NutritionHighlights.tsx` - Nutrition recommendations section
11. `src/components/CoachChat.tsx` - Chat interface with message bubbles
12. `src/components/AthleteCard.tsx` - Individual athlete summary card
13. `src/components/MetricCard.tsx` - Reusable metric display card
14. `src/components/DownloadProject.tsx` - Project download functionality

### Data & Types
15. `src/types/index.ts` - TypeScript interfaces for Athlete, Prediction, Message, etc.
16. `src/data/mockData.ts` - Dummy data for preview

### Utilities
17. `src/utils/downloadProject.ts` - Utility to create and download project zip

## Component Details

### AthleteForm
- Full form layout with fields: name, age, disability type, sport, training hours, sleep hours, nutrition score
- Validation structure (placeholder validation)
- Styled input fields with labels
- Submit button with placeholder handler
- Success/error message display area

### PredictionSummary
- Card layout with three main metrics
- Color-coded badges: Green (Low risk), Yellow (Moderate), Red (High)
- Progress bars or circular indicators
- Placeholder values: Stamina (85%), Fatigue (Medium), Injury Risk (Low)

### NutritionHighlights
- Bullet point list with icons
- Sample recommendations: Hydration, Protein intake, Recovery meals
- Color-coded importance levels
- Expandable details section

### CoachChat
- Chat message bubbles (left for coach, right for athlete)
- Input field with send button
- Placeholder send/receive handlers
- Timestamp display
- Scrollable message area
- Sample conversation loaded

### Layout
- Responsive sidebar (collapsible on mobile)
- Top header with app title and user avatar
- Main content area with proper spacing
- Mobile-friendly hamburger menu

## Routing Structure
- `/` - Dashboard (overview with all components)
- `/athletes` - Athletes list and management
- `/chat` - Full-screen chat interface

## Placeholder Integration Points
- API call placeholders marked with `// TODO: Replace with actual API call`
- State management hooks ready for backend integration
- Form submission handlers with console.log for testing
- Error handling structure in place

## Dummy Data Examples
- 3-5 sample athletes with complete profiles
- Sample prediction data for each athlete
- Sample chat conversation (10-15 messages)
- Sample nutrition recommendations

## Responsive Design
- Mobile: Single column, collapsible sidebar
- Tablet: Two-column grid where appropriate
- Desktop: Full multi-column layout with sidebar
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## Download Feature
- Footer button to download entire project
- Creates zip file with all source code
- Includes README with setup instructions
- Excludes node_modules and build artifacts