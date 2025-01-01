import { createContext } from "react";
import { IUserContext } from "./IUserContext";
import { defaultUserContext } from "./DefaultUserContext";

export const AuthContext = createContext<IUserContext>(defaultUserContext)