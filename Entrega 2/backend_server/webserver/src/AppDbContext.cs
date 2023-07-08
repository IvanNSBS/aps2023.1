using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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

    public DbSet<Account> Accounts { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Document> Documents { get; set; }
}