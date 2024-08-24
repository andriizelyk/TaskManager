using TaskManager.DAL.Contracts;
using TaskManager.DAL.Entities;
using TaskManager.Services.Contracts;
using TaskManager.Services.Dto;

namespace TaskManager.Services.Services;

public class ColumnsService(IColumnsRepository columnsRepository, IUserService userService)
    : IColumnsService
{
    public async Task<IEnumerable<ColumnDto>> GetColumns(Guid userId, Guid boardId)
    {
        var isUserOwnsBoard = await userService.IsUserBoardOwner(userId, boardId);

        if (isUserOwnsBoard)
        {
            var columns = await columnsRepository.GetColumns(boardId);

            return columns.Select(c => new ColumnDto
            {
                Title = c.Title,
                Id = c.Id,
                Order = c.Order,
                BoardId = c.BoardId
            });
        }
        
        return Array.Empty<ColumnDto>();
    }

    public async Task AddColumn(Guid userId, ColumnDto column)
    {
        await columnsRepository.AddColumn(new Column
        {
            Title = column.Title,
            Order = column.Order,
            BoardId = column.BoardId,
            Id = column.Id
        });
    }

    public async Task DeleteColumn(Guid userId, Guid columnId)
    {
        var isUserOwns = await userService.IsUserColumnOwner(userId, columnId);

        if (isUserOwns)
            await columnsRepository.DeleteColumn(columnId);
    }

    public async Task UpdateColumn(Guid userId, ColumnDto column)
    {
        var isUserOwns = await userService.IsUserColumnOwner(userId, column.Id);

        if (isUserOwns)
            await columnsRepository.UpdateColumn(new Column
            {
                Id = column.Id, 
                Order = column.Order, 
                BoardId = column.BoardId,
                Title = column.Title
            });
    }

    public async Task UpdateColumnOrder(Guid userId, Guid columnId, string order)
    {
        var isUserOwns = await userService.IsUserColumnOwner(userId, columnId);

        if (isUserOwns)
            await columnsRepository.UpdateColumnOrder(columnId, order);
    }
}