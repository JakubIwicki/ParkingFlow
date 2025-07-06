import { User } from '@/models/User';
import { ApiGet, ApiPost } from './api_utils';

const url = '/api/auth';

export async function user_login(email: string, password: string): Promise<User | Error> {
    try {
        const response = await ApiPost<User, any>(
            `${url}/login`,
            {
                email: email,
                password: password
            });

        if (response instanceof Error) {
            throw new Error(`Login failed`);
        }

        return response as User;
    }
    catch (error) {
        return error as Error;
    }
}

export async function user_register(
    email: string,
    password: string,
    displayName: string
): Promise<string | Error> {
    try {
        const response = await ApiPost<string, any>(
            `${url}/register`,
            {
                email: email,
                password: password,
                displayName: displayName
            });

        if (response instanceof Error) {
            throw new Error(`Registration failed`);
        }

        return response as string;
    }
    catch (error) {
        console.error('Error during user registration:', error);
        return error as Error;
    }
}

export async function isLoggedIn(user: User):
    Promise<{ validToken: boolean, message?: string }> {
    try {
        const response = await ApiGet<any>(`${url}/me`, user.token);

        if (response instanceof Error) {
            return {
                validToken: false,
                message: 'Invalid token or user not found'
            };
        }

        return response;
    }
    catch (error) {
        return {
            validToken: false,
            message: 'Error checking login status'
        }
    }
}