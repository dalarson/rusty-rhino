import { IUserContext } from "./IUserContext";

export const defaultUserContext: IUserContext = {
    isAdmin: false,
<<<<<<< Updated upstream
    name: undefined,
    login: () => {
        return Promise.resolve();
=======
    userContext: defaultUserContext,
    login: async () => {
>>>>>>> Stashed changes
        // do nothing
    },
    logout: () => {
        // do nothing
    }
}