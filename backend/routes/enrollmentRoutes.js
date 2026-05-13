const express = require('express');
const router = express.Router();
const { 
    createEnrollment, 
    getAllEnrollments, 
    updateEnrollmentStatus, 
    getMyEnrollments 
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('student'), createEnrollment);

router.route('/admin')
    .get(protect, authorize('admin'), getAllEnrollments);

router.route('/my')
    .get(protect, authorize('student'), getMyEnrollments);

router.route('/:id/status')
    .put(protect, authorize('admin'), updateEnrollmentStatus);

module.exports = router;
