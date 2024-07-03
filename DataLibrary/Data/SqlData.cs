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

        public void Register(string username, string firstName, string lastName, string password)
        {
            _db.SaveData<dynamic>(
                "dbo.spUsers_Register",
                new { username, firstName, lastName, password },
                connectionStringName,
                true);
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

        public void UpdateGood(int productID, string productImageUrl, string productName, decimal price, int stock, string description)
        {
            _db.SaveData("dbo.spUpdateGood",
              new
              {
                  ProductID = productID,
                  ProductImageUrl = productImageUrl,
                  ProductName = productName,
                  Price = price,
                  Stock = stock,
                  Description = description
              },
              connectionStringName,
              true);
        }



    }
}
