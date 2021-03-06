<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="/css/style.css" type="text/css">
<script src="/js/jquery.js"></script>
</head>
<body>
<div style="text-align:center;">
<h1>회원가입</h1>
</div>
<br><br><br>
<form name="memberJoin" method="post" >
<div class="wrap">
	<table class="tableContent">
		<tbody>
		<tr>
			<th scope="row"><label for="user_name" >이름</label></th>
			<td>
				<input type="text" name="user_name" id="user_name" style="ime-mode: active;" maxlength="20"/>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_id">아이디</label></th>
			<td>
				<input type="text" id="user_id" name="user_id" style="ime-mode:inactive;" maxlength="12"/>
				<input type="button" name="id_double_check" id="id_double_check" value="중복확인" class="bBtn"/>
				<span id = "idMsg" style="color: red;"> 중복확인이 필요합니다.</span>
				<input type="hidden" name="idck" value=""/><!--중복id 체크결과-->
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_pswd">비밀번호</label></th>
			<td>
				<span class="join_pw"><input type="password" name="user_pswd" id="user_pswd" maxlength="20"/>
				<i class="fa fa-eye fa-lg" id="eye1"></i></span>
				<span class="dis_none">영어, 숫자를 섞어 8자 이상의 암호를 사용하십시오.</span>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_pswd_check">비밀번호 확인</label></th>
			<td>
				<span class="join_pw"><input type="password" name="user_pswd_check" id="user_pswd_check" maxlength="20"/>
				<i class="fa fa-eye fa-lg" id="eye2"></i></span>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="email1">이메일</label></th>
			<td>
				<input type="text" name="email" id="email"/>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="phone">핸드폰번호</label></th>
			<td>
				<input type="tel" id="phone1" name="phone1" maxlength="3" title="핸드폰번호 앞3자리" style="margin-right:0;width:90px;"> -
				<input type="tel" id="phone2" name="phone2" maxlength="4" title="핸드폰번호 가운데4자리" style="margin-right:0;width:90px;"> -
				<input type="tel" id="phone3" name="phone3" maxlength="4" title="핸드폰번호 끝4자리" style="width:90px;">
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_birth_y">생년월일</label></th>
			<td>
				<select name="user_birth_y" id="user_birth_y">
					<option value="">선택</option>
					<%
					for i= Year(now) - 15 to Year(now) - 80 step -1
					%>
					<option value="<%=right(i,4)%>"><%=i%></option>
					<%
					next
					%>
				</select>
				<span>년</span>
				<select name="user_birth_m" id="user_birth_m">
					<option value="">선택</option>
					<%
					for i=1 to 12
						if i<10 then
							mm ="0"&i
						else
							mm=i
						end if
					%>
					<option value="<%=mm%>"><%=mm%></option>
					<%
					next
					%>
				</select>
				<span>월</span>
				<select name="user_birth_d" id="user_birth_d">
					<option value="">선택</option>
					<%
					for i=1 to 31
						if i<10 then
							dd ="0"&i
						else
							dd=i
						end if
					%>
					<option value="<%=dd%>"><%=dd%></option>
					<%
					next
					%>
				</select>
				<span>일</span>
			</td>
		</tr>
	</table>
</form>
	<table>
		<tr>
		<td>
			<a id="submitBtn" href="#" class="aBtn">저장</a>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<a id="cancleBtn" href="#" class="aBtn">취소</a>
		</td>
		</tr>
	</table>
</div>


</body>


