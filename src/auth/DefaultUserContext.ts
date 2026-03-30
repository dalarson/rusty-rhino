import { IUserContext } from "./IUserContext";

export const defaultUserContext: IUserContext = {
    isAdmin: false,
    name: undefined,
    login: async () => {
        // do nothing
    },
    logout: () => {
        // do nothing
    },
    getToken: () => ""
}