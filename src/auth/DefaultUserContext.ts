import { AuthContext, IUserContext } from "./IUserContext";

export const defaultUserContext: IUserContext = {
    name: undefined,
}

export const defaultAuthContext: AuthContext = {
    isAdmin: false,
    userContext: defaultUserContext,
    login: () => {
        return Promise.resolve();
        // do nothing
    },
    logout: () => {
        // do nothing
    },
    getToken: () => ""
}