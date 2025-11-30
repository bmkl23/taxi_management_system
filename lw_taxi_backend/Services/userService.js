const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.registerUser = async ({ name, email, mobile, password }) => {
 
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        mobile,
        password: hashedPassword,
     
        role: "GUEST" 
    });


    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

 
    return { 
        token, 
        user: { 
            id: user._id, 
            role: user.role, 
            name: user.name 
        } 
    };
};


exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Incorrect password");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

 
    return { 
        token, 
        user: { 
            id: user._id, 
            role: user.role,
            name: user.name
        } 
    };
};


exports.getAllUsers = async () => {
  const User = require("../Models/User");
  return await User.find().sort({ createdAt: -1 });
};
