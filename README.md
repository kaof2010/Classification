# Classification
Examples of front-end classification controls based on asp.net core can also be seen as asp.net core mvc, api, service examples</br>
![Image text](https://github.com/kaof2010/Classification/blob/main/operation.gif?raw=true)
# Html Template
![Image text](https://github.com/kaof2010/Classification/blob/main/htmltemplate.png?raw=true)
# Initialization
Use reference site.js, a total of two initialization methods</br>
### 1. Initialization when there is no selection
var cls = new Classiciation("classiCreateEditDiv");</br>
cls.Init(null);</br>
### 2. Initialization when there is a selection (assuming the ID of the selection is 3)</br>
var cls = new Classiciation("classiCreateEditDiv");</br>
cls.Init(3);</br>

# Data Interface
The data interface is obtained through GetApiList() and can be modified through SetApiUrl()
### 1. Create a new category</br>
   Path: /api/data/add</br>
   Method: post</br>
   Parameter: {SuperiorId:0, Name:""}</br>
   Return: {status:true, newID:0}, {status:false, msg:""}</br>
### 2. Get the category item of the specified parent ID</br>
   Path: /api/data/getdata</br>
   Method: get</br>
   Parameter: sid=0</br>
   Return: {status:true, depth:[{id:0, name:""}], data:[{id:0, name:"", remark:"", superiorid:0, subordinate:[]}]}, {status:false, msg:""}</br>
### 3. Modify the name of a category item</br>
   Path: /api/data/edit</br>
   Method: get</br>
   Parameter: id=0</br>
   Return: {status:true|false, msg:""}</br>
### 4. Delete a category item</br>
   Path: /api/data/del</br>
   Method: get</br>
   Parameter: id=0</br>
   Return: {status:true|false, msg:""}</br>
### 5. Confirmation message when deleting a category item</br>
   Path: /api/data/delconfirm</br>
   Method: get</br>
   Parameter: op=del|cancel&id=0</br>
   Return: Return: {status:true|false, msg:""}</br>
### 6. Get the depth (path) of the selected category item</br>
   Path: /api/data/getdepth</br>
   Method: get</br>
   Parameter: selid=0</br>
   Return: {status:true, depth:[{id:0, name:""}]}, , {status:false, msg:""}</br>
