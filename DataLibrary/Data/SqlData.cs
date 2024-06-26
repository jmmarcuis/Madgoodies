using BlogDataLibrary.Database;
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
        private const string connectionStringName = "SqlDb";

        public SqlData(ISqlDataAccess db)
        {
            _db = db;
        }


        public UserModel Authenticate(
            string username,
            string password)
        {

            UserModel result = _db.LoadData<UserModel, dynamic>("dbo.spUsers_Authenticate",
                new { username, password },
                connectionStringName,
                true).FirstOrDefault();

            return result;
        }




    }
}
