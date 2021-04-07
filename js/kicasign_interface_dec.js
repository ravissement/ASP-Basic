/*2019-07-17 원본*/
/**
 * 수정자 		: 박성수
 * 시간 		: 2017/04/11
 * 코드 		: 20170411_1216
 * 프로젝트 	: 중개서버 개발
 * 수정사항 	: 기존의 sign 메소드를 signCallback으로 변경
 * 			  기존 업체에서는 적용할 때 수정사항없이 "javascript" 파일만 변경하면 되기에 rollBack이 쉬워짐
 */

var TransData 			= function() {
    this.message 		= null;
    this.title 		    = null;
    this.signType 		= null;
    this.serverType 	= null;
    this.opCode			= null;
};

TransData.prototype 	= {
        getMessage: function() {
            return this.message;
        },
        getTitle: function() {
            return this.title;
        },
        getHashmod: function() {
            return this.hashmod;
        },
        getSignType: function() {
            return this.signType;
        },
        getServerType: function() {
            return this.serverType;
        },
        setTransData: function(message, title, hashmod, signType, serverType, opCode) {
            this.message 		= message;
            this.title 		    = title;
            this.hashmod 		= hashmod;
            this.signType 		= signType;
            this.serverType 	= serverType;
            this.opCode 		= opCode;
        },
        setSiteCode: function(siteCode) {
            this.siteCode 	= siteCode;
        },
        getSiteCode: function() {
            return this.siteCode;
        },
        setOpCode: function(opCode) {
            this.opCode 	= opCode;
        },
        getOpCode: function() {
            return this.opCode;
        }
};

