using DataLibrary.OnlineOrderModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLibrary.OnlineOrderData
{
    public interface IOnlineOrderService
    {
        Task<int> CreateOrderAsync(OnlineOrder order);
        Task<OnlineOrder> GetOrderAsync(int orderId);
        Task UpdateOrderStatusAsync(int orderId, string newStatus);
        Task<IEnumerable<OnlineOrder>> GetAllOrdersAsync();
        Task<IEnumerable<OnlineOrder>> GetFilteredOrdersAsync(string status);
        Task<bool> DeleteOrderAsync(int orderId); // Updated to be async
    }

}