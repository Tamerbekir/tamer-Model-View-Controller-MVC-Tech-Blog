const express = require('express');
const router = express.Router();
const { Comment } = require('../../models');
const withAuth =  require('../../utils/auth')



//Made route for creating comment
router.post('/create', withAuth, async (req, res) => {
    // console.log(req.body)
    try {
        const newComment = await Comment.create({
            content: req.body.content,
            post_id: req.body.blogPost_id,
            user_id: req.session.user_id
        })
        //using to ensure comment was created and in database. All is working
        // console.log(req.body.blogPost_id);
        // res.status(200).json(blogPost_id);
        res.redirect(`/blogpost/${req.body.blogPost_id}`);
    } catch (err) {
        res.status(500).json(err);
    }
});


//Made route for deleting comment
router.delete('/delete/:id', withAuth, async (req, res) => {
    try {
        const deleteComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        if (!deleteComment) {
            res.status(404).res.render('404page')
        } else {
            res.status(200).json({ message: "Comment deleted successfully" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router; 