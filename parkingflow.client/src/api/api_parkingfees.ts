import { ParkingFee } from "@/models/ParkingFee";
import { ApiDelete, ApiGet, ApiPost, ApiPut } from "./api_utils";
import { User } from "@/models/User";

const url = '/api/parking_fee';

export async function getParkingFees(
    user: User
): Promise<any | Error> {
    try {
        const response = await ApiGet<ParkingFee>(
            url,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to fetch parking fees`);
        }

        return response;
    } catch (error) {
        console.error('Error fetching parking fees:', error);
        return error as Error;
    }
}

export async function getParkingFee(
    user: User,
    parkingFeeId: string
): Promise<ParkingFee | Error> {
    try {
        const response = await ApiGet<ParkingFee>(
            `${url}/${parkingFeeId}`,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to fetch parking fee with ID ${parkingFeeId}`);
        }

        return response;
    } catch (error) {
        console.error('Error fetching parking fee:', error);
        return error as Error;
    }
}

export async function postParkingFee(
    user: User,
    parkingFee: ParkingFee
): Promise<ParkingFee | Error> {
    try {

        const response = await ApiPost<ParkingFee, ParkingFee>(
            url,
            parkingFee,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to create parking fee`);
        }

        return response;
    } catch (error) {
        console.error('Error creating parking fee:', error);
        return error as Error;
    }
}

export async function putParkingFee(
    user: User,
    parkingFee: ParkingFee
): Promise<void | Error> {
    try {
        const response = await ApiPut<void, ParkingFee>(
            `${url}/${parkingFee.id}`,
            parkingFee,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to update parking fee`);
        }

        return response;
    } catch (error) {
        console.error('Error updating parking fee:', error);
        return error as Error;
    }
}

export async function deleteParkingFee(
    user: User,
    parkingFeeId: string
): Promise<void | Error> {
    try {
        const response = await ApiDelete<void>(
            `${url}/${parkingFeeId}`,
            user.token
        );

        if (response instanceof Error) {
            throw new Error(`Failed to delete parking fee`);
        }

        return response;
    } catch (error) {
        console.error('Error deleting parking fee:', error);
        return error as Error;
    }
}