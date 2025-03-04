export interface IUserButtonProps {
    // callback to sign in a new user
    onSignInClick: () => void;
    // callback to sign out the currently signed in user
    onSignOutClick: () => void;
}