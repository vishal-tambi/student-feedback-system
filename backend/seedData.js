const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { User, Course, Feedback } = require('./models');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Feedback.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'John Student',
        email: 'student@demo.com',
        password: hashedPassword,
        role: 'student'
      },
      {
        name: 'Alice Johnson',
        email: 'alice@demo.com',
        password: hashedPassword,
        role: 'student'
      },
      {
        name: 'Bob Wilson',
        email: 'bob@demo.com',
        password: hashedPassword,
        role: 'student'
      }
    ]);

    console.log('Created demo users');

    // Create courses
    const courses = await Course.insertMany([
      {
        name: 'React Fundamentals',
        description: 'Learn the basics of React.js including components, props, state, and hooks. Perfect for beginners.',
        instructor: 'Dr. Sarah Chen',
        duration: '8 weeks'
      },
      {
        name: 'Node.js Backend Development',
        description: 'Master server-side development with Node.js, Express.js, and MongoDB. Build scalable APIs.',
        instructor: 'Prof. Michael Rodriguez',
        duration: '10 weeks'
      },
      {
        name: 'JavaScript Advanced Concepts',
        description: 'Deep dive into advanced JavaScript topics including closures, promises, async/await, and ES6+ features.',
        instructor: 'Dr. Emily Davis',
        duration: '6 weeks'
      },
      {
        name: 'Full Stack Web Development',
        description: 'Complete web development course covering frontend, backend, databases, and deployment.',
        instructor: 'Prof. David Kim',
        duration: '16 weeks'
      },
      {
        name: 'Database Design & MongoDB',
        description: 'Learn database design principles and master MongoDB for modern web applications.',
        instructor: 'Dr. Lisa Thompson',
        duration: '5 weeks'
      }
    ]);

    console.log('Created demo courses');

    // Create sample feedback
    const feedbackData = [
      // React Fundamentals feedback
      {
        courseId: courses[0]._id,
        studentId: users[1]._id, // John Student
        rating: 5,
        comment: 'Excellent course! The instructor explains concepts very clearly and the hands-on projects really helped me understand React.'
      },
      {
        courseId: courses[0]._id,
        studentId: users[2]._id, // Alice Johnson
        rating: 4,
        comment: 'Great introduction to React. Would have liked more advanced topics covered, but overall very good.'
      },
      {
        courseId: courses[0]._id,
        studentId: users[3]._id, // Bob Wilson
        rating: 5,
        comment: 'Perfect for beginners! The pace was just right and the examples were practical.'
      },

      // Node.js Backend Development feedback
      {
        courseId: courses[1]._id,
        studentId: users[1]._id,
        rating: 4,
        comment: 'Solid course on backend development. The MongoDB integration section was particularly helpful.'
      },
      {
        courseId: courses[1]._id,
        studentId: users[2]._id,
        rating: 5,
        comment: 'Outstanding! This course gave me the confidence to build real-world applications.'
      },

      // JavaScript Advanced Concepts feedback
      {
        courseId: courses[2]._id,
        studentId: users[3]._id,
        rating: 4,
        comment: 'Challenging but rewarding. The async/await section really clicked for me.'
      },
      {
        courseId: courses[2]._id,
        studentId: users[1]._id,
        rating: 3,
        comment: 'Good content but a bit fast-paced. Would benefit from more examples.'
      },

      // Full Stack Web Development feedback
      {
        courseId: courses[3]._id,
        studentId: users[2]._id,
        rating: 5,
        comment: 'Comprehensive course that covers everything you need to become a full stack developer!'
      },

      // Database Design & MongoDB feedback
      {
        courseId: courses[4]._id,
        studentId: users[1]._id,
        rating: 4,
        comment: 'Great introduction to database design concepts. The MongoDB examples were very practical.'
      },
      {
        courseId: courses[4]._id,
        studentId: users[3]._id,
        rating: 5,
        comment: 'Excellent course! Finally understand how to design efficient database schemas.'
      }
    ];

    await Feedback.insertMany(feedbackData);
    console.log('Created sample feedback');

    console.log('\n✅ Demo data seeded successfully!');
    console.log('\n📧 Demo Login Credentials:');
    console.log('Admin: admin@demo.com / password');
    console.log('Student: student@demo.com / password');
    console.log('Additional Students: alice@demo.com, bob@demo.com / password');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();