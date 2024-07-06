using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLibrary.Models
{
    namespace DataLibrary.Models
    {
        public class OrderRequest
        {
            public decimal TotalAmount { get; set; }
            public string OrderStatus { get; set; }
            public List<OrderDetailModel> OrderDetails { get; set; }
        }
    }

 
}
