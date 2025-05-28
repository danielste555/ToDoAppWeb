using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{
    public interface ITacheService
    {
        Task<IEnumerable<TacheDto>> GetAllByUserAsync(Guid userId);
        Task<TacheDto?> GetByIdAsync(Guid id);
        Task<TacheDto> CreateAsync(CreateTacheDto dto);
        Task<bool> UpdateAsync(Guid id, UpdateTacheDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
