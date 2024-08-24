using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Services.Contracts;

namespace TaskManager.API.Controllers;

public class BaseController(IUserService userService) : ControllerBase
{
    protected Task<Guid> GetUserId()
    {
        var email = GetUserEmail();
        
        return userService.GetUserId(email);
    }

    protected string GetUserEmail()
    {
        var userEmail = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        
        if (userEmail != null)
            return userEmail;
        
        return string.Empty;
    }
    
    protected string GetUserName()
    {
        var userName = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        
        if (userName != null)
            return userName;
        
        return string.Empty;
    }
}