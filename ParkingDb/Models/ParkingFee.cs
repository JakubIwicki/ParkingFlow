namespace ParkingDb.Models;

public class ParkingFee : DbObject<string>
{
    public string ParkingAreaId { get; set; } = string.Empty;
    public DateTime StartTime { get; set; } = default;
    public DateTime EndTime { get; set; } = default;
    public DateTime ParkingDate { get; set; } = default;
    public PaymentResult PaymentResult { get; set; } = null!;
}