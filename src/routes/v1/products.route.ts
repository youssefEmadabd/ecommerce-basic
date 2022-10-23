import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { ProductController } from '../../controllers';

import auth from '../../middlewares/auth';

const router: Router = express.Router();

router.route('/:id')
    .get(asyncHandler(auth), asyncHandler(ProductController.get))
    .patch(asyncHandler(auth), asyncHandler(ProductController.update))
    .delete(asyncHandler(auth), asyncHandler(ProductController.delete));

router.post('/', asyncHandler(auth), asyncHandler(ProductController.create))
router.get('/',asyncHandler(auth), asyncHandler(ProductController.getAll))
router.post('/add/:id', asyncHandler(auth), asyncHandler(ProductController.addToCart))

export default router;