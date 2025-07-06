using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ParkingDb.Models;
using ParkingFlow.Server.Auth;
using ParkingFlow.Server.Dto;

namespace ParkingFlow.Server.Controllers.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<AuthUser> userManager,
    SignInManager<AuthUser> signInManager,
    IJwtTokenService jwtTokenService)
    : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        try
        {
            var user = new AuthUser
            {
                UserName = model.Email,
                Email = model.Email,
                DisplayName = model.DisplayName
            };

            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Created();
        }
        catch
        {
            return StatusCode(500, "An error occured when registering a user.");
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        try
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user is null)
                return Unauthorized("Invalid email or password");

            var password = model.Password;

            var result = await signInManager.PasswordSignInAsync(
                userName: user.UserName,
                password: password,
                isPersistent: false,
                lockoutOnFailure: false);

            if (!result.Succeeded)
                return Unauthorized("Invalid email or password");

            var token = jwtTokenService.GenerateToken(
                username: user.UserName,
                roles: user.Roles.ToList());

            var safeUser = new SafeUserData(user, token);

            return Ok(safeUser);
        }
        catch
        {
            return StatusCode(500, "An error occured when logging in the user.");
        }
    }

    [HttpGet("me")]
    public Task<IActionResult> CheckToken()
    {
        if (!Request.Headers.TryGetValue("Authorization", out var authHeader))
        {
            return Task.FromResult<IActionResult>(
                Ok(new { validToken = false, message = "No token provided" }));
        }

        if (authHeader.Count == 0 || !authHeader[0]!.Contains("Bearer"))
        {
            return Task.FromResult<IActionResult>(
                Ok(new { validToken = false, message = "Invalid token format" }));
        }

        try
        {
            // Check bearer token
            var token = authHeader.ToString().Replace("Bearer ", string.Empty);

            var isValid = jwtTokenService.IsTokenValid(token);

            return isValid
                ? Task.FromResult<IActionResult>(
                    Ok(new { validToken = true, message = "Token is valid" }))
                : Task.FromResult<IActionResult>(
                    Ok(new { validToken = false, message = "Token expired" }));
        }
        catch
        {
            return Task.FromResult<IActionResult>(
                Ok(new { validToken = false, message = "Invalid token" }));
        }
    }
}