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
  type PaginatedPosts {
    posts: [Post!]!
    paginator: Paginator!
  }
  type Paginator {
    slNo: Int
    prev: Int
    next: Int
    perPage: Int
    totalPosts: Int
    totalPages: Int
    currentPage: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
  }
  type Likes {
    _id: ID!
    user: User!
  }
  type Follow {
    _id: ID!
    user: User!
  }
  type Comments {
    _id: ID!
    text: String!
    date: String!
    user: User!
  }
  type Profile {
    profile: User!
    followers: Int!
    following: Int!
  }
  type Followers {
    user: User
    followers: [Follow]
    following: [Follow]
  }
  type Query {
    allUsers: [User!]
    userProfile(username: String): Profile!
    userPost(id: ID!): [Post!]
    userFollowStats(id: ID!): Followers!
    filterUsers(name: String!): [User!]
    currentuser(id: ID!): User!
    allPosts: [Post!]
    allPaginatedPosts(page: Int, limit: Int): PaginatedPosts!
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

    #Follower
    followUser(userToFollowId: ID!): String
  }
`

export default typeDefs
