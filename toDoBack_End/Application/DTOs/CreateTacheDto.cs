using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class CreateTacheDto
    {
        public Guid IdUser { get; set; }
        public string Titre { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DateEcheance { get; set; }
        public int? Priorite { get; set; }
        public string? Commentaire { get; set; }
        public bool RappelActive { get; set; }
        public DateTime? DateRappel { get; set; }
    }
}
