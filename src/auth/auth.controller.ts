import "dotenv/config"
import { createUserService, userLoginService } from "./auth.service"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

// register user controller
export const registerUserController = async (req: Request, res: Response) => {
    try {
        // "firstName": "Brian",
        // "lastName": "Kemboi",
        // "email": "test@mail.com",
        // "password": "mypass"

        const user = req.body;
        const password = user.password;
        const hashedPassword = bcrypt.hashSync(password, 10)
        user.password = hashedPassword;

        const createUser = await createUserService(user)
        if (!createUser) return res.json({ message: "user not created" })
        return res.status(201).json({ message: createUser });
    } catch (error: any) {
        return res.status(400).json({ error: error.message })
    }
}

//login user controller
export const loginUserController = async (req: Request, res: Response) => {
    try {
        const user = req.body;

        // Check if the user exists
        const userExists = await userLoginService(user);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify the password
        const userMatch = await bcrypt.compare(user.password, userExists.password as string);
        if (!userMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Create a payload for the JWT
        const payload = {
            sub: userExists.email,
            user_id: userExists.id,
            first_name: userExists.firstName,
            last_name: userExists.lastName,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3, // 3 days
        };

        // Generate the JWT token
        const secret = process.env.JWT_SECRET as string;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const token = `${jwt.sign(payload, secret)}`;

        // Return the response
        return res.status(200).json({
            token,
            user: {
                user_id: userExists.id,
                first_name: userExists.firstName,
                last_name: userExists.lastName,
                email: userExists.email,
            },
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};