
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/models/User';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { isLoggedIn, user_login, user_register } from '@/api/api_user';
import { ReceiptRussianRuble } from 'lucide-react';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, confirmPassword: string, displayName: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const { toast } = useToast();

    const storageKey = 'parkingflow_user';

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        const savedUser = localStorage.getItem(storageKey);
        if (!savedUser) {
            navigate('/login', { state: { from: location } });
            return;
        }
        setUser(JSON.parse(savedUser));
    }, []);

    useEffect(() => {
        checkLoginStatus();
    }, [user, location.pathname, navigate]);

    async function checkLoginStatus() {
        if (!user) {
            if (location.pathname !== '/login') {
                navigate('/login', { state: { from: location } });
            }
            return;
        }

        const result = await isLoggedIn(user);
        const isValid = result.validToken;
        if (!isValid) {
            setUser(null);
            localStorage.removeItem(storageKey);
            if (location.pathname !== '/login') {
                navigate('/login', { replace: true });
            }
            return;
        }
    }

    const login = async (email: string, password: string): Promise<boolean> => {

        try {
            if (!email || !password) {
                toast({
                    title: 'Login Failed',
                    description: 'Email and password are required.',
                    variant: 'destructive',
                });
                return false;
            }

            const response = await user_login(email, password);

            if (response instanceof Error) {
                toast({
                    title: 'Login Failed',
                    description: response.message || 'Invalid email or password.',
                    variant: 'destructive',
                });
                return false;
            }

            const user = response as User;
            setUser(user);
            localStorage.setItem(storageKey, JSON.stringify(user));
            return true;
        }
        catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred while trying to log in.',
                variant: 'destructive',
            });
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(storageKey);
        toast({
            title: 'Logged Out',
            description: 'You have successfully logged out.',
        });
    };

    const register = async (
        email: string, password: string,
        confirmPassword: string, displayName: string)
        : Promise<boolean> => {
        try {
            if (password !== confirmPassword) {
                toast({
                    title: "Error",
                    description: "Passwords do not match",
                    variant: "destructive"
                });
                return false;
            }

            if (!email || !password || !displayName) {
                toast({
                    title: "Error",
                    description: "Please fill in all fields",
                    variant: "destructive"
                });
                return false;
            }

            const response = await user_register(email, password, displayName);

            if (response instanceof Error) {
                toast({
                    title: "Registration Failed",
                    description: response.message,
                    variant: "destructive"
                });
                return false;
            }

            toast({
                title: "Success",
                description: `${response} Please login.`,
            });

            return true;
        }
        catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while trying to register.",
                variant: "destructive"
            });
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
