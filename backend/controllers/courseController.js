const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can create courses' });
    }

    const { title, description, category, price, oldPrice, duration, level, image } = req.body;

    const course = new Course({
        title,
        description,
        category: category || 'General',
        price: price || 0,
        oldPrice,
        duration: duration || '4 Weeks',
        level: level || 'Beginner',
        image: image || 'https://via.placeholder.com/300',
        mentor: req.user._id, // Keep field for DB compatibility but it's always the admin now
        students: [],
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
};

// @desc    Get all courses (Global Catalog)
const getAllCourses = async (req, res) => {
    const courses = await Course.find({}).populate('mentor', 'name email');
    res.json(courses);
};

// @desc    Update course
const updateCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this course' });
        }

        course.title = req.body.title || course.title;
        course.description = req.body.description || course.description;
        course.category = req.body.category || course.category;
        course.price = req.body.price || course.price;
        course.oldPrice = req.body.oldPrice || course.oldPrice;
        course.duration = req.body.duration || course.duration;
        course.level = req.body.level || course.level;
        course.image = req.body.image || course.image;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Delete course
const deleteCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this course' });
        }

        await course.deleteOne();
        await Chapter.deleteMany({ course: course._id });
        res.json({ message: 'Course removed' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Assign course to student
const assignCourse = async (req, res) => {
    const { email } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const student = await User.findOne({ email });
        if (!student || student.role !== 'student') {
            return res.status(400).json({ message: 'Student not found' });
        }

        if (!course.students.includes(student._id)) {
            course.students.push(student._id);
            await course.save();
        }

        res.json({ message: 'Student assigned', course });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Self-enroll in course
const enrollCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (course) {
        if (course.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        course.students.push(req.user._id);
        await course.save();

        res.json({ message: 'Enrolled successfully' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Add chapter to course
const addChapter = async (req, res) => {
    const { title, description, videoUrl, sequenceOrder } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const chapter = new Chapter({
            course: course._id,
            title,
            description,
            videoUrl,
            sequenceOrder,
        });

        const createdChapter = await chapter.save();
        res.status(201).json(createdChapter);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Get chapters of a course
const getChapters = async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role === 'student' && !course.students.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not enrolled' });
    }

    const chapters = await Chapter.find({ course: req.params.id }).sort({ sequenceOrder: 1 });
    res.json(chapters);
};

// @desc    Update chapter
const updateChapter = async (req, res) => {
    const { title, description, videoUrl, sequenceOrder } = req.body;
    const chapter = await Chapter.findById(req.params.chapterId);

    if (chapter) {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        chapter.title = title || chapter.title;
        chapter.description = description || chapter.description;
        chapter.videoUrl = videoUrl || chapter.videoUrl;
        chapter.sequenceOrder = sequenceOrder || chapter.sequenceOrder;

        const updatedChapter = await chapter.save();
        res.json(updatedChapter);
    } else {
        res.status(404).json({ message: 'Chapter not found' });
    }
};

// @desc    Delete chapter
const deleteChapter = async (req, res) => {
    const chapter = await Chapter.findById(req.params.chapterId);
    if (chapter) {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await chapter.deleteOne();
        res.json({ message: 'Chapter removed' });
    } else {
        res.status(404).json({ message: 'Chapter not found' });
    }
};

// @desc    Get courses for logged in student
const getStudentCourses = async (req, res) => {
    const courses = await Course.find({ students: req.user._id }).populate('mentor', 'name');

    const coursesWithProgress = await Promise.all(courses.map(async (course) => {
        const chapterCount = await Chapter.countDocuments({ course: course._id });
        const progress = await Progress.findOne({ student: req.user._id, course: course._id });
        const completedCount = progress ? progress.completedChapters.length : 0;
        const percent = chapterCount === 0 ? 0 : Math.round((completedCount / chapterCount) * 100);

        return {
            ...course.toObject(),
            totalChapters: chapterCount,
            completedChapters: completedCount,
            progress: percent,
        };
    }));

    res.json(coursesWithProgress);
};

// @desc    Get enrolled students for a course
const getEnrolledStudents = async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const chapterCount = await Chapter.countDocuments({ course: course._id });
        const studentsData = await Promise.all(course.students.map(async (studentId) => {
            const student = await User.findById(studentId).select('name email');
            if (!student) return null;
            const progress = await Progress.findOne({ student: studentId, course: course._id });
            const completedCount = progress ? progress.completedChapters.length : 0;
            const percent = chapterCount === 0 ? 0 : Math.round((completedCount / chapterCount) * 100);
            return { _id: student._id, name: student.name, email: student.email, progress: percent };
        }));
        res.json(studentsData.filter(s => s !== null));
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    assignCourse,
    enrollCourse,
    addChapter,
    getChapters,
    updateChapter,
    deleteChapter,
    getStudentCourses,
    getEnrolledStudents,
    getAllCourses,
};
