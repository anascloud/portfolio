import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { fetchWithChallenge } from '../services/challenge.service';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const res = await fetchWithChallenge(
            `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const responseJson = await res.json();

          if (res.ok && responseJson.status === true && responseJson.data) {
            const { user, access_token } = responseJson.data;
            
            if (user && access_token) {
              return {
                id: String(user.id),
                name: user.fullName || user.name,
                email: user.email,
                accessToken: access_token,
              };
            }
          }
          
          if (responseJson.message) {
            console.error('Laravel Auth Error:', responseJson.message);
          }
          
          return null; 
        } catch (error) {
          console.error('Auth Error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', 
  },
  session: {
    strategy: 'jwt' as const,
  },
} satisfies import('next-auth').AuthOptions;

export const handler = NextAuth(authOptions);
