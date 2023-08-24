using webserver;

class Program
{
    static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddCors();
        builder.Services.AddDbContext<AppDbContext>();
        builder.Services.AddSingleton<IAccountsRepository, AccountsRepository>();
        builder.Services.AddSingleton<IProjectsRepository, ProjectsRepository>();
        builder.Services.AddSingleton<IDocumentsRepository, DocumentsRepository>();

        builder.Services.AddSingleton<IAccountsRegister, AccountsRegister>();
        builder.Services.AddSingleton<IProjectsRegister, ProjectsRegister>();
        builder.Services.AddSingleton<IDocumentsRegister, DocumentsRegister>();

        builder.Services.AddSingleton<AccountsController>();
        builder.Services.AddSingleton<ProjectsController>();
        builder.Services.AddSingleton<DocumentsController>();

        builder.Services.AddSingleton<AppFacade>();
        
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

        // app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();

    }
}
