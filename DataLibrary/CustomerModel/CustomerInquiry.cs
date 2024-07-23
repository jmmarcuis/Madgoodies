using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLibrary.CustomerModel
{
    public class CustomerInquiry
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string OrderNumber { get; set; }
        public string InquiryType { get; set; }
        public string Message { get; set; }
 
        public DateTime CreatedAt { get; set; }
    }
}
