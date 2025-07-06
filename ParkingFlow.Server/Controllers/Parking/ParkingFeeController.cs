using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParkingDb.Models;
using ParkingRepo;
using Raven.Client.Documents.Session;

namespace ParkingFlow.Server.Controllers.Parking;

[ApiController]
[Route("api/parking_fee")]
[Authorize]
public class ParkingFeeController(IAsyncDocumentSession session)
    : ControllerBase
{
    private readonly BaseRepo<ParkingFee, string> _feeRepo = new(session);
    private static string? RunChecks(ParkingFee fee)
    {
        if (string.IsNullOrEmpty(fee.ParkingAreaId))
            return "Parking area ID is required.";

        if (fee.StartTime >= fee.EndTime)
            return "Start time must be before end time.";

        if (fee.ParkingDate == default)
            return "Parking date is required.";

        return null;
    }

    [HttpGet]
    public async Task<ActionResult<List<ParkingFee>>> GetAll()
    {
        try
        {
            return await _feeRepo.GetAllAsync();
        }
        catch
        {
            return StatusCode(500, "An error occurred while retrieving parking fee.");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ParkingArea>> Get(string id)
    {
        try
        {
            var decodedId = WebUtility.UrlDecode(id);

            var area = await _feeRepo.GetAsync(decodedId);

            if (area is null)
                return NotFound();

            return Ok(area);
        }
        catch
        {
            return StatusCode(500, "An error occurred while retrieving the parking fee.");
        }
    }

    [HttpPost]
    public async Task<ActionResult> Create(ParkingFee fee)
    {
        try
        {
            var checks = RunChecks(fee);
            if (checks is not null)
                return BadRequest(checks);

            await _feeRepo.AddAsync(fee);
            return Ok(fee);
        }
        catch
        {
            return StatusCode(500, "An error occured while creating the parking fee.");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(string id, [FromBody] ParkingFee updatedFee)
    {
        try
        {
            var decodedId = WebUtility.UrlDecode(id);

            if (decodedId != updatedFee.Id)
                return BadRequest();

            var checks = RunChecks(updatedFee);
            if (checks is not null)
                return BadRequest(checks);

            var exist = await _feeRepo.GetAsync(decodedId);
            if (exist is null)
                return NotFound();

            await _feeRepo.UpdateAsync(updatedFee);
            return NoContent();
        }
        catch
        {
            return StatusCode(500, "An error occured while updating the parking fee.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        try
        {
            var decodedId = WebUtility.UrlDecode(id);

            var exist = await _feeRepo.GetAsync(decodedId);
            if (exist is null)
                return NotFound();

            var deleted = await _feeRepo.DeleteAsync(decodedId);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
        catch
        {
            return StatusCode(500, "An error occurred while deleting the parking fee.");
        }
    }

}