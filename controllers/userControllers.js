const User = require('../models/User')

const sgMail = require('@sendgrid/mail');

module.exports.firstStep = (req, res) => {
    const { email } = req.body

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
