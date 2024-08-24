using Microsoft.AspNetCore.Mvc;
using TaskManager.DAL.Repository;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InfraController(DatabaseSeeder seeder) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        seeder.Seed();
        
        return Ok();
    }
}