"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRECT_KEY;
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "Authentication failed. Token is missing." });
        return;
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        res
            .status(401)
            .json({ error: "Authentication failed. Invalid token format." });
        return;
    }
    try {
        jwt.verify(token, secretKey);
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Authentication failed. Invalid token." });
    }
};
exports.default = authenticate;
