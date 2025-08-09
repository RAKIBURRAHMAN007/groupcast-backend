"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = require("./app/router");
const express_session_1 = __importDefault(require("express-session"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const routeNotFound_1 = require("./app/middlewares/routeNotFound");
const env_1 = require("./app/config/env");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: env_1.envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.set("trust proxy", 1);
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", router_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "welcome to ride sharing backend",
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(routeNotFound_1.routeNotFound);
exports.default = app;
