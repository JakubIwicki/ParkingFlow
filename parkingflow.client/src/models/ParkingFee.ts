import { PaymentResult } from "./PaymentResult";

export interface ParkingFee {
    id?: string;
    parkingAreaId: string;
    startTime: Date;
    endTime: Date;
    parkingDate: Date;
    paymentResult: PaymentResult;
}