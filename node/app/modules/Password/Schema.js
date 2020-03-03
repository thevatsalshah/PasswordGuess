var mongoose = require('mongoose');
var schema = mongoose.Schema;
const _ = require("lodash");
var user = new schema({
    mob_no: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    dob: { type: Date, required: true },
    blood_group: { type: String, required: true },
    pincode: { type: String, required: true },
    created_on: { type: Date },
    updated_on: { type: Date },
    address_line1: { type: String, required: true },
    address_line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true }
});

let Users = mongoose.model('User', user);
module.exports = {
    Users,
    user
}