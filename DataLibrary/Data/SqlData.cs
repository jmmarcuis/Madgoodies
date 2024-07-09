using DataLibrary.Database;
using DataLibrary.Models;
using System.Collections.Generic;
using System.Linq;

namespace DataLibrary.Data
{
    public class SqlData : ISqlData
    {
        private readonly ISqlDataAccess _db;
        public const string connectionStringName = "SqlDb";

        public SqlData(ISqlDataAccess db)
        {
            _db = db;
        }

        public UserModel Authenticate(string username, string password)
        {
            UserModel result = _db.LoadData<UserModel, dynamic>("dbo.spUsers_Authenticate",
                new { username, password }, connectionStringName, true).FirstOrDefault();

            return result;
        }
           public IEnumerable<UserModel> GetUsers()
    {
        return _db.LoadData<UserModel, dynamic>("dbo.spGetUsers", new { }, connectionStringName, true);
    }

        public void Register(string username, string firstName, string lastName, string password)
        {
            _db.SaveData<dynamic>(
                "dbo.spUsers_Register",
                new { username, firstName, lastName, password },
                connectionStringName,
                true);
        }
         public AdminModel AuthenticateSuperAdmin(string username, string password)
    {
        AdminModel admin = _db.LoadData<AdminModel, dynamic>("dbo.spSuperAdmin_Authenticate",
            new { username, password }, connectionStringName, true).FirstOrDefault();

        return admin;
    }


        public bool UserExists(string username, string firstName, string lastName)
        {
            string sql = "SELECT COUNT(1) FROM Users WHERE UserName = @UserName OR (FirstName = @FirstName AND LastName = @LastName)";
            return _db.LoadData<int, dynamic>(sql, new { UserName = username, FirstName = firstName, LastName = lastName }, connectionStringName, true).FirstOrDefault() > 0;
        }

        public void AddGood(string productImageUrl, string productName, decimal price, int stock, string description)
        {
            _db.SaveData("dbo.spAddGoods",
              new
              {
                  productImageUrl,
                  productName,
                  price,
                  stock,
                  description,
              },
              connectionStringName,
              true);
        }

        public void DeleteGood(int productID)
        {
            _db.SaveData("dbo.spDeleteGood",
              new { ProductID = productID },
              connectionStringName,
              true);
        }


        public IEnumerable<ListGoods> GetAllGoods()
        {
            return _db.LoadData<ListGoods, dynamic>("dbo.spGetAllGoods", new { }, connectionStringName, true);
        }

        public void UpdateGoodDetails(int productID, string productName, decimal price, int stock, string description)
        {
            _db.SaveData("dbo.spUpdateGoodDetails",
              new
              {
                  ProductID = productID,
                  ProductName = productName,
                  Price = price,
                  Stock = stock,
                  Description = description
              },
              connectionStringName,
              true);
        }

        public void UpdateGoodImage(int productID, string productImageUrl)
        {
            _db.SaveData("dbo.spUpdateGoodImage",
              new
              {
                  ProductID = productID,
                  ProductImageUrl = productImageUrl
              },
              connectionStringName,
              true);
        }

        public ListGoods GetGoodById(int productID)
        {
            return _db.LoadData<ListGoods, dynamic>(
                "dbo.spGetGoodById",
                new { ProductID = productID },
                connectionStringName,
                true).FirstOrDefault();
        }

        public void CreateOrder(decimal totalAmount, string orderStatus, List<OrderDetailModel> orderDetails)
        {
            // Insert the order and get the new OrderID
            var orderId = _db.LoadData<int, dynamic>("dbo.spInsertOrder",
                new { TotalAmount = totalAmount, OrderStatus = orderStatus }, connectionStringName, true).FirstOrDefault();

            // Insert each order detail
            foreach (var detail in orderDetails)
            {
                _db.SaveData("dbo.spInsertOrderDetail",
                    new { OrderID = orderId, ProductID = detail.ProductID, detail.ProductName, Quantity = detail.Quantity, Price = detail.Price },
                    connectionStringName, true);

                // Update the stock for each product (if you want to keep this functionality)
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

        public void AddUser(UserModel user)
        {
            _db.SaveData("dbo.spAddUser",
                new { user.UserName, user.FirstName, user.LastName, user.Password },
                connectionStringName,
                true);
        }

        public void UpdateUser(UserModel user)
        {
            _db.SaveData("dbo.spUpdateUser",
                new { user.Id, user.UserName, user.FirstName, user.LastName, user.Password },
                connectionStringName,
                true);
        }

        public void DeleteUser(int userId)
        {
            _db.SaveData("dbo.spDeleteUser",
                new { UserId = userId },
                connectionStringName,
                true);
        }

        public UserModel GetUserById(int userId)
        {
            return _db.LoadData<UserModel, dynamic>("dbo.spGetUserById",
                new { UserId = userId },
                connectionStringName,
                true).FirstOrDefault();
        }

    }

 



}
