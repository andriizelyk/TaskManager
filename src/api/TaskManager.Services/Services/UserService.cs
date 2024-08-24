using TaskManager.Contracts;
using TaskManager.DAL.Contracts;
using TaskManager.DAL.Entities;
using TaskManager.Services.Contracts;
using TaskManager.Services.Dto;

namespace TaskManager.Services.Services;

public class UserService(IUserRepository userRepository, ICache cache) : IUserService
{
    public async Task<Guid> GetUserId(string email)
    {
        var user = await cache.GetAsync<User>(email, () => userRepository.GetUserByEmail(email));
        
        return user?.Id ?? Guid.Empty;
    }

    public async Task<UserDto> Create(UserDto user)
    {
        var dbUser = await userRepository.Create(new User
        {
            Email = user.Email,
            Id = user.Id,
            Name = user.Name
        });
        
        return new UserDto
        {
            Id = dbUser.Id,
            Email = dbUser.Email,
            Name = dbUser.Name
        };
    }

    public Task<bool> IsUserTaskOwner(Guid userId, Guid taskId)
    {
        return cache.GetAsync<bool>($"{userId}:t:{taskId}", () => userRepository.IsUserTaskOwner(userId, taskId));
    }
    
    public Task<bool> IsUserColumnOwner(Guid userId, Guid columnId)
    {
        return cache.GetAsync<bool>($"{userId}:c:{columnId}", () => userRepository.IsUserColumnOwner(userId, columnId));
    }
    
    public Task<bool> IsUserBoardOwner(Guid userId, Guid boardId)
    {
        return cache.GetAsync<bool>($"{userId}:b:{boardId}", () => userRepository.IsUserBoardOwner(userId, boardId));
    }
}