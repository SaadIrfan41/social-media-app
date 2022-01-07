import Post from '../../models/post'
import Users from '../../models/user'
// import Entries from '../../models/entry'
import { v4 as uuidv4 } from 'uuid'

module.exports = {
  Query: {
    allPosts: async () => {
      try {
        const posts = await Post.find({})
          .sort({ createdAt: -1 })
          .populate('user')
          .populate('likes.user')
          .populate('comments.user')
          .exec()
        return posts
      } catch (err) {
        console.log(err)
      }
    },
    alllikes: async (_, { id }) => {
      try {
        const post = await Post.findById(id).populate('likes.user').exec()
        if (!post) {
          throw new Error('Post not found')
        }
        // console.log('POST DAta', post.likes)
        return post?.likes
      } catch (err) {
        console.log(err)
      }
    },
    postById: async (_, { id }, { session }) => {
      // if (!session) {
      //   throw new Error('User is not logged in.')
      // }

      // const finduser = await Users.findById(session?.user?.id).exec()
      // if (!finduser) {
      //   throw new Error('Invalid User ID')
      // }

      const post = await Post.findById(id)
        .populate('user')
        // .populate('entries')
        .exec()
      if (!post) {
        throw new Error('Post not found')
      }
      return post
    },
    singlePostComments: async (_, { id }, { session }) => {
      // if (!session) {
      //   throw new Error('User is not logged in.')
      // }

      // const finduser = await Users.findById(session?.user?.id).exec()
      // if (!finduser) {
      //   throw new Error('Invalid User ID')
      // }

      const post = await Post.findById(id)

        .populate('comments.user')
        .sort({ createdAt: -1 })
        .exec()
      if (!post) {
        throw new Error('Post not found')
      }
      await post.comments.reverse()

      return post
    },
  },

  Mutation: {
    createPost: async (_, { text, picUrl }, { session }) => {
      if (!session) {
        throw new Error('User is not logged in.')
      }

      const finduser = await Users.findById(session?.user?.id).exec()
      if (!finduser) {
        throw new Error('Invalid User ID')
      }

      try {
        const post = new Post({
          text,
          picUrl,
          user: session?.user?.id,
        })
        // await user.diaries.push(diary._id)
        // await user.save()
        await post.save()
        return 'Post Created'
      } catch (err) {
        console.log(err)
      }
    },

    // updateEntry: async (_, { tittle, description, id }) => {
    //   const entry = await Entries.findById(id)
    //   if (!entry) {
    //     throw new Error('Entry not found')
    //   }
    //   const updatedentry = await Entries.findOneAndUpdate(
    //     { _id: id },
    //     { tittle: tittle, description: description },
    //     {
    //       new: true,
    //     }
    //   )
    //     .populate('diaryid')
    //     .populate('author', '-password')
    //   return updatedentry
    // },
    deletePost: async (_, { id }, { session }) => {
      // if (!session) {
      //   throw new Error('User is not logged in.')
      // }

      // const finduser = await Users.findById(session?.user?.id).exec()
      // if (!finduser) {
      //   throw new Error('Invalid User ID')
      // }
      const post = await Post.findById(id)
      if (!post) {
        throw new Error('Post Does Not Exist')
      }
      // if (post.user.toString() !== finduser._id) {
      //   if (finduser.role === 'root') {
      //     await post.deleteOne()
      //     return 'Post Deleted'
      //   } else {
      //     return 'Unauthorized'
      //   }
      // }
      await post.deleteOne()
      return 'Post Deleted'

      // await Post.findOneAndDelete({ _id: id })
    },
    like_dislike_Post: async (_, { id }, { session }) => {
      if (!session) {
        throw new Error('Login to Like/UnLike Post')
      }

      const finduser = await Users.findById(session?.user?.id).exec()
      if (!finduser) {
        throw new Error('Invalid User ID')
      }
      const post = await Post.findById(id)
      if (!post) {
        throw new Error('Post Does Not Exist')
      }
      const liked = post.likes.filter(
        (like) => like.user.toString() === session?.user?.id
      )
      console.log('Liked users', liked)
      if (liked.length > 0) {
        await Post.findByIdAndUpdate(id, {
          $pull: {
            likes: {
              user: session?.user?.id,
            },
          },
        }).exec()

        return 'Post DisLiked'
      }
      await Post.findByIdAndUpdate(id, {
        $push: {
          likes: {
            user: session?.user?.id,
          },
        },
      }).exec()

      return 'Post Liked'
    },

    createComment: async (_, { id, text }, { session }) => {
      if (!session) {
        throw new Error('User is not logged in.')
      }

      const finduser = await Users.findById(session?.user?.id).exec()
      if (!finduser) {
        throw new Error('Invalid User ID')
      }
      const post = await Post.findById(id)
      if (!post) {
        throw new Error('Post Does Not Exist')
      }
      try {
        // const newComment =
        await Post.findByIdAndUpdate(id, {
          $push: {
            comments: {
              _id: uuidv4(),
              text,
              date: Date.now(),
              user: session?.user?.id,
            },
          },
        })
          // .populate('comments.user')
          .exec()
        // console.log(newComment?.comments)
        return 'Comment Created'
      } catch (err) {
        console.log(err)
      }
    },

    deleteComment: async (_, { postId, commentId }, { session }) => {
      // if (!session) {
      //   throw new Error('User is not logged in.')
      // }

      // const finduser = await Users.findById(session?.user?.id).exec()
      // if (!finduser) {
      //   throw new Error('Invalid User ID')
      // }
      const post = await Post.findById(postId)
      if (!post) {
        throw new Error('Post Does Not Exist')
      }
      const foundComment = post.comments.find(
        (comment) => comment._id === commentId
      )
      if (!foundComment) {
        return 'Comment Not Found'
      }
      // console.log('COMMENT', foundComment)

      // if (foundComment.user.toString() !== finduser._id) {
      //   if (finduser.role === 'root') {
      //     await Post.findByIdAndUpdate(postId, {
      //   $pull: {
      //     comments: {
      //       _id: commentId,
      //     },
      //   },
      // }).exec()
      //     return 'Comment Deleted'
      //   } else {
      //     return 'Unauthorized'
      //   }
      // }
      await Post.findByIdAndUpdate(postId, {
        $pull: {
          comments: {
            _id: commentId,
          },
        },
      }).exec()
      return 'Comment Deleted'
    },
  },
}
