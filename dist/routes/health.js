"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = __importDefault(require("../controllers/health"));
const router = (0, express_1.Router)();
router.get('/', health_1.default.checkHealth);
exports.default = router;
//# sourceMappingURL=health.js.map