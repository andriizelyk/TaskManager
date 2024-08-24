using TaskManager.DAL.Entities;

namespace TaskManager.DAL.Contracts;

public interface IUserRepository
{
    Task<User> GetUserByEmail(string email);
    Task<bool> IsUserTaskOwner(Guid userId, Guid taskId);
    Task<bool> IsUserColumnOwner(Guid userId, Guid columnId);
    Task<bool> IsUserBoardOwner(Guid userId, Guid boardId);
    Task<User> Create(User user);
}