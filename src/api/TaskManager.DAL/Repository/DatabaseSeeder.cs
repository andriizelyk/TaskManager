using System.Data;
using Dapper;
using Microsoft.Extensions.Options;
using Npgsql;
using TaskManager.Contracts;
using TaskManager.DAL.Entities;

namespace TaskManager.DAL.Repository;

public class DatabaseSeeder(IOptions<DataConfig> dataConfig)
{
    private readonly string _connectionString = dataConfig.Value.ConnectionString;

    public void Seed()
    {
        using IDbConnection connection = new NpgsqlConnection(_connectionString);
        connection.Open();

        ExecuteSql(connection, CreateUsersTable());
        ExecuteSql(connection, CreateBoardsTable());
        ExecuteSql(connection, CreateColumnsTable());
        ExecuteSql(connection, CreateTasksTable());
    }

    private void ExecuteSql(IDbConnection connection, string sqlScript)
    {
        try
        {
            connection.Execute(sqlScript);
            Console.WriteLine("SQL script executed successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error executing SQL script: {ex.Message}");
        }
    }

    private string CreateBoardsTable()
    {
        return @$"
            CREATE TABLE IF NOT EXISTS Boards (
                {nameof(Board.Id)} UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                {nameof(Board.UserId)} UUID NOT NULL,
                {nameof(Board.Title)} VARCHAR(255) NOT NULL,
                ""{nameof(Board.Order)}"" VARCHAR(255),
                FOREIGN KEY ({nameof(Board.UserId)}) REFERENCES Users({nameof(User.Id)})
            );
        ";
    }

    private string CreateTasksTable()
    {
        return @$"
            CREATE TABLE IF NOT EXISTS Tasks (
                {nameof(TaskItem.Id)} UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                {nameof(TaskItem.ColumnId)} UUID NOT NULL,
                {nameof(TaskItem.Title)} VARCHAR(255) NOT NULL,
                {nameof(TaskItem.Content)} TEXT,
                ""{nameof(TaskItem.Order)}"" VARCHAR(255) NOT NULL,
                {nameof(TaskItem.TitleColor)} VARCHAR(255) NOT NULL,
                FOREIGN KEY ({nameof(TaskItem.ColumnId)}) REFERENCES Columns({nameof(Column.Id)})
            );
        ";
    }

    private string CreateColumnsTable()
    {
        return @$"
            CREATE TABLE IF NOT EXISTS Columns (
                {nameof(Column.Id)} UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                {nameof(Column.BoardId)} UUID NOT NULL,
                {nameof(Column.Title)} VARCHAR(255) NOT NULL,
                ""{nameof(Column.Order)}"" VARCHAR(255) NOT NULL,
                FOREIGN KEY ({nameof(Column.BoardId)}) REFERENCES Boards({nameof(Board.Id)})
            );
        ";
    }

    private string CreateUsersTable()
    {
        return @$"
            CREATE TABLE IF NOT EXISTS Users (
                {nameof(User.Id)} UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                {nameof(User.Name)} VARCHAR(255) NOT NULL,
                {nameof(User.Email)} VARCHAR(255) NOT NULL UNIQUE
            );
        ";
    }
}