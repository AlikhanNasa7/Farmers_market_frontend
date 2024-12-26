export interface AuthServiceProps {
    login: (username: string, password: string) => any;
    register: (email: string, name: string, surname: string, role:Role, password: string) => any;
    isLoggedIn: string | null;
    accessToken: string | undefined;
    user: any;
    updateToken: any;
    //logout: () => void;
    //register: (username: string, password: string) => any;
}

interface LoginValues {
    username: string;
    password: string;
}

enum Role{
    Farmer = "Farmer",
    Buyer = "Buyer"
}

interface RegisterValues {
    email: string;
    name: string;
    surname: string;
    role: Role | null;
    password: string;
}