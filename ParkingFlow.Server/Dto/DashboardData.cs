namespace ParkingFlow.Server.Dto;

public class DashboardData
{
    public int TotalParkingAreas { get; set; }
    public int TotalParkingFees { get; set; }
    public int TotalParkingAreasActive { get; set; }
    public decimal LastMonthEarningsTotalUsd { get; set; }
    public decimal CurrentMonthEarningsTotalUsd { get; set; }
    public List<ParkingHistoryPayment>? ParkingHistoryPayments { get; set; } = null;

}