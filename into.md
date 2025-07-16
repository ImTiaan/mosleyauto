# Mosley Auto Website - Complete Documentation

## Overview
Mosley Auto is a retro-styled car dealership website designed for GTA roleplay scenarios. The website features a vintage aesthetic with red and blue branding, complete vehicle inventory management, team showcase, and an admin panel for content management.

## Website Structure

### Frontend Pages

#### 1. Homepage (`index.html`)
- **Purpose**: Main landing page showcasing the dealership
- **Features**:
  - Hero section with retro branding
  - Featured vehicles carousel
  - Call-to-action buttons
  - Navigation to all sections
- **Dynamic Content**: Loads featured vehicles from `/api/stock`

#### 2. Stock Page (`stock.html`)
- **Purpose**: Display all available vehicles
- **Features**:
  - Grid layout of vehicle cards
  - Vehicle details (make, model, year, price, mileage)
  - "Contact About This Car" buttons
  - Responsive design for mobile/desktop
- **Dynamic Content**: Fetches all vehicles from `/api/stock`
- **Functionality**: Email generation for inquiries

#### 3. Team Page (`team.html`)
- **Purpose**: Showcase dealership staff
- **Features**:
  - Team member cards with photos
  - Staff roles and biographies
  - Professional presentation
- **Dynamic Content**: Loads team data from `/api/team`

#### 4. Contact Page (`contact.html`)
- **Purpose**: Business information and location details
- **Features**:
  - Business hours and contact information
  - Address and directions
  - Parking and public transport info
  - Map placeholder for future integration

### Admin Panel

#### 1. Admin Login (`admin/index.html`)
- **Purpose**: Secure access to management features
- **Authentication**: Password-based (default: `mosley2024`)
- **Security**: Client-side validation with session storage
- **Redirect**: Successful login redirects to dashboard

#### 2. Admin Dashboard (`admin/dashboard.html`)
- **Purpose**: Content management interface
- **Vehicle Management**:
  - Add new vehicles with all details
  - View current inventory
  - Delete vehicles from stock
- **Team Management**:
  - Add new team members
  - View current staff
  - Remove team members
- **Features**:
  - Real-time updates
  - Form validation
  - Success/error messaging
  - Logout functionality

## Backend API

### Vehicle API (`/api/stock`)

#### GET `/api/stock`
- **Purpose**: Retrieve all vehicles
- **Response**: JSON array of vehicle objects
- **Data Structure**:
  ```json
  {
    "id": 1,
    "make": "Vapid",
    "model": "Dominator",
    "year": 2020,
    "price": 45000,
    "mileage": 15000,
    "color": "Metallic Red",
    "transmission": "Manual",
    "description": "Vehicle description",
    "image": "image_url"
  }
  ```

#### POST `/api/stock`
- **Purpose**: Add new vehicle
- **Authentication**: Requires admin key
- **Body**: Vehicle object (without ID)
- **Response**: Success/error message

#### DELETE `/api/stock`
- **Purpose**: Remove vehicle
- **Authentication**: Requires admin key
- **Body**: `{"id": vehicle_id}`
- **Response**: Success/error message

### Team API (`/api/team`)

#### GET `/api/team`
- **Purpose**: Retrieve all team members
- **Response**: JSON array of team member objects
- **Data Structure**:
  ```json
  {
    "id": 1,
    "name": "Big Mike Mosley",
    "role": "Owner & CEO",
    "bio": "Team member biography",
    "photo": "photo_url"
  }
  ```

#### POST `/api/team`
- **Purpose**: Add new team member
- **Authentication**: Requires admin key
- **Body**: Team member object (without ID)
- **Response**: Success/error message

#### DELETE `/api/team`
- **Purpose**: Remove team member
- **Authentication**: Requires admin key
- **Body**: `{"id": member_id}`
- **Response**: Success/error message

## Data Storage

### Vehicle Data (`data/vehicles.json`)
- **Format**: JSON file with vehicles array
- **Persistence**: File-based storage
- **Initial Data**: 3 sample vehicles included
- **Auto-creation**: File created if missing

### Team Data (`data/team.json`)
- **Format**: JSON file with team array
- **Persistence**: File-based storage
- **Initial Data**: 3 sample team members included
- **Auto-creation**: File created if missing

## Design & Styling

