const user = require("../model/user");
const bcrypt = require("bcryptjs");

//const crypto = require("crypto");
//const Token = require("../../model/token");
//const sendEmail = require("../../utils/sendEmail");


const handleRegister = async (req, res)=>{

    const{name, email, password, role} = req.body;
    if(!name || !email || !password || !role){
        return res.status(400).send("Please enter all fields");
    } 
    const userExists = await user.findOne({email:email});
    if(userExists){
        return res.status(400).send("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new user({
        name: name,
        email: email,
        password: hashedPassword,
        role: role
    });
    try{
        const savedUser = await newUser.save();
        console.log(savedUser);
        return res.status(200).send({message:"Registered Successfully"})
             // send verification email
     /*const token = await new Token({
        userId: savedUser._id,
        token: crypto.randomBytes(32).toString("hex"),
   }).save();
   const url = `${process.env.BASE_URL}can/verify/${savedUser._id}/${token.token}`;
   await sendEmail(savedUser.email, "Verify Email", url, name);

   res
        .status(200)
        .send({ message: "An Email sent to your account please verify",
                user:savedUser._id
             });*/
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports = {handleRegister};