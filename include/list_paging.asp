			<%
			'PAGING

			'group�� column	��
			groupColumn	= 10

			'��ü column ��
			If rowcount	> 0	then
				totalcolumnCount =	Ceil(totalRow/ rowCount)
			Else
				totalcolumnCount =	0  '�˻� ������	�ϳ��� ������ 0	���γ����� ������ ���� ������....
			End If

			'��ü group��
			totalGroupCount	= Ceil(totalcolumnCount/groupColumn)

			'���� groupNum
			groupNum = Ceil(thisPage/groupColumn)

			'���ݽ����ϴ� �÷��� ��ȣ
			startNum = (groupNum-1)	* groupColumn +1

			'���ݽ����ϴ� �÷��� ����ȣ
			endNum = ((groupNum-1) * groupColumn)+ groupColumn
			If endNum >	totalcolumnCount then
				endNum = totalcolumnCount
			End If

			'���� group�� �����ϴ� �÷��� ��ȣ
			pervStartNum = (groupNum-2)	* groupColumn +1

			If pervStartNum	< 1	then

			Else
				startPage =	"<li><a	href='?subTrack="& subTrack &"&page="& 1 & urlClause & "' title='ó���������� �̵�' class='icon2'><img src='/images/common/icon_first.png' alt='ó��������' /></a></li>"
				pervPage = "<li><a href='?subTrack="& subTrack &"&page="& pervStartNum	& urlClause	& "' title='������������ �̵�' class='icon1'><img	src='/images/common/icon_prev.png' alt='����������'/></a></li>"
			End If

			'���� group�� �����ϴ� �÷��� ��ȣ
			nextStartNum = groupNum	* groupColumn +1

			If nextStartNum	> totalcolumnCount then
				'
			Else
				'���� group�� ù Į��
				nextPage = "<li><a href='?subTrack="& subTrack &"&page="& nextStartNum & urlClause	& "' title='������������ �̵�' class='icon1'><img	src='/images/common/icon_next.png' alt='����������'/></a></li>"
				endPage	= nextStart	& "<li><a href='?subTrack="& subTrack &"&page="& totalcolumnCount & urlClause & "' title='������ �������� �̵�' class='icon2'><img src='/images/common/icon_last.png' alt='������������'/></a></li>"
			End If

			%>

			<!-- paging -->
			<ul class="btnList pdTop8 clearfix pd10">
				<%=startPage%>
				<%=pervPage%>
				<%
				For	i =	startNum to endNum
				If i = thisPage	then
						response.write "<li	class='colorB'><a href='#a' class='on'>" & i & "</a></li>"
					Else
						response.write "<li	class='mgR4'><a	href='?subTrack="& subTrack &"&page="& i & urlClause & "'>" & i & "</a></li>"
					End If
				next
				%>
				<%=nextPage%>
				<%=endpage%>
			</ul>