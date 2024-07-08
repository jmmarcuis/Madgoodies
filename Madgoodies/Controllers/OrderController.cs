using DataLibrary.Data;
using DataLibrary.Models;
using DataLibrary.Models.DataLibrary.Models;
using Microsoft.AspNetCore.Mvc;
using System;

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
                _db.CreateOrder(request.TotalAmount, request.OrderStatus, request.OrderDetails);
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

        [HttpGet("withdetails")]
        public IActionResult GetOrdersWithDetails()
        {
            try
            {
                var ordersWithDetails = _db.GetOrdersWithDetails();
                return Ok(ordersWithDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPut("status")]
        public IActionResult UpdateOrderStatus([FromBody] UpdateOrderStatusRequest request)
        {
            try
            {
                _db.UpdateOrderStatus(request.OrderID, request.NewStatus);
                return Ok($"Order status updated successfully for Order ID: {request.OrderID}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

   [HttpDelete("{orderId}")]
public IActionResult DeleteOrder(int orderId)
{
    try
    {
        _db.DeleteOrder(orderId);
        return Ok($"Order with ID {orderId} deleted successfully.");
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}
    }

}
