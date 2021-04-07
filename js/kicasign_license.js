var toolket_license = "MSRDfFF8RiRZJDEzMjE5NjAy";
var companycode = "KICA";
var servicecode = "Demo";

license = function () {
	this.code = toolket_license;
    
    var protocol 	= location.protocol;
    var slashes 	= protocol.concat("//");
    var host 		= slashes.concat(window.location.hostname);

    var sitecode 	= "";
    if(document.domain.toString().indexOf('www') != -1){
        sitecode = document.domain.split(".")[1];
    }else{
        sitecode = document.domain;
    }
    // [필수] serverCert.jsp 를 외부(KICAsign+ 앱)에서 접근 가능한 URL로 수정되어야 합니다.
	this.certurl = "https://고객사도메인/kICASignPlus/server/serverCert.jsp";
    this.policytype = "1";
    this.policy = "*";

    this.relayServer = "https://www.signgate.com/web-relay";
    this.sitecode = sitecode;

    this.companycode = companycode;
    this.servicecode = servicecode;

};
var RELAY_SIGN_PATH  = "https://www.signgate.com/web-relay/api/ksaction.sg";