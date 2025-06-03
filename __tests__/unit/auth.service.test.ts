import { createUserService, userLoginService } from "../../src/auth/auth.service";
import db from "../../src/drizzle/db";


jest.mock("../../src/drizzle/db", () => ({ // used to mock the database module
    insert: jest.fn(() => ({ // mock the insert method
        values: jest.fn().mockReturnThis(), //mockReturnThis() is used to return the same object, allowing for method chaining - in simple terms, it allows us to call the next method in the chain, the next method in our case is returning the values method
    })),
    query: {
        UsersTable: {
            findFirst: jest.fn(),
        }
    }
}));

describe("Auth Service", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test- helps to avoid state leakage between tests
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
            const mockUser = { id: 1, firstName: 'Test', lastName: 'User', email: 'test@mail.com', password: 'hashed' }; // mock user data, used to simulate a user found in the database
            (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockUser); // mockResolvedValueOnce means that the next call to this function will return mockUser

            const result = await userLoginService({ email: 'test@mail.com' } as any); // as any is used to bypass TypeScript type checking for this test
            expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });

        it('should return null if user not found', async () => {
            (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null); // mockResolvedValueOnce means that the next call to this function will return null

            const result = await userLoginService({ email: 'notfound@mail.com' } as any);
            expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });
});