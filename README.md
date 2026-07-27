# Airbnb Clone

A full-stack Airbnb Clone built with Next.js, FastAPI, TypeScript, Tailwind CSS, React Query, and SQLite. The project allows users to browse properties, make reservations, save favourites, and manage listings through a host dashboard.

## Live Demo

**Frontend:** https://airbnb-clone-six-nu.vercel.app

**Backend:** https://airbnb-clone-production-189a.up.railway.app

**GitHub:** https://github.com/Rohanjha121/airbnb-clone

---

## Features

### Guest

- Browse available properties
- View listing details
- Search and filter listings
- Filter by category, location, guests, and price
- Reserve a property
- View and cancel trips
- Add or remove favourites
- Dark mode support
- Responsive design

### Host

- View hosted properties
- Add new listings
- Edit existing listings
- Delete listings
- View reservations for hosted properties

### Backend

- FastAPI REST APIs
- SQLite database
- SQLAlchemy ORM
- Automatic database initialization and seeding
- Reservation overlap validation
- Mock authentication using `X-User-Id`

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Query
- Axios
- React Hook Form
- Zod
- shadcn/ui

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- Uvicorn

---

## Folder Structure

```text
airbnb-clone
│
├── backend
│   ├── app
│   ├── models
│   ├── routers
│   ├── schemas
│   ├── requirements.txt
│   └── seed.py
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## Running Locally

### Clone the repository

```bash
git clone https://github.com/Rohanjha121/airbnb-clone.git

cd airbnb-clone
```

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on:

```
http://localhost:8000
```

Swagger documentation:

```
http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## Environment Variable

Create a `.env.local` file inside the `frontend` folder.

For local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://airbnb-clone-production-189a.up.railway.app
```

---

## API Endpoints

### Listings

```
GET    /listings
GET    /listings/{id}
POST   /listings
PATCH  /listings/{id}
DELETE /listings/{id}
```

### Reservations

```
GET    /reservations
POST   /reservations
DELETE /reservations/{id}
```

### Favourites

```
GET    /favourites
POST   /favourites/{listing_id}
```

---

## Deployment

- **Frontend:** Vercel
- **Backend:** Railway

---

## Completed Features

- Homepage with property listings
- Property detail page
- Search and filtering
- CRUD operations for listings
- Reservation system
- Host dashboard
- Wishlist / favourites
- Dark mode
- Responsive UI

---

## Author

**Rohan Jha**

B.Tech Computer Science  
Bennett University

GitHub: https://github.com/Rohanjha121