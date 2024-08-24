using Microsoft.Extensions.DependencyInjection;
using TaskManager.Services.Contracts;

namespace TaskManager.Services.Services;

public static class ServicesExtension
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IBoardsService, BoardsService>();
        services.AddScoped<IColumnsService, ColumnsService>();
        services.AddScoped<ITasksService, TasksService>();
        services.AddScoped<IUserService, UserService>();
        
        
        return services;
    }
}