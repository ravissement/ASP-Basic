<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="/css/style.css" type="text/css">
<script src="/js/jquery.js"></script>
</head>
<body>
<div style="text-align:center;">
<h1>È¸¿ø°¡ÀÔ</h1>
</div>
<br><br><br>
<form name="memberJoin" method="post" >
<div class="wrap">
	<table class="tableContent">
		<tbody>
		<tr>
			<th scope="row"><label for="user_name" >ÀÌ¸§</label></th>
			<td>
				<input type="text" name="user_name" id="user_name" style="ime-mode: active;" maxlength="20"/>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_id">¾ÆÀÌµğ</label></th>
			<td>
				<input type="text" id="user_id" name="user_id" style="ime-mode:inactive;" maxlength="12"/>
				<input type="button" name="id_double_check" id="id_double_check" value="Áßº¹È®ÀÎ" class="bBtn"/>
				<span id = "idMsg" style="color: red;"> Áßº¹È®ÀÎÀÌ ÇÊ¿äÇÕ´Ï´Ù.</span>
				<input type="hidden" name="idck" value=""/><!--Áßº¹id Ã¼Å©°á°ú-->
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_pswd">ºñ¹Ğ¹øÈ£</label></th>
			<td>
				<span class="join_pw"><input type="password" name="user_pswd" id="user_pswd" maxlength="20"/>
				<i class="fa fa-eye fa-lg" id="eye1"></i></span>
				<span class="dis_none">¿µ¾î, ¼ıÀÚ¸¦ ¼¯¾î 8ÀÚ ÀÌ»óÀÇ ¾ÏÈ£¸¦ »ç¿ëÇÏ½Ê½Ã¿À.</span>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_pswd_check">ºñ¹Ğ¹øÈ£ È®ÀÎ</label></th>
			<td>
				<span class="join_pw"><input type="password" name="user_pswd_check" id="user_pswd_check" maxlength="20"/>
				<i class="fa fa-eye fa-lg" id="eye2"></i></span>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="email1">ÀÌ¸ŞÀÏ</label></th>
			<td>
				<input type="text" name="email" id="email"/>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="phone">ÇÚµåÆù¹øÈ£</label></th>
			<td>
				<input type="tel" id="phone1" name="phone1" maxlength="3" title="ÇÚµåÆù¹øÈ£ ¾Õ3ÀÚ¸®" style="margin-right:0;width:90px;"> -
				<input type="tel" id="phone2" name="phone2" maxlength="4" title="ÇÚµåÆù¹øÈ£ °¡¿îµ¥4ÀÚ¸®" style="margin-right:0;width:90px;"> -
				<input type="tel" id="phone3" name="phone3" maxlength="4" title="ÇÚµåÆù¹øÈ£ ³¡4ÀÚ¸®" style="width:90px;">
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_birth_y">»ı³â¿ùÀÏ</label></th>
			<td>
				<select name="user_birth_y" id="user_birth_y">
					<option value="">¼±ÅÃ</option>
					<%
					for i= Year(now) - 15 to Year(now) - 80 step -1
					%>
					<option value="<%=right(i,4)%>"><%=i%></option>
					<%
					next
					%>
				</select>
				<span>³â</span>
				<select name="user_birth_m" id="user_birth_m">
					<option value="">¼±ÅÃ</option>
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
				<span>¿ù</span>
				<select name="user_birth_d" id="user_birth_d">
					<option value="">¼±ÅÃ</option>
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
				<span>ÀÏ</span>
			</td>
		</tr>
	</table>
</form>
	<table>
		<tr>
		<td>
			<a id="submitBtn" href="#" class="aBtn">ÀúÀå</a>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<a id="cancleBtn" href="#" class="aBtn">Ãë¼Ò</a>
		</td>
		</tr>
	</table>
</div>


</body>


