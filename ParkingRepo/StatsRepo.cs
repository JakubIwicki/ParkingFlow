using Microsoft.AspNetCore.Http;
using ParkingDb.Models;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;
using Raven.Client.Documents.Session;

namespace ParkingRepo;

public class StatsRepo(IAsyncDocumentSession session)
    : Repository(session)
{
    private class MonthlyEarningsDto
    {
        public int Year { get; init; }
        public int Month { get; init; }
        public decimal TotalEarnings { get; init; }
    }

    //TODO:
    private IEnumerable<MonthlyEarningsDto> GetTotalEarningsQuery(int fromMonth, int fromYear, int toMonth, int toYear)
    {
        var fromDate = new DateTime(fromYear, fromMonth, 1);
        var toDate = new DateTime(toYear, toMonth, 1).AddMonths(1).AddDays(-1);

        try
        {
            var fees = Session.Query<ParkingFee>()
                .ToListAsync().Result //TMP
                .Where(fee => fee.ParkingDate >= fromDate && fee.ParkingDate <= toDate);

            var query = fees
                .GroupBy(fee => new { fee.ParkingDate.Year, fee.ParkingDate.Month })
                .Select(g => new MonthlyEarningsDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalEarnings = g.Sum(fee => fee.PaymentResult.AmountUsd)
                })
                .OrderByDescending(x => x.Year)
                .ThenByDescending(x => x.Month);

            return query;
        }
        catch (Exception ex)
        {
            return null!;
        }
    }

    public async Task<(DateTime monthYear, decimal totalEarnings)?> GetTotalEarningsAsync(
        int month, int year)
    {
        var selectQuery = GetTotalEarningsQuery(
            fromMonth: month,
            fromYear: year,
            toMonth: month,
            toYear: year);

        try
        {
            var result = selectQuery.FirstOrDefault();

            if (result is null)
                return null;

            var monthYear = new DateTime(result.Year, result.Month, 1);
            return (monthYear, result.TotalEarnings);
        }
        catch(Exception ex)
        {
            return null;
        }
    }

    public async Task<List<(DateTime monthYear, decimal totalEarnings)>> GetTotalEarningsListAsync(
        int fromMonth, int fromYear, int toMonth, int toYear)
    {
        try
        {
            var selectQuery = GetTotalEarningsQuery(
                fromMonth, fromYear,
                toMonth, toYear);

            var results = selectQuery.ToList();

            if (results is null or { Count: 0 })
                return [];

            return results.Select(c =>
                (new DateTime(c.Year, c.Month, 1), c.TotalEarnings)
            ).ToList();
        }
        catch
        {
            return [];
        }
        
    }
}
