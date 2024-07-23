using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataLibrary.CustomerModel
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string UserName { get; set; }
        public string CustomerEmail { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; } // This might be excluded from the model in practice
    }
}
