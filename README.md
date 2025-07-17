# Mosley Auto Website

A website for Mosley Auto, a used car dealership and repair shop from GTA V roleplay. This website showcases the store's vehicle inventory and services with an early 2000s sleazy car dealership aesthetic.

## Features

- **Vehicle Inventory**: Browse regular inventory of used vehicles
- **Secret Inventory**: Access a hidden inventory of "stolen" vehicles via a Konami code
- **Services**: View all services offered with pricing
- **Admin Panel**: Manage vehicle inventory with a password-protected admin interface
- **Early 2000s Design**: Authentic early 2000s sleazy car dealership aesthetic with animated elements and star bursts

## Tech Stack

- **Next.js**: React framework for building the frontend
- **Vercel**: Hosting platform
- **CSS-in-JS**: Styling approach using inline styles
- **Custom Fonts**: "Paint on the Wall" font for Mosley Auto headings

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mosleyauto.git
   cd mosleyauto
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
mosleyauto/
├── public/
│   └── assets/
│       └── fonts/
│           ├── Paint On The Wall.otf
│           └── Paint On The Wall.ttf
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   ├── contact/
│   │   │   └── page.js
│   │   ├── inventory/
│   │   │   └── page.js
│   │   ├── secret-inventory/
│   │   │   └── page.js
│   │   ├── services/
│   │   │   └── page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── AdminVehicleForm.js
│   │   ├── AdminVehicleList.js
│   │   ├── FeaturedVehicles.js
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── KonamiCode.js
│   │   ├── ServicesOverview.js
│   │   └── Starburst.js
│   ├── lib/
│   │   └── (utility functions)
│   └── middleware.js
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

## Usage

### Regular Inventory

The regular inventory is accessible to all users through the "Inventory" link in the navigation menu.

### Secret Inventory

The secret inventory is accessible by entering the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) on any page, then entering the password "stolen123".

### Admin Panel

The admin panel is accessible through the "Admin" link in the navigation menu. Use the password "mosley123" to log in.

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Vercel will automatically deploy the website

## License

This project is for educational and roleplay purposes only.

## Acknowledgements

- GTA V and all related properties belong to Rockstar Games
- "Paint on the Wall" font used for the Mosley Auto logo