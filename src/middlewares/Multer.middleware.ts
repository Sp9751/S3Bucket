import fs from "fs";
import multer from "multer";
import path from "path";
import { AuthRequest } from "../utils/all.intreface";

const upload = () => {
  const imageUpload = multer({
    storage: multer.diskStorage({
      destination: function (
        req: AuthRequest,
        file: any,
        cb: (arg0: null, arg1: string) => void
      ) {
        const folderName = req.query.foldername;
        const path = `rootFolder/${folderName}/`;
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
      },
      filename: function (
        req: AuthRequest,
        file: any,
        cb: (arg0: null, arg1: string) => void
      ) {
        cb(null, Date.now().toString() + path.extname(file.originalname));
      },
    }),
    limits: { fileSize: 10000000000000 },
    fileFilter(req, file, callback) {
      callback(null, true);
    },
  });
  return imageUpload;
};

export { upload };