var KicaService = KicaService || (function () {
    var websign;
    /**
     * 수정자 		: 박성수
     * 시간 		: 2017/04/10
     * 코드 		: 20170410_0810
     * 프로젝트 	: 중개서버 개발
     * 사유 		: 콜백을 쓰기 위한 임시 정보 저장소 생성
     *
     * 20170410_0810 수정
     */
    var transData 		= new TransData();
    /**
     * 20170410_0810 끝
     */
    var init = function () {
        if (typeof websign === "undefined") {
            try {
                var _lc = new license();
                websign = new kica.service.smartService({
                    key : _lc.code,
                    doc : document,
                    certurl : _lc.certurl,
                    policytype : _lc.policytype,
                    policy : _lc.policy,
                    relayServer : _lc.relayServer,
                    sitecode : _lc.sitecode,
                    companycode : _lc.companycode,
                    servicecode : _lc.servicecode
                });
            } catch (e) {
                alert("failed to initialize the KicaService: " + e);
            }
        }
    };
    var checkElement = function (id) {

        var rid;

        //As-is Key Check  start. (2019.07.11)
        switch (id) {
            case "signedData":
                if(document.getElementById(id) == null){
                    id = "signMessage";
                }
            case "signedCert":
                if(document.getElementById(id) == null){
                    id = "signCert";
                }
            case "randomValue":
                if(document.getElementById(id) == null){
                    id = "R";
                }
        }
        //As-is Key Check  end. (2019.07.11)

        rid = id;

        try {
            if (rid.type != undefined) {// !='string'
                rid.blur();
                rid = rid.getAttribute("id");
                document.getElementById(rid).value = "";
                document.body.focus();
            } else {
                if (document.getElementById(rid) == undefined)
                    throw kica.exception.corrupt("Undefined " + id);
            }
            return rid;
        } catch (e) {
            alert("Fild Exception: " + e);
            throw e;
        }
    };

    var SignType = (function () {
        return {
            Sign : 1,
            SignAndGetVID : 2,
            PKCS7Sign : 5,
            PKCS7SignAndGetVID : 6,
            PKCS7SignEnv : 7,
            PKCS7SignEnvAndGetVID: 8,

            /* signOkay Logic */
            PKCS7SignDetach: 9,
            /*// signOkay Logic */

            /* PC K-Fido Logic */
            SignPC: 11,
            SignAndGetVIDPC: 12,
            PKCS7SignPC: 15,
            PKCS7SignAndGetVIDPC: 16,
            PKCS7SignEnvPC: 17,
            PKCS7SignEnvAndGetVIDPC: 18,
            /*// PC K-Fido Logic */

            FIDOReg: 51,
            FIDOAuth: 52,
            FIDODereg: 53

        };
    }());

    /**
     * 수정자 	: 박성수
     * 시간 		: 2017/03/20
     * 코드 		: 20170320_1028
     * 프로젝트 	: 중개서버 개발
     * 사유 		: 중개서버가 로컬인지 외부 서버인지 구분하기위한 클래스
     *
     * 20170320_0109 수정시작
     */
    var ServerType = (function () {
        return {
            LocalServer : 0,
            WasServer : 1
        };
    }());
    /**
     * 20170320_0109 수정 끝
     */

    var TargetType = (function () {
        return {
            Submit : 1,
            Function : 2
        };
    }());
    var HashType = (function () {
        return {
            DEFAULT : 0,
            SHA1 : 1,
            SHA256 : 2
        };
    }());

    var setTarget = function (targetName, targetType) {
        init();
        try {
            if (targetType === TargetType.Submit) {
                websign.submit(targetName);
            }
            else if (targetType === TargetType.Function) {
                websign.functionCall(targetName);
            }

        } catch (e) {
            alert("falied to set Target: " + e);
        }
    };

    /**
     * 수정자 	: 박성수
     * 시간 		: 2017/03/21
     * 코드 		: 20170321_0822
     * 프로젝트 	: 중개서버 개발
     * 사유 		: 중개서버와 요청자의 고유값 공유
     *
     * 20170321_0822 수정시작
     */
    var sign = function (message, title, hashmod, signType, opCode) {

        transData.setTransData(message, title, hashmod, signType, KicaService.ServerType.WasServer, opCode);

        coorCdCallback();
    };

    /**
     * 수정자 	: 박성수
     * 시간 		: 2017/03/20
     * 코드 		: 20170320_1028
     * 프로젝트 	: 중개서버 개발
     * 사유 		: 중개서버와 요청자의 고유값 공유
     *
     * 20170320_1028 수정
     * 원본 : var sign = function (message, signType)
     * var sign = --> var signCallback 으로 변경
     */
    var signCallback = function (message, title, hashmod, signType, serverType, siteCode, opCode) {

        init();
        if (message == null || message == "") {
            alert("서명할 메시지가 없습니다.");
            return false;
        }
        var kicasign_pushToken = "";
        try {
            // PC에서 앱을 호출하기 위한 pushToken 값
            kicasign_pushToken = document.getElementById("pushToken").value;
        } catch (e) { }

        try {
            switch (signType) {
                case SignType.Sign: 				// 전자서명
                    websign.smartSign(checkElement("signedData"), message, title, hashmod, checkElement("signedCert"), serverType, siteCode, opCode);
                    break;
                case SignType.SignAndGetVID: 		// 전자서명 + 신원확인
                    websign.smartIdenSign(checkElement("signedData"), message, title, hashmod, checkElement("signedData"), serverType, siteCode, opCode);
                    break;
                case SignType.PKCS7Sign: 			// PKCS#7 서명
                    websign.smartPKCSSign(checkElement("signedData"), message, title, hashmod, serverType, siteCode, opCode);
                    break;
                case SignType.PKCS7SignDetach:		// PKCS#7 서명
                    websign.smartPKCSSignDetach(checkElement("signedData"), message, title, hashmod, serverType, siteCode, opCode);
                    break;
                case SignType.PKCS7SignAndGetVID: 	// PKCS#7 서명 + 신원확인
                    websign.smartIdenPKCSSign(checkElement("signedData"), message, title, hashmod, serverType, siteCode, opCode);
                    break;
                default:
                    alert("invalid Sign type");
                    break;
            }
        } catch (e) {
            alert("failed to make the signed message: " + e);
        }
    };

    var callbackProcess = function (code, message) {
        init();
        websign.complateCollBack();
        try {
            if (code == 2000) {
                websign.callBackProcess(code, message);
            } else {
                alert("ErrorMessage :" + code + "\n" + message);
                fn_popClose();
            }
        } catch (e) {
            alert("failed to the callback process: " + e);
        }

    };

    var base64Hash = function (sourceData, hashType) {
        init();
        var hashValue = "";
        var hashAlgorithm = hashType;
        try {
            if (hashAlgorithm === HashType.DEFAULT) {
                if (websign.params.hashmod == "1") {
                    hashAlgorithm = HashType.SHA1;
                } else if (websign.params.hashmod == "2") {
                    hashAlgorithm = HashType.SHA256;
                }
            }

            if (hashAlgorithm === HashType.SHA1) {
                hashValue = kica.util.base64.encode(kica.hash.sha1.hash(sourceData));
            }
            else if (hashAlgorithm === HashType.SHA256) {
                hashValue = kica.util.base64.encode(kica.hash.sha256.hash(sourceData));
            }
            else {
                alert("invalid Hash type");
            }
        } catch (e) {
            alert("failed to make the encoded hash message: " + e);
        }
        return hashValue;
    };

    var base64HashSource = function (sourceData) {
        init();
        return base64Hash(sourceData, HashType.DEFAULT);
    };

    /**
     * 수정자 	: 박성수
     * 시간 		: 2017/03/21
     * 코드 		: 20170321_0822
     * 프로젝트 	: 중개서버 개발
     * 사유 		: 중개서버와 요청자의 고유값 공유
     *
     * 20170321_0822 수정시작
     */
    var getRelayID = function () {
        return websign.getRelayID();
    }

    var getTransData = function () {
        return transData;
    }

    var getFIDODataForQR = function (userid, opCode) {
        init();
        return websign.getFIDODataForQR(userid, opCode);
    }

    var getFIDOData = function (userid, opCode) {
        init();
        return websign.getFIDOData(userid, opCode);
    }

    var getKFIDOData = function (userid, hashmod, signType, opCode) {
        init();
        return websign.getKFIDOData(userid, hashmod, signType, opCode);
    }

    var getCertIssue = function (auth_reference, auth_code, opCode) {
        init();
        return websign.getCertIssue(auth_reference, auth_code, opCode);
    }

    var getCertRenew = function (subjectDN, opCode) {
        init();
        return websign.getCertRenew(subjectDN, opCode);
    }

    var getCERTDataForQR = function (message, title, hashmod, opCode) {
        init();
        return websign.getCERTDataForQR(message, title, hashmod, opCode);
    }

    var getMngData = function (opCode) {
        init();
        return websign.getMngData(opCode);
    }

    /**
     * Generate QRCODE for FIDO registration
     * Date. 18.03.07
     */
     var getQRCodeForFIDO = function (userid, opCode) {
         document.getElementById("qrcode").innerHTML = "";
         var data = KicaService.getFIDODataForQR(userid, opCode);

         var qrcode = new QRCode("qrcode", {
             text: data,
             width: 300,
             height: 300,
             colorDark : "#000000",
             colorLight : "#ffffff",
             correctLevel : QRCode.CorrectLevel.L
         });
         var relayID = KicaService.getRelayID();
         //console.log("1111> this.params.relayID : " +  relayID)
         KicaService.signIn(relayID);
     };

     var getDataForFIDO = function (userid, opCode) {
         KicaService.getFIDOData(userid, opCode);
         var relayID = KicaService.getRelayID();
         KicaService.signIn(relayID);
     };

     var getDataForKFIDO = function (userid, hashmod, signType, opCode) {
         KicaService.getKFIDOData(userid, hashmod, signType, opCode);
         var relayID = KicaService.getRelayID();
         KicaService.signIn(relayID);
     };


     var getDataCertIssue = function (auth_reference, auth_code, opCode) {
         KicaService.getCertIssue(auth_reference, auth_code, opCode);
         var relayID = KicaService.getRelayID();
         KicaService.signIn(relayID);
     };

     var getDataCertRenew = function (subjectDN, opCode) {
         KicaService.getCertRenew(subjectDN, opCode);
         var relayID = KicaService.getRelayID();
         KicaService.signIn(relayID);
     };

     var getDataForMng = function (opCode) {
         KicaService.getMngData(opCode);
     };

     /**
      * Generate QRCODE for CERT
      * Date. 18.07.24
      * 정의학 transData.setTransData 와 qrcode 순서를 바꿈
      */
     var getQRCodeForCERT = function (message, title, hashmod, signType, opCode) {
         document.getElementById("qrcode").innerHTML = "";

         transData.setTransData(message, title, hashmod, signType, KicaService.ServerType.WasServer, opCode);
         coorCdCallback();

         //console.log("============ KicaService.getRelayID() : " + KicaService.getRelayID());

         var data = KicaService.getCERTDataForQR(message, title, hashmod, opCode);
         var qrcode = new QRCode("qrcode", {
             text: data,
             width: 300,
             height: 300,
             colorDark : "#000000",
             colorLight : "#ffffff",
             correctLevel : QRCode.CorrectLevel.L
         });

     };


    var signIn = function (relayID) {

        var protocol 	= location.protocol;
        var slashes 	= protocol.concat("//");
        var host 		= slashes.concat(window.location.hostname);

        var platform 	= getPlatform();
        var browser 	= getBrowserName();

        var _json = new kica.net.json()
        //var encRelayId = _json._paramEncode((relayID.replace('\n', '')));
        //encRelayId = kica.util.utf8ToURLEncode.encodeURL(encRelayId);
        var encRelayId = relayID;

        var jsonData =
        {
            encData	:	encRelayId,  //relayId 암호화
            opCode	:	100
        }

        /**
         * 아이폰 크롬("crios")일때만,
         * setTimeout 함수를 사용해서 중계서버를 호출해야 한다.
         * 나머지는 그냥 호출.
         */
        var agt = navigator.userAgent.toLowerCase();
        if(agt.indexOf("crios") != -1) {
             setTimeout(function() {
                 excuteFunction(encRelayId);
             }, 500);
        }else{
            var sc 		= document.createElement('script');
            sc.setAttribute('src', RELAY_SIGN_PATH + "?encData=" + encRelayId + "&opCode=100");
            sc.setAttribute('charset', "utf-8");
            document.getElementsByTagName('head')[0].appendChild(sc);
        }
    }

    var excuteFunction = function (encRelayId)
    {
      var sc 		= document.createElement('script');
      sc.setAttribute('src', RELAY_SIGN_PATH + "?encData=" + encRelayId + "&opCode=100");
      sc.setAttribute('charset', "utf-8");
      document.getElementsByTagName('head')[0].appendChild(sc);
    }

    /**
     * 20170321_0822 수정 끝
     */

    return {
        SignType : SignType,
        TargetType : TargetType,
        HashType : HashType,
        setTarget : setTarget,
        hash : base64HashSource,
        sign : sign,
        callbackProcess : callbackProcess,
        ServerType : ServerType,
        getRelayID : getRelayID,
        signIn : signIn,
        getTransData: getTransData,
        signCallback : signCallback,
        getFIDODataForQR : getFIDODataForQR,
        getFIDOData : getFIDOData,
        getKFIDOData : getKFIDOData,
        getQRCodeForFIDO : getQRCodeForFIDO,
        getDataForFIDO : getDataForFIDO,
        getDataForKFIDO : getDataForKFIDO,
        getCertIssue : getCertIssue,
        getDataCertIssue : getDataCertIssue,
        getCertRenew : getCertRenew,
        getDataCertRenew : getDataCertRenew,
        getQRCodeForCERT : getQRCodeForCERT,
        getCERTDataForQR : getCERTDataForQR,
        getDataForMng : getDataForMng,
        getMngData : getMngData

    };
}());




