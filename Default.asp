<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/css/style.css" type="text/css">
</head>
<body>
<%
uid= Session("uid")
unm= Session("unm")
%>
<div class="wrap" style="text-align:center; margin-top:100px">
<h1>ASP BASIC</h1>
<hr>
<br><br>
<div  style="text-align: left">
<ul>
	<li>ȸ������, �α���, �Խ���(Q&A Basic)</li>
	<li>javascript ���Խ� �� ���� ���̵� �Ķ���� ����(SQL-INJECTION ����)</li>
	<li>SessionID�� ���� �ߺ��α��� ����</li>
	<li>�Խ��� �亯 DEPTH �� ����¡ ó��</li>
	<li>WYSIWYG Editor : summernote, Naver SmartEditor ���</li>
	<li>DB : MSSQL localDB SQL-Server ������ ���� ����</li>
<ul>
</div>
<div style="margin-top:200px;">
	<a href="/member/join.asp" class="aBtn">Sign In</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<%
	If uid <> "" Then
	%>
	<a href="/member/logout.asp" class="aBtn">LogOut</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<%
	Else
	%>
	<a href="/member/login.asp" class="aBtn">LogIn</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<%
	End If
	%>
	<a href="/boardWrite/list.asp" class="aBtn">BoardList</a>
</div>
</div>
</body>
</html>