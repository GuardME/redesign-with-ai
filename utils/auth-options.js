import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "./database";
import User from "../models/user";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // update session.
      console.log("session", session);
      await connectToDB();
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      session.user.id = sessionUser._id.toString();
      session.user.credits = sessionUser.credits;
      session.user.role = sessionUser.role;
      return session;
    },
    async signIn({ profile }) {
      // check if a user already exists
      // connect to database
      console.log("profile", profile);
      try {
        await connectToDB();
        const userExists = await User.findOne({
          email: profile.email,
        });
        if (!userExists) {
          const username = profile.name.replace(" ", "").toLowerCase();
          await User.create({
            email: profile.email,
            username: username,
            image: profile.picture,
            credits: 3,
          });

        }
        return true;
      } catch (error) {
        console.log(error)
      }
      console.log(error);
      return false;
    },
  },
};
