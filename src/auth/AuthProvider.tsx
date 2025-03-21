import { useCallback, useEffect, useRef } from "react"
import { RustyAuthContext } from "./AuthContext"
import { useIsAuthenticated, useMsal, useMsalAuthentication } from "@azure/msal-react";
import { AuthContext } from "./IUserContext";
import { InteractionType } from "@azure/msal-browser";

export interface IAuthProviderProps {
    children: React.ReactNode;
}


export const AuthProvider = (props: IAuthProviderProps) => {
    const { instance } = useMsal();
    const account = instance.getActiveAccount();
    const isAuthenticated = useIsAuthenticated();
    const entraToken = useRef<string>("")

    console.log(import.meta);

    const loginRequest = {
        scopes: [`api://${import.meta.env.VITE_CLIENT_ID}/default`],
    }

    const loginSilently = useCallback(async () => {
        try {
            const response = await instance.acquireTokenSilent(loginRequest)
            entraToken.current = response.accessToken;
        } catch (error) {
            // just log it, we can proceed un-authenticated
            console.log("Failed to acquire token silently")
        }
    }, [instance])

    const getToken = useCallback(() => {
        return entraToken.current;
    }, [instance, entraToken])

    useEffect(() => {
        if (!isAuthenticated) {
            // try to login silently automatically
            loginSilently();
        }
    }, [instance, isAuthenticated])

    const login = () => {
        return instance.loginRedirect(loginRequest);
    }

    const logout = () => {
        return instance.logoutRedirect();
    }

    const authContext: AuthContext = {
        userContext: {
            name: account?.name
        },
        isAdmin: isAuthenticated,
        getToken,
        login,
        logout
    }

    return <RustyAuthContext.Provider value={authContext} > {props.children}</RustyAuthContext.Provider >
}

