﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLibrary.Models
{
    public class ListGoods
    {
        public int ProductID { get; set; }
        public string ProductImageUrl { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Description { get; set; }
    }

}
