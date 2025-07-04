# Secret Agent Digital Marketing - Workspace Overview

## 🏗️ Project Architecture

### Frontend Framework
- **React 18.3.1** with JSX
- **Vite** as build tool and development server
- **React Router DOM 7.1.0** for client-side routing (HashRouter)
- **Tailwind CSS 3.4.17** for styling
- **Framer Motion 11.0.8** for animations

### Code Structure
```
src/
├── components/           # Reusable UI components
│   ├── Header.jsx       # Navigation header with analytics
│   ├── Footer.jsx       # Site footer
│   ├── AnalyticsDebugger.jsx  # Debug panel for analytics
│   └── ThankYou.jsx     # Thank you/success component
├── pages/               # Route-based page components
│   ├── Home.jsx         # Landing page
│   ├── Services.jsx     # Services overview
│   ├── About.jsx        # About/team page
│   ├── CaseStudies.jsx  # Success stories
│   ├── Contact.jsx      # Contact form
│   └── VideoMarketing.jsx # Video marketing services
├── common/              # Shared utilities
│   └── SafeIcon.jsx     # Safe icon wrapper component
├── utils/               # Utility functions
│   ├── analytics.js     # Multi-platform analytics
│   └── analyticsVerification.js # Analytics testing
├── App.jsx              # Main app component
├── App.css              # Global styles
├── index.css            # Tailwind imports
└── main.jsx             # React entry point
```

## 📊 Analytics & Tracking APIs

### Google Analytics 4 (GA4)
- **Measurement ID**: `G-CTDQQ8XMKC`
- **Implementation**: gtag.js
- **Features**:
  - Page view tracking
  - Event tracking
  - Conversion tracking
  - Custom parameters
  - E-commerce tracking

### SiteBehaviour Analytics
- **Secret Key**: `507f5743-d0f0-49db-a5f0-0d702b989128`
- **CDN**: `sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com`
- **Features**:
  - User behavior tracking
  - Heatmaps
  - Session recordings
  - Engagement metrics

### Firebase Analytics
- **Project ID**: Configured but requires valid credentials
- **Features**:
  - Real-time analytics
  - User demographics
  - Custom events
  - Conversion funnels

### CyborgCRM
- **Status**: Configured but requires valid website ID
- **Features**:
  - Lead tracking
  - Conversion attribution
  - Customer journey mapping

## 🌐 Domains & Hosting

### Primary Domain
- **Production**: Not specified (to be configured)
- **Development**: `localhost:5173` (Vite dev server)
- **Build Output**: `dist/` directory

### CDN & External Resources
- **Google Fonts**: `fonts.googleapis.com`, `fonts.gstatic.com`
- **Google Analytics**: `googletagmanager.com`
- **Firebase**: `gstatic.com/firebasejs/`
- **SiteBehaviour**: `sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com`
- **CyborgCRM**: `cdn.cyborgcrm.com`

## 🔒 Security Configuration

### Content Security Policy (CSP)
Recommended CSP headers for production:
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' 
    https://www.googletagmanager.com 
    https://www.gstatic.com 
    https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com 
    https://cdn.cyborgcrm.com;
  style-src 'self' 'unsafe-inline' 
    https://fonts.googleapis.com;
  font-src 'self' 
    https://fonts.gstatic.com;
  connect-src 'self' 
    https://www.google-analytics.com 
    https://analytics.google.com;
  img-src 'self' data: https:;
```

### Environment Variables
```env
# Analytics
VITE_GA4_MEASUREMENT_ID=G-CTDQQ8XMKC
VITE_SITEBEHAVIOUR_SECRET=507f5743-d0f0-49db-a5f0-0d702b989128

# Firebase (to be configured)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id

