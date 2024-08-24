using TaskManager.DAL.Entities;
using Task = System.Threading.Tasks.Task;

namespace TaskManager.DAL.Contracts;

public interface IColumnsRepository
{
    Task<IEnumerable<Column>> GetColumns(Guid boardId);
    
    Task AddColumn(Column column);
    
    Task UpdateColumn(Column column);
    
    Task UpdateColumnOrder(Guid columnId, string order);
    
    Task DeleteColumn(Guid columnId);
}