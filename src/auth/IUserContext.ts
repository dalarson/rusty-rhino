export interface IUserContext {
    isAdmin: boolean;
    name: string | undefined;
    login: () => void;
    logout: () => void;
    // maybe other stuff here eventually
}