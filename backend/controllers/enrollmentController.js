const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Create new enrollment (Initial Pending State)
// @route   POST /api/enrollments
// @access  Private/Student
const createEnrollment = async (req, res) => {
    const { courseId, paymentMethod, transactionId } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({ 
        student: req.user._id, 
        course: courseId,
        paymentStatus: 'completed'
    });

    if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled and paid for this course' });
    }

    const enrollment = new Enrollment({
        student: req.user._id,
        course: courseId,
        amount: course.price,
        paymentMethod,
        transactionId,
        paymentStatus: 'completed', // Auto-completed for simulated flow
        isApproved: true // Auto-approved
    });

    const createdEnrollment = await enrollment.save();

    // Add student to course students array
    if (!course.students.includes(req.user._id)) {
        course.students.push(req.user._id);
        await course.save();
    }

    res.status(201).json(createdEnrollment);
};

// @desc    Get all enrollments for Admin
// @route   GET /api/enrollments/admin
// @access  Private/Admin
const getAllEnrollments = async (req, res) => {
    const enrollments = await Enrollment.find({})
        .populate('student', 'name email')
        .populate('course', 'title price')
        .sort({ createdAt: -1 });
    res.json(enrollments);
};

// @desc    Update enrollment status (Admin Approval)
// @route   PUT /api/enrollments/:id/status
// @access  Private/Admin
const updateEnrollmentStatus = async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id);

    if (enrollment) {
        enrollment.paymentStatus = req.body.status || enrollment.paymentStatus;
        enrollment.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : enrollment.isApproved;

        // If completed and approved, add student to course students array if not present
        if (enrollment.paymentStatus === 'completed' && enrollment.isApproved) {
            const course = await Course.findById(enrollment.course);
            if (course && !course.students.includes(enrollment.student)) {
                course.students.push(enrollment.student);
                await course.save();
            }
        }

        const updatedEnrollment = await enrollment.save();
        res.json(updatedEnrollment);
    } else {
        res.status(404).json({ message: 'Enrollment not found' });
    }
};

// @desc    Get student's own enrollments
// @route   GET /api/enrollments/my
// @access  Private/Student
const getMyEnrollments = async (req, res) => {
    const enrollments = await Enrollment.find({ student: req.user._id })
        .populate('course', 'title image category');
    res.json(enrollments);
};

module.exports = {
    createEnrollment,
    getAllEnrollments,
    updateEnrollmentStatus,
    getMyEnrollments
};
