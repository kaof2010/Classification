using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClassificationExample.Services;
using ClassificationExample.Models;
using Newtonsoft.Json;
using System.IO;
using System.Text;

namespace ClassificationExample.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        protected IShareData shareData;
        public DataController(IShareData shareData)
        {
            this.shareData = shareData;
        }

        [HttpGet]
        [Route("test")]
        public async Task<ActionResult> Test()
        {
            return Ok("api test");
        }

        [HttpGet]
        [Route("getdata")]
        public async Task<ActionResult> GetData(int sid)
        {
            List<Classification> clsList = new List<Classification>();
            shareData.GetItemBySuperiorID(sid, ref clsList);

            List<DepthItem> deepthList = new List<DepthItem>();
            shareData.GetDepthList(sid, ref deepthList);

            ResultJson json = new ResultJson(true, "");
            json.AddSub("depth", deepthList);
            json.AddSub("data", clsList);
            return Ok(json.JsonString());
        }

        [HttpGet]
        [Route("getdepth")]
        public async Task<ActionResult> GetDepth(int selId)
        {
            List<DepthItem> deepthList = new List<DepthItem>();
            shareData.GetDepthList(selId, ref deepthList);
            
            ResultJson json = new ResultJson(true, "");
            json.AddSub("data", deepthList);
            return Ok(json.JsonString());
        }
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> AddItem()
        {
            using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                string jsonStr = await reader.ReadToEndAsync();
                AddItemInfo obj = JsonConvert.DeserializeObject<AddItemInfo>(jsonStr);
                int newID = 0;
                string result = shareData.AddItem(obj, ref newID);
                if (result == "")
                {
                    ResultJson json = new ResultJson(true, "");
                    json.AddSub("newID", newID);
                    return Ok(json.JsonString());
                }
                else
                {
                    ResultJson json = new ResultJson(false, result);
                    return Ok(json.JsonString());
                }
            }
        }

        [HttpGet]
        [Route("del")]
        public async Task<ActionResult> DeleteItem(int id)
        {
            string result = shareData.Deletable(id);
            if (result == "")
            {
                ResultJson json = new ResultJson(true, "");
                return Ok(json.JsonString());
            }
            else
            {
                ResultJson json = new ResultJson(false, result);
                return Ok(json.JsonString());
            }
        }
        [HttpGet]
        [Route("delconfirm")]
        public async Task<ActionResult> DeleteConfirm(string op, int id)
        {
            if (op == "del")
            {
                string result = shareData.DeleteItem(id);
                if (result == "")
                {
                    ResultJson json = new ResultJson(true, "");
                    return Ok(json.JsonString());
                }
                else
                {
                    ResultJson json = new ResultJson(false, result);
                    return Ok(json.JsonString());
                }
            }
            else if (op == "cancel")
            {
                ResultJson json = new ResultJson(true, "");
                return Ok(json.JsonString());
            }
            else
            {
                ResultJson json = new ResultJson(true, "unknow error");
                return Ok(json.JsonString());
            }
        }
        [HttpGet]
        [Route("edit")]
        public async Task<ActionResult> EditItem(int id, string name)
        {
            string result = shareData.EditItem(id, name);
            if (result == "")
            {
                ResultJson json = new ResultJson(true, "");
                return Ok(json.JsonString());
            }
            else
            {
                ResultJson json = new ResultJson(false, result);
                return Ok(json.JsonString());
            }
        }
    }
}
