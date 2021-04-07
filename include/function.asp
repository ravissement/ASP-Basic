<%

'======================================================================================================================================
'ceil
'======================================================================================================================================
Function Ceil(ByVal intParam)
	Ceil = -(Int(-(intParam)))
End Function


'======================================================================================================================================
'round
'======================================================================================================================================
Function myround(num, digit)
	If not (num="") then
		myround= formatnumber(num, digit)
		myround= replace(myround,",","")
	End If
End Function



'======================================================================================================================================
'현재 날짜
'======================================================================================================================================
nYMD = left(date(),4)& mid(date(),6,2) & right(date(),2)


'======================================================================================================================================
'날짜 포맷
'======================================================================================================================================
Function disp_Date(cd)
	If not( cd = "" or isnull(cd) ) then
		disp_Date = left(cd,4) & "." & mid(cd,5,2)  & "." & mid(cd,7,2)
	End If
end function

Function disp_Date2(cd)
	If not( cd = "" or isnull(cd) ) then
		disp_Date2 = left(cd,4) & "년" & mid(cd,5,2) & "월" & mid(cd,7,2) & "일"
	End If
end function

Function disp_Date3(cd)
	If not( cd = "" or isnull(cd) ) then
		disp_Date3 = left(cd,4) & "-" & mid(cd,5,2)  & "-" & mid(cd,7,2)
	End If
end function



'======================================================================================================================================
'SQL-INJECTION & XSS 방지	-- 게시판(Title, Context) CHECK
'======================================================================================================================================
Function Check_sql(str)
   Dim result_str
   SQL_Val = str
   SQL_Val = Replace(SQL_Val, ";", " ")
   SQL_Val = Replace(SQL_Val, "@variable", " ")
   SQL_Val = Replace(SQL_Val, "@@variable", " ")
   SQL_Val = Replace(SQL_Val, "+", " ")
   SQL_Val = Replace(SQL_Val, "print", " ")
   SQL_Val = Replace(SQL_Val, "set", " ")
   SQL_Val = Replace(SQL_Val, "%", " ")
   SQL_Val = Replace(SQL_Val, "<script>", " ")
   SQL_Val = Replace(SQL_Val, "<SCRIPT>", " ")
   SQL_Val = Replace(SQL_Val, "script", " ")
   SQL_Val = Replace(SQL_Val, "SCRIPT", " ")
   SQL_Val = Replace(SQL_Val, "or", " ")
   SQL_Val = Replace(SQL_Val, "union", " ")
   SQL_Val = Replace(SQL_Val, "and", " ")
   SQL_Val = Replace(SQL_Val, "insert", " ")
   SQL_Val = Replace(SQL_Val, "openrowset", " ")
   SQL_Val = Replace(SQL_Val, "xp_", " ")
   SQL_Val = Replace(SQL_Val, "decare", " ")
   SQL_Val = Replace(SQL_Val, "select", " ")
   SQL_Val = Replace(SQL_Val, "update", " ")
   SQL_Val = Replace(SQL_Val, "delete", " ")
   SQL_Val = Replace(SQL_Val, "shutdown", " ")
   SQL_Val = Replace(SQL_Val, "drop", " ")
   SQL_Val = Replace(SQL_Val, "--", " ")
   SQL_Val = Replace(SQL_Val, "/*", " ")
   SQL_Val = Replace(SQL_Val, "*/", " ")
   SQL_Val = Replace(SQL_Val, "XP_", " ")
   SQL_Val = Replace(SQL_Val, "DECLARE", " ")
   SQL_Val = Replace(SQL_Val, "SELECT", " ")
   SQL_Val = Replace(SQL_Val, "UPDATE", " ")
   SQL_Val = Replace(SQL_Val, "DELETE", " ")
   SQL_Val = Replace(SQL_Val, "INSERT", " ")
   SQL_Val = Replace(SQL_Val, "SHUTDOWN", " ")
   SQL_Val = Replace(SQL_Val, "DROP", " ")

   result_str = removeXSS(SQL_Val)
   Check_sql = result_str

End Function

Function removeXSS(get_String)
   get_String = Replace(get_String, "&", "&amp;")
   get_String = Replace(get_String, "<xmp", "<x-xmo")
   get_String = Replace(get_String, "javascript", "<x-javascript")
   get_String = Replace(get_String, "script", "<x-script")
   get_String = Replace(get_String, "iframe", "<x-iframe")
   get_String = Replace(get_String, "document", "<x-document")
   get_String = Replace(get_String, "vbscript", "<x-vbscript")
   get_String = Replace(get_String, "applet", "<x-applet")
   get_String = Replace(get_String, "embed", "<x-embed")
   get_String = Replace(get_String, "object", "<x-object")
   get_String = Replace(get_String, "frame", "<x-frame")
   get_String = Replace(get_String, "grameset", "<x-grameset")
   get_String = Replace(get_String, "layer", "<x-layer")
   get_String = Replace(get_String, "bgsound", "<x-bgsound")
   get_String = Replace(get_String, "alert", "<x-alert")
   get_String = Replace(get_String, "onblur", "<x-onblur")
   get_String = Replace(get_String, "onchange", "<x-onchange")
   get_String = Replace(get_String, "onclick", "<x-onclick")
   get_String = Replace(get_String, "ondblclick","<x-ondblclick")
   get_String = Replace(get_String, "onerror", "<x-onerror")
   get_String = Replace(get_String, "onfocus", "<x-onfocus")
   get_String = Replace(get_String, "onload", "<x-onload")
   get_String = Replace(get_String, "onmouse", "<x-onmouse")
   get_String = Replace(get_String, "onscroll", "<x-onscroll")
   get_String = Replace(get_String, "onsubmit", "<x-onsubmit")
   get_String = Replace(get_String, "onunload", "<x-onunload")
   get_String = Replace(get_String, "<", "&lt;")
   get_String = Replace(get_String, ">", "&gt;")
   removeXSS = get_String
