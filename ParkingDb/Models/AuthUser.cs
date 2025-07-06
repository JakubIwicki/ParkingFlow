using Raven.Identity;

namespace ParkingDb.Models;

public class AuthUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
}