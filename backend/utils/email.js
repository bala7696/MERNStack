const nodemailer = require('nodemailer');

const sendEmail = async options => {

    const transport = {
        service: 'gmail',
        auth: {
            user: 'bkartecommerce@gmail.com',
            pass: 'pqfyihyiagijddhz'
        }
    }

    const transporter = nodemailer.createTransport(transport);

    const message = {
        from: `bkartecommerce@gmail.com`,
        to: options.email,
        subject: options.subject,
        text: options.message

    }
    await transporter.sendMail(message);

    // const transport = {
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     auth: {
    //         user: process.env.SMTP_USER,
    //         pass: process.env.SMTP_PASS
    //     },

    // };

    // const transporter = nodemailer.createTransport(transport);
    // const message = {
    //     from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    //     to: options.email,
    //     subject: options.subject,
    //     text: options.message,
    // }
    // await transporter.sendMail(message);

}

const sendEmailRegistration = async options => {

    const transport = {
        service: 'gmail',
        auth: {
            user: 'bkartecommerce@gmail.com',
            pass: 'pqfyihyiagijddhz'
        }
    }

    const transporter = nodemailer.createTransport(transport);

    const message = {
        from: `bkartecommerce@gmail.com`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<!DOCTYPE html>
        <html>
        <head><title>BALAKart Ecommerce Registration</title>
        </head>
        <body>
        <div>
        <h3>Wooohoooo! You have successfully registered to BALAKart Ecommerce App</h3>
        <br/>
        <br/>
        <img src="https://powerlanguage.net/wp-content/uploads/2019/09/welcome.jpg"  width="500" height=500" title="Title of image" alt="alt text here"/>
        </div></body></html>`
    }
    await transporter.sendMail(message);

    // const transport = {
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     auth: {
    //         user: process.env.SMTP_USER,
    //         pass: process.env.SMTP_PASS
    //     },

    // };

    // const transporter = nodemailer.createTransport(transport);
    // const message = {
    //     from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    //     to: options.email,
    //     subject: options.subject,
    //     text: options.message,
    //     html: `<!DOCTYPE html>
    //     <html>
    //     <head><title>BALAKart Ecommerce Registration</title>
    //     </head>
    //     <body>
    //     <div>
    //     <h3>Wooohoooo! You have successfully registered to BALAKart Ecommerce App</h3>
    //     <br/>
    //     <br/>
    //     <img src="https://powerlanguage.net/wp-content/uploads/2019/09/welcome.jpg"  width="500" height=500" title="Title of image" alt="alt text here"/>
    //     </div></body></html>`
    // }
    // await transporter.sendMail(message);

}

module.exports = { sendEmail, sendEmailRegistration };