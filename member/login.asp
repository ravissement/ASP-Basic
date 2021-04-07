<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="/css/style.css" type="text/css">
<script src="/js/jquery.js"></script>
</head>
<body>
<div style="text-align:center;">
<h1>LOGIN</h1>
</div>

<div style="margin-top:10%;">

</div>

<div class="wrap">
<form name="memberLogin" method="POST">
	<table class="tableContent">
		<tbody>
			<tr>
				<th scope="row"><label for="user_id">ID</label></th>
				<td>
					<input type="text" id="user_id" name="user_id" style="ime-mode:inactive;" maxlength="12"/>
				</td>
			</tr>
			<tr>
				<th scope="row"><label for="user_pswd">PW</label></th>
				<td>
					<span class="join_pw"><input type="password" name="user_pswd" id="user_pswd" maxlength="20"/>
					<i class="fa fa-eye fa-lg" id="eye1"></i></span>
				</td>
			</tr>
		</tbody>
	</table>
</form>

<table>
	<tr>
	<td>
		<a id="submitBtn" href="#" class="aBtn">LogIn</a>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<a id="cancleBtn" href="#" class="aBtn">Cancle</a>
	</td>
	</tr>
</table>
</div>
</body>


<script>
	$('#submitBtn').click(function(){

		var user_id=	$('input[name=user_id]').val();
		var user_pswd= $('input[name=user_pswd]').val();

		if (!user_id){
			alert("아이디를 입력하십시오2.");
			$('input[name=user_id]').focus();
			return false;
		}

		var idRule= /^[a-zA-Z0-9]{8,12}$/;
		if (!idRule.test(user_id)) {
			alert("아이디를 확인해 주십시오\n8-12자의 영문 대소문자와 숫자만 가능합니다2.");
			$('input[name=user_id]').focus();
			return false;
		}

		if (!user_pswd){
			alert("패스워드를 입력하십시오2.");
			$('input[name=user_pswd]').focus();
			return false;
		}

		var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,16}$/;
		if( !reg.test(user_pswd)) {
			alert("비밀번호는 8자 이상이어야 하며, 영어와 숫자가 함께 포함되어야 합니다.");
			$('input[name=user_pswd]').focus();
			chk_submit = 0
			return false;
		};

		$('form[name=memberLogin]').attr('action', 'login_save.asp').submit()

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




	$('#cancleBtn').click(function() {
		if(!confirm("취소하시겠습니까?")){
			return false;
		};

		location.href="/"
	});

</script>

</html>