### Visual Theme
- **Style**: Retro/vintage aesthetic
- **Colors**: Red (#dc2626) and blue (#2563eb) primary palette
- **Typography**: "Paint On The Wall" custom font
- **Layout**: Responsive grid system
- **Effects**: Hover animations, smooth transitions

### Responsive Design
- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Adapted for medium screens (768px+)
- **Desktop**: Full layout for large screens (1024px+)
- **Navigation**: Mobile-friendly hamburger menu

### Assets
- **Custom Font**: Paint On The Wall (.ttf, .otf)
- **Placeholder Images**: SVG car and person placeholders
- **Icons**: Integrated icon system
- **Styling**: Single CSS file (`assets/css/style.css`)

## JavaScript Functionality

### Main Script (`assets/js/main.js`)
- **API Communication**: Fetch requests to backend
- **DOM Manipulation**: Dynamic content loading
- **Utility Functions**: Price/mileage formatting
- **Navigation**: Smooth scrolling, mobile menu
- **Animations**: Scroll-based element animations
- **Email Generation**: Contact form functionality

### Admin Scripts
- **Authentication**: Login validation
- **Form Handling**: Add/delete operations
- **Session Management**: Admin state persistence
- **Error Handling**: User feedback systems

## Deployment Configuration

### Vercel Setup (`vercel.json`)
- **Framework**: "Other" (vanilla JavaScript)
- **API Runtime**: Node.js 18.x
- **Static Files**: Served via @vercel/static
- **API Functions**: Served via @vercel/node
- **Routing**: Custom route configuration

### Package Management (`package.json`)
- **Dependencies**: http-status-codes
- **Dev Dependencies**: Vercel CLI
- **Scripts**: dev, build, deploy commands
- **Node Version**: 18.x compatibility

## Security Features

### Admin Authentication
- **Default Password**: `mosley2024`
- **Session Storage**: Browser-based persistence
- **API Protection**: Admin key validation
- **Environment Variables**: Configurable admin key

### Data Validation
- **Input Sanitization**: Form validation
- **Error Handling**: Graceful failure management
- **File System**: Secure file operations
- **CORS**: Proper cross-origin handling

## User Workflows

### Visitor Experience
1. **Homepage**: View featured vehicles and navigation
2. **Stock Browse**: Explore all available vehicles
3. **Vehicle Inquiry**: Contact about specific cars
4. **Team Info**: Learn about dealership staff
5. **Contact**: Get business information

### Admin Experience
1. **Login**: Access admin panel with password
2. **Dashboard**: View management interface
3. **Add Vehicles**: Input new car details
4. **Manage Stock**: Remove sold vehicles
5. **Team Management**: Add/remove staff members
6. **Logout**: Secure session termination

## Technical Requirements

### Server Environment
- **Runtime**: Node.js 18.x or higher
- **Platform**: Vercel (recommended) or any Node.js host
- **File System**: Read/write access for data files
- **Memory**: Minimal requirements for JSON operations

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **ES6 Features**: Fetch API, async/await, modules
- **CSS Grid**: Modern layout support
- **Custom Fonts**: Web font loading

## Maintenance & Updates

### Content Management
- **Vehicles**: Add/remove through admin panel
- **Team**: Manage staff through admin interface
- **Images**: Update URLs in admin forms
- **Descriptions**: Edit through admin dashboard

### Code Updates
- **Styling**: Modify `assets/css/style.css`
- **Functionality**: Update `assets/js/main.js`
- **API Logic**: Edit files in `api/` directory
- **Content**: Update HTML files directly

### Data Backup
- **Vehicle Data**: Backup `data/vehicles.json`
- **Team Data**: Backup `data/team.json`
- **Recovery**: Restore from JSON backups
- **Version Control**: Git-based change tracking

## Troubleshooting

### Common Issues
1. **API Errors**: Check admin key and data file permissions
2. **Font Loading**: Verify font file paths and CORS
3. **Image Display**: Confirm image URLs are accessible
4. **Mobile Layout**: Test responsive breakpoints
5. **Admin Access**: Verify password and session storage

### Development Testing
- **Local Server**: Use Python HTTP server for static testing
- **API Testing**: Requires Node.js environment
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API request/response

## Future Enhancements

### Potential Features
- **Search Functionality**: Filter vehicles by criteria
- **Image Upload**: Direct image management
- **Email Integration**: Automated inquiry handling
- **Map Integration**: Interactive location display
- **Analytics**: Visitor and inquiry tracking
- **Multi-language**: Internationalization support

### Scalability Options
- **Database**: Migrate from JSON to SQL database
- **CDN**: Implement content delivery network
- **Caching**: Add Redis or similar caching layer
- **Authentication**: Implement proper user management
- **API Rate Limiting**: Prevent abuse and overload

This documentation provides a complete overview of the Mosley Auto website's functionality, architecture, and operational procedures.