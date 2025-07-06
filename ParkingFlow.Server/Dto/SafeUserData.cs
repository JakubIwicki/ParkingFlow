using ParkingDb.Models;

namespace ParkingFlow.Server.Dto;

public class SafeUserData(AuthUser user, string token)
{
    public string Id { get; set; } = user.Id!;
    public string Token { get; set; } = token;
    public string DisplayName { get; set; } = user.DisplayName;
    public IReadOnlyList<string> Roles { get; set; } = user.Roles;
}