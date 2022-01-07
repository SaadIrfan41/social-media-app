import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
const FormData = require('form-data')
import connectDB from '../../../mongo/config'
import User from '../../../mongo/models/user'
import Follower from '../../../mongo/models/follower'
import bcrypt from 'bcrypt'
import isEmail from 'validator/lib/isEmail'
// import isEmail from 'validator/es/lib/isEmail'

connectDB()
const CLOUDINARY_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/
export default NextAuth({
  //   session: {
  //     jwt: true,
  //   },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: {
          label: 'Name',
          type: 'text',
          placeholder: 'John Smith',
        },
        username: {
          label: 'User Name',
          type: 'text',
          placeholder: 'J.Smith',
        },
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
        profilePicUrl: {
          label: 'Profile Picture',
          type: 'file',
          placeholder: 'Upload Image',
        },
      },
      async authorize(credentials) {
        const name = credentials?.name
        const email = credentials?.email
        const password = credentials?.password
        const username = credentials?.username
        const image = credentials?.profilePicUrl
        // console.log('HELLOO', credentials)
        //@ts-ignore
        if (credentials?.action === 'login') return loginUser(password, email)
        //@ts-ignore
        if (credentials?.action === 'register')
          //@ts-ignore
          return registerUser(email, password, username, name, image)

        // return registerUser({ email, password })
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/',
  },
  // SQL or MongoDB database (or leave empty)
  //   database: process.env.DATABASE_URL,
  callbacks: {
    // session: async (session, user) => {
    //   // const resUser = await Users.findById(user.sub)
    //   // session.emailVerified = resUser.emailVerified
    //   session.userId = user.sub
    //   return Promise.resolve(session)
    // },
    // async session({ session, user, token }) {
    //   console.log('SESSION USER', user)
    //   session.userId = user.sub
    //   return session
    // },
    jwt: async ({ token, user }) => {
      user && (token.user = user)
      return token
    },
    session: async ({ session, token }) => {
      //@ts-ignore
      session?.user = {
        //@ts-ignore
        id: token.user._id,
        //@ts-ignore
        email: token.user.email,
        //@ts-ignore
        username: token.user.username,
        //@ts-ignore
        name: token.user.name,
        //@ts-ignore
        image: token.user.profilePicUrl,
      }
      return session
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      // Allows relative callback URLs
      else if (url.startsWith('/')) return new URL(url, baseUrl).toString()
      return baseUrl
    },
  },

  secret: process.env.NEXT_PUBLIC_SECRET,
  jwt: { secret: process.env.NEXT_PUBLIC_SECRET },
})
// type user={
//     password: string|undefined|Buffer,
//     email: string,
//     username: string,
// }

const loginUser = async (password: string, email: string) => {
  if (!isEmail(email)) {
    throw new Error('Invalid Email')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new Error('User Does Not Exist')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid Email or Password.')
  }

  // if (!user.emailVerified) {
  //   throw new Error('LOGEDMIN BUT Success! Check your email.')
  // }

  return user
}

const registerUser = async (
  email: string,
  password: string,
  username: string,
  name: string,
  image: string
) => {
  if (!regexUserName.test(username)) {
    throw new Error('Invalid User Name')
  }

  if (!isEmail(email)) {
    throw new Error('Invalid Email')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  const uniqueUserName = await User.findOne({ username })
  if (uniqueUserName) {
    throw new Error('UserName Allready Taken')
  }
  const user = await User.findOne({ email })
  if (user) {
    throw new Error('User allready registered with this Email')
  }

  const hashPass = await bcrypt.hash(password, 12)

  const formData = new FormData()

  formData.append('file', image)

  formData.append('upload_preset', 'social_media_app')
  const data = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  ).then((r) => r.json())
  if (!data.secure_url) {
    throw new Error('Image Upload Failed!')
  }

  const newUser = await new User({
    email,
    password: hashPass,
    username,
    name,
    profilePicUrl: data?.secure_url,
  })
  await newUser.save()
  console.log('USER', newUser)
  await new Follower({ user: newUser.id, followers: [], following: [] }).save()
  return newUser
}
