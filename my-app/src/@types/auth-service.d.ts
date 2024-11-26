export interface AuthServiceProps {
    login: (username: string, password: string) => any;
    isLoggedIn: string | null;
    accessToken: string | undefined;
    //logout: () => void;
    //register: (username: string, password: string) => any;
}