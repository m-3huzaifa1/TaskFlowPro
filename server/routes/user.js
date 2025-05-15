const router = require('express').Router()
const User = require('../model/user')
const authMiddleware = require('../middleware/auth');
const verifyJWT = require("../middleware/verifyJWT");
const { checkRole } = require('../middleware/roles');

router.use(authMiddleware);
// router.use(checkRole(['Admin']))

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { role: role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

router.put('/:userId/role',
    updateUserRole
);

router.get('/', async (req, res) => {
    try {
        const resp = await User.find()
        // console.log(resp)
        res.status(200).json(resp)
    }
    catch (err) {
        res.status(400).json(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const resp = await User.findOne({ _id: req.params.id })
        console.log(resp)
        res.status(200).json(resp)
    }
    catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router