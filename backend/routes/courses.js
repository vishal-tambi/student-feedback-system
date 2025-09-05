const express = require('express');
const { Course, Feedback } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses with average ratings
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    
    // Calculate average ratings for each course
    const coursesWithRatings = await Promise.all(
      courses.map(async (course) => {
        const feedbacks = await Feedback.find({ courseId: course._id });
        const totalRatings = feedbacks.length;
        const avgRating = totalRatings > 0 
          ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalRatings 
          : 0;
        
        return {
          ...course.toObject(),
          avgRating: Math.round(avgRating * 10) / 10,
          totalRatings
        };
      })
    );

    res.json(coursesWithRatings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single course with detailed analytics
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const feedbacks = await Feedback.find({ courseId: course._id })
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(feedback => {
      ratingDistribution[feedback.rating]++;
    });

    const totalRatings = feedbacks.length;
    const avgRating = totalRatings > 0 
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalRatings 
      : 0;

    res.json({
      ...course.toObject(),
      avgRating: Math.round(avgRating * 10) / 10,
      totalRatings,
      ratingDistribution,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create course (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update course (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete course (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Delete associated feedbacks
    await Feedback.deleteMany({ courseId: req.params.id });
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;