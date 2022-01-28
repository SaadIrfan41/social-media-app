const userResolvers = require('./users')
const postResolvers = require('./post')

const profileResolvers = require('./profile')

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...profileResolvers.Query,
  },

  Mutation: {
    ...postResolvers.Mutation,
    ...profileResolvers.Mutation,
    // ...entriesResolvers.Mutation,
  },
}
