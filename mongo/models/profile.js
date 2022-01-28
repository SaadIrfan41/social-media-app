const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    // bio: { type: String, required: true },

    social: {
      facebook: { type: String },
      twitter: { type: String },
      youtube: { type: String },
      instagram: { type: String },
    },
  },
  { timestamps: true }
)

let Dataset =
  mongoose.models.Profile || mongoose.model('Profile', ProfileSchema)
export default Dataset
