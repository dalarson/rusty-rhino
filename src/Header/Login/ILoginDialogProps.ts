import { ICredentials } from "./ICredentials";

export interface ILoginDialogProps {
    /**
     * Whether the dialog is open or not.
     */
    isOpen: boolean;
    /**
     * A callback to close the dialog.
     * @returns - Nothing.
     */
    onClose: () => void;
    /**
     * A callback function for when a user submits the login dialog.
     * @param credentials - The credentials the user wishes to login with.
     * @returns - Nothing.
     */
    onSubmit: (credentials: ICredentials) => void;
}