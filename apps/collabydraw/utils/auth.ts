import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import client from "@repo/db/client";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from 'jsonwebtoken';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(client),
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/auth/signin',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                const user = await client.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user.password) {
                    throw new Error('No user found with this email');
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                if (!passwordMatch) {
                    throw new Error('Incorrect password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user && user.email) {
                token.id = user.id;
                token.email = user.email;
            }

            token.accessToken = jwt.sign(
                { id: token.id, email: token.email },
                process.env.NEXTAUTH_SECRET || '',
                { expiresIn: '3d' }
            );
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.accessToken = token.accessToken as string;
            }
            return session;
        }
    },
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}