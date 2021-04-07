/*2019-07-17 원본*/
/**
 * @namespace kica 최상위 네임스페이스
 * @version ver 1.3
 * @since 2013.10.28
 * @description 한국정보인증에서 제공하는 모든 스크립트의 최상위 네임스페이스
 */
// var kica = kica || {};
kica = {
    version : "v1.3",
    deubg : true,
    name : "Copyright KICA inc. All rights reserved. Script Security Module",

    getName : function () {
        return this.name + " " + this.version;
    },
    findObject : function (obj) {
        if (document.getElementById) {
            return document.getElementById(obj);
        }
        if (document.all) {
            return document.all(obj);
        }
    },
    crypto : {},
    hash : {},
    misc : {},
    util : {
        web : {}
    },
    service : {},
    net : {},
    keypad : {},
    sign : {},

    /** @namespace Exceptions. */
    exception : {
        /** @class Ciphertext is corrupt. */
        corrupt : function (message) {
            this.toString = function () {
                return "CORRUPT: " + this.message;
            };
            this.message = message;
        },

        /** @class Invalid parameter. */
        invalid : function (message) {
            this.toString = function () {
                return "INVALID: " + this.message;
            };
            this.message = message;
        },

        /** @class Bug or missing feature in SJCL. */
        bug : function (message) {
            this.toString = function () {
                return "BUG: " + this.message;
            };
            this.message = message;
        }
    }
};


(function (window, undefined) {
    var AppInstaller = {};
    window.AppInstaller = window.AppInstaller || AppInstaller;

    AppInstaller.os = "unknown";

    var uagent = navigator.userAgent.toLocaleLowerCase();
    if (uagent.search("android") > -1) {
        AppInstaller.os = "android";
    } else if (uagent.search("iphone") > -1 || uagent.search("ipod") > -1 || uagent.search("ipad") > -1) {
        AppInstaller.os = "ios";
    }
    var app = {
        websign: {
            base_url: "kicasignplus://",
            base_url_android: "intent://"
        }
    };

    AppInstaller.link = function (name) {
        var link_app = app[name];
        if (!link_app) return {send: function () {throw "No App exists";}
        };
        return {
            send: function (uri) {
                var _app = this.app;

                var full_url = _app.base_url + uri;
                if (this.os == "ios") {
                    window.location = full_url;
                }
                else if (this.os == "android") {
                    full_url = _app.base_url_android + uri;
                    window.location = full_url + "#Intent;scheme=kicasignplus;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end";
                }
                else {
                    window.location = full_url;
                }

            },
            app: link_app,
            os: AppInstaller.os
        };
    };
}(window));



// async
var KicaInterval = KicaInterval || (function () {

    var callbackCheckTimerID = null;
    var callbackCheckIntervalTime = 1000;
    var callbackFunction = "";

    var waitTimerID = null;
    var waitIntervalTime = 5000;

    var wasStopCh = false;
    var wasStopWa = false;

    var startCallbackChecking = function (func, intervalTime) {
        try {
            endCallbackChecking();
            callbackCheckTimerID = setTimeout(func, intervalTime);
        }
        catch (e) {
            alert("startCallbackChecking Exception: " + e);
            throw e;
        }
    };
    var endCallbackChecking = function () {
        try {
            if (callbackCheckTimerID) {
                clearTimeout(callbackCheckTimerID);
                callbackCheckTimerID = null;
            }
        }
        catch (e) {
            alert("endCallbackChecking Exception: " + e);
            throw e;
        }
    };

    var startWaitting = function (callbackFunc) {
        callbackFunction = callbackFunc;
        try {
            endWaitting();
            waitTimerID = setTimeout(endWaitting, waitIntervalTime);
            startCallbackChecking(callbackFunc, callbackCheckIntervalTime*5);
        }
        catch (e) {
            alert("startWaitting Exception: " + e);
            throw e;
        }
    };
    var restarting = function () {
        try {
            if(waitTimerID){
                startCallbackChecking(callbackFunction ,callbackCheckIntervalTime);
            }else{
                endWaitting();
            }
        }
        catch (e) {
            alert("restarting Exception: " + e);
            throw e;
        }
    };
    var endWaitting = function () {
        try {
            endCallbackChecking();
            if (waitTimerID) {
                clearTimeout(waitTimerID);
                waitTimerID = null;
            }
        }
        catch (e) {
            alert("endWaitting Exception: " + e);
            throw e;
        }
    };

    return {
        start : startWaitting,
        restart:restarting,
        end : endWaitting,
    };

}());

/*
20170619 : nayagdkim
function $(id) {
    if (document.getElementById) {
        return document.getElementById(id);
    }
    if (document.all) {
        return document.all(id);
    }
}
*/
kica.util.bitArray = {
    bitSlice : function (a, bstart, bend) {
        a = kica.util.bitArray._shiftRight(a.slice(bstart / 32), 32 - (bstart & 31)).slice(1);
        return (bend === undefined) ? a : kica.util.bitArray.clamp(a, bend - bstart);
    },

    /**
     * Concatenate two bit arrays.
     *
     * @param {bitArray}
     *                a1 The first array.
     * @param {bitArray}
     *                a2 The second array.
     * @return {bitArray} The concatenation of a1 and a2.
     */
    concat : function (a1, a2) {
        if (a1.length === 0 || a2.length === 0) {
            return a1.concat(a2);
        }

        var last = a1[a1.length - 1], shift = kica.util.bitArray.getPartial(last);
        if (shift === 32) {
            return a1.concat(a2);
        } else {
            return kica.util.bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
        }
    },

    /**
     * Find the length of an array of bits.
     *
     * @param {bitArray}
     *                a The array.
     * @return {Number} The length of a, in bits.
     */
    bitLength : function (a) {
        var l = a.length, x;
        if (l === 0) {
            return 0;
        }

        x = a[l - 1];
        return (l - 1) * 32 + kica.util.bitArray.getPartial(x);
    },

    /**
     * Truncate an array.
     *
     * @param {bitArray}
     *                a The array.
     * @param {Number}
     *                len The length to truncate to, in bits.
     * @return {bitArray} A new array, truncated to len bits.
     */
    clamp : function (a, len) {
        if (a.length * 32 < len) {
            return a;
        }
        a = a.slice(0, Math.ceil(len / 32));
        var l = a.length;
        len = len & 31;
        if (l > 0 && len) {
            a[l - 1] = kica.util.bitArray.partial(len, a[l - 1] & 0x80000000 >> (len - 1), 1);
        }
        return a;
    },

    /**
     * Make a partial word for a bit array.
     *
     * @param {Number}
     *                len The number of bits in the word.
     * @param {Number}
     *                x The bits.
     * @param {Number}
     *                [0] _end Pass 1 if x has already been shifted to the high
     *                side.
     * @return {Number} The partial word.
     */
    partial : function (len, x, _end) {
        if (len === 32) {
            return x;
        }
        return (_end ? x | 0 : x << (32 - len)) + len * 0x10000000000;
    },

    /**
     * Get the number of bits used by a partial word.
     *
     * @param {Number}
     *                x The partial word.
     * @return {Number} The number of bits used by the partial word.
     */
    getPartial : function (x) {
        return Math.round(x / 0x10000000000) || 32;
    },

    /**
     * Compare two arrays for equality in a predictable amount of time.
     *
     * @param {bitArray}
     *                a The first array.
     * @param {bitArray}
     *                b The second array.
     * @return {boolean} true if a == b; false otherwise.
     */
    equal : function (a, b) {
        if (kica.util.bitArray.bitLength(a) !== kica.util.bitArray.bitLength(b)) {
            return false;
        }
        var x = 0, i;
        for (i = 0; i < a.length; i++) {
            x |= a[i] ^ b[i];
        }
        return (x === 0);
    },

    /**
     * Shift an array right.
     *
     * @param {bitArray}
     *                a The array to shift.
     * @param {Number}
     *                shift The number of bits to shift.
     * @param {Number}
     *                [carry=0] A byte to carry in
     * @param {bitArray}
     *                [out=[]] An array to prepend to the output.
     * @private
     */
    _shiftRight : function (a, shift, carry, out) {
        var i, last2 = 0, shift2;
        if (out === undefined) {
            out = [];
        }

        for (; shift >= 32; shift -= 32) {
            out.push(carry);
            carry = 0;
        }
        if (shift === 0) {
            return out.concat(a);
        }

        for (i = 0; i < a.length; i++) {
            out.push(carry | a[i] >>> shift);
            carry = a[i] << (32 - shift);
        }
        last2 = a.length ? a[a.length - 1] : 0;
        shift2 = kica.util.bitArray.getPartial(last2);
        out.push(kica.util.bitArray.partial(shift + shift2 & 31, (shift + shift2 > 32) ? carry : out.pop(), 1));
        return out;
    },

    /**
     * xor a block of 4 words together.
     *
     * @private
     */
    _xor4 : function (x, y) {
        return [ x[0] ^ y[0], x[1] ^ y[1], x[2] ^ y[2], x[3] ^ y[3] ];
    }
};

kica.util.utf8String = {
    /** Convert from a bitArray to a UTF-8 string. */
    fromBits : function (arr) {
        var out = "", bl = kica.util.bitArray.bitLength(arr), i, tmp = "";
        for (i = 0; i < bl / 8; i++) {
            if ((i & 3) === 0) {
                tmp = arr[i / 4];
            }
            out += String.fromCharCode(tmp >>> 24);
            tmp <<= 8;
        }
        return decodeURIComponent(escape(out));
    },

    /** Convert from a UTF-8 string to a bitArray. */
    toBits : function (str) {
        str = unescape(encodeURIComponent(str));
        var out = [], i, tmp = 0;
        for (i = 0; i < str.length; i++) {
            tmp = tmp << 8 | str.charCodeAt(i);
            if ((i & 3) === 3) {
                out.push(tmp);
                tmp = 0;
            }
        }
        if (i & 3) {
            out.push(kica.util.bitArray.partial(8 * (i & 3), tmp));
        }
        return out;
    }
};

kica.util.base64 = {
    _chars : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

    /** Convert from a bitArray to a base64 string. */
    encode : function (arr, _noEquals) {

        var out = "", i, bits = 0, c = kica.util.base64._chars, ta = 0, bl = kica.util.bitArray.bitLength(arr);

        for (i = 0; out.length * 6 < bl;) {
            out += c.charAt((ta ^ arr[i] >>> bits) >>> 26);
            if (bits < 6) {
                ta = arr[i] << (6 - bits);
                bits += 26;
                i++;
            } else {
                ta <<= 6;
                bits -= 6;
            }
        }
        while ((out.length & 3) && !_noEquals) {
            out += "=";
        }
        return out;
    },
    /** Convert from a base64 string to a bitArray */
    decode : function (str) {
        str = str.replace(/\s|=/g, '');
        var out = [], i, bits = 0, c = kica.util.base64._chars, ta = 0, x;
        for (i = 0; i < str.length; i++) {
            x = c.indexOf(str.charAt(i));
            if (x < 0) {
                throw new kica.exception.invalid("this isn't base64!");
            }
            if (bits > 26) {
                bits -= 26;
                out.push(ta ^ x >>> bits);
                ta = x << (32 - bits);
            } else {
                bits += 6;
                ta ^= x << (32 - bits);
            }
        }
        if (bits & 56) {
            out.push(kica.util.bitArray.partial(bits & 56, ta, 1));
        }
        return out;
    }
};

