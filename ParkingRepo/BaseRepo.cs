using System.Linq.Expressions;
using ParkingDb.Models;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;

namespace ParkingRepo;

public class BaseRepo<TDbObject, TDbObjectId>(IAsyncDocumentSession session)
    : Repository(session), IRepository<TDbObject, TDbObjectId>
    where TDbObject : DbObject<TDbObjectId>
    where TDbObjectId : IEquatable<TDbObjectId>
{
    public async Task<TDbObject?> GetAsync(TDbObjectId id)
    {
        return await Session.LoadAsync<TDbObject>(id.ToString());
    }

    public async Task<List<TDbObject>> GetAllAsync()
    {
        return await Session.Query<TDbObject>()
            .ToListAsync();
    }

    public async Task<List<TDbObject>> GetAllAsync(Expression<Func<TDbObject, bool>> predicate)
    {
        return await Session.Query<TDbObject>()
            .Where(predicate)
            .ToListAsync();
    }

    public async Task AddAsync(TDbObject entity)
    {
        await Session.StoreAsync(entity: entity);
        await Session.SaveChangesAsync();
    }

    public async Task UpdateAsync(TDbObject entity)
    {
        var existing = await Session.LoadAsync<TDbObject>(entity.Id?.ToString());

        if (existing is null)
            throw new InvalidOperationException($"Entity with ID {entity.Id} does not exist.");

        var props = typeof(TDbObject).GetProperties()
            .Where(prop => prop.CanWrite
                           && prop.Name != nameof(DbObject<TDbObjectId>.Id));

        foreach (var prop in props)
        {
            var value = prop.GetValue(entity);
            if (value is null)
                continue;
            prop.SetValue(existing, value);
        }

        await Session.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(TDbObjectId id)
    {
        var foundEntity = await Session.LoadAsync<TDbObject>(id.ToString());

        if (foundEntity is null)
            return false;

        Session.Delete(foundEntity);
        await Session.SaveChangesAsync();
        return true;
    }

    public Task<int> CountAsync()
    {
        return Session.Query<TDbObject>()
            .CountAsync();
    }

    public async Task<int> CountAsync(Expression<Func<TDbObject, bool>> predicate)
    {
        return await Session.Query<TDbObject>()
            .Where(predicate)
            .CountAsync();
    }
}