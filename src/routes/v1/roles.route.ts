import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { RoleController } from '../../controllers';

import auth from '../../middlewares/auth';

const router: Router = express.Router();

router.route('/')
.post(asyncHandler(auth), asyncHandler(RoleController.create))
.get(asyncHandler(auth), asyncHandler(RoleController.get))
.patch(asyncHandler(auth), asyncHandler(RoleController.update))
.delete(asyncHandler(auth), asyncHandler(RoleController.delete));

export default router;