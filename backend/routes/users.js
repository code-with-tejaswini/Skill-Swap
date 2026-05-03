const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/users/search?skill=javascript
router.get('/search', protect, async (req, res) => {
  try {
    const { skill, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    let query = { _id: { $ne: req.user._id }, isActive: true };

    if (skill) {
      query.teachSkills = { $regex: skill, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ averageRating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching users.' });
  }
});

// GET /api/users/matches - find complementary skill matches
router.get('/matches', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const { learnSkills, teachSkills } = currentUser;

    if (learnSkills.length === 0 && teachSkills.length === 0) {
      return res.json({ success: true, users: [], message: 'Add skills to find matches.' });
    }

    // Find users who can teach what I want to learn AND want to learn what I can teach
    const matches = await User.find({
      _id: { $ne: req.user._id },
      isActive: true,
      $or: [
        { teachSkills: { $elemMatch: { $in: learnSkills.map(s => new RegExp(s, 'i')) } } },
        { learnSkills: { $elemMatch: { $in: teachSkills.map(s => new RegExp(s, 'i')) } } }
      ]
    }).select('-password').sort({ averageRating: -1 }).limit(20);

    // Score matches by complementarity
    const scoredMatches = matches.map(user => {
      let score = 0;
      user.teachSkills.forEach(skill => {
        if (learnSkills.some(ls => ls.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(ls.toLowerCase()))) score += 2;
      });
      user.learnSkills.forEach(skill => {
        if (teachSkills.some(ts => ts.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(ts.toLowerCase()))) score += 2;
      });
      return { ...user.toObject(), matchScore: score };
    });

    scoredMatches.sort((a, b) => b.matchScore - a.matchScore || b.averageRating - a.averageRating);

    res.json({ success: true, users: scoredMatches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error finding matches.' });
  }
});

// GET /api/users/:id - get user profile
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user.' });
  }
});

// PUT /api/users/profile - update own profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, location } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true, runValidators: true
    }).select('-password');

    res.json({ success: true, message: 'Profile updated!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
});

// PUT /api/users/skills - update skills
router.put('/skills', protect, async (req, res) => {
  try {
    const { teachSkills, learnSkills } = req.body;
    const updateData = {};

    if (teachSkills !== undefined) {
      updateData.teachSkills = teachSkills.filter(s => s.trim()).map(s => s.trim());
    }
    if (learnSkills !== undefined) {
      updateData.learnSkills = learnSkills.filter(s => s.trim()).map(s => s.trim());
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true, runValidators: true
    }).select('-password');

    res.json({ success: true, message: 'Skills updated!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating skills.' });
  }
});

// GET /api/users - get all users (with pagination)
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find({ _id: { $ne: req.user._id }, isActive: true })
      .select('-password')
      .sort({ averageRating: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({ _id: { $ne: req.user._id }, isActive: true });

    res.json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
});

module.exports = router;
