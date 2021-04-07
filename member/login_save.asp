<!--#include virtual="/include/dbcon.asp"-->
<!--#include virtual="/include/function.asp"-->
<%

'중복로그인 체크
'USE webTest
'GO

'SET ANSI_NULLS ON
'GO

'SET QUOTED_IDENTIFIER ON
'GO

'CREATE TABLE [dbo].[check_login_double](
'	[idx] [int] IDENTITY(1,1) NOT NULL,
'	[user_id] [varchar](15) NULL,
'	[ip] [varchar](16) NULL,
'	[tag] [varchar](50) NULL,
'	[url_addr] [varchar](100) NULL,
'	[regist_date] [datetime] NULL
') ON [PRIMARY]
'GO


HTTP_REFERER = Request.ServerVariables("HTTP_REFERER")

If HTTP_REFERER = "" Then
	msg = "잘못된 접근입니다."
	returnPageUrl = "/member/login.asp"
Else

	user_id = Trim(request("user_id"))
	user_pw = Trim(request("user_pswd"))
	user_ip = Request.servervariables("REMOTE_ADDR")

	If loginIDCHK(user_id) = False Or loginPWCHK(user_pw) = False Then
		msg = "잘못된 아이디 / 패스워드 입니다."
		action = "/member/login.asp"

	Else

		sql=" SELECT user_id, user_pswd, user_name FROM t_usr "&_
			" WHERE user_id COLLATE Korean_Wansung_CS_AS ='" & user_id & "' "&_
			" AND user_pswd COLLATE Korean_Wansung_CS_AS ='" & user_pw & "'"

		Set rs= dbcon.execute(sql)

		If rs.bof Or rs.eof Then
			msg="아이디나 패스워드가 틀립니다.\n아이디, 패스워드는 대소문자를 구분합니다.\n확인 후 다시 로그인해 주십시오."
			returnPageUrl = "/member/login.asp"

		Else
			Session("uid") = trim(rs("user_id"))
			Session("unm") = trim(rs("user_name"))
			Session("upw") = trim(rs("user_pswd"))

			msg="로그인 되었습니다."
			returnPageUrl = "/"
		End If




		'2일전 check_login_double DELETE
		sql_Log_delete = "Delete from check_login_double where datediff(d,regist_date,getdate()) > 2 "
		set rs_Log_delete= dbcon.execute(sql_Log_delete)

		'중복로그인 check
		sql_Log = "select * from check_login_double Where user_id='" & user_id & "'"
		set rsLog = dbcon.execute (sql_Log)
		If rsLog.EOF or rsLog.BOF then
			sql_i = "insert into check_login_double (user_id, ip, tag, url_addr, regist_date ) values ('"& user_id &"','"  & user_ip & "','" & Session.SessionID & "','" & request.ServerVariables("URL") & "', getdate())"
			dbcon.Execute(sql_i)

		Else
			sql_u = "update check_login_double set ip='"& user_ip &"', tag='"& Session.SessionID &"', url_addr = '"& request.ServerVariables("URL") &"', regist_date= getdate() where user_id = '" & user_id & "'"
			dbcon.Execute(sql_u)

		End If

		rsLog.close : set rsLog = Nothing


		Set rs = Nothing
		dbcon.close

	End If

End If

response.write "<script type='text/javascript'>" & vbCrLf
response.write " alert('"&msg&"');" & vbCrLf
response.write " location.href='"& returnPageUrl &"'" & vbCrLf
response.write "</script>"

%>
