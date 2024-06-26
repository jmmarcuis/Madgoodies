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
    public class SqlData : ISqlData
    {
        public ISqlDataAccess _db;
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


    }
}
