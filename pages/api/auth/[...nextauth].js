import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import httpRequest from "../../../src/api/httpRequest";
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // console.log({ credentials, req });
        const user = {
          email: credentials.email,
          password: credentials.password,
        };
        try {
          const res = await httpRequest.post("/auth/login", user);

          if (res.status === 200) {
            return res.data;
          }

          console.log({ res });

          //   return {
          //     id: 2,
          //     email: "truongquocvuong1902@gmail.com",
          //     password: "John",
          //   };
        } catch (error) {
          return null;
        }

        // if (
        //   credentials.email === "truongquocvuong1902@gmail.com" &&
        //   credentials.password === "123456"
        // ) {
        //   return {
        //     id: 2,
        //     email: "truongquocvuong1902@gmail.com",
        //     password: "John",
        //   };
        // }

        // login failed
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  callbacks: {
    async redirect({ url }) {
      if (url.includes("/login")) return "/";
      if (!url.includes("/")) return "/login";
      return url;
    },
  },
});
