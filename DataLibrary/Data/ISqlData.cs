using DataLibrary.Models;

namespace DataLibrary.Data
{
    public interface ISqlData
    {
        UserModel Authenticate(string username, string password);
        void Register(string username, string firstName, string lastName, string password);
        bool UserExists(string username, string firstName, string lastName);
    }
}