<script>

	//입력제한
	$('input[name=phone1]').on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});
	$('input[name=phone2]').on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});
	$('input[name=phone3]').on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});

	//두번째 전화번호 번호 4자리 입력후에 세번째 전화번호 입력 창으로 포커스이동
	$('#phone2').keyup(function(event){
		if ($(this).val().length==4) {
			$('input[name=phone3]').focus();
		};
	});

	// id중복체크
	$('input[name=id_double_check]').click(function(){
		var str= $('input[name=user_id]').val();
		var len =str.length;

		if (!str){
			alert("아이디를 입력하십시오.");
			$('input[name=user_id]').focus();
			return false;
		}

		//id 영어와 숫자만 입력가능
		var idRule= /^[a-zA-Z0-9]{8,12}$/;
		if (!idRule.test(str)) {
			alert("영어와 숫자 8~12자리만 입력가능합니다.");
			$('input[name=user_id]').focus();
			return false;
		}

		$.get('/member/duplicateIdCheck.asp',
			{'ckid':str},
			function(data) {
				//alert(data)
				if (data =="OK"){
					$('input[name=idck]').val("1");
					$('#idMsg').removeAttr("style");
					$('#idMsg').text('사용할 수 있는 ID입니다.');
				}
				else{
					$('input[name=idck]').val("");
					$('#idMsg').removeAttr("style");
					$('#idMsg').text('이미 사용중인 ID입니다.');
					$('#idMsg').css('color', 'red');
				}
			}
		);

	});


	//중복등록 방지
	var chk_submit = 0

	$('#submitBtn').click(function(){
		chk_submit++;

		var user_name =		$('input[name=user_name]').val();
		var user_id =			$('input[name=user_id]').val();
		var idck =			$('input[name=idck]').val();
		var user_pswd =		$('input[name=user_pswd]').val();
		var user_pswd_check =	$('input[name=user_pswd_check]').val();
		var email =			$('input[name=email]').val();
		var phone1 =			$('input[name=phone1]').val();
		var phone2 =			$('input[name=phone2]').val();
		var phone3 =			$('input[name=phone3]').val();
		var user_birth_y =		$('select[name=user_birth_y]').val();
		var user_birth_m =		$('select[name=user_birth_m]').val();
		var user_birth_d =		$('select[name=user_birth_d]').val();

		if (chk_submit==1){


			//한글, 영어만 가능
			var nameRule= /[가-힣a-zA-Z]+$/;
			if (!nameRule.test(user_name)) {
				alert("이름을 확인해 주십시오\n한글, 영문만 사용가능합니다.");
				$('input[name=user_name]').focus();
				chk_submit = 0
				return false;
			};

			if(checkSpace(user_name)==true){
				alert("이름에 공백을 포함할 수 없습니다.");
				$('input[name=user_name]').focus();
				chk_submit = 0
				return false;
			};

			//id 8-12자의 영어와 숫자만 입력가능
			var idRule= /^[a-zA-Z0-9]{8,12}$/;
			if (!idRule.test(user_id)) {
				alert("아이디를 확인해 주십시오\n8-12자의 영어와 숫자만 가능합니다.");
				$('input[name=user_id]').focus();
				chk_submit = 0
				return false;
			};

			//ID 중복확인
			if (!idck){
				alert("ID 중복확인을 해 주십시오.");
				$('input[name=user_id_check]').focus();
				chk_submit = 0
				return false;
			};

			//비밀번호확인 --길이 8~12자/숫자/대,소문자 포함
			var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,12}$/;
			if( !reg.test(user_pswd)) {
				alert("비밀번호는 8자~12자 이어야 하며, 영어와 숫자가 함께 포함되어야 합니다.");
				$('input[name=user_pswd]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_pswd_check){
				alert("비밀번호를 확인을 입력해 주십시오. ")
				$('input[name=user_pswd_check]').focus();
				chk_submit = 0
				return false;
			};

			if (user_pswd != user_pswd_check){
				alert("비밀번호가 일치하지 않습니다. ")
				$('input[name=user_pswd_check]').focus();
				chk_submit = 0
				return false;
			};

			if(!email) {
				alert("이메일을 입력해주세요.");
				$('input[name=email]').focus();
				chk_submit = 0
				return false;
			};

			var reg = /[a-z0-9]{2,}@[a-z0-9-]{2,}\.[a-z0-9]{2,}/i;
			if( !reg.test(email)) {
				alert("잘못된 이메일형식입니다. ");
				$('input[name=email]').focus();
				chk_submit = 0
				return false;
			};

			if (!phone1){
				alert("핸드폰번호를 첫자리를 입력해 주십시오. ")
				$('input[name=phone1]').focus();
				chk_submit = 0
				return false;
			};

			if (!phone2){
				alert("중간번호를 입력해 주십시오. ")
				$('input[name=phone2]').focus();
				chk_submit = 0
				return false;
			};

			if (!phone3){
				alert("마지막번호를 입력해 주십시오. ")
				$('input[name=phone3]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_birth_y){
				alert("출생 년도를 입력해 주십시오. ")
				$('select[name=user_birth_y]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_birth_m){
				alert("출생 월을 입력해 주십시오. ")
				$('select[name=user_birth_m]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_birth_d){
				alert("출생 일을 입력해 주십시오. ")
				$('select[name=user_birth_d]').focus();
				chk_submit = 0
				return false;
			};

			if(!confirm("회원가입을 진행하시겠습니까?")) {
				chk_submit = 0
				return false;
			};

			$('form[name=memberJoin').attr('action', 'join_save.asp').submit();
		}
		else {
			alert("진행중입니다.\n잠시 기다려 주십시오.")
			chk_submit = 0;
		}

	});

	//Password
	$('#eye1').click(function(){
		$('input[name=user_pswd]').toggleClass('active');

        if($('input').hasClass('active')){
            $(this).attr('class',"fa fa-eye-slash fa-lg")
            $('input[name=user_pswd]').prop('type','text');
        }else{
            $(this).attr('class',"fa fa-eye fa-lg")
            $('input[name=user_pswd]').prop('type','password');
        }
	});

	$('#eye2').click(function(){
		$('input[name=user_pswd_check]').toggleClass('active');

        if($('input').hasClass('active')){
            $(this).attr('class',"fa fa-eye-slash fa-lg")
            $('input[name=user_pswd_check]').prop('type','text');
        }else{
            $(this).attr('class',"fa fa-eye fa-lg")
            $('input[name=user_pswd_check]').prop('type','password');
        }
	});


	//공백 확인
	function checkSpace(str) { if(str.search(/\s/) != -1) { return true; } else { return false; } }

	$('#cancleBtn').click(function() {
		if(!confirm("취소하시겠습니까?")){
			return false;
		};

		location.href="/"
	});

</script>

</html>