import Contact from "../models/contact.js";

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        
        if (contact===null) {
            return res.status(404).json({
                "message": "Not found"
            })           
        }
        res.status(200).json(contact);
       
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (deletedContact === null) {
                return res.status(404).json({
                    "message": "Not found"
                }
            )
        }
        
        res.status(200).json(deletedContact);
       
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

export const createContact = async (req, res) => {
    try {
        const contact = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            favorite: req.body.favorite
        };

        const newContact = await Contact.create(contact);
        if (newContact === null) {
            return res.status(404).json({
                "message": "Not found"
            }
            )
        }
        res.status(201).json(newContact);
    }
    catch (error) {
        res.status(500).json({
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
        const updatedContact = await Contact.findByIdAndUpdate(id, newContactInfo, {new:true});

        if (updatedContact === null) {
            return res.status(404).json({
                "message": "Not found"
            }
            );   
        }
        res.status(200).json(updatedContact);
        
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

export const updateStatusContact = async(req, res) => {
    try {
        const { id } = req.params;

        const newContactInfo = {
            ...req.body
        }
        const updatedContact = await Contact.findByIdAndUpdate(id, newContactInfo, {new:true});

        if (updatedContact === null) {
            return res.status(404).json({
                "message": "Not found"
            }
            );   
        }
        res.status(200).json(updatedContact);
        
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}