import User from '../../models/user'

module.exports = {
  Query: {
    async currentuser(_, { id }, { req }) {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid User ID')
      }

      const user = await User.findById(id).exec()
      if (!user) {
        throw new Error('User Does Not Exist')
      }
      return user
    },
    async filterUsers(parent, { name }, { session }) {
      // const session = await getSession({ req })
      // return { session }
      // console.log('SESSION', session)
      // if (!session) {
      //   throw new Error('User is not logged in.')
      // }
      if (name.length === 0) return
      // let userpattern = new RegExp(`^${name}`)
      const user = await User.find({
        name: { $regex: name, $options: 'i' },
      })

      return user
      // return await User.find({}).exec()
    },
    async allUsers(parent, args) {
      return await User.find({}).exec()
    },
  },

  // Mutation: {
  //   async profile(parent, { token }, { req }) {
  //     const currentUser = await authCheck(token)
  //     const user = await User.findOne({ email: currentUser.email }).exec()
  //     if (!user) {
  //       throw new Error('User Does Not Exist')
  //     }
  //     return user
  //   },
  // },
}
