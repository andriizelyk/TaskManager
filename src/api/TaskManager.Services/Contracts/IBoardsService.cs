using TaskManager.Services.Dto;

namespace TaskManager.Services.Contracts;

public interface IBoardsService
{
    Task<IEnumerable<BoardDto>> GetBoards(Guid userId);
    
    Task AddBoard(BoardDto board);
    
    Task UpdateBoard(BoardDto board);
}