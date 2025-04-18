import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const auth: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            res.status(401).json({
                success: false,
                message: "You are not authorized to access this route",
            });
            return;
        }

        token = token.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        (req as any).user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
