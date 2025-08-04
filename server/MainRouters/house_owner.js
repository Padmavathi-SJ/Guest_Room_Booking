import express from 'express'
import Login from '../Routers/house_owners/login.js';

const HouseOwnerRouter = express.Router();

HouseOwnerRouter.use('/owner', Login);

export default HouseOwnerRouter;