kica.util.utf8ToURLEncode = {
    encodeURL : function (str) {

        var s0, i, s, u;
        s0 = ""; // encoded str
        for (i = 0; i < str.length; i++) { // scan the source

            s = str.charAt(i);
            u = str.charCodeAt(i); // get unicode of the char
            if (s == " ") {
                s0 += "+";
            } // SP should be converted to "+"
            else {
                if (u == 0x2a || u == 0x2d || u == 0x2e || u == 0x5f || ((u >= 0x30) && (u <= 0x39))
                        || ((u >= 0x41) && (u <= 0x5a)) || ((u >= 0x61) && (u <= 0x7a))) { // check
                    // for
                    // escape
                    s0 = s0 + s; // don't escape
                } else { // escape
                    if ((u >= 0x0) && (u <= 0x7f)) { // single byte format
                        s = "0" + u.toString(16);
                        s0 += "%" + s.substr(s.length - 2);
                    } else if (u > 0x1fffff) { // quaternary byte format
                        // (extended)
                        s0 += "%" + (oxf0 + ((u & 0x1c0000) >> 18)).toString(16);
                        s0 += "%" + (0x80 + ((u & 0x3f000) >> 12)).toString(16);
                        s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
                        s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
                    } else if (u > 0x7ff) { // triple byte format
                        s0 += "%" + (0xe0 + ((u & 0xf000) >> 12)).toString(16);
                        s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
                        s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
                    } else { // double byte format
                        s0 += "%" + (0xc0 + ((u & 0x7c0) >> 6)).toString(16);
                        s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
                    }
                }
            }
        }
        return s0;

    },
    decodeURL : function (str) {

        var s0, i, j, s, ss, u, n, f;
        s0 = ""; // decoded str
        for (i = 0; i < str.length; i++) { // scan the source str
            s = str.charAt(i);
            if (s == "+") {
                s0 += " ";
            } // "+" should be changed to SP
            else {
                if (s != "%") {
                    s0 += s;
                } // add an unescaped char
                else { // escape sequence decoding
                    u = 0; // unicode of the character
                    f = 1; // escape flag, zero means end of this sequence
                    while (true) {
                        ss = ""; // local str to parse as int
                        for (j = 0; j < 2; j++) { // get two maximum hex
                            // characters for parse
                            sss = str.charAt(++i);
                            if (((sss >= "0") && (sss <= "9")) || ((sss >= "a") && (sss <= "f"))
                                    || ((sss >= "A") && (sss <= "F"))) {
                                ss += sss; // if hex, add the hex character
                            } else {
                                --i;
                                break;
                            } // not a hex char., exit the loop
                        }
                        n = parseInt(ss, 16); // parse the hex str as byte
                        if (n <= 0x7f) {
                            u = n;
                            f = 1;
                        } // single byte format
                        if ((n >= 0xc0) && (n <= 0xdf)) {
                            u = n & 0x1f;
                            f = 2;
                        } // double byte format
                        if ((n >= 0xe0) && (n <= 0xef)) {
                            u = n & 0x0f;
                            f = 3;
                        } // triple byte format
                        if ((n >= 0xf0) && (n <= 0xf7)) {
                            u = n & 0x07;
                            f = 4;
                        } // quaternary byte format (extended)
                        if ((n >= 0x80) && (n <= 0xbf)) {
                            u = (u << 6) + (n & 0x3f);
                            --f;
                        } // not a first, shift and add 6 lower bits
                        if (f <= 1) {
                            break;
                        } // end of the utf byte sequence
                        if (str.charAt(i + 1) == "%") {
                            i++;
                        } // test for the next shift byte
                        else {
                            break;
                        } // abnormal, format error
                    }
                    s0 += String.fromCharCode(u); // add the escaped character
                }
            }
        }
        return s0;
    }
};

kica.util.hex = {
    /** Convert from a bitArray to a hex string. */
    fromBits : function (arr) {
        var out = "", i;
        for (i = 0; i < arr.length; i++) {
            out += ((arr[i] | 0) + 0xF00000000000).toString(16).substr(4);
        }
        return out.substr(0, kica.util.bitArray.bitLength(arr) / 4);// .replace(/(.{8})/g,
        // "$1 ");
    },
    /** Convert from a hex string to a bitArray. */
    toBits : function (str) {
        var i, out = [], len;
        str = str.replace(/\s|0x/g, "");
        len = str.length;
        str = str + "00000000";
        for (i = 0; i < str.length; i += 8) {
            out.push(parseInt(str.substr(i, 8), 16) ^ 0);
        }
        return kica.util.bitArray.clamp(out, len * 4);
    },
    formatHex : function (str, length) {
        if (!str)
            str = "";
        if (!length)
            length = 45;
        var str_new = '';
        var hex = str.toLowerCase();
        for ( var i = 0; i < hex.length; i += 2)
            str_new += hex.substr(i, 2) + ':';
        hex = kica.util.fragment(str_new, length);

        return hex;
    }
};

kica.util.encodeBase64 = function (str, utf8encode) { // http://tools.ietf.org/html/rfc4648
    if (!str)
        str = "";
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    utf8encode = (typeof utf8encode == 'undefined') ? false : utf8encode;
    var o1, o2, o3, bits, h1, h2, h3, h4, e = [], pad = '', c, plain, coded;

    plain = utf8encode ? kica.util.encodeUTF8(str) : str;

    c = plain.length % 3; // pad string to length of multiple of 3
    if (c > 0) {
        while (c++ < 3) {
            pad += '=';
            plain += '\0';
        }
    }
    // note: doing padding here saves us doing special-case packing for trailing
    // 1 or 2 chars

    for (c = 0; c < plain.length; c += 3) { // pack three octets into four
        // hexets
        o1 = plain.charCodeAt(c);
        o2 = plain.charCodeAt(c + 1);
        o3 = plain.charCodeAt(c + 2);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hextets to index into b64 string
        e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    }
    coded = e.join(''); // join() is far faster than repeated string
    // concatenation

    // replace 'A's from padded nulls with '='s
    coded = coded.slice(0, coded.length - pad.length) + pad;
    return coded;
};

/**
 * Decode string from Base64, as defined by RFC 4648
 * [http://tools.ietf.org/html/rfc4648] As per RFC 4648, newlines are not
 * catered for.
 *
 * @param utf8decode
 *                optional parameter, if set to true UTF-8 string is decoded
 *                back into Unicode after conversion from base64
 * @return decoded string
 */
kica.util.decodeBase64 = function (str, utf8decode) {
    if (!str)
        str = "";
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";// =
    utf8decode = (typeof utf8decode == 'undefined') ? false : utf8decode;
    var o1, o2, o3, h1, h2, h3, h4, bits, d = [], plain, coded;

    coded = utf8decode ? kica.util.decodeUTF8(str) : str;

    for ( var c = 0; c < coded.length; c += 4) { // unpack four hexets into
        // three octets
        h1 = b64.indexOf(coded.charAt(c));
        h2 = b64.indexOf(coded.charAt(c + 1));
        h3 = b64.indexOf(coded.charAt(c + 2));
        h4 = b64.indexOf(coded.charAt(c + 3));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >>> 16 & 0xff;
        o2 = bits >>> 8 & 0xff;
        o3 = bits & 0xff;

        d[c / 4] = String.fromCharCode(o1, o2, o3);
        // check for padding
        if (h4 == 0x40)
            d[c / 4] = String.fromCharCode(o1, o2);
        if (h3 == 0x40)
            d[c / 4] = String.fromCharCode(o1);
    }
    plain = d.join(''); // join() is far faster than repeated string
    // concatenation

    plain = utf8decode ? kica.util.decodeUTF8(plain) : plain;

    return plain;
};

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3
 * chars
 *
 * @return encoded string
 */
kica.util.encodeUTF8 = function (str) {
    if (!str)
        str = "";
    // use regular expressions & String.replace callback function for better
    // efficiency
    // than procedural approaches
    str = str.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes
    // 110yyyyy, 10zzzzzz
    function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
    });
    str = str.replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes
    // 1110xxxx, 10yyyyyy, 10zzzzzz
    function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
    });
    return str;
};

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @return decoded string
 */
kica.util.decodeUTF8 = function (str) {
    if (!str)
        str = "";
    str = str.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
    function (c) { // (note parentheses for precence)
        var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
        return String.fromCharCode(cc);
    });
    str = str.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte
    // chars
    function (c) { // (note parentheses for precence)
        var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
        return String.fromCharCode(cc);
    });
    return str;
};

/**
 * Converts a string into a hexadecimal string returns the characters of a
 * string to their hexadecimal charcode equivalent Works only on byte chars with
 * charcode < 256. All others chars are converted into "xx"
 *
 * @return hex string e.g. "hello world" => "68656c6c6f20776f726c64"
 */
kica.util.convertToHex = function (str) {
    if (!str)
        str = "";
    var hs = '';
    var hv = '';
    for ( var i = 0; i < str.length; i++) {
        hv = str.charCodeAt(i).toString(16);
        hs += (hv.length == 1) ? '0' + hv : hv;
    }
    return hs;
};

/**
 * Converts a hex string into a string returns the characters of a hex string to
 * their char of charcode
 *
 * @return hex string e.g. "68656c6c6f20776f726c64" => "hello world"
 */
kica.util.convertFromHex = function (str) {
    if (!str)
        str = "";
    var s = "";
    for ( var i = 0; i < str.length; i += 2) {
        s += String.fromCharCode(parseInt(str.substring(i, i + 2), 16));
    }
    return s;
};

/**
 * strips off all linefeeds from a string returns the the strong without line
 * feeds
 *
 * @return string
 */
kica.util.stripLineFeeds = function (str) {
    if (!str)
        str = "";
    // var re = RegExp(String.fromCharCode(13),'g');//\r
    // var re = RegExp(String.fromCharCode(10),'g');//\n
    var s = '';
    s = str.replace(/\n/g, '');
    s = s.replace(/\r/g, '');
    return s;
};

/**
 * Converts a string into an array of char code bytes returns the characters of
 * a hex string to their char of charcode
 *
 * @return hex string e.g. "68656c6c6f20776f726c64" => "hello world"
 */
kica.util.toByteArray = function (str) {
    if (!str)
        str = "";
    var ba = [];
    for ( var i = 0; i < str.length; i++)
        ba[i] = str.charCodeAt(i);

    return ba;
};

/**
 * Fragmentize a string into lines adding a line feed (lf) every length
 * characters
 *
 * @return string e.g. length=3 "abcdefghi" => "abc\ndef\nghi\n"
 */
kica.util.fragment = function (str, length, lf) {
    if (!str)
        str = "";
    if (!length || length >= str.length)
        return str;
    if (!lf)
        lf = '\n';
    var tmp = '';
    for ( var i = 0; i < str.length; i += length)
        tmp += str.substr(i, length) + lf;
    return tmp;
};

