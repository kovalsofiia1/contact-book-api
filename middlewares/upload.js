import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve('tmp'));
    },
    filename(req, file, cb) {
        const extension = path.extname(file.originalname);
        const filename = path.basename(file.originalname, extension);
        const suffix = crypto.randomUUID();
        cb(null, `${filename}--${suffix}${extension}`);
    }
})

const upload = multer(
    {
        storage: storage,
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed'))
            }
            cb(null, true)
        }
     });

export default upload ;