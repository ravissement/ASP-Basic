<!--#include virtual="/include/dbcon.asp"-->
<!--#include virtual="/include/function.asp"-->
<%
uid= Session("uid")
unm= Session("unm")
SessionId = Session.SessionId

If uid = ""  Then
	returnPageUrl =	"/member/login.asp"
	msg =			"�α��� �� �̿��� �ֽʽÿ�."
	logState =		"logout"

ElseIf loginIDCHK(user_id) = False Then
	msg =			"�߸��� ���ڰ� ���ԵǾ����ϴ�."
	returnPageUrl =	"/"
	logState =		"logout"

Else
	'�ߺ� �α���
	sql_Log = "select tag from check_login_double Where user_id='" & uid & "' order by regist_date DESC"
	set rsLog = dbcon.execute (sql_Log)
	If rsLog.bof Or rsLog.eof Then

	Else
		gubun= rsLog("tag")

		If gubun= SessionId Then
			logState =		""
		Else
			logState =		"logout"
			msg =			"�ߺ��α������� ����˴ϴ�."
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