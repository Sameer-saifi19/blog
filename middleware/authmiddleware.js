const jwt = require('jsonwebtoken');
const JWT_ADMIN_SECRET = "admin123";

function authMiddleware(req,res,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET)

    if(decoded){
        req.adminId = decoded.id;
        next();
    }else{
        res.json({
            message:"you are not signed up"
        })
    }
}

module.exports = {
    authMiddleware: authMiddleware
}