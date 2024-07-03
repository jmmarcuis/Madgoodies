﻿using DataLibrary.Models;
using System.Collections.Generic;

namespace DataLibrary.Data
{
    public interface ISqlData
    {
        UserModel Authenticate(string username, string password);
        void Register(string username, string firstName, string lastName, string password);
        bool UserExists(string username, string firstName, string lastName);
        void AddGood(string productImageUrl, string productName, decimal price, int stock, string description);
        void DeleteGood(int productID);
        IEnumerable<ListGoods> GetAllGoods();
        void UpdateGoodDetails(int productID, string productName, decimal price, int stock, string description);
        void UpdateGoodImage(int productID, string productImageUrl);
    }
}
