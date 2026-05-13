const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const Chapter = require('./models/Chapter');

dotenv.config();

const adminId = '69426f2a28b3bad94fa04b5c';

const categories = [
    {
        name: 'Web Development',
        courses: [
            {
                title: 'Full Stack MERN Mastery 2026',
                description: 'Master MongoDB, Express, React, and Node.js with real-world industry projects.',
                price: 4999,
                oldPrice: 15999,
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Intermediate',
                duration: '12 Weeks'
            },
            {
                title: 'Next.js 15 & Tailwind CSS: Zero to Hero',
                description: 'Build lightning fast production-ready apps with the latest Next.js features.',
                price: 2999,
                oldPrice: 8999,
                image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Advanced',
                duration: '8 Weeks'
            },
            {
                title: 'Frontend Fundamentals for Beginners',
                description: 'Learn HTML5, CSS3, and JavaScript from scratch. Perfect for career switchers.',
                price: 999,
                oldPrice: 4999,
                image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '6 Weeks'
            }
        ]
    },
    {
        name: 'Data Science',
        courses: [
            {
                title: 'Python for Data Science & Analytics',
                description: 'Master NumPy, Pandas, and Matplotlib for powerful data manipulation.',
                price: 3499,
                oldPrice: 9999,
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '10 Weeks'
            },
            {
                title: 'Machine Learning A-Z: Hands-On Python',
                description: 'Build predictive models with Scikit-Learn. Linear Regression to Random Forests.',
                price: 5999,
                oldPrice: 19999,
                image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Intermediate',
                duration: '14 Weeks'
            },
            {
                title: 'SQL & Database Design Mastery',
                description: 'Learn to design complex databases and write optimized SQL queries.',
                price: 1499,
                oldPrice: 5999,
                image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '5 Weeks'
            }
        ]
    },
    {
        name: 'AI/ML',
        courses: [
            {
                title: 'Deep Learning with PyTorch',
                description: 'Build Neural Networks for Computer Vision and Natural Language Processing.',
                price: 6999,
                oldPrice: 24999,
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Advanced',
                duration: '16 Weeks'
            },
            {
                title: 'Generative AI & LLM Engineering',
                description: 'Learn to build apps with GPT-4, LangChain, and Vector Databases.',
                price: 7999,
                oldPrice: 29999,
                image: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Advanced',
                duration: '10 Weeks'
            },
            {
                title: 'Reinforcement Learning Bootcamp',
                description: 'Master Q-Learning and Policy Gradients for Intelligent Agents.',
                price: 4999,
                oldPrice: 14999,
                image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Advanced',
                duration: '12 Weeks'
            }
        ]
    },
    {
        name: 'Digital Marketing',
        courses: [
            {
                title: 'Social Media Strategy Mastery',
                description: 'Grow your brand on Instagram, LinkedIn, and Twitter with proven strategies.',
                price: 1999,
                oldPrice: 7999,
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '6 Weeks'
            },
            {
                title: 'Performance Marketing & FB Ads',
                description: 'Learn to run high-converting ad campaigns that generate massive ROI.',
                price: 2499,
                oldPrice: 9999,
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Intermediate',
                duration: '8 Weeks'
            },
            {
                title: 'SEO & Content Marketing Guide',
                description: 'Rank on the first page of Google and drive organic traffic consistently.',
                price: 1499,
                oldPrice: 5999,
                image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '4 Weeks'
            }
        ]
    },
    {
        name: 'Government Exam',
        courses: [
            {
                title: 'UPSC CSE: Comprehensive Ethics Module',
                description: 'Master GS Paper IV with case studies and value-added materials.',
                price: 3999,
                oldPrice: 12999,
                image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Intermediate',
                duration: '6 Weeks'
            },
            {
                title: 'SSC CGL: Quantitative Aptitude Zero to Hero',
                description: 'Learn shortcuts and advanced techniques for Tier 1 & Tier 2 exams.',
                price: 1999,
                oldPrice: 5999,
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '10 Weeks'
            },
            {
                title: 'Banking Awareness & Current Affairs',
                description: 'Stay updated with the latest banking trends for IBPS and SBI exams.',
                price: 999,
                oldPrice: 2999,
                image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '4 Weeks'
            }
        ]
    },
    {
        name: 'Study Abroad',
        courses: [
            {
                title: 'IELTS Academic: Band 8+ Masterclass',
                description: 'Learn advanced strategies for Listening, Reading, Writing, and Speaking.',
                price: 2499,
                oldPrice: 8999,
                image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Intermediate',
                duration: '8 Weeks'
            },
            {
                title: 'GRE Comprehensive Prep 2026',
                description: 'Master Quant and Verbal reasoning for your dream university applications.',
                price: 3499,
                oldPrice: 12999,
                image: 'https://images.unsplash.com/photo-1523050335102-c32509b4b1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Intermediate',
                duration: '12 Weeks'
            },
            {
                title: 'Global Admissions & SOP Writing',
                description: 'Craft high-converting Statement of Purpose and LORs for top colleges.',
                price: 1499,
                oldPrice: 4999,
                image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '4 Weeks'
            }
        ]
    },
    {
        name: 'Kids Learning',
        courses: [
            {
                title: 'Scratch Coding for Young Creators',
                description: 'Learn to build games and animations with drag-and-drop blocks.',
                price: 999,
                oldPrice: 3999,
                image: 'https://images.unsplash.com/photo-1516533075015-a3838414c3cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '6 Weeks'
            },
            {
                title: 'Fun with Math: Interactive Logic',
                description: 'Making mathematics fun through puzzles, games, and storytelling.',
                price: 799,
                oldPrice: 2499,
                image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '5 Weeks'
            },
            {
                title: 'Creative Writing for Kids',
                description: 'Unleash your imagination and learn to write amazing stories.',
                price: 899,
                oldPrice: 2999,
                image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                level: 'Beginner',
                duration: '4 Weeks'
            }
        ]
    }
];

const chapterTitles = [
    'Introduction & Course Overview',
    'Core Concepts & Fundamentals',
    'Setting up Environment',
    'Practical Implementation Phase 1',
    'Advanced Techniques & Deep Dive',
    'Building Real-world Project',
    'Optimization & Best Practices',
    'Final Assessment & Conclusion'
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Optional: Clear existing data
        await Course.deleteMany({});
        await Chapter.deleteMany({});
        console.log('Cleared existing courses and chapters.');

        for (const cat of categories) {
            for (const courseData of cat.courses) {
                const course = await Course.create({
                    ...courseData,
                    category: cat.name,
                    mentor: adminId
                });

                console.log(`Created course: ${course.title}`);

                // Create Chapters for each course
                const chapters = [];
                for (let i = 0; i < chapterTitles.length; i++) {
                    chapters.push({
                        course: course._id,
                        title: chapterTitles[i],
                        description: `Deep dive into ${chapterTitles[i]} for ${course.title}. Learn industry standards and best practices.`,
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Dummy video
                        sequenceOrder: i + 1
                    });
                }
                await Chapter.insertMany(chapters);
                console.log(`  Added ${chapters.length} chapters to ${course.title}`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
