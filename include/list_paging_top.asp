<%
pattern2 =	"[^-0-9 ]"

If Len(ki) > 0 And Len(kd) >0 then
	If searchCHK(kd) = False Then
		msg = "잘못된 문자가 포함되어있습니다."
		url = "history.back(-1);"
		response.write "<script type='text/javascript'>" & vbCrLf
		response.write " alert('"&msg&"'); " & vbCrLf
		response.write url & vbCrLf
		response.write "</script>"
	Else
		whereStr = whereStr & " and " & ki & " like '%" & kd & "%' "
		urlConf = "&ki = " & ki & "&kd=" & kd
	End If
end If


rowCount =request("rowCount")
If rowCount ="" or isnull(rowCount) then rowCount = 10

page = request("page")
If page="" or isnull(page) then page =0
page= page -1
If page="" or isnull(page) or page< 0 then	page=0
thisPage = page	+ 1

start_num =	page * rowCount
end_num	= start_num	+ rowCount

columnLimt = 60


If Word_check(rowCount, pattern2) = False Or Word_check(page, pattern2) = False Then
	msg = "잘못된 문자가 포함되어있습니다."
	url = "history.back(-1);"
	response.write "<script type='text/javascript'>" & vbCrLf
	response.write " alert('"&msg&"'); " & vbCrLf
	response.write url & vbCrLf
	response.write "</script>"
End If

sql_page = "SELECT count(*)	as pg from " & tableName & " as e " & whereStr
set rs_page = dbcon.execute(sql_page)
totalRow = rs_page("pg")
%>