using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using TaskManager.API;
using TaskManager.Contracts;
using TaskManager.DAL;
using TaskManager.Services.Services;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Services.Configure<DataConfig>(
    builder.Configuration.GetSection("Data"));

builder.Services.AddRepositories();
builder.Services.AddServices();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<ICache, Cache>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://accounts.google.com";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://accounts.google.com",

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Authentication:Google:ClientId"],
            ValidateLifetime = true
        };
    });

// builder.Services.AddAuthentication(options =>
//     {
//         options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
//         options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
//     })
//     .AddCookie(options =>
//     {
//         options.Cookie.Name = "taskmanager-auth";
//         options.Cookie.HttpOnly = true;
//         options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
//         options.Cookie.SameSite = SameSiteMode.Lax;
//         options.ExpireTimeSpan = TimeSpan.FromHours(1);
//         options.SlidingExpiration = true;
//         options.Events.OnRedirectToLogin = context =>
//         {
//             context.Response.StatusCode = StatusCodes.Status401Unauthorized;
//             return Task.CompletedTask;
//         };
//     
//         options.Events.OnRedirectToAccessDenied = context =>
//         {
//             context.Response.StatusCode = StatusCodes.Status403Forbidden;
//             return Task.CompletedTask;
//         };
//     })
//     .AddGoogle(options =>
//     {
//         options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
//         options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
//         options.CallbackPath = "/api/signin-google";
//         options.Scope.Add("profile");
//         options.Scope.Add("email");
//         // Customize the callback path if needed
//         options.CallbackPath = "/api/auth/google-callback";
//     
//         // Map claims from Google to ASP.NET Identity claims
//         options.ClaimActions.MapJsonKey("urn:google:picture", "picture", "url");
//         options.ClaimActions.MapJsonKey("urn:google:locale", "locale", "string");
//     
//         options.SaveTokens = true; 
//     });

builder.Services.AddAuthorization();
builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedProto;
    });

builder.Services.AddCors(c =>
{
    c.AddPolicy(
        "Frontend", 
        options => options
            .WithOrigins("http://localhost:5173")
            .WithExposedHeaders("me-name", "me-email", "me-picture")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}
app.UseMiddleware<TokenExtenderMiddleware>();
app.UseForwardedHeaders();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("Frontend");


app.MapControllers();


try
{
    Log.Information("Starting the app...");
    Console.WriteLine("Application started.");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "App failed to start");
    Console.WriteLine("Application failed to start.");
}
finally
{
    Log.CloseAndFlush();
}

