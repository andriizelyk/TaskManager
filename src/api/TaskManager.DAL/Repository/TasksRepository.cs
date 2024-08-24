using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Npgsql;
using TaskManager.Contracts;
using TaskManager.DAL.Contracts;
using TaskManager.DAL.Entities;

namespace TaskManager.DAL.Repository;

public class TasksRepository(IOptions<DataConfig> config, ILogger<TasksRepository> logger)
    : ITasksRepository
{
    public async Task<IEnumerable<TaskItem>> GetColumnTasks(Guid columnId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var tasks = await connection.QueryAsync<TaskItem>(
                "SELECT * FROM tasks WHERE columnId = @columnId",
                new { columnId });

            return tasks;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting tasks");
            throw;
        }
    }

    public async Task AddTask(TaskItem task)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var sql = @$"INSERT INTO tasks ({nameof(TaskItem.Id)}, {nameof(TaskItem.ColumnId)}, {nameof(TaskItem.Content)}, ""{nameof(TaskItem.Order)}"", {nameof(TaskItem.Title)}, {nameof(TaskItem.TitleColor)}) 
                        VALUES (@id, @columnId, @content, @order, @title, @titleColor);";
            
            await connection.ExecuteAsync(sql, task);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error adding task");
            throw;
        }
    }

    public async Task UpdateTask(TaskItem task)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var sql = $@"UPDATE tasks SET 
                 {nameof(TaskItem.Content)} = @content,
                 {nameof(TaskItem.ColumnId)} = @columnId,
                 ""{nameof(TaskItem.Order)}"" = @order,
                 {nameof(TaskItem.Title)} = @title,
                 {nameof(TaskItem.TitleColor)} = @titleColor
             WHERE {nameof(TaskItem.Id)} = @id;";
            
            await connection.ExecuteAsync(sql, task);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error updating task");
            throw;
        }
    }

    public async Task DeleteTask(Guid taskId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var sql = $"DELETE FROM tasks WHERE {nameof(TaskItem.Id)} = @taskId;";
            
            await connection.ExecuteAsync(sql, new {taskId});
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error deleting task");
            throw;
        }
    }

    public async Task MoveTaskToColumn(Guid columnId, Guid taskId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var sql = $@"UPDATE tasks SET 
                 {nameof(TaskItem.ColumnId)} = @columnId
             WHERE {nameof(TaskItem.Id)} = @taskId;";
            
            await connection.ExecuteAsync(sql, new {columnId, taskId});
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error moving task");
            throw;
        }
    }

    public async Task ReorderTask(Guid taskId, string order)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var sql = $@"UPDATE tasks SET 
                 ""{nameof(TaskItem.Order)}"" = @order
             WHERE {nameof(TaskItem.Id)} = @taskId;";
            
            await connection.ExecuteAsync(sql, new {taskId, order});
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error moving task");
            throw;
        }
    }

    public async Task<TaskItem> GetTaskDetails(Guid taskId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var task = await connection.QueryFirstOrDefaultAsync<TaskItem>(
                $"SELECT TOP 1 * FROM tasks WHERE {nameof(TaskItem.Id)} = @taskId",
                new { taskId });

            return task;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting tasks");
            throw;
        }
    }
}