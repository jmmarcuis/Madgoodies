using DataLibrary.CustomerModel; // Ensure this matches the namespace of the CustomerModel class
using System.Threading.Tasks;

namespace DataLibrary.CustomerData
{
    public interface ICustomerData
    {
        Task RegisterCustomerAsync(RegistrationModel model);
        Task<Customer> AuthenticateCustomerAsync(string email, string password);
    }
}
