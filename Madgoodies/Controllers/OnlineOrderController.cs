using DataLibrary.OnlineOrderData;
using DataLibrary.OnlineOrderModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Madgoodies.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OnlineOrderController : ControllerBase
    {
        private readonly IOnlineOrderService _orderService;

        public OnlineOrderController(IOnlineOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OnlineOrder order)
        {
            try
            {
                int orderId = await _orderService.CreateOrderAsync(order);
                return Ok(new { OrderID = orderId, Message = "Order created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            try
            {
                var order = await _orderService.GetOrderAsync(id);
                if (order == null)
                    return NotFound();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string newStatus)
        {
            try
            {
                await _orderService.UpdateOrderStatusAsync(id, newStatus);
                return Ok($"Order status updated to {newStatus}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllGood()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpGet("filtered")]
        public async Task<IActionResult> GetAllFilteredGood([FromQuery] string status = null)
        {
            try
            {
                var orders = await _orderService.GetFilteredOrdersAsync(status);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var isDeleted = await _orderService.DeleteOrderAsync(id);
                if (!isDeleted)
                    return NotFound($"Order with ID {id} not found.");

                return Ok($"Order with ID {id} deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
