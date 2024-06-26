const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');

// Homepage route
router.get('/', async (req, res) => {
    try {
        const blogPostData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        const blogPosts = blogPostData.map((blogPost) => blogPost.get({ plain: true }));

        res.render('homepage', {
            blogPosts,
            logged_in: req.session.logged_in,
            user: req.session.user
        });
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
            res.status(404).res.render('404page')
            return;
        }
        const post = postData.get({ plain: true });
        res.render('postDetails', { post, logged_in: req.session.logged_in });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/comment/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['name'] },
                { model: Comment, include: [{ model: User, attributes: ['name'] }] }
            ]
        });
        if (!commentData) {
            res.status(404).res.render('404page')
            return;
        }
        const comment = commentData.get({ plain: true });
        res.render('commentDetails', { comment, logged_in: req.session.logged_in });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
