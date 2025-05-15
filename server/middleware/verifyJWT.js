const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization || req.headers['Authorization'];
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
        const token = authHeader.split(' ')[1];
        // console.log(token)
        if (!token) {
            return res.status(401).json({ error: 'Authorization denied' });
        }
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                // console.log(err, decoded)
                if (err) return res.sendStatus(403); //invalid token Forbidden
                req.userId = decoded.UserInfo.id;
                next();
            }
        );
    }
    catch (error) {
        console.error('Auth Error:', error.message);
        res.status(401).json({
            error: 'Session expired - Please login again',
            code: 'TOKEN_EXPIRED'
        });
    }
}

module.exports = verifyJWT 