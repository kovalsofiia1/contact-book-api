import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact
} from "../controllers/contactsControllers.js";
import {
  contactSchema,
  contactSchema2,
  contactSchema3
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(contactSchema));

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", validateBody(contactSchema2));

contactsRouter.put("/:id", updateContact);

contactsRouter.patch("/:id/favorite", validateBody(contactSchema3));

contactsRouter.patch("/:id/favorite", updateStatusContact)

export default contactsRouter;