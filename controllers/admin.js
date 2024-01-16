const adminModel = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password} = req.body;

        // Check if email is already taken
        const existingUser = await adminModel.findOne({ email }).exec();
        if (existingUser) {
            return res.status(200).json({
                error: true,
                title: 'Email already taken',
                errors: []
            });
        }

        // Create a new user
        const newUser = new adminModel({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))});

        // Save the new user
        await newUser.save();

        return res.status(200).json({
            error: false,
            title: 'User Register Successfully',
            errors: []
        });
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({
            error: true,
            title: 'Something went wrong',
            errors: error
        });
    }
};


const login = async(req, res) => {
    let user = await adminModel.findOne({ email: req.body.email }).lean().exec();
        console.log("user", user);

    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
            error: true,
            title: 'Invalid credentials',
            errors: []
        });
    }

    delete(user.password);
    user.exp = Math.floor(Date.now() / 1000) + (60 * 60); // 60 minutes * 60 seconds = 1 hour
    let token = jwt.sign({
        email: user.email,
        name: user.name,
        exp: user.exp,
    }, process.env.JWT_KET);
    return res.status(200).json({
        error: false,
        title: 'Logged in Successfully',
        data: user,
        token: token,
        errors: []
    });
}

const socialLogin = async(req, res) => {
    let user = await adminModel.findOne({ }).lean().exec();
        console.log("user", user);


    delete(user.password);
    user.exp = Math.floor(Date.now() / 1000) + (60 * 60); // 60 minutes * 60 seconds = 1 hour
    let token = jwt.sign({
        email: user.email,
        name: user.name,
        exp: user.exp,
    }, process.env.JWT_KET);
    return res.status(200).json({
        error: false,
        title: 'Logged in Successfully',
        data: user,
        token: token,
        errors: []
    });
}
module.exports = {
    login,
    register,
    socialLogin
};