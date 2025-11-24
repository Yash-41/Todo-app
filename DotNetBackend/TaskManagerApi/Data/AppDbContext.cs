using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyApp.Models;

namespace MyApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<TodoUser> Users { get; set; } = null!;
        public DbSet<TodoTask> TodoTasks { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // -----------------------------
            // Map TodoUser
            // -----------------------------
            modelBuilder.Entity<TodoUser>(entity =>
            {
                entity.ToTable("todo_users");
                entity.HasKey(u => u.Id);

                entity.Property(u => u.Id).HasColumnName("id");
                entity.Property(u => u.Name).HasColumnName("name");
                entity.Property(u => u.Email).HasColumnName("email");
                entity.Property(u => u.Password).HasColumnName("password");
                entity.Property(u => u.CreatedAt).HasColumnName("created_at");
                // Removed UpdatedAt mapping
            });

            // -----------------------------
            // Map TodoTask
            // -----------------------------
            modelBuilder.Entity<TodoTask>(entity =>
            {
                entity.ToTable("todo_tasks");
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Id).HasColumnName("id");
                entity.Property(t => t.UserId).HasColumnName("user_id");
                entity.Property(t => t.Title).HasColumnName("title");
                entity.Property(t => t.Description).HasColumnName("description");
                entity.Property(t => t.Status).HasColumnName("status");
                entity.Property(t => t.CreatedAt).HasColumnName("created_at");
                entity.Property(t => t.UpdatedAt).HasColumnName("updated_at");
            });

            // -----------------------------
            // Convert DateTime to UTC
            // -----------------------------
            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var prop in entity.GetProperties())
                {
                    if (prop.ClrType == typeof(DateTime))
                        prop.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}
