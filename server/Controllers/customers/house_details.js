import {
  getHousesWithOwners,
  getHouseByIdWithOwner
} from '../../Models/customers/house_details.js';

export const getAllHouses = async (req, res) => {
  try {
    const houses = await getHousesWithOwners();
    res.json({
      status: true,
      message: "Houses fetched successfully",
      data: houses
    });
  } catch (error) {
    console.error("Error fetching houses:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch houses",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getHouseDetails = async (req, res) => {
  const { houseId } = req.params;

  if (!houseId || isNaN(houseId)) {
    return res.status(400).json({
      status: false,
      message: "Invalid house ID"
    });
  }

  try {
    const house = await getHouseByIdWithOwner(houseId);
    res.json({
      status: true,
      message: "House details fetched successfully",
      data: house
    });
  } catch (error) {
    console.error("Error fetching house details:", error);
    if (error.message === "House not found") {
      return res.status(404).json({
        status: false,
        message: error.message
      });
    }
    res.status(500).json({
      status: false,
      message: "Failed to fetch house details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};