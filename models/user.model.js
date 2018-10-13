var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    email: String,
    password:  {type: String,select: false},
    firstName: String,
    lastName: String,
    phone: String,
    gender: String,
    age: Number,
    height: String,
    weight: String,
    aboutMe: String,
    homeCity: String,
    fullLegalname: String,
    streetAddress: String,
    appartmnetNumber: String,
    state: String,
    city: String,
    zipcode: String,
    verificationToken: String,
    emailVerified: {type: Boolean, default: false},
    accessToken: String,
    deviceToken: String,    
    memberOfGym: String,
    gymRoutines: [],
    // user
    pastInjuries: String,
    fitnessGoals: String,
    // coach
    specializeIn: [],
    isCertified: Boolean,
    amount: Number,
    type: Number, // 0-user 1-coach
    status: Number, // 0-inactive 1-active
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}

}, {
    collection: 'user'
});
module.exports = mongoose.model('user', userSchema);