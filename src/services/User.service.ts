import { IUser } from "../types";
import Service from "./Service";

export default class UserService extends Service<IUser> {

    async isUsernameUnique(username: string): Promise<boolean> {
        const Model = this.model;
        const user: IUser = await Model.findOne({ username });
        if (user) {
            return false;
        }
        return true;
    }

}