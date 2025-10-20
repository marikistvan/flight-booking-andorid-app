export interface User {
    uid: string;
    email: string;
    emailVerified: boolean;
    disabled: boolean;
    lastSignInTime?: string;
    creationTime?: string;
    provider?: string;
}
export interface UserDetails {
    uid?: string;
    admin?: boolean;
    born?: string;
    genre?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
}
