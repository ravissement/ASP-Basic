<!--#include virtual ="/include/session.asp"-->
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/css/style.css" type="text/css">
<!-- include libraries(jQuery, bootstrap) -->
<link href="http://netdna.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.css" rel="stylesheet">
<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script>
<script src="http://netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.js"></script>
<!-- include summernote css/js-->
<link href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.8/summernote.css" rel="stylesheet"> <script src="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.8/summernote.js"></script>

</head>

<%
idx = request("idx")
user_id = request("user_id")
%>


<body>
<div style="text-align:center;">
<h1>Board Write(summernote)</h1>
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
				<th class="th1"><span class="aBtn">글쓴이</span></th>
				<th class="th2"><%=unm%></th>
				<th class="th1"><span class="aBtn">글제목</span></th>
				<th style="width:60%"><input type="text" name="title" maxlength="90" style="width:100%;"></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="context" colspan="4" style="text-align:left;">
					<textarea id="summernote" class=="summernote" name="weditor" ></textarea>
				</td>
			</tr>
		</tbody>
	</table>
	</form>
	<table>
		<tr>
		<td>
			<a id="submitBtn" href="#" class="aBtn">저장</a>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<a id="cancleBtn" href="#" class="aBtn">취소</a>
		</td>
		</tr>
	</table>
</div>


</body>


<script>
$(document).ready(function() {
	$('#summernote').summernote({
        placeholder: '자유롭게 입력해주세요.',
        height: 400,
	   width: 900,
        lang: 'ko-KR'
      });
});

$('#submitBtn').click(function() {
	/*
	if(!$('input[name=writer]').val()){
		alert("글쓴이를 입력해주세요.");
		$('input[name=writer').focus();
		return false;
	};
	*/
	if(!$('input[name=title]').val()){
		alert("제목을 입력해주세요.");
		$('input[name=title').focus();
		return false;
	};

	if(!$('textarea[name=weditor').val()){
		alert("내용을 입력해주세요.");
		$('input[name=weditor').focus();
		return false;
	};

	if(!confirm("저장하시겠습니까?")){
		return false;
	};

	$('form[name=aform]').submit();

});


$('#cancleBtn').click(function() {
	if(!confirm("취소하시겠습니까?")){
		return false;
	};

	location.href="list.asp"
});

</script>

</html>