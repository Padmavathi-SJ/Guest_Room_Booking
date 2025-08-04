import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import OwnerAuth from '../src/auth/OwnerAuth';
import OwnerLayout from '../src/Components/house_owner/OwnerLayout';
import OwnerDashboard from '../src/Components/house_owner/Dashboard';
import OwnerHouses from '../src/Components/house_owner/my_houses';
import AddHouse from '../src/Components/house_owner/add_house';
import AddRoom from '../src/Components/house_owner/add_room';
import Rooms from '../src/Components/house_owner/rooms';
import AddRoomPicture from '../src/Components/house_owner/add_room_picture';
import RoomPictures from '../src/Components/house_owner/room_pictures';
import AddRoomBooking from '../src/Components/house_owner/add_room_booking';
import CustomerAuth from '../src/auth/CustomerAuth';
import CustomerLayout from '../src/Components/customer/CustomerLayout';
import UserDashboard from '../src/Components/customer/dashboard';
import HouseList from '../src/Components/customer/HouseList';
import MyBookings from '../src/Components/customer/my_bookings';
import RoomsList from '../src/Components/customer/RoomsList';
import VisitRoomPictures from '../src/Components/customer/room_pictures';
import BookedRooms from '../src/Components/house_owner/booked_rooms';
import EditHouse from '../src/Components/house_owner/EditHouseForm';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<OwnerAuth />} />
        
        {/* Nested owner routes */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="my_houses" element={<OwnerHouses />} />
          <Route path="add_house" element={<AddHouse />} />
          <Route path="add_room/:house_id" element={<AddRoom />} />
          <Route path="rooms/:house_id" element={<Rooms />} />
          <Route path="add_room_picture/:room_id" element={<AddRoomPicture />} />
          <Route path="room_pictures/:room_id" element={<RoomPictures />} />
          <Route path="add_booking_details/:room_id" element={<AddRoomBooking />} />
          <Route path="booked_rooms" element={<BookedRooms />} />
          <Route path="edit_house/:house_id" element={<EditHouse />} />
          
        </Route>
        
        <Route path="/userLogin" element={<CustomerAuth />}/>

        <Route path="/user" element={<CustomerLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="visit_houses" element={<HouseList />} />
        <Route path="my_bookings" element={<MyBookings />} />
        <Route path="visit_rooms/:house_id" element={<RoomsList />} />
        <Route path="see_room_pictures/:room_id" element={<VisitRoomPictures />} />


        </Route>




        {/* Redirects */}
        <Route path="/" element={<Navigate to="/owner" replace />} />
        <Route path="*" element={<Navigate to="/owner" replace />} />
      </Routes>
    </Router>
  );
}

export default App;