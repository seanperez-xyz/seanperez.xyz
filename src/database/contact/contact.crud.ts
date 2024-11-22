import { eq } from 'drizzle-orm';
//
import { getDB } from '~/database';
import { contactTable } from './contact.schema';
import type { ContactId, ContactInput, ContactSelect } from './contact.types';

// Create a new contact
export async function createContact(input: ContactInput, db = getDB()): Promise<void> {
    await db.insert(contactTable).values(input).execute();
}

// Get a contact by ID
export async function getContactById(id: ContactId, db = getDB()): Promise<ContactSelect | null> {
    const result = await db.select().from(contactTable).where(eq(contactTable.id, id)).execute();
    return result.length > 0 ? result[0] : null;
}

// Get all contacts
export async function getAllContacts(db = getDB()): Promise<ContactSelect[]> {
    return await db.select().from(contactTable).execute();
}

// Update a contact by ID
export async function updateContact(id: ContactId, input: Partial<ContactInput>, db = getDB()): Promise<void> {
    await db.update(contactTable).set(input).where(eq(contactTable.id, id)).execute();
}

// Delete a contact by ID
export async function deleteContact(id: ContactId, db = getDB()): Promise<void> {
    await db.delete(contactTable).where(eq(contactTable.id, id)).execute();
}
