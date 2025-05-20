import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";


// users Table
export const UsersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull()
})

// todo table
export const TodoTable = pgTable("todos", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => UsersTable.id, { onDelete: "cascade" }),
    todoName: varchar("todo_name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    dueDate: timestamp("due_date"),
    description: text("description"),
    isCompleted: boolean("is_completed").default(false)
})

// Relationships
// users (1) - (n) todos
export const userRelations = relations(UsersTable, ({ many }) => ({
    todos: many(TodoTable),
}))

// todos (n) - (1) user
export const todoRelations = relations(TodoTable, ({ one }) => ({
    user: one(UsersTable, {
        fields: [TodoTable.userId],
        references: [UsersTable.id]
    }),
}));

// Infer Types
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;
export type TITodo = typeof TodoTable.$inferInsert;
export type TSTodo = typeof TodoTable.$inferSelect;