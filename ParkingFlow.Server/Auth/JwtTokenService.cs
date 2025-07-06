using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace ParkingFlow.Server.Auth;

public class JwtTokenService(IConfiguration config) : IJwtTokenService
{
    public string GenerateToken(string username, IList<string> roles)
    {
        var codeBytes = Convert.FromBase64String(config["Jwt:Key"]!);
        var key = new SymmetricSecurityKey(codeBytes);

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var minutesExpire = Convert.ToInt32(config["Jwt:ExpireMinutes"]!);
        var expires = DateTime.Now.AddMinutes(minutesExpire);

        var issuer = config["Jwt:Issuer"]!;
        var audience = config["Jwt:Audience"]!;

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            expires: expires,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public bool IsTokenValid(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        var expiration = jwtToken.ValidTo;

        return expiration >= DateTime.UtcNow;
    }
}