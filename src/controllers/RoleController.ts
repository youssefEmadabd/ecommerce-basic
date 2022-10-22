import Controller from './Controller';
import { Role } from '../models';
import { RoleService } from '../services';
import { IRole } from '../types';
import httpStatus from 'http-status';
import {
    RequestInterface as IReq,
} from '../types';
import { Response as IRes, NextFunction as INext } from 'express';
import ApiError from '../utils/ApiError';
const roleService = new RoleService(Role);

class RoleController extends Controller<IRole, RoleService> {
    async create(req: IReq, res: IRes) {
        if (req.user.role !== 'admin')
            throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to perform this action');
        super.create(req, res)
    }
    async update(req: IReq, res: IRes) {
        if (req.user.role !== 'admin')
            throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to perform this action');
        super.update(req, res)
    }
    async delete(req: IReq, res: IRes) {
        if (req.user.role !== 'admin')
            throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to perform this action');
        super.delete(req, res)
    }
}

export default new RoleController(roleService);