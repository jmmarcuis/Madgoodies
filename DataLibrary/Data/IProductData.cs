using DataLibrary.Models;
using System.Collections.Generic;

namespace DataLibrary.Data
{
    public interface IProductData
    {
        void AddGood(string productImageUrl, string productName, decimal price, int stock, string description);
        void DeleteGood(int productID);
        IEnumerable<ListGoods> GetAllGoods();
        void UpdateGoodDetails(int productID, string productName, decimal price, int stock, string description);
        void UpdateGoodImage(int productID, string productImageUrl);
        ListGoods GetGoodById(int productID);
        IEnumerable<ProductPackaging> GetProductPackaging(int productId);
        void AddProductPackaging(int productId, int packageQuantity);
        void DeleteProductPackaging(int productId, int packageId);
    }
}