/**
 * Formats a hex string in two lower case chars + : and lines of given length
 * characters
 *
 * @return string e.g. "68656C6C6F20" => "68:65:6c:6c:6f:20:\n"
 */
kica.util.formatHex = function (str, length) {
    if (!str)
        str = "";
    if (!length)
        length = 45;
    var str_new = '';
    var hex = str.toLowerCase();
    for ( var i = 0; i < hex.length; i += 2)
        str_new += hex.substr(i, 2) + ':';
    hex = kica.util.fragment(str_new, length);

    return hex;
};

kica.util.byteArray2String = function (b) {
    // var out ='';
    var s = '';
    for ( var i = 0; i < b.length; i++) {
        s += String.fromCharCode(b[i]);
        // out += b[i]+':';
    }
    return s;
};

kica.util.showAttribute = function (obj) {
    try {
        var data = '';
        var count = 0;
        for ( var attr in obj) {
            count++;
            if (typeof (obj[attr]) == 'string' || typeof (obj[attr]) == 'number') {
                data = data + '[' + count + '] Attr Name : ' + attr + ', Value : ' + obj[attr] + ', Type : '
                        + typeof (obj[attr]) + '\n';
            } else {
                data = data + +'[' + count + '] Attr Name : ' + attr + ', Type : ' + typeof (obj[attr]) + '\n';
            }
        }
        document.getElementById('attr_show').value = data;
    } catch (e) {
        alert(e.message);
    }
};

kica.crypto = function () {

    this.getRandomBytes = function (len) {
        if (!len)
            len = 8;
        var bytes = new Array(len);
        var field = [];
        for ( var i = 0; i < 256; i++)
            field[i] = i;
        for (i = 0; i < bytes.length; i++)
            bytes[i] = field[Math.floor(Math.random() * field.length)];
        return bytes;
    };

    this.setDefaults = function () {
        this.params.nBits = 256;
        // salt should always be a Hex String e.g. AD0E76FF6535AD...
        this.params.salt = this.getRandomBytes(8);
        this.params.salt = kica.util.byteArray2String(this.params.salt);
        this.params.salt = kica.util.convertToHex(this.params.salt);
        this.params.blockSize = 16;
        this.params.UTF8 = true;
        this.params.A0_PAD = false;
    };

    this.debug = true;
    this.params = {};
    // setting default values for params
    this.params.dataIn = '';
    this.params.dataOut = '';
    this.params.decryptIn = '';
    this.params.decryptOut = '';
    this.params.encryptIn = '';
    this.params.encryptOut = '';
    // key should always be a Hex String e.g. AD0E76FF6535AD...
    this.params.key = '';
    // iv should always be a Hex String e.g. AD0E76FF6535AD...
    this.params.iv = '';
    this.params.clear = true;
    this.setDefaults();
    this.errors = '';
    this.warnings = '';
    this.infos = '';
    this.debugMsg = '';
    // set and get methods for base class
    this.setParams = function (pObj) {
        if (!pObj)
            pObj = {};
        for ( var p in pObj) {
            this.params[p] = pObj[p];
        }
    };
    this.getParams = function () {
        return this.params;
    };
    this.getParam = function (p) {
        return this.params[p] || '';
    };
    this.clearParams = function () {
        this.params = {};
    };
    this.getNBits = function () {
        return this.params.nBits;
    };
    this.getOutput = function () {
        return this.params.dataOut;
    };
    this.setError = function (str) {
        this.error = str;
    };
    this.appendError = function (str) {
        this.errors += str;
        return '';
    };
    this.getErrors = function () {
        return this.errors;
    };
    this.isError = function () {
        if (this.errors.length > 0)
            return true;
        return false
    };
    this.appendInfo = function (str) {
        this.infos += str;
        return '';
    };
    this.getInfos = function () {
        return this.infos;
    };
    this.setDebug = function (flag) {
        this.debug = flag;
    };
    this.appendDebug = function (str) {
        this.debugMsg += str;
        return '';
    };
    this.isDebug = function () {
        return this.debug;
    };
    this.getAllMessages = function (options) {
        var defaults = {
            lf : '\n',
            clr_mes : false,
            verbose : 15
        // verbose level bits = 1111
        };
        if (!options)
            options = defaults;
        for ( var d in defaults)
            if (typeof (options[d]) == 'undefined')
                options[d] = defaults[d];
        var mes = '';
        var tmp = '';
        for ( var p in this.params) {
            switch (p) {
            case 'encryptOut':
                tmp = kica.util.toByteArray(this.params[p].toString());
                tmp = kica.util.fragment(tmp.join(), 64, options.lf);
                break;
            case 'key':
            case 'iv':
                tmp = kica.util.formatHex(this.params[p], 48);
                break;
            default:
                tmp = kica.util.fragment(this.params[p].toString(), 64, options.lf);
            }
            mes += '<p><b>' + p + '</b>:<pre>' + tmp + '</pre></p>';
        }
        if (this.debug)
            mes += 'debug: ' + this.debug + options.lf;
        if (this.errors.length > 0 && ((options.verbose & 1) == 1))
            mes += 'Errors:' + options.lf + this.errors + options.lf;
        if (this.warnings.length > 0 && ((options.verbose & 2) == 2))
            mes += 'Warnings:' + options.lf + this.warnings + options.lf;
        if (this.infos.length > 0 && ((options.verbose & 4) == 4))
            mes += 'Infos:' + options.lf + this.infos + options.lf;
        if (this.debug && ((options.verbose & 8) == 8))
            mes += 'Debug messages:' + options.lf + this.debugMsg + options.lf;
        if (options.clr_mes)
            this.errors = this.infos = this.warnings = this.debug = '';
        return mes;
    };

};

