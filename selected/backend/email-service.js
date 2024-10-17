const sgMail = require('@sendgrid/mail');

async function sendEmail(email, passcode) {
    process.env.SENDGRID_API_KEY = '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';
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: email,
        from: 'cs7319.fall24.noreply@gmail.com',
        subject: 'Your OTP for Poll Management App',
        text: `Your OTP is ${passcode}`,
        html: `<strong>Your OTP is ${passcode}</strong> <br> <p>Use this OTP to validate your email address within 15 minutes</p>`,
    };

    try {
        const response = await sgMail.send(msg);
        console.log(response[0].statusCode);
        console.log(response[0].headers);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = { sendEmail };