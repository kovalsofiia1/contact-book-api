import User from "../models/user.js";
import * as bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import * as fs from "node:fs/promises";
import path from "node:path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { sendEmail } from "../helpers/mail.js";


const SECRET = process.env.SECRET;

const validPassword = async(password, encrypted) => {
    return await bcrypt.compare(password, encrypted);
}

const encryptPassword = async(password) => {
    return await bcrypt.hash(password, 6);
}

export const handleRegister = async(req, res, next) => {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: lowerCaseEmail });

    if (userExists !==null ) {
        return res.status(409).json({
            message: 'Email in use',
        });
    }

    try {

        const hashedPassword = await encryptPassword(password);
        const avatar = gravatar.url(email);
        console.log(avatar);

        const verifyToken = sendVerificationEmail(lowerCaseEmail);

        const newUser = await User.create({
            email: lowerCaseEmail,
            password: hashedPassword,
            avatarURL: avatar,
            verificationToken: verifyToken,
        });

        res.status(201).json({
            "user": {
                email: lowerCaseEmail,
                subscription: "starter"
            }
        });
    }
    catch (error) {
        next(error);
    }
}

export const handleLogin = async(req, res, next) => {
    const {email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase()
    const user = await User.findOne({ email: lowerCaseEmail });

    console.log(user);

    if (user === null) {
        return res.status(401).json({
            "message": "Email or password is wrong"
        });
    }

    if (user.verify === false) {
        return res.status(400).json({
            "message": "Please verify your email"
        });
    }

    try {
        const correctPassword = await validPassword(password, user.password);

        if (!correctPassword) {
            return res.status(401).json({
                "message": "Email or password is wrong"
            })
        }
        const payload = {
            id: user._id,
            email: lowerCaseEmail
        }

        const token = jwt.sign(payload, SECRET, { expiresIn: '1w' });
        
        await User.findByIdAndUpdate(user._id, { token });

        res.status(200).json({
            token,
            "user": {
                email: lowerCaseEmail,
                "subscription": "starter"
            }
        });
    }
    catch (error) {
        next(error);
    }
}

export const handleLogout = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { token: null })
        
        if (!user) {
            return res.status(401).json({
                "message": "Not authorized"
            })
        }

        res.status(204).end();

    }
    catch (error) {
        next(error);
    }
}

export const handleGetCurrent = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(401).json({
                message: "Not authorized"
            })
        }

        res.status(200).json({
            email: user.email,
            subscription: user.subscription
        })

    }
    catch (error) {
        next(error)
    }
}

export const handleSubscription = async(req, res, next) => {
    try {
        const { subscription } = req.body;
        const { id } = req.user;

        const user = await User.findByIdAndUpdate(id, { subscription: subscription }, {new: true});
        
        if (!user) {
            return res.status(401).json({
                "message": "Not authorized"
            })
        }
        
        res.status(200).json({
            user: user.email,
            subscription: user.subscription
        })

    }
    catch (error) {
        next(error);
    }
}


export const handleAvatarChange = async (req, res, next) => {
    try {
        const img = await Jimp.read(req.file.path);
        await img.cover(250, 250).writeAsync(req.file.path);

        console.log('jimp')
        await fs.rename(req.file.path, path.resolve('public', 'avatars', req.file.filename));

        const newUser = await User.findByIdAndUpdate(req.user.id, { avatarURL: `/avatars/${req.file.filename}` }, {new: true});
        
        console.log(newUser);
        if (!newUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            avatarURL: newUser.avatarURL
        })
    }
    catch (error) {
        return next(error);
    }
}

export const handleVerify = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        console.log(verificationToken);
        const user = await User.findOneAndUpdate({ verificationToken }, {verificationToken: null, verify:true}, { new: true });
        User.findOneAndUpdate()
        if (!user) {
            return res.status(404).json({
                "message": "Not found"
            })
        }
        res.status(200).json({
            "message": 'Verification successful'
        })

    }
    catch (error) {
        next(error);
    }
}


export const handleNewVerify = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                "message":"Missing required field email"
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        
        if (user.verify) {
            return res.status(400).json({
                "message":"Verification has already been passed"
            })
        }

        const verificationToken = sendVerificationEmail(email);

        await User.findOneAndUpdate({ email }, { verificationToken });

        res.status(200).json({
            "message": "Verification email sent"
        })

    }
    catch (error) {
        next(error);
    }
}

const sendVerificationEmail = (email) => {
        
    const verifyToken = crypto.randomUUID();

    const message = {
        to: email,
        from: 'sofiiakoval5555@gmail.com',
        subject: 'It`s Your Personal Contact Book!',
        html: `<h1>Verification letter</h1> <h2>To verify your email follow the link: <a href="http://localhost:3000/users/verify/${verifyToken}">verify email</a></h2>`,
        text:`Verification letter. To verify your email follow the link: http://localhost:3000/users/verify/${verifyToken}`
    }

    sendEmail(message);
    return verifyToken;

    
}