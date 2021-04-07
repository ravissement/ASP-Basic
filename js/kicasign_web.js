
function initCertApp() {

	var html = '';
	html += '<div id="appCallPopup" style="position:fixed;left:0;top:0;right:0;bottom:0;width:100%;height:100%;overflow-y:auto;">';
	html += '<div style="box-sizing:border-box;display:table;width:100%;height:100%;&#10;    background: #ace6df;&#10;    background: -moz-linear-gradient(top, #ace6df 0%, #e8fbb8 100%);&#10;    background: -webkit-linear-gradient(top, #ace6df 0%,#e8fbb8 100%);&#10;    background: linear-gradient(to bottom, #ace6df 0%,#e8fbb8 100%);&#10;    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ace6df", endColorstr="#e8fbb8",GradientType=0 );">';
	html += '<div style="display:table-row;width:100%;height:60px;background:#2b516e;">';
	html += '<h1 style="margin:0;color:#fff;text-align:center;line-height:60px;font-size:24px;font-family:\'맑은 고딕\';">KicaSign+</h1>';
	html += '<a style="position:absolute;right:20px;top:15px;font-size:24px;color:#fff;text-decoration:none;font-family:\'맑은 고딕\';" href="javascript:fnCancel();">✖</a>';
	html += '</div>';
	html += '<div style="box-sizing:border-box;display:table-row;width:100%;">';
	html += '<div style="box-sizing:border-box;display:table-cell;width:100%;vertical-align:middle;padding:20px;">';
	html += '<p style="margin:0;font-size:20px;font-family:\'맑은 고딕\';font-weight:bold;color:#505050;text-align:center;line-height:1.4;">전자서명을 진행하기 위해<br>KICASign+ 앱을 실행합니다.</p>';
	html += '<div style="border-radius:15px;background:#fff;padding:25px;margin:20px 0 0 0;">';
	html += '<p style="margin:0 0 25px 0;font-size:16px;font-family:\'맑은 고딕\';text-align:center;line-height:1.4;">앱이 설치되지 않은 경우<br>아래 ‘앱 설치하기’ 버튼을 클릭하면<br>앱스토어(마켓)으로 이동합니다.</p>';
	html += '<a style="display:block;margin:0 auto;text-decoration:none;max-width:200px;height:45px;line-height:45px;font-size:16px;font-family:\'맑은 고딕\';color:#fff;text-align:center;background:#2b516e;" href="javascript:goAppStore();">앱 설치하기</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '<div style="box-sizing:border-box;display:table-row;width:100%;">';
	html += '<div style="box-sizing:border-box;display:table-cell;width:100%;height:55px;padding:0 10px 10px 10px;">';
	html += '<a style="display:inline-block;text-decoration:none;width:calc(50% - 5px);height:45px;line-height:45px;font-size:16px;font-family:\'맑은 고딕\';color:#fff;text-align:center;background:#b1c5af;float:left;" href="javascript:fnCancel();">취소</a>';
	html += '<a style="display:inline-block;text-decoration:none;width:calc(50% - 5px);height:45px;line-height:45px;font-size:16px;font-family:\'맑은 고딕\';color:#fff;text-align:center;background:#42b4ff;float:right;" href="javascript:fnSubmit();">실행</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	var element=document.getElementById("appPop");
	element.innerHTML=html;
}


function initApp() {

	var html = '';
	html += '<div id="appCallPopup" style="position:fixed;left:0;top:0;right:0;bottom:0;width:100%;height:100%;overflow-y:auto;">';
	html += '<div style="box-sizing:border-box;display:table;width:100%;height:100%;&#10;    background: #ace6df;&#10;    background: -moz-linear-gradient(top, #ace6df 0%, #e8fbb8 100%);&#10;    background: -webkit-linear-gradient(top, #ace6df 0%,#e8fbb8 100%);&#10;    background: linear-gradient(to bottom, #ace6df 0%,#e8fbb8 100%);&#10;    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ace6df", endColorstr="#e8fbb8",GradientType=0 );">';
	html += '	<div style="display:table-row;width:100%;height:60px;background:#2b516e;">';
	html += '		<h1 style="margin:0;color:#fff;text-align:center;line-height:60px;font-size:24px;font-family:\'맑은 고딕\'">KicaSign+</h1>';
	html += '		<a style="position:absolute;right:20px;top:15px;font-size:24px;color:#fff;text-decoration:none;font-family:\'맑은 고딕\'" href="javascript:fnCancel();">✖</a> </div>';
	html += '		<div style="box-sizing:border-box;display:table-row;width:100%;">';
	html += '<div style="box-sizing:border-box;display:table-cell;width:100%;vertical-align:middle;padding:20px;">';
	html += '<p style="margin:0;font-size:20px;font-family:\'맑은 고딕\'font-weight:bold;color:#505050;text-align:center;line-height:1.4;">전자서명을 진행하기 위해<br> KICASign+ 앱을 실행합니다.</p>';
	html += '<div style="border-radius:15px;background:#fff;padding:25px;margin:20px 0 0 0;">';
	html += '<p style="margin:0 0 25px 0;font-size:16px;font-family:\'맑은 고딕\'; text-align:center;line-height:1.4;">KICASign+앱이 설치되지 않은 경우, 아래 ‘앱 설치하기’ 버튼을 클릭하면 설치가 진행됩니다.</p>';
	html += '<a style="display:block;margin:0 auto;text-decoration:none;max-width:200px;height:45px;line-height:45px;font-size:16px;font-family:\'맑은 고딕\';color:#fff;text-align:center;background:#2b516e;" href="javascript:goAppStore();">앱 설치하기</a>';
	html += '</div>';
	html += '<div style="border-radius:15px;background:#fff;padding:25px; padding-bottom:70px; margin:20px 0 0 0; display:block">';
	html += '<p style="margin:0 0 25px 0;font-size:16px;font-family:\'맑은 고딕\'; text-align:center;line-height:1.4;">이미 KICASign+앱을 설치하신 고객께서는 서명 진행하기’ 버튼을 클릭하면 서명이 진행됩니다.</p>';
	html += '<a style="display:block;margin:0 auto;text-decoration:none;width:calc(50% - 10px);height:45px;line-height:45px;font-size:16px;font-family:\'맑은 고딕\';color:#fff;text-align:center;background:#bfbfbf; float:left;" href="javascript:fnCancel();">취소</a>';
	html += '<a style="display:block;margin:0 auto;text-decoration:none;width:calc(50% - 10px); height:45px;line-height:45px;font-size:16px;font-family:\'맑은 고딕\';color:#fff;text-align:center;background:#2b516e; float:right" href="javascript:fncAppOpen();">서명 진행하기</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';

	var element=document.getElementById("appPop");
	element.innerHTML=html;
}

function fncAppOpen()
{
	fnCancel();
	fnSubmit();
}











