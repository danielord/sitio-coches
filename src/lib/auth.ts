import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const vendedor = await prisma.vendedor.findUnique({
          where: { email: credentials.email }
        })

        if (!vendedor) return null

        const isValid = await bcrypt.compare(credentials.password, vendedor.password)
        if (!isValid) return null

        return {
          id: vendedor.id,
          email: vendedor.email,
          name: vendedor.nombre,
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
}