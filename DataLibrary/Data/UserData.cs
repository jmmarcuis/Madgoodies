using DataLibrary.Database;
using DataLibrary.Models;
using System.Linq;

namespace DataLibrary.Data
{
    public class UserData : IUserData
    {
        private readonly ISqlDataAccess _db;
        public const string connectionStringName = "SqlDb";

        public UserData(ISqlDataAccess db)
        {
            _db = db;
        }

        public IEnumerable<UserModel> GetUsers()
        {
            return _db.LoadData<UserModel, dynamic>("dbo.spGetUsers", new { }, connectionStringName, true);
        }


        public UserModel Authenticate(string username, string password)
        {
            return _db.LoadData<UserModel, dynamic>("dbo.spUsers_Authenticate",
                new { username, password }, connectionStringName, true).FirstOrDefault();
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

        public UserModel GetUserById(int userId)
        {
            return _db.LoadData<UserModel, dynamic>("dbo.spGetUserById",
                new { UserId = userId },
                connectionStringName,
                true).FirstOrDefault();
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
                new
                {
                    userId = user.Id,
                    username = user.UserName,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    password = user.Password
                },
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

        public AdminModel AuthenticateSuperAdmin(string username, string password)
        {
            AdminModel admin = _db.LoadData<AdminModel, dynamic>("dbo.spSuperAdmin_Authenticate",
                new { username, password }, connectionStringName, true).FirstOrDefault();

            return admin;
        }
    }
}
