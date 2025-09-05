const express = require('express');
const { Feedback, Course } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit feedback (students only)
router.post('/', auth, async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;


    // Check if student already submitted feedback for this course
    const existingFeedback = await Feedback.findOne({
      courseId,
      studentId: req.user._id
    });

    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already submitted feedback for this course' });
    }

    // Create feedback
    const feedback = new Feedback({
      courseId,
      studentId: req.user._id,
      rating,
      comment
    });

    await feedback.save();
    await feedback.populate('studentId', 'name');
    await feedback.populate('courseId', 'name');

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get feedback for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ courseId: req.params.courseId })
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's feedback
router.get('/my-feedback', auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ studentId: req.user._id })
      .populate('courseId', 'name instructor')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update feedback
router.put('/:id', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Only the student who created the feedback can update it
    if (feedback.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this feedback' });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('studentId', 'name').populate('courseId', 'name');

    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete feedback
router.delete('/:id', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Only the student who created the feedback or admin can delete it
    if (feedback.studentId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;