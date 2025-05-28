using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


namespace Presentation.Controllers;

[ApiController]
[Route("user/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService; 

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(string nom, string prenom, string numero, string email, string motDePasse)
    {
        var success = await _authService.RegisterAsync(nom, prenom , numero, email, motDePasse);
        return success ? Ok("Registered successfully") : BadRequest("Username already taken");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string email, string password)
    {
        string token = await _authService.LoginAsync(email, password);
        return !token.IsNullOrEmpty() ? Ok(token) : Unauthorized("Invalid credentials");
    }
}
