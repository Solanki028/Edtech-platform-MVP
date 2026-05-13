const User = require('../models/User');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
 
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const getAnalytics = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalChapters = await Chapter.countDocuments();

    res.json({
        totalUsers,
        totalStudents,
        totalCourses,
        totalChapters,
    });
};

const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePassword = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        if (req.body.password) {
            user.password = req.body.password;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(400).json({ message: 'Password is required' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const toggleUserStatus = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isActive = user.isActive === undefined ? false : !user.isActive; // Toggle status
        const updatedUser = await user.save();
        res.json({ message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'}`, isActive: updatedUser.isActive });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUsers, deleteUser, getAnalytics, updatePassword, createUser, toggleUserStatus };
