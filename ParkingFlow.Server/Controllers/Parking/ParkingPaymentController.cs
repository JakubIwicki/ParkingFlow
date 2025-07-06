using System.Net;
using CurrencyApi;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParkingDb.Models;
using ParkingFlow.Server.Dto;
using System.Net.Http;
using ParkingRepo;
using Raven.Client.Documents.Session;

namespace ParkingFlow.Server.Controllers.Parking;

[ApiController]
[Route("api/parking_payment")]
[Authorize]
public class ParkingPaymentController(
    ICurrencyHost currencyHost,
    IAsyncDocumentSession session) : ControllerBase
{
    private readonly BaseRepo<ParkingArea, string> _parkingRepo = new(session);

    [HttpGet("{id}/calculate")]
    public async Task<ActionResult<PaymentResult>> CalculatePayment(
        string id,
        DateTime startTime,
        DateTime endTime,
        DateTime date)
    {
        var decodedId = WebUtility.UrlDecode(id);

        var area = await _parkingRepo.GetAsync(decodedId);

        if (area is null)
            return NotFound("Parking area not found.");

        var totalHours = (decimal)(endTime - startTime).TotalHours;

        if (totalHours <= 0)
            return BadRequest("Invalid parking duration.");

        var isWeekend = date.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday;
        var baseRateInUsd = isWeekend ? area.WeekendHourlyRateUsd : area.WeekdaysHourlyRateUsd;
        var discountFactor = 1 - (decimal)(area.DiscountPercentage / 100.0);

        Dictionary<string, decimal> rates;

        try
        {
            var exchangeRatesService = await currencyHost.GetHistorical(date);

            rates = ExchangeRatesCalculator.ConvertAmountToCurrencies(
                amount: baseRateInUsd,
                exchangeRatesResponse: exchangeRatesService);
        }
        catch
        {
            return StatusCode(503, "Failed to retrieve exchange rates.");
        }

        try
        {
            var priceOutputs = new Dictionary<string, decimal>();
            foreach (var (name, rate) in rates)
            {
                var total = ExchangeRatesCalculator.Calculate(
                    baseRate: baseRateInUsd,
                    rate: rate,
                    totalHours: totalHours,
                    discountFactor: discountFactor);

                priceOutputs[name] = total;
            }

            return Ok(priceOutputs);
        }
        catch
        {
            return StatusCode(500, "An error occured when calculating payment preview.");
        }
    }
}