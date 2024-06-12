"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const connectToDb_1 = require("./utils/connectToDb");
const customerRouter_1 = __importDefault(require("./Routes/customerRouter"));
const errorHandler_1 = __importDefault(require("./Middleware/errorHandler"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const PORT = process.env.PORT || 9000;
(0, connectToDb_1.connectToMongoDB)();
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 100 * 1024 * 1024 },
    // debug: true,
}));
app.use("/api", customerRouter_1.default);
app.use(errorHandler_1.default);
io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
});
server.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});
