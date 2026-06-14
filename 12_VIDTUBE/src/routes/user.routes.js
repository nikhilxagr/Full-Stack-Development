import { Router } from 'express';
import { healthcheck } from '../controllers/healthcheck.controllers.js';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';


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

export default router;