import Joi from "joi";

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

const changeUserSchema = Joi.object({
    subscription: Joi.string().valid('starter','pro', 'business').required()
})

export {
    registerSchema,
    changeUserSchema
}