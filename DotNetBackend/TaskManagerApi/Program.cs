using Microsoft.EntityFrameworkCore;
using MyApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add CORS policy for React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Frontend origin
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add DbContext, Swagger, etc.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable CORS **before endpoints**
app.UseCors("AllowReactApp");

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// Remove or comment out this UNLESS you have authentication configured
// app.UseAuthorization();

app.MapControllers();

app.Run();
