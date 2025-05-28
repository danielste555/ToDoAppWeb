using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class createTaskupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Taches_IdUser",
                table: "Taches",
                column: "IdUser");

            migrationBuilder.AddForeignKey(
                name: "FK_Taches_Users_IdUser",
                table: "Taches",
                column: "IdUser",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Taches_Users_IdUser",
                table: "Taches");

            migrationBuilder.DropIndex(
                name: "IX_Taches_IdUser",
                table: "Taches");
        }
    }
}
