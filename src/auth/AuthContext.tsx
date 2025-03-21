import { createContext } from "react";
import { AuthContext } from "./IUserContext";
import { defaultAuthContext } from "./DefaultUserContext";

export const RustyAuthContext = createContext<AuthContext>(defaultAuthContext)