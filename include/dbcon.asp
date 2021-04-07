<%
'DBCon
Set dbcon = Server.CreateObject("ADODB.Connection")
dbcon.CursorLocation = 3
dbcon.Open "Provider= SQLOLEDB;Data Source=127.0.0.1;Initial Catalog=webTest;User id=tester;password=tester12"
dbcon.CommandTimeout=600
except_name = ""
except_id =""
permit_ip = ""
%>