if (typeof (kica.hash) != 'undefined') {
    kica.hash.md5 = function (string) {

        function RotateLeft (lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned (lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F (x, y, z) {
            return (x & y) | ((~x) & z);
        }
        function G (x, y, z) {
            return (x & z) | (y & (~z));
        }
        function H (x, y, z) {
            return (x ^ y ^ z);
        }
        function I (x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF (a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }

        function GG (a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }

        function HH (a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }

        function II (a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        }

        function ConvertToWordArray (string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }

        function WordToHex (lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        }

        // ** function Utf8Encode(string) removed. Aready defined in
        // pidcrypt_utils.js

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        // string = Utf8Encode(string); #function call removed

        x = ConvertToWordArray(string);

        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }
        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
        return temp.toLowerCase();
    };
}

if (typeof (kica.crypto) != 'undefined') {
    kica.crypto.aes = function (env) {

        /**/this.env = (env) ? env : new kica.crypto();
        this.blockSize = 16; // block size fixed at 16 bytes / 128 bits
        // (Nb=4) for AES
        this.ShiftRowTabInv; // initialized by init()
        this.xtime; // initialized by init()
        this.SBox = new Array(99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125,
                250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229,
                241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26,
                27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74,
                76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146,
                157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100,
                93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6,
                36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101,
                122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72,
                3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206,
                85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22);
        this.SBoxInv = new Array(82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130,
                155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11,
                66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100,
                134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87,
                167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143,
                202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240,
                180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113,
                29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254,
                120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25,
                181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60,
                131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125);
        this.ShiftRowTab = new Array(0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11);
    };

    /**/kica.crypto.aes.prototype = {
        expandKey : function (input) {

            var key = input.slice();
            var kl = key.length, ks, Rcon = 1;
            switch (kl) {
            case 16:
                ks = 16 * (10 + 1);
                break;
            case 24:
                ks = 16 * (12 + 1);
                break;
            case 32:
                ks = 16 * (14 + 1);
                break;
            default:
                alert("AESCore.expandKey: Only key lengths of 16, 24 or 32 bytes allowed!");
            }
            for ( var i = kl; i < ks; i += 4) {
                var temp = key.slice(i - 4, i);
                if (i % kl == 0) {
                    temp = new Array(this.SBox[temp[1]] ^ Rcon, this.SBox[temp[2]], this.SBox[temp[3]], this.SBox[temp[0]]);
                    if ((Rcon <<= 1) >= 256)
                        Rcon ^= 0x11b;
                } else if ((kl > 24) && (i % kl == 16))
                    temp = new Array(this.SBox[temp[0]], this.SBox[temp[1]], this.SBox[temp[2]], this.SBox[temp[3]]);
                for ( var j = 0; j < 4; j++)
                    key[i + j] = key[i + j - kl] ^ temp[j];
            }
            return key;
        },

        encrypt : function (input, key) {
            var l = key.length;
            var block = input.slice();
            this.addRoundKey(block, key.slice(0, 16));
            for ( var i = 16; i < l - 16; i += 16) {
                this.subBytes(block);
                this.shiftRows(block);
                this.mixColumns(block);
                this.addRoundKey(block, key.slice(i, i + 16));
            }
            this.subBytes(block);
            this.shiftRows(block);
            this.addRoundKey(block, key.slice(i, l));

            return block;
        },

        decrypt : function (input, key) {
            var l = key.length;
            var block = input.slice();
            this.addRoundKey(block, key.slice(l - 16, l));
            this.shiftRows(block, 1);// 1=inverse operation
            this.subBytes(block, 1);// 1=inverse operation
            for ( var i = l - 32; i >= 16; i -= 16) {
                this.addRoundKey(block, key.slice(i, i + 16));
                this.mixColumns_Inv(block);
                this.shiftRows(block, 1);// 1=inverse operation
                this.subBytes(block, 1);// 1=inverse operation
            }
            this.addRoundKey(block, key.slice(0, 16));

            return block;
        },
        subBytes : function (state, inv) {
            var box = (typeof (inv) == 'undefined') ? this.SBox.slice() : this.SBoxInv.slice();
            for ( var i = 0; i < 16; i++)
                state[i] = box[state[i]];
        },
        addRoundKey : function (state, rkey) {
            for ( var i = 0; i < 16; i++)
                state[i] ^= rkey[i];
        },
        shiftRows : function (state, inv) {
            var shifttab = (typeof (inv) == 'undefined') ? this.ShiftRowTab.slice() : this.ShiftRowTabInv.slice();
            var h = new Array().concat(state);
            for ( var i = 0; i < 16; i++)
                state[i] = h[shifttab[i]];
        },
        mixColumns : function (state) {
            for ( var i = 0; i < 16; i += 4) {
                var s0 = state[i + 0], s1 = state[i + 1];
                var s2 = state[i + 2], s3 = state[i + 3];
                var h = s0 ^ s1 ^ s2 ^ s3;
                state[i + 0] ^= h ^ this.xtime[s0 ^ s1];
                state[i + 1] ^= h ^ this.xtime[s1 ^ s2];
                state[i + 2] ^= h ^ this.xtime[s2 ^ s3];
                state[i + 3] ^= h ^ this.xtime[s3 ^ s0];
            }
        },
        mixColumns_Inv : function (state) {
            for ( var i = 0; i < 16; i += 4) {
                var s0 = state[i + 0], s1 = state[i + 1];
                var s2 = state[i + 2], s3 = state[i + 3];
                var h = s0 ^ s1 ^ s2 ^ s3;
                var xh = this.xtime[h];
                var h1 = this.xtime[this.xtime[xh ^ s0 ^ s2]] ^ h;
                var h2 = this.xtime[this.xtime[xh ^ s1 ^ s3]] ^ h;
                state[i + 0] ^= h1 ^ this.xtime[s0 ^ s1];
                state[i + 1] ^= h2 ^ this.xtime[s1 ^ s2];
                state[i + 2] ^= h1 ^ this.xtime[s2 ^ s3];
                state[i + 3] ^= h2 ^ this.xtime[s3 ^ s0];
            }
        },
        // xor the elements of two arrays together
        xOr_Array : function (a1, a2) {
            var i;
            var res = Array();
            for (i = 0; i < a1.length; i++)
                res[i] = a1[i] ^ a2[i];

            return res;
        },
        getCounterBlock : function () {
            // initialise counter block (NIST SP800-38A ??B.2): millisecond
            // time-stamp for nonce in 1st 8 bytes,
            // block counter in 2nd 8 bytes
            var ctrBlk = new Array(this.blockSize);
            var nonce = (new Date()).getTime(); // timestamp: milliseconds since
            // 1-Jan-1970
            var nonceSec = Math.floor(nonce / 1000);
            var nonceMs = nonce % 1000;
            // encode nonce with seconds in 1st 4 bytes, and (repeated) ms part
            // filling 2nd 4 bytes
            for ( var i = 0; i < 4; i++)
                ctrBlk[i] = (nonceSec >>> i * 8) & 0xff;
            for ( var i = 0; i < 4; i++)
                ctrBlk[i + 4] = nonceMs & 0xff;

            return ctrBlk.slice();
        },
        init : function () {

            this.env.setParams({
                blockSize : this.blockSize
            });
            this.ShiftRowTabInv = new Array(16);
            for ( var i = 0; i < 16; i++)
                this.ShiftRowTabInv[this.ShiftRowTab[i]] = i;
            this.xtime = new Array(256);
            for (i = 0; i < 128; i++) {
                this.xtime[i] = i << 1;
                this.xtime[128 + i] = (i << 1) ^ 0x1b;
            }
        }
    };
}

if (typeof (kica.crypto) != 'undefined' && typeof (kica.crypto.aes) != 'undefined' && typeof (kica.hash.md5) != 'undefined') {
    kica.crypto.aes.cbc = function () {

        this.kicaCrypto = new kica.crypto();
        this.AES = new kica.crypto.aes(this.kicaCrypto);

        this.getOutput = function () {
            return this.kicaCrypto.getOutput();
        };
        this.getAllMessages = function (lnbrk) {
            return this.kicaCrypto.getAllMessages(lnbrk);
        };
        this.isError = function () {
            return this.kicaCrypto.isError();
        };
    };
    /**
     * Initialize CBC for encryption from password. Note: Only for encrypt
     * operation!
     *
     * @param password:
     *                String
     * @param options {
     *                nBits: aes bit size (128, 192 or 256) }
     */
    kica.crypto.aes.cbc.prototype.init = function (password, options) {
        if (!options)
            options = {};
        var kicaCypto = this.kicaCrypto;
        kicaCypto.setDefaults();
        var pObj = this.kicaCrypto.getParams(); // loading defaults
        for ( var o in options)
            pObj[o] = options[o];
        var k_iv = this.createKeyAndIv({
            password : password,
            salt : pObj.salt,
            bits : pObj.nBits
        });
        pObj.key = k_iv.key;
        pObj.iv = k_iv.iv;
        pObj.dataOut = '';
        kicaCypto.setParams(pObj);
        this.AES.init();
    };

    /**
     * Initialize CBC for encryption from password.
     *
     * @param dataIn:
     *                plain text
     * @param password:
     *                String
     * @param options {
     *                nBits: aes bit size (128, 192 or 256) }
     */
    kica.crypto.aes.cbc.prototype.initEncrypt = function (dataIn, password, options) {
        this.init(password, options);// call standard init
        this.kicaCrypto.setParams({
            dataIn : dataIn,
            encryptIn : kica.utilCryptUtil.toByteArray(dataIn)
        });// setting input for encryption
    };
    /**
     * Initialize CBC for decryption from encrypted text (compatible with
     * openssl). see thread http://thedotnet.com/nntp/300307/showpost.aspx
     *
     * @param crypted:
     *                base64 encoded aes encrypted text
     * @param passwd:
     *                String
     * @param options {
     *                nBits: aes bit size (128, 192 or 256), UTF8: boolean, set
     *                to false when decrypting certificates, A0_PAD: boolean,
     *                set to false when decrypting certificates }
     */
    kica.crypto.aes.cbc.prototype.initDecrypt = function (crypted, password, options) {
        if (!options)
            options = {};
        var kicaCypto = this.kicaCrypto;
        kicaCypto.setParams({
            dataIn : crypted
        });
        if (!password)
            kicaCypto
                    .appendError('kica.crypto.aes.cbc.initFromEncryption: Sorry, can not crypt or decrypt without password.\n');
        var ciphertext = kica.util.decodeBase64(crypted);
        if (ciphertext.indexOf('Salted__') != 0)
            kicaCypto.appendError('kica.crypto.aes.cbc.initFromCrypt: Sorry, unknown encryption method.\n');
        var salt = ciphertext.substr(8, 8);// extract salt from crypted text
        options.salt = kica.util.convertToHex(salt);// salt is always hex string
        this.init(password, options);// call standard init
        ciphertext = ciphertext.substr(16);
        kicaCypto.setParams({
            decryptIn : kica.util.toByteArray(ciphertext)
        });
    };
    /**
     * Init CBC En-/Decryption from given parameters.
     *
     * @param input:
     *                plain text or base64 encrypted text
     * @param key:
     *                HEX String (16, 24 or 32 byte)
     * @param iv:
     *                HEX String (16 byte)
     * @param options {
     *                salt: array of bytes (8 byte), nBits: aes bit size (128,
     *                192 or 256) }
     */
    kica.crypto.aes.cbc.prototype.initByValues = function (dataIn, key, iv, options) {
        var pObj = {};
        this.init('', options);// empty password, we are setting key, iv
        // manually
        pObj.dataIn = dataIn;
        pObj.key = key;
        pObj.iv = iv;
        this.kicaCrypto.setParams(pObj);
    };

    kica.crypto.aes.cbc.prototype.getAllMessages = function (lnbrk) {
        return this.kicaCrypto.getAllMessages(lnbrk);
    };
    /**
     * Creates key of length nBits and an iv form password+salt compatible to
     * openssl. See thread http://thedotnet.com/nntp/300307/showpost.aspx
     *
     * @param pObj {
     *                password: password as String [salt]: salt as String,
     *                default 8 byte random salt [bits]: no of bits, default
     *                kicaCrypto.params.nBits = 256 }
     *
     * @return {iv: HEX String, key: HEX String}
     */
    kica.crypto.aes.cbc.prototype.createKeyAndIv = function (pObj) {
        var kicaCypto = this.kicaCrypto;
        var retObj = {};
        var count = 1;// openssl rounds
        var miter = "3";
        if (!pObj)
            pObj = {};
        if (!pObj.salt) {
            pObj.salt = kicaCypto.getRandomBytes(8);
            pObj.salt = kica.util.convertToHex(kica.util.byteArray2String(pObj.salt));
            kicaCypto.setParams({
                salt : pObj.salt
            });
        }
        var data00 = pObj.password + kica.util.convertFromHex(pObj.salt);
        var hashtarget = '';
        var result = '';
        var keymaterial = [];
        var loop = 0;
        keymaterial[loop++] = data00;
        for ( var j = 0; j < miter; j++) {
            if (j == 0)
                result = data00; // initialize
            else {
                hashtarget = kica.util.convertFromHex(result);
                hashtarget += data00;
                result = hashtarget;
            }
            for ( var c = 0; c < count; c++) {
                result = kica.hash.md5(result);
            }
            keymaterial[loop++] = result;
        }
        switch (pObj.bits) {
        case 128:// 128 bit
            retObj.key = keymaterial[1];
            retObj.iv = keymaterial[2];
            break;
        case 192:// 192 bit
            retObj.key = keymaterial[1] + keymaterial[2].substr(0, 16);
            retObj.iv = keymaterial[3];
            break;
        case 256:// 256 bit
            retObj.key = keymaterial[1] + keymaterial[2];
            retObj.iv = keymaterial[3];
            break;
        default:
            kicaCypto.appendError('kica.crypto.aes.cbc.createKeyAndIv: Sorry, only 128, 192 and 256 bits are supported.\nBits('
                    + typeof (pObj.bits) + ') = ' + pObj.bits);
        }
        return retObj;
    };
    /**
     * Encrypt a text using AES encryption in CBC mode of operation - see
     * http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
     *
     * one of the kica.crypto.aes.cbc init funtions must be called before
     * execution
     *
     * @param byteArray:
     *                text to encrypt as array of bytes
     *
     * @return aes-cbc encrypted text
     */
    kica.crypto.aes.cbc.prototype.encryptRaw = function (byteArray) {
        var kicaCypto = this.kicaCrypto;
        var aes = this.AES;
        var p = kicaCypto.getParams(); // get parameters for operation set by
        // init
        if (!byteArray)
            byteArray = p.encryptIn;
        kicaCypto.setParams({
            encryptIn : byteArray
        });
        if (!p.dataIn)
            kicaCypto.setParams({
                dataIn : byteArray
            });
        var iv = kica.util.convertFromHex(p.iv);
        // PKCS5 paddding
        var charDiv = p.blockSize - ((byteArray.length) % p.blockSize);
        if (p.A0_PAD)
            byteArray[byteArray.length] = 10;
        for ( var c = 0; c < charDiv; c++)
            byteArray[byteArray.length] = charDiv;
        var nBytes = Math.floor(p.nBits / 8); // nr of bytes in key
        var keyBytes = new Array(nBytes);
        var key = kica.util.convertFromHex(p.key);
        for ( var i = 0; i < nBytes; i++) {
            keyBytes[i] = isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i);
        }
        // generate key schedule
        var keySchedule = aes.expandKey(keyBytes);
        var blockCount = Math.ceil(byteArray.length / p.blockSize);
        var ciphertxt = new Array(blockCount); // ciphertext as array of
        // strings
        var textBlock = [];
        var state = kica.util.toByteArray(iv);
        for ( var b = 0; b < blockCount; b++) {
            // XOR last block and next data block, then encrypt that
            textBlock = byteArray.slice(b * p.blockSize, b * p.blockSize + p.blockSize);
            state = aes.xOr_Array(state, textBlock);
            state = aes.encrypt(state.slice(), keySchedule); // -- encrypt
            // block --
            ciphertxt[b] = kica.util.byteArray2String(state);
        }
        var ciphertext = ciphertxt.join('');
        kicaCypto.setParams({
            dataOut : ciphertext,
            encryptOut : ciphertext
        });

        // remove all parameters from enviroment for more security is debug off
        if (!kicaCypto.isDebug() && kicaCypto.clear)
            kicaCypto.clearParams();
        return ciphertext || '';
    };

    /**
     * Encrypt a text using AES encryption in CBC mode of operation - see
     * http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
     *
     * Unicode multi-byte character safe
     *
     * one of the kica.crypto.aes.cbc init funtions must be called before
     * execution
     *
     * @param plaintext:
     *                text to encrypt
     *
     * @return aes-cbc encrypted text openssl compatible
     */
    kica.crypto.aes.cbc.prototype.encrypt = function (plaintext) {
        var kicaCypto = this.kicaCrypto;
        var salt = '';
        var p = kicaCypto.getParams(); // get parameters for operation set by
        // init
        if (!plaintext)
            plaintext = p.dataIn;
        if (p.UTF8)
            plaintext = kica.util.encodeUTF8(plaintext);
        kicaCypto.setParams({
            dataIn : plaintext,
            encryptIn : kica.util.toByteArray(plaintext)
        });
        var ciphertext = this.encryptRaw();
        salt = 'Salted__' + kica.util.convertFromHex(p.salt);
        ciphertext = salt + ciphertext;
        ciphertext = kica.util.encodeBase64(ciphertext); // encode in base64
        kicaCypto.setParams({
            dataOut : ciphertext
        });
        // remove all parameters from enviroment for more security is debug off
        if (!kicaCypto.isDebug() && kicaCypto.clear)
            kicaCypto.clearParams();

        return ciphertext || '';
    };

    /**
     * Encrypt a text using AES encryption in CBC mode of operation - see
     * http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
     *
     * Unicode multi-byte character safe
     *
     * @param dataIn:
     *                plain text
     * @param password:
     *                String
     * @param options {
     *                nBits: aes bit size (128, 192 or 256) }
     *
     * @param plaintext:
     *                text to encrypt
     *
     * @return aes-cbc encrypted text openssl compatible
     *
     */
    kica.crypto.aes.cbc.prototype.encryptText = function (dataIn, password, options) {
        this.initEncrypt(dataIn, password, options);
        return this.encrypt();
    };

    /**
     * Decrypt a text encrypted by AES in CBC mode of operation
     *
     * one of the kica.crypto.aes.cbc init funtions must be called before
     * execution
     *
     * @param byteArray:
     *                aes-cbc encrypted text as array of bytes
     *
     * @return decrypted text as String
     */
    kica.crypto.aes.cbc.prototype.decryptRaw = function (byteArray) {
        var aes = this.AES;
        var kicaCypto = this.kicaCrypto;
        var p = kicaCypto.getParams(); // get parameters for operation set by
        // init
        if (!byteArray)
            byteArray = p.decryptIn;
        kicaCypto.setParams({
            decryptIn : byteArray
        });
        if (!p.dataIn)
            kicaCypto.setParams({
                dataIn : byteArray
            });
        if ((p.iv.length / 2) < p.blockSize)
            return kicaCypto
                    .appendError('kica.crypto.aes.cbc.decrypt: Sorry, can not decrypt without complete set of parameters.\n Length of key,iv:'
                            + p.key.length + ',' + p.iv.length);
        var iv = kica.util.convertFromHex(p.iv);
        if (byteArray.length % p.blockSize != 0)
            return kicaCypto
                    .appendError('kica.crypto.aes.cbc.decrypt: Sorry, the encrypted text has the wrong length for aes-cbc mode\n Length of ciphertext:'
                            + byteArray.length + byteArray.length % p.blockSize);
        var nBytes = Math.floor(p.nBits / 8); // nr of bytes in key
        var keyBytes = new Array(nBytes);
        var key = kica.util.convertFromHex(p.key);
        for ( var i = 0; i < nBytes; i++) {
            keyBytes[i] = isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i);
        }
        // generate key schedule
        var keySchedule = aes.expandKey(keyBytes);
        // separate byteArray into blocks
        var nBlocks = Math.ceil((byteArray.length) / p.blockSize);
        // plaintext will get generated block-by-block into array of
        // block-length strings
        var plaintxt = new Array(nBlocks.length);
        var state = kica.util.toByteArray(iv);
        var ciphertextBlock = [];
        var dec_state = [];
        for ( var b = 0; b < nBlocks; b++) {
            ciphertextBlock = byteArray.slice(b * p.blockSize, b * p.blockSize + p.blockSize);
            dec_state = aes.decrypt(ciphertextBlock, keySchedule); // decrypt
            // ciphertext
            // block
            plaintxt[b] = kica.util.byteArray2String(aes.xOr_Array(state, dec_state));
            state = ciphertextBlock.slice(); // save old ciphertext for next
            // round
        }

        // join array of blocks into single plaintext string and return it
        var plaintext = plaintxt.join('');
        if (kicaCypto.isDebug())
            kicaCypto.appendDebug('Padding after decryption:' + kica.util.convertToHex(plaintext) + ':' + plaintext.length
                    + '\n');
        var endByte = plaintext.charCodeAt(plaintext.length - 1);
        // remove oppenssl A0 padding eg. 0A05050505
        if (p.A0_PAD) {
            plaintext = plaintext.substr(0, plaintext.length - (endByte + 1));
        } else {
            var div = plaintext.length - (plaintext.length - endByte);
            var firstPadByte = plaintext.charCodeAt(plaintext.length - endByte);
            if (endByte == firstPadByte && endByte == div)
                plaintext = plaintext.substr(0, plaintext.length - endByte);
        }
        kicaCypto.setParams({
            dataOut : plaintext,
            decryptOut : plaintext
        });

        // remove all parameters from enviroment for more security is debug off
        if (!kicaCypto.isDebug() && kicaCypto.clear)
            kicaCypto.clearParams();

        return plaintext || '';
    };

    /**
     * Decrypt a base64 encoded text encrypted by AES in CBC mode of operation
     * and removes padding from decrypted text
     *
     * one of the kica.crypto.aes.cbc init funtions must be called before
     * execution
     *
     * @param ciphertext:
     *                base64 encoded and aes-cbc encrypted text
     *
     * @return decrypted text as String
     */
    kica.crypto.aes.cbc.prototype.decrypt = function (ciphertext) {
        var kicaCypto = this.kicaCrypto;
        var p = kicaCypto.getParams(); // get parameters for operation set by
        // init
        if (ciphertext)
            kicaCypto.setParams({
                dataIn : ciphertext
            });
        if (!p.decryptIn) {
            var decryptIn = kica.util.decodeBase64(p.dataIn);
            if (decryptIn.indexOf('Salted__') == 0)
                decryptIn = decryptIn.substr(16);
            kicaCypto.setParams({
                decryptIn : kica.util.toByteArray(decryptIn)
            });
        }
        var plaintext = this.decryptRaw();
        if (p.UTF8)
            plaintext = kica.util.decodeUTF8(plaintext); // decode from UTF8
        // back to Unicode
        // multi-byte chars
        if (kicaCypto.isDebug())
            kicaCypto.appendDebug('Removed Padding after decryption:' + kica.util.convertToHex(plaintext) + ':'
                    + plaintext.length + '\n');
        kicaCypto.setParams({
            dataOut : plaintext
        });

        // remove all parameters from enviroment for more security is debug off
        if (!kicaCypto.isDebug() && kicaCypto.clear)
            kicaCypto.clearParams();
        return plaintext || '';
    };

    /**
     * Decrypt a base64 encoded text encrypted by AES in CBC mode of operation
     * and removes padding from decrypted text
     *
     * one of the kica.crypto.aes.cbc init funtions must be called before
     * execution
     *
     * @param dataIn:
     *                base64 encoded aes encrypted text
     * @param password:
     *                String
     * @param options {
     *                nBits: aes bit size (128, 192 or 256), UTF8: boolean, set
     *                to false when decrypting certificates, A0_PAD: boolean,
     *                set to false when decrypting certificates }
     *
     * @return decrypted text as String
     */
    kica.crypto.aes.cbc.prototype.decryptText = function (dataIn, password, options) {
        this.initDecrypt(dataIn, password, options);
        return this.decrypt();
    };

}

