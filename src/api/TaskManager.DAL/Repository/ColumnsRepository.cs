using System.Data;
using Dapper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Npgsql;
using TaskManager.Contracts;
using TaskManager.DAL.Contracts;
using TaskManager.DAL.Entities;
using Task = System.Threading.Tasks.Task;

namespace TaskManager.DAL.Repository;

public class ColumnsRepository(IOptions<DataConfig> config, ILogger<ColumnsRepository> logger)
    : IColumnsRepository
{
    public async Task<IEnumerable<Column>> GetColumns(Guid boardId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var columns = await connection.QueryAsync<Column>(
                $"SELECT * FROM columns WHERE {nameof(Column.BoardId)} = @boardId",
                new { boardId });

            return columns;
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting columns");
            throw;
        }
    }

    public async Task AddColumn(Column column)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var sql = $@"INSERT INTO columns ({nameof(Column.Id)}, {nameof(Column.BoardId)}, {nameof(Column.Title)}, ""{nameof(Column.Order)}"") VALUES (@id, @boardId, @title, @order)";
            await connection.ExecuteAsync(sql, column);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error adding column");
            throw;
        }
    }

    public async Task UpdateColumn(Column column)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var sql = $@"UPDATE columns SET {nameof(Column.Title)} = @title, ""{nameof(Column.Order)}"" = @order WHERE {nameof(Column.Id)} = @id";
            await connection.ExecuteAsync(sql, column);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error updating column");
            throw;
        }
    }

    public async Task UpdateColumnOrder(Guid columnId, string order)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var sql = $@"UPDATE columns SET ""{nameof(Column.Order)}""=@order WHERE {nameof(Column.Id)} = @columnId";
            await connection.ExecuteAsync(sql, new {columnId, order});
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error updating column order");
            throw;
        }
    }

    public async Task DeleteColumn(Guid columnId)
    {
        try
        {
            using IDbConnection connection = new NpgsqlConnection(config.Value.ConnectionString);
            connection.Open();

            var sql = $"DELETE FROM columns WHERE {nameof(Column.Id)} = @columnId";
            await connection.ExecuteAsync(sql, new {columnId});
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error deleting column");
            throw;
        }
    }
}