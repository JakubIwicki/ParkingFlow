namespace ParkingFlow.Server.Auth;

public interface IJwtTokenService
{
    string GenerateToken(string username, IList<string> roles);
    bool IsTokenValid(string token);
}