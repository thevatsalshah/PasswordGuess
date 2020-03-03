/****************************
 EMAIL HANDLING OPERATIONS
 ****************************/
let nodemailer = require('nodemailer');
const config = require("../../configs/configs");
const Mustache = require('mustache');

let smtpTransport = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use TLS,
    auth: {
        user: 'meanstack2017@gmail.com',
        pass: 'Mean@123'
    },
    debug: true
});


class Email {

    send(mailOption) {
        return new Promise(async (resolve, reject) => {
            smtpTransport.sendMail(mailOption, (err, result) => {
                if (err) {
                    console.log("er =", err);
                    return reject({ sattus: 0, message: err });
                }
                return resolve(result);
            });
        });
    }


    verifySmtp() {
        // verify connection configuration
        smtpTransport.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });

    }
}

module.exports = Email;