import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { OrderController } from '../../controllers';

import auth from '../../middlewares/auth';

const router: Router = express.Router();

router.route('/')
    .post(asyncHandler(auth), asyncHandler(OrderController.create))
    .get(asyncHandler(auth), asyncHandler(OrderController.get))
    .patch(asyncHandler(auth), asyncHandler(OrderController.update))
    .delete(asyncHandler(auth), asyncHandler(OrderController.delete));

router.get('/response', asyncHandler(OrderController.handleResponse))
router.post('/buy/:productId', asyncHandler(auth), asyncHandler(OrderController.placeOrder));
router.post('/callback', asyncHandler(OrderController.callback))

export default router;