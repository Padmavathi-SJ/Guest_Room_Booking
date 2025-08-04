import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import OwnerLoginRouter from './Routers/house_owners/login.js';
import OwnerHouseRouter from './Routers/house_owners/house_details.js';
import OwnerRoomsRouter from './Routers/house_owners/room_details.js';
import RoomPicturesRouter from './Routers/house_owners/room_pictures.js';
import OwnerRoomBookingDetails from './Routers/house_owners/room_booking.js';
import DashboardRouter from './Routers/house_owners/dashboard.js'; 
import ProfileRouter from './Routers/house_owners/profile.js';

import UserLoginRouter from './Routers/customers/login.js';
import GetHousesRouter from './Routers/customers/house_details.js';
import RoomBooking from './Routers/customers/room_booking.js';
import GetRoomsRouter from './Routers/customers/room_details.js';
import GetBookedRooms from './Routers/customers/get_booked_rooms.js';
import UserProfile from './Routers/customers/profile.js';

// Configure dotenv
dotenv.config();

// Get directory name equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration to allow credentials and specific origin
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));


// Middleware to handle JSON requests
app.use(express.json());
app.use(cookieParser());

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/uploads/rooms', express.static(path.join(__dirname, 'uploads/rooms')));
app.use('/uploads/room_pictures', express.static(path.join(__dirname, 'uploads/room_pictures')));

// Routes
app.use('/api/owner', OwnerLoginRouter);
app.use('/api/owner', OwnerHouseRouter);
app.use('/api/owner', OwnerRoomsRouter);
app.use('/api/owner', RoomPicturesRouter);
app.use('/api/owner', OwnerRoomBookingDetails);
app.use('/api/owner', DashboardRouter);
app.use('/api/owner', ProfileRouter);


app.use('/api/user', UserLoginRouter);
app.use('/api/user', GetHousesRouter);
app.use('/api/user', RoomBooking);
app.use('/api/user', GetRoomsRouter);
app.use('/api/user', GetBookedRooms);
app.use('/api/user', UserProfile);


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});


export default app;