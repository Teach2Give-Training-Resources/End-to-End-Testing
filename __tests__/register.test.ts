import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/index';
import db from '../src/drizzle/db';
import { UsersTable } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

const testUser = {
    firstName: "Reg",
    lastName: "Tester",
    email: "registeruser@mail.com",
    password: "regpass123"
};

afterAll(async () => {
    // Clean up test user
    await db.delete(UsersTable).where(eq(UsersTable.email, testUser.email));
    await db.$client.end();
});

describe("Post /auth/register", () => {
    it("should register a new user successfully", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send(testUser)

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "User Created Successfully");
    });

    it("should not register a user with an existing email", async () => {
        // register the user again
        await request(app)
            .post("/auth/register")
            .send(testUser);

        // try to register the same user again
        const res = await request(app)
            .post("/auth/register")
            .send(testUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    it("should not register a user with missing fields", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({
                firstName: "Test",
                lastName: "User",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
});