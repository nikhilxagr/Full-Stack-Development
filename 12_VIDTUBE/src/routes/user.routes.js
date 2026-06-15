import { Router } from 'express';
import { healthcheck } from '../controllers/healthcheck.controllers.js';
import { registerUser, loginUser } from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import {verifyJWT} from '../middleware/jwt.middleware.js';



const router = Router();
router.get('/healthcheck', healthcheck);

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverPhoto",
            maxCount: 1
        }
    ]),
    registerUser
);

// secured route
router.route("/logout").post(verifyJWT, logoutUser);

export default router;