import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Define the contacts table schema
export const contactTable = sqliteTable('contacts', {
    id: integer('id').primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    subject: text('subject').notNull(),
    text: text('text').notNull(),
    readAt: integer('read_at', { mode: "timestamp_ms" }),
    createdAt: integer('created_at', { mode: "timestamp_ms" }).default(sql`(unixepoch() * 1000)`),
});