const jwt = require('jsonwebtoken')
const user = require('../model/user')

function verify(req,res,next){
     
     const token = req.header('auth-token')
     if(!token) return res.status(401).send('Access denied. No token provided.')

     try{
          const verified = jwt.verify(token, process.env.TOKEN_SECRET)
          req.user = verified
          next()
     }catch(err){
          res.status(400).send('Invalid token.')
     }
}

function verifyAdmin(req,res,next){

     const token = req.header('auth-token-admin')
     if(!token) return res.status(401).send('Access denied. No token provided.')

     try{
          const verified = jwt.verify(token, process.env.TOKEN_SECRET_ADMIN)
          req.user = verified
          next()
     }catch(err){
          res.status(400).send('Invalid token.')
     }
}

module.exports = {
     verify,
     verifyAdmin
}