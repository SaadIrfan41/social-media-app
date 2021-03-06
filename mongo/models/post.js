const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    text: { type: String, required: true },

    // location: { type: String },

    picUrl: { type: String },

    likes: [{ user: { type: Schema.Types.ObjectId, ref: 'User' } }],

    comments: [
      {
        _id: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)
PostSchema.plugin(mongoosePaginate)

let Dataset = mongoose.models.Post || mongoose.model('Post', PostSchema)
export default Dataset
