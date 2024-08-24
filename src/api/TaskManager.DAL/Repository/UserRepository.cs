using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Npgsql;
using TaskManager.Contracts;
using TaskManager.DAL.Contracts;
using TaskManager.DAL.Entities;

namespace TaskManager.DAL.Repository;

public class UserRepository(ILogger<UserRepository> logger, IOptions<DataConfig> config)
    : IUserRepository
{
    public async Task<User> GetUserByEmail(string email)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var user = await connection.QueryFirstOrDefaultAsync<User>(
                $"SELECT * FROM users WHERE {nameof(User.Email)} = @email LIMIT 1",
                new { email });

            return user;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting tasks");
            throw;
        }
    }

    public async Task<bool> IsUserTaskOwner(Guid userId, Guid taskId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var task = await connection.QueryFirstOrDefaultAsync<Column>(
                $@"SELECT t.* 
                    FROM boards b 
                        inner join columns c on b.{nameof(Board.Id)}=c.{nameof(Column.BoardId)}
                        inner join tasks t on c.{nameof(Column.Id)}=t.{nameof(TaskItem.ColumnId)}
                    WHERE b.{nameof(Board.UserId)} = @userId AND t.{nameof(TaskItem.Id)} = @taskId
                    LIMIT 1",
                new { userId, taskId });

            return task is not null;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error validating task ownership");
            throw;
        }
    }

    public async Task<bool> IsUserColumnOwner(Guid userId, Guid columnId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var column = await connection.QueryFirstOrDefaultAsync<Column>(
                $@"SELECT c.* 
                    FROM boards b 
                        inner join columns c on b.{nameof(Board.Id)}=c.{nameof(Column.BoardId)} 
                    WHERE b.{nameof(Board.UserId)} = @userId AND c.{nameof(Column.Id)} = @columnId
                    LIMIT 1",
                new { userId, columnId });

            return column is not null;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error validating column ownership");
            throw;
        }
    }

    public async Task<bool> IsUserBoardOwner(Guid userId, Guid boardId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var board = await connection.QueryFirstOrDefaultAsync<Board>(
                $"SELECT * FROM boards b WHERE b.{nameof(Board.UserId)} = @userId AND b.{nameof(Board.Id)} = @boardId LIMIT 1",
                new { userId, boardId });

            return board is not null;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error validating board ownership");
            throw;
        }
    }

    public async Task<User> Create(User user)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var board = await connection.ExecuteAsync(
                $"INSERT INTO users({nameof(User.Id)}, {nameof(User.Email)}, {nameof(User.Name)}) VALUES (@id, @email, @name)",
                user);

            return user;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error adding user");
            throw;
        }
    }
}