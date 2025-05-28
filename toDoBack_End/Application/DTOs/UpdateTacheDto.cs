using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs;

public class UpdateTacheDto
{
    public string Titre { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? DateEcheance { get; set; }
    public int? Priorite { get; set; }
    public string? Statut { get; set; }
    public string? Commentaire { get; set; }
    public bool RappelActive { get; set; }
    public DateTime? DateRappel { get; set; }
}

