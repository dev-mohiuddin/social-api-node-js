import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName =
            file.originalname
                .replace(fileExt, "")
                .toLowerCase()
                .split(" ")
                .join("-") + "-" + Date.now();

        cb(null, fileName + fileExt);
    },
});

const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true)
    } else {
        callback(new Error("only images is allow"))
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: isImage,
});