function kicaCallback(code, message) {

    ///3000 polling
    ///2000 성공 : message 복호화
    //나머지는 alert();


    //alert("code = >"+code   + "		message="+message);

    if(code  == "2000"){
        KicaService.callbackProcess(code, message);
    }else if(code == "3000"){
        signChkResult(KicaService.getRelayID(), false);
    }else{
        message = kica.util.utf8ToURLEncode.decodeURL(message);
        alert(message+"(ERROR CODE : " + code + ")");
    }

};

/**
 * 20170323_1200 수정 끝
 */

/**
 * 수정자 	: 박성수
 * 시간 		: 2017/03/21
 * 코드 		: 20170321_1953
 * 프로젝트 	: 중개서버 개발
 * 사유 		: 중개서버와 요청자의 고유값 공유
 *
 * 20170321_1953 수정시작
 */

function signChkResult(relayID, isTimeout) {
    if (relayID != KicaService.getRelayID()) {
        // 만약 사용자가 여러번 요청했을 경우 가장 최근의 RelayID를 비교하여 잘못된 무한 루프를 방지
    } else {
        if (isTimeout) {
            alert("서버와의 연결시간이 초과됐습니다. 다시 시작해 주세요");
        } else {

            setTimeout(function() {
                KicaService.signIn(relayID);
            }, 500);
        }
    }
}

