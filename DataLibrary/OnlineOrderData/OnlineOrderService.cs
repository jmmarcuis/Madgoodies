using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using DataLibrary.Database;
using DataLibrary.OnlineOrderModels;
using Dapper;
using System.Data;

namespace DataLibrary.OnlineOrderData
{
    public class OnlineOrderService : IOnlineOrderService
    {
        private readonly ISqlDataAccess _db;
        public const string connectionStringName = "SqlDb";

        public OnlineOrderService(ISqlDataAccess db)
        {
            _db = db;
        }

        public async Task<int> CreateOrderAsync(OnlineOrder order)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@FirstName", order.FirstName);
            parameters.Add("@LastName", order.LastName);
            parameters.Add("@Address", order.Address);
            parameters.Add("@Apartment", order.Apartment);
            parameters.Add("@City", order.City);
            parameters.Add("@Province", order.Province);
            parameters.Add("@ZipCode", order.ZipCode);
            parameters.Add("@ContactNumber", order.ContactNumber);
            parameters.Add("@TotalAmount", order.TotalAmount);
            parameters.Add("@OrderID", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await _db.SaveDataAsync("dbo.spCreateOrder", parameters, connectionStringName, true);

            int orderId = parameters.Get<int>("@OrderID");

            foreach (var item in order.OrderItems)
            {
                await _db.SaveDataAsync(
                    "dbo.spCreateOrderItem",
                    new
                    {
                        OrderID = orderId,
                        item.ProductID,
                        item.ProductName,
                        item.Price,
                        item.Quantity,
                        item.PackagingID,
                        item.PackageQuantity
                    },
                    connectionStringName,
                    true
                );
            }

            return orderId;
        }


        public async Task<OnlineOrder> GetOrderAsync(int orderId)
        {
            var result = await Task.Run(() => _db.LoadData<OnlineOrder, dynamic>(
                "dbo.spGetOrder",
                new { OrderID = orderId },
                connectionStringName,
                true
            ));

            var order = result.FirstOrDefault();

            if (order != null)
            {
                order.OrderItems = await Task.Run(() => _db.LoadData<OrderItem, dynamic>(
                    "dbo.spGetOrderItems",
                    new { OrderID = orderId },
                    connectionStringName,
                    true
                ));
            }

            return order;
        }

        public async Task UpdateOrderStatusAsync(int orderId, string newStatus)
        {
            await Task.Run(() => _db.SaveData(
                "dbo.spUpdateOnlineOrderStatus",
                new { OrderID = orderId, NewStatus = newStatus },
                connectionStringName,
                true
            ));
        }

        public async Task<IEnumerable<OnlineOrder>> GetAllOrdersAsync()
        {
            return await Task.Run(() => _db.LoadData<OnlineOrder, dynamic>(
                "dbo.spGetAllOrders",
                new { },
                connectionStringName,
                true
            ));
        }

        public async Task<IEnumerable<OnlineOrder>> GetFilteredOrdersAsync(string status)
        {
            string sql = "dbo.spGetFilteredOrders";
            var parameters = new { Status = status };
            return await Task.Run(() => _db.LoadData<OnlineOrder, dynamic>(
                sql,
                parameters,
                connectionStringName,
                true
            ));
        }
        public async Task<bool> DeleteOrderAsync(int orderId)
        {
            try
            {
                await _db.SaveDataAsync("dbo.spDeleteOnlineOrder", new { OrderID = orderId }, connectionStringName, true);
                return true; // Return true if deletion was successful
            }
            catch
            {
                return false; // Return false if there was an error (e.g., order not found)
            }
        }

    }
}
