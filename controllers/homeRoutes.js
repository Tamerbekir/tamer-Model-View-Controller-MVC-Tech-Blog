const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');

// Homepage route
router.get('/', async (req, res) => {
    try {
        if (req.session.logged_in) {
            const blogPostData = await Post.findAll({
                include: [{ model: User, attributes: ['name'] }]
            });
            const blogPosts = blogPostData.map((blogPost) => blogPost.get({ plain: true }));

            res.render('homepage', { 
                blogPosts, 
                logged_in: req.session.logged_in,
                user: req.session.user 
            });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});


router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['name'] },
                { model: Comment, include: [{ model: User, attributes: ['name'] }] }
            ]
        });
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        const post = postData.get({ plain: true });
        res.render('single-post', { post, logged_in: req.session.logged_in });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
