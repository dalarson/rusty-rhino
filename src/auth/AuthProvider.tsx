import { useState } from "react"
import { AuthContext } from "./AuthContext"

export interface IAuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = (props: IAuthProviderProps) => {
    // check whether the user is authenticated
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState<string | undefined>(undefined);
    const login = () => {
        console.log("Logging in");
        setIsAdmin(true);
        setName("Admin");
    }
    const logout = () => {
        console.log("Logging out");
        setIsAdmin(false);
        setName(undefined);
    }
    return <AuthContext.Provider value={{ isAdmin, name, login, logout }} >{props.children}</AuthContext.Provider>
}

