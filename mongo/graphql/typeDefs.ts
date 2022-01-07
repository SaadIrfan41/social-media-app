import { gql } from 'apollo-server-micro'

const typeDefs = gql`
  #Users
  type User {
    _id: ID!
    username: String
    email: String
    profilePicUrl: String
    name: String
    role: String
    password: String
    createdAt: String
    updatedAt: String
  }

  #Post
  type Post {
    _id: ID!
    text: String!
    picUrl: String
    user: User!
    likes: [Likes!]
    comments: [Comments!]
    createdAt: String!
  }
  type Likes {
    _id: ID!
    user: User!
  }
  type Comments {
    _id: ID!
    text: String!
    date: String!
    user: User!
  }
  type Query {
    allUsers: [User!]
    filterUsers(name: String!): [User!]
    currentuser(id: ID!): User!
    allPosts: [Post!]
    postById(id: ID!): Post!
    singlePostComments(id: ID!): Post!
    alllikes(id: ID!): [Likes!]
  }

  type Mutation {
    #Users
    profile(token: String!): User!

    #Posts
    createPost(text: String!, picUrl: String): String
    deletePost(id: ID!): String
    like_dislike_Post(id: ID!): String
    createComment(id: ID!, text: String!): String
    deleteComment(postId: ID!, commentId: String!): String
  }
`

export default typeDefs
