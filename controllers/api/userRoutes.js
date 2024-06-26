const router = require('express').Router();
const { User } = require('../../models');


//using for test purposes to ensure users are being saved to the database
// User.findAll().then(users => {
//     console.log(users);
// })


router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });
        // console.log('User Data:', userData);

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.user = userData.get({ plain: true }) //added this so user name is pulled from User model and rendered on handelbars for homepage
            req.session.logged_in = true;
            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
})


router.post('/signup', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.user = userData.get({ plain: true });
            req.session.logged_in = true;
            res.redirect('/dashboard');
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'The email or username you have provided is already in use. Please try another one.' });
        } else {
            res.status(500).json({ message: 'There seems to be an error with your request.' });
        }
    }
});



router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.redirect('/login'); 
        });
    } else {
        res.status(404).end();
    }
});


module.exports = router;
