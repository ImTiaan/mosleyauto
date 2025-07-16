# 🚗 MOSLEY AUTO - The Best Damn Car Dealership Website! 🚗

Welcome to the most AMAZING retro car dealership website you've ever seen! This is the digital home of **Mosley Auto** - where QUALITY meets STYLE!

## ✨ Features

- **Retro Design**: Authentic "shitty old car sales" aesthetic with modern functionality
- **Stock Management**: Easy-to-use admin panel for adding/removing vehicles
- **Team Showcase**: Show off your amazing sales team
- **Contact Information**: Let customers find you easily
- **Responsive Design**: Looks great on all devices
- **Custom Font**: "Paint On The Wall" for that authentic feel
- **Admin Panel**: Password-protected backend for easy management

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js with Vercel Functions
- **Database**: JSON files (simple and effective!)
- **Deployment**: Vercel
- **Styling**: Custom CSS with retro animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Vercel CLI (for deployment)

### Local Development

1. **Clone or download this project**
   ```bash
   cd /path/to/mosley-auto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Main site: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`

### 🌐 Deployment to Vercel

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```
   or simply:
   ```bash
   vercel
   ```

4. **Follow the prompts** and your site will be live!

## 🔐 Admin Access

- **Admin URL**: `https://yourdomain.com/admin`
- **Default Password**: `mosley2024`
- **Change the password** in `/admin/index.html` and `/api/stock.js` & `/api/team.js`

## 📁 Project Structure

```
mosley-auto/
├── index.html              # Homepage
├── stock.html              # Vehicle inventory
├── team.html               # Team showcase
├── contact.html            # Contact information
├── package.json            # Dependencies
├── admin/
│   ├── index.html          # Admin login
│   └── dashboard.html      # Admin dashboard
├── api/
│   ├── stock.js            # Vehicle API
│   └── team.js             # Team API
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── main.js         # Frontend JavaScript
│   ├── fonts/
│   │   └── Paint On The Wall.ttf
│   └── images/
│       ├── placeholder-car.svg
│       └── placeholder-person.svg
└── data/
    ├── vehicles.json       # Vehicle data
    └── team.json           # Team data
```

## 🎨 Customization

### Colors
- **Primary Red**: `#ff0000` (Mosley Auto branding)
- **Secondary Blue**: `#0066cc` (Complementary text)
- **Accent Yellow**: `#ffff00` (Highlights and effects)

### Adding Vehicles
1. Go to `/admin` and login
2. Use the "Manage Vehicles" section
3. Fill out the form with vehicle details
4. Add image URLs (or use placeholders)

### Adding Team Members
1. Go to `/admin` and login
2. Use the "Manage Team" section
3. Fill out team member information
4. Add photo URLs (or use placeholders)

### Changing Content
- **Business Info**: Edit `contact.html`
- **Homepage Content**: Edit `index.html`
- **Styling**: Modify `assets/css/style.css`

## 🔧 API Endpoints

### Vehicles
- `GET /api/stock` - Get all vehicles
- `POST /api/stock` - Add new vehicle (requires admin key)
- `DELETE /api/stock` - Delete vehicle (requires admin key)

### Team
- `GET /api/team` - Get all team members
- `POST /api/team` - Add new team member (requires admin key)
- `DELETE /api/team` - Delete team member (requires admin key)

## 🛡️ Security

- Admin functions require authentication
- API endpoints validate admin keys
- No sensitive data exposed to frontend
- Input validation on all forms

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🎯 SEO Features

- Semantic HTML structure
- Meta tags for social sharing
- Responsive design
- Fast loading times
- Clean URLs

## 🚨 Troubleshooting

### Common Issues

1. **Images not loading**
   - Check image URLs are valid
   - Ensure CORS is properly configured
   - Use placeholder images as fallback

2. **Admin panel not working**
   - Verify admin key is correct
   - Check browser console for errors
   - Ensure API endpoints are accessible

3. **Deployment issues**
   - Verify Vercel CLI is installed
   - Check project structure matches requirements
   - Review Vercel deployment logs

## 📞 Support

Need help? Contact the development team or check the following:
- Vercel documentation
- Browser developer tools
- Network tab for API issues

## 🎉 Credits

Built with ❤️ for **Mosley Auto** - where every car is a STAR!

---

**Remember**: This website is designed to look intentionally "retro" and "unprofessional" while maintaining modern functionality and security. Embrace the aesthetic! 🌟