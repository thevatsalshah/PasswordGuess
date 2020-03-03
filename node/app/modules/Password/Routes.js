
module.exports = (app, express) => {

    const router = express.Router();
    const PasswordController = require('../Password/Controller');
    const config = require('../../../configs/configs');
    const Globals = require("../../../configs/Globals");
    router.get('/passordCheck', (req, res, next) => {
        const userObj = (new PasswordController()).boot(req, res);
        return userObj.checkPassword();
    });
    app.use(config.baseApiUrl, router);
}