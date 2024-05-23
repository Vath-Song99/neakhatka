"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const proxy_1 = __importDefault(require("./middleware/proxy"));
const rate_limits_1 = require("./middleware/rate-limits");
const cookie_session_1 = __importDefault(require("cookie-session"));
const hpp_1 = __importDefault(require("hpp"));
const compression_1 = __importDefault(require("compression"));
const logger_1 = require("./utils/logger");
const consts_1 = require("./utils/consts");
const error_handle_1 = require("./middleware/error-handle");
// import { RegisterRoutes } from "./routes/routes";
const createCofig_1 = __importDefault(require("./utils/createCofig"));
const auth_middleware_1 = require("./middleware/auth-middleware");
const unless_route_1 = __importDefault(require("./middleware/unless-route"));
const app = (0, express_1.default)();
const config = (0, createCofig_1.default)();
// ===================
// Security Middleware
// ===================
app.set("trust proxy", 1);
app.use((0, compression_1.default)());
app.use((0, cookie_session_1.default)(Object.assign({ name: "session", keys: [`${config.cookieSecretKeyOne}`, `${config.cookieSecretKeyTwo}`], maxAge: 24 * 7 * 3600000, secure: config.env !== "development" }, (config.env !== 'development' && {
    sameSite: 'none'
}))));
// Prevent HTTP Parameter Pollution attacks
app.use((0, hpp_1.default)());
// Prevent Some Security:
// - Stops browsers from sharing your site's vistor data
// - Stops your website from being displayed in a frame
// - Prevent XSS, etc.
app.use((0, helmet_1.default)());
// Only Allow Specific Origin to Access API Gateway (Frontend)
app.use((0, cors_1.default)({
    origin: (0, createCofig_1.default)().env === 'development' ? '*' : [config.clientUrl],
    credentials: true, // attach token from client
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Apply Limit Request
(0, rate_limits_1.applyRateLimit)(app);
// Hide Express Server Information
app.disable("x-powered-by");
// ===================
// Gateway Health Routes
// ===================
// RegisterRoutes(app);
// ===================
// JWT Middleware
// ===================
app.use((0, unless_route_1.default)('/v1/auth', auth_middleware_1.verifyUser));
// ===================
// Proxy Routes
// ===================
(0, proxy_1.default)(app);
// ====================
// Global Error Handler
// ====================
app.use("*", (req, res, _next) => {
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    logger_1.logger.error(`${fullUrl} endpoint does not exist`);
    res
        .status(consts_1.StatusCode.NotFound)
        .json({ message: "The endpoint called does not exist." });
});
app.use(error_handle_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map