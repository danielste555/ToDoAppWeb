using System.Security.Claims;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("task/[controller]")]
public class TachesController : ControllerBase
{
    private readonly ITacheService _tacheService;

    public TachesController(ITacheService tacheService)
    {
        _tacheService = tacheService;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUser(Guid userId)
    {
        var result = await _tacheService.GetAllByUserAsync(userId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var result = await _tacheService.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTacheDto dto)
    {
        //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //if (userId == null) return Unauthorized();

        //var idUser = Guid.Parse(userId);
        var created = await _tacheService.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.IdTache }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTacheDto dto)
    {
        var success = await _tacheService.UpdateAsync(id, dto);
        return success ? Ok("Update Success") : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _tacheService.DeleteAsync(id);
        return success ? Ok("Delete Success") : NotFound();
    }
}
