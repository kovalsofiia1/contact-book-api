import { contactsService } from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json({
            status: 'success',
            code: 200,
            data: { contacts },
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Internal Server Error',
        });
    }
};

export const getOneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contacts = await contactsService.getContactById(id);
        if (contacts) {
            return res.status(200).json({
                status: 'success',
                code: 200,
                data: { contacts },
            })
        }
        res.status(404).json({
            "message": "Not found"
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Internal Server Error',
        });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await contactsService.getContactById(id);
        if (deletedContact) {
            return res.status(200).json({
                status: 'success',
                code: 200,
                data: {
                    contact: deletedContact
                },
            })
        }
        res.status(404).json({
            "message": "Not found"
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Internal Server Error',
        });
    }
};

export const createContact = async (req, res) => {
    try {
        const newContact = await contactsService.addContact({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        });

        res.status(201).json({
            status: 'success',
            code: 201,
            data: {
                contact: newContact
            },
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Internal Server Error',
        });
    }
};

export const updateContact = async(req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                "message": "Body must have at least one field"
            })
        }

        const { id } = req.params;
        const newContactInfo = {
            ...req.body
        }
        const updatedContact = await contactsService.changeContact(id, newContactInfo);

        if (updatedContact) {
            return res.status(200).json({
                status: 'success',
                code: 200,
                data: {
                    contact: updatedContact
                },
            })
        }

        res.status(404).json({
            "message": "Not found"
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            code: 500,
            message: 'Internal Server Error',
        });
    }
};