import { User } from "@/models/User";
import { ApiGet } from "./api_utils";

const url = "/api/parking_payment";

export async function get_payment_calculation(
    user: User,
    parkingAreaId: string,
    startTime: string,
    endTime: string,
    parkingDate: Date
): Promise<any | Error> {
    try {
        if (!parkingAreaId || !startTime || !endTime || !parkingDate) {
            throw new Error("All parameters are required");
        }

        const encodedId = encodeURIComponent(parkingAreaId);
        const response = await ApiGet<any>(
            `${url}/${encodedId}/calculate?startTime=${startTime}&endTime=${endTime}&date=${parkingDate.toISOString()}`,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to calculate payment for area ${parkingAreaId}`);
        }

        return response;
    } catch (error) {
        console.error("Error calculating payment:", error);
        return error as Error;
    }
}