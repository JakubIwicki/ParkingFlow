export interface ParkingArea {
    id?: string;
    name: string;
    location: string;
    weekdaysHourlyRateUsd: number;
    weekendHourlyRateUsd: number;
    discountPercentage: number;
    description: string | null;
    isActive: boolean;
}