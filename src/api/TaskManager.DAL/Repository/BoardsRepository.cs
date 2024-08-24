using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Npgsql;
using TaskManager.Contracts;
using TaskManager.DAL.Contracts;
using TaskManager.DAL.Entities;

namespace TaskManager.DAL.Repository;

public class BoardsRepository(IOptions<DataConfig> config, ILogger<BoardsRepository> logger)
    : IBoardsRepository
{
    public async Task<IEnumerable<Board>> GetBoardsAsync(Guid userId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var boards = await connection.QueryAsync<Board>(
                @$"SELECT * FROM boards WHERE {nameof(Board.UserId)} = @userId",
                new { userId });

            return boards;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get boards");
            throw;
        }
    }

    public async Task AddBoard(Board board)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            await connection.ExecuteAsync(
                @$"INSERT INTO boards({nameof(Board.UserId)}, {nameof(Board.Id)}, {nameof(Board.Title)}) VALUES (@userId, @id, @title)",
                new { board.UserId, board.Id, board.Title });
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to insert board");
            throw;
        }
    }

    public async Task UpdateBoard(Board board)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            await connection.ExecuteAsync(
                @$"UPDATE boards SET {nameof(Board.Title)} = @title WHERE {nameof(Board.Id)} = @id",
                new { board.Id, board.Title });
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to get boards");
            throw;
        }
    }
}