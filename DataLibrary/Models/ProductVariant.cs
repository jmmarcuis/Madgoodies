using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLibrary.Models
{
    public class ProductVariantModel
    {
        public int VariantID { get; set; }
        public string VariantName { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
    }


}