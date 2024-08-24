using TaskManager.DAL.Contracts;
using TaskManager.DAL.Entities;
using TaskManager.Services.Contracts;
using TaskManager.Services.Dto;

namespace TaskManager.Services.Services;

public class TasksService(ITasksRepository tasksRepository, IUserService userService) : ITasksService
{
    public async Task<IEnumerable<TaskDto>> GetColumnTasks(Guid userId, Guid columnsId)
    {
        var isUserTaskOwner = await userService.IsUserColumnOwner(userId, columnsId);
        if (isUserTaskOwner)
        {
            var columnTasks = await tasksRepository.GetColumnTasks(columnsId);

            return columnTasks.Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Order = t.Order,
                ColumnId = t.ColumnId,
                Content = t.Content,
                TitleColor = t.TitleColor
            });
        }
        
        return [];
    }

    public async Task UpdateTask(Guid userId, TaskDto taskDto)
    {
        var isUserTaskOwner = await userService.IsUserTaskOwner(userId, taskDto.Id);
        
        if (isUserTaskOwner)
            await tasksRepository.UpdateTask(new TaskItem
            {
                Id = taskDto.Id,
                Title = taskDto.Title,
                Order = taskDto.Order,
                ColumnId = taskDto.ColumnId,
                Content = taskDto.Content,
                TitleColor = taskDto.TitleColor
            });
    }

    public async Task MoveTaskToColumn(Guid userId, Guid columnId, Guid taskId)
    {
        var isUserTaskOwner = await userService.IsUserTaskOwner(userId, taskId);
        var isUserColumnOwner = await userService.IsUserColumnOwner(userId, columnId);

        if (isUserColumnOwner && isUserTaskOwner)
            await tasksRepository.MoveTaskToColumn(columnId, taskId);
    }

    public async Task ReorderTasks(Guid userId, Guid taskId, string order)
    {
        var isUserTaskOwner = await userService.IsUserTaskOwner(userId, taskId);
        if (isUserTaskOwner)
        {
            await tasksRepository.ReorderTask(taskId, order);
        }
    }

    public async Task AddTask(Guid userId, TaskDto task)
    {
        await tasksRepository.AddTask(new TaskItem
        {
            Id = task.Id,
            Title = task.Title,
            Order = task.Order,
            ColumnId = task.ColumnId,
            Content = task.Content,
            TitleColor = task.TitleColor
        });
    }

    public async Task DeleteTask(Guid userId, Guid taskId)
    {
        var isUserTaskOwner = await userService.IsUserTaskOwner(userId, taskId);

        if (isUserTaskOwner)
            await tasksRepository.DeleteTask(taskId);
    }

    public async Task<TaskDto> GetDetails(Guid userId, Guid taskId)
    {
        var isUserTaskOwner = await userService.IsUserTaskOwner(userId, taskId);

        if (isUserTaskOwner)
        {
            var taskDetails = await tasksRepository.GetTaskDetails(taskId);

            if (taskDetails is null)
                return null;
            
            return new TaskDto
            {
                Id = taskDetails.Id,
                Title = taskDetails.Title,
                Order = taskDetails.Order,
                ColumnId = taskDetails.ColumnId,
                Content = taskDetails.Content
            };
        }
        
        return null;
    }
}