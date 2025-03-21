import { useContext } from "react";
import { RustyAuthContext } from "./AuthContext"

export const useAuth = () => {
    return useContext(RustyAuthContext);
}