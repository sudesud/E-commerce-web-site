﻿
namespace Bitik.Models
{
    public class ProductViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }

        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
       
        public int Stock { get; set; }

        

    }
}