<script>

	//ÀÔ·ÂÁ¦ÇÑ
	$('input[name=phone1]').on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});
	$('input[name=phone2]').on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});
	$('input[name=phone3]').on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});

	//µÎ¹øÂ° ÀüÈ­¹øÈ£ ¹øÈ£ 4ÀÚ¸® ÀÔ·ÂÈÄ¿¡ ¼¼¹øÂ° ÀüÈ­¹øÈ£ ÀÔ·Â Ã¢À¸·Î Æ÷Ä¿½ºÀÌµ¿
	$('#phone2').keyup(function(event){
		if ($(this).val().length==4) {
			$('input[name=phone3]').focus();
		};
	});

	// idÁßº¹Ã¼Å©
	$('input[name=id_double_check]').click(function(){
		var str= $('input[name=user_id]').val();
		var len =str.length;

		if (!str){
			alert("¾ÆÀÌµğ¸¦ ÀÔ·ÂÇÏ½Ê½Ã¿À.");
			$('input[name=user_id]').focus();
			return false;
		}

		//id ¿µ¾î¿Í ¼ıÀÚ¸¸ ÀÔ·Â°¡´É
		var idRule= /^[a-zA-Z0-9]{8,12}$/;
		if (!idRule.test(str)) {
			alert("¿µ¾î¿Í ¼ıÀÚ 8~12ÀÚ¸®¸¸ ÀÔ·Â°¡´ÉÇÕ´Ï´Ù.");
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
					$('#idMsg').text('»ç¿ëÇÒ ¼ö ÀÖ´Â IDÀÔ´Ï´Ù.');
				}
				else{
					$('input[name=idck]').val("");
					$('#idMsg').removeAttr("style");
					$('#idMsg').text('ÀÌ¹Ì »ç¿ëÁßÀÎ IDÀÔ´Ï´Ù.');
					$('#idMsg').css('color', 'red');
				}
			}
		);

	});


	//Áßº¹µî·Ï ¹æÁö
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


			//ÇÑ±Û, ¿µ¾î¸¸ °¡´É
			var nameRule= /[°¡-ÆRa-zA-Z]+$/;
			if (!nameRule.test(user_name)) {
				alert("ÀÌ¸§À» È®ÀÎÇØ ÁÖ½Ê½Ã¿À\nÇÑ±Û, ¿µ¹®¸¸ »ç¿ë°¡´ÉÇÕ´Ï´Ù.");
				$('input[name=user_name]').focus();
				chk_submit = 0
				return false;
			};

			if(checkSpace(user_name)==true){
				alert("ÀÌ¸§¿¡ °ø¹éÀ» Æ÷ÇÔÇÒ ¼ö ¾ø½À´Ï´Ù.");
				$('input[name=user_name]').focus();
				chk_submit = 0
				return false;
			};

			//id 8-12ÀÚÀÇ ¿µ¾î¿Í ¼ıÀÚ¸¸ ÀÔ·Â°¡´É
			var idRule= /^[a-zA-Z0-9]{8,12}$/;
			if (!idRule.test(user_id)) {
				alert("¾ÆÀÌµğ¸¦ È®ÀÎÇØ ÁÖ½Ê½Ã¿À\n8-12ÀÚÀÇ ¿µ¾î¿Í ¼ıÀÚ¸¸ °¡´ÉÇÕ´Ï´Ù.");
				$('input[name=user_id]').focus();
				chk_submit = 0
				return false;
			};

			//ID Áßº¹È®ÀÎ
			if (!idck){
				alert("ID Áßº¹È®ÀÎÀ» ÇØ ÁÖ½Ê½Ã¿À.");
				$('input[name=user_id_check]').focus();
				chk_submit = 0
				return false;
			};

			//ºñ¹Ğ¹øÈ£È®ÀÎ --±æÀÌ 8~12ÀÚ/¼ıÀÚ/´ë,¼Ò¹®ÀÚ Æ÷ÇÔ
			var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,12}$/;
			if( !reg.test(user_pswd)) {
				alert("ºñ¹Ğ¹øÈ£´Â 8ÀÚ~12ÀÚ ÀÌ¾î¾ß ÇÏ¸ç, ¿µ¾î¿Í ¼ıÀÚ°¡ ÇÔ²² Æ÷ÇÔµÇ¾î¾ß ÇÕ´Ï´Ù.");
				$('input[name=user_pswd]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_pswd_check){
				alert("ºñ¹Ğ¹øÈ£¸¦ È®ÀÎÀ» ÀÔ·ÂÇØ ÁÖ½Ê½Ã¿À. ")
				$('input[name=user_pswd_check]').focus();
				chk_submit = 0
				return false;
			};

			if (user_pswd != user_pswd_check){
				alert("ºñ¹Ğ¹øÈ£°¡ ÀÏÄ¡ÇÏÁö ¾Ê½À´Ï´Ù. ")
				$('input[name=user_pswd_check]').focus();
				chk_submit = 0
				return false;
			};

			if(!email) {
				alert("ÀÌ¸ŞÀÏÀ» ÀÔ·ÂÇØÁÖ¼¼¿ä.");
				$('input[name=email]').focus();
				chk_submit = 0
				return false;
			};

			var reg = /[a-z0-9]{2,}@[a-z0-9-]{2,}\.[a-z0-9]{2,}/i;
			if( !reg.test(email)) {
				alert("Àß¸øµÈ ÀÌ¸ŞÀÏÇü½ÄÀÔ´Ï´Ù. ");
				$('input[name=email]').focus();
				chk_submit = 0
				return false;
			};

			if (!phone1){
				alert("ÇÚµåÆù¹øÈ£¸¦ Ã¹ÀÚ¸®¸¦ ÀÔ·ÂÇØ ÁÖ½Ê½Ã¿À. ")
				$('input[name=phone1]').focus();
				chk_submit = 0
				return false;
			};

			if (!phone2){
				alert("Áß°£¹øÈ£¸¦ ÀÔ·ÂÇØ ÁÖ½Ê½Ã¿À. ")
				$('input[name=phone2]').focus();
				chk_submit = 0
				return false;
			};

			if (!phone3){
				alert("¸¶Áö¸·¹øÈ£¸¦ ÀÔ·ÂÇØ ÁÖ½Ê½Ã¿À. ")
				$('input[name=phone3]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_birth_y){
				alert("Ãâ»ı ³âµµ¸¦ ÀÔ·ÂÇØ ÁÖ½Ê½Ã¿À. ")
				$('select[name=user_birth_y]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_birth_m){
				alert("Ãâ»ı ¿ùÀ» ÀÔ·ÂÇØ ÁÖ½Ê½Ã¿À. ")
				$('select[name=user_birth_m]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_birth_d){
				alert("Ãâ»ı ÀÏÀ» ÀÔ·ÂÇØ ÁÖ½Ê½Ã¿À. ")
				$('select[name=user_birth_d]').focus();
				chk_submit = 0
				return false;
			};

			if(!confirm("È¸¿ø°¡ÀÔÀ» ÁøÇàÇÏ½Ã°Ú½À´Ï±î?")) {
				chk_submit = 0
				return false;
			};

			$('form[name=memberJoin').attr('action', 'join_save.asp').submit();
		}
		else {
			alert("ÁøÇàÁßÀÔ´Ï´Ù.\nÀá½Ã ±â´Ù·Á ÁÖ½Ê½Ã¿À.")
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


	//°ø¹é È®ÀÎ
	function checkSpace(str) { if(str.search(/\s/) != -1) { return true; } else { return false; } }

	$('#cancleBtn').click(function() {
		if(!confirm("Ãë¼ÒÇÏ½Ã°Ú½À´Ï±î?")){
			return false;
		};

		location.href="/"
	});

</script>

</html>