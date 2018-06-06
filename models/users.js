const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema  = new Schema ({
  first_name:{
      type: String,
      required: true
  },
  surname_name:{
      type: String,
      required: true
  },
  email:{
      type: String,
      required: true
  },
  password: {
    type: String,
    required: true
  },
  date:{
      type: Date,
      default: Date.now
  }
});

//This is connecting 'idea' to the Schema
mongoose.model('Users', UsersSchema);
