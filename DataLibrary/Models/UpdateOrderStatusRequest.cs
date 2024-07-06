using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLibrary.Models
{
    public class UpdateOrderStatusRequest
    {
        public int OrderID { get; set; }
        public string NewStatus { get; set; }
    }
}
