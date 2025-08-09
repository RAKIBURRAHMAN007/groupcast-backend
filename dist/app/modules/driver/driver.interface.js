"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentType = exports.DriverStatus = void 0;
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["PENDING"] = "PENDING";
    DriverStatus["APPROVED"] = "APPROVED";
    DriverStatus["SUSPENDED"] = "SUSPENDED";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
var DocumentType;
(function (DocumentType) {
    DocumentType["LICENSE"] = "license";
    DocumentType["REGISTRATION"] = "registration";
    DocumentType["INSURANCE"] = "insurance";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
