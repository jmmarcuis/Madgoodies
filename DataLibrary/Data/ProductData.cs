using DataLibrary.Database;
using DataLibrary.Models;
using System.Collections.Generic;
using System.Linq;

namespace DataLibrary.Data
{
    public class ProductData : IProductData
    {
        private readonly ISqlDataAccess _db;
        public const string connectionStringName = "SqlDb";

        public ProductData(ISqlDataAccess db)
        {
            _db = db;
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

        public void AddProductPackaging(int productId, int packageQuantity)
        {
            _db.SaveData("dbo.spAddProductPackaging",
                new
                {
                    ProductID = productId,
                    PackageQuantity = packageQuantity
                },
                connectionStringName,
                true);
        }

        public IEnumerable<ProductPackaging> GetProductPackaging(int productId)
        {
            return _db.LoadData<ProductPackaging, dynamic>("dbo.spGetProductPackaging",
                new { ProductID = productId },
                connectionStringName,
                true);
        }

        public void DeleteProductPackaging(int productId, int packageId)
        {
            _db.SaveData("dbo.spDeleteProductPackaging",
                new
                {
                    ProductID = productId,
                    PackagingID = packageId
                },
                connectionStringName,
                true);
        }
    }
}