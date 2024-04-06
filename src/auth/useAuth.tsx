import { createContext, useContext } from "react";
import { IUserContext } from "./IUserContext";

const defaultUserContext: IUserContext = {
    isAdmin: false
}

export const useAuth = () => useContext<IUserContext>(createContext<IUserContext>(defaultUserContext));