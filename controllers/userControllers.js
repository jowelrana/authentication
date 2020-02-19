const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config.json')
const tokenList = {}
const sgMail = require('@sendgrid/mail');

module.exports.firstStep = (req, res) => {
    const { email } = req.body
    User.findOne({ email }).then(userData => {
        if (userData) {
            res.status(404).json({
                message: `${email} is already taken`,
            })
            
        } else {
            let code = Math.floor(1000 + Math.random() * 9000)
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
            to: email,
            from: 'mdjowelranacse@gmail.com',
            subject: 'verification code',
            html: `<strong>Your account verification code is : <b style="color:#6791d0;font-size:14px;">${code}</b></strong>`,
            };
            const user = new User({
                email,
                code
            })
            user.save()
            .then(user => {
                sgMail.send(msg);
                res.json({
                    message: 'User created successfully. Please check your email for varify code.',
                })
            })
            .catch(e => {
                let errors = {}
                Object.keys(e.errors).forEach(err => {
                    errors[err] = e.errors[err].message
                })
                res.status(400).json(errors)
            })
        }
    })

    
}

module.exports.register = (req, res) => {
    const { name, code, email, password } = req.body

    let hash = bcrypt.hashSync(password.toString(), 10);

    User.findOne({email}).then(user => {
        if (user) {
            if(user.code ===code){
                var myquery = { address: "Valley 345" };
                var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
                User.updateOne({ _id: user._id }, { $set: {name, password: hash,verify:true } }, function(err, res) {
                    if (err) throw err;
                });
                const token = jwt.sign({ email: user.email, userId: user._id }, config.secret, { expiresIn: config.tokenLife})
                const refreshToken = jwt.sign({ email: user.email, userId: user._id }, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
                const response = {
                    "status": "success",
                    "tokenType": "bearer",
                    "token": token,
                    "refreshToken": refreshToken,
                }
                tokenList[refreshToken] = response
                res.status(200).json(response);
            }else{
                res.status(401).json({
                    message: 'Invailid email and verification code.',
                })
            }
        }else {
            res.status(404).json({
                message: `Email not found`,
            })
        }
    })

    
}
module.exports.login = (req, res) => {
    const { email, password } = req.body
    User.findOne({ email }).then(user => {
        if (user) {
            if (bcrypt.compareSync(password.toString(), user.password)) {
                const token = jwt.sign({ email: user.email, userId: user._id }, config.secret, { expiresIn: config.tokenLife})
                const refreshToken = jwt.sign({ email: user.email, userId: user._id }, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
                const response = {
                    "status": "success",
                    "tokenType": "bearer",
                    "token": token,
                    "refreshToken": refreshToken,
                }
                tokenList[refreshToken] = response
                res.status(200).json(response);
                
            } else {
                res.status(401).json({
                    message: 'Wrong credentials',
                })
            }
        } else {
            res.status(404).json({
                message: `No user foun with email address: ${email}`,
            })
        }
    })
}

module.exports.refresh = (req, res) => {
    const { email, password, refreshToken} = req.body

    User.findOne({email}).then(user => {
        if (user) {
            if (bcrypt.compareSync(password.toString(), user.password)) {
                if((refreshToken) && (refreshToken in tokenList)) {
                    const token = jwt.sign({ email: user.email, userId: user._id }, config.secret, { expiresIn: config.tokenLife})
                    const response = {
                        "status": "success",
                        "tokenType": "bearer",
                        "token": token,
                    }
                    // update the token in the list
                    tokenList[refreshToken].token = token
                    res.status(200).json(response);        
                } else {
                    res.status(404).send('Invalid request')
                }
                
            } else {
                res.status(401).json({
                    message: 'Wrong credentials',
                })
            }
        } else {
            res.status(404).json({
                message: `No user found with email address: ${email}`,
            })
        }
    })
}

module.exports.me = (req, res) => {
    const { userId } = req.user
    User.find({_id:userId})
        .then(users => res.json(users))
}
