const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: String,
    // required: true,
  },
  userName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    // required: true,
  },
  videos: {
    videoPost: {
      type: Schema.Types.ObjectId,
      ref: 'VideoPost',
    },
  },
  firstName: {
    type: String,
  },
  lstName: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  collections: {
    videoPost: {
      type: String,
      ref: 'VideoPost',
    },
  },
  likedVideos: {
    videoPost: {
      type: String,
      ref: 'videoPost',
    },
  },
});

module.exports = mongoose.model('User', userSchema);
