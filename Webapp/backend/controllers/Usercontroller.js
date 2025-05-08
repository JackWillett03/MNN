const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,./?]).{8,}$/;

exports.addUser = async (req, res) => { // Add new user
    try {
        const { Username, Password, IsZeus, IsOwner } = req.body;

        if (!passwordRegex.test(Password)) { // Check password
            return res.status(400).json({ message: 'Password must be at least 8 characters long, have a capital, contain at least one number and one symbol' });
        }

        // Encrypt the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = new User({
            Username,
            Password: hashedPassword,
            IsZeus,
            IsOwner,
        });

        await newUser.save(); // Save it to the database
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => { // Login
    try {
        const { Username, Password } = req.body;

        // Find the user by username
        const user = await User.findOne({ Username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create the JWT token
        const payload = {
            id: user._id,
            username: user.Username,
            IsZeus: user.IsZeus,
            IsOwner: user.IsOwner,
        };
        console.log("Token Payload:", payload);

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated Token:", token);  // Debugging: Check the generated token

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-Password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-Password'); // Exclude Password field
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user by ID', error: err.message });
  }
};


// Get users by IsZeus true
exports.getZeusUsers = async (req, res) => {
  try {
    const users = await User.find({ IsZeus: true }, '-Password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving Zeus users', error: err.message });
  }
};

// Get user by username
exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ Username: req.params.username }, '-Password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { Username, Password, IsZeus, IsOwner } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (Username) user.Username = Username;
    if (typeof IsZeus === "boolean") user.IsZeus = IsZeus;
    if (typeof IsOwner === "boolean") user.IsOwner = IsOwner;
    if (Password) user.Password = await bcrypt.hash(Password, 10);

    await user.save();
    req.io.emit("userUpdated");
    res.json({ message: 'User updated successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.io.emit("userUpdated");
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
