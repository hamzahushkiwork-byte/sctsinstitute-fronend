# API Integration Setup

## Environment Variable

Create a `.env` file in the project root with:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

**Important**: After creating/updating `.env`, restart the Vite dev server for changes to take effect.

## API Integration Status

### ✅ Phase 1 Complete

- **API Client**: `src/api/client.js` - Axios instance with error handling
- **API Endpoints**: `src/api/endpoints.js` - Functions for fetching data
- **Media URL Helper**: `src/utils/mediaUrl.js` - Converts relative paths to absolute URLs
- **Hero Slider**: Now fetches from `/api/v1/home/hero-slides` with fallback
- **Services Section**: Now fetches from `/api/v1/services` with fallback

### Features

- ✅ Non-breaking: Falls back to static data if API fails
- ✅ Loading states handled gracefully
- ✅ Media URLs normalized (handles both absolute and relative paths)
- ✅ Error handling with console logging
- ✅ No styling/layout changes

### Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd my-react-vite-app && npm run dev`
3. Verify:
   - Home page loads hero slides from backend (or fallback)
   - Services page loads cards from backend (or fallback)
   - Console has no errors

### Next Steps (Future Phases)

- Connect Courses/Programs
- Connect Partners
- Connect Page Content
- Connect Contact Form
- Connect Service Detail pages



