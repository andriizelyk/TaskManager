using TaskManager.Services.Dto;

namespace TaskManager.Services.Contracts;

public interface ITasksService
{
    Task<IEnumerable<TaskDto>> GetColumnTasks(Guid userId, Guid columnsId);
    
    Task UpdateTask(Guid userId, TaskDto taskDto);
    
    Task MoveTaskToColumn(Guid userId, Guid columnId, Guid taskId);
    
    Task ReorderTasks(Guid userId, Guid taskid, string order);
    
    Task AddTask(Guid userId, TaskDto task);
    
    Task DeleteTask(Guid userId, Guid taskId);
    
    Task<TaskDto> GetDetails(Guid userId, Guid taskId);
}