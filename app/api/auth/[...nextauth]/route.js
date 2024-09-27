import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify";


export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: { params: { scope: 'user-top-read' } }
    })
  ],
  callbacks: {
    async jwt({token, account, profile}) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user}) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      
      return session
    }
  }
  
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }