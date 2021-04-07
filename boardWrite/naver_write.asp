<!--#include virtual ="/include/session.asp"-->
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/css/style.css" type="text/css">
</head>
<script type="text/javascript" src="/js2/js/service/HuskyEZCreator.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script>
<%
idx = request("idx")
user_id = request("user_id")
%>


<body>
<div style="text-align:center;">
<h1>Board Write(smart editor)</h1>
</div>
<br><br><br>
<form name="aform" action="write_save.asp" method="post" >
<input type="hidden" name="ridx" value="<%=idx%>" />
<input type="hidden" name="ruser_id" value="<%=user_id%>" />
<input type="hidden" name="writer" value="<%=uid%>"/>
<div class="wrap">
	<table class="tableContent">
		<thead>

			<tr>
				<th class="th1"><span class="aBtn">�۾���</span></th>
				<th class="th2"><%=unm%></th>
				<th class="th1"><span class="aBtn">������</span></th>
				<th style="width:60%"><input type="text" name="title" maxlength="90" style="width:100%;"></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="context" colspan="4" style="text-align:left;">
					<textarea id="weditor" name="weditor" style="width:90%; height:400px;"></textarea>
				</td>
			</tr>
		</tbody>
	</table>
	</form>
	<table>
		<tr>
		<td>
			<a id="submitBtn" href="#" class="aBtn">����</a>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<a id="cancleBtn" href="#" class="aBtn">���</a>
		</td>
		</tr>
	</table>
</div>


</body>


<script>
var oEditors = [];

nhn.husky.EZCreator.createInIFrame({

    oAppRef: oEditors,

    elPlaceHolder: "weditor",

    sSkinURI: "/js2/SmartEditor2Skin.html",

    fCreator: "createSEditor2"

});






$('#submitBtn').click(function() {

	/*
	if(!$('input[name=writer]').val()){
		alert("�۾��̸� �Է����ּ���.");
		$('input[name=writer').focus();
		return false;
	};
	*/
	if(!$('input[name=title]').val()){
		alert("������ �Է����ּ���.");
		$('input[name=title').focus();
		return false;
	};

	/*if(!$('textarea[name=weditor').val()){
		alert("������ �Է����ּ���.");
		$('textarea[name=weditor').focus();
		return false;
	};*/

	if(!confirm("�����Ͻðڽ��ϱ�?")){
		return false;
	};


	$('textarea[name=weditor]').val(oEditors.getById["weditor"].getIR()) ;
	//alert($('#weditor').val());
	$('form[name=aform]').submit();


});


$('#cancleBtn').click(function() {
	if(!confirm("����Ͻðڽ��ϱ�?")){
		return false;
	};

	location.href="list.asp"
});

</script>

</html>