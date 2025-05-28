using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

public class TacheService : ITacheService
{
    private readonly AppDbContext _context;

    public TacheService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TacheDto> CreateAsync(CreateTacheDto dto)
    {
        //Creation d'une instance de tache
        var tache = new Tache
        {
            IdTache = Guid.NewGuid(),
            IdUser = dto.IdUser,
            Titre = dto.Titre,
            Description = dto.Description,
            DateEcheance = dto.DateEcheance,
            Priorite = dto.Priorite,
            Commentaire = dto.Commentaire,
            RappelActive = dto.RappelActive,
            DateRappel = dto.DateRappel,
            DateCreation = DateTime.Now
        };

        //Ajout et sauvegarde
        _context.Taches.Add(tache);
        await _context.SaveChangesAsync();

        return MapToDto(tache);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        //Recherche Si la tache existe et delete, sinon retourner false
        var tache = await _context.Taches.FindAsync(id);
        if (tache == null) return false;

        _context.Taches.Remove(tache);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<TacheDto>> GetAllByUserAsync(Guid userId)
    {
        //Chercher toutes les taches d'un utilisateur
        var taches = await _context.Taches
        .Where(t => t.IdUser == userId) //LinQ pour ne prendre que les taches de l'utilisateur
        .ToListAsync();

        return taches.Select(t => MapToDto(t)).ToList(); // mapping en mémoire



    }

    public async Task<TacheDto?> GetByIdAsync(Guid id)
    {
        //Chercher une tache
        var tache = await _context.Taches.FindAsync(id);
        return tache is null ? null : MapToDto(tache);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateTacheDto dto)
    {
        var tache = await _context.Taches.FindAsync(id);
        if (tache == null) return false;

        tache.Titre = dto.Titre;
        tache.Description = dto.Description;
        tache.DateEcheance = dto.DateEcheance;
        tache.Priorite = dto.Priorite;
        tache.Statut = dto.Statut ?? tache.Statut;
        tache.Commentaire = dto.Commentaire;
        tache.RappelActive = dto.RappelActive;
        tache.DateRappel = dto.DateRappel;
        tache.DateModification = DateTime.Now;

        await _context.SaveChangesAsync();
        return true;
    }

    private TacheDto MapToDto(Tache t) => new TacheDto
    {
        //Transformer une tache en TacheDTo
        IdTache = t.IdTache,
        Titre = t.Titre,
        Description = t.Description,
        DateEcheance = t.DateEcheance,
        Priorite = t.Priorite,
        Statut = t.Statut,
        Commentaire = t.Commentaire,
        RappelActive = t.RappelActive,
        DateRappel = t.DateRappel,
        DateCreation = t.DateCreation,
        DateModification = t.DateModification
    };
}
