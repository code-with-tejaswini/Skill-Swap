const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  skillExchanged: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// One review per request per reviewer
reviewSchema.index({ reviewerId: 1, requestId: 1 }, { unique: true });

// After saving, update receiver's average rating
reviewSchema.post('save', async function() {
  const User = mongoose.model('User');
  const receiver = await User.findById(this.receiverId);
  if (receiver) await receiver.updateRating();
});

module.exports = mongoose.model('Review', reviewSchema);
