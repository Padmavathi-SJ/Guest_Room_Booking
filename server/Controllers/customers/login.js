import { 
    registerCustomer,
    loginCustomer
} from '../../Models/customers/login.js';

export const register = async (req, res) => {
    const { name, email, password, mobile_num } = req.body;
    
    // Input validation
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
        const result = await registerCustomer(req.body);
        return res.json({ 
            status: true, 
            message: "Customer registered successfully",
            customerId: result.customerId 
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
    const { email, password, mobile_num } = req.body;
    
    if (!email || !password || !mobile_num) {
        return res.status(400).json({
            status: false,
            message: "Email, password and mobile number are required"
        });
    }

    try {
        const customer = await loginCustomer(email, password, mobile_num);
        return res.json({ 
            status: true, 
            message: "Login successful",
            customer: {
                user_id: customer.user_id,
                name: customer.name,
                email: customer.email,
                mobile_num: customer.mobile_num,
                created_at: customer.created_at
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