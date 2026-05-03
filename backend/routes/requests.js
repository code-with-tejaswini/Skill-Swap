const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { protect } = require('../middleware/auth');

// POST /api/requests - send a skill exchange request
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, senderSkill, receiverSkill, message } = req.body;

    if (!receiverId || !senderSkill || !receiverSkill) {
      return res.status(400).json({ success: false, message: 'receiverId, senderSkill, and receiverSkill are required.' });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot send request to yourself.' });
    }

    const existingRequest = await Request.findOne({
      senderId: req.user._id,
      receiverId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending request with this user.' });
    }

    const request = await Request.create({
      senderId: req.user._id,
      receiverId,
      senderSkill,
      receiverSkill,
      message: message || ''
    });

    await request.populate([
      { path: 'senderId', select: 'name email averageRating' },
      { path: 'receiverId', select: 'name email averageRating' }
    ]);

    res.status(201).json({ success: true, message: 'Request sent successfully!', request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending request.' });
  }
});

// GET /api/requests/sent - get requests I sent
router.get('/sent', protect, async (req, res) => {
  try {
    const requests = await Request.find({ senderId: req.user._id })
      .populate('receiverId', 'name email averageRating teachSkills learnSkills')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching sent requests.' });
  }
});

// GET /api/requests/received - get requests I received
router.get('/received', protect, async (req, res) => {
  try {
    const requests = await Request.find({ receiverId: req.user._id })
      .populate('senderId', 'name email averageRating teachSkills learnSkills')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching received requests.' });
  }
});

// PUT /api/requests/:id/accept
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    request.status = 'accepted';
    await request.save();
    await request.populate([
      { path: 'senderId', select: 'name email averageRating' },
      { path: 'receiverId', select: 'name email averageRating' }
    ]);

    res.json({ success: true, message: 'Request accepted!', request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error accepting request.' });
  }
});

// PUT /api/requests/:id/reject
router.put('/:id/reject', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ success: true, message: 'Request rejected.', request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error rejecting request.' });
  }
});

// PUT /api/requests/:id/complete
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    const isParticipant =
      request.senderId.toString() === req.user._id.toString() ||
      request.receiverId.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Only accepted requests can be marked complete.' });
    }

    request.status = 'completed';
    await request.save();

    res.json({ success: true, message: 'Skill exchange marked as completed!', request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error completing request.' });
  }
});

// GET /api/requests/all - all my requests (sent + received)
router.get('/all', protect, async (req, res) => {
  try {
    const sent = await Request.find({ senderId: req.user._id })
      .populate('receiverId', 'name email averageRating teachSkills')
      .sort({ createdAt: -1 });

    const received = await Request.find({ receiverId: req.user._id })
      .populate('senderId', 'name email averageRating teachSkills')
      .sort({ createdAt: -1 });

    res.json({ success: true, sent, received });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching requests.' });
  }
});

module.exports = router;
