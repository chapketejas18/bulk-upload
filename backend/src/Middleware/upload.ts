import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import os from "os";
import { UploadedFile } from "express-fileupload";

const tempUploadsFolder = path.join(os.tmpdir(), "uploads");
if (!fs.existsSync(tempUploadsFolder)) {
  fs.mkdirSync(tempUploadsFolder, { recursive: true });
}

interface CustomRequest extends Request {
  filePath?: string;
}

export const uploadCSV = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.files || !req.files.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  const file = req.files.file as UploadedFile;
  const filePath = path.join(tempUploadsFolder, file.name);

  file.mv(filePath, (err) => {
    if (err) {
      console.error("Error moving file:", err);
      res.status(500).send("Error uploading file.");
      return;
    }

    req.filePath = filePath;
    next();
  });
};
