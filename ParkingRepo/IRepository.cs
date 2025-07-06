using System.Linq.Expressions;
using ParkingDb.Models;

namespace ParkingRepo;

public interface IRepository<TDbObject, in TDbObjectId>
    where TDbObject : DbObject<TDbObjectId>
    where TDbObjectId : IEquatable<TDbObjectId>
{
    Task<TDbObject?> GetAsync(TDbObjectId id);
    Task<List<TDbObject>> GetAllAsync();
    Task AddAsync(TDbObject entity);
    Task UpdateAsync(TDbObject entity);
    Task<bool> DeleteAsync(TDbObjectId id);
    Task<int> CountAsync();
    Task<int> CountAsync(Expression<Func<TDbObject, bool>> predicate);
}