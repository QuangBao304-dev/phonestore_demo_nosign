import Blog from '../models/Blog.js';

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  const { text, username } = req.body;
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (blog) {
      const comment = {
        user: req.user._id,
        username: username || req.user.name,
        text
      };
      blog.comments.push(comment);
      await blog.save();
      res.status(201).json(blog);
    } else {
      res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
