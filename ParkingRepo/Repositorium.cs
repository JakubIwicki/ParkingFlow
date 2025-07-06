using Raven.Client.Documents.Session;

namespace ParkingRepo;

public abstract class Repository(IAsyncDocumentSession session)
{
    protected IAsyncDocumentSession Session { get; } = session;
}