var mongoose = require('mongoose');

// validators
var validateEmail = require('../helpers/validate/email');

var schema = mongoose.Schema({
  // using email as user's unique id
  _id : {
    type : String,
    lowercase : true,
    trim : true,
    validate : validateEmail
  },
  name : {
    type: String,
    required : true
  },
  surname : {
    type: String,
    required : true
  },
  salt : {
    type : String,
    required : true
  },
  hash: {
    type : String,
    required : true
  },
  created: {
    type : Date,
    default: Date.now
  },
  isAdmin : {
    type : Boolean,
    default : false
  },
  address : String,
  birthDate : String,
  turkishIdentificationNumber : String
});

schema.virtual('fullname').get(function () {
  return this.name + ' ' + this.surname;
});

mongoose.model('User', schema);
