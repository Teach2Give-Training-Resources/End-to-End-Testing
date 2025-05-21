import { createUserService, userLoginService } from "../../src/auth/auth.service";
import db from "../../src/drizzle/db";


jest.mock("../../src/drizzle/db", () => ({
    insert: jest.fn(() => ({
        values: jest.fn().mockReturnThis(),
    })),
    query: {
        UsersTable: {
            findFirst: jest.fn(),
        }
    }
}));

describe("Auth Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createUserService", () => {
        it('should insert a user and return success message', async () => {
            const user = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@mail.com',
                password: 'hashed'
            };
            const result = await createUserService(user);
            expect(db.insert).toHaveBeenCalled();
            expect(result).toBe('User Created Successfully');
        })
    })

    describe('userLoginService', () => {
        it('should return user data if found', async () => {
            const mockUser = { id: 1, firstName: 'Test', lastName: 'User', email: 'test@mail.com', password: 'hashed' };
            (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser);

            const result = await userLoginService({ email: 'test@mail.com' } as any);
            expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });

        it('should return null if user not found', async () => {
            (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

            const result = await userLoginService({ email: 'notfound@mail.com' } as any);
            expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });
});