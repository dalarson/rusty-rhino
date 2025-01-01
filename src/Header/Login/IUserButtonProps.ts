export interface IUserButtonProps {
    isAdmin: boolean;
    name: string | undefined;
    // callback to sign in a new user
    onClick: () => void;
    // callback to sign out the currently signed in user
    onSignOut: () => void;
}