/**
 * Context for a SHA-256 operation in progress.
 *
 * @constructor
 * @class Secure Hash Algorithm, 256 bits.
 */
kica.hash.sha256 = function (hash) {
    if (!this._key[0]) {
        this._precompute();
    }
    if (hash) {
        this._h = hash._h.slice(0);
        this._buffer = hash._buffer.slice(0);
        this._length = hash._length;
    } else {
        this.reset();
    }
};

/**
 * Hash a string or an array of words.
 *
 * @static
 * @param {bitArray|String}
 *                data the data to hash.
 * @return {bitArray} The hash value, an array of 16 big-endian words.
 */
kica.hash.sha256.hash = function (data) {
    return (new kica.hash.sha256()).update(data).finalize();
};

kica.hash.sha256.prototype = {
    /**
     * The hash's block size, in bits.
     *
     * @constant
     */
    blockSize : 512,

    /**
     * Reset the hash state.
     *
     * @return this
     */
    reset : function () {
        this._h = this._init.slice(0);
        this._buffer = [];
        this._length = 0;
        return this;
    },

    /**
     * Input several words to the hash.
     *
     * @param {bitArray|String}
     *                data the data to hash.
     * @return this
     */
    update : function (data) {
        if (typeof data === "string") {
            data = kica.util.utf8String.toBits(data);
        }
        var i, b = this._buffer = kica.util.bitArray.concat(this._buffer, data), ol = this._length, nl = this._length = ol
                + kica.util.bitArray.bitLength(data);
        for (i = 512 + ol & -512; i <= nl; i += 512) {
            this._block(b.splice(0, 16));
        }
        return this;
    },

    /**
     * Complete hashing and output the hash value.
     *
     * @return {bitArray} The hash value, an array of 16 big-endian words.
     */
    finalize : function () {
        var i, b = this._buffer, h = this._h;

        // Round out and push the buffer
        b = kica.util.bitArray.concat(b, [ kica.util.bitArray.partial(1, 1) ]);

        // Round out the buffer to a multiple of 16 words, less the 2 length
        // words.
        for (i = b.length + 2; i & 15; i++) {
            b.push(0);
        }

        // append the length
        b.push(Math.floor(this._length / 0x100000000));
        b.push(this._length | 0);

        while (b.length) {
            this._block(b.splice(0, 16));
        }

        this.reset();
        return h;
    },

    /**
     * The SHA-256 initialization vector, to be precomputed.
     *
     * @private
     */
    _init : [],
    /*
     * _init:[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],
     */

    /**
     * The SHA-256 hash key, to be precomputed.
     *
     * @private
     */
    _key : [],
    /*
     * _key: [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
     * 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be,
     * 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1,
     * 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc,
     * 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3,
     * 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
     * 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1,
     * 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585,
     * 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3,
     * 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814,
     * 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2],
     */

    /**
     * Function to precompute _init and _key.
     *
     * @private
     */
    _precompute : function () {
        var i = 0, prime = 2, factor;

        function frac (x) {
            return (x - Math.floor(x)) * 0x100000000 | 0;
        }

        outer: for (; i < 64; prime++) {
            for (factor = 2; factor * factor <= prime; factor++) {
                if (prime % factor === 0) {
                    // not a prime
                    continue outer;
                }
            }

            if (i < 8) {
                this._init[i] = frac(Math.pow(prime, 1 / 2));
            }
            this._key[i] = frac(Math.pow(prime, 1 / 3));
            i++;
        }
    },

    /**
     * Perform one cycle of SHA-256.
     *
     * @param {bitArray}
     *                words one block of words.
     * @private
     */
    _block : function (words) {
        var i, tmp, a, b, w = words.slice(0), h = this._h, k = this._key, h0 = h[0], h1 = h[1], h2 = h[2], h3 = h[3], h4 = h[4], h5 = h[5], h6 = h[6], h7 = h[7];

        /*
         * Rationale for placement of |0 : If a value can overflow is original
         * 32 bits by a factor of more than a few million (2^23 ish), there is a
         * possibility that it might overflow the 53-bit mantissa and lose
         * precision.
         *
         * To avoid this, we clamp back to 32 bits by |'ing with 0 on any value
         * that propagates around the loop, and on the hash state h[]. I don't
         * believe that the clamps on h4 and on h0 are strictly necessary, but
         * it's close (for h4 anyway), and better safe than sorry.
         *
         * The clamps on h[] are necessary for the output to be correct even in
         * the common case and for short inputs.
         */
        for (i = 0; i < 64; i++) {
            // load up the input word for this round
            if (i < 16) {
                tmp = w[i];
            } else {
                a = w[(i + 1) & 15];
                b = w[(i + 14) & 15];
                tmp = w[i & 15] = ((a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14)
                        + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i & 15] + w[(i + 9) & 15]) | 0;
            }

            tmp = (tmp + h7 + (h4 >>> 6 ^ h4 >>> 11 ^ h4 >>> 25 ^ h4 << 26 ^ h4 << 21 ^ h4 << 7) + (h6 ^ h4 & (h5 ^ h6)) + k[i]); // | 0;

            // shift register
            h7 = h6;
            h6 = h5;
            h5 = h4;
            h4 = h3 + tmp | 0;
            h3 = h2;
            h2 = h1;
            h1 = h0;

            h0 = (tmp + ((h1 & h2) ^ (h3 & (h1 ^ h2))) + (h1 >>> 2 ^ h1 >>> 13 ^ h1 >>> 22 ^ h1 << 30 ^ h1 << 19 ^ h1 << 10)) | 0;
        }

        h[0] = h[0] + h0 | 0;
        h[1] = h[1] + h1 | 0;
        h[2] = h[2] + h2 | 0;
        h[3] = h[3] + h3 | 0;
        h[4] = h[4] + h4 | 0;
        h[5] = h[5] + h5 | 0;
        h[6] = h[6] + h6 | 0;
        h[7] = h[7] + h7 | 0;
    }
};

