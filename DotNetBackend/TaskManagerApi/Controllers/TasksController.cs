using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.Data;
using MyApp.Models;

namespace MyApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/tasks/1  => All tasks for user
    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<TodoTask>>> GetTasks(int userId)
    {
        var tasks = await _context.TodoTasks
            .Where(t => t.UserId == userId)
            .ToListAsync();

        if (!tasks.Any())
            return NotFound(new { message = "No tasks found for this user" });

        return Ok(tasks);
    }

    // GET: api/tasks/pending/1
    [HttpGet("pending/{userId}")]
    public async Task<ActionResult<IEnumerable<TodoTask>>> GetPendingTasks(int userId)
    {
        var tasks = await _context.TodoTasks
            .Where(t => t.UserId == userId && t.Status == "pending")
            .ToListAsync();

        if (!tasks.Any())
            return NotFound(new { message = "No pending tasks found" });

        return Ok(tasks);
    }

    // GET: api/tasks/completed/1
    [HttpGet("completed/{userId}")]
    public async Task<ActionResult<IEnumerable<TodoTask>>> GetCompletedTasks(int userId)
    {
        var tasks = await _context.TodoTasks
            .Where(t => t.UserId == userId && t.Status == "completed")
            .ToListAsync();

        if (!tasks.Any())
            return NotFound(new { message = "No completed tasks found" });

        return Ok(tasks);
    }

    // POST: api/tasks/add
    [HttpPost("add")]
    public async Task<IActionResult> AddTask([FromBody] TodoTask task)
    {
        task.CreatedAt = DateTime.UtcNow;
        task.UpdatedAt = DateTime.UtcNow;

        _context.TodoTasks.Add(task);
        await _context.SaveChangesAsync();

        return Ok(task);
    }

    // PATCH: api/tasks/updatestatus/5
    [HttpPatch("updatestatus/{id}")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] TodoTask updatedTask)
    {
        var task = await _context.TodoTasks.FindAsync(id);
        if (task == null) return NotFound();

        if (!new[] { "pending", "completed" }.Contains(updatedTask.Status))
            return BadRequest(new { message = "Invalid status" });

        task.Status = updatedTask.Status;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Status updated", status = task.Status });
    }

    // PUT: api/tasks/5
[HttpPut("{id}")]
public async Task<IActionResult> UpdateTask(int id, [FromBody] TodoTask updatedTask)
{
    var task = await _context.TodoTasks.FindAsync(id);
    if (task == null) return NotFound(new { message = "Task not found" });

    // Update fields
    task.Title = updatedTask.Title;
    task.Description = updatedTask.Description;
    task.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();
    return Ok(new { message = "Task updated successfully", task });
}


    // DELETE: api/tasks/5/1
    [HttpDelete("{taskId}/{userId}")]
    public async Task<IActionResult> DeleteTask(int taskId, int userId)
    {
        var task = await _context.TodoTasks
            .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

        if (task == null) return NotFound();

        _context.TodoTasks.Remove(task);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Task deleted successfully" });
    }
}
