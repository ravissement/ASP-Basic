<!--#include virtual ="/include/dbcon.asp"-->
<!--#include virtual ="/include/function.asp"-->
<%

'USE [webTest]
'GO

'SET ANSI_NULLS ON
'GO

'SET QUOTED_IDENTIFIER ON
'GO

'CREATE TABLE [dbo].[test](
'	[idx] [int] IDENTITY(1,1) NOT NULL,
'	[depth] [int] NULL,
'	[pos] [int] NULL,
'	[title] [nvarchar](100) NULL,
'	[context] [nvarchar](max) NULL,
'	[user_id] [varchar](16) NULL,
'	[regist_date] [datetime] NULL,
'	[state] [char](1) NULL,
'	[isUse] [char](1) NULL,
'	[read_id] [varchar](16) NULL
') ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
'GO



ridx =		Trim(request("ridx"))
ruser_id =	Trim(request("ruser_id"))
title =		Check_sql(request("title"))
context =		Check_sql(request("weditor"))
writer =		Trim(request("writer"))


If dataCHK(ridx) = False Or dataCHK(ruser_id) = False Or dataCHK(writer) = False Then
	msg =	"잘못된 문자가 포합 되어있습니다."
	url =	"history.back(-1);"

Else
	'state
	'1 : answer state O
	'0 : answer state X
	tableName = "test"

	If ridx <> "" Then
		sql = "INSERT INTO "&tableName&" (depth, pos, title, context, user_id, read_id, regist_date, state, isUse) "&_
								" VALUES  "&_
								" (1, "&_
								" "&ridx&", "&_
								" '"&title&"', "&_
								" '"&context&"', "&_
								" '"&writer&"', "&_
								" '"&ruser_id&"', "&_
								" getDate(), "&_
								" 1, "&_
								" 1) "
		dbcon.execute(sql), Result
		If Result = 1 Then
			sql = " UPDATE "&tableName&" SET state=1 WHERE idx ="&ridx
			dbcon.execute(sql)

			msg = "정상적으로 저장되었습니다."
			url = "location.href = 'list.asp'"

		Else
			msg = "다시시도하시기 바랍니다."
			url = "history.back(-1);"

		End If
	Else
		sql = "INSERT INTO "&tableName&" (depth, pos, title, context, user_id, regist_date, state, isUse, read_id) "&_
									"VALUES ( "&_
									" 0 ,"&_
									" IDENT_CURRENT('"&tableName&"'),"&_
									" '"&title&"' ,"&_
									" '"&context&"' ,"&_
									" '"&writer&"' ,"&_
									" getDate() ,"&_
									" 0,"&_
									" 1,"&_
									" '"&writer&"' "&_
									")"

		dbcon.execute(sql), Result
		If Result > 0 Then
			msg = "정상적으로 저장되었습니다."
			url = "location.href = 'list.asp'"
		Else
			msg = "다시시도하시기 바랍니다."
			url = "history.back(-1);"
		End If

	End If

	Set rs = Nothing
	dbcon.close

End If

response.write "<script type='text/javascript'>" & vbCrLf
response.write " alert('"&msg&"'); " & vbCrLf
response.write url & vbCrLf
response.write "</script>"

%>