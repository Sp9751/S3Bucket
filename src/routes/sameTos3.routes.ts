import fs from "fs";
import express, { Request, Response } from "express";
import { userAuthMiddleware } from "../middlewares/Auth.middleware";
import Path from "path";
import { upload } from "../middlewares/Multer.middleware";
import { fileUpload } from "../models/upload.model";
import { AuthRequest } from "../utils/all.intreface";

const router = express.Router();

router.post(
  "/createBucket",
  userAuthMiddleware,
  async (req: Request, res: Response) => {
    const folderName = req.body.foldername;
    if (!folderName) {
      return res.json({ status: 400, message: "Folder Name is Mandatory" });
    }

    const rootFolder = "rootFolder";
    const folderPath = `${rootFolder}/${folderName}`;

    try {
      if (fs.existsSync(rootFolder)) {
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
          return res.json({ status: 200, message: "Your Bucket Created" });
        }
      } else {
        fs.mkdirSync(rootFolder);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
          return res.json({ status: 200, message: "Your Bucket Created" });
        }
      }
      return res.json({ status: 200, message: "Bucket Already Exist" });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get(
  "/getAllBucket",
  userAuthMiddleware,
  async (req: Request, res: Response) => {
    const rootPath = Path.join("rootFolder");

    fs.readdir(rootPath, (err, files: string[]) => {
      const directories = files.filter((file) => {
        const filePath = Path.join(rootPath, file);
        return fs.statSync(filePath).isDirectory();
      });

      if (directories) {
        return res.json({ status: 200, success: directories });
      } else {
        return res.json({ status: 400, success: "Something is wrong" });
      }
    });
  }
);

router.post(
  "/uploadFile",
  userAuthMiddleware,
  upload().single("myfile"),
  async (req: AuthRequest, res: Response) => {
    if (req.file) {
      const { filename, destination, mimetype } = req.file;

      const fileFullPath = destination + filename;
      let uploadFile = await fileUpload.findOne({ fileFullPath });
      if (uploadFile) {
        return res.status(400).json({ message: "file already exist" });
      }
      uploadFile = new fileUpload({
        userId: req.user._id,
        filename: filename,
        mimeType: mimetype,
        path: fileFullPath,
      });
      await uploadFile.save();
      return res.json({ status: 200, success: "file uploaded successfully" });
    }
  }
);

router.get(
  "/getAllFiles",
  userAuthMiddleware,
  async (req: AuthRequest, res: Response) => {
    const bucketName = req.body.bucketName;
    if (!bucketName) {
      return res.status(400).json({ message: "Please provide bucket name" });
    }
    try {
      const directoryPath = `rootFolder/${bucketName}`;

      if (!fs.existsSync(directoryPath)) {
        return res.status(404).json({ message: "No such directory found" });
      }

      fs.readdir(directoryPath, (err: any, files: string[]) => {
        const allFiles = files.filter((file) => {
          const filePath = Path.join(directoryPath, file);
          return fs.statSync(filePath).isFile();
        });

        if (allFiles.length === 0) {
          return res.status(400).json({ message: "No Files Found" });
        }

        return res.status(200).json({ allfiles: allFiles });
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get(
  "/downloadFile/:folderName/:filename",
  async (req: AuthRequest, res: Response) => {
    const { folderName, filename } = req.params;
    const filePath = `rootFolder/${folderName}/${filename}`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);
  }
);

router.delete(
  "/deleteFileFromBucket",
  userAuthMiddleware,
  async (req: Request, res: Response) => {
    const { folderName, fileName } = req.body;
    if (!folderName) {
      return res.status(400).json({ message: "Folder Name is mandatory" });
    }
    if (!fileName) {
      return res.status(400).json({ message: "File Name is mandatory" });
    }

    // const rootFolder = "rootFolder";
    const filePath = `rootFolder/${folderName}/${fileName}`;

    try {
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.log(err);
        }
      });
      let file = await fileUpload.findOne({ path: filePath });
      if (!file) {
        return res.status(404).json({ message: "file not found" });
      }
      file.deleteOne({ path: filePath });
      return res.status(200).json({ message: "file deleted Successfull" });
    } catch (error) {
      console.log(error);
    }
  }
);

router.delete(
  "/bucketDelete",
  userAuthMiddleware,
  async (req: Request, res: Response) => {
    const { folderName } = req.body;
    if (!folderName) {
      return res.status(404).json({ message: "Folder Name is mandatory" });
    }

    try {
      const folderPath = `rootFolder/${folderName}`;
      if (fs.existsSync(folderPath)) {
        fs.rmdirSync(folderPath);
        return res.status(200).json({ message: "bucket delete successfully" });
      }
      return res.status(404).json({ message: "bucket not found" });
    } catch (error) {
      console.log(error);
    }
  }
);

export { router as bucketRouter };
