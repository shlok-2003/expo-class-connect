import { Request, RequestHandler, Response } from "express";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";

import Prisma from "@/lib/prisma";

const prisma = Prisma.getInstance();

export const login: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { college_id, password } = req.body;

        if (!college_id || !password) {
            res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                college_id,
            },
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }

        const token = jwt.sign(
            { college_id: user.college_id, email: user.email, type: user.type },
            process.env.JWT_SECRET!,
        );

        const { password: p, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const register: RequestHandler = async (req: Request, res: Response) => {
    try {
        console.log("req", req.body);
        const { name, email, college_id, password, type } = req.body;


        if (!name || !email || !college_id || !password || !type) {
            res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                college_id,
            },
        });

        if (user) {
            res.status(400).json({
                success: false,
                message: "User already exists",
            });
            return;
        }

        const SALT_ROUNDS = 10;
        const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);

        await prisma.user.create({
            data: {
                type,
                name,
                email,
                college_id,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        console.log(error);
        console.log("error", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
