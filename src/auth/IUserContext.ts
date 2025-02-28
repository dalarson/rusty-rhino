import { ICredentials } from "../Header/Login/ICredentials";

export interface IUserContext {
    isAdmin: boolean;
    name: string | undefined;
    login: (credentials: ICredentials) => Promise<string | void>;
    logout: () => void;
    // maybe other stuff here eventually
}