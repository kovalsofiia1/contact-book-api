import * as fs from 'node:fs/promises';
import path from 'node:path';
import crypto from "node:crypto";

const contactsPath = path.resolve('db', 'contacts.json');


async function readFile(filePath) {
   const data = await fs.readFile(filePath)
    return JSON.parse(data);
}

function writeFile(filePath, data) {
  return fs.writeFile(filePath, JSON.stringify(data, undefined, 2));  
}

async function listContacts() {
  // Повертає масив контактів.
  const contacts = await readFile(contactsPath);
  return contacts;
}

async function getContactById(contactId) {
  // Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (contact === undefined) {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  // Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
  const contacts = await listContacts();
  const contact = await getContactById(contactId);

  if (contact === undefined) {
    return null;
  }
  const newContactList = contacts.filter((oneContact) => oneContact.id !== contactId);
  await writeFile(contactsPath, newContactList);
  return contact;
}

async function addContact({ name, email, phone }) {
  // Повертає об'єкт доданого контакту (з id).
  const contacts = await listContacts();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email, 
    phone
  }
  contacts.push(newContact);
  await writeFile(contactsPath, contacts);
  return newContact;
}

async function changeContact(id, newContactInfo) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((el) => el.id === id);

  if (contactIndex === -1) {
    return null;
  }

  const updatedContact = {
    ...contacts[contactIndex],
    ...newContactInfo,
  };

  // Update the contact in the list
  const updatedContacts = [
    ...contacts.slice(0, contactIndex),
    updatedContact,
    ...contacts.slice(contactIndex+1),
  ];

  await writeFile(contactsPath, updatedContacts);

  return updatedContact;
}

export const contactsService = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    changeContact
}
