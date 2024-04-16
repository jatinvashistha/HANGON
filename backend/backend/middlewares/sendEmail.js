const nodemailer  = require('nodemailer')
exports.sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service : process.env.SMTP_SERVICE,
        secure : true,
        debug : true,
        secureConnection : false,
        logger : true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls : {
            rejectUnAuthorized : true
        }
        
    });



    const mailOptions = {
        from: process.env.SMTP_USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('mess', info.messageId)
}

