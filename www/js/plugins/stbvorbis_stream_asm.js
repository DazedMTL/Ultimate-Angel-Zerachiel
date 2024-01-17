var Module = typeof Module !== "undefined" ? Module : {};
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
Module["arguments"] = [];
Module["thisProgram"] = "./this.program";
Module["quit"] = function (status, toThrow) {
  throw toThrow;
};
Module["preRun"] = [];
Module["postRun"] = [];
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === "object";
ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
ENVIRONMENT_IS_NODE =
  typeof process === "object" &&
  typeof require === "function" &&
  !ENVIRONMENT_IS_WEB &&
  !ENVIRONMENT_IS_WORKER;
ENVIRONMENT_IS_SHELL =
  !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
var scriptDirectory = "";
function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  } else {
    return scriptDirectory + path;
  }
}
if (ENVIRONMENT_IS_NODE) {
  scriptDirectory = __dirname + "/";
  var nodeFS;
  var nodePath;
  Module["read"] = function shell_read(filename, binary) {
    var ret;
    ret = tryParseAsDataURI(filename);
    if (!ret) {
      if (!nodeFS) nodeFS = require("fs");
      if (!nodePath) nodePath = require("path");
      filename = nodePath["normalize"](filename);
      ret = nodeFS["readFileSync"](filename);
    }
    return binary ? ret : ret.toString();
  };
  Module["readBinary"] = function readBinary(filename) {
    var ret = Module["read"](filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };
  if (process["argv"].length > 1) {
    Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/");
  }
  Module["arguments"] = process["argv"].slice(2);
  if (typeof module !== "undefined") {
    module["exports"] = Module;
  }
  process["on"]("uncaughtException", function (ex) {
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });
  process["on"]("unhandledRejection", function (reason, p) {
    process["exit"](1);
  });
  Module["quit"] = function (status) {
    process["exit"](status);
  };
  Module["inspect"] = function () {
    return "[Emscripten Module object]";
  };
} else if (ENVIRONMENT_IS_SHELL) {
  if (typeof read != "undefined") {
    Module["read"] = function shell_read(f) {
      var data = tryParseAsDataURI(f);
      if (data) {
        return intArrayToString(data);
      }
      return read(f);
    };
  }
  Module["readBinary"] = function readBinary(f) {
    var data;
    data = tryParseAsDataURI(f);
    if (data) {
      return data;
    }
    if (typeof readbuffer === "function") {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, "binary");
    assert(typeof data === "object");
    return data;
  };
  if (typeof scriptArgs != "undefined") {
    Module["arguments"] = scriptArgs;
  } else if (typeof arguments != "undefined") {
    Module["arguments"] = arguments;
  }
  if (typeof quit === "function") {
    Module["quit"] = function (status) {
      quit(status);
    };
  }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WEB) {
    if (document.currentScript) {
      scriptDirectory = document.currentScript.src;
    }
  } else {
    scriptDirectory = self.location.href;
  }
  if (scriptDirectory.indexOf("blob:") !== 0) {
    scriptDirectory = scriptDirectory.split("/").slice(0, -1).join("/") + "/";
  } else {
    scriptDirectory = "";
  }
  Module["read"] = function shell_read(url) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.send(null);
      return xhr.responseText;
    } catch (err) {
      var data = tryParseAsDataURI(url);
      if (data) {
        return intArrayToString(data);
      }
      throw err;
    }
  };
  if (ENVIRONMENT_IS_WORKER) {
    Module["readBinary"] = function readBinary(url) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(xhr.response);
      } catch (err) {
        var data = tryParseAsDataURI(url);
        if (data) {
          return data;
        }
        throw err;
      }
    };
  }
  Module["readAsync"] = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
        onload(xhr.response);
        return;
      }
      var data = tryParseAsDataURI(url);
      if (data) {
        onload(data.buffer);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };
  Module["setWindowTitle"] = function (title) {
    document.title = title;
  };
} else {
}
var out =
  Module["print"] ||
  (typeof console !== "undefined"
    ? console.log.bind(console)
    : typeof print !== "undefined"
    ? print
    : null);
var err =
  Module["printErr"] ||
  (typeof printErr !== "undefined"
    ? printErr
    : (typeof console !== "undefined" && console.warn.bind(console)) || out);
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
moduleOverrides = undefined;
var STACK_ALIGN = 16;
function staticAlloc(size) {
  var ret = STATICTOP;
  STATICTOP = (STATICTOP + size + 15) & -16;
  return ret;
}
function dynamicAlloc(size) {
  var ret = HEAP32[DYNAMICTOP_PTR >> 2];
  var end = (ret + size + 15) & -16;
  HEAP32[DYNAMICTOP_PTR >> 2] = end;
  if (end >= TOTAL_MEMORY) {
    var success = enlargeMemory();
    if (!success) {
      HEAP32[DYNAMICTOP_PTR >> 2] = ret;
      return 0;
    }
  }
  return ret;
}
function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN;
  var ret = (size = Math.ceil(size / factor) * factor);
  return ret;
}
function getNativeTypeSize(type) {
  switch (type) {
    case "i1":
    case "i8":
      return 1;
    case "i16":
      return 2;
    case "i32":
      return 4;
    case "i64":
      return 8;
    case "float":
      return 4;
    case "double":
      return 8;
    default: {
      if (type[type.length - 1] === "*") {
        return 4;
      } else if (type[0] === "i") {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 === 0);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}
function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}
var asm2wasmImports = {
  "f64-rem": function (x, y) {
    return x % y;
  },
  debugger: function () {
    debugger;
  },
};
var jsCallStartIndex = 1;
var functionPointers = new Array(0);
function addFunction(func, sig) {
  var base = 0;
  for (var i = base; i < base + 0; i++) {
    if (!functionPointers[i]) {
      functionPointers[i] = func;
      return jsCallStartIndex + i;
    }
  }
  throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
}
function removeFunction(index) {
  functionPointers[index - jsCallStartIndex] = null;
}
var funcWrappers = {};
function getFuncWrapper(func, sig) {
  if (!func) return;
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}
function makeBigInt(low, high, unsigned) {
  return unsigned
    ? +(low >>> 0) + +(high >>> 0) * 4294967296
    : +(low >>> 0) + +(high | 0) * 4294967296;
}
function dynCall(sig, ptr, args) {
  if (args && args.length) {
    return Module["dynCall_" + sig].apply(null, [ptr].concat(args));
  } else {
    return Module["dynCall_" + sig].call(null, ptr);
  }
}
var Runtime = { dynCall: dynCall };
var GLOBAL_BASE = 8;
var ABORT = 0;
var EXITSTATUS = 0;
function assert(condition, text) {
  if (!condition) {
    abort("Assertion failed: " + text);
  }
}
var globalScope = this;
function getCFunc(ident) {
  var func = Module["_" + ident];
  assert(
    func,
    "Cannot call unknown function " + ident + ", make sure it is exported"
  );
  return func;
}
var JSfuncs = {
  stackSave: function () {
    stackSave();
  },
  stackRestore: function () {
    stackRestore();
  },
  arrayToC: function (arr) {
    var ret = stackAlloc(arr.length);
    writeArrayToMemory(arr, ret);
    return ret;
  },
  stringToC: function (str) {
    var ret = 0;
    if (str !== null && str !== undefined && str !== 0) {
      var len = (str.length << 2) + 1;
      ret = stackAlloc(len);
      stringToUTF8(str, ret, len);
    }
    return ret;
  },
};
var toC = { string: JSfuncs["stringToC"], array: JSfuncs["arrayToC"] };
function ccall(ident, returnType, argTypes, args, opts) {
  function convertReturnValue(ret) {
    if (returnType === "string") return Pointer_stringify(ret);
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}
function cwrap(ident, returnType, argTypes, opts) {
  argTypes = argTypes || [];
  var numericArgs = argTypes.every(function (type) {
    return type === "number";
  });
  var numericRet = returnType !== "string";
  if (numericRet && numericArgs && !opts) {
    return getCFunc(ident);
  }
  return function () {
    return ccall(ident, returnType, argTypes, arguments, opts);
  };
}
function setValue(ptr, value, type, noSafe) {
  type = type || "i8";
  if (type.charAt(type.length - 1) === "*") type = "i32";
  switch (type) {
    case "i1":
      HEAP8[ptr >> 0] = value;
      break;
    case "i8":
      HEAP8[ptr >> 0] = value;
      break;
    case "i16":
      HEAP16[ptr >> 1] = value;
      break;
    case "i32":
      HEAP32[ptr >> 2] = value;
      break;
    case "i64":
      (tempI64 = [
        value >>> 0,
        ((tempDouble = value),
        +Math_abs(tempDouble) >= +1
          ? tempDouble > +0
            ? (Math_min(+Math_floor(tempDouble / +4294967296), +4294967295) |
                0) >>>
              0
            : ~~+Math_ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / +4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[ptr >> 2] = tempI64[0]),
        (HEAP32[(ptr + 4) >> 2] = tempI64[1]);
      break;
    case "float":
      HEAPF32[ptr >> 2] = value;
      break;
    case "double":
      HEAPF64[ptr >> 3] = value;
      break;
    default:
      abort("invalid type for setValue: " + type);
  }
}
function getValue(ptr, type, noSafe) {
  type = type || "i8";
  if (type.charAt(type.length - 1) === "*") type = "i32";
  switch (type) {
    case "i1":
      return HEAP8[ptr >> 0];
    case "i8":
      return HEAP8[ptr >> 0];
    case "i16":
      return HEAP16[ptr >> 1];
    case "i32":
      return HEAP32[ptr >> 2];
    case "i64":
      return HEAP32[ptr >> 2];
    case "float":
      return HEAPF32[ptr >> 2];
    case "double":
      return HEAPF64[ptr >> 3];
    default:
      abort("invalid type for getValue: " + type);
  }
  return null;
}
var ALLOC_NORMAL = 0;
var ALLOC_STACK = 1;
var ALLOC_STATIC = 2;
var ALLOC_DYNAMIC = 3;
var ALLOC_NONE = 4;
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === "number") {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === "string" ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [
      typeof _malloc === "function" ? _malloc : staticAlloc,
      stackAlloc,
      staticAlloc,
      dynamicAlloc,
    ][allocator === undefined ? ALLOC_STATIC : allocator](
      Math.max(size, singleType ? 1 : types.length)
    );
  }
  if (zeroinit) {
    var stop;
    ptr = ret;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[ptr >> 2] = 0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[ptr++ >> 0] = 0;
    }
    return ret;
  }
  if (singleType === "i8") {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0,
    type,
    typeSize,
    previousType;
  while (i < size) {
    var curr = slab[i];
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == "i64") type = "i32";
    setValue(ret + i, curr, type);
    if (previousType !== type) {
      typeSize = getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
function getMemory(size) {
  if (!staticSealed) return staticAlloc(size);
  if (!runtimeInitialized) return dynamicAlloc(size);
  return _malloc(size);
}
function Pointer_stringify(ptr, length) {
  if (length === 0 || !ptr) return "";
  var hasUtf = 0;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(ptr + i) >> 0];
    hasUtf |= t;
    if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = "";
  if (hasUtf < 128) {
    var MAX_CHUNK = 1024;
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(
        String,
        HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK))
      );
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  return UTF8ToString(ptr);
}
function AsciiToString(ptr) {
  var str = "";
  while (1) {
    var ch = HEAP8[ptr++ >> 0];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}
function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}
var UTF8Decoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(u8Array, idx) {
  var endPtr = idx;
  while (u8Array[endPtr]) ++endPtr;
  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var u0, u1, u2, u3, u4, u5;
    var str = "";
    while (1) {
      u0 = u8Array[idx++];
      if (!u0) return str;
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      u1 = u8Array[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1);
        continue;
      }
      u2 = u8Array[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u3 = u8Array[idx++] & 63;
        if ((u0 & 248) == 240) {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
        } else {
          u4 = u8Array[idx++] & 63;
          if ((u0 & 252) == 248) {
            u0 = ((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4;
          } else {
            u5 = u8Array[idx++] & 63;
            u0 =
              ((u0 & 1) << 30) |
              (u1 << 24) |
              (u2 << 18) |
              (u3 << 12) |
              (u4 << 6) |
              u5;
          }
        }
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
      }
    }
  }
}
function UTF8ToString(ptr) {
  return UTF8ArrayToString(HEAPU8, ptr);
}
function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 192 | (u >> 6);
      outU8Array[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 224 | (u >> 12);
      outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 128 | (u & 63);
    } else if (u <= 2097151) {
      if (outIdx + 3 >= endIdx) break;
      outU8Array[outIdx++] = 240 | (u >> 18);
      outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 128 | (u & 63);
    } else if (u <= 67108863) {
      if (outIdx + 4 >= endIdx) break;
      outU8Array[outIdx++] = 248 | (u >> 24);
      outU8Array[outIdx++] = 128 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 5 >= endIdx) break;
      outU8Array[outIdx++] = 252 | (u >> 30);
      outU8Array[outIdx++] = 128 | ((u >> 24) & 63);
      outU8Array[outIdx++] = 128 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 128 | (u & 63);
    }
  }
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343)
      u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
    if (u <= 127) {
      ++len;
    } else if (u <= 2047) {
      len += 2;
    } else if (u <= 65535) {
      len += 3;
    } else if (u <= 2097151) {
      len += 4;
    } else if (u <= 67108863) {
      len += 5;
    } else {
      len += 6;
    }
  }
  return len;
}
var UTF16Decoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
function UTF16ToString(ptr) {
  var endPtr = ptr;
  var idx = endPtr >> 1;
  while (HEAP16[idx]) ++idx;
  endPtr = idx << 1;
  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;
    var str = "";
    while (1) {
      var codeUnit = HEAP16[(ptr + i * 2) >> 1];
      if (codeUnit == 0) return str;
      ++i;
      str += String.fromCharCode(codeUnit);
    }
  }
}
function stringToUTF16(str, outPtr, maxBytesToWrite) {
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 2147483647;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2;
  var startPtr = outPtr;
  var numCharsToWrite =
    maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    var codeUnit = str.charCodeAt(i);
    HEAP16[outPtr >> 1] = codeUnit;
    outPtr += 2;
  }
  HEAP16[outPtr >> 1] = 0;
  return outPtr - startPtr;
}
function lengthBytesUTF16(str) {
  return str.length * 2;
}
function UTF32ToString(ptr) {
  var i = 0;
  var str = "";
  while (1) {
    var utf32 = HEAP32[(ptr + i * 4) >> 2];
    if (utf32 == 0) return str;
    ++i;
    if (utf32 >= 65536) {
      var ch = utf32 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
function stringToUTF32(str, outPtr, maxBytesToWrite) {
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 2147483647;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 55296 && codeUnit <= 57343) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
    }
    HEAP32[outPtr >> 2] = codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  HEAP32[outPtr >> 2] = 0;
  return outPtr - startPtr;
}
function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
    len += 4;
  }
  return len;
}
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}
function demangle(func) {
  return func;
}
function demangleAll(text) {
  var regex = /__Z[\w\d_]+/g;
  return text.replace(regex, function (x) {
    var y = demangle(x);
    return x === y ? x : x + " [" + y + "]";
  });
}
function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    try {
      throw new Error(0);
    } catch (e) {
      err = e;
    }
    if (!err.stack) {
      return "(no stack trace available)";
    }
  }
  return err.stack.toString();
}
function stackTrace() {
  var js = jsStackTrace();
  if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
  return demangleAll(js);
}
var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;
var MIN_TOTAL_MEMORY = 16777216;
function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}
var HEAP,
  buffer,
  HEAP8,
  HEAPU8,
  HEAP16,
  HEAPU16,
  HEAP32,
  HEAPU32,
  HEAPF32,
  HEAPF64;
function updateGlobalBuffer(buf) {
  Module["buffer"] = buffer = buf;
}
function updateGlobalBufferViews() {
  Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
  Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
  Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer);
}
var STATIC_BASE, STATICTOP, staticSealed;
var STACK_BASE, STACKTOP, STACK_MAX;
var DYNAMIC_BASE, DYNAMICTOP_PTR;
STATIC_BASE =
  STATICTOP =
  STACK_BASE =
  STACKTOP =
  STACK_MAX =
  DYNAMIC_BASE =
  DYNAMICTOP_PTR =
    0;
staticSealed = false;
function abortOnCannotGrowMemory() {
  abort(
    "Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " +
      TOTAL_MEMORY +
      ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or (4) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 "
  );
}
if (!Module["reallocBuffer"])
  Module["reallocBuffer"] = function (size) {
    var ret;
    try {
      if (ArrayBuffer.transfer) {
        ret = ArrayBuffer.transfer(buffer, size);
      } else {
        var oldHEAP8 = HEAP8;
        ret = new ArrayBuffer(size);
        var temp = new Int8Array(ret);
        temp.set(oldHEAP8);
      }
    } catch (e) {
      return false;
    }
    var success = _emscripten_replace_memory(ret);
    if (!success) return false;
    return ret;
  };
function enlargeMemory() {
  var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
  var LIMIT = 2147483648 - PAGE_MULTIPLE;
  if (HEAP32[DYNAMICTOP_PTR >> 2] > LIMIT) {
    return false;
  }
  var OLD_TOTAL_MEMORY = TOTAL_MEMORY;
  TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY);
  while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR >> 2]) {
    if (TOTAL_MEMORY <= 536870912) {
      TOTAL_MEMORY = alignUp(2 * TOTAL_MEMORY, PAGE_MULTIPLE);
    } else {
      TOTAL_MEMORY = Math.min(
        alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, PAGE_MULTIPLE),
        LIMIT
      );
    }
  }
  var replacement = Module["reallocBuffer"](TOTAL_MEMORY);
  if (!replacement || replacement.byteLength != TOTAL_MEMORY) {
    TOTAL_MEMORY = OLD_TOTAL_MEMORY;
    return false;
  }
  updateGlobalBuffer(replacement);
  updateGlobalBufferViews();
  return true;
}
var byteLength;
try {
  byteLength = Function.prototype.call.bind(
    Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get
  );
  byteLength(new ArrayBuffer(4));
} catch (e) {
  byteLength = function (buffer) {
    return buffer.byteLength;
  };
}
var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
if (TOTAL_MEMORY < TOTAL_STACK)
  err(
    "TOTAL_MEMORY should be larger than TOTAL_STACK, was " +
      TOTAL_MEMORY +
      "! (TOTAL_STACK=" +
      TOTAL_STACK +
      ")"
  );
if (Module["buffer"]) {
  buffer = Module["buffer"];
} else {
  {
    buffer = new ArrayBuffer(TOTAL_MEMORY);
  }
  Module["buffer"] = buffer;
}
updateGlobalBufferViews();
function getTotalMemory() {
  return TOTAL_MEMORY;
}
function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == "function") {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === "number") {
      if (callback.arg === undefined) {
        Module["dynCall_v"](func);
      } else {
        Module["dynCall_vi"](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function")
      Module["preRun"] = [Module["preRun"]];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
  runtimeExited = true;
}
function postRun() {
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function")
      Module["postRun"] = [Module["postRun"]];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce(
    "writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!"
  );
  var lastChar, end;
  if (dontAddNull) {
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar;
}
function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    HEAP8[buffer++ >> 0] = str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[buffer >> 0] = 0;
}
function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32
    ? 2 * Math.abs(1 << (bits - 1)) + value
    : Math.pow(2, bits) + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits - 1)) : Math.pow(2, bits - 1);
  if (value >= half && (bits <= 32 || value > half)) {
    value = -2 * half + value;
  }
  return value;
}
var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_max = Math.max;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function getUniqueRunDependency(id) {
  return id;
}
function addRunDependency(id) {
  runDependencies++;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
}
function removeRunDependency(id) {
  runDependencies--;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
var memoryInitializer = null;
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
  return String.prototype.startsWith
    ? filename.startsWith(dataURIPrefix)
    : filename.indexOf(dataURIPrefix) === 0;
}
var ASM_CONSTS = [];
STATIC_BASE = GLOBAL_BASE;
STATICTOP = STATIC_BASE + 3392;
__ATINIT__.push();
memoryInitializer =
  "data:application/octet-stream;base64,AAAAAAAAAAAAAQICAwMDAwQEBAQEBAQEAAEAAIAAAABWAAAAQAAAAD605DMJkfMzi7IBNDwgCjQjGhM0YKkcNKfXJjRLrzE0UDs9NHCHSTQjoFY0uJJkNFVtczSIn4E0/AuKNJMEkzRpkpw0Mr+mND+VsTSTH7005GnJNK2A1jQ2ceQ0pknzNIiMATXA9wk1Bu8SNXZ7HDXApiY1N3sxNdoDPTVeTEk1O2FWNblPZDX8JXM1inmBNYbjiTV82ZI1hWScNVKOpjUzYbE1Jei8NdwuyTXOQdY1QS7kNVcC8zWPZgE2T88JNvXDEjaYTRw26HUmNjJHMTZ0zDw2XhFJNmUiVjbODGQ2uN5yNpdTgTYcu4k2cq6SNq82nDaBXaY2NS2xNsewvDbk88g2AQPWNmDr4zYeu/I2okABN+umCTfxmBI3yR8cNx5FJjc9EzE3HpU8N2/WSDei41U398ljN4mXcjevLYE3vpKJN3SDkjfmCJw3viymN0f5sDd5ebw3/rjIN0fE1TeSqOM3+HPyN8AaATiTfgk4+W0SOAbyGzhiFCY4Vt8wONhdPDiSm0g48qRVODOHYzhuUHI40weBOGtqiTiCWJI4KtubOAn8pThoxbA4O0K8OCl+yDighdU42WXjOOgs8jjp9AA5RlYJOQ5DEjlRxBs5teMlOX+rMDmiJjw5xWBIOVNmVTmDRGM5aAlyOQHigDkkQok5nS2SOXutmzljy6U5mZGwOQ0LvDlmQ8g5C0fVOTIj4znt5fE5Hc8AOgUuCTowGBI6qZYbOhWzJTq3dzA6fO87OgomSDrHJ1U65gFjOnjCcTo7vIA66RmJOsYCkjrbf5s6y5qlOthdsDrv07s6swjIOogI1Tqf4OI6B5/xOlypADvQBQk7Xu0ROw9pGzuEgiU7/UMwO2e4Ozth60c7TelUO12/Yjuce3E7f5aAO7rxiDv515E7R1KbO0FqpTsnKrA74py7OxLOxzsXytQ7IJ7iOzVY8TumgwA8p90IPJjCETyCOxs8AVIlPFQQMDxhgTs8yLBHPOWqVDzofGI81DRxPM9wgDyWyYg8Oq2RPMAkmzzFOaU8hfavPOVluzyCk8c8uYvUPLRb4jx5EfE8+10APYm1CD3flxE9Ag4bPY0hJT253C89bUo7PUB2Rz2RbFQ9hTpiPSLucD0qS4A9f6GIPYiCkT1I95o9WAmlPfLCrz34Lrs9A1nHPW1N1D1cGeI90crwPVs4AD53jQg+M20RPpDgGj4n8SQ+LqkvPocTOz7KO0c+TS5UPjf4YT6Ep3A+jyWAPnN5iD7iV5E+3MmaPvnYpD5tj68+G/i6PpUexz4zD9Q+F9fhPj2E8D7GEgA/cmUIP5NCET8rsxo/zsAkP7F1Lz+y3Do/ZQFHPx3wUz/7tWE/+2BwPwAAgD9PZ2dTLi9zdGJfdm9yYmlzLmMAZi0+YWxsb2MuYWxsb2NfYnVmZmVyX2xlbmd0aF9pbl9ieXRlcyA9PSBmLT50ZW1wX29mZnNldAB2b3JiaXNfZGVjb2RlX2luaXRpYWwAZi0+Ynl0ZXNfaW5fc2VnID4gMABnZXQ4X3BhY2tldF9yYXcAZi0+Ynl0ZXNfaW5fc2VnID09IDAAbmV4dF9zZWdtZW50AHZvcmJpc19kZWNvZGVfcGFja2V0X3Jlc3QAIWMtPnNwYXJzZQBjb2RlYm9va19kZWNvZGVfc2NhbGFyX3JhdwAhYy0+c3BhcnNlIHx8IHogPCBjLT5zb3J0ZWRfZW50cmllcwBjb2RlYm9va19kZWNvZGVfZGVpbnRlcmxlYXZlX3JlcGVhdAB6IDwgYy0+c29ydGVkX2VudHJpZXMAY29kZWJvb2tfZGVjb2RlX3N0YXJ0AChuICYgMykgPT0gMABpbWRjdF9zdGVwM19pdGVyMF9sb29wADAAZ2V0X3dpbmRvdwBmLT50ZW1wX29mZnNldCA9PSBmLT5hbGxvYy5hbGxvY19idWZmZXJfbGVuZ3RoX2luX2J5dGVzAHN0YXJ0X2RlY29kZXIAdm9yYmlzYy0+c29ydGVkX2VudHJpZXMgPT0gMABjb21wdXRlX2NvZGV3b3JkcwB6ID49IDAgJiYgeiA8IDMyAGxlbltpXSA+PSAwICYmIGxlbltpXSA8IDMyAGF2YWlsYWJsZVt5XSA9PSAwAGsgPT0gYy0+c29ydGVkX2VudHJpZXMAY29tcHV0ZV9zb3J0ZWRfaHVmZm1hbgBjLT5zb3J0ZWRfY29kZXdvcmRzW3hdID09IGNvZGUAbGVuICE9IE5PX0NPREUAaW5jbHVkZV9pbl9zb3J0AHBvdygoZmxvYXQpIHIrMSwgZGltKSA+IGVudHJpZXMAbG9va3VwMV92YWx1ZXMAKGludCkgZmxvb3IocG93KChmbG9hdCkgciwgZGltKSkgPD0gZW50cmllcw==";
var tempDoublePtr = STATICTOP;
STATICTOP += 16;
function copyTempFloat(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
  HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
  HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
  HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
  HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3];
  HEAP8[tempDoublePtr + 4] = HEAP8[ptr + 4];
  HEAP8[tempDoublePtr + 5] = HEAP8[ptr + 5];
  HEAP8[tempDoublePtr + 6] = HEAP8[ptr + 6];
  HEAP8[tempDoublePtr + 7] = HEAP8[ptr + 7];
}
function ___assert_fail(condition, filename, line, func) {
  abort(
    "Assertion failed: " +
      Pointer_stringify(condition) +
      ", at: " +
      [
        filename ? Pointer_stringify(filename) : "unknown filename",
        line,
        func ? Pointer_stringify(func) : "unknown function",
      ]
  );
}
function _abort() {
  Module["abort"]();
}
var _llvm_floor_f64 = Math_floor;
function _emscripten_memcpy_big(dest, src, num) {
  HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
  return dest;
}
function ___setErrNo(value) {
  if (Module["___errno_location"])
    HEAP32[Module["___errno_location"]() >> 2] = value;
  return value;
}
DYNAMICTOP_PTR = staticAlloc(4);
STACK_BASE = STACKTOP = alignMemory(STATICTOP);
STACK_MAX = STACK_BASE + TOTAL_STACK;
DYNAMIC_BASE = alignMemory(STACK_MAX);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
staticSealed = true;
var ASSERTIONS = false;
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 255) {
      if (ASSERTIONS) {
        assert(
          false,
          "Character code " +
            chr +
            " (" +
            String.fromCharCode(chr) +
            ")  at offset " +
            i +
            " not in 0x00-0xFF."
        );
      }
      chr &= 255;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join("");
}
var decodeBase64 =
  typeof atob === "function"
    ? atob
    : function (input) {
        var keyStr =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
          }
        } while (i < input.length);
        return output;
      };
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) {
    var buf;
    try {
      buf = Buffer.from(s, "base64");
    } catch (_) {
      buf = new Buffer(s, "base64");
    }
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  try {
    var decoded = decodeBase64(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0; i < decoded.length; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error("Converting base64 string to bytes failed.");
  }
}
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }
  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}
function invoke_iii(index, a1, a2) {
  var sp = stackSave();
  try {
    return Module["dynCall_iii"](index, a1, a2);
  } catch (e) {
    stackRestore(sp);
    if (typeof e !== "number" && e !== "longjmp") throw e;
    Module["setThrew"](1, 0);
  }
}
Module.asmGlobalArg = {
  Math: Math,
  Int8Array: Int8Array,
  Int16Array: Int16Array,
  Int32Array: Int32Array,
  Uint8Array: Uint8Array,
  Uint16Array: Uint16Array,
  Uint32Array: Uint32Array,
  Float32Array: Float32Array,
  Float64Array: Float64Array,
  NaN: NaN,
  Infinity: Infinity,
  byteLength: byteLength,
};
Module.asmLibraryArg = {
  abort: abort,
  assert: assert,
  enlargeMemory: enlargeMemory,
  getTotalMemory: getTotalMemory,
  abortOnCannotGrowMemory: abortOnCannotGrowMemory,
  invoke_iii: invoke_iii,
  ___assert_fail: ___assert_fail,
  ___setErrNo: ___setErrNo,
  _abort: _abort,
  _emscripten_memcpy_big: _emscripten_memcpy_big,
  _llvm_floor_f64: _llvm_floor_f64,
  DYNAMICTOP_PTR: DYNAMICTOP_PTR,
  tempDoublePtr: tempDoublePtr,
  ABORT: ABORT,
  STACKTOP: STACKTOP,
  STACK_MAX: STACK_MAX,
};
var asm = (function (global, env, buffer) {
  "almost asm";
  var Int8View = global.Int8Array;
  var HEAP8 = new Int8View(buffer);
  var Int16View = global.Int16Array;
  var HEAP16 = new Int16View(buffer);
  var Int32View = global.Int32Array;
  var HEAP32 = new Int32View(buffer);
  var Uint8View = global.Uint8Array;
  var HEAPU8 = new Uint8View(buffer);
  var Uint16View = global.Uint16Array;
  var HEAPU16 = new Uint16View(buffer);
  var Uint32View = global.Uint32Array;
  var HEAPU32 = new Uint32View(buffer);
  var Float32View = global.Float32Array;
  var HEAPF32 = new Float32View(buffer);
  var Float64View = global.Float64Array;
  var HEAPF64 = new Float64View(buffer);
  var byteLength = global.byteLength;
  var DYNAMICTOP_PTR = env.DYNAMICTOP_PTR | 0;
  var tempDoublePtr = env.tempDoublePtr | 0;
  var ABORT = env.ABORT | 0;
  var STACKTOP = env.STACKTOP | 0;
  var STACK_MAX = env.STACK_MAX | 0;
  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var nan = global.NaN,
    inf = global.Infinity;
  var tempInt = 0,
    tempBigInt = 0,
    tempBigIntS = 0,
    tempValue = 0,
    tempDouble = 0;
  var tempRet0 = 0;
  var Math_floor = global.Math.floor;
  var Math_abs = global.Math.abs;
  var Math_sqrt = global.Math.sqrt;
  var Math_pow = global.Math.pow;
  var Math_cos = global.Math.cos;
  var Math_sin = global.Math.sin;
  var Math_tan = global.Math.tan;
  var Math_acos = global.Math.acos;
  var Math_asin = global.Math.asin;
  var Math_atan = global.Math.atan;
  var Math_atan2 = global.Math.atan2;
  var Math_exp = global.Math.exp;
  var Math_log = global.Math.log;
  var Math_ceil = global.Math.ceil;
  var Math_imul = global.Math.imul;
  var Math_min = global.Math.min;
  var Math_max = global.Math.max;
  var Math_clz32 = global.Math.clz32;
  var abort = env.abort;
  var assert = env.assert;
  var enlargeMemory = env.enlargeMemory;
  var getTotalMemory = env.getTotalMemory;
  var abortOnCannotGrowMemory = env.abortOnCannotGrowMemory;
  var invoke_iii = env.invoke_iii;
  var ___assert_fail = env.___assert_fail;
  var ___setErrNo = env.___setErrNo;
  var _abort = env._abort;
  var _emscripten_memcpy_big = env._emscripten_memcpy_big;
  var _llvm_floor_f64 = env._llvm_floor_f64;
  var tempFloat = 0;
  function _emscripten_replace_memory(newBuffer) {
    if (
      byteLength(newBuffer) & 16777215 ||
      byteLength(newBuffer) <= 16777215 ||
      byteLength(newBuffer) > 2147483648
    )
      return false;
    HEAP8 = new Int8View(newBuffer);
    HEAP16 = new Int16View(newBuffer);
    HEAP32 = new Int32View(newBuffer);
    HEAPU8 = new Uint8View(newBuffer);
    HEAPU16 = new Uint16View(newBuffer);
    HEAPU32 = new Uint32View(newBuffer);
    HEAPF32 = new Float32View(newBuffer);
    HEAPF64 = new Float64View(newBuffer);
    buffer = newBuffer;
    return true;
  }
  function _start_decoder($0) {
    $0 = $0 | 0;
    var $$09051277 = 0,
      $$09131233 = 0,
      $$09311258 = 0,
      $$0940$lcssa = 0,
      $$09401127 = 0,
      $$09421126 = 0,
      $$0943$lcssa = 0,
      $$09431221 = 0,
      $$0964 = 0,
      $$0967$lcssa = 0,
      $$09671242 = 0,
      $$09701232 = 0,
      $$097411701468 = 0,
      $$0975 = 0,
      $$09771238 = 0,
      $$0979 = 0,
      $$09801239$in = 0,
      $$09821263 = 0,
      $$09861184 = 0,
      $$09881256 = 0,
      $$09911252 = 0,
      $$109231212 = 0,
      $$119241216 = 0,
      $$129251158 = 0,
      $$139261165 = 0,
      $$149271175 = 0,
      $$159281145 = 0,
      $$169291142 = 0,
      $$179301148 = 0,
      $$19061269 = 0,
      $$19141243 = 0,
      $$19321190 = 0,
      $$1968 = 0,
      $$197610191022 = 0,
      $$19761020 = 0,
      $$1983$lcssa = 0,
      $$19831257 = 0,
      $$29071228 = 0,
      $$29151247 = 0,
      $$29331199 = 0,
      $$2966 = 0,
      $$2972$ph = 0,
      $$2990$ph = 0,
      $$34 = 0,
      $$39081222 = 0,
      $$39161264 = 0,
      $$39341164 = 0,
      $$3973 = 0,
      $$49091180 = 0,
      $$49171253 = 0,
      $$493511711467 = 0,
      $$493511711469 = 0,
      $$59101153 = 0,
      $$59181125 = 0,
      $$59361139 = 0,
      $$69111135 = 0,
      $$69191185 = 0,
      $$79121131 = 0,
      $$79201194 = 0,
      $$89211203 = 0,
      $$99221207 = 0,
      $$lcssa = 0,
      $$lcssa1069 = 0,
      $$lcssa1081 = 0,
      $$sink = 0,
      $$sink1331 = 0,
      $$sink1476 = 0,
      $1 = 0,
      $100 = 0,
      $102 = 0,
      $103 = 0,
      $109 = 0,
      $110 = 0,
      $111 = 0,
      $121 = 0,
      $125 = 0,
      $126 = 0,
      $127 = 0,
      $134 = 0,
      $135 = 0,
      $137 = 0,
      $139 = 0,
      $140 = 0,
      $141 = 0,
      $144 = 0,
      $147 = 0,
      $149 = 0,
      $152 = 0,
      $153 = 0,
      $156 = 0,
      $158 = 0,
      $164 = 0,
      $166 = 0,
      $173 = 0,
      $181 = 0,
      $186 = 0,
      $190 = 0,
      $191 = 0,
      $195 = 0,
      $196 = 0,
      $198 = 0,
      $2 = 0,
      $201 = 0,
      $208 = 0,
      $210 = 0,
      $213 = 0,
      $218 = 0,
      $22 = 0,
      $223 = 0,
      $226 = 0,
      $227 = 0,
      $228 = 0,
      $231 = 0,
      $236 = 0,
      $237 = 0,
      $238 = 0,
      $242 = 0,
      $248 = 0,
      $249 = 0,
      $256 = 0,
      $261 = 0,
      $263 = 0,
      $264 = 0,
      $268 = 0,
      $269 = 0,
      $271 = 0,
      $272 = 0,
      $275 = 0,
      $276 = 0,
      $278 = 0,
      $279 = 0,
      $282 = 0,
      $283 = 0,
      $286 = 0,
      $289 = 0,
      $291 = 0,
      $295 = 0,
      $3 = 0,
      $302 = 0,
      $307 = 0,
      $308 = 0,
      $314 = 0,
      $319 = 0,
      $321 = 0,
      $322 = 0,
      $323 = 0,
      $327 = 0,
      $329 = 0,
      $330 = 0,
      $332 = 0,
      $341 = 0,
      $345 = 0,
      $353 = 0,
      $356 = 0,
      $359 = 0,
      $367 = 0,
      $373 = 0,
      $379 = 0,
      $386 = 0,
      $387 = 0,
      $389 = 0,
      $390 = 0,
      $394 = 0,
      $397 = 0,
      $4 = 0,
      $400 = 0,
      $402 = 0,
      $405 = 0,
      $408 = 0,
      $411 = 0,
      $414 = 0,
      $417 = 0,
      $419 = 0,
      $422 = 0,
      $424 = 0,
      $430 = 0,
      $431 = 0,
      $433 = 0,
      $436 = 0,
      $439 = 0,
      $447 = 0,
      $450 = 0,
      $451 = 0,
      $453 = 0,
      $466 = 0,
      $476 = 0,
      $478 = 0,
      $480 = 0,
      $481 = 0,
      $486 = 0,
      $487 = 0,
      $492 = 0,
      $498 = 0,
      $499 = 0,
      $501 = 0,
      $508 = 0,
      $510 = 0,
      $519 = 0,
      $52 = 0,
      $520 = 0,
      $521 = 0,
      $528 = 0,
      $538 = 0,
      $54 = 0,
      $541 = 0,
      $545 = 0,
      $546 = 0,
      $548 = 0,
      $549 = 0,
      $555 = 0,
      $556 = 0,
      $561 = 0,
      $562 = 0,
      $563 = 0,
      $568 = 0,
      $57 = 0,
      $572 = 0,
      $573 = 0,
      $574 = 0,
      $576 = 0,
      $582 = 0,
      $59 = 0,
      $591 = 0,
      $596 = 0,
      $597 = 0,
      $60 = 0,
      $603 = 0,
      $607 = 0,
      $609 = 0,
      $61 = 0,
      $615 = 0,
      $62 = 0,
      $628 = 0,
      $629 = 0,
      $637 = 0,
      $639 = 0,
      $64 = 0,
      $644 = 0,
      $645 = 0,
      $646 = 0,
      $647 = 0,
      $652 = 0,
      $66 = 0,
      $660 = 0,
      $679 = 0,
      $680 = 0,
      $682 = 0,
      $683 = 0,
      $689 = 0,
      $690 = 0,
      $695 = 0,
      $696 = 0,
      $703 = 0,
      $707 = 0,
      $716 = 0,
      $719 = 0,
      $725 = 0,
      $726 = 0,
      $727 = 0,
      $730 = 0,
      $739 = 0,
      $741 = 0,
      $742 = 0,
      $747 = 0,
      $752 = 0,
      $762 = 0,
      $763 = 0,
      $764 = 0,
      $77 = 0,
      $778 = 0,
      $779 = 0,
      $78 = 0,
      $785 = 0,
      $788 = 0,
      $789 = 0,
      $791 = 0,
      $792 = 0,
      $793 = 0,
      $808 = 0,
      $809 = 0,
      $813 = 0,
      $814 = 0,
      $815 = 0,
      $817 = 0,
      $835 = 0,
      $838 = 0,
      $839 = 0,
      $841 = 0,
      $842 = 0,
      $844 = 0,
      $847 = 0,
      $853 = 0,
      $858 = 0,
      $866 = 0,
      $87 = 0,
      $875 = 0,
      $877 = 0,
      $878 = 0,
      $879 = 0,
      $880 = 0,
      $881 = 0,
      $9 = 0,
      $93 = 0,
      $99 = 0,
      $spec$select = 0,
      $spec$select1009 = 0,
      label = 0,
      sp = 0,
      $$09771238$looptemp = 0,
      $$493511711469$looptemp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 1024) | 0;
    $1 = (sp + 1008) | 0;
    $2 = sp;
    $3 = (sp + 1004) | 0;
    $4 = (sp + 1e3) | 0;
    L1: do {
      if (!(_start_page($0) | 0)) $$34 = 0;
      else {
        $9 = HEAPU8[($0 + 1363) >> 0] | 0;
        if (!($9 & 2)) {
          _error($0, 34);
          $$34 = 0;
          break;
        }
        if (($9 & 4) | 0) {
          _error($0, 34);
          $$34 = 0;
          break;
        }
        if (($9 & 1) | 0) {
          _error($0, 34);
          $$34 = 0;
          break;
        }
        if ((HEAP32[($0 + 1104) >> 2] | 0) != 1) {
          _error($0, 34);
          $$34 = 0;
          break;
        }
        switch (HEAP8[($0 + 1108) >> 0] | 0) {
          case 30: {
            if (((_get8($0) | 0) << 24) >> 24 != 1) {
              _error($0, 34);
              $$34 = 0;
              break L1;
            }
            if (!(_getn($0, $1, 6) | 0)) {
              _error($0, 10);
              $$34 = 0;
              break L1;
            }
            if (!(_vorbis_validate($1) | 0)) {
              _error($0, 34);
              $$34 = 0;
              break L1;
            }
            if (_get32($0) | 0) {
              _error($0, 34);
              $$34 = 0;
              break L1;
            }
            $52 = _get8($0) | 0;
            $54 = ($0 + 4) | 0;
            HEAP32[$54 >> 2] = $52 & 255;
            if (!(($52 << 24) >> 24)) {
              _error($0, 34);
              $$34 = 0;
              break L1;
            }
            if (($52 & 255) > 16) {
              _error($0, 5);
              $$34 = 0;
              break L1;
            }
            $57 = _get32($0) | 0;
            HEAP32[$0 >> 2] = $57;
            if (!$57) {
              _error($0, 34);
              $$34 = 0;
              break L1;
            }
            _get32($0) | 0;
            _get32($0) | 0;
            _get32($0) | 0;
            $59 = _get8($0) | 0;
            $60 = $59 & 255;
            $61 = $60 & 15;
            $62 = $60 >>> 4;
            $64 = ($0 + 100) | 0;
            HEAP32[$64 >> 2] = 1 << $61;
            $66 = ($0 + 104) | 0;
            HEAP32[$66 >> 2] = 1 << $62;
            if ((($61 + -6) | 0) >>> 0 > 7) {
              _error($0, 20);
              $$34 = 0;
              break L1;
            }
            if ((((($59 + -96) << 24) >> 24) << 24) >> 24 < 0) {
              _error($0, 20);
              $$34 = 0;
              break L1;
            }
            if ($61 >>> 0 > $62 >>> 0) {
              _error($0, 20);
              $$34 = 0;
              break L1;
            }
            if (!((_get8($0) | 0) & 1)) {
              _error($0, 34);
              $$34 = 0;
              break L1;
            }
            if (!(_start_page($0) | 0)) {
              $$34 = 0;
              break L1;
            }
            if (!(_start_packet($0) | 0)) {
              $$34 = 0;
              break L1;
            }
            $77 = ($0 + 1364) | 0;
            do {
              $78 = _next_segment($0) | 0;
              _skip($0, $78);
              HEAP8[$77 >> 0] = 0;
            } while (($78 | 0) != 0);
            if (!(_start_packet($0) | 0)) {
              $$34 = 0;
              break L1;
            }
            do {
              if (HEAP8[($0 + 36) >> 0] | 0) {
                if (_is_whole_packet_present($0, 1) | 0) break;
                $87 = ($0 + 88) | 0;
                if ((HEAP32[$87 >> 2] | 0) != 21) {
                  $$34 = 0;
                  break L1;
                }
                HEAP32[$87 >> 2] = 20;
                $$34 = 0;
                break L1;
              }
            } while (0);
            _crc32_init();
            if ((_get8_packet($0) | 0) != 5) {
              _error($0, 20);
              $$34 = 0;
              break L1;
            }
            $$09051277 = 0;
            do {
              $93 = (_get8_packet($0) | 0) & 255;
              HEAP8[($1 + $$09051277) >> 0] = $93;
              $$09051277 = ($$09051277 + 1) | 0;
            } while (($$09051277 | 0) != 6);
            if (!(_vorbis_validate($1) | 0)) {
              _error($0, 20);
              $$34 = 0;
              break L1;
            }
            $99 = ((_get_bits($0, 8) | 0) + 1) | 0;
            $100 = ($0 + 108) | 0;
            HEAP32[$100 >> 2] = $99;
            $102 = _setup_malloc($0, ($99 * 2096) | 0) | 0;
            $103 = ($0 + 112) | 0;
            HEAP32[$103 >> 2] = $102;
            if (!$102) {
              _error($0, 3);
              $$34 = 0;
              break L1;
            }
            _memset($102 | 0, 0, ((HEAP32[$100 >> 2] | 0) * 2096) | 0) | 0;
            L73: do {
              if ((HEAP32[$100 >> 2] | 0) > 0) {
                $109 = ($0 + 16) | 0;
                $$19061269 = 0;
                L75: while (1) {
                  $110 = HEAP32[$103 >> 2] | 0;
                  $111 = ($110 + (($$19061269 * 2096) | 0)) | 0;
                  if ((((_get_bits($0, 8) | 0) & 255) | 0) != 66) {
                    label = 63;
                    break;
                  }
                  if ((((_get_bits($0, 8) | 0) & 255) | 0) != 67) {
                    label = 65;
                    break;
                  }
                  if ((((_get_bits($0, 8) | 0) & 255) | 0) != 86) {
                    label = 67;
                    break;
                  }
                  $121 = _get_bits($0, 8) | 0;
                  $125 = ((_get_bits($0, 8) | 0) << 8) | ($121 & 255);
                  HEAP32[$111 >> 2] = $125;
                  $126 = _get_bits($0, 8) | 0;
                  $127 = _get_bits($0, 8) | 0;
                  $134 =
                    (($127 << 8) & 65280) |
                    ($126 & 255) |
                    ((_get_bits($0, 8) | 0) << 16);
                  $135 = ($110 + (($$19061269 * 2096) | 0) + 4) | 0;
                  HEAP32[$135 >> 2] = $134;
                  $137 = (_get_bits($0, 1) | 0) != 0;
                  if ($137) $140 = 0;
                  else $140 = _get_bits($0, 1) | 0;
                  $139 = $140 & 255;
                  $141 = ($110 + (($$19061269 * 2096) | 0) + 23) | 0;
                  HEAP8[$141 >> 0] = $139;
                  $144 = HEAP32[$135 >> 2] | 0;
                  if (!(HEAP32[$111 >> 2] | 0))
                    if (!$144) $147 = 0;
                    else {
                      label = 72;
                      break;
                    }
                  else $147 = $144;
                  if (!(($139 << 24) >> 24)) {
                    $149 = _setup_malloc($0, $147) | 0;
                    HEAP32[($110 + (($$19061269 * 2096) | 0) + 8) >> 2] = $149;
                    $$0975 = $149;
                  } else $$0975 = _setup_temp_malloc($0, $147) | 0;
                  if (!$$0975) {
                    label = 77;
                    break;
                  }
                  do {
                    if ($137) {
                      $152 = _get_bits($0, 5) | 0;
                      $153 = HEAP32[$135 >> 2] | 0;
                      if (($153 | 0) <= 0) {
                        $$3973 = 0;
                        $186 = $153;
                        break;
                      }
                      $$09771238 = 0;
                      $$09801239$in = $152;
                      $156 = $153;
                      while (1) {
                        $$09801239$in = ($$09801239$in + 1) | 0;
                        $158 =
                          _get_bits($0, _ilog(($156 - $$09771238) | 0) | 0) | 0;
                        $$09771238$looptemp = $$09771238;
                        $$09771238 = ($158 + $$09771238) | 0;
                        if (($$09771238 | 0) > (HEAP32[$135 >> 2] | 0)) {
                          label = 83;
                          break L75;
                        }
                        _memset(
                          ($$0975 + $$09771238$looptemp) | 0,
                          ($$09801239$in & 255) | 0,
                          $158 | 0
                        ) | 0;
                        $164 = HEAP32[$135 >> 2] | 0;
                        if (($164 | 0) <= ($$09771238 | 0)) {
                          $$3973 = 0;
                          $186 = $164;
                          break;
                        } else $156 = $164;
                      }
                    } else {
                      $166 = HEAP32[$135 >> 2] | 0;
                      if (($166 | 0) <= 0) {
                        $$3973 = 0;
                        $186 = $166;
                        break;
                      }
                      $$09131233 = 0;
                      $$09701232 = 0;
                      while (1) {
                        do {
                          if (!(HEAP8[$141 >> 0] | 0)) label = 88;
                          else {
                            if (_get_bits($0, 1) | 0) {
                              label = 88;
                              break;
                            }
                            HEAP8[($$0975 + $$09131233) >> 0] = -1;
                            $$2972$ph = $$09701232;
                          }
                        } while (0);
                        if ((label | 0) == 88) {
                          label = 0;
                          $173 = ((_get_bits($0, 5) | 0) + 1) | 0;
                          HEAP8[($$0975 + $$09131233) >> 0] = $173;
                          if ((($173 & 255) | 0) == 32) {
                            label = 90;
                            break L75;
                          } else $$2972$ph = ($$09701232 + 1) | 0;
                        }
                        $$09131233 = ($$09131233 + 1) | 0;
                        $181 = HEAP32[$135 >> 2] | 0;
                        if (($$09131233 | 0) >= ($181 | 0)) {
                          $$3973 = $$2972$ph;
                          $186 = $181;
                          break;
                        } else $$09701232 = $$2972$ph;
                      }
                    }
                  } while (0);
                  do {
                    if (!(HEAP8[$141 >> 0] | 0)) {
                      $$19761020 = $$0975;
                      $198 = $186;
                      label = 100;
                    } else {
                      if (($$3973 | 0) >= (($186 >> 2) | 0)) {
                        if (($186 | 0) > (HEAP32[$109 >> 2] | 0))
                          HEAP32[$109 >> 2] = $186;
                        $190 = _setup_malloc($0, $186) | 0;
                        $191 = ($110 + (($$19061269 * 2096) | 0) + 8) | 0;
                        HEAP32[$191 >> 2] = $190;
                        if (!$190) {
                          label = 97;
                          break L75;
                        }
                        _memcpy($190 | 0, $$0975 | 0, HEAP32[$135 >> 2] | 0) |
                          0;
                        _setup_temp_free($0, $$0975, HEAP32[$135 >> 2] | 0);
                        $195 = HEAP32[$191 >> 2] | 0;
                        HEAP8[$141 >> 0] = 0;
                        $$19761020 = $195;
                        $198 = HEAP32[$135 >> 2] | 0;
                        label = 100;
                        break;
                      }
                      $196 = ($110 + (($$19061269 * 2096) | 0) + 2092) | 0;
                      HEAP32[$196 >> 2] = $$3973;
                      if (!$$3973) {
                        $$0964 = 0;
                        $226 = 0;
                        $228 = $186;
                        $877 = 0;
                      } else {
                        $213 = _setup_malloc($0, $$3973) | 0;
                        HEAP32[($110 + (($$19061269 * 2096) | 0) + 8) >> 2] =
                          $213;
                        if (!$213) {
                          label = 107;
                          break L75;
                        }
                        $218 =
                          _setup_temp_malloc($0, HEAP32[$196 >> 2] << 2) | 0;
                        HEAP32[($110 + (($$19061269 * 2096) | 0) + 32) >> 2] =
                          $218;
                        if (!$218) {
                          label = 109;
                          break L75;
                        }
                        $223 =
                          _setup_temp_malloc($0, HEAP32[$196 >> 2] << 2) | 0;
                        if (!$223) {
                          label = 112;
                          break L75;
                        }
                        $$0964 = $223;
                        $226 = HEAP32[$196 >> 2] | 0;
                        $228 = HEAP32[$135 >> 2] | 0;
                        $877 = $223;
                      }
                      $227 = (($226 << 3) + $228) | 0;
                      if ($227 >>> 0 <= (HEAP32[$109 >> 2] | 0) >>> 0) {
                        $$197610191022 = $$0975;
                        $$2966 = $$0964;
                        $231 = $228;
                        $236 = $877;
                        $238 = $196;
                        break;
                      }
                      HEAP32[$109 >> 2] = $227;
                      $$197610191022 = $$0975;
                      $$2966 = $$0964;
                      $231 = $228;
                      $236 = $877;
                      $238 = $196;
                    }
                  } while (0);
                  if ((label | 0) == 100) {
                    label = 0;
                    if (($198 | 0) > 0) {
                      $$09671242 = 0;
                      $$19141243 = 0;
                      while (1) {
                        $201 = HEAP8[($$19761020 + $$19141243) >> 0] | 0;
                        $$1968 =
                          ($$09671242 +
                            ((($201 & 255) > 10) &
                              (($201 << 24) >> 24 != -1) &
                              1)) |
                          0;
                        $$19141243 = ($$19141243 + 1) | 0;
                        if (($$19141243 | 0) >= ($198 | 0)) {
                          $$0967$lcssa = $$1968;
                          break;
                        } else $$09671242 = $$1968;
                      }
                    } else $$0967$lcssa = 0;
                    $208 = ($110 + (($$19061269 * 2096) | 0) + 2092) | 0;
                    HEAP32[$208 >> 2] = $$0967$lcssa;
                    $210 = _setup_malloc($0, $198 << 2) | 0;
                    HEAP32[($110 + (($$19061269 * 2096) | 0) + 32) >> 2] = $210;
                    if (!$210) {
                      label = 105;
                      break;
                    }
                    $$197610191022 = $$19761020;
                    $$2966 = 0;
                    $231 = HEAP32[$135 >> 2] | 0;
                    $236 = 0;
                    $238 = $208;
                  }
                  if (
                    !(
                      _compute_codewords($111, $$197610191022, $231, $$2966) | 0
                    )
                  ) {
                    label = 116;
                    break;
                  }
                  $237 = HEAP32[$238 >> 2] | 0;
                  if ($237 | 0) {
                    $242 = _setup_malloc($0, (($237 << 2) + 4) | 0) | 0;
                    HEAP32[($110 + (($$19061269 * 2096) | 0) + 2084) >> 2] =
                      $242;
                    if (!$242) {
                      label = 121;
                      break;
                    }
                    $248 =
                      _setup_malloc($0, ((HEAP32[$238 >> 2] << 2) + 4) | 0) | 0;
                    $249 = ($110 + (($$19061269 * 2096) | 0) + 2088) | 0;
                    HEAP32[$249 >> 2] = $248;
                    if (!$248) {
                      label = 123;
                      break;
                    }
                    HEAP32[$249 >> 2] = $248 + 4;
                    HEAP32[$248 >> 2] = -1;
                    _compute_sorted_huffman($111, $$197610191022, $$2966);
                  }
                  if (HEAP8[$141 >> 0] | 0) {
                    _setup_temp_free($0, $236, HEAP32[$238 >> 2] << 2);
                    $256 = ($110 + (($$19061269 * 2096) | 0) + 32) | 0;
                    _setup_temp_free(
                      $0,
                      HEAP32[$256 >> 2] | 0,
                      HEAP32[$238 >> 2] << 2
                    );
                    _setup_temp_free($0, $$197610191022, HEAP32[$135 >> 2] | 0);
                    HEAP32[$256 >> 2] = 0;
                  }
                  _compute_accelerated_huffman($111);
                  $261 = _get_bits($0, 4) | 0;
                  $263 = ($110 + (($$19061269 * 2096) | 0) + 21) | 0;
                  HEAP8[$263 >> 0] = $261;
                  $264 = $261 & 255;
                  if ($264 >>> 0 > 2) {
                    label = 128;
                    break;
                  }
                  if ($264 | 0) {
                    $268 = +_float32_unpack(_get_bits($0, 32) | 0);
                    $269 = ($110 + (($$19061269 * 2096) | 0) + 12) | 0;
                    HEAPF32[$269 >> 2] = $268;
                    $271 = +_float32_unpack(_get_bits($0, 32) | 0);
                    $272 = ($110 + (($$19061269 * 2096) | 0) + 16) | 0;
                    HEAPF32[$272 >> 2] = $271;
                    $275 = ((_get_bits($0, 4) | 0) + 1) & 255;
                    $276 = ($110 + (($$19061269 * 2096) | 0) + 20) | 0;
                    HEAP8[$276 >> 0] = $275;
                    $278 = (_get_bits($0, 1) | 0) & 255;
                    $279 = ($110 + (($$19061269 * 2096) | 0) + 22) | 0;
                    HEAP8[$279 >> 0] = $278;
                    $282 = HEAP32[$135 >> 2] | 0;
                    $283 = HEAP32[$111 >> 2] | 0;
                    if ((HEAP8[$263 >> 0] | 0) == 1)
                      $$sink = _lookup1_values($282, $283) | 0;
                    else $$sink = Math_imul($283, $282) | 0;
                    $286 = ($110 + (($$19061269 * 2096) | 0) + 24) | 0;
                    HEAP32[$286 >> 2] = $$sink;
                    if (!$$sink) {
                      label = 134;
                      break;
                    }
                    $289 = _setup_temp_malloc($0, $$sink << 1) | 0;
                    if (!$289) {
                      label = 136;
                      break;
                    }
                    $291 = HEAP32[$286 >> 2] | 0;
                    if (($291 | 0) > 0) {
                      $$29151247 = 0;
                      while (1) {
                        $295 = _get_bits($0, HEAPU8[$276 >> 0] | 0) | 0;
                        if (($295 | 0) == -1) {
                          label = 140;
                          break L75;
                        }
                        HEAP16[($289 + ($$29151247 << 1)) >> 1] = $295;
                        $$29151247 = ($$29151247 + 1) | 0;
                        $302 = HEAP32[$286 >> 2] | 0;
                        if (($$29151247 | 0) >= ($302 | 0)) {
                          $$lcssa1081 = $302;
                          break;
                        }
                      }
                    } else $$lcssa1081 = $291;
                    do {
                      if ((HEAP8[$263 >> 0] | 0) == 1) {
                        $307 = (HEAP8[$141 >> 0] | 0) != 0;
                        if ($307) {
                          $308 = HEAP32[$238 >> 2] | 0;
                          if (!$308) {
                            $373 = $$lcssa1081;
                            break;
                          } else $$sink1476 = $308;
                        } else $$sink1476 = HEAP32[$135 >> 2] | 0;
                        $314 =
                          _setup_malloc(
                            $0,
                            Math_imul($$sink1476 << 2, HEAP32[$111 >> 2] | 0) |
                              0
                          ) | 0;
                        HEAP32[($110 + (($$19061269 * 2096) | 0) + 28) >> 2] =
                          $314;
                        if (!$314) {
                          label = 147;
                          break L75;
                        }
                        $319 = HEAP32[($307 ? $238 : $135) >> 2] | 0;
                        if (($319 | 0) > 0) {
                          $321 = ($110 + (($$19061269 * 2096) | 0) + 2088) | 0;
                          $322 = HEAP32[$111 >> 2] | 0;
                          $323 = ($322 | 0) > 0;
                          $$09821263 = 0;
                          $$39161264 = 0;
                          while (1) {
                            if ($307)
                              $332 =
                                HEAP32[
                                  ((HEAP32[$321 >> 2] | 0) +
                                    ($$39161264 << 2)) >>
                                    2
                                ] | 0;
                            else $332 = $$39161264;
                            if ($323) {
                              $327 = HEAP32[$286 >> 2] | 0;
                              $329 = (HEAP8[$279 >> 0] | 0) == 0;
                              $330 = Math_imul($322, $$39161264) | 0;
                              $$09311258 = 0;
                              $$09881256 = 1;
                              $$19831257 = $$09821263;
                              while (1) {
                                $341 =
                                  $$19831257 +
                                  (+HEAPF32[$272 >> 2] *
                                    +(
                                      HEAPU16[
                                        ($289 +
                                          (((((($332 >>> 0) /
                                            ($$09881256 >>> 0)) |
                                            0) >>>
                                            0) %
                                            ($327 >>> 0) |
                                            0) <<
                                            1)) >>
                                          1
                                      ] | 0
                                    ) +
                                    +HEAPF32[$269 >> 2]);
                                HEAPF32[
                                  ($314 + (($330 + $$09311258) << 2)) >> 2
                                ] = $341;
                                $spec$select = $329 ? $$19831257 : $341;
                                $$09311258 = ($$09311258 + 1) | 0;
                                $345 = ($$09311258 | 0) < ($322 | 0);
                                if ($345) {
                                  if (
                                    $$09881256 >>> 0 >
                                    ((4294967295 / ($327 >>> 0)) | 0) >>> 0
                                  ) {
                                    label = 158;
                                    break L75;
                                  }
                                  $$2990$ph = Math_imul($327, $$09881256) | 0;
                                } else $$2990$ph = $$09881256;
                                if (!$345) {
                                  $$1983$lcssa = $spec$select;
                                  break;
                                } else {
                                  $$09881256 = $$2990$ph;
                                  $$19831257 = $spec$select;
                                }
                              }
                            } else $$1983$lcssa = $$09821263;
                            $$39161264 = ($$39161264 + 1) | 0;
                            if (($$39161264 | 0) >= ($319 | 0)) break;
                            else $$09821263 = $$1983$lcssa;
                          }
                        }
                        HEAP8[$263 >> 0] = 2;
                        $373 = HEAP32[$286 >> 2] | 0;
                      } else {
                        $353 = _setup_malloc($0, $$lcssa1081 << 2) | 0;
                        HEAP32[($110 + (($$19061269 * 2096) | 0) + 28) >> 2] =
                          $353;
                        $356 = HEAP32[$286 >> 2] | 0;
                        if (!$353) {
                          label = 165;
                          break L75;
                        }
                        if (($356 | 0) <= 0) {
                          $373 = $356;
                          break;
                        }
                        $359 = (HEAP8[$279 >> 0] | 0) == 0;
                        $$09911252 = 0;
                        $$49171253 = 0;
                        while (1) {
                          $367 =
                            $$09911252 +
                            (+HEAPF32[$272 >> 2] *
                              +(HEAPU16[($289 + ($$49171253 << 1)) >> 1] | 0) +
                              +HEAPF32[$269 >> 2]);
                          HEAPF32[($353 + ($$49171253 << 2)) >> 2] = $367;
                          $$49171253 = ($$49171253 + 1) | 0;
                          if (($$49171253 | 0) >= ($356 | 0)) {
                            $373 = $356;
                            break;
                          } else $$09911252 = $359 ? $$09911252 : $367;
                        }
                      }
                    } while (0);
                    _setup_temp_free($0, $289, $373 << 1);
                  }
                  $$19061269 = ($$19061269 + 1) | 0;
                  if (($$19061269 | 0) >= (HEAP32[$100 >> 2] | 0)) break L73;
                }
                switch (label | 0) {
                  case 63: {
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 65: {
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 67: {
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 72: {
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 77: {
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 83: {
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 90: {
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 97: {
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 105: {
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 107: {
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 109: {
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 112: {
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 116: {
                    if (HEAP8[$141 >> 0] | 0) _setup_temp_free($0, $236, 0);
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 121: {
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 123: {
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 128: {
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 134: {
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 136: {
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 140: {
                    _setup_temp_free($0, $289, HEAP32[$286 >> 2] << 1);
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 147: {
                    _setup_temp_free($0, $289, HEAP32[$286 >> 2] << 1);
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 158: {
                    _setup_temp_free($0, $289, $327 << 1);
                    _error($0, 20);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                  case 165: {
                    _setup_temp_free($0, $289, $356 << 1);
                    _error($0, 3);
                    $$34 = 0;
                    break L1;
                    break;
                  }
                }
              }
            } while (0);
            $379 = ((_get_bits($0, 6) | 0) + 1) & 255;
            L215: do {
              if ($379 | 0) {
                $$29071228 = 0;
                while (1) {
                  $$29071228 = ($$29071228 + 1) | 0;
                  if (_get_bits($0, 16) | 0) break;
                  if ($$29071228 >>> 0 >= $379 >>> 0) break L215;
                }
                _error($0, 20);
                $$34 = 0;
                break L1;
              }
            } while (0);
            $386 = ((_get_bits($0, 6) | 0) + 1) | 0;
            $387 = ($0 + 116) | 0;
            HEAP32[$387 >> 2] = $386;
            $389 = _setup_malloc($0, ($386 * 1596) | 0) | 0;
            $390 = ($0 + 248) | 0;
            HEAP32[$390 >> 2] = $389;
            if (!$389) {
              _error($0, 3);
              $$34 = 0;
              break L1;
            }
            do {
              if ((HEAP32[$387 >> 2] | 0) > 0) {
                $$09431221 = 0;
                $$39081222 = 0;
                L227: while (1) {
                  $394 = _get_bits($0, 16) | 0;
                  HEAP16[($0 + 120 + ($$39081222 << 1)) >> 1] = $394;
                  $397 = $394 & 65535;
                  if ($397 >>> 0 > 1) {
                    label = 178;
                    break;
                  }
                  if (!$397) {
                    label = 180;
                    break;
                  }
                  $430 = HEAP32[$390 >> 2] | 0;
                  $431 = _get_bits($0, 5) | 0;
                  $433 = ($430 + (($$39081222 * 1596) | 0)) | 0;
                  HEAP8[$433 >> 0] = $431;
                  if (($431 & 255) | 0) {
                    $$09861184 = -1;
                    $$69191185 = 0;
                    do {
                      $436 = _get_bits($0, 4) | 0;
                      HEAP8[
                        ($430 + (($$39081222 * 1596) | 0) + 1 + $$69191185) >> 0
                      ] = $436;
                      $439 = $436 & 255;
                      $$09861184 =
                        ($439 | 0) > ($$09861184 | 0) ? $439 : $$09861184;
                      $$69191185 = ($$69191185 + 1) | 0;
                    } while ($$69191185 >>> 0 < (HEAPU8[$433 >> 0] | 0) >>> 0);
                    $$79201194 = 0;
                    while (1) {
                      $447 = ((_get_bits($0, 3) | 0) + 1) & 255;
                      HEAP8[
                        ($430 + (($$39081222 * 1596) | 0) + 33 + $$79201194) >>
                          0
                      ] = $447;
                      $450 = (_get_bits($0, 2) | 0) & 255;
                      $451 =
                        ($430 + (($$39081222 * 1596) | 0) + 49 + $$79201194) |
                        0;
                      HEAP8[$451 >> 0] = $450;
                      if (!(($450 << 24) >> 24)) label = 192;
                      else {
                        $453 = _get_bits($0, 8) | 0;
                        HEAP8[
                          ($430 +
                            (($$39081222 * 1596) | 0) +
                            65 +
                            $$79201194) >>
                            0
                        ] = $453;
                        if ((($453 & 255) | 0) >= (HEAP32[$100 >> 2] | 0)) {
                          label = 190;
                          break L227;
                        }
                        if ((HEAP8[$451 >> 0] | 0) != 31) label = 192;
                      }
                      if ((label | 0) == 192) {
                        label = 0;
                        $$19321190 = 0;
                        do {
                          $466 = ((_get_bits($0, 8) | 0) + 65535) | 0;
                          HEAP16[
                            ($430 +
                              (($$39081222 * 1596) | 0) +
                              82 +
                              ($$79201194 << 4) +
                              ($$19321190 << 1)) >>
                              1
                          ] = $466;
                          $$19321190 = ($$19321190 + 1) | 0;
                          if (
                            ((($466 << 16) >> 16) | 0) >=
                            (HEAP32[$100 >> 2] | 0)
                          ) {
                            label = 195;
                            break L227;
                          }
                        } while (
                          ($$19321190 | 0) <
                          ((1 << HEAPU8[$451 >> 0]) | 0)
                        );
                      }
                      if (($$79201194 | 0) < ($$09861184 | 0))
                        $$79201194 = ($$79201194 + 1) | 0;
                      else break;
                    }
                  }
                  $476 = ((_get_bits($0, 2) | 0) + 1) & 255;
                  HEAP8[($430 + (($$39081222 * 1596) | 0) + 1588) >> 0] = $476;
                  $478 = _get_bits($0, 4) | 0;
                  $480 = ($430 + (($$39081222 * 1596) | 0) + 1589) | 0;
                  HEAP8[$480 >> 0] = $478;
                  $481 = ($430 + (($$39081222 * 1596) | 0) + 338) | 0;
                  HEAP16[$481 >> 1] = 0;
                  HEAP16[($430 + (($$39081222 * 1596) | 0) + 340) >> 1] =
                    1 << ($478 & 255);
                  $486 = ($430 + (($$39081222 * 1596) | 0) + 1592) | 0;
                  HEAP32[$486 >> 2] = 2;
                  $487 = HEAP8[$433 >> 0] | 0;
                  if (!(($487 << 24) >> 24)) {
                    $519 = 2;
                    label = 205;
                  } else {
                    $$89211203 = 0;
                    $878 = 2;
                    $879 = $487;
                    while (1) {
                      $492 =
                        ((HEAPU8[
                          ($430 + (($$39081222 * 1596) | 0) + 1 + $$89211203) >>
                            0
                        ] |
                          0) +
                          ($430 + (($$39081222 * 1596) | 0) + 33)) |
                        0;
                      if (!(HEAP8[$492 >> 0] | 0)) {
                        $508 = $879;
                        $510 = $878;
                      } else {
                        $$29331199 = 0;
                        do {
                          $498 =
                            (_get_bits($0, HEAPU8[$480 >> 0] | 0) | 0) & 65535;
                          $499 = HEAP32[$486 >> 2] | 0;
                          HEAP16[
                            ($430 +
                              (($$39081222 * 1596) | 0) +
                              338 +
                              ($499 << 1)) >>
                              1
                          ] = $498;
                          $501 = ($499 + 1) | 0;
                          HEAP32[$486 >> 2] = $501;
                          $$29331199 = ($$29331199 + 1) | 0;
                        } while (
                          $$29331199 >>> 0 <
                          (HEAPU8[$492 >> 0] | 0) >>> 0
                        );
                        $508 = HEAP8[$433 >> 0] | 0;
                        $510 = $501;
                      }
                      $$89211203 = ($$89211203 + 1) | 0;
                      if ($$89211203 >>> 0 >= ($508 & 255) >>> 0) break;
                      else {
                        $878 = $510;
                        $879 = $508;
                      }
                    }
                    if (($510 | 0) > 0) {
                      $519 = $510;
                      label = 205;
                    } else $520 = $510;
                  }
                  if ((label | 0) == 205) {
                    label = 0;
                    $$99221207 = 0;
                    do {
                      HEAP16[($2 + ($$99221207 << 2)) >> 1] =
                        HEAP16[
                          ($430 +
                            (($$39081222 * 1596) | 0) +
                            338 +
                            ($$99221207 << 1)) >>
                            1
                        ] | 0;
                      HEAP16[($2 + ($$99221207 << 2) + 2) >> 1] = $$99221207;
                      $$99221207 = ($$99221207 + 1) | 0;
                    } while (($$99221207 | 0) < ($519 | 0));
                    $520 = $519;
                  }
                  _qsort($2, $520, 4, 1);
                  $521 = HEAP32[$486 >> 2] | 0;
                  do {
                    if (($521 | 0) > 0) {
                      $$109231212 = 0;
                      do {
                        HEAP8[
                          ($430 +
                            (($$39081222 * 1596) | 0) +
                            838 +
                            $$109231212) >>
                            0
                        ] = HEAP16[($2 + ($$109231212 << 2) + 2) >> 1];
                        $$109231212 = ($$109231212 + 1) | 0;
                        $528 = HEAP32[$486 >> 2] | 0;
                      } while (($$109231212 | 0) < ($528 | 0));
                      if (($528 | 0) <= 2) {
                        $$lcssa1069 = $528;
                        break;
                      }
                      $$119241216 = 2;
                      do {
                        _neighbors($481, $$119241216, $3, $4);
                        HEAP8[
                          ($430 +
                            (($$39081222 * 1596) | 0) +
                            1088 +
                            ($$119241216 << 1)) >>
                            0
                        ] = HEAP32[$3 >> 2];
                        HEAP8[
                          ($430 +
                            (($$39081222 * 1596) | 0) +
                            1088 +
                            ($$119241216 << 1) +
                            1) >>
                            0
                        ] = HEAP32[$4 >> 2];
                        $$119241216 = ($$119241216 + 1) | 0;
                        $538 = HEAP32[$486 >> 2] | 0;
                      } while (($$119241216 | 0) < ($538 | 0));
                      $$lcssa1069 = $538;
                    } else $$lcssa1069 = $521;
                  } while (0);
                  $$09431221 =
                    ($$lcssa1069 | 0) > ($$09431221 | 0)
                      ? $$lcssa1069
                      : $$09431221;
                  $541 = ($$39081222 + 1) | 0;
                  if (($541 | 0) >= (HEAP32[$387 >> 2] | 0)) {
                    label = 215;
                    break;
                  } else $$39081222 = $541;
                }
                if ((label | 0) == 178) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 180) {
                  $400 = HEAP32[$390 >> 2] | 0;
                  $402 = (_get_bits($0, 8) | 0) & 255;
                  HEAP8[($400 + (($$39081222 * 1596) | 0)) >> 0] = $402;
                  $405 = (_get_bits($0, 16) | 0) & 65535;
                  HEAP16[($400 + (($$39081222 * 1596) | 0) + 2) >> 1] = $405;
                  $408 = (_get_bits($0, 16) | 0) & 65535;
                  HEAP16[($400 + (($$39081222 * 1596) | 0) + 4) >> 1] = $408;
                  $411 = (_get_bits($0, 6) | 0) & 255;
                  HEAP8[($400 + (($$39081222 * 1596) | 0) + 6) >> 0] = $411;
                  $414 = (_get_bits($0, 8) | 0) & 255;
                  HEAP8[($400 + (($$39081222 * 1596) | 0) + 7) >> 0] = $414;
                  $417 = ((_get_bits($0, 4) | 0) + 1) | 0;
                  $419 = ($400 + (($$39081222 * 1596) | 0) + 8) | 0;
                  HEAP8[$419 >> 0] = $417;
                  if (($417 & 255) | 0) {
                    $422 = ($400 + (($$39081222 * 1596) | 0) + 9) | 0;
                    $$59181125 = 0;
                    do {
                      $424 = (_get_bits($0, 8) | 0) & 255;
                      HEAP8[($422 + $$59181125) >> 0] = $424;
                      $$59181125 = ($$59181125 + 1) | 0;
                    } while ($$59181125 >>> 0 < (HEAPU8[$419 >> 0] | 0) >>> 0);
                  }
                  _error($0, 4);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 190) _error($0, 20);
                else if ((label | 0) == 195) _error($0, 20);
                else if ((label | 0) == 215) {
                  $$0943$lcssa = $$09431221 << 1;
                  break;
                }
                $$34 = 0;
                break L1;
              } else $$0943$lcssa = 0;
            } while (0);
            $545 = ((_get_bits($0, 6) | 0) + 1) | 0;
            $546 = ($0 + 252) | 0;
            HEAP32[$546 >> 2] = $545;
            $548 = _setup_malloc($0, ($545 * 24) | 0) | 0;
            $549 = ($0 + 384) | 0;
            HEAP32[$549 >> 2] = $548;
            if (!$548) {
              _error($0, 3);
              $$34 = 0;
              break L1;
            }
            _memset($548 | 0, 0, ((HEAP32[$546 >> 2] | 0) * 24) | 0) | 0;
            L289: do {
              if ((HEAP32[$546 >> 2] | 0) > 0) {
                $$49091180 = 0;
                L291: while (1) {
                  $555 = HEAP32[$549 >> 2] | 0;
                  $556 = _get_bits($0, 16) | 0;
                  HEAP16[($0 + 256 + ($$49091180 << 1)) >> 1] = $556;
                  if (($556 & 65535) >>> 0 > 2) {
                    label = 221;
                    break;
                  }
                  $561 = _get_bits($0, 24) | 0;
                  $562 = ($555 + (($$49091180 * 24) | 0)) | 0;
                  HEAP32[$562 >> 2] = $561;
                  $563 = _get_bits($0, 24) | 0;
                  HEAP32[($555 + (($$49091180 * 24) | 0) + 4) >> 2] = $563;
                  if ($563 >>> 0 < (HEAP32[$562 >> 2] | 0) >>> 0) {
                    label = 223;
                    break;
                  }
                  $568 = ((_get_bits($0, 24) | 0) + 1) | 0;
                  HEAP32[($555 + (($$49091180 * 24) | 0) + 8) >> 2] = $568;
                  $572 = ((_get_bits($0, 6) | 0) + 1) & 255;
                  $573 = ($555 + (($$49091180 * 24) | 0) + 12) | 0;
                  HEAP8[$573 >> 0] = $572;
                  $574 = _get_bits($0, 8) | 0;
                  $576 = ($555 + (($$49091180 * 24) | 0) + 13) | 0;
                  HEAP8[$576 >> 0] = $574;
                  if ((($574 & 255) | 0) >= (HEAP32[$100 >> 2] | 0)) {
                    label = 225;
                    break;
                  }
                  if (!(HEAP8[$573 >> 0] | 0)) $$lcssa = 0;
                  else {
                    $$129251158 = 0;
                    do {
                      $582 = _get_bits($0, 3) | 0;
                      if (!(_get_bits($0, 1) | 0)) $$0979 = 0;
                      else $$0979 = _get_bits($0, 5) | 0;
                      HEAP8[($2 + $$129251158) >> 0] = ($$0979 << 3) + $582;
                      $$129251158 = ($$129251158 + 1) | 0;
                      $591 = HEAP8[$573 >> 0] | 0;
                    } while ($$129251158 >>> 0 < ($591 & 255) >>> 0);
                    $$lcssa = $591 & 255;
                  }
                  $596 = _setup_malloc($0, $$lcssa << 4) | 0;
                  $597 = ($555 + (($$49091180 * 24) | 0) + 20) | 0;
                  HEAP32[$597 >> 2] = $596;
                  if (!$596) {
                    label = 233;
                    break;
                  }
                  if (HEAP8[$573 >> 0] | 0) {
                    $$139261165 = 0;
                    $880 = $596;
                    while (1) {
                      $603 = HEAPU8[($2 + $$139261165) >> 0] | 0;
                      $$39341164 = 0;
                      $615 = $880;
                      while (1) {
                        if (!((1 << $$39341164) & $603)) {
                          HEAP16[
                            ($615 + ($$139261165 << 4) + ($$39341164 << 1)) >> 1
                          ] = -1;
                          $881 = $615;
                        } else {
                          $607 = _get_bits($0, 8) | 0;
                          $609 = HEAP32[$597 >> 2] | 0;
                          HEAP16[
                            ($609 + ($$139261165 << 4) + ($$39341164 << 1)) >> 1
                          ] = $607;
                          if (
                            (HEAP32[$100 >> 2] | 0) >
                            ((($607 << 16) >> 16) | 0)
                          )
                            $881 = $609;
                          else {
                            label = 239;
                            break L291;
                          }
                        }
                        $$39341164 = ($$39341164 + 1) | 0;
                        if ($$39341164 >>> 0 >= 8) break;
                        else $615 = $881;
                      }
                      $$139261165 = ($$139261165 + 1) | 0;
                      if ($$139261165 >>> 0 >= (HEAPU8[$573 >> 0] | 0) >>> 0)
                        break;
                      else $880 = $881;
                    }
                  }
                  $628 =
                    _setup_malloc(
                      $0,
                      HEAP32[
                        ((HEAP32[$103 >> 2] | 0) +
                          (((HEAPU8[$576 >> 0] | 0) * 2096) | 0) +
                          4) >>
                          2
                      ] << 2
                    ) | 0;
                  $629 = ($555 + (($$49091180 * 24) | 0) + 16) | 0;
                  HEAP32[$629 >> 2] = $628;
                  if (!$628) {
                    label = 244;
                    break;
                  }
                  _memset(
                    $628 | 0,
                    0,
                    (HEAP32[
                      ((HEAP32[$103 >> 2] | 0) +
                        (((HEAPU8[$576 >> 0] | 0) * 2096) | 0) +
                        4) >>
                        2
                    ] <<
                      2) |
                      0
                  ) | 0;
                  $637 = HEAP32[$103 >> 2] | 0;
                  $639 = HEAPU8[$576 >> 0] | 0;
                  if ((HEAP32[($637 + (($639 * 2096) | 0) + 4) >> 2] | 0) > 0) {
                    $$149271175 = 0;
                    $644 = $637;
                    $645 = $639;
                    do {
                      $646 = HEAP32[($644 + (($645 * 2096) | 0)) >> 2] | 0;
                      $647 = _setup_malloc($0, $646) | 0;
                      HEAP32[
                        ((HEAP32[$629 >> 2] | 0) + ($$149271175 << 2)) >> 2
                      ] = $647;
                      $652 =
                        HEAP32[
                          ((HEAP32[$629 >> 2] | 0) + ($$149271175 << 2)) >> 2
                        ] | 0;
                      if (!$652) {
                        label = 252;
                        break L291;
                      }
                      do {
                        if (($646 | 0) > 0) {
                          $$493511711467 = ($646 + -1) | 0;
                          HEAP8[($652 + $$493511711467) >> 0] =
                            ($$149271175 >>> 0) %
                              ((HEAPU8[$573 >> 0] | 0) >>> 0) |
                            0;
                          if (($646 | 0) == 1) break;
                          $$097411701468 = $$149271175;
                          $$493511711469 = $$493511711467;
                          do {
                            $660 = HEAP8[$573 >> 0] | 0;
                            $$097411701468 =
                              (($$097411701468 | 0) / (($660 & 255) | 0)) | 0;
                            $$493511711469$looptemp = $$493511711469;
                            $$493511711469 = ($$493511711469 + -1) | 0;
                            HEAP8[
                              ((HEAP32[
                                ((HEAP32[$629 >> 2] | 0) +
                                  ($$149271175 << 2)) >>
                                  2
                              ] |
                                0) +
                                $$493511711469) >>
                                0
                            ] = ($$097411701468 | 0) % (($660 & 255) | 0) | 0;
                          } while (($$493511711469$looptemp | 0) > 1);
                        }
                      } while (0);
                      $$149271175 = ($$149271175 + 1) | 0;
                      $644 = HEAP32[$103 >> 2] | 0;
                      $645 = HEAPU8[$576 >> 0] | 0;
                    } while (
                      ($$149271175 | 0) <
                      (HEAP32[($644 + (($645 * 2096) | 0) + 4) >> 2] | 0)
                    );
                  }
                  $$49091180 = ($$49091180 + 1) | 0;
                  if (($$49091180 | 0) >= (HEAP32[$546 >> 2] | 0)) break L289;
                }
                if ((label | 0) == 221) _error($0, 20);
                else if ((label | 0) == 223) _error($0, 20);
                else if ((label | 0) == 225) _error($0, 20);
                else if ((label | 0) == 233) _error($0, 3);
                else if ((label | 0) == 239) _error($0, 20);
                else if ((label | 0) == 244) _error($0, 3);
                else if ((label | 0) == 252) _error($0, 3);
                $$34 = 0;
                break L1;
              }
            } while (0);
            $679 = ((_get_bits($0, 6) | 0) + 1) | 0;
            $680 = ($0 + 388) | 0;
            HEAP32[$680 >> 2] = $679;
            $682 = _setup_malloc($0, ($679 * 40) | 0) | 0;
            $683 = ($0 + 392) | 0;
            HEAP32[$683 >> 2] = $682;
            if (!$682) {
              _error($0, 3);
              $$34 = 0;
              break L1;
            }
            _memset($682 | 0, 0, ((HEAP32[$680 >> 2] | 0) * 40) | 0) | 0;
            L344: do {
              if ((HEAP32[$680 >> 2] | 0) > 0) {
                $$59101153 = 0;
                L346: while (1) {
                  $689 = HEAP32[$683 >> 2] | 0;
                  $690 = ($689 + (($$59101153 * 40) | 0)) | 0;
                  if (_get_bits($0, 16) | 0) {
                    label = 261;
                    break;
                  }
                  $695 =
                    _setup_malloc($0, ((HEAP32[$54 >> 2] | 0) * 3) | 0) | 0;
                  $696 = ($689 + (($$59101153 * 40) | 0) + 4) | 0;
                  HEAP32[$696 >> 2] = $695;
                  if (!$695) {
                    label = 263;
                    break;
                  }
                  if (!(_get_bits($0, 1) | 0)) $$sink1331 = 1;
                  else $$sink1331 = ((_get_bits($0, 4) | 0) + 1) & 255;
                  $703 = ($689 + (($$59101153 * 40) | 0) + 8) | 0;
                  HEAP8[$703 >> 0] = $$sink1331;
                  do {
                    if (!(_get_bits($0, 1) | 0)) HEAP16[$690 >> 1] = 0;
                    else {
                      $707 = ((_get_bits($0, 8) | 0) + 1) | 0;
                      HEAP16[$690 >> 1] = $707;
                      if (!($707 & 65535)) break;
                      $$59361139 = 0;
                      $716 = HEAP32[$54 >> 2] | 0;
                      do {
                        $719 =
                          (_get_bits($0, _ilog(($716 + -1) | 0) | 0) | 0) & 255;
                        HEAP8[
                          ((HEAP32[$696 >> 2] | 0) + (($$59361139 * 3) | 0)) >>
                            0
                        ] = $719;
                        $725 =
                          _get_bits(
                            $0,
                            _ilog(((HEAP32[$54 >> 2] | 0) + -1) | 0) | 0
                          ) | 0;
                        $726 = $725 & 255;
                        $727 = HEAP32[$696 >> 2] | 0;
                        HEAP8[($727 + (($$59361139 * 3) | 0) + 1) >> 0] = $726;
                        $730 = HEAP8[($727 + (($$59361139 * 3) | 0)) >> 0] | 0;
                        $716 = HEAP32[$54 >> 2] | 0;
                        if (($716 | 0) <= (($730 & 255) | 0)) {
                          label = 271;
                          break L346;
                        }
                        if (($716 | 0) <= (($725 & 255) | 0)) {
                          label = 273;
                          break L346;
                        }
                        $$59361139 = ($$59361139 + 1) | 0;
                        if (($730 << 24) >> 24 == ($726 << 24) >> 24) {
                          label = 275;
                          break L346;
                        }
                      } while (
                        $$59361139 >>> 0 <
                        (HEAPU16[$690 >> 1] | 0) >>> 0
                      );
                    }
                  } while (0);
                  if (_get_bits($0, 2) | 0) {
                    label = 278;
                    break;
                  }
                  $739 = HEAP8[$703 >> 0] | 0;
                  $741 = HEAP32[$54 >> 2] | 0;
                  $742 = ($741 | 0) > 0;
                  do {
                    if (($739 & 255) > 1) {
                      if (!$742) {
                        label = 289;
                        break;
                      }
                      $$159281145 = 0;
                      while (1) {
                        $747 = (_get_bits($0, 4) | 0) & 255;
                        HEAP8[
                          ((HEAP32[$696 >> 2] | 0) +
                            (($$159281145 * 3) | 0) +
                            2) >>
                            0
                        ] = $747;
                        $$159281145 = ($$159281145 + 1) | 0;
                        if ((HEAPU8[$703 >> 0] | 0) <= ($747 & 255)) {
                          label = 284;
                          break L346;
                        }
                        if (($$159281145 | 0) >= (HEAP32[$54 >> 2] | 0)) {
                          label = 289;
                          break;
                        }
                      }
                    } else {
                      if ($742) {
                        $752 = HEAP32[$696 >> 2] | 0;
                        $$169291142 = 0;
                        do {
                          HEAP8[($752 + (($$169291142 * 3) | 0) + 2) >> 0] = 0;
                          $$169291142 = ($$169291142 + 1) | 0;
                        } while (($$169291142 | 0) < ($741 | 0));
                      }
                      if (($739 << 24) >> 24) label = 289;
                    }
                  } while (0);
                  if ((label | 0) == 289) {
                    label = 0;
                    $$179301148 = 0;
                    do {
                      _get_bits($0, 8) | 0;
                      $762 = (_get_bits($0, 8) | 0) & 255;
                      $763 =
                        ($689 + (($$59101153 * 40) | 0) + 9 + $$179301148) | 0;
                      HEAP8[$763 >> 0] = $762;
                      $764 = _get_bits($0, 8) | 0;
                      HEAP8[
                        ($689 + (($$59101153 * 40) | 0) + 24 + $$179301148) >> 0
                      ] = $764;
                      if ((HEAP32[$387 >> 2] | 0) <= (HEAPU8[$763 >> 0] | 0)) {
                        label = 292;
                        break L346;
                      }
                      $$179301148 = ($$179301148 + 1) | 0;
                      if ((($764 & 255) | 0) >= (HEAP32[$546 >> 2] | 0)) {
                        label = 294;
                        break L346;
                      }
                    } while ($$179301148 >>> 0 < (HEAPU8[$703 >> 0] | 0) >>> 0);
                  }
                  $$59101153 = ($$59101153 + 1) | 0;
                  if (($$59101153 | 0) >= (HEAP32[$680 >> 2] | 0)) break L344;
                }
                if ((label | 0) == 261) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 263) {
                  _error($0, 3);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 271) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 273) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 275) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 278) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 284) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 292) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 294) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                }
              }
            } while (0);
            $778 = ((_get_bits($0, 6) | 0) + 1) | 0;
            $779 = ($0 + 396) | 0;
            HEAP32[$779 >> 2] = $778;
            L394: do {
              if (($778 | 0) > 0) {
                $$69111135 = 0;
                while (1) {
                  $785 = (_get_bits($0, 1) | 0) & 255;
                  HEAP8[($0 + 400 + (($$69111135 * 6) | 0)) >> 0] = $785;
                  $788 = (_get_bits($0, 16) | 0) & 65535;
                  $789 = ($0 + 400 + (($$69111135 * 6) | 0) + 2) | 0;
                  HEAP16[$789 >> 1] = $788;
                  $791 = (_get_bits($0, 16) | 0) & 65535;
                  $792 = ($0 + 400 + (($$69111135 * 6) | 0) + 4) | 0;
                  HEAP16[$792 >> 1] = $791;
                  $793 = _get_bits($0, 8) | 0;
                  HEAP8[($0 + 400 + (($$69111135 * 6) | 0) + 1) >> 0] = $793;
                  if (HEAP16[$789 >> 1] | 0) {
                    label = 300;
                    break;
                  }
                  if (HEAP16[$792 >> 1] | 0) {
                    label = 302;
                    break;
                  }
                  $$69111135 = ($$69111135 + 1) | 0;
                  if ((($793 & 255) | 0) >= (HEAP32[$680 >> 2] | 0)) {
                    label = 304;
                    break;
                  }
                  if (($$69111135 | 0) >= (HEAP32[$779 >> 2] | 0)) break L394;
                }
                if ((label | 0) == 300) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 302) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                } else if ((label | 0) == 304) {
                  _error($0, 20);
                  $$34 = 0;
                  break L1;
                }
              }
            } while (0);
            _flush_packet($0);
            HEAP32[($0 + 980) >> 2] = 0;
            L406: do {
              if ((HEAP32[$54 >> 2] | 0) > 0) {
                $$79121131 = 0;
                while (1) {
                  $808 = _setup_malloc($0, HEAP32[$66 >> 2] << 2) | 0;
                  $809 = ($0 + 788 + ($$79121131 << 2)) | 0;
                  HEAP32[$809 >> 2] = $808;
                  $813 =
                    _setup_malloc($0, (HEAP32[$66 >> 2] << 1) & 2147483646) | 0;
                  $814 = ($0 + 916 + ($$79121131 << 2)) | 0;
                  HEAP32[$814 >> 2] = $813;
                  $815 = _setup_malloc($0, $$0943$lcssa) | 0;
                  HEAP32[($0 + 984 + ($$79121131 << 2)) >> 2] = $815;
                  $817 = HEAP32[$809 >> 2] | 0;
                  if (!$817) break;
                  if ((($815 | 0) == 0) | ((HEAP32[$814 >> 2] | 0) == 0)) break;
                  _memset($817 | 0, 0, (HEAP32[$66 >> 2] << 2) | 0) | 0;
                  $$79121131 = ($$79121131 + 1) | 0;
                  if (($$79121131 | 0) >= (HEAP32[$54 >> 2] | 0)) break L406;
                }
                _error($0, 3);
                $$34 = 0;
                break L1;
              }
            } while (0);
            if (!(_init_blocksize($0, 0, HEAP32[$64 >> 2] | 0) | 0)) {
              $$34 = 0;
              break L1;
            }
            if (!(_init_blocksize($0, 1, HEAP32[$66 >> 2] | 0) | 0)) {
              $$34 = 0;
              break L1;
            }
            HEAP32[($0 + 92) >> 2] = HEAP32[$64 >> 2];
            $835 = HEAP32[$66 >> 2] | 0;
            HEAP32[($0 + 96) >> 2] = $835;
            $838 = ($835 << 1) & 2147483646;
            $839 = HEAP32[$546 >> 2] | 0;
            if (($839 | 0) > 0) {
              $841 = HEAP32[$549 >> 2] | 0;
              $842 = (($835 | 0) / 2) | 0;
              $$09401127 = 0;
              $$09421126 = 0;
              do {
                $844 = HEAP32[($841 + (($$09421126 * 24) | 0)) >> 2] | 0;
                $847 = HEAP32[($841 + (($$09421126 * 24) | 0) + 4) >> 2] | 0;
                $853 =
                  ((((($847 >>> 0 < $842 >>> 0 ? $847 : $842) -
                    ($844 >>> 0 < $842 >>> 0 ? $844 : $842)) |
                    0) >>>
                    0) /
                    ((HEAP32[($841 + (($$09421126 * 24) | 0) + 8) >> 2] | 0) >>>
                      0)) |
                  0;
                $$09401127 = ($853 | 0) > ($$09401127 | 0) ? $853 : $$09401127;
                $$09421126 = ($$09421126 + 1) | 0;
              } while (($$09421126 | 0) < ($839 | 0));
              $$0940$lcssa = (($$09401127 << 2) + 4) | 0;
            } else $$0940$lcssa = 4;
            $858 = Math_imul(HEAP32[$54 >> 2] | 0, $$0940$lcssa) | 0;
            $spec$select1009 = $838 >>> 0 > $858 >>> 0 ? $838 : $858;
            HEAP32[($0 + 12) >> 2] = $spec$select1009;
            HEAP8[($0 + 1365) >> 0] = 1;
            do {
              if (HEAP32[($0 + 68) >> 2] | 0) {
                $866 = HEAP32[($0 + 80) >> 2] | 0;
                if (($866 | 0) != (HEAP32[($0 + 72) >> 2] | 0))
                  ___assert_fail(1468, 1076, 4128, 1524);
                if (
                  (($spec$select1009 + 1500 + (HEAP32[($0 + 76) >> 2] | 0)) |
                    0) >>>
                    0 <=
                  $866 >>> 0
                )
                  break;
                _error($0, 3);
                $$34 = 0;
                break L1;
              }
            } while (0);
            $875 = _stb_vorbis_get_file_offset($0) | 0;
            HEAP32[($0 + 40) >> 2] = $875;
            $$34 = 1;
            break L1;
            break;
          }
          case 64: {
            $22 = (_getn($0, $1, 6) | 0) != 0;
            if ($22 & ((HEAP8[$1 >> 0] | 0) == 102))
              if ((HEAP8[($1 + 1) >> 0] | 0) == 105)
                if ((HEAP8[($1 + 2) >> 0] | 0) == 115)
                  if ((HEAP8[($1 + 3) >> 0] | 0) == 104)
                    if ((HEAP8[($1 + 4) >> 0] | 0) == 101)
                      if ((HEAP8[($1 + 5) >> 0] | 0) == 97)
                        if (((_get8($0) | 0) << 24) >> 24 == 100)
                          if (!(((_get8($0) | 0) << 24) >> 24)) {
                            _error($0, 38);
                            $$34 = 0;
                            break L1;
                          }
            break;
          }
          default: {
          }
        }
        _error($0, 34);
        $$34 = 0;
      }
    } while (0);
    STACKTOP = sp;
    return $$34 | 0;
  }
  function _malloc($0) {
    $0 = $0 | 0;
    var $$0 = 0,
      $$0$i$i = 0,
      $$0$i$i$i = 0,
      $$0$i16$i = 0,
      $$0187$i = 0,
      $$0189$i = 0,
      $$0190$i = 0,
      $$0191$i = 0,
      $$0197 = 0,
      $$0199 = 0,
      $$02065$i$i = 0,
      $$0207$lcssa$i$i = 0,
      $$02074$i$i = 0,
      $$0211$i$i = 0,
      $$0212$i$i = 0,
      $$024372$i = 0,
      $$0286$i$i = 0,
      $$028711$i$i = 0,
      $$0288$lcssa$i$i = 0,
      $$028810$i$i = 0,
      $$0294$i$i = 0,
      $$0295$i$i = 0,
      $$0340$i = 0,
      $$034217$i = 0,
      $$0343$lcssa$i = 0,
      $$034316$i = 0,
      $$0345$i = 0,
      $$0351$i = 0,
      $$0357$i = 0,
      $$0358$i = 0,
      $$0360$i = 0,
      $$0361$i = 0,
      $$0367$i = 0,
      $$1194$i = 0,
      $$1194$i$be = 0,
      $$1194$i$ph = 0,
      $$1196$i = 0,
      $$1196$i$be = 0,
      $$1196$i$ph = 0,
      $$124471$i = 0,
      $$1290$i$i = 0,
      $$1290$i$i$be = 0,
      $$1290$i$i$ph = 0,
      $$1292$i$i = 0,
      $$1292$i$i$be = 0,
      $$1292$i$i$ph = 0,
      $$1341$i = 0,
      $$1346$i = 0,
      $$1362$i = 0,
      $$1369$i = 0,
      $$1369$i$be = 0,
      $$1369$i$ph = 0,
      $$1373$i = 0,
      $$1373$i$be = 0,
      $$1373$i$ph = 0,
      $$2234243136$i = 0,
      $$2247$ph$i = 0,
      $$2253$ph$i = 0,
      $$2353$i = 0,
      $$3$i = 0,
      $$3$i$i = 0,
      $$3$i203 = 0,
      $$3$i203218 = 0,
      $$3348$i = 0,
      $$3371$i = 0,
      $$4$lcssa$i = 0,
      $$420$i = 0,
      $$420$i$ph = 0,
      $$4236$i = 0,
      $$4349$lcssa$i = 0,
      $$434919$i = 0,
      $$434919$i$ph = 0,
      $$4355$i = 0,
      $$535618$i = 0,
      $$535618$i$ph = 0,
      $$723947$i = 0,
      $$748$i = 0,
      $$pre$phi$i$iZ2D = 0,
      $$pre$phi$i18$iZ2D = 0,
      $$pre$phi$i209Z2D = 0,
      $$pre$phi$iZ2D = 0,
      $$pre$phi17$i$iZ2D = 0,
      $$pre$phiZ2D = 0,
      $1 = 0,
      $1000 = 0,
      $1003 = 0,
      $1008 = 0,
      $101 = 0,
      $1014 = 0,
      $1017 = 0,
      $1018 = 0,
      $102 = 0,
      $1025 = 0,
      $1037 = 0,
      $1042 = 0,
      $1049 = 0,
      $1050 = 0,
      $1051 = 0,
      $1060 = 0,
      $1062 = 0,
      $1063 = 0,
      $1064 = 0,
      $1070 = 0,
      $108 = 0,
      $112 = 0,
      $114 = 0,
      $115 = 0,
      $117 = 0,
      $119 = 0,
      $121 = 0,
      $123 = 0,
      $125 = 0,
      $127 = 0,
      $129 = 0,
      $134 = 0,
      $14 = 0,
      $140 = 0,
      $143 = 0,
      $146 = 0,
      $149 = 0,
      $150 = 0,
      $151 = 0,
      $153 = 0,
      $156 = 0,
      $158 = 0,
      $16 = 0,
      $161 = 0,
      $163 = 0,
      $166 = 0,
      $169 = 0,
      $17 = 0,
      $170 = 0,
      $172 = 0,
      $173 = 0,
      $175 = 0,
      $176 = 0,
      $178 = 0,
      $179 = 0,
      $18 = 0,
      $184 = 0,
      $185 = 0,
      $19 = 0,
      $193 = 0,
      $198 = 0,
      $20 = 0,
      $202 = 0,
      $208 = 0,
      $215 = 0,
      $219 = 0,
      $228 = 0,
      $229 = 0,
      $231 = 0,
      $232 = 0,
      $236 = 0,
      $237 = 0,
      $245 = 0,
      $246 = 0,
      $247 = 0,
      $249 = 0,
      $250 = 0,
      $255 = 0,
      $256 = 0,
      $259 = 0,
      $261 = 0,
      $264 = 0,
      $269 = 0,
      $27 = 0,
      $276 = 0,
      $286 = 0,
      $290 = 0,
      $299 = 0,
      $30 = 0,
      $302 = 0,
      $306 = 0,
      $308 = 0,
      $309 = 0,
      $311 = 0,
      $313 = 0,
      $315 = 0,
      $317 = 0,
      $319 = 0,
      $321 = 0,
      $323 = 0,
      $333 = 0,
      $334 = 0,
      $336 = 0,
      $34 = 0,
      $340 = 0,
      $346 = 0,
      $348 = 0,
      $351 = 0,
      $353 = 0,
      $356 = 0,
      $358 = 0,
      $361 = 0,
      $364 = 0,
      $365 = 0,
      $367 = 0,
      $368 = 0,
      $37 = 0,
      $370 = 0,
      $371 = 0,
      $373 = 0,
      $374 = 0,
      $379 = 0,
      $380 = 0,
      $385 = 0,
      $388 = 0,
      $393 = 0,
      $397 = 0,
      $403 = 0,
      $41 = 0,
      $410 = 0,
      $414 = 0,
      $422 = 0,
      $425 = 0,
      $426 = 0,
      $427 = 0,
      $431 = 0,
      $432 = 0,
      $438 = 0,
      $44 = 0,
      $443 = 0,
      $444 = 0,
      $447 = 0,
      $449 = 0,
      $452 = 0,
      $457 = 0,
      $463 = 0,
      $465 = 0,
      $467 = 0,
      $469 = 0,
      $47 = 0,
      $475 = 0,
      $487 = 0,
      $49 = 0,
      $492 = 0,
      $499 = 0,
      $50 = 0,
      $500 = 0,
      $501 = 0,
      $510 = 0,
      $512 = 0,
      $513 = 0,
      $515 = 0,
      $52 = 0,
      $524 = 0,
      $528 = 0,
      $530 = 0,
      $531 = 0,
      $532 = 0,
      $54 = 0,
      $543 = 0,
      $544 = 0,
      $545 = 0,
      $546 = 0,
      $547 = 0,
      $548 = 0,
      $550 = 0,
      $552 = 0,
      $553 = 0,
      $559 = 0,
      $56 = 0,
      $561 = 0,
      $568 = 0,
      $570 = 0,
      $572 = 0,
      $573 = 0,
      $574 = 0,
      $58 = 0,
      $582 = 0,
      $583 = 0,
      $586 = 0,
      $590 = 0,
      $593 = 0,
      $596 = 0,
      $6 = 0,
      $60 = 0,
      $602 = 0,
      $606 = 0,
      $610 = 0,
      $619 = 0,
      $62 = 0,
      $620 = 0,
      $626 = 0,
      $628 = 0,
      $632 = 0,
      $635 = 0,
      $637 = 0,
      $64 = 0,
      $641 = 0,
      $643 = 0,
      $648 = 0,
      $649 = 0,
      $650 = 0,
      $656 = 0,
      $658 = 0,
      $662 = 0,
      $664 = 0,
      $67 = 0,
      $673 = 0,
      $675 = 0,
      $680 = 0,
      $681 = 0,
      $682 = 0,
      $688 = 0,
      $69 = 0,
      $690 = 0,
      $694 = 0,
      $7 = 0,
      $70 = 0,
      $700 = 0,
      $704 = 0,
      $71 = 0,
      $710 = 0,
      $712 = 0,
      $718 = 0,
      $72 = 0,
      $722 = 0,
      $723 = 0,
      $728 = 0,
      $73 = 0,
      $734 = 0,
      $739 = 0,
      $742 = 0,
      $743 = 0,
      $746 = 0,
      $748 = 0,
      $750 = 0,
      $752 = 0,
      $764 = 0,
      $769 = 0,
      $77 = 0,
      $771 = 0,
      $774 = 0,
      $776 = 0,
      $779 = 0,
      $782 = 0,
      $783 = 0,
      $784 = 0,
      $786 = 0,
      $788 = 0,
      $789 = 0,
      $791 = 0,
      $792 = 0,
      $797 = 0,
      $798 = 0,
      $8 = 0,
      $80 = 0,
      $807 = 0,
      $812 = 0,
      $815 = 0,
      $816 = 0,
      $822 = 0,
      $83 = 0,
      $830 = 0,
      $836 = 0,
      $839 = 0,
      $84 = 0,
      $840 = 0,
      $841 = 0,
      $845 = 0,
      $846 = 0,
      $852 = 0,
      $857 = 0,
      $858 = 0,
      $861 = 0,
      $863 = 0,
      $866 = 0,
      $87 = 0,
      $871 = 0,
      $877 = 0,
      $879 = 0,
      $881 = 0,
      $882 = 0,
      $889 = 0,
      $9 = 0,
      $901 = 0,
      $906 = 0,
      $913 = 0,
      $914 = 0,
      $915 = 0,
      $92 = 0,
      $923 = 0,
      $927 = 0,
      $93 = 0,
      $931 = 0,
      $933 = 0,
      $939 = 0,
      $940 = 0,
      $942 = 0,
      $943 = 0,
      $945 = 0,
      $947 = 0,
      $95 = 0,
      $952 = 0,
      $953 = 0,
      $954 = 0,
      $96 = 0,
      $960 = 0,
      $962 = 0,
      $968 = 0,
      $973 = 0,
      $976 = 0,
      $977 = 0,
      $978 = 0,
      $98 = 0,
      $982 = 0,
      $983 = 0,
      $989 = 0,
      $994 = 0,
      $995 = 0,
      $998 = 0,
      $spec$select$i205 = 0,
      $spec$select3$i = 0,
      $spec$select49$i = 0,
      label = 0,
      sp = 0,
      $962$looptemp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 16) | 0;
    $1 = sp;
    do {
      if ($0 >>> 0 < 245) {
        $6 = $0 >>> 0 < 11 ? 16 : ($0 + 11) & -8;
        $7 = $6 >>> 3;
        $8 = HEAP32[720] | 0;
        $9 = $8 >>> $7;
        if (($9 & 3) | 0) {
          $14 = ((($9 & 1) ^ 1) + $7) | 0;
          $16 = (2920 + (($14 << 1) << 2)) | 0;
          $17 = ($16 + 8) | 0;
          $18 = HEAP32[$17 >> 2] | 0;
          $19 = ($18 + 8) | 0;
          $20 = HEAP32[$19 >> 2] | 0;
          do {
            if (($20 | 0) == ($16 | 0)) HEAP32[720] = $8 & ~(1 << $14);
            else {
              if ((HEAP32[724] | 0) >>> 0 > $20 >>> 0) _abort();
              $27 = ($20 + 12) | 0;
              if ((HEAP32[$27 >> 2] | 0) == ($18 | 0)) {
                HEAP32[$27 >> 2] = $16;
                HEAP32[$17 >> 2] = $20;
                break;
              } else _abort();
            }
          } while (0);
          $30 = $14 << 3;
          HEAP32[($18 + 4) >> 2] = $30 | 3;
          $34 = ($18 + $30 + 4) | 0;
          HEAP32[$34 >> 2] = HEAP32[$34 >> 2] | 1;
          $$0 = $19;
          STACKTOP = sp;
          return $$0 | 0;
        }
        $37 = HEAP32[722] | 0;
        if ($6 >>> 0 > $37 >>> 0) {
          if ($9 | 0) {
            $41 = 2 << $7;
            $44 = ($9 << $7) & ($41 | (0 - $41));
            $47 = (($44 & (0 - $44)) + -1) | 0;
            $49 = ($47 >>> 12) & 16;
            $50 = $47 >>> $49;
            $52 = ($50 >>> 5) & 8;
            $54 = $50 >>> $52;
            $56 = ($54 >>> 2) & 4;
            $58 = $54 >>> $56;
            $60 = ($58 >>> 1) & 2;
            $62 = $58 >>> $60;
            $64 = ($62 >>> 1) & 1;
            $67 = (($52 | $49 | $56 | $60 | $64) + ($62 >>> $64)) | 0;
            $69 = (2920 + (($67 << 1) << 2)) | 0;
            $70 = ($69 + 8) | 0;
            $71 = HEAP32[$70 >> 2] | 0;
            $72 = ($71 + 8) | 0;
            $73 = HEAP32[$72 >> 2] | 0;
            do {
              if (($73 | 0) == ($69 | 0)) {
                $77 = $8 & ~(1 << $67);
                HEAP32[720] = $77;
                $98 = $77;
              } else {
                if ((HEAP32[724] | 0) >>> 0 > $73 >>> 0) _abort();
                $80 = ($73 + 12) | 0;
                if ((HEAP32[$80 >> 2] | 0) == ($71 | 0)) {
                  HEAP32[$80 >> 2] = $69;
                  HEAP32[$70 >> 2] = $73;
                  $98 = $8;
                  break;
                } else _abort();
              }
            } while (0);
            $83 = $67 << 3;
            $84 = ($83 - $6) | 0;
            HEAP32[($71 + 4) >> 2] = $6 | 3;
            $87 = ($71 + $6) | 0;
            HEAP32[($87 + 4) >> 2] = $84 | 1;
            HEAP32[($71 + $83) >> 2] = $84;
            if ($37 | 0) {
              $92 = HEAP32[725] | 0;
              $93 = $37 >>> 3;
              $95 = (2920 + (($93 << 1) << 2)) | 0;
              $96 = 1 << $93;
              if (!($98 & $96)) {
                HEAP32[720] = $98 | $96;
                $$0199 = $95;
                $$pre$phiZ2D = ($95 + 8) | 0;
              } else {
                $101 = ($95 + 8) | 0;
                $102 = HEAP32[$101 >> 2] | 0;
                if ((HEAP32[724] | 0) >>> 0 > $102 >>> 0) _abort();
                else {
                  $$0199 = $102;
                  $$pre$phiZ2D = $101;
                }
              }
              HEAP32[$$pre$phiZ2D >> 2] = $92;
              HEAP32[($$0199 + 12) >> 2] = $92;
              HEAP32[($92 + 8) >> 2] = $$0199;
              HEAP32[($92 + 12) >> 2] = $95;
            }
            HEAP32[722] = $84;
            HEAP32[725] = $87;
            $$0 = $72;
            STACKTOP = sp;
            return $$0 | 0;
          }
          $108 = HEAP32[721] | 0;
          if (!$108) $$0197 = $6;
          else {
            $112 = (($108 & (0 - $108)) + -1) | 0;
            $114 = ($112 >>> 12) & 16;
            $115 = $112 >>> $114;
            $117 = ($115 >>> 5) & 8;
            $119 = $115 >>> $117;
            $121 = ($119 >>> 2) & 4;
            $123 = $119 >>> $121;
            $125 = ($123 >>> 1) & 2;
            $127 = $123 >>> $125;
            $129 = ($127 >>> 1) & 1;
            $134 =
              HEAP32[
                (3184 +
                  ((($117 | $114 | $121 | $125 | $129) + ($127 >>> $129)) <<
                    2)) >>
                  2
              ] | 0;
            $$0189$i = $134;
            $$0190$i = $134;
            $$0191$i = ((HEAP32[($134 + 4) >> 2] & -8) - $6) | 0;
            while (1) {
              $140 = HEAP32[($$0189$i + 16) >> 2] | 0;
              if (!$140) {
                $143 = HEAP32[($$0189$i + 20) >> 2] | 0;
                if (!$143) break;
                else $146 = $143;
              } else $146 = $140;
              $149 = ((HEAP32[($146 + 4) >> 2] & -8) - $6) | 0;
              $150 = $149 >>> 0 < $$0191$i >>> 0;
              $$0189$i = $146;
              $$0190$i = $150 ? $146 : $$0190$i;
              $$0191$i = $150 ? $149 : $$0191$i;
            }
            $151 = HEAP32[724] | 0;
            if ($151 >>> 0 > $$0190$i >>> 0) _abort();
            $153 = ($$0190$i + $6) | 0;
            if ($153 >>> 0 <= $$0190$i >>> 0) _abort();
            $156 = HEAP32[($$0190$i + 24) >> 2] | 0;
            $158 = HEAP32[($$0190$i + 12) >> 2] | 0;
            do {
              if (($158 | 0) == ($$0190$i | 0)) {
                $169 = ($$0190$i + 20) | 0;
                $170 = HEAP32[$169 >> 2] | 0;
                if (!$170) {
                  $172 = ($$0190$i + 16) | 0;
                  $173 = HEAP32[$172 >> 2] | 0;
                  if (!$173) {
                    $$3$i = 0;
                    break;
                  } else {
                    $$1194$i$ph = $173;
                    $$1196$i$ph = $172;
                  }
                } else {
                  $$1194$i$ph = $170;
                  $$1196$i$ph = $169;
                }
                $$1194$i = $$1194$i$ph;
                $$1196$i = $$1196$i$ph;
                while (1) {
                  $175 = ($$1194$i + 20) | 0;
                  $176 = HEAP32[$175 >> 2] | 0;
                  if (!$176) {
                    $178 = ($$1194$i + 16) | 0;
                    $179 = HEAP32[$178 >> 2] | 0;
                    if (!$179) break;
                    else {
                      $$1194$i$be = $179;
                      $$1196$i$be = $178;
                    }
                  } else {
                    $$1194$i$be = $176;
                    $$1196$i$be = $175;
                  }
                  $$1194$i = $$1194$i$be;
                  $$1196$i = $$1196$i$be;
                }
                if ($151 >>> 0 > $$1196$i >>> 0) _abort();
                else {
                  HEAP32[$$1196$i >> 2] = 0;
                  $$3$i = $$1194$i;
                  break;
                }
              } else {
                $161 = HEAP32[($$0190$i + 8) >> 2] | 0;
                if ($151 >>> 0 > $161 >>> 0) _abort();
                $163 = ($161 + 12) | 0;
                if ((HEAP32[$163 >> 2] | 0) != ($$0190$i | 0)) _abort();
                $166 = ($158 + 8) | 0;
                if ((HEAP32[$166 >> 2] | 0) == ($$0190$i | 0)) {
                  HEAP32[$163 >> 2] = $158;
                  HEAP32[$166 >> 2] = $161;
                  $$3$i = $158;
                  break;
                } else _abort();
              }
            } while (0);
            L78: do {
              if ($156 | 0) {
                $184 = HEAP32[($$0190$i + 28) >> 2] | 0;
                $185 = (3184 + ($184 << 2)) | 0;
                do {
                  if (($$0190$i | 0) == (HEAP32[$185 >> 2] | 0)) {
                    HEAP32[$185 >> 2] = $$3$i;
                    if (!$$3$i) {
                      HEAP32[721] = $108 & ~(1 << $184);
                      break L78;
                    }
                  } else if ((HEAP32[724] | 0) >>> 0 > $156 >>> 0) _abort();
                  else {
                    $193 = ($156 + 16) | 0;
                    HEAP32[
                      ((HEAP32[$193 >> 2] | 0) == ($$0190$i | 0)
                        ? $193
                        : ($156 + 20) | 0) >> 2
                    ] = $$3$i;
                    if (!$$3$i) break L78;
                    else break;
                  }
                } while (0);
                $198 = HEAP32[724] | 0;
                if ($198 >>> 0 > $$3$i >>> 0) _abort();
                HEAP32[($$3$i + 24) >> 2] = $156;
                $202 = HEAP32[($$0190$i + 16) >> 2] | 0;
                do {
                  if ($202 | 0)
                    if ($198 >>> 0 > $202 >>> 0) _abort();
                    else {
                      HEAP32[($$3$i + 16) >> 2] = $202;
                      HEAP32[($202 + 24) >> 2] = $$3$i;
                      break;
                    }
                } while (0);
                $208 = HEAP32[($$0190$i + 20) >> 2] | 0;
                if ($208 | 0)
                  if ((HEAP32[724] | 0) >>> 0 > $208 >>> 0) _abort();
                  else {
                    HEAP32[($$3$i + 20) >> 2] = $208;
                    HEAP32[($208 + 24) >> 2] = $$3$i;
                    break;
                  }
              }
            } while (0);
            if ($$0191$i >>> 0 < 16) {
              $215 = ($$0191$i + $6) | 0;
              HEAP32[($$0190$i + 4) >> 2] = $215 | 3;
              $219 = ($$0190$i + $215 + 4) | 0;
              HEAP32[$219 >> 2] = HEAP32[$219 >> 2] | 1;
            } else {
              HEAP32[($$0190$i + 4) >> 2] = $6 | 3;
              HEAP32[($153 + 4) >> 2] = $$0191$i | 1;
              HEAP32[($153 + $$0191$i) >> 2] = $$0191$i;
              if ($37 | 0) {
                $228 = HEAP32[725] | 0;
                $229 = $37 >>> 3;
                $231 = (2920 + (($229 << 1) << 2)) | 0;
                $232 = 1 << $229;
                if (!($232 & $8)) {
                  HEAP32[720] = $232 | $8;
                  $$0187$i = $231;
                  $$pre$phi$iZ2D = ($231 + 8) | 0;
                } else {
                  $236 = ($231 + 8) | 0;
                  $237 = HEAP32[$236 >> 2] | 0;
                  if ((HEAP32[724] | 0) >>> 0 > $237 >>> 0) _abort();
                  else {
                    $$0187$i = $237;
                    $$pre$phi$iZ2D = $236;
                  }
                }
                HEAP32[$$pre$phi$iZ2D >> 2] = $228;
                HEAP32[($$0187$i + 12) >> 2] = $228;
                HEAP32[($228 + 8) >> 2] = $$0187$i;
                HEAP32[($228 + 12) >> 2] = $231;
              }
              HEAP32[722] = $$0191$i;
              HEAP32[725] = $153;
            }
            $$0 = ($$0190$i + 8) | 0;
            STACKTOP = sp;
            return $$0 | 0;
          }
        } else $$0197 = $6;
      } else if ($0 >>> 0 > 4294967231) $$0197 = -1;
      else {
        $245 = ($0 + 11) | 0;
        $246 = $245 & -8;
        $247 = HEAP32[721] | 0;
        if (!$247) $$0197 = $246;
        else {
          $249 = (0 - $246) | 0;
          $250 = $245 >>> 8;
          if (!$250) $$0357$i = 0;
          else if ($246 >>> 0 > 16777215) $$0357$i = 31;
          else {
            $255 = ((($250 + 1048320) | 0) >>> 16) & 8;
            $256 = $250 << $255;
            $259 = ((($256 + 520192) | 0) >>> 16) & 4;
            $261 = $256 << $259;
            $264 = ((($261 + 245760) | 0) >>> 16) & 2;
            $269 = (14 - ($259 | $255 | $264) + (($261 << $264) >>> 15)) | 0;
            $$0357$i = (($246 >>> (($269 + 7) | 0)) & 1) | ($269 << 1);
          }
          $276 = HEAP32[(3184 + ($$0357$i << 2)) >> 2] | 0;
          L122: do {
            if (!$276) {
              $$2353$i = 0;
              $$3$i203 = 0;
              $$3348$i = $249;
              label = 85;
            } else {
              $$0340$i = 0;
              $$0345$i = $249;
              $$0351$i = $276;
              $$0358$i =
                $246 <<
                (($$0357$i | 0) == 31 ? 0 : (25 - ($$0357$i >>> 1)) | 0);
              $$0361$i = 0;
              while (1) {
                $286 = ((HEAP32[($$0351$i + 4) >> 2] & -8) - $246) | 0;
                if ($286 >>> 0 < $$0345$i >>> 0)
                  if (!$286) {
                    $$420$i$ph = $$0351$i;
                    $$434919$i$ph = 0;
                    $$535618$i$ph = $$0351$i;
                    label = 89;
                    break L122;
                  } else {
                    $$1341$i = $$0351$i;
                    $$1346$i = $286;
                  }
                else {
                  $$1341$i = $$0340$i;
                  $$1346$i = $$0345$i;
                }
                $290 = HEAP32[($$0351$i + 20) >> 2] | 0;
                $$0351$i =
                  HEAP32[($$0351$i + 16 + (($$0358$i >>> 31) << 2)) >> 2] | 0;
                $$1362$i =
                  (($290 | 0) == 0) | (($290 | 0) == ($$0351$i | 0))
                    ? $$0361$i
                    : $290;
                if (!$$0351$i) {
                  $$2353$i = $$1362$i;
                  $$3$i203 = $$1341$i;
                  $$3348$i = $$1346$i;
                  label = 85;
                  break;
                } else {
                  $$0340$i = $$1341$i;
                  $$0345$i = $$1346$i;
                  $$0358$i = $$0358$i << 1;
                  $$0361$i = $$1362$i;
                }
              }
            }
          } while (0);
          if ((label | 0) == 85) {
            if ((($$2353$i | 0) == 0) & (($$3$i203 | 0) == 0)) {
              $299 = 2 << $$0357$i;
              $302 = ($299 | (0 - $299)) & $247;
              if (!$302) {
                $$0197 = $246;
                break;
              }
              $306 = (($302 & (0 - $302)) + -1) | 0;
              $308 = ($306 >>> 12) & 16;
              $309 = $306 >>> $308;
              $311 = ($309 >>> 5) & 8;
              $313 = $309 >>> $311;
              $315 = ($313 >>> 2) & 4;
              $317 = $313 >>> $315;
              $319 = ($317 >>> 1) & 2;
              $321 = $317 >>> $319;
              $323 = ($321 >>> 1) & 1;
              $$3$i203218 = 0;
              $$4355$i =
                HEAP32[
                  (3184 +
                    ((($311 | $308 | $315 | $319 | $323) + ($321 >>> $323)) <<
                      2)) >>
                    2
                ] | 0;
            } else {
              $$3$i203218 = $$3$i203;
              $$4355$i = $$2353$i;
            }
            if (!$$4355$i) {
              $$4$lcssa$i = $$3$i203218;
              $$4349$lcssa$i = $$3348$i;
            } else {
              $$420$i$ph = $$3$i203218;
              $$434919$i$ph = $$3348$i;
              $$535618$i$ph = $$4355$i;
              label = 89;
            }
          }
          if ((label | 0) == 89) {
            $$420$i = $$420$i$ph;
            $$434919$i = $$434919$i$ph;
            $$535618$i = $$535618$i$ph;
            while (1) {
              $333 = ((HEAP32[($$535618$i + 4) >> 2] & -8) - $246) | 0;
              $334 = $333 >>> 0 < $$434919$i >>> 0;
              $spec$select$i205 = $334 ? $333 : $$434919$i;
              $spec$select3$i = $334 ? $$535618$i : $$420$i;
              $336 = HEAP32[($$535618$i + 16) >> 2] | 0;
              if (!$336) $340 = HEAP32[($$535618$i + 20) >> 2] | 0;
              else $340 = $336;
              if (!$340) {
                $$4$lcssa$i = $spec$select3$i;
                $$4349$lcssa$i = $spec$select$i205;
                break;
              } else {
                $$420$i = $spec$select3$i;
                $$434919$i = $spec$select$i205;
                $$535618$i = $340;
              }
            }
          }
          if (!$$4$lcssa$i) $$0197 = $246;
          else if (
            $$4349$lcssa$i >>> 0 <
            (((HEAP32[722] | 0) - $246) | 0) >>> 0
          ) {
            $346 = HEAP32[724] | 0;
            if ($346 >>> 0 > $$4$lcssa$i >>> 0) _abort();
            $348 = ($$4$lcssa$i + $246) | 0;
            if ($348 >>> 0 <= $$4$lcssa$i >>> 0) _abort();
            $351 = HEAP32[($$4$lcssa$i + 24) >> 2] | 0;
            $353 = HEAP32[($$4$lcssa$i + 12) >> 2] | 0;
            do {
              if (($353 | 0) == ($$4$lcssa$i | 0)) {
                $364 = ($$4$lcssa$i + 20) | 0;
                $365 = HEAP32[$364 >> 2] | 0;
                if (!$365) {
                  $367 = ($$4$lcssa$i + 16) | 0;
                  $368 = HEAP32[$367 >> 2] | 0;
                  if (!$368) {
                    $$3371$i = 0;
                    break;
                  } else {
                    $$1369$i$ph = $368;
                    $$1373$i$ph = $367;
                  }
                } else {
                  $$1369$i$ph = $365;
                  $$1373$i$ph = $364;
                }
                $$1369$i = $$1369$i$ph;
                $$1373$i = $$1373$i$ph;
                while (1) {
                  $370 = ($$1369$i + 20) | 0;
                  $371 = HEAP32[$370 >> 2] | 0;
                  if (!$371) {
                    $373 = ($$1369$i + 16) | 0;
                    $374 = HEAP32[$373 >> 2] | 0;
                    if (!$374) break;
                    else {
                      $$1369$i$be = $374;
                      $$1373$i$be = $373;
                    }
                  } else {
                    $$1369$i$be = $371;
                    $$1373$i$be = $370;
                  }
                  $$1369$i = $$1369$i$be;
                  $$1373$i = $$1373$i$be;
                }
                if ($346 >>> 0 > $$1373$i >>> 0) _abort();
                else {
                  HEAP32[$$1373$i >> 2] = 0;
                  $$3371$i = $$1369$i;
                  break;
                }
              } else {
                $356 = HEAP32[($$4$lcssa$i + 8) >> 2] | 0;
                if ($346 >>> 0 > $356 >>> 0) _abort();
                $358 = ($356 + 12) | 0;
                if ((HEAP32[$358 >> 2] | 0) != ($$4$lcssa$i | 0)) _abort();
                $361 = ($353 + 8) | 0;
                if ((HEAP32[$361 >> 2] | 0) == ($$4$lcssa$i | 0)) {
                  HEAP32[$358 >> 2] = $353;
                  HEAP32[$361 >> 2] = $356;
                  $$3371$i = $353;
                  break;
                } else _abort();
              }
            } while (0);
            L176: do {
              if (!$351) $469 = $247;
              else {
                $379 = HEAP32[($$4$lcssa$i + 28) >> 2] | 0;
                $380 = (3184 + ($379 << 2)) | 0;
                do {
                  if (($$4$lcssa$i | 0) == (HEAP32[$380 >> 2] | 0)) {
                    HEAP32[$380 >> 2] = $$3371$i;
                    if (!$$3371$i) {
                      $385 = $247 & ~(1 << $379);
                      HEAP32[721] = $385;
                      $469 = $385;
                      break L176;
                    }
                  } else if ((HEAP32[724] | 0) >>> 0 > $351 >>> 0) _abort();
                  else {
                    $388 = ($351 + 16) | 0;
                    HEAP32[
                      ((HEAP32[$388 >> 2] | 0) == ($$4$lcssa$i | 0)
                        ? $388
                        : ($351 + 20) | 0) >> 2
                    ] = $$3371$i;
                    if (!$$3371$i) {
                      $469 = $247;
                      break L176;
                    } else break;
                  }
                } while (0);
                $393 = HEAP32[724] | 0;
                if ($393 >>> 0 > $$3371$i >>> 0) _abort();
                HEAP32[($$3371$i + 24) >> 2] = $351;
                $397 = HEAP32[($$4$lcssa$i + 16) >> 2] | 0;
                do {
                  if ($397 | 0)
                    if ($393 >>> 0 > $397 >>> 0) _abort();
                    else {
                      HEAP32[($$3371$i + 16) >> 2] = $397;
                      HEAP32[($397 + 24) >> 2] = $$3371$i;
                      break;
                    }
                } while (0);
                $403 = HEAP32[($$4$lcssa$i + 20) >> 2] | 0;
                if (!$403) $469 = $247;
                else if ((HEAP32[724] | 0) >>> 0 > $403 >>> 0) _abort();
                else {
                  HEAP32[($$3371$i + 20) >> 2] = $403;
                  HEAP32[($403 + 24) >> 2] = $$3371$i;
                  $469 = $247;
                  break;
                }
              }
            } while (0);
            L200: do {
              if ($$4349$lcssa$i >>> 0 < 16) {
                $410 = ($$4349$lcssa$i + $246) | 0;
                HEAP32[($$4$lcssa$i + 4) >> 2] = $410 | 3;
                $414 = ($$4$lcssa$i + $410 + 4) | 0;
                HEAP32[$414 >> 2] = HEAP32[$414 >> 2] | 1;
              } else {
                HEAP32[($$4$lcssa$i + 4) >> 2] = $246 | 3;
                HEAP32[($348 + 4) >> 2] = $$4349$lcssa$i | 1;
                HEAP32[($348 + $$4349$lcssa$i) >> 2] = $$4349$lcssa$i;
                $422 = $$4349$lcssa$i >>> 3;
                if ($$4349$lcssa$i >>> 0 < 256) {
                  $425 = (2920 + (($422 << 1) << 2)) | 0;
                  $426 = HEAP32[720] | 0;
                  $427 = 1 << $422;
                  if (!($426 & $427)) {
                    HEAP32[720] = $426 | $427;
                    $$0367$i = $425;
                    $$pre$phi$i209Z2D = ($425 + 8) | 0;
                  } else {
                    $431 = ($425 + 8) | 0;
                    $432 = HEAP32[$431 >> 2] | 0;
                    if ((HEAP32[724] | 0) >>> 0 > $432 >>> 0) _abort();
                    else {
                      $$0367$i = $432;
                      $$pre$phi$i209Z2D = $431;
                    }
                  }
                  HEAP32[$$pre$phi$i209Z2D >> 2] = $348;
                  HEAP32[($$0367$i + 12) >> 2] = $348;
                  HEAP32[($348 + 8) >> 2] = $$0367$i;
                  HEAP32[($348 + 12) >> 2] = $425;
                  break;
                }
                $438 = $$4349$lcssa$i >>> 8;
                if (!$438) $$0360$i = 0;
                else if ($$4349$lcssa$i >>> 0 > 16777215) $$0360$i = 31;
                else {
                  $443 = ((($438 + 1048320) | 0) >>> 16) & 8;
                  $444 = $438 << $443;
                  $447 = ((($444 + 520192) | 0) >>> 16) & 4;
                  $449 = $444 << $447;
                  $452 = ((($449 + 245760) | 0) >>> 16) & 2;
                  $457 =
                    (14 - ($447 | $443 | $452) + (($449 << $452) >>> 15)) | 0;
                  $$0360$i =
                    (($$4349$lcssa$i >>> (($457 + 7) | 0)) & 1) | ($457 << 1);
                }
                $463 = (3184 + ($$0360$i << 2)) | 0;
                HEAP32[($348 + 28) >> 2] = $$0360$i;
                $465 = ($348 + 16) | 0;
                HEAP32[($465 + 4) >> 2] = 0;
                HEAP32[$465 >> 2] = 0;
                $467 = 1 << $$0360$i;
                if (!($469 & $467)) {
                  HEAP32[721] = $469 | $467;
                  HEAP32[$463 >> 2] = $348;
                  HEAP32[($348 + 24) >> 2] = $463;
                  HEAP32[($348 + 12) >> 2] = $348;
                  HEAP32[($348 + 8) >> 2] = $348;
                  break;
                }
                $475 = HEAP32[$463 >> 2] | 0;
                L218: do {
                  if (
                    ((HEAP32[($475 + 4) >> 2] & -8) | 0) ==
                    ($$4349$lcssa$i | 0)
                  )
                    $$0343$lcssa$i = $475;
                  else {
                    $$034217$i =
                      $$4349$lcssa$i <<
                      (($$0360$i | 0) == 31 ? 0 : (25 - ($$0360$i >>> 1)) | 0);
                    $$034316$i = $475;
                    while (1) {
                      $492 = ($$034316$i + 16 + (($$034217$i >>> 31) << 2)) | 0;
                      $487 = HEAP32[$492 >> 2] | 0;
                      if (!$487) break;
                      if (
                        ((HEAP32[($487 + 4) >> 2] & -8) | 0) ==
                        ($$4349$lcssa$i | 0)
                      ) {
                        $$0343$lcssa$i = $487;
                        break L218;
                      } else {
                        $$034217$i = $$034217$i << 1;
                        $$034316$i = $487;
                      }
                    }
                    if ((HEAP32[724] | 0) >>> 0 > $492 >>> 0) _abort();
                    else {
                      HEAP32[$492 >> 2] = $348;
                      HEAP32[($348 + 24) >> 2] = $$034316$i;
                      HEAP32[($348 + 12) >> 2] = $348;
                      HEAP32[($348 + 8) >> 2] = $348;
                      break L200;
                    }
                  }
                } while (0);
                $499 = ($$0343$lcssa$i + 8) | 0;
                $500 = HEAP32[$499 >> 2] | 0;
                $501 = HEAP32[724] | 0;
                if (
                  ($501 >>> 0 <= $500 >>> 0) &
                  ($501 >>> 0 <= $$0343$lcssa$i >>> 0)
                ) {
                  HEAP32[($500 + 12) >> 2] = $348;
                  HEAP32[$499 >> 2] = $348;
                  HEAP32[($348 + 8) >> 2] = $500;
                  HEAP32[($348 + 12) >> 2] = $$0343$lcssa$i;
                  HEAP32[($348 + 24) >> 2] = 0;
                  break;
                } else _abort();
              }
            } while (0);
            $$0 = ($$4$lcssa$i + 8) | 0;
            STACKTOP = sp;
            return $$0 | 0;
          } else $$0197 = $246;
        }
      }
    } while (0);
    $510 = HEAP32[722] | 0;
    if ($510 >>> 0 >= $$0197 >>> 0) {
      $512 = ($510 - $$0197) | 0;
      $513 = HEAP32[725] | 0;
      if ($512 >>> 0 > 15) {
        $515 = ($513 + $$0197) | 0;
        HEAP32[725] = $515;
        HEAP32[722] = $512;
        HEAP32[($515 + 4) >> 2] = $512 | 1;
        HEAP32[($513 + $510) >> 2] = $512;
        HEAP32[($513 + 4) >> 2] = $$0197 | 3;
      } else {
        HEAP32[722] = 0;
        HEAP32[725] = 0;
        HEAP32[($513 + 4) >> 2] = $510 | 3;
        $524 = ($513 + $510 + 4) | 0;
        HEAP32[$524 >> 2] = HEAP32[$524 >> 2] | 1;
      }
      $$0 = ($513 + 8) | 0;
      STACKTOP = sp;
      return $$0 | 0;
    }
    $528 = HEAP32[723] | 0;
    if ($528 >>> 0 > $$0197 >>> 0) {
      $530 = ($528 - $$0197) | 0;
      HEAP32[723] = $530;
      $531 = HEAP32[726] | 0;
      $532 = ($531 + $$0197) | 0;
      HEAP32[726] = $532;
      HEAP32[($532 + 4) >> 2] = $530 | 1;
      HEAP32[($531 + 4) >> 2] = $$0197 | 3;
      $$0 = ($531 + 8) | 0;
      STACKTOP = sp;
      return $$0 | 0;
    }
    if (!(HEAP32[838] | 0)) {
      HEAP32[840] = 4096;
      HEAP32[839] = 4096;
      HEAP32[841] = -1;
      HEAP32[842] = -1;
      HEAP32[843] = 0;
      HEAP32[831] = 0;
      HEAP32[838] = ($1 & -16) ^ 1431655768;
      $546 = 4096;
    } else $546 = HEAP32[840] | 0;
    $543 = ($$0197 + 48) | 0;
    $544 = ($$0197 + 47) | 0;
    $545 = ($546 + $544) | 0;
    $547 = (0 - $546) | 0;
    $548 = $545 & $547;
    if ($548 >>> 0 <= $$0197 >>> 0) {
      $$0 = 0;
      STACKTOP = sp;
      return $$0 | 0;
    }
    $550 = HEAP32[830] | 0;
    if ($550 | 0) {
      $552 = HEAP32[828] | 0;
      $553 = ($552 + $548) | 0;
      if (($553 >>> 0 <= $552 >>> 0) | ($553 >>> 0 > $550 >>> 0)) {
        $$0 = 0;
        STACKTOP = sp;
        return $$0 | 0;
      }
    }
    L257: do {
      if (!(HEAP32[831] & 4)) {
        $559 = HEAP32[726] | 0;
        L259: do {
          if (!$559) label = 173;
          else {
            $$0$i$i = 3328;
            while (1) {
              $561 = HEAP32[$$0$i$i >> 2] | 0;
              if ($561 >>> 0 <= $559 >>> 0)
                if (
                  (($561 + (HEAP32[($$0$i$i + 4) >> 2] | 0)) | 0) >>> 0 >
                  $559 >>> 0
                )
                  break;
              $568 = HEAP32[($$0$i$i + 8) >> 2] | 0;
              if (!$568) {
                label = 173;
                break L259;
              } else $$0$i$i = $568;
            }
            $593 = ($545 - $528) & $547;
            if ($593 >>> 0 < 2147483647) {
              $596 = _sbrk($593 | 0) | 0;
              if (
                ($596 | 0) ==
                (((HEAP32[$$0$i$i >> 2] | 0) +
                  (HEAP32[($$0$i$i + 4) >> 2] | 0)) |
                  0)
              )
                if (($596 | 0) == (-1 | 0)) $$2234243136$i = $593;
                else {
                  $$723947$i = $593;
                  $$748$i = $596;
                  label = 190;
                  break L257;
                }
              else {
                $$2247$ph$i = $596;
                $$2253$ph$i = $593;
                label = 181;
              }
            } else $$2234243136$i = 0;
          }
        } while (0);
        do {
          if ((label | 0) == 173) {
            $570 = _sbrk(0) | 0;
            if (($570 | 0) == (-1 | 0)) $$2234243136$i = 0;
            else {
              $572 = $570;
              $573 = HEAP32[839] | 0;
              $574 = ($573 + -1) | 0;
              $spec$select49$i =
                (((($574 & $572) | 0) == 0
                  ? 0
                  : ((($574 + $572) & (0 - $573)) - $572) | 0) +
                  $548) |
                0;
              $582 = HEAP32[828] | 0;
              $583 = ($spec$select49$i + $582) | 0;
              if (
                ($spec$select49$i >>> 0 > $$0197 >>> 0) &
                ($spec$select49$i >>> 0 < 2147483647)
              ) {
                $586 = HEAP32[830] | 0;
                if ($586 | 0)
                  if (($583 >>> 0 <= $582 >>> 0) | ($583 >>> 0 > $586 >>> 0)) {
                    $$2234243136$i = 0;
                    break;
                  }
                $590 = _sbrk($spec$select49$i | 0) | 0;
                if (($590 | 0) == ($570 | 0)) {
                  $$723947$i = $spec$select49$i;
                  $$748$i = $570;
                  label = 190;
                  break L257;
                } else {
                  $$2247$ph$i = $590;
                  $$2253$ph$i = $spec$select49$i;
                  label = 181;
                }
              } else $$2234243136$i = 0;
            }
          }
        } while (0);
        do {
          if ((label | 0) == 181) {
            $602 = (0 - $$2253$ph$i) | 0;
            if (
              !(
                ($543 >>> 0 > $$2253$ph$i >>> 0) &
                (($$2253$ph$i >>> 0 < 2147483647) &
                  (($$2247$ph$i | 0) != (-1 | 0)))
              )
            )
              if (($$2247$ph$i | 0) == (-1 | 0)) {
                $$2234243136$i = 0;
                break;
              } else {
                $$723947$i = $$2253$ph$i;
                $$748$i = $$2247$ph$i;
                label = 190;
                break L257;
              }
            $606 = HEAP32[840] | 0;
            $610 = ($544 - $$2253$ph$i + $606) & (0 - $606);
            if ($610 >>> 0 >= 2147483647) {
              $$723947$i = $$2253$ph$i;
              $$748$i = $$2247$ph$i;
              label = 190;
              break L257;
            }
            if ((_sbrk($610 | 0) | 0) == (-1 | 0)) {
              _sbrk($602 | 0) | 0;
              $$2234243136$i = 0;
              break;
            } else {
              $$723947$i = ($610 + $$2253$ph$i) | 0;
              $$748$i = $$2247$ph$i;
              label = 190;
              break L257;
            }
          }
        } while (0);
        HEAP32[831] = HEAP32[831] | 4;
        $$4236$i = $$2234243136$i;
        label = 188;
      } else {
        $$4236$i = 0;
        label = 188;
      }
    } while (0);
    if ((label | 0) == 188)
      if ($548 >>> 0 < 2147483647) {
        $619 = _sbrk($548 | 0) | 0;
        $620 = _sbrk(0) | 0;
        $626 = ($620 - $619) | 0;
        $628 = $626 >>> 0 > (($$0197 + 40) | 0) >>> 0;
        if (
          !(
            (($619 | 0) == (-1 | 0)) |
            ($628 ^ 1) |
            ((($619 >>> 0 < $620 >>> 0) &
              ((($619 | 0) != (-1 | 0)) & (($620 | 0) != (-1 | 0)))) ^
              1)
          )
        ) {
          $$723947$i = $628 ? $626 : $$4236$i;
          $$748$i = $619;
          label = 190;
        }
      }
    if ((label | 0) == 190) {
      $632 = ((HEAP32[828] | 0) + $$723947$i) | 0;
      HEAP32[828] = $632;
      if ($632 >>> 0 > (HEAP32[829] | 0) >>> 0) HEAP32[829] = $632;
      $635 = HEAP32[726] | 0;
      L294: do {
        if (!$635) {
          $637 = HEAP32[724] | 0;
          if ((($637 | 0) == 0) | ($$748$i >>> 0 < $637 >>> 0))
            HEAP32[724] = $$748$i;
          HEAP32[832] = $$748$i;
          HEAP32[833] = $$723947$i;
          HEAP32[835] = 0;
          HEAP32[729] = HEAP32[838];
          HEAP32[728] = -1;
          HEAP32[733] = 2920;
          HEAP32[732] = 2920;
          HEAP32[735] = 2928;
          HEAP32[734] = 2928;
          HEAP32[737] = 2936;
          HEAP32[736] = 2936;
          HEAP32[739] = 2944;
          HEAP32[738] = 2944;
          HEAP32[741] = 2952;
          HEAP32[740] = 2952;
          HEAP32[743] = 2960;
          HEAP32[742] = 2960;
          HEAP32[745] = 2968;
          HEAP32[744] = 2968;
          HEAP32[747] = 2976;
          HEAP32[746] = 2976;
          HEAP32[749] = 2984;
          HEAP32[748] = 2984;
          HEAP32[751] = 2992;
          HEAP32[750] = 2992;
          HEAP32[753] = 3e3;
          HEAP32[752] = 3e3;
          HEAP32[755] = 3008;
          HEAP32[754] = 3008;
          HEAP32[757] = 3016;
          HEAP32[756] = 3016;
          HEAP32[759] = 3024;
          HEAP32[758] = 3024;
          HEAP32[761] = 3032;
          HEAP32[760] = 3032;
          HEAP32[763] = 3040;
          HEAP32[762] = 3040;
          HEAP32[765] = 3048;
          HEAP32[764] = 3048;
          HEAP32[767] = 3056;
          HEAP32[766] = 3056;
          HEAP32[769] = 3064;
          HEAP32[768] = 3064;
          HEAP32[771] = 3072;
          HEAP32[770] = 3072;
          HEAP32[773] = 3080;
          HEAP32[772] = 3080;
          HEAP32[775] = 3088;
          HEAP32[774] = 3088;
          HEAP32[777] = 3096;
          HEAP32[776] = 3096;
          HEAP32[779] = 3104;
          HEAP32[778] = 3104;
          HEAP32[781] = 3112;
          HEAP32[780] = 3112;
          HEAP32[783] = 3120;
          HEAP32[782] = 3120;
          HEAP32[785] = 3128;
          HEAP32[784] = 3128;
          HEAP32[787] = 3136;
          HEAP32[786] = 3136;
          HEAP32[789] = 3144;
          HEAP32[788] = 3144;
          HEAP32[791] = 3152;
          HEAP32[790] = 3152;
          HEAP32[793] = 3160;
          HEAP32[792] = 3160;
          HEAP32[795] = 3168;
          HEAP32[794] = 3168;
          $641 = ($$723947$i + -40) | 0;
          $643 = ($$748$i + 8) | 0;
          $648 = (($643 & 7) | 0) == 0 ? 0 : (0 - $643) & 7;
          $649 = ($$748$i + $648) | 0;
          $650 = ($641 - $648) | 0;
          HEAP32[726] = $649;
          HEAP32[723] = $650;
          HEAP32[($649 + 4) >> 2] = $650 | 1;
          HEAP32[($$748$i + $641 + 4) >> 2] = 40;
          HEAP32[727] = HEAP32[842];
        } else {
          $$024372$i = 3328;
          while (1) {
            $656 = HEAP32[$$024372$i >> 2] | 0;
            $658 = HEAP32[($$024372$i + 4) >> 2] | 0;
            if (($$748$i | 0) == (($656 + $658) | 0)) {
              label = 199;
              break;
            }
            $662 = HEAP32[($$024372$i + 8) >> 2] | 0;
            if (!$662) break;
            else $$024372$i = $662;
          }
          if ((label | 0) == 199) {
            $664 = ($$024372$i + 4) | 0;
            if (!(HEAP32[($$024372$i + 12) >> 2] & 8))
              if (($$748$i >>> 0 > $635 >>> 0) & ($656 >>> 0 <= $635 >>> 0)) {
                HEAP32[$664 >> 2] = $658 + $$723947$i;
                $673 = ((HEAP32[723] | 0) + $$723947$i) | 0;
                $675 = ($635 + 8) | 0;
                $680 = (($675 & 7) | 0) == 0 ? 0 : (0 - $675) & 7;
                $681 = ($635 + $680) | 0;
                $682 = ($673 - $680) | 0;
                HEAP32[726] = $681;
                HEAP32[723] = $682;
                HEAP32[($681 + 4) >> 2] = $682 | 1;
                HEAP32[($635 + $673 + 4) >> 2] = 40;
                HEAP32[727] = HEAP32[842];
                break;
              }
          }
          $688 = HEAP32[724] | 0;
          if ($$748$i >>> 0 < $688 >>> 0) {
            HEAP32[724] = $$748$i;
            $752 = $$748$i;
          } else $752 = $688;
          $690 = ($$748$i + $$723947$i) | 0;
          $$124471$i = 3328;
          while (1) {
            if ((HEAP32[$$124471$i >> 2] | 0) == ($690 | 0)) {
              label = 207;
              break;
            }
            $694 = HEAP32[($$124471$i + 8) >> 2] | 0;
            if (!$694) break;
            else $$124471$i = $694;
          }
          if ((label | 0) == 207)
            if (!(HEAP32[($$124471$i + 12) >> 2] & 8)) {
              HEAP32[$$124471$i >> 2] = $$748$i;
              $700 = ($$124471$i + 4) | 0;
              HEAP32[$700 >> 2] = (HEAP32[$700 >> 2] | 0) + $$723947$i;
              $704 = ($$748$i + 8) | 0;
              $710 =
                ($$748$i + ((($704 & 7) | 0) == 0 ? 0 : (0 - $704) & 7)) | 0;
              $712 = ($690 + 8) | 0;
              $718 = ($690 + ((($712 & 7) | 0) == 0 ? 0 : (0 - $712) & 7)) | 0;
              $722 = ($710 + $$0197) | 0;
              $723 = ($718 - $710 - $$0197) | 0;
              HEAP32[($710 + 4) >> 2] = $$0197 | 3;
              L317: do {
                if (($635 | 0) == ($718 | 0)) {
                  $728 = ((HEAP32[723] | 0) + $723) | 0;
                  HEAP32[723] = $728;
                  HEAP32[726] = $722;
                  HEAP32[($722 + 4) >> 2] = $728 | 1;
                } else {
                  if ((HEAP32[725] | 0) == ($718 | 0)) {
                    $734 = ((HEAP32[722] | 0) + $723) | 0;
                    HEAP32[722] = $734;
                    HEAP32[725] = $722;
                    HEAP32[($722 + 4) >> 2] = $734 | 1;
                    HEAP32[($722 + $734) >> 2] = $734;
                    break;
                  }
                  $739 = HEAP32[($718 + 4) >> 2] | 0;
                  if ((($739 & 3) | 0) == 1) {
                    $742 = $739 & -8;
                    $743 = $739 >>> 3;
                    L325: do {
                      if ($739 >>> 0 < 256) {
                        $746 = HEAP32[($718 + 8) >> 2] | 0;
                        $748 = HEAP32[($718 + 12) >> 2] | 0;
                        $750 = (2920 + (($743 << 1) << 2)) | 0;
                        do {
                          if (($746 | 0) != ($750 | 0)) {
                            if ($752 >>> 0 > $746 >>> 0) _abort();
                            if ((HEAP32[($746 + 12) >> 2] | 0) == ($718 | 0))
                              break;
                            _abort();
                          }
                        } while (0);
                        if (($748 | 0) == ($746 | 0)) {
                          HEAP32[720] = HEAP32[720] & ~(1 << $743);
                          break;
                        }
                        do {
                          if (($748 | 0) == ($750 | 0))
                            $$pre$phi17$i$iZ2D = ($748 + 8) | 0;
                          else {
                            if ($752 >>> 0 > $748 >>> 0) _abort();
                            $764 = ($748 + 8) | 0;
                            if ((HEAP32[$764 >> 2] | 0) == ($718 | 0)) {
                              $$pre$phi17$i$iZ2D = $764;
                              break;
                            }
                            _abort();
                          }
                        } while (0);
                        HEAP32[($746 + 12) >> 2] = $748;
                        HEAP32[$$pre$phi17$i$iZ2D >> 2] = $746;
                      } else {
                        $769 = HEAP32[($718 + 24) >> 2] | 0;
                        $771 = HEAP32[($718 + 12) >> 2] | 0;
                        do {
                          if (($771 | 0) == ($718 | 0)) {
                            $782 = ($718 + 16) | 0;
                            $783 = ($782 + 4) | 0;
                            $784 = HEAP32[$783 >> 2] | 0;
                            if (!$784) {
                              $786 = HEAP32[$782 >> 2] | 0;
                              if (!$786) {
                                $$3$i$i = 0;
                                break;
                              } else {
                                $$1290$i$i$ph = $786;
                                $$1292$i$i$ph = $782;
                              }
                            } else {
                              $$1290$i$i$ph = $784;
                              $$1292$i$i$ph = $783;
                            }
                            $$1290$i$i = $$1290$i$i$ph;
                            $$1292$i$i = $$1292$i$i$ph;
                            while (1) {
                              $788 = ($$1290$i$i + 20) | 0;
                              $789 = HEAP32[$788 >> 2] | 0;
                              if (!$789) {
                                $791 = ($$1290$i$i + 16) | 0;
                                $792 = HEAP32[$791 >> 2] | 0;
                                if (!$792) break;
                                else {
                                  $$1290$i$i$be = $792;
                                  $$1292$i$i$be = $791;
                                }
                              } else {
                                $$1290$i$i$be = $789;
                                $$1292$i$i$be = $788;
                              }
                              $$1290$i$i = $$1290$i$i$be;
                              $$1292$i$i = $$1292$i$i$be;
                            }
                            if ($752 >>> 0 > $$1292$i$i >>> 0) _abort();
                            else {
                              HEAP32[$$1292$i$i >> 2] = 0;
                              $$3$i$i = $$1290$i$i;
                              break;
                            }
                          } else {
                            $774 = HEAP32[($718 + 8) >> 2] | 0;
                            if ($752 >>> 0 > $774 >>> 0) _abort();
                            $776 = ($774 + 12) | 0;
                            if ((HEAP32[$776 >> 2] | 0) != ($718 | 0)) _abort();
                            $779 = ($771 + 8) | 0;
                            if ((HEAP32[$779 >> 2] | 0) == ($718 | 0)) {
                              HEAP32[$776 >> 2] = $771;
                              HEAP32[$779 >> 2] = $774;
                              $$3$i$i = $771;
                              break;
                            } else _abort();
                          }
                        } while (0);
                        if (!$769) break;
                        $797 = HEAP32[($718 + 28) >> 2] | 0;
                        $798 = (3184 + ($797 << 2)) | 0;
                        do {
                          if ((HEAP32[$798 >> 2] | 0) == ($718 | 0)) {
                            HEAP32[$798 >> 2] = $$3$i$i;
                            if ($$3$i$i | 0) break;
                            HEAP32[721] = HEAP32[721] & ~(1 << $797);
                            break L325;
                          } else if ((HEAP32[724] | 0) >>> 0 > $769 >>> 0)
                            _abort();
                          else {
                            $807 = ($769 + 16) | 0;
                            HEAP32[
                              ((HEAP32[$807 >> 2] | 0) == ($718 | 0)
                                ? $807
                                : ($769 + 20) | 0) >> 2
                            ] = $$3$i$i;
                            if (!$$3$i$i) break L325;
                            else break;
                          }
                        } while (0);
                        $812 = HEAP32[724] | 0;
                        if ($812 >>> 0 > $$3$i$i >>> 0) _abort();
                        HEAP32[($$3$i$i + 24) >> 2] = $769;
                        $815 = ($718 + 16) | 0;
                        $816 = HEAP32[$815 >> 2] | 0;
                        do {
                          if ($816 | 0)
                            if ($812 >>> 0 > $816 >>> 0) _abort();
                            else {
                              HEAP32[($$3$i$i + 16) >> 2] = $816;
                              HEAP32[($816 + 24) >> 2] = $$3$i$i;
                              break;
                            }
                        } while (0);
                        $822 = HEAP32[($815 + 4) >> 2] | 0;
                        if (!$822) break;
                        if ((HEAP32[724] | 0) >>> 0 > $822 >>> 0) _abort();
                        else {
                          HEAP32[($$3$i$i + 20) >> 2] = $822;
                          HEAP32[($822 + 24) >> 2] = $$3$i$i;
                          break;
                        }
                      }
                    } while (0);
                    $$0$i16$i = ($718 + $742) | 0;
                    $$0286$i$i = ($742 + $723) | 0;
                  } else {
                    $$0$i16$i = $718;
                    $$0286$i$i = $723;
                  }
                  $830 = ($$0$i16$i + 4) | 0;
                  HEAP32[$830 >> 2] = HEAP32[$830 >> 2] & -2;
                  HEAP32[($722 + 4) >> 2] = $$0286$i$i | 1;
                  HEAP32[($722 + $$0286$i$i) >> 2] = $$0286$i$i;
                  $836 = $$0286$i$i >>> 3;
                  if ($$0286$i$i >>> 0 < 256) {
                    $839 = (2920 + (($836 << 1) << 2)) | 0;
                    $840 = HEAP32[720] | 0;
                    $841 = 1 << $836;
                    do {
                      if (!($840 & $841)) {
                        HEAP32[720] = $840 | $841;
                        $$0294$i$i = $839;
                        $$pre$phi$i18$iZ2D = ($839 + 8) | 0;
                      } else {
                        $845 = ($839 + 8) | 0;
                        $846 = HEAP32[$845 >> 2] | 0;
                        if ((HEAP32[724] | 0) >>> 0 <= $846 >>> 0) {
                          $$0294$i$i = $846;
                          $$pre$phi$i18$iZ2D = $845;
                          break;
                        }
                        _abort();
                      }
                    } while (0);
                    HEAP32[$$pre$phi$i18$iZ2D >> 2] = $722;
                    HEAP32[($$0294$i$i + 12) >> 2] = $722;
                    HEAP32[($722 + 8) >> 2] = $$0294$i$i;
                    HEAP32[($722 + 12) >> 2] = $839;
                    break;
                  }
                  $852 = $$0286$i$i >>> 8;
                  do {
                    if (!$852) $$0295$i$i = 0;
                    else {
                      if ($$0286$i$i >>> 0 > 16777215) {
                        $$0295$i$i = 31;
                        break;
                      }
                      $857 = ((($852 + 1048320) | 0) >>> 16) & 8;
                      $858 = $852 << $857;
                      $861 = ((($858 + 520192) | 0) >>> 16) & 4;
                      $863 = $858 << $861;
                      $866 = ((($863 + 245760) | 0) >>> 16) & 2;
                      $871 =
                        (14 - ($861 | $857 | $866) + (($863 << $866) >>> 15)) |
                        0;
                      $$0295$i$i =
                        (($$0286$i$i >>> (($871 + 7) | 0)) & 1) | ($871 << 1);
                    }
                  } while (0);
                  $877 = (3184 + ($$0295$i$i << 2)) | 0;
                  HEAP32[($722 + 28) >> 2] = $$0295$i$i;
                  $879 = ($722 + 16) | 0;
                  HEAP32[($879 + 4) >> 2] = 0;
                  HEAP32[$879 >> 2] = 0;
                  $881 = HEAP32[721] | 0;
                  $882 = 1 << $$0295$i$i;
                  if (!($881 & $882)) {
                    HEAP32[721] = $881 | $882;
                    HEAP32[$877 >> 2] = $722;
                    HEAP32[($722 + 24) >> 2] = $877;
                    HEAP32[($722 + 12) >> 2] = $722;
                    HEAP32[($722 + 8) >> 2] = $722;
                    break;
                  }
                  $889 = HEAP32[$877 >> 2] | 0;
                  L410: do {
                    if (
                      ((HEAP32[($889 + 4) >> 2] & -8) | 0) ==
                      ($$0286$i$i | 0)
                    )
                      $$0288$lcssa$i$i = $889;
                    else {
                      $$028711$i$i =
                        $$0286$i$i <<
                        (($$0295$i$i | 0) == 31
                          ? 0
                          : (25 - ($$0295$i$i >>> 1)) | 0);
                      $$028810$i$i = $889;
                      while (1) {
                        $906 =
                          ($$028810$i$i + 16 + (($$028711$i$i >>> 31) << 2)) |
                          0;
                        $901 = HEAP32[$906 >> 2] | 0;
                        if (!$901) break;
                        if (
                          ((HEAP32[($901 + 4) >> 2] & -8) | 0) ==
                          ($$0286$i$i | 0)
                        ) {
                          $$0288$lcssa$i$i = $901;
                          break L410;
                        } else {
                          $$028711$i$i = $$028711$i$i << 1;
                          $$028810$i$i = $901;
                        }
                      }
                      if ((HEAP32[724] | 0) >>> 0 > $906 >>> 0) _abort();
                      else {
                        HEAP32[$906 >> 2] = $722;
                        HEAP32[($722 + 24) >> 2] = $$028810$i$i;
                        HEAP32[($722 + 12) >> 2] = $722;
                        HEAP32[($722 + 8) >> 2] = $722;
                        break L317;
                      }
                    }
                  } while (0);
                  $913 = ($$0288$lcssa$i$i + 8) | 0;
                  $914 = HEAP32[$913 >> 2] | 0;
                  $915 = HEAP32[724] | 0;
                  if (
                    ($915 >>> 0 <= $914 >>> 0) &
                    ($915 >>> 0 <= $$0288$lcssa$i$i >>> 0)
                  ) {
                    HEAP32[($914 + 12) >> 2] = $722;
                    HEAP32[$913 >> 2] = $722;
                    HEAP32[($722 + 8) >> 2] = $914;
                    HEAP32[($722 + 12) >> 2] = $$0288$lcssa$i$i;
                    HEAP32[($722 + 24) >> 2] = 0;
                    break;
                  } else _abort();
                }
              } while (0);
              $$0 = ($710 + 8) | 0;
              STACKTOP = sp;
              return $$0 | 0;
            }
          $$0$i$i$i = 3328;
          while (1) {
            $923 = HEAP32[$$0$i$i$i >> 2] | 0;
            if ($923 >>> 0 <= $635 >>> 0) {
              $927 = ($923 + (HEAP32[($$0$i$i$i + 4) >> 2] | 0)) | 0;
              if ($927 >>> 0 > $635 >>> 0) break;
            }
            $$0$i$i$i = HEAP32[($$0$i$i$i + 8) >> 2] | 0;
          }
          $931 = ($927 + -47) | 0;
          $933 = ($931 + 8) | 0;
          $939 = ($931 + ((($933 & 7) | 0) == 0 ? 0 : (0 - $933) & 7)) | 0;
          $940 = ($635 + 16) | 0;
          $942 = $939 >>> 0 < $940 >>> 0 ? $635 : $939;
          $943 = ($942 + 8) | 0;
          $945 = ($$723947$i + -40) | 0;
          $947 = ($$748$i + 8) | 0;
          $952 = (($947 & 7) | 0) == 0 ? 0 : (0 - $947) & 7;
          $953 = ($$748$i + $952) | 0;
          $954 = ($945 - $952) | 0;
          HEAP32[726] = $953;
          HEAP32[723] = $954;
          HEAP32[($953 + 4) >> 2] = $954 | 1;
          HEAP32[($$748$i + $945 + 4) >> 2] = 40;
          HEAP32[727] = HEAP32[842];
          $960 = ($942 + 4) | 0;
          HEAP32[$960 >> 2] = 27;
          HEAP32[$943 >> 2] = HEAP32[832];
          HEAP32[($943 + 4) >> 2] = HEAP32[833];
          HEAP32[($943 + 8) >> 2] = HEAP32[834];
          HEAP32[($943 + 12) >> 2] = HEAP32[835];
          HEAP32[832] = $$748$i;
          HEAP32[833] = $$723947$i;
          HEAP32[835] = 0;
          HEAP32[834] = $943;
          $962 = ($942 + 24) | 0;
          do {
            $962$looptemp = $962;
            $962 = ($962 + 4) | 0;
            HEAP32[$962 >> 2] = 7;
          } while ((($962$looptemp + 8) | 0) >>> 0 < $927 >>> 0);
          if (($942 | 0) != ($635 | 0)) {
            $968 = ($942 - $635) | 0;
            HEAP32[$960 >> 2] = HEAP32[$960 >> 2] & -2;
            HEAP32[($635 + 4) >> 2] = $968 | 1;
            HEAP32[$942 >> 2] = $968;
            $973 = $968 >>> 3;
            if ($968 >>> 0 < 256) {
              $976 = (2920 + (($973 << 1) << 2)) | 0;
              $977 = HEAP32[720] | 0;
              $978 = 1 << $973;
              if (!($977 & $978)) {
                HEAP32[720] = $977 | $978;
                $$0211$i$i = $976;
                $$pre$phi$i$iZ2D = ($976 + 8) | 0;
              } else {
                $982 = ($976 + 8) | 0;
                $983 = HEAP32[$982 >> 2] | 0;
                if ((HEAP32[724] | 0) >>> 0 > $983 >>> 0) _abort();
                else {
                  $$0211$i$i = $983;
                  $$pre$phi$i$iZ2D = $982;
                }
              }
              HEAP32[$$pre$phi$i$iZ2D >> 2] = $635;
              HEAP32[($$0211$i$i + 12) >> 2] = $635;
              HEAP32[($635 + 8) >> 2] = $$0211$i$i;
              HEAP32[($635 + 12) >> 2] = $976;
              break;
            }
            $989 = $968 >>> 8;
            if (!$989) $$0212$i$i = 0;
            else if ($968 >>> 0 > 16777215) $$0212$i$i = 31;
            else {
              $994 = ((($989 + 1048320) | 0) >>> 16) & 8;
              $995 = $989 << $994;
              $998 = ((($995 + 520192) | 0) >>> 16) & 4;
              $1000 = $995 << $998;
              $1003 = ((($1000 + 245760) | 0) >>> 16) & 2;
              $1008 =
                (14 - ($998 | $994 | $1003) + (($1000 << $1003) >>> 15)) | 0;
              $$0212$i$i = (($968 >>> (($1008 + 7) | 0)) & 1) | ($1008 << 1);
            }
            $1014 = (3184 + ($$0212$i$i << 2)) | 0;
            HEAP32[($635 + 28) >> 2] = $$0212$i$i;
            HEAP32[($635 + 20) >> 2] = 0;
            HEAP32[$940 >> 2] = 0;
            $1017 = HEAP32[721] | 0;
            $1018 = 1 << $$0212$i$i;
            if (!($1017 & $1018)) {
              HEAP32[721] = $1017 | $1018;
              HEAP32[$1014 >> 2] = $635;
              HEAP32[($635 + 24) >> 2] = $1014;
              HEAP32[($635 + 12) >> 2] = $635;
              HEAP32[($635 + 8) >> 2] = $635;
              break;
            }
            $1025 = HEAP32[$1014 >> 2] | 0;
            L451: do {
              if (((HEAP32[($1025 + 4) >> 2] & -8) | 0) == ($968 | 0))
                $$0207$lcssa$i$i = $1025;
              else {
                $$02065$i$i =
                  $968 <<
                  (($$0212$i$i | 0) == 31 ? 0 : (25 - ($$0212$i$i >>> 1)) | 0);
                $$02074$i$i = $1025;
                while (1) {
                  $1042 = ($$02074$i$i + 16 + (($$02065$i$i >>> 31) << 2)) | 0;
                  $1037 = HEAP32[$1042 >> 2] | 0;
                  if (!$1037) break;
                  if (((HEAP32[($1037 + 4) >> 2] & -8) | 0) == ($968 | 0)) {
                    $$0207$lcssa$i$i = $1037;
                    break L451;
                  } else {
                    $$02065$i$i = $$02065$i$i << 1;
                    $$02074$i$i = $1037;
                  }
                }
                if ((HEAP32[724] | 0) >>> 0 > $1042 >>> 0) _abort();
                else {
                  HEAP32[$1042 >> 2] = $635;
                  HEAP32[($635 + 24) >> 2] = $$02074$i$i;
                  HEAP32[($635 + 12) >> 2] = $635;
                  HEAP32[($635 + 8) >> 2] = $635;
                  break L294;
                }
              }
            } while (0);
            $1049 = ($$0207$lcssa$i$i + 8) | 0;
            $1050 = HEAP32[$1049 >> 2] | 0;
            $1051 = HEAP32[724] | 0;
            if (
              ($1051 >>> 0 <= $1050 >>> 0) &
              ($1051 >>> 0 <= $$0207$lcssa$i$i >>> 0)
            ) {
              HEAP32[($1050 + 12) >> 2] = $635;
              HEAP32[$1049 >> 2] = $635;
              HEAP32[($635 + 8) >> 2] = $1050;
              HEAP32[($635 + 12) >> 2] = $$0207$lcssa$i$i;
              HEAP32[($635 + 24) >> 2] = 0;
              break;
            } else _abort();
          }
        }
      } while (0);
      $1060 = HEAP32[723] | 0;
      if ($1060 >>> 0 > $$0197 >>> 0) {
        $1062 = ($1060 - $$0197) | 0;
        HEAP32[723] = $1062;
        $1063 = HEAP32[726] | 0;
        $1064 = ($1063 + $$0197) | 0;
        HEAP32[726] = $1064;
        HEAP32[($1064 + 4) >> 2] = $1062 | 1;
        HEAP32[($1063 + 4) >> 2] = $$0197 | 3;
        $$0 = ($1063 + 8) | 0;
        STACKTOP = sp;
        return $$0 | 0;
      }
    }
    $1070 = ___errno_location() | 0;
    HEAP32[$1070 >> 2] = 12;
    $$0 = 0;
    STACKTOP = sp;
    return $$0 | 0;
  }
  function _decode_residue($0, $1, $2, $3, $4, $5) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    var $$0450$lcssa = 0,
      $$0450597 = 0,
      $$0453593 = 0,
      $$0455578 = 0,
      $$0460576 = 0,
      $$0481620 = 0,
      $$0482619 = 0,
      $$0626 = 0,
      $$1451604 = 0,
      $$1454624 = 0,
      $$1456$lcssa = 0,
      $$1456570 = 0,
      $$1467 = 0,
      $$1479 = 0,
      $$1483$lcssa = 0,
      $$1483613 = 0,
      $$1485 = 0,
      $$1488 = 0,
      $$1571 = 0,
      $$2452608 = 0,
      $$2462564 = 0,
      $$2468 = 0,
      $$2480 = 0,
      $$2486 = 0,
      $$2489 = 0,
      $$2563 = 0,
      $$3458566 = 0,
      $$3583 = 0,
      $$4459$lcssa = 0,
      $$4459562 = 0,
      $$4464588 = 0,
      $$4615 = 0,
      $$6590 = 0,
      $$7$lcssa = 0,
      $$7582 = 0,
      $11 = 0,
      $113 = 0,
      $12 = 0,
      $122 = 0,
      $13 = 0,
      $132 = 0,
      $136 = 0,
      $141 = 0,
      $145 = 0,
      $146 = 0,
      $148 = 0,
      $152 = 0,
      $155 = 0,
      $156 = 0,
      $16 = 0,
      $162 = 0,
      $165 = 0,
      $166 = 0,
      $182 = 0,
      $19 = 0,
      $191 = 0,
      $20 = 0,
      $201 = 0,
      $203 = 0,
      $208 = 0,
      $212 = 0,
      $213 = 0,
      $215 = 0,
      $216 = 0,
      $218 = 0,
      $22 = 0,
      $222 = 0,
      $225 = 0,
      $226 = 0,
      $23 = 0,
      $232 = 0,
      $235 = 0,
      $236 = 0,
      $24 = 0,
      $252 = 0,
      $261 = 0,
      $27 = 0,
      $271 = 0,
      $272 = 0,
      $274 = 0,
      $276 = 0,
      $283 = 0,
      $284 = 0,
      $285 = 0,
      $286 = 0,
      $287 = 0,
      $288 = 0,
      $289 = 0,
      $294 = 0,
      $296 = 0,
      $300 = 0,
      $303 = 0,
      $304 = 0,
      $31 = 0,
      $310 = 0,
      $313 = 0,
      $314 = 0,
      $33 = 0,
      $34 = 0,
      $345 = 0,
      $35 = 0,
      $351 = 0,
      $353 = 0,
      $361 = 0,
      $39 = 0,
      $40 = 0,
      $41 = 0,
      $43 = 0,
      $44 = 0,
      $45 = 0,
      $46 = 0,
      $47 = 0,
      $49 = 0,
      $50 = 0,
      $6 = 0,
      $61 = 0,
      $64 = 0,
      $65 = 0,
      $66 = 0,
      $67 = 0,
      $68 = 0,
      $69 = 0,
      $7 = 0,
      $70 = 0,
      $74 = 0,
      $77 = 0,
      $79 = 0,
      $83 = 0,
      $86 = 0,
      $87 = 0,
      $9 = 0,
      $93 = 0,
      $96 = 0,
      $97 = 0,
      $brmerge = 0,
      label = 0,
      sp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 16) | 0;
    $6 = (sp + 4) | 0;
    $7 = sp;
    $9 = HEAP32[($0 + 384) >> 2] | 0;
    $11 = HEAP16[($0 + 256 + ($4 << 1)) >> 1] | 0;
    $12 = $11 & 65535;
    $13 = ($9 + (($4 * 24) | 0) + 13) | 0;
    $16 = ($0 + 112) | 0;
    $19 =
      HEAP32[
        ((HEAP32[$16 >> 2] | 0) + (((HEAPU8[$13 >> 0] | 0) * 2096) | 0)) >> 2
      ] | 0;
    $20 = ($11 << 16) >> 16 == 2;
    $22 = $3 << ($20 & 1);
    $23 = ($9 + (($4 * 24) | 0)) | 0;
    $24 = HEAP32[$23 >> 2] | 0;
    $27 = HEAP32[($9 + (($4 * 24) | 0) + 4) >> 2] | 0;
    $31 = ($9 + (($4 * 24) | 0) + 8) | 0;
    $33 =
      ((((($27 >>> 0 < $22 >>> 0 ? $27 : $22) -
        ($24 >>> 0 < $22 >>> 0 ? $24 : $22)) |
        0) >>>
        0) /
        ((HEAP32[$31 >> 2] | 0) >>> 0)) |
      0;
    $34 = ($0 + 80) | 0;
    $35 = HEAP32[$34 >> 2] | 0;
    $39 = ($0 + 4) | 0;
    $40 = HEAP32[$39 >> 2] | 0;
    $41 = $33 << 2;
    $43 = Math_imul($40, ($41 + 4) | 0) | 0;
    if (!(HEAP32[($0 + 68) >> 2] | 0)) {
      $45 = STACKTOP;
      STACKTOP = (STACKTOP + ((((1 * $43) | 0) + 15) & -16)) | 0;
      $46 = $45;
      $47 = $40;
    } else {
      $44 = _setup_temp_malloc($0, $43) | 0;
      $46 = $44;
      $47 = HEAP32[$39 >> 2] | 0;
    }
    _make_block_array($46, $47, $41) | 0;
    $49 = ($2 | 0) > 0;
    if ($49) {
      $50 = $3 << 2;
      $$0626 = 0;
      do {
        if (!(HEAP8[($5 + $$0626) >> 0] | 0))
          _memset(HEAP32[($1 + ($$0626 << 2)) >> 2] | 0, 0, $50 | 0) | 0;
        $$0626 = ($$0626 + 1) | 0;
      } while (($$0626 | 0) != ($2 | 0));
    }
    L13: do {
      if ((($2 | 0) != 1) & $20) {
        L15: do {
          if ($49) {
            $$0450597 = 0;
            while (1) {
              if (!(HEAP8[($5 + $$0450597) >> 0] | 0)) {
                $$0450$lcssa = $$0450597;
                break L15;
              }
              $61 = ($$0450597 + 1) | 0;
              if (($61 | 0) < ($2 | 0)) $$0450597 = $61;
              else {
                $$0450$lcssa = $61;
                break;
              }
            }
          } else $$0450$lcssa = 0;
        } while (0);
        if (($$0450$lcssa | 0) != ($2 | 0)) {
          $64 = ($33 | 0) > 0;
          $65 = ($0 + 1384) | 0;
          $66 = ($19 | 0) > 0;
          $67 = ($0 + 1380) | 0;
          $68 = ($9 + (($4 * 24) | 0) + 20) | 0;
          $69 = ($9 + (($4 * 24) | 0) + 16) | 0;
          $$0453593 = 0;
          L22: while (1) {
            switch ($2 | 0) {
              case 2: {
                if ($64) {
                  $70 = ($$0453593 | 0) == 0;
                  $$0455578 = 0;
                  $$0460576 = 0;
                  while (1) {
                    $74 =
                      ((Math_imul(HEAP32[$31 >> 2] | 0, $$0455578) | 0) +
                        (HEAP32[$23 >> 2] | 0)) |
                      0;
                    HEAP32[$6 >> 2] = $74 & 1;
                    HEAP32[$7 >> 2] = $74 >> 1;
                    if ($70) {
                      $77 = HEAP32[$16 >> 2] | 0;
                      $79 = HEAPU8[$13 >> 0] | 0;
                      if ((HEAP32[$65 >> 2] | 0) < 10) _prep_huffman($0);
                      $83 = HEAP32[$67 >> 2] | 0;
                      $86 =
                        HEAP16[
                          ($77 +
                            (($79 * 2096) | 0) +
                            36 +
                            (($83 & 1023) << 1)) >>
                            1
                        ] | 0;
                      $87 = ($86 << 16) >> 16;
                      if (($86 << 16) >> 16 > -1) {
                        $93 =
                          HEAPU8[
                            ((HEAP32[($77 + (($79 * 2096) | 0) + 8) >> 2] | 0) +
                              $87) >>
                              0
                          ] | 0;
                        HEAP32[$67 >> 2] = $83 >>> $93;
                        $96 = ((HEAP32[$65 >> 2] | 0) - $93) | 0;
                        $97 = ($96 | 0) < 0;
                        HEAP32[$65 >> 2] = $97 ? 0 : $96;
                        $$1467 = $97 ? -1 : $87;
                      } else
                        $$1467 =
                          _codebook_decode_scalar_raw(
                            $0,
                            ($77 + (($79 * 2096) | 0)) | 0
                          ) | 0;
                      if (!(HEAP8[($77 + (($79 * 2096) | 0) + 23) >> 0] | 0))
                        $$2468 = $$1467;
                      else
                        $$2468 =
                          HEAP32[
                            ((HEAP32[($77 + (($79 * 2096) | 0) + 2088) >> 2] |
                              0) +
                              ($$1467 << 2)) >>
                              2
                          ] | 0;
                      if (($$2468 | 0) == -1) {
                        label = 35;
                        break L22;
                      }
                      HEAP32[((HEAP32[$46 >> 2] | 0) + ($$0460576 << 2)) >> 2] =
                        HEAP32[((HEAP32[$69 >> 2] | 0) + ($$2468 << 2)) >> 2];
                    }
                    if ((($$0455578 | 0) < ($33 | 0)) & $66) {
                      $$1456570 = $$0455578;
                      $$1571 = 0;
                      while (1) {
                        $113 = HEAP32[$31 >> 2] | 0;
                        $122 =
                          HEAP16[
                            ((HEAP32[$68 >> 2] | 0) +
                              (HEAPU8[
                                ((HEAP32[
                                  ((HEAP32[$46 >> 2] | 0) + ($$0460576 << 2)) >>
                                    2
                                ] |
                                  0) +
                                  $$1571) >>
                                  0
                              ] <<
                                4) +
                              ($$0453593 << 1)) >>
                              1
                          ] | 0;
                        if (($122 << 16) >> 16 > -1) {
                          if (
                            !(
                              _codebook_decode_deinterleave_repeat(
                                $0,
                                ((HEAP32[$16 >> 2] | 0) +
                                  (((($122 << 16) >> 16) * 2096) | 0)) |
                                  0,
                                $1,
                                2,
                                $6,
                                $7,
                                $3,
                                $113
                              ) | 0
                            )
                          ) {
                            label = 35;
                            break L22;
                          }
                        } else {
                          $132 =
                            ((Math_imul($113, $$1456570) | 0) +
                              $113 +
                              (HEAP32[$23 >> 2] | 0)) |
                            0;
                          HEAP32[$6 >> 2] = $132 & 1;
                          HEAP32[$7 >> 2] = $132 >> 1;
                        }
                        $$1571 = ($$1571 + 1) | 0;
                        $136 = ($$1456570 + 1) | 0;
                        if (
                          !(
                            (($136 | 0) < ($33 | 0)) &
                            (($$1571 | 0) < ($19 | 0))
                          )
                        ) {
                          $$1456$lcssa = $136;
                          break;
                        } else $$1456570 = $136;
                      }
                    } else $$1456$lcssa = $$0455578;
                    if (($$1456$lcssa | 0) < ($33 | 0)) {
                      $$0455578 = $$1456$lcssa;
                      $$0460576 = ($$0460576 + 1) | 0;
                    } else break;
                  }
                }
                break;
              }
              case 1: {
                if ($64) {
                  $141 = ($$0453593 | 0) == 0;
                  $$2462564 = 0;
                  $$3458566 = 0;
                  while (1) {
                    $145 =
                      ((Math_imul(HEAP32[$31 >> 2] | 0, $$3458566) | 0) +
                        (HEAP32[$23 >> 2] | 0)) |
                      0;
                    HEAP32[$6 >> 2] = 0;
                    HEAP32[$7 >> 2] = $145;
                    if ($141) {
                      $146 = HEAP32[$16 >> 2] | 0;
                      $148 = HEAPU8[$13 >> 0] | 0;
                      if ((HEAP32[$65 >> 2] | 0) < 10) _prep_huffman($0);
                      $152 = HEAP32[$67 >> 2] | 0;
                      $155 =
                        HEAP16[
                          ($146 +
                            (($148 * 2096) | 0) +
                            36 +
                            (($152 & 1023) << 1)) >>
                            1
                        ] | 0;
                      $156 = ($155 << 16) >> 16;
                      if (($155 << 16) >> 16 > -1) {
                        $162 =
                          HEAPU8[
                            ((HEAP32[($146 + (($148 * 2096) | 0) + 8) >> 2] |
                              0) +
                              $156) >>
                              0
                          ] | 0;
                        HEAP32[$67 >> 2] = $152 >>> $162;
                        $165 = ((HEAP32[$65 >> 2] | 0) - $162) | 0;
                        $166 = ($165 | 0) < 0;
                        HEAP32[$65 >> 2] = $166 ? 0 : $165;
                        $$1485 = $166 ? -1 : $156;
                      } else
                        $$1485 =
                          _codebook_decode_scalar_raw(
                            $0,
                            ($146 + (($148 * 2096) | 0)) | 0
                          ) | 0;
                      if (!(HEAP8[($146 + (($148 * 2096) | 0) + 23) >> 0] | 0))
                        $$2486 = $$1485;
                      else
                        $$2486 =
                          HEAP32[
                            ((HEAP32[($146 + (($148 * 2096) | 0) + 2088) >> 2] |
                              0) +
                              ($$1485 << 2)) >>
                              2
                          ] | 0;
                      if (($$2486 | 0) == -1) {
                        label = 55;
                        break L22;
                      }
                      HEAP32[((HEAP32[$46 >> 2] | 0) + ($$2462564 << 2)) >> 2] =
                        HEAP32[((HEAP32[$69 >> 2] | 0) + ($$2486 << 2)) >> 2];
                    }
                    if ((($$3458566 | 0) < ($33 | 0)) & $66) {
                      $$2563 = 0;
                      $$4459562 = $$3458566;
                      while (1) {
                        $182 = HEAP32[$31 >> 2] | 0;
                        $191 =
                          HEAP16[
                            ((HEAP32[$68 >> 2] | 0) +
                              (HEAPU8[
                                ((HEAP32[
                                  ((HEAP32[$46 >> 2] | 0) + ($$2462564 << 2)) >>
                                    2
                                ] |
                                  0) +
                                  $$2563) >>
                                  0
                              ] <<
                                4) +
                              ($$0453593 << 1)) >>
                              1
                          ] | 0;
                        if (($191 << 16) >> 16 > -1) {
                          if (
                            !(
                              _codebook_decode_deinterleave_repeat(
                                $0,
                                ((HEAP32[$16 >> 2] | 0) +
                                  (((($191 << 16) >> 16) * 2096) | 0)) |
                                  0,
                                $1,
                                1,
                                $6,
                                $7,
                                $3,
                                $182
                              ) | 0
                            )
                          ) {
                            label = 55;
                            break L22;
                          }
                        } else {
                          $201 =
                            ((Math_imul($182, $$4459562) | 0) +
                              $182 +
                              (HEAP32[$23 >> 2] | 0)) |
                            0;
                          HEAP32[$6 >> 2] = 0;
                          HEAP32[$7 >> 2] = $201;
                        }
                        $$2563 = ($$2563 + 1) | 0;
                        $203 = ($$4459562 + 1) | 0;
                        if (
                          !(
                            (($203 | 0) < ($33 | 0)) &
                            (($$2563 | 0) < ($19 | 0))
                          )
                        ) {
                          $$4459$lcssa = $203;
                          break;
                        } else $$4459562 = $203;
                      }
                    } else $$4459$lcssa = $$3458566;
                    if (($$4459$lcssa | 0) < ($33 | 0)) {
                      $$2462564 = ($$2462564 + 1) | 0;
                      $$3458566 = $$4459$lcssa;
                    } else break;
                  }
                }
                break;
              }
              default:
                if ($64) {
                  $208 = ($$0453593 | 0) == 0;
                  $$4464588 = 0;
                  $$6590 = 0;
                  while (1) {
                    $212 =
                      ((Math_imul(HEAP32[$31 >> 2] | 0, $$6590) | 0) +
                        (HEAP32[$23 >> 2] | 0)) |
                      0;
                    $213 = (($212 | 0) / ($2 | 0)) | 0;
                    $215 = ($212 - (Math_imul($213, $2) | 0)) | 0;
                    HEAP32[$6 >> 2] = $215;
                    HEAP32[$7 >> 2] = $213;
                    if ($208) {
                      $216 = HEAP32[$16 >> 2] | 0;
                      $218 = HEAPU8[$13 >> 0] | 0;
                      if ((HEAP32[$65 >> 2] | 0) < 10) _prep_huffman($0);
                      $222 = HEAP32[$67 >> 2] | 0;
                      $225 =
                        HEAP16[
                          ($216 +
                            (($218 * 2096) | 0) +
                            36 +
                            (($222 & 1023) << 1)) >>
                            1
                        ] | 0;
                      $226 = ($225 << 16) >> 16;
                      if (($225 << 16) >> 16 > -1) {
                        $232 =
                          HEAPU8[
                            ((HEAP32[($216 + (($218 * 2096) | 0) + 8) >> 2] |
                              0) +
                              $226) >>
                              0
                          ] | 0;
                        HEAP32[$67 >> 2] = $222 >>> $232;
                        $235 = ((HEAP32[$65 >> 2] | 0) - $232) | 0;
                        $236 = ($235 | 0) < 0;
                        HEAP32[$65 >> 2] = $236 ? 0 : $235;
                        $$1488 = $236 ? -1 : $226;
                      } else
                        $$1488 =
                          _codebook_decode_scalar_raw(
                            $0,
                            ($216 + (($218 * 2096) | 0)) | 0
                          ) | 0;
                      if (!(HEAP8[($216 + (($218 * 2096) | 0) + 23) >> 0] | 0))
                        $$2489 = $$1488;
                      else
                        $$2489 =
                          HEAP32[
                            ((HEAP32[($216 + (($218 * 2096) | 0) + 2088) >> 2] |
                              0) +
                              ($$1488 << 2)) >>
                              2
                          ] | 0;
                      if (($$2489 | 0) == -1) {
                        label = 75;
                        break L22;
                      }
                      HEAP32[((HEAP32[$46 >> 2] | 0) + ($$4464588 << 2)) >> 2] =
                        HEAP32[((HEAP32[$69 >> 2] | 0) + ($$2489 << 2)) >> 2];
                    }
                    if ((($$6590 | 0) < ($33 | 0)) & $66) {
                      $$3583 = 0;
                      $$7582 = $$6590;
                      while (1) {
                        $252 = HEAP32[$31 >> 2] | 0;
                        $261 =
                          HEAP16[
                            ((HEAP32[$68 >> 2] | 0) +
                              (HEAPU8[
                                ((HEAP32[
                                  ((HEAP32[$46 >> 2] | 0) + ($$4464588 << 2)) >>
                                    2
                                ] |
                                  0) +
                                  $$3583) >>
                                  0
                              ] <<
                                4) +
                              ($$0453593 << 1)) >>
                              1
                          ] | 0;
                        if (($261 << 16) >> 16 > -1) {
                          if (
                            !(
                              _codebook_decode_deinterleave_repeat(
                                $0,
                                ((HEAP32[$16 >> 2] | 0) +
                                  (((($261 << 16) >> 16) * 2096) | 0)) |
                                  0,
                                $1,
                                $2,
                                $6,
                                $7,
                                $3,
                                $252
                              ) | 0
                            )
                          ) {
                            label = 75;
                            break L22;
                          }
                        } else {
                          $271 =
                            ((Math_imul($252, $$7582) | 0) +
                              $252 +
                              (HEAP32[$23 >> 2] | 0)) |
                            0;
                          $272 = (($271 | 0) / ($2 | 0)) | 0;
                          $274 = ($271 - (Math_imul($272, $2) | 0)) | 0;
                          HEAP32[$6 >> 2] = $274;
                          HEAP32[$7 >> 2] = $272;
                        }
                        $$3583 = ($$3583 + 1) | 0;
                        $276 = ($$7582 + 1) | 0;
                        if (
                          !(
                            (($276 | 0) < ($33 | 0)) &
                            (($$3583 | 0) < ($19 | 0))
                          )
                        ) {
                          $$7$lcssa = $276;
                          break;
                        } else $$7582 = $276;
                      }
                    } else $$7$lcssa = $$6590;
                    if (($$7$lcssa | 0) < ($33 | 0)) {
                      $$4464588 = ($$4464588 + 1) | 0;
                      $$6590 = $$7$lcssa;
                    } else break;
                  }
                }
            }
            $$0453593 = ($$0453593 + 1) | 0;
            if ($$0453593 >>> 0 >= 8) break L13;
          }
          if ((label | 0) == 35) break;
          else if ((label | 0) == 55) break;
          else if ((label | 0) == 75) break;
        }
      } else {
        $283 = ($33 | 0) > 0;
        $284 = ($2 | 0) < 1;
        $285 = ($19 | 0) > 0;
        $286 = ($0 + 1384) | 0;
        $287 = ($0 + 1380) | 0;
        $288 = ($9 + (($4 * 24) | 0) + 16) | 0;
        $289 = ($9 + (($4 * 24) | 0) + 20) | 0;
        $$1454624 = 0;
        do {
          if ($283) {
            $brmerge = (($$1454624 | 0) != 0) | $284;
            $$0481620 = 0;
            $$0482619 = 0;
            while (1) {
              if (!$brmerge) {
                $$1451604 = 0;
                do {
                  if (!(HEAP8[($5 + $$1451604) >> 0] | 0)) {
                    $294 = HEAP32[$16 >> 2] | 0;
                    $296 = HEAPU8[$13 >> 0] | 0;
                    if ((HEAP32[$286 >> 2] | 0) < 10) _prep_huffman($0);
                    $300 = HEAP32[$287 >> 2] | 0;
                    $303 =
                      HEAP16[
                        ($294 +
                          (($296 * 2096) | 0) +
                          36 +
                          (($300 & 1023) << 1)) >>
                          1
                      ] | 0;
                    $304 = ($303 << 16) >> 16;
                    if (($303 << 16) >> 16 > -1) {
                      $310 =
                        HEAPU8[
                          ((HEAP32[($294 + (($296 * 2096) | 0) + 8) >> 2] | 0) +
                            $304) >>
                            0
                        ] | 0;
                      HEAP32[$287 >> 2] = $300 >>> $310;
                      $313 = ((HEAP32[$286 >> 2] | 0) - $310) | 0;
                      $314 = ($313 | 0) < 0;
                      HEAP32[$286 >> 2] = $314 ? 0 : $313;
                      $$1479 = $314 ? -1 : $304;
                    } else
                      $$1479 =
                        _codebook_decode_scalar_raw(
                          $0,
                          ($294 + (($296 * 2096) | 0)) | 0
                        ) | 0;
                    if (!(HEAP8[($294 + (($296 * 2096) | 0) + 23) >> 0] | 0))
                      $$2480 = $$1479;
                    else
                      $$2480 =
                        HEAP32[
                          ((HEAP32[($294 + (($296 * 2096) | 0) + 2088) >> 2] |
                            0) +
                            ($$1479 << 2)) >>
                            2
                        ] | 0;
                    if (($$2480 | 0) == -1) break L13;
                    HEAP32[
                      ((HEAP32[($46 + ($$1451604 << 2)) >> 2] | 0) +
                        ($$0481620 << 2)) >>
                        2
                    ] = HEAP32[((HEAP32[$288 >> 2] | 0) + ($$2480 << 2)) >> 2];
                  }
                  $$1451604 = ($$1451604 + 1) | 0;
                } while (($$1451604 | 0) < ($2 | 0));
              }
              if ((($$0482619 | 0) < ($33 | 0)) & $285) {
                $$1483613 = $$0482619;
                $$4615 = 0;
                while (1) {
                  if ($49) {
                    $$2452608 = 0;
                    do {
                      if (!(HEAP8[($5 + $$2452608) >> 0] | 0)) {
                        $345 =
                          HEAP16[
                            ((HEAP32[$289 >> 2] | 0) +
                              (HEAPU8[
                                ((HEAP32[
                                  ((HEAP32[($46 + ($$2452608 << 2)) >> 2] | 0) +
                                    ($$0481620 << 2)) >>
                                    2
                                ] |
                                  0) +
                                  $$4615) >>
                                  0
                              ] <<
                                4) +
                              ($$1454624 << 1)) >>
                              1
                          ] | 0;
                        if (($345 << 16) >> 16 > -1) {
                          $351 = HEAP32[$31 >> 2] | 0;
                          $353 =
                            ((Math_imul($351, $$1483613) | 0) +
                              (HEAP32[$23 >> 2] | 0)) |
                            0;
                          if (
                            !(
                              _residue_decode(
                                $0,
                                ((HEAP32[$16 >> 2] | 0) +
                                  (((($345 << 16) >> 16) * 2096) | 0)) |
                                  0,
                                HEAP32[($1 + ($$2452608 << 2)) >> 2] | 0,
                                $353,
                                $351,
                                $12
                              ) | 0
                            )
                          )
                            break L13;
                        }
                      }
                      $$2452608 = ($$2452608 + 1) | 0;
                    } while (($$2452608 | 0) < ($2 | 0));
                  }
                  $$4615 = ($$4615 + 1) | 0;
                  $361 = ($$1483613 + 1) | 0;
                  if (
                    !((($361 | 0) < ($33 | 0)) & (($$4615 | 0) < ($19 | 0)))
                  ) {
                    $$1483$lcssa = $361;
                    break;
                  } else $$1483613 = $361;
                }
              } else $$1483$lcssa = $$0482619;
              if (($$1483$lcssa | 0) < ($33 | 0)) {
                $$0481620 = ($$0481620 + 1) | 0;
                $$0482619 = $$1483$lcssa;
              } else break;
            }
          }
          $$1454624 = ($$1454624 + 1) | 0;
        } while ($$1454624 >>> 0 < 8);
      }
    } while (0);
    HEAP32[$34 >> 2] = $35;
    STACKTOP = sp;
    return;
  }
  function _vorbis_decode_packet_rest($0, $1, $2, $3, $4, $5, $6) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    $6 = $6 | 0;
    var $$0401 = 0,
      $$0402 = 0,
      $$0403 = 0,
      $$040465 = 0,
      $$040852 = 0,
      $$0413$lcssa = 0,
      $$041328 = 0,
      $$041546 = 0,
      $$042051 = 0,
      $$140538 = 0,
      $$140956 = 0,
      $$1414 = 0,
      $$1421$lcssa = 0,
      $$142145 = 0,
      $$1424 = 0,
      $$1429 = 0,
      $$240633 = 0,
      $$241061 = 0,
      $$2430 = 0,
      $$3 = 0,
      $$340724$in = 0,
      $$341129 = 0,
      $$3426 = 0,
      $$415 = 0,
      $$441219 = 0,
      $$442744 = 0,
      $$514 = 0,
      $$lcssa10 = 0,
      $$pre$phi8087Z2D = 0,
      $$pre84 = 0,
      $$sink = 0,
      $$sink92 = 0,
      $10 = 0,
      $109 = 0,
      $112 = 0,
      $113 = 0,
      $117 = 0,
      $120 = 0,
      $121 = 0,
      $127 = 0,
      $130 = 0,
      $131 = 0,
      $14 = 0,
      $151 = 0,
      $153 = 0,
      $156 = 0,
      $159 = 0,
      $16 = 0,
      $175 = 0,
      $176 = 0,
      $177 = 0,
      $178 = 0,
      $179 = 0,
      $19 = 0,
      $20 = 0,
      $206 = 0,
      $208 = 0,
      $209 = 0,
      $21 = 0,
      $217 = 0,
      $22 = 0,
      $220 = 0,
      $221 = 0,
      $225 = 0,
      $23 = 0,
      $232 = 0,
      $235 = 0,
      $236 = 0,
      $238 = 0,
      $24 = 0,
      $246 = 0,
      $257 = 0,
      $26 = 0,
      $261 = 0,
      $268 = 0,
      $27 = 0,
      $272 = 0,
      $273 = 0,
      $278 = 0,
      $28 = 0,
      $283 = 0,
      $284 = 0,
      $285 = 0,
      $287 = 0,
      $288 = 0,
      $289 = 0,
      $29 = 0,
      $299 = 0,
      $30 = 0,
      $303 = 0,
      $309 = 0,
      $31 = 0,
      $319 = 0,
      $326 = 0,
      $327 = 0,
      $329 = 0,
      $332 = 0,
      $338 = 0,
      $339 = 0,
      $346 = 0,
      $347 = 0,
      $348 = 0,
      $35 = 0,
      $354 = 0,
      $36 = 0,
      $362 = 0,
      $39 = 0,
      $43 = 0,
      $51 = 0,
      $53 = 0,
      $55 = 0,
      $57 = 0,
      $59 = 0,
      $61 = 0,
      $66 = 0,
      $68 = 0,
      $69 = 0,
      $7 = 0,
      $71 = 0,
      $72 = 0,
      $74 = 0,
      $76 = 0,
      $79 = 0,
      $8 = 0,
      $83 = 0,
      $86 = 0,
      $87 = 0,
      $9 = 0,
      $93 = 0,
      $96 = 0,
      $97 = 0,
      $spec$select8 = 0,
      label = 0,
      sp = 0,
      $$340724$in$looptemp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 2560) | 0;
    $7 = (sp + 1536) | 0;
    $8 = (sp + 512) | 0;
    $9 = (sp + 256) | 0;
    $10 = sp;
    $14 = HEAP32[($0 + 92 + (HEAPU8[$2 >> 0] << 2)) >> 2] | 0;
    $16 = HEAP32[($0 + 392) >> 2] | 0;
    $19 = HEAPU8[($2 + 1) >> 0] | 0;
    $20 = ($16 + (($19 * 40) | 0)) | 0;
    $21 = $14 >> 1;
    $22 = (0 - $21) | 0;
    $23 = ($0 + 4) | 0;
    $24 = HEAP32[$23 >> 2] | 0;
    L1: do {
      if (($24 | 0) > 0) {
        $26 = ($16 + (($19 * 40) | 0) + 4) | 0;
        $27 = ($0 + 248) | 0;
        $28 = ($0 + 112) | 0;
        $29 = ($0 + 1384) | 0;
        $30 = ($0 + 1380) | 0;
        $31 = ($9 + 1) | 0;
        $$040465 = 0;
        while (1) {
          $35 =
            HEAPU8[((HEAP32[$26 >> 2] | 0) + (($$040465 * 3) | 0) + 2) >> 0] |
            0;
          $36 = ($7 + ($$040465 << 2)) | 0;
          HEAP32[$36 >> 2] = 0;
          $39 = HEAPU8[($16 + (($19 * 40) | 0) + 9 + $35) >> 0] | 0;
          if (!(HEAP16[($0 + 120 + ($39 << 1)) >> 1] | 0)) break;
          $43 = HEAP32[$27 >> 2] | 0;
          do {
            if (!(_get_bits($0, 1) | 0)) label = 50;
            else {
              $51 =
                HEAP32[
                  (32 +
                    (((HEAPU8[($43 + (($39 * 1596) | 0) + 1588) >> 0] | 0) +
                      -1) <<
                      2)) >>
                    2
                ] | 0;
              $53 = HEAP32[($0 + 984 + ($$040465 << 2)) >> 2] | 0;
              $55 = ((_ilog($51) | 0) + -1) | 0;
              $57 = (_get_bits($0, $55) | 0) & 65535;
              HEAP16[$53 >> 1] = $57;
              $59 = (_get_bits($0, $55) | 0) & 65535;
              HEAP16[($53 + 2) >> 1] = $59;
              $61 = ($43 + (($39 * 1596) | 0)) | 0;
              if (HEAP8[$61 >> 0] | 0) {
                $$040852 = 0;
                $$042051 = 2;
                while (1) {
                  $66 =
                    HEAPU8[($43 + (($39 * 1596) | 0) + 1 + $$040852) >> 0] | 0;
                  $68 = HEAP8[($43 + (($39 * 1596) | 0) + 33 + $66) >> 0] | 0;
                  $69 = $68 & 255;
                  $71 = HEAP8[($43 + (($39 * 1596) | 0) + 49 + $66) >> 0] | 0;
                  $72 = $71 & 255;
                  $74 = ((1 << $72) + -1) | 0;
                  if (!(($71 << 24) >> 24)) $$3426 = 0;
                  else {
                    $76 = HEAP32[$28 >> 2] | 0;
                    $79 =
                      HEAPU8[($43 + (($39 * 1596) | 0) + 65 + $66) >> 0] | 0;
                    if ((HEAP32[$29 >> 2] | 0) < 10) _prep_huffman($0);
                    $83 = HEAP32[$30 >> 2] | 0;
                    $86 =
                      HEAP16[
                        ($76 + (($79 * 2096) | 0) + 36 + (($83 & 1023) << 1)) >>
                          1
                      ] | 0;
                    $87 = ($86 << 16) >> 16;
                    if (($86 << 16) >> 16 > -1) {
                      $93 =
                        HEAPU8[
                          ((HEAP32[($76 + (($79 * 2096) | 0) + 8) >> 2] | 0) +
                            $87) >>
                            0
                        ] | 0;
                      HEAP32[$30 >> 2] = $83 >>> $93;
                      $96 = ((HEAP32[$29 >> 2] | 0) - $93) | 0;
                      $97 = ($96 | 0) < 0;
                      HEAP32[$29 >> 2] = $97 ? 0 : $96;
                      $$1424 = $97 ? -1 : $87;
                    } else
                      $$1424 =
                        _codebook_decode_scalar_raw(
                          $0,
                          ($76 + (($79 * 2096) | 0)) | 0
                        ) | 0;
                    if (!(HEAP8[($76 + (($79 * 2096) | 0) + 23) >> 0] | 0))
                      $$3426 = $$1424;
                    else
                      $$3426 =
                        HEAP32[
                          ((HEAP32[($76 + (($79 * 2096) | 0) + 2088) >> 2] |
                            0) +
                            ($$1424 << 2)) >>
                            2
                        ] | 0;
                  }
                  if (!(($68 << 24) >> 24)) $$1421$lcssa = $$042051;
                  else {
                    $$041546 = 0;
                    $$142145 = $$042051;
                    $$442744 = $$3426;
                    while (1) {
                      $109 =
                        HEAP16[
                          ($43 +
                            (($39 * 1596) | 0) +
                            82 +
                            ($66 << 4) +
                            (($$442744 & $74) << 1)) >>
                            1
                        ] | 0;
                      $$442744 = $$442744 >> $72;
                      if (($109 << 16) >> 16 > -1) {
                        $112 = ($109 << 16) >> 16;
                        $113 = HEAP32[$28 >> 2] | 0;
                        if ((HEAP32[$29 >> 2] | 0) < 10) _prep_huffman($0);
                        $117 = HEAP32[$30 >> 2] | 0;
                        $120 =
                          HEAP16[
                            ($113 +
                              (($112 * 2096) | 0) +
                              36 +
                              (($117 & 1023) << 1)) >>
                              1
                          ] | 0;
                        $121 = ($120 << 16) >> 16;
                        if (($120 << 16) >> 16 > -1) {
                          $127 =
                            HEAPU8[
                              ((HEAP32[($113 + (($112 * 2096) | 0) + 8) >> 2] |
                                0) +
                                $121) >>
                                0
                            ] | 0;
                          HEAP32[$30 >> 2] = $117 >>> $127;
                          $130 = ((HEAP32[$29 >> 2] | 0) - $127) | 0;
                          $131 = ($130 | 0) < 0;
                          HEAP32[$29 >> 2] = $131 ? 0 : $130;
                          $$1429 = $131 ? -1 : $121;
                        } else
                          $$1429 =
                            _codebook_decode_scalar_raw(
                              $0,
                              ($113 + (($112 * 2096) | 0)) | 0
                            ) | 0;
                        if (
                          !(HEAP8[($113 + (($112 * 2096) | 0) + 23) >> 0] | 0)
                        )
                          $$2430 = $$1429;
                        else
                          $$2430 =
                            HEAP32[
                              ((HEAP32[
                                ($113 + (($112 * 2096) | 0) + 2088) >> 2
                              ] |
                                0) +
                                ($$1429 << 2)) >>
                                2
                            ] | 0;
                        $$sink = $$2430 & 65535;
                      } else $$sink = 0;
                      HEAP16[($53 + ($$142145 << 1)) >> 1] = $$sink;
                      $$041546 = ($$041546 + 1) | 0;
                      if (($$041546 | 0) == ($69 | 0)) break;
                      else $$142145 = ($$142145 + 1) | 0;
                    }
                    $$1421$lcssa = ($$042051 + $69) | 0;
                  }
                  $$040852 = ($$040852 + 1) | 0;
                  if ($$040852 >>> 0 >= (HEAPU8[$61 >> 0] | 0) >>> 0) break;
                  else $$042051 = $$1421$lcssa;
                }
              }
              if ((HEAP32[$29 >> 2] | 0) == -1) {
                label = 50;
                break;
              }
              HEAP8[$31 >> 0] = 1;
              HEAP8[$9 >> 0] = 1;
              $151 = HEAP32[($43 + (($39 * 1596) | 0) + 1592) >> 2] | 0;
              if (($151 | 0) > 2) {
                $153 = ($51 + 65535) | 0;
                $$140956 = 2;
                do {
                  $156 =
                    HEAPU8[
                      ($43 + (($39 * 1596) | 0) + 1088 + ($$140956 << 1)) >> 0
                    ] | 0;
                  $159 =
                    HEAPU8[
                      ($43 + (($39 * 1596) | 0) + 1088 + ($$140956 << 1) + 1) >>
                        0
                    ] | 0;
                  $175 =
                    _predict_point(
                      HEAPU16[
                        ($43 + (($39 * 1596) | 0) + 338 + ($$140956 << 1)) >> 1
                      ] | 0,
                      HEAPU16[
                        ($43 + (($39 * 1596) | 0) + 338 + ($156 << 1)) >> 1
                      ] | 0,
                      HEAPU16[
                        ($43 + (($39 * 1596) | 0) + 338 + ($159 << 1)) >> 1
                      ] | 0,
                      HEAP16[($53 + ($156 << 1)) >> 1] | 0,
                      HEAP16[($53 + ($159 << 1)) >> 1] | 0
                    ) | 0;
                  $176 = ($53 + ($$140956 << 1)) | 0;
                  $177 = HEAP16[$176 >> 1] | 0;
                  $178 = ($177 << 16) >> 16;
                  $179 = ($51 - $175) | 0;
                  do {
                    if (!(($177 << 16) >> 16)) {
                      HEAP8[($9 + $$140956) >> 0] = 0;
                      $$sink92 = $175;
                      label = 41;
                    } else {
                      HEAP8[($9 + $159) >> 0] = 1;
                      HEAP8[($9 + $156) >> 0] = 1;
                      HEAP8[($9 + $$140956) >> 0] = 1;
                      if (
                        (((($179 | 0) < ($175 | 0) ? $179 : $175) << 1) | 0) <=
                        ($178 | 0)
                      ) {
                        if (($179 | 0) > ($175 | 0)) break;
                        $$sink92 = ($153 - $178) | 0;
                        label = 41;
                        break;
                      }
                      if (!($178 & 1)) {
                        $$sink92 = (($178 >> 1) + $175) | 0;
                        label = 41;
                        break;
                      } else {
                        $$sink92 = ($175 - ((($178 + 1) | 0) >>> 1)) | 0;
                        label = 41;
                        break;
                      }
                    }
                  } while (0);
                  if ((label | 0) == 41) {
                    label = 0;
                    HEAP16[$176 >> 1] = $$sink92;
                  }
                  $$140956 = ($$140956 + 1) | 0;
                } while (($$140956 | 0) < ($151 | 0));
              }
              if (($151 | 0) > 0) {
                $$241061 = 0;
                do {
                  if (!(HEAP8[($9 + $$241061) >> 0] | 0))
                    HEAP16[($53 + ($$241061 << 1)) >> 1] = -1;
                  $$241061 = ($$241061 + 1) | 0;
                } while (($$241061 | 0) != ($151 | 0));
              }
            }
          } while (0);
          if ((label | 0) == 50) {
            label = 0;
            HEAP32[$36 >> 2] = 1;
          }
          $$040465 = ($$040465 + 1) | 0;
          $206 = HEAP32[$23 >> 2] | 0;
          if (($$040465 | 0) >= ($206 | 0)) {
            $$lcssa10 = $206;
            label = 52;
            break L1;
          }
        }
        _error($0, 21);
        $$3 = 0;
      } else {
        $$lcssa10 = $24;
        label = 52;
      }
    } while (0);
    do {
      if ((label | 0) == 52) {
        $208 = ($0 + 68) | 0;
        $209 = HEAP32[$208 >> 2] | 0;
        if ($209 | 0)
          if ((HEAP32[($0 + 72) >> 2] | 0) != (HEAP32[($0 + 80) >> 2] | 0))
            ___assert_fail(1091, 1076, 3279, 1239);
        _memcpy($8 | 0, $7 | 0, ($$lcssa10 << 2) | 0) | 0;
        $217 = HEAP16[$20 >> 1] | 0;
        if (($217 << 16) >> 16) {
          $220 = HEAP32[($16 + (($19 * 40) | 0) + 4) >> 2] | 0;
          $221 = $217 & 65535;
          $$140538 = 0;
          do {
            $225 = ($7 + (HEAPU8[($220 + (($$140538 * 3) | 0)) >> 0] << 2)) | 0;
            $$pre84 =
              ($7 + (HEAPU8[($220 + (($$140538 * 3) | 0) + 1) >> 0] << 2)) | 0;
            if (!(HEAP32[$225 >> 2] | 0)) label = 59;
            else if (!(HEAP32[$$pre84 >> 2] | 0)) label = 59;
            if ((label | 0) == 59) {
              label = 0;
              HEAP32[$$pre84 >> 2] = 0;
              HEAP32[$225 >> 2] = 0;
            }
            $$140538 = ($$140538 + 1) | 0;
          } while ($$140538 >>> 0 < $221 >>> 0);
        }
        $232 = ($16 + (($19 * 40) | 0) + 8) | 0;
        if (!(HEAP8[$232 >> 0] | 0)) $261 = $209;
        else {
          $235 = ($16 + (($19 * 40) | 0) + 4) | 0;
          $$240633 = 0;
          $236 = $$lcssa10;
          while (1) {
            if (($236 | 0) > 0) {
              $238 = HEAP32[$235 >> 2] | 0;
              $$041328 = 0;
              $$341129 = 0;
              while (1) {
                if (
                  ($$240633 | 0) ==
                  (HEAPU8[($238 + (($$341129 * 3) | 0) + 2) >> 0] | 0)
                ) {
                  $246 = ($10 + $$041328) | 0;
                  if (!(HEAP32[($7 + ($$341129 << 2)) >> 2] | 0)) {
                    HEAP8[$246 >> 0] = 0;
                    HEAP32[($9 + ($$041328 << 2)) >> 2] =
                      HEAP32[($0 + 788 + ($$341129 << 2)) >> 2];
                  } else {
                    HEAP8[$246 >> 0] = 1;
                    HEAP32[($9 + ($$041328 << 2)) >> 2] = 0;
                  }
                  $$1414 = ($$041328 + 1) | 0;
                } else $$1414 = $$041328;
                $$341129 = ($$341129 + 1) | 0;
                if (($$341129 | 0) >= ($236 | 0)) {
                  $$0413$lcssa = $$1414;
                  break;
                } else $$041328 = $$1414;
              }
            } else $$0413$lcssa = 0;
            _decode_residue(
              $0,
              $9,
              $$0413$lcssa,
              $21,
              HEAPU8[($16 + (($19 * 40) | 0) + 24 + $$240633) >> 0] | 0,
              $10
            );
            $257 = ($$240633 + 1) | 0;
            if ($257 >>> 0 >= (HEAPU8[$232 >> 0] | 0) >>> 0) break;
            $$240633 = $257;
            $236 = HEAP32[$23 >> 2] | 0;
          }
          $261 = HEAP32[$208 >> 2] | 0;
        }
        if ($261 | 0)
          if ((HEAP32[($0 + 72) >> 2] | 0) != (HEAP32[($0 + 80) >> 2] | 0))
            ___assert_fail(1091, 1076, 3312, 1239);
        $268 = HEAP16[$20 >> 1] | 0;
        if (($268 << 16) >> 16) {
          $272 = HEAP32[($16 + (($19 * 40) | 0) + 4) >> 2] | 0;
          $273 = ($14 | 0) > 1;
          $$340724$in = $268 & 65535;
          do {
            $$340724$in$looptemp = $$340724$in;
            $$340724$in = ($$340724$in + -1) | 0;
            $278 =
              HEAP32[
                ($0 +
                  788 +
                  (HEAPU8[($272 + (($$340724$in * 3) | 0)) >> 0] << 2)) >>
                  2
              ] | 0;
            $283 =
              HEAP32[
                ($0 +
                  788 +
                  (HEAPU8[($272 + (($$340724$in * 3) | 0) + 1) >> 0] << 2)) >>
                  2
              ] | 0;
            if ($273) {
              $$441219 = 0;
              do {
                $284 = ($278 + ($$441219 << 2)) | 0;
                $285 = +HEAPF32[$284 >> 2];
                $287 = ($283 + ($$441219 << 2)) | 0;
                $288 = +HEAPF32[$287 >> 2];
                $289 = $288 > 0;
                do {
                  if ($285 > 0)
                    if ($289) {
                      $$0401 = $285;
                      $$0402 = $285 - $288;
                      break;
                    } else {
                      $$0401 = $285 + $288;
                      $$0402 = $285;
                      break;
                    }
                  else if ($289) {
                    $$0401 = $285;
                    $$0402 = $285 + $288;
                    break;
                  } else {
                    $$0401 = $285 - $288;
                    $$0402 = $285;
                    break;
                  }
                } while (0);
                HEAPF32[$284 >> 2] = $$0401;
                HEAPF32[$287 >> 2] = $$0402;
                $$441219 = ($$441219 + 1) | 0;
              } while (($$441219 | 0) < ($21 | 0));
            }
          } while (($$340724$in$looptemp | 0) > 1);
        }
        if ((HEAP32[$23 >> 2] | 0) > 0) {
          $299 = $21 << 2;
          $$415 = 0;
          do {
            $303 = ($0 + 788 + ($$415 << 2)) | 0;
            if (!(HEAP32[($8 + ($$415 << 2)) >> 2] | 0))
              _do_floor(
                $0,
                $20,
                $$415,
                $14,
                HEAP32[$303 >> 2] | 0,
                HEAP32[($0 + 984 + ($$415 << 2)) >> 2] | 0
              );
            else _memset(HEAP32[$303 >> 2] | 0, 0, $299 | 0) | 0;
            $$415 = ($$415 + 1) | 0;
            $309 = HEAP32[$23 >> 2] | 0;
          } while (($$415 | 0) < ($309 | 0));
          if (($309 | 0) > 0) {
            $$514 = 0;
            do {
              _inverse_mdct(
                HEAP32[($0 + 788 + ($$514 << 2)) >> 2] | 0,
                $14,
                $0,
                HEAPU8[$2 >> 0] | 0
              );
              $$514 = ($$514 + 1) | 0;
            } while (($$514 | 0) < (HEAP32[$23 >> 2] | 0));
          }
        }
        _flush_packet($0);
        $319 = ($0 + 1365) | 0;
        do {
          if (!(HEAP8[$319 >> 0] | 0)) {
            $326 = ($0 + 1400) | 0;
            $327 = HEAP32[$326 >> 2] | 0;
            if (!$327) $$0403 = $3;
            else {
              $329 = ($4 - $3) | 0;
              if (($327 | 0) < ($329 | 0)) {
                $332 = ($327 + $3) | 0;
                HEAP32[$6 >> 2] = $332;
                HEAP32[$326 >> 2] = 0;
                $$0403 = $332;
                break;
              } else {
                HEAP32[$326 >> 2] = $327 - $329;
                HEAP32[$6 >> 2] = $4;
                $$0403 = $4;
                break;
              }
            }
          } else {
            HEAP32[($0 + 1048) >> 2] = $22;
            HEAP32[($0 + 1400) >> 2] = $14 - $5;
            HEAP32[($0 + 1052) >> 2] = 1;
            HEAP8[$319 >> 0] = 0;
            $$0403 = $3;
          }
        } while (0);
        $338 = ($0 + 1052) | 0;
        $339 = HEAP32[$338 >> 2] | 0;
        if ((HEAP32[($0 + 1376) >> 2] | 0) == (HEAP32[($0 + 1392) >> 2] | 0)) {
          if ($339 | 0)
            if (HEAP8[($0 + 1363) >> 0] & 4) {
              $346 = HEAP32[($0 + 1396) >> 2] | 0;
              $347 = ($0 + 1048) | 0;
              $348 = HEAP32[$347 >> 2] | 0;
              $354 =
                (($346 >>> 0 < $348 >>> 0 ? 0 : ($346 - $348) | 0) + $$0403) |
                0;
              $spec$select8 = ($354 | 0) > ($5 | 0) ? $5 : $354;
              if ($346 >>> 0 < (($5 - $$0403 + $348) | 0) >>> 0) {
                HEAP32[$1 >> 2] = $spec$select8;
                HEAP32[$347 >> 2] = (HEAP32[$347 >> 2] | 0) + $spec$select8;
                $$3 = 1;
                break;
              }
            }
          $362 = ($0 + 1048) | 0;
          HEAP32[$362 >> 2] = $$0403 - $21 + (HEAP32[($0 + 1396) >> 2] | 0);
          HEAP32[$338 >> 2] = 1;
          $$pre$phi8087Z2D = $362;
          label = 112;
        } else if ($339 | 0) {
          $$pre$phi8087Z2D = ($0 + 1048) | 0;
          label = 112;
        }
        if ((label | 0) == 112)
          HEAP32[$$pre$phi8087Z2D >> 2] =
            $4 - $$0403 + (HEAP32[$$pre$phi8087Z2D >> 2] | 0);
        if (HEAP32[$208 >> 2] | 0)
          if ((HEAP32[($0 + 72) >> 2] | 0) != (HEAP32[($0 + 80) >> 2] | 0))
            ___assert_fail(1091, 1076, 3428, 1239);
        HEAP32[$1 >> 2] = $5;
        $$3 = 1;
      }
    } while (0);
    STACKTOP = sp;
    return $$3 | 0;
  }
  function _free($0) {
    $0 = $0 | 0;
    var $$0211$i = 0,
      $$0211$in$i = 0,
      $$0381438 = 0,
      $$0382$lcssa = 0,
      $$0382437 = 0,
      $$0394 = 0,
      $$0401 = 0,
      $$1 = 0,
      $$1380 = 0,
      $$1385 = 0,
      $$1385$be = 0,
      $$1385$ph = 0,
      $$1388 = 0,
      $$1388$be = 0,
      $$1388$ph = 0,
      $$1396 = 0,
      $$1396$be = 0,
      $$1396$ph = 0,
      $$1400 = 0,
      $$1400$be = 0,
      $$1400$ph = 0,
      $$2 = 0,
      $$3 = 0,
      $$3398 = 0,
      $$pre$phi444Z2D = 0,
      $$pre$phi446Z2D = 0,
      $$pre$phiZ2D = 0,
      $10 = 0,
      $105 = 0,
      $106 = 0,
      $113 = 0,
      $115 = 0,
      $116 = 0,
      $124 = 0,
      $13 = 0,
      $132 = 0,
      $137 = 0,
      $138 = 0,
      $141 = 0,
      $143 = 0,
      $145 = 0,
      $16 = 0,
      $160 = 0,
      $165 = 0,
      $167 = 0,
      $17 = 0,
      $170 = 0,
      $173 = 0,
      $176 = 0,
      $179 = 0,
      $180 = 0,
      $181 = 0,
      $183 = 0,
      $185 = 0,
      $186 = 0,
      $188 = 0,
      $189 = 0,
      $195 = 0,
      $196 = 0,
      $2 = 0,
      $205 = 0,
      $21 = 0,
      $210 = 0,
      $213 = 0,
      $214 = 0,
      $220 = 0,
      $235 = 0,
      $238 = 0,
      $239 = 0,
      $24 = 0,
      $240 = 0,
      $244 = 0,
      $245 = 0,
      $251 = 0,
      $256 = 0,
      $257 = 0,
      $26 = 0,
      $260 = 0,
      $262 = 0,
      $265 = 0,
      $270 = 0,
      $276 = 0,
      $28 = 0,
      $280 = 0,
      $281 = 0,
      $288 = 0,
      $3 = 0,
      $300 = 0,
      $305 = 0,
      $312 = 0,
      $313 = 0,
      $314 = 0,
      $323 = 0,
      $41 = 0,
      $46 = 0,
      $48 = 0,
      $51 = 0,
      $53 = 0,
      $56 = 0,
      $59 = 0,
      $6 = 0,
      $60 = 0,
      $61 = 0,
      $63 = 0,
      $65 = 0,
      $66 = 0,
      $68 = 0,
      $69 = 0,
      $7 = 0,
      $74 = 0,
      $75 = 0,
      $84 = 0,
      $89 = 0,
      $9 = 0,
      $92 = 0,
      $93 = 0,
      $99 = 0;
    if (!$0) return;
    $2 = ($0 + -8) | 0;
    $3 = HEAP32[724] | 0;
    if ($2 >>> 0 < $3 >>> 0) _abort();
    $6 = HEAP32[($0 + -4) >> 2] | 0;
    $7 = $6 & 3;
    if (($7 | 0) == 1) _abort();
    $9 = $6 & -8;
    $10 = ($2 + $9) | 0;
    L10: do {
      if (!($6 & 1)) {
        $13 = HEAP32[$2 >> 2] | 0;
        if (!$7) return;
        $16 = ($2 + (0 - $13)) | 0;
        $17 = ($13 + $9) | 0;
        if ($16 >>> 0 < $3 >>> 0) _abort();
        if ((HEAP32[725] | 0) == ($16 | 0)) {
          $105 = ($10 + 4) | 0;
          $106 = HEAP32[$105 >> 2] | 0;
          if ((($106 & 3) | 0) != 3) {
            $$1 = $16;
            $$1380 = $17;
            $113 = $16;
            break;
          }
          HEAP32[722] = $17;
          HEAP32[$105 >> 2] = $106 & -2;
          HEAP32[($16 + 4) >> 2] = $17 | 1;
          HEAP32[($16 + $17) >> 2] = $17;
          return;
        }
        $21 = $13 >>> 3;
        if ($13 >>> 0 < 256) {
          $24 = HEAP32[($16 + 8) >> 2] | 0;
          $26 = HEAP32[($16 + 12) >> 2] | 0;
          $28 = (2920 + (($21 << 1) << 2)) | 0;
          if (($24 | 0) != ($28 | 0)) {
            if ($3 >>> 0 > $24 >>> 0) _abort();
            if ((HEAP32[($24 + 12) >> 2] | 0) != ($16 | 0)) _abort();
          }
          if (($26 | 0) == ($24 | 0)) {
            HEAP32[720] = HEAP32[720] & ~(1 << $21);
            $$1 = $16;
            $$1380 = $17;
            $113 = $16;
            break;
          }
          if (($26 | 0) == ($28 | 0)) $$pre$phi446Z2D = ($26 + 8) | 0;
          else {
            if ($3 >>> 0 > $26 >>> 0) _abort();
            $41 = ($26 + 8) | 0;
            if ((HEAP32[$41 >> 2] | 0) == ($16 | 0)) $$pre$phi446Z2D = $41;
            else _abort();
          }
          HEAP32[($24 + 12) >> 2] = $26;
          HEAP32[$$pre$phi446Z2D >> 2] = $24;
          $$1 = $16;
          $$1380 = $17;
          $113 = $16;
          break;
        }
        $46 = HEAP32[($16 + 24) >> 2] | 0;
        $48 = HEAP32[($16 + 12) >> 2] | 0;
        do {
          if (($48 | 0) == ($16 | 0)) {
            $59 = ($16 + 16) | 0;
            $60 = ($59 + 4) | 0;
            $61 = HEAP32[$60 >> 2] | 0;
            if (!$61) {
              $63 = HEAP32[$59 >> 2] | 0;
              if (!$63) {
                $$3 = 0;
                break;
              } else {
                $$1385$ph = $63;
                $$1388$ph = $59;
              }
            } else {
              $$1385$ph = $61;
              $$1388$ph = $60;
            }
            $$1385 = $$1385$ph;
            $$1388 = $$1388$ph;
            while (1) {
              $65 = ($$1385 + 20) | 0;
              $66 = HEAP32[$65 >> 2] | 0;
              if (!$66) {
                $68 = ($$1385 + 16) | 0;
                $69 = HEAP32[$68 >> 2] | 0;
                if (!$69) break;
                else {
                  $$1385$be = $69;
                  $$1388$be = $68;
                }
              } else {
                $$1385$be = $66;
                $$1388$be = $65;
              }
              $$1385 = $$1385$be;
              $$1388 = $$1388$be;
            }
            if ($3 >>> 0 > $$1388 >>> 0) _abort();
            else {
              HEAP32[$$1388 >> 2] = 0;
              $$3 = $$1385;
              break;
            }
          } else {
            $51 = HEAP32[($16 + 8) >> 2] | 0;
            if ($3 >>> 0 > $51 >>> 0) _abort();
            $53 = ($51 + 12) | 0;
            if ((HEAP32[$53 >> 2] | 0) != ($16 | 0)) _abort();
            $56 = ($48 + 8) | 0;
            if ((HEAP32[$56 >> 2] | 0) == ($16 | 0)) {
              HEAP32[$53 >> 2] = $48;
              HEAP32[$56 >> 2] = $51;
              $$3 = $48;
              break;
            } else _abort();
          }
        } while (0);
        if (!$46) {
          $$1 = $16;
          $$1380 = $17;
          $113 = $16;
        } else {
          $74 = HEAP32[($16 + 28) >> 2] | 0;
          $75 = (3184 + ($74 << 2)) | 0;
          do {
            if ((HEAP32[$75 >> 2] | 0) == ($16 | 0)) {
              HEAP32[$75 >> 2] = $$3;
              if (!$$3) {
                HEAP32[721] = HEAP32[721] & ~(1 << $74);
                $$1 = $16;
                $$1380 = $17;
                $113 = $16;
                break L10;
              }
            } else if ((HEAP32[724] | 0) >>> 0 > $46 >>> 0) _abort();
            else {
              $84 = ($46 + 16) | 0;
              HEAP32[
                ((HEAP32[$84 >> 2] | 0) == ($16 | 0) ? $84 : ($46 + 20) | 0) >>
                  2
              ] = $$3;
              if (!$$3) {
                $$1 = $16;
                $$1380 = $17;
                $113 = $16;
                break L10;
              } else break;
            }
          } while (0);
          $89 = HEAP32[724] | 0;
          if ($89 >>> 0 > $$3 >>> 0) _abort();
          HEAP32[($$3 + 24) >> 2] = $46;
          $92 = ($16 + 16) | 0;
          $93 = HEAP32[$92 >> 2] | 0;
          do {
            if ($93 | 0)
              if ($89 >>> 0 > $93 >>> 0) _abort();
              else {
                HEAP32[($$3 + 16) >> 2] = $93;
                HEAP32[($93 + 24) >> 2] = $$3;
                break;
              }
          } while (0);
          $99 = HEAP32[($92 + 4) >> 2] | 0;
          if (!$99) {
            $$1 = $16;
            $$1380 = $17;
            $113 = $16;
          } else if ((HEAP32[724] | 0) >>> 0 > $99 >>> 0) _abort();
          else {
            HEAP32[($$3 + 20) >> 2] = $99;
            HEAP32[($99 + 24) >> 2] = $$3;
            $$1 = $16;
            $$1380 = $17;
            $113 = $16;
            break;
          }
        }
      } else {
        $$1 = $2;
        $$1380 = $9;
        $113 = $2;
      }
    } while (0);
    if ($113 >>> 0 >= $10 >>> 0) _abort();
    $115 = ($10 + 4) | 0;
    $116 = HEAP32[$115 >> 2] | 0;
    if (!($116 & 1)) _abort();
    if (!($116 & 2)) {
      if ((HEAP32[726] | 0) == ($10 | 0)) {
        $124 = ((HEAP32[723] | 0) + $$1380) | 0;
        HEAP32[723] = $124;
        HEAP32[726] = $$1;
        HEAP32[($$1 + 4) >> 2] = $124 | 1;
        if (($$1 | 0) != (HEAP32[725] | 0)) return;
        HEAP32[725] = 0;
        HEAP32[722] = 0;
        return;
      }
      if ((HEAP32[725] | 0) == ($10 | 0)) {
        $132 = ((HEAP32[722] | 0) + $$1380) | 0;
        HEAP32[722] = $132;
        HEAP32[725] = $113;
        HEAP32[($$1 + 4) >> 2] = $132 | 1;
        HEAP32[($113 + $132) >> 2] = $132;
        return;
      }
      $137 = (($116 & -8) + $$1380) | 0;
      $138 = $116 >>> 3;
      L111: do {
        if ($116 >>> 0 < 256) {
          $141 = HEAP32[($10 + 8) >> 2] | 0;
          $143 = HEAP32[($10 + 12) >> 2] | 0;
          $145 = (2920 + (($138 << 1) << 2)) | 0;
          if (($141 | 0) != ($145 | 0)) {
            if ((HEAP32[724] | 0) >>> 0 > $141 >>> 0) _abort();
            if ((HEAP32[($141 + 12) >> 2] | 0) != ($10 | 0)) _abort();
          }
          if (($143 | 0) == ($141 | 0)) {
            HEAP32[720] = HEAP32[720] & ~(1 << $138);
            break;
          }
          if (($143 | 0) == ($145 | 0)) $$pre$phi444Z2D = ($143 + 8) | 0;
          else {
            if ((HEAP32[724] | 0) >>> 0 > $143 >>> 0) _abort();
            $160 = ($143 + 8) | 0;
            if ((HEAP32[$160 >> 2] | 0) == ($10 | 0)) $$pre$phi444Z2D = $160;
            else _abort();
          }
          HEAP32[($141 + 12) >> 2] = $143;
          HEAP32[$$pre$phi444Z2D >> 2] = $141;
        } else {
          $165 = HEAP32[($10 + 24) >> 2] | 0;
          $167 = HEAP32[($10 + 12) >> 2] | 0;
          do {
            if (($167 | 0) == ($10 | 0)) {
              $179 = ($10 + 16) | 0;
              $180 = ($179 + 4) | 0;
              $181 = HEAP32[$180 >> 2] | 0;
              if (!$181) {
                $183 = HEAP32[$179 >> 2] | 0;
                if (!$183) {
                  $$3398 = 0;
                  break;
                } else {
                  $$1396$ph = $183;
                  $$1400$ph = $179;
                }
              } else {
                $$1396$ph = $181;
                $$1400$ph = $180;
              }
              $$1396 = $$1396$ph;
              $$1400 = $$1400$ph;
              while (1) {
                $185 = ($$1396 + 20) | 0;
                $186 = HEAP32[$185 >> 2] | 0;
                if (!$186) {
                  $188 = ($$1396 + 16) | 0;
                  $189 = HEAP32[$188 >> 2] | 0;
                  if (!$189) break;
                  else {
                    $$1396$be = $189;
                    $$1400$be = $188;
                  }
                } else {
                  $$1396$be = $186;
                  $$1400$be = $185;
                }
                $$1396 = $$1396$be;
                $$1400 = $$1400$be;
              }
              if ((HEAP32[724] | 0) >>> 0 > $$1400 >>> 0) _abort();
              else {
                HEAP32[$$1400 >> 2] = 0;
                $$3398 = $$1396;
                break;
              }
            } else {
              $170 = HEAP32[($10 + 8) >> 2] | 0;
              if ((HEAP32[724] | 0) >>> 0 > $170 >>> 0) _abort();
              $173 = ($170 + 12) | 0;
              if ((HEAP32[$173 >> 2] | 0) != ($10 | 0)) _abort();
              $176 = ($167 + 8) | 0;
              if ((HEAP32[$176 >> 2] | 0) == ($10 | 0)) {
                HEAP32[$173 >> 2] = $167;
                HEAP32[$176 >> 2] = $170;
                $$3398 = $167;
                break;
              } else _abort();
            }
          } while (0);
          if ($165 | 0) {
            $195 = HEAP32[($10 + 28) >> 2] | 0;
            $196 = (3184 + ($195 << 2)) | 0;
            do {
              if ((HEAP32[$196 >> 2] | 0) == ($10 | 0)) {
                HEAP32[$196 >> 2] = $$3398;
                if (!$$3398) {
                  HEAP32[721] = HEAP32[721] & ~(1 << $195);
                  break L111;
                }
              } else if ((HEAP32[724] | 0) >>> 0 > $165 >>> 0) _abort();
              else {
                $205 = ($165 + 16) | 0;
                HEAP32[
                  ((HEAP32[$205 >> 2] | 0) == ($10 | 0)
                    ? $205
                    : ($165 + 20) | 0) >> 2
                ] = $$3398;
                if (!$$3398) break L111;
                else break;
              }
            } while (0);
            $210 = HEAP32[724] | 0;
            if ($210 >>> 0 > $$3398 >>> 0) _abort();
            HEAP32[($$3398 + 24) >> 2] = $165;
            $213 = ($10 + 16) | 0;
            $214 = HEAP32[$213 >> 2] | 0;
            do {
              if ($214 | 0)
                if ($210 >>> 0 > $214 >>> 0) _abort();
                else {
                  HEAP32[($$3398 + 16) >> 2] = $214;
                  HEAP32[($214 + 24) >> 2] = $$3398;
                  break;
                }
            } while (0);
            $220 = HEAP32[($213 + 4) >> 2] | 0;
            if ($220 | 0)
              if ((HEAP32[724] | 0) >>> 0 > $220 >>> 0) _abort();
              else {
                HEAP32[($$3398 + 20) >> 2] = $220;
                HEAP32[($220 + 24) >> 2] = $$3398;
                break;
              }
          }
        }
      } while (0);
      HEAP32[($$1 + 4) >> 2] = $137 | 1;
      HEAP32[($113 + $137) >> 2] = $137;
      if (($$1 | 0) == (HEAP32[725] | 0)) {
        HEAP32[722] = $137;
        return;
      } else $$2 = $137;
    } else {
      HEAP32[$115 >> 2] = $116 & -2;
      HEAP32[($$1 + 4) >> 2] = $$1380 | 1;
      HEAP32[($113 + $$1380) >> 2] = $$1380;
      $$2 = $$1380;
    }
    $235 = $$2 >>> 3;
    if ($$2 >>> 0 < 256) {
      $238 = (2920 + (($235 << 1) << 2)) | 0;
      $239 = HEAP32[720] | 0;
      $240 = 1 << $235;
      if (!($239 & $240)) {
        HEAP32[720] = $239 | $240;
        $$0401 = $238;
        $$pre$phiZ2D = ($238 + 8) | 0;
      } else {
        $244 = ($238 + 8) | 0;
        $245 = HEAP32[$244 >> 2] | 0;
        if ((HEAP32[724] | 0) >>> 0 > $245 >>> 0) _abort();
        else {
          $$0401 = $245;
          $$pre$phiZ2D = $244;
        }
      }
      HEAP32[$$pre$phiZ2D >> 2] = $$1;
      HEAP32[($$0401 + 12) >> 2] = $$1;
      HEAP32[($$1 + 8) >> 2] = $$0401;
      HEAP32[($$1 + 12) >> 2] = $238;
      return;
    }
    $251 = $$2 >>> 8;
    if (!$251) $$0394 = 0;
    else if ($$2 >>> 0 > 16777215) $$0394 = 31;
    else {
      $256 = ((($251 + 1048320) | 0) >>> 16) & 8;
      $257 = $251 << $256;
      $260 = ((($257 + 520192) | 0) >>> 16) & 4;
      $262 = $257 << $260;
      $265 = ((($262 + 245760) | 0) >>> 16) & 2;
      $270 = (14 - ($260 | $256 | $265) + (($262 << $265) >>> 15)) | 0;
      $$0394 = (($$2 >>> (($270 + 7) | 0)) & 1) | ($270 << 1);
    }
    $276 = (3184 + ($$0394 << 2)) | 0;
    HEAP32[($$1 + 28) >> 2] = $$0394;
    HEAP32[($$1 + 20) >> 2] = 0;
    HEAP32[($$1 + 16) >> 2] = 0;
    $280 = HEAP32[721] | 0;
    $281 = 1 << $$0394;
    L197: do {
      if (!($280 & $281)) {
        HEAP32[721] = $280 | $281;
        HEAP32[$276 >> 2] = $$1;
        HEAP32[($$1 + 24) >> 2] = $276;
        HEAP32[($$1 + 12) >> 2] = $$1;
        HEAP32[($$1 + 8) >> 2] = $$1;
      } else {
        $288 = HEAP32[$276 >> 2] | 0;
        L200: do {
          if (((HEAP32[($288 + 4) >> 2] & -8) | 0) == ($$2 | 0))
            $$0382$lcssa = $288;
          else {
            $$0381438 =
              $$2 << (($$0394 | 0) == 31 ? 0 : (25 - ($$0394 >>> 1)) | 0);
            $$0382437 = $288;
            while (1) {
              $305 = ($$0382437 + 16 + (($$0381438 >>> 31) << 2)) | 0;
              $300 = HEAP32[$305 >> 2] | 0;
              if (!$300) break;
              if (((HEAP32[($300 + 4) >> 2] & -8) | 0) == ($$2 | 0)) {
                $$0382$lcssa = $300;
                break L200;
              } else {
                $$0381438 = $$0381438 << 1;
                $$0382437 = $300;
              }
            }
            if ((HEAP32[724] | 0) >>> 0 > $305 >>> 0) _abort();
            else {
              HEAP32[$305 >> 2] = $$1;
              HEAP32[($$1 + 24) >> 2] = $$0382437;
              HEAP32[($$1 + 12) >> 2] = $$1;
              HEAP32[($$1 + 8) >> 2] = $$1;
              break L197;
            }
          }
        } while (0);
        $312 = ($$0382$lcssa + 8) | 0;
        $313 = HEAP32[$312 >> 2] | 0;
        $314 = HEAP32[724] | 0;
        if (($314 >>> 0 <= $313 >>> 0) & ($314 >>> 0 <= $$0382$lcssa >>> 0)) {
          HEAP32[($313 + 12) >> 2] = $$1;
          HEAP32[$312 >> 2] = $$1;
          HEAP32[($$1 + 8) >> 2] = $313;
          HEAP32[($$1 + 12) >> 2] = $$0382$lcssa;
          HEAP32[($$1 + 24) >> 2] = 0;
          break;
        } else _abort();
      }
    } while (0);
    $323 = ((HEAP32[728] | 0) + -1) | 0;
    HEAP32[728] = $323;
    if ($323 | 0) return;
    $$0211$in$i = 3336;
    while (1) {
      $$0211$i = HEAP32[$$0211$in$i >> 2] | 0;
      if (!$$0211$i) break;
      else $$0211$in$i = ($$0211$i + 8) | 0;
    }
    HEAP32[728] = -1;
    return;
  }
  function _inverse_mdct($0, $1, $2, $3) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    var $$0$lcssa = 0,
      $$0492$lcssa = 0,
      $$0492579 = 0,
      $$0494 = 0,
      $$0494521 = 0,
      $$0494529 = 0,
      $$0496526 = 0,
      $$0497525 = 0,
      $$0498524 = 0,
      $$0499523 = 0,
      $$0500578 = 0,
      $$0502$lcssa = 0,
      $$0502577 = 0,
      $$0504567 = 0,
      $$0505566 = 0,
      $$0506565 = 0,
      $$0507564 = 0,
      $$0508 = 0,
      $$0508531 = 0,
      $$0508535 = 0,
      $$0509533 = 0,
      $$0510532 = 0,
      $$0511563 = 0,
      $$0512541 = 0,
      $$0513540 = 0,
      $$0514539 = 0,
      $$0515547 = 0,
      $$0516546 = 0,
      $$0517555 = 0,
      $$0518545 = 0,
      $$0559 = 0,
      $$1493573 = 0,
      $$1501572 = 0,
      $$1503571 = 0,
      $$1551 = 0,
      $$pn = 0,
      $$pn520528 = 0,
      $$pn520528$phi = 0,
      $$pn534 = 0,
      $$pn534$phi = 0,
      $106 = 0,
      $108 = 0,
      $109 = 0,
      $110 = 0,
      $112 = 0,
      $114 = 0,
      $12 = 0,
      $123 = 0,
      $14 = 0,
      $140 = 0,
      $141 = 0,
      $142 = 0,
      $143 = 0,
      $145 = 0,
      $146 = 0,
      $153 = 0,
      $156 = 0,
      $157 = 0,
      $158 = 0,
      $16 = 0,
      $162 = 0,
      $163 = 0,
      $164 = 0,
      $169 = 0,
      $172 = 0,
      $173 = 0,
      $175 = 0,
      $177 = 0,
      $18 = 0,
      $180 = 0,
      $181 = 0,
      $187 = 0,
      $188 = 0,
      $19 = 0,
      $194 = 0,
      $20 = 0,
      $212 = 0,
      $22 = 0,
      $23 = 0,
      $230 = 0,
      $234 = 0,
      $235 = 0,
      $236 = 0,
      $237 = 0,
      $238 = 0,
      $239 = 0,
      $240 = 0,
      $241 = 0,
      $242 = 0,
      $244 = 0,
      $246 = 0,
      $248 = 0,
      $251 = 0,
      $252 = 0,
      $253 = 0,
      $258 = 0,
      $259 = 0,
      $260 = 0,
      $261 = 0,
      $262 = 0,
      $263 = 0,
      $264 = 0,
      $265 = 0,
      $266 = 0,
      $268 = 0,
      $27 = 0,
      $271 = 0,
      $273 = 0,
      $276 = 0,
      $277 = 0,
      $278 = 0,
      $294 = 0,
      $296 = 0,
      $299 = 0,
      $301 = 0,
      $303 = 0,
      $307 = 0,
      $31 = 0,
      $312 = 0,
      $314 = 0,
      $317 = 0,
      $319 = 0,
      $321 = 0,
      $325 = 0,
      $33 = 0,
      $332 = 0,
      $334 = 0,
      $337 = 0,
      $339 = 0,
      $341 = 0,
      $345 = 0,
      $351 = 0,
      $353 = 0,
      $356 = 0,
      $357 = 0,
      $359 = 0,
      $363 = 0,
      $4 = 0,
      $5 = 0,
      $52 = 0,
      $57 = 0,
      $6 = 0,
      $7 = 0,
      $8 = 0,
      $80 = 0,
      $82 = 0,
      $83 = 0,
      $86 = 0,
      $92 = 0,
      $95 = 0,
      $scevgep = 0,
      sp = 0;
    sp = STACKTOP;
    $4 = $1 >> 1;
    $5 = $1 >> 2;
    $6 = $1 >> 3;
    $7 = ($2 + 80) | 0;
    $8 = HEAP32[$7 >> 2] | 0;
    $12 = $4 << 2;
    if (!(HEAP32[($2 + 68) >> 2] | 0)) {
      $14 = STACKTOP;
      STACKTOP = (STACKTOP + ((((1 * $12) | 0) + 15) & -16)) | 0;
      $19 = $14;
    } else $19 = _setup_temp_malloc($2, $12) | 0;
    $16 = HEAP32[($2 + 1056 + ($3 << 2)) >> 2] | 0;
    $18 = ($19 + (($4 + -2) << 2)) | 0;
    $20 = ($0 + ($4 << 2)) | 0;
    if (!$4) {
      $$0492$lcssa = $18;
      $$0502$lcssa = $16;
    } else {
      $22 = ($12 + -16) | 0;
      $23 = $22 >>> 4;
      $scevgep = ($19 + ($22 - ($23 << 3))) | 0;
      $27 = (($23 << 1) + 2) | 0;
      $$0492579 = $18;
      $$0500578 = $0;
      $$0502577 = $16;
      while (1) {
        $31 = ($$0500578 + 8) | 0;
        $33 = ($$0502577 + 4) | 0;
        HEAPF32[($$0492579 + 4) >> 2] =
          +HEAPF32[$$0500578 >> 2] * +HEAPF32[$$0502577 >> 2] -
          +HEAPF32[$31 >> 2] * +HEAPF32[$33 >> 2];
        HEAPF32[$$0492579 >> 2] =
          +HEAPF32[$$0500578 >> 2] * +HEAPF32[$33 >> 2] +
          +HEAPF32[$31 >> 2] * +HEAPF32[$$0502577 >> 2];
        $$0500578 = ($$0500578 + 16) | 0;
        if (($$0500578 | 0) == ($20 | 0)) break;
        else {
          $$0492579 = ($$0492579 + -8) | 0;
          $$0502577 = ($$0502577 + 8) | 0;
        }
      }
      $$0492$lcssa = $scevgep;
      $$0502$lcssa = ($16 + ($27 << 2)) | 0;
    }
    if ($$0492$lcssa >>> 0 >= $19 >>> 0) {
      $$1493573 = $$0492$lcssa;
      $$1501572 = ($0 + (($4 + -3) << 2)) | 0;
      $$1503571 = $$0502$lcssa;
      while (1) {
        $52 = ($$1501572 + 8) | 0;
        $57 = ($$1503571 + 4) | 0;
        HEAPF32[($$1493573 + 4) >> 2] =
          +HEAPF32[$$1501572 >> 2] * +HEAPF32[$57 >> 2] -
          +HEAPF32[$52 >> 2] * +HEAPF32[$$1503571 >> 2];
        HEAPF32[$$1493573 >> 2] =
          -(+HEAPF32[$$1501572 >> 2] * +HEAPF32[$$1503571 >> 2]) -
          +HEAPF32[$52 >> 2] * +HEAPF32[$57 >> 2];
        $$1493573 = ($$1493573 + -8) | 0;
        if ($$1493573 >>> 0 < $19 >>> 0) break;
        else {
          $$1501572 = ($$1501572 + -16) | 0;
          $$1503571 = ($$1503571 + 8) | 0;
        }
      }
    }
    if (($1 | 0) >= 16) {
      $$0504567 = ($16 + (($4 + -8) << 2)) | 0;
      $$0505566 = ($0 + ($5 << 2)) | 0;
      $$0506565 = $0;
      $$0507564 = ($19 + ($5 << 2)) | 0;
      $$0511563 = $19;
      while (1) {
        $80 = +HEAPF32[($$0507564 + 4) >> 2];
        $82 = +HEAPF32[($$0511563 + 4) >> 2];
        $83 = $80 - $82;
        $86 = +HEAPF32[$$0507564 >> 2] - +HEAPF32[$$0511563 >> 2];
        HEAPF32[($$0505566 + 4) >> 2] = $80 + $82;
        HEAPF32[$$0505566 >> 2] =
          +HEAPF32[$$0507564 >> 2] + +HEAPF32[$$0511563 >> 2];
        $92 = ($$0504567 + 16) | 0;
        $95 = ($$0504567 + 20) | 0;
        HEAPF32[($$0506565 + 4) >> 2] =
          $83 * +HEAPF32[$92 >> 2] - $86 * +HEAPF32[$95 >> 2];
        HEAPF32[$$0506565 >> 2] =
          $86 * +HEAPF32[$92 >> 2] + $83 * +HEAPF32[$95 >> 2];
        $106 = +HEAPF32[($$0507564 + 12) >> 2];
        $108 = +HEAPF32[($$0511563 + 12) >> 2];
        $109 = $106 - $108;
        $110 = ($$0507564 + 8) | 0;
        $112 = ($$0511563 + 8) | 0;
        $114 = +HEAPF32[$110 >> 2] - +HEAPF32[$112 >> 2];
        HEAPF32[($$0505566 + 12) >> 2] = $106 + $108;
        HEAPF32[($$0505566 + 8) >> 2] =
          +HEAPF32[$110 >> 2] + +HEAPF32[$112 >> 2];
        $123 = ($$0504567 + 4) | 0;
        HEAPF32[($$0506565 + 12) >> 2] =
          $109 * +HEAPF32[$$0504567 >> 2] - $114 * +HEAPF32[$123 >> 2];
        HEAPF32[($$0506565 + 8) >> 2] =
          $114 * +HEAPF32[$$0504567 >> 2] + $109 * +HEAPF32[$123 >> 2];
        $$0504567 = ($$0504567 + -32) | 0;
        if ($$0504567 >>> 0 < $16 >>> 0) break;
        else {
          $$0505566 = ($$0505566 + 16) | 0;
          $$0506565 = ($$0506565 + 16) | 0;
          $$0507564 = ($$0507564 + 16) | 0;
          $$0511563 = ($$0511563 + 16) | 0;
        }
      }
    }
    $140 = _ilog($1) | 0;
    $141 = $1 >> 4;
    $142 = ($4 + -1) | 0;
    $143 = (0 - $6) | 0;
    _imdct_step3_iter0_loop($141, $0, $142, $143, $16);
    _imdct_step3_iter0_loop($141, $0, ($142 - $5) | 0, $143, $16);
    $145 = $1 >> 5;
    $146 = (0 - $141) | 0;
    _imdct_step3_inner_r_loop($145, $0, $142, $146, $16, 16);
    _imdct_step3_inner_r_loop($145, $0, ($142 - $6) | 0, $146, $16, 16);
    _imdct_step3_inner_r_loop($145, $0, ($142 - ($6 << 1)) | 0, $146, $16, 16);
    _imdct_step3_inner_r_loop(
      $145,
      $0,
      ($142 + (Math_imul($6, -3) | 0)) | 0,
      $146,
      $16,
      16
    );
    $153 = ($140 + -4) >> 1;
    if (($140 | 0) > 9) {
      $$0559 = 2;
      while (1) {
        $156 = $1 >> ($$0559 + 2);
        $157 = ($$0559 + 1) | 0;
        $158 = 2 << $$0559;
        if (($158 | 0) > 0) {
          $162 = $1 >> ($$0559 + 4);
          $163 = (0 - ($156 >> 1)) | 0;
          $164 = 8 << $$0559;
          $$0517555 = 0;
          do {
            _imdct_step3_inner_r_loop(
              $162,
              $0,
              ($142 - (Math_imul($$0517555, $156) | 0)) | 0,
              $163,
              $16,
              $164
            );
            $$0517555 = ($$0517555 + 1) | 0;
          } while (($$0517555 | 0) != ($158 | 0));
        }
        if (($157 | 0) < ($153 | 0)) $$0559 = $157;
        else {
          $$0$lcssa = $157;
          break;
        }
      }
    } else $$0$lcssa = 2;
    $169 = ($140 + -7) | 0;
    if (($$0$lcssa | 0) < ($169 | 0)) {
      $$1551 = $$0$lcssa;
      do {
        $172 = $1 >> ($$1551 + 2);
        $173 = 8 << $$1551;
        $175 = $1 >> ($$1551 + 6);
        $177 = 2 << $$1551;
        $$1551 = ($$1551 + 1) | 0;
        if (($175 | 0) > 0) {
          $180 = (0 - ($172 >> 1)) | 0;
          $181 = $173 << 2;
          $$0515547 = $16;
          $$0516546 = $142;
          $$0518545 = $175;
          while (1) {
            _imdct_step3_inner_s_loop(
              $177,
              $0,
              $$0516546,
              $180,
              $$0515547,
              $173,
              $172
            );
            if (($$0518545 | 0) > 1) {
              $$0515547 = ($$0515547 + ($181 << 2)) | 0;
              $$0516546 = ($$0516546 + -8) | 0;
              $$0518545 = ($$0518545 + -1) | 0;
            } else break;
          }
        }
      } while (($$1551 | 0) != ($169 | 0));
    }
    _imdct_step3_inner_s_loop_ld654($145, $0, $142, $16, $1);
    $187 = ($19 + (($5 + -4) << 2)) | 0;
    $188 = ($4 + -4) | 0;
    if ($187 >>> 0 >= $19 >>> 0) {
      $$0512541 = ($19 + ($188 << 2)) | 0;
      $$0513540 = $187;
      $$0514539 = HEAP32[($2 + 1088 + ($3 << 2)) >> 2] | 0;
      while (1) {
        $194 = HEAPU16[$$0514539 >> 1] | 0;
        HEAP32[($$0512541 + 12) >> 2] = HEAP32[($0 + ($194 << 2)) >> 2];
        HEAP32[($$0512541 + 8) >> 2] = HEAP32[($0 + (($194 + 1) << 2)) >> 2];
        HEAP32[($$0513540 + 12) >> 2] = HEAP32[($0 + (($194 + 2) << 2)) >> 2];
        HEAP32[($$0513540 + 8) >> 2] = HEAP32[($0 + (($194 + 3) << 2)) >> 2];
        $212 = HEAPU16[($$0514539 + 2) >> 1] | 0;
        HEAP32[($$0512541 + 4) >> 2] = HEAP32[($0 + ($212 << 2)) >> 2];
        HEAP32[$$0512541 >> 2] = HEAP32[($0 + (($212 + 1) << 2)) >> 2];
        HEAP32[($$0513540 + 4) >> 2] = HEAP32[($0 + (($212 + 2) << 2)) >> 2];
        HEAP32[$$0513540 >> 2] = HEAP32[($0 + (($212 + 3) << 2)) >> 2];
        $$0513540 = ($$0513540 + -16) | 0;
        if ($$0513540 >>> 0 < $19 >>> 0) break;
        else {
          $$0512541 = ($$0512541 + -16) | 0;
          $$0514539 = ($$0514539 + 4) | 0;
        }
      }
    }
    $230 = ($19 + ($4 << 2)) | 0;
    $$0508531 = ($230 + -16) | 0;
    if ($$0508531 >>> 0 > $19 >>> 0) {
      $$0508535 = $$0508531;
      $$0509533 = $19;
      $$0510532 = HEAP32[($2 + 1072 + ($3 << 2)) >> 2] | 0;
      $$pn534 = $230;
      while (1) {
        $234 = +HEAPF32[$$0509533 >> 2];
        $235 = ($$pn534 + -8) | 0;
        $236 = +HEAPF32[$235 >> 2];
        $237 = $234 - $236;
        $238 = ($$0509533 + 4) | 0;
        $239 = +HEAPF32[$238 >> 2];
        $240 = ($$pn534 + -4) | 0;
        $241 = +HEAPF32[$240 >> 2];
        $242 = $239 + $241;
        $244 = +HEAPF32[($$0510532 + 4) >> 2];
        $246 = +HEAPF32[$$0510532 >> 2];
        $248 = $237 * $244 + $242 * $246;
        $251 = $244 * $242 - $237 * $246;
        $252 = $234 + $236;
        $253 = $239 - $241;
        HEAPF32[$$0509533 >> 2] = $252 + $248;
        HEAPF32[$238 >> 2] = $253 + $251;
        HEAPF32[$235 >> 2] = $252 - $248;
        HEAPF32[$240 >> 2] = $251 - $253;
        $258 = ($$0509533 + 8) | 0;
        $259 = +HEAPF32[$258 >> 2];
        $260 = +HEAPF32[$$0508535 >> 2];
        $261 = $259 - $260;
        $262 = ($$0509533 + 12) | 0;
        $263 = +HEAPF32[$262 >> 2];
        $264 = ($$pn534 + -12) | 0;
        $265 = +HEAPF32[$264 >> 2];
        $266 = $263 + $265;
        $268 = +HEAPF32[($$0510532 + 12) >> 2];
        $271 = +HEAPF32[($$0510532 + 8) >> 2];
        $273 = $261 * $268 + $266 * $271;
        $276 = $268 * $266 - $261 * $271;
        $277 = $259 + $260;
        $278 = $263 - $265;
        HEAPF32[$258 >> 2] = $277 + $273;
        HEAPF32[$262 >> 2] = $278 + $276;
        HEAPF32[$$0508535 >> 2] = $277 - $273;
        HEAPF32[$264 >> 2] = $276 - $278;
        $$0509533 = ($$0509533 + 16) | 0;
        $$0508 = ($$0508535 + -16) | 0;
        if ($$0509533 >>> 0 >= $$0508 >>> 0) break;
        else {
          $$pn534$phi = $$0508535;
          $$0508535 = $$0508;
          $$0510532 = ($$0510532 + 16) | 0;
          $$pn534 = $$pn534$phi;
        }
      }
    }
    $$0494521 = ($230 + -32) | 0;
    if ($$0494521 >>> 0 >= $19 >>> 0) {
      $$0494529 = $$0494521;
      $$0496526 = ($0 + (($1 + -4) << 2)) | 0;
      $$0497525 = $20;
      $$0498524 = ($0 + ($188 << 2)) | 0;
      $$0499523 = $0;
      $$pn = ((HEAP32[($2 + 1064 + ($3 << 2)) >> 2] | 0) + ($4 << 2)) | 0;
      $$pn520528 = $230;
      while (1) {
        $294 = +HEAPF32[($$pn520528 + -8) >> 2];
        $296 = +HEAPF32[($$pn + -4) >> 2];
        $299 = +HEAPF32[($$pn520528 + -4) >> 2];
        $301 = +HEAPF32[($$pn + -8) >> 2];
        $303 = $294 * $296 - $299 * $301;
        $307 = -($294 * $301) - $296 * $299;
        HEAPF32[$$0499523 >> 2] = $303;
        HEAPF32[($$0498524 + 12) >> 2] = -$303;
        HEAPF32[$$0497525 >> 2] = $307;
        HEAPF32[($$0496526 + 12) >> 2] = $307;
        $312 = +HEAPF32[($$pn520528 + -16) >> 2];
        $314 = +HEAPF32[($$pn + -12) >> 2];
        $317 = +HEAPF32[($$pn520528 + -12) >> 2];
        $319 = +HEAPF32[($$pn + -16) >> 2];
        $321 = $312 * $314 - $317 * $319;
        $325 = -($312 * $319) - $314 * $317;
        HEAPF32[($$0499523 + 4) >> 2] = $321;
        HEAPF32[($$0498524 + 8) >> 2] = -$321;
        HEAPF32[($$0497525 + 4) >> 2] = $325;
        HEAPF32[($$0496526 + 8) >> 2] = $325;
        $332 = +HEAPF32[($$pn520528 + -24) >> 2];
        $334 = +HEAPF32[($$pn + -20) >> 2];
        $337 = +HEAPF32[($$pn520528 + -20) >> 2];
        $339 = +HEAPF32[($$pn + -24) >> 2];
        $341 = $332 * $334 - $337 * $339;
        $345 = -($332 * $339) - $334 * $337;
        HEAPF32[($$0499523 + 8) >> 2] = $341;
        HEAPF32[($$0498524 + 4) >> 2] = -$341;
        HEAPF32[($$0497525 + 8) >> 2] = $345;
        HEAPF32[($$0496526 + 4) >> 2] = $345;
        $351 = +HEAPF32[$$0494529 >> 2];
        $353 = +HEAPF32[($$pn + -28) >> 2];
        $$pn = ($$pn + -32) | 0;
        $356 = +HEAPF32[($$pn520528 + -28) >> 2];
        $357 = +HEAPF32[$$pn >> 2];
        $359 = $351 * $353 - $356 * $357;
        $363 = -($351 * $357) - $353 * $356;
        HEAPF32[($$0499523 + 12) >> 2] = $359;
        HEAPF32[$$0498524 >> 2] = -$359;
        HEAPF32[($$0497525 + 12) >> 2] = $363;
        HEAPF32[$$0496526 >> 2] = $363;
        $$0494 = ($$0494529 + -32) | 0;
        if ($$0494 >>> 0 < $19 >>> 0) break;
        else {
          $$pn520528$phi = $$0494529;
          $$0494529 = $$0494;
          $$0496526 = ($$0496526 + -16) | 0;
          $$0497525 = ($$0497525 + 16) | 0;
          $$0498524 = ($$0498524 + -16) | 0;
          $$0499523 = ($$0499523 + 16) | 0;
          $$pn520528 = $$pn520528$phi;
        }
      }
    }
    HEAP32[$7 >> 2] = $8;
    STACKTOP = sp;
    return;
  }
  function _dispose_chunk($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$041722 = 0,
      $$0418$lcssa = 0,
      $$041821 = 0,
      $$0429 = 0,
      $$0436 = 0,
      $$1 = 0,
      $$1416 = 0,
      $$1424 = 0,
      $$1424$be = 0,
      $$1424$ph = 0,
      $$1427 = 0,
      $$1427$be = 0,
      $$1427$ph = 0,
      $$1431 = 0,
      $$1431$be = 0,
      $$1431$ph = 0,
      $$1435 = 0,
      $$1435$be = 0,
      $$1435$ph = 0,
      $$2 = 0,
      $$3 = 0,
      $$3433 = 0,
      $$pre$phi28Z2D = 0,
      $$pre$phi30Z2D = 0,
      $$pre$phiZ2D = 0,
      $101 = 0,
      $102 = 0,
      $108 = 0,
      $11 = 0,
      $110 = 0,
      $111 = 0,
      $117 = 0,
      $12 = 0,
      $125 = 0,
      $13 = 0,
      $130 = 0,
      $131 = 0,
      $134 = 0,
      $136 = 0,
      $138 = 0,
      $151 = 0,
      $156 = 0,
      $158 = 0,
      $161 = 0,
      $163 = 0,
      $166 = 0,
      $169 = 0,
      $17 = 0,
      $170 = 0,
      $171 = 0,
      $173 = 0,
      $175 = 0,
      $176 = 0,
      $178 = 0,
      $179 = 0,
      $184 = 0,
      $185 = 0,
      $194 = 0,
      $199 = 0,
      $2 = 0,
      $20 = 0,
      $202 = 0,
      $203 = 0,
      $209 = 0,
      $22 = 0,
      $224 = 0,
      $227 = 0,
      $228 = 0,
      $229 = 0,
      $233 = 0,
      $234 = 0,
      $24 = 0,
      $240 = 0,
      $245 = 0,
      $246 = 0,
      $249 = 0,
      $251 = 0,
      $254 = 0,
      $259 = 0,
      $265 = 0,
      $269 = 0,
      $270 = 0,
      $277 = 0,
      $289 = 0,
      $294 = 0,
      $301 = 0,
      $302 = 0,
      $303 = 0,
      $37 = 0,
      $4 = 0,
      $42 = 0,
      $44 = 0,
      $47 = 0,
      $49 = 0,
      $52 = 0,
      $55 = 0,
      $56 = 0,
      $57 = 0,
      $59 = 0,
      $61 = 0,
      $62 = 0,
      $64 = 0,
      $65 = 0,
      $7 = 0,
      $70 = 0,
      $71 = 0,
      $80 = 0,
      $85 = 0,
      $88 = 0,
      $89 = 0,
      $95 = 0;
    $2 = ($0 + $1) | 0;
    $4 = HEAP32[($0 + 4) >> 2] | 0;
    L1: do {
      if (!($4 & 1)) {
        $7 = HEAP32[$0 >> 2] | 0;
        if (!($4 & 3)) return;
        $11 = ($0 + (0 - $7)) | 0;
        $12 = ($7 + $1) | 0;
        $13 = HEAP32[724] | 0;
        if ($11 >>> 0 < $13 >>> 0) _abort();
        if ((HEAP32[725] | 0) == ($11 | 0)) {
          $101 = ($2 + 4) | 0;
          $102 = HEAP32[$101 >> 2] | 0;
          if ((($102 & 3) | 0) != 3) {
            $$1 = $11;
            $$1416 = $12;
            break;
          }
          HEAP32[722] = $12;
          HEAP32[$101 >> 2] = $102 & -2;
          HEAP32[($11 + 4) >> 2] = $12 | 1;
          HEAP32[$2 >> 2] = $12;
          return;
        }
        $17 = $7 >>> 3;
        if ($7 >>> 0 < 256) {
          $20 = HEAP32[($11 + 8) >> 2] | 0;
          $22 = HEAP32[($11 + 12) >> 2] | 0;
          $24 = (2920 + (($17 << 1) << 2)) | 0;
          if (($20 | 0) != ($24 | 0)) {
            if ($13 >>> 0 > $20 >>> 0) _abort();
            if ((HEAP32[($20 + 12) >> 2] | 0) != ($11 | 0)) _abort();
          }
          if (($22 | 0) == ($20 | 0)) {
            HEAP32[720] = HEAP32[720] & ~(1 << $17);
            $$1 = $11;
            $$1416 = $12;
            break;
          }
          if (($22 | 0) == ($24 | 0)) $$pre$phi30Z2D = ($22 + 8) | 0;
          else {
            if ($13 >>> 0 > $22 >>> 0) _abort();
            $37 = ($22 + 8) | 0;
            if ((HEAP32[$37 >> 2] | 0) == ($11 | 0)) $$pre$phi30Z2D = $37;
            else _abort();
          }
          HEAP32[($20 + 12) >> 2] = $22;
          HEAP32[$$pre$phi30Z2D >> 2] = $20;
          $$1 = $11;
          $$1416 = $12;
          break;
        }
        $42 = HEAP32[($11 + 24) >> 2] | 0;
        $44 = HEAP32[($11 + 12) >> 2] | 0;
        do {
          if (($44 | 0) == ($11 | 0)) {
            $55 = ($11 + 16) | 0;
            $56 = ($55 + 4) | 0;
            $57 = HEAP32[$56 >> 2] | 0;
            if (!$57) {
              $59 = HEAP32[$55 >> 2] | 0;
              if (!$59) {
                $$3 = 0;
                break;
              } else {
                $$1424$ph = $59;
                $$1427$ph = $55;
              }
            } else {
              $$1424$ph = $57;
              $$1427$ph = $56;
            }
            $$1424 = $$1424$ph;
            $$1427 = $$1427$ph;
            while (1) {
              $61 = ($$1424 + 20) | 0;
              $62 = HEAP32[$61 >> 2] | 0;
              if (!$62) {
                $64 = ($$1424 + 16) | 0;
                $65 = HEAP32[$64 >> 2] | 0;
                if (!$65) break;
                else {
                  $$1424$be = $65;
                  $$1427$be = $64;
                }
              } else {
                $$1424$be = $62;
                $$1427$be = $61;
              }
              $$1424 = $$1424$be;
              $$1427 = $$1427$be;
            }
            if ($13 >>> 0 > $$1427 >>> 0) _abort();
            else {
              HEAP32[$$1427 >> 2] = 0;
              $$3 = $$1424;
              break;
            }
          } else {
            $47 = HEAP32[($11 + 8) >> 2] | 0;
            if ($13 >>> 0 > $47 >>> 0) _abort();
            $49 = ($47 + 12) | 0;
            if ((HEAP32[$49 >> 2] | 0) != ($11 | 0)) _abort();
            $52 = ($44 + 8) | 0;
            if ((HEAP32[$52 >> 2] | 0) == ($11 | 0)) {
              HEAP32[$49 >> 2] = $44;
              HEAP32[$52 >> 2] = $47;
              $$3 = $44;
              break;
            } else _abort();
          }
        } while (0);
        if (!$42) {
          $$1 = $11;
          $$1416 = $12;
        } else {
          $70 = HEAP32[($11 + 28) >> 2] | 0;
          $71 = (3184 + ($70 << 2)) | 0;
          do {
            if ((HEAP32[$71 >> 2] | 0) == ($11 | 0)) {
              HEAP32[$71 >> 2] = $$3;
              if (!$$3) {
                HEAP32[721] = HEAP32[721] & ~(1 << $70);
                $$1 = $11;
                $$1416 = $12;
                break L1;
              }
            } else if ((HEAP32[724] | 0) >>> 0 > $42 >>> 0) _abort();
            else {
              $80 = ($42 + 16) | 0;
              HEAP32[
                ((HEAP32[$80 >> 2] | 0) == ($11 | 0) ? $80 : ($42 + 20) | 0) >>
                  2
              ] = $$3;
              if (!$$3) {
                $$1 = $11;
                $$1416 = $12;
                break L1;
              } else break;
            }
          } while (0);
          $85 = HEAP32[724] | 0;
          if ($85 >>> 0 > $$3 >>> 0) _abort();
          HEAP32[($$3 + 24) >> 2] = $42;
          $88 = ($11 + 16) | 0;
          $89 = HEAP32[$88 >> 2] | 0;
          do {
            if ($89 | 0)
              if ($85 >>> 0 > $89 >>> 0) _abort();
              else {
                HEAP32[($$3 + 16) >> 2] = $89;
                HEAP32[($89 + 24) >> 2] = $$3;
                break;
              }
          } while (0);
          $95 = HEAP32[($88 + 4) >> 2] | 0;
          if (!$95) {
            $$1 = $11;
            $$1416 = $12;
          } else if ((HEAP32[724] | 0) >>> 0 > $95 >>> 0) _abort();
          else {
            HEAP32[($$3 + 20) >> 2] = $95;
            HEAP32[($95 + 24) >> 2] = $$3;
            $$1 = $11;
            $$1416 = $12;
            break;
          }
        }
      } else {
        $$1 = $0;
        $$1416 = $1;
      }
    } while (0);
    $108 = HEAP32[724] | 0;
    if ($2 >>> 0 < $108 >>> 0) _abort();
    $110 = ($2 + 4) | 0;
    $111 = HEAP32[$110 >> 2] | 0;
    if (!($111 & 2)) {
      if ((HEAP32[726] | 0) == ($2 | 0)) {
        $117 = ((HEAP32[723] | 0) + $$1416) | 0;
        HEAP32[723] = $117;
        HEAP32[726] = $$1;
        HEAP32[($$1 + 4) >> 2] = $117 | 1;
        if (($$1 | 0) != (HEAP32[725] | 0)) return;
        HEAP32[725] = 0;
        HEAP32[722] = 0;
        return;
      }
      if ((HEAP32[725] | 0) == ($2 | 0)) {
        $125 = ((HEAP32[722] | 0) + $$1416) | 0;
        HEAP32[722] = $125;
        HEAP32[725] = $$1;
        HEAP32[($$1 + 4) >> 2] = $125 | 1;
        HEAP32[($$1 + $125) >> 2] = $125;
        return;
      }
      $130 = (($111 & -8) + $$1416) | 0;
      $131 = $111 >>> 3;
      L99: do {
        if ($111 >>> 0 < 256) {
          $134 = HEAP32[($2 + 8) >> 2] | 0;
          $136 = HEAP32[($2 + 12) >> 2] | 0;
          $138 = (2920 + (($131 << 1) << 2)) | 0;
          if (($134 | 0) != ($138 | 0)) {
            if ($108 >>> 0 > $134 >>> 0) _abort();
            if ((HEAP32[($134 + 12) >> 2] | 0) != ($2 | 0)) _abort();
          }
          if (($136 | 0) == ($134 | 0)) {
            HEAP32[720] = HEAP32[720] & ~(1 << $131);
            break;
          }
          if (($136 | 0) == ($138 | 0)) $$pre$phi28Z2D = ($136 + 8) | 0;
          else {
            if ($108 >>> 0 > $136 >>> 0) _abort();
            $151 = ($136 + 8) | 0;
            if ((HEAP32[$151 >> 2] | 0) == ($2 | 0)) $$pre$phi28Z2D = $151;
            else _abort();
          }
          HEAP32[($134 + 12) >> 2] = $136;
          HEAP32[$$pre$phi28Z2D >> 2] = $134;
        } else {
          $156 = HEAP32[($2 + 24) >> 2] | 0;
          $158 = HEAP32[($2 + 12) >> 2] | 0;
          do {
            if (($158 | 0) == ($2 | 0)) {
              $169 = ($2 + 16) | 0;
              $170 = ($169 + 4) | 0;
              $171 = HEAP32[$170 >> 2] | 0;
              if (!$171) {
                $173 = HEAP32[$169 >> 2] | 0;
                if (!$173) {
                  $$3433 = 0;
                  break;
                } else {
                  $$1431$ph = $173;
                  $$1435$ph = $169;
                }
              } else {
                $$1431$ph = $171;
                $$1435$ph = $170;
              }
              $$1431 = $$1431$ph;
              $$1435 = $$1435$ph;
              while (1) {
                $175 = ($$1431 + 20) | 0;
                $176 = HEAP32[$175 >> 2] | 0;
                if (!$176) {
                  $178 = ($$1431 + 16) | 0;
                  $179 = HEAP32[$178 >> 2] | 0;
                  if (!$179) break;
                  else {
                    $$1431$be = $179;
                    $$1435$be = $178;
                  }
                } else {
                  $$1431$be = $176;
                  $$1435$be = $175;
                }
                $$1431 = $$1431$be;
                $$1435 = $$1435$be;
              }
              if ($108 >>> 0 > $$1435 >>> 0) _abort();
              else {
                HEAP32[$$1435 >> 2] = 0;
                $$3433 = $$1431;
                break;
              }
            } else {
              $161 = HEAP32[($2 + 8) >> 2] | 0;
              if ($108 >>> 0 > $161 >>> 0) _abort();
              $163 = ($161 + 12) | 0;
              if ((HEAP32[$163 >> 2] | 0) != ($2 | 0)) _abort();
              $166 = ($158 + 8) | 0;
              if ((HEAP32[$166 >> 2] | 0) == ($2 | 0)) {
                HEAP32[$163 >> 2] = $158;
                HEAP32[$166 >> 2] = $161;
                $$3433 = $158;
                break;
              } else _abort();
            }
          } while (0);
          if ($156 | 0) {
            $184 = HEAP32[($2 + 28) >> 2] | 0;
            $185 = (3184 + ($184 << 2)) | 0;
            do {
              if ((HEAP32[$185 >> 2] | 0) == ($2 | 0)) {
                HEAP32[$185 >> 2] = $$3433;
                if (!$$3433) {
                  HEAP32[721] = HEAP32[721] & ~(1 << $184);
                  break L99;
                }
              } else if ((HEAP32[724] | 0) >>> 0 > $156 >>> 0) _abort();
              else {
                $194 = ($156 + 16) | 0;
                HEAP32[
                  ((HEAP32[$194 >> 2] | 0) == ($2 | 0)
                    ? $194
                    : ($156 + 20) | 0) >> 2
                ] = $$3433;
                if (!$$3433) break L99;
                else break;
              }
            } while (0);
            $199 = HEAP32[724] | 0;
            if ($199 >>> 0 > $$3433 >>> 0) _abort();
            HEAP32[($$3433 + 24) >> 2] = $156;
            $202 = ($2 + 16) | 0;
            $203 = HEAP32[$202 >> 2] | 0;
            do {
              if ($203 | 0)
                if ($199 >>> 0 > $203 >>> 0) _abort();
                else {
                  HEAP32[($$3433 + 16) >> 2] = $203;
                  HEAP32[($203 + 24) >> 2] = $$3433;
                  break;
                }
            } while (0);
            $209 = HEAP32[($202 + 4) >> 2] | 0;
            if ($209 | 0)
              if ((HEAP32[724] | 0) >>> 0 > $209 >>> 0) _abort();
              else {
                HEAP32[($$3433 + 20) >> 2] = $209;
                HEAP32[($209 + 24) >> 2] = $$3433;
                break;
              }
          }
        }
      } while (0);
      HEAP32[($$1 + 4) >> 2] = $130 | 1;
      HEAP32[($$1 + $130) >> 2] = $130;
      if (($$1 | 0) == (HEAP32[725] | 0)) {
        HEAP32[722] = $130;
        return;
      } else $$2 = $130;
    } else {
      HEAP32[$110 >> 2] = $111 & -2;
      HEAP32[($$1 + 4) >> 2] = $$1416 | 1;
      HEAP32[($$1 + $$1416) >> 2] = $$1416;
      $$2 = $$1416;
    }
    $224 = $$2 >>> 3;
    if ($$2 >>> 0 < 256) {
      $227 = (2920 + (($224 << 1) << 2)) | 0;
      $228 = HEAP32[720] | 0;
      $229 = 1 << $224;
      if (!($228 & $229)) {
        HEAP32[720] = $228 | $229;
        $$0436 = $227;
        $$pre$phiZ2D = ($227 + 8) | 0;
      } else {
        $233 = ($227 + 8) | 0;
        $234 = HEAP32[$233 >> 2] | 0;
        if ((HEAP32[724] | 0) >>> 0 > $234 >>> 0) _abort();
        else {
          $$0436 = $234;
          $$pre$phiZ2D = $233;
        }
      }
      HEAP32[$$pre$phiZ2D >> 2] = $$1;
      HEAP32[($$0436 + 12) >> 2] = $$1;
      HEAP32[($$1 + 8) >> 2] = $$0436;
      HEAP32[($$1 + 12) >> 2] = $227;
      return;
    }
    $240 = $$2 >>> 8;
    if (!$240) $$0429 = 0;
    else if ($$2 >>> 0 > 16777215) $$0429 = 31;
    else {
      $245 = ((($240 + 1048320) | 0) >>> 16) & 8;
      $246 = $240 << $245;
      $249 = ((($246 + 520192) | 0) >>> 16) & 4;
      $251 = $246 << $249;
      $254 = ((($251 + 245760) | 0) >>> 16) & 2;
      $259 = (14 - ($249 | $245 | $254) + (($251 << $254) >>> 15)) | 0;
      $$0429 = (($$2 >>> (($259 + 7) | 0)) & 1) | ($259 << 1);
    }
    $265 = (3184 + ($$0429 << 2)) | 0;
    HEAP32[($$1 + 28) >> 2] = $$0429;
    HEAP32[($$1 + 20) >> 2] = 0;
    HEAP32[($$1 + 16) >> 2] = 0;
    $269 = HEAP32[721] | 0;
    $270 = 1 << $$0429;
    if (!($269 & $270)) {
      HEAP32[721] = $269 | $270;
      HEAP32[$265 >> 2] = $$1;
      HEAP32[($$1 + 24) >> 2] = $265;
      HEAP32[($$1 + 12) >> 2] = $$1;
      HEAP32[($$1 + 8) >> 2] = $$1;
      return;
    }
    $277 = HEAP32[$265 >> 2] | 0;
    L189: do {
      if (((HEAP32[($277 + 4) >> 2] & -8) | 0) == ($$2 | 0))
        $$0418$lcssa = $277;
      else {
        $$041722 = $$2 << (($$0429 | 0) == 31 ? 0 : (25 - ($$0429 >>> 1)) | 0);
        $$041821 = $277;
        while (1) {
          $294 = ($$041821 + 16 + (($$041722 >>> 31) << 2)) | 0;
          $289 = HEAP32[$294 >> 2] | 0;
          if (!$289) break;
          if (((HEAP32[($289 + 4) >> 2] & -8) | 0) == ($$2 | 0)) {
            $$0418$lcssa = $289;
            break L189;
          } else {
            $$041722 = $$041722 << 1;
            $$041821 = $289;
          }
        }
        if ((HEAP32[724] | 0) >>> 0 > $294 >>> 0) _abort();
        HEAP32[$294 >> 2] = $$1;
        HEAP32[($$1 + 24) >> 2] = $$041821;
        HEAP32[($$1 + 12) >> 2] = $$1;
        HEAP32[($$1 + 8) >> 2] = $$1;
        return;
      }
    } while (0);
    $301 = ($$0418$lcssa + 8) | 0;
    $302 = HEAP32[$301 >> 2] | 0;
    $303 = HEAP32[724] | 0;
    if (!(($303 >>> 0 <= $302 >>> 0) & ($303 >>> 0 <= $$0418$lcssa >>> 0)))
      _abort();
    HEAP32[($302 + 12) >> 2] = $$1;
    HEAP32[$301 >> 2] = $$1;
    HEAP32[($$1 + 8) >> 2] = $302;
    HEAP32[($$1 + 12) >> 2] = $$0418$lcssa;
    HEAP32[($$1 + 24) >> 2] = 0;
    return;
  }
  function _try_realloc_chunk($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$1271 = 0,
      $$1271$be = 0,
      $$1271$ph = 0,
      $$1274 = 0,
      $$1274$be = 0,
      $$1274$ph = 0,
      $$2 = 0,
      $$3 = 0,
      $$pre$phiZ2D = 0,
      $101 = 0,
      $103 = 0,
      $106 = 0,
      $108 = 0,
      $11 = 0,
      $111 = 0,
      $114 = 0,
      $115 = 0,
      $116 = 0,
      $118 = 0,
      $12 = 0,
      $120 = 0,
      $121 = 0,
      $123 = 0,
      $124 = 0,
      $129 = 0,
      $130 = 0,
      $139 = 0,
      $144 = 0,
      $147 = 0,
      $148 = 0,
      $154 = 0,
      $165 = 0,
      $168 = 0,
      $175 = 0,
      $2 = 0,
      $24 = 0,
      $26 = 0,
      $3 = 0,
      $37 = 0,
      $39 = 0,
      $4 = 0,
      $40 = 0,
      $49 = 0,
      $5 = 0,
      $51 = 0,
      $53 = 0,
      $54 = 0,
      $6 = 0,
      $60 = 0,
      $67 = 0,
      $73 = 0,
      $75 = 0,
      $76 = 0,
      $79 = 0,
      $8 = 0,
      $81 = 0,
      $83 = 0,
      $96 = 0,
      $storemerge = 0,
      $storemerge3 = 0;
    $2 = ($0 + 4) | 0;
    $3 = HEAP32[$2 >> 2] | 0;
    $4 = $3 & -8;
    $5 = ($0 + $4) | 0;
    $6 = HEAP32[724] | 0;
    $8 = $3 & 3;
    if (!((($8 | 0) != 1) & ($6 >>> 0 <= $0 >>> 0) & ($5 >>> 0 > $0 >>> 0)))
      _abort();
    $11 = ($5 + 4) | 0;
    $12 = HEAP32[$11 >> 2] | 0;
    if (!($12 & 1)) _abort();
    if (!$8) {
      if ($1 >>> 0 < 256) {
        $$2 = 0;
        return $$2 | 0;
      }
      if ($4 >>> 0 >= (($1 + 4) | 0) >>> 0)
        if ((($4 - $1) | 0) >>> 0 <= (HEAP32[840] << 1) >>> 0) {
          $$2 = $0;
          return $$2 | 0;
        }
      $$2 = 0;
      return $$2 | 0;
    }
    if ($4 >>> 0 >= $1 >>> 0) {
      $24 = ($4 - $1) | 0;
      if ($24 >>> 0 <= 15) {
        $$2 = $0;
        return $$2 | 0;
      }
      $26 = ($0 + $1) | 0;
      HEAP32[$2 >> 2] = ($3 & 1) | $1 | 2;
      HEAP32[($26 + 4) >> 2] = $24 | 3;
      HEAP32[$11 >> 2] = HEAP32[$11 >> 2] | 1;
      _dispose_chunk($26, $24);
      $$2 = $0;
      return $$2 | 0;
    }
    if ((HEAP32[726] | 0) == ($5 | 0)) {
      $37 = ((HEAP32[723] | 0) + $4) | 0;
      $39 = ($37 - $1) | 0;
      $40 = ($0 + $1) | 0;
      if ($37 >>> 0 <= $1 >>> 0) {
        $$2 = 0;
        return $$2 | 0;
      }
      HEAP32[$2 >> 2] = ($3 & 1) | $1 | 2;
      HEAP32[($40 + 4) >> 2] = $39 | 1;
      HEAP32[726] = $40;
      HEAP32[723] = $39;
      $$2 = $0;
      return $$2 | 0;
    }
    if ((HEAP32[725] | 0) == ($5 | 0)) {
      $49 = ((HEAP32[722] | 0) + $4) | 0;
      if ($49 >>> 0 < $1 >>> 0) {
        $$2 = 0;
        return $$2 | 0;
      }
      $51 = ($49 - $1) | 0;
      if ($51 >>> 0 > 15) {
        $53 = ($0 + $1) | 0;
        $54 = ($0 + $49) | 0;
        HEAP32[$2 >> 2] = ($3 & 1) | $1 | 2;
        HEAP32[($53 + 4) >> 2] = $51 | 1;
        HEAP32[$54 >> 2] = $51;
        $60 = ($54 + 4) | 0;
        HEAP32[$60 >> 2] = HEAP32[$60 >> 2] & -2;
        $storemerge = $53;
        $storemerge3 = $51;
      } else {
        HEAP32[$2 >> 2] = ($3 & 1) | $49 | 2;
        $67 = ($0 + $49 + 4) | 0;
        HEAP32[$67 >> 2] = HEAP32[$67 >> 2] | 1;
        $storemerge = 0;
        $storemerge3 = 0;
      }
      HEAP32[722] = $storemerge3;
      HEAP32[725] = $storemerge;
      $$2 = $0;
      return $$2 | 0;
    }
    if (($12 & 2) | 0) {
      $$2 = 0;
      return $$2 | 0;
    }
    $73 = (($12 & -8) + $4) | 0;
    if ($73 >>> 0 < $1 >>> 0) {
      $$2 = 0;
      return $$2 | 0;
    }
    $75 = ($73 - $1) | 0;
    $76 = $12 >>> 3;
    L49: do {
      if ($12 >>> 0 < 256) {
        $79 = HEAP32[($5 + 8) >> 2] | 0;
        $81 = HEAP32[($5 + 12) >> 2] | 0;
        $83 = (2920 + (($76 << 1) << 2)) | 0;
        if (($79 | 0) != ($83 | 0)) {
          if ($6 >>> 0 > $79 >>> 0) _abort();
          if ((HEAP32[($79 + 12) >> 2] | 0) != ($5 | 0)) _abort();
        }
        if (($81 | 0) == ($79 | 0)) {
          HEAP32[720] = HEAP32[720] & ~(1 << $76);
          break;
        }
        if (($81 | 0) == ($83 | 0)) $$pre$phiZ2D = ($81 + 8) | 0;
        else {
          if ($6 >>> 0 > $81 >>> 0) _abort();
          $96 = ($81 + 8) | 0;
          if ((HEAP32[$96 >> 2] | 0) == ($5 | 0)) $$pre$phiZ2D = $96;
          else _abort();
        }
        HEAP32[($79 + 12) >> 2] = $81;
        HEAP32[$$pre$phiZ2D >> 2] = $79;
      } else {
        $101 = HEAP32[($5 + 24) >> 2] | 0;
        $103 = HEAP32[($5 + 12) >> 2] | 0;
        do {
          if (($103 | 0) == ($5 | 0)) {
            $114 = ($5 + 16) | 0;
            $115 = ($114 + 4) | 0;
            $116 = HEAP32[$115 >> 2] | 0;
            if (!$116) {
              $118 = HEAP32[$114 >> 2] | 0;
              if (!$118) {
                $$3 = 0;
                break;
              } else {
                $$1271$ph = $118;
                $$1274$ph = $114;
              }
            } else {
              $$1271$ph = $116;
              $$1274$ph = $115;
            }
            $$1271 = $$1271$ph;
            $$1274 = $$1274$ph;
            while (1) {
              $120 = ($$1271 + 20) | 0;
              $121 = HEAP32[$120 >> 2] | 0;
              if (!$121) {
                $123 = ($$1271 + 16) | 0;
                $124 = HEAP32[$123 >> 2] | 0;
                if (!$124) break;
                else {
                  $$1271$be = $124;
                  $$1274$be = $123;
                }
              } else {
                $$1271$be = $121;
                $$1274$be = $120;
              }
              $$1271 = $$1271$be;
              $$1274 = $$1274$be;
            }
            if ($6 >>> 0 > $$1274 >>> 0) _abort();
            else {
              HEAP32[$$1274 >> 2] = 0;
              $$3 = $$1271;
              break;
            }
          } else {
            $106 = HEAP32[($5 + 8) >> 2] | 0;
            if ($6 >>> 0 > $106 >>> 0) _abort();
            $108 = ($106 + 12) | 0;
            if ((HEAP32[$108 >> 2] | 0) != ($5 | 0)) _abort();
            $111 = ($103 + 8) | 0;
            if ((HEAP32[$111 >> 2] | 0) == ($5 | 0)) {
              HEAP32[$108 >> 2] = $103;
              HEAP32[$111 >> 2] = $106;
              $$3 = $103;
              break;
            } else _abort();
          }
        } while (0);
        if ($101 | 0) {
          $129 = HEAP32[($5 + 28) >> 2] | 0;
          $130 = (3184 + ($129 << 2)) | 0;
          do {
            if ((HEAP32[$130 >> 2] | 0) == ($5 | 0)) {
              HEAP32[$130 >> 2] = $$3;
              if (!$$3) {
                HEAP32[721] = HEAP32[721] & ~(1 << $129);
                break L49;
              }
            } else if ((HEAP32[724] | 0) >>> 0 > $101 >>> 0) _abort();
            else {
              $139 = ($101 + 16) | 0;
              HEAP32[
                ((HEAP32[$139 >> 2] | 0) == ($5 | 0)
                  ? $139
                  : ($101 + 20) | 0) >> 2
              ] = $$3;
              if (!$$3) break L49;
              else break;
            }
          } while (0);
          $144 = HEAP32[724] | 0;
          if ($144 >>> 0 > $$3 >>> 0) _abort();
          HEAP32[($$3 + 24) >> 2] = $101;
          $147 = ($5 + 16) | 0;
          $148 = HEAP32[$147 >> 2] | 0;
          do {
            if ($148 | 0)
              if ($144 >>> 0 > $148 >>> 0) _abort();
              else {
                HEAP32[($$3 + 16) >> 2] = $148;
                HEAP32[($148 + 24) >> 2] = $$3;
                break;
              }
          } while (0);
          $154 = HEAP32[($147 + 4) >> 2] | 0;
          if ($154 | 0)
            if ((HEAP32[724] | 0) >>> 0 > $154 >>> 0) _abort();
            else {
              HEAP32[($$3 + 20) >> 2] = $154;
              HEAP32[($154 + 24) >> 2] = $$3;
              break;
            }
        }
      }
    } while (0);
    if ($75 >>> 0 < 16) {
      HEAP32[$2 >> 2] = ($3 & 1) | $73 | 2;
      $165 = ($0 + $73 + 4) | 0;
      HEAP32[$165 >> 2] = HEAP32[$165 >> 2] | 1;
      $$2 = $0;
      return $$2 | 0;
    } else {
      $168 = ($0 + $1) | 0;
      HEAP32[$2 >> 2] = ($3 & 1) | $1 | 2;
      HEAP32[($168 + 4) >> 2] = $75 | 3;
      $175 = ($0 + $73 + 4) | 0;
      HEAP32[$175 >> 2] = HEAP32[$175 >> 2] | 1;
      _dispose_chunk($168, $75);
      $$2 = $0;
      return $$2 | 0;
    }
    return 0;
  }
  function _stb_vorbis_js_decode($0, $1, $2, $3, $4) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    var $$0 = 0,
      $$0103143 = 0,
      $$0105 = 0,
      $$0109 = 0,
      $$0112161 = 0,
      $$0118 = 0,
      $$0121160 = 0,
      $$095148 = 0,
      $$096152 = 0,
      $$097163 = 0,
      $$098145 = 0,
      $$099162 = 0,
      $$1 = 0,
      $$1100 = 0,
      $$1106 = 0,
      $$1113 = 0,
      $$2107 = 0,
      $$2107171 = 0,
      $$2123 = 0,
      $$3 = 0,
      $$3102 = 0,
      $$3115 = 0,
      $$4 = 0,
      $$4116 = 0,
      $$lcssa = 0,
      $$pre = 0,
      $13 = 0,
      $15 = 0,
      $20 = 0,
      $21 = 0,
      $24 = 0,
      $26 = 0,
      $30 = 0,
      $31 = 0,
      $36 = 0,
      $41 = 0,
      $42 = 0,
      $43 = 0,
      $44 = 0,
      $48 = 0,
      $5 = 0,
      $52 = 0,
      $53 = 0,
      $55 = 0,
      $58 = 0,
      $6 = 0,
      $60 = 0,
      $62 = 0,
      $64 = 0,
      $65 = 0,
      $67 = 0,
      $69 = 0,
      $7 = 0,
      $73 = 0,
      $79 = 0,
      $80 = 0,
      $9 = 0,
      $spec$select = 0,
      $spec$select124142 = 0,
      $spec$select124144 = 0,
      label = 0,
      sp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 16) | 0;
    $5 = (sp + 4) | 0;
    $6 = sp;
    HEAP32[$4 >> 2] = 0;
    $7 = HEAP32[$0 >> 2] | 0;
    L1: do {
      if (!$7) {
        $$0112161 = $2;
        $$0121160 = 32;
        $$097163 = 0;
        $$099162 = $1;
        L3: while (1) {
          HEAP32[$5 >> 2] = 0;
          HEAP32[$6 >> 2] = 0;
          $spec$select =
            ($$0121160 | 0) > ($$0112161 | 0) ? $$0112161 : $$0121160;
          $9 = _stb_vorbis_open_pushdata($$099162, $spec$select, $5, $6, 0) | 0;
          HEAP32[$0 >> 2] = $9;
          switch (HEAP32[$6 >> 2] | 0) {
            case 1: {
              $13 = ($$0112161 | 0) <= ($$0121160 | 0);
              $$0118 = $13 ? 1 : 2;
              $$1 = $13 ? 0 : $$097163;
              $$1100 = $$099162;
              $$1113 = $$0112161;
              $$2123 = $spec$select << (($13 ^ 1) & 1);
              break;
            }
            case 0: {
              $15 = HEAP32[$5 >> 2] | 0;
              HEAP32[$4 >> 2] = (HEAP32[$4 >> 2] | 0) + $15;
              $$0118 = 0;
              $$1 = $$097163;
              $$1100 = ($$099162 + $15) | 0;
              $$1113 = ($$0112161 - $15) | 0;
              $$2123 = $spec$select;
              break;
            }
            default: {
              $$0118 = 1;
              $$1 = -1;
              $$1100 = $$099162;
              $$1113 = $$0112161;
              $$2123 = $spec$select;
            }
          }
          switch ($$0118 & 3) {
            case 2:
            case 0:
              break;
            default:
              break L3;
          }
          if (!$9) {
            $$0112161 = $$1113;
            $$0121160 = $$2123;
            $$097163 = $$1;
            $$099162 = $$1100;
          } else {
            $$3102 = $$1100;
            $$3115 = $$1113;
            $21 = $9;
            label = 9;
            break L1;
          }
        }
        if (!$$0118) {
          $$3102 = $$1100;
          $$3115 = $$1113;
          $21 = $9;
          label = 9;
        } else $$3 = $$1;
      } else {
        $$3102 = $1;
        $$3115 = $2;
        $21 = $7;
        label = 9;
      }
    } while (0);
    do {
      if ((label | 0) == 9) {
        $20 = ($21 + 4) | 0;
        $24 = _malloc(HEAP32[$20 >> 2] << 2) | 0;
        if (!$24) _abort();
        $26 = HEAP32[$20 >> 2] | 0;
        if (($26 | 0) > 0) _memset($24 | 0, 0, ($26 << 2) | 0) | 0;
        $$0105 = 0;
        $$0109 = 0;
        $$4 = $$3102;
        $$4116 = $$3115;
        $30 = $21;
        L19: while (1) {
          HEAP32[$5 >> 2] = 0;
          HEAP32[$6 >> 2] = 0;
          $spec$select124142 = ($$4116 | 0) < 32 ? $$4116 : 32;
          $31 =
            _stb_vorbis_decode_frame_pushdata(
              $30,
              $$4,
              $spec$select124142,
              0,
              $5,
              $6
            ) | 0;
          if (!$31) {
            $$0103143 = 32;
            $spec$select124144 = $spec$select124142;
            while (1) {
              if (($$4116 | 0) <= ($$0103143 | 0)) {
                label = 35;
                break L19;
              }
              $$0103143 = $spec$select124144 << 1;
              $spec$select124144 =
                ($$0103143 | 0) > ($$4116 | 0) ? $$4116 : $$0103143;
              $36 =
                _stb_vorbis_decode_frame_pushdata(
                  HEAP32[$0 >> 2] | 0,
                  $$4,
                  $spec$select124144,
                  0,
                  $5,
                  $6
                ) | 0;
              if ($36 | 0) {
                $$lcssa = $36;
                break;
              }
            }
          } else $$lcssa = $31;
          HEAP32[$4 >> 2] = (HEAP32[$4 >> 2] | 0) + $$lcssa;
          $41 = ($$4 + $$lcssa) | 0;
          $42 = ($$4116 - $$lcssa) | 0;
          $43 = HEAP32[$6 >> 2] | 0;
          $44 = ($43 + $$0109) | 0;
          if (($$0105 | 0) < ($44 | 0)) {
            $$1106 = ($$0105 | 0) == 0 ? 4096 : $$0105 << 1;
            $48 = HEAP32[$0 >> 2] | 0;
            if ((HEAP32[($48 + 4) >> 2] | 0) > 0) {
              $52 = $$1106 << 2;
              $$098145 = 0;
              while (1) {
                $53 = ($24 + ($$098145 << 2)) | 0;
                $55 = _realloc(HEAP32[$53 >> 2] | 0, $52) | 0;
                if (!$55) {
                  label = 23;
                  break L19;
                }
                HEAP32[$53 >> 2] = $55;
                $$098145 = ($$098145 + 1) | 0;
                $58 = HEAP32[$0 >> 2] | 0;
                $60 = HEAP32[($58 + 4) >> 2] | 0;
                if (($$098145 | 0) >= ($60 | 0)) {
                  $$2107 = $$1106;
                  $62 = $60;
                  $79 = $58;
                  label = 25;
                  break;
                }
              }
            } else {
              $$2107171 = $$1106;
              $80 = $48;
            }
          } else {
            $$pre = HEAP32[$0 >> 2] | 0;
            $$2107 = $$0105;
            $62 = HEAP32[($$pre + 4) >> 2] | 0;
            $79 = $$pre;
            label = 25;
          }
          if ((label | 0) == 25) {
            label = 0;
            if (($62 | 0) > 0) {
              $64 = ($43 | 0) > 0;
              $65 = HEAP32[$5 >> 2] | 0;
              $$096152 = 0;
              do {
                if ($64) {
                  $67 = HEAP32[($65 + ($$096152 << 2)) >> 2] | 0;
                  $69 = HEAP32[($24 + ($$096152 << 2)) >> 2] | 0;
                  $$095148 = 0;
                  do {
                    $73 = +HEAPF32[($67 + ($$095148 << 2)) >> 2];
                    if ($73 > 1) $$0 = 1;
                    else if ($73 < -1) $$0 = -1;
                    else $$0 = $73;
                    HEAPF32[($69 + (($$095148 + $$0109) << 2)) >> 2] = $$0;
                    $$095148 = ($$095148 + 1) | 0;
                  } while (($$095148 | 0) != ($43 | 0));
                }
                $$096152 = ($$096152 + 1) | 0;
              } while (($$096152 | 0) < ($62 | 0));
              $$2107171 = $$2107;
              $80 = $79;
            } else {
              $$2107171 = $$2107;
              $80 = $79;
            }
          }
          $$0105 = $$2107171;
          $$0109 = $44;
          $$4 = $41;
          $$4116 = $42;
          $30 = $80;
        }
        if ((label | 0) == 23) _abort();
        else if ((label | 0) == 35) {
          HEAP32[$3 >> 2] = $24;
          $$3 = $$0109;
          break;
        }
      }
    } while (0);
    STACKTOP = sp;
    return $$3 | 0;
  }
  function _vorbis_search_for_page_pushdata($0, $1, $2) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    var $$0148175 = 0,
      $$0149$lcssa = 0,
      $$0149174 = 0,
      $$0150185 = 0,
      $$0152$lcssa = 0,
      $$0152179 = 0,
      $$0153178 = 0,
      $$0161204 = 0,
      $$1151187 = 0,
      $$1154184 = 0,
      $$1162193 = 0,
      $$2 = 0,
      $$2155186 = 0,
      $$2163176 = 0,
      $$3$ph = 0,
      $$3222 = 0,
      $$4165$ph = 0,
      $$pre = 0,
      $$sink = 0,
      $102 = 0,
      $104 = 0,
      $105 = 0,
      $106 = 0,
      $107 = 0,
      $109 = 0,
      $11 = 0,
      $110 = 0,
      $115 = 0,
      $118 = 0,
      $12 = 0,
      $122 = 0,
      $123 = 0,
      $124 = 0,
      $130 = 0,
      $136 = 0,
      $137 = 0,
      $17 = 0,
      $19 = 0,
      $20 = 0,
      $21 = 0,
      $22 = 0,
      $25 = 0,
      $3 = 0,
      $31 = 0,
      $4 = 0,
      $40 = 0,
      $41 = 0,
      $spec$select = 0,
      label = 0;
    $3 = ($0 + 1408) | 0;
    $4 = HEAP32[$3 >> 2] | 0;
    if (($4 | 0) > 0) {
      $$0161204 = 0;
      do {
        HEAP32[($0 + 1412 + (($$0161204 * 20) | 0) + 12) >> 2] = 0;
        $$0161204 = ($$0161204 + 1) | 0;
      } while (($$0161204 | 0) < ($4 | 0));
      if (($4 | 0) < 4) label = 5;
      else {
        $$3222 = $2;
        $137 = $4;
        label = 23;
      }
    } else label = 5;
    if ((label | 0) == 5)
      if (($2 | 0) < 4) $$2 = 0;
      else {
        $11 = ($2 + -3) | 0;
        $$1162193 = 0;
        while (1) {
          $12 = ($1 + $$1162193) | 0;
          if ((HEAP8[$12 >> 0] | 0) == 79)
            if (!(_memcmp($12, 1072, 4) | 0)) {
              $17 = ($$1162193 + 26) | 0;
              if (($17 | 0) >= ($11 | 0)) {
                $$3$ph = $$1162193;
                break;
              }
              $19 = ($$1162193 + 27) | 0;
              $20 = ($1 + $17) | 0;
              $21 = HEAP8[$20 >> 0] | 0;
              $22 = $21 & 255;
              if ((($19 + $22) | 0) >= ($11 | 0)) {
                $$3$ph = $$1162193;
                break;
              }
              $25 = ($22 + 27) | 0;
              if (!(($21 << 24) >> 24)) $$0152$lcssa = $25;
              else {
                $$0152179 = $25;
                $$0153178 = 0;
                while (1) {
                  $31 =
                    ($$0152179 + (HEAPU8[($1 + ($$0153178 + $19)) >> 0] | 0)) |
                    0;
                  $$0153178 = ($$0153178 + 1) | 0;
                  if (($$0153178 | 0) == ($22 | 0)) {
                    $$0152$lcssa = $31;
                    break;
                  } else $$0152179 = $31;
                }
              }
              $$0150185 = 0;
              $$1154184 = 0;
              do {
                $$0150185 =
                  _crc32_update(
                    $$0150185,
                    HEAP8[($1 + ($$1154184 + $$1162193)) >> 0] | 0
                  ) | 0;
                $$1154184 = ($$1154184 + 1) | 0;
              } while (($$1154184 | 0) != 22);
              $$1151187 = $$0150185;
              $$2155186 = 22;
              do {
                $$1151187 = _crc32_update($$1151187, 0) | 0;
                $$2155186 = ($$2155186 + 1) | 0;
              } while (($$2155186 | 0) != 26);
              $40 = HEAP32[$3 >> 2] | 0;
              $41 = ($40 + 1) | 0;
              HEAP32[$3 >> 2] = $41;
              HEAP32[($0 + 1412 + (($40 * 20) | 0) + 4) >> 2] =
                $$0152$lcssa + -26;
              HEAP32[($0 + 1412 + (($40 * 20) | 0) + 8) >> 2] = $$1151187;
              HEAP32[($0 + 1412 + (($40 * 20) | 0)) >> 2] =
                (HEAPU8[($1 + ($$1162193 + 23)) >> 0] << 8) |
                HEAPU8[($1 + ($$1162193 + 22)) >> 0] |
                (HEAPU8[($1 + ($$1162193 + 24)) >> 0] << 16) |
                (HEAPU8[($1 + ($$1162193 + 25)) >> 0] << 24);
              if ((HEAP8[($1 + ($17 + (HEAPU8[$20 >> 0] | 0))) >> 0] | 0) == -1)
                $$sink = -1;
              else
                $$sink =
                  (HEAPU8[($1 + ($$1162193 + 7)) >> 0] << 8) |
                  HEAPU8[($1 + ($$1162193 + 6)) >> 0] |
                  (HEAPU8[($1 + ($$1162193 + 8)) >> 0] << 16) |
                  (HEAPU8[($1 + ($$1162193 + 9)) >> 0] << 24);
              HEAP32[($0 + 1412 + (($40 * 20) | 0) + 16) >> 2] = $$sink;
              HEAP32[($0 + 1412 + (($40 * 20) | 0) + 12) >> 2] = $17;
              if (($41 | 0) == 4) {
                $$3$ph = $11;
                break;
              }
            }
          $$1162193 = ($$1162193 + 1) | 0;
          if (($$1162193 | 0) >= ($11 | 0)) {
            $$3$ph = $11;
            break;
          }
        }
        $$pre = HEAP32[$3 >> 2] | 0;
        if (($$pre | 0) > 0) {
          $$3222 = $$3$ph;
          $137 = $$pre;
          label = 23;
        } else $$2 = $$3$ph;
      }
    L32: do {
      if ((label | 0) == 23) {
        $$2163176 = 0;
        $123 = $137;
        while (1) {
          $102 = ($0 + 1412 + (($$2163176 * 20) | 0)) | 0;
          $104 = HEAP32[($0 + 1412 + (($$2163176 * 20) | 0) + 12) >> 2] | 0;
          $105 = ($0 + 1412 + (($$2163176 * 20) | 0) + 4) | 0;
          $106 = HEAP32[$105 >> 2] | 0;
          $107 = ($$3222 - $104) | 0;
          $spec$select = ($106 | 0) > ($107 | 0) ? $107 : $106;
          $109 = ($0 + 1412 + (($$2163176 * 20) | 0) + 8) | 0;
          $110 = HEAP32[$109 >> 2] | 0;
          if (($spec$select | 0) > 0) {
            $$0148175 = 0;
            $$0149174 = $110;
            while (1) {
              $115 =
                _crc32_update(
                  $$0149174,
                  HEAP8[($1 + ($$0148175 + $104)) >> 0] | 0
                ) | 0;
              $$0148175 = ($$0148175 + 1) | 0;
              if (($$0148175 | 0) >= ($spec$select | 0)) {
                $$0149$lcssa = $115;
                break;
              } else $$0149174 = $115;
            }
          } else $$0149$lcssa = $110;
          $118 = ($106 - $spec$select) | 0;
          HEAP32[$105 >> 2] = $118;
          HEAP32[$109 >> 2] = $$0149$lcssa;
          if (!$118) {
            if (($$0149$lcssa | 0) == (HEAP32[$102 >> 2] | 0)) break;
            $122 = ($123 + -1) | 0;
            HEAP32[$3 >> 2] = $122;
            $124 = ($0 + 1412 + (($122 * 20) | 0)) | 0;
            HEAP32[$102 >> 2] = HEAP32[$124 >> 2];
            HEAP32[($102 + 4) >> 2] = HEAP32[($124 + 4) >> 2];
            HEAP32[($102 + 8) >> 2] = HEAP32[($124 + 8) >> 2];
            HEAP32[($102 + 12) >> 2] = HEAP32[($124 + 12) >> 2];
            HEAP32[($102 + 16) >> 2] = HEAP32[($124 + 16) >> 2];
            $$4165$ph = $$2163176;
            $136 = HEAP32[$3 >> 2] | 0;
          } else {
            $$4165$ph = ($$2163176 + 1) | 0;
            $136 = $123;
          }
          if (($$4165$ph | 0) < ($136 | 0)) {
            $$2163176 = $$4165$ph;
            $123 = $136;
          } else {
            $$2 = $$3222;
            break L32;
          }
        }
        HEAP32[$3 >> 2] = -1;
        HEAP32[($0 + 980) >> 2] = 0;
        HEAP32[($0 + 1368) >> 2] = -1;
        $130 = HEAP32[($0 + 1412 + (($$2163176 * 20) | 0) + 16) >> 2] | 0;
        HEAP32[($0 + 1048) >> 2] = $130;
        HEAP32[($0 + 1052) >> 2] = (($130 | 0) != -1) & 1;
        $$2 = ($spec$select + $104) | 0;
      }
    } while (0);
    return $$2 | 0;
  }
  function _codebook_decode_deinterleave_repeat(
    $0,
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
  ) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    $6 = $6 | 0;
    $7 = $7 | 0;
    var $$0100145 = 0,
      $$0102$lcssa = 0,
      $$0102144 = 0,
      $$0105133 = 0,
      $$0107143 = 0,
      $$0112132 = 0,
      $$0114$lcssa = 0,
      $$0114142 = 0,
      $$1103134 = 0,
      $$1111 = 0,
      $$1113137 = 0,
      $$1115131 = 0,
      $$2 = 0,
      $$3117136 = 0,
      $$3138 = 0,
      $$5 = 0,
      $$5119 = 0,
      $11 = 0,
      $12 = 0,
      $15 = 0,
      $16 = 0,
      $17 = 0,
      $18 = 0,
      $19 = 0,
      $20 = 0,
      $21 = 0,
      $22 = 0,
      $25 = 0,
      $28 = 0,
      $29 = 0,
      $34 = 0,
      $37 = 0,
      $38 = 0,
      $51 = 0,
      $58 = 0,
      $61 = 0,
      $62 = 0,
      $68 = 0,
      $70 = 0,
      $73 = 0,
      $74 = 0,
      $78 = 0,
      $85 = 0,
      $88 = 0,
      $89 = 0,
      $spec$select122 = 0,
      $spec$select123 = 0,
      $spec$select124 = 0,
      $spec$select125 = 0,
      label = 0;
    L1: do {
      if (!(HEAP8[($1 + 21) >> 0] | 0)) {
        _error($0, 21);
        $$2 = 0;
      } else {
        $11 = HEAP32[$5 >> 2] | 0;
        $12 = HEAP32[$4 >> 2] | 0;
        L4: do {
          if (($7 | 0) > 0) {
            $15 = ($0 + 1384) | 0;
            $16 = ($0 + 1380) | 0;
            $17 = ($1 + 8) | 0;
            $18 = ($1 + 23) | 0;
            $19 = ($1 + 2092) | 0;
            $20 = Math_imul($6, $3) | 0;
            $21 = ($1 + 22) | 0;
            $22 = ($1 + 28) | 0;
            $$0100145 = $7;
            $$0102144 = $12;
            $$0107143 = HEAP32[$1 >> 2] | 0;
            $$0114142 = $11;
            while (1) {
              if ((HEAP32[$15 >> 2] | 0) < 10) _prep_huffman($0);
              $25 = HEAP32[$16 >> 2] | 0;
              $28 = HEAP16[($1 + 36 + (($25 & 1023) << 1)) >> 1] | 0;
              $29 = ($28 << 16) >> 16;
              if (($28 << 16) >> 16 > -1) {
                $34 = HEAPU8[((HEAP32[$17 >> 2] | 0) + $29) >> 0] | 0;
                HEAP32[$16 >> 2] = $25 >>> $34;
                $37 = ((HEAP32[$15 >> 2] | 0) - $34) | 0;
                $38 = ($37 | 0) < 0;
                HEAP32[$15 >> 2] = $38 ? 0 : $37;
                $$1111 = $38 ? -1 : $29;
              } else $$1111 = _codebook_decode_scalar_raw($0, $1) | 0;
              if (HEAP8[$18 >> 0] | 0)
                if (($$1111 | 0) >= (HEAP32[$19 >> 2] | 0)) {
                  label = 12;
                  break;
                }
              if (($$1111 | 0) < 0) break;
              $51 = Math_imul($$0114142, $3) | 0;
              $$0107143 =
                (($$0107143 + $51 + $$0102144) | 0) > ($20 | 0)
                  ? ($20 - $51 + $$0102144) | 0
                  : $$0107143;
              $58 = Math_imul(HEAP32[$1 >> 2] | 0, $$1111) | 0;
              $61 = ($$0107143 | 0) > 0;
              if (!(HEAP8[$21 >> 0] | 0))
                if ($61) {
                  $$1113137 = 0;
                  $$3117136 = $$0114142;
                  $$3138 = $$0102144;
                  while (1) {
                    $78 = HEAP32[($2 + ($$3138 << 2)) >> 2] | 0;
                    if ($78 | 0) {
                      $85 = ($78 + ($$3117136 << 2)) | 0;
                      HEAPF32[$85 >> 2] =
                        +HEAPF32[$85 >> 2] +
                        (+HEAPF32[
                          ((HEAP32[$22 >> 2] | 0) + (($$1113137 + $58) << 2)) >>
                            2
                        ] +
                          0);
                    }
                    $88 = ($$3138 + 1) | 0;
                    $89 = ($88 | 0) == ($3 | 0);
                    $spec$select124 = ($$3117136 + ($89 & 1)) | 0;
                    $spec$select125 = $89 ? 0 : $88;
                    $$1113137 = ($$1113137 + 1) | 0;
                    if (($$1113137 | 0) == ($$0107143 | 0)) {
                      $$5 = $spec$select125;
                      $$5119 = $spec$select124;
                      break;
                    } else {
                      $$3117136 = $spec$select124;
                      $$3138 = $spec$select125;
                    }
                  }
                } else {
                  $$5 = $$0102144;
                  $$5119 = $$0114142;
                }
              else if ($61) {
                $62 = HEAP32[$22 >> 2] | 0;
                $$0105133 = 0;
                $$0112132 = 0;
                $$1103134 = $$0102144;
                $$1115131 = $$0114142;
                while (1) {
                  $$0105133 =
                    $$0105133 + +HEAPF32[($62 + (($$0112132 + $58) << 2)) >> 2];
                  $68 = HEAP32[($2 + ($$1103134 << 2)) >> 2] | 0;
                  $70 = ($68 + ($$1115131 << 2)) | 0;
                  if ($68 | 0)
                    HEAPF32[$70 >> 2] = $$0105133 + +HEAPF32[$70 >> 2];
                  $73 = ($$1103134 + 1) | 0;
                  $74 = ($73 | 0) == ($3 | 0);
                  $spec$select122 = ($$1115131 + ($74 & 1)) | 0;
                  $spec$select123 = $74 ? 0 : $73;
                  $$0112132 = ($$0112132 + 1) | 0;
                  if (($$0112132 | 0) == ($$0107143 | 0)) {
                    $$5 = $spec$select123;
                    $$5119 = $spec$select122;
                    break;
                  } else {
                    $$1103134 = $spec$select123;
                    $$1115131 = $spec$select122;
                  }
                }
              } else {
                $$5 = $$0102144;
                $$5119 = $$0114142;
              }
              $$0100145 = ($$0100145 - $$0107143) | 0;
              if (($$0100145 | 0) <= 0) {
                $$0102$lcssa = $$5;
                $$0114$lcssa = $$5119;
                break L4;
              } else {
                $$0102144 = $$5;
                $$0114142 = $$5119;
              }
            }
            if ((label | 0) == 12) ___assert_fail(1303, 1076, 1824, 1339);
            if (!(HEAP8[($0 + 1364) >> 0] | 0))
              if (HEAP32[($0 + 1372) >> 2] | 0) {
                $$2 = 0;
                break L1;
              }
            _error($0, 21);
            $$2 = 0;
            break L1;
          } else {
            $$0102$lcssa = $12;
            $$0114$lcssa = $11;
          }
        } while (0);
        HEAP32[$4 >> 2] = $$0102$lcssa;
        HEAP32[$5 >> 2] = $$0114$lcssa;
        $$2 = 1;
      }
    } while (0);
    return $$2 | 0;
  }
  function _is_whole_packet_present($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$068$lcssa = 0,
      $$06897 = 0,
      $$07296 = 0,
      $$079111 = 0,
      $$173 = 0,
      $$18092 = 0,
      $$2 = 0,
      $$274112 = 0,
      $$37593 = 0,
      $$4$lcssa = 0,
      $$47686 = 0,
      $$487 = 0,
      $$577 = 0,
      $11 = 0,
      $13 = 0,
      $15 = 0,
      $27 = 0,
      $28 = 0,
      $29 = 0,
      $3 = 0,
      $30 = 0,
      $48 = 0,
      $49 = 0,
      $5 = 0,
      $50 = 0,
      $51 = 0,
      $55 = 0,
      $57 = 0,
      $59 = 0,
      $8 = 0,
      label = 0;
    $3 = HEAP32[($0 + 1368) >> 2] | 0;
    $5 = HEAP32[($0 + 20) >> 2] | 0;
    do {
      if (($3 | 0) == -1) {
        $$079111 = 1;
        $$274112 = $5;
        label = 11;
      } else {
        $8 = HEAP32[($0 + 1104) >> 2] | 0;
        L3: do {
          if (($3 | 0) < ($8 | 0)) {
            $$06897 = $3;
            $$07296 = $5;
            while (1) {
              $11 = HEAP8[($0 + 1108 + $$06897) >> 0] | 0;
              $13 = ($$07296 + ($11 & 255)) | 0;
              if (($11 << 24) >> 24 != -1) {
                $$068$lcssa = $$06897;
                $$173 = $13;
                break L3;
              }
              $15 = ($$06897 + 1) | 0;
              if (($15 | 0) < ($8 | 0)) {
                $$06897 = $15;
                $$07296 = $13;
              } else {
                $$068$lcssa = $15;
                $$173 = $13;
                break;
              }
            }
          } else {
            $$068$lcssa = $3;
            $$173 = $5;
          }
        } while (0);
        if ((($1 | 0) != 0) & (($$068$lcssa | 0) < (($8 + -1) | 0))) {
          _error($0, 21);
          $$2 = 0;
          break;
        }
        if ($$173 >>> 0 > (HEAP32[($0 + 28) >> 2] | 0) >>> 0) {
          _error($0, 1);
          $$2 = 0;
          break;
        } else if (
          (($$068$lcssa | 0) == ($8 | 0)) |
          (($$068$lcssa | 0) == -1)
        ) {
          $$079111 = 0;
          $$274112 = $$173;
          label = 11;
          break;
        } else {
          $$2 = 1;
          break;
        }
      }
    } while (0);
    L15: do {
      if ((label | 0) == 11) {
        $27 = HEAP32[($0 + 28) >> 2] | 0;
        $28 = ($0 + 980) | 0;
        $29 = ($1 | 0) != 0;
        $$18092 = $$079111;
        $$37593 = $$274112;
        while (1) {
          $30 = ($$37593 + 26) | 0;
          if ($30 >>> 0 >= $27 >>> 0) {
            label = 13;
            break;
          }
          if (_memcmp($$37593, 1072, 4) | 0) {
            label = 15;
            break;
          }
          if (HEAP8[($$37593 + 4) >> 0] | 0) {
            label = 17;
            break;
          }
          if (!$$18092) {
            if (!(HEAP8[($$37593 + 5) >> 0] & 1)) {
              label = 23;
              break;
            }
          } else if (HEAP32[$28 >> 2] | 0)
            if (HEAP8[($$37593 + 5) >> 0] & 1) {
              label = 21;
              break;
            }
          $48 = HEAP8[$30 >> 0] | 0;
          $49 = $48 & 255;
          $50 = ($$37593 + 27) | 0;
          $51 = ($50 + $49) | 0;
          if ($51 >>> 0 > $27 >>> 0) {
            label = 25;
            break;
          }
          L28: do {
            if (!(($48 << 24) >> 24)) {
              $$4$lcssa = 0;
              $$577 = $51;
            } else {
              $$47686 = $51;
              $$487 = 0;
              while (1) {
                $55 = HEAP8[($50 + $$487) >> 0] | 0;
                $57 = ($$47686 + ($55 & 255)) | 0;
                if (($55 << 24) >> 24 != -1) {
                  $$4$lcssa = $$487;
                  $$577 = $57;
                  break L28;
                }
                $59 = ($$487 + 1) | 0;
                if ($59 >>> 0 < $49 >>> 0) {
                  $$47686 = $57;
                  $$487 = $59;
                } else {
                  $$4$lcssa = $59;
                  $$577 = $57;
                  break;
                }
              }
            }
          } while (0);
          if ($29 & (($$4$lcssa | 0) < (($49 + -1) | 0))) {
            label = 31;
            break;
          }
          if ($$577 >>> 0 > $27 >>> 0) {
            label = 33;
            break;
          }
          if (($$4$lcssa | 0) == ($49 | 0)) {
            $$18092 = 0;
            $$37593 = $$577;
          } else {
            $$2 = 1;
            break L15;
          }
        }
        if ((label | 0) == 13) {
          _error($0, 1);
          $$2 = 0;
          break;
        } else if ((label | 0) == 15) {
          _error($0, 21);
          $$2 = 0;
          break;
        } else if ((label | 0) == 17) {
          _error($0, 21);
          $$2 = 0;
          break;
        } else if ((label | 0) == 21) {
          _error($0, 21);
          $$2 = 0;
          break;
        } else if ((label | 0) == 23) {
          _error($0, 21);
          $$2 = 0;
          break;
        } else if ((label | 0) == 25) {
          _error($0, 1);
          $$2 = 0;
          break;
        } else if ((label | 0) == 31) {
          _error($0, 21);
          $$2 = 0;
          break;
        } else if ((label | 0) == 33) {
          _error($0, 1);
          $$2 = 0;
          break;
        }
      }
    } while (0);
    return $$2 | 0;
  }
  function _compute_sorted_huffman($0, $1, $2) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    var $$07784 = 0,
      $$079$lcssa = 0,
      $$07983 = 0,
      $$081$lcssa = 0,
      $$08190 = 0,
      $$091 = 0,
      $$180 = 0,
      $$182 = 0,
      $$196 = 0,
      $$285 = 0,
      $$285$sink = 0,
      $$pre$phiZ2D = 0,
      $10 = 0,
      $18 = 0,
      $25 = 0,
      $28 = 0,
      $29 = 0,
      $3 = 0,
      $32 = 0,
      $34 = 0,
      $37 = 0,
      $40 = 0,
      $42 = 0,
      $44 = 0,
      $48 = 0,
      $51 = 0,
      $53 = 0,
      $54 = 0,
      $55 = 0,
      $56 = 0,
      $6 = 0,
      $61 = 0,
      $67 = 0,
      $68 = 0,
      $70 = 0,
      $71 = 0,
      $72 = 0,
      $75 = 0,
      $9 = 0,
      $91 = 0;
    $3 = ($0 + 23) | 0;
    if (!(HEAP8[$3 >> 0] | 0)) {
      $6 = ($0 + 4) | 0;
      if ((HEAP32[$6 >> 2] | 0) > 0) {
        $9 = ($0 + 32) | 0;
        $10 = ($0 + 2084) | 0;
        $$08190 = 0;
        $$091 = 0;
        while (1) {
          if (!(_include_in_sort($0, HEAP8[($1 + $$091) >> 0] | 0) | 0))
            $$182 = $$08190;
          else {
            $18 =
              _bit_reverse(
                HEAP32[((HEAP32[$9 >> 2] | 0) + ($$091 << 2)) >> 2] | 0
              ) | 0;
            HEAP32[((HEAP32[$10 >> 2] | 0) + ($$08190 << 2)) >> 2] = $18;
            $$182 = ($$08190 + 1) | 0;
          }
          $$091 = ($$091 + 1) | 0;
          if (($$091 | 0) >= (HEAP32[$6 >> 2] | 0)) {
            $$081$lcssa = $$182;
            break;
          } else $$08190 = $$182;
        }
      } else $$081$lcssa = 0;
      $25 = ($0 + 2092) | 0;
      if (($$081$lcssa | 0) == (HEAP32[$25 >> 2] | 0)) {
        $$pre$phiZ2D = $25;
        $44 = $$081$lcssa;
      } else ___assert_fail(1647, 1076, 1150, 1670);
    } else {
      $28 = ($0 + 2092) | 0;
      $29 = HEAP32[$28 >> 2] | 0;
      if (($29 | 0) > 0) {
        $32 = HEAP32[($0 + 32) >> 2] | 0;
        $34 = HEAP32[($0 + 2084) >> 2] | 0;
        $$196 = 0;
        do {
          $37 = _bit_reverse(HEAP32[($32 + ($$196 << 2)) >> 2] | 0) | 0;
          HEAP32[($34 + ($$196 << 2)) >> 2] = $37;
          $$196 = ($$196 + 1) | 0;
          $40 = HEAP32[$28 >> 2] | 0;
        } while (($$196 | 0) < ($40 | 0));
        $$pre$phiZ2D = $28;
        $44 = $40;
      } else {
        $$pre$phiZ2D = $28;
        $44 = $29;
      }
    }
    $42 = ($0 + 2084) | 0;
    _qsort(HEAP32[$42 >> 2] | 0, $44, 4, 2);
    HEAP32[((HEAP32[$42 >> 2] | 0) + (HEAP32[$$pre$phiZ2D >> 2] << 2)) >> 2] =
      -1;
    $48 = HEAP8[$3 >> 0] | 0;
    $51 =
      HEAP32[(($48 << 24) >> 24 == 0 ? ($0 + 4) | 0 : $$pre$phiZ2D) >> 2] | 0;
    L17: do {
      if (($51 | 0) > 0) {
        $53 = ($0 + 32) | 0;
        $54 = ($0 + 2088) | 0;
        $55 = ($0 + 8) | 0;
        $$285 = 0;
        $56 = $48;
        L19: while (1) {
          if (!(($56 << 24) >> 24)) $$285$sink = $$285;
          else $$285$sink = HEAP32[($2 + ($$285 << 2)) >> 2] | 0;
          $61 = HEAP8[($1 + $$285$sink) >> 0] | 0;
          do {
            if (_include_in_sort($0, $61) | 0) {
              $67 =
                _bit_reverse(
                  HEAP32[((HEAP32[$53 >> 2] | 0) + ($$285 << 2)) >> 2] | 0
                ) | 0;
              $68 = HEAP32[$$pre$phiZ2D >> 2] | 0;
              $70 = HEAP32[$42 >> 2] | 0;
              if (($68 | 0) > 1) {
                $$07784 = $68;
                $$07983 = 0;
                while (1) {
                  $71 = $$07784 >>> 1;
                  $72 = ($71 + $$07983) | 0;
                  $75 = (HEAP32[($70 + ($72 << 2)) >> 2] | 0) >>> 0 > $67 >>> 0;
                  $$180 = $75 ? $$07983 : $72;
                  $$07784 = $75 ? $71 : ($$07784 - $71) | 0;
                  if (($$07784 | 0) <= 1) {
                    $$079$lcssa = $$180;
                    break;
                  } else $$07983 = $$180;
                }
              } else $$079$lcssa = 0;
              if ((HEAP32[($70 + ($$079$lcssa << 2)) >> 2] | 0) != ($67 | 0))
                break L19;
              if (!(HEAP8[$3 >> 0] | 0)) {
                HEAP32[((HEAP32[$54 >> 2] | 0) + ($$079$lcssa << 2)) >> 2] =
                  $$285;
                break;
              } else {
                HEAP32[((HEAP32[$54 >> 2] | 0) + ($$079$lcssa << 2)) >> 2] =
                  HEAP32[($2 + ($$285 << 2)) >> 2];
                HEAP8[((HEAP32[$55 >> 2] | 0) + $$079$lcssa) >> 0] = $61;
                break;
              }
            }
          } while (0);
          $91 = ($$285 + 1) | 0;
          if (($91 | 0) >= ($51 | 0)) break L17;
          $$285 = $91;
          $56 = HEAP8[$3 >> 0] | 0;
        }
        ___assert_fail(1693, 1076, 1180, 1670);
      }
    } while (0);
    return;
  }
  function _vorbis_deinit($0) {
    $0 = $0 | 0;
    var $$08294 = 0,
      $$099 = 0,
      $$190 = 0,
      $$286 = 0,
      $$385 = 0,
      $$484 = 0,
      $$lcssa = 0,
      $$lcssa83 = 0,
      $1 = 0,
      $10 = 0,
      $13 = 0,
      $2 = 0,
      $20 = 0,
      $29 = 0,
      $32 = 0,
      $35 = 0,
      $36 = 0,
      $38 = 0,
      $4 = 0,
      $42 = 0,
      $51 = 0,
      $55 = 0,
      $58 = 0,
      $62 = 0,
      $63 = 0,
      $65 = 0,
      $69 = 0,
      $7 = 0,
      $74 = 0,
      $75 = 0,
      $8 = 0,
      $9 = 0;
    $1 = ($0 + 384) | 0;
    $2 = HEAP32[$1 >> 2] | 0;
    L1: do {
      if ($2 | 0) {
        $4 = ($0 + 252) | 0;
        if ((HEAP32[$4 >> 2] | 0) > 0) {
          $7 = ($0 + 112) | 0;
          $$099 = 0;
          $9 = $2;
          while (1) {
            $8 = ($9 + (($$099 * 24) | 0) + 16) | 0;
            $10 = HEAP32[$8 >> 2] | 0;
            if ($10 | 0) {
              $13 = ($9 + (($$099 * 24) | 0) + 13) | 0;
              if (
                (HEAP32[
                  ((HEAP32[$7 >> 2] | 0) +
                    (((HEAPU8[$13 >> 0] | 0) * 2096) | 0) +
                    4) >>
                    2
                ] |
                  0) >
                0
              ) {
                $$08294 = 0;
                $20 = $10;
                while (1) {
                  _setup_free($0, HEAP32[($20 + ($$08294 << 2)) >> 2] | 0);
                  $$08294 = ($$08294 + 1) | 0;
                  $29 = HEAP32[$8 >> 2] | 0;
                  if (
                    ($$08294 | 0) >=
                    (HEAP32[
                      ((HEAP32[$7 >> 2] | 0) +
                        (((HEAPU8[$13 >> 0] | 0) * 2096) | 0) +
                        4) >>
                        2
                    ] |
                      0)
                  ) {
                    $$lcssa83 = $29;
                    break;
                  } else $20 = $29;
                }
              } else $$lcssa83 = $10;
              _setup_free($0, $$lcssa83);
            }
            _setup_free($0, HEAP32[($9 + (($$099 * 24) | 0) + 20) >> 2] | 0);
            $32 = ($$099 + 1) | 0;
            if (($32 | 0) >= (HEAP32[$4 >> 2] | 0)) break L1;
            $$099 = $32;
            $9 = HEAP32[$1 >> 2] | 0;
          }
        }
      }
    } while (0);
    $35 = ($0 + 112) | 0;
    $36 = HEAP32[$35 >> 2] | 0;
    if ($36 | 0) {
      $38 = ($0 + 108) | 0;
      if ((HEAP32[$38 >> 2] | 0) > 0) {
        $$190 = 0;
        $42 = $36;
        while (1) {
          _setup_free($0, HEAP32[($42 + (($$190 * 2096) | 0) + 8) >> 2] | 0);
          _setup_free($0, HEAP32[($42 + (($$190 * 2096) | 0) + 28) >> 2] | 0);
          _setup_free($0, HEAP32[($42 + (($$190 * 2096) | 0) + 32) >> 2] | 0);
          _setup_free($0, HEAP32[($42 + (($$190 * 2096) | 0) + 2084) >> 2] | 0);
          $51 = HEAP32[($42 + (($$190 * 2096) | 0) + 2088) >> 2] | 0;
          _setup_free($0, ($51 | 0) == 0 ? 0 : ($51 + -4) | 0);
          $55 = ($$190 + 1) | 0;
          if (($55 | 0) >= (HEAP32[$38 >> 2] | 0)) break;
          $$190 = $55;
          $42 = HEAP32[$35 >> 2] | 0;
        }
        $58 = HEAP32[$35 >> 2] | 0;
      } else $58 = $36;
      _setup_free($0, $58);
    }
    _setup_free($0, HEAP32[($0 + 248) >> 2] | 0);
    _setup_free($0, HEAP32[$1 >> 2] | 0);
    $62 = ($0 + 392) | 0;
    $63 = HEAP32[$62 >> 2] | 0;
    if ($63 | 0) {
      $65 = ($0 + 388) | 0;
      if ((HEAP32[$65 >> 2] | 0) > 0) {
        $$286 = 0;
        $69 = $63;
        while (1) {
          _setup_free($0, HEAP32[($69 + (($$286 * 40) | 0) + 4) >> 2] | 0);
          $$286 = ($$286 + 1) | 0;
          $74 = HEAP32[$62 >> 2] | 0;
          if (($$286 | 0) >= (HEAP32[$65 >> 2] | 0)) {
            $$lcssa = $74;
            break;
          } else $69 = $74;
        }
      } else $$lcssa = $63;
      _setup_free($0, $$lcssa);
    }
    $75 = ($0 + 4) | 0;
    if ((HEAP32[$75 >> 2] | 0) > 0) {
      $$385 = 0;
      do {
        _setup_free($0, HEAP32[($0 + 788 + ($$385 << 2)) >> 2] | 0);
        _setup_free($0, HEAP32[($0 + 916 + ($$385 << 2)) >> 2] | 0);
        _setup_free($0, HEAP32[($0 + 984 + ($$385 << 2)) >> 2] | 0);
        $$385 = ($$385 + 1) | 0;
      } while ($$385 >>> 0 < 16 ? ($$385 | 0) < (HEAP32[$75 >> 2] | 0) : 0);
    }
    $$484 = 0;
    do {
      _setup_free($0, HEAP32[($0 + 1056 + ($$484 << 2)) >> 2] | 0);
      _setup_free($0, HEAP32[($0 + 1064 + ($$484 << 2)) >> 2] | 0);
      _setup_free($0, HEAP32[($0 + 1072 + ($$484 << 2)) >> 2] | 0);
      _setup_free($0, HEAP32[($0 + 1080 + ($$484 << 2)) >> 2] | 0);
      _setup_free($0, HEAP32[($0 + 1088 + ($$484 << 2)) >> 2] | 0);
      $$484 = ($$484 + 1) | 0;
    } while (($$484 | 0) != 2);
    return;
  }
  function _compute_codewords($0, $1, $2, $3) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    var $$06981 = 0,
      $$07286 = 0,
      $$074$lcssa = 0,
      $$07491 = 0,
      $$07589 = 0,
      $$083 = 0,
      $$173$ph = 0,
      $$17685 = 0,
      $$17687 = 0,
      $$2 = 0,
      $15 = 0,
      $18 = 0,
      $20 = 0,
      $27 = 0,
      $28 = 0,
      $30 = 0,
      $32 = 0,
      $33 = 0,
      $39 = 0,
      $4 = 0,
      $40 = 0,
      $41 = 0,
      $45 = 0,
      $9 = 0,
      dest = 0,
      label = 0,
      sp = 0,
      stop = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 128) | 0;
    $4 = sp;
    dest = $4;
    stop = (dest + 128) | 0;
    do {
      HEAP32[dest >> 2] = 0;
      dest = (dest + 4) | 0;
    } while ((dest | 0) < (stop | 0));
    L1: do {
      if (($2 | 0) > 0) {
        $$07491 = 0;
        while (1) {
          if ((HEAP8[($1 + $$07491) >> 0] | 0) != -1) {
            $$074$lcssa = $$07491;
            break L1;
          }
          $9 = ($$07491 + 1) | 0;
          if (($9 | 0) < ($2 | 0)) $$07491 = $9;
          else {
            $$074$lcssa = $9;
            break;
          }
        }
      } else $$074$lcssa = 0;
    } while (0);
    L7: do {
      if (($$074$lcssa | 0) == ($2 | 0))
        if (!(HEAP32[($0 + 2092) >> 2] | 0)) $$2 = 1;
        else ___assert_fail(1544, 1076, 1053, 1567);
      else {
        $15 = ($1 + $$074$lcssa) | 0;
        _add_entry($0, 0, $$074$lcssa, 0, HEAPU8[$15 >> 0] | 0, $3);
        $18 = HEAP8[$15 >> 0] | 0;
        if (($18 << 24) >> 24) {
          $20 = $18 & 255;
          $$07589 = 1;
          while (1) {
            HEAP32[($4 + ($$07589 << 2)) >> 2] = 1 << (32 - $$07589);
            if ($$07589 >>> 0 < $20 >>> 0) $$07589 = ($$07589 + 1) | 0;
            else break;
          }
        }
        $$17685 = ($$074$lcssa + 1) | 0;
        if (($$17685 | 0) < ($2 | 0)) {
          $$07286 = 1;
          $$17687 = $$17685;
          L17: while (1) {
            $27 = ($1 + $$17687) | 0;
            $28 = HEAP8[$27 >> 0] | 0;
            if (($28 << 24) >> 24 == -1) $$173$ph = $$07286;
            else {
              $30 = $28 & 255;
              if (!(($28 << 24) >> 24)) {
                $$2 = 0;
                break L7;
              }
              $$06981 = $30;
              while (1) {
                $32 = ($4 + ($$06981 << 2)) | 0;
                $33 = HEAP32[$32 >> 2] | 0;
                if ($33 | 0) break;
                if (($$06981 | 0) > 1) $$06981 = ($$06981 + -1) | 0;
                else {
                  $$2 = 0;
                  break L7;
                }
              }
              if ($$06981 >>> 0 >= 32) {
                label = 19;
                break;
              }
              HEAP32[$32 >> 2] = 0;
              $39 = ($$07286 + 1) | 0;
              _add_entry($0, _bit_reverse($33) | 0, $$17687, $$07286, $30, $3);
              $40 = HEAP8[$27 >> 0] | 0;
              $41 = $40 & 255;
              if (($$06981 | 0) == ($41 | 0)) $$173$ph = $39;
              else {
                if (($40 & 255) >= 32) {
                  label = 22;
                  break;
                }
                if (($$06981 | 0) < ($41 | 0)) {
                  $$083 = $41;
                  while (1) {
                    $45 = ($4 + ($$083 << 2)) | 0;
                    if (HEAP32[$45 >> 2] | 0) {
                      label = 26;
                      break L17;
                    }
                    HEAP32[$45 >> 2] = (1 << (32 - $$083)) + $33;
                    $$083 = ($$083 + -1) | 0;
                    if (($$083 | 0) <= ($$06981 | 0)) {
                      $$173$ph = $39;
                      break;
                    }
                  }
                } else $$173$ph = $39;
              }
            }
            $$17687 = ($$17687 + 1) | 0;
            if (($$17687 | 0) >= ($2 | 0)) {
              $$2 = 1;
              break L7;
            } else $$07286 = $$173$ph;
          }
          if ((label | 0) == 19) ___assert_fail(1585, 1076, 1076, 1567);
          else if ((label | 0) == 22) ___assert_fail(1602, 1076, 1081, 1567);
          else if ((label | 0) == 26) ___assert_fail(1629, 1076, 1083, 1567);
        } else $$2 = 1;
      }
    } while (0);
    STACKTOP = sp;
    return $$2 | 0;
  }
  function _imdct_step3_iter0_loop($0, $1, $2, $3, $4) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    var $$0100 = 0,
      $$09499 = 0,
      $$09598 = 0,
      $$09697 = 0,
      $11 = 0,
      $12 = 0,
      $13 = 0,
      $14 = 0,
      $15 = 0,
      $16 = 0,
      $18 = 0,
      $24 = 0,
      $33 = 0,
      $34 = 0,
      $35 = 0,
      $36 = 0,
      $37 = 0,
      $38 = 0,
      $39 = 0,
      $40 = 0,
      $41 = 0,
      $43 = 0,
      $49 = 0,
      $5 = 0,
      $58 = 0,
      $59 = 0,
      $60 = 0,
      $61 = 0,
      $62 = 0,
      $63 = 0,
      $64 = 0,
      $65 = 0,
      $66 = 0,
      $68 = 0,
      $74 = 0,
      $83 = 0,
      $84 = 0,
      $85 = 0,
      $86 = 0,
      $87 = 0,
      $88 = 0,
      $89 = 0,
      $90 = 0,
      $91 = 0,
      $93 = 0,
      $99 = 0;
    $5 = ($1 + ($2 << 2)) | 0;
    if (($0 & 3) | 0) ___assert_fail(1419, 1076, 2400, 1432);
    if (($0 | 0) > 3) {
      $$0100 = $4;
      $$09499 = $5;
      $$09598 = $0 >>> 2;
      $$09697 = ($5 + ($3 << 2)) | 0;
      while (1) {
        $11 = +HEAPF32[$$09499 >> 2];
        $12 = +HEAPF32[$$09697 >> 2];
        $13 = $11 - $12;
        $14 = ($$09499 + -4) | 0;
        $15 = +HEAPF32[$14 >> 2];
        $16 = ($$09697 + -4) | 0;
        $18 = $15 - +HEAPF32[$16 >> 2];
        HEAPF32[$$09499 >> 2] = $11 + $12;
        HEAPF32[$14 >> 2] = $15 + +HEAPF32[$16 >> 2];
        $24 = ($$0100 + 4) | 0;
        HEAPF32[$$09697 >> 2] =
          $13 * +HEAPF32[$$0100 >> 2] - $18 * +HEAPF32[$24 >> 2];
        HEAPF32[$16 >> 2] =
          $18 * +HEAPF32[$$0100 >> 2] + $13 * +HEAPF32[$24 >> 2];
        $33 = ($$0100 + 32) | 0;
        $34 = ($$09499 + -8) | 0;
        $35 = +HEAPF32[$34 >> 2];
        $36 = ($$09697 + -8) | 0;
        $37 = +HEAPF32[$36 >> 2];
        $38 = $35 - $37;
        $39 = ($$09499 + -12) | 0;
        $40 = +HEAPF32[$39 >> 2];
        $41 = ($$09697 + -12) | 0;
        $43 = $40 - +HEAPF32[$41 >> 2];
        HEAPF32[$34 >> 2] = $35 + $37;
        HEAPF32[$39 >> 2] = $40 + +HEAPF32[$41 >> 2];
        $49 = ($$0100 + 36) | 0;
        HEAPF32[$36 >> 2] = $38 * +HEAPF32[$33 >> 2] - $43 * +HEAPF32[$49 >> 2];
        HEAPF32[$41 >> 2] = $43 * +HEAPF32[$33 >> 2] + $38 * +HEAPF32[$49 >> 2];
        $58 = ($$0100 + 64) | 0;
        $59 = ($$09499 + -16) | 0;
        $60 = +HEAPF32[$59 >> 2];
        $61 = ($$09697 + -16) | 0;
        $62 = +HEAPF32[$61 >> 2];
        $63 = $60 - $62;
        $64 = ($$09499 + -20) | 0;
        $65 = +HEAPF32[$64 >> 2];
        $66 = ($$09697 + -20) | 0;
        $68 = $65 - +HEAPF32[$66 >> 2];
        HEAPF32[$59 >> 2] = $60 + $62;
        HEAPF32[$64 >> 2] = $65 + +HEAPF32[$66 >> 2];
        $74 = ($$0100 + 68) | 0;
        HEAPF32[$61 >> 2] = $63 * +HEAPF32[$58 >> 2] - $68 * +HEAPF32[$74 >> 2];
        HEAPF32[$66 >> 2] = $68 * +HEAPF32[$58 >> 2] + $63 * +HEAPF32[$74 >> 2];
        $83 = ($$0100 + 96) | 0;
        $84 = ($$09499 + -24) | 0;
        $85 = +HEAPF32[$84 >> 2];
        $86 = ($$09697 + -24) | 0;
        $87 = +HEAPF32[$86 >> 2];
        $88 = $85 - $87;
        $89 = ($$09499 + -28) | 0;
        $90 = +HEAPF32[$89 >> 2];
        $91 = ($$09697 + -28) | 0;
        $93 = $90 - +HEAPF32[$91 >> 2];
        HEAPF32[$84 >> 2] = $85 + $87;
        HEAPF32[$89 >> 2] = $90 + +HEAPF32[$91 >> 2];
        $99 = ($$0100 + 100) | 0;
        HEAPF32[$86 >> 2] = $88 * +HEAPF32[$83 >> 2] - $93 * +HEAPF32[$99 >> 2];
        HEAPF32[$91 >> 2] = $93 * +HEAPF32[$83 >> 2] + $88 * +HEAPF32[$99 >> 2];
        if (($$09598 | 0) > 1) {
          $$0100 = ($$0100 + 128) | 0;
          $$09499 = ($$09499 + -32) | 0;
          $$09598 = ($$09598 + -1) | 0;
          $$09697 = ($$09697 + -32) | 0;
        } else break;
      }
    }
    return;
  }
  function _imdct_step3_inner_r_loop($0, $1, $2, $3, $4, $5) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    var $$0103 = 0,
      $$097102 = 0,
      $$098101 = 0,
      $$099100 = 0,
      $10 = 0,
      $11 = 0,
      $12 = 0,
      $13 = 0,
      $14 = 0,
      $15 = 0,
      $17 = 0,
      $23 = 0,
      $32 = 0,
      $33 = 0,
      $34 = 0,
      $35 = 0,
      $36 = 0,
      $37 = 0,
      $38 = 0,
      $39 = 0,
      $40 = 0,
      $42 = 0,
      $48 = 0,
      $57 = 0,
      $58 = 0,
      $59 = 0,
      $6 = 0,
      $60 = 0,
      $61 = 0,
      $62 = 0,
      $63 = 0,
      $64 = 0,
      $65 = 0,
      $67 = 0,
      $73 = 0,
      $82 = 0,
      $83 = 0,
      $84 = 0,
      $85 = 0,
      $86 = 0,
      $87 = 0,
      $88 = 0,
      $89 = 0,
      $90 = 0,
      $92 = 0,
      $98 = 0;
    $6 = ($1 + ($2 << 2)) | 0;
    if (($0 | 0) > 3) {
      $$0103 = ($6 + ($3 << 2)) | 0;
      $$097102 = $6;
      $$098101 = $4;
      $$099100 = $0 >>> 2;
      while (1) {
        $10 = +HEAPF32[$$097102 >> 2];
        $11 = +HEAPF32[$$0103 >> 2];
        $12 = $10 - $11;
        $13 = ($$097102 + -4) | 0;
        $14 = +HEAPF32[$13 >> 2];
        $15 = ($$0103 + -4) | 0;
        $17 = $14 - +HEAPF32[$15 >> 2];
        HEAPF32[$$097102 >> 2] = $10 + $11;
        HEAPF32[$13 >> 2] = $14 + +HEAPF32[$15 >> 2];
        $23 = ($$098101 + 4) | 0;
        HEAPF32[$$0103 >> 2] =
          $12 * +HEAPF32[$$098101 >> 2] - $17 * +HEAPF32[$23 >> 2];
        HEAPF32[$15 >> 2] =
          $17 * +HEAPF32[$$098101 >> 2] + $12 * +HEAPF32[$23 >> 2];
        $32 = ($$098101 + ($5 << 2)) | 0;
        $33 = ($$097102 + -8) | 0;
        $34 = +HEAPF32[$33 >> 2];
        $35 = ($$0103 + -8) | 0;
        $36 = +HEAPF32[$35 >> 2];
        $37 = $34 - $36;
        $38 = ($$097102 + -12) | 0;
        $39 = +HEAPF32[$38 >> 2];
        $40 = ($$0103 + -12) | 0;
        $42 = $39 - +HEAPF32[$40 >> 2];
        HEAPF32[$33 >> 2] = $34 + $36;
        HEAPF32[$38 >> 2] = $39 + +HEAPF32[$40 >> 2];
        $48 = ($32 + 4) | 0;
        HEAPF32[$35 >> 2] = $37 * +HEAPF32[$32 >> 2] - $42 * +HEAPF32[$48 >> 2];
        HEAPF32[$40 >> 2] = $42 * +HEAPF32[$32 >> 2] + $37 * +HEAPF32[$48 >> 2];
        $57 = ($32 + ($5 << 2)) | 0;
        $58 = ($$097102 + -16) | 0;
        $59 = +HEAPF32[$58 >> 2];
        $60 = ($$0103 + -16) | 0;
        $61 = +HEAPF32[$60 >> 2];
        $62 = $59 - $61;
        $63 = ($$097102 + -20) | 0;
        $64 = +HEAPF32[$63 >> 2];
        $65 = ($$0103 + -20) | 0;
        $67 = $64 - +HEAPF32[$65 >> 2];
        HEAPF32[$58 >> 2] = $59 + $61;
        HEAPF32[$63 >> 2] = $64 + +HEAPF32[$65 >> 2];
        $73 = ($57 + 4) | 0;
        HEAPF32[$60 >> 2] = $62 * +HEAPF32[$57 >> 2] - $67 * +HEAPF32[$73 >> 2];
        HEAPF32[$65 >> 2] = $67 * +HEAPF32[$57 >> 2] + $62 * +HEAPF32[$73 >> 2];
        $82 = ($57 + ($5 << 2)) | 0;
        $83 = ($$097102 + -24) | 0;
        $84 = +HEAPF32[$83 >> 2];
        $85 = ($$0103 + -24) | 0;
        $86 = +HEAPF32[$85 >> 2];
        $87 = $84 - $86;
        $88 = ($$097102 + -28) | 0;
        $89 = +HEAPF32[$88 >> 2];
        $90 = ($$0103 + -28) | 0;
        $92 = $89 - +HEAPF32[$90 >> 2];
        HEAPF32[$83 >> 2] = $84 + $86;
        HEAPF32[$88 >> 2] = $89 + +HEAPF32[$90 >> 2];
        $98 = ($82 + 4) | 0;
        HEAPF32[$85 >> 2] = $87 * +HEAPF32[$82 >> 2] - $92 * +HEAPF32[$98 >> 2];
        HEAPF32[$90 >> 2] = $92 * +HEAPF32[$82 >> 2] + $87 * +HEAPF32[$98 >> 2];
        if (($$099100 | 0) > 1) {
          $$0103 = ($$0103 + -32) | 0;
          $$097102 = ($$097102 + -32) | 0;
          $$098101 = ($82 + ($5 << 2)) | 0;
          $$099100 = ($$099100 + -1) | 0;
        } else break;
      }
    }
    return;
  }
  function _imdct_step3_inner_s_loop($0, $1, $2, $3, $4, $5, $6) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    $6 = $6 | 0;
    var $$0129132 = 0,
      $$0130131 = 0,
      $$0133 = 0,
      $11 = 0,
      $14 = 0,
      $15 = 0,
      $17 = 0,
      $20 = 0,
      $21 = 0,
      $23 = 0,
      $26 = 0,
      $27 = 0,
      $30 = 0,
      $31 = 0,
      $32 = 0,
      $33 = 0,
      $34 = 0,
      $35 = 0,
      $36 = 0,
      $38 = 0,
      $48 = 0,
      $49 = 0,
      $50 = 0,
      $51 = 0,
      $52 = 0,
      $53 = 0,
      $54 = 0,
      $55 = 0,
      $57 = 0,
      $67 = 0,
      $68 = 0,
      $69 = 0,
      $7 = 0,
      $70 = 0,
      $71 = 0,
      $72 = 0,
      $73 = 0,
      $74 = 0,
      $76 = 0,
      $86 = 0,
      $87 = 0,
      $88 = 0,
      $89 = 0,
      $9 = 0,
      $90 = 0,
      $91 = 0,
      $92 = 0,
      $93 = 0,
      $95 = 0;
    $7 = +HEAPF32[$4 >> 2];
    $9 = +HEAPF32[($4 + 4) >> 2];
    $11 = +HEAPF32[($4 + ($5 << 2)) >> 2];
    $14 = +HEAPF32[($4 + (($5 + 1) << 2)) >> 2];
    $15 = $5 << 1;
    $17 = +HEAPF32[($4 + ($15 << 2)) >> 2];
    $20 = +HEAPF32[($4 + (($15 | 1) << 2)) >> 2];
    $21 = ($5 * 3) | 0;
    $23 = +HEAPF32[($4 + ($21 << 2)) >> 2];
    $26 = +HEAPF32[($4 + (($21 + 1) << 2)) >> 2];
    $27 = ($1 + ($2 << 2)) | 0;
    if (($0 | 0) > 0) {
      $30 = (0 - $6) | 0;
      $$0129132 = $27;
      $$0130131 = $0;
      $$0133 = ($27 + ($3 << 2)) | 0;
      while (1) {
        $31 = +HEAPF32[$$0129132 >> 2];
        $32 = +HEAPF32[$$0133 >> 2];
        $33 = $31 - $32;
        $34 = ($$0129132 + -4) | 0;
        $35 = +HEAPF32[$34 >> 2];
        $36 = ($$0133 + -4) | 0;
        $38 = $35 - +HEAPF32[$36 >> 2];
        HEAPF32[$$0129132 >> 2] = $31 + $32;
        HEAPF32[$34 >> 2] = $35 + +HEAPF32[$36 >> 2];
        HEAPF32[$$0133 >> 2] = $7 * $33 - $9 * $38;
        HEAPF32[$36 >> 2] = $9 * $33 + $7 * $38;
        $48 = ($$0129132 + -8) | 0;
        $49 = +HEAPF32[$48 >> 2];
        $50 = ($$0133 + -8) | 0;
        $51 = +HEAPF32[$50 >> 2];
        $52 = $49 - $51;
        $53 = ($$0129132 + -12) | 0;
        $54 = +HEAPF32[$53 >> 2];
        $55 = ($$0133 + -12) | 0;
        $57 = $54 - +HEAPF32[$55 >> 2];
        HEAPF32[$48 >> 2] = $49 + $51;
        HEAPF32[$53 >> 2] = $54 + +HEAPF32[$55 >> 2];
        HEAPF32[$50 >> 2] = $11 * $52 - $14 * $57;
        HEAPF32[$55 >> 2] = $14 * $52 + $11 * $57;
        $67 = ($$0129132 + -16) | 0;
        $68 = +HEAPF32[$67 >> 2];
        $69 = ($$0133 + -16) | 0;
        $70 = +HEAPF32[$69 >> 2];
        $71 = $68 - $70;
        $72 = ($$0129132 + -20) | 0;
        $73 = +HEAPF32[$72 >> 2];
        $74 = ($$0133 + -20) | 0;
        $76 = $73 - +HEAPF32[$74 >> 2];
        HEAPF32[$67 >> 2] = $68 + $70;
        HEAPF32[$72 >> 2] = $73 + +HEAPF32[$74 >> 2];
        HEAPF32[$69 >> 2] = $17 * $71 - $20 * $76;
        HEAPF32[$74 >> 2] = $20 * $71 + $17 * $76;
        $86 = ($$0129132 + -24) | 0;
        $87 = +HEAPF32[$86 >> 2];
        $88 = ($$0133 + -24) | 0;
        $89 = +HEAPF32[$88 >> 2];
        $90 = $87 - $89;
        $91 = ($$0129132 + -28) | 0;
        $92 = +HEAPF32[$91 >> 2];
        $93 = ($$0133 + -28) | 0;
        $95 = $92 - +HEAPF32[$93 >> 2];
        HEAPF32[$86 >> 2] = $87 + $89;
        HEAPF32[$91 >> 2] = $92 + +HEAPF32[$93 >> 2];
        HEAPF32[$88 >> 2] = $23 * $90 - $26 * $95;
        HEAPF32[$93 >> 2] = $26 * $90 + $23 * $95;
        if (($$0130131 | 0) > 1) {
          $$0129132 = ($$0129132 + ($30 << 2)) | 0;
          $$0130131 = ($$0130131 + -1) | 0;
          $$0133 = ($$0133 + ($30 << 2)) | 0;
        } else break;
      }
    }
    return;
  }
  function _qsort($0, $1, $2, $3) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    var $$0 = 0,
      $$067$lcssa = 0,
      $$06772 = 0,
      $$068$lcssa = 0,
      $$06871 = 0,
      $$1 = 0,
      $$169 = 0,
      $$169$be = 0,
      $$2 = 0,
      $$2$be = 0,
      $$be = 0,
      $12 = 0,
      $15 = 0,
      $15$phi = 0,
      $16 = 0,
      $17 = 0,
      $22 = 0,
      $24 = 0,
      $26 = 0,
      $29 = 0,
      $37 = 0,
      $38 = 0,
      $4 = 0,
      $40 = 0,
      $42 = 0,
      $47 = 0,
      $49 = 0,
      $5 = 0,
      $59 = 0,
      $6 = 0,
      $60 = 0,
      $61 = 0,
      $7 = 0,
      label = 0,
      sp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 208) | 0;
    $4 = sp;
    $5 = (sp + 192) | 0;
    $6 = Math_imul($2, $1) | 0;
    $7 = $5;
    HEAP32[$7 >> 2] = 1;
    HEAP32[($7 + 4) >> 2] = 0;
    L1: do {
      if ($6 | 0) {
        $12 = (0 - $2) | 0;
        HEAP32[($4 + 4) >> 2] = $2;
        HEAP32[$4 >> 2] = $2;
        $$0 = 2;
        $15 = $2;
        $17 = $2;
        while (1) {
          $16 = ($15 + $2 + $17) | 0;
          HEAP32[($4 + ($$0 << 2)) >> 2] = $16;
          if ($16 >>> 0 < $6 >>> 0) {
            $15$phi = $17;
            $$0 = ($$0 + 1) | 0;
            $17 = $16;
            $15 = $15$phi;
          } else break;
        }
        $22 = ($0 + $6 + $12) | 0;
        if ($22 >>> 0 > $0 >>> 0) {
          $24 = $22;
          $$06772 = 1;
          $$06871 = $0;
          $26 = 1;
          while (1) {
            do {
              if ((($26 & 3) | 0) == 3) {
                _sift($$06871, $2, $3, $$06772, $4);
                _shr($5, 2);
                $$1 = ($$06772 + 2) | 0;
              } else {
                $29 = ($$06772 + -1) | 0;
                if (
                  (HEAP32[($4 + ($29 << 2)) >> 2] | 0) >>> 0 <
                  (($24 - $$06871) | 0) >>> 0
                )
                  _sift($$06871, $2, $3, $$06772, $4);
                else _trinkle($$06871, $2, $3, $5, $$06772, 0, $4);
                if (($$06772 | 0) == 1) {
                  _shl($5, 1);
                  $$1 = 0;
                  break;
                } else {
                  _shl($5, $29);
                  $$1 = 1;
                  break;
                }
              }
            } while (0);
            $37 = HEAP32[$5 >> 2] | 1;
            HEAP32[$5 >> 2] = $37;
            $38 = ($$06871 + $2) | 0;
            if ($38 >>> 0 < $22 >>> 0) {
              $$06772 = $$1;
              $$06871 = $38;
              $26 = $37;
            } else {
              $$067$lcssa = $$1;
              $$068$lcssa = $38;
              $61 = $37;
              break;
            }
          }
        } else {
          $$067$lcssa = 1;
          $$068$lcssa = $0;
          $61 = 1;
        }
        _trinkle($$068$lcssa, $2, $3, $5, $$067$lcssa, 0, $4);
        $40 = ($5 + 4) | 0;
        $$169 = $$068$lcssa;
        $$2 = $$067$lcssa;
        $42 = $61;
        while (1) {
          if ((($$2 | 0) == 1) & (($42 | 0) == 1))
            if (!(HEAP32[$40 >> 2] | 0)) break L1;
            else label = 19;
          else if (($$2 | 0) < 2) label = 19;
          else {
            _shl($5, 2);
            $49 = ($$2 + -2) | 0;
            HEAP32[$5 >> 2] = HEAP32[$5 >> 2] ^ 7;
            _shr($5, 1);
            _trinkle(
              ($$169 + (0 - (HEAP32[($4 + ($49 << 2)) >> 2] | 0)) + $12) | 0,
              $2,
              $3,
              $5,
              ($$2 + -1) | 0,
              1,
              $4
            );
            _shl($5, 1);
            $59 = HEAP32[$5 >> 2] | 1;
            HEAP32[$5 >> 2] = $59;
            $60 = ($$169 + $12) | 0;
            _trinkle($60, $2, $3, $5, $49, 1, $4);
            $$169$be = $60;
            $$2$be = $49;
            $$be = $59;
          }
          if ((label | 0) == 19) {
            label = 0;
            $47 = _pntz($5) | 0;
            _shr($5, $47);
            $$169$be = ($$169 + $12) | 0;
            $$2$be = ($47 + $$2) | 0;
            $$be = HEAP32[$5 >> 2] | 0;
          }
          $$169 = $$169$be;
          $$2 = $$2$be;
          $42 = $$be;
        }
      }
    } while (0);
    STACKTOP = sp;
    return;
  }
  function _trinkle($0, $1, $2, $3, $4, $5, $6) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    $6 = $6 | 0;
    var $$0$lcssa = 0,
      $$045$lcssa = 0,
      $$04551 = 0,
      $$0455780 = 0,
      $$046$lcssa = 0,
      $$04653 = 0,
      $$0465681 = 0,
      $$047$lcssa = 0,
      $$0475582 = 0,
      $$049 = 0,
      $$05879 = 0,
      $$05879$phi = 0,
      $11 = 0,
      $12 = 0,
      $16 = 0,
      $20 = 0,
      $24 = 0,
      $27 = 0,
      $28 = 0,
      $35 = 0,
      $37 = 0,
      $38 = 0,
      $47 = 0,
      $7 = 0,
      $8 = 0,
      $9 = 0,
      label = 0,
      sp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 240) | 0;
    $7 = (sp + 232) | 0;
    $8 = sp;
    $9 = HEAP32[$3 >> 2] | 0;
    HEAP32[$7 >> 2] = $9;
    $11 = HEAP32[($3 + 4) >> 2] | 0;
    $12 = ($7 + 4) | 0;
    HEAP32[$12 >> 2] = $11;
    HEAP32[$8 >> 2] = $0;
    L1: do {
      if ((($9 | 0) != 1) | (($11 | 0) != 0)) {
        $16 = (0 - $1) | 0;
        $20 = ($0 + (0 - (HEAP32[($6 + ($4 << 2)) >> 2] | 0))) | 0;
        if ((FUNCTION_TABLE_iii[$2 & 3]($20, $0) | 0) < 1) {
          $$0$lcssa = $0;
          $$045$lcssa = 1;
          $$046$lcssa = $4;
          $$047$lcssa = $5;
          label = 9;
        } else {
          $$0455780 = 1;
          $$0465681 = $4;
          $$0475582 = ($5 | 0) == 0;
          $$05879 = $0;
          $28 = $20;
          while (1) {
            if ($$0475582 & (($$0465681 | 0) > 1)) {
              $24 = ($$05879 + $16) | 0;
              $27 = HEAP32[($6 + (($$0465681 + -2) << 2)) >> 2] | 0;
              if ((FUNCTION_TABLE_iii[$2 & 3]($24, $28) | 0) > -1) {
                $$04551 = $$0455780;
                $$04653 = $$0465681;
                $$049 = $$05879;
                label = 10;
                break L1;
              }
              if (
                (FUNCTION_TABLE_iii[$2 & 3](($24 + (0 - $27)) | 0, $28) | 0) >
                -1
              ) {
                $$04551 = $$0455780;
                $$04653 = $$0465681;
                $$049 = $$05879;
                label = 10;
                break L1;
              }
            }
            $35 = ($$0455780 + 1) | 0;
            HEAP32[($8 + ($$0455780 << 2)) >> 2] = $28;
            $37 = _pntz($7) | 0;
            _shr($7, $37);
            $38 = ($37 + $$0465681) | 0;
            if (
              !(((HEAP32[$7 >> 2] | 0) != 1) | ((HEAP32[$12 >> 2] | 0) != 0))
            ) {
              $$04551 = $35;
              $$04653 = $38;
              $$049 = $28;
              label = 10;
              break L1;
            }
            $47 = ($28 + (0 - (HEAP32[($6 + ($38 << 2)) >> 2] | 0))) | 0;
            if (
              (FUNCTION_TABLE_iii[$2 & 3]($47, HEAP32[$8 >> 2] | 0) | 0) <
              1
            ) {
              $$0$lcssa = $28;
              $$045$lcssa = $35;
              $$046$lcssa = $38;
              $$047$lcssa = 0;
              label = 9;
              break;
            } else {
              $$05879$phi = $28;
              $$0455780 = $35;
              $$0465681 = $38;
              $$0475582 = 1;
              $28 = $47;
              $$05879 = $$05879$phi;
            }
          }
        }
      } else {
        $$0$lcssa = $0;
        $$045$lcssa = 1;
        $$046$lcssa = $4;
        $$047$lcssa = $5;
        label = 9;
      }
    } while (0);
    if ((label | 0) == 9)
      if (!$$047$lcssa) {
        $$04551 = $$045$lcssa;
        $$04653 = $$046$lcssa;
        $$049 = $$0$lcssa;
        label = 10;
      }
    if ((label | 0) == 10) {
      _cycle($1, $8, $$04551);
      _sift($$049, $1, $2, $$04653, $6);
    }
    STACKTOP = sp;
    return;
  }
  function _codebook_decode_scalar_raw($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$0 = 0,
      $$06574 = 0,
      $$06677 = 0,
      $$068$lcssa = 0,
      $$06876 = 0,
      $$1 = 0,
      $$169 = 0,
      $$2 = 0,
      $14 = 0,
      $15 = 0,
      $16 = 0,
      $18 = 0,
      $21 = 0,
      $22 = 0,
      $23 = 0,
      $26 = 0,
      $3 = 0,
      $4 = 0,
      $40 = 0,
      $41 = 0,
      $42 = 0,
      $51 = 0,
      $52 = 0,
      $54 = 0,
      $55 = 0,
      $59 = 0,
      $64 = 0,
      $65 = 0,
      $72 = 0,
      $9 = 0,
      $storemerge = 0,
      label = 0;
    _prep_huffman($0);
    $3 = HEAP32[($1 + 32) >> 2] | 0;
    $4 = ($3 | 0) == 0;
    if ($4)
      if (!(HEAP32[($1 + 2084) >> 2] | 0)) $$1 = -1;
      else label = 3;
    else label = 3;
    L3: do {
      if ((label | 0) == 3) {
        $9 = HEAP32[($1 + 4) >> 2] | 0;
        if (($9 | 0) > 8) {
          if (HEAP32[($1 + 2084) >> 2] | 0) label = 6;
        } else if ($4) label = 6;
        if ((label | 0) == 6) {
          $14 = ($0 + 1380) | 0;
          $15 = HEAP32[$14 >> 2] | 0;
          $16 = _bit_reverse($15) | 0;
          $18 = HEAP32[($1 + 2092) >> 2] | 0;
          if (($18 | 0) > 1) {
            $21 = HEAP32[($1 + 2084) >> 2] | 0;
            $$06677 = $18;
            $$06876 = 0;
            while (1) {
              $22 = $$06677 >>> 1;
              $23 = ($22 + $$06876) | 0;
              $26 = (HEAP32[($21 + ($23 << 2)) >> 2] | 0) >>> 0 > $16 >>> 0;
              $$169 = $26 ? $$06876 : $23;
              $$06677 = $26 ? $22 : ($$06677 - $22) | 0;
              if (($$06677 | 0) <= 1) {
                $$068$lcssa = $$169;
                break;
              } else $$06876 = $$169;
            }
          } else $$068$lcssa = 0;
          if (!(HEAP8[($1 + 23) >> 0] | 0))
            $$2 =
              HEAP32[
                ((HEAP32[($1 + 2088) >> 2] | 0) + ($$068$lcssa << 2)) >> 2
              ] | 0;
          else $$2 = $$068$lcssa;
          $40 = HEAPU8[((HEAP32[($1 + 8) >> 2] | 0) + $$2) >> 0] | 0;
          $41 = ($0 + 1384) | 0;
          $42 = HEAP32[$41 >> 2] | 0;
          if (($42 | 0) < ($40 | 0)) {
            $$0 = -1;
            $storemerge = 0;
          } else {
            HEAP32[$14 >> 2] = $15 >>> $40;
            $$0 = $$2;
            $storemerge = ($42 - $40) | 0;
          }
          HEAP32[$41 >> 2] = $storemerge;
          $$1 = $$0;
          break;
        }
        if (HEAP8[($1 + 23) >> 0] | 0) ___assert_fail(1265, 1076, 1642, 1276);
        L25: do {
          if (($9 | 0) > 0) {
            $51 = HEAP32[($1 + 8) >> 2] | 0;
            $52 = ($0 + 1380) | 0;
            $$06574 = 0;
            while (1) {
              $54 = HEAP8[($51 + $$06574) >> 0] | 0;
              $55 = $54 & 255;
              if (($54 << 24) >> 24 != -1) {
                $59 = HEAP32[$52 >> 2] | 0;
                if (
                  (HEAP32[($3 + ($$06574 << 2)) >> 2] | 0) ==
                  (($59 & ((1 << $55) + -1)) | 0)
                )
                  break;
              }
              $72 = ($$06574 + 1) | 0;
              if (($72 | 0) < ($9 | 0)) $$06574 = $72;
              else break L25;
            }
            $64 = ($0 + 1384) | 0;
            $65 = HEAP32[$64 >> 2] | 0;
            if (($65 | 0) < ($55 | 0)) {
              HEAP32[$64 >> 2] = 0;
              $$1 = -1;
              break L3;
            } else {
              HEAP32[$52 >> 2] = $59 >>> $55;
              HEAP32[$64 >> 2] = $65 - (HEAPU8[($51 + $$06574) >> 0] | 0);
              $$1 = $$06574;
              break L3;
            }
          }
        } while (0);
        _error($0, 21);
        HEAP32[($0 + 1384) >> 2] = 0;
        $$1 = -1;
      }
    } while (0);
    return $$1 | 0;
  }
  function _vorbis_decode_initial($0, $1, $2, $3, $4, $5) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    var $$0 = 0,
      $$06271 = 0,
      $$06272 = 0,
      $$06469 = 0,
      $$06470 = 0,
      $11 = 0,
      $30 = 0,
      $34 = 0,
      $38 = 0,
      $42 = 0,
      $45 = 0,
      $46 = 0,
      $47 = 0,
      $48 = 0,
      $49 = 0,
      $57 = 0,
      $58 = 0,
      $59 = 0,
      $66 = 0,
      $67 = 0,
      $68 = 0,
      $8 = 0,
      $phitmp67 = 0,
      $storemerge = 0,
      $storemerge65 = 0,
      label = 0;
    HEAP32[($0 + 1496) >> 2] = 0;
    HEAP32[($0 + 1492) >> 2] = 0;
    $8 = ($0 + 84) | 0;
    L1: do {
      if (!(HEAP32[$8 >> 2] | 0)) {
        $11 = ($0 + 36) | 0;
        while (1) {
          if (!(_maybe_start_packet($0) | 0)) {
            $$0 = 0;
            break L1;
          }
          if (!(_get_bits($0, 1) | 0)) break;
          if (HEAP8[$11 >> 0] | 0) {
            label = 7;
            break;
          }
          do {} while ((_get8_packet($0) | 0) != -1);
          if (HEAP32[$8 >> 2] | 0) {
            $$0 = 0;
            break L1;
          }
        }
        if ((label | 0) == 7) {
          _error($0, 35);
          $$0 = 0;
          break;
        }
        if (HEAP32[($0 + 68) >> 2] | 0)
          if ((HEAP32[($0 + 72) >> 2] | 0) != (HEAP32[($0 + 80) >> 2] | 0))
            ___assert_fail(1091, 1076, 3130, 1147);
        $30 = ($0 + 396) | 0;
        $34 = _get_bits($0, _ilog(((HEAP32[$30 >> 2] | 0) + -1) | 0) | 0) | 0;
        if (($34 | 0) == -1) $$0 = 0;
        else if (($34 | 0) < (HEAP32[$30 >> 2] | 0)) {
          HEAP32[$5 >> 2] = $34;
          $38 = ($0 + 400 + (($34 * 6) | 0)) | 0;
          if (!(HEAP8[$38 >> 0] | 0)) {
            $42 = HEAP32[($0 + 100) >> 2] | 0;
            $$06272 = 0;
            $$06470 = $42;
            $67 = $42 >> 1;
            $68 = 1;
            label = 19;
          } else {
            $45 = HEAP32[($0 + 104) >> 2] | 0;
            $46 = _get_bits($0, 1) | 0;
            $47 = _get_bits($0, 1) | 0;
            $phitmp67 = (HEAP8[$38 >> 0] | 0) == 0;
            $48 = $45 >> 1;
            if ((($46 | 0) != 0) | $phitmp67) {
              $$06272 = $47;
              $$06470 = $45;
              $67 = $48;
              $68 = $phitmp67;
              label = 19;
            } else {
              $49 = ($0 + 100) | 0;
              HEAP32[$1 >> 2] = ($45 - (HEAP32[$49 >> 2] | 0)) >> 2;
              $$06271 = $47;
              $$06469 = $45;
              $57 = $phitmp67;
              $66 = $48;
              $storemerge = ((HEAP32[$49 >> 2] | 0) + $45) >> 2;
            }
          }
          if ((label | 0) == 19) {
            HEAP32[$1 >> 2] = 0;
            $$06271 = $$06272;
            $$06469 = $$06470;
            $57 = $68;
            $66 = $67;
            $storemerge = $67;
          }
          HEAP32[$2 >> 2] = $storemerge;
          if ((($$06271 | 0) != 0) | $57) {
            HEAP32[$3 >> 2] = $66;
            $storemerge65 = $$06469;
          } else {
            $58 = ($$06469 * 3) | 0;
            $59 = ($0 + 100) | 0;
            HEAP32[$3 >> 2] = ($58 - (HEAP32[$59 >> 2] | 0)) >> 2;
            $storemerge65 = ((HEAP32[$59 >> 2] | 0) + $58) >> 2;
          }
          HEAP32[$4 >> 2] = $storemerge65;
          $$0 = 1;
        } else $$0 = 0;
      } else $$0 = 0;
    } while (0);
    return $$0 | 0;
  }
  function _imdct_step3_inner_s_loop_ld654($0, $1, $2, $3, $4) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    var $$086 = 0,
      $10 = 0,
      $11 = 0,
      $13 = 0,
      $14 = 0,
      $15 = 0,
      $17 = 0,
      $18 = 0,
      $19 = 0,
      $20 = 0,
      $24 = 0,
      $25 = 0,
      $26 = 0,
      $27 = 0,
      $28 = 0,
      $29 = 0,
      $30 = 0,
      $31 = 0,
      $32 = 0,
      $33 = 0,
      $40 = 0,
      $41 = 0,
      $42 = 0,
      $43 = 0,
      $45 = 0,
      $46 = 0,
      $47 = 0,
      $48 = 0,
      $52 = 0,
      $53 = 0,
      $54 = 0,
      $55 = 0,
      $56 = 0,
      $57 = 0,
      $58 = 0,
      $59 = 0,
      $60 = 0,
      $61 = 0,
      $7 = 0,
      $8 = 0;
    $7 = +HEAPF32[($3 + (($4 >> 3) << 2)) >> 2];
    $8 = ($1 + ($2 << 2)) | 0;
    $10 = (0 - ($0 << 4)) | 0;
    $11 = ($8 + ($10 << 2)) | 0;
    if (($10 | 0) < 0) {
      $$086 = $8;
      do {
        $13 = +HEAPF32[$$086 >> 2];
        $14 = ($$086 + -32) | 0;
        $15 = +HEAPF32[$14 >> 2];
        $17 = ($$086 + -4) | 0;
        $18 = +HEAPF32[$17 >> 2];
        $19 = ($$086 + -36) | 0;
        $20 = +HEAPF32[$19 >> 2];
        HEAPF32[$$086 >> 2] = $13 + $15;
        HEAPF32[$17 >> 2] = $18 + $20;
        HEAPF32[$14 >> 2] = $13 - $15;
        HEAPF32[$19 >> 2] = $18 - $20;
        $24 = ($$086 + -8) | 0;
        $25 = +HEAPF32[$24 >> 2];
        $26 = ($$086 + -40) | 0;
        $27 = +HEAPF32[$26 >> 2];
        $28 = $25 - $27;
        $29 = ($$086 + -12) | 0;
        $30 = +HEAPF32[$29 >> 2];
        $31 = ($$086 + -44) | 0;
        $32 = +HEAPF32[$31 >> 2];
        $33 = $30 - $32;
        HEAPF32[$24 >> 2] = $25 + $27;
        HEAPF32[$29 >> 2] = $30 + $32;
        HEAPF32[$26 >> 2] = $7 * ($28 + $33);
        HEAPF32[$31 >> 2] = $7 * ($33 - $28);
        $40 = ($$086 + -48) | 0;
        $41 = +HEAPF32[$40 >> 2];
        $42 = ($$086 + -16) | 0;
        $43 = +HEAPF32[$42 >> 2];
        $45 = ($$086 + -20) | 0;
        $46 = +HEAPF32[$45 >> 2];
        $47 = ($$086 + -52) | 0;
        $48 = +HEAPF32[$47 >> 2];
        HEAPF32[$42 >> 2] = $41 + $43;
        HEAPF32[$45 >> 2] = $46 + $48;
        HEAPF32[$40 >> 2] = $46 - $48;
        HEAPF32[$47 >> 2] = $41 - $43;
        $52 = ($$086 + -56) | 0;
        $53 = +HEAPF32[$52 >> 2];
        $54 = ($$086 + -24) | 0;
        $55 = +HEAPF32[$54 >> 2];
        $56 = $53 - $55;
        $57 = ($$086 + -28) | 0;
        $58 = +HEAPF32[$57 >> 2];
        $59 = ($$086 + -60) | 0;
        $60 = +HEAPF32[$59 >> 2];
        $61 = $58 - $60;
        HEAPF32[$54 >> 2] = $53 + $55;
        HEAPF32[$57 >> 2] = $58 + $60;
        HEAPF32[$52 >> 2] = $7 * ($56 + $61);
        HEAPF32[$59 >> 2] = $7 * ($56 - $61);
        _iter_54($$086);
        _iter_54($14);
        $$086 = ($$086 + -64) | 0;
      } while ($$086 >>> 0 > $11 >>> 0);
    }
    return;
  }
  function _stb_vorbis_decode_frame_pushdata($0, $1, $2, $3, $4, $5) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    var $$05460 = 0,
      $$1 = 0,
      $16 = 0,
      $19 = 0,
      $24 = 0,
      $25 = 0,
      $38 = 0,
      $49 = 0,
      $51 = 0,
      $53 = 0,
      $6 = 0,
      $7 = 0,
      $8 = 0,
      label = 0,
      sp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 16) | 0;
    $6 = (sp + 8) | 0;
    $7 = (sp + 4) | 0;
    $8 = sp;
    L1: do {
      if (!(HEAP8[($0 + 36) >> 0] | 0)) {
        _error($0, 2);
        $$1 = 0;
      } else {
        if ((HEAP32[($0 + 1408) >> 2] | 0) > -1) {
          HEAP32[$5 >> 2] = 0;
          $$1 = _vorbis_search_for_page_pushdata($0, $1, $2) | 0;
          break;
        }
        $16 = ($0 + 20) | 0;
        HEAP32[$16 >> 2] = $1;
        HEAP32[($0 + 28) >> 2] = $1 + $2;
        $19 = ($0 + 88) | 0;
        HEAP32[$19 >> 2] = 0;
        if (!(_is_whole_packet_present($0, 0) | 0)) {
          HEAP32[$5 >> 2] = 0;
          $$1 = 0;
          break;
        }
        if (_vorbis_decode_packet($0, $6, $8, $7) | 0) {
          $49 = HEAP32[$8 >> 2] | 0;
          $51 =
            _vorbis_finish_frame(
              $0,
              HEAP32[$6 >> 2] | 0,
              $49,
              HEAP32[$7 >> 2] | 0
            ) | 0;
          HEAP32[$6 >> 2] = $51;
          $53 = HEAP32[($0 + 4) >> 2] | 0;
          if (($53 | 0) > 0) {
            $$05460 = 0;
            do {
              HEAP32[($0 + 852 + ($$05460 << 2)) >> 2] =
                (HEAP32[($0 + 788 + ($$05460 << 2)) >> 2] | 0) + ($49 << 2);
              $$05460 = ($$05460 + 1) | 0;
            } while (($$05460 | 0) < ($53 | 0));
          }
          if ($3 | 0) HEAP32[$3 >> 2] = $53;
          HEAP32[$5 >> 2] = $51;
          HEAP32[$4 >> 2] = $0 + 852;
          $$1 = ((HEAP32[$16 >> 2] | 0) - $1) | 0;
          break;
        }
        $24 = HEAP32[$19 >> 2] | 0;
        switch ($24 | 0) {
          case 35: {
            HEAP32[$19 >> 2] = 0;
            $25 = ($0 + 84) | 0;
            L23: do {
              if ((_get8_packet($0) | 0) != -1)
                do {
                  if (HEAP32[$25 >> 2] | 0) break L23;
                } while ((_get8_packet($0) | 0) != -1);
            } while (0);
            HEAP32[$5 >> 2] = 0;
            $$1 = ((HEAP32[$16 >> 2] | 0) - $1) | 0;
            break L1;
            break;
          }
          case 32: {
            label = 14;
            break;
          }
          default: {
          }
        }
        if ((label | 0) == 14)
          if (!(HEAP32[($0 + 980) >> 2] | 0)) {
            HEAP32[$19 >> 2] = 0;
            $38 = ($0 + 84) | 0;
            L32: do {
              if ((_get8_packet($0) | 0) != -1)
                do {
                  if (HEAP32[$38 >> 2] | 0) break L32;
                } while ((_get8_packet($0) | 0) != -1);
            } while (0);
            HEAP32[$5 >> 2] = 0;
            $$1 = ((HEAP32[$16 >> 2] | 0) - $1) | 0;
            break;
          }
        _stb_vorbis_flush_pushdata($0);
        HEAP32[$19 >> 2] = $24;
        HEAP32[$5 >> 2] = 0;
        $$1 = 1;
      }
    } while (0);
    STACKTOP = sp;
    return $$1 | 0;
  }
  function _memcpy(dest, src, num) {
    dest = dest | 0;
    src = src | 0;
    num = num | 0;
    var ret = 0,
      aligned_dest_end = 0,
      block_aligned_dest_end = 0,
      dest_end = 0;
    if ((num | 0) >= 8192)
      return _emscripten_memcpy_big(dest | 0, src | 0, num | 0) | 0;
    ret = dest | 0;
    dest_end = (dest + num) | 0;
    if ((dest & 3) == (src & 3)) {
      while (dest & 3) {
        if (!num) return ret | 0;
        HEAP8[dest >> 0] = HEAP8[src >> 0] | 0;
        dest = (dest + 1) | 0;
        src = (src + 1) | 0;
        num = (num - 1) | 0;
      }
      aligned_dest_end = (dest_end & -4) | 0;
      block_aligned_dest_end = (aligned_dest_end - 64) | 0;
      while ((dest | 0) <= (block_aligned_dest_end | 0)) {
        HEAP32[dest >> 2] = HEAP32[src >> 2];
        HEAP32[(dest + 4) >> 2] = HEAP32[(src + 4) >> 2];
        HEAP32[(dest + 8) >> 2] = HEAP32[(src + 8) >> 2];
        HEAP32[(dest + 12) >> 2] = HEAP32[(src + 12) >> 2];
        HEAP32[(dest + 16) >> 2] = HEAP32[(src + 16) >> 2];
        HEAP32[(dest + 20) >> 2] = HEAP32[(src + 20) >> 2];
        HEAP32[(dest + 24) >> 2] = HEAP32[(src + 24) >> 2];
        HEAP32[(dest + 28) >> 2] = HEAP32[(src + 28) >> 2];
        HEAP32[(dest + 32) >> 2] = HEAP32[(src + 32) >> 2];
        HEAP32[(dest + 36) >> 2] = HEAP32[(src + 36) >> 2];
        HEAP32[(dest + 40) >> 2] = HEAP32[(src + 40) >> 2];
        HEAP32[(dest + 44) >> 2] = HEAP32[(src + 44) >> 2];
        HEAP32[(dest + 48) >> 2] = HEAP32[(src + 48) >> 2];
        HEAP32[(dest + 52) >> 2] = HEAP32[(src + 52) >> 2];
        HEAP32[(dest + 56) >> 2] = HEAP32[(src + 56) >> 2];
        HEAP32[(dest + 60) >> 2] = HEAP32[(src + 60) >> 2];
        dest = (dest + 64) | 0;
        src = (src + 64) | 0;
      }
      while ((dest | 0) < (aligned_dest_end | 0)) {
        HEAP32[dest >> 2] = HEAP32[src >> 2];
        dest = (dest + 4) | 0;
        src = (src + 4) | 0;
      }
    } else {
      aligned_dest_end = (dest_end - 4) | 0;
      while ((dest | 0) < (aligned_dest_end | 0)) {
        HEAP8[dest >> 0] = HEAP8[src >> 0] | 0;
        HEAP8[(dest + 1) >> 0] = HEAP8[(src + 1) >> 0] | 0;
        HEAP8[(dest + 2) >> 0] = HEAP8[(src + 2) >> 0] | 0;
        HEAP8[(dest + 3) >> 0] = HEAP8[(src + 3) >> 0] | 0;
        dest = (dest + 4) | 0;
        src = (src + 4) | 0;
      }
    }
    while ((dest | 0) < (dest_end | 0)) {
      HEAP8[dest >> 0] = HEAP8[src >> 0] | 0;
      dest = (dest + 1) | 0;
      src = (src + 1) | 0;
    }
    return ret | 0;
  }
  function _do_floor($0, $1, $2, $3, $4, $5) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    var $$062$lcssa = 0,
      $$0624 = 0,
      $$063$lcssa = 0,
      $$0633 = 0,
      $$0652 = 0,
      $$0661 = 0,
      $$1 = 0,
      $$164 = 0,
      $14 = 0,
      $19 = 0,
      $22 = 0,
      $25 = 0,
      $26 = 0,
      $27 = 0,
      $31 = 0,
      $33 = 0,
      $38 = 0,
      $41 = 0,
      $45 = 0,
      $48 = 0,
      $49 = 0,
      $53 = 0,
      $6 = 0;
    $6 = $3 >> 1;
    $14 =
      HEAPU8[
        ((HEAPU8[((HEAP32[($1 + 4) >> 2] | 0) + (($2 * 3) | 0) + 2) >> 0] | 0) +
          ($1 + 9)) >>
          0
      ] | 0;
    if (!(HEAP16[($0 + 120 + ($14 << 1)) >> 1] | 0)) _error($0, 21);
    else {
      $19 = HEAP32[($0 + 248) >> 2] | 0;
      $22 = ($19 + (($14 * 1596) | 0) + 1588) | 0;
      $25 = Math_imul(HEAPU8[$22 >> 0] | 0, HEAP16[$5 >> 1] | 0) | 0;
      $26 = ($19 + (($14 * 1596) | 0) + 1592) | 0;
      $27 = HEAP32[$26 >> 2] | 0;
      if (($27 | 0) > 1) {
        $$0624 = $25;
        $$0633 = 0;
        $$0652 = 1;
        $53 = $27;
        while (1) {
          $31 = HEAPU8[($19 + (($14 * 1596) | 0) + 838 + $$0652) >> 0] | 0;
          $33 = HEAP16[($5 + ($31 << 1)) >> 1] | 0;
          if (($33 << 16) >> 16 > -1) {
            $38 = Math_imul(HEAPU8[$22 >> 0] | 0, ($33 << 16) >> 16) | 0;
            $41 =
              HEAPU16[($19 + (($14 * 1596) | 0) + 338 + ($31 << 1)) >> 1] | 0;
            if (($$0633 | 0) == ($41 | 0)) {
              $$1 = $38;
              $$164 = $$0633;
              $45 = $53;
            } else {
              _draw_line($4, $$0633, $$0624, $41, $38, $6);
              $$1 = $38;
              $$164 = $41;
              $45 = HEAP32[$26 >> 2] | 0;
            }
          } else {
            $$1 = $$0624;
            $$164 = $$0633;
            $45 = $53;
          }
          $$0652 = ($$0652 + 1) | 0;
          if (($$0652 | 0) >= ($45 | 0)) {
            $$062$lcssa = $$1;
            $$063$lcssa = $$164;
            break;
          } else {
            $$0624 = $$1;
            $$0633 = $$164;
            $53 = $45;
          }
        }
      } else {
        $$062$lcssa = $25;
        $$063$lcssa = 0;
      }
      if (($$063$lcssa | 0) < ($6 | 0)) {
        $48 = +HEAPF32[(48 + ($$062$lcssa << 2)) >> 2];
        $$0661 = $$063$lcssa;
        do {
          $49 = ($4 + ($$0661 << 2)) | 0;
          HEAPF32[$49 >> 2] = $48 * +HEAPF32[$49 >> 2];
          $$0661 = ($$0661 + 1) | 0;
        } while (($$0661 | 0) != ($6 | 0));
      }
    }
    return;
  }
  function _vorbis_finish_frame($0, $1, $2, $3) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    var $$0 = 0,
      $$06776 = 0,
      $$06880 = 0,
      $$06971 = 0,
      $$07072 = 0,
      $11 = 0,
      $12 = 0,
      $14 = 0,
      $16 = 0,
      $18 = 0,
      $33 = 0,
      $34 = 0,
      $36 = 0,
      $38 = 0,
      $4 = 0,
      $40 = 0,
      $42 = 0,
      $45 = 0,
      $49 = 0,
      $5 = 0,
      $52 = 0,
      $53 = 0,
      $7 = 0,
      $9 = 0;
    $4 = ($0 + 980) | 0;
    $5 = HEAP32[$4 >> 2] | 0;
    if (!$5) {
      $34 = HEAP32[($0 + 4) >> 2] | 0;
      $49 = 0;
    } else {
      $7 = _get_window($0, $5) | 0;
      $9 = HEAP32[($0 + 4) >> 2] | 0;
      if (($9 | 0) > 0) {
        $11 = ($5 | 0) > 0;
        $12 = ($5 + -1) | 0;
        $$06880 = 0;
        do {
          if ($11) {
            $14 = HEAP32[($0 + 788 + ($$06880 << 2)) >> 2] | 0;
            $16 = HEAP32[($0 + 916 + ($$06880 << 2)) >> 2] | 0;
            $$06776 = 0;
            do {
              $18 = ($14 + (($$06776 + $2) << 2)) | 0;
              HEAPF32[$18 >> 2] =
                +HEAPF32[$18 >> 2] * +HEAPF32[($7 + ($$06776 << 2)) >> 2] +
                +HEAPF32[($16 + ($$06776 << 2)) >> 2] *
                  +HEAPF32[($7 + (($12 - $$06776) << 2)) >> 2];
              $$06776 = ($$06776 + 1) | 0;
            } while (($$06776 | 0) != ($5 | 0));
          }
          $$06880 = ($$06880 + 1) | 0;
        } while (($$06880 | 0) < ($9 | 0));
      }
      $34 = $9;
      $49 = HEAP32[$4 >> 2] | 0;
    }
    $33 = ($1 - $3) | 0;
    HEAP32[$4 >> 2] = $33;
    if (($34 | 0) > 0) {
      $36 = ($1 | 0) > ($3 | 0);
      $$07072 = 0;
      do {
        if ($36) {
          $38 = HEAP32[($0 + 788 + ($$07072 << 2)) >> 2] | 0;
          $40 = HEAP32[($0 + 916 + ($$07072 << 2)) >> 2] | 0;
          $$06971 = 0;
          $42 = $3;
          while (1) {
            HEAP32[($40 + ($$06971 << 2)) >> 2] =
              HEAP32[($38 + ($42 << 2)) >> 2];
            $45 = ($$06971 + 1) | 0;
            if (($45 | 0) == ($33 | 0)) break;
            else {
              $$06971 = $45;
              $42 = ($45 + $3) | 0;
            }
          }
        }
        $$07072 = ($$07072 + 1) | 0;
      } while (($$07072 | 0) < ($34 | 0));
    }
    $52 = ((($1 | 0) < ($3 | 0) ? $1 : $3) - $2) | 0;
    $53 = ($0 + 1404) | 0;
    if (!$49) $$0 = 0;
    else {
      HEAP32[$53 >> 2] = (HEAP32[$53 >> 2] | 0) + $52;
      $$0 = $52;
    }
    return $$0 | 0;
  }
  function _start_page_no_capturepattern($0) {
    $0 = $0 | 0;
    var $$0 = 0,
      $$05866$in = 0,
      $$059$lcssa = 0,
      $$05963 = 0,
      $$06062 = 0,
      $10 = 0,
      $11 = 0,
      $15 = 0,
      $18 = 0,
      $28 = 0,
      $3 = 0,
      $37 = 0,
      $5 = 0,
      $6 = 0,
      $7 = 0,
      $$05866$in$looptemp = 0;
    do {
      if (!(((_get8($0) | 0) << 24) >> 24)) {
        $3 = _get8($0) | 0;
        HEAP8[($0 + 1363) >> 0] = $3;
        $5 = _get32($0) | 0;
        $6 = _get32($0) | 0;
        _get32($0) | 0;
        $7 = _get32($0) | 0;
        HEAP32[($0 + 1100) >> 2] = $7;
        _get32($0) | 0;
        $10 = (_get8($0) | 0) & 255;
        $11 = ($0 + 1104) | 0;
        HEAP32[$11 >> 2] = $10;
        if (!(_getn($0, ($0 + 1108) | 0, $10) | 0)) {
          _error($0, 10);
          $$0 = 0;
          break;
        }
        $15 = ($0 + 1392) | 0;
        HEAP32[$15 >> 2] = -2;
        L6: do {
          if ((($6 & $5) | 0) != -1) {
            $18 = HEAP32[$11 >> 2] | 0;
            if (($18 | 0) > 0) {
              $$05866$in = $18;
              while (1) {
                $$05866$in$looptemp = $$05866$in;
                $$05866$in = ($$05866$in + -1) | 0;
                if ((HEAP8[($0 + 1108 + $$05866$in) >> 0] | 0) != -1) break;
                if (($$05866$in$looptemp | 0) <= 1) break L6;
              }
              HEAP32[$15 >> 2] = $$05866$in;
              HEAP32[($0 + 1396) >> 2] = $5;
            }
          }
        } while (0);
        if (HEAP8[($0 + 1365) >> 0] | 0) {
          $28 = HEAP32[$11 >> 2] | 0;
          if (($28 | 0) > 0) {
            $$05963 = 0;
            $$06062 = 0;
            do {
              $$05963 =
                ($$05963 + (HEAPU8[($0 + 1108 + $$06062) >> 0] | 0)) | 0;
              $$06062 = ($$06062 + 1) | 0;
            } while (($$06062 | 0) < ($28 | 0));
            $$059$lcssa = ($$05963 + 27) | 0;
          } else $$059$lcssa = 27;
          $37 = HEAP32[($0 + 40) >> 2] | 0;
          HEAP32[($0 + 44) >> 2] = $37;
          HEAP32[($0 + 48) >> 2] = $$059$lcssa + $28 + $37;
          HEAP32[($0 + 52) >> 2] = $5;
        }
        HEAP32[($0 + 1368) >> 2] = 0;
        $$0 = 1;
      } else {
        _error($0, 31);
        $$0 = 0;
      }
    } while (0);
    return $$0 | 0;
  }
  function _compute_twiddle_factors($0, $1, $2, $3) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    var $$04044 = 0,
      $$045 = 0,
      $$14142 = 0,
      $$143 = 0,
      $11 = 0,
      $13 = 0,
      $17 = 0,
      $18 = 0,
      $23 = 0,
      $26 = 0,
      $30 = 0,
      $36 = 0,
      $37 = 0,
      $4 = 0,
      $41 = 0,
      $43 = 0,
      $47 = 0,
      $5 = 0,
      $7 = 0;
    $4 = $0 >> 2;
    $5 = $0 >> 3;
    if (($0 | 0) > 3) {
      $7 = +($0 | 0);
      $$04044 = 0;
      $$045 = 0;
      while (1) {
        $11 = (+(($$04044 << 2) | 0) * 3.141592653589793) / $7;
        $13 = +Math_cos(+$11);
        HEAPF32[($1 + ($$045 << 2)) >> 2] = $13;
        $17 = -+Math_sin(+$11);
        $18 = $$045 | 1;
        HEAPF32[($1 + ($18 << 2)) >> 2] = $17;
        $23 = ((+($18 | 0) * 3.141592653589793) / $7) * 0.5;
        $26 = +Math_cos(+$23) * 0.5;
        HEAPF32[($2 + ($$045 << 2)) >> 2] = $26;
        $30 = +Math_sin(+$23) * 0.5;
        HEAPF32[($2 + ($18 << 2)) >> 2] = $30;
        $$04044 = ($$04044 + 1) | 0;
        if (($$04044 | 0) >= ($4 | 0)) break;
        else $$045 = ($$045 + 2) | 0;
      }
      if (($0 | 0) > 7) {
        $36 = +($0 | 0);
        $$14142 = 0;
        $$143 = 0;
        while (1) {
          $37 = $$143 | 1;
          $41 = (+(($37 << 1) | 0) * 3.141592653589793) / $36;
          $43 = +Math_cos(+$41);
          HEAPF32[($3 + ($$143 << 2)) >> 2] = $43;
          $47 = -+Math_sin(+$41);
          HEAPF32[($3 + ($37 << 2)) >> 2] = $47;
          $$14142 = ($$14142 + 1) | 0;
          if (($$14142 | 0) >= ($5 | 0)) break;
          else $$143 = ($$143 + 2) | 0;
        }
      }
    }
    return;
  }
  function _codebook_decode($0, $1, $2, $3) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    var $$0 = 0,
      $$04045 = 0,
      $$04144 = 0,
      $$143 = 0,
      $12 = 0,
      $14 = 0,
      $15 = 0,
      $19 = 0,
      $20 = 0,
      $28 = 0,
      $33 = 0,
      $4 = 0,
      $6 = 0,
      $8 = 0,
      $spec$select = 0;
    $4 = _codebook_decode_start($0, $1) | 0;
    do {
      if (($4 | 0) < 0) $$0 = 0;
      else {
        $6 = HEAP32[$1 >> 2] | 0;
        $spec$select = ($6 | 0) < ($3 | 0) ? $6 : $3;
        $8 = Math_imul($6, $4) | 0;
        $12 = ($spec$select | 0) > 0;
        if (!(HEAP8[($1 + 22) >> 0] | 0)) {
          if (!$12) {
            $$0 = 1;
            break;
          }
          $28 = HEAP32[($1 + 28) >> 2] | 0;
          $$143 = 0;
          do {
            $33 = ($2 + ($$143 << 2)) | 0;
            HEAPF32[$33 >> 2] =
              +HEAPF32[$33 >> 2] +
              (+HEAPF32[($28 + (($$143 + $8) << 2)) >> 2] + 0);
            $$143 = ($$143 + 1) | 0;
          } while (($$143 | 0) < ($spec$select | 0));
          $$0 = 1;
        } else {
          if (!$12) {
            $$0 = 1;
            break;
          }
          $14 = HEAP32[($1 + 28) >> 2] | 0;
          $15 = ($1 + 12) | 0;
          $$04045 = 0;
          $$04144 = 0;
          while (1) {
            $19 = $$04045 + +HEAPF32[($14 + (($$04144 + $8) << 2)) >> 2];
            $20 = ($2 + ($$04144 << 2)) | 0;
            HEAPF32[$20 >> 2] = +HEAPF32[$20 >> 2] + $19;
            $$04144 = ($$04144 + 1) | 0;
            if (($$04144 | 0) >= ($spec$select | 0)) {
              $$0 = 1;
              break;
            } else $$04045 = $19 + +HEAPF32[$15 >> 2];
          }
        }
      }
    } while (0);
    return $$0 | 0;
  }
  function _memset(ptr, value, num) {
    ptr = ptr | 0;
    value = value | 0;
    num = num | 0;
    var end = 0,
      aligned_end = 0,
      block_aligned_end = 0,
      value4 = 0;
    end = (ptr + num) | 0;
    value = value & 255;
    if ((num | 0) >= 67) {
      while (ptr & 3) {
        HEAP8[ptr >> 0] = value;
        ptr = (ptr + 1) | 0;
      }
      aligned_end = (end & -4) | 0;
      block_aligned_end = (aligned_end - 64) | 0;
      value4 = value | (value << 8) | (value << 16) | (value << 24);
      while ((ptr | 0) <= (block_aligned_end | 0)) {
        HEAP32[ptr >> 2] = value4;
        HEAP32[(ptr + 4) >> 2] = value4;
        HEAP32[(ptr + 8) >> 2] = value4;
        HEAP32[(ptr + 12) >> 2] = value4;
        HEAP32[(ptr + 16) >> 2] = value4;
        HEAP32[(ptr + 20) >> 2] = value4;
        HEAP32[(ptr + 24) >> 2] = value4;
        HEAP32[(ptr + 28) >> 2] = value4;
        HEAP32[(ptr + 32) >> 2] = value4;
        HEAP32[(ptr + 36) >> 2] = value4;
        HEAP32[(ptr + 40) >> 2] = value4;
        HEAP32[(ptr + 44) >> 2] = value4;
        HEAP32[(ptr + 48) >> 2] = value4;
        HEAP32[(ptr + 52) >> 2] = value4;
        HEAP32[(ptr + 56) >> 2] = value4;
        HEAP32[(ptr + 60) >> 2] = value4;
        ptr = (ptr + 64) | 0;
      }
      while ((ptr | 0) < (aligned_end | 0)) {
        HEAP32[ptr >> 2] = value4;
        ptr = (ptr + 4) | 0;
      }
    }
    while ((ptr | 0) < (end | 0)) {
      HEAP8[ptr >> 0] = value;
      ptr = (ptr + 1) | 0;
    }
    return (end - num) | 0;
  }
  function _sift($0, $1, $2, $3, $4) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    var $$0$lcssa = 0,
      $$02934 = 0,
      $$03133 = 0,
      $$035 = 0,
      $$1 = 0,
      $$130 = 0,
      $$132 = 0,
      $13 = 0,
      $14 = 0,
      $21 = 0,
      $5 = 0,
      $7 = 0,
      $8 = 0,
      $9 = 0,
      sp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 240) | 0;
    $5 = sp;
    HEAP32[$5 >> 2] = $0;
    L1: do {
      if (($3 | 0) > 1) {
        $7 = (0 - $1) | 0;
        $$02934 = $0;
        $$03133 = $3;
        $$035 = 1;
        $14 = $0;
        while (1) {
          $8 = ($$02934 + $7) | 0;
          $9 = ($$03133 + -2) | 0;
          $13 = ($8 + (0 - (HEAP32[($4 + ($9 << 2)) >> 2] | 0))) | 0;
          if ((FUNCTION_TABLE_iii[$2 & 3]($14, $13) | 0) > -1)
            if ((FUNCTION_TABLE_iii[$2 & 3]($14, $8) | 0) > -1) {
              $$0$lcssa = $$035;
              break L1;
            }
          $21 = ($5 + ($$035 << 2)) | 0;
          if ((FUNCTION_TABLE_iii[$2 & 3]($13, $8) | 0) > -1) {
            HEAP32[$21 >> 2] = $13;
            $$130 = $13;
            $$132 = ($$03133 + -1) | 0;
          } else {
            HEAP32[$21 >> 2] = $8;
            $$130 = $8;
            $$132 = $9;
          }
          $$1 = ($$035 + 1) | 0;
          if (($$132 | 0) <= 1) {
            $$0$lcssa = $$1;
            break L1;
          }
          $$02934 = $$130;
          $$03133 = $$132;
          $$035 = $$1;
          $14 = HEAP32[$5 >> 2] | 0;
        }
      } else $$0$lcssa = 1;
    } while (0);
    _cycle($1, $5, $$0$lcssa);
    STACKTOP = sp;
    return;
  }
  function _get_bits($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$2 = 0,
      $14 = 0,
      $15 = 0,
      $17 = 0,
      $2 = 0,
      $21 = 0,
      $24 = 0,
      $25 = 0,
      $3 = 0,
      $31 = 0,
      $7 = 0,
      label = 0;
    $2 = ($0 + 1384) | 0;
    $3 = HEAP32[$2 >> 2] | 0;
    L1: do {
      if (($3 | 0) < 0) $$2 = 0;
      else {
        do {
          if (($3 | 0) < ($1 | 0)) {
            if (($1 | 0) > 24) {
              $7 = _get_bits($0, 24) | 0;
              return (((_get_bits($0, ($1 + -24) | 0) | 0) << 24) + $7) | 0;
            }
            if (!$3) HEAP32[($0 + 1380) >> 2] = 0;
            $14 = ($0 + 1380) | 0;
            while (1) {
              $15 = _get8_packet_raw($0) | 0;
              if (($15 | 0) == -1) {
                label = 10;
                break;
              }
              $17 = HEAP32[$2 >> 2] | 0;
              HEAP32[$14 >> 2] = (HEAP32[$14 >> 2] | 0) + ($15 << $17);
              $21 = ($17 + 8) | 0;
              HEAP32[$2 >> 2] = $21;
              if (($21 | 0) >= ($1 | 0)) {
                label = 11;
                break;
              }
            }
            if ((label | 0) == 10) {
              HEAP32[$2 >> 2] = -1;
              $$2 = 0;
              break L1;
            } else if ((label | 0) == 11)
              if (($17 | 0) < -8) {
                $$2 = 0;
                break L1;
              } else {
                $31 = $21;
                break;
              }
          } else $31 = $3;
        } while (0);
        $24 = ($0 + 1380) | 0;
        $25 = HEAP32[$24 >> 2] | 0;
        HEAP32[$24 >> 2] = $25 >>> $1;
        HEAP32[$2 >> 2] = $31 - $1;
        $$2 = $25 & ((1 << $1) + -1);
      }
    } while (0);
    return $$2 | 0;
  }
  function _init_blocksize($0, $1, $2) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    var $$0 = 0,
      $10 = 0,
      $11 = 0,
      $13 = 0,
      $15 = 0,
      $18 = 0,
      $22 = 0,
      $5 = 0,
      $6 = 0,
      $7 = 0,
      $8 = 0,
      $9 = 0,
      label = 0;
    $5 = $2 >> 3;
    $6 = ($2 >>> 1) << 2;
    $7 = _setup_malloc($0, $6) | 0;
    $8 = ($0 + 1056 + ($1 << 2)) | 0;
    HEAP32[$8 >> 2] = $7;
    $9 = _setup_malloc($0, $6) | 0;
    $10 = ($0 + 1064 + ($1 << 2)) | 0;
    HEAP32[$10 >> 2] = $9;
    $11 = _setup_malloc($0, $2 & -4) | 0;
    HEAP32[($0 + 1072 + ($1 << 2)) >> 2] = $11;
    $13 = HEAP32[$8 >> 2] | 0;
    do {
      if (!$13) label = 3;
      else {
        $15 = HEAP32[$10 >> 2] | 0;
        if ((($11 | 0) == 0) | (($15 | 0) == 0)) label = 3;
        else {
          _compute_twiddle_factors($2, $13, $15, $11);
          $18 = _setup_malloc($0, $6) | 0;
          HEAP32[($0 + 1080 + ($1 << 2)) >> 2] = $18;
          if (!$18) {
            _error($0, 3);
            $$0 = 0;
            break;
          }
          _compute_window($2, $18);
          $22 = _setup_malloc($0, $5 << 1) | 0;
          HEAP32[($0 + 1088 + ($1 << 2)) >> 2] = $22;
          if (!$22) {
            _error($0, 3);
            $$0 = 0;
            break;
          } else {
            _compute_bitreverse($2, $22);
            $$0 = 1;
            break;
          }
        }
      }
    } while (0);
    if ((label | 0) == 3) {
      _error($0, 3);
      $$0 = 0;
    }
    return $$0 | 0;
  }
  function _draw_line($0, $1, $2, $3, $4, $5) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    var $$05362 = 0,
      $$05461 = 0,
      $$05660 = 0,
      $$05663 = 0,
      $11 = 0,
      $14 = 0,
      $19 = 0,
      $23 = 0,
      $24 = 0,
      $28 = 0,
      $6 = 0,
      $7 = 0,
      $9 = 0,
      $spec$select = 0;
    $6 = ($4 - $2) | 0;
    $7 = ($3 - $1) | 0;
    $9 = (($6 | 0) / ($7 | 0)) | 0;
    $11 = ($6 >> 31) | 1;
    $14 =
      ((($6 | 0) > -1 ? $6 : (0 - $6) | 0) -
        (Math_imul(($9 | 0) > -1 ? $9 : (0 - $9) | 0, $7) | 0)) |
      0;
    $spec$select = ($3 | 0) > ($5 | 0) ? $5 : $3;
    if (($spec$select | 0) > ($1 | 0)) {
      $19 = ($0 + ($1 << 2)) | 0;
      HEAPF32[$19 >> 2] = +HEAPF32[(48 + ($2 << 2)) >> 2] * +HEAPF32[$19 >> 2];
      $$05660 = ($1 + 1) | 0;
      if (($$05660 | 0) < ($spec$select | 0)) {
        $$05362 = 0;
        $$05461 = $2;
        $$05663 = $$05660;
        while (1) {
          $23 = ($$05362 + $14) | 0;
          $24 = ($23 | 0) < ($7 | 0);
          $$05461 = ($$05461 + $9 + ($24 ? 0 : $11)) | 0;
          $28 = ($0 + ($$05663 << 2)) | 0;
          HEAPF32[$28 >> 2] =
            +HEAPF32[(48 + ($$05461 << 2)) >> 2] * +HEAPF32[$28 >> 2];
          $$05663 = ($$05663 + 1) | 0;
          if (($$05663 | 0) >= ($spec$select | 0)) break;
          else $$05362 = ($23 - ($24 ? 0 : $7)) | 0;
        }
      }
    }
    return;
  }
  function _codebook_decode_start($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$0 = 0,
      $$1 = 0,
      $12 = 0,
      $13 = 0,
      $19 = 0,
      $22 = 0,
      $23 = 0,
      $5 = 0,
      $8 = 0,
      $9 = 0;
    do {
      if (!(HEAP8[($1 + 21) >> 0] | 0)) {
        _error($0, 21);
        $$0 = -1;
      } else {
        $5 = ($0 + 1384) | 0;
        if ((HEAP32[$5 >> 2] | 0) < 10) _prep_huffman($0);
        $8 = ($0 + 1380) | 0;
        $9 = HEAP32[$8 >> 2] | 0;
        $12 = HEAP16[($1 + 36 + (($9 & 1023) << 1)) >> 1] | 0;
        $13 = ($12 << 16) >> 16;
        if (($12 << 16) >> 16 > -1) {
          $19 = HEAPU8[((HEAP32[($1 + 8) >> 2] | 0) + $13) >> 0] | 0;
          HEAP32[$8 >> 2] = $9 >>> $19;
          $22 = ((HEAP32[$5 >> 2] | 0) - $19) | 0;
          $23 = ($22 | 0) < 0;
          HEAP32[$5 >> 2] = $23 ? 0 : $22;
          $$1 = $23 ? -1 : $13;
        } else $$1 = _codebook_decode_scalar_raw($0, $1) | 0;
        if (HEAP8[($1 + 23) >> 0] | 0)
          if (($$1 | 0) >= (HEAP32[($1 + 2092) >> 2] | 0))
            ___assert_fail(1375, 1076, 1730, 1397);
        if (($$1 | 0) < 0) {
          if (!(HEAP8[($0 + 1364) >> 0] | 0))
            if (HEAP32[($0 + 1372) >> 2] | 0) {
              $$0 = $$1;
              break;
            }
          _error($0, 21);
          $$0 = $$1;
        } else $$0 = $$1;
      }
    } while (0);
    return $$0 | 0;
  }
  function _residue_decode($0, $1, $2, $3, $4, $5) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    var $$03237 = 0,
      $$03440 = 0,
      $$1 = 0,
      $$13341 = 0,
      $11 = 0,
      $23 = 0,
      $8 = 0,
      $9 = 0;
    L1: do {
      if (!$5) {
        $8 = (($4 | 0) / (HEAP32[$1 >> 2] | 0)) | 0;
        $9 = ($2 + ($3 << 2)) | 0;
        if (($8 | 0) > 0) {
          $11 = ($4 - $3) | 0;
          $$03237 = 0;
          while (1) {
            if (
              !(
                _codebook_decode_step(
                  $0,
                  $1,
                  ($9 + ($$03237 << 2)) | 0,
                  ($11 - $$03237) | 0,
                  $8
                ) | 0
              )
            ) {
              $$1 = 0;
              break L1;
            }
            $$03237 = ($$03237 + 1) | 0;
            if (($$03237 | 0) >= ($8 | 0)) {
              $$1 = 1;
              break;
            }
          }
        } else $$1 = 1;
      } else if (($4 | 0) > 0) {
        $$03440 = $3;
        $$13341 = 0;
        while (1) {
          if (
            !(
              _codebook_decode(
                $0,
                $1,
                ($2 + ($$03440 << 2)) | 0,
                ($4 - $$13341) | 0
              ) | 0
            )
          ) {
            $$1 = 0;
            break L1;
          }
          $23 = HEAP32[$1 >> 2] | 0;
          $$13341 = ($23 + $$13341) | 0;
          if (($$13341 | 0) >= ($4 | 0)) {
            $$1 = 1;
            break;
          } else $$03440 = ($23 + $$03440) | 0;
        }
      } else $$1 = 1;
    } while (0);
    return $$1 | 0;
  }
  function _next_segment($0) {
    $0 = $0 | 0;
    var $$0 = 0,
      $1 = 0,
      $17 = 0,
      $18 = 0,
      $20 = 0,
      $27 = 0,
      $4 = 0,
      $5 = 0;
    $1 = ($0 + 1372) | 0;
    L1: do {
      if (!(HEAP32[$1 >> 2] | 0)) {
        $4 = ($0 + 1368) | 0;
        $5 = HEAP32[$4 >> 2] | 0;
        do {
          if (($5 | 0) == -1) {
            HEAP32[($0 + 1376) >> 2] = (HEAP32[($0 + 1104) >> 2] | 0) + -1;
            if (!(_start_page($0) | 0)) {
              HEAP32[$1 >> 2] = 1;
              $$0 = 0;
              break L1;
            }
            if (!(HEAP8[($0 + 1363) >> 0] & 1)) {
              _error($0, 32);
              $$0 = 0;
              break L1;
            } else {
              $18 = HEAP32[$4 >> 2] | 0;
              break;
            }
          } else $18 = $5;
        } while (0);
        $17 = ($18 + 1) | 0;
        HEAP32[$4 >> 2] = $17;
        $20 = HEAP8[($0 + 1108 + $18) >> 0] | 0;
        if (($20 << 24) >> 24 != -1) {
          HEAP32[$1 >> 2] = 1;
          HEAP32[($0 + 1376) >> 2] = $18;
        }
        if (($17 | 0) >= (HEAP32[($0 + 1104) >> 2] | 0)) HEAP32[$4 >> 2] = -1;
        $27 = ($0 + 1364) | 0;
        if (!(HEAP8[$27 >> 0] | 0)) {
          HEAP8[$27 >> 0] = $20;
          $$0 = $20 & 255;
          break;
        } else ___assert_fail(1205, 1076, 1512, 1226);
      } else $$0 = 0;
    } while (0);
    return $$0 | 0;
  }
  function _compute_accelerated_huffman($0) {
    $0 = $0 | 0;
    var $$027 = 0,
      $$128 = 0,
      $$pre = 0,
      $10 = 0,
      $11 = 0,
      $12 = 0,
      $22 = 0,
      $24 = 0,
      $3 = 0,
      $6 = 0,
      $spec$store$select = 0;
    _memset(($0 + 36) | 0, -1, 2048) | 0;
    $3 = (HEAP8[($0 + 23) >> 0] | 0) == 0;
    $6 = HEAP32[($3 ? ($0 + 4) | 0 : ($0 + 2092) | 0) >> 2] | 0;
    $spec$store$select = ($6 | 0) < 32767 ? $6 : 32767;
    if (($6 | 0) > 0) {
      $10 = ($0 + 32) | 0;
      $11 = ($0 + 2084) | 0;
      $$pre = HEAP32[($0 + 8) >> 2] | 0;
      $$128 = 0;
      do {
        $12 = ($$pre + $$128) | 0;
        if ((HEAPU8[$12 >> 0] | 0) < 11) {
          if ($3)
            $22 = HEAP32[((HEAP32[$10 >> 2] | 0) + ($$128 << 2)) >> 2] | 0;
          else
            $22 =
              _bit_reverse(
                HEAP32[((HEAP32[$11 >> 2] | 0) + ($$128 << 2)) >> 2] | 0
              ) | 0;
          if ($22 >>> 0 < 1024) {
            $24 = $$128 & 65535;
            $$027 = $22;
            do {
              HEAP16[($0 + 36 + ($$027 << 1)) >> 1] = $24;
              $$027 = ((1 << HEAPU8[$12 >> 0]) + $$027) | 0;
            } while ($$027 >>> 0 < 1024);
          }
        }
        $$128 = ($$128 + 1) | 0;
      } while (($$128 | 0) < ($spec$store$select | 0));
    }
    return;
  }
  function _iter_54($0) {
    $0 = $0 | 0;
    var $1 = 0,
      $10 = 0,
      $11 = 0,
      $14 = 0,
      $15 = 0,
      $16 = 0,
      $17 = 0,
      $18 = 0,
      $2 = 0,
      $21 = 0,
      $22 = 0,
      $23 = 0,
      $24 = 0,
      $25 = 0,
      $26 = 0,
      $27 = 0,
      $3 = 0,
      $4 = 0,
      $5 = 0,
      $6 = 0,
      $7 = 0,
      $8 = 0,
      $9 = 0;
    $1 = +HEAPF32[$0 >> 2];
    $2 = ($0 + -16) | 0;
    $3 = +HEAPF32[$2 >> 2];
    $4 = $1 - $3;
    $5 = $1 + $3;
    $6 = ($0 + -8) | 0;
    $7 = +HEAPF32[$6 >> 2];
    $8 = ($0 + -24) | 0;
    $9 = +HEAPF32[$8 >> 2];
    $10 = $7 + $9;
    $11 = $7 - $9;
    HEAPF32[$0 >> 2] = $5 + $10;
    HEAPF32[$6 >> 2] = $5 - $10;
    $14 = ($0 + -12) | 0;
    $15 = +HEAPF32[$14 >> 2];
    $16 = ($0 + -28) | 0;
    $17 = +HEAPF32[$16 >> 2];
    $18 = $15 - $17;
    HEAPF32[$2 >> 2] = $4 + $18;
    HEAPF32[$8 >> 2] = $4 - $18;
    $21 = ($0 + -4) | 0;
    $22 = +HEAPF32[$21 >> 2];
    $23 = ($0 + -20) | 0;
    $24 = +HEAPF32[$23 >> 2];
    $25 = $22 - $24;
    $26 = $22 + $24;
    $27 = $15 + $17;
    HEAPF32[$21 >> 2] = $27 + $26;
    HEAPF32[$14 >> 2] = $26 - $27;
    HEAPF32[$23 >> 2] = $25 - $11;
    HEAPF32[$16 >> 2] = $11 + $25;
    return;
  }
  function _codebook_decode_step($0, $1, $2, $3, $4) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    var $$0 = 0,
      $$02833 = 0,
      $$02932 = 0,
      $12 = 0,
      $15 = 0,
      $19 = 0,
      $21 = 0,
      $5 = 0,
      $7 = 0,
      $9 = 0,
      $spec$select = 0;
    $5 = _codebook_decode_start($0, $1) | 0;
    if (($5 | 0) < 0) $$0 = 0;
    else {
      $7 = HEAP32[$1 >> 2] | 0;
      $spec$select = ($7 | 0) < ($3 | 0) ? $7 : $3;
      $9 = Math_imul($7, $5) | 0;
      if (($spec$select | 0) > 0) {
        $12 = HEAP32[($1 + 28) >> 2] | 0;
        $15 = (HEAP8[($1 + 22) >> 0] | 0) == 0;
        $$02833 = 0;
        $$02932 = 0;
        while (1) {
          $19 = $$02833 + +HEAPF32[($12 + (($$02932 + $9) << 2)) >> 2];
          $21 = ($2 + ((Math_imul($$02932, $4) | 0) << 2)) | 0;
          HEAPF32[$21 >> 2] = +HEAPF32[$21 >> 2] + $19;
          $$02932 = ($$02932 + 1) | 0;
          if (($$02932 | 0) >= ($spec$select | 0)) {
            $$0 = 1;
            break;
          } else $$02833 = $15 ? $$02833 : $19;
        }
      } else $$0 = 1;
    }
    return $$0 | 0;
  }
  function _maybe_start_packet($0) {
    $0 = $0 | 0;
    var $$1 = 0,
      $4 = 0,
      label = 0;
    do {
      if ((HEAP32[($0 + 1368) >> 2] | 0) == -1) {
        $4 = _get8($0) | 0;
        if (!(HEAP32[($0 + 84) >> 2] | 0)) {
          if (($4 << 24) >> 24 != 79) {
            _error($0, 30);
            $$1 = 0;
            break;
          }
          if (((_get8($0) | 0) << 24) >> 24 != 103) {
            _error($0, 30);
            $$1 = 0;
            break;
          }
          if (((_get8($0) | 0) << 24) >> 24 != 103) {
            _error($0, 30);
            $$1 = 0;
            break;
          }
          if (((_get8($0) | 0) << 24) >> 24 != 83) {
            _error($0, 30);
            $$1 = 0;
            break;
          }
          if (!(_start_page_no_capturepattern($0) | 0)) $$1 = 0;
          else if (!(HEAP8[($0 + 1363) >> 0] & 1)) label = 14;
          else {
            HEAP32[($0 + 1372) >> 2] = 0;
            HEAP8[($0 + 1364) >> 0] = 0;
            _error($0, 32);
            $$1 = 0;
          }
        } else $$1 = 0;
      } else label = 14;
    } while (0);
    if ((label | 0) == 14) $$1 = _start_packet($0) | 0;
    return $$1 | 0;
  }
  function _cycle($0, $1, $2) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    var $$02527 = 0,
      $$026 = 0,
      $10 = 0,
      $11 = 0,
      $18 = 0,
      $3 = 0,
      $5 = 0,
      $8 = 0,
      sp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 256) | 0;
    $3 = sp;
    L1: do {
      if (($2 | 0) >= 2) {
        $5 = ($1 + ($2 << 2)) | 0;
        HEAP32[$5 >> 2] = $3;
        if ($0 | 0) {
          $$02527 = $0;
          $10 = $3;
          while (1) {
            $8 = $$02527 >>> 0 < 256 ? $$02527 : 256;
            _memcpy($10 | 0, HEAP32[$1 >> 2] | 0, $8 | 0) | 0;
            $$026 = 0;
            do {
              $11 = ($1 + ($$026 << 2)) | 0;
              $$026 = ($$026 + 1) | 0;
              _memcpy(
                HEAP32[$11 >> 2] | 0,
                HEAP32[($1 + ($$026 << 2)) >> 2] | 0,
                $8 | 0
              ) | 0;
              HEAP32[$11 >> 2] = (HEAP32[$11 >> 2] | 0) + $8;
            } while (($$026 | 0) != ($2 | 0));
            $18 = ($$02527 - $8) | 0;
            if (!$18) break L1;
            $$02527 = $18;
            $10 = HEAP32[$5 >> 2] | 0;
          }
        }
      }
    } while (0);
    STACKTOP = sp;
    return;
  }
  function _scalbn($0, $1) {
    $0 = +$0;
    $1 = $1 | 0;
    var $$0 = 0,
      $$020 = 0,
      $10 = 0,
      $12 = 0,
      $14 = 0,
      $17 = 0,
      $18 = 0,
      $3 = 0,
      $5 = 0,
      $7 = 0;
    if (($1 | 0) > 1023) {
      $3 = $0 * 898846567431158e293;
      $5 = ($1 | 0) > 2046;
      $7 = ($1 + -2046) | 0;
      $$0 = $5 ? $3 * 898846567431158e293 : $3;
      $$020 = $5 ? (($7 | 0) < 1023 ? $7 : 1023) : ($1 + -1023) | 0;
    } else if (($1 | 0) < -1022) {
      $10 = $0 * 22250738585072014e-324;
      $12 = ($1 | 0) < -2044;
      $14 = ($1 + 2044) | 0;
      $$0 = $12 ? $10 * 22250738585072014e-324 : $10;
      $$020 = $12 ? (($14 | 0) > -1022 ? $14 : -1022) : ($1 + 1022) | 0;
    } else {
      $$0 = $0;
      $$020 = $1;
    }
    $17 = _bitshift64Shl(($$020 + 1023) | 0, 0, 52) | 0;
    $18 = tempRet0;
    HEAP32[tempDoublePtr >> 2] = $17;
    HEAP32[(tempDoublePtr + 4) >> 2] = $18;
    return +($$0 * +HEAPF64[tempDoublePtr >> 3]);
  }
  function _neighbors($0, $1, $2, $3) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    var $$02933 = 0,
      $$03032 = 0,
      $$034 = 0,
      $$1 = 0,
      $$131 = 0,
      $5 = 0,
      $7 = 0,
      $8 = 0;
    if (($1 | 0) > 0) {
      $5 = ($0 + ($1 << 1)) | 0;
      $$02933 = 65536;
      $$03032 = -1;
      $$034 = 0;
      while (1) {
        $7 = HEAP16[($0 + ($$034 << 1)) >> 1] | 0;
        $8 = $7 & 65535;
        if (($$03032 | 0) < ($8 | 0))
          if (($7 & 65535) < (HEAPU16[$5 >> 1] | 0)) {
            HEAP32[$2 >> 2] = $$034;
            $$131 = $8;
          } else $$131 = $$03032;
        else $$131 = $$03032;
        if (($$02933 | 0) > ($8 | 0))
          if (($7 & 65535) > (HEAPU16[$5 >> 1] | 0)) {
            HEAP32[$3 >> 2] = $$034;
            $$1 = $8;
          } else $$1 = $$02933;
        else $$1 = $$02933;
        $$034 = ($$034 + 1) | 0;
        if (($$034 | 0) == ($1 | 0)) break;
        else {
          $$02933 = $$1;
          $$03032 = $$131;
        }
      }
    }
    return;
  }
  function _stb_vorbis_open_pushdata($0, $1, $2, $3, $4) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    var $$0 = 0,
      $17 = 0,
      $5 = 0,
      sp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 1504) | 0;
    $5 = sp;
    _vorbis_init($5, $4);
    HEAP32[($5 + 20) >> 2] = $0;
    HEAP32[($5 + 28) >> 2] = $0 + $1;
    HEAP8[($5 + 36) >> 0] = 1;
    do {
      if (!(_start_decoder($5) | 0)) {
        HEAP32[$3 >> 2] =
          (HEAP32[($5 + 84) >> 2] | 0) == 0 ? HEAP32[($5 + 88) >> 2] | 0 : 1;
        $$0 = 0;
      } else {
        $17 = _vorbis_alloc($5) | 0;
        if (!$17) {
          _vorbis_deinit($5);
          $$0 = 0;
          break;
        } else {
          _memcpy($17 | 0, $5 | 0, 1500) | 0;
          HEAP32[$2 >> 2] = (HEAP32[($17 + 20) >> 2] | 0) - $0;
          HEAP32[$3 >> 2] = 0;
          $$0 = $17;
          break;
        }
      }
    } while (0);
    STACKTOP = sp;
    return $$0 | 0;
  }
  function _ilog($0) {
    $0 = $0 | 0;
    var $$0 = 0;
    do {
      if (($0 | 0) < 0) $$0 = 0;
      else {
        if (($0 | 0) < 16384) {
          if (($0 | 0) < 16) {
            $$0 = HEAP8[(16 + $0) >> 0] | 0;
            break;
          }
          if (($0 | 0) < 512) {
            $$0 = ((HEAP8[(16 + ($0 >>> 5)) >> 0] | 0) + 5) | 0;
            break;
          } else {
            $$0 = ((HEAP8[(16 + ($0 >>> 10)) >> 0] | 0) + 10) | 0;
            break;
          }
        }
        if (($0 | 0) < 16777216)
          if (($0 | 0) < 524288) {
            $$0 = ((HEAP8[(16 + ($0 >>> 15)) >> 0] | 0) + 15) | 0;
            break;
          } else {
            $$0 = ((HEAP8[(16 + ($0 >>> 20)) >> 0] | 0) + 20) | 0;
            break;
          }
        else if (($0 | 0) < 536870912) {
          $$0 = ((HEAP8[(16 + ($0 >>> 25)) >> 0] | 0) + 25) | 0;
          break;
        } else {
          $$0 = ((HEAP8[(16 + ($0 >>> 30)) >> 0] | 0) + 30) | 0;
          break;
        }
      }
    } while (0);
    return $$0 | 0;
  }
  function _realloc($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$1 = 0,
      $11 = 0,
      $14 = 0,
      $17 = 0,
      $22 = 0,
      $5 = 0;
    if (!$0) {
      $$1 = _malloc($1) | 0;
      return $$1 | 0;
    }
    if ($1 >>> 0 > 4294967231) {
      $5 = ___errno_location() | 0;
      HEAP32[$5 >> 2] = 12;
      $$1 = 0;
      return $$1 | 0;
    }
    $11 =
      _try_realloc_chunk(($0 + -8) | 0, $1 >>> 0 < 11 ? 16 : ($1 + 11) & -8) |
      0;
    if ($11 | 0) {
      $$1 = ($11 + 8) | 0;
      return $$1 | 0;
    }
    $14 = _malloc($1) | 0;
    if (!$14) {
      $$1 = 0;
      return $$1 | 0;
    }
    $17 = HEAP32[($0 + -4) >> 2] | 0;
    $22 = (($17 & -8) - ((($17 & 3) | 0) == 0 ? 8 : 4)) | 0;
    _memcpy($14 | 0, $0 | 0, ($22 >>> 0 < $1 >>> 0 ? $22 : $1) | 0) | 0;
    _free($0);
    $$1 = $14;
    return $$1 | 0;
  }
  function _get8_packet_raw($0) {
    $0 = $0 | 0;
    var $$0 = 0,
      $$pr = 0,
      $1 = 0,
      $11 = 0,
      $12 = 0,
      $2 = 0,
      label = 0;
    $1 = ($0 + 1364) | 0;
    $2 = HEAP8[$1 >> 0] | 0;
    if (!(($2 << 24) >> 24))
      if (!(HEAP32[($0 + 1372) >> 2] | 0))
        if (!(_next_segment($0) | 0)) $$0 = -1;
        else {
          $$pr = HEAP8[$1 >> 0] | 0;
          if (!(($$pr << 24) >> 24)) ___assert_fail(1169, 1076, 1526, 1189);
          else {
            $11 = $$pr;
            label = 6;
          }
        }
      else $$0 = -1;
    else {
      $11 = $2;
      label = 6;
    }
    if ((label | 0) == 6) {
      HEAP8[$1 >> 0] = (($11 + -1) << 24) >> 24;
      $12 = ($0 + 1388) | 0;
      HEAP32[$12 >> 2] = (HEAP32[$12 >> 2] | 0) + 1;
      $$0 = (_get8($0) | 0) & 255;
    }
    return $$0 | 0;
  }
  function _sbrk(increment) {
    increment = increment | 0;
    var oldDynamicTop = 0,
      newDynamicTop = 0;
    oldDynamicTop = HEAP32[DYNAMICTOP_PTR >> 2] | 0;
    newDynamicTop = (oldDynamicTop + increment) | 0;
    if (
      (((increment | 0) > 0) & ((newDynamicTop | 0) < (oldDynamicTop | 0))) |
      ((newDynamicTop | 0) < 0)
    ) {
      abortOnCannotGrowMemory() | 0;
      ___setErrNo(12);
      return -1;
    }
    HEAP32[DYNAMICTOP_PTR >> 2] = newDynamicTop;
    if ((newDynamicTop | 0) > (getTotalMemory() | 0))
      if (!(enlargeMemory() | 0)) {
        HEAP32[DYNAMICTOP_PTR >> 2] = oldDynamicTop;
        ___setErrNo(12);
        return -1;
      }
    return oldDynamicTop | 0;
  }
  function _start_packet($0) {
    $0 = $0 | 0;
    var $$0 = 0,
      $1 = 0,
      $4 = 0,
      label = 0;
    $1 = ($0 + 1368) | 0;
    L1: do {
      if ((HEAP32[$1 >> 2] | 0) == -1) {
        $4 = ($0 + 1363) | 0;
        while (1) {
          if (!(_start_page($0) | 0)) {
            $$0 = 0;
            break L1;
          }
          if (HEAP8[$4 >> 0] & 1) break;
          if ((HEAP32[$1 >> 2] | 0) != -1) {
            label = 7;
            break L1;
          }
        }
        _error($0, 32);
        $$0 = 0;
      } else label = 7;
    } while (0);
    if ((label | 0) == 7) {
      HEAP32[($0 + 1372) >> 2] = 0;
      HEAP32[($0 + 1384) >> 2] = 0;
      HEAP32[($0 + 1388) >> 2] = 0;
      HEAP8[($0 + 1364) >> 0] = 0;
      $$0 = 1;
    }
    return $$0 | 0;
  }
  function _prep_huffman($0) {
    $0 = $0 | 0;
    var $1 = 0,
      $12 = 0,
      $14 = 0,
      $2 = 0,
      $5 = 0,
      $6 = 0,
      $7 = 0;
    $1 = ($0 + 1384) | 0;
    $2 = HEAP32[$1 >> 2] | 0;
    L1: do {
      if (($2 | 0) < 25) {
        $5 = ($0 + 1380) | 0;
        if (!$2) HEAP32[$5 >> 2] = 0;
        $6 = ($0 + 1364) | 0;
        $7 = ($0 + 1372) | 0;
        do {
          if (HEAP32[$7 >> 2] | 0) if (!(HEAP8[$6 >> 0] | 0)) break L1;
          $12 = _get8_packet_raw($0) | 0;
          if (($12 | 0) == -1) break L1;
          $14 = HEAP32[$1 >> 2] | 0;
          HEAP32[$5 >> 2] = (HEAP32[$5 >> 2] | 0) + ($12 << $14);
          HEAP32[$1 >> 2] = $14 + 8;
        } while (($14 | 0) < 17);
      }
    } while (0);
    return;
  }
  function _lookup1_values($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $11 = 0,
      $15 = 0,
      $21 = 0,
      $spec$select = 0;
    $11 = ~~+Math_floor(+(+Math_exp(+(+Math_log(+(+($0 | 0))) / +($1 | 0)))));
    $15 = +($1 | 0);
    $spec$select =
      ((((~~+Math_floor(+(+Math_pow(+(+($11 | 0) + 1), +$15))) | 0) <=
        ($0 | 0)) &
        1) +
        $11) |
      0;
    $21 = +($spec$select | 0);
    if (!(+Math_pow(+($21 + 1), +$15) > +($0 | 0)))
      ___assert_fail(1755, 1076, 1205, 1787);
    if ((~~+Math_floor(+(+Math_pow(+$21, +$15))) | 0) > ($0 | 0))
      ___assert_fail(1802, 1076, 1206, 1787);
    else return $spec$select | 0;
    return 0;
  }
  function _memcmp($0, $1, $2) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    var $$01318 = 0,
      $$01417 = 0,
      $$019 = 0,
      $14 = 0,
      $4 = 0,
      $5 = 0;
    L1: do {
      if (!$2) $14 = 0;
      else {
        $$01318 = $0;
        $$01417 = $2;
        $$019 = $1;
        while (1) {
          $4 = HEAP8[$$01318 >> 0] | 0;
          $5 = HEAP8[$$019 >> 0] | 0;
          if (($4 << 24) >> 24 != ($5 << 24) >> 24) break;
          $$01417 = ($$01417 + -1) | 0;
          if (!$$01417) {
            $14 = 0;
            break L1;
          } else {
            $$01318 = ($$01318 + 1) | 0;
            $$019 = ($$019 + 1) | 0;
          }
        }
        $14 = (($4 & 255) - ($5 & 255)) | 0;
      }
    } while (0);
    return $14 | 0;
  }
  function _setup_malloc($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$1 = 0,
      $10 = 0,
      $11 = 0,
      $12 = 0,
      $3 = 0,
      $4 = 0,
      $8 = 0;
    $3 = ($1 + 3) & -4;
    $4 = ($0 + 8) | 0;
    HEAP32[$4 >> 2] = (HEAP32[$4 >> 2] | 0) + $3;
    $8 = HEAP32[($0 + 68) >> 2] | 0;
    if (!$8)
      if (!$3) $$1 = 0;
      else $$1 = _malloc($3) | 0;
    else {
      $10 = ($0 + 76) | 0;
      $11 = HEAP32[$10 >> 2] | 0;
      $12 = ($11 + $3) | 0;
      if (($12 | 0) > (HEAP32[($0 + 80) >> 2] | 0)) $$1 = 0;
      else {
        HEAP32[$10 >> 2] = $12;
        $$1 = ($8 + $11) | 0;
      }
    }
    return $$1 | 0;
  }
  function _vorbis_init($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $10 = 0,
      $16 = 0,
      $4 = 0,
      $9 = 0;
    _memset($0 | 0, 0, 1500) | 0;
    if ($1 | 0) {
      $4 = $1;
      $9 = HEAP32[($4 + 4) >> 2] | 0;
      $10 = ($0 + 68) | 0;
      HEAP32[$10 >> 2] = HEAP32[$4 >> 2];
      HEAP32[($10 + 4) >> 2] = $9;
      $16 = ($9 + 3) & -4;
      HEAP32[($0 + 72) >> 2] = $16;
      HEAP32[($0 + 80) >> 2] = $16;
    }
    HEAP32[($0 + 84) >> 2] = 0;
    HEAP32[($0 + 88) >> 2] = 0;
    HEAP32[($0 + 20) >> 2] = 0;
    HEAP32[($0 + 112) >> 2] = 0;
    HEAP32[($0 + 1408) >> 2] = -1;
    return;
  }
  function _vorbis_decode_packet($0, $1, $2, $3) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    var $$0 = 0,
      $4 = 0,
      $6 = 0,
      sp = 0;
    sp = STACKTOP;
    STACKTOP = (STACKTOP + 16) | 0;
    $4 = (sp + 8) | 0;
    $6 = sp;
    if (!(_vorbis_decode_initial($0, $2, (sp + 4) | 0, $3, $6, $4) | 0))
      $$0 = 0;
    else
      $$0 =
        _vorbis_decode_packet_rest(
          $0,
          $1,
          ($0 + 400 + (((HEAP32[$4 >> 2] | 0) * 6) | 0)) | 0,
          HEAP32[$2 >> 2] | 0,
          HEAP32[$3 >> 2] | 0,
          HEAP32[$6 >> 2] | 0,
          $2
        ) | 0;
    STACKTOP = sp;
    return $$0 | 0;
  }
  function _add_entry($0, $1, $2, $3, $4, $5) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    $5 = $5 | 0;
    var $$sink = 0,
      $$sink10 = 0,
      $10 = 0;
    $10 = HEAP32[($0 + 32) >> 2] | 0;
    if (!(HEAP8[($0 + 23) >> 0] | 0)) {
      $$sink = $1;
      $$sink10 = ($10 + ($2 << 2)) | 0;
    } else {
      HEAP32[($10 + ($3 << 2)) >> 2] = $1;
      HEAP8[((HEAP32[($0 + 8) >> 2] | 0) + $3) >> 0] = $4;
      $$sink = $2;
      $$sink10 = ($5 + ($3 << 2)) | 0;
    }
    HEAP32[$$sink10 >> 2] = $$sink;
    return;
  }
  function _shl($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$0 = 0,
      $10 = 0,
      $3 = 0,
      $5 = 0,
      $7 = 0;
    $3 = ($0 + 4) | 0;
    if ($1 >>> 0 > 31) {
      $5 = HEAP32[$0 >> 2] | 0;
      HEAP32[$3 >> 2] = $5;
      HEAP32[$0 >> 2] = 0;
      $$0 = ($1 + -32) | 0;
      $10 = 0;
      $7 = $5;
    } else {
      $$0 = $1;
      $10 = HEAP32[$0 >> 2] | 0;
      $7 = HEAP32[$3 >> 2] | 0;
    }
    HEAP32[$3 >> 2] = ($10 >>> ((32 - $$0) | 0)) | ($7 << $$0);
    HEAP32[$0 >> 2] = $10 << $$0;
    return;
  }
  function _shr($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$0 = 0,
      $10 = 0,
      $3 = 0,
      $5 = 0,
      $7 = 0;
    $3 = ($0 + 4) | 0;
    if ($1 >>> 0 > 31) {
      $5 = HEAP32[$3 >> 2] | 0;
      HEAP32[$0 >> 2] = $5;
      HEAP32[$3 >> 2] = 0;
      $$0 = ($1 + -32) | 0;
      $10 = 0;
      $7 = $5;
    } else {
      $$0 = $1;
      $10 = HEAP32[$3 >> 2] | 0;
      $7 = HEAP32[$0 >> 2] | 0;
    }
    HEAP32[$0 >> 2] = ($10 << (32 - $$0)) | ($7 >>> $$0);
    HEAP32[$3 >> 2] = $10 >>> $$0;
    return;
  }
  function _compute_window($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$010 = 0,
      $16 = 0,
      $2 = 0,
      $4 = 0;
    $2 = $0 >> 1;
    if (($0 | 0) > 1) {
      $4 = +($2 | 0);
      $$010 = 0;
      do {
        $16 = +Math_sin(
          +(
            +_square(
              +Math_sin(
                +(((+($$010 | 0) + 0.5) / $4) * 0.5 * 3.141592653589793)
              )
            ) * 1.5707963267948966
          )
        );
        HEAPF32[($1 + ($$010 << 2)) >> 2] = $16;
        $$010 = ($$010 + 1) | 0;
      } while (($$010 | 0) < ($2 | 0));
    }
    return;
  }
  function _setup_temp_malloc($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$0 = 0,
      $3 = 0,
      $5 = 0,
      $7 = 0,
      $9 = 0;
    $3 = ($1 + 3) & -4;
    $5 = HEAP32[($0 + 68) >> 2] | 0;
    if (!$5) $$0 = _malloc($3) | 0;
    else {
      $7 = ($0 + 80) | 0;
      $9 = ((HEAP32[$7 >> 2] | 0) - $3) | 0;
      if (($9 | 0) < (HEAP32[($0 + 76) >> 2] | 0)) $$0 = 0;
      else {
        HEAP32[$7 >> 2] = $9;
        $$0 = ($5 + $9) | 0;
      }
    }
    return $$0 | 0;
  }
  function _getn($0, $1, $2) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    var $$0 = 0,
      $3 = 0,
      $4 = 0;
    $3 = ($0 + 20) | 0;
    $4 = HEAP32[$3 >> 2] | 0;
    if ((($4 + $2) | 0) >>> 0 > (HEAP32[($0 + 28) >> 2] | 0) >>> 0) {
      HEAP32[($0 + 84) >> 2] = 1;
      $$0 = 0;
    } else {
      _memcpy($1 | 0, $4 | 0, $2 | 0) | 0;
      HEAP32[$3 >> 2] = (HEAP32[$3 >> 2] | 0) + $2;
      $$0 = 1;
    }
    return $$0 | 0;
  }
  function _compute_bitreverse($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$013 = 0,
      $2 = 0,
      $5 = 0,
      $9 = 0;
    $2 = $0 >> 3;
    if (($0 | 0) > 7) {
      $5 = (36 - (_ilog($0) | 0)) | 0;
      $$013 = 0;
      do {
        $9 = (((_bit_reverse($$013) | 0) >>> $5) << 2) & 65535;
        HEAP16[($1 + ($$013 << 1)) >> 1] = $9;
        $$013 = ($$013 + 1) | 0;
      } while (($$013 | 0) < ($2 | 0));
    }
    return;
  }
  function _crc32_init() {
    var $$01315 = 0,
      $$01417 = 0,
      $$016 = 0;
    $$01417 = 0;
    do {
      $$01315 = 0;
      $$016 = $$01417 << 24;
      do {
        $$016 = (($$016 >> 31) & 79764919) ^ ($$016 << 1);
        $$01315 = ($$01315 + 1) | 0;
      } while (($$01315 | 0) != 8);
      HEAP32[(1856 + ($$01417 << 2)) >> 2] = $$016;
      $$01417 = ($$01417 + 1) | 0;
    } while (($$01417 | 0) != 256);
    return;
  }
  function _make_block_array($0, $1, $2) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    var $$01617 = 0,
      $$018 = 0;
    if (($1 | 0) > 0) {
      $$01617 = 0;
      $$018 = ($0 + ($1 << 2)) | 0;
      while (1) {
        HEAP32[($0 + ($$01617 << 2)) >> 2] = $$018;
        $$01617 = ($$01617 + 1) | 0;
        if (($$01617 | 0) == ($1 | 0)) break;
        else $$018 = ($$018 + $2) | 0;
      }
    }
    return $0 | 0;
  }
  function _get_window($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $$0$in = 0,
      $2 = 0;
    $2 = $1 << 1;
    do {
      if (($2 | 0) == (HEAP32[($0 + 100) >> 2] | 0)) $$0$in = ($0 + 1080) | 0;
      else if (($2 | 0) == (HEAP32[($0 + 104) >> 2] | 0)) {
        $$0$in = ($0 + 1084) | 0;
        break;
      } else ___assert_fail(1455, 1076, 3051, 1457);
    } while (0);
    return HEAP32[$$0$in >> 2] | 0;
  }
  function _a_ctz_l($0) {
    $0 = $0 | 0;
    var $$068 = 0,
      $$07 = 0,
      $$09 = 0,
      $4 = 0;
    if (!$0) $$07 = 32;
    else if (!($0 & 1)) {
      $$068 = $0;
      $$09 = 0;
      while (1) {
        $4 = ($$09 + 1) | 0;
        if (!($$068 & 2)) {
          $$068 = $$068 >>> 1;
          $$09 = $4;
        } else {
          $$07 = $4;
          break;
        }
      }
    } else $$07 = 0;
    return $$07 | 0;
  }
  function _bit_reverse($0) {
    $0 = $0 | 0;
    var $10 = 0,
      $15 = 0,
      $20 = 0,
      $5 = 0;
    $5 = (($0 >>> 1) & 1431655765) | (($0 << 1) & -1431655766);
    $10 = (($5 >>> 2) & 858993459) | (($5 << 2) & -858993460);
    $15 = (($10 >>> 4) & 252645135) | (($10 << 4) & -252645136);
    $20 = (($15 >>> 8) & 16711935) | (($15 << 8) & -16711936);
    return ($20 >>> 16) | ($20 << 16) | 0;
  }
  function _predict_point($0, $1, $2, $3, $4) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    $3 = $3 | 0;
    $4 = $4 | 0;
    var $10 = 0,
      $5 = 0;
    $5 = ($4 - $3) | 0;
    $10 =
      ((Math_imul(($5 | 0) > -1 ? $5 : (0 - $5) | 0, ($0 - $1) | 0) | 0) /
        (($2 - $1) | 0)) |
      0;
    return ((($5 | 0) < 0 ? (0 - $10) | 0 : $10) + $3) | 0;
  }
  function _stb_vorbis_flush_pushdata($0) {
    $0 = $0 | 0;
    HEAP32[($0 + 980) >> 2] = 0;
    HEAP32[($0 + 1408) >> 2] = 0;
    HEAP32[($0 + 1400) >> 2] = 0;
    HEAP32[($0 + 1052) >> 2] = 0;
    HEAP8[($0 + 1365) >> 0] = 0;
    HEAP32[($0 + 1404) >> 2] = 0;
    HEAP32[($0 + 1492) >> 2] = 0;
    HEAP32[($0 + 1496) >> 2] = 0;
    return;
  }
  function runPostSets() {}
  function _bitshift64Shl(low, high, bits) {
    low = low | 0;
    high = high | 0;
    bits = bits | 0;
    if ((bits | 0) < 32) {
      tempRet0 =
        (high << bits) |
        ((low & (((1 << bits) - 1) << (32 - bits))) >>> (32 - bits));
      return low << bits;
    }
    tempRet0 = low << (bits - 32);
    return 0;
  }
  function _get8($0) {
    $0 = $0 | 0;
    var $$0 = 0,
      $1 = 0,
      $2 = 0;
    $1 = ($0 + 20) | 0;
    $2 = HEAP32[$1 >> 2] | 0;
    if ($2 >>> 0 < (HEAP32[($0 + 28) >> 2] | 0) >>> 0) {
      HEAP32[$1 >> 2] = $2 + 1;
      $$0 = HEAP8[$2 >> 0] | 0;
    } else {
      HEAP32[($0 + 84) >> 2] = 1;
      $$0 = 0;
    }
    return $$0 | 0;
  }
  function _capture_pattern($0) {
    $0 = $0 | 0;
    var $$0 = 0;
    if (((_get8($0) | 0) << 24) >> 24 == 79)
      if (((_get8($0) | 0) << 24) >> 24 == 103)
        if (((_get8($0) | 0) << 24) >> 24 == 103)
          $$0 = (((_get8($0) | 0) << 24) >> 24 == 83) & 1;
        else $$0 = 0;
      else $$0 = 0;
    else $$0 = 0;
    return $$0 | 0;
  }
  function _include_in_sort($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $5 = 0;
    $5 = ($1 << 24) >> 24 == -1;
    if (!(HEAP8[($0 + 23) >> 0] | 0)) return (($5 ^ (($1 & 255) > 10)) & 1) | 0;
    if ($5) ___assert_fail(1724, 1076, 1130, 1739);
    else return 1;
    return 0;
  }
  function _pntz($0) {
    $0 = $0 | 0;
    var $3 = 0,
      $7 = 0;
    $3 = _a_ctz_l(((HEAP32[$0 >> 2] | 0) + -1) | 0) | 0;
    if (!$3) {
      $7 = _a_ctz_l(HEAP32[($0 + 4) >> 2] | 0) | 0;
      return (($7 | 0) == 0 ? 0 : ($7 + 32) | 0) | 0;
    } else return $3 | 0;
    return 0;
  }
  function _skip($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $2 = 0,
      $4 = 0;
    $2 = ($0 + 20) | 0;
    $4 = ((HEAP32[$2 >> 2] | 0) + $1) | 0;
    HEAP32[$2 >> 2] = $4;
    if ($4 >>> 0 >= (HEAP32[($0 + 28) >> 2] | 0) >>> 0)
      HEAP32[($0 + 84) >> 2] = 1;
    return;
  }
  function _setup_temp_free($0, $1, $2) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    $2 = $2 | 0;
    var $8 = 0;
    if (!(HEAP32[($0 + 68) >> 2] | 0)) _free($1);
    else {
      $8 = ($0 + 80) | 0;
      HEAP32[$8 >> 2] = (HEAP32[$8 >> 2] | 0) + (($2 + 3) & -4);
    }
    return;
  }
  function _get32($0) {
    $0 = $0 | 0;
    var $10 = 0,
      $2 = 0,
      $6 = 0;
    $2 = (_get8($0) | 0) & 255;
    $6 = (((_get8($0) | 0) & 255) << 8) | $2;
    $10 = $6 | (((_get8($0) | 0) & 255) << 16);
    return $10 | (((_get8($0) | 0) & 255) << 24) | 0;
  }
  function _point_compare($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $2 = 0,
      $3 = 0;
    $2 = HEAP16[$0 >> 1] | 0;
    $3 = HEAP16[$1 >> 1] | 0;
    return (
      (($2 & 65535) < ($3 & 65535) ? -1 : (($2 & 65535) > ($3 & 65535)) & 1) | 0
    );
  }
  function _uint32_compare($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    var $2 = 0,
      $3 = 0;
    $2 = HEAP32[$0 >> 2] | 0;
    $3 = HEAP32[$1 >> 2] | 0;
    return ($2 >>> 0 < $3 >>> 0 ? -1 : ($2 >>> 0 > $3 >>> 0) & 1) | 0;
  }
  function _stb_vorbis_get_file_offset($0) {
    $0 = $0 | 0;
    var $$0 = 0;
    if (!(HEAP8[($0 + 36) >> 0] | 0))
      $$0 = ((HEAP32[($0 + 20) >> 2] | 0) - (HEAP32[($0 + 24) >> 2] | 0)) | 0;
    else $$0 = 0;
    return $$0 | 0;
  }
  function _start_page($0) {
    $0 = $0 | 0;
    var $$0 = 0;
    if (!(_capture_pattern($0) | 0)) {
      _error($0, 30);
      $$0 = 0;
    } else $$0 = _start_page_no_capturepattern($0) | 0;
    return $$0 | 0;
  }
  function _stb_vorbis_js_channels($0) {
    $0 = $0 | 0;
    var $$0 = 0,
      $1 = 0;
    $1 = HEAP32[$0 >> 2] | 0;
    if (!$1) $$0 = 0;
    else $$0 = HEAP32[($1 + 4) >> 2] | 0;
    return $$0 | 0;
  }
  function _stb_vorbis_js_sample_rate($0) {
    $0 = $0 | 0;
    var $$0 = 0,
      $1 = 0;
    $1 = HEAP32[$0 >> 2] | 0;
    if (!$1) $$0 = 0;
    else $$0 = HEAP32[$1 >> 2] | 0;
    return $$0 | 0;
  }
  function _float32_unpack($0) {
    $0 = $0 | 0;
    var $5 = 0;
    $5 = +(($0 & 2097151) >>> 0);
    return +(+_ldexp(
      ($0 | 0) < 0 ? -$5 : $5,
      ((($0 >>> 21) & 1023) + -788) | 0
    ));
  }
  function stackAlloc(size) {
    size = size | 0;
    var ret = 0;
    ret = STACKTOP;
    STACKTOP = (STACKTOP + size) | 0;
    STACKTOP = (STACKTOP + 15) & -16;
    return ret | 0;
  }
  function establishStackSpace(stackBase, stackMax) {
    stackBase = stackBase | 0;
    stackMax = stackMax | 0;
    STACKTOP = stackBase;
    STACK_MAX = stackMax;
  }
  function dynCall_iii(index, a1, a2) {
    index = index | 0;
    a1 = a1 | 0;
    a2 = a2 | 0;
    return FUNCTION_TABLE_iii[index & 3](a1 | 0, a2 | 0) | 0;
  }
  function setThrew(threw, value) {
    threw = threw | 0;
    value = value | 0;
    if (!__THREW__) {
      __THREW__ = threw;
      threwValue = value;
    }
  }
  function _crc32_update($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    return (
      (HEAP32[(1856 + ((($0 >>> 24) ^ ($1 & 255)) << 2)) >> 2] ^ ($0 << 8)) | 0
    );
  }
  function _get8_packet($0) {
    $0 = $0 | 0;
    var $1 = 0;
    $1 = _get8_packet_raw($0) | 0;
    HEAP32[($0 + 1384) >> 2] = 0;
    return $1 | 0;
  }
  function _stb_vorbis_close($0) {
    $0 = $0 | 0;
    if ($0 | 0) {
      _vorbis_deinit($0);
      _setup_free($0, $0);
    }
    return;
  }
  function _setup_free($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    if (!(HEAP32[($0 + 68) >> 2] | 0)) _free($1);
    return;
  }
  function _stb_vorbis_js_close($0) {
    $0 = $0 | 0;
    _stb_vorbis_close(HEAP32[$0 >> 2] | 0);
    _free($0);
    return;
  }
  function _stb_vorbis_js_open() {
    var $0 = 0;
    $0 = _malloc(4) | 0;
    HEAP32[$0 >> 2] = 0;
    return $0 | 0;
  }
  function _flush_packet($0) {
    $0 = $0 | 0;
    do {} while ((_get8_packet_raw($0) | 0) != -1);
    return;
  }
  function _vorbis_validate($0) {
    $0 = $0 | 0;
    return ((_memcmp($0, 1538, 6) | 0) == 0) | 0;
  }
  function _error($0, $1) {
    $0 = $0 | 0;
    $1 = $1 | 0;
    HEAP32[($0 + 88) >> 2] = $1;
    return;
  }
  function _vorbis_alloc($0) {
    $0 = $0 | 0;
    return _setup_malloc($0, 1500) | 0;
  }
  function _ldexp($0, $1) {
    $0 = +$0;
    $1 = $1 | 0;
    return +(+_scalbn($0, $1));
  }
  function b0(p0, p1) {
    p0 = p0 | 0;
    p1 = p1 | 0;
    abort(0);
    return 0;
  }
  function setTempRet0(value) {
    value = value | 0;
    tempRet0 = value;
  }
  function stackRestore(top) {
    top = top | 0;
    STACKTOP = top;
  }
  function _square($0) {
    $0 = +$0;
    return +($0 * $0);
  }
  function getTempRet0() {
    return tempRet0 | 0;
  }
  function stackSave() {
    return STACKTOP | 0;
  }
  function ___errno_location() {
    return 3376;
  }
  var FUNCTION_TABLE_iii = [b0, _point_compare, _uint32_compare, b0];
  return {
    ___errno_location: ___errno_location,
    _bitshift64Shl: _bitshift64Shl,
    _emscripten_replace_memory: _emscripten_replace_memory,
    _free: _free,
    _malloc: _malloc,
    _memcpy: _memcpy,
    _memset: _memset,
    _sbrk: _sbrk,
    _stb_vorbis_js_channels: _stb_vorbis_js_channels,
    _stb_vorbis_js_close: _stb_vorbis_js_close,
    _stb_vorbis_js_decode: _stb_vorbis_js_decode,
    _stb_vorbis_js_open: _stb_vorbis_js_open,
    _stb_vorbis_js_sample_rate: _stb_vorbis_js_sample_rate,
    dynCall_iii: dynCall_iii,
    establishStackSpace: establishStackSpace,
    getTempRet0: getTempRet0,
    runPostSets: runPostSets,
    setTempRet0: setTempRet0,
    setThrew: setThrew,
    stackAlloc: stackAlloc,
    stackRestore: stackRestore,
    stackSave: stackSave,
  };
})(Module.asmGlobalArg, Module.asmLibraryArg, buffer);
var ___errno_location = (Module["___errno_location"] =
  asm["___errno_location"]);
var _bitshift64Shl = (Module["_bitshift64Shl"] = asm["_bitshift64Shl"]);
var _emscripten_replace_memory = (Module["_emscripten_replace_memory"] =
  asm["_emscripten_replace_memory"]);
var _free = (Module["_free"] = asm["_free"]);
var _malloc = (Module["_malloc"] = asm["_malloc"]);
var _memcpy = (Module["_memcpy"] = asm["_memcpy"]);
var _memset = (Module["_memset"] = asm["_memset"]);
var _sbrk = (Module["_sbrk"] = asm["_sbrk"]);
var _stb_vorbis_js_channels = (Module["_stb_vorbis_js_channels"] =
  asm["_stb_vorbis_js_channels"]);
var _stb_vorbis_js_close = (Module["_stb_vorbis_js_close"] =
  asm["_stb_vorbis_js_close"]);
var _stb_vorbis_js_decode = (Module["_stb_vorbis_js_decode"] =
  asm["_stb_vorbis_js_decode"]);
var _stb_vorbis_js_open = (Module["_stb_vorbis_js_open"] =
  asm["_stb_vorbis_js_open"]);
var _stb_vorbis_js_sample_rate = (Module["_stb_vorbis_js_sample_rate"] =
  asm["_stb_vorbis_js_sample_rate"]);
var establishStackSpace = (Module["establishStackSpace"] =
  asm["establishStackSpace"]);
var getTempRet0 = (Module["getTempRet0"] = asm["getTempRet0"]);
var runPostSets = (Module["runPostSets"] = asm["runPostSets"]);
var setTempRet0 = (Module["setTempRet0"] = asm["setTempRet0"]);
var setThrew = (Module["setThrew"] = asm["setThrew"]);
var stackAlloc = (Module["stackAlloc"] = asm["stackAlloc"]);
var stackRestore = (Module["stackRestore"] = asm["stackRestore"]);
var stackSave = (Module["stackSave"] = asm["stackSave"]);
var dynCall_iii = (Module["dynCall_iii"] = asm["dynCall_iii"]);
Module["asm"] = asm;
if (memoryInitializer) {
  if (!isDataURI(memoryInitializer)) {
    memoryInitializer = locateFile(memoryInitializer);
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module["readBinary"](memoryInitializer);
    HEAPU8.set(data, GLOBAL_BASE);
  } else {
    addRunDependency("memory initializer");
    var applyMemoryInitializer = function (data) {
      if (data.byteLength) data = new Uint8Array(data);
      HEAPU8.set(data, GLOBAL_BASE);
      if (Module["memoryInitializerRequest"])
        delete Module["memoryInitializerRequest"].response;
      removeRunDependency("memory initializer");
    };
    function doBrowserLoad() {
      Module["readAsync"](
        memoryInitializer,
        applyMemoryInitializer,
        function () {
          throw "could not load memory initializer " + memoryInitializer;
        }
      );
    }
    var memoryInitializerBytes = tryParseAsDataURI(memoryInitializer);
    if (memoryInitializerBytes) {
      applyMemoryInitializer(memoryInitializerBytes.buffer);
    } else if (Module["memoryInitializerRequest"]) {
      function useRequest() {
        var request = Module["memoryInitializerRequest"];
        var response = request.response;
        if (request.status !== 200 && request.status !== 0) {
          var data = tryParseAsDataURI(Module["memoryInitializerRequestURL"]);
          if (data) {
            response = data.buffer;
          } else {
            console.warn(
              "a problem seems to have happened with Module.memoryInitializerRequest, status: " +
                request.status +
                ", retrying " +
                memoryInitializer
            );
            doBrowserLoad();
            return;
          }
        }
        applyMemoryInitializer(response);
      }
      if (Module["memoryInitializerRequest"].response) {
        setTimeout(useRequest, 0);
      } else {
        Module["memoryInitializerRequest"].addEventListener("load", useRequest);
      }
    } else {
      doBrowserLoad();
    }
  }
}
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var calledMain = false;
dependenciesFulfilled = function runCaller() {
  if (!Module["calledRun"]) run();
  if (!Module["calledRun"]) dependenciesFulfilled = runCaller;
};
function run(args) {
  args = args || Module["arguments"];
  if (runDependencies > 0) {
    return;
  }
  preRun();
  if (runDependencies > 0) return;
  if (Module["calledRun"]) return;
  function doRun() {
    if (Module["calledRun"]) return;
    Module["calledRun"] = true;
    if (ABORT) return;
    ensureInitRuntime();
    preMain();
    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(function () {
      setTimeout(function () {
        Module["setStatus"]("");
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module["run"] = run;
function exit(status, implicit) {
  if (implicit && Module["noExitRuntime"] && status === 0) {
    return;
  }
  if (Module["noExitRuntime"]) {
  } else {
    ABORT = true;
    EXITSTATUS = status;
    STACKTOP = initialStackTop;
    exitRuntime();
    if (Module["onExit"]) Module["onExit"](status);
  }
  Module["quit"](status, new ExitStatus(status));
}
var abortDecorators = [];
function abort(what) {
  if (Module["onAbort"]) {
    Module["onAbort"](what);
  }
  if (what !== undefined) {
    out(what);
    err(what);
    what = JSON.stringify(what);
  } else {
    what = "";
  }
  ABORT = true;
  EXITSTATUS = 1;
  throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
}
Module["abort"] = abort;
if (Module["preInit"]) {
  if (typeof Module["preInit"] == "function")
    Module["preInit"] = [Module["preInit"]];
  while (Module["preInit"].length > 0) {
    Module["preInit"].pop()();
  }
}
Module["noExitRuntime"] = true;
run();
(function (Module) {
  var initializeP = new Promise(function (resolve) {
    if (typeof useWasm !== "undefined") {
      Module.onRuntimeInitialized = function () {
        var fs = {};
        fs.open = Module.cwrap("stb_vorbis_js_open", "number", []);
        fs.close = Module.cwrap("stb_vorbis_js_close", "void", ["number"]);
        fs.channels = Module.cwrap("stb_vorbis_js_channels", "number", [
          "number",
        ]);
        fs.sampleRate = Module.cwrap("stb_vorbis_js_sample_rate", "number", [
          "number",
        ]);
        fs.decode = Module.cwrap("stb_vorbis_js_decode", "number", [
          "number",
          "number",
          "number",
          "number",
          "number",
        ]);
        resolve(fs);
      };
      return;
    }
    var fs = {};
    fs.open = Module["_stb_vorbis_js_open"];
    fs.close = Module["_stb_vorbis_js_close"];
    fs.channels = Module["_stb_vorbis_js_channels"];
    fs.sampleRate = Module["_stb_vorbis_js_sample_rate"];
    fs.decode = Module["_stb_vorbis_js_decode"];
    resolve(fs);
  });
  function arrayBufferToHeap(buffer, byteOffset, byteLength) {
    var ptr = Module._malloc(byteLength);
    var heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, byteLength);
    heapBytes.set(new Uint8Array(buffer, byteOffset, byteLength));
    return heapBytes;
  }
  function ptrToInt32(ptr) {
    var a = new Int32Array(Module.HEAPU8.buffer, ptr, 1);
    return a[0];
  }
  function ptrToFloat32(ptr) {
    var a = new Float32Array(Module.HEAPU8.buffer, ptr, 1);
    return a[0];
  }
  function ptrToInt32s(ptr, length) {
    var buf = new ArrayBuffer(length * Int32Array.BYTES_PER_ELEMENT);
    var copied = new Int32Array(buf);
    copied.set(new Int32Array(Module.HEAPU8.buffer, ptr, length));
    return copied;
  }
  function ptrToFloat32s(ptr, length) {
    var buf = new ArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT);
    var copied = new Float32Array(buf);
    copied.set(new Float32Array(Module.HEAPU8.buffer, ptr, length));
    return copied;
  }
  function concatArrays(arr1, arr2) {
    if (!arr1) {
      arr1 = new ArrayBuffer();
    }
    if (!arr2) {
      arr2 = new ArrayBuffer();
    }
    var newArr = new Uint8Array(arr1.byteLength + arr2.byteLength);
    if (arr1 instanceof ArrayBuffer) {
      newArr.set(new Uint8Array(arr1), 0);
    } else if (arr1 instanceof Uint8Array) {
      newArr.set(arr1, 0);
    } else {
      throw "not reached";
    }
    if (arr2 instanceof ArrayBuffer) {
      newArr.set(new Uint8Array(arr2), arr1.byteLength);
    } else if (arr2 instanceof Uint8Array) {
      newArr.set(arr2, arr1.byteLength);
    } else {
      throw "not reached";
    }
    return newArr;
  }
  var sessions = {};
  self.addEventListener("message", function (event) {
    initializeP.then(function (funcs) {
      var statePtr = null;
      if (event.data.id in sessions) {
        statePtr = sessions[event.data.id].state;
      } else {
        statePtr = funcs.open();
        sessions[event.data.id] = { state: statePtr, input: null };
      }
      sessions[event.data.id].input = concatArrays(
        sessions[event.data.id].input,
        event.data.buf
      );
      while (sessions[event.data.id].input.byteLength > 0) {
        var input = sessions[event.data.id].input;
        var copiedInput = null;
        var chunkLength = Math.min(65536, input.byteLength);
        if (input instanceof ArrayBuffer) {
          copiedInput = arrayBufferToHeap(input, 0, chunkLength);
        } else if (input instanceof Uint8Array) {
          copiedInput = arrayBufferToHeap(
            input.buffer,
            input.byteOffset,
            chunkLength
          );
        }
        var outputPtr = Module._malloc(4);
        var readPtr = Module._malloc(4);
        var length = funcs.decode(
          statePtr,
          copiedInput.byteOffset,
          copiedInput.byteLength,
          outputPtr,
          readPtr
        );
        Module._free(copiedInput.byteOffset);
        var read = ptrToInt32(readPtr);
        Module._free(readPtr);
        sessions[event.data.id].input = input.slice(read);
        var result = {
          id: event.data.id,
          data: null,
          sampleRate: 0,
          eof: false,
          error: null,
        };
        if (length < 0) {
          result.error = "stbvorbis decode failed: " + length;
          postMessage(result);
          funcs.close(statePtr);
          delete sessions[event.data.id];
          Module._free(outputPtr);
          return;
        }
        var channels = funcs.channels(statePtr);
        if (channels > 0) {
          var dataPtrs = ptrToInt32s(ptrToInt32(outputPtr), channels);
          result.data = new Array(dataPtrs.length);
          for (var i = 0; i < dataPtrs.length; i++) {
            result.data[i] = ptrToFloat32s(dataPtrs[i], length);
            Module._free(dataPtrs[i]);
          }
        }
        Module._free(ptrToInt32(outputPtr));
        Module._free(outputPtr);
        if (read === 0) {
          break;
        }
        if (result.sampleRate === 0) {
          result.sampleRate = funcs.sampleRate(statePtr);
        }
        postMessage(
          result,
          result.data.map(function (array) {
            return array.buffer;
          })
        );
      }
      if (event.data.eof) {
        var len = sessions[event.data.id].input.length;
        if (len) {
          console.warn(
            "not all the input data was decoded. remaining: " + len + "[bytes]"
          );
        }
        var result = {
          id: event.data.id,
          data: null,
          sampleRate: 0,
          eof: true,
          error: null,
        };
        postMessage(result);
        funcs.close(statePtr);
        delete sessions[event.data.id];
      }
    });
  });
})(Module);
