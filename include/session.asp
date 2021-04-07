<!--#include virtual="/include/dbcon.asp"-->
<!--#include virtual="/include/function.asp"-->
<%
uid= Session("uid")
unm= Session("unm")
SessionId = Session.SessionId

If uid = ""  Then
	returnPageUrl =	"/member/login.asp"
	msg =			"로그인 후 이용해 주십시오."
	logState =		"logout"

ElseIf loginIDCHK(user_id) = False Then
	msg =			"잘못된 문자가 포함되었습니다."
	returnPageUrl =	"/"
	logState =		"logout"

Else
	'중복 로그인
	sql_Log = "select tag from check_login_double Where user_id='" & uid & "' order by regist_date DESC"
	set rsLog = dbcon.execute (sql_Log)
	If rsLog.bof Or rsLog.eof Then

	Else
		gubun= rsLog("tag")

		If gubun= SessionId Then
			logState =		""
		Else
			logState =		"logout"
			msg =			"중복로그인으로 종료됩니다."
			returnPageUrl =	"/"
		End If

	End If

End If

If logState = "logout" Then
	response.write "<script type='text/javascript'>" & vbCrLf
	response.write " alert('"&msg&"');" & vbCrLf
	response.write " location.href='"& returnPageUrl &"'" & vbCrLf
	response.write "</script>"

End If

%>