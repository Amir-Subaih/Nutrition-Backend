const asyncHandler = require('express-async-handler');
const { User, validateRegister,validateLogin } = require('../modules/User');
const bcrypt = require('bcryptjs');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @method  POST
 * @access  Public
 */
module.exports.registerUser = asyncHandler(async (req, res) => {
    let { confirm_password, ...otherBody } = req.body; // استخدم let بدلاً من const
    const { error } = validateRegister(otherBody);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    if (req.body.password !== confirm_password) return res.status(400).send('Password not match.');

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    confirm_password = await bcrypt.hash(confirm_password, salt); // لن يسبب خطأ الآن

    user = new User({
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
        location: req.body.location
    });

    const result = await user.save();

    const token = user.generateToken();

    const { password, ...other } = result._doc;
    res.status(200).json({ other, token, message: "success" });
});

/**
 * @desc    Login a user
 * @route   POST /api/auth/login
 * @method  POST
 * @access  Public
 */

module.exports.loginUser = asyncHandler(async (req, res) => {
    const {error} = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email : req.body.email});
    if (!user) return res.status(400).send('Invalid email or password.');

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) return res.status(400).send('Invalid email or password.');

    const token = user.generateToken();

    const {password, confirm_password , ...other} = user._doc;
    res.status(200).json({other,token,message : "success"});
});

