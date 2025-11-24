using System;

namespace MyApp.Models
{
    public class TodoUser
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
