const mongoose = require('mongoose');

const SocialMediaPostSchema = new mongoose.Schema({
  platform: String,
  text: String,
  author: String,
  likeCount: Number,
  commentCount: Number,
  shareCount: Number,
  mediaUrl: String, // Corrected to be an array of strings
  timestamp: Date,
  additionalData: mongoose.Schema.Types.Mixed
});

// Index for searching by text content
SocialMediaPostSchema.index({ text: 'text' });

const SocialMediaPost = mongoose.model('SocialMediaPost', SocialMediaPostSchema);

module.exports = SocialMediaPost;
