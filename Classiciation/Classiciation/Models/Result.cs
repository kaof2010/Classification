using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ClassificationExample.Models
{
    public class ResultJson
    {
        protected Dictionary<string, object> JsonObj { get; set; } = new Dictionary<string, object>();
        public ResultJson(bool headStatus, string message)
        {
            JsonObj.Add("status", headStatus);
            JsonObj.Add("msg", message);
        }
        public void AddSub(string key, object obj)
        {
            if (JsonObj.ContainsKey(key))
            {
                JsonObj[key] = obj;
            }
            else
            {
                JsonObj.Add(key, obj);
            }
        }

        public string JsonString()
        {
            return JsonConvert.SerializeObject(JsonObj);
        }
    }
}
