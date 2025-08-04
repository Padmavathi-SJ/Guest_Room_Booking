import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AddRoomPicture = () => {
  const { room_id } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select an image' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('picture', selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/owner/${room_id}/pictures`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessage({ type: 'success', text: 'Picture uploaded successfully!' });
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add Picture to Room #{room_id}</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
        {preview ? (
          <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-lg" />
        ) : (
          <p className="text-gray-500">No image selected</p>
        )}
      </div>

      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !selectedFile}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload Picture'}
      </button>
    </div>
  );
};

export default AddRoomPicture;