import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "@/routes/auth";

dotenv.config();
const PORT: number = parseInt(process.env.PORT! || "4001");
const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
        process.exit(1);
    }

    console.log(`Server is running on port ${PORT}`);
});
