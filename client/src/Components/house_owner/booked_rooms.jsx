import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Check, X, Loader, AlertCircle, Info } from 'lucide-react';

const BookedRooms = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ownerId, setOwnerId] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [currentAction, setCurrentAction] = useState({});
  const [reason, setReason] = useState('');

  // Load owner data
  useEffect(() => {
    const ownerData = JSON.parse(localStorage.getItem('ownerData'));
    setOwnerId(ownerData?.user_id || ownerData?.owner_id);
  }, []);

  // Fetch bookings
  useEffect(() => {
    if (!ownerId) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/owner/${ownerId}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setBookings(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [ownerId]);

  const handleStatusUpdate = (bookingId, status) => {
    // For cancellations/completions, show reason modal
    if (status === 'cancelled' || status === 'completed') {
      setCurrentAction({ bookingId, status });
      setShowReasonModal(true);
      return;
    }
    
    // Direct update for confirmations
    updateBookingStatus(bookingId, status);
  };

  const updateBookingStatus = async (bookingId, status, reason = '') => {
    try {
      setError('');
      setSuccess('');

      let endpoint;
      switch(status) {
        case 'confirmed':
          endpoint = 'confirm_status';
          break;
        case 'completed':
          endpoint = 'completed_status';
          break;
        case 'cancelled':
          endpoint = 'cancelled_status';
          break;
        default:
          throw new Error('Invalid status');
      }

      const response = await axios.patch(
        `http://localhost:5000/api/owner/${bookingId}/${endpoint}`,
        { status, reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(`Booking marked as ${status} successfully`);
        setBookings(bookings.map(booking => 
          booking.booking_id === bookingId 
            ? { ...booking, booking_status: status } 
            : booking
        ));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking');
    } finally {
      setShowReasonModal(false);
      setReason('');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    const statusIcons = {
      pending: <Clock className="w-4 h-4 mr-1" />,
      confirmed: <Check className="w-4 h-4 mr-1" />,
      cancelled: <X className="w-4 h-4 mr-1" />,
      completed: <Info className="w-4 h-4 mr-1" />
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Bookings</h2>
      
      {/* Status messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
          <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              Reason for marking as {currentAction.status}
            </h3>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows={4}
              placeholder="Enter reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setReason('');
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => updateBookingStatus(currentAction.bookingId, currentAction.status, reason)}
                disabled={!reason.trim()}
                className={`px-4 py-2 text-white rounded-md ${!reason.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No bookings found
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg">
                  {booking.house_name} - {booking.room_name}
                </h3>
                {getStatusBadge(booking.booking_status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>
                    {formatDate(booking.from_date)} to {formatDate(booking.to_date)}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>
                    {booking.from_time} - {booking.to_time}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Booked by: {booking.user_name}</p>
                <p className="text-sm text-gray-600">Location: {booking.user_location}</p>
                <p className="text-sm text-gray-600">Occupation: {booking.user_job_occupation}</p>
              </div>

              {/* Action buttons based on status */}
              <div className="flex flex-wrap gap-3">
                {booking.booking_status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking.booking_id, 'confirmed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.booking_id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </button>
                  </>
                )}

                {booking.booking_status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking.booking_id, 'completed')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.booking_id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </button>
                  </>
                )}

                {booking.booking_status === 'completed' && (
                  <div className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-2" />
                    <span>This booking has been successfully completed</span>
                  </div>
                )}

                {booking.booking_status === 'cancelled' && (
                  <div className="flex items-center text-red-600">
                    <X className="w-4 h-4 mr-2" />
                    <span>This booking has been cancelled</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookedRooms;