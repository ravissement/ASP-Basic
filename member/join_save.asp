<!--#include virtual="/include/dbcon.asp"-->
<!--#include virtual="/include/function.asp"-->

<%
'USE webTest
'GO

'SET ANSI_NULLS ON
'GO

'SET QUOTED_IDENTIFIER ON
'GO

'CREATE TABLE [dbo].[t_usr](
'	[idx] [int] IDENTITY(1,1) NOT NULL,
'	[user_name] [nvarchar](20) NULL,
'	[user_id] [varchar](15) NULL,
'	[user_pswd] [varchar](55) NULL,
'	[email] [varchar](80) NULL,
'	[birthday] [varchar](8) NULL,
'	[phone] [varchar](14) NULL,
'	[ip] [varchar](16) NULL,
'	[regist_date] [datetime] NULL,
'	[isUse] [char](1) NULL
') ON [PRIMARY]
'GO

'REFERER CHECK
HTTP_REFERER = Request.ServerVariables("HTTP_REFERER")
If HTTP_REFERER = "" Then
	msg = "잘못된 접근입니다."
	url = "history.back(-1);"
Else

	user_ip =		Request.ServerVariables("REMOTE_ADDR")
	user_name =	Trim(Request("user_name"))
	user_id =		Trim(Request("user_id"))
	user_pswd =	Trim(Request("user_pswd"))
	email =		Trim(Request("email"))
	phone =		Trim(Request("phone1")) & "-" & Trim(Request("phone2")) & "-" & Trim(Request("phone3"))
	birthday =	Trim(Request("user_birth_y")) & Trim(Request("user_birth_m")) & Trim(Request("user_birth_d"))

	pattern1 =	"[^가-힣]"
	pattern2 =	"[^-0-9 ]"
	pattern3 =	"[^-a-zA-Z]"
	pattern4 =	"[^-a-zA-Z0-9/ ]"


	'parameter 검증(SQL-INJECTION)
	If Word_check(user_id, pattern4) = False Then
		msg = "잘못된 문자가 포함되어 있습니다."
		url = "history.back(-1);"

	ElseIf loginPWCHK(user_pswd) = False Then
		msg = "잘못된 문자가 포함되어 있습니다."
		url = "history.back(-1);"

	ElseIf dataCHK(email) = False Then
		msg = "잘못된 문자가 포함되어 있습니다."
		url = "history.back(-1);"

	ElseIf dataCHK(phone) = False Or Word_check(birthday, pattern2) = False Then
		msg = "잘못된 문자가 포함되어 있습니다."
		url = "history.back(-1);"

	Else
		sql_c= "select idx from t_usr where user_name='" & user_name & "' and phone='" & phone & "'"
		Set rs_c= dbcon.execute(sql_c)
		If rs_c.bof Or rs_c.eof then
			sql = " insert into t_usr(user_name, user_id, user_pswd, email, phone, birthday, ip, regist_date) " &_
					" values ('"& user_name &"',	"&_
					"		'"& user_id &"',	"&_
					"		'"& user_pswd &"',	"&_
					"		'"& email &"',		"&_
					"		'"& phone &"',		"&_
					"		'"& birthday &"',	"&_
					"		'"& user_ip &"',	"&_
					"		getDate()			"&_
					")  "
			dbcon.execute(sql), Result

			If Result = 1 Then
				msg = "회원가입이 완료되었습니다."
				url = "location.href ='/'"
			Else
				msg = "회원가입에 실패하였습니다. \n다시 시도 하시기 바랍니다."
				url = "history.back(-1);"
			End If
		Else
			msg = "이름과 전화번호가 같은 회원이 있습니다."
			url = "history.back(-1);"
		End If

		dbcon.close
	End If
End If

response.write "<script type='text/javascript'>" & vbCrLf
response.write " alert('"&msg&"');" & vbCrLf
response.write url & vbCrLf
response.write "</script>"
%>




