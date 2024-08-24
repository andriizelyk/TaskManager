using TaskManager.DAL.Contracts;
using TaskManager.DAL.Entities;
using TaskManager.Services.Contracts;
using TaskManager.Services.Dto;

namespace TaskManager.Services.Services;

public class BoardsService(IBoardsRepository boardsRepository) : IBoardsService
{
    public async Task<IEnumerable<BoardDto>> GetBoards(Guid userId)
    {
        var boards = await boardsRepository.GetBoardsAsync(userId);

        return boards.Select(b => new BoardDto
        {
            Id = b.Id,
            Title = b.Title,
            UserId = b.UserId
        });
    }

    public Task AddBoard(BoardDto board)
    {
        return boardsRepository.AddBoard(new Board
        {
            Id = board.Id,
            Title = board.Title,
            UserId = board.UserId
        });
    }

    public Task UpdateBoard(BoardDto board)
    {
        return boardsRepository.UpdateBoard(new Board
        {
            Id = board.Id,
            Title = board.Title
        });
    }
}