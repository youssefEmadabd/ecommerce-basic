import httpStatus from 'http-status';
import { Document, FilterQuery, Model as MongooseModel } from 'mongoose';
import autoBind from 'auto-bind';

import ApiError from '../utils/ApiError';
import { ServiceOptions, Documents } from '../types';

export default class Service<IModel extends Document> {
    model: MongooseModel<IModel>;
    constructor(model: MongooseModel<IModel>) {
        this.model = model;
        autoBind(this);
    }

    /**
   * Create a new document
   * @param {object} body - To be created document body
   * @returns {Promise<object>} Created document
   */
    async create(body: object): Promise<IModel> {
        const Model = this.model;
        const document = await new Model(body).save();
        return document;
    }

    /**
     * Get a document by id
     * @param {FilterQuery<IModel>} filter - Mongo filter body
     * @param {object} options - Query options
     * @param {object} [options.populate] - Mongoose population object
     * @param {string} [options.select] - Mongoose projection string
     * @returns {Promise<object>} Found document
     */
    async get(
        filter: FilterQuery<IModel>,
        options: ServiceOptions = { sort: '', limit: 0, page: 0 },
    ): Promise<IModel> {
        const document: IModel = await this.model
            .findOne(filter)
            .populate(options.populate)
            .select(options.select)
            .lean({ virtuals: true });
        return document;
    }

    /**
     * Get a document by id
     * @param {FilterQuery<IModel>} filter - Mongo filter body
     * @param {object} updateBody - body
     * @param {object} [options] - Mongoose options
     * @returns {Promise<object>} Found document
     */
    async update(
        filter: FilterQuery<IModel>,
        updateBody: object,
        options: object = { new: true },
    ): Promise<IModel> {
        const Model = this.model;
        const document: IModel = await Model.findOneAndUpdate(
            filter,
            updateBody,
            options,
        ).lean({ virtuals: true });
        if (!document)
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `${Model.modelName} not found`,
            );
        return document;
    }

    /**
     * 
     * @param {FilterQuery<IModel>} filter - delete filter
     * @returns {Promise<object>} Found document
     */
    async delete(filter: FilterQuery<IModel>): Promise<IModel> {
        const Model = this.model;
        const document: IModel = await Model.findOneAndDelete(filter).lean({
            virtuals: true,
        });
        if (!document)
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `${Model.modelName} not found`,
            );
        return document;
    }
}