import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        name: string;
        role: string;
        image?: string | null;
    }

    interface Session {
        user: User & {
            id: string;
            role: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
} 