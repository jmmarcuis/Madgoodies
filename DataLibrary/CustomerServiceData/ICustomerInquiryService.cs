using DataLibrary.CustomerModel;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DataLibrary.Data
{
    public interface ICustomerInquiryService
    {
        int CreateInquiry(CustomerInquiry inquiry );
        CustomerInquiry GetInquiryById(int id);
        IEnumerable<CustomerInquiry> GetAllInquiries();
    }
}