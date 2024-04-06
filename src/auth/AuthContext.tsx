import { createContext } from "react";
import { IUserContext } from "./IUserContext";

export const AuthContext = createContext<IUserContext>({isAdmin: false})