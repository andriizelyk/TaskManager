using Microsoft.Extensions.DependencyInjection;
using TaskManager.DAL.Contracts;
using TaskManager.DAL.Repository;

namespace TaskManager.DAL;

public static class RepositoryExtension
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<DatabaseSeeder>();
        services.AddScoped<IBoardsRepository, BoardsRepository>();
        services.AddScoped<IColumnsRepository, ColumnsRepository>();
        services.AddScoped<ITasksRepository, TasksRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        
        return services;
    }
}