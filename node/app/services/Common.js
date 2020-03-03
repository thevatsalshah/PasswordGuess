/****************************
 Common services
 ****************************/
const _ = require("lodash");
// const scrypt = require("scrypt");
const Config = require('../../configs/configs');
const https = require('https');
const Moment = require('moment');
const i18n = require("i18n");
const RequestBody = require("./RequestBody");
const File = require('./File');

class Common {

    /********************************************************
     Purpose:Service for error handling
     Parameter:
     {
         errObj: {},
         schema: {}
     }
     Return: JSON String
     ********************************************************/
    errorHandle(errObj, schema = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let errorMessage = "Internal server error.";
                if (errObj && errObj.code) {
                    switch (errObj.code) {
                        case 11000:
                            errorMessage = "Duplicate key error";
                            if (schema) {
                                const indexes = [[{ _id: 1 }, { unique: true }]].concat(schema.indexes());
                                await indexes.forEach(async (index) => {
                                    const paths = Object.keys(index[0]);
                                    if ((errObj.message).includes(paths[0])) {
                                        errorMessage = ` ${paths[0]} expects to be unique. `;
                                    }
                                });
                            }
                            break;
                        case 0:
                            errorMessage = "";
                            break;
                        case 1:
                            errorMessage = "";
                            break;
                        default:
                            break;
                    }
                } else if (errObj && errObj.message && errObj.message.errmsg) {
                    errorMessage = errObj.message.errmsg;
                } else if (errObj && errObj.errors) {
                    if (schema) {
                        schema.eachPath(function (path) {
                            console.log('path', path);
                            if (_.has(errObj.errors, path) && errObj.errors[path].message) {
                                errorMessage = errObj.errors[path].message;
                            }
                        });

                    }
                } else if (errObj && errObj.message && errObj.message.errors) {
                    if (schema) {
                        schema.eachPath(function (path) {
                            console.log('path', path);
                            if (_.has(errObj.message.errors, path) && errObj.message.errors[path].message) {
                                errorMessage = errObj.message.errors[path].message;
                                console.log('errorMessage', errorMessage);
                            }
                        });

                    }
                }
                return resolve(errorMessage);
            } catch (error) {
                return reject({ status: 0, message: error });
            }
        });
    }
    /********************************************************
    Purpose: Encrypt password
    Parameter:
        {
            "data":{
                "password" : "test123"
            }
        }
    Return: JSON String
    ********************************************************/
    ecryptPassword(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data && data.password) {
                    // var scryptParameter
                    // s = scrypt.paramsSync(0.1);
                    var kdfResult = '';
                    return resolve(kdfResult);
                }
                return resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    /********************************************************
    Purpose: Compare password
    Parameter:
        {
            "data":{
                "password" : "Buffer data", // Encrypted password
                "savedPassword": "Buffer data" // Encrypted password
            }
        }
    Return: JSON String
    ********************************************************/
    verifyPassword(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let isVerified = false;
                if (data && data.password && data.savedPassword) {
                    isVerified = ''; // returns true
                }
                return resolve(isVerified);
            } catch (error) {
                reject(error);
            }
        });
    }
    /********************************************************
    Purpose: Validate password
    Parameter:
        {
            "data":{
                "password" : "test123",
                "userObj": {}
            }
        }
    Return: JSON String
    ********************************************************/
    validatePassword(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data && data.password) {
                    if (data.userObj && _.isEqual(data.password, data.userObj.firstname)) {
                        return resolve({ status: 0, message: i18n.__("PASSWORD_NOT_SAME_FIRSTNAME") });
                    }
                    // Check new password is already used or not
                    if (Config.dontAllowPreviouslyUsedPassword && data.userObj && data.userObj.previouslyUsedPasswords && Array.isArray(data.userObj.previouslyUsedPasswords) && data.userObj.previouslyUsedPasswords.length) {
                        let isPreviouslyUsed = _.filter(data.userObj.previouslyUsedPasswords, (previouslyUsedPassword) => {
                            return '';
                        });
                        if (isPreviouslyUsed && Array.isArray(isPreviouslyUsed) && isPreviouslyUsed.length) {
                            return resolve({ status: 0, message: i18n.__("ALREADY_USED_PASSWORD") });
                        }
                    }
                    return resolve({ status: 1, message: "Valid password." });
                } else {
                    return resolve({ status: 0, message: "Password required." });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /********************************************************
     Purpose: Service for searching records
     Parameter:
     {
        data:{
            bodyData:{},
            model:{}
        }
     }
     Return: JSON String
     ********************************************************/
    search(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let commonFilter = { $or: [{ isDeleted: { $exists: false } }, { $and: [{ isDeleted: { $exists: true } }, { isDeleted: false }] }] };
                let selectObj = data.selectObj ? data.selectObj : { "__v": 0 };
                let model = data.bodyData.model;
                let bodyData = data.bodyData;
                let filter = commonFilter;
                let k = bodyData.column ? bodyData.column : "_id";
                if (bodyData.filter) {
                    let ar = bodyData.filter;
                    for (let key in ar) {
                        let v = ar[key];
                        k = key;
                        filter = {
                            [key]: new RegExp(v, 'i')
                        }
                        if (bodyData.schema && !_.isEmpty(bodyData.schema) && bodyData.schema.path(key) && bodyData.schema.path(key).instance == 'Embedded') {  // For searching Role
                            filter = {
                                [key + '.' + key]: new RegExp(v, 'i')
                            }
                        }
                    }
                    filter = { $and: [filter, commonFilter] };
                }
                let arr = [];
                const searchedData = await model.find(filter).select(selectObj);
                searchedData.filter((u) => {
                    if (bodyData.schema && !_.isEmpty(bodyData.schema) && bodyData.schema.path(k) && bodyData.schema.path(k).instance == 'Embedded') {
                        arr.push(u[k][k]);
                    } else {
                        arr.push(u[k]);
                    }
                });
                return resolve({ status: 1, data: { [k]: arr } });
            } catch (error) {
                return reject(error);
            }
        });
    }
    constructFilter(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let commonFilter = { ...data.staticFilter, $or: [{ isDeleted: { $exists: false } }, { $and: [{ isDeleted: { $exists: true } }, { isDeleted: false }] }] };
                let f = [];
                let filter1 = commonFilter;
                if (data.filter && Array.isArray(data.filter)) {
                    let filter = data.filter;
                    for (let index in filter) {
                        let ar = filter[index];
                        for (let key in ar) {
                            let filterObj = ar[key] && Array.isArray(ar[key]) ? ar[key] : [];
                            let valueArr = [];
                            filterObj.filter((value) => {
                                // valueArr.push({ [key]: value });
                                let obj;
                                if (data.schema && !_.isEmpty(data.schema) && data.schema.path(key) && data.schema.path(key).instance == 'Embedded') {
                                    obj = { [key + '.' + key]: value };
                                } else {
                                    obj = data.search ? { [key]: typeof value === 'string' ? new RegExp(value.toString().toLowerCase(), 'i') : value } : { [key]: value };
                                }
                                valueArr.push(obj);
                            });
                            console.log('valueArr', valueArr)
                            if (valueArr.length) {
                                f.push({ $or: valueArr })
                            }
                        }
                        filter1 = { $and: [...f, commonFilter] };
                    }
                }
                resolve(filter1);
            } catch (error) {
                reject(error);
            }
        });
    }
    downloadFile(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let bodyData = data.bodyData;
                let model = data.bodyData.model;
                let columns = bodyData && bodyData.columns ? bodyData.columns : ['firstname', 'lastname', 'username', 'emailId', 'mobile'];
                let filter = bodyData && bodyData.filter ? bodyData.filter : { isDeleted: false, emailVerificationStatus: true };
                filter = await this.constructFilter({ filter });
                const records = await model.find(filter).lean();
                const file = await (new File()).convertJsonToCsv({ jsonData: records, columns, fileName: 'userList', ext: data.ext });
                resolve({ status: 1, data: file });
            } catch (error) {
                reject(error);
            }
        });
    }
    /********************************************************
     Purpose:Convert currency
     Parameter:
     {}
     Return: JSON String
     ********************************************************/
    convertCurrency(amount, fromCurrency, toCurrency) {
        return new Promise((resolve, reject) => {
            try {
                var apiKey = '424a618d3b6f3fde2877';
                fromCurrency = encodeURIComponent(fromCurrency);
                toCurrency = encodeURIComponent(toCurrency);
                var query = fromCurrency + '_' + toCurrency;

                var url = 'https://free.currconv.com/api/v7/convert?q=' + query + '&compact=ultra&apiKey=' + apiKey;

                https.get(url, (res) => {
                    var body = '';
                    res.on('data', (chunk) => { console.log('chunk', chunk); body += chunk; });

                    res.on('end', () => {
                        try {
                            console.log('body', body);
                            var jsonObj = JSON.parse(body);
                            console.log('jsonObj', jsonObj);
                            var val = jsonObj[query];
                            if (val) {
                                var total = val * amount;
                                console.log('total', total);
                                return resolve({ status: 1, data: Math.round(total * 100) / 100 });
                            } else {
                                var err = new Error("Value not found for " + query);
                                console.log(err);
                                return resolve({ status: 0, message: err });
                            }
                        } catch (e) {
                            console.log("Parse error: ", e);
                            return reject(e);
                        }
                    });
                }).on('error', (e) => {
                    console.log("Got an error: ", e);
                    return reject(e);
                });
            } catch (error) {
                return reject(error);
            }
        });
    }
    /********************************************************
     Purpose: Change password validations
     Parameter:
     {
     }
     Return: JSON String
    ********************************************************/
    changePasswordValidation(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let passwordObj = data.passwordObj ? data.passwordObj : {}
                const samePassword = _.isEqual(passwordObj.oldPassword, passwordObj.newPassword);
                if (samePassword) {
                    return resolve({ status: 0, message: i18n.__("OLD_PASSWORD_NEW_PASSWORD_DIFFERENT") });
                }

                const status = await this.verifyPassword({ password: passwordObj.oldPassword, savedPassword: passwordObj.password });
                if (!status) {
                    return resolve({ status: 0, message: i18n.__("CORRECT_CURRENT_PASSWORD") });
                }

                let isPasswordValid = await this.validatePassword({ password: passwordObj.newPassword });
                if (isPasswordValid && !isPasswordValid.status) {
                    return resolve(isPasswordValid);
                }

                let password = await this.ecryptPassword({ password: passwordObj.newPassword });
                return resolve(password);
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = Common;