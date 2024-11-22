import type { contactTable } from "./contact.schema"

export type ContactInput = typeof contactTable.$inferInsert
export type ContactSelect = typeof contactTable.$inferSelect

export type ContactId = ContactSelect["id"]