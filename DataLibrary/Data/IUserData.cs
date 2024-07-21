using DataLibrary.Models;
using System.Collections.Generic;

namespace DataLibrary.Data
{
    public interface IUserData
    {
        UserModel Authenticate(string username, string password);
        void Register(string username, string firstName, string lastName, string password);
        bool UserExists(string username, string firstName, string lastName);
        UserModel GetUserById(int userId);
        void AddUser(UserModel user);
        void UpdateUser(UserModel user);
        void DeleteUser(int userId);

        IEnumerable<UserModel> GetUsers();
        AdminModel AuthenticateSuperAdmin(string username, string password);

    }
}
