using DataLibrary.Data;
using DataLibrary.Models;
using DataLibrary.Database;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using DataLibrary.CustomerModel;

namespace DataLibrary.CustomerServiceData
{
    public class CustomerInquiryService : ICustomerInquiryService
    {
        private readonly ISqlDataAccess _sqlDataAccess;
        public const string connectionStringName = "SqlDb";

        public CustomerInquiryService(ISqlDataAccess dataAccess)
        {
            _sqlDataAccess = dataAccess;
        }

        public int CreateInquiry(CustomerInquiry inquiry)
        {
            var parameters = new
            {
                inquiry.FirstName,
                inquiry.LastName,
                inquiry.EmailAddress,
                inquiry.PhoneNumber,
                inquiry.OrderNumber,
                inquiry.InquiryType,
                inquiry.Message,
             };

            var result = _sqlDataAccess.LoadData<int, dynamic>(
                "spCustomerInquiries_Insert",
                parameters,
                connectionStringName,
                true);

            return result.FirstOrDefault();
        }

        public CustomerInquiry GetInquiryById(int id)
        {
            var result = _sqlDataAccess.LoadData<CustomerInquiry, dynamic>(
                "spCustomerInquiries_GetById",
                new { ID = id },
                connectionStringName,
                true);

            return result.FirstOrDefault();
        }

        public IEnumerable<CustomerInquiry> GetAllInquiries()
        {
            return _sqlDataAccess.LoadData<CustomerInquiry, dynamic>(
                "spCustomerInquiries_GetAll",
                new { },
                connectionStringName,
                true);
        }
    }
}
