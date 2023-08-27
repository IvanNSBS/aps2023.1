using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webserver.Migrations
{
    public partial class create_docs_service : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Projects_ProjectFK",
                table: "Documents");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropIndex(
                name: "IX_Documents_ProjectFK",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "LinkedDocuments",
                table: "Documents");

            migrationBuilder.RenameColumn(
                name: "ProjectFK",
                table: "Documents",
                newName: "ProjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProjectId",
                table: "Documents",
                newName: "ProjectFK");

            migrationBuilder.AddColumn<List<string>>(
                name: "LinkedDocuments",
                table: "Documents",
                type: "text[]",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    UserEmail = table.Column<string>(type: "text", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    OwnerFK = table.Column<string>(type: "text", nullable: false),
                    ProjectName = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_Accounts_OwnerFK",
                        column: x => x.OwnerFK,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Documents_ProjectFK",
                table: "Documents",
                column: "ProjectFK");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_OwnerFK",
                table: "Projects",
                column: "OwnerFK");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Projects_ProjectFK",
                table: "Documents",
                column: "ProjectFK",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
