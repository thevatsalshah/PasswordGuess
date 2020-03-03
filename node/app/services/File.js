/****************************
 FILE HANDLING OPERATIONS
 ****************************/
let fs = require('fs');
let path = require('path');
const config = require('../../configs/configs');
const _ = require("lodash");
const json2csv = require('json2csv').parse;
const mv = require('mv');
const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: 'Mp6fcFczkURNm70FORcoQg74PjM+WqjT7YBJmuWb',
    accessKeyId: 'AKIASQW7PSHAIWVLOH5H',
    region: 'ap-south-1'
});

const s3 = new aws.S3();


class File {

    constructor(file, location) {
        this.file = file;
        this.location = location;
    }

    // Method to Store file
    store() {
        return new Promise((resolve, reject) => {
            // Setting the path
            if (_.isEmpty(this.file.file)) {
                reject('Please send file.');
            }
            let fileName = this.file.file[0].originalFilename.split(".");
            let filePath1 = '/public/upload/images/' + fileName[0] + Date.now().toString() + '.' + fileName[1];
            let flname = fileName[0] + Date.now().toString() + '.' + fileName[1];
            let filePath = path.join(__dirname, '..', '..', 'public', 'upload', 'images', flname);
            let uploadedFilePath = appRoot + filePath;
            console.log(uploadedFilePath);
            let fileObject = { "originalFilename": this.file.file[0].originalFilename, "filePath": uploadedFilePath, "filePartialPath": filePath1 }

            mv(this.file.file[0].path, filePath, { mkdirp: true }, function (err) {
                if (err) {
                    reject(err);
                }
                if (!err) {
                    resolve(fileObject);
                }
            });
        });

    }
    readFile(filepath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, 'utf-8', (err, html) => {
                if (err) {
                    return reject({ message: err, status: 0 });
                }
                return resolve(html);
            });
        });
    }
    convertJsonToCsv(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let jsonData = data.jsonData && Array.isArray(data.jsonData) ? data.jsonData : [];
                let ext = data.ext ? data.ext : ".csv"
                const fields = data.columns;
                const fileName = data.fileName ? data.fileName : "list";
                const opts = { fields };
                const csv = json2csv(jsonData, opts);
                var flname = fileName + Date.now().toString() + ext;
                var loc = path.join(__dirname, '..', '..', 'public', 'upload', 'csv', flname);
                fs.writeFile(loc, csv, (err, result) => {
                    if (err) {
                        return reject(err);
                    } else {
                        let csvFile = path.join('public', 'upload', 'csv', flname);
                        return resolve(config.apiUrl + '/' + csvFile);
                    }
                });
            } catch (err) {
                console.error(err);
                return reject(err);
            }
        });
    }
    uploadFileOnS3(file) {
        let fileName = file.originalFilename.split(".");
        let newFileName = fileName[0] + Date.now().toString() + '.' + fileName[1];
        return new Promise((resolve, reject) => {
            s3.createBucket(() => {
                let params = {
                    Bucket: 'easocare',
                    Key: newFileName,
                    ContentType:file.headers['content-type'],
                    Body: fs.createReadStream(file.path),
                    ACL: "public-read",
                }
                s3.upload(params, (err, data) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }

                });
            });
        });
    }
}

module.exports = File;