/**
 * Hash a string or an array of words.
 *
 * @static
 * @param {bitArray|String}
 *                data the data to hash.
 * @return {bitArray} The hash value, an array of 16 big-endian words.
 */

kica.hash.sha1 = function () {

    this.name = 'sha1';
    this.digestLength = 20;
    this.blockSize = 64;
    this.block = new Array();

};
kica.hash.sha1.hash = function (data) {
    return (new kica.hash.sha1()).update(data).finalize();
};

kica.hash.sha1.name = 'sha1';
kica.hash.sha1.digestLength = 20;
kica.hash.sha1.blockSize = 64;

kica.hash.sha1.prototype = {

    update : function (str) {
        try {
            var chrsz = 8;
            var mask = (1 << chrsz) - 1;
            for ( var i = 0; i < str.length * chrsz; i += chrsz)
                this.block[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
            this.compress(this.block, str.length * chrsz);
        } catch (e) {
            throw new kica.exception.corrupt("Hash1 update " + e);
        }
        return this;
    },

    finalize : function () {

        return this.block;
    },

    compress : function (x, len) {
        try {
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;

            var w = Array(80);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            var e = -1009589776;

            for ( var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;

                for ( var j = 0; j < 80; j++) {
                    if (j < 16)
                        w[j] = x[i + j];
                    else
                        w[j] = this._rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    var t = this._safe_add(this._safe_add(this._rol(a, 5), this._sha1_ft(j, b, c, d)), this._safe_add(this
                            ._safe_add(e, w[j]), this._sha1_kt(j)));
                    e = d;
                    d = c;
                    c = this._rol(b, 30);
                    b = a;
                    a = t;
                }

                a = this._safe_add(a, olda);
                b = this._safe_add(b, oldb);
                c = this._safe_add(c, oldc);
                d = this._safe_add(d, oldd);
                e = this._safe_add(e, olde);
            }
            this.block = Array(a, b, c, d, e);
        } catch (e) {
            throw new kica.exception.corrupt("Hash1 compress " + e);
        }

    },
    /**
     * @private
     */
    _safe_add : function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    },
    /**
     * @private
     */
    _rol : function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    },

    /*
     * Perform the appropriate triplet combination function for the current
     * iteration
     */
    /**
     * @private
     */
    _sha1_ft : function (t, b, c, d) {
        if (t < 20)
            return (b & c) | ((~b) & d);
        if (t < 40)
            return b ^ c ^ d;
        if (t < 60)
            return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
    },

    /*
     * Determine the appropriate additive constant for the current iteration
     */
    /**
     * @private
     */
    _sha1_kt : function (t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
    }
};

/**
 * HMAC with the specified hash function.
 *
 * @constructor
 * @param {bitArray}
 *                key the key for HMAC.
 * @param {Object}
 *                [hash=kica.hash.sha256] The hash function to use.
 */
kica.misc.hmac = function (key, Hash) {
    /* this._hash = Hash =Hash|kica.hash.sha256; */

    if (Hash == undefined || Hash == null)
        Hash = kica.hash.sha256;
    this._hash = Hash;

    var exKey = [ [], [] ], i, bs = Hash.prototype.blockSize / 32;
    this._baseHash = [ new Hash(), new Hash() ];

    if (key.length > bs) {
        key = Hash.hash(key);
    }

    for (i = 0; i < bs; i++) {
        exKey[0][i] = key[i] ^ 0x36363636;
        exKey[1][i] = key[i] ^ 0x5C5C5C5C;
    }

    this._baseHash[0].update(exKey[0]);
    this._baseHash[1].update(exKey[1]);
};

/**
 * HMAC with the specified hash function. Also called encrypt since it's a prf.
 *
 * @param {bitArray|String}
 *                data The data to mac.
 * @param {Codec}
 *                [encoding] the encoding function to use.
 */
kica.misc.hmac.prototype.encrypt = kica.misc.hmac.prototype.mac = function (data, encoding) {
    var w = new (this._hash)(this._baseHash[0]).update(data, encoding).finalize();
    return new (this._hash)(this._baseHash[1]).update(w).finalize();
};

/**
 * SmartSing with the specified function.
 *
 * @constructor
 * @param {String
 *                Key} key the key for siteUser Key.
 *                key,doc,hashMod,policytype,policy,certurl
 */
kica.service.smartService = function (pObj) {
    this._processType = "00";// 00,01: submit,02:function call
    this._formName = "";
    this.signparams = {};
    //this.callbackTimerId = "";

    this.params = {};
    this.params.key = null;
    this.params.doc = document;
    this.params.hashmod = "1";
    this.params.policytype = null;
    this.params.policy = null;
    this.params.certurl = null;
    // KICASign_타이틀이미지정리 추가 start - 2017.05.11 yrkim
    this.params.relayServer = null;
    this.params.sitecode = null;
    // KICASign_타이틀이미지정리 추가 end - 2017.05.11 yrkim
    this.params.json = new kica.net.json();
    this._functionName = "";
    this.params.opcode = null;
    this.params.companycode = null;
    this.params.servicecode = null;

    this.setParams = function (pObj) {
        if (!pObj)
            pObj = {};
        for ( var p in pObj) {
            this.params[p] = pObj[p];
        }
    };
    this.getParams = function () {
        return this.params;
    };
    this.getParam = function (p) {
        var a = this.params[p];
        return (a != null && a != undefined ? a : '');
    };

    this.setParams(pObj);

    this._sign = new kica.sign.smartsign({
        authcode : this.params.key,
        site : this.params.doc.domain,
        policy : this.params.policy,
        policytype : this.params.policytype
    });

// block by nayagdkim 170524
//    this._keypad = new kica.keypad.securitykeypad(this.params.key, this.params.json);
};

