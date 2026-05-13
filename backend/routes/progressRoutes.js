const express = require('express');
const router = express.Router();
const { completeChapter, getMyProgress, getCourseProgress, updateQuizScore } = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/my')
    .get(protect, getMyProgress);

router.route('/quiz')
    .post(protect, authorize('student'), updateQuizScore);

router.route('/:chapterId/complete')
    .post(protect, authorize('student'), completeChapter);

router.route('/course/:courseId')
    .get(protect, authorize('student'), getCourseProgress);

module.exports = router;
