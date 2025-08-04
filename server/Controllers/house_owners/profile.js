import {
  getOwnerDetails,
  updateOwnerDetails,
  checkEmailExists
} from '../../Models/house_owners/profile.js';

export const getOwnerProfile = async (req, res) => {
  const { owner_id } = req.params;

  try {
    const owner = await getOwnerDetails(owner_id);
    if (!owner) {
      return res.status(404).json({
        status: false,
        message: 'Owner not found'
      });
    }

    // Don't return password in the response
    delete owner.password;

    res.status(200).json({
      status: true,
      data: owner
    });
  } catch (error) {
    console.error('Error fetching owner details:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch owner details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateOwnerProfile = async (req, res) => {
  const { owner_id } = req.params;
  const updateData = req.body;

  try {
    // Check if owner exists
    const owner = await getOwnerDetails(owner_id);
    if (!owner) {
      return res.status(404).json({
        status: false,
        message: 'Owner not found'
      });
    }

    // If email is being updated, check if new email already exists
    if (updateData.email && updateData.email !== owner.email) {
      const emailExists = await checkEmailExists(updateData.email, owner_id);
      if (emailExists) {
        return res.status(400).json({
          status: false,
          message: 'Email already in use by another account'
        });
      }
    }

    // Don't allow updating owner_id or created_at
    if (updateData.owner_id || updateData.created_at) {
      return res.status(400).json({
        status: false,
        message: 'Cannot update owner ID or creation date'
      });
    }

    // Update the owner details
    const isUpdated = await updateOwnerDetails(owner_id, updateData);
    if (!isUpdated) {
      return res.status(500).json({
        status: false,
        message: 'Failed to update owner details'
      });
    }

    // Get updated owner details
    const updatedOwner = await getOwnerDetails(owner_id);
    delete updatedOwner.password;

    res.status(200).json({
      status: true,
      message: 'Owner details updated successfully',
      data: updatedOwner
    });
  } catch (error) {
    console.error('Error updating owner details:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to update owner details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};