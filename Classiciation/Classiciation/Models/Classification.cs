using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClassificationExample.Models
{
    public class Classification
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Remark { get; set; }
        public int SuperiorID { get; set; }
        public string Subordinate { get; set; } = "[]";
    }
    public class DepthItem
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public DepthItem(int id, string name)
        {
            this.ID = id;
            this.Name = name;
        }
    }
    public class AddItemInfo
    {
        public int SuperiorID { get; set; }
        public string Name { get; set; }
    }
}
