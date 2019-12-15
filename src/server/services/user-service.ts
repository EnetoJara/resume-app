import Bluebird from "bluebird";
import { CREATED, NO_CONTENT } from "http-status-codes";
import { Op } from "sequelize";
import { UserRegister } from "../../types/types";
import { DB } from "../models/index";
import { UserModel } from "../models/users";

/**
 * UserService class handles the logic needed to work with the users data.
 * @class
 * @public
 * @author Ernesto Jara Olveda
 */
export class UserService {
    /**
     * Creates an instance of user service.
     * @author Ernesto Jara Olveda
     * @param {DB} db
     */
    public constructor (private db: DB) {
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.save = this.save.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    /**
     * looks for a user wuth a given `email`
     * @public
     * @method {getUserByEmail}
     * @author Ernesto Jara Olveda
     * @memberof {UserService}
     * @param {string} email
     * @returns {Bluebird<UserModel | null>} user object incase the email exists
     */
    public getUserByEmail (email: string): Bluebird<UserModel | null> {
        return this.db.User.findOne({
            where: { email },
        }).then(saved => {
            return saved;
        });
    }

    /**
     * creates a new user or updates an existing one
     * @public
     * @method {getUserByEmail}
     * @author Ernesto Jara Olveda
     * @memberof {UserService}
     * @param {strin} email
     * @returns {number} returns 201 if the user is created and 204 if it was updated
     */
    public async save (user: UserRegister): Promise<number> {
        if (user.id !== undefined) {
            await this.db.User.update(user, {
                where: { [Op.and]: { id: user.id, email: user.email } },
            });
        }

        await this.db.User.create(user);
        return CREATED;

        return NO_CONTENT;
    }

    public getAllUsers (): Bluebird<{ rows: UserModel[]; count: number }> {
        return this.db.User.findAndCountAll({
            attributes: [
                "id",
                "name",
                "middleName",
                "lastName",
                "secondLastName",
            ],
        }).then(result => result);
    }
}
