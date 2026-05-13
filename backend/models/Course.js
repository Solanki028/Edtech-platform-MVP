const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            default: 'General',
        },
        price: {
            type: Number,
            default: 0,
        },
        oldPrice: {
            type: Number,
        },
        image: {
            type: String, // URL to image
            default: 'https://via.placeholder.com/300', // Default placeholder
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        duration: {
            type: String,
            default: '4 Weeks',
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
        },
        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
