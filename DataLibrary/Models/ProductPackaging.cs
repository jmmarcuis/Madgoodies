using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLibrary.Models
{
    public class ProductPackaging
    {
        public int PackagingID { get; set; }
        public int ProductID { get; set; }
        public int PackageQuantity { get; set; }
    }
}
