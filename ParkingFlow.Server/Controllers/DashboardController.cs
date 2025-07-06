using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParkingDb.Models;
using ParkingFlow.Server.Dto;
using ParkingRepo;
using Raven.Client.Documents.Session;

namespace ParkingFlow.Server.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController(
    IAsyncDocumentSession session)
    : ControllerBase
{
    private readonly BaseRepo<ParkingArea, string> _parkingAreaRepo = new(session);
    private readonly BaseRepo<ParkingFee, string> _parkingFeeRepo = new(session);
    private readonly StatsRepo _statsRepo = new(session);

    [HttpGet]
    public async Task<IActionResult> GetDashboardData()
    {
        try
        {
            var data = await GetDashboardDataFromDb();

            return Ok(data);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while retrieving dashboard data: {ex.Message}");
        }

        async Task<DashboardData> GetDashboardDataFromDb()
        {
            var now = DateTime.Now;
            var monthAgo = now.AddMonths(-1);
            var sixMonthsAgo = now.AddMonths(-6);

            var totalParkingAreas = await _parkingAreaRepo.CountAsync();
            var totalParkingFees = await _parkingFeeRepo.CountAsync();
            var totalParkingAreasActive = await _parkingAreaRepo.CountAsync(area => area.IsActive);

            var lastMonthEarningsTotalInfo = await _statsRepo.GetTotalEarningsAsync(
                month: monthAgo.Month,
                year: monthAgo.Year);
            var lastMonthEarningsTotalUsd = lastMonthEarningsTotalInfo?.totalEarnings ?? 0;

            var currentMonthEarningTotalInfo = await _statsRepo.GetTotalEarningsAsync(
                month: now.Month,
                year: now.Year);
            var currentMonthEarningsTotalUsd = currentMonthEarningTotalInfo?.totalEarnings ?? 0;

            var parkingHistoryPayments = await _statsRepo
                .GetTotalEarningsListAsync(
                    fromMonth: sixMonthsAgo.Month, 
                    fromYear: sixMonthsAgo.Year, 
                    toMonth: now.Month, 
                    toYear: now.Year);

            var dashboardData = new DashboardData
            {
                TotalParkingAreas = totalParkingAreas,
                TotalParkingFees = totalParkingFees,
                TotalParkingAreasActive = totalParkingAreasActive,
                LastMonthEarningsTotalUsd = lastMonthEarningsTotalUsd,
                CurrentMonthEarningsTotalUsd = currentMonthEarningsTotalUsd,

                ParkingHistoryPayments = parkingHistoryPayments
                    .Select(c => new ParkingHistoryPayment
                    {
                        Month = c.monthYear.Month,
                        Year = c.monthYear.Year,
                        AmountInUsd = c.totalEarnings
                    })
                    .ToList()
            };

            return dashboardData;
        }
    }
}