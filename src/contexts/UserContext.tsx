"use client";

import React, { useState, createContext, useEffect, ReactNode } from "react";
import Cookies from 'js-cookie';
import { IUser } from "@/lib/models/user.model";
import { useRouter } from "next/navigation";

interface LoginData {
    token: string;
    user: IUser;
}

interface UserContextType {
    accessToken: string | null;
    user: IUser | null; 
    login: (data: LoginData) => void;
    logout: () => void;
    loading: boolean;
}

interface UserProviderProps {
    children: ReactNode;
}

export const logout = () => {
    Cookies.remove('accessTokenStellarOne');
    Cookies.remove('userDataStellarOne');
};

export const UserContext = createContext<UserContextType>({
    accessToken: null,
    user: null,
    login: () => { },
    logout: () => { },
    loading: true
});

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const accessTokenFromCookie = Cookies.get('accessTokenStellarOne');
        const userDataFromCookie = Cookies.get('userDataStellarOne');
        if (accessTokenFromCookie && userDataFromCookie) {
            setAccessToken(accessTokenFromCookie);
            setUser(JSON.parse(userDataFromCookie) as IUser);
        }
        setLoading(false);
    }, []);

    const login = (data: LoginData) => {
        const { token, user } = data;
        setAccessToken(token);
        setUser(user);

        const accessTokenExpiration = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
        Cookies.set('accessTokenStellarOne', token, {
            expires: accessTokenExpiration,
            secure: true,
            sameSite: 'Strict',
        });

        Cookies.set('userDataStellarOne', JSON.stringify(user), {
            expires: accessTokenExpiration,
            secure: true,
            sameSite: 'Strict',
        });
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        Cookies.remove('accessTokenStellarOne');
        Cookies.remove('userDataStellarOne');
        router.push('/login');
    };

    return (
        <UserContext.Provider value={{ accessToken, user, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
