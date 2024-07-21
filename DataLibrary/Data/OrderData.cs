using DataLibrary.Database;
using DataLibrary.Models;
using System.Collections.Generic;
using System.Linq;

namespace DataLibrary.Data
{
    public class OrderData : IOrderData
    {
        private readonly ISqlDataAccess _db;
        public const string connectionStringName = "SqlDb";

        public OrderData(ISqlDataAccess db)
        {
            _db = db;
        }

        public void CreateOrder(decimal totalAmount, string orderStatus, List<OrderDetailModel> orderDetails)
        {
            var orderId = _db.LoadData<int, dynamic>("dbo.spInsertOrder",
                new { TotalAmount = totalAmount, OrderStatus = orderStatus }, connectionStringName, true).FirstOrDefault();

            foreach (var detail in orderDetails)
            {
                _db.SaveData("dbo.spInsertOrderDetail",
                    new { OrderID = orderId, ProductID = detail.ProductID, detail.ProductName, Quantity = detail.Quantity, Price = detail.Price },
                    connectionStringName, true);

                _db.SaveData("dbo.spUpdateProductStock",
                    new { ProductID = detail.ProductID, Quantity = detail.Quantity },
                    connectionStringName, true);
            }
        }

        public IEnumerable<OrderModel> GetOrders()
        {
            return _db.LoadData<OrderModel, dynamic>("dbo.spGetOrders", new { }, connectionStringName, true);
        }

        public IEnumerable<OrderDetailModel> GetOrderDetails(int orderId)
        {
            return _db.LoadData<OrderDetailModel, dynamic>("dbo.spGetOrderDetails",
                new { OrderID = orderId }, connectionStringName, true);
        }

        public IEnumerable<dynamic> GetOrdersWithDetails()
        {
            var orders = GetOrders();
            var ordersWithDetails = orders.Select(order =>
            {
                var details = GetOrderDetails(order.OrderID);
                return new
                {
                    order.OrderID,
                    order.OrderDate,
                    order.TotalAmount,
                    order.orderStatus,
                    OrderDetails = details
                };
            });
            return ordersWithDetails;
        }

        public void UpdateOrderStatus(int orderId, string newStatus)
        {
            _db.SaveData("dbo.spUpdateOrderStatus",
                new { OrderID = orderId, NewStatus = newStatus },
                connectionStringName,
                true);
        }

        public void DeleteOrder(int orderId)
        {
            _db.SaveData("dbo.spDeleteOrder",
                new { OrderID = orderId },
                connectionStringName,
                true);
        }
    }
}