kica.service.smartService.prototype = {
    numberKeypad : function (key) {
        this._processType = '00';
        this._keypad.numberkeypad(key);
    },
    complateCollBack : function (key) {
        this.params.json.complateCollBack();
    },
    stringKeypad : function (key) {
        this._processType = '00';
        this._keypad.stringkeypad(key);
    },
    keypad : function () {
        return this._keypad._kicaprovider;
    },


    /**
     * 수정자 	: sh.kim
     * 시간 		: 2018/07/21
     * 프로젝트 	: 중개서버 개발
     * 사유 		: 중개서버와 요청자의 고유값 공유
     *
     */
    getRelayID : function () {
        var kicaCypto = this.kicaCrypto;
        var p = this._sign.getParams(); // get parameters for operation set by

        var relayID = null;

       // console.log("#####>>>>>>>>>>>>>>>>>>>>>>" + p.relayID + '   ==============  ' + this.params.relayID );
        p.relayID == null ? relayID = this.params.relayID : relayID = p.relayID;
        return relayID;
    },

    /**
     * 수정자 	: sh.kim
     * 시간 		: 2018/07/21
     * 프로젝트 	: 중개서버 개발
     * 사유 		: 전자서명 > 전자서명
     *
     */
    smartSign : function (signField, message, title, hashmod, certField, serverType, siteCode, opCode) {
        this._sign.sign({
            name1 : signField,
            msg : message,
            title : title,
            hashmod : hashmod,
            name2 : certField,
            //certurl : //this.params.certurl,
            useRelay : serverType,
            relayID : makeGuid(),
            titleImgUrl : siteCode,
            relayServer : this.params.relayServer,
            sitecode : this.params.sitecode,
            isTitleUrl : 1,
            userAgent : navigator.userAgent,
            opcode	  : opCode
        });
    },

    /**
     * 수정자 	: sh.kim
     * 시간 		: 2018/07/21
     * 프로젝트 	: 중개서버 개발
     * 사유 		: 전자서명 > 전자서명+신원확인
     *
     */
    smartIdenSign : function (signField, message, title, hashmod, certField, serverType, siteCode, opCode) {
        this._sign.sign({
            name1 : signField,
            msg : message,
            title : title,
            hashmod : hashmod,
            name2 : certField,
            certurl : this.params.certurl,
            name3 : "R",
            useRelay : serverType,
            relayID : makeGuid(),
            titleImgUrl : siteCode,
            relayServer : this.params.relayServer,
            sitecode : this.params.sitecode,
            isTitleUrl : 1,
            opcode	  : opCode
        });
    },

    /**
     * 수정자 	: sh.kim
     * 시간 		: 2018/07/21
     * 프로젝트 	: 중개서버 개발
     * 사유 		: PKCS#7 서명 > PKCS#7 서명
     *
     */
    smartPKCSSign : function (signField, message, title, hashmod, serverType, siteCode, opCode) {
        this._sign.pkcs7Sign({
            name1 : signField,
            msg : message,
            title : title,
            hashmod : hashmod,
            useRelay : serverType,
            relayID : makeGuid(),
            titleImgUrl : siteCode,
            relayServer : this.params.relayServer,
            sitecode : this.params.sitecode,
            isTitleUrl : 1,
            opcode	  : opCode
        });
    },

    /**
     * 수정자 	: sh.kim
     * 시간 		: 2018/07/21
     * 프로젝트 	: 중개서버 개발
     * 사유 		: PKCS#7 서명 > PKCS#7 서명(Detach)
     *
     */
    smartPKCSSignDetach : function (signField, message, title, hashmod, serverType, siteCode, opCode) {
        this._sign.pkcs7detach({
            name1 : signField,
            msg : message,
            title : title,
            hashmod : hashmod,
            //certurl : //this.params.certurl,
            name2 : "signCert",
            useRelay : serverType,
            relayID : makeGuid(),
            titleImgUrl : siteCode,
            relayServer : this.params.relayServer,
            sitecode : this.params.sitecode,
            isTitleUrl : 1,
            opcode	  : opCode
        });
    },

    /**
     * 수정자 	: sh.kim
     * 시간 		: 2018/07/21
     * 프로젝트 	: 중개서버 개발
     * 사유 		: PKCS#7 서명 > PKCS#7 + 신원학인
     *
     */
    smartIdenPKCSSign : function (signField, message, title, hashmod, serverType, siteCode, opCode) {
        this._sign.pkcs7Sign({
            name1 : signField,
            msg : message,
            title : title,
            hashmod : hashmod,
            certurl : this.params.certurl,
            name2 : "R",
            useRelay : serverType,
            relayID : makeGuid(),
            titleImgUrl : siteCode,
            relayServer : this.params.relayServer,
            sitecode : this.params.sitecode,
            isTitleUrl : 1,
            opcode	  : opCode
        });
    },

    /**
     * 수정자 	: sh.kim
     * 시간 		: 2018/07/21
     * 프로젝트 	: 중개서버 개발
     * 사유 		: QR 서명 > QR 서명
     *
     */
    getCERTDataForQR : function (message, title, hashmod, opCode) {
         var _json = new kica.net.json();
         var urlparams = "";
         var url = "";

         this.params.relayID = makeGuid();
         //console.log("#### params.relayID #####" +  KicaService.getRelayID());
         var jsonData =
         {
             license	:	this.params.key,
             siteName	:	this.params.sitecode,
             relayID	:	KicaService.getRelayID(),
             opCode		:	opCode,
             reqData	: {
                 tobeSignedData	:	message,
                 title			:	title,
                 hashMode		:	hashmod,
                 //encCertUrl		:	this.params.certurl,
                 policy	: {
                     oid 	: this.params.policy,
                     oidType : this.params.policytype
                 }
             }
         }

         urlparams = JSON.stringify(jsonData);
         urlparams = kica.util.utf8ToURLEncode.encodeURL(urlparams);
         urlparams = _json._paramEncode(urlparams);
         console.log(">>urlparams : " + urlparams)
         url = "kicasignplus://app.kica.com/" + urlparams;
         return url;
     },

     /**
      * 수정자 	: sh.kim
      * 시간 		: 2018/07/21
      * 프로젝트 	: 중개서버 개발
      * 사유 		: FIDO 인증 > FIDO
      *
      */
     getFIDOData : function (userid, opCode) {
         var _json = new kica.net.json();
         var urlparams = "";
         var url = "";
         this.params.relayID = makeGuid();

         var jsonData =
         {
             license	:	this.params.key,
             siteName	:	this.params.sitecode,
             relayID	:	this.params.relayID,
             opCode		:	opCode,
             reqData	: {
                 companyCode	:	this.params.companycode,
                 serviceCode	:	this.params.servicecode,
                 userID		    :	userid

             }
         }


         urlparams = JSON.stringify(jsonData);

         //alert(urlparams);
         urlparams = kica.util.utf8ToURLEncode.encodeURL(urlparams);
         urlparams = _json._paramEncode(urlparams);
         url = "app.kica.com/" + urlparams;
         _json._viewApp(url);
     },


     /**
      * 수정자 	: sh.kim
      * 시간 		: 2018/07/21
      * 프로젝트 	: 중개서버 개발
      * 사유 		: FIDO 인증 > FIDO QR
      *
      */
     getFIDODataForQR : function (userid, opCode) {
         var _json = new kica.net.json();
         var urlparams = "";
         var url = "";

         this.params.relayID = makeGuid();

         //console.log("2222>> this.params.relayID : " +  this.params.relayID)

         var jsonData =
         {
             license	:	this.params.key,
             siteName	:	this.params.sitecode,
             relayID	:	this.params.relayID,
             opCode		:	opCode,
             reqData	: {
                 companyCode	:	this.params.companycode,
                 serviceCode	:	this.params.servicecode,
                 userID			:	userid
             }
         }

         urlparams = JSON.stringify(jsonData);
         urlparams = kica.util.utf8ToURLEncode.encodeURL(urlparams);
         urlparams = _json._paramEncode(urlparams);

         url = "kicasignplus://app.kica.com/" + urlparams;
         return url;
     },

     /**
      * 수정자 	: sh.kim
      * 시간 		: 2018/07/21
      * 프로젝트 	: 중개서버 개발
      * 사유 		: K-FIDO 인증 > K-FIDO
      *
      */
     getKFIDOData : function (userid, hashmod, signType, opCode) {
         var _json = new kica.net.json();
         var urlparams = "";
         var url = "";
         this.params.relayID = makeGuid();

         var jsonData =
         {
             license	:	this.params.key,
             siteName	:	this.params.sitecode,
             relayID	:	this.params.relayID,
             opCode		:	opCode,
             reqData	: {
                 companyCode	:	this.params.companycode,
                 serviceCode	:	this.params.servicecode,
                 signType		:   signType,
                 hashMode		:	hashmod,
                 tobeSignedData	:	userid//,
                 //encCertUrl		:	this.params.certurl

             }
         }


         urlparams = JSON.stringify(jsonData);
         //alert(urlparams);
         urlparams = kica.util.utf8ToURLEncode.encodeURL(urlparams);
         urlparams = _json._paramEncode(urlparams);
         url = "app.kica.com/" + urlparams;
         _json._viewApp(url);
     },

     /**
      * 수정자 	: sh.kim
      * 시간 		: 2018/07/21
      * 프로젝트 	: 중개서버 개발
      * 사유 		: 인증서(발급,재발급,갱신) > 발급,재발급
      *
      */
     getCertIssue : function (auth_reference, auth_code, opCode) {

         var _json = new kica.net.json();
         var urlparams = "";
         var url = "";
         this.params.relayID = makeGuid();

         var jsonData =
         {
             license	:	this.params.key,
             siteName	:	this.params.sitecode,
             relayID	:	this.params.relayID,
             opCode		:	opCode,
             reqData	: {
                 authCode	:	auth_code,
                 refNum		:	auth_reference
             }
         }

         urlparams = JSON.stringify(jsonData);

         urlparams = kica.util.utf8ToURLEncode.encodeURL(urlparams);

         urlparams = _json._paramEncode((urlparams.replace('\n', '')));

         var uri = "app.kica.com/" + urlparams;
         console.log(">>> : " + uri);
         _json._viewApp(uri);
     },

     /**
      * 수정자 	: sh.kim
      * 시간 		: 2018/07/21
      * 프로젝트 	: 중개서버 개발
      * 사유 		: 인증서(발급,재발급,갱신) > 갱신
      *
      */
     getCertRenew : function (subjectDN, opCode) {

         var _json = new kica.net.json();
         var urlparams = "";
         var url = "";
         this.params.relayID = makeGuid();

         var jsonData =
         {
             license	:	this.params.key,
             siteName	:	this.params.sitecode,
             relayID	:	this.params.relayID,
             opCode		:	opCode,
             reqData	: {
                 subjectDN	:	subjectDN,
             }
         }

         urlparams = JSON.stringify(jsonData);

         urlparams = kica.util.utf8ToURLEncode.encodeURL(urlparams);

         urlparams = _json._paramEncode((urlparams.replace('\n', '')));

         var uri = "app.kica.com/" + urlparams;
         console.log(">>> : " + uri);
         _json._viewApp(uri);
     },


     /**
      * 수정자 	: sh.kim
      * 시간 		: 2018/07/21
      * 프로젝트 	: 중개서버 개발
      * 사유 		: 인증서 관리
      *
      */
     getMngData : function (opCode) {
         var _json = new kica.net.json();
         var urlparams = "";
         var url = "";
         this.params.relayID = makeGuid();

         var jsonData =
         {
             license	:	this.params.key,
             siteName	:	this.params.sitecode,
             relayID	:	this.params.relayID,
             opCode		:	opCode,
             reqData	: {
                 companyCode	:	this.params.companycode,
                 serviceCode	:	this.params.servicecode,
             }
         }

         urlparams = JSON.stringify(jsonData);

         urlparams = kica.util.utf8ToURLEncode.encodeURL(urlparams);
         urlparams = _json._paramEncode(urlparams);
         url = "app.kica.com/" + urlparams;
         _json._viewApp(url);
     },

    callBackProcess : function (respCode, data) {
        //alert(respCode + "==>> 중계서버에 받은 파라미터 << 원본 ==>" + data);
        this.params.json.removeScriptTag();
        var decData = this.params.json._paramDecode(data);

        if (respCode == 2000) {

            var spdata = '';
            spdata = decData.split('|');
            //this._findObect(this.params.doc, "hashmod", this.params.hashmod);
            var parsedJson = JSON.parse(spdata);
            for(key in parsedJson) {
                if(key == 'reqResultData'){
                    var parsedSubJson = parsedJson[key];
                    for(keySub in parsedSubJson) {
                        if(keySub == 'subjectDN'){
                            try {
                                this._findObect(this.params.doc, keySub, data);
                            } catch (e) {
                                alert(fieldName + " : field error:" + e);
                            }
                        }else{
                            try {
								//	기존 
                                //	this._findObect(this.params.doc, keySub, parsedSubJson[keySub]);
								//	수정 - 구 스크립트 적용 사이트 지원을 위한 부분 입니다. no1true 
								if(keySub == 'signedData'){
									this._findObect(this.params.doc, 'signMessage', parsedSubJson[keySub]);
								}
								else if(keySub == 'signedCert'){
									this._findObect(this.params.doc, 'signCert', parsedSubJson[keySub]);
								}
								else if(keySub == 'randomValue'){
									this._findObect(this.params.doc, 'R', parsedSubJson[keySub]);
								}
								this._findObect(this.params.doc, keySub, parsedSubJson[keySub]);
								//	여기까지 수정
                            } catch (e) {
                                alert(fieldName + " : field error:" + e);
                            }
                        }
                    }
                }
            }

            if (this._processType == '01') { // submit
                try {
                    kica.findObject(this._formName).submit();
                } catch (e) {
                    alert(this._formName + " can not be found.");
                }
            } else if (this._processType == '02') { // function call

                try {
                    this._functionName();
                } catch (e) {
                    alert(this._functionName + " is Not Found");
                }
            }
            KicaInterval.restart();
        } else {
            alert(" response input data error\n" + decData);
        }
    },
    _findObect : function (Nodes, name, value) {
        try {
            kica.findObject(name).value = value;
        } catch (e) {
            for ( var i = 0; i < Nodes.childNodes.length; i++) {
                var item = Nodes.childNodes.item(i);

                if (item.childNodes.length > 0) {
                    this._findObect(item, name, value);
                } else {
                    if (item.nodeType == 1) {
                        var va = item.getAttribute('id');
                        if (va == name) {
                            item.setAttribute("value", "");
                            item.setAttribute("value", value);
                        }
                    }
                }
            }
        } finally {
            document.body.focus();

        }
        return true;
    },
    submit : function (form) {
        this._processType = '01';
        this._formName = form;
    },
    functionCall : function (name) {
        this._processType = '02';
        this._functionName = name;
    }

};