function getPlatform() {
    var tempUser = navigator.userAgent;
    var kind 	= "unknown";
    if (tempUser.indexOf("iPhone") > 0 || tempUser.indexOf("iPad") > 0 || tempUser.indexOf("iPot") > 0) {
        kind 	= "iphone";
    } else if (tempUser.indexOf("Android") > 0) {
        kind 	= "android";
    } else if (tempUser.indexOf("Windows Phone") > 0 || tempUser.indexOf("IEMobile") > 0 || tempUser.indexOf("WPDesktop") > 0) {
        kind 	= "window";
    } else if (tempUser.indexOf("BlackBerry") > 0) {
        kind 	= "blackberry";
    } else if (tempUser.indexOf("nokia") > 0) {
        kind 	= "nokia";
    } else if (tempUser.indexOf("Opera Mini") > 0) {
        kind 	= "opera";
    } else if (tempUser.indexOf("webOS") > 0) {
        kind 	= "webos";
    } else if (tempUser.indexOf("Windows") > 0) {
        kind    = "windows";
    }

    return kind;
}

function getBrowserName() {
    var agt = navigator.userAgent.toLowerCase();
    if(agt.indexOf("crios") != -1) {
        return 'chrome';
    }
    else if(agt.indexOf("chrome") != -1) {
        return 'chrome';
    } else if(agt.indexOf("opera") != -1) {
        return 'opera';
    } else if(agt.indexOf("firefox") != -1) {
        return 'firefox';
    } else if(agt.indexOf("safari") != -1) {
        return 'safari';
    } else if(agt.indexOf("skipstone") != -1) {
        return 'skipstone';
    } else if(agt.indexOf("msie") != -1 || agt.indexOf("trident") != -1) {
        return 'iexplorer';
    } else if(agt.indexOf("netscape") != -1) {
        return 'netscape';
    } else {
        return 'unknown';
    }
}
/**
 * 20170321_1953 수정 끝
 */


