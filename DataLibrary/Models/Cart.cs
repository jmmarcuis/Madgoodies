﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLibrary.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public string UserId { get; set; }  
        public List<CartItem> Items { get; set; }
    }
}
