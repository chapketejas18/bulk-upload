import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectToMongoDB } from "./utils/connectToDb";
import customerRouter from "./Routes/customerRouter";
import errorHandler from "./Middleware/errorHandler";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";
import specs from "./swagger";
dotenv.config();

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 9000;

connectToMongoDB();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 100 * 1024 * 1024 },
    // debug: true,
  })
);

app.use("/api", customerRouter);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
