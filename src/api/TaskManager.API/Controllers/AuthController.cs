using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.Dto.Requests;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly ILogger<AuthController> _logger;

    public AuthController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult CheckMe()
    {
        if (User.Identity?.IsAuthenticated ?? false)
        {
            HttpContext.Response.Headers.Append("me-name", User.Claims.First(c => c.Type == "name").Value);
            HttpContext.Response.Headers.Append("me-email", User.Claims.First(c => c.Type == ClaimTypes.Email).Value);
            HttpContext.Response.Headers.Append("me-picture", User.Claims.First(c => c.Type == "picture").Value);
            
            return Ok();
        }
        
        return Unauthorized();
    }

    [HttpPost("setup")]
    [Authorize]
    public IActionResult Setup([FromBody]TokenRequest req)
    {
        HttpContext.Response.Cookies.Append(
            "taskmanager-auth", 
            req.Token,
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(30), 
                HttpOnly = true, 
                SameSite = SameSiteMode.Lax
            });
        return Ok();
    }

    [HttpGet("sign-out")]
    public async Task<IActionResult> SignOut()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        HttpContext.Response.Cookies.Delete("taskmanager-auth");
        
        return Redirect("/");
    }
}