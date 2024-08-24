using TaskManager.Services.Dto;

namespace TaskManager.Services.Contracts;

public interface IColumnsService
{
    Task<IEnumerable<ColumnDto>> GetColumns(Guid userId, Guid board);
    
    Task AddColumn(Guid userId, ColumnDto column);
    
    Task DeleteColumn(Guid userId, Guid columnId);
    
    Task UpdateColumn(Guid userId, ColumnDto column);
    
    Task UpdateColumnOrder(Guid userId, Guid columnId, string order);
}