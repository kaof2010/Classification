# Classification
Examples of front-end classification controls based on asp.net core can also be seen as asp.net core mvc, api, service examples

# Initialization
Use reference site.js, a total of two initialization methods
1. Initialization when there is no selection
var cls = new Classiciation("classiCreateEditDiv");
cls.Init(null);
2. Initialization when there is a selection (assuming the ID of the selection is 3)
var cls = new Classiciation("classiCreateEditDiv");
cls.Init(3);

# Data Interface
The data interface is obtained through GetApiList() and can be modified through SetApiUrl()
1. Create a new category
   Path: /api/data/add
   Method: post
   Parameter: {SuperiorId:0, Name:""}
   Return: {status:true, newID:0}, {status:false, msg:""}
2. Get the category item of the specified parent ID
   Path: /api/data/getdata
   Method: get
   Parameter: sid=0
   Return: {status:true, depth:[{id:0, name:""}], data:[{id:0, name:"", remark:"", superiorid:0, subordinate:[]}]}, {status:false, msg:""}
3. Modify the name of a category item
   Path: /api/data/edit
   Method: get
   Parameter: id=0
   Return: {status:true|false, msg:""}
4. Delete a category item
   Path: /api/data/del
   Method: get
   Parameter: id=0
   Return: {status:true|false, msg:""}
5. Confirmation message when deleting a category item
   Path: /api/data/delconfirm
   Method: get
   Parameter: op=del|cancel&id=0
   Return: Return: {status:true|false, msg:""}
6. Get the depth (path) of the selected category item
   Path: /api/data/getdepth
   Method: get
   Parameter: selid=0
   Return: {status:true, depth:[{id:0, name:""}]}, , {status:false, msg:""}
