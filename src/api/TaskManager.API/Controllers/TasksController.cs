using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.Dto.Requests;
using TaskManager.Services.Contracts;
using TaskManager.Services.Dto;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(
    IUserService userService,
    ITasksService tasksService,
    ILogger<TasksController> logger)
    : BaseController(userService)
{
    [HttpGet("get/{columnId}")]
    [Authorize]
    public async Task<IActionResult> GetTasks(Guid columnId) 
    {
        try
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                return NotFound("User not found");

            var tasks = await tasksService.GetColumnTasks(userId, columnId);
        
            return Ok(tasks);
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occured while getting tasks");
            throw;
        }
    }
    
    [HttpGet("details/{taskId}")]
    [Authorize]
    public async Task<IActionResult> GetTaskDetails(Guid taskId) 
    {
        try
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                return NotFound("User not found");

            var task = await tasksService.GetDetails(userId, taskId);
            if (task is null)
                return NotFound("Task not found");
        
            return Ok(task);
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occured while getting task's details");
            throw;
        }
    }

    [HttpPost("update")]
    [Authorize]
    public async Task<IActionResult> UpdateTask(TaskRequest task) 
    {
        try
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                return NotFound("User not found");

            await tasksService.UpdateTask(userId, new TaskDto
            {
                Title = task.Title, 
                Id = task.Id,
                ColumnId = task.ColumnId,
                Content = task.Content,
                Order = task.Order,
                TitleColor = task.TitleColor
            });
        
            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to update task");
            throw;
        }
    }

    [HttpPost("moveToColumn")]
    [Authorize]
    public async Task<IActionResult> MoveTaskToColumn(Guid columnId, Guid taskId) 
    {
        try
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                return NotFound("User not found");

            await tasksService.MoveTaskToColumn(userId, columnId, taskId);
        
            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to move task to column");
            throw;
        }
    }

    [HttpPost("reorderTask")]
    [Authorize]
    public async Task<IActionResult> MoveTaskOverTask(Guid taskid, string order) 
    {
        try
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                return NotFound("User not found");

            await tasksService.ReorderTasks(userId, taskid, order);
        
            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to reorder tasks");
            throw;
        }
    }

    [HttpPut("add")]
    [Authorize]
    public async Task<IActionResult> AddTask(TaskRequest task) 
    {
        try
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                return NotFound("User not found");

            await tasksService.AddTask(userId, new TaskDto
            {
                Title = task.Title,
                ColumnId = task.ColumnId,
                Content = task.Content,
                Order = task.Order,
                TitleColor = task.TitleColor,
                Id = task.Id
            });
        
            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to add task");
            throw;
        }
    }

    [HttpDelete("delete/{taskId}")]
    [Authorize]
    public async Task<IActionResult> DeleteTask(Guid taskId) 
    {
        try
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                return NotFound("User not found");

            await tasksService.DeleteTask(userId, taskId);
        
            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to delete task");
            throw;
        }
    }
}