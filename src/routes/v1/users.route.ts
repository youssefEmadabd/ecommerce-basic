import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { UserController } from '../../controllers';

import auth from '../../middlewares/auth';

const router: Router = express.Router();

router.route('/')
    .get(asyncHandler(auth), asyncHandler(UserController.get))
    .patch(asyncHandler(auth), asyncHandler(UserController.update))

router.post('/login', asyncHandler(UserController.login));
router.post('/register/:role', asyncHandler(UserController.register));

export default router;