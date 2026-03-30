import { ICredentials } from "../header/login/ICredentials";
<<<<<<< Updated upstream
=======

export interface IUserContext {
    name: string | undefined;
}
>>>>>>> Stashed changes

export interface IUserContext {
    isAdmin: boolean;
<<<<<<< Updated upstream
    name: string | undefined;
    login: (credentials: ICredentials) => Promise<string | void>;
    logout: () => void;
    // maybe other stuff here eventually
=======
    userContext: IUserContext,
    getToken: () => string;
    login: (credentials: ICredentials) => Promise<void>,
    logout: () => void
>>>>>>> Stashed changes
}