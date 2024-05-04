import Joi from "joi";

const contactSchema = Joi.object({
  name: Joi.string().required().min(2).max(20),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
  favorite: Joi.boolean(),
  },
);

const contactSchema2 = Joi.object({
  name: Joi.string().min(2).max(20),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
  favorite: Joi.boolean(),
  },
);

const contactSchema3 = Joi.object({
    favorite: Joi.boolean().required(),
  },
);

export { contactSchema, contactSchema2, contactSchema3 };