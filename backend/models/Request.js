const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderSkill: {
    type: String,
    required: [true, 'Sender skill is required'],
    trim: true
  },
  receiverSkill: {
    type: String,
    required: [true, 'Receiver skill is required'],
    trim: true
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Prevent duplicate pending requests
requestSchema.index({ senderId: 1, receiverId: 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);
