using TaskManager.Services.Dto;

namespace TaskManager.Services.Contracts;

public interface IUserService
{
    Task<Guid> GetUserId(string email);
    
    Task<UserDto> Create(UserDto userDto);

    Task<bool> IsUserTaskOwner(Guid userId, Guid taskId);

    Task<bool> IsUserColumnOwner(Guid userId, Guid columnId);

    Task<bool> IsUserBoardOwner(Guid userId, Guid boardId);
}