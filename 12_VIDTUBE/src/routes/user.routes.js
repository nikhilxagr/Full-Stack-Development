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
router.route('/login').post(loginUser);
router.route('/profile').get(verifyJWT, getUserProfile);
router.route('/channel/:username').get(verifyJWT, getUserChannelProfile);
router.route('/watch-history').get(verifyJWT, getWatchHistory);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").put(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-photo").patch(verifyJWT, upload.single("coverPhoto"), updateUserCoverPhoto);
router.route("/delete-account").delete(verifyJWT, deleteUserAccount);

export default router;