const sgMail = require('@sendgrid/mail');

async function sendEmail(email, passcode) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: email,
        from: process.env.FROM_EMAIL_ADDRESS,
        subject: 'Your OTP for Poll Management App',
        text: `Your OTP is ${passcode}`,
        html: `<strong>Your OTP is ${passcode}</strong> <br> <p>Use this OTP to validate your email address within 15 minutes</p>`,
    };

    try {
        const response = await sgMail.send(msg);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = { sendEmail };