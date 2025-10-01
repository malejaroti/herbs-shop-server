import { type Request, type Response, type NextFunction, Router } from 'express';
import uploader from "../middleware/cloudinary.config";

const router = Router()

// POST "/api/upload"
router.post("/", uploader.single("image"), (req: Request, res: Response, next: NextFunction) => {
  console.log("file is: ", req.file);

  if (!req.file) {
    // this will happend if cloudinary rejects the image for any reason
    res.status(400).json({
      errorMessage: "There was a problem uploading the image. Check image format and size."
    })
    return;
  }

  // get the URL of the uploaded file and send it as a response.
  // 'imageUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend (response.data.imageUrl)

  res.json({ imageUrl: req.file.path });
});

const uploadRouter = router
export default uploadRouter