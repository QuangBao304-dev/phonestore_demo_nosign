import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: String,
  text: {
    type: String,
    required: true
  },
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Admin Phong Vũ'
  },
  tags: [String],
  readingTime: {
    type: String,
    default: '5 min'
  },
  comments: [commentSchema],
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
