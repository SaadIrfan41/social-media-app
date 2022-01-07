const userResolvers = require('./users')
const postResolvers = require('./post')

// const entriesResolvers = require('./entries')

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    // ...entriesResolvers.Query,
  },

  Mutation: {
    ...postResolvers.Mutation,
    // ...diariesResolvers.Mutation,
    // ...entriesResolvers.Mutation,
  },
}
