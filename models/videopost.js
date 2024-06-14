const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require('../util/constants');

const videoPostSchema = new Schema(
  {
    countComment: {
      type: Number,
      default: 0,
    },
    countLike: {
      type: Number,
      default: 0,
    },
    countCollections: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    postTitle: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
    },
    restaurantName: {
      type: String,
    },
    restaurantAddress: {
      street: {
        type: String,
        //   required: true,
      },
      city: {
        type: String,
        //   required: true,
      },
      state: {
        type: String,
        uppercase: true,
        //   required: true,
        enum: constants.statesArray,
      },
      zipcode: {
        type: String,
        //   required: true,
      },
    },
    videoUrl: {
      type: String,
      required: true,
    },
    postTime: {
      type: Date,
      required: true,
    },
    likes: [
      {
        userSub: {
          type: String,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        avatar: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { collection: 'meetfood' },
);

module.exports = mongoose.model('VideoPost', videoPostSchema);
