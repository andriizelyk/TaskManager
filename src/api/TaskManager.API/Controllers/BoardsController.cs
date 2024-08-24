using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.Dto.Requests;
using TaskManager.Services.Contracts;
using TaskManager.Services.Dto;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BoardsController(
    IBoardsService boardsService,
    IUserService userService)
    : BaseController(userService)
{
    private readonly IUserService _userService = userService;

    [HttpGet("get")]
    [Authorize]
    public async Task<IActionResult> GetBoards()
    {
        var userId = await GetUserId();

        if (userId == Guid.Empty)
        {
            userId = (await _userService.Create(new UserDto
            {
                Email = GetUserEmail(),
                Id = Guid.NewGuid(),
                Name = GetUserName()
            })).Id;
        }
        
        var boards = await boardsService.GetBoards(userId);
        
        return Ok(boards);
    }
    
    [HttpPut("add")]
    [Authorize]
    public async Task<IActionResult> AddBoard(BoardRequest board)
    {
        var userId = await GetUserId();

        if (userId == Guid.Empty)
        {
            return Unauthorized();
        }
        
        await boardsService.AddBoard(new BoardDto
        {
            Id = board.Id,
            Title = board.Title,
            UserId = userId
        });
        
        return Ok();
    }
    
    [HttpPost("update")]
    [Authorize]
    public async Task<IActionResult> UpdateBoard(BoardRequest board)
    {
        var userId = await GetUserId();

        if (userId == Guid.Empty)
        {
            return Unauthorized();
        }
        
        await boardsService.UpdateBoard(new BoardDto
        {
            Id = board.Id,
            Title = board.Title,
            UserId = userId
        });
        
        return Ok();
    }
}