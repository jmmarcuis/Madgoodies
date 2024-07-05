using DataLibrary.Data;
using DataLibrary.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ISqlData _db;

        public OrdersController(ISqlData db)
        {
            _db = db;
        }

        [HttpPost("confirm")]
        public IActionResult ConfirmOrder([FromBody] OrderRequest request)
        {
            try
            {
                _db.CreateOrder(request.TotalAmount, request.IsFulfilled, request.OrderDetails);
                return Ok("Order confirmed successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            try
            {
                var orders = _db.GetOrders();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{orderId}")]
        public IActionResult GetOrderDetails(int orderId)
        {
            try
            {
                var orderDetails = _db.GetOrderDetails(orderId);
                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
