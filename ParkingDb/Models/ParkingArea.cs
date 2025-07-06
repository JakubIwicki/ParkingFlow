using ParkingDb.Interfaces;

namespace ParkingDb.Models;

public class ParkingArea : DbObject<string>, IActive
{
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal WeekdaysHourlyRateUsd { get; set; } = 0.0m;
    public decimal WeekendHourlyRateUsd { get; set; } = 0.0m;
    public double DiscountPercentage { get; set; } = 0.0;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}