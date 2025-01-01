import { IUserContext } from "./IUserContext";

export const defaultUserContext: IUserContext = {
    isAdmin: false,
    name: undefined,
    login: () => {
        // do nothing
    },
    logout: () => {
        // do nothing
    }
}