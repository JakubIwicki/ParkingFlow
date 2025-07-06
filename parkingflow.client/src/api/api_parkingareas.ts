import { User } from "@/models/User";
import { ApiDelete, ApiGet, ApiPost, ApiPut } from "./api_utils";
import { ParkingArea } from "@/models/ParkingArea";
import { ParkingFee } from "@/models/ParkingFee";

const url = '/api/parking_area';

export async function getParkingAreas(user: User): Promise<any> {
    try {
        const response = await ApiGet<ParkingArea>(url, user.token);

        if (response instanceof Error) {
            throw new Error(`Failed to fetch parking areas`);
        }

        return response;
    } catch (error) {
        console.error('Error fetching parking areas:', error);
        throw error;
    }
}

export async function getParkingArea(
    user: User,
    parkingAreaId: string
): Promise<ParkingArea | Error> {
    try {
        if (!parkingAreaId) {
            throw new Error('Parking area ID is required');
        }

        const encodedId = encodeURIComponent(parkingAreaId);
        const response = await ApiGet<ParkingArea>(
            `${url}/${encodedId}`,
            user.token);

        if (response instanceof Error) {
            throw new Error(`Failed to fetch parking area with ID ${parkingAreaId}`);
        }

        return response;
    }
    catch (error) {
        console.error('Error fetching parking area:', error);
        return error as Error;
    }
}

export async function getParkingFeesFromArea(
    user: User,
    parkingAreaId: string
): Promise<ParkingFee[] | Error> {
    try {
        if (!parkingAreaId) {
            throw new Error('Parking area ID is required');
        }

        const encodedId = encodeURIComponent(parkingAreaId);
        const response = await ApiGet<ParkingFee[]>(
            `${url}/${encodedId}/parking_fees`,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to fetch parking fees for area ${parkingAreaId}`);
        }

        return response;
    } catch (error) {
        console.error('Error fetching parking fees from area:', error);
        return error as Error;
    }
}

export async function postParkingArea(user: User, parkingArea: ParkingArea):
    Promise<ParkingArea | Error> {
    try {
        const response = await ApiPost<ParkingArea, ParkingArea>(
            url,
            parkingArea,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to create parking area`);
        }

        return response;
    } catch (error) {
        console.error('Error creating parking area:', error);
        return error as Error;
    }
}

export async function putParkingArea(
    user: User,
    parkingArea: ParkingArea
): Promise<void | Error> {
    try {

        const decodedId = encodeURIComponent(parkingArea.id);
        const response = await ApiPut<any, ParkingArea>(
            `${url}/${decodedId}`,
            parkingArea,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to update parking area`);
        }

        return response;
    } catch (error) {
        console.error('Error updating parking area:', error);
        return error as Error;
    }
}

export async function deleteParkingArea(
    user: User,
    parkingAreaId: string
): Promise<void | Error> {
    try {

        const decodedId = encodeURIComponent(parkingAreaId);
        const response = await ApiDelete<void>(
            `${url}/${decodedId}`,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to delete parking area`);
        }

        return response;
    } catch (error) {
        console.error('Error deleting parking area:', error);
        return error as Error;
    }
}