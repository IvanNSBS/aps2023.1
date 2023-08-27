using webserver;

class Program
{
    static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddCors();
        builder.Services.AddDbContext<AppDbContext>();

        builder.Services.AddSingleton<IUsersRepository, UsersRepository>();
        builder.Services.AddSingleton<IUsersRegistor, UsersRegistor>();
        builder.Services.AddSingleton<ISessionRepository, SessionRepository>();
        builder.Services.AddSingleton<ISessionRegistor, SessionRegistor>();

        builder.Services.AddSingleton<AccessController>();

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();
        app.UseCors(builder =>
        {
            builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
        });

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseAuthorization();
        app.MapControllers();
        app.Run();
    }
}
