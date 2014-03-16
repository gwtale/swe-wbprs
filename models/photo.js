var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title : {
    type : String,
    trim : true
  },
  created : {
    type : Date,
    default : Date.now
  },
  owner : {
    type : String,
    ref : 'User' // relationship
  },
  isPrivate : {
    type : Boolean,
    default : true
  },
  tags : {
    type : [String]
  },
  likes : {
    type : [String]
  }
});

mongoose.model('Photo', schema);