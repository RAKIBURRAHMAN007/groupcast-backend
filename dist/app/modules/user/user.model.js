"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(user_interface_1.UserRole),
        default: user_interface_1.UserRole.RIDER,
    },
    name: { type: String, required: true },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    auths: [authProviderSchema],
}, { timestamps: true, versionKey: false });
exports.User = (0, mongoose_1.model)("User", userSchema);
