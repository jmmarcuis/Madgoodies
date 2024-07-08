using DataLibrary.Models;

namespace DataLibrary.Data
{
    public interface ISqlData
    {
<<<<<<< Updated upstream
        UserModel Authenticate(string username, string password);
        AdminModel AuthenticateSuperAdmin(string username, string password);
        void Register(string username, string firstName, string lastName, string password);
        bool UserExists(string username, string firstName, string lastName);

        ListGoods GetGoodById(int productID);
=======
>>>>>>> Stashed changes
        void AddGood(string productImageUrl, string productName, decimal price, int stock, string description);
        UserModel Authenticate(string username, string password);
        AdminModel AuthenticateSuperAdmin(string username, string password);
        void CreateOrder(decimal totalAmount, string orderStatus, List<OrderDetailModel> orderDetails);
        void DeleteGood(int productID);
        void DeleteOrder(int orderId);
        IEnumerable<ListGoods> GetAllGoods();
<<<<<<< Updated upstream
=======
        ListGoods GetGoodById(int productID);
        IEnumerable<OrderDetailModel> GetOrderDetails(int orderId);
        IEnumerable<OrderModel> GetOrders();
        IEnumerable<dynamic> GetOrdersWithDetails();
        IEnumerable<UserModel> GetUsers();
        int Register(string username, string firstName, string lastName, string password);
>>>>>>> Stashed changes
        void UpdateGoodDetails(int productID, string productName, decimal price, int stock, string description);
        void UpdateGoodImage(int productID, string productImageUrl);
        void UpdateOrderStatus(int orderId, string newStatus);
<<<<<<< Updated upstream
=======
        bool UserExists(string username, string firstName, string lastName);
>>>>>>> Stashed changes
    }
}