//	kicasign_interface.js 중복으로 주석처리 2019-07-11
/*
var checkElement = function (id) {
    var rid = id;
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
		//	2019-07-04 no1true
        //alert("Fild Exception: " + e);
        throw e;
    }
};
*/

kica.net.json = function (key) {
    this._aes = new kica.crypto.aes.cbc();
    this.key = '8f66bc54ec5f9988f662cb75284eaa4e64879467ca852b94376a9ab54eae85ba';
    this.iv = 'eb5eb5ac35caf38dfc0ffcf50c1fb61e';
    this._aes.initByValues('', this.key, this.iv);
    this.noCacheIE = '&noCacheIE=' + (new Date()).getTime();
    this.headLoc = document.getElementsByTagName("head").item(0);
    this.bodyLoc = document.getElementsByTagName("body").item(0);
    this.bodysize = document.getElementsByTagName("body").length;
    this.scriptId = 'JscriptId' + kica.net.json.scriptCounter++;
    this.scriptName = '_kica.Util.app';
    this.intervalCount = 0;
    this.scriptCounter = 1;
    this.status_flag = false;
    this.inputObj = null;
//	this.timerId;
    this.aObj;
    this.isCallback = false;
    this.collBackflage = false;
    this.getSrcName = function () {
        return (new kica.net.json()).scriptName;
    };
};

kica.net.json.prototype = {
    targetUrl : 'http://127.0.0.1:9999/',

    isViewWebsignApp : false,

    buildScriptTag : function (key) { // Create the script tag
        var targetUrl = this.targetUrl + key;
        this.scriptObj = document.createElement("script");
        this.scriptObj.setAttribute("type", "text/javascript");
        this.scriptObj.setAttribute("charset", "utf-8");
        this.scriptObj.setAttribute("src", targetUrl);
        this.scriptObj.setAttribute("id", this.scriptId);
        this.scriptObj.setAttribute("name", this.scriptName);
        this.headLoc.appendChild(this.scriptObj);
    },
    complateCollBack : function (key) {
        //clearInterval(this.timerId);
        //clearInterval(key);
        KicaInterval.end();
    },

    removeScriptTag : function () {
        try {
            if (this.scriptObj != undefined || this.scriptObj != null) {

                var headLoc = document.getElementsByTagName("head").item(0);
                var childNodeList = document.getElementsByName(this.scriptName);
                for ( var i = 0; i < childNodeList.length; i++) {
                    var child = childNodeList.item(i);
                    headLoc.removeChild(child);
                }
            }
        } catch (e) {
            throw new kica.exception.corrupt(" remove ScriptTag " + e);
        }
    },
    _viewApp: function (uri) {
        /* PC K-Fido Logic */
        var platform = getPlatform();
        if (platform !== "windows") {
            try {
                AppInstaller.link("websign").send(uri);
            } catch (e) {
                throw new kica.exception.corrupt("App Open ERROR : " + e);
            }
        }
    },
    _paramEncode : function (param) {
        var g = "";
        try {
            var q = kica.util.toByteArray(param);
            var w = this._aes.encryptRaw(q);
            var f = kica.util.encodeBase64(w);
            g = kica.util.utf8ToURLEncode.encodeURL(f);
        } catch (e) {
            throw new kica.exception.corrupt(" param Encode " + e);
        }
        return g;
    },
    _paramDecode : function (param) {
        var crypted = "";
        try {
            var a = kica.util.utf8ToURLEncode.decodeURL(param);
            var b = kica.util.stripLineFeeds(a);
            var d = kica.util.decodeBase64(b);
            var c = kica.util.toByteArray(d);
            crypted = this._aes.decryptRaw(c);
        } catch (e) {
            alert("Message DEC ERROR : " + e);
            throw new kica.exception.corrupt("param Decode " + e);
        }

        return kica.util.stripLineFeeds(crypted);
    },
    _repeatcollApp : function (key) {

        var fun;
        switch (key) {
        case 1:
            fun = this._keyPadGetData;
            break;
        case 2:
            fun = this._signGetData;
            break;
        case 3:
            fun = this._signeddataGetData;
            break;
        case 4:
            fun = this._signandenvelopedGetData;
            break;
        default:
            throw new kica.exception.invalid("Send Type Error");
            break;
        }

        KicaInterval.start(fun);
    },
    _getData : function (key) {
        var json = new kica.net.json();
        json.buildScriptTag();
    },
    _keyPadGetData : function (key) {
        var json = new kica.net.json();
        json.buildScriptTag("keypad");
    },
    _signGetData : function (key) {
        var json = new kica.net.json();
        json.buildScriptTag("sign");
    },
    _signeddataGetData : function (key) {
        var json = new kica.net.json();
        json.buildScriptTag("signeddata");
    },
    _signandenvelopedGetData : function (key) {
        var json = new kica.net.json();
        json.buildScriptTag("signandenveloped");
    }
};

kica.sign.smartsign = function (pObj) {

    this._json = ((!pObj.json) ? new kica.net.json() : pObj.json);
    this.isCallback = false;
    this.cmd = {};
    this.cmd.sign = 20;
    this.cmd.pkcs7 = 30;
    this.cmd.pkcs7detach = 31;
    this.type = {};
    this.type.nomal = 1;
    this.type.hash = 2;
    this.calltype = {};
    this.calltype.keypad = 1;
    this.calltype.sign = 2;
    this.calltype.signeddata = 3;
    this.calltype.signandenveloped = 4;

    this._repeatCount = 0;
    this.params = {};
    this.params.name1 = null;
    this.params.name2 = null;
    this.params.cmd = null;
    this.params.type = null;
    this.params.certurl = null;
    this.params.calltype = null;
    this.params.hashmod = null;
    this.params.policytype = null;
    this.params.policy = null;
    this.params.site = null;
    this.params.authcode = null;
    this.params.msg = null;
    this.params.name3 = null;
    this.params.useRelay = 0;
    this.params.titleImgUrl = null;
    this.params.opcode  = null;
    this.params.companycode  = null;
    this.params.servicecode  = null;

    /**
     * 수정자 	: 박성수
     * 시간 		: 2017/03/20
     * 코드 		: 20170320_1028
     * 프로젝트 	: 중개서버 개발
     * 사유 		: 중개서버와 요청자의 고유값 공유
     *
     * 20170320_1028 수정시작
     */
    this.params.relayID = null;
    this.params.useRelay = 0;
    /**
     * 20170320_1028 수정 끝
     */
    // KICASign_타이틀이미지정리 추가 start - 2017.05.11 yrkim
    this.params.relayServer = null;
    this.params.sitecode = null;
    this.params.isTitleUrl = 0;
    // KICASign_타이틀이미지정리 추가 end - 2017.05.11 yrkim

    this.setParams = function (pObj) {
        if (!pObj)
            pObj = {};
        for ( var p in pObj) {
            this.params[p] = pObj[p];

            console.log(">> P : " + p)
            console.log(">> pObj[p] : " + pObj[p])
        }
    };
    this.getParams = function () {
        return this.params;
    };
    this.getParam = function (p) {
        var a = this.params[p];
        return (a != null && a != undefined ? a : '');
    };

    this.clearParams = function () {
        this.params = {};
    };
    this.setParams(pObj);
};

kica.sign.smartsign.prototype = {
    _kicaprovider : "kicawebsign01://app.kica.com/",
    ar_cmd : 10,
    name : function () {
        return "smartSign";
    },

    sign : function (pObj) {
        this.setParams(pObj);
        return this._signMessage({
            cmd : this.cmd.sign,
            type : this.type.nomal,
            calltype : this.calltype.sign
        });
    },
    signHash : function (pObj) {
        this.setParams(pObj);
        return this._signMessage({
            cmd : this.cmd.sign,
            type : this.type.hash,
            calltype : this.calltype.sign
        });
    },
    pkcs7Sign : function (pObj) {
        this.setParams(pObj);
        return this._signMessage({
            cmd : this.cmd.pkcs7,
            calltype : this.calltype.signeddata
        });
    },
    pkcs7SignAndEnv : function (pObj) {
        this.setParams(pObj);
        return this._signMessage({
            cmd : this.cmd.pkcs7,
            calltype : this.calltype.signeddata
        });
    },
    /* signOkay Logic */
    pkcs7detach : function (pObj) {
        this.setParams(pObj);
        return this._signMessage({
            cmd : this.cmd.pkcs7detach,
            calltype : this.calltype.signeddata
        });
    },
    /*// signOkay Logic */
    _signMessage : function (pObj) {

        this.setParams(pObj);
        this.setParams({
            msg : this.params.msg
        });

        var urlparams = getAppJsonParam(this.params);

        urlparams = kica.util.utf8ToURLEncode.encodeURL(urlparams);
        var param = this._json._paramEncode(urlparams);

        var uri = "app.kica.com/" + param;
        console.log(">>> : " + uri);
        this._json._viewApp(uri);
        //this._json._repeatcollApp(this.params.calltype);
    }

};

function getAppJsonParam(params){

    var jsonData = null;


    if("20,30,31".indexOf(params.opcode) >= 0){ // 전자서명, PKCS#7, Detached

        jsonData =
        {
            license	:	params.authcode,
            siteName:	params.sitecode,
            relayID	:	params.relayID,
            opCode	:	params.opcode,
            reqData	: {
                tobeSignedData	:	params.msg,
                title			:	params.title,
                hashMode		:	params.hashmod,
                encCertUrl		:	params.certurl,
                policy	: {
                    oid 	: params.policy,
                    oidType : params.policytype
                }
            }
        }
    }

   // alert(params.authcode +  "/" + JSON.stringify(jsonData));

    return JSON.stringify(jsonData);


}

function makeGuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });

    return uuid.toUpperCase();
}


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

function fnCancel()
{
    var parent = document.getElementById("appPop");
    parent.removeChild(document.getElementById("appCallPopup"));
}

function goAppStore() {
    var uagent = navigator.userAgent.toLocaleLowerCase();

    if (uagent.search("android") > -1) {
        location.href ="market://details?id=com.kica.android.app";
    } else if (uagent.search("iphone") > -1 || uagent.search("ipod") > -1 || uagent.search("ipad") > -1) {
        location.href ="https://itunes.apple.com/kr/app/gong-in-injeungseobiseu/id434358764?mt=8"
    }
}











