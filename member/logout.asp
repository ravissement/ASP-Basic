<%
session("uid") = ""
session("unm") = ""
session.abandon

msg = "로그아웃 되었습니다."
url = "location.href='/'"

response.write "<script type='text/javascript'>" & vbCrLf
response.write " alert('"&msg&"');" & vbCrLf
response.write url & vbCrLf
response.write "</script>"

%>
