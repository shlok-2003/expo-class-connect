import { PrismaClient } from "@prisma/client";

class Prisma {
    private static instance: PrismaClient | null = null;

    private constructor() {}

    static getInstance() {
        if (!Prisma.instance) {
            Prisma.instance = new PrismaClient();
        }

        return Prisma.instance;
    }
}

export default Prisma;
