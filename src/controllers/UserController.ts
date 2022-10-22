
import { Response as IRes, NextFunction as INext } from 'express';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Controller from './Controller';
import { User, Role } from '../models';
import { UserService, RoleService } from '../services';
import { IUser, IRole } from '../types';
import {
    RequestInterface as IReq,
} from '../types';

import ApiError from '../utils/ApiError';
import { config } from '../config/config';

const userService = new UserService(User);
const roleService = new RoleService(Role);


class UserController extends Controller<IUser, UserService> {
    async get(req: IReq, res: IRes): Promise<void> {
        try {
            const id = req.user.sub;
            const filter: object = { _id: id };
            const options: object = { populate: ['role', 'cart'] }
            const result = await this.service.get(filter, options);
            if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
            res.status(httpStatus.ACCEPTED).send({ ...result, found: true });
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }
    async login(req: IReq, res: IRes, next: INext) {
        const { username, password } = req.body;
        const user: IUser = (await this.service.get({
            username
        }, { populate: 'role' }))

        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');

        const passwordMatch = await bcrypt.compare(`${password}`, user.password);
        if (!passwordMatch) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Credentials")
        }
        const token = await jwt.sign({ sub: user._id, role: user.role.role }, config.jwt.secret, {
            expiresIn: '1h',
        });
        res.status(httpStatus.ACCEPTED).send({
            token,
        });
    }
    async register(req: IReq, res: IRes, next: INext): Promise<void> {
        const { username, password } = req.body;
        const checkUsername = await this.service.isUsernameUnique(username);
        if (!checkUsername) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Username already exists');
        }
        const { role } = req.params;
        const checkRole: IRole = await roleService.get({ role: role });
        if (!checkRole) throw new ApiError(httpStatus.BAD_REQUEST, 'Role not found');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.service.create({
            username,
            password: hashedPassword,
            role: checkRole._id,
        });
        const token = await jwt.sign({ sub: user._id, role: role }, config.jwt.secret, {
            expiresIn: '1h',
        });
        res.status(httpStatus.CREATED).send({ ...user, token });
    }
}

export default new UserController(userService);