const mongoose = require('mongoose');

const leadSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        courseInterest: {
            type: String,
        },
        message: {
            type: String,
        },
        status: {
            type: String,
            enum: ['New', 'Contacted', 'Enrolled', 'Closed'],
            default: 'New',
        },
    },
    {
        timestamps: true,
    }
);

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
