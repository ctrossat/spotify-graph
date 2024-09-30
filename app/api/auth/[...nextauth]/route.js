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
			//first time login$
			console.log('account:');
			
			console.log(account);
			
			return {
			...token,
			accessToken: account.access_token,
			refreshToken: account.refresh_token,
			expiresAt	: account.expires_at,
			}
		} else if (Date.now() < token.expiresAt * 1000) {
		    // Subsequent logins, but the `access_token` is still valid
		    console.log('Acces Token still valid');
		    return token
    	} else {
			// Subsequent logins, but the `access_token` has expired, try to refresh it
			console.log('Refreshing access token...');
			console.log('token:');
			console.log(token);
			const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

			try {
				const response = await fetch('https://accounts.spotify.com/api/token', {
					method: 'POST',
					headers: {
						Authorization: `Basic ${basic}`,
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: new URLSearchParams({
						grant_type: 'refresh_token',
						refresh_token:  token.refreshToken,
					})
				});
			
				const tokensOrError = await response.json()
		
				if (!response.ok) throw tokensOrError
		
				const newTokens = tokensOrError
				
				console.log('Token successfully refreshed');
				
				return {
					...token,
					accessToken: newTokens.access_token,
					refreshToken: newTokens.refresh_token,
					expiresAt: Math.floor(Date.now() / 1000 + newTokens.expires_in),
				}
    		} catch (error) {
				// If we fail to refresh the token, return an error so we can handle it on the page
				console.error("Error refreshing access_token", error)
				token.error = "RefreshTokenError"
				return token
        	};
			return token
      	};
    },
    async session({ session, token, user}) {
      // Send properties to the client.
      session.accessToken = token.accessToken
	  session.refreshToken = token.refreshToken
	  session.error = token.error
      return session
    }
  }
  
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }