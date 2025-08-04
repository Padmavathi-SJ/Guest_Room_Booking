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

    // Don't return password in the response
    delete user.password;

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
    // Check if user exists
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

    // Don't allow updating user_id or created_at
    if (updateData.user_id || updateData.created_at) {
      return res.status(400).json({
        status: false,
        message: 'Cannot update user ID or creation date'
      });
    }

    // Update the user details
    const isUpdated = await updateUserDetails(user_id, updateData);
    if (!isUpdated) {
      return res.status(500).json({
        status: false,
        message: 'Failed to update user details'
      });
    }

    // Get updated user details
    const updatedUser = await getUserDetails(user_id);
    delete updatedUser.password;

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