<%
session("uid") = ""
session("unm") = ""
session.abandon

msg = "�α׾ƿ� �Ǿ����ϴ�."
url = "location.href='/'"

response.write "<script type='text/javascript'>" & vbCrLf
response.write " alert('"&msg&"');" & vbCrLf
response.write url & vbCrLf
response.write "</script>"

%>
