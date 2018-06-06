const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema  = new Schema ({
  title:{
      type: String,
      required: true
  },
  due_date:{
      type: String,
      required: false
  },
  details:{
      type: String,
      required: true
  },
  plan:{
      type: String,
      required: false
  },
  user:{
    type: String,
    required: true
  },
  date:{
      type: Date,
      default: Date.now
  }
});

//This is connecting 'idea' to the Schema
mongoose.model('Ideas', IdeaSchema);
