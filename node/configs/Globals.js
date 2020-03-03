/****************************
 SECURITY TOKEN HANDLING
 ****************************/
const config = require('./configs');
const _ = require('lodash');
const Moment = require('moment');
const aesjs = require('aes-js');
// const scrypt = require("scrypt");
const i18n = require("i18n");

class Globals {




    generateToken(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let kdfResult = '';
                let token = kdfResult.toString("hex");
                return resolve(token);

            } catch (err) {
                console.log("Get token", err);
                return reject({ message: err, status: 0 });
            }

        });
    }
    // Validating Token
    static async isAuthorised(req, res, next) {
        try {
            const token = req.headers.authorization;
            if (!token) return res.status(401).json({ status: 0, message: 'Please send token with api.' });
            var sql = "SELECT * FROM login_master WHERE token='" + token + "'";
            config.con.query(sql, (err, loginData) => {
                if (err) {
                    console.log(err, 'err')
                    return this.res.send({ status: 0, message: 'SQL Error' });
                }
                if (loginData.length) {
                    next();
                } else {
                    return res.status(401).json({ status: 0, message: 'Invalid token.' });
                }
            })
        } catch (err) {
            console.log("Token authentication", err);
            return res.send({ status: 0, message: err });
        }
    }
    // Validating Token
    static async isAgentAuthorised(req, res, next) {
        try {
            const token = req.headers.authorization;
            if (!token) return res.status(401).json({ status: 0, message: 'Please send token with api.' });
            var sql = "SELECT * FROM agent_login WHERE token='" + token + "'";
            config.con.query(sql, (err, loginData) => {
                if (err) {
                    console.log(err, 'err')
                    return this.res.send({ status: 0, message: 'SQL Error' });
                }
                if (loginData.length) {
                    next();
                } else {
                    return res.status(401).json({ status: 0, message: 'Invalid token.' });
                }
            })
        } catch (err) {
            console.log("Token authentication", err);
            return res.send({ status: 0, message: err });
        }
    }
    static async isValid(req, res, next) {
        try {
            if (!config.useRefreshToken) {
                return res.status(401).json({ status: 0, message: 'Not authorized to refresh token.' });
            }
            next();
        } catch (err) {
            console.log("isValid", err);
            return res.send({ status: 0, message: err });
        }
    }
    async extendTokenTime(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const authenticate = await Authentication.findOne({ userId: userId });
                if (authenticate && authenticate.tokenExpiryTime) {
                    let expiryDate = Moment(authenticate.tokenExpiryTime).subtract(2, 'minutes')
                    let now = Moment();
                    if (now > expiryDate) {
                        await Authentication.findOneAndUpdate({ userId: userId }, { tokenExpiryTime: Moment(authenticate.tokenExpiryTime).add(config.tokenExpirationTime, 'minutes') });
                    }
                }
                return resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    async checkPasswordExpiryTime(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data && data.userObj && data.userObj.passwordUpdatedAt) {
                    let lastChangedDate = Moment(data.userObj.passwordUpdatedAt, 'YYYY-MM-DD HH:mm:ss');
                    let currentDate = Moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                    let duration = Moment.duration(currentDate.diff(lastChangedDate));
                    let months = duration.asMonths();
                    console.log('months', months);
                    if (months >= parseInt(config.updatePasswordPeriod)) {
                        return resolve(true);
                    }
                    return resolve(false);
                }
                return resolve()
            } catch (error) {
                return reject(error);
            }
        });
    }
    static isAdminAuthorised(resource) {
        return async (req, res, next) => {
            console.log('resource', resource);
            try {
                const token = req.headers.authorization;
                if (!token) return res.status(401).json({ status: 0, message: 'Please send token with api.' });
                var sql = "SELECT * FROM login_master WHERE token='" + token + "'";
                config.con.query(sql, (err, loginData) => {
                    if (err) {
                        console.log(err, 'err')
                        return this.res.send({ status: 0, message: 'SQL Error' });
                    }
                    if (loginData.length) {
                        next();
                    } else {
                        return res.status(401).json({ status: 0, message: 'Invalid token.' });
                    }
                })
                // const tokenCheck = await authenticate.checkTokenInDB(token);
                // if (!tokenCheck) return res.status(401).json({ status: 0, message: 'Invalid token.' });
                // next();
            } catch (err) {
                console.log("Token authentication", err);
                return res.send({ status: 0, message: err });
            }
        }

    }
    // Check token in DB
    checkTokenInDB(token) {
        return new Promise(async (resolve, reject) => {
            try {
                // const authenticate = await Authentication.findOne(filter);
                console.log(token, 'token')

            } catch (err) {
                console.log("Check token in db")
                return resolve({ message: err, status: 0 });
            }
        })
    }
    // Check Token Expiration
    checkExpiration(token) {
        return new Promise(async (resolve, reject) => {
            let status = false;
            const authenticate = await Authentication.findOne({ token: Buffer.from(token, "hex") });
            if (authenticate && authenticate.tokenExpiryTime) {
                let expiryDate = Moment(authenticate.tokenExpiryTime, 'YYYY-MM-DD HH:mm:ss')
                let now = Moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                if (expiryDate > now) { status = true; resolve(status); }
            }
            resolve(status);
        })
    }
    refreshAccessToken(refreshtoken) {
        return new Promise(async (resolve, reject) => {
            let isVerified = ''; // returns true
            if (!isVerified) {
                return resolve({ status: 0, message: "Invalid refresh token." });
            }
            let filter = { refreshToken: Buffer.from(refreshtoken, "hex") };
            const authenticationData = await Authentication.findOne(filter);
            if (authenticationData && authenticationData.tokenExpiryTime) {
                let expiryDate = Moment(authenticationData.tokenExpiryTime, 'YYYY-MM-DD HH:mm:ss')
                let now = Moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
                if (expiryDate > now) {
                    return resolve({ status: 0, message: "Access token is not expired yet." });
                } else {
                    const authenticate = new Globals();
                    const { token, refreshToken } = await authenticate.getTokenWithRefreshToken({ id: authenticationData.userId });
                    return resolve({ status: 1, message: "Token refreshed.", access_token: token, refreshToken: refreshToken });
                }
            }
            else {
                return resolve({ status: 0, message: "Wrong refresh token." });
            }
        });
    }
    static encryptDecryptData(text, type, key) {
        // console.log(msg)
        var bitKey1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        var keyData = key;
        if (key == 1) {
            keyData = bitKey1;
        }
        if (type == 'E') {
            var textBytes = aesjs.utils.utf8.toBytes(text);
            // The counter is optional, and if omitted will begin at 1
            var aesCtr = new aesjs.ModeOfOperation.ctr(keyData, new aesjs.Counter(5));
            var encryptedBytes = aesCtr.encrypt(textBytes);
            // To print or store the binary data, you may convert it to hex
            var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
            return encryptedHex;
        } else {
            // When ready to decrypt the hex string, convert it back to bytes
            var encryptedBytes = aesjs.utils.hex.toBytes(text);
            // The counter mode of operation maintains internal state, so to
            // decrypt a new instance must be instantiated.
            var aesCtr = new aesjs.ModeOfOperation.ctr(keyData, new aesjs.Counter(5));
            var decryptedBytes = aesCtr.decrypt(encryptedBytes);
            // Convert our bytes back into text
            var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
            return decryptedText;
        }
    }
}

module.exports = Globals;
