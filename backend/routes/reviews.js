const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Request = require('../models/Request');
const { protect } = require('../middleware/auth');

// POST /api/reviews - submit a review
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, requestId, rating, comment, skillExchanged } = req.body;

    if (!receiverId || !requestId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'receiverId, requestId, rating, and comment are required.' });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot review yourself.' });
    }

    // Verify the request exists and is completed
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (request.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review after skill exchange is completed.' });
    }

    const isParticipant =
      request.senderId.toString() === req.user._id.toString() ||
      request.receiverId.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this exchange.' });
    }

    const existingReview = await Review.findOne({ reviewerId: req.user._id, requestId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this exchange.' });
    }

    const review = await Review.create({
      reviewerId: req.user._id,
      receiverId,
      requestId,
      rating: parseInt(rating),
      comment,
      skillExchanged: skillExchanged || ''
    });

    await review.populate('reviewerId', 'name email averageRating');

    res.status(201).json({ success: true, message: 'Review submitted!', review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this exchange.' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error submitting review.' });
  }
});

// GET /api/reviews/user/:userId - get reviews for a user
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ receiverId: req.params.userId })
      .populate('reviewerId', 'name email averageRating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ receiverId: req.params.userId });

    res.json({ success: true, reviews, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews.' });
  }
});

// GET /api/reviews/given - reviews I've given
router.get('/given', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewerId: req.user._id })
      .populate('receiverId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews.' });
  }
});

module.exports = router;
