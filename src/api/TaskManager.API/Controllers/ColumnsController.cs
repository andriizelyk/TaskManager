using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.Dto.Requests;
using TaskManager.API.Dto.Responses;
using TaskManager.Services.Contracts;
using TaskManager.Services.Dto;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ColumnsController(
    IColumnsService columnsService,
    IUserService userService,
    ILogger<ColumnsController> logger)
    : BaseController(userService)
{
    [HttpGet("get/{boardId}")]
    [Authorize]
    public async Task<ActionResult<ColumnResponse[]>> GetColumns(Guid boardId) 
    {
        try
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                return NotFound("User not found");
        
            var columns = await columnsService.GetColumns(userId, boardId);

            return Ok(columns);
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occured while getting columns");
            throw;
        }
    }

    [HttpPut("add")]
    [Authorize]
    public async Task<IActionResult> AddColumn([FromBody]ColumnRequest column) 
    {
        try
        {
            var userId = await GetUserId();

            if (userId == Guid.Empty)
                return NotFound("User not found");
        
            await columnsService.AddColumn(userId, new ColumnDto
            {
                BoardId = column.BoardId,
                Id = column.Id,
                Order = column.Order,
                Title = column.Title
            });

            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occured while adding columns");
            throw;
        }
        
    }

    [HttpPost("update")]
    [Authorize]
    public async Task<IActionResult> UpdateColumns(ColumnRequest column) 
    {
        try
        {
            var userId = await GetUserId();

            if (userId == Guid.Empty)
                return NotFound("User not found");
            
            await columnsService.UpdateColumn(userId, new ColumnDto
            {
                BoardId = column.BoardId, 
                Id = column.Id, 
                Order = column.Order,
                Title = column.Title
            });

            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occured while updating columns");
            throw;
        }
    }

    [HttpPost("update/order")]
    [Authorize]
    public async Task<IActionResult> UpdateColumnsOrder(Guid columnId, string order) 
    {
        try
        {
            var userId = await GetUserId();

            if (userId == Guid.Empty)
                return NotFound("User not found");
            
            await columnsService.UpdateColumnOrder(userId, columnId, order);

            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occured while updating column order");
            throw;
        }
    }

    [HttpDelete("delete/{columnId}")]
    [Authorize]
    public async Task<IActionResult> DeleteColumns(Guid columnId) 
    {
        try
        {
            var userId = await GetUserId();

            if (userId == Guid.Empty)
                return NotFound("User not found");
            
            await columnsService.DeleteColumn(userId, columnId);

            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occured while deleting columns");
            throw;
        }
    }
}