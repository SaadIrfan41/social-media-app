import User from '../../models/user'
import Profile from '../../models/profile'
import Follower from '../../models/follower'
import Post from '../../models/post'

module.exports = {
  Query: {
    async userProfile(_, { username }) {
      const user = await User.findOne({ username }).exec()
      if (!user) {
        throw new Error('User Does Not Exist')
      }

      const profile = await Profile.findOne({ user: user._id }).populate('user')

      const followData = await Follower.findOne({ user: user._id })

      return {
        profile: profile.user,
        followers:
          followData.followers.length > 0 ? followData.followers.length : 0,
        following:
          followData.following.length > 0 ? followData.following.length : 0,
      }
    },
    async userPost(_, { id }) {
      const user = await User.findById(id).exec()
      if (!user) {
        throw new Error('User Does Not Exist')
      }
      // console.log(user)
      const post = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('likes.user')
        .populate('comments.user')
        .exec()
      if (!post) {
        return 'NO POST FOUND'
      }
      // console.log(post)
      return post
    },
    async userFollowStats(_, { id }) {
      const user = await Follower.findOne({ user: id })
        .populate('user')
        .populate('followers.user')
        .populate('following.user')
        .exec()
      // console.log(user.following)
      return user
      // return {
      //   user: user.user,
      //   followers: user.followers,
      //   following: user.following,
      // }
    },
  },

  Mutation: {
    async followUser(_, { userToFollowId }, { session }) {
      const user = await Follower.findOne({
        user: session?.user?.id,
      }).exec()
      const userToFollow = await Follower.findOne({
        user: userToFollowId,
      }).exec()
      if (!user || !userToFollow) {
        throw new Error('User Does Not Exist')
      }
      const isFollowing = user.following.filter(
        (following) => following.user.toString() === userToFollowId
      )
      if (isFollowing.length > 0) {
        await Follower.findByIdAndUpdate(user._id, {
          $pull: {
            following: {
              user: userToFollowId,
            },
          },
        }).exec()

        await Follower.findByIdAndUpdate(userToFollowId, {
          $pull: {
            followers: {
              user: user.user._id,
            },
          },
        }).exec()

        return 'User UnFollowed'
      }
      console.log(user)
      await Follower.findByIdAndUpdate(user._id, {
        $push: {
          following: {
            user: userToFollowId,
          },
        },
      }).exec()
      await userToFollow.followers.push({ user: user.user._id })
      userToFollow.save()
      // const res = await Follower.findByIdAndUpdate(userToFollowId, {
      //   $push: {
      //     followers: {
      //       user: user.user._id,
      //     },
      //   },
      // }).exec()
      // console.log(res)

      return 'User Followed'
    },
  },
}