# CyborgCRM (to be configured)
VITE_CYBORGCRM_WEBSITE_ID=your_website_id
```

### Security Headers
Recommended security headers for production:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 🔧 APIs & Integrations

### React Icons
- **Package**: `react-icons@5.4.0`
- **Usage**: Feather Icons (FiIcons) via SafeIcon wrapper
- **Security**: Client-side only, no external API calls

### Framer Motion
- **Package**: `framer-motion@11.0.8`
- **Usage**: Animations and page transitions
- **Security**: Client-side animation library

### React Router
- **Package**: `react-router-dom@7.1.0`
- **Configuration**: HashRouter for client-side routing
- **Security**: No server-side routing dependencies

### Form Handling
- **Method**: Native React state management
- **Validation**: Client-side validation
- **Submission**: Currently simulated (no backend API)

## 📦 Dependencies

### Production Dependencies
```json
{
  "@questlabs/react-sdk": "^2.1.9",
  "@supabase/supabase-js": "^2.39.0",
  "react": "^18.3.1",
  "react-router-dom": "^7.1.0",
  "react-dom": "^18.3.1",
  "react-icons": "^5.4.0",
  "framer-motion": "^11.0.8",
  "echarts": "^5.5.0",
  "echarts-for-react": "^3.0.2",
  "date-fns": "4.1.0",
  "react-intersection-observer": "^9.5.3"
}
```

### Development Dependencies
```json
{
  "@eslint/js": "^9.9.1",
  "@vitejs/plugin-react": "^4.3.1",
  "eslint": "^9.9.1",
  "eslint-plugin-react-hooks": "^5.1.0-rc.0",
  "eslint-plugin-react-refresh": "^0.4.11",
  "globals": "^15.9.0",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.49",
  "tailwindcss": "^3.4.17",
  "vite": "^5.4.2"
}
```

## 🚀 Build & Deployment

### Build Configuration
- **Build Tool**: Vite
- **Output Directory**: `dist/`
- **Base Path**: `./` (relative paths for static hosting)
- **Source Maps**: Enabled for debugging

### Scripts
```json
{
  "dev": "vite",
  "build": "npm run lint && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### Deployment Checklist
- [ ] Configure production domain
- [ ] Set up Firebase project with valid credentials
- [ ] Configure CyborgCRM with valid website ID
- [ ] Implement proper CSP headers
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure analytics goals and conversions
- [ ] Test all tracking implementations
- [ ] Set up monitoring and alerts

## 🧪 Testing & Verification

### Analytics Testing
- **Debug Mode**: Available via `?debug=true` URL parameter
- **Verification Functions**:
  - `window.testGA4AndSiteBehaviour()`
  - `window.verifyAllAnalytics()`
  - `window.logAnalyticsStatus()`

### Code Quality
- **ESLint**: Configured with React-specific rules
- **Prettier**: Not configured (recommended to add)
- **TypeScript**: Not implemented (JavaScript only)

## 📱 Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills
- No specific polyfills configured
- Modern JavaScript features used (ES2020+)

## 🔍 Monitoring & Debugging

### Analytics Debugger
- **Component**: `AnalyticsDebugger.jsx`
- **Features**: Real-time analytics status monitoring
- **Access**: Development mode or `?debug=true`

### Console Logging
- Comprehensive logging for all analytics events
- Color-coded console messages
- Timestamped event tracking

## 📋 TODO & Improvements

### Security Enhancements
- [ ] Implement proper CSP headers
- [ ] Add security headers configuration
- [ ] Set up environment variable management
- [ ] Add input sanitization for forms

### Performance Optimizations
- [ ] Implement code splitting
- [ ] Add service worker for caching
- [ ] Optimize images and assets
- [ ] Add performance monitoring

### Code Quality
- [ ] Add TypeScript migration
- [ ] Implement unit tests
- [ ] Add integration tests
- [ ] Set up CI/CD pipeline

### Features
- [ ] Add backend API integration
- [ ] Implement real form submission
- [ ] Add CMS integration
- [ ] Implement A/B testing framework