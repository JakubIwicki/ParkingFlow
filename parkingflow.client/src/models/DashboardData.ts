import { ParkingHistoryPayment } from "@/wrappers/ParkingHistoryPayment";

export interface DashboardData {
    totalParkingAreas: number;
    totalParkingFees: number;
    totalParkingAreasActive: number;
    lastMonthEarningsTotalUsd: number;
    currentMonthEarningsTotalUsd: number;
    parkingHistoryPayments?: ParkingHistoryPayment[];
}