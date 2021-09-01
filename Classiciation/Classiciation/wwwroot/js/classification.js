var Classiciation = (function (id) {
    var DivId = id;
    var ListGroupList = $("#" + DivId).children('div').children('div[flag=list_group]');
    var FirstListGroup = ListGroupList.first();
    var aHtml = FirstListGroup.children('div').children('a').first().prop('outerHTML');
    FirstListGroup.children('div').children('a').first().remove();
    var OperationDivs = $("#" + DivId).find('div[flag=Operation]').first().children('div').eq(1).children('div');

    //checkbox
    OperationDivs.eq(0).find('input').eq(1).on('click', function () {
        if ($(this).attr('checked') == undefined) {
            $(this).attr('checked', true);
        }
        else {
            $(this).attr('checked', false);
        }
    })

    //Create Button
    OperationDivs.eq(1).children('button').eq(0).on('click', function () {
        if (operationStatus) {
            return;
        }
        operationStatus = true;
        var sid = 0;
        if (OperationDivs.eq(0).find('input').eq(1).attr('checked') == 'checked') {
            sid = 0;
        }
        else {
            if (ListSelected.length > 0) {
                sid = ListSelected[ListSelected.length - 1];
            }
            else {
                sid = 0;
            }
        }
        var Name = OperationDivs.eq(0).find('input').eq(0).val();
        if (Name == null || Name == "") {
            UpdateMessage("Name is Empty");
        }
        else {
            var param = {
                SuperiorID: 0,
                Name: ""
            }
            param.Name = Name;
            param.SuperiorID = sid;
            var jsonStr = JSON.stringify(param);
            var url = window.location.protocol + "//" + window.location.host + ApiDict["add"];
            $.ajax({
                type: 'post',
                data: jsonStr,
                url: url,
                success: function (result) {
                    var obj = JSON.parse(result);
                    if (obj.status == true) {
                        var divObj = null;
                        if (param.SuperiorID != 0 && (ListSelected.length == ListGroupList.length)) {
                            AddNewDiv();
                            divObj = ListGroupList.eq(ListGroupList.length - 1);
                            divObj.children('div').html(aHtml);
                        }
                        else if (param.SuperiorID != 0 && (ListSelected.length == ListGroupList.length - 1 && ListSelected.length != 0)) {
                            divObj = ListGroupList.eq(ListGroupList.length - 1);
                            divObj.children('div').children('a:last').after(aHtml);
                        }
                        else if ((ListSelected.length == 0 && ListGroupList.length == 1) || param.SuperiorID == 0) {
                            divObj = ListGroupList.first();
                            if (divObj.children('div').children('a').length > 0) {
                                divObj.children('div').children('a:last').after(aHtml);
                            }
                            else {
                                divObj.children('div').html(aHtml);
                            }
                        }
                        divObj.children('div').children('a:last').attr('cid', obj.newID.toString());
                        divObj.children('div').children('a:last').attr('sid', param.SuperiorID.toString());
                        divObj.children('div').children('a:last').html(param.Name);

                        divObj.children('div').find('a:last').on('click', function () {
                            OperationDivs.eq(0).find('input').eq(0).val($(this).text());
                            var index = parseInt($(this).parent().parent().attr("flag-id"));
                            var cnt = 0;
                            ListGroupList.each(function () {
                                if (index - 1 < cnt) {
                                    RemoveDiv($(this));
                                }
                                cnt++;
                            })
                            if (index < ListSelected.length) {
                                ListSelected.splice(index, ListSelected.length - (index));
                            }
                            else if (index > ListSelected.length) {
                                ListSelected.push(parseInt($(this).attr('cid')));
                            }
                            ListSelected[index - 1] = parseInt($(this).attr('cid'));
                            var url = window.location.protocol + "//" + window.location.host + ApiDict["getdata"] + "?sid=" + $(this).attr('cid');
                            $.ajax({
                                type: 'get',
                                data: jsonStr,
                                url: url,
                                success: function (result) {
                                    var obj = JSON.parse(result);
                                    if (obj.status == true && obj.data.length > 0) {
                                        UpdateClassificationControl(index + 1, obj.data);
                                        if (SelectedLeafDeepth.length > 0) {
                                            ListGroupList.eq(index).children('div').find('a').each(function () {
                                                if (parseInt($(this).attr('cid')) == SelectedLeafDeepth[0].ID) {
                                                    SelectedLeafDeepth.splice(0, 1);
                                                    $(this).trigger('click');
                                                }
                                            })
                                        }
                                    }
                                    else {
                                        console.log("getpaperitemcls return empty");
                                    }
                                }
                            })
                            if (listItemClickCb != null) {
                                listItemClickCb(index, parseInt($(this).attr('cid')));
                            }
                        })
                    }
                    else {
                        UpdateMessage(obj.msg);
                    }
                    operationStatus = false;
                },
                error: function (result) {
                    console.log("Submit failed：" + result);
                    operationStatus = false;
                }
            })
        }
    })

    //Edit Button
    OperationDivs.eq(1).children('button').eq(1).on('click', function () {
        if (ListSelected.length == 0) {
            UpdateMessage("Not Item Selected");
            return;
        }
        if (operationStatus) {
            return;
        }
        operationStatus = true;
        var url = window.location.protocol + "//" + window.location.host + ApiDict["edit"] + "?id=" + ListSelected[ListSelected.length - 1].toString() + "&name=" + OperationDivs.eq(0).find('input').eq(0).val();
        $.ajax({
            type: 'get',
            url: url,
            success: function (result) {
                var obj = JSON.parse(result);
                if (obj.status == true) {
                    ListGroupList.eq(ListSelected.length - 1).children('div').children('a').each(function () {
                        if (parseInt($(this).attr('cid')) == ListSelected[ListSelected.length - 1]) {
                            $(this).text(OperationDivs.eq(0).find('input').eq(0).val());
                            return;
                        }
                    })
                }
                else {
                    UpdateMessage(obj.msg);
                }
                operationStatus = false;
            },
            error: function (result) {
                console.log("Submit failed:" + result);
                operationStatus = false;
            }
        })
    })

    //Delete Button
    OperationDivs.eq(1).children('button').eq(2).on('click', function () {
        if (ListSelected.length == 0) {
            UpdateMessage("Not Item Selected");
            return;
        }
        ListGroupList.eq(ListSelected.length - 1).children('div').children('a').each(function () {
            if (parseInt($(this).attr('cid')) == ListSelected[ListSelected.length - 1]) {
                var url = window.location.protocol + "//" + window.location.host + ApiDict["del"] + "?id=" + $(this).attr('cid');
                var cid = $(this).attr('cid');
                $.ajax({
                    type: 'get',
                    url: url,
                    success: function (data) {
                        var obj = JSON.parse(data);
                        if (obj.status == true) {
                            UpdateMessage(obj.msg);
                            OperationDivs.eq(2).css('display', '');
                            OperationDivs.eq(1).css('display', 'none');

                            OperationDivs.eq(2).children('button').eq(0).on('click', function () {
                                var confirmUrl = window.location.protocol + "//" + window.location.host + ApiDict["delconfirm"] + "?op=del&id=" + cid.toString();
                                $.ajax({
                                    type: 'get',
                                    url: confirmUrl,
                                    success: function (data) {
                                        var obj = JSON.parse(data);
                                        if (obj.status == true) {
                                            ListGroupList.eq(ListSelected.length - 1).children('div.list-group').children('a').each(function () {
                                                if ($(this).attr('cid') == cid) {
                                                    $(this).remove();
                                                }
                                            })
                                            if (ListGroupList.eq(ListSelected.length) != undefined) {
                                                RemoveDiv(ListGroupList.eq(ListSelected.length));
                                            }
                                            if (ListSelected.length > 0 && ListGroupList.eq(ListSelected.length - 1).children('div.list-group').children('a').length == 0) {
                                                RemoveDiv(ListGroupList.eq(ListSelected.length - 1));
                                            }
                                            if (ListSelected.length > 1) {
                                                ListSelected.splice(ListSelected.length - 1, 1);
                                            }
                                        }
                                        else {

                                        }
                                        UpdateMessage(obj.msg);
                                        OperationDivs.eq(2).css('display', 'none');
                                        OperationDivs.eq(1).css('display', '');
                                    }
                                })
                            })
                            OperationDivs.eq(2).children('button').eq(1).on('click', function () {
                                var confirmUrl = window.location.protocol + "//" + window.location.host + ApiDict["delconfirm"] + "?op=cancel&id=" + cid.toString();
                                $.ajax({
                                    type: 'get',
                                    url: confirmUrl,
                                    success: function (data) {
                                        var obj = JSON.parse(data);
                                        if (obj.status == true) {
                                            OperationDivs.eq(2).css('display', 'none');
                                            OperationDivs.eq(1).css('display', '');
                                        }
                                    }
                                })
                            })
                        }
                        else {
                            UpdateMessage(obj.msg);
                        }
                    }
                })
            }
        })
    })

    var ListSelected = new Array();
    var ListGroupList = $("#" + DivId).children('div').children('div[flag=list_group]');
    function QueryClassiciation(sid) {
        var url = window.location.protocol + "//" + window.location.host + ApiDict["getdata"] + "?sid=" + sid.toString();
        $.get(url, function (data, status) {
            if (status == "success") {
                var obj = JSON.parse(data);
                if (obj.status == true) {
                    UpdateClassificationControl(obj.depth, obj.data);
                    if (SelectedLeafDeepth.length > 0 || sid == 0) {
                        ListGroupList.first().children('div').find('a').each(function () {
                            if (parseInt($(this).attr('cid')) == SelectedLeafDeepth[0].ID) {
                                SelectedLeafDeepth.splice(0, 1);
                                $(this).trigger('click');
                            }
                        })
                    }
                }
            }
        });
    }
    function UpdateClassificationControl(idx, data) {
        if (ListGroupList.length < idx) {
            AddNewDiv();
        }

        for (var i = 0; i < data.length; i++) {
            ListGroupList.last().children('div').append(aHtml);
            ListGroupList.last().children('div').children('a:last').attr('cid', data[i].ID.toString());
            ListGroupList.last().children('div').children('a:last').attr('sid', data[i].SuperiorID.toString());
            ListGroupList.last().children('div').children('a:last').html(data[i].Name);
        }

        if (ListGroupList.last().children('div').find('a').length > 0) {
            ListGroupList.last().children('div').find('a').each(function () {
                $(this).on('click', function () {
                    OperationDivs.eq(0).find('input').eq(0).val($(this).text());
                    var index = parseInt($(this).parent().parent().attr("flag-id"));
                    var cnt = 0;
                    ListGroupList.each(function () {
                        if (index - 1 < cnt) {
                            RemoveDiv($(this));
                        }
                        cnt++;
                    })
                    if (index < ListSelected.length) {
                        ListSelected.splice(index, ListSelected.length - (index));
                    }
                    else if (index > ListSelected.length) {
                        ListSelected.push(parseInt($(this).attr('cid')));
                    }
                    ListSelected[index - 1] = parseInt($(this).attr('cid'));
                    var url = window.location.protocol + "//" + window.location.host + ApiDict["getdata"] + "?sid=" + $(this).attr('cid');
                    $.get(url, function (data, status) {
                        if (status == "success") {
                            var obj = JSON.parse(data);
                            if (obj.status == true) {
                                if (obj.data.length == 0) {
                                    return;
                                }
                                UpdateClassificationControl(index + 1, obj.data);
                                if (SelectedLeafDeepth.length > 0) {
                                    ListGroupList.eq(index).children('div').find('a').each(function () {
                                        if (parseInt($(this).attr('cid')) == SelectedLeafDeepth[0].ID) {
                                            SelectedLeafDeepth.splice(0, 1);
                                            $(this).trigger('click');
                                            if (SelectedLeafDeepth.length == 0) {
                                                return false;
                                            }
                                        }
                                    })
                                }
                            }
                            else {
                                console.log("getpaperitemcls return empty");
                            }
                        }
                        else {
                            console.log("getpaperitemcls http get error");
                        }
                    })
                    if (listItemClickCb != null) {
                        listItemClickCb(index, parseInt($(this).attr('cid')));
                    }
                })
            })
        }
    }

    var operationStatus = false;

    function AddNewDiv() {
        var divHtml = FirstListGroup.prop("outerHTML");
        ListGroupList.last().after(divHtml);
        ListGroupList = $("#" + DivId).children('div').children('div[flag=list_group]');
        ListGroupList.last().children('div').html("");
        ListGroupList.last().attr('flag-id', ListGroupList.length.toString());
    }

    function RemoveDiv(obj) {
        obj.remove();
        ListGroupList = $("#" + DivId).children('div').children('div[flag=list_group]');
    }

    function UpdateMessage(msg) {
        OperationDivs.eq(3).text(msg);
        setTimeout(function () {
            OperationDivs.eq(3).text("");
        }, 3000);
    }
    var listItemClickCb = null;
    var SelectedLeafDeepth = new Array();
    var ApiDict = {
        "add": "/api/data/add",
        "getdata": "/api/data/getdata",
        "edit": "/api/data/edit",
        "del": "/api/data/del",
        "delconfirm": "/api/data/delconfirm",
        "getdepth": "/api/data/getdepth"
    }
    return {
        Init: function (selid) {
            if (selid != null && selid != undefined) {
                var url = window.location.protocol + "//" + window.location.host + ApiDict["getdepth"] + "?selId=" + selid;
                $.get(url, function (data, status) {
                    var obj = JSON.parse(data);
                    if (status == "success") {
                        if (obj.status == true) {
                            SelectedLeafDeepth = obj.data;
                        }
                        else {
                            console.log("get depth failed");
                        }
                        QueryClassiciation(0);
                    }
                })
            }
            else {
                QueryClassiciation(0);
            }
        },
        GetListControlNum: function () {
            return ListGroupList.lenth;
        },
        GetSelectedList: function () {
            return ListSelected;
        },
        ListItemClick: function (cb) {
            listItemClickCb = cb;
        },
        GetApiList: function () {
            return ApiDict;
        },
        SetApiUrl: function (key, url) {
            if (ApiDict[key] == undefined) {
                return false;
            }
            else {
                ApiDict[key] = url;
                return true;
            }
        }
    };
})



