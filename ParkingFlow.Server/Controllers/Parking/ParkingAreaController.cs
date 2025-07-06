using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParkingDb.Models;
using ParkingRepo;
using Raven.Client.Documents.Session;

namespace ParkingFlow.Server.Controllers.Parking;

[ApiController]
[Route("api/parking_area")]
[Authorize]
public class ParkingAreaController(IAsyncDocumentSession session)
    : ControllerBase
{
    private readonly BaseRepo<ParkingArea, string> _parkingRepo = new(session);
    private readonly BaseRepo<ParkingFee, string> _parkingFeeRepo = new(session);

    private static string? RunChecks(ParkingArea area)
    {
        if (string.IsNullOrEmpty(area.Name))
            return "Parking area name is required.";

        if (area.WeekdaysHourlyRateUsd < 0 || area.WeekendHourlyRateUsd < 0)
            return "Hourly rates must be non-negative.";

        return null;
    }


    [HttpGet]
    public async Task<ActionResult<List<ParkingArea>>> GetAll()
    {
        try
        {
            return await _parkingRepo.GetAllAsync();
        }
        catch
        {
            return StatusCode(500, "An error occurred while retrieving parking areas.");
        }
    }

    [HttpGet("{id}/parking_fees")]
    public async Task<ActionResult<List<ParkingFee>>> GetParkingFees(string id)
    {
        try
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest("Parking area ID cannot be null or empty.");

            var decodedId = WebUtility.UrlDecode(id);

            var parkingFees = await _parkingFeeRepo.GetAllAsync(
                c => c.ParkingAreaId == decodedId);

            return Ok(parkingFees);
        }
        catch
        {
            return StatusCode(500, "An error occurred while retrieving parking fees for the area.");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ParkingArea>> Get(string id)
    {
        try
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest("Parking area ID cannot be null or empty.");

            var decodedId = WebUtility.UrlDecode(id);

            var area = await _parkingRepo.GetAsync(decodedId);

            if (area is null)
                return NotFound();

            return Ok(area);
        }
        catch
        {
            return StatusCode(500, "An error occurred while retrieving the parking area.");
        }
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] ParkingArea area)
    {
        try
        {
            var checks = RunChecks(area);
            if (checks is not null)
                return BadRequest(checks);

            await _parkingRepo.AddAsync(area);
            return Ok(area);
        }
        catch
        {
            return StatusCode(500, "An error occured while creating the parking area.");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(string id, [FromBody] ParkingArea updatedArea)
    {
        try
        {
            var decodedId = WebUtility.UrlDecode(id);

            if (decodedId != updatedArea.Id)
                return BadRequest();

            var checks = RunChecks(updatedArea);
            if (checks is not null)
                return BadRequest(checks);

            var exist = await _parkingRepo.GetAsync(decodedId);
            if (exist is null)
                return NotFound();

            await _parkingRepo.UpdateAsync(updatedArea);
            return NoContent();
        }
        catch
        {
            return StatusCode(500, "An error occured while updating the parking area.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        try
        {
            var decodedId = WebUtility.UrlDecode(id);

            var exist = await _parkingRepo.GetAsync(decodedId);
            if (exist is null)
                return NotFound();

            var deleted = await _parkingRepo.DeleteAsync(decodedId);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
        catch
        {
            return StatusCode(500, "An error occurred while deleting the parking area.");
        }
    }
}