/**
 * 수정자 		: 박성수
 * 시간 		: 2017/04/10
 * 코드 		: 20170410_0115
 * 프로젝트 	: 중개서버 개발
 * 사유 		: 클라이언트의 화면 가로 해상도를 반환
 *
 * 20170410_0115 수정시작
 */
function getDeviceWidth() {
    var deviceWidth  	= 0;
    if (typeof(window.innerWidth) == 'number') {
        //Non-IE
        deviceWidth 	= window.innerWidth;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        deviceWidth 	= document.documentElement.clientWidth;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        deviceWidth 	= document.body.clientWidth;
    }

    return deviceWidth;
}

/**
 * 수정자 		: 박성수
 * 시간 		: 2017/04/10
 * 코드 		: 20170410_0115
 * 프로젝트 	: 중개서버 개발
 * 사유 		: 클라이언트의 화면 세로 해상도를 반환
 *
 * 20170410_0115 수정시작
 */
function getDeviceHeight() {
    var deviceWidth  	= 0;
    if (typeof(window.innerWidth) == 'number') {
        //Non-IE
        deviceHeight 	= window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        deviceHeight 	= document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        deviceHeight 	= document.body.clientHeight;
    }

    return deviceHeight;
}

/**
 * 수정자 		: 박성수
 * 시간 		: 2017/04/10
 * 코드 		: 20170410_0915
 * 프로젝트 	: 중개서버 개발
 * 사유 		: 서버에서 콜랙으로 호출한다
 *
 * 20170410_0915 수정시작
 */
function coorCdCallback(siteCode) {
    //alert(">> coorCdCallback 1");
    KicaService.signCallback(KicaService.getTransData().getMessage(), KicaService.getTransData().getTitle(), KicaService.getTransData().getHashmod(), KicaService.getTransData().getSignType(), KicaService.getTransData().getServerType(), siteCode, KicaService.getTransData().getOpCode());

    //alert(">> coorCdCallback 2");
    // 중개서버로부터 서명값을 받아온다
    KicaService.signIn(KicaService.getRelayID());
}


function sendAjax(url, jsonData) {

    //alert(JSON.stringify(jsonData));
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(jsonData),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {

            if(data.resultCode == 2000){
                alert(data.message);
                kicaCallback(data.resultCode, data.message);
            }else{
                alert(data.message);
            }
        },
        error:function(data,status, er) {
            alert("error: "+data+" status: "+status+" er:"+er);
        }

    });

}