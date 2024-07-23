using DataLibrary.CustomerModel;
using DataLibrary.Data;
using DataLibrary.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace BlogAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CustomerInquiryController : ControllerBase
    {
        private readonly ICustomerInquiryService _db;

        public CustomerInquiryController(ICustomerInquiryService db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> CreateInquiry([FromForm] CustomerInquiry inquiry)
        {
            try
            {
                var inquiryId = _db.CreateInquiry(inquiry);
                if (inquiryId == 0)
                {
                    return BadRequest("Failed to create inquiry.");
                }

                return CreatedAtAction(nameof(GetInquiryById), new { id = inquiryId }, new { id = inquiryId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpGet("{id}")]
        public IActionResult GetInquiryById(int id)
        {
            try
            {
                var inquiry = _db.GetInquiryById(id);
                if (inquiry == null)
                {
                    return NotFound();
                }
                return Ok(inquiry);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public IActionResult GetAllInquiries()
        {
            try
            {
                var inquiries = _db.GetAllInquiries();
                return Ok(inquiries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}