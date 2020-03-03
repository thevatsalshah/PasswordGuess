const Controller = require('../Base/Controller');
const _ = require("lodash");
const Config = require("../../../configs/configs");
const RequestBody = require("../../services/RequestBody");
class PasswordController extends Controller {
  constructor() {
    super();
  }

  /********************************************************
    Purpose: Check Password
    Parameter:
      {
          "password":"john",
      }
   Return: JSON String
   ********************************************************/
  async checkPassword() {
    try {
      let fieldsArray = ["password"];
      let emptyFields = await new RequestBody().checkEmptyWithFields(
        this.req.query,
        fieldsArray
      );
      if (emptyFields && Array.isArray(emptyFields) && emptyFields.length) {
        return this.res.send({ status: 0, message: "Please send password" });
      }
      const data = this.req.query;
      const sqlQuery = `SELECT * FROM passwordList WHERE password=${data.password}`;
      Config.con.query(sqlQuery, (err, result, fields) => {
        if (err) {
          console.log(err, "err");
          this.res.send({ status: 0, message: err });
        } else {
          if (result.length) {
            this.res.send({
              status: 1,
              message: "Password guessed successfully"
            });
          } else {
            this.res.send({
              status: 0,
              message: "Incorect password"
            });
          }
        }
      });
    } catch (error) {
      console.log("error = ", error);
      this.res.send({ status: 0, message: error });
    }
  }
}
module.exports = PasswordController;
