using DataLibrary.Models;
using System.Collections.Generic;

namespace DataLibrary.Data
{
    public interface IOrderData
    {
        void CreateOrder(decimal totalAmount, string orderStatus, List<OrderDetailModel> orderDetails);
        IEnumerable<OrderModel> GetOrders();
        IEnumerable<OrderDetailModel> GetOrderDetails(int orderId);
        IEnumerable<dynamic> GetOrdersWithDetails();
        void UpdateOrderStatus(int orderId, string newStatus);
        void DeleteOrder(int orderId);
    }
}
