<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="/css/style.css" type="text/css">
<script src="/js/jquery.js"></script>
</head>
<body>
<div style="text-align:center;">
<h1>ȸ������</h1>
</div>
<br><br><br>
<form name="memberJoin" method="post" >
<div class="wrap">
	<table class="tableContent">
		<tbody>
		<tr>
			<th scope="row"><label for="user_name" >�̸�</label></th>
			<td>
				<input type="text" name="user_name" id="user_name" style="ime-mode: active;" maxlength="20"/>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_id">���̵�</label></th>
			<td>
				<input type="text" id="user_id" name="user_id" style="ime-mode:inactive;" maxlength="12"/>
				<input type="button" name="id_double_check" id="id_double_check" value="�ߺ�Ȯ��" class="bBtn"/>
				<span id = "idMsg" style="color: red;"> �ߺ�Ȯ���� �ʿ��մϴ�.</span>
				<input type="hidden" name="idck" value=""/><!--�ߺ�id üũ���-->
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_pswd">��й�ȣ</label></th>
			<td>
				<span class="join_pw"><input type="password" name="user_pswd" id="user_pswd" maxlength="20"/>
				<i class="fa fa-eye fa-lg" id="eye1"></i></span>
				<span class="dis_none">����, ���ڸ� ���� 8�� �̻��� ��ȣ�� ����Ͻʽÿ�.</span>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_pswd_check">��й�ȣ Ȯ��</label></th>
			<td>
				<span class="join_pw"><input type="password" name="user_pswd_check" id="user_pswd_check" maxlength="20"/>
				<i class="fa fa-eye fa-lg" id="eye2"></i></span>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="email1">�̸���</label></th>
			<td>
				<input type="text" name="email" id="email"/>
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="phone">�ڵ�����ȣ</label></th>
			<td>
				<input type="tel" id="phone1" name="phone1" maxlength="3" title="�ڵ�����ȣ ��3�ڸ�" style="margin-right:0;width:90px;"> -
				<input type="tel" id="phone2" name="phone2" maxlength="4" title="�ڵ�����ȣ ���4�ڸ�" style="margin-right:0;width:90px;"> -
				<input type="tel" id="phone3" name="phone3" maxlength="4" title="�ڵ�����ȣ ��4�ڸ�" style="width:90px;">
			</td>
		</tr>
		<tr>
			<th scope="row"><label for="user_birth_y">�������</label></th>
			<td>
				<select name="user_birth_y" id="user_birth_y">
					<option value="">����</option>
					<%
					for i= Year(now) - 15 to Year(now) - 80 step -1
					%>
					<option value="<%=right(i,4)%>"><%=i%></option>
					<%
					next
					%>
				</select>
				<span>��</span>
				<select name="user_birth_m" id="user_birth_m">
					<option value="">����</option>
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
				<span>��</span>
				<select name="user_birth_d" id="user_birth_d">
					<option value="">����</option>
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
				<span>��</span>
			</td>
		</tr>
	</table>
</form>
	<table>
		<tr>
		<td>
			<a id="submitBtn" href="#" class="aBtn">����</a>
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			<a id="cancleBtn" href="#" class="aBtn">���</a>
		</td>
		</tr>
	</table>
</div>


</body>


