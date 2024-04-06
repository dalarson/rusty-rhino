import { AuthContext } from "./AuthContext"

export interface IAuthProviderProps {
    children: React.ReactNode;

}

export const AuthProvider = (props: IAuthProviderProps) => {
    // check whether the user is authenticated
    const isAdmin = false;
    return <AuthContext.Provider value={{isAdmin: isAdmin}} >{props.children}</AuthContext.Provider>
}