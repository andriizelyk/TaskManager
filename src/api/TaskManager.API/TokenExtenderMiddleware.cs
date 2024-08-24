namespace TaskManager.API;

public class TokenExtenderMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TokenExtenderMiddleware> _logger;

    public TokenExtenderMiddleware(RequestDelegate next, ILogger<TokenExtenderMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var token = context.Request.Cookies["taskmanager-auth"];

        if (token is not null)
            context.Request.Headers["Authorization"] = "Bearer " + token;

        await _next(context);
    }
}