using DataLibrary.Data;
using DataLibrary.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoodController : ControllerBase
    {
        private readonly ISqlData _db;

        public GoodController(ISqlData db)
        {
            _db = db;
        }

        [HttpPost]
        [Route("add")]
        public IActionResult AddGood([FromBody] CreateGood good)
        {
            try
            {
                _db.AddGood(good.ProductName, good.Price, good.Stock, good.Description);
                return Ok("Good added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
