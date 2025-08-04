import { 
    registerOwner,
loginOwner
 } from '../../Models/house_owners/login.js';

// In your controller
export const register = async (req, res) => {
    // Input validation
    const { name, email, password, mobile_num } = req.body;
    if (!name || !email || !password || !mobile_num) {
        return res.status(400).json({
            status: false,
            message: "Missing required fields: name, email, password, mobile_num"
        });
    }

    // Additional validation checks
    if (password.length < 6) {
        return res.status(400).json({
            status: false,
            message: "Password must be at least 6 characters"
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            status: false,
            message: "Invalid email format"
        });
    }

    if (!/^[0-9]{10,15}$/.test(mobile_num)) {
        return res.status(400).json({
            status: false,
            message: "Mobile number must be 10-15 digits"
        });
    }

    try {
        const result = await registerOwner(req.body);
        return res.json({ 
            status: true, 
            message: "Owner registered successfully",
            ownerId: result.ownerId 
        });
    } catch (error) {
        console.log("Registration error:", error);
        if (error.message === "Email already exists") {
            return res.status(400).json({ 
                status: false, 
                message: error.message 
            });
        }
        return res.status(500).json({ 
            status: false, 
            message: "Registration failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const login = async (req, res) => {
    const { email, password, mobile_num } = req.body; // Get mobile_num from body
    
    if (!email || !password || !mobile_num) {
        return res.status(400).json({
            status: false,
            message: "Email, password and mobile number are required"
        });
    }

    try {
        const owner = await loginOwner(email, password, mobile_num);
        return res.json({ 
            status: true, 
            message: "Login successful",
            owner: {
                owner_id: owner.owner_id,
                name: owner.name,
                email: owner.email,
                mobile_num: owner.mobile_num,
                // Include other fields as needed
            }
        });
    } catch (error) {
        console.log("Login error:", error);
        return res.status(401).json({ 
            status: false, 
            message: error.message || "Login failed" 
        });
    }
};

