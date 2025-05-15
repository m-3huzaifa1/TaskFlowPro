const User = require("../model/user");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const ROLES = require("../../config/list_roles");
const dotenv = require('dotenv')

dotenv.config()

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ 'message': "Please provide email and password" });
    }
    const user = await User.findOne({ email }).exec();
    if (!user) {
        return res.status(400).json({ 'message': "User not found" });
    }
    const validPass = await bycrypt.compare(password, user.password);

    if (!validPass) {
        return res.status(400).json({ 'message': "Invalid password" });
    }
    /*if(user.verified == false){
        return res.status(400).json({ 'message': "Email not verified." });
    }
     const roles = Object.values(user.role).filter(Boolean);
    const roles = user.role;*/

    const accessToken = jwt.sign(
        {
            UserInfo: {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
    );
    const refreshToken = jwt.sign(
        {
            id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
    user.refreshToken = refreshToken;
    const result = await user.save();
    console.log(result);
    console.log(user.role);
    res.cookie(
        'jwt',
        refreshToken,
        {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    )
    console.log('Token payload:', {
        UserInfo: {
            id: user._id.toString(),
            role: user.role,
            name: user.name,
            email: user.email,
        }
    });
    console.log(accessToken)
    return res.status(200).json({
        accessToken: accessToken,
        // "refreshToken": refreshToken,
        user: {
            "id": user._id,
            "role": user.role,
            "name": user.name,
            "email": user.email,
        },
    });

}


module.exports = { handleLogin };