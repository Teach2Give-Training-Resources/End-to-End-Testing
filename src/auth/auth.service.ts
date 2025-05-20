import { TIUser, TSUser, UsersTable } from "../drizzle/schema"
import db from "../drizzle/db"
import { sql } from "drizzle-orm"

export const createUserService = async (user: TIUser): Promise<string | null> => {
    await db.insert(UsersTable).values(user)
    return "User Created Successfully";
}

export const userLoginService = async (user: TSUser) => {
    const { email } = user;
    return await db.query.UsersTable.findFirst({
        columns: {
            firstName: true,
            lastName: true,
            id: true,
            email: true,
            password: true
        }, where: sql`${UsersTable.email} = ${email}`
    })
}
