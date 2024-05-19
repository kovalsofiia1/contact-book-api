import express from "express";
import { registerSchema, changeUserSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import {
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetCurrent,
    handleSubscription,
    handleAvatarChange
} from "../controllers/usersControllers.js";

import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post('/register', validateBody(registerSchema), handleRegister);

router.post('/login', validateBody(registerSchema), handleLogin);

router.post('/logout', auth, handleLogout);

router.get('/current', auth, handleGetCurrent);

router.patch('/', auth, validateBody(changeUserSchema), handleSubscription);

router.patch('/avatars', auth, upload.single("avatar"), handleAvatarChange);

export default router;
