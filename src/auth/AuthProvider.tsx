import { useState } from "react"
import { AuthContext } from "./AuthContext"
import { ICredentials } from "../header/login/ICredentials";
import { temporaryCredentials } from "../header/login/TemporaryCredentials";

export interface IAuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = (props: IAuthProviderProps) => {
    // check whether the user is authenticated
    const [isAdmin, setIsAdmin] = useState(true);
    const [name, setName] = useState<string | undefined>("David");
    const login = (credentials: ICredentials) => {
        return new Promise<void>((resolve, reject) => {
            if (credentials.username === temporaryCredentials.username && credentials.password === temporaryCredentials.password) {
                setTimeout(() => {
                    setIsAdmin(true);
                    setName(credentials.username);
                    resolve();
                }, 1000)
            } else {
                reject("Invalid credentials");
            }
        })
    }

    const logout = () => {
        setIsAdmin(false);
        setName(undefined);
    }
    return <AuthContext.Provider value={{ isAdmin, name, login, logout }} >{props.children}</AuthContext.Provider>
}

