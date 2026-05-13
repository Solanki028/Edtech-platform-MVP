const Lead = require('../models/Lead');

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
    const { name, email, phone, courseInterest, message } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Please provide name, email, and phone' });
    }

    const lead = new Lead({
        name,
        email,
        phone,
        courseInterest,
        message,
    });

    const createdLead = await lead.save();
    res.status(201).json(createdLead);
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private/Admin
const getLeads = async (req, res) => {
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    res.json(leads);
};

module.exports = {
    createLead,
    getLeads,
};
