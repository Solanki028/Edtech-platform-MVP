const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');

 
const completeChapter = async (req, res) => {
    const chapter = await Chapter.findById(req.params.chapterId);

    if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
    }

    let progress = await Progress.findOne({
        student: req.user._id,
        course: chapter.course,
    });

    if (!progress) {
        const course = await Course.findById(chapter.course);
        if (!course.students.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not enrolled in this course' });
        }
        progress = new Progress({
            student: req.user._id,
            course: chapter.course,
            completedChapters: [],
            attendanceLog: []
        });
    }

    // Always log attendance when completing
    progress.attendanceLog.push({ chapterId: chapter._id, watchedAt: Date.now() });

    if (!progress.completedChapters.includes(chapter._id)) {
        progress.completedChapters.push(chapter._id);
    }
    
    await progress.save();
    res.json({ message: 'Chapter completed and attendance logged', progress });
};

const updateQuizScore = async (req, res) => {
    const { score, courseId } = req.body;
    const progress = await Progress.findOne({ student: req.user._id, course: courseId });
    if (progress) {
        progress.quizScore = score;
        await progress.save();
        res.json(progress);
    } else {
        res.status(404).json({ message: 'Progress not found' });
    }
};

const getMyProgress = async (req, res) => {
    const progress = await Progress.find({ student: req.user._id }).populate('course', 'title');
    res.json(progress);
};

const getCourseProgress = async (req, res) => {
    const progress = await Progress.findOne({ student: req.user._id, course: req.params.courseId });
    if (!progress) return res.json({ completedChapters: [], quizScore: 0, attendanceLog: [] });
    res.json(progress);
}

module.exports = { completeChapter, getMyProgress, getCourseProgress, updateQuizScore };
