import { IUserContext } from "./IUserContext";

export const defaultUserContext: IUserContext = {
    isAdmin: false,
    name: undefined,
    login: () => {
        return Promise.resolve();
        // do nothing
    },
    logout: () => {
        // do nothing
    }
}