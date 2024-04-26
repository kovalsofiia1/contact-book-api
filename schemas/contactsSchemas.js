import Joi from "joi";

const contactSchema = Joi.object({
  name: Joi.string().required().min(2).max(20),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
});

const contactSchema2 = Joi.object({
  name: Joi.string().min(2).max(20),
  email: Joi.string().email(),
  phone: Joi.string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/),
});

export { contactSchema, contactSchema2 };