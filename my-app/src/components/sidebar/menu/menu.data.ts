import { Home, LucideIcon, Book, Tractor, User, Banana, Settings, Mail, ListOrdered, ShoppingCart } from "lucide-react";

export interface IMenuItem {
    icon: LucideIcon, 
    name: string,
    link: string
};

export const MENU: IMenuItem[] = [
    {
        icon: Home,
        name: "Home",
        link: "/"
    },
    {
        icon: Tractor,
        name: "Farmers",
        link: "/farmers"
    },
    {
        icon: User,
        name: "Dashboard",
        link: "/dashboard"
    },
    {
        icon: ListOrdered,
        name: "Orders",
        link: "/orders"
    },
    {
        icon: Banana,
        name: "Products",
        link: "/products"
    },
    {
        icon: Book,
        name: "About",
        link: "/about"
    },
    {
        icon: Mail,
        name: "Negotiations",
        link: "/chats"
    },
    {
        icon: ShoppingCart,
        name: "ShoppingCart",
        link: "/cart"
    }
]

