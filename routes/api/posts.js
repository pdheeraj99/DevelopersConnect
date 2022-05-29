const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth.js');
const Post = require('../../models/Post');
const User = require('../../models/User');

// @route POST api/posts
// @desc Create a post
// @access Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const user = await User.findOne({ _id: req.user.id }).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      await newPost.save();
      res.json(newPost);
    } catch (error) {
      console.error(error.message());
      res.status(500).send('Server Error');
    }
  }
);

// @route GET api/posts
// @desc Get All Posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    // sort by date : -1 to fetch all the latest posts
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message());
    res.status(500).send('Server Error');
  }
});

// @route GET api/posts/:id
// @desc Get post by ID
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    // sort by date : -1 to fetch all the latest posts
    const posts = await Post.findById(req.params.id);

    if (!posts) {
      return res.status(404).json({ msg: 'Posts not found' });
    }

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Posts not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route Delete api/posts/:id
// @desc Delete Post By ID
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // sort by date : -1 to fetch all the latest posts
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post deleted successfully' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    // we are getting the post by ID
    const post = await Post.findById(req.params.id);

    // Now after getting the post check if the post has already been liked by the user which we got from the token
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post has already been liked' });
    }

    // if the post is not liked by the user
    post.likes.unshift({
      user: req.user.id,
    });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Status Error');
  }
});

// @route PUT api/posts/unlike/:id
// @desc unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    // we are getting the post by ID
    const post = await Post.findById(req.params.id);

    // Now after getting the post check if the post has already been liked by the user which we got from the token
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // if the post is liked by the user we are removing it
    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Status Error');
  }
});

// @route PUT api/posts/comment/:id
// @desc post a comment
// @access Private
router.post(
  '/comment/:id',
  [auth, check('text', 'Please enter comment and send')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
    }
    try {
      // we are getting the user who comment on the post by auth middleware
      const user = await User.findById(req.user.id).select('-password');

      // we are getting the post by ID
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Status Error');
    }
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc delete a comment
// @access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    // we are getting the user who comment on the post by auth middleware
    const user = await User.findById(req.user.id).select('-password');

    // we are getting the post by ID
    const post = await Post.findById(req.params.id);

    // Pull the comment from the post
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Check comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'comment does not exist' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      (comm) => comm.id.toString() !== comment.id
    );

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Status Error');
  }
});

module.exports = router;
