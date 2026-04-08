# Weather App — Mohamed Dhia Abidi

A full-stack weather application built with **Next.js**, **MongoDB**, and the **OpenWeatherMap API** as part of the PM Accelerator AI Engineer Internship Technical Assessment.

---

## About PM Accelerator

**Product Manager Accelerator** is designed to support PM professionals through every stage of their career. From students to Directors, they provide tailored coaching, resources, and community to help you land your dream job and excel in your career.

---

## Features

### Tech Assessment #1 — Frontend
- Search by city name, zip/postal code, landmark, or GPS coordinates
- "My Location" button using browser geolocation
- Current weather: temperature, feels like, humidity, wind speed, weather icons
- 5-day forecast in a clean grid layout
- Interactive OpenStreetMap map for the searched location
- YouTube videos related to the searched location
- Graceful error handling (city not found, API failure, invalid input)
- Responsive design for desktop, tablet, and mobile (Tailwind CSS)

### Tech Assessment #2 — Backend
- MongoDB + Mongoose for full data persistence
- CRUD: Create, Read, Update, Delete weather records
- Date range input with validation (start must be before end)
- Fuzzy location validation via OpenStreetMap Nominatim before saving
- Data export in **JSON, CSV, XML, Markdown, PDF**
- RESTful API routes under `/api/`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | MongoDB Atlas + Mongoose |
| Weather API | OpenWeatherMap |
| Map | Leaflet + OpenStreetMap |
| Videos | YouTube Data API v3 |
| PDF Export | jsPDF |
| CSV Export | PapaParse |
| XML Export | xmlbuilder2 |

---

## Getting Started

### 1. Clone the repository

git clone https://github.com/mohameddhiaabidi3301/weather-app.git
cd weather-app

### 2. Install dependencies

npm install

### 3. Configure environment variables

Copy the example env file and fill in your keys:

cp .env.example .env.local

Edit `.env.local`:

OPENWEATHER_API_KEY=your_openweathermap_api_key
YOUTUBE_API_KEY=your_youtube_data_v3_key
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/

**Where to get the keys:**
- OpenWeatherMap: https://openweathermap.org/api (free tier)
- YouTube Data API v3: https://console.cloud.google.com/
- MongoDB Atlas: https://www.mongodb.com/atlas (free M0 cluster)

### 4. Run the development server

npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather?location=` | Fetch current weather + 5-day forecast |
| GET | `/api/records` | Read all saved weather records |
| POST | `/api/records` | Save a new weather record |
| PUT | `/api/records/:id` | Update an existing record |
| DELETE | `/api/records/:id` | Delete a record |
| GET | `/api/export?format=` | Export records (json/csv/xml/markdown/pdf) |
| GET | `/api/youtube?location=` | Fetch YouTube videos for a location |

## Project Structure

weather-app/
├── app/
│   ├── api/
│   │   ├── weather/route.js       # Weather + forecast API
│   │   ├── records/route.js       # CRUD - list & create
│   │   ├── records/[id]/route.js  # CRUD - update & delete
│   │   ├── export/route.js        # Multi-format data export
│   │   └── youtube/route.js       # YouTube video search
│   ├── page.js                    # Main page
│   ├── layout.js
│   └── globals.css
├── components/
│   ├── WeatherSearch.jsx          # Search bar + GPS button
│   ├── WeatherDisplay.jsx         # Current weather card + save form
│   ├── ForecastDisplay.jsx        # 5-day forecast grid
│   ├── WeatherMap.jsx             # Leaflet interactive map
│   ├── YouTubeVideos.jsx          # YouTube video results
│   ├── RecordsTable.jsx           # CRUD table with inline edit
│   └── ExportButtons.jsx          # Export format buttons
├── lib/
│   └── mongodb.js                 # MongoDB connection singleton
├── models/
│   └── Weather.js                 # Mongoose schema
├── .env.example                   # Template for environment variables
├── .gitignore
└── README.md

## Author

**Mohamed Dhia Abidi**
- Email: dhiaabidi1958@gmail.com
- LinkedIn: https://www.linkedin.com/in/mohamed-dhia-abidi/
- GitHub: https://github.com/mohameddhiaabidi3301