using DataLibrary.CustomerModel;
using DataLibrary.Database;
using DataLibrary.Helper;
using System.Threading.Tasks;

namespace DataLibrary.CustomerData
{
    public class CustomerData : ICustomerData
    {
        private readonly ISqlDataAccess _sqlDataAccess;
        public const string connectionStringName = "SqlDb";

        public CustomerData(ISqlDataAccess sqlDataAccess)
        {
            _sqlDataAccess = sqlDataAccess;
        }

        public async Task RegisterCustomerAsync(RegistrationModel model)
        {
            var hashedPassword = PasswordHelper.HashPassword(model.Password);

            var parameters = new
            {
                model.UserName,
                model.CustomerEmail,
                model.FirstName,
                model.LastName,
                Password = hashedPassword
            };

            string sql = "dbo.spRegisterCustomer"; // Stored Procedure name

            await Task.Run(() => _sqlDataAccess.SaveData(sql, parameters, connectionStringName, true));
        }

        public async Task<Customer> AuthenticateCustomerAsync(string email, string password)
        {
            var parameters = new
            {
                CustomerEmail = email
            };

            string sql = "dbo.spAuthenticateCustomer"; // Stored Procedure name

            var result = await Task.Run(() => _sqlDataAccess.LoadData<Customer, dynamic>(sql, parameters, connectionStringName, true));

            if (result.Count > 0)
            {
                var customer = result.First();
                if (PasswordHelper.VerifyHashedPassword(customer.Password, password))
                {
                    return customer;
                }
            }

            return null;
        }
    }
}
