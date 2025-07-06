namespace ParkingDb.Models;

public class DbObject<TId> where TId : IEquatable<TId>
{
    public TId? Id { get; set; } = default;
}
