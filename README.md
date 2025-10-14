# Dohani Medicare Website

A modern, fully-functional healthcare website built with React, Vite, and Flask, featuring an AI-powered chatbot and content management system.

## Features

### Frontend
- **Modern React Application**: Built with React 18 and Vite for fast development and optimal performance
- **Responsive Design**: Fully responsive design that works seamlessly on desktop, tablet, and mobile devices
- **AI-Powered Chatbot**: Floating chatbot accessible on all pages with OpenAI integration for intelligent responses
- **Professional UI**: Built with Tailwind CSS and shadcn/ui components for a sleek, modern appearance
- **Smooth Animations**: Engaging micro-interactions and transitions using CSS animations
- **Comprehensive Sections**:
  - Hero section with compelling call-to-action
  - Services showcase with detailed descriptions
  - About Us with facility images
  - Medical team profiles
  - Contact form with multiple contact methods
  - News and updates section

### Backend (CMS & Email Notifications)
- **Flask REST API**: Lightweight Python backend for data management
- **Content Management System**: Manage services, working hours, and contact information
- **Message Management**: Store and manage patient inquiries and chatbot requests
- **Email Notifications**: Automatic email notifications for new messages (configurable with SMTP)
- **Admin Dashboard**: React-based admin interface for easy content updates

### AI Chatbot Features
- **Intelligent Responses**: Uses OpenAI GPT-4.1-mini for natural language understanding
- **Knowledge Base**: Pre-configured with clinic information including:
  - Medical services and descriptions
  - Working hours for different departments
  - Contact information
  - Appointment booking procedures
  - Insurance and payment information
  - Frequently asked questions
- **Fallback System**: Local keyword-based responses when API is unavailable
- **Quick Actions**: Pre-defined quick response buttons for common queries
- **Conversation History**: Maintains context throughout the conversation

## Technology Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- shadcn/ui Components
- Lucide Icons
- React Router DOM

### Backend
- Python 3.11
- Flask
- Flask-CORS
- JSON file storage (easily upgradeable to database)

### AI Integration
- OpenAI API (GPT-4.1-mini)

## Installation & Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn or pnpm

### Frontend Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create a `.env` file in the root directory:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. (Optional) Configure email notifications by setting environment variables:
```bash
export SMTP_SERVER=smtp.gmail.com
export SMTP_PORT=587
export SENDER_EMAIL=your_email@gmail.com
export SENDER_PASSWORD=your_app_password
export ADMIN_EMAIL=admin@dohanmedicare.com
```

4. Start the Flask server:
```bash
python server.py
```

The API will be available at `http://localhost:5000`

### Accessing the CMS Admin Panel

To access the admin panel, navigate to `/admin` in your browser:
```
http://localhost:5173/admin
```

From here you can:
- Add, edit, and delete medical services
- Update working hours
- Manage contact information
- View and respond to patient messages

## Project Structure

```
dohani-medicare/
├── src/
│   ├── assets/           # Images and static files
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── ChatBot.jsx  # AI chatbot component
│   │   └── CMSAdmin.jsx # Admin dashboard
│   ├── lib/             # Utility functions
│   ├── App.jsx          # Main application component
│   ├── App.css          # Component styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── backend/
│   ├── server.py        # Flask API server
│   ├── requirements.txt # Python dependencies
│   ├── cms_data.json    # CMS data storage (auto-generated)
│   └── messages.json    # Messages storage (auto-generated)
├── public/              # Public assets
├── index.html          # HTML entry point
├── package.json        # Node dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md          # This file
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `python backend/server.py` - Start Flask development server

## Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:

```bash
npm run build
```

This creates a `dist` folder that can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Or any static hosting service

### Backend Deployment
The Flask backend can be deployed to:
- Heroku
- AWS EC2
- Google Cloud Run
- DigitalOcean App Platform
- Any Python-compatible hosting service

For production, consider:
- Using a proper database (PostgreSQL, MySQL) instead of JSON files
- Setting up proper SMTP credentials for email notifications
- Implementing authentication for the admin panel
- Using environment variables for all sensitive data
- Setting up HTTPS/SSL certificates

## API Documentation

### CMS Endpoints

#### Get all CMS data
```
GET /api/cms/data
```

#### Manage Services
```
GET    /api/cms/services           # Get all services
POST   /api/cms/services           # Create new service
GET    /api/cms/services/:id       # Get specific service
PUT    /api/cms/services/:id       # Update service
DELETE /api/cms/services/:id       # Delete service
```

#### Manage Working Hours
```
GET /api/cms/working-hours         # Get working hours
PUT /api/cms/working-hours         # Update working hours
```

#### Manage Contact Info
```
GET /api/cms/contact               # Get contact info
PUT /api/cms/contact               # Update contact info
```

### Message Endpoints

```
GET    /api/messages               # Get all messages
POST   /api/messages               # Submit new message
GET    /api/messages/:id           # Get specific message
PUT    /api/messages/:id           # Update message status
DELETE /api/messages/:id           # Delete message
```

### Chatbot Notification
```
POST /api/chatbot/notify           # Send chatbot request notification
```

## Customization

### Updating Colors
The primary color scheme uses blue tones. To change colors, update the CSS variables in `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;      /* Primary color */
  --primary-foreground: 210 40% 98%;
  /* ... other color variables */
}
```

### Adding New Services
Use the admin panel at `/admin` or directly update via API:

```javascript
POST /api/cms/services
{
  "name": "New Service",
  "description": "Service description",
  "keywords": ["keyword1", "keyword2"]
}
```

### Configuring the Chatbot
Update the `cmsData` object in `src/components/ChatBot.jsx` to modify the chatbot's knowledge base.

## Support & Maintenance

### Updating Content
All content can be updated through the admin panel without code changes.

### Monitoring Messages
Check the Messages tab in the admin panel regularly to respond to patient inquiries.

### Backup
Regularly backup the following files:
- `backend/cms_data.json`
- `backend/messages.json`

## License

This project is proprietary software created for Dohani Medicare.

## Contact

For technical support or questions about this project, please contact the development team.