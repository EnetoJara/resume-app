import { isAlpha, isAlphanumeric, isEmail, isEmpty, isLength } from "validator";
import { JwtError, LoginCredentials, UserRegister } from "../../types/types";
import { logger } from "./logger";

/**
 * @description Validates login
 * @author Ernesto Jara Olveda
 * @param {LoginCredentials} credentials
 * @returns {Array} array of errors found
 */
export function validateLogin (credentials: LoginCredentials) {
    logger.info("validateLogin");
    const errors: any = [];

    const { email = "", password = "" } = credentials;

    if (isEmpty(email)) {
        errors.push({ email: "email is required" });
    } else if (!isEmail(email)) {
        errors.push({ email: "please provide a valid email" });
    }

    if (isEmpty(password)) {
        errors.push({ password: "password is required" });
    } else if (!isLength(password, { min: 5, max: 15 })) {
        errors.push({ password: "passwords must be from 5 to 15 characters" });
    }

    return errors;
}
/**
 * validates if the client input to save a new user is valid
 * @param {UserRegister} user User Model
 * @returns {Array} array of errors found
 */
export function validateUserRegistration (user: UserRegister) {
    const errors: any = [];

    const {
        email = "",
        password = "",
        password2 = "",
        name = "",
        middleName = "",
        lastName = "",
        secondLastName = "",
    } = user;

    if (isEmpty(email)) {
        errors.push({ email: "email is required", code: 1 });
    } else if (!isEmail(email)) {
        errors.push({ email: "invalid format", code: 2 });
    }

    if (isEmpty(password)) {
        errors.push({ password: "password is required" });
    } else if (!isLength(password, { min: 5, max: 15 })) {
        errors.push({
            password: "password should be from 5 to 15 characters long",
        });
    } else if (!isAlphanumeric(password)) {
        errors.push({ password: "password should be alphanumeric" });
    } else if (password !== password2) {
        errors.push({ password2: "passwords  must match" });
    }

    if (isEmpty(name)) {
        errors.push({ name: "name is Required" });
    } else if (!isAlpha(name)) {
        errors.push({
            name: "is you a rotob, how come you dont have an standard name",
        });
    } else if (!isLength(name, { min: 1, max: 50 })) {
        errors.push({ name: "name must be less than 50 chars" });
    }

    if (!isEmpty(middleName) && !isAlpha(middleName)) {
        errors.push({
            middleName: "middlename should be valid",
        });
    } else if (
        !isEmpty(middleName) &&
        !isLength(middleName, { min: 1, max: 50 })
    ) {
        errors.push({
            middleName: "middlename should not be greater than 50 characters",
        });
    }

    if (isEmpty(lastName)) {
        errors.push({ lastName: "lastName is Required" });
    } else if (!isAlpha(lastName)) {
        errors.push({
            lastName:
                "is you a rotob, how come you dont have an standard lastName",
        });
    } else if (!isLength(lastName, { min: 1, max: 50 })) {
        errors.push({ lastName: "name must be less than 50 chars" });
    }

    if (!isEmpty(secondLastName) && !isAlpha(secondLastName)) {
        errors.push({
            secondLastName:
                "is you a rotob, how come you dont have an standard lastName",
        });
    } else if (
        !isEmpty(secondLastName) &&
        !isLength(secondLastName, { min: 1, max: 50 })
    ) {
        errors.push({ secondLastName: "must be less than 50 chars" });
    }

    return errors;
}

/**
 * @description Determines whether token expired
 * @author Ernesto Jara Olveda
 * @param {JwtError} error
 * @returns {boolean} true if token died
 */
export function isTokenExpired (error: JwtError) {
    return error && error.name && error.name === "TokenExpiredError";
}

/**
 * function that validates if the input sended from the client is really a number
 * @param {number} param numeric value
 * @return {boolean} `true` if the input is number
 */
export function isNumber (param: any): boolean {
    return Number(param) === Number(param);
}

/**
 * Removes empty properties from a given object
 * @author Ernesto Jara Olveda
 * @param {object} obj
 * @returns {object} empty
 */
export function removeEmpty (obj: object): any {
    return Object.keys(obj)
        .filter((key: string) => !isEmpty(obj[key]))
        .reduce((newObject, key: string) => {
            if (typeof obj[key] === "object") {
                return { ...newObject, [key]: removeEmpty(obj[key]) };
            }
            return { ...newObject, [key]: obj[key] };
        }, {});
}
