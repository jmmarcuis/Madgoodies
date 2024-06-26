using DataLibrary.Database;
using DataLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace DataLibrary.Data
{
    public class SqlData
    {

        private readonly ISqlDataAccess _db;
        private
        const string connectionStringName = "SqlDb";

        public SqlData(ISqlDataAccess db)
        {
            _db = db;
        }

        public UserModel Authenticate(
          string username,
          string password)
        {

            UserModel result = _db.LoadData<UserModel, dynamic>("dbo.spUsers_Authenticate",
              new
              {
                  username,
                  password
              },
              connectionStringName,
              true).FirstOrDefault();

            return result;
        }

        public void AddGood(
          string productName,
          decimal price,
          int stock,
          string description,
          byte[] image = null)
        {
            _db.SaveData("dbo.spAddGoods",
              new
              {
                  productName,
                  price,
                  stock,
                  description,
                  image
              },
              connectionStringName,
              true);
        }

        public void DeleteGood(int productID)
        {
            _db.SaveData("dbo.spDeleteGoods",
              new
              {
                  productID
              },
              connectionStringName,
              true);

        }
        public IEnumerable<CreateGood> GetAllGoods()
        {
            return _db.LoadData<CreateGood, dynamic>("dbo.spGetAllGoods", new { }, connectionStringName, true);
        }

        public void EditGood(EditGood good)
        {
            _db.SaveData("dbo.spEditGoods",
              new
              {
                  good.ProductID,
                  good.ProductName,
                  good.Price,
                  good.Stock,
                  good.Description,
                  good.Image
              },
              connectionStringName,
              true);
        }
    }
}