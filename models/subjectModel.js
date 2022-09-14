const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  syllabus: {
    type: String,
    required: true
  },
  book: String,
  notebooks: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: {
        type: String
      },
      link: {
        type: String
      }
    }
  ],
  videos: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: {
        type: String
      },
      link: {
        type: String
      }
    }
  ],
  testBanks: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: {
        type: String
      },
      link: {
        type: String
      }
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Subject', SubjectSchema);
