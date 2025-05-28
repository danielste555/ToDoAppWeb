using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nom { get; set; }
    public string Prenom { get; set; }

    public string Email { get; set; }

    //public bool IsVerified { get; set; } = false;

    public string Numero { get; set; }

    public string MotDePasseHash { get; set; }

    public string? TokenHash { get; set; }

    public DateTime DateCreation { get; set; } = DateTime.UtcNow;

    public ICollection<Tache> Taches { get; set; } = new List<Tache>();
}

