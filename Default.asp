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
	<li>회원가입, 로그인, 게시판(Q&A Basic)</li>
	<li>javascript 정규식 및 서버 사이드 파라미터 검증(SQL-INJECTION 방지)</li>
	<li>SessionID를 통한 중복로그인 방지</li>
	<li>게시판 답변 DEPTH 및 페이징 처리</li>
	<li>WYSIWYG Editor : summernote, Naver SmartEditor 사용</li>
	<li>DB : MSSQL localDB SQL-Server 인증을 통해 구성</li>
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