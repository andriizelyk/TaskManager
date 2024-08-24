using TaskManager.DAL.Entities;

namespace TaskManager.DAL.Contracts;

public interface ITasksRepository
{
    Task<IEnumerable<TaskItem>> GetColumnTasks(Guid columnId);
    
    Task AddTask(TaskItem task);
    
    Task UpdateTask(TaskItem task);
    
    Task DeleteTask(Guid taskId);
    
    Task MoveTaskToColumn(Guid columnId, Guid taskId);
    
    Task ReorderTask(Guid taskId, string order);
    
    Task<TaskItem> GetTaskDetails(Guid taskId);
}