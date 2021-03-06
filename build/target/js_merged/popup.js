
window.txEval = function(source, target){
	if (typeof source == "function") {
		return source.call(target || this);
	} else if (typeof source == "string") {
		return (target) ? target.eval(source) : this.eval(source);
	}
};
(function(){
try {
    EditorJSLoader.readyState = 'loading';
} catch(e) {
}
/**
 * Application scope variable
 *  
 */
var _DOC = document,
	_WIN = window,
	_DOC_EL = _DOC.documentElement,
	_FALSE = false,
	_TRUE = true,
	_NULL = null,
	_UNDEFINED;

/** @namespace */
var $tx = {}; 
(function() {
	/**
	 * @function
	 */
	Object.extend = function(destination, source) {
		for (var property in source) {
			destination[property] = source[property];
		}
		return destination;
	};
	
	_WIN.Class = {
		create: function() {
			return function() {
				this.initialize.apply(this, arguments);
			};
		}
	};
	/**
	 * @class
	 */
	_WIN.$break = {};
	/**
	 * 함수(=메소드) 소유자 객체로 미리 묶는 함수의 인스턴스를 반환. 반환된 함수는 원래의 것과 같은 인자를 가질 것이다.
	 * @function
	 */
	Function.prototype.bind = function() {
		var __method = this, args = $A(arguments), object = args.shift();
		return function() {
			return __method.apply(object, args.concat($A(arguments)));
		};
	};
	/**
	 * 유하는 객체 함수(=메소드) 소유자 객체로 미리 묶는 함수의 인스턴스를 반환. 반환된 함수는 이것의 인자로 현재 이벤트 객체를 가질것이다.
	 * @function
	 */
	Function.prototype.bindAsEventListener = function() {
		var __method = this, args = $A(arguments), object = args.shift();
		return function(event) {
			return __method.apply(object, [event || _WIN.event].concat(args));
		};
	};

	var txlib = function(element) {
		var args = arguments;
		if (args.length > 1) {
			for (var i = 0, elements = [], length = args.length; i < length; i++) 
				elements.push($tx(args[i]));
			return elements;
		}
		if (typeof element == 'string') {
			element = _DOC.getElementById(element);
		}
		return element;
	};
	$tx = txlib;

    var dateNow = Date.now || function() { return new Date().getTime(); };
    Object.extend($tx, {
        throttle: function(func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            options || (options = {});
            var later = function() {
                previous = options.leading === false ? 0 : dateNow();
                timeout = null;
                result = func.apply(context, args);
                context = args = null;
            };
            return function() {
                var now = dateNow();
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                    context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        debounce: function(func, wait, immediate) {
            var timeout, args, context, timestamp = 0, result;

            var later = function() {
                var last = dateNow() - timestamp;

                if (last < wait && last >= 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };

            return function() {
                context = this;
                args = arguments;
                timestamp = dateNow();
                var callNow = immediate && !timeout;
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        }
    });

	var txua = navigator.userAgent.toLowerCase();
	var isExistAgentString = function(str){
		return txua.indexOf(str)!=-1;
	};
    var isExistAgentStringByRegx = function(regx){
        return regx.test(txua);
    };
    /**
     * goog 코드 호출
     * type 확인 함수
     */
    Object.extend($tx, {
        isArray: function(v){ return goog.isArray(v)},
        isArrayLike: function(v){ return goog.isArrayLike(v)},
        isString:function(v){ return goog.isString(v)},
        isBoolean: function(v){ return goog.isBoolean(v)},
        isNumber: function(v){ return goog.isNumber(v)},
        isFunction: function(v){ return goog.isFunction(v)},
        isObject: function(v){ return goog.isObject(v)}
    });

	Object.extend($tx, /** @lends $tx */{
		/**
		 * Chrome browser 이면 true
		 * @field
		 */
		chrome: isExistAgentString("chrome"),
		/**
		 * safari browser 이면 true 
		 * @field
		 */
		safari: isExistAgentString("safari") && isExistAgentString("chrome") == _FALSE,
		/**
		 * Firefox browser 이면 true 
		 * @field
		 */
		gecko: isExistAgentString("firefox"),
		/**
		 * Firefox browser의 버전 
		 * @field
		 */
		gecko_ver: isExistAgentString("firefox")?parseFloat(txua.replace(/.*firefox\/([\d\.]+).*/g,"$1")):0,
		/**
		 * MS IE 이면 true
         * IE7 이하는 msie로 구분
         * IE8 이상은 trident로 구분
		 * @field
		 */
        msie: isExistAgentString("msie") || isExistAgentString("trident"),
		/**
		 * MS IE browser 버전 a.match(/rv:(\d+)\.\d+/)
         * IE7 이하는 msie로 구분
         * IE8 이상은 trident & rv:x로 구분
		 * @field
		 */
        msie_ver: isExistAgentString("msie") || isExistAgentString("trident")?(function(){
            return isExistAgentString("msie") ? parseFloat(txua.split("msie")[1]) : parseFloat(txua.split("rv:")[1]);
        })():0,
        /**
         * MS IE document mode 버전
         * @field
         */
        msie_docmode: _DOC.documentMode || 0,
		/**
		 * AppleWebKit browser 이면 true 
		 * @field
		 */
		webkit: isExistAgentString("applewebkit"),
		/**
		 * AppleWebKit 버전
		 * @field
		 */
		webkit_ver: isExistAgentString("applewebkit")?parseFloat(txua.replace(/.*safari\//g,"")):0,
		/**
		 * Opera 이면 true 
		 * @field
		 */
		opera: isExistAgentString("opera"),
		 /**  
 	      * Presto browser 이면 true   
		  * @field  
		  */
		presto: isExistAgentString("presto"),
		os_win: isExistAgentString("win"),
        os_win7: isExistAgentString('windows nt 6.1'),
        os_win8: isExistAgentString('windows nt 6.2'),
        os_win8_1: isExistAgentString('windows nt 6.3'),
		os_mac: isExistAgentString("mac"),
		/**
		 * iPhone 이면 true 
		 * @field
		 */
		iphone: isExistAgentString("iphone"),
		/**
		 * iPod 이면 true 
		 * @field
		 */
		ipod: isExistAgentString("ipod"),
		/**
		 * iPad 이면 true 
		 * @field
		 */
		ipad: isExistAgentString("ipad"),
		/**
		 * iPhone, iPod Touch, iPad 이면 true (애플 모바일 OS)
		 */
		ios: isExistAgentString("like mac os x") && isExistAgentString("mobile"),
		/**
		 * iPhone, iPod Touch, iPad 의 iOS 버전
		 */
		ios_ver: (isExistAgentString("like mac os x") && isExistAgentString("mobile")) ? parseFloat(txua.replace(/^.*os (\d+)([_\d]*) .*$/g, "$1.$2").replace(/_/g, "")) : 0,
		/**
		 * Android 이면 true
		 */
		android: isExistAgentString("android"),
		/**
		 * Android OS 버전
		 */
		android_ver: isExistAgentString("android") ? parseFloat(txua.replace(/.*android[\s]*([\d\.]+).*/g, "$1")) : 0,
		/**
		 *  BlackBerry 이면 true
		 */
		blackberry: isExistAgentString("blackberry"),
		/**
		 *  Windows Phone OS 이면 true
		 */
		winphone: isExistAgentString("windows phone os"),
		/**
		 *  Windows CE 이면 true
		 */
		wince: isExistAgentString("windows ce")
	});

    Object.extend($tx, /** @lends $tx */{
        //msie11above: (isExistAgentString("trident") && isExistAgentStringByRegx(/rv:\d+\.\d+/)),//@Deprecated $tx.msie11above
        msie_std: ($tx.msie && !_DOC.selection),
        msie_nonstd: ($tx.msie && !!_DOC.selection),
        msie6: ($tx.msie && 6 <= $tx.msie_ver && $tx.msie_ver < 7),
        msie8under: ($tx.msie && $tx.msie_ver <= 8),
        msie10under: ($tx.msie && $tx.msie_ver <= 10),
        msie_quirks: (function(){
            try {
                return $tx.msie && _WIN.top.document.compatMode !== 'CSS1Compat'
            } catch(e) {
                try {
                    return _DOC.compatMode !== 'CSS1Compat'
                } catch(e) {
                    return _FALSE;
                }
            }
        })()
    });

	Object.extend($tx, /** @lends $tx */{
		extend: Object.extend,
		/**
		 * browser의 이름 리턴
		 * @function
		 */
		browser: function() {
			if($tx.msie) {
				return 'msie';
			} else if($tx.gecko) {
				return 'firefox';
			} else if($tx.chrome) {
				return 'chrome';
			} else if($tx.webkit) {
				return 'safari';
			} else if($tx.opera) {
				return 'opera';
			} else {
				return "";
			}
		}()
	});
	
	/**
	 * @function
	 */
	_WIN.$must = function(id, className) {
		var _el = $tx(id);
		if (!_el) {
			throw new Error("[Exception] " + className + ": cannot find element: id='" + id + "'");
		}
		return _el;
	};
	
	//expose
	_WIN.txlib = txlib;
})();

(function() {
	/**
	 * template
	 * @deprecated
	(function() {
		window.Template = Class.create();
		Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\}|#%7B(.*?)%7D)/;
		Template.prototype = {
			initialize: function(template, pattern) {
				this.template = template.toString();
				this.pattern = pattern || Template.Pattern;
			},
			evaluate: function(object) {
				return this.template.gsub(this.pattern, function(match) {
					var before = match[1];
					if (before == '\\')
						return match[2];
					return before + String.interpret(object[match[3] || match[4]]);
				});
			}
		};
	})();
	*/

	$tx.extend($tx, /** @lends $tx */{
		/**
		 * 주어진 element와 관련된 CSS 클래스명을 표시하는 Element.ClassNames 객체를 반환
		 * @function
		 */
		classNames: function(el) {
			return el.className.split(' ');
		},
		/**
		 * 요소가 class명중에 하나로 주어진 class명을 가진다면 true를 반환
		 * @function
		 */
		hasClassName: function(el, className) {
            if (className && el.className) {
                var classNames = el.className.split(/\s+/);
                return classNames.contains(className);
            }
            return _FALSE;
        },
		/**
		 * 주어진 class명을 요소의 class명으로 추가
		 * @function
		 */
		addClassName: function(el, c) {
			if (!this.hasClassName(el, c)) {
				el.className += ' ' + c;
            }
		},
		/**
		 * 요소의 class명으로 부터 주어진 class명을 제거
		 * @function
		 */
		removeClassName: function(el, className) {
			var classNames = el.className.split(/\s+/);
            el.className = classNames.without(className)
                                     .compact()
                                     .join(' ');
		},
		/**
		 * 요소가 눈에 보이는지 표시하는 Boolean값을 반환
		 * @function
		 */
		visible: function(element) {
			//return $tx(element).style.display != 'none';
			return $tx.getStyle(element, "display" ) != 'none';
		},
		/**
		 * 각각의 전달된 요소의 가시성(visibility)을 토글(toggle)한다.
		 * @function
		 */
		toggle: function(element) {
			element = $tx(element);
			$tx[$tx.visible(element) ? 'hide' : 'show'](element);
			return element;
		},
		/**
		 * style.display를 'block'로 셋팅하여 각각의 요소를 보여준다.
		 * @function
		 */
		show: function(element) {
			$tx(element).style.display = 'block';
			return element;
		},
		/**
		 * style.display를 'none'로 셋팅하여 각각의 요소를 숨긴다.
		 * @function
		 */
		hide: function(element) {
			$tx(element).style.display = 'none';
			return element;
		}
	});
})();

$tx.extend($tx, /** @lends $tx */{
    /**
     * 인자로 넘겨 받은 Element의 style 속성값을 리턴한다.
     * @function
     * @param {HTMLElement} element
     * @param {string} style property name
     */
    getStyle: function(element, style) {
        element = $tx(element);
        style = style == 'float' ? 'cssFloat' : style.camelize();
        var value = element.style[style];
        if (!value) {
            var css = _DOC.defaultView.getComputedStyle(element, _NULL);
            value = css ? css[style] : _NULL;
        }
        if (style == 'opacity')
            return value ? parseFloat(value) : 1.0;
        return value == 'auto' ? _NULL : value;
    },

    /**
     * 요소의 style 속성을 셋팅한다.
     * @function
     */
    setStyle: function(element, styles, camelized) {
        element = $tx(element);
        var elementStyle = element.style;
        for (var property in styles) {
            if (styles.hasOwnProperty(property)) {
                if (property === 'opacity') {
                    $tx.setOpacity(element, styles[property]);
                } else {
                    // TODO What the...
                    elementStyle[(property === 'float' || property === 'cssFloat') ? (elementStyle.styleFloat === _UNDEFINED ? 'cssFloat' : 'styleFloat') : (camelized ? property : property.camelize())] = styles[property];
                }
            }
        }
        // TODO is it necessary?
        return element;
    },

    setStyleProperty: function(element, styles) {
        var isCamelizedPropertyName = _TRUE;
        this.setStyle(element, styles, isCamelizedPropertyName);
    },

    /**
     * 요소의 style속성 중 opacity 값을 리턴한다.
     * @function
     */
    getOpacity: function(element) {
        return $tx(element).getStyle('opacity');
    },

    /**
     * 요소의 opacity style 속성을 셋팅한다.
     * @function
     */
    setOpacity: function(element, value) {
        element = $tx(element);
        element.style.opacity = (value == 1 || value === '') ? '' : (value < 0.00001) ? 0 : value;
        return element;
    },

    applyCSSText: function(targetDocument, cssText) {
        var styleElement = targetDocument.createElement('style');
        styleElement.setAttribute("type", "text/css");
        if (styleElement.styleSheet) { // IE
            styleElement.styleSheet.cssText = cssText;
        } else { // the other
            styleElement.textContent = cssText;
        }
        targetDocument.getElementsByTagName('head')[0].appendChild(styleElement);
    }

});
(function() {

	if ($tx.msie8under) {
        $tx.getStyle = function (element, style) {
            element = $tx(element);
            style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
            var value = element.style[style];
            if (!value && element.currentStyle)
                value = element.currentStyle[style];
            if (style == 'opacity') {
                if (value = ($tx.getStyle(element, 'filter') || '').match(/alpha\(opacity=(.*)\)/))
                    if (value[1])
                        return parseFloat(value[1]) / 100;
                return 1.0;
            }
            if (value == 'auto') {
                if ((style == 'width' || style == 'height') && ($tx.getStyle(element, 'display') != 'none')) {
                    return element['offset' + style.capitalize()] + 'px';
                }
                return _NULL;
            }
            return value;
        };
    }

    if ($tx.msie8under) {
        $tx.setOpacity = function (element, value) {
            element = $tx(element);
            var filter = $tx.getStyle(element, 'filter'), style = element.style;
            if (value == 1 || value === '') {
                style.filter = filter.replace(/alpha\([^\)]*\)/gi, '');
                return element;
            } else if (value < 0.00001)
                value = 0;
            style.filter = filter.replace(/alpha\([^\)]*\)/gi, '') +
                    'alpha(opacity=' +
                    (value * 100) +
                    ')';
            return element;
        };
    }

    if ($tx.gecko) {
		$tx.extend($tx, {
			setOpacity: function(element, value) {
				element = $tx(element);
				element.style.opacity = (value == 1) ? 0.999999 : (value === '') ? '' : (value < 0.00001) ? 0 : value;
				return element;
			}
		});
	}


    // json2.js helper functions
    $tx.JSONHelper = {
        /**
         * JSON.stringify 시에 문자열을 encodeURIComponent 처리 하여준다.
         * @example JSON.stringify(object, $tx.JSONHelper.encodeURIComponentReplacer);
         */
        encodeURIComponentReplacer: function (key, value) {
            if (typeof value === 'string') {
                if (!isStringifiedArray(value)) {
                    return encodeURIComponent(value);
                }
            }
            return value;
        },
        /**
         * JSON.parse 시에 문자열을 decodeURIComponent 처리 하여준다.
         * @example JSON.parse(object, $tx.JSONHelper.decodeURIComponentReviver);
         */
        decodeURIComponentReviver: function (key, value) {
            if (typeof value === 'string') {
                if (!isStringifiedArray(value)) {
                    return decodeURIComponent(value);
                } else {
                    // "{ \"string\": \"[1,2,3]\" }" 의 경우 => { "string": [1, 2, 3] } 으로 파싱된다.
                    // WHY???
                    try {
                        // "[말머리]" 와 같은 값은 파싱 중 오류가 발생한다. 이런 경우는 무시하고 value를 그대로 반환하도록 한다. #FTDUEDTR-1432
                        return JSON.parse(value, arguments.callee);
                    } catch(ignore) {}
                }
            }
            return value;
        }
    };

    // 이 문자열이 "[1, 3, 4]" 와 같이 배열을 Stringify 한 것인지 확인한다
    var isStringifiedArray = function (str) {
        if (str.charAt(0) == "[" && str.charAt(str.length - 1) == "]") {
            try{
                JSON.parse(str);
                return true;
            }catch (ignore) {}
        }
        return false;
    };
})();

//position
(function() {
	$tx.extend($tx, /** @lends $tx */ {
		/**
		 * 요소의 최상위 요소까지의 offset position 을 더한 값을 리턴한다.
		 * @function
		 */
		cumulativeOffset: function(element) {
			var valueT = 0, valueL = 0;
			do {
				valueT += element.offsetTop || 0;
				valueL += element.offsetLeft || 0;
				element = element.offsetParent;
			} while (element);
			return [valueL, valueT];
		},
		/**
		 * 요소의 최상위 요소까지의 offset position 을 더한 값을 리턴한다.
		 * 상위 요소가 body이거나 position이 relative 또는 absolute 인 경우 계산을 중지한다.
		 * @function
		 */
		positionedOffset: function(element) {
			var valueT = 0, valueL = 0;
			do {
				valueT += element.offsetTop || 0;
				valueL += element.offsetLeft || 0;
				element = element.offsetParent;
				if (element) {
					if (element.tagName == 'BODY') 
						break;
					var p = $tx.getStyle(element, 'position');
					if (p == 'relative' || p == 'absolute') 
						break;
				}
			} while (element);
			return [valueL, valueT];
		},
		/**
		 * element의 면적(dimensions)을 반환. 반환된 값은 두개의 프라퍼티(height 와 width)를 가지는 객체이다. 
		 * @function
		 */
		getDimensions: function(element) {
		    var display = $tx.getStyle(element, 'display');
		    if (display != 'none' && display != _NULL) // Safari bug
		      return {width: element.offsetWidth, height: element.offsetHeight};
		
		    // All *Width and *Height properties give 0 on elements with display none,
		    // so enable the element temporarily
		    var els = element.style;
		    var originalVisibility = els.visibility;
		    var originalPosition = els.position;
		    var originalDisplay = els.display;
		    els.visibility = 'hidden';
		    els.position = 'absolute';
		    els.display = 'block';
		    var originalWidth = element.clientWidth;
		    var originalHeight = element.clientHeight;
		    els.display = originalDisplay;
		    els.position = originalPosition;
		    els.visibility = originalVisibility;
		    return {width: originalWidth, height: originalHeight};
		},
	 
	   /**
	   * 요소의 최상위 요소까지의 offset position 을 더한 값을 리턴한다.
	   * 상위 요소가 body이거나 position이 relative 또는 absolute 인 경우 계산을 중지한다.
	   * left, top, right, bottom 값을 리턴한다.
	   * @function
	   */ 
		getCoords : function(e, useOffset) {
			var uo = useOffset || false;
			var	w = e.offsetWidth;
			var	h = e.offsetHeight;
			var	coords = { "left": 0, "top": 0, "right": 0, "bottom": 0 };
			var	p;
			while(e){
				coords.left += e.offsetLeft || 0;
				coords.top += e.offsetTop || 0;
				e = e.offsetParent;
				if(uo){
					if(e){
						if(e.tagName == "BODY"){break;}
						p = $tx.getStyle(e, "position");
						if(p !== "static"){break;}
					}
				}
			}
			coords.right = coords.left + w;
			coords.bottom = coords.top + h;
			return coords;
		},
	 
		getCoordsTarget: function(element){
			return this.getCoords(element, _TRUE);
		},
        /**
         * 향상된 getCoord Jquery 참고
         */
        getOffset: function(node){
            var doc = node.ownerDocument;
            if ("getBoundingClientRect" in doc.documentElement) {
                var docElem = doc.documentElement;
                var win = doc.defaultView || doc.parentWindow;
                var box = node.getBoundingClientRect();
                var ot = (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop||0);
                var or = (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft||0);
                return {
                    'top': box.top + ot,
                    'bottom': box.bottom + ot,
                    'left': box.left + or,
                    'right': box.right + or
                }
            }else {
                return $tx.getCoordsTarget(node);
            }
        }
	 
	});


	
	// Safari returns margins on body which is incorrect if the child is absolutely
	// positioned.  For performance reasons, redefine Position.cumulativeOffset for
	// KHTML/WebKit only.
	if ($tx.webkit) {
		$tx.cumulativeOffset = function(element) {
			var valueT = 0, valueL = 0;
			do {
				valueT += element.offsetTop || 0;
				valueL += element.offsetLeft || 0;
				if (element.offsetParent == _DOC.body) 
					if ($tx.getStyle(element, 'position') == 'absolute') 
						break;
				element = element.offsetParent;
			} while (element);
			return [valueL, valueT];
		};
	}
	
})();

//events
(function () /** @lends $tx */ {
	$tx.extend($tx, {
		/** @field backspace key */
		KEY_BACKSPACE: 8,
		/** @field tab key */
		KEY_TAB: 9,
		/** @field return key */
		KEY_RETURN: 13,
		/** @field esc key */
		KEY_ESC: 27,
		/** @field left key */
		KEY_LEFT: 37,
		/** @field up key */
		KEY_UP: 38,
		/** @field right key */
		KEY_RIGHT: 39,
		/** @field down key */
		KEY_DOWN: 40,
		/** @field delete key */
		KEY_DELETE: 46,
		/** @field home key */
		KEY_HOME: 36,
		/** @field end key */
		KEY_END: 35,
		/** @field pageup key */
		KEY_PAGEUP: 33,
		/** @field pagedown key */
		KEY_PAGEDOWN: 34,
		/**
		 * 이벤트의 target 또는 srcElement 를 반환
		 * @function
		 */
		element: function(event) {
			return $tx(event.target || event.srcElement);
		},
		/**
		 * 마우스 왼쪽 버튼을 클릭시 true값 반환
		 * @function
		 */
		isLeftClick: function(event) {
			return (((event.which) && (event.which == 1)) ||
			((event.button) && (event.button == 1)));
		},
		/**
		 * 페이지에서 마우스 포인터의 x측 좌표값 반환
		 * @function
		 */
		pointerX: function(event) {
            var eventDoc = $tx.element(event).ownerDocument||_DOC;
            var doc = eventDoc.documentElement;
            var body = eventDoc.body;
            return event.pageX || (event.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 ));
		},
		/**
		 * 페이지에서 마우스 포인터의 y측 좌표값 반환
		 * @function
		 */
		pointerY: function(event) {
            var eventDoc = $tx.element(event).ownerDocument||_DOC;
            var doc = eventDoc.documentElement;
            var body = eventDoc.body;
            return event.pageY || (event.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 ));
		},
		/**
		 * 이벤트의 디폴트 행위를 취소하고 위임을 연기하기 위해 이 함수를 사용
		 * @function
		 */
		stop: function(event){
			this.stopPropagation(event);
			this.preventDefault(event);
		},
		/**
		 * 이벤트의 버블링을 막을 때 이 함수를 사용
		 * @function
		 */
		stopPropagation: function(event) {
			if(event.stopPropagation){
				event.stopPropagation();
			}else {
				event.cancelBubble = _TRUE;
			}
		},
		/**
		 * 이벤트 디폴트 실행 방지를 위해 이 함수를 사용
		 * @function
		 */
		preventDefault: function(event){
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue = _FALSE;
			}
		},
		/**
		 * 이벤트가 시작된 노드로부터 상위로 순회하며 주어진 태그이름을 갖는 첫번째 노드를 찾는다.
		 * find the first node with the given tagName, starting from the
		 * node the event was triggered on; traverses the DOM upwards
		 * @function
		 */
		findElement: function(event, tagName) {
			var element = $tx.element(event);
			while (element.parentNode &&  
			(!element.tagName || !element.tagName.toUpperCase ||
			(element.tagName.toUpperCase() != tagName.toUpperCase()))) 
				element = element.parentNode;
			return element;
		},
		observers: _FALSE,
		_observeAndCache: function(element, name, observer, useCapture) {
			if (!this.observers) 
				this.observers = [];
			if (($tx.msie_ver >= 11||name!='resizestart' && name!='resizeend') && element.addEventListener) {
				this.observers.push([element, name, observer, useCapture]);
				element.addEventListener(name, observer, useCapture);
			} else if (element.attachEvent) {
				this.observers.push([element, name, observer, useCapture]);
				element.attachEvent('on' + name, observer);
			}
		},

        simulateEvent: function(elem, eventName, event) {
            var observers = $tx.observers;
            if (!observers) {
				return;
            }
			for (var i = 0, length = observers.length; i < length; i++) {
                var observer = observers[i];
                if (observer && observer[1] === eventName && observer[0] === elem) {
//                if (observer && observer[1] === eventName && $tom.include(observer[0], elem)) {
                    observer[2](event);
                }
			}
        },

		unloadCache: function() {
			if (!$tx.observers) 
				return;
			for (var i = 0, length = $tx.observers.length; i < length; i++) {
				$tx.stopObserving.apply(this, $tx.observers[i]);
				$tx.observers[i][0] = _NULL;
			}
			$tx.observers = _FALSE;
		},
		/**
		 * 이벤트를 위한 이벤트 핸들러 함수를 추가
		 * @function
		 * @param {Object} element 요소객체 또는 아이디
		 * @param {String} name 이벤트 명
		 * @param {Function} observer 이벤트를 다루는 함수
		 * @param {Boolean} useCapture true라면, capture내 이벤트를 다루고 false라면 bubbling 내 이벤트를 다룬다.
		 */
		observe: function(element, name, observer, useCapture) {
			element = $tx(element);
			useCapture = useCapture || _FALSE;
			if (name == 'keypress' /*&& ($tx.webkit || element.attachEvent)*/) {
				name = 'keydown';
			}
			$tx._observeAndCache(element, name, observer, useCapture);
		},
		/**
		 * 이벤트로부터 이벤트 핸들러를 제거
		 * @function
		 * @param {Object} element 요소객체 또는 아이디
		 * @param {String} name 이벤트 명
		 * @param {Function} observer 이벤트를 다루는 함수
		 * @param {Boolean} useCapture true라면, capture내 이벤트를 다루고 false라면 bubbling 내 이벤트를 다룬다.
		 */
		stopObserving: function(element, name, observer, useCapture) {
			element = $tx(element);
			useCapture = useCapture || _FALSE;
			if (name == 'keypress' /*&&
			($tx.webkit || element.attachEvent)*/)
				name = 'keydown';
			if (element.removeEventListener) {
				element.removeEventListener(name, observer, useCapture);
			} else if (element.detachEvent) {
				try {
					element.detachEvent('on' + name, observer);
				} catch (e) {
				}
			}
		}
	});
	//  prevent memory leaks in IE 
	if ($tx.msie) {
		$tx.observe(window, 'unload', $tx.unloadCache, _FALSE);
	}
})();

(function()  {
	$tx.extend(Object, /** @lends Object */ {
		/**
		 * object 를 복사
		 * @function
		 */
		clone: function(object) {
			return Object.extend({}, object);
		}
	});
	
	$tx.extend($tx, {
		isPrimitiveType: function(data) {
			var primitiveTypes = new $tx.Set("string", "number", "boolean", "date", "function");
			return primitiveTypes.contains(typeof data);
		},
		deepcopy: function(preset, service) {
			var _dest = preset;
			if(!service) {
				return _dest;
			}
			for(var _name in service) {
				switch(typeof(service[_name])) {
					case 'string':
					case 'number':
					case 'boolean': 
					case 'date':
					case 'function':
						_dest[_name] = service[_name];
						break;
					default:
						if (service[_name]) {
							if (service[_name].constructor == Array) {
								_dest[_name] = [].concat(service[_name]);
							} else {
								_dest[_name] = _dest[_name] || {};
								this.deepcopy(_dest[_name], service[_name]);
							}
						} else {
							_dest[_name] = _NULL;
						}
						break;
				}
			}
			return _dest;
		},
		defaults: function(dest, source){
			for(var name in source){
				if(dest[name] === _UNDEFINED){
					dest[name] = source[name];
				}
			}
		}
	});
})();

(function () {
	$tx.extend(String, /** @lends String */{
		/**
		 * value 를 문자열로 만들어 반환한다. value 가 null 이면 빈문자열을 반환한다.
		 * @function
		 */
		interpret: function(value) {
			return value == _NULL ? '' : String(value);
		},
		/**
		 * @field
		 */
		specialChar: {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'\\': '\\\\'
		}
	});
	$tx.extend(String.prototype, /** @lends String.prototype */{
		/**
		 * 현재 문자열에서 패턴 문자열을 찾은 결과의 문자열을 반환하고 대체 문자열이나 패턴에 일치하는 문자열을 가진 배열을 전달하는 대체함수를 호출한 결과로 대체한다. 
		 * 대체물이 문자열일때, #{n}과 같은 특별한 템플릿 형태의 토큰을 포함할수 있다. 
		 * 여기서 n이라는 값은 정규표현식 그룹의 인덱스이다.
		 * #{0}는 완전히 일치하면 대체될것이고 #{1}는 첫번째 그룹, #{2}는 두번째이다.
		 * @function
		 */
		gsub: function(pattern, replacement) {
			var result = '', source = this, match;
			replacement = arguments.callee.prepareReplacement(replacement);
			while (source.length > 0) {
				if (match = source.match(pattern)) {
					result += source.slice(0, match.index);
					result += String.interpret(replacement(match));
					source = source.slice(match.index + match[0].length);
				} else {
					result += source, source = '';
				}
			}
			return result;
		},
		/**
		 * 문자열 앞,뒤의 공백을 제거
		 * @function
		 */
		strip: function() {
			return this.replace(/^\s+/, '').replace(/\s+$/, '');
		},
		/**
		 * 문자열 중 태그 <tag> 를 삭제
		 * @function
		 */
		stripTags: function() {
			return this.replace(/<\/?[^>]+>/gi, '');
		},
		/**
		 * url query string 을 json 으로 만들어 반환한다. separator 를 & 대신 다른 값을 사용할 수 있다.
		 * @function
		 */
		toQueryParams: function(separator) {
			var match = this.strip().match(/([^?#]*)(#.*)?$/);
		    if (!match) return {};
		
			var _hash = {};
			var _lastkey = _NULL;
		    match[1].split(separator || '&').each(function(pair) {
				var _key = _NULL, _value = _NULL;
				var _matches = pair.match(/([\w_]+)=(.*)/);
				if(_matches) {
					_lastkey = _key = decodeURIComponent(_matches[1]);
					if(_matches[2]) {
						_value = decodeURIComponent(_matches[2]);
					}
				} else if(_lastkey) {
					_key = _lastkey;
					_value = _hash[_key];
					_value += '&' + decodeURIComponent(pair);
				} else {
					return;
				}
				if (_key in _hash) {
					if (_hash[_key].constructor != Array) 
						_hash[_key] = [_hash[_key]];
					_hash[_key].push(_value);
				} else {
					_hash[_key] = _value;
				}
			});
			return _hash;
		},
		/**
		 * 문자열을 배열로 반환한다.
		 * @function
		 */
		toArray: function() {
			return this.split('');
		},
		/**
		 * count 만큼 문자열을 반복하여 이어 붙인다.
		 * @function
		 */
		times: function(count) {
			var result = '';
			for (var i = 0; i < count; i++) 
				result += this;
			return result;
		},
		/**
		 * -(하이픈)으로 분리된 문자열을 camelCaseString으로 변환
		 * @function
		 */
		camelize: function() {
			var parts = this.split('-'), len = parts.length;
			if (len == 1) 
				return parts[0];
			var camelized = this.charAt(0) == '-' ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0];
			for (var i = 1; i < len; i++) 
				camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
			return camelized;
		},
		/**
		 * 첫번째 글자를 대문자로 변환
		 * @function
		 */
		capitalize: function() {
			return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
		},
		/**
		 * 문자열이 주어진 패턴을 포함하면 true
		 * @function
		 */
		include: function(pattern) {
			return this.indexOf(pattern) > -1;
		},
		/**
		 * 빈문자열이면 true
		 * @function
		 */
		empty: function() {
			return this == '';
		},
		/**
		 * 공백문자열이면 true
		 * @function
		 */
		blank: function() {
			return /^\s*$/.test(this);
		}
	});
	String.prototype.gsub.prepareReplacement = function(replacement) {
		if (typeof replacement == 'function') 
			return replacement;
		var template = new Template(replacement);
		return function(match) {
			return template.evaluate(match);
		};
	};
	//////
    if (!String.prototype.trim) {
        /**
         * 문자열 앞,뒤의 공백을 제거
         * @function
         */
        String.prototype.trim = function() {
			return this.replace(/(^\s*)|(\s*$)/g, "");
		}
    }
	$tx.extend(String.prototype, /** @lends String.prototype */{
		/**
		 * 정규표현식에서 사용되는 메타문자를 이스케이프해서 반환한다.
		 * @function
		 */
		getRegExp: function() {
			return this.replace(/\\/g, "\\\\").replace(/\./g, "\\.").replace(/\//g, "\\/").replace(/\?/g, "\\?").replace(/\^/g, "\\^").replace(/\)/g, "\\)").replace(/\(/g, "\\(").replace(/\]/g, "\\]").replace(/\[/g, "\\[").replace(/\$/g, "\\$").replace(/\+/g, "\\+").replace(/\|/g, "\\|").replace(/&/g, "(&|&amp;)");
		},
		/**
		 * 문자열을 정수형으로 반환한다. 숫자가 아닌 문자열은 0
		 * @function
		 */
		toNumber: function() {
			return (isNaN(this) ? 0 : parseInt(this, 10));
		},
		/**
		 * 문자열을 부동소수점 형태로 반환한다. 숫자가 아닌 문자열은 0
		 * @function
		 */
		toFloat: function() {
			return (isNaN(this) ? 0 : parseFloat(this));
		},
		/**
		 * 문자열의 길이를 반환
		 * @function
		 */
		getRealLength: function() {
			var str = this;
			var idx = 0;
			for (var i = 0; i < str.length; i++) {
				idx += (escape(str.charAt(i)).charAt(1) == "u") ? 2 : 1;
			}
			return idx;
		},
		/**
		 * 문자열이 주어진 길이보다 길면 자르고 마지막에 ... 를 붙인다.
		 * @function
		 */
		cutRealLength: function(length) {
			var str = this;
			var idx = 0;
			for (var i = 0; i < str.length; i++) {
				idx += (escape(str.charAt(i)).charAt(1) == "u") ? 2 : 1;
				if (idx > length) {
					return str.substring(0, i - 3).concat("...");
				}
			}
			return str;
		},
		/**
		 * @deprecated
		 */
		getCut: function(length) {
			return this.cutRealLength(length);
		},
		/**
		 * 문자열에 px 가 있으면 잘라내고 반환한다.
		 * @function
		 */
		parsePx: function() {
			if (this == _NULL || this.length == 0) 
				return 0;
			else if (this.indexOf("px") > -1) 
				return this.substring(0, this.indexOf("px")).toNumber();
			else 
				return this.toNumber();
		},
		/**
		 * 문자열에 px 를 붙여서 반환한다.
		 * @function
		 */
		toPx: function() {
			if (this.indexOf("px") > -1) {
				return this + "";
			} else {
				return this + "px";
			}
		},
		/**
		 * 픽셀값으로 사용 가능한 문자열인지 boolean 으로 반환 ( 공백 허용안함 )
		 * @function
		 */
		isPx: function(){
			var str = this;
			if ( str.trim() == "" ){
				return false;
			} else if( str.indexOf("px") != -1 ){
				str = this.parsePx();
			}  
			return !isNaN(str);
		},
        isPercent: function(){
            var str = this.trim();
            return parseInt(str, 10)+'%' === str;
        },
		/**
		 * 바이트를 계산하여 단위를(KB, MB) 붙여서 반환한다.
		 * @function
		 */
		toByteUnit: function() {
			return this.toNumber().toByteUnit();
		},
		/**
		 * 숫자로된 문자열을 천단위로 쉼표(,)를 붙인다.
		 * @function
		 */
		toCurrency: function() {
			var amount = this;
			for (var i = 0; i < Math.floor((amount.length - (1 + i)) / 3); i++) {
				amount = amount.substring(0, amount.length - (4 * i + 3)) + "," + amount.substring(amount.length - (4 * i + 3));
			}
			return amount;
		},
		/**
		 * source를 문자열 끝까지 찾아서 target으로 치환한다. 
		 * @function
		 */
		replaceAll: function(source, target) {
			source = source.replace(new RegExp("(\\W)", "g"), "\\$1");
			target = target.replace(new RegExp("\\$", "g"), "$$$$");
			return this.replace(new RegExp(source, "gm"), target);
		},
        underscore :function () {
        return this.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/-/g, '_')
            .toLowerCase();
        }
	});
})();

(function() {
	/**
	 * @name Number
	 * @class
	 */
	$tx.extend(Number.prototype, /** @lends Number.prototype */{
		/**
		 * 숫자로된 문자열이 주어진 길이보다 짧으면 앞부분에 0 으로 채워넣어서 반환한다.
		 * @function 
		 * @param {Number} length 반환되는 문자열의 최소 길이
		 * @param {Number} radix 표기될 진수. optional. 기본 10진수
		 */
		toPaddedString: function(length, radix) {
			var string = this.toString(radix || 10);
			return '0'.times(length - string.length) + string;
		},
		/**
		 * 
		 * @function
		 */
		toTime: function() {
			return Math.floor(this / 60).toString().toPaddedString(2) + ":" + (this % 60).toString().toPaddedString(2);
		},
		/**
		 * 바이트를 계산하여 단위를(KB, MB) 붙여서 반환한다.
		 * @function
		 */
		toByteUnit: function() {
			var number;
			var units = ['GB', 'MB', 'KB'];
			if (this == 0) {
				return "0" + units[2];
			}
			for (var i = 0; i < units.length; i++) {
				number = this / Math.pow(1024, 3 - i);
				if (number < 1) {
					continue;
				}
				return (Math.round(number * 10) / 10) + units[i];
			}
			return "1" + units[2];
		},
		/**
		 * px를 붙인다.
		 * @function
		 */
		toPx: function() {
			return this.toString() + "px";
		},
		/**
		 * 그대로 반환한다.
		 * @function
		 */
		parsePx: function() {
			return this + 0;
		},
		/**
		 * 숫자형은 무조건 px로 사용 가능하다.
		 */
		isPx: function(){
			return _TRUE;
		},
		/**
		 * 문자열을 정수형으로 반환한다. 숫자가 아닌 문자열은 0
		 * @function
		 */
		toNumber: function() {
			return this + 0;
		},
		/**
		 * 천단위로 쉼표(,)를 붙인다.
		 * @function
		 */
		toCurrency: function() {
			return this.toString().toCurrency();
		},
		/**
		 * 정규표현식에서 사용되는 메타문자를 이스케이프해서 반환한다.
		 * @function
		 */
		getRegExp: function() {
			return this.toString().getRegExp();
		}
	});
})();

(function() {
	$tx.extend(Array.prototype, /** @lends Array.prototype */{
		each: function(iterator) {
            if (_WIN['DEBUG']) {
                for (var i = 0, length = this.length; i < length; i++) {
                    iterator(this[i], i);
                }
            } else {
                try {
                    for (var i = 0, length = this.length; i < length; i++) {
                        iterator(this[i], i);
                    }
                } catch (e) {
                    if (e != $break) {
                        throw e;
                    }
                }
            }

			return this;
		},
        indexOf: function(value) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == value) {
                    return i;
                }
            }
            return -1;
        },
        map: function(f) {
            for (var b = [], i = 0, n = this.length; i < n; ++i) {
                b[i] = f(this[i]);
            }
            return b;
        },
		/**
		 * @deprecated use contains()
		 */
		include: function(object) {
            return this.contains(object);
		},
        contains: function(item) {
            return this.indexOf(item) >= 0;
        },
        /**
		 * 집합의 각각의 요소내 propertyName에 의해 명시된 프라퍼티에 값을 가져가고 Array객체로 결과를 반환한다.
		 * @function
		 */
		pluck: function(property) {
			var results = [];
			this.each(function(value) {
				results.push(value[property]);
			});
			return results;
		},
        /**
         * 배열 내에서 조건을 만족하는 첫번째 요소를 리턴한다.
         * @function
         * @param {function} filterFn 조건 함수. 조건에 만족하는 경우 true 리턴, 아닌 경우 false를 리턴한다.
         * @return {object}
         */
        find: function(filterFn) {
            for (var i = 0, len = this.length; i < len; i++) {
                var value = this[i];
                if (filterFn(value, i)) {
                    return value;
                }
            }
            return _NULL;
        },
        /**
		 * 배열 내에서 조건에 만족하는 요소들을 추출한다.
		 * @function
         * @param {function} filterFn 조건 함수. 조건에 만족하는 경우 true 리턴, 아닌 경우 false를 리턴한다.
         * @return {Array}
		 */
		findAll: function(filterFn) {
			var results = [];
            for (var i = 0, len = this.length; i < len; i++) {
                var value = this[i];
                if (filterFn(value, i)) {
                    results.push(value);
                }
            }
			return results;
		},
        /**
		 * iterator함수를 사용하여 집합의 모든 요소를 조합한다.
		 * 호출된 iterator는 accumulator인자에서 이전 반복의 결과를 전달한다.
		 * 첫번째 반복은 accumulator인자내 initialValue를 가진다. 마지막 결과는 마지막 반환값이다.
		 * @function
		 */
		inject: function(array, iterator) {
            for (var i = 0, len = this.length; i < len; i++) {
                var value = this[i];
                array = iterator(array, value, i);
            }
			return array;
		},
        /**
		 * 인자의 리스트에 포함된 요소를 제외한 배열을 반환. 이 메소드는 배열 자체를 변경하지는 않는다.
		 * @function
		 */
		without: function() {
			var values = $A(arguments);
			return this.findAll(function(value) {
				return !values.include(value);
			});
		},
        /**
		 * 배열의 마지막 요소를 반환한다.
		 * @function
		 */
		last: function() {
			return this[this.length - 1];
		},
        /**
		 * 기복이 없고, 1차원의 배열을 반환한다. 이 함수는 배열이고 반환된 배열내 요소를 포함하는 배열의 각 요소를 찾음으로써 수행된다.
		 * @function
		 */
		flatten: function() {
			return this.inject([], function(array, value) {
				return array.concat(value && value.constructor == Array ? value.flatten() : [value]);
			});
		},
		/**
		 * 배열의 요소가 null 이나 빈문자열이면 제거한다. 
		 * @function
		 */
		compact: function() {
			return this.findAll(function(value) {
				return (value != _NULL) && (value != '');
			});
		},
		/**
		 * 배열의 요소의 값 중 중복되는 값은 제거한다.
		 * @function
		 */
		uniq: function(sorted) {
		    return this.inject([], function(array, value, index) {
				if (0 == index || (sorted ? array.last() != value : !array.contains(value)))
					array.push(value);
				return array;
			});
		},
		/**
		 * 배열의 특정요소값을 추출하여 json객체(map)을 만든다.
		 * @function
		 */
		toMap: function(property) {
			var results = {};
			this.each(function(value) {
				results[value[property]] = value;
			});
			return results;
		}
	});
	/**
	 * @deprecated use Array.prototype.findAll
	 */
	Array.prototype.select = Array.prototype.findAll;
    /**
	 * @deprecated use Array.prototype.find
	 */
	Array.prototype.detect = Array.prototype.find;

	/** 
	 * array like object(length와 index를 이용한 요소 접근이 가능)를 Array object로 변환한다.
	 * @example
	 *  var arrayLikeObject = document.getElementsByTagName('img');
	 *  var arrayObject = $A(arrayLikeObject);
	 */
	_WIN.$A = function(arrayLikeObject) {
		if (!arrayLikeObject) {
            return [];
        }
        if (typeof arrayLikeObject.toArray === "function") {
			return arrayLikeObject.toArray();
		} else {
            var array = [];
            for (var i = 0, len = arrayLikeObject.length; i < len; i++) {
                array.push(arrayLikeObject[i]);
            }
            return array;
        }
    };

    $tx.Set = function (/* comma seperated elements */) {
    	var args = arguments;
        for (var i = 0, len = args.length; i < len; i++) {
            this[args[i]] = _TRUE;
        }
    };
    $tx.Set.prototype.contains = function (element) {
        return element in this;
    };

    $tx.objectToQueryString = function(obj) {
        var queryString = [];
        for (var key in obj) if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (value === _NULL || value === _UNDEFINED) { // 다른 falsy value 들은 값으로 출력되어야 한다.
                value = "";
            }
            queryString.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
        return queryString.join("&");
    };
})();

// crossbrowser
(function() {
	if (typeof(HTMLElement) != _UNDEFINED+'') {
//		HTMLElement.prototype.innerText;
		var hElementProto = HTMLElement.prototype;
		var hElementGrandProto = hElementProto.__proto__ = {
			__proto__: hElementProto.__proto__
		};
		if (HTMLElement.prototype.__defineSetter__) {
			hElementGrandProto.__defineSetter__("innerText", function(sText) {
				this.textContent = sText;
			});
		}
		if (HTMLElement.prototype.__defineGetter__) {
			hElementGrandProto.__defineGetter__("innerText", function() {
				return this.textContent;
			});
		}
	}
	
	if (typeof(XMLDocument) != _UNDEFINED+'') {
		var XMLDoc = XMLDocument;
		if (XMLDoc.prototype.__defineGetter__) {
			XMLDoc.prototype.__defineGetter__("xml", function() {
				return (new XMLSerializer()).serializeToString(this);
			});
		}
	}
	if (typeof(Node) != _UNDEFINED+'') {
		if (Node.prototype && Node.prototype.__defineGetter__) {
			Node.prototype.__defineGetter__("xml", function() {
				return (new XMLSerializer()).serializeToString(this);
			});
		}
	}
	//	Simple Implementation of 
	//		setProperty() and selectNodes() and selectSingleNode() 
	//		for FireFox [Mozilla]
	if (typeof(_DOC.implementation) != _UNDEFINED+'') {
		if (_DOC.implementation.hasFeature("XPath", "3.0")) {
			if (typeof(XMLDoc) != _UNDEFINED+'') {
				XMLDoc.prototype.selectNodes = function(cXPathString, xNode) {
					if (!xNode) {
						xNode = this;
					}
					var defaultNS = this.defaultNS;
					var aItems = this.evaluate(cXPathString, xNode, {
						normalResolver: this.createNSResolver(this.documentElement),
						lookupNamespaceURI: function(prefix) {
							switch (prefix) {
								case "dflt":
									return defaultNS;
								default:
									return this.normalResolver.lookupNamespaceURI(prefix);
							}
						}
					}, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, _NULL);
					var aResult = [];
					for (var i = 0; i < aItems.snapshotLength; i++) {
						aResult[i] = aItems.snapshotItem(i);
					}
					return aResult;
				};
				XMLDoc.prototype.setProperty = function(p, v) {
					if (p == "SelectionNamespaces" && v.indexOf("xmlns:dflt") == 0) {
						this.defaultNS = v.replace(/^.*=\'(.+)\'/, "$1");
					}
				};
				XMLDoc.prototype.defaultNS;
				// prototying the XMLDocument 
				XMLDoc.prototype.selectSingleNode = function(cXPathString, xNode) {
					if (!xNode) {
						xNode = this;
					}
					var xItems = this.selectNodes(cXPathString, xNode);
					if (xItems.length > 0) {
						return xItems[0];
					} else {
						return _NULL;
					}
				};
				XMLDoc.prototype.createNode = function(nNodeType, sNodeName, sNameSpace) {
					if (nNodeType == 1) 
						return this.createElementNS(sNameSpace, sNodeName);
					else //Etc Not Use
 
						return _NULL;
				};
			}
			if (typeof(Element) != _UNDEFINED+'') {
				Element.prototype.selectNodes = function(cXPathString) {
					if (this.ownerDocument.selectNodes) {
						return this.ownerDocument.selectNodes(cXPathString, this);
					} else {
						throw "For XML Elements Only";
					}
				};
				// prototying the Element 
				Element.prototype.selectSingleNode = function(cXPathString) {
					if (this.ownerDocument.selectSingleNode) {
						return this.ownerDocument.selectSingleNode(cXPathString, this);
					} else {
						throw "For XML Elements Only";
					}
				};
				Element.prototype.text;
				var elementProto = Element.prototype;
				var elementGrandProto = elementProto.__proto__ = {
					__proto__: elementProto.__proto__
				};
				if (Element.prototype.__defineSetter__) {
					elementGrandProto.__defineSetter__("text", function(text) {
						this.textContent = text;
					});
				}
				if (Element.prototype.__defineGetter__) {
					elementGrandProto.__defineGetter__("text", function() {
						return this.textContent;
					});
				}
				
				if ( _WIN.origElement ) {
					_WIN.origElement.prototype.selectNodes = Element.prototype.selectNodes;
					_WIN.origElement.prototype.selectSingleNode = Element.prototype.selectSingleNode;
				}
			}
		}
	}
})();


_WIN.$tx = $tx;
/* megascript */
_WIN.tx = {};

function each(a, f) {
    for (var i = 0, l = a.length; i < l; i++) f(a[i]);
}
_WIN.installHyperscript = function(namespace, oDocument) {
	each('a big blockquote br b center code dd dl dt div em font form h1 h2 h3 h4 h5 h6 hr img iframe input i li ol option pre p script select small span strike strong style sub sup table tbody td textarea tr ul u'.split(' '),
	    function(label) {
	        namespace[label]=function(){
	            var tag=oDocument.createElement(label);
	            each(arguments, function(arg){ 
	                if(arg.nodeType) {
						tag.appendChild(arg);
					} else if(typeof arg=='string' || typeof arg=='number') {
						if(label == "textarea") {
							if($tx.msie) {
								tag.value+=arg;	
							} else {
								tag.text+=arg;	
							}
						} else {
							tag.innerHTML+=arg;	
						}
					} else if(typeof arg=='array') {
						for(var i=0; i<arg.length; i++) {
							tag.appendChild(arg[i]);
						}
	                } else {
						for(var attr in arg) {
	                        if(attr=='style') {
								for(var sty in arg[attr]) {
									if((sty == 'float' || sty == 'cssFloat')) {
										tag[attr][tag[attr].styleFloat === _UNDEFINED ? 'cssFloat' : 'styleFloat'] = arg[attr][sty];
									} else {
										tag[attr][sty]=arg[attr][sty];
									}
								}
							} else if(["more", "less", "longDesc"].contains(attr)) {	 	// custom attributes
								if (tag.setAttribute) {
									tag.setAttribute(attr, arg[attr]);					
								}
							} else if (["colSpan", "rowSpan", "cellPadding", "cellSpacing"].contains(attr)) { // nonstandard attributes
								if (tag.setAttribute) {
									tag.setAttribute(attr, arg[attr]);
								}
							} else {
								if (arg[attr]) {
									tag[attr] = arg[attr];
								}
							}
						}
	                }
	            });
	            return tag;
	        };
	    });	
};
installHyperscript(_WIN.tx, _DOC);

/**
 * Template - Very Very Simple Template Engine
 *  similar prototype.js template engine
 *  add syntax > #{for:name:maxCount:cutCount} template #{/for:name}
 *  add syntax > #{if:name sign value} template #{/if:name}
 */
(function(){
	
	function evaluate(data, tpl) {
		if (!data) {
			return '';
		}
		if (tpl.indexOf("\{if:") > -1) {
			tpl = tpl.replace(/#\{if:([_\w]+)([=><!]+)([_'"\-\w]+)\}([\s\S]*?)#\{\/if:\1\}/gm, function(full, start, sign, value, condtpl){
				if (data[start] == _NULL) {
					return full;
				}
				var _condition = _FALSE;
				try {
					sign = ((sign=="=")? "==": sign);
					var _left = "\"" + (data[start] + "").replace(/['"]/g, "") + "\"";
					var _right = "\"" + value.replace(/['"]/g, "") + "\"";
					_condition = txEval("(" + _left + sign + _right + ")");
				}catch(e) { _condition = _FALSE; }
				if(_condition) {
					return evaluate(data, condtpl);
				} else {
					return "";
				}
			});
		}
		if (tpl.indexOf("\{for:") > -1) {
			tpl = tpl.replace(/#\{for:([_\w]+):?(\d*):?(\d*)\}([\s\S]*?)#\{\/for:\1\}/gm, function(full, start, maxCnt, cutCnt, looptpl) {
				if (!data[start] || !data[start].length) {
					return full;
				}
				var _list = data[start];
				var _listTpl = [];
				maxCnt = !!maxCnt? (isNaN(maxCnt)? _list.length: parseInt(maxCnt)): _list.length;
				cutCnt = !!cutCnt? (isNaN(cutCnt)? 0: parseInt(cutCnt)): 0;
				for (var i = 0, len = Math.min(_list.length, maxCnt); i < len; i++) {
					_listTpl.push(evaluate(_list[i], looptpl));
				}
				return _listTpl.join("").substring(cutCnt);
			});
		}
		return tpl.replace(/#\{([_\w]+)\}/g, function(full, name) {
			if(data[name] != _NULL) {
				return data[name];
			} else {
				return full;
			}
		});
	}
	
	var tmp = _WIN.Template = function(template) {
		this.template = template;
	};
	
	tmp.prototype = {
		evaluate : function(data) {
			return evaluate(data, this.template);
		},
		evaluateToDom : function(data, element) {
			if(typeof(element) === 'string') {
				element = _DOC.getElementById(element);
			}
			element.innerHTML = evaluate(data, this.template);
		},
		evaluateAsDom : function(data, context) {
			var _tmpNode = (context || document).createElement('div');
			_tmpNode.innerHTML = evaluate(data, this.template);
			return _tmpNode.firstChild;
		}
	};
	/*
	Template.prototype.evaluate = function(data) {
		return evaluate(data, this.template);
	};
	
	Template.prototype.evaluateToDom = function(data, element) {
		if(typeof(element) === 'string') {
			element = _DOC.getElementById(element);
		}
		element.innerHTML = evaluate(data, this.template);
	};
	
	Template.prototype.evaluateAsDom = function(data, context) {
		var _tmpNode = (context || document).createElement('div');
		_tmpNode.innerHTML = evaluate(data, this.template);
		return _tmpNode.firstChild;
	};
	*/

})();

/**
 * DomGetty - Very Very Simple Dom Selector Engine
 * - id : #
 * - class : .
 * - tag : tagname
 */
(function(){
	var m, el, els;
	var filters = {
		'#': function(cnxt, expr){
			if ((m = /(\S*)#(\S+)/.exec(expr)) !== _NULL) {
				var tag = m[1];
				var id = m[2];
				if(!cnxt.getElementById) { //ie
					cnxt = cnxt.ownerDocument;
				}
				if (el = cnxt.getElementById(id)) {
					if (tag.length < 1 || el.nodeName.toLowerCase() == tag) {
						return [el];
					}
				}
			}
			return [];
		},
		'.': function(cnxt, expr){
			if ((m = /(\S*)\.(\S+)/.exec(expr)) !== _NULL) {
				var tag = ((m[1] === "") ? "*" : m[1]);
				var klass = m[2];
				if ((els = cnxt.getElementsByTagName(tag)).length > 0) {
					var results = [];
					for (var i=0; i<els.length; i++) {
						var el = els[i];
						if ( (new RegExp("(^| )" + klass + "($| )")).test(el.className)) {
							results.push(el);
						}
					}
					return results;
				}
			}
			return [];
		},
		'*': function(cnxt, expr){
			if ((els = cnxt.getElementsByTagName(expr)).length > 0) {
				var results = [];
				for (var i=0; i<els.length; i++) {
					results.push(els[i]);
				}
				return results;
			}
			return [];
		}
	};
	
	var match = function(cnxt, expr) {
        if (cnxt.length < 1) {
            return [];
        }
        var fltr;
        if ((f = /(\.|#)/.exec(expr)) !== _NULL) {
            if (filters[f[1]]) {
                fltr = f[1];
            }
        }
        fltr = fltr || "*";
        var results = [];
        for (var i = 0; i < cnxt.length; i++) {
            results = results.concat(filters[fltr](cnxt[i], expr));
        }
        return results;
    };
	
	var collect = function(cnxt, expr) {
        var els = [cnxt];
        var exprs = expr.split(" ");
        for (var j = 0; j < exprs.length; j++) {
            els = match(els, exprs[j]);
        }
        return els;
    };
	
	var DomGetty = function(context, selector, all) {
		all = !!all;
		if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
			return (all? []: _NULL);
		}
		if ( !selector || typeof selector !== "string" ) {
			return (all? []: _NULL);
		}

		var els;
		var mathes = [];
		var exprs = selector.split(",");
		for (var i = 0; i < exprs.length; i++) {
			els = collect(context, exprs[i]);
			if(els && els.length > 0) {
				mathes = mathes.concat(els);
				if(!all) {
					break;
				}
			}
		}
		if(all) {
			return mathes;
		} else {
			return mathes[0];
		} 
	};
 
	/**
	 * Get Element By Css Selector
	 * 
	 * dGetty(element, selector) or dGetty(selector)
	 * ex)
	 *  dGetty(document, "#wrapper div.article")
	 *  dGetty($tx("#wrapper"), "div.article")
	 *  dGetty("#wrapper div.article") -> default document
	 */
	_WIN.dGetty = function() {
		var args = arguments;
		if(args.length == 1) {
			if(typeof (args[0]) === "string") {
				return DomGetty(_DOC, args[0]);
			}
		} else if(args.length == 2) {
			if(args[0].nodeType && typeof (args[1]) === "string") {
				return DomGetty(args[0], args[1]);
			}
		}
		return _NULL;
	};
	
	/**
	 * Get Element List By Css Selector
	 * 
	 * dGetties(element, selector) or dGetties(selector)
	 * ex)
	 *  dGetties(document, "#wrapper div.article")
	 *  dGetties($tx("#wrapper"), "div.article")
	 *  dGetties("#wrapper div.article") -> default document
	 */
	_WIN.dGetties = function() {
		var args = arguments;
		if(args.length == 1) {
			if(typeof (args[0]) === "string") {
				return DomGetty(_DOC, args[0], _TRUE);
			}
		} else if(args.length == 2) {
			if(args[0].nodeType && typeof (args[1]) === "string") {
				return DomGetty(args[0], args[1], _TRUE);
			}
		}
		return [];
	};
	
})();	

/**
 * DomChecky - Very Very Simple Dom Check Engine By Selector
 * - id : #
 * - class : .
 * - tag : tagname
 */
(function(){
	var m, el, els;
	var filters = {
		'#': function(cnxt, expr){
			if ((m = /(\S*)#(\S+)/.exec(expr)) !== _NULL) {
				var tag = m[1];
				var id = m[2];
				if (tag.length < 1 || cnxt.nodeName.toLowerCase() == tag) {
					if (cnxt.id == id) {
						return _TRUE;
					}
				}
			}
			return _FALSE;
		},
		'.': function(cnxt, expr){
			if ((m = /(\S*)\.(\S+)/.exec(expr)) !== _NULL) {
				var tag = m[1];
				var klass = m[2];
				if (tag.length < 1 || cnxt.nodeName.toLowerCase() == tag) {
					if (cnxt.className.indexOf(klass) > -1) {
						return _TRUE;
					}
				}
			}
			return _FALSE;
		},
		'*': function(cnxt, expr){
			var tag = expr;
			if (cnxt.nodeName.toLowerCase() == tag) {
				return _TRUE;
			}
			return _FALSE;
		}
	};
	
	var check = function(cnxt, expr) {
        var fltr;
        if ((f = /(\.|#)/.exec(expr)) !== _NULL) {
            if (filters[f[1]]) {
                fltr = f[1];
            }
        }
        fltr = fltr || "*";
        return filters[fltr](cnxt, expr);
    };
	
	var DomChecky = function(context, selector) {
		if ( context.nodeType !== 1) {
			return _FALSE;
		}

		var found = _FALSE;
		var exprs = selector.split(",");
		for (var i = 0; i < exprs.length; i++) {
			found = check(context, exprs[i]);
			if(found) {
				break;
			}
		}
		return found;
	};
	
	/**
	 * Check Element By Css Selector
	 * @returns boolean
	 * 
	 * dChecky(element, selector)
	 * ex)
	 *  dChecky(document, "#wrapper")
	 */
	_WIN.dChecky = function() {
		var args = arguments;
		if(args.length == 2) {
			if(args[0].nodeType && typeof (args[1]) === "string") {
				return DomChecky(args[0], args[1]);
			}
		}
		return _FALSE;
	};

})();

/**
 * XMLGetty - Very Very Simple XML Dom Selector Engine By XPath
 * - xpath
 */
(function(){
	
	var XMLGetty = function(node){
		this.selectSingleNode = function(path) {
			if(!node) {
				return _NULL;
			}
			return node.selectSingleNode(path);
		};
		this.selectNodes = function(path) {
			if(!node) {
				return [];
			}
			return node.selectNodes(path);
		};
		this.getAttributeNode = function(name) {
			if(!node) {
				return _NULL;
			}
			return node.getAttributeNode(name);
		};
		this.hasChildNodes = function() {
			if(!node) {
				return _FALSE;
			}
			return node.hasChildNodes();
		};
		this.text = node? (node.textContent || node.text) : _NULL;
		this.type = node? node.nodeType : 0;
		this.name = (node && node.nodeType == 1)? (node.nodeName || "") : "";
		return this;
	};
	
	XMLGetty.prototype = {
		'getValueOrDefault': function(val, defval) {
			if (val === "") {
				return defval;
			} else {
				if (typeof(defval) === 'number') {
					return (isNaN(val) ? 0 : parseInt(val));
				} else if (typeof(defval) === 'boolean') {
					return !!val;
				} else {
					return val;
				}
			}
		},
			
		'xText': function(defval){
			defval = defval || "";
			var val = this.text;
			val = (val || "").trim();
			
			return this.getValueOrDefault(val, defval);
		},
		'xAttr': function(name, defval){
			defval = defval || "";
			var attr = this.getAttributeNode(name);
			var val = (!attr) ? "" : attr.nodeValue.trim();

			return this.getValueOrDefault(val, defval);
		},
		'xGet': function(path){
			return xGetty(this, path);
		},
		'xGets': function(path){
			return xGetties(this, path);
		}
	};
	
	var ieXmlParsers = [
		"MSXML2.DOMDocument.6.0",
		"MSXML2.DOMDocument.5.0",
		"MSXML2.DOMDocument.4.0",
		"MSXML4.DOMDocument",
		"MSXML3.DOMDocument",
		"MSXML2.DOMDocument",
		"MSXML.DOMDocument",
		"Microsoft.XmlDom"
	];
	/**
	 * xCreate : Get XML DOM From XML Text
	 * @example
	 * var _xmlDoc = xCreate("<data><name>hopeserver</name></data>");
	 * 
	 * @param {string} text - responseText
	 * @return node 
	 * 			extend function as xText, xAttr, xGet, xGets
	 */
	_WIN.xCreate = function(text) {
		if($tx.msie) {
			var xObj = (function() {
				var _xObj = _NULL;
				for(var i=0; i<ieXmlParsers.length; i++) {
					try {
						_xObj = new ActiveXObject(ieXmlParsers[i]);
					} catch (e) {}
					if(_xObj !== _NULL) {
						return _xObj;
					}
				}
				return _NULL;
			})();
			if(xObj === _NULL){
				return _NULL;
			}
			xObj.async = _FALSE;
			xObj.loadXML(text);
			if (xObj.parseError.errorCode !== 0) {
				return _NULL;
			}
			return new XMLGetty(xObj);
		} else {
			var oParser = new DOMParser();
			var xObj = oParser.parseFromString(new String(text), "text/xml");
			return new XMLGetty(xObj);
		}
	};

	/**
	 * xGetty : Get Node By Xpath
	 * @example
	 * var _node = xGetty(node, "/rss/items/title")
	 * 
	 * @param {element} node - node
	 * @param {string} path - xpath expression
	 * 
	 * @return node 
	 * 			node extends function as xText, xAttr, xGet, xGets
	 */
	_WIN.xGetty = function(node, path) {
		if(node === _NULL) {
			return _NULL;
		}
		return new XMLGetty(node.selectSingleNode(path));
	};
	
	/**
	 * xGetties : Get Node List By Xpath
	 * @example
	 * var _nodelist = xGetties(node, "/rss/items/title")
	 * 
	 * @param {element} node - node
	 * @param {string} path - xpath expression
	 * 
	 * @return node array
	 * 			each node extends function as xText, xAttr, xGet, xGets
	 */
	_WIN.xGetties = function(node, path) {
		if(node === _NULL) {
			return [];
		}
		var list = [];
		var nodes = node.selectNodes(path);
		for(var i=0, len=nodes.length; i<len; i++) {
			list.push(new XMLGetty(nodes[i]));
		}
		return list;
	};

})();
/**
 * Rubber - Very Very Simple Popup Resize Function
 */
(function(){

    var targetWindow;
    try {
        targetWindow = top;
    } catch(e) {
        targetWindow = _WIN;
    }

    var getScrollBarSize = function() {
        var scrollDiv = _DOC.createElement('div');
        scrollDiv.style.width = '100px';
        scrollDiv.style.height = '100px';
        scrollDiv.style.overflow = 'scroll';
        scrollDiv.style.position = 'absolute';
        scrollDiv.style.top = '-9999px';

        _DOC.body.appendChild(scrollDiv);

        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        var scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;

        _DOC.body.removeChild(scrollDiv);

        return {
            width: scrollbarWidth,
            height: scrollbarHeight
        }
    };

    var getScreenMargin = function() {
        if(!$tx.msie) {
            return {left: 0, top: 0};
        }
        var prevLeft = (_WIN.screenLeft) ? _WIN.screenLeft : _WIN.screenX;
        var prevTop = (_WIN.screenTop) ? _WIN.screenTop : _WIN.screenY;

        targetWindow.moveTo(0, 0);

        var marginLeft = (_WIN.screenLeft) ? _WIN.screenLeft : _WIN.screenX;
        var marginTop = (_WIN.screenTop) ? _WIN.screenTop : _WIN.screenY;

        targetWindow.moveTo(prevLeft - marginLeft, prevTop - marginTop);

        return {
            left: marginLeft,
            top: marginTop
        }
    };

    var Rubber = function() {
        var _docEl = _DOC.documentElement;
        var _screenHeight = _WIN.screen.availHeight;
        var _screenWidth = _WIN.screen.availWidth;

        var _scrollbarSize = getScrollBarSize();
        var _screenMargin = getScreenMargin();

        this.resize = function(wrapper) {
            if ($tx.msie) {
                _DOC.body.scroll = "no";
            }

            var popLeft = (_WIN.screenLeft) ? _WIN.screenLeft : _WIN.screenX;
            var popTop = (_WIN.screenTop) ? _WIN.screenTop : _WIN.screenY;

            var deltaHeight = 0, deltaWidth = 0;

            //content size
            if (targetWindow.outerHeight === 0) {
                setTimeout(function () {
                    _rubber.resize(wrapper);
                }, 100);
                return;
            }
            else if (targetWindow.outerHeight) {
                deltaWidth = targetWindow.outerWidth - targetWindow.innerWidth;
                deltaHeight = targetWindow.outerHeight - targetWindow.innerHeight;
            }
            else if(_docEl.clientWidth) {
                var fakeOuterWidth = _docEl.clientWidth;
                var fakeOuterHeight = _docEl.clientHeight;

                targetWindow.resizeTo(fakeOuterWidth, fakeOuterHeight);

                var fakeInnerWidth = _docEl.clientWidth;
                var fakeInnerHeight = _docEl.clientHeight;

                deltaWidth = fakeOuterWidth - fakeInnerWidth;
                deltaHeight = fakeOuterHeight - fakeInnerHeight;
            }
            else {
                throw 'browser does not support';
            }

            var contentWidth = wrapper.clientWidth + deltaWidth;
            var contentHeight = wrapper.clientHeight + deltaHeight;

            //scrollbar
            if (contentWidth > _screenWidth) {
                if ($tx.msie) {
                    _DOC.body.scroll = "yes";
                }

                contentWidth = _screenWidth;
                contentHeight += _scrollbarSize.height;
            }

            if(contentHeight > _screenHeight) {
                if ($tx.msie) {
                    _DOC.body.scroll = "yes";
                }
                contentHeight = _screenHeight;
                contentWidth += _scrollbarSize.width;

                if (contentWidth > _screenWidth) {
                    contentWidth = _screenWidth;
                }
            }

            //position
            if (contentWidth + popLeft > _screenWidth) {
                popLeft = 0;

            }
            if (contentHeight + popTop > _screenHeight) {
                popTop = 0;
            }

            targetWindow.moveTo(popLeft - _screenMargin.left, popTop - _screenMargin.top);
            targetWindow.resizeTo(contentWidth, contentHeight);
        };
    };

    var _rubber;
    _WIN.resizeHeight = function(width, wrapper) {
        if(!_rubber) {
            _rubber = new Rubber(0);
        }

        _rubber.resize(wrapper);
    };
})();

/**
 * @fileoverview  
 * Trex 정의
 */

/** @namespace */
var Trex = {
	__WORD_JOINER: "\ufeff",
	__WORD_JOINER_REGEXP: /\ufeff/g,
    __WAITING_IMG_SRC: 'data:image/gif;base64,R0lGODlhEAAQAOUdAOvr69HR0cHBwby8vOzs7PHx8ff397W1tbOzs+Xl5ebm5vDw8PPz88PDw7e3t+3t7dvb2+7u7vX19eTk5OPj4+rq6tbW1unp6bu7u+fn5+jo6N/f3+/v7/7+/ra2ttXV1f39/fz8/Li4uMXFxfb29vLy8vr6+sLCwtPT0/j4+PT09MDAwL+/v7m5ubS0tM7OzsrKytra2tTU1MfHx+Li4tDQ0M/Pz9nZ2b6+vgAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFMAA5ACwAAAAAEAAQAAAGg8CcMAcICAY5QsEwHBYPCMQhl6guGM5GNOqgVhMPbA6y5Xq/kZwkN3Fsu98EJcdYKCo5i7kKwCorVRd4GAg5GVgAfBpxaRtsZwkaiwpfD0NxkYl8QngARF8AdhmeDwl4pngUCQsVHDl2m2iveDkXcZ6YTgS3kAS0RKWxVQ+/TqydrE1BACH5BAkwADkALAAAAAAQABAAAAZ+wJwwJ1kQIgNBgDMcdh6KRILgQSAOn46TIJVSrdZGSMjpeqtgREAoYWi6BFF6xCAJS6ZyYhEIUwxNQgYkFxwBByh2gU0kKRVHi4sgOQuRTRJtJgwSBJElihwMQioqGmw5gEMLKk2AEkSBq4ElQmNNoYG2OVpDuE6Lrzmfp0NBACH5BAUwADkALAAAAAAQABAAAAaFwJwwJ1kQCDlCwTAcMh6KhDQnVSwYTkJ1un1gc5wtdxsh5iqaLbVKyVEWigq4ugZgTyiA9CK/JHIZWCsICCxpVWV/EzkHhAgth1UPQ4OOLXpScmebFA6ELHAZclBycXIULi8VZXCZawplFG05flWlakIVWravCgSaZ1CuksBDFQsAcsfFQQAh+QQJMAA5ACwAAAAAEAAQAAAGQcCccEgsGo/IpHLJzDGaOcKCCUgkAEuFNaFRbq1dJCxX2WKRCFdMmJiiEQjRp1BJwu8y5R3RWNsRBx9+SSsxgzlBACH5BAkwADkALAAAAAAQABAAAAaJwJwwJ1kQCDlCwTAcMh6KhDQnVSwYTkJ1un1gc5wtdxsh5iqaLbVKyTEWigq4ugZglRXpRX5J5DJYAFIAaVVlfhNrURqFVQ9DYhqCgzkzCGdnVQBwGRU0LQiXCRUAORQJCwAcOTChoYplBXIKLq6vUXRCCQ22olUEcroJB66KD8FNCjUrlxWpTUEAIfkEBTAAOQAsAAAAABAAEAAABobAnDAnWRAIOULBMBwyHoqENCdVLBhOQnW6fWBznC13G8nZchXNllql5Bg2xA1cZQOwShwCMdDkLgk5GVgAUgAie3syVDkTbFIaiIkIJ0NiGnp7HiNonRVVAHEuFjlQFVQVAI0JCzYjrKCPZQWnf1unYkMVWrFbBLVoUIaPD8C6CwCnAMhNQQA7',
	__KEY: {
		ENTER: '13',
		DELETE: '46',
		SPACE: '32',
		BACKSPACE: '8',
		TAB: '9',
		PASTE: '86', //+ ctrl
		CUT: '88' //+ ctrl
	},
	__EXCLUDE_IMG : [
		"txc-2image-c", "txc-3image-c", "txc-footnote", "txc-jukebox", "txc-movie", "txc-gallery", "txc-imazing", "txc-map",
		"txc-file",'txc-emo',"tx-entry-embed", "txc-bgm", "txc-pie"
	],
	I: {},
	X: {},
	define: function(destination, properties) {
		return Object.extend(destination, properties);
	},
	available: function(config, name) {
		if(!$tx("tx_" + name)){
			//console.log("Warning: JsObject is existed but element 'tx_" + name + "' is not found.");
			return _FALSE;
		}
		if(!config){
			//console.log("Warning: no config for" + name);
			return _FALSE;
		}
		if(config.use == _FALSE) {
			//console.log("Warning: config.use == _FALSE");
			return _FALSE;
		}
		return _TRUE;
	}
};

//oop
(function(Trex){

	function $$reference($instance) {
		var _$ref = $instance;
		while(_$ref.$reference) {
			_$ref = _$ref.$reference;
		}
		return _$ref;
	}
	
	function $$super($instance) {
		var _$superclass = $instance.constructor.superclass;
		if(_$superclass) {
			var _$initbak = _$superclass.prototype.initialize;
			_$superclass.prototype.initialize = function() {
				this.$reference = $instance;
			}; //fake initialize
			var _$superobj = new _$superclass();
			_$superclass.prototype.initialize = _$initbak;
			
			var _wrapFunc = function(name) {
				if(!_$superobj[name]) return _NULL;
				return function() {
					var _arguments = arguments;
					var _$reference = $$reference($instance);
					var _$superbak = _$reference.$super;
					_$reference.$super = _$superobj.$super;
					var _returns = _$superobj[name].apply(_$reference, _arguments);
					_$reference.$super = _$superbak;
					return _returns;
				};
			};
			
			var _$wrapobj = {};
			for(var _name in _$superobj) {
				if(_name.charAt(0) != '$') {
					if (typeof(_$superobj[_name]) == 'function') {
						_$wrapobj[_name] = _wrapFunc(_name);
					}
				}
			}
			$instance.$super = _$wrapobj;
		}
	}
	
	/**
	 * @namespace
	 * @name Trex.Class
	 */
	Trex.Class = /** @lends Trex.Class */ {
        single: function(properties){
            var _class = function() {
                if(this.constructor._single)
                    return this.constructor._single;
                var _proto = this.constructor.prototype; //NOTE: Cuz properties must not share
                for(var _name in _proto) {
                    if(_proto[_name] && typeof(_proto[_name]) === 'object') {
                        if(_proto[_name].constructor == Array) { //Array
                            this[_name] = [].concat(_proto[_name]);
                        } else {
                            this[_name] = Object.extend({}, _proto[_name]);
                        }
                    }
                }
                $$super(this);
                var _arguments = arguments;
                this.initialize.apply(this, _arguments);
                this.constructor._single = this;
            };
            return Trex.Class.draft(properties, _class);
        },
		/**
		 * creates class 
		 * @param {Object} properties
		 */
		create: function(properties) {
			var _class = function() {
				var _proto = this.constructor.prototype; //NOTE: Cuz properties must not share
				for(var _name in _proto) {
					if(_proto[_name] && typeof(_proto[_name]) === 'object') {
						if(_proto[_name].constructor == Array) { //Array
							this[_name] = [].concat(_proto[_name]);
						} else {
							this[_name] = Object.extend({}, _proto[_name]);
						}
					}
				}
				$$super(this);
				var _arguments = arguments;
				this.initialize.apply(this, _arguments);
			};
			return Trex.Class.draft(properties, _class);
		},
		draft: function(properties, aClass) {
			var _class = aClass ? 
				aClass : 
				function() {
					$$super(this);
				}; 
			
			if(properties.$const) {
				Object.extend(_class, properties.$const);
			}
			
			if(properties.$extend) {
				Object.extend(_class.prototype, properties.$extend.prototype);
				_class.superclass = properties.$extend;
			}
			
			if(properties.$mixins) {
				var sources = $A(properties.$mixins);
				sources.each(function(source) {
					Object.extend(_class.prototype, source);
				});
			}
			for(var _name in properties) {
				if(_name.charAt(0) != '$') {
					_class.prototype[_name] = properties[_name];
				}
			}
			return _class;
		},
		overwrite: function(source, properties) {
            if(source.prototype) {
				Object.extend(source.prototype, properties);
			}
			return source;
		}
	};
	
	/**
	 * @namespace
	 * @name Trex.Faculty, Trex.Mixin
	 */
	Trex.Mixin = Trex.Faculty = /** @lends Trex.Mixin */ {
		/**
		 * Creates  
		 * @param {Object} properties
		 */
		create: function(properties) {
			var _class = {};
			for(var _name in properties) {
				if(properties[_name] && typeof(properties[_name]) === 'object') {
					if(properties[_name].constructor == Array) { //Array
						_class[_name] = [].concat(properties[_name]);
					} else {
						_class[_name] = Object.extend({}, properties[_name]);
					}
				} else {
					_class[_name] = properties[_name];
				}
			}
			return _class;
		},
		toClass: function(properties, initializeFunc) {
			return Trex.Class.create(
				Object.extend({
					initialize: initializeFunc? initializeFunc: function() {}
				}, properties)
			);
		}
	};
})(Trex);

//module
(function(Trex){
	Object.extend(Trex, /** @lends Trex */ {
		installs: [],
		registers: [],
		modules: [],
		modulesX: [],
		/**
		 * Installs component
		 * @param {Object} description
		 * @param {Object} fn
		 */
		install: function(description, fn){
			fn.desc = '[install] ' + description;
			Trex.installs.push(fn);	
		},
		register: function(description, fn){
			fn.desc = '[register] ' + description;
			Trex.registers.push(fn);	
		},
		module: function(description, fn){
			//console.log(' >>> ' + description);
			fn.desc = '[module] ' + description;
			Trex.modules.push(fn);
		},
		moduleX: function(description, fn){
			fn.desc = '[moduleX] ' + description;
			Trex.modulesX.push(fn);
		},
		invoke: function(fns, editor, toolbar, sidebar, canvas, config){
			for(var i=0,len=fns.length; i<len; i++){
				var fn = fns[i];
				fn(editor, toolbar, sidebar, canvas, config);
			}
		},
		invokeInstallation: function(editor, toolbar, sidebar, canvas, config){
			Trex.invoke(Trex.installs, editor, toolbar, sidebar, canvas, config);
		},
		invokeRegisters: function(editor, toolbar, sidebar, canvas, config){
			Trex.invoke(Trex.registers, editor, toolbar, sidebar, canvas, config);
		},
		invokeModules: function(editor, toolbar, sidebar, canvas, config){
			Trex.invoke(Trex.modules, editor, toolbar, sidebar, canvas, config);
		},
		group: function(){},
		groupEnd: function(){}
	});
})(Trex);

_WIN.Trex = Trex;
var textboxOption = function( data, padding, bgcolor, border ){
	return { 
		data: data, 
		style: { 
			padding:padding, backgroundColor:bgcolor, border:border 
		} 
	};
};
Trex.__CONFIG_COMMON = {
	thumbs: {
		options:[
			{color:"#FF0000"}, {color:"#FF5E00"}, {color:"#FFBB00"}, {color:"#FFE400"}, {color:"#ABF200"}, {color:"#1FDA11"}, {color:"#00D8FF"}, {color:"#0055FF"}, {color:"#0900FF"}, {color:"#6600FF"}, {color:"#FF00DD"}, {color:"#FF007F"}, {color:"#000000"}, {color:"#FFFFFF"},
			{color:"#FFD8D8"}, {color:"#FAE0D4"}, {color:"#FAECC5"}, {color:"#FAF4C0"}, {color:"#E4F7BA"}, {color:"#CEFBC9"}, {color:"#D4F4FA"}, {color:"#D9E5FF"}, {color:"#DAD9FF"}, {color:"#E8D9FF"}, {color:"#FFD9FA"}, {color:"#FFD9EC"}, {color:"#F6F6F6"}, {color:"#EAEAEA"},
			{color:"#FFA7A7"}, {color:"#FFC19E"}, {color:"#FFE08C"}, {color:"#FAED7D"}, {color:"#CEF279"}, {color:"#B7F0B1"}, {color:"#B2EBF4"}, {color:"#B2CCFF"}, {color:"#B5B2FF"}, {color:"#D1B2FF"}, {color:"#FFB2F5"}, {color:"#FFB2D9"}, {color:"#D5D5D5"}, {color:"#BDBDBD"},
			{color:"#F15F5F"}, {color:"#F29661"}, {color:"#F2CB61"}, {color:"#E5D85C"}, {color:"#BCE55C"}, {color:"#86E57F"}, {color:"#5CD1E5"}, {color:"#6699FF"}, {color:"#6B66FF"}, {color:"#A366FF"}, {color:"#F261DF"}, {color:"#F261AA"}, {color:"#A6A6A6"}, {color:"#8C8C8C"},
			{color:"#CC3D3D"}, {color:"#CC723D"}, {color:"#CCA63D"}, {color:"#C4B73B"}, {color:"#9FC93C"}, {color:"#47C83E"}, {color:"#3DB7CC"}, {color:"#4174D9"}, {color:"#4641D9"}, {color:"#7E41D9"}, {color:"#D941C5"}, {color:"#D9418D"}, {color:"#747474"}, {color:"#5D5D5D"},
			{color:"#980000"}, {color:"#993800"}, {color:"#997000"}, {color:"#998A00"}, {color:"#6B9900"}, {color:"#2F9D27"}, {color:"#008299"}, {color:"#003399"}, {color:"#050099"}, {color:"#3D0099"}, {color:"#990085"}, {color:"#99004C"}, {color:"#4C4C4C"}, {color:"#353535"},
			{color:"#670000"}, {color:"#662500"}, {color:"#664B00"}, {color:"#665C00"}, {color:"#476600"}, {color:"#22741C"}, {color:"#005766"}, {color:"#002266"}, {color:"#030066"}, {color:"#290066"}, {color:"#660058"}, {color:"#660033"}, {color:"#212121"}, {color:"#000000"}
		],
		transparent: { 
			color: "transparent", 
			border: "#999999", 
			image: "#iconpath/ic_transparent4.gif",
			thumb: "#iconpath/txt_transparent.gif",
			thumbImage:"#iconpath/color_transparent_prev.gif"
		}
	},
	textbox: {
		 options: [
			textboxOption('txc-textbox1', '10px', '#ffffff', '1px solid #f7f7f7'),
			textboxOption('txc-textbox2', '10px', '#eeeeee', '1px solid #eeeeee'),
			textboxOption('txc-textbox3', '10px', '#fefeb8', '1px solid #fefeb8'),
			textboxOption('txc-textbox4', '10px', '#fedec7', '1px solid #fedec7'),
			textboxOption('txc-textbox5', '10px', '#e7fdb5', '1px solid #e7fdb5'),
			textboxOption('txc-textbox6', '10px', '#dbe8fb', '1px solid #dbe8fb'),
			
			textboxOption('txc-textbox7', '10px', '#ffffff', '1px dashed #cbcbcb'),
			textboxOption('txc-textbox8', '10px', '#eeeeee', '1px dashed #c1c1c1'),
			textboxOption('txc-textbox9', '10px', '#fefeb8', '1px dashed #f3c534'),
			textboxOption('txc-textbox10', '10px', '#fedec7', '1px dashed #fe8943'),
			textboxOption('txc-textbox11', '10px', '#e7fdb5', '1px dashed #9fd331'),
			textboxOption('txc-textbox12', '10px', '#dbe8fb', '1px dashed #79a5e4'),
			
			textboxOption('txc-textbox13', '10px', '#ffffff', '1px solid #cbcbcb'),
			textboxOption('txc-textbox14', '10px', '#eeeeee', '1px solid #c1c1c1'),
			textboxOption('txc-textbox15', '10px', '#fefeb8', '1px solid #f3c534'),
			textboxOption('txc-textbox16', '10px', '#fedec7', '1px solid #fe8943'),
			textboxOption('txc-textbox17', '10px', '#e7fdb5', '1px solid #9fd331'),
			textboxOption('txc-textbox18', '10px', '#dbe8fb', '1px solid #79a5e4'),
			
			textboxOption('txc-textbox19', '10px', '#ffffff', '3px double #cbcbcb'),
			textboxOption('txc-textbox20', '10px', '#eeeeee', '3px double #c1c1c1'),
			textboxOption('txc-textbox21', '10px', '#fefeb8', '3px double #f3c534'),
			textboxOption('txc-textbox22', '10px', '#fedec7', '3px double #fe8943'),
			textboxOption('txc-textbox23', '10px', '#e7fdb5', '3px double #9fd331'),
			textboxOption('txc-textbox24', '10px', '#dbe8fb', '3px double #79a5e4')
		]
	}
};

/**
 * 에디터 전반적인 설정을 관리하는 클래스로 각 함수를 static 하게 접근할 수 있다.
 *
 * @class
 */
var TrexConfig = function() {
	//preset < daumx < project < page
	var __IS_SETUP = _FALSE;
	var __POST_PROCESSOR = [];
	var __TREX_PARAM = {};
	var __TREX_CONFIGURE = {
		txHost: '',
		txPath: '/modules/editor/',
		cdnHost: '',
		cmnHost: '',
		wrapper: 'tx_trex_container',
		form: 'tx_editor_form',
		txSkin: 'default',
		txIconPath: '',
		txDecoPath: '',
		initializedId: '',
		params: [],
		events: {
			preventUnload: _TRUE,
			useHotKey: _TRUE
		},
		save: { },	
		adaptor: { },
		toolbar: { },
		sidebar: {
			attachbox: { },
			embeder: { },
			attacher: { },
			searcher: { }
		},
		plugin: { }
	};
	
    var _createAnchors = function() {
        return {
            "Tool": __TREX_CONFIGURE.toolbar,
            "Sidebar": __TREX_CONFIGURE.sidebar,
            "Plugin": __TREX_CONFIGURE.plugin,
            "Adaptor": __TREX_CONFIGURE.adaptor,
            "Save": __TREX_CONFIGURE.save,
            "Attacher": __TREX_CONFIGURE.sidebar.attacher,
            "Embeder": __TREX_CONFIGURE.sidebar.embeder,
            "Searcher": __TREX_CONFIGURE.sidebar.searcher
        };
    };

	var _addParameter = function(tname, pname) {
		if (__IS_SETUP) {
			throw new Error("configure is already setup (addParameter)")
		}
		__TREX_PARAM[tname] = pname;
	};
	
	var _trexConfig = /** @lends TrexConfig */{
		/**
		 * url을 에디터 설정값과 주어진 파라미터 값으로 변환하여 넘겨준다.
		 * @function
		 * @param {String} url - url 
		 * @param {Object} params - 키,값 쌍으로 이루어진 데이터 
		 * @returns {String} 변환된 url
		 * @example 
		 * 		TrexConfig.getUrl("#host#path/pages/trex/image.html?username=#username", {
		 * 			'username': 'daumeditor'
		 * 		});
		 */
		getUrl: function(url, params) {
			if(typeof url !== 'string') { return url; };
			var loader = _WIN['EditorJSLoader'] || opener && opener['EditorJSLoader'] || (PopupUtil && PopupUtil.getOpener()['EditorJSLoader']);
			url = url.replace(/#host#path\/pages\//g, loader.getPageBasePath());
			url = url.replace(/#host/g, __TREX_CONFIGURE["txHost"]);
			url = url.replace(/#path\/?/g, __TREX_CONFIGURE["txPath"]);
			url = url.replace(/#Upload\/?/g, __TREX_CONFIGURE["txUpload"]);
			url = url.replace(/#cdnhost/g, __TREX_CONFIGURE["cdnHost"]);
			url = url.replace(/#cmnhost/g, __TREX_CONFIGURE["cmnHost"]);

			for(var _name in __TREX_PARAM) {
				url = url.replace(new RegExp("#".concat(_name), "g"), __TREX_CONFIGURE[__TREX_PARAM[_name]]);
			}

			if(params) {
				for(var name in params) {
					url = url.replace(new RegExp("#".concat(name), "g"), params[name]);
				}
			}
			
			return url;
		},
		/**
		 * 팝업창을 띄울때 옵션을 문자열로 만들어 넘겨준다.
		 * @function
		 * @param {Object} features - 키,값 쌍으로 이루어진 데이터 
		 * @returns {String} 옵션 문자열
		 * @example 
		 * 		TrexConfig.getPopFeatures({ left:250, top:65, width:797, height:644 });
		 */
		getPopFeatures: function(features) {
			if(features == _NULL) return _NULL;
			if(typeof(features) === "string") { //redefine
				return features;
			}
			var popFeatures = [];
			["toolbar", "location", "directories", "menubar"].each(function(name) {
				popFeatures.push(name + "=" + (features[name] || "no"));	
			});
			["scrollbars", "resizable", "status"].each(function(name) {
				popFeatures.push(name + "=" + (features[name] || "no"));
			});
			["width", "height"].each(function(name) {
				popFeatures.push(name + "=" + (features[name] || "500"));	
			});
			["left", "top"].each(function(name) {
				popFeatures.push(name + "=" + (features[name] || "100"));	
			});
			return popFeatures.join(",");
		},
		/**
		 * 컨텐츠 삽입용 이미지의 상위 url을 넘겨준다. <br/>
		 * txDecoPath 값이 셋팅된 경우는 해당 url을 넘겨준다.
		 * @function
		 * @param {String} url - url 
		 * @param {String} subpath - 하위 디렉터리 (optional)
		 * @returns {String} 변환된 컨텐츠 삽입용 이미지url
		 */
		getDecoPath: function(url) {
			return __TREX_CONFIGURE["txDecoPath"]
				? url.replace(/#decopath\/?/, this.getUrl(__TREX_CONFIGURE["txDecoPath"]))
				: url.replace(/#decopath\/?/, this.getUrl(__TREX_CONFIGURE["txHost"]+__TREX_CONFIGURE["txPath"]+"theme/"+__TREX_CONFIGURE["txSkin"]+"/images/deco/contents/"));
		},
		/**
		 * 에디터에서 사용되는 이미지의 상위 url을 넘겨준다. <br/>
		 * txIconPath 값이 셋팅된 경우는 해당 url을 넘겨준다.
		 * @function
		 * @param {String} url - url 
		 * @param {String} subpath - 하위 디렉터리 (optional)
		 * @returns {String} 에디터에서 사용되는 이미지url
		 */
		getIconPath: function(url) {
			return __TREX_CONFIGURE["txIconPath"]
				? url.replace(/#iconpath\/?/, this.getUrl(__TREX_CONFIGURE["txIconPath"]))
				: url.replace(/#iconpath\/?/, this.getUrl(__TREX_CONFIGURE["txHost"]+__TREX_CONFIGURE["txPath"]+"theme/"+__TREX_CONFIGURE["txSkin"]+"/images/icon/editor/"));
		},
		/**
		 * 에디터 로딩이 완료되면 설정값을 셋업시키는 함수로
		 * postprocessing로 등록된 함수들을 실행하며
		 * 이후에는 설정값을 추가할 수 없다.
		 * @private
		 * @function
		 * @param {Object} config - new Editor() 할 때 입력한 설정값
		 * @returns {Object} 셋업된 설정값
		 */
		setup: function(config) { 
			$tx.deepcopy(__TREX_CONFIGURE, config);
			
			__TREX_CONFIGURE.params.each(function(name) {
				_addParameter(name, name);
			});
			__POST_PROCESSOR.each(function(fn) {
				fn(__TREX_CONFIGURE);
			});
	
			__IS_SETUP = _TRUE;
			
			this.setupVersion();
			return __TREX_CONFIGURE;
		},
		setupVersion: function() {
			// 다른 곳에서 txVersion 을 사용할 수도 있기에 호환을 위해 txVersion 추가
			__TREX_CONFIGURE.txVersion = Editor.version;
		},
		/**
		 * 파라미터를 추가한다.<br/> 
		 * 파라미터란 getUrl 할 때 기본으로 변환할 키,값들을 정의해놓은 데이터
		 * @function
		 * @param {String} tname - url에 포함될 id 
		 * @param {String} pname - 설정값에 존재하는 id
		 * @example
		 * 		TrexConfig.addParameter('host', 'txHost');
		 */
		addParameter: function(tname, pname) {
			_addParameter(tname, pname);
		},
		/**
		 * 주어진 설정값을 deep copy로 복사한다.
		 * @function
		 * @param {Object} config - 주어진 설정값
		 */
		clone: function(config) {
			return $tx.deepcopy({}, config);
		},
		/**
		 * 주어진 설정값에 새로운 설정값들을 deep copy로 복사한다. 
		 * @function
		 * @param {Object} config - 첫번째 인자는 주어진 설정값, 그 이후는 새로운 설정값들
		 * @example 
		 * 		TrexConfig.merge(config, { 'id': 'tx_happy' }, { 'options': [1,2,3] });
		 */
		merge: function() {
			var _config = {};
			$A(arguments).each(function(source) {
				$tx.deepcopy(_config, source);
			});
			return _config;
		}
	};
	
	/**
	 * 주어진 설정값을 root 설정값에 추가한다.
	 * @name add
	 * @memberOf TrexConfig
	 * @function
	 * @param {Object} config - 주어진 설정값
	 * @param {Function} postprocessing - 에디터가 로딩된 후 처리할 함수 (optional)
	 */
	_trexConfig["add"] = function(config, postprocessing) {
		if (__IS_SETUP) {
			throw new Error("configure is already setup (mergeConfig)")
		}
		$tx.deepcopy(__TREX_CONFIGURE, config);
		if(postprocessing) {
			__POST_PROCESSOR.push(postprocessing);
		}
	};
	/**
	 * 주어진 키로 설정값을 리턴한다.
	 * @name get
	 * @memberOf TrexConfig
	 * @function
	 * @param {String} key - 주어진 키
	 */
	_trexConfig["get"] = function(key) {
		return __TREX_CONFIGURE[key];
	};
	
	/**
	 * 주어진 키로 주어진 설정값을 root/toolbar 아래에 추가한다.
	 * @name addTool
	 * @memberOf TrexConfig
	 * @function
	 * @param {String} key - 주어진 키값 
	 * @param {Object} config - 주어진 설정값
	 * @param {Function} postprocessing - 에디터가 로딩된 후 처리할 함수 (optional)
	 */
	/**
	 * 주어진 키로 주어진 설정값을 root/sidebar 아래에 추가한다.
	 * @name addSidebar
	 * @memberOf TrexConfig
	 * @function
	 * @param {String} key - 주어진 키값 
	 * @param {Object} config - 주어진 설정값
	 * @param {Function} postprocessing - 에디터가 로딩된 후 처리할 함수 (optional)
	 */
	/**
	 * 주어진 키로 주어진 설정값을 root/plugin 아래에 추가한다.
	 * @name addPlugin
	 * @memberOf TrexConfig
	 * @function
	 * @param {String} key - 주어진 키값 
	 * @param {Object} config - 주어진 설정값
	 * @param {Function} postprocessing - 에디터가 로딩된 후 처리할 함수 (optional)
	 */
	/**
	 * 주어진 키로 주어진 설정값을 root/adaptor 아래에 추가한다.
	 * @name addAdaptor
	 * @memberOf TrexConfig
	 * @function
	 * @param {String} key - 주어진 키값 
	 * @param {Object} config - 주어진 설정값
	 * @param {Function} postprocessing - 에디터가 로딩된 후 처리할 함수 (optional)
	 */
	/**
	 * 주어진 키로 주어진 설정값을 root/save 아래에 추가한다.
	 * @name addSave
	 * @memberOf TrexConfig
	 * @function
	 * @param {String} key - 주어진 키값 
	 * @param {Object} config - 주어진 설정값
	 * @param {Function} postprocessing - 에디터가 로딩된 후 처리할 함수 (optional)
	 */
	/**
	 * 주어진 키로 주어진 설정값을 root/sidebar/attacher 아래에 추가한다.
	 * @name addAttacher
	 * @memberOf TrexConfig
	 * @function
	 * @param {String} key - 주어진 키값 
	 * @param {Object} config - 주어진 설정값
	 * @param {Function} postprocessing - 에디터가 로딩된 후 처리할 함수 (optional)
	 */
	/**
	 * 주어진 키로 주어진 설정값을 root/sidebar/embeder 아래에 추가한다.
	 * @name addEmbeder
	 * @memberOf TrexConfig
	 * @function
	 * @param {String} key - 주어진 키값 
	 * @param {Object} config - 주어진 설정값
	 * @param {Function} postprocessing - 에디터가 로딩된 후 처리할 함수 (optional)
	 */
	/**
	 * 주어진 키로 주어진 설정값을 root/sidebar/searcher 아래에 추가한다.
	 * @name addSearcher
	 * @memberOf TrexConfig
	 * @function
	 * @param {String} key - 주어진 키값 
	 * @param {Object} config - 주어진 설정값
	 * @param {Function} postprocessing - 에디터가 로딩된 후 처리할 함수 (optional)
	 */
	var _addConfig = function(key, config, postprocessing) {
		if (__IS_SETUP) {
			throw new Error("configure is already setup (mergeConfig)")
		}
		this[key] = this[key] || {};
		$tx.deepcopy(this[key], config);
		if(postprocessing) {
			__POST_PROCESSOR.push(postprocessing);
		}
	};
	
	/**
	 * 주어진 키로 root/toolbar[key]의 설정값을 리턴한다.
	 * @name getTool
	 * @memberOf TrexConfig
	 * @function
	 * @param {String,Object} key - 주어진 키
	 */
	/**
	 * 주어진 키로 root/sidebar[key]의 설정값을 리턴한다.
	 * @name getSidebar
	 * @memberOf TrexConfig
	 * @function
	 * @param {String,Object} key - 주어진 키
	 */
	/**
	 * 주어진 키로 root/adaptor[key]의 설정값을 리턴한다.
	 * @name getAdaptor
	 * @memberOf TrexConfig
	 * @function
	 * @param {String,Object} key - 주어진 키
	 */
	/**
	 * 주어진 키로 root/save[key]의 설정값을 리턴한다.
	 * @name getSave
	 * @memberOf TrexConfig
	 * @function
	 * @param {String,Object} key - 주어진 키
	 */
	/**
	 * 주어진 키로 root/sidebar/attacher[key]의 설정값을 리턴한다.
	 * @name getAttacher
	 * @memberOf TrexConfig
	 * @function
	 * @param {String,Object} key - 주어진 키
	 */
	/**
	 * 주어진 키로 root/sidebar/embeder[key]의 설정값을 리턴한다.
	 * @name getEmbeder
	 * @memberOf TrexConfig
	 * @function
	 * @param {String,Object} key - 주어진 키
	 */
	/**
	 * 주어진 키로 root/sidebar/searcher[key]의 설정값을 리턴한다.
	 * @name getSearcher
	 * @memberOf TrexConfig
	 * @function
	 * @param {String,Object} key - 주어진 키
	 */
	var _getConfig = function(key) {
		return this[key];
	};
	
	var _anchors = _createAnchors();
	for(var _name in _anchors) {
		_trexConfig["add" + _name] = _addConfig.bind(_anchors[_name]);
		_trexConfig["get" + _name] = _getConfig.bind(_anchors[_name]);
	}
	
	return _trexConfig;
	
}();

_WIN.TrexConfig = TrexConfig;
/**
 * @fileoverview  
 * 사용자 정의 이벤트를 미리 정의
 */

(function(Trex) {
	/**
	 *  @namespace 
	 *  @name Trex.Ev
	 */
	Trex.Ev = /** @lends Trex.Ev */ {
		/** wysiwyg mode */
		__EDITOR_PANEL_MOUSEDOWN: 'editor.panel.mousedown',
        /**
         * Editor에 데이터의 셋팅이 시작되면 발생하는 이벤트
         * @example
         * 	editor.observeJob(Trex.Ev.__EDITOR_LOAD_DATA_BEGIN, function(ev) {
		 *	});
         */
        __EDITOR_LOAD_DATA_BEGIN: 'editor.load.data.begin',
        /**
         * Editor에 데이터의 셋팅이 완료되면 발생하는 이벤트
         * @example
         * 	editor.observeJob(Trex.Ev.__EDITOR_LOAD_DATA_END, function(ev) {
		 *	});
         */
        __EDITOR_LOAD_DATA_END: 'editor.load.data.end',
		/**
		 * wysiwyg 영역에 발생하는 keydown 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_KEYDOWN, function(ev) {
		 *	});
		 */
		__CANVAS_PANEL_KEYDOWN: 'canvas.panel.keydown',
		/** 
		 * wysiwyg 영역에 발생하는 keyup 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_KEYUP, function(ev) {
		 *	});
		 */
		__CANVAS_PANEL_KEYUP: 'canvas.panel.keyup',
		/** 
		 * wysiwyg 영역에 발생하는 mousedown 이벤트<br/>
		 * Element Observer 보다 늦게 실행되며, mouseclick 보다 앞서 실행된다.
		 * 경우에 따라 상위 엘리먼트까지 탐색하여 실행하는 Element Observer를 사용한다.
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_MOUSEDOWN, function(ev) {
		 *		//execute function
		 *	});
		 *  canvas.observeElement({ tag: "img", klass: "txc-image" }, function(element) {
		 *		//execute function with element
		 *	});
		 */
		__CANVAS_PANEL_MOUSEDOWN: 'canvas.panel.mousedown',
		/** 
		 * wysiwyg 영역에 발생하는 mouseup 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_MOUSEUP, function(ev) {
		 *	});
		 */
		__CANVAS_PANEL_MOUSEUP: 'canvas.panel.mouseup',
		/** 
		 * wysiwyg 영역에 발생하는 mouseover 이벤트<br/>
		 * wysiwyg 영역에서 마우스를 움직일 때마다 발생하므로 과하게 사용하지 않도록 한다.
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_MOUSEOVER, function(ev) {
		 *	});
		 */
		__CANVAS_PANEL_MOUSEOVER: 'canvas.panel.mouseover',
		/** 
		 * wysiwyg 영역에 발생하는 mouseout 이벤트<br/>
		 * wysiwyg 영역에서 마우스를 움직일 때마다 발생하므로 과하게 사용하지 않도록 한다.
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_MOUSEOUT, function(ev) {
		 *	});
		 */
		__CANVAS_PANEL_MOUSEOUT: 'canvas.panel.mouseout',
        /**
         * wysiwyg 영역에 발생하는 movemove 이벤트<br/>
         * wysiwyg 영역에서 마우스를 움직일 때마다 발생하므로 과하게 사용하지 않도록 한다.
         * @example
         * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_MOUSEMOVE, function(ev) {
		 *	});
         */
        __CANVAS_PANEL_MOUSEMOVE: 'canvas.panel.mousemove',
		/** 
		 * wysiwyg 영역에 발생하는 click 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_CLICK, function(ev) {
		 *	});
		 */
		__CANVAS_PANEL_CLICK: 'canvas.panel.click',
		/** 
		 * wysiwyg 영역에서 발생하는 더블클릭 이벤트<br/>
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_DBLCLICK, function(ev) {
		 *	});
         */
        __CANVAS_PANEL_DBLCLICK: 'canvas.panel.dbclick',
        /**
         * wysiwyg 영역에서 발생하는 dragover 이벤트<br/>
         * @example
         * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_DBLCLICK, function(ev) {
		 *	});
         */
        __CANVAS_PANEL_DRAGOVER: 'canvas.panel.dragover',
        /**
         * wysiwyg 영역에서 발생하는 dragenter 이벤트<br/>
         * @example
         * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_DRAGENTER, function(ev) {
		 *	});
         */
        __CANVAS_PANEL_DRAGENTER: 'canvas.panel.dragenter',
        /**
         * wysiwyg 영역에서 발생하는 dragleave 이벤트<br/>
         * @example
         * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_DRAGLEAVE, function(ev) {
		 *	});
         */
        __CANVAS_PANEL_DRAGLEAVE: 'canvas.panel.dragleave',
        /**
         * wysiwyg 영역에서 발생하는 드롭 이벤트<br/>
         * @example
         * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_DROP, function(ev) {
		 *	});
         */
        __CANVAS_PANEL_DROP: 'canvas.panel.drop',
		/** 
		 * wysiwyg 영역에서 발생하는 붙여넣기 이벤트<br/>
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_PASTE, function() {
		 *	});
		 */
		__CANVAS_PANEL_PASTE: 'canvas.panel.paste',
		/** 
		 * wysiwyg 영역에서 발생하는 스크롤 변경 이벤트<br/>
		 * 이 이벤트는 wysiwyg 영역의 스크롤 높이가 변경되거나 위치가 변경될 경우 발생한다.
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_SCROLLING, function(ev) {
		 *	});
		 */
		__CANVAS_PANEL_SCROLLING: 'canvas.panel.scrolling',
		/** 
		 * wysiwyg 영역이 로드되었을 경우 발생하는 사용자 정의 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__IFRAME_LOAD_COMPLETE, function(ev) {
		 *	});
		 */
		__IFRAME_LOAD_COMPLETE: 'iframe.load.complete',
        /**
         * wysiwyg 영역이 loading 되기까지 걸린시간을 알리는 이벤트
         */
        __IFRAME_LOADING_TIME: 'iframe.loading.time',
		/** 
		 * HTML모드(소스모드) 영역에서 발생하는 click 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_SOURCE_PANEL_CLICK, function(ev) {
		 *	});
		 */
		__CANVAS_SOURCE_PANEL_CLICK: 'canvas.source.panel.click',
		/** 
		 * HTML모드(소스모드) 영역에서 발생하는 keydown 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_SOURCE_PANEL_KEYDOWN, function(ev) {
		 *	});
		 */
		__CANVAS_SOURCE_PANEL_KEYDOWN: 'canvas.source.panel.mousedown',
		/** 
		 * HTML모드(소스모드) 영역에서 발생하는 mousedown 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_SOURCE_PANEL_MOUSEDOWN, function(ev) {
		 *	});
		 */
		__CANVAS_SOURCE_PANEL_MOUSEDOWN: 'canvas.source.panel.mousedown',
		/** 
		 * 텍스트모드 영역에서 발생하는 click 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_TEXT_PANEL_CLICK, function(ev) {
		 *	});
		 */
		__CANVAS_TEXT_PANEL_CLICK: 'canvas.text.panel.click',
		/** 
		 * 모드가 변경될 때 발생하는 사용자 정의 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_MODE_CHANGE, function(from, to) {
		 *		//from - 변경되기 전 모드
		 *		//to - 변경되고난 후 모드
		 *	});
		 */
		__CANVAS_MODE_CHANGE: 'canvas.mode.change',
        /**
         * 전체화면용 canvas로 변경 시 발생
         */
        __CANVAS_FULL_SCREEN_CHANGE: 'canvas.fullscreen.change',
        /**
         * 일반화면용 canvas로 변경 시 발생
         */
        __CANVAS_NORMAL_SCREEN_CHANGE: 'canvas.normalscreen.change',
		/**
		 * 툴바의 버튼이 눌렸을 경우 발생하는 사용자 정의 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__TOOL_CLICK, function(identity) {
		 *		//identity - tool의 Identity(bold, aligncenter...)
		 *	});
		 */
		__TOOL_CLICK: 'toolbar.button.click',
        /**
         * 툴이 단축키에 의해 실행 되었을 경우 발생
         */
        __TOOL_SHORTCUT_KEY: 'toolbar.shortcut',
		/** 
		 * Editor.save()가 호출되었을 경우 발생하는 사용자 정의 이벤트<br/>
		 * 실제 form이 submit이 되기 전에 발생한다.
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__ON_SUBMIT, function(editor) {
		 *		//editor - editor 객체
		 *	});
		 */
		__ON_SUBMIT: "editor.submit",
		/** 
		 * 에디터 래퍼의 너비가 변경된 후 발생하는 사용자 정의 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_WRAP_WIDTH_CHANGE, function() {
		 *	});
		 */
		__CANVAS_WRAP_WIDTH_CHANGE: 'canvas.wrap.width.change',
		/** 
		 * 에디터의 높이가 변경된 후 발생하는 사용자 정의 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_HEIGHT_CHANGE, function(height) {
		 *		//height - 변경된 높이
		 *	});
		 */
		__CANVAS_HEIGHT_CHANGE: 'canvas.height.change',
		/** 
		 * wysiwyg 영역에서 키이벤트나 마우스이벤트가 발생할 경우 발생하는 사용자 정의 이벤트<br/>
		 * 주로 툴바 버튼의 상태를 표시할 때에 사용한다.
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_QUERY_STATUS, function() {
		 *	});
		 */
		__CANVAS_PANEL_QUERY_STATUS: 'canvas.panel.style.change',
		/** 
		 * wysiwyg 영역에서 delete 키가 눌렸을 경우 발생하는 사용자 정의 이벤트<br/>
		 * 주로 컨텐츠와 동기화를 맞추기 위해 사용한다.
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_DELETE_SOMETHING, function() {
		 *	});
		 */
		__CANVAS_PANEL_DELETE_SOMETHING: 'canvas.panel.delkey.press',
		/** 
		 * Entry Box에 Entry가 추가되었을 때 발생하는 사용자 정의 이벤트
		 * @example
		 * 	attachbox.observeJob(Trex.Ev.__ENTRYBOX_ENTRY_ADDED, function(entry) {
		 *		//생성된 entry 객체를 인자로 받는다.
		 *	});
		 */
		__ENTRYBOX_ENTRY_ADDED: 'entrybox.entryadded',
        /**
         * wysiwyg 영역에서 backspace 키가 눌렸을 경우 발생하는 사용자 정의 이벤트<br/>
         * 테이블 삭제를 위해 사용한다.
         * @example
         * 	canvas.observeJob(Trex.Ev.__CANVAS_PANEL_BACKSPACE_TABLE, function() {
		 *	});
         */
        __CANVAS_PANEL_BACKSPACE_TABLE: 'canvas.panel.backspace.table',
		/** 
		 * Entry Box의 Entry가 수정되었을 때 발생하는 사용자 정의 이벤트
		 * @example
		 * 	attachbox.observeJob(Trex.Ev.__ENTRYBOX_ENTRY_MODIFIED, function(entry) {
		 *		//수정된 entry 객체를 인자로 받는다.
		 *	});
		 */
		__ENTRYBOX_ENTRY_MODIFIED: 'entrybox.entrymodified',
		/** 
		 * Entry Box에서 Entry가 제거되었을 때 발생하는 사용자 정의 이벤트
		 * @example
		 * 	attachbox.observeJob(Trex.Ev.__ENTRYBOX_ENTRY_REMOVED, function(entry) {
		 *		//삭제될 entry 객체를 인자로 받는다.
		 *	});
		 */
		__ENTRYBOX_ENTRY_REMOVED: 'entrybox.entryremoved',
		/** 
		 * Entry Box에서 모든 Entry가 제거되었을 때 발생하는 사용자 정의 이벤트
		 * @example
		 * 	attachbox.observeJob(Trex.Ev.__ENTRYBOX_ALL_ENTRY_REMOVED, function() {
		 *	});
		 */
		__ENTRYBOX_ALL_ENTRY_REMOVED: 'entrybox.removed.all.perfectly',
        /**
		 * Entry Box에서 Entry의 추가/수정/삭제로 capacity가 변경 될 때 발생하는 사용자 정의 이벤트
		 * @example
		 * 	attachbox.observeJob(Trex.Ev.__ENTRYBOX_CAPACITY_UPDATE, function(capacity) {
		 *	});
		 */
		__ENTRYBOX_CAPACITY_UPDATE: 'entrybox.capacity.update',
		/** 
		 * Attach Box가 보여질 때 발생하는 사용자 정의 이벤트
		 * @example
		 * 	attachbox.observeJob(Trex.Ev.__ATTACHBOX_SHOW, function() {
		 *	});
		 */
		__ATTACHBOX_SHOW: 'attachbox.show',
		/** 
		 * Attach Box가 감춰질 때 발생하는 사용자 정의 이벤트
		 * @example
		 * 	attachbox.observeJob(Trex.Ev.__ATTACHBOX_HIDE, function() {
		 *	});
		 */
		__ATTACHBOX_HIDE: 'attachbox.hide',
        /**
         * fullscreen 상태에서 Attach Box가 보여질 때 발생하는 사용자 정의 이벤트
         * @example
         * 	attachbox.observeJob(Trex.Ev.__ATTACHBOX_FULLSCREEN_SHOW, function() {
		 *	});
         */
        __ATTACHBOX_FULLSCREEN_SHOW: 'attachbox.fullscreen.show',
        /**
         * fullscreen 상태에서 Attach Box가 감춰질 때 발생하는 사용자 정의 이벤트
         * @example
         * 	attachbox.observeJob(Trex.Ev.__ATTACHBOX_FULLSCREEN_HIDE, function() {
		 *	});
         */
        __ATTACHBOX_FULLSCREEN_HIDE: 'attachbox.fullscreen.hide',
		/** 
		 * 에디터 페이지를 벗어나기 전에 발생하는 사용자 정의 이벤트
		 * @example
		 * 	canvas.observeJob(Trex.Ev.__CANVAS_BEFORE_UNLOAD, function() {
		 *	});
		 */
		__CANVAS_BEFORE_UNLOAD: 'canvas.unload',
		/** 
		 * 각 첨부가 추가될 때 발생하는 사용자 정의 이벤트<br/>
		 * entry가 생성되고 본문에 삽입이 완료되고 호출된다.
		 * 실제로는 entry 부분이 첨부의 Identity(image, movie, media...)로 대체된다.
		 * @abstract
		 * @example
		 * 	canvas.observeJob('canvas.movie.added', function(entry) {
		 *		//생성된 entry 객체를 인자로 받는다.
		 *	});
		 */
		__CANVAS_ENTRY_ADDED: 'canvas.entry.added',
		/** 
		 * 툴을 이용해 wysiwyg에 요소가 삽입이 될 때 발생하는 사용자 정의 이벤트
		 * @abstract
		 * @example
		 * 	toolbar.observeJob('cmd.textbox.added', function(node) {
		 *		//필요에 따라 만들어진 요소 엘리먼트
		 *	});
		 */
		__COMMAND_NODE_ADDED: 'cmd.entry.added',
		/** 
		 * 왼쪽 정렬을 실행하고서 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CMD_ALIGN_LEFT: 'align.left',
		/** 
		 * 가운데 정렬을 실행하고서 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CMD_ALIGN_CENTER: 'align.center',
		/** 
		 * 오른쪽 정렬을 실행하고서 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CMD_ALIGN_RIGHT: 'align.right',
		/** 
		 * 양쪽 정렬을 실행하고서 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CMD_ALIGN_FULL: 'align.full',
		/** 
		 * 이미지 왼쪽 정렬을 실행하고서 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CMD_ALIGN_IMG_LEFT: 'align.img.left',
		/** 
		 * 이미지 가운데 정렬을 실행하고서 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CMD_ALIGN_IMG_CENTER: 'align.img.center',
		/** 
		 * 이미지 왼쪽흐름 정렬을 실행하고서 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CMD_ALIGN_IMG_FLOAT_LEFT: 'align.img.floatleft',
		/** 
		 * 이미지 오른쪽흐름 정렬을 실행하고서 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CMD_ALIGN_IMG_FLOAT_RIGHT: 'align.img.floatright',
        /**
         * table 가운데 정렬을 실행하고서 발생하는 사용자 정의 이벤트
         * @private
         */
        __CMD_ALIGN_TABLE_CENTER: 'align.table.center',
        /**
         * table 오른쪽흐름 정렬을 실행하고서 발생하는 사용자 정의 이벤트
         * @private
         */
        __CMD_ALIGN_TABLE_FLOAT_RIGHT: 'align.table.right',
        /**
         * table 왼쪽흐름 정렬을 실행하고서 발생하는 사용자 정의 이벤트
         * @private
         */
        __CMD_ALIGN_TABLE_FLOAT_LEFT: 'align.table.left',
        /**
         * 테이블 왼쪽 정렬을 실행하고서 발생하는 사용자 정의 이벤트
         * @private
         */
        __CMD_ALIGN_TABLE_LEFT: 'align.table.none',
        /**
         * 툴바의 축소를을 실행하고 발생하는 사용자 정의 이벤트
         */
        __CMD_ADVANCED_FOLD: 'toolbar.advanced.fold',
        /**
         * 툴바의 확장을 실행하고 발생하는 사용자 정의 이벤트
         */
        __CMD_ADVANCED_SPREAD: 'toolbar.advanced.spread',
		/**
		 * table 의 border 를 조정하는 세가지 속성중에 한가지가 변경될 때 발생함.
		 * border 의 세가지 속성: cellslinecolor, cellslineheight, cellslinestyle.
		 * @private
		 */
		__TOOL_CELL_LINE_CHANGE: 'tool.cell.line.change',
		/** 
		 * 에디터 로딩할 때 현재 모드와 config의 모드가 다를 때 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CANVAS_MODE_INITIALIZE: 'canvas.mode.initialize',
		/** 
		 * 에디터 로딩할 때 컨텐츠를 초기화한 후 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__CANVAS_DATA_INITIALIZE: 'canvas.load.data',
		/** 
		 * Attach Box의 ENTRY의 상태가 변경될 때 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__ENTRYBOX_ENTRY_REFRESH: 'entrybox.entryrefresh',
		/** 
		 * 정보첨부가 삽입될 때 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__PASTE_SEARCHRESULT: 'trex.paste.info',
		/** 
		 * 에디터에서 런타임에러가 났을 때 발생하는 사용자 정의 이벤트
		 * @private
		 */
		__RUNTIME_EXCEPTION: "editor.runtime.exception",
		/** 
		 * 에디터 장애 로그를 남길 때 발생하는 사용자 정의 이벤트<br/>
		 * 로그를 전송한 후 실행 된다.
		 * @private
		 */
        __REPORT_TO_MAGPIE: "editor.report.magpie",
        /**
         * 자동저장 리스트를 열 때 발생하는 사용자 정의 이벤트
         * @private
         */
        __SHOULD_CLOSE_MENUS: "editor.shouldclosemenus",
        /**
         * wysiwyg 영역에서 발생하는 이미지의 더블클릭 이벤트<br/>
         * @example
         * 	canvas.observeJob(Trex.Ev.__CANVAS_IMAGE_PLACEHOLDER_DBLCLICK, function(ev) {
		 *	});
         */
        __CANVAS_IMAGE_PLACEHOLDER_DBLCLICK: 'canvas.image.placeholder.dbclick',
        /**
         * 툴바의 레이어형 메뉴가 화면에 표시되면 호출.
         */
        __MENU_LAYER_SHOW: 'menu.layer.show',
        /**
         * 툴바의 레이어형 메뉴가 화면에 사라지면 호출.
         */
        __MENU_LAYER_HIDE: 'menu.layer.hide',
        /**
         * 툴바의 레이어형 메뉴의 크기가 변경되면 호출.
         */
        __MENU_LAYER_CHANGE_SIZE: 'menu.layer.change.size',

        /**
         * table, img가 선택 된 경우 호출
         */
        __CANVAS_SELECT_ITEM: 'canvas.select.item',
        __CANVAS_UNSELECT_ITEM: 'canvas.unselect.item'

	};
})(Trex);

/** @namespace */
var TrexEvent = {
	/**
	 * fires observer for target element 
	 * @param {Object} el
	 * @param {Object} handles
	 */
	fire: function(el, handles){
		if (el && el.tagName) {
			var fn = handles[el.tagName.toLowerCase()];
			if (fn) {
				fn(el, handles);
			}else {
				TrexEvent.propagateToParent(el, handles);
			}
		}else {
			console.log("Not Supported Type : " + el);
		}
	},
	propagateToParent : function(element, handles){
		var _el = element.parentNode;
		if(_el && _el.tagName && _el.tagName.toLowerCase ){
			var fn = handles[_el.tagName.toLowerCase()];
			if(fn){
				fn(_el, handles);
			}else{
				TrexEvent.propagateToParent(_el, handles);
			}
		}
	},
	stopPropagation : function(){ }
};


Trex.MarkupTemplate = {};

(function() {
	var __TEMPLATES = {};
	Trex.define(Trex.MarkupTemplate, {
		add: function(name, template) {
			__TEMPLATES[name] = template;
		},
		get: function(name) {
			if(!__TEMPLATES[name]) {
				return {
					evaluate: function() { return ""; },
					evaluateToDom: function() { return ""; }
				};
			}
			if(typeof(__TEMPLATES[name]) == 'string') {
				var _template = __TEMPLATES[name].replace(/@[\w\.]+/g, function(full) {
					return TXMSG(full);
				});
				__TEMPLATES[name] = new Template(_template);
			}
			return __TEMPLATES[name];
		},
		splitList: function(rows, cols, items){
			var _matrix = { 'row': [] };
			var _total = items.length;
			var _matrix_row = _matrix.row; 
			for(var row=0; row<rows; row++) {
				_matrix_row.push({ 'col': [] });
				var _matrix_col = _matrix_row.last().col;
				for(var col=0; col<cols; col++) {
					var _item = {
						'image': '',
						'data': '&nbsp;',
						'klass': ''
					};
					if(row * cols + col < _total) {
						if(typeof(items[row * cols + col]) == 'string') {
							_item.data = items[row * cols + col];
						} else {
							_item = Object.extend(_item ,items[row * cols + col]);
						}
					}
					_matrix_col.push(_item);
				}
			}
			return _matrix;
		}
	});
})();

/** @namespace */
var $tom = {};

(function() {
	var __TRANSLATIONS = {
		'%body': ['body'],
		'%text': ['#text', 'br'],
		'%element': ['#element'],
		'%control': ['img','object','hr','table','button','iframe'], //['input','select','textarea','label','br'],
		'%inline': ['span','font','u','i','b','em','strong','big','small','a','sub','sup','span'],//['tt','dfn','code','samp','kbd','var','cite','abbr','acronym','img','object','br','script','map','q','bdo','input','select','textarea','label','button'],
		'%block': ['p','div','ul','ol','h1','h2','h3','h4','h5','h6','pre','dl','hr','table','button'], //['noscript','blockquote','form','fieldset','address'], !button
		'%paragraph': ['p','li','dd','dt','h1','h2','h3','h4','h5','h6','td','th','div','caption'], //!button
		'%wrapper': ['div','ul','ol','dl','pre','xmp','table','button','blockquote'],// FTDUEDTR-1412
		'%innergroup': ['li','dd','dt','td', 'th'],
		'%outergroup': ['ul','ol','dl','tr','tbody','thead','tfoot','table'],
		'%tablegroup': ['td', 'th','tr','tbody','thead','tfoot','table'],
		'%listgroup': ['li','ul','ol'],
		'%datagroup': ['dd','dt','dl'],
		'%listhead': ['ul','ol']
	};
	
	var __TRANSLATIONS_MAP = {}; //for caching
	for(var _ptrn in __TRANSLATIONS) {
		__TRANSLATIONS_MAP[_ptrn] = {};
		if (__TRANSLATIONS[_ptrn]) {
			$A(__TRANSLATIONS[_ptrn]).each(function(tag){
				__TRANSLATIONS_MAP[_ptrn][tag] = _TRUE;
			});
		}
	}
	
	function createMap(patterns) {
		var _map = {};
		var _patterns = patterns.split(",");
		_patterns.each(function(pattern) {
			if(__TRANSLATIONS_MAP[pattern]) {
				for(var _part in __TRANSLATIONS_MAP[pattern]) {
					_map[_part] = _TRUE;
				}
			} else {
				_map[pattern] = _TRUE;
			}
		});
		return _map;
	}
	
	var Translator = Trex.Class.create({
		initialize: function(patterns) {
			this.patterns = patterns;
			this.map = createMap(patterns);
		},
		hasParts: function() {
			return (this.patterns.length > 0);
		},
		include: function(partPtrn) {
			var _partMap = createMap(partPtrn);
			for(var _part in _partMap) {
				if(this.map[_part]) {
					return _TRUE;
				}
			}
			return _FALSE;
		},
		memberOf: function(wholePtrn) {
			var _wholeMap = createMap(wholePtrn);
			for(var _part in this.map) {
				if(_wholeMap[_part]) {
					return _TRUE;
				}
			}
			return _FALSE;
		},
		extract: function(wholePtrn) {
			var _wholeMap = createMap(wholePtrn);
			var _matches = [];
			for(var _part in this.map) {
				if(_wholeMap[_part]) {
					_matches.push(_part);
				}
			}
			return $tom.translate(_matches.join(","));
		},
		getExpression: function() {
			if(!this.exprs) {
				var _exprs = [];
				for(var _part in this.map) {
					_exprs.push(_part);
				}
				this.exprs = _exprs.join(",");
			}
			return this.exprs;
		}
	});
	
	var __TRANSLATOR_CACHES = {}; //for caching	
	Object.extend($tom, {
		translate: function(pattern) {
			if(!__TRANSLATOR_CACHES[pattern]) {
				__TRANSLATOR_CACHES[pattern] = new Translator(pattern);
			}
			return __TRANSLATOR_CACHES[pattern];
		}
	});
	
})();

Object.extend($tom, {
	__POSITION: {
		__START_OF_TEXT: -1,
		__MIDDLE_OF_TEXT: 0,
		__END_OF_TEXT: 1,
		__EMPTY_TEXT: -2
	}
});

Object.extend($tom, /** @lends $tom */{
	/**
	 * node가 HTMLElement이면 true를 아니면 false를 반환한다.
	 * @function
	 */
	isElement: function(node) {
        return node && node.nodeType == 1;
	},
	/**
	 * node가 <body> 요소이면 true를 반환한다.
	 * @function
	 */
	isBody: function(node) {
        return $tom.isElement(node) && node.tagName == "BODY";
	},
	/**
	 * node가 아래에 나열된 block 요소이면 true 를 반환한다.
	 * 'p','div','ul','ol','h1','h2','h3','h4','h5','h6','pre','dl','hr','table','button'
	 * @function
	 */
	isBlock: function(node) {
		return $tom.kindOf(node, '%block');
	},
    /**
	 * node가 아래에 나열된 요소이면 true 를 반환한다.
	 * 'p','li','dd','dt','h1','h2','h3','h4','h5','h6','td','th','div','caption'
	 * @function
	 */
	isParagraph: function(node) {
        return $tom.kindOf(node, '%paragraph');
	},
	/**
	 * node가 텍스트이거나 <br> 요소이면 true 를 반환한다.
	 * @function
	 */
	isText: function(node) {
		return $tom.kindOf(node, '%text');
	},
	/**
	 * node가 아래에 나열된 요소이면 true를 반환한다.
	 * 'img','object','hr','table','button'
	 * @function
	 */
	isControl: function(node) {
		return $tom.kindOf(node, '%control');
	},
    /**
     * element가 tagName면 true를 반환한다.
     * @function
     */
    isTagName: function(element, tagName){
        tagName = tagName.toUpperCase();
        return element && element.tagName === tagName;

    },
    getOwnerDocument: function(node) {
        return node.ownerDocument || node.document;
    },
	/**
	 * node의 이름을 반환한다.
	 * @function
	 */
	getName: function(node) {
		return ((node && node.nodeType == 1)? node.nodeName.toLowerCase(): "");
	},
	/**
	 * node의 text content 를 반환한다.
	 * @function
	 */
	getText: function(node) {
		return node.textContent || node.text || node.innerText || "";
	},
	/**
	 * 요소의 nodeType 1이면 child 노드의 길이를, nodeType 3이면 nodeValue의 길이를 반환한다.  
	 * @function
	 */
	getLength: function(node) {
		if(!node) {
			return 0;
		}
		if(node.nodeType == 1) {
			return node.childNodes.length;
		} else if(node.nodeType == 3) {
			return node.nodeValue.length;
		}
		return 0; 
	},
	/**
	 * node가 같은 레벨의 요소 중 몇 번째인지 인덱스값을 반환한다.
	 * @function
	 */
	indexOf: function(node){
		if(!node) {
			return -1;
		}
		var _pNode = node.parentNode;
        for (var i = 0, len = _pNode.childNodes.length, childNodes = _pNode.childNodes; i < len; i++) {
            if (childNodes[i] == node) {
                return i;
            }
        }
        return -1;
	},
	/**
	 * node가 textNode이면 공백을 제거한 nodeValue의 내용이 존재하면 true를 반환한다.
	 * @function
	 */
	hasContent: function(node, ignoreZWNBS) {
		if(!node || node.nodeType != 3) {
			return _TRUE;
		}

		var _text = $tom.removeMeaninglessSpace( node.nodeValue );
		if(ignoreZWNBS) {
			_text = _text.replace(Trex.__WORD_JOINER_REGEXP, "");
		}
		return (_text != "");
	},
    removeEmptyTextNode: function(textNode) {
        if (textNode && textNode.nodeType == 3 && !textNode.nodeValue) {
            $tom.remove(textNode);
        }
    },
	hasUsefulChildren: function(node, ignoreZWNBS) {
		if(!node) {
			return _FALSE;
		}
		var _inner = $tom.removeMeaninglessSpace( node.innerHTML );
		if(ignoreZWNBS) {
			_inner = _inner.replace(Trex.__WORD_JOINER_REGEXP, "");
		}
		if(!_inner) {
			return _FALSE;
		}
		if(_inner.stripTags()) {
			return _TRUE;
		}
		if(_inner.search(/<(img|br|hr)\s?[^>]*>/i) > -1) {
			return _TRUE;
		}
		if(_inner.search(/<span\sid="?tx_(start|end)_marker"?><\/span>/i) > -1) {
			return _TRUE;
		}
		return _FALSE;
	},
	/**
	 * node에 의미있는 데이터가 있는지 확인한다.
	 * @function
	 */
	hasData: function(node, ignoreStuff) {
		if(!node) {
			return _FALSE;
		}
		
		var _inner = '';
		if(node.nodeType == 1) {
			_inner = node.innerHTML;
		} else {
			_inner = node.nodeValue;
		}
		_inner = $tom.removeMeaninglessSpace( _inner );
		if(_inner.trim() == '') {// #PCCAFEQA-11
			return _FALSE;
		}
		if(_inner.stripTags() != '') {
			return _TRUE;
		}
		if(ignoreStuff) {
			return _FALSE;
		}
		if(_inner.search(/<br\s?\/?>/i) > -1) {
			return _TRUE;
		}
		return _FALSE;
	},
	/**
	 * 주어진 스트링에서 의미없는 스페이스를 제거하는 함수.
	 * @function
	 */
	removeMeaninglessSpace: function(str){
		/* /\s/ == /[\f\n\r\t\v\u2028\u2029\u00a0]/ */
		return str.replace(/(^[\f\n\r\t\v\u2028\u2029]*)|([\f\n\r\t\v\u2028\u2029]*$)/g, "");
	}
});	

Object.extend($tom, /** @lends $tom */{
	/**
	 * $tom.find, $tom.collect, $tom.collectAll 에서 공통적으로 호출되는 함수.
	 * @function
	 * @example
	 *   var result1 = $tom.search(["td,th"], dFindy, _NULL);
	 *   var result2 = $tom.search([context, "td,th"], dFindy, _NULL);
	 *   var results = $tom.search([context, "td,th"], dGetties, []);
	 */
	search: function(args, searchFunction, defaultValue) {
		var context = (args.length == 1) ? _DOC : args[0];
		var pattern = args[args.length - 1];
		
		var invalidArgument = (!pattern ||
								!context ||
								!context.nodeType ||
								typeof pattern != "string");
		if (invalidArgument) {
			return defaultValue;
		}
		
		var translator = $tom.translate(pattern);
		return searchFunction(context, translator.getExpression());
	},
	/**
	 * css selector 로 요소를 찾아서 반환하는데 인자 node의 상위에 있는 요소를 찾는다.
	 * @function
	 * @example
	 *  var _elNode = $tom.find(node, "table.txc-layout-wz");
	 */
	find: function() {
		return this.search(arguments, dFindy, _NULL);
	},
	/**
	 * css selector 로 요소를 찾아서 반환하는데 인자 node의 하위에 있는 요소를 찾는다.
	 * @function
	 * @example
	 *  var _elInput = $tom.collect(this.elMenu, 'textarea');
	 */
	collect: function() {
		return this.search(arguments, dGetty, _NULL);
	},
	/**
	 * css selector로 요소를 찾아서 반환하는데 인자 node의 하위에 있는 요소를 찾고 모든 요소를 배열에 담아서 반환한다.
	 * @function
	 * @example
	 *  var _elItemList = $tom.collectAll(this.elMenu, "li a");  
	 */
	collectAll: function() {
		return this.search(arguments, dGetties, []);
	}
});	

(function() {
	function makeFilter(pattern) {
		if(pattern) {
			if(typeof(pattern) === 'function') {
				return pattern;
			} else {
				var _translator = $tom.translate(pattern);
				return function(node) {
					if(node.nodeType == 1) {
						if (_translator.include('#element')) {
							return _TRUE;
						} else {
							return dChecky(node, _translator.getExpression());
						}
					} else {
						return _translator.include('#text');
					}
				};
			}
		} else {
			return _NULL;
		}
	}

    var nodePatternCache = {};
    function findNodePattern(pattern) {
        pattern = pattern || "#element,#text";

        if (nodePatternCache[pattern]) {
            return nodePatternCache[pattern];
        }
        var filter = new NodePattern(pattern);
        nodePatternCache[pattern] = filter;
        return filter;
    }

    var NodePattern = Trex.Class.create({
        initialize: function(pattern) {
            this.pattern = pattern;
            this.translator = $tom.translate(pattern);
            // for better performance
            this.hasClassPattern = pattern.indexOf(".") >= 0;
            this.hasIdPattern = pattern.indexOf("#") >= 0;
            this.matchesText = this.translator.include("#text");
            this.matchesElement = this.translator.include("#element");
        },
        test: function(node) {
            var nodeType = node.nodeType;
            var translatorMap = this.translator.map;
            if (nodeType == 1) {
                if (this.matchesElement) {
                    return _TRUE;
                }
                var tagName = node.tagName.toLowerCase();

                // early matching for performance
                if (translatorMap[tagName]) {
                    return _TRUE;
                }

                var checkPattern = [];
                if (this.hasClassPattern && node.className) {
                    node.className.split(/\s/).each(function(className) {
                        checkPattern.push("." + className);
                        checkPattern.push(tagName + "." + className);
                    });
                }
                if (this.hasIdPattern && node.id) {
                    var id = node.id;
                    checkPattern.push("#" + id);
                    checkPattern.push(tagName + "#" + id);
                }
                for (var i = 0; i < checkPattern.length; i++) {
                    if (translatorMap[checkPattern[i]]) {
                        return _TRUE;
                    }
                }
                return _FALSE;
            } else if (nodeType == 3) {
                return this.matchesText;
            }
        }
    });

	Object.extend($tom, /** @lends $tom */{
        tagName: function(node, tagName) {
            if (!node) {
                return _NULL;
            }
            return node.tagName;
        },
		/**
		 * node가 pattern에 맞는 요소이면 true를 반환한다. 
		 * @function
		 * @param node
		 * @param pattern css selector rule
		 * @example
		 *  $tom.kindOf(node, "img.txc-image") // node가 txc-image라는 이름의 class속성을 가진 img 요소이면 true
		 */
        // 더 이상 사용하지 않는 dChecky를 없애자.
        kindOf: function(node, pattern) {
            if (!node || !pattern) {
                return _FALSE;
            }
            var filter = findNodePattern(pattern);
            return filter.test(node);
        },
		kindOf_old: function(node, pattern) {
			if(!node || !pattern) {
				return _FALSE;
			}
			return makeFilter(pattern)(node);
		},
		/* has filter */
		/**
		 * pattern에 맞는 descendant의 상위요소를 찾아서 반환한다.
		 * @function
		 */
		ancestor: function(descendant, pattern) {
			if(!descendant || !descendant.parentNode) {
				return _NULL;
			}
            var filter = findNodePattern(pattern);
			var _node = descendant.parentNode;
			while(_node) {
				if($tom.isBody(_node)) {
					return _NULL;
				}
                if (filter.test(_node)) {
                    break;
                }
				_node = _node.parentNode;
			}
			return _node;
        },
        findAncestor: function(node, matched, mustStop) {
            while (!mustStop(node)) {
                if (matched(node)) {
                    return node;
                }
                node = node.parentNode;
            }
            return _NULL;
        },
        /**
		 * pattern에 맞는 descendant의 하위요소를 찾아서 반환한다.
		 * @function
		 */
		descendant: function(ancestor, pattern) {
			var _nodes = $tom.descendants(ancestor, pattern, _TRUE);
			if(_nodes.length == 0) {
				return _NULL;
			}
			return _nodes[0];
		}, 
		/**
		 * pattern에 맞는 descendant의 모든 하위요소를 찾아서 반환한다.
		 * @function
		 */
		descendants: function(ancestor, pattern, single) {
			single = single || _FALSE;
			if(!ancestor || !ancestor.firstChild) {
				return [];
			}
			var _found = _FALSE;
            var filter = findNodePattern(pattern);
			var _nodes = [];
			var _gets = function(parent) {
				if(single && _found) {
					return;
				}
				if(!$tom.first(parent)) {
					return;
				}
				var _chilren = $tom.children(parent);
				for(var i=0,len=_chilren.length;i<len;i++) {
					if (filter.test(_chilren[i])) {
						_nodes.push(_chilren[i]);
						_found = _TRUE;
					} else {
						_gets(_chilren[i]);
					}
				}
			};
			_gets(ancestor);
			return _nodes;
		}, 
		/**
		 * node의 자식요소 중 pattern에 맞는 모든 요소를 찾아서 반환한다.
		 * @function
		 */
		children: function(node, pattern) {
			var _nodes = [];
			if(!node || !node.firstChild) {
				return _nodes;
			}
            var filter = findNodePattern(pattern);
			var _node = $tom.first(node);
			while(_node) {
                if (filter.test(_node)) {
					_nodes.push(_node);
				}
				_node = _node.nextSibling;
			}
			return _nodes;
		},
		/**
		 * node의 nextSibling 요소 중 pattern에 맞는 요소를 찾아서 반환한다.
		 * @function
		 */
		next: function(node, pattern) {
			if(!node || !node.nextSibling) {
				return _NULL;
			}
            var filter = findNodePattern(pattern);
			var _node = node.nextSibling;
			while(_node) {
				if($tom.hasContent(_node)) {
					if (filter.test(_node)) {
						break;
					}
				}
				_node = _node.nextSibling;
			}
			return _node;
		},
		/**
		 * node의 previousSibling 요소 중 pattern에 맞는 요소를 찾아서 반환한다.
		 * @function
		 */
		previous: function(node, pattern) {
			if(!node || !node.previousSibling) {
				return _NULL;
			}
            var filter = findNodePattern(pattern);
			var _node = node.previousSibling;
			while(_node) {
				if($tom.hasContent(_node)) {
					if (filter.test(_node)) {
						break;
					}
				}
				_node = _node.previousSibling;
			}
			return _node;
		},
		/**
		 * pattern에 맞는 node의 첫번째 자식요소를 찾아서 반환한다.
		 * @function
		 */
		first: function(node, pattern) {
			if(!node || !node.firstChild) {
				return _NULL;
			}
            var filter = findNodePattern(pattern);
			var _node = node.firstChild;
			while(_node) {
				if($tom.hasContent(_node)) {
                    if (filter.test(_node)) {
                        break;
                    }
				}
				_node = _node.nextSibling;
			}
			return _node;
		},
		/**
		 * pattern에 맞는 node의 마지막 자식요소를 찾아서 반환한다.
		 * @function
		 */
		last: function(node, pattern) {
			if(!node || !node.lastChild) {
				return _NULL;
			}
            var filter = findNodePattern(pattern);
			var _node = node.lastChild;
			while(_node) {
				if($tom.hasContent(_node)) {
                    if (filter.test(_node)) {
						break;
					}
				}
				_node = _node.previousSibling;
			}
			return _node;
		},
		/**
		 * 
		 * @function
		 */
		extract: function(parent, child, pattern) {
			var _nodes = [];
			if(!parent || !child ||!pattern) {
				return _nodes;
			}
            var filter = findNodePattern(pattern);
			var _found = _FALSE;
			var _node = parent.firstChild;
			while(_node) {
				if($tom.include(_node, child)) {
					_found = _TRUE;
				}
                if (filter.test(_node)) {
					_nodes.push(_node);
				} else {
					if(_found) {
						break;
					} else {
						_nodes = [];
					}
				}
				_node = _node.nextSibling;
			}
            return _found ? _nodes : [];
//			return _nodes;
		},
		/* has no filter */
		/**
		 * node의 parent node를 반환한다.
		 * @function
		 */
		parent: function(node) {
			if(!node || !node.parentNode) {
				return _NULL;
			}
			return node.parentNode;
		}, 
		/**
		 * node를 포함하고 있는 body 요소를 반환한다.
		 * @function
		 */
		body: function(node) {
			if(!node || !node.parentNode) {
				return _NULL;
			}
			var _node = node.parentNode;
			while(_node) {
				if($tom.isBody(_node)) {
					return _node;
				}
				_node = _node.parentNode;
			}
			return _NULL;
		}, 
		/**
		 * ancestor의 하위에서 처음 나오는 텍스트 노드를 찾아서 반환한다. 
		 * @function
		 */
		top: function(ancestor, all) {
			all = all || _FALSE;
			var _node = ancestor;
			
			while($tom.first(_node)) {
				_node = $tom.first(_node);
			}
			if(all) {
				return _node;
			} else {
				if ($tom.kindOf(_node, "#tx_start_marker,#tx_end_marker")) {
					_node = _node.nextSibling || _node.parentNode;
				} else if($tom.kindOf(_node, '%control')) {
					_node = _node.parentNode;
				}
				return _node;
			}
		}, 
		/**
		 * ancestor의 하위에서 마지막에 나오는 텍스트 노드를 찾아서 반환한다. 
		 * @function
		 */
		bottom: function(ancestor, all) {
			all = all || _FALSE;
			var _node = ancestor;
			while($tom.last(_node)) {
				_node = $tom.last(_node);
			}
			if (all) {
				return _node;
			} else {
				if ($tom.kindOf(_node, "#tx_start_marker,#tx_end_marker")) {
					_node = _node.previousSibling || _node.parentNode;
				} else if ($tom.kindOf(_node, '%control')) {
					_node = _node.parentNode;
				}
				return _node;
			}
		},
		/**
		 * child가 parent에 포함되어 있는 요소이면 true를 반환한다.
		 * @function
		 */
		include: function(parent, child) {
			if(!parent || !child) {
				return _FALSE;
			}
			if(parent == child) {
				return _TRUE;
			}
			var _node = child;
			while (_node) {
				if ($tom.isBody(_node)) {
					return _FALSE;
				} else if (_node == parent) {
					return _TRUE;
				}
				_node = _node.parentNode;
			}
			return _FALSE;
		},
        /**
         * node, offset 이전 커서의 위치를 반환한다.
         * @function
         */
        prevNodeUntilTagName: function(node, offset, tagName){
            tagName = tagName.toUpperCase();
            if(offset === 0)
                node = node.previousSibling;
            else {
                node = node.childNodes[offset-1];
            }
            while(node&&node.lastChild){
                if(node.tagName === tagName)
                    break;
                node = node.lastChild;
            }
            return node;
        },
        /**
         * node 다음 content를 반환한다.
         * @function
         */
        nextContent : function (node, filter){
            do{
                var _node = $tom.next(node, filter);
                if(_node)
                    return _node;
                node = $tom.parent(node);
            }while(node && !$tom.isBody(node));
            return null;
        }
	});
	
})();



Object.extend($tom, /** @lends $tom */{
	/**
	 * parent요소의 첫번째 자식노드로 child를 삽입한다.
	 * @function
	 */
	insertFirst: function(parent, child) {
		if(!parent || !child) {
			return;
		}
		if (parent.firstChild) {
			parent.insertBefore(child, parent.firstChild);
		} else {
			parent.appendChild(child);
		}
		return child;
	},
	/**
	 * target 요소 전 위치에 source 요소를 삽입한고 source 요소를 반환한다.
	 * @function
	 */
	insertAt: function(source, target) {
		if(!source || !target) {
			return;
		}
		target.parentNode.insertBefore(source, target);
		return source;
	},
	/**
	 * target 요소 다음 위치에 source 요소를 삽입한고 source 요소를 반환한다.
	 * @function
	 */
	insertNext: function(source, target) {
		if(!source || !target) {
			return;
		}
        var nextSibling = target.nextSibling;
		if (nextSibling) {
			nextSibling.parentNode.insertBefore(source, nextSibling);
		} else {
			target.parentNode.appendChild(source);
		}
		return source;
	},
	/**
	 * parent 요소에 child 요소를 붙인 후 child 요소를 반환한다.
	 * @function
	 */
	append: function(parent, child) {
		if(!parent || !child) {
			return;
		}
		parent.appendChild(child);
		return child;
	},
	/**
	 * node 를 제거한다.
	 * @function
	 */
	remove: function(node) {
		if(!node) {
			return;
		}
		if(node.parentNode) {
			node.parentNode.removeChild(node);
		}
		node = _NULL;
	},
	/**
	 * node의 innerHTML로 html를 넣고 node를 반환한다.
	 * @function
	 */
	html: function(node, html) {
		if(!node) {
			return;
		}
		node.innerHTML = html || "";
		return node;
	},
	/**
	 * node의 내용을 지운다.
	 * @function
	 */
	clean: function(node) {
		return $tom.html(node);
	},
	/**
	 * node안에 해당 html를 채워넣고 node를 반환한다.
	 * @function
	 */
	stuff: function(node, html) {
		if(!node) {
			return node;
		}
		if($tom.hasUsefulChildren(node, _TRUE)) {
			return node;
		}
		if(node.lastChild) {
			var _node = node;
			while (_node.lastChild) {
				_node = _node.lastChild;
			}
			$tom.insertNext(html, _node);
		} else {
			$tom.append(node, html);
		}
		return node;
	}
});

Object.extend($tom, /** @lends $tom */{
    /**
     * child가 없는 listhead라면 삭제한다
     * @param node
     */
    removeListIfEmpty: function(node) {
        while ($tom.kindOf(node, "%listhead") && node.childNodes.length == 1 && $tom.kindOf(node.firstChild, "%listhead")) {
            node = node.firstChild;
        }

        while ($tom.kindOf(node, "%listhead") && node.childNodes.length == 0) {
            var tempNode = node.parentNode;
            $tom.remove(node);
            node = tempNode;
        }
    }
});

Object.extend($tom, /** @lends $tom */{
	/**
	 * sNode의 자식노드들을 dNode의 child로 삽입 하는데 sInx, eInx는 자식노드의 시작, 끝 인덱스번호다.
	 * @function
	 * @param sNode
	 * @param dNode
	 * @param sInx
	 * @param eInx
	 */
	moveChild: function(sNode, dNode, sInx, eInx) {
		if(!sNode || !dNode) {
			return;
		}
		sInx = Math.min(Math.max(sInx || 0), sNode.childNodes.length);
		eInx = Math.min(Math.max(eInx || sNode.childNodes.length), sNode.childNodes.length);
		if(sInx >= eInx) {
			return;
		}
		
		var _inx = sInx;
		while (_inx++ < eInx && sInx < sNode.childNodes.length) {
			dNode.appendChild(sNode.childNodes[sInx]);
		}
	},
	/**
	 * node의 자식노드를 node의 부모노드에 붙인다.
	 * @function
	 */
	moveChildToParent: function(node) {
		if(!node) {
			return;
		}
        while (node.firstChild) {
            node.parentNode.insertBefore(node.firstChild, node);
        }
	}
});

/*
 * Create, Destroy, Change
 */
Object.extend($tom, /** @lends $tom */{
	/**
	 * source를 target로 교체하고 target를 반환한다.
	 * @function
	 */
    replace: function(source, target) {
        if (!source || !target) {
            return _NULL;
        }
        if ($tom.getName(source) == $tom.getName(target)) {
            $tom.remove(target);
            return source;
        } else {
            // FTDUEDTR-1248
            var children = [],
                childNodes = source.childNodes,
                len = childNodes.length;
            for (var i = 0; i < len; i++) {
                children.push(childNodes[i]);
            }
            for (i = 0; i < len; i++) {
                var child = children[i];
                if (child.lastChild === source) {
                    var cloneChild = $tom.clone(child);
                    $tom.moveChild(child, cloneChild);
                    child.innerHTML = "";
                    target.appendChild(cloneChild);
                } else {
                    target.appendChild(child);
                }
            }
            $tom.insertAt(target, source);
            $tom.remove(source);
            return target;
        }
    },
	/**
	 * node를 복사 후 반환한다.
	 * @function
	 */
	clone: function(node, deep) {
        var cloneNode = node.cloneNode(!!deep);
        if (node.nodeType == 1) {
            cloneNode.removeAttribute("id");
        }
        return cloneNode;
	}
});
	
/*
 * Wrap, Unwrap
 */
Object.extend($tom, /** @lends $tom */{
	/**
	 * wNode 아래에 pNodes를 붙여서 pNodes를 wNode로 감싼다.
	 * @function
	 * @return wNode
	 */
	wrap: function(wNode, pNodes) { //NOTE: quote, quotenodesign, textbox 등에서 사용됨, actually using 'div', 'blockquote'
		if (!wNode || !pNodes) {
			return _NULL;
		}
        if (pNodes instanceof Array == _FALSE) {
			pNodes = [].concat(pNodes);
		}

		$tom.insertAt(wNode, pNodes[0]);
		pNodes.each((function(pNode){
			$tom.append(wNode, pNode);
		}));
		return wNode;
	},
	/**
	 * node를 제거하고 node의 자식노드는 node의 상위에 붙인다.
	 * @function
	 */
	unwrap: function(node) { 
		if (!node) {
			return _NULL;
		}
        var _nNode = $tom.first(node);
        if ($tx.msie_nonstd) {
            node.removeNode();  // IE에서는 이게 더 빠름
        } else {
            $tom.moveChildToParent(node);
            $tom.remove(node);
        }
        return _nNode;
	}
});

	
Object.extend($tom, /** @lends $tom */{
	/**
	 * @private
	 * @function
	 */
	divideText: function(node, offset) {
		if(!$tom.isText(node)) {
			return node;
		}
		if(offset <= 0 || offset >= node.length) { //나눌필요가 있을까?
			return node;
		}
		var _newNode = node.cloneNode(_FALSE);
        node.deleteData(offset, node.length - offset);
		_newNode.deleteData(0, offset);
		$tom.insertNext(_newNode, node);
		return _newNode;
	},
	/**
     * node의 offset번째 child를 기준으로 두 개로 분리한다.
	 */
	divideNode: function(node, offset) {
		if(!$tom.isElement(node)) {
			return _NULL;
		}
		/*if(offset <= 0 || offset >= node.childNodes.length) { //나눌필요가 있을까?
			return node;
		}*/
		var _lastOffset = node.childNodes.length - offset;
		var _newNode = node.cloneNode(_FALSE);
		for(var i=0;i<_lastOffset;i++) {
			$tom.insertFirst(_newNode, node.lastChild);
		}
		$tom.insertNext(_newNode, node);
		return _newNode;
	},
    /**
     * divideNode와 비슷한데, node를 clone할 때에 style, attribute를 모두 복사하게 된다.
     * divideNode 사용에 대한 legacy 때문에 따로 만들었으며, 사용법이 확인된 이후에는 두 개가 합쳐질 필요가 있다.
     * 예를 들어 style을 복사하는 책임을 caller에게 넘기는 방식이나, 파라미터로 선택할 수 있도록 해서...
     */
    splitAt: function(node, index) {
        if (!$tom.isElement(node)) {
            return;
        }
        var clonedNode = $tom.clone(node);
        $tom.moveChild(node, clonedNode, index + 1, node.childNodes.length);
        $tom.insertNext(clonedNode, node);
        return clonedNode;
    },
    /**
     * stopAncestor은 dividedPoint의 ancestor 이어야 함
     * stopAncestor와 dividedPoint 사이에 table이 없어야 함
     */
    divideTree: function(stopAncestor, dividedPoint) {
        var currentNode = dividedPoint, offset, parent;
        do {
            parent = currentNode.parentNode;
            offset = $tom.indexOf(currentNode);
            currentNode = $tom.divideNode(parent, offset);
        } while (currentNode.previousSibling != stopAncestor);
        return currentNode;
    },
	/**
	 * @private
	 * @function
	 */
	divideParagraph: function(node) {
		var _node = node;
		var _offset = $tom.indexOf(node);
		
		var _divided = _node;
		while (_node) {
			if ($tom.isBody(_node)) {
				break;
			} else if ($tom.kindOf(_node, 'td,th,%wrapper,%outergroup')) {
				break;
			} else if ($tom.kindOf(_node, "#tx_start_marker,#tx_end_marker")) {
				_offset = $tom.indexOf(_node);
			} else if($tom.isControl(_node)) {
				_offset = $tom.indexOf(_node);
			} else if ($tom.isText(_node)) { //text
				_node = $tom.divideText(_node, _offset);
				_offset = $tom.indexOf(_node);
			} else { //%inline, %paragraph
				_node = $tom.divideNode(_node, _offset);
				_offset = $tom.indexOf(_node);
				_divided = _node;
				if ($tom.kindOf(_node, 'p,li,dd,dt,h1,h2,h3,h4,h5,h6')) {
					break;
				}
			}
			_node = _node.parentNode;
		}
		return _divided;
	},
    wrapInlinesWithP: function(inline, ancestorBlock) {
        var ownerDocument = $tom.getOwnerDocument(inline);
        var inlineNodes = $tom.extract(ancestorBlock || ownerDocument.body, inline, '%text,%inline,%control');
        // caret은 곧 사라지기 때문에P로 감쌀 필요가 없다
        if (this.hasOnlySavedCaret(inlineNodes, inline)) {
            return _NULL;
        }
        var newParagraph = ownerDocument.createElement("p");
        $tom.wrap(newParagraph, inlineNodes);
        return newParagraph;
    },
    hasOnlySavedCaret: function(inlines, inline) {
        var validInlines = inlines.findAll(function(node) {
            return node.nodeType != 3 || node.nodeValue.trim() != "";
        });
        return this.isGoogRangeCaret(inline) && validInlines.length == 1 && validInlines[0] == inline;
    },
    isGoogRangeCaret: function(node) {
        return node && /goog_[0-9]+/.test(node.id);
    }
});

Object.extend($tom, /** @lends $tom */{
	/**
	 * name의 하위요소로 들어올 요소이름 반환
	 * @function
	 * @example
	 *  $tom.paragraphOf("table") // 'td'를 반환한다.
	 */
	paragraphOf: function(name) {
		if(!name) {
			return 'p';
		}
		var _translator = $tom.translate(name);
		if (_translator.memberOf('ul,ol')) {
			return 'li';
		} else if (_translator.memberOf('dl')) {
			return 'dd';
		} else if (_translator.memberOf('tr,tbody,thead,tfoot,table')) {
			return 'td';
		} else {
			return 'p';
		}
	},
	/**
	 * 'span' 을 반환한다.
	 * @function
	 */
	inlineOf: function() {
		return 'span';
	},
	/**
	 * 요소의 name을 받아서 상위요소가 되는 요소이름을 반환한다.
	 * @function
	 * @example
	 *  $tom.outerOf("td") // "table"을 반환한다.
	 */
	outerOf: function(name) {
		if(!name) {
			return 'span';
		}
		var _translator = $tom.translate(name);
		if (_translator.memberOf('li')) {
			return 'ol';
		} else if (_translator.memberOf('dd,dt')) {
			return 'dl';
		} else if (_translator.memberOf('td,th,tr')) {
			return 'table';
		} else {
			return 'p';
		}
	}
});
	
(function() {
	var __IGNORE_NAME_FLAG = 0;

	var UnitCalculate = Trex.Class.create({
		$const: {
			__FONT_SIZE_BASIS: 9,
			__REG_EXT_NUMBER: new RegExp("[0-9\.]+"),
			__REG_EXT_UNIT: new RegExp("px|pt|em")
		},
		initialize: function() {
			this.unitConverter = { //1em = 9pt
				"px2em": 1 / 12,
				"px2pt": 9 / 12,
				"em2px": 12, // 12 : 1
				"em2pt": 9,  // 9 : 1
				"pt2px": 12 / 9,
				"pt2em": 1 / 9
			};
		},
		calculate: function(strA, strB) {
			if (strA == _NULL || strA.length == 0) {
				strA = "0em";
			}
			if (strB == _NULL || strB.length == 0) {
				strB = "0em";
			}
	
			var _sign = this.extractSign(strB);
			
			var _unitA = this.extractUnit(strA);
			var _unitB = this.extractUnit(strB); //basis unit
			
			var _numA = this.extractNumber(strA).toNumber();
			var _numB = this.extractNumber(strB).toNumber();
			if(_unitA != _unitB) { //different unit
				if(this.unitConverter[_unitA+"2"+_unitB]) {
					_numA *= this.unitConverter[_unitA+"2"+_unitB];
				}
			}
			var _result = 0;
			if(_sign == "-") {
				_result = Math.max(_numA - _numB, 0);
			} else {
				_result = (_numA + _numB);
			} 
			_result = (Math.round(_result*10)/10);
			if (_result == 0) {
				return _NULL;
			} else {
				return _result + _unitB;
			}
		},
		needCalculation: function(str) {
			if(str == _NULL || typeof str != "string") {
				return _FALSE;
			} else {
				return (str.charAt(0) == '+' || str.charAt(0) == '-');
			}
		},
		extractSign: function(str) {
			var _sign = "+";
			if(str.charAt(0) == '+' || str.charAt(0) == '-') {
				_sign = str.charAt(0);
			}
			return _sign;
		},
		extractNumber: function(str) {
			var _num = 0;
			var _match;
			if((_match = str.match(UnitCalculate.__REG_EXT_NUMBER)) != _NULL) {
				_num = _match[0];
			}
			if(str.indexOf("%") > -1) { //%
				_num = _num / 100;
			}
			return _num;
		},
		extractUnit: function(str) {
			var _unit = "em";
			var _match;
			if((_match = str.match(UnitCalculate.__REG_EXT_UNIT)) != _NULL) {
				_unit = _match[0];
			}
			return _unit;
		}
	});
	var _unitCalculator = new UnitCalculate();
	
	var __ATTRIBUTE_TRANSLATIONS = {
	    colspan:   "colSpan",
	    rowspan:   "rowSpan",
	    valign:    "vAlign",
	    datetime:  "dateTime",
	    accesskey: "accessKey",
	    tabindex:  "tabIndex",
	    enctype:   "encType",
	    maxlength: "maxLength",
	    readonly:  "readOnly",
	    longdesc:  "longDesc",
	    cellPadding:  "cellPadding",
	    cellSpacing:  "cellSpacing",
	    more:  "more",
	    less:  "less",
        style: "style"
	};
	
	Object.extend($tom, /** @lends $tom */{ 
		/**
		 * node에 인자로 받은 attributes 속성을 세팅한다.
		 * @function
		 * @param {Element} node
		 * @param {JSON} attributes
		 * @example
		 *  $tom.applyAttributes(inNode, {
		 *		'style': { 'fontSize': null },
		 *		'size': null
		 *	});
		 */
		applyAttributes: function(node, attributes) {
			if(!$tom.isElement(node)) {
				return;
			}
			for(var _name in attributes) {
				if(_name == "style") {
					$tom.applyStyles(node, attributes[_name]);
				} else {
					$tom.setAttribute(node, _name, attributes[_name]);
				}
			}
		},
		/**
		 * node에 인자로 받은 attributes 속성을 제거한다.
		 * @function
		 */
		removeAttributes: function(node, attributes) {
			if(!$tom.isElement(node)) {
				return;
			}
			for(var _name in attributes) {
				if(_name == "style") {
					$tom.removeStyles(attributes[_name])
				} else {
					node.removeAttribute(_name, __IGNORE_NAME_FLAG);
				}
			}
		},
		/**
		 * node에서 attrName을 이름으로 갖는 속성의 값을 반환
		 * @function
		 * @example
		 *  $tx("tx_image").getAttribute("class") // class속성의 값 반환
		 */
		getAttribute: function(node, attrName) {
			if(!$tom.isElement(node)) {
				return _NULL;
			}
			if(node && node.getAttribute) {
				var val = node.getAttribute(__ATTRIBUTE_TRANSLATIONS[attrName] || attrName)
				return (val)? val:_NULL ;
			} else {
				return _NULL;
			}
		},
		/**
		 * node에 attrName를 이름으로, attrValue를 값으로 갖는 속성을 세팅한다.
		 * @function
		 */
		setAttribute: function(node, attrName, attrValue) {
			if(!$tom.isElement(node)) {
				return;
			}
			if(attrValue == _NULL || attrValue.length == 0 || attrValue == 0) {
				node.removeAttribute(attrName, __IGNORE_NAME_FLAG);
			} else {
				if(__ATTRIBUTE_TRANSLATIONS[attrName]) {
					node.setAttribute(__ATTRIBUTE_TRANSLATIONS[attrName], attrValue);
				} else {
					try {
						node[attrName] = attrValue;
					} catch(e) {
                        console.log(e);
						node.setAttribute(__ATTRIBUTE_TRANSLATIONS[attrName] || attrName, attrValue);
					}
				}
			}
		},
        // TODO : refactoring 뭔가 복잡하다.
        setStyles: function(node, styles, overwrite) {
            var nodeCssText = node.style.cssText;
            var canSetStyle;
            var styleToSet = Object.extend({}, styles);
            if (styleToSet.font) {
                if (overwrite) {
                    node.style.font = styleToSet.font;  // 이 부분에서 chrome, opera는 font의 css 속성이 분해된 형태로 적용된다.
                } else if (node.style.cssText.indexOf("font:") == -1) {
                    node.style.cssText = 'font: ' + styleToSet.font + '; ' + node.style.cssText;
                }
                delete styleToSet.font;
            }
            for (var styleName in styleToSet) {
                var styleValue;
                if (_unitCalculator.needCalculation(styleToSet[styleName])) {
                    styleValue = _unitCalculator.calculate(node.style[styleName], styleToSet[styleName]);
                } else {
                    styleValue = styleToSet[styleName];
                }
                if (styleValue == _NULL) {
                    styleValue = "";
                }

                if (styleName == 'float') {
                    styleName = $tx.msie ? 'styleFloat' : 'cssFloat';
                }
                canSetStyle = (!node.style[styleName] && (styleName.indexOf("font") != 0 || nodeCssText.indexOf("font:") == -1)) || overwrite;
                var newTextDecoration = (styleName == "textDecoration") && !node.style[styleName].include(styleValue);
                if (canSetStyle) {
                    node.style[styleName] = styleValue;
                } else if (newTextDecoration) {
                    node.style[styleName] += " " + styleValue;
                }
            }
            $tom._clearUselessStyle(node);
        },
		/**
		 * node에 styles에서 지정한 스타일을 적용한다.
		 * @function
		 * @example
		 *  $tom.applyStyles(node, {
		 * 		'width': width
		 *  });
		 */
		applyStyles: function(node, styles) {
            this.setStyles(node, styles, _TRUE);
        },
        /**
         * node의 style 속성값을 적용하되, 이미 존재하는 속성은 유지된다.
         * @param node
         * @param styles
         */
        addStyles: function(node, styles) {
            this.setStyles(node, styles, _FALSE);
        },
		/**
		 * node에서 styles인자에서 지정한 스타일 속성값을 제거한다. 
		 * @function
		 */
		removeStyles: function(node, styles) {
            // FTDUEDTR-1166
            var cssText = node.style.cssText;
            var orignalCssText = cssText;
			for(var _name in styles) {
                _name = _name.replace(/([A-Z])/g, "-$1");
                cssText = cssText.replace(new RegExp("(^| )" + _name + "\\s*:[^;]+;? ?", "ig"), "");
			}
            if (orignalCssText != cssText) {
                node.style.cssText = cssText;
                $tom._clearUselessStyle(node);
            }
		},
        _clearUselessStyle: function(node) {
            var _attrValue = $tom.getAttribute(node, "style");
            if (!_attrValue) { //remove needless style
                node.removeAttribute("style", __IGNORE_NAME_FLAG);
            }
        },
		/**
		 * node에서 style 속성값 텍스트를 모두 반환한다.
		 * @function
		 */
		getStyleText: function(node) {
            return node.style.cssText;
		},
		/**
		 * node의 style 속성값을 value로 넣는다. 기존에 있는 값은 덮어쓰여진다.
		 * @function
		 * @param {Element} node
		 * @param {String} value style 속성에 바로 세팅할 텍스트 값을 넣어야 함
		 * @example
		 *  $tom.setStyleText($tx("tx_article_category"), "width:50px;height:10px")
		 */
		setStyleText: function(node, value) {
            node.style.cssText = value;
            !value && $tom._clearUselessStyle(node);
		}
	});
})();

Object.extend($tom, /** @lends $tom */{ 
	/**
	 * @private
	 * @function
	 */
	goInto: function(node, toTop) {
		if(!node || !node.scrollIntoView) {
			return;
		}
		node.scrollIntoView(toTop);
	},
	/**
	 * 수직 스크롤 위치값을 반환한다.
	 * @function
	 * @example
	 *  $tom.getScrollTop(document)
	 */
	getScrollTop: function(doc) {
		if(!doc) {
			return 0;
		}
		return doc.documentElement.scrollTop >= 0 ? doc.documentElement.scrollTop : doc.body.scrollTop;
	},
	/**
	 * 수직 스크롤 값을 셋팅한다.
	 * @function
	 * @param {Element} doc
	 * @param {Number} scrollTop 수직 스크롤 값
	 */
	setScrollTop: function(doc, scrollTop) {
		if(!doc) {
			return;
		}
		if(doc.documentElement.scrollTop) {
			doc.documentElement.scrollTop = scrollTop;
		} else {
			doc.body.scrollTop = scrollTop;
		}
	},
	/**
	 * 수평 스크롤 위치값을 반환한다.
	 * @function
	 */
	getScrollLeft: function(doc) {
		if(!doc) {
			return 0;
		}
		return (doc.documentElement.scrollLeft || doc.body.scrollLeft);
	},
	/**
	 * 수평 스크롤 값을 셋팅한다.
	 * @function
	 * @param {Element} doc
	 * @param {Number} scrollLeft 수평 스크롤 값
	 */
	setScrollLeft: function(doc, scrollLeft) {
		if(!doc) {
			return;
		}
		if(doc.documentElement.scrollLeft) {
			doc.documentElement.scrollLeft = scrollLeft;
		} else {
			doc.body.scrollLeft = scrollLeft;
		}
	},
	/**
	 * element요소의 left, top, width, height 값을 계산하여 반환한다.
	 * @function
	 * @return {
	 * 		x: 0,
	 * 		y: 0,
	 * 		width: 0,
	 * 		height: 0
	 * 	}
	 */
	getPosition: function(element, cumulative) {
		if(!element) {
			return {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			};
		}
		cumulative = !!cumulative;
		element = $tx(element);
		var pos = (cumulative)? $tx.cumulativeOffset(element): $tx.positionedOffset(element);
		var dim;
		var display = element.style.display;
		if (display != 'none' && display != _NULL) { //Safari bug
			dim = {
				width: element.offsetWidth,
				height: element.offsetHeight
			};
		} else {
			var els = element.style;
			var originalVisibility = els.visibility;
			var originalPosition = els.position;
			var originalDisplay = els.display;
			els.visibility = 'hidden';
			els.position = 'absolute';
			els.display = 'block';
			var originalWidth = element.clientWidth;
			var originalHeight = element.clientHeight;
			els.display = originalDisplay;
			els.position = originalPosition;
			els.visibility = originalVisibility;
			dim = {
				width: originalWidth,
				height: originalHeight
			};
		}
		return {
			x: pos[0],
			y: pos[1],
			width: dim.width,
			height: dim.height
		};
	},
	/**
	 * node 요소의 width값을 반환한다.
	 * inline style이 px값으로 유효하지 않으면 offset으로 대체한다.
	 * @function
	 */
	getWidth: function(node) {
		var width = node.style["width"];
		if( width.isPx() ){
			return width.parsePx();
		} 
		return node.offsetWidth;
	},
	/**
	 * node 요소 스타일속성의 width 값을 세팅한다.
	 * @function
	 */
	setWidth: function(node, width) {
		$tom.applyStyles(node, {
			'width': width
		});
	},
	/**
	 * node 요소의 height값을 반환한다.
	 * inline style이 px값으로 유효하지 않으면 offset으로 대체한다.
	 * @function
	 */
	getHeight: function(node) {
		var height = node.style["height"];
		if( height.isPx() ){
			return height.parsePx();
		} 
		return node.offsetHeight;
	},
	/**
	 * node 요소 스타일속성의 height 값을 세팅한다.
	 * @function
	 */
	setHeight: function(node, height) {
		$tom.applyStyles(node, {
			'height': height
		});
	},
	/**
	 * @private
	 * @function
	 */
	replacePngPath: function(node) {
		if ($tx.msie6) {
			if(_DOC.location.href.indexOf("http://") > -1) {
				return;
			}
			try {
				var _orgFilter = $tx.getStyle(node, 'filter');
				var _orgSrc = /src='([^']+)'/.exec(_orgFilter)[1];
				if(!_orgSrc || _orgSrc == 'none') {
					return;
				} else if(_orgSrc.indexOf("http://") > -1) {
					return;
				}
				
				var _docPathSlices = _DOC.location.href.split("/");
				_docPathSlices.push("css");
				_docPathSlices.pop();
				_orgSrc = _orgSrc.replace(/\.\.\//g, function() {
					_docPathSlices.pop();
					return "";
				});
				
				var _newSrc = _docPathSlices.join("/") + "/" + _orgSrc;
				node.style.filter = _orgFilter.replace(/src='([^']+)'/, "src='" + _newSrc + "'");
			} catch(e) {alert(e)}
		}
	}
});

Object.extend($tom, /** @lends $tom */{
    /**
     * 편집영역에서 기본 빈 문단에 해당하는 content
     * @constant
     */
    EMPTY_BOGUS: ($tx.msie_quirks || $tx.msie && $tx.msie_ver < 11 ? "&nbsp;" : "<br>")
});

Object.extend($tom, /** @lends $tom */{
    /**
	 * 편집영역에서 기본 빈 문단에 해당하는 HTML
	 * @constant
	 */
    EMPTY_PARAGRAPH_HTML: "<p>" + $tom.EMPTY_BOGUS + "</p>"
});

_WIN.$tom = $tom;
(function(Trex) {
	/**
	 * @namespace
	 * @name Trex.Util
	 */
	Trex.Util = /** @lends Trex.Util */ {
		_dispElIds: [],
		getDispElId: function() {
			var _genId;
			do {
				_genId = "tx_entry_" + (Math.floor(Math.random() * 90000) + 10000) + "_"; //id: 10000~99999
			} while(Trex.Util._dispElIds.contains(_genId));
			Trex.Util._dispElIds.push(_genId);
			return _genId;
		},
		generateKey: function() {
			return parseInt(Math.random() * 100000000);
		},
		toStyleString: function(styles) {
			var _str = [];
			for(var _name in styles) {
				if(styles[_name]) {
					_str.push(_name.replace(/([A-Z])/g, "-$1").toLowerCase());
					_str.push(":");
					_str.push(styles[_name]);
					_str.push(";");
				}
			}
			return _str.join("");
		},
		toAttrString: function(attrs) {
			var _str = [];
			if(TrexConfig.get("imgWidth")) {
				var _imgWidth = TrexConfig.get("imgWidth");
				if (attrs['width']>_imgWidth) {
					attrs['height'] = parseInt(attrs['height']*(_imgWidth/attrs['width']));
					attrs['width'] = _imgWidth;
				}
			}
			for(var _name in attrs) {
				if(attrs[_name]) {
					_str.push(" " + _name + "=\"" + attrs[_name] + "\"");
				}
			}
			return _str.join("");
		},
		getMatchValue: function(reg, html, inx) {
			var _matchs;
			if((_matchs = reg.exec(html)) != _NULL) {
				return _matchs[inx];
			} else {
				return _NULL;
			}
		},
		getAttachmentType: function(mimeType){
			mimeType = (mimeType || "").toLowerCase();

            var imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/tiff',
                'image/gif', 'image/bmp', 'image/x-jg', 'image/ief', 'image/pict',
                'jpg', 'bmp', 'gif', 'png'];

            if (imageMimeTypes.contains(mimeType)) {
                return 'image';
            }
            return 'file';
		},
		/**
		 * 확장자에 따는 thumbnail 이미지 url을 가져온다.
		 * @param {Object} ext
		 */
		thumburl: function(ext) {
			ext = (ext || "").toLowerCase();
			switch (ext) {
				case "doc":
				case "docx":
					return getIconPath("#iconpath/pn_word.gif");
				case "xls":
				case "xlsx":
					return getIconPath("#iconpath/pn_xls.gif");
				case "ppt":
				case "pptx":
					return getIconPath("#iconpath/pn_ppt.gif");
				case "pdf":
					return getIconPath("#iconpath/pn_pdf.gif");
				case "txt":
					return getIconPath("#iconpath/pn_txt.gif");
				case "hwp":
					return getIconPath("#iconpath/pn_hwp.gif");
				case "zip":
				case "rar":
				case "7z":
				case "alz":
					return getIconPath("#iconpath/pn_zip.gif");
				case "mp3":
				case "wav":
				case "ogg":
				case "wma":
				case "ape":
				case "ra":
				case "ram":
					return getIconPath("#iconpath/pn_mp3.gif");
				case "avi":
				case "mpeg":
				case "wmv":
				case "asf":
				case "mp4":
				case "mkv":             
					return getIconPath("#iconpath/pn_movie.gif");
				case "swf":
					return getIconPath("#iconpath/pn_swf.gif");
				case "htm" :
				case "html":
					return getIconPath("#iconpath/pn_html.gif");
				case "jpg":
				case "gif":
				case "png":
				case "bmp":
					return getIconPath("#iconpath/pn_etc.gif");
				default:
					return getIconPath("#iconpath/pn_etc.gif");
			}
		},
		/**
		 * 확장자에 따는 preview 이미지 url을 가져온다.
		 * @param {Object} ext
		 */
		prevurl: function(ext) {
			ext = (ext || "").toLowerCase();
			switch (ext) {
				case "doc":
				case "docx":
					return getIconPath("#iconpath/p_word_s.gif");
				case "xls":
				case "xlsx":
					return getIconPath("#iconpath/p_xls_s.gif");
				case "ppt":
				case "pptx":
					return getIconPath("#iconpath/p_ppt_s.gif");
				case "pdf":
					return getIconPath("#iconpath/p_pdf_s.gif");
				case "txt":
					return getIconPath("#iconpath/p_txt_s.gif");
				case "hwp":
					return getIconPath("#iconpath/p_hwp_s.gif");
				case "zip":
				case "rar":
				case "7z":             
				case "alz":
					return getIconPath("#iconpath/p_zip_s.gif");
				case "mp3":
				case "wav":
				case "ogg":
				case "wma":
				case "ape":
				case "ra":
				case "ram":
				case "m4a":
					return getIconPath("#iconpath/p_mp3_s.gif");
				case "avi":
				case "mpeg":
				case "wmv":
				case "asf":
				case "mp4":
				case "mkv":             
					return getIconPath("#iconpath/p_movie_s.gif");
				case "swf":
					return getIconPath("#iconpath/p_swf_s.gif");
				case "htm" :
				case "html":
					return getIconPath("#iconpath/p_html_s.gif");
				case "jpg":
					return getIconPath("#iconpath/p_jpg_s.gif");
				case "gif":
					return getIconPath("#iconpath/p_gif_s.gif");
				case "png":
				case "bmp":
					return getIconPath("#iconpath/p_png_s.gif");
				default:
					return getIconPath("#iconpath/p_etc_s.gif");
			}
		},
		getMatchedClassName: function(element, classes){
			var matched = _FALSE;
			var _class = "";
			for(var i = 0; i < classes.length; i++){
				_class = classes[i];
				if($tx.hasClassName(element, _class)){
					matched = _class;
					break;
				}
			}
			return matched;
		},
		getAllAttributesFromEmbed: function(embedSrc){
			var map = {};
			embedSrc = embedSrc.replace(/<embed|>/ig,"");
			try {
				var regSplit = /(\w+)=((?:\")[^\"]+(?:\"|$)|(?:')[^']+(?:'|$)|(?:[^\"'][^ \n]+($| |\n)))/ig;
                var result;
				while( (result = regSplit.exec(embedSrc)) != _NULL ){
					map[result[1].trim().toLowerCase()] = result[2].replace(/^(\"|')/i,"").replace(/(\"|')$/i,"").trim();
				}
			}catch(e){ }

			return map;
		},
		getAllAttributes: function(source){
			var _map = {};
			var _matchsAttr;

			var _reg = /style="(?:\s*|(?:[^"]*(?:;\s*)))width\s*:\s*([0-9]+)px[^"]*"/ig;
			while ((_matchsAttr = _reg.exec(source)) != _NULL) {
				_map["width"] = _matchsAttr[1];
			}
			_reg = /style="(?:\s*|(?:[^"]*(?:;\s*)))height\s*:\s*([0-9]+)px[^"]*"/ig;
			while ((_matchsAttr = _reg.exec(source)) != _NULL) {
				_map["height"] = _matchsAttr[1];
			}
			_reg = new RegExp("\\s+([a-zA-Z\-]+)=\"([^\"]*)\"", "g");
			while ((_matchsAttr = _reg.exec(source)) != _NULL) {
				if (!_map[_matchsAttr[1].toLowerCase()]) {
					_map[_matchsAttr[1].toLowerCase()] = _matchsAttr[2];
				}
			}
			_reg = new RegExp("\\s+([a-zA-Z\-]+)='([^']*)'", "g");
			while ((_matchsAttr = _reg.exec(source)) != _NULL) {
				if (!_map[_matchsAttr[1].toLowerCase()]) {
					_map[_matchsAttr[1].toLowerCase()] = _matchsAttr[2];
				}
			}
			_reg = new RegExp("\\s+([a-zA-Z\-]+)=([^\\s>]*)", "g");
			while ((_matchsAttr = _reg.exec(source)) != _NULL) {
				if (!_map[_matchsAttr[1].toLowerCase()]) {
					_map[_matchsAttr[1].toLowerCase()] = _matchsAttr[2];
				}
			}
			return _map;
		}
	};

	/**
	 * @namespace
	 * @name Trex.HtmlCreator
	 */
	Trex.HtmlCreator = {
		/**
		 * Create Table Markup String
		 *
		 *  @example
		 *  var items =[
		 *  		{
		 *  			klass: 'klassName',
		 *  			image: 'image url', // can be omitted
		 *  			data: 'data'
		 *  		}
		 *  	]
		 *
		 *	var tableMarkup = Trex.HtmlCreator.createTableMarkup(row, col, item);
		 *
		 * @param {int} rows
		 * @param {int} cols
		 * @param {Object} items
		 *
		 */
		createTableMarkup: function(rows, cols, items){
			var _html = [];
			_html.push('<table unselectable="on">');
			_html.push('<tbody>');

			var _total = items.length;
			var _item;
            for (var row = 0; row < rows; row++) {
				_html.push('<tr>');
                for (var col = 0; col < cols; col++) {
                    if (row * cols + col < _total) {
                        _item = items[row * cols + col];
                        if (_item.image) {
                            var imageUrl = TrexConfig.getIconPath(_item.image); //글상자 > 직접선택 > 선스타일 이미지.
                            _html.push('<td class="tx-menu-list-item"><a href="javascript:;"><span class="' + (_item.klass || '') + '"><img src="' + imageUrl + '" data="' + _item.data + '"/></span></a></td>');
                        } else {
                            _html.push('<td class="tx-menu-list-item"><a href="javascript:;"><span class="' + (_item.klass || '') + '">' + _item.data + '</span></a></td>');
                        }
                    } else {
                        _html.push('<td class="tx-menu-list-item"><a href="javascript:;"><span class="">&nbsp;</span></a></td>');
                    }
                }
				_html.push('</tr>');
			}
			_html.push('</tbody>');
			_html.push('</table>');
			return _html.join("\n");
		}
	};

	Trex.String = {
		escapeQuot: function(str) {
			return str.replace(new RegExp('"', "g"), "&quot;").replace(new RegExp("'", "g"), "&#39;");
		},
		unescapeQuot: function(str) {
			return str.replace(new RegExp("&quot;", "gi"), '"').replace(new RegExp("&#39;", "g"), "'");
		},
		htmlspecialchars: function(str) {
			return Trex.String.escapeQuot(str.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;").replace(new RegExp(">", "g"), "&gt;"));
		},
		unHtmlspecialchars: function(str) {
			return Trex.String.unescapeQuot(str.replace(new RegExp("&amp;", "gi"), "&").replace(new RegExp("&lt;", "gi"), "<").replace(new RegExp("&gt;", "gi"), ">"));
		},
		parseAttribute: function(elStr, attrName){
			var regAttribute1 = new RegExp("(^|\\W)" + attrName + '="([^"]*)"', "gi");
			var regAttribute2 = new RegExp("(^|\\W)" + attrName + "='([^']*)'", "gi");
			var regAttribute3 = new RegExp("(^|\\W)" + attrName + "=([^\\s>]*)", "gi");
            var result;
			if (result = regAttribute1.exec(elStr)) {
				return result[2];
			}else if (result = regAttribute2.exec(elStr)) {
				return result[2];
			}else if (result = regAttribute3.exec(elStr)) {
				return result[2];
			}else {
				return "";
			}
		},
		changeAttribute: function(elStr, attrName, currentValue, value ){
			var regAttribute1 = new RegExp("(^|\\W)(" + attrName + '=")' + currentValue + '(")', "gi");
			var regAttribute2 = new RegExp("(^|\\W)(" + attrName + "=')" + currentValue + "(')", "gi");
			var regAttribute3 = new RegExp("(^|\\W)(" + attrName + "=)"+currentValue, "gi");
			var regAttribute4 = new RegExp("<([\\w]+\\s*)", "gi");
			var _exists = _FALSE;
			if (elStr.search(regAttribute1) > -1) {
				_exists = _TRUE;
				elStr = elStr.replace(regAttribute1, "$1$2"+value+"$3");
			}
			if (elStr.search(regAttribute2) > -1) {
				_exists = _TRUE;
				elStr = elStr.replace(regAttribute2, "$1$2"+value+"$3");
			}
			if (elStr.search(regAttribute3) > -1) {
				_exists = _TRUE;
				elStr = elStr.replace(regAttribute3, "$1$2"+value);
			}
			if(!_exists) {
				elStr = elStr.replace(regAttribute4, "<$1" + attrName + '=' + value + ' ');
			}
			return elStr;
		}
	};

	/*---- Trex.Validator ------------------------------------------------------*/
	Trex.Validator = Trex.Class.create({
		initialize: function() { },
		strip: function(content) {
			return content.stripTags().replace(/&nbsp;/g, "").replace(Trex.__WORD_JOINER_REGEXP, "").trim();
		},
		exists: function(content) {
			if(!content) {
				return _FALSE;
			}
			if(this.strip(content) == "") {
				if(content.search(/<(img|iframe|object|embed|table|hr|script|TXDB)/i) < 0) {
					return _FALSE;
				}
			}
			return _TRUE;
		},
		equals: function(content, text) {
			if(!content || !text) {
				return _FALSE;
			}
			if(content.search(/<(img|iframe|object|embed|table|hr|script|TXDB)/i) < 0) {
				if(this.strip(content) == this.strip(text)) {
					return _TRUE;
				}
			}
			return _FALSE;
		}
	});

	/*---- Trex.Repeater ------------------------------------------------------*/
	Trex.Repeater = Trex.Class.create({
		initialize: function(execHandler) {
			this.execHandler = execHandler;
		},
		start: function(term) {
			if(this.tItv) {
				this.clear();
			}
			this.tItv = _WIN.setInterval(this.onTimer.bind(this), term);
		},
		clear: function() {
			_WIN.clearInterval(this.tItv);
			this.tItv = _NULL;
		},
		onTimer: function() {
			if(this.execHandler != _NULL) {
				this.execHandler();
			}
		}
	});

	/*---- Trex.Timer ------------------------------------------------------*/
	Trex.Timer = Trex.Class.create({
		initialize: function(execHandler) {
			this.execHandler = execHandler;
		},
		start: function(term) {
			_WIN.setTimeout(this.onTimer.bind(this), term);
		},
		onTimer: function() {
			if(this.execHandler != _NULL) {
				this.execHandler();
			}
		}
	});

	/**
	 * Trex.Paging Class
	 * paging을 위한 class. Ajax나 fileter 등을 통한 dynamic data바인딩은 고려되지 않음. static array로만 사용이 가능
	 * @class
	 * @param {Array} data
	 * @param {Object} config
	  */
	Trex.Paging = Trex.Class.create({
		$const:{
			DEFAULT_PAGE_SIZE: 5,
			DEFAULT_BLOCK_SIZE:10
		},
		initialize: function(data, config ){
			this.data = data;
			this.currentpage = config.initPage || 1;
			this.totalrow = config.totalrow || this.getTotalRow();
			this.pagesize = config.pagesize || Trex.Paging.DEFAULT_PAGE_SIZE;
			this.blocksize = config.blocksize || Trex.Paging.DEFAULT_PAGE_SIZE;
			this.totalpage = Math.ceil( this.totalrow / this.pagesize );
			this.totalblock = Math.ceil( this.totalpage / this.blocksize );
		},
		getNextPage: function(){
			return (this.currentpage < this.totalpage)?this.currentpage+1:0;
		},
		getPrevPage: function(){
			return (this.currentpage > 1)?this.currentpage-1:0;
		},
		getNextBlock: function(){
			var _currentblock = Math.ceil(this.currentpage/this.blocksize);
			return ( _currentblock < this.totalblock)?_currentblock * this.blocksize + 1:0
		},
		getPrevBlock: function(){
			var _currentblock = Math.ceil(this.currentpage/this.blocksize);
			return (_currentblock > 1)?(_currentblock-2) * this.blocksize + 1:0;
		},
		getPageList: function(){
			var pages = [];
			var _startBlock = Math.ceil( this.currentpage / this.blocksize ) - 1;
			var _startPage = ( _startBlock * this.blocksize + 1 );
			var _endPage = Math.min( this.totalpage, (_startPage + this.blocksize - 1) );
			for ( var i = _startPage; i <= _endPage; i++ ){
				pages.push(i);
			}

			return pages;
		},
		movePage: function( page ){
			this.currentpage = page || this.currentpage;
		},
		getOnePageData: function(){
			var result = [];
			var _start = (this.currentpage-1) * this.pagesize;
			var _end = Math.min( this.currentpage * this.pagesize, this.totalrow ) ;
			for( var i = _start; i < _end; i++ ){
				result.push( this.data[i] );
			}

			return result;
		},
		getTotalRow: function(){
			return this.data.length;
		}
	});

	/**
	 * Trex.Slidebar Class
	 * slidebar 위젯. 마크업, CSS에 의존성이 있다.
	 * @class
	 * @param {Object} config
	  */
	Trex.Slidebar = Trex.Class.create({
		initialize: function(config){
			/* config = {
			 * 		handler: function, 슬라이드가 동작할때 실행될 함수
			 * 		elContext: 슬라이드가 제어될 영역, div등의 element
			 * 		knoWidth: knob element의 크기
			 * 		barSize: 슬라이드 element의 크기
			 * 		min: 최소값(논리적인 값, default 0)
			 *  	max: 최대값(논리적인 값, default 100)
			 *  	interval: 한번 클릭이나 마우스 드래그로 이동하는 값(논리적인 값, default 5)
			 * 		defaultValue: 초기 knob이 위치할 값
			 * }
			 */
			this.elContext = config.el;
			this.knobWidth =  config.knobWidth;
			this.isDisabled = _FALSE;
			this.handler = function(value){
				if (!this.isDisabled && typeof config.handler == "function") {
					config.handler(value);
				}
			};

			this.logicObj = {
				'interval': config.interval || 5 ,
				'min': config.min || 0,
				'max': config.max || 100
			};
			this.physicObj = {
				'min':0,
				'width': config.barSize || 100
			};
			this.physicObj.max = this.physicObj.width - this.knobWidth;
			this.physicObj.interval = this.logicObj.interval * this.physicObj.max / this.logicObj.max;

			this.startPos = 0;
			this.startX = 0;
			this.isDrag = _FALSE;
			this.result = 0;

			var elMenu = $tom.collect( this.elContext, "dd.tx-slide" );
			// 양끝단에 min값과 max값이 표시 될 수도 있다.
			$tom.collect( elMenu, "span.tx-slide-min" ).innerHTML = "";
			$tom.collect( elMenu, "span.tx-slide-max" ).innerHTML = "";

			/* default 값 셋팅하는 부분이 필요하다? */
			this.bindEvent();
			this.setKnobPosition(config.defaultValue || config.min || 0);
		},
		regenerate: function( value ){
			value = parseInt(value * this.physicObj.width / this.logicObj.max);
			this.setKnobPosition(value);
		},
		bindEvent: function(){
			var elMenu = $tom.collect( this.elContext, "dd.tx-slide" );
			var elPrev = $tom.collect( elMenu, "a.tx-slide-prev" );
			var elNext = $tom.collect( elMenu, "a.tx-slide-next" );
			var elBar = $tom.collect( elMenu, "div.tx-slide-bar" );
			var elKnob = this.elKnob = $tom.collect( elMenu, "div.tx-slide-knob" );

			$tx.observe( elKnob, "mousedown", function(ev){
				this.isDrag = _TRUE;
				this.startPos = this.getKnobPosition();
				this.startX = ev.clientX;
				$tx.stop(ev);
			}.bind(this));

			$tx.observe( elKnob, "mouseup", function(){
				this.isDrag = _FALSE;
			}.bind(this));

			$tx.observe( this.elContext, "mousemove", function(ev){
				if ( this.isDrag ){
					this.setKnobPosition( this.startPos +  ev.clientX - this.startX);
					$tx.stop(ev);
					this.handler( this.result );
				}
			}.bind(this));

			$tx.observe( elPrev, "click", function(ev){
				var count = Math.round(this.physicObj.interval) - 1;
				var that = this;
				var moveLeft = function(){
					var pos = that.getKnobPosition();
					that.setKnobPosition( pos - 1);
					if ( count-- > 0 ) {
						setTimeout(moveLeft, 10 );
					}else{
						that.handler(that.result);
					}
				};
				moveLeft();
				$tx.stop(ev);
			}.bind(this));

			$tx.observe( elNext, "click", function(ev){
				var count = Math.round(this.physicObj.interval);
				var that = this;
				var moveRight = function(){
					var pos = that.getKnobPosition();
					that.setKnobPosition( pos + 1);
					if ( --count > 0 ) {
						setTimeout(moveRight, 10 );
					}else{
						that.handler(that.result);
					}
				};
				moveRight();
				$tx.stop(ev);
			}.bind(this));

			$tx.observe( this.elContext, "mouseup", function(){
				if ( this.isDrag ) {
					this.isDrag = _FALSE;
				}
			}.bind(this));
			$tx.observe( elKnob, "click", function(ev){
				$tx.stop(ev);
			}.bind(this));

			$tx.observe( elBar, "click", function(ev){
				if ( !this.isDrag ) {
					var x = ev.layerX || ev.x;
					this.setKnobPosition( x - this.knobWidth / 2);
					this.handler( this.result );
				}
			}.bind(this));
		},
		getKnobPosition: function(){
			var pos = $tx.getStyle( this.elKnob, "left");
			return pos.parsePx();
		},
		setKnobPosition: function(value){
			value = (value < this.physicObj.max)?value:this.physicObj.max;
			value = (value > this.physicObj.min)?value:this.physicObj.min;
			$tx.setStyle( this.elKnob, {left: value.toPx()});

			this.result = Math.round( value * this.logicObj.interval / this.physicObj.interval );
		},
		setDisable: function(){
			this.isDisabled = _TRUE;
		},
		setEnable: function(){
			this.isDisabled = _FALSE;
		},
		getDisabled: function(){
			return this.isDisabled;
		}
	});


	/**
	 * Trex.DynamicSizer Class
	 * table의 가로세로 사이즈를 마우로 제어할 수 있는 위젯.
	 * @class
	 * @param {Object} config
	  */
	Trex.DynamicSizer = Trex.Class.create({
		initialize: function(config){
			/* config = {
			 * 		el: //다이나믹 사이저가 실릴 영역
			 * 		clickHandler : 클릭됐을때
			 * 		moveHandler: 사이즈가 변경됐을 때
			 */
			this.config = config;
			this.wrapper = config.el;
			this.elEventContext = tx.div({className:"tx-dynamic-sizer-context"});
			this.currentSize = {row: 0, col: 0};
			this.dynamicSizingEnabled = _TRUE;

			if( !config.moveHandler ){
				config.moveHandler = function(){}
			}
			if( !config.clickHandler ){
				config.clickHandler = function(){}
			}

			this.wrapper.appendChild( this.elEventContext );
			this.previewTable = new Trex.DynamicSizer.PreviewTable({
				parentEl: this.elEventContext,
				mouseOverHandler: this.changeSize.bind(this),
				mouseClickHandler: this.selectSize.bind(this)
			});
		},
		clear: function(){
			this.dynamicSizingEnabled = _TRUE;
			this.changeSize(0,0);
		},
		changeSize: function(row, col){
			if (this.dynamicSizingEnabled) {
				this.currentSize.row = row;
				this.currentSize.col = col;

				this._changeSelectionSize(row, col);
				this.config.moveHandler(row, col);
			}
		},
		_changeSelectionSize: function(row, col){
			this.previewTable.moveSelectionPos(row, col);
		},
		toggleDynamicSizing: function(){
			this.dynamicSizingEnabled = !this.dynamicSizingEnabled;
			if ( this.dynamicSizingEnabled ){
				this.selection.enableResize();
			}else{
				this.selection.disableResize();
			}
		},
		selectSize:function(ev){
			this.config.clickHandler( ev, this.currentSize);
		},
		getCurruentSize: function(){
			return this.currentSize;
		}
	});

    Trex.DynamicSizer.PreviewTable = Trex.Class.create({
        $const:{
            DEFAULT_TD_STYLE:{
            },
            DEFAULT_TABLE_PROPERTY:{
                cellpadding: "0",
                cellspacing: "1"
            },
            MAX_SIZE: { COL:10, ROW:10 }
        },
        initialize: function(config){
            this.config = config;
            this.elTable = _NULL;

            this.elTable = this.generateTable("tx-event");
            this.elSelection = tx.div( {className:"tx-selection"}, this.generateTable("tx-selection") );
            var tablePanel = this.generateTable("tx-panel");

            this.eventBinding();
            config.parentEl.appendChild( this.elTable );
            config.parentEl.appendChild( this.elSelection );
            config.parentEl.appendChild( tablePanel );

            var pos = $tom.getPosition( this.elTable );
            var PROPERTY = Trex.DynamicSizer.PreviewTable.MAX_SIZE;
            this.cellSize = { width: Math.round((pos.width - pos.x) / PROPERTY.COL),
                                height: (pos.height - pos.y) / PROPERTY.ROW }
        },
        generateTable: function(className){
            var tbody = tx.tbody();
            var PROPERTY = Trex.DynamicSizer.PreviewTable;
            for (var i = 0; i < PROPERTY.MAX_SIZE.ROW; i++) {
                var tr = tx.tr();
                for (var j = 0; j < PROPERTY.MAX_SIZE.COL; j++) {
                    var td = tx.td(tx.div( {
                        style: PROPERTY.DEFAULT_TD_STYLE
                    }));
                    td = this.setCoordToAttr(td, j+1, i+1);
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
            var table = tx.table(PROPERTY.DEFAULT_TABLE_PROPERTY);
            $tx.addClassName( table, className || "" );
            table.appendChild( tbody );
            return table;
        },
        moveSelectionPos: function(row,col){
            var width = ( col * this.cellSize.width).toPx();
            var height = ( row * this.cellSize.height).toPx();
            $tx.setStyle( this.elSelection, { width: width, height:height } );
        },
        setCoordToAttr: function(element, col, row){
            element.setAttribute("col", col);
            element.setAttribute("row", row);
            return element;
        },
        getCoordFromAttr: function(element){
            return {
                col: element.getAttribute("col") || 0,
                row: element.getAttribute("row") || 0
            }
        },
        eventBinding: function(){
            // 외부에서 받은 event핸들러들로 binding시킴
            this.mouseOverHandler = this.config.mouseOverHandler;
            this.mouseClickHandler = this.config.mouseClickHandler;
            var self = this;
            var _mouseOverHandler = function(ev){
                var element = $tx.element(ev) || {};
                var tagName = (element.tagName || "").toUpperCase();
                if (element && tagName == "TD" ) {
                    var coord = self.getCoordFromAttr(element);
                    self.mouseOverHandler(coord.row, coord.col);
                }
                $tx.stop(ev);
            };
            var _mouseClickHandler = function(ev){
                self.mouseClickHandler(ev);
            };
            $tx.observe(this.elTable, "mouseover", _mouseOverHandler);
            $tx.observe(this.elTable, "click", _mouseClickHandler);
        }
    });

    /*---- Trex.ImageScale ------------------------------------------------------*/
    Trex.ImageScale = Trex.Class.create({
        initialize: function(data, handler) {
            if(!data.imageurl) {
                return;
            }
            if(data.actualwidth) {
                return;
            }
            var _loadHandler = function(width, height) {
                data.actualwidth = width;
                data.actualheight = height;
                if(handler) {
                    handler(width, height);
                }
            };

            setTimeout(function() {
                var _tmpImage = new Image();
                _tmpImage.onerror = function() {
                    _tmpImage = _NULL;
                };
                if( _tmpImage.onreadystatechange ) { //IE
                    _tmpImage.onreadystatechange = function() {
                        if(this.readyState == "complete") {
                            _loadHandler(this.width, this.height);
                            _tmpImage = _NULL;
                        }
                    };
                } else {
                    _tmpImage.onload = function() {
                        _loadHandler(this.width, this.height);
                        _tmpImage = _NULL;
                    };
                }
                _tmpImage.src = data.imageurl;
            }, 10);
        }
    });

    function getIconPath(virtualPath) {
        var realPath = TrexConfig.getIconPath(virtualPath);
        return realPath + "";
    }

})(Trex);

/**
 * XmlHttpRequest객체를 생성하고 이 객체를 이용해 ajax request를 수행한다.
 * @class
 */
Trex.I.XHRequester = Trex.Faculty.create(/** @lends Trex.I.XHRequester */{ 
	/**
	 * 브라우져에 맞는 XmlHttpRequest 객체를 생성해서 리턴한다.
	 * @private
	 * @return {Object} XmlHttpRequest object
	 */
	createXMLHttp: function() {
		var _xmlHttp = _NULL;
		try{
			if(_WIN.XMLHttpRequest) {
				_xmlHttp = new XMLHttpRequest();
			} else if (_WIN.ActiveXObject) {
				_xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
				if(!_xmlHttp) {
					_xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
				}
			}
			return _xmlHttp;
		}catch(e){
			return _NULL;
		}
	},
	/**
	 * ajax call를 수행한다
	 * @param {String} method - http request의 방식, "get" 또는 "post" 
	 * @param {String} url - request를 날릴 url 
	 * @param {Boolean} async - synchronous 여부 
	 * @param {Function} successHandler - ajax의 성공시의 핸들러 
	 * @param {Function} failHandler - ajax 실패시이의 핸들러  
	 * @example
	 * this.sendRequest("get","http://www.daum.net/api",true,function(value){alert(value)}, function(){alert('fail');} 
	 */
	sendRequest: function(method, url, param, async, successHandler, failHandler) { 
		if (url == _NULL && url != "") {
			return _NULL;
		}
		
		var _response = _NULL;
		var _xmlHttp = this.createXMLHttp();
		if(_xmlHttp == _NULL) {
			return _NULL;
		}
		
		var handler = function(){
			if (_xmlHttp.status == 200) {
				if (method.toUpperCase() == "HEAD") {
					_response = successHandler(_xmlHttp.getAllResponseHeaders());
				} else {
					_response = successHandler(_xmlHttp.responseText);
				}
			} else {
				_response = failHandler(_xmlHttp.status);
			}
			_xmlHttp = _NULL;
		};
		try{
			if (async) {
				_xmlHttp.onreadystatechange = function(){
					if (_xmlHttp.readyState == 4) {
						handler();			
					}
				};
			}
			if(method.toUpperCase() == "POST") {
				_xmlHttp.open("POST", url, async);
				_xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
				_xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                //webkit 오류발생
//				_xmlHttp.setRequestHeader("Content-Length", param.length);
//				_xmlHttp.setRequestHeader("Connetion","close");
				_xmlHttp.send(param);
			} else {
				if(param && param.length > 0) {
					url = url + ((url.indexOf("?") > -1)? "&": "?") + param;
				}
				_xmlHttp.open(method.toUpperCase(), url, async);
				_xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				_xmlHttp.send(_NULL);
			}
			
			if (!async) {
				handler();
			}
			return _response;
		}catch(e){
			return _NULL; 
		}
	}
});

Trex.Responder = { 
	callbacks: {},
	process: function(/*bytesLoaded, bytesTotal*/) {
		//if(bytesLoaded < 0) {
			// fail
		//} else {
			// progress
		//}
	},
	newKey: function() {
		var _key = "exe_" + Math.floor(Math.random() * 100000);
		if(this[_key]) {
			return this.newKey();
		} else {
			return _key;
		}
	},
	register: function(handler) {
		var _key = this.newKey();
		this.callbacks[_key] = function(response) {
			handler.apply(this, Array.prototype.slice.call(arguments,0));
			this.callbacks[_key] = _NULL;
		}.bind(this);
		return _key;
	}
};

/**
 * 동적으로 외부의 javascript파일을 include한다. 
 * @class
 */
Trex.I.JSRequester = Trex.Faculty.create(/** @lends Trex.I.JSRequester */{ 
	/**
	 * 특정위치의 스크립트 파일을 include 한다.
	 * @param {String} url - http request의 방식, "get" 또는 "post" 
	 * @param {String} encoding - inlcude할 javascript의 encoding 타입
	 * @param {Element} context - 로딩된 스크립트가 표시될 dom element
	 * @param {Function} success - ajax의 성공시의 핸들러
	 * @example
	 * this.importScript("http://www.daum.net/api/movie.js?apikey=1234","utf-8", document, function(){alert("hello");} ) 
	 */
	importScript: function(url, encoding, context, success) { 
		if (url == _NULL && url != "") {
			return _NULL;
		}
		encoding = encoding || "utf-8";
		context = context || _DOC;
		try{
			var head = context.getElementsByTagName("head")[0] || context.documentElement;
			var script = context.createElement("script");
			script.type = "text/javascript";
			script.charset = encoding;
			script.src= url;
						
			var done = _FALSE;
			script.onload = script.onreadystatechange = function() {
				if ( !done && (!this.readyState ||
						this.readyState === "loaded" || this.readyState === "complete") ) {
					done = _TRUE;
					if (success) {
						success();
					}

					// Handle memory leak in IE
					script.onload = script.onreadystatechange = _NULL;
					if ( head && script.parentNode ) {
						head.removeChild( script );
					}
				}
			};
			head.insertBefore( script, head.firstChild );
		}catch(e){
			console.log(e)
		}
	}
});
_WIN.$stop = {};
_WIN.$propagate = {};
/**
 * 에디터에 정의된 custom 이벤트들을 발생시키고 등록된 이벤트 핸들러들을 실행시킨다.
 * custom 이벤트를 발생시키거나 혹은 custom 이벤트 발생시 핸들러를 실행시키기 위해서는 이 클래스를 minxin 받아야 한다. 
 * @class
 */
Trex.I.JobObservable = Trex.Faculty.create(/** @lends Trex.I.JobObservable */{
	/**
	 * @private
	 */
	jobObservers: {},
	/**
	 * custom 이벤트가 발생하는지를 관찰하는 observer를 등록한다.
	 * @param {String} name - custom 이벤트의 이름 
	 * @param {Function} observer - custom 이벤트 발생시 실행될 handler
	 * @example
	 * canvas.observeJob(Trex.Ev.__CANVAS_HEIGHT_CHANGE, function(){alert('canvas의 크기가 변했네요')}) 
	 * cinema.observeJob("cinema_on_paste", function(){alert('영화가 첨부되었네요')}) 
	 */
	observeJob: function(name, observer) {
		if(!this.jobObservers[name]) {
			this.jobObservers[name] = [];
		}
		this.jobObservers[name].push(observer);
	},
	reserveJob: function(name, observer, delay) {
		delay = delay || 500;
		if(!this.jobObservers[name]) {
			this.jobObservers[name] = [];
		}
		var _self = this;
		this.jobObservers[name].push(function() {
			var args = $A(arguments);
			setTimeout(function() {
				observer.apply(_self, args);
			}, delay);
		});
	},
    removeJob: function(name, observe){
        if(!this.jobObservers[name])
            return;
        if(!observe){
            this.jobObservers[name].length = 0;
        }else {
            for(var i = 0 ; i < this.jobObservers[name].length; i++){
                if(this.jobObservers[name][i]===observe){
                    this.jobObservers[name].splice(i,1);
                }
            }
        }

    },
	/**
	 * custom 이벤트를 발생시킨다. 이때 발생시킨 이벤트는 observerJob를 통해 등록된 observer들에게 전파된다.
	 * @param {String} name - custom 이벤트의 이름 
	 * @example
	 * canvas.observeJob(Trex.Ev.__CANVAS_HEIGHT_CHANGE, function(){alert('canvas의 크기가 변했네요')}) 
	 * cinema.observeJob("cinema_on_paste", function(){alert('영화가 첨부되었네요')}) 
	 */
	fireJobs: function(name) {
		var _self = this;
		var args = $A(arguments).slice(1);
		if(!this.jobObservers[name]) {
			return;
		}
        if (_WIN['DEBUG']) {
            this.jobObservers[name].each(function(observer) {
                observer.apply(_self, args);
            });
        } else {
            try {
                this.jobObservers[name].each(function(observer) {
                    observer.apply(_self, args);
                });
            } catch (e) {
                if(e != $stop) { throw e; }
            }
        }

	}
});

/**
 * 에디터에서 custom key이벤트들을 발생시키고 등록된 이벤트 핸들러들을 실행시킨다.
 * custom key 이벤트를 발생시키거나 혹은 custom key 이벤트 발생시 핸들러를 실행시키기 위해서는 이 클래스를 minxin 받아야 한다. 
 * @class
 */
Trex.I.KeyObservable = Trex.Faculty.create(/** @lends Trex.I.KeyObservable */{
	/**
	 * @private
	 */
	keyObservers: {},
	/**
	 * custom 이벤트가 발생하는지를 관찰하는 observer를 등록한다.
	 * @param {Object} keys - 이벤트가 발생하길 원하는 키의 조합 {ctrlKey:T, altKey:F, shiftKey:T, keyCode:17} 
	 * @param {Function} observer - 해당 이벤트 발생시 실행될 handler
	 * @param {Boolean=} isBubble - 해당 이벤트가 bubble인지 여부
	 * @example
	 * canvas.observeKey({ctrlKey:'T', altKey:'F', keyCode:32}, function(){alert('ctrl + 32키가 눌렸네요.')}) 
	 */
	observeKey: function(keys, observer, isBubble) {
		var _name = function(keys) {
			return (keys.ctrlKey? 'T': 'F') + (keys.altKey? 'T': 'F') + (keys.shiftKey? 'T': 'F') + "_" + keys.keyCode;
		}(keys);
		if(!this.keyObservers[_name]) {
			this.keyObservers[_name] = [];
		}
        if(isBubble){
            observer._bubble = _TRUE;
        }
		this.keyObservers[_name].push(observer);
	},
	/**
	 * 사용자가 정의한 custom key event를 발생시킨다. 이때 발생시킨 이벤트는 observerKey를 통해 등록된 observer들에게 전파된다.
	 * @param {Object} ev - 사용자가 정의한 key의 pushed 상태 객체
     * @param {Boolean=} isBubble
	 * @example
	 * canvas.fireKyes({ctrlKey:'T', altKey:'F', keyCode:32}), function(){alert('영화가 첨부되었네요')}) 
	 */
	fireKeys: function(ev, isBubble) {
		var _name = function(ev) {
			return (ev.ctrlKey? 'T': 'F') + (ev.altKey? 'T': 'F') + (ev.shiftKey? 'T': 'F') + "_" + ev.keyCode;
		}(ev);
		if(!this.keyObservers[_name]) {
			return;
		}
		var _self = this;
		var eventStopped = _FALSE;
		var stopEventOnce = function() {
			if (!eventStopped) {
				$tx.stop(ev);
				eventStopped = _TRUE;
			}
		};
		this.keyObservers[_name].each(function(observer) {
			try {
				observer.apply(_self, [ev]);
                !(observer._bubble||isBubble)&&stopEventOnce();
			} catch (e1) {
				if(e1 === $stop) {
					stopEventOnce();
				} else if (e1 !== $propagate) {
					console.log(e1, e1.stack);
				}
			}
		});
	},
	registerKeyEvent: function(el) {
		try {
			$tx.observe(el, 'keydown', this.fireKeys.bind(this), _TRUE);
		} catch(e) {}
	}
});

/**
 * 마우스클릭이나 방향키를 이용해 특정 엘리먼트에 포커스가 갔을 경우 등록된 handler를 실행시킨다.  
 * @class
 */
Trex.I.ElementObservable = Trex.Faculty.create(/** @lends Trex.I.ElementObservable */{
	elementObservers: {},
	/**
	 * 선택되길 원하는 element를 등록한다 .
	 * @param {Object} layer - 관찰하기를 원하는 element의 tag name과 class name {tag: 'div', klass: 'txc-textbox'}
	 * @param {Function} observer - 원하는 엘리먼트가 선택되었을때 실행되길 원하는 handler  
	 * @example
	 * canvas.observeElement({tag:'div', klass: 'txc-textbox'}), function(){alert("div.txc-textbox가 선택되었네요.")})
	 */
	observeElement: function(layer, observer) {
		if(layer == _NULL) { //all
			this.observeElement({ tag: "*tx-final-body*"}, observer);
		} else if (layer.length) {
			for (var i = 0; i < layer.length; i++) {
				var item = layer[i];
				this.observeElement(item, observer);
			}
		} else {
			if (!this.elementObservers[layer.tag]) {
				this.elementObservers[layer.tag] = {};
			}
			if (!layer.klass) {
				layer.klass = "*tx-all-class*";
			}
			if (!this.elementObservers[layer.tag][layer.klass]) {
				this.elementObservers[layer.tag][layer.klass] = [];
			}
			this.elementObservers[layer.tag][layer.klass].push(observer);
		}
	},
	/**
	 * 특정 element가 선택되었을때 그 element가 선택되길 기다린 observer들에게 알려준다. 
	 * 해당하는 observer들은 handler를 실행시킨다.
	 * @param {Element} node - 선택된 node
	 * @example
	 * canvas.fireElements(document.body)
	 */
	fireElements: function(node) {
		if(!node) {
			return;
		} 
		var _node = node;
		var args = $A(arguments).slice(1);
		
		var _self = this;
		try {
			var _observers;
			if($tom.kindOf(_node, 'img,hr,table,button,iframe')) {
				_observers = this.collectObserverByElement(_node.nodeName.toLowerCase(), _node.className);
				if(_observers) {
					_observers.each(function(observer) {
						observer.apply(_self, [_node].concat(args));
					});	
				}
			} else {
				while (_node) {
					_observers = this.collectObserverByElement(_node.nodeName.toLowerCase(), _node.className);
					if(_observers) {
						_observers.each(function(observer) {
							observer.apply(_self, [_node].concat(args));
						});	
					}
					if($tom.isBody(_node)) {
						break;
					}
					_node = $tom.parent(_node);
				}
			}
			
		} catch (e) {
			if(e != $stop) { throw e; }
		}
		this.fireFinally();
	},
	fireFinally: function() {
		var _self = this;
		var args = $A(arguments).slice(1);
		var _observers = this.collectObserverByElement("*tx-final-body*");
		if(_observers) {
			_observers.each(function(observer) {
				observer.apply(_self, [_NULL].concat(args));
			});	
		}
	},
	collectObserverByElement: function(tag, klass) {
		if(!this.elementObservers[tag]) {
			return _NULL;
		}

		var _observers = [];
		klass = klass || "";
		if(klass != "") {
			var _classes = klass.split(" ");
			for(var _klass in this.elementObservers[tag]) {
				if(_classes.contains(_klass)) {
					_observers.push(this.elementObservers[tag][_klass]);
				}
			}
		}
		if (this.elementObservers[tag]["*tx-all-class*"]) {
			_observers.push(this.elementObservers[tag]["*tx-all-class*"]);
		}
		return _observers.flatten();
	}
});

Trex.I.MouseoverObservable = Trex.Faculty.create(/** @lends Trex.I.MouseoverObservable */{
	mouseoverObservers: {},
	/**
	 * 선택되길 원하는 element를 등록한다 .
	 * @param {Object} selector - 관찰하기를 원하는 element의 tag name과 class name {tag: 'div', klass: 'txc-textbox'}
	 * @param {Function} successObserver - 원하는 엘리먼트가 선택되었을때 실행되길 원하는 handler
	 * @param {Function} failObserver
	 * @example
	 * canvas.observeElement({tag:'div', klass: 'txc-textbox'}), function(){alert("div.txc-textbox가 선택되었네요.")})
	 */
	observeMouseover: function(selector, successObserver, failObserver) {
		if (!this.mouseoverObservers[selector]) {
			this.mouseoverObservers[selector] = {
				'success': [],
				'fail': [],
				'flag': _FALSE
			}	
		}
		this.mouseoverObservers[selector]['success'].push(successObserver);
		if ( failObserver ){
			this.mouseoverObservers[selector]['fail'].push(failObserver);
		}
	},
	fireMouseover: function(node) {
		if(!node) { return;	} 
		var _node = node;
		var _self = this;
		
		try {
			for (var i in this.mouseoverObservers){
				this.mouseoverObservers[i].flag = _FALSE;
			}
			while (_node) {
				var _observers = this.collectMouseoverObserver(_node);
				if(_observers.length > 0) {
					var _nodePos = this.getPositionByNode(_node);
					_observers.each(function(observer) {
						observer.apply(_self, [_node, _nodePos]);
					});	
				}
				if($tom.isBody(_node)) {
					break;
				}
				_node = $tom.parent(_node);
			}
		} catch (e) {
			if(e != $stop) { throw e; }
		}
		this.runMouseoverFailHandler();	
	},
	runMouseoverFailHandler: function(){
		var _failHandlers = [];
		for (var i in this.mouseoverObservers){
			if ( !this.mouseoverObservers[i].flag ){
				_failHandlers.push( this.mouseoverObservers[i]['fail'] );
			}
		}
		
		_failHandlers.flatten().each( function(handler){
			handler();
		});
	},
	collectMouseoverObserver: function(node) {
		var _observers = [];
		var klass = node.className || "";
		var tag = node.tagName;
		
		if ( tag ){
			tag = tag.toLowerCase();
			if ( this.mouseoverObservers[tag] ){
				_observers.push( this.mouseoverObservers[tag]['success'] );
				this.mouseoverObservers[tag]['flag'] = _TRUE;
			}
		}
		
		if(klass != "") {
			var _classes = klass.split(" ");
			for(var i = 0, len = _classes.length; i < len; i++ ){
				var key = tag + "." + _classes[i];
				if ( this.mouseoverObservers[key] ) {
					_observers.push(this.mouseoverObservers[key]['success']);
					this.mouseoverObservers[key]['flag'] = _TRUE;
				}
			}
			
		}
		return _observers.flatten();
	}
});

/*---- Trex.I.Runnable ------------------------------------------------------*/
Trex.I.Runnable = Trex.Faculty.create({
	isRunning: _FALSE,
	repeater: _NULL,
	threads: [],
	startThread: function(term) {
		if (this.repeater) {
			this.repeater.clear();
		} else {
			this.repeater = new Trex.Repeater(this.runThread.bind(this));
		}
		this.repeater.start(term);
	},
	stopThread: function() {
		this.repeater.clear();
	},
	runThread: function() {
		if(this.isRunning) {
			return;
		}
		if(this.threads.length > 0) {
			this.isRunning = _TRUE;
			(this.threads.shift())();
			this.isRunning = _FALSE;
		}
	},
	putThread: function(thread, important) {
		if(important) {
			this.threads.unshift(thread);
		} else {
			this.threads.push(thread);
		}
	}
});
// Height auto resizing
_WIN.autoResizeHeight = function ( fixedWidth, heightOffset) {
    var win = window.top;
	if (typeof fixedWidth == 'number') {
		//fixedWidth += $tx.gecko ? 16 : 0;  
		var __STATUSBAR_SIZE = 50;
		var __SCROLLBAR_SIZE = 30;
		var __ASSUMPTION_MIN_HEIGHT = 300;
		if ( !heightOffset ) heightOffset = 0;
	

		var dl = self.document.documentElement;
	
		var diff = {}, pos = {x:0, y:0};
		var left = (win.screenLeft)?win.screenLeft:win.screenX;
		var top = (win.screenTop)?win.screenTop:win.screenY;
		
		win.resizeTo( fixedWidth, __ASSUMPTION_MIN_HEIGHT);
	
		var contentScreentHeight = (dl.clientHeight == dl.scrollHeight && dl.scrollHeight != dl.offsetHeight )?dl.offsetHeight:dl.scrollHeight;
		var contentScreentWidth = (dl.clientWidth == dl.scrollWidth && dl.scrollWidth != dl.offsetWidth )?dl.offsetWidth:dl.scrollWidth;
		if(contentScreentHeight > dl.clientHeight) {
			diff.height = contentScreentHeight - dl.clientHeight;
		}else{ // for chrome -_-
			diff.width = 8;
			diff.height = dl.clientHeight - contentScreentHeight + 35;
		}
		pos.y = Math.min(screen.availHeight - contentScreentHeight - top - __STATUSBAR_SIZE,0) ;
		pos.x = Math.min(screen.availWidth - contentScreentWidth - left - __SCROLLBAR_SIZE,0);
		
		if ( pos.x || pos.y ) {
			if (!$tx.chrome) {
				win.moveBy(pos.x, pos.y);
			} 
			win.resizeTo( fixedWidth, __ASSUMPTION_MIN_HEIGHT );
		}
		setTimeout(function() {
			win.resizeBy(0, diff.height + heightOffset);
		},20)
	} else {
		setTimeout(function() {
			var obj = fixedWidth;
			if(!obj)obj = document.getElementsByTagName('HTML')[0];
			var doc = document.getElementsByTagName('HTML')[0];
			var clientW = doc.clientWidth||doc.scrollWidth;
			var clientH = doc.clientHeight||doc.scrollHeight;
			var offsetW = obj.offsetWidth||obj.scrollWidth;
			var offsetH = obj.offsetHeight||obj.scrollHeight;
			//alert( clientW + " : " + clientH + " / " + offsetW + " : " + offsetH )   
		    var gapWidth = offsetW - clientW ;
		    var gapHeight = offsetH - clientH;
		    if(gapWidth || gapHeight) {
		        win.resizeBy(gapWidth,gapHeight);
		    }
		}, 100);
	}
};

_WIN.Querystring = function (query) {
	
	this.params = new Object();
	this.get = function(key, defaultValue) {
		if (defaultValue == _NULL) {
			defaultValue = _NULL;
		}
		var value = this.params[key];
		if (value == _NULL) {
			value = defaultValue;
		}
		return value;
	};
	this.getUTF8 = function(key, defaultValue) {
		if (defaultValue == _NULL) {
			defaultValue = _NULL;
		}
		var value = unescape(this.params[key]);
		if (value == _NULL) {
			value = defaultValue;
		}
	return value;
	};
	
	var qs;
	if (query) {
		qs = query;
	}else {
		qs = location.search.substring(1, location.search.length)
	}
	
	if (qs.length == 0) {
		return;
	}
	
	qs = qs.replace(/\+/g, ' ');
	var args = qs.split('&');
	
	for (var i = 0; i < args.length; i++) {
		var value;
		var pair = args[i].split('=');
		var name = unescape(pair[0]);
		
		if (pair.length == 2) {
			value = pair[1];
		} else {
			value = name;
		}
		this.params[name] = value;
	}
};

_WIN.qs = new Querystring();

_WIN.closeWindow = function () {
	completeAttach();
	
	top.opener = self;
	top.close();
	
	var _opener;
	if (opener && !opener.closed) {
		_opener = opener;
	}else{
		_opener = parent.opener;
	}
	if(_opener.Editor) {
		_opener.Editor.focus();	
	} else {
		_opener.focus();
	}
};

_WIN.stripTags = function (str) {
	return str.replace(/<\/?[^>]+>/gi, '');
};

_WIN.getAttacher = function (name) {
	return PopupUtil.getOpener().Editor.getSidebar().getAttacher(name);
};

_WIN.getEmbeder = function (name) {
	return PopupUtil.getOpener().Editor.getSidebar().getEmbeder(name);
};

_WIN.registerAction = function (attacher) {
	if(!attacher) {
		return; 
	}
	window.execAttach = attacher.attachHandler;
};

_WIN.registerSearch = function (searcher) {
	if(!searcher) {
		return; 
	}
	window.execSearch = searcher.insertHandler;	
};

_WIN.registerEmded = function (embeder) {
	if(!embeder) {
		return; 
	}
	window.execEmbed = embeder.embedHandler;
};

_WIN.modifyResult = function () {}; //For Theme
_WIN.completeAttach = function () {}; //For Theme

_WIN.existEntry = function (attacher) {
	if(!attacher) {
		return _FALSE;
	}
	return attacher.existEntry();
};

_WIN.getFirstEntryData = function (attacher) {
	if(!attacher) {
		return _FALSE;
	}
	return attacher.getFirstEntryData();
};
_WIN.getAttrOfElement = function ( elementStr, attrName ) {
	var regExp = new RegExp(attrName+"=['\"]?([^\"'>]*)[\"' ]","i");
	var result = regExp.exec( elementStr );
	
	if ( result) {
		return result[1];
	}else{
		return _NULL;
	}
};
_WIN.getParamValOfObjectTag = function ( objectStr, paramName ) {
	var regExp = new RegExp("<param([^>]*)name=['\"]"+paramName+"['\"]([^>]*)>","gi");
	var result = regExp.exec(objectStr, "gi");
	var value = _NULL;
	
	if ( result ) {
		regExp = new RegExp("value=['\"]([^>'\"]*)['\"]", "gi");
		value = regExp.exec( result[0] );
		if ( value ) {
			return value[1];
		}
	}
	
	return _NULL;
};
_WIN.PopupUtil = {
	getOpener : function() {
		var _opener;
		if(opener && opener.Editor) {
			_opener = opener;
		} else if(parent.opener && parent.opener.Editor) {
			_opener = parent.opener;
		} else if(opener.opener && opener.opener.Editor) {
			_opener = opener.opener;
		}
		return _opener;
	}		
};

_WIN.getDateFormat = function (date, format) {
	date = date ? date.trim() : '';
	if ((date.length != 8) || (date.indexOf('0') == 0)) return '';
	var year = date.substr(0, 4) + (format || '년 ');
	var _m = (date.substr(4, 2).indexOf('0') == 0) ? date.substr(5, 1) : date.substr(4, 2);
	var _d = (date.substr(6, 2).indexOf('0') == 0) ? date.substr(7, 1) : date.substr(6, 2);
	var month = (_m != '0') ? _m + (format || '월 ') : '';
	var day = ( _d != '0') ? (_d + (format ? '' : '일')) : '';
	return year + month + day;
};

_WIN.getDashedDateFormat = function (date) {
	date = date.trim();
	if (date.length != 8 || date.indexOf('00') == 0) return '';
	var yy = removeZero(date.substr(0, 4), '');
	var mm = removeZero(date.substr(4, 2), '-');
	var dd = removeZero(date.substr(6, 2), '-');
	return yy + mm + dd;
};

_WIN.removeZero = function (number, fmt) {
	return (number.indexOf('00') == 0) ? '' : fmt + number;
};

_WIN.getYearFormat = function (date) {
	date = date.trim() || '';
	if (date.length != 8) return "";
	return date.substr(0, 4) + '년 ';
};

_WIN.getDayFormat = function (date) {
	try {
		date = date.trim();
		if (date.length != 8) return date;
		var d = new Date(date.substr(0, 4), date.substr(4, 2) - 1, date.substr(6, 2));
		var dayFormat = ['일', '월', '화', '수', '목', '금', '토'];
		return dayFormat[d.getDay()];
	} catch(e) {}
	return '';
};

_WIN.stripBracket = function (text) {
	var splitText = text.trim().split(',');
	var result = [];
	splitText.each(function(txt) {
		result.push(txt.replace(/\[\[[\w]*\]\]/, ''));
	});
	return result.join(', ');
};

_WIN.getFieldJson = function (name, value) {
	if (value)
		return {name: name, value: value.stripTags()};
	return _NULL;
};

if (typeof Editor !== "undefined") Editor.version = "7.5.11-2-ga008ba5";
try {
    EditorJSLoader.readyState = 'complete';
    EditorJSLoader.finish();
} catch(e) {
}
})();