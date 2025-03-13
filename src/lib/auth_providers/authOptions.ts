import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authAuthenticator = CredentialsProvider({
  id: "credentials",
  name: "credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const response = await fetch(`${process.env.API_HOST}/oauth/token`, {
      method: "POST",
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        grant_type: "password",
        ...credentials,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const accessToken = data.access_token;
    const administrator = data.administrator;

    if (data.administrator == null || accessToken == null) {
      return null;
    } else {
      return {
        id: administrator.id,
        name: administrator.username,
        email: administrator.username,
        accessToken: accessToken,
      };
    }
  },
});

export const authOptions: NextAuthOptions = {
  providers: [authAuthenticator],
  theme: {
    colorScheme: "auto",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.accessToken) {
        session.user.accessToken = token.accessToken;
        session.user.id = token.sub;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};
