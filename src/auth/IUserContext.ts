export interface IUserContext {
    name: string | undefined;
    // maybe other stuff here eventually
}

export interface AuthContext {
    isAdmin: boolean;
    userContext: IUserContext,
    getToken: () => string;
    login: () => void,
    logout: () => void
}