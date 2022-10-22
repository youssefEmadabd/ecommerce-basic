import express, { Router } from 'express';

import usersRoute from './users.route';
import productsRoute from './products.route';
import rolesRoute from './roles.route';
import ordersRoute from './orders.route';

const router: Router = express.Router();

router.use('/users', usersRoute);
router.use('/products', productsRoute);
router.use('/roles', rolesRoute);
router.use('/orders', ordersRoute)

export default router;
