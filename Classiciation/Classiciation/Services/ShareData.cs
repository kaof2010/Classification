using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClassificationExample.Models;
using Newtonsoft.Json;

namespace ClassificationExample.Services
{
    public interface IShareData
    {
        public string AddItem(AddItemInfo addInfo, ref int newId);
        public string GetItemBySuperiorID(int id, ref List<Classification> list);
        public string EditItem(int id, string name);
        public string DeleteItem(int id);
        public string GetDepthList(int selId, ref List<DepthItem> list);
        public string Deletable(int id);
    }

    public class ShareDataService : IShareData
    {
        private List<Classification> clsList = new List<Classification>();
        private int curMaxId = 1;
        public ShareDataService()
        {
            //initing fill some data;
            int newID = 0;
            for (var idx = 0; idx < 4; idx++)
            {
                AddItemInfo item = new AddItemInfo();
                item.Name = "Init";
                if (idx == 3)
                {
                    item.SuperiorID = 1;
                }
                else
                {
                    item.SuperiorID = 0;
                }
                AddItem(item, ref newID);
            }
        }
        public string AddItem(AddItemInfo addInfo, ref int newId)
        {
            Classification item = new Classification();
            item.ID = curMaxId++;
            item.SuperiorID = addInfo.SuperiorID;
            item.Name = addInfo.Name;
            if (item.SuperiorID != 0)
            {
                Classification suItem = clsList.Find(delegate (Classification cls)
                {
                    return cls.ID == item.SuperiorID;
                });
                if (suItem == null)
                {
                    return "superior id not find";
                }
                List<int> subItems = JsonConvert.DeserializeObject<List<int>>(suItem.Subordinate);
                subItems.Add(item.ID);
                suItem.Subordinate = JsonConvert.SerializeObject(subItems);
            }
            newId = item.ID;
            clsList.Add(item);

            return "";
        }

        public string GetItemBySuperiorID(int id, ref List<Classification> list)
        {
            list = clsList.FindAll(delegate (Classification cls)
            {
                return cls.SuperiorID == id;
            });

            if (list == null || list.Count == 0)
            {
                return "not find the item by superior id";
            }
            else
            {
                return "";
            }
        }

        public string EditItem(int id, string name)
        {
            Classification result = clsList.Find(delegate (Classification cls)
            {
                return cls.ID == id;
            });
            if (result == null)
            {
                return "not find the item by id";
            }
            else
            {
                result.Name = name;
                return "";
            }
        }

        public string Deletable(int id)
        {
            Classification curItem = clsList.Find(delegate (Classification cls)
            {
                return cls.ID == id;
            });
            if (curItem == null)
            {
                return "the item is not existed";
            }
            else
            {
                return "";
            }
        }
        private void DeleteSubItems (string preSubordinate)
        {
            List<int> subItems = JsonConvert.DeserializeObject<List<int>>(preSubordinate);
            foreach (var id_ in subItems)
            {
                Classification item_ = clsList.Find(delegate (Classification cls)
                {
                    return cls.ID == id_;
                });
                if (item_ == null)
                {
                    continue;
                }
                else
                {
                    DeleteSubItems(item_.Subordinate);
                    clsList.Remove(item_);
                }
            }
        }

        public string DeleteItem(int id)
        {
            Classification curItem = clsList.Find(delegate (Classification cls)
            {
                return cls.ID == id;
            });
            if (curItem == null)
            {
                return "the item is not existed";
            }
            
            if (curItem.SuperiorID != 0)
            {
                Classification suItem = clsList.Find(delegate (Classification cls)
                {
                    return cls.ID == curItem.SuperiorID;
                });
                if (suItem == null)
                {
                    return "not find the superior item";
                }
                else
                {
                    List<int> subItems = JsonConvert.DeserializeObject<List<int>>(suItem.Subordinate);
                    subItems.Remove(curItem.ID);
                    suItem.Subordinate = JsonConvert.SerializeObject(subItems);
                }
            }

            List<int> delItemsList = new List<int>();
            DeleteSubItems(curItem.Subordinate);

            clsList.Remove(curItem);

            return "";
        }

        public string GetDepthList(int selId, ref List<DepthItem> list)
        {
            int curId = selId;
            while (curId > 0)
            {
                Classification curItem = clsList.Find(delegate (Classification cls)
                {
                    return cls.ID == curId;
                });
                if (curItem != null)
                {
                    list.Add(new DepthItem(curItem.ID, curItem.Name));
                    curId = curItem.SuperiorID;
                }
            }
            list.Reverse();

            return "";
        }
    }
}
