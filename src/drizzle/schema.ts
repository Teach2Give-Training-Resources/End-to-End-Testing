import { relations } from "drizzle-orm";
import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";


// Role Enum
export const RoleEnum = pgEnum("role", ["admin", "user"])

// User Table
export const UsersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: RoleEnum("role").default("user"),
    isVerified: boolean("is_verified").default(false),
    verificationCode: varchar("verification_code", { length: 10 })
})

// Todo Table
export const TodoTable = pgTable("todos", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => UsersTable.id, { onDelete: 'cascade' }),
    todoName: varchar("todo_name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    dueDate: timestamp("due_date"),
    description: text("description"),
    isCompleted: boolean("is_completed").default(false)
})

// Relationships
// users (1) - (n) todos

export const UserRelations = relations(UsersTable, ({ many }) => ({
    todo: many(TodoTable)
}))

// todos (n) - (1) user
export const TodoRelations = relations(TodoTable, ({ one }) => ({
    user: one(UsersTable, {
        fields: [TodoTable.userId],
        references: [UsersTable.id]
    })
}))

// infer types
export type TIUser = typeof UsersTable.$inferInsert
export type TSUser = typeof UsersTable.$inferSelect
export type TITodo = typeof TodoTable.$inferInsert
export type TSTodo = typeof TodoTable.$inferSelect
