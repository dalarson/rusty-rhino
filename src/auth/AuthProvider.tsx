import { useCallback, useState } from "react"
import { AuthContext } from "./AuthContext"
import { ICredentials } from "../header/login/ICredentials"
import axios from "axios"

export interface IAuthProviderProps {
    children: React.ReactNode;
}

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

    return <AuthContext.Provider value={{ isAdmin, name, getToken, login, logout }}>{props.children}</AuthContext.Provider>
}

