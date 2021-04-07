<!--#include virtual ="/include/dbcon.asp"-->
<!--#include virtual ="/include/session.asp"-->
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/css/style.css" type="text/css">
</head><br>

<%
tableName = "test"
tableName2 = "t_usr"
%>
<!--#include virtual ="/include/list_paging_top.asp"-->
<%
sql =";with "&_
" tmp_a as (select row_number() over (order by pos ASC, depth DESC, t1.Regist_date DESC) AS [RowNum], "&_
" t1.idx, depth, pos, title, t1.user_id, read_id, t1.regist_date, state, t1.isUse, t2.user_name "&_
" from "& tableName &" as t1 LEFT JOIN "& tableName2 &" as t2 On t1.user_id = t2.user_id "& whereStr &" ) "&_
" SELECT a.* from tmp_a as a WHERE RowNum between " & totalRow-end_num & " and " & totalRow-start_num &_
" order by  rownum DESC "

%>


<body>
<div style="text-align:right;">
	<a class="aBtn" href="/member/logout.asp">LogOut</a>
</div>
<div style="text-align: center;">
	<h1>Board List</h1>
	<br><br><br>
	<a href="/boardWrite/write.asp" class="aBtn">SUMMERNOTE</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="/boardWrite/naver_write.asp" class="aBtn">NAVER</a>
</div>
<br/><br/><br/>
<div class="wrap">
	<table>
		<thead>
			<tr>
				<th class="th1">번호</th>
				<th>제목</th>
				<th class="th1">답변상태</th>
				<th class="th2">작성자</th>
				<th class="th1">등록일</th>
			</tr>
		</thead>
		<tbody>
			<%
			Set rs = dbcon.execute(sql)
			If rs.BOF Or rs.EOF Then

			Else
				Do until rs.EOF

				If rs("depth") = 1 Then
				viewpath = "list_view.asp?idx=" & rs("pos")
				%>
				<tr>
					<td><%=rs("RowNum")%></td>
					<td style="text-align: left;"><a href="<%=viewpath%>"><span style="background-color: #FAF58C">└  <%=rs("title")%></span></a></td>
					<td><p style='background-color: #FFB4FF;'>답변완료</p></td>
					<td><%=rs("user_name")%></td>
					<td><%=left(rs("regist_date"), 10)%></td>
				</tr>
				<%
				Else
				viewpath = "list_view.asp?idx=" & rs("idx")
				%>
				<tr>
					<td><%=rs("RowNum")%></td>
					<td style="text-align: left;">
						<a href="<%=viewpath%>"><%=rs("title")%></a>
					</td>
					<td>
					<%
					If rs("state") = "0" Then
						response.write "<p style='background-color:#A2E9FF'>답변대기</p>"
					Else
						response.write "<p style='background-color: #FFB4FF;'>답변완료</p>"
					End If
					%>
					</td>
					<td><%=rs("user_name")%></td>
					<td><%=left(rs("regist_date"), 10)%></td>
				</tr>
				<%
				End If

				rs.movenext
				loop
			End If
			Set rs = Nothing
			dbcon.close
			%>
		</tbody>
	</table>
	<div class="con_number">
		<!--#include virtual ="/include/list_paging.asp"-->
	</div>

	<div style="text-align:center;">
	<br/>
	<span style="font-weight:bold;"><%=unm%></span>님 방문을 환영합니다.
	</div>
</div>
</body>
</html>