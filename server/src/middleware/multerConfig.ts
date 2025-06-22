//server/src/middleware/multerConfig.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = 'public/uploads';

fs.mkdirSync(uploadDir,{ recursive: true});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
        const fileExtension = path.extname(file.originalname);
        callback(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith('image/')){
            cb(null, true);
        }else{
            cb(new Error("Not an image! Please uploade an image file."));
        }
    }
});

export default upload;