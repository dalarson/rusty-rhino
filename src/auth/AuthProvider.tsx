<<<<<<< Updated upstream
import { useState } from "react"
import { AuthContext } from "./AuthContext"
import { ICredentials } from "../header/login/ICredentials";
import { temporaryCredentials } from "../header/login/TemporaryCredentials";
=======
import { useCallback, useState } from "react"
import { RustyAuthContext } from "./AuthContext"
import { AuthContext } from "./IUserContext"
import { ICredentials } from "../header/login/ICredentials"
import axios from "axios"
>>>>>>> Stashed changes

export interface IAuthProviderProps {
    children: React.ReactNode;
}

<<<<<<< Updated upstream
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
=======
const TOKEN_KEY = "rusty_auth_token";
const NAME_KEY = "rusty_auth_name";
const loginUrl = `${import.meta.env.VITE_RUSTY_API_BASE_URL}/auth/login`;

export const AuthProvider = (props: IAuthProviderProps) => {
    const [token, setToken] = useState<string>(localStorage.getItem(TOKEN_KEY) || "");
    const [name, setName] = useState<string | undefined>(localStorage.getItem(NAME_KEY) || undefined);

    const isAdmin = !!token;

    const login = useCallback(async (credentials: ICredentials) => {
        const response = await axios.post(loginUrl, credentials);
        const { token: newToken, name: newName } = response.data;
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(NAME_KEY, newName);
        setToken(newToken);
        setName(newName);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(NAME_KEY);
        setToken("");
        setName(undefined);
    }, []);

    const getToken = useCallback(() => {
        return token;
    }, [token]);

    const authContext: AuthContext = {
        userContext: {
            name
        },
        isAdmin,
        getToken,
        login,
        logout
    }

    return <RustyAuthContext.Provider value={authContext}>{props.children}</RustyAuthContext.Provider>
>>>>>>> Stashed changes
}

