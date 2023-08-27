using Microsoft.EntityFrameworkCore;
using webserver;

public class AppDbContext : DbContext
{
    protected readonly IConfiguration Configuration;
    public AppDbContext(IConfiguration config) => Configuration = config;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    { 
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseNpgsql(Configuration.GetConnectionString("WebApiDatabase"));
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Session> Sessions { get; set; }
}