import {
  getUserDetails,
  updateUserDetails,
  checkEmailExists
} from '../../Models/customers/profile.js';

export const getUserProfile = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await getUserDetails(user_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch user details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const { user_id } = req.params;
  const updateData = req.body;

  try {
    // Check if user exists first
    const user = await getUserDetails(user_id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    // If email is being updated, check if new email already exists
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await checkEmailExists(updateData.email, user_id);
      if (emailExists) {
        return res.status(400).json({
          status: false,
          message: 'Email already in use by another account'
        });
      }
    }

    const updated = await updateUserDetails(user_id, updateData);
    
    if (!updated) {
      return res.status(500).json({
        status: false,
        message: 'Failed to update user details'
      });
    }

    const updatedUser = await getUserDetails(user_id);
    
    res.status(200).json({
      status: true,
      message: 'User details updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to update user details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};