<script>

	//�Է�����
	$('input[name=phone1]').on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});
	$('input[name=phone2]').on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});
	$('input[name=phone3]').on("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});

	//�ι�° ��ȭ��ȣ ��ȣ 4�ڸ� �Է��Ŀ� ����° ��ȭ��ȣ �Է� â���� ��Ŀ���̵�
	$('#phone2').keyup(function(event){
		if ($(this).val().length==4) {
			$('input[name=phone3]').focus();
		};
	});

	// id�ߺ�üũ
	$('input[name=id_double_check]').click(function(){
		var str= $('input[name=user_id]').val();
		var len =str.length;

		if (!str){
			alert("���̵� �Է��Ͻʽÿ�.");
			$('input[name=user_id]').focus();
			return false;
		}

		//id ����� ���ڸ� �Է°���
		var idRule= /^[a-zA-Z0-9]{8,12}$/;
		if (!idRule.test(str)) {
			alert("����� ���� 8~12�ڸ��� �Է°����մϴ�.");
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
					$('#idMsg').text('����� �� �ִ� ID�Դϴ�.');
				}
				else{
					$('input[name=idck]').val("");
					$('#idMsg').removeAttr("style");
					$('#idMsg').text('�̹� ������� ID�Դϴ�.');
					$('#idMsg').css('color', 'red');
				}
			}
		);

	});


	//�ߺ���� ����
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


			//�ѱ�, ��� ����
			var nameRule= /[��-�Ra-zA-Z]+$/;
			if (!nameRule.test(user_name)) {
				alert("�̸��� Ȯ���� �ֽʽÿ�\n�ѱ�, ������ ��밡���մϴ�.");
				$('input[name=user_name]').focus();
				chk_submit = 0
				return false;
			};

			if(checkSpace(user_name)==true){
				alert("�̸��� ������ ������ �� �����ϴ�.");
				$('input[name=user_name]').focus();
				chk_submit = 0
				return false;
			};

			//id 8-12���� ����� ���ڸ� �Է°���
			var idRule= /^[a-zA-Z0-9]{8,12}$/;
			if (!idRule.test(user_id)) {
				alert("���̵� Ȯ���� �ֽʽÿ�\n8-12���� ����� ���ڸ� �����մϴ�.");
				$('input[name=user_id]').focus();
				chk_submit = 0
				return false;
			};

			//ID �ߺ�Ȯ��
			if (!idck){
				alert("ID �ߺ�Ȯ���� �� �ֽʽÿ�.");
				$('input[name=user_id_check]').focus();
				chk_submit = 0
				return false;
			};

			//��й�ȣȮ�� --���� 8~12��/����/��,�ҹ��� ����
			var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,12}$/;
			if( !reg.test(user_pswd)) {
				alert("��й�ȣ�� 8��~12�� �̾�� �ϸ�, ����� ���ڰ� �Բ� ���ԵǾ�� �մϴ�.");
				$('input[name=user_pswd]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_pswd_check){
				alert("��й�ȣ�� Ȯ���� �Է��� �ֽʽÿ�. ")
				$('input[name=user_pswd_check]').focus();
				chk_submit = 0
				return false;
			};

			if (user_pswd != user_pswd_check){
				alert("��й�ȣ�� ��ġ���� �ʽ��ϴ�. ")
				$('input[name=user_pswd_check]').focus();
				chk_submit = 0
				return false;
			};

			if(!email) {
				alert("�̸����� �Է����ּ���.");
				$('input[name=email]').focus();
				chk_submit = 0
				return false;
			};

			var reg = /[a-z0-9]{2,}@[a-z0-9-]{2,}\.[a-z0-9]{2,}/i;
			if( !reg.test(email)) {
				alert("�߸��� �̸��������Դϴ�. ");
				$('input[name=email]').focus();
				chk_submit = 0
				return false;
			};

			if (!phone1){
				alert("�ڵ�����ȣ�� ù�ڸ��� �Է��� �ֽʽÿ�. ")
				$('input[name=phone1]').focus();
				chk_submit = 0
				return false;
			};

			if (!phone2){
				alert("�߰���ȣ�� �Է��� �ֽʽÿ�. ")
				$('input[name=phone2]').focus();
				chk_submit = 0
				return false;
			};

			if (!phone3){
				alert("��������ȣ�� �Է��� �ֽʽÿ�. ")
				$('input[name=phone3]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_birth_y){
				alert("��� �⵵�� �Է��� �ֽʽÿ�. ")
				$('select[name=user_birth_y]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_birth_m){
				alert("��� ���� �Է��� �ֽʽÿ�. ")
				$('select[name=user_birth_m]').focus();
				chk_submit = 0
				return false;
			};

			if (!user_birth_d){
				alert("��� ���� �Է��� �ֽʽÿ�. ")
				$('select[name=user_birth_d]').focus();
				chk_submit = 0
				return false;
			};

			if(!confirm("ȸ�������� �����Ͻðڽ��ϱ�?")) {
				chk_submit = 0
				return false;
			};

			$('form[name=memberJoin').attr('action', 'join_save.asp').submit();
		}
		else {
			alert("�������Դϴ�.\n��� ��ٷ� �ֽʽÿ�.")
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


	//���� Ȯ��
	function checkSpace(str) { if(str.search(/\s/) != -1) { return true; } else { return false; } }

	$('#cancleBtn').click(function() {
		if(!confirm("����Ͻðڽ��ϱ�?")){
			return false;
		};

		location.href="/"
	});

</script>

</html>