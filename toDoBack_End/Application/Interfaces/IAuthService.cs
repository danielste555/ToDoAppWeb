using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(string nom, string prenom, string numero, string email, string motDePasse);
        Task<string?> LoginAsync(string username, string password);
    }
}