End Function


'=====================================================================================================================================
'변수값 초기화(s:변수값, s2:초기값)
'=====================================================================================================================================
Function NVL(s, s2)
   If IsNull(s) Or IsEmpty(s) Or s = "" Then
	  NVL = s2
   Else
	  NVL = s
   End If
End Function


'=======================================================================================================================================
'SQL-INJECTION 방지 : ID Check
'=======================================================================================================================================
Function loginIDCHK(get_String)

	array_split_item = Array("-",  "--",  ";", "=", "/*", "*/", "\\", "/", "//*", "@", "<script", "</script>", "!", "#", "'", "+", "(", ")", "%", "=", "$", "^", "&", "*", " ")

		For array_counter = lbound(array_split_item) to ubound(array_split_item)

			item_position1 = InStr(lcase(get_string), array_split_item(array_counter))

			If item_position1 > 0 then
				result = False
				Exit For
			Else
				result = True
			end If

		next

	loginIDCHK = result

End Function

'=======================================================================================================================================
'SQL-INJECTION 방지 : PW Check
'=======================================================================================================================================
Function loginPWCHK(get_String)

	array_split_item = Array("-",  "--",  ";", "=", "/*", "*/", "\\", "/", "//*", "<script", "</script>", "'", "+", "(", ")", "%", "=", " ")

		For array_counter = lbound(array_split_item) to ubound(array_split_item)

			item_position1 = InStr(lcase(get_string), array_split_item(array_counter))

			If item_position1 > 0 then
				result = False
				Exit For
			Else
				result = True
			end If

		next

	loginPWCHK = result

End Function

'=======================================================================================================================================
'SQL-INJECTION 방지 : 회원가입 form
'=======================================================================================================================================
Function dataCHK(get_String)

	array_split_item = Array( "--",  ";", "=", "/*", "*/", "\\", "/", "//*", "<script", "</script>", "'", "+", "(", ")", "%", "=")

		For array_counter = lbound(array_split_item) to ubound(array_split_item)

			item_position1 = InStr(lcase(get_string), array_split_item(array_counter))

			If item_position1 > 0 then
				result = False
				Exit For
			Else
				result = True
			end If

		next

	dataCHK = result

End Function

'=====================================================================================================================================
'SQL-INJECTION 방지 : 검색 키워드
'=====================================================================================================================================
Function searchCHK(get_String)

	array_split_item = Array( "--",  ";", "=", "/*", "*/", "\\", "/", "//*", "<script", "</script>", "'", "+", "%", "=")

		For array_counter = lbound(array_split_item) to ubound(array_split_item)

			item_position1 = InStr(lcase(get_string), array_split_item(array_counter))

			If item_position1 > 0 then
				result = False
				Exit For
			Else
				result = True
			end If

		next

	searchCHK = result

End Function


'=====================================================================================================================================
'NullByte-INJECTION 방지 : 파일이름
'=====================================================================================================================================
Function fileCHK(get_String)

	array_split_item = Array( "%00", "\0", ";", "..", "./", ".\\", "\\", "/")

		For array_counter = lbound(array_split_item) to ubound(array_split_item)

			item_position1 = InStr(lcase(get_string), array_split_item(array_counter))

			If item_position1 > 0 then
				result = False
				Exit For
			Else
				result = True
			end If

		next

	fileCHK = result

End Function

'===================================================================================================================================
'태그 제거
'===================================================================================================================================
Function stripTags(HTMLstring)
             Set RegularExpressionObject = New RegExp
            With RegularExpressionObject
                      .Pattern = "<[^>]+>"
                      .IgnoreCase = True
                      .Global = True
            End With
            stripTags = RegularExpressionObject.Replace(HTMLstring, "")
            Set RegularExpressionObject = nothing
End Function

'==================================================================================================================================
'정규식
'==================================================================================================================================
Function Word_check(str,patrn)
		Dim regEx, match, matches

		SET regEx = New RegExp
		regEx.Pattern = patrn
		regEx.IgnoreCase = True
		regEx.Global = True
		SET Matches = regEx.Execute(str)

		If 0 < Matches.count then
			Word_check = False
		Else
			Word_check = True
		end If

End Function



%>



