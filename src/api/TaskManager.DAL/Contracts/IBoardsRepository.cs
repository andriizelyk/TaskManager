using TaskManager.DAL.Entities;

namespace TaskManager.DAL.Contracts;

public interface IBoardsRepository
{
    Task<IEnumerable<Board>> GetBoardsAsync(Guid userId);
    
    Task AddBoard(Board board);
    
    Task UpdateBoard(Board board);
}