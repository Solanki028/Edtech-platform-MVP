const express = require('express');
const router = express.Router();
const {
    createCourse,
    updateCourse,
    deleteCourse,
    assignCourse,
    addChapter,
    getChapters,
    getStudentCourses,
    updateChapter,
    deleteChapter,
    getEnrolledStudents,
    getAllCourses,
    enrollCourse,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('admin'), createCourse)
    .get(getAllCourses); // Public catalog

router.route('/student')
    .get(protect, authorize('student'), getStudentCourses);

router.route('/:id')
    .put(protect, authorize('admin'), updateCourse)
    .delete(protect, authorize('admin'), deleteCourse);

router.route('/:id/assign')
    .post(protect, authorize('admin'), assignCourse);

router.route('/:id/enroll')
    .post(protect, authorize('student'), enrollCourse);

router.route('/:id/chapters')
    .post(protect, authorize('admin'), addChapter)
    .get(protect, getChapters);

router.route('/:id/chapters/:chapterId')
    .put(protect, authorize('admin'), updateChapter)
    .delete(protect, authorize('admin'), deleteChapter);

router.route('/:id/students')
    .get(protect, authorize('admin'), getEnrolledStudents);

module.exports = router;
