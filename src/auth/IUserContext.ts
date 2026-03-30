import { ICredentials } from "../header/login/ICredentials";

export interface IUserContext {
    isAdmin: boolean;
    name: string | undefined;
    getToken: () => string;
    login: (credentials: ICredentials) => Promise<void>;
    logout: () => void;
}