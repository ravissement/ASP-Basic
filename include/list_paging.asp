			<%
			'PAGING

			'group의 column	수
			groupColumn	= 10

			'전체 column 수
			If rowcount	> 0	then
				totalcolumnCount =	Ceil(totalRow/ rowCount)
			Else
				totalcolumnCount =	0  '검색 조건이	하나도 없을때 0	으로나누면 에러가 나기 때문에....
			End If

			'전체 group수
			totalGroupCount	= Ceil(totalcolumnCount/groupColumn)

			'현재 groupNum
			groupNum = Ceil(thisPage/groupColumn)

			'지금시작하는 컬럼의 번호
			startNum = (groupNum-1)	* groupColumn +1

			'지금시작하는 컬럼의 끝번호
			endNum = ((groupNum-1) * groupColumn)+ groupColumn
			If endNum >	totalcolumnCount then
				endNum = totalcolumnCount
			End If

			'이전 group의 시작하는 컬럼의 번호
			pervStartNum = (groupNum-2)	* groupColumn +1

			If pervStartNum	< 1	then

			Else
				startPage =	"<li><a	href='?subTrack="& subTrack &"&page="& 1 & urlClause & "' title='처음페이지로 이동' class='icon2'><img src='/images/common/icon_first.png' alt='처음페이지' /></a></li>"
				pervPage = "<li><a href='?subTrack="& subTrack &"&page="& pervStartNum	& urlClause	& "' title='이전페이지로 이동' class='icon1'><img	src='/images/common/icon_prev.png' alt='이전페이지'/></a></li>"
			End If

			'이후 group의 시작하는 컬럼의 번호
			nextStartNum = groupNum	* groupColumn +1

			If nextStartNum	> totalcolumnCount then
				'
			Else
				'다음 group의 첫 칼럼
				nextPage = "<li><a href='?subTrack="& subTrack &"&page="& nextStartNum & urlClause	& "' title='다음페이지로 이동' class='icon1'><img	src='/images/common/icon_next.png' alt='다음페이지'/></a></li>"
				endPage	= nextStart	& "<li><a href='?subTrack="& subTrack &"&page="& totalcolumnCount & urlClause & "' title='마지막 페이지로 이동' class='icon2'><img src='/images/common/icon_last.png' alt='마지막페이지'/></a></li>"
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