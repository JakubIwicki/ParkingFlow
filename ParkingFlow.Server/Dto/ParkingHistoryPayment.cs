namespace ParkingFlow.Server.Dto;

public class ParkingHistoryPayment
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal AmountInUsd { get; set; }
}