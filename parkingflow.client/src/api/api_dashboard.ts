import { DashboardData } from "@/models/DashboardData";
import { ApiGet } from "./api_utils";
import { User } from "@/models/User";

export async function getDashboardData(user: User)
    : Promise<DashboardData | Error> {
    try {
        const response = await ApiGet<DashboardData>(
            '/api/dashboard',
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to fetch dashboard data`);
        }

        return response;
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        return error as Error;
    }
}