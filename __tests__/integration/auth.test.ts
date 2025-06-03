import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/index';
import db from '../../src/drizzle/db';
import { UsersTable } from '../../src/drizzle/schema';
import { eq } from 'drizzle-orm';

let testUser = {
    firstName: "Test",
    lastName: "User",
    email: "testuser@mail.com",
    password: "testpass123"
}

beforeAll(async () => {
    // hash the password before inserting
    const hashedPassword = bcrypt.hashSync(testUser.password, 10);
    await db.insert(UsersTable).values({
        ...testUser,
        password: hashedPassword
    });
});

afterAll(async () => {

    // clean up the test user
    await db.delete(UsersTable).where(eq(UsersTable.email, testUser.email));
    // close the database connection
    await db.$client.end();
});

describe("Post /auth/login", () => {
    it("should authenticate a user and return a token", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.user).toEqual(
            expect.objectContaining({
                user_id: expect.any(Number),
                first_name: testUser.firstName,
                last_name: testUser.lastName,
                email: testUser.email
            })
        );
    });

    it("should fail with wrong password", async () => {

        const res = await request(app)
            .post("/auth/login")
            .send({
                email: testUser.email,
                password: "wrongpassword"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should fail with non-existent user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: "nouser@mail.com",
                password: "irrelevant"
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });


})