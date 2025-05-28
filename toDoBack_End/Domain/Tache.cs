using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities;

public class Tache
{
    [Key]
    public Guid IdTache { get; set; }
    public Guid IdUser { get; set; }
    public User User { get; set; }

    public string Titre { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? DateEcheance { get; set; }
    public int? Priorite { get; set; }
    public string Statut { get; set; } = "À faire";
    public string? Commentaire { get; set; }

    public bool RappelActive { get; set; } = false;
    public DateTime? DateRappel { get; set; }

    public DateTime DateCreation { get; set; } = DateTime.Now;
    public DateTime? DateModification { get; set; }
}

