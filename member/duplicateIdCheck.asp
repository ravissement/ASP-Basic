<%
'	ID ม฿บน check
%>
<!--#include virtual="/include/dbcon.asp"-->
<!--#include virtual="/include/function.asp"-->
<%
ckid = trim(request("ckid"))

If loginIDCHK(ckid) = False Then
	response.write "NO"
Else

	sql = "SELECT * FROM t_usr WHERE user_id = '" & ckid & "'"
	set  rs = dbcon.execute(sql)
	cnt = rs.recordcount

	If cnt= 0  then
		response.write "OK"
	Else
		response.write "NO"
	End If
End If
dbcon.close
Set rs = Nothing

%>
