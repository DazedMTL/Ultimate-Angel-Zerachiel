//=============================================================================
// TRP_CustomWindow.js
//=============================================================================
/*:
 * @plugindesc カスタム情報ウィンドウ
 * @author Thirop
 * @help
 * 詳しい使い方はマニュアルを参照してください。
 * https://ci-en.net/creator/2170/article/176787
 *
 * 【更新履歴】
 * 1.02 2021/6/7  新規に導入時に古いセーブのロード不具合修正
 * 1.01 2020/1/25 制御文字に関する変換エラー回避設定追加
 * 1.00 2020/1/17 初版。
 *
 * @param useCoreConvertCharacter
 * @text 制御文字変換方法
 * @desc ONにすると制御文字変換の機能を制限してconvertEscapeCharactersに関するエラーを回避。
 * @default true
 * @type Boolean
 *
 */
//=============================================================================

var $gameCustomWindows = null;

function Game_CustomWindows() {
  this.initialize.apply(this, arguments);
}
function Game_WindowSetting() {
  this.initialize.apply(this, arguments);
}

(function () {
  var parameters = PluginManager.parameters("TRP_CustomWindow");
  var useCoreConvertCharacter = parameters.useCoreConvertCharacter === "true";

  function convertEscapeCharacters(text) {
    if (parameters.useCoreConvertCharacter === "true") {
      text = text.replace(/\\/g, "\x1b");
      text = text.replace(/\x1b\x1b/g, "\\");
      text = text.replace(
        /\x1bV\[(\d+)\]/gi,
        function () {
          return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this)
      );
      text = text.replace(
        /\x1bV\[(\d+)\]/gi,
        function () {
          return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this)
      );
      text = text.replace(
        /\x1bN\[(\d+)\]/gi,
        function () {
          return this.actorName(parseInt(arguments[1]));
        }.bind(this)
      );
      text = text.replace(
        /\x1bP\[(\d+)\]/gi,
        function () {
          return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this)
      );
      text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    } else {
      text = Window_Base.prototype.convertEscapeCharacters.call(this, text);
    }

    text = text.replace(
      /\x1bS\[(\d+)\](.*?):(.*?)(?:\x1bS|$)/gi,
      function () {
        var flag = $gameSwitches.value(parseInt(arguments[1]));
        if (flag) {
          return arguments[2] || "";
        } else {
          return arguments[3] || "";
        }
      }.bind(this)
    );
    return text;
  }

  function supplement(defaultValue, optionArg) {
    if (optionArg === undefined) {
      return defaultValue;
    }
    return optionArg;
  }
  function supplementNum(defaultValue, optionArg) {
    return Number(supplement(defaultValue, optionArg));
  }
  function supplementDef(defaultValue, optionArg, otherWords) {
    var value = supplement(defaultValue, optionArg);
    var defTargetWords = otherWords || [];
    defTargetWords.push("default");
    defTargetWords.push("def");
    defTargetWords.push("d");
    for (var i = 0; i < defTargetWords.length; i++) {
      var target = defTargetWords[i];
      if (value === target) {
        value = defaultValue;
        break;
      }
    }
    return value;
  }
  function supplementDefNum(defaultValue, optionArg, otherWords) {
    var value = supplementDef(defaultValue, optionArg, otherWords);
    return Number(value);
  }
  function supplementDefBool(defaultValue, optionArg, otherWords) {
    var value = supplementDef(defaultValue, optionArg, otherWords);
    if (value === "true" || value === "t") {
      value = true;
    } else if (value === "false" || value === "f") {
      value = false;
    } else if (value) {
      value = true;
    } else {
      value = false;
    }
    return value;
  }

  function throwError(text) {
    throw new Error(text);
  }

  var PARTS_INDEX = {
    type: 0,
    width: 1,
    height: 2,
    format: 3,
    params: 4,
  };

  var PARTS_TYPE = {
    text: 0,
    テキスト: 0,
    image: 1,
    画像: 1,
  };

  //=============================================================================
  // Bitmap
  //=============================================================================
  Bitmap.prototype.drawTextEx = function (
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    align,
    iconSize,
    iconMargin
  ) {
    text = text.replace(/\\|\x1b/g, "");
    var elems = text.split(/((?:C|I|{|})(?:\[.*?\])*)/g);

    iconSize = iconSize || 24;
    iconMargin = iconMargin || 0;

    if (align && align !== "left") {
      var totalWidth = this.measureTextWidthEx(
        text,
        iconSize,
        iconMargin,
        elems
      );
      if (align === "right") {
        x += maxWidth - totalWidth;
      } else {
        //center
        x += Math.floor((maxWidth - totalWidth) / 2);
      }
    }

    var bx = x;
    var fontSize = this.fontSize;
    var maxWidth = 0;
    var elemLen = elems.length;
    var anyWindow = SceneManager._scene._windowLayer
      ? SceneManager._scene._windowLayer.children[0]
      : null;
    if (!anyWindow) {
      anyWindow = new Window_Base(0, 0, 1, 1);
    }

    for (var j = 0; j < elemLen; j = (j + 1) | 0) {
      var elem = elems[j];
      if (!elem) continue;

      if (elem[0] === "{") {
        this.fontSize += 6;
      } else if (elem[0] === "}") {
        this.fontSize -= 6;
      } else if (elem[1] === "[") {
        var escapeChara = elem[0];
        var code = elem.substr(2, elem.length - 3);
        switch (escapeChara) {
          case "C":
            if (isNaN(code)) {
              this.textColor = "rgb(" + code + ")";
            } else {
              this.textColor = anyWindow.textColor(Number(code));
            }
            break;
          case "I":
            this.drawIcon(
              Number(code),
              x,
              y + Math.floor((lineHeight - iconSize) / 2),
              iconSize,
              iconSize
            );
            x += iconSize + iconMargin;
            break;
        }
      } else {
        /*text*/
        this.drawText(elem, x, y, maxWidth, lineHeight);
        x += this.measureTextWidth(elem);
      }
    }
    this.fontSize = fontSize;
    return x;
  };
  Bitmap.prototype.measureTextWidthEx = function (
    text,
    iconSize,
    iconMargin,
    elems
  ) {
    elems = elems || this.makeDrawTextInfo(text);
    iconSize = iconSize || 24;
    iconMargin = iconMargin || 0;

    var x = 0;
    var fontSize = this.fontSize;

    var elemLen = elems.length;
    for (var j = 0; j < elemLen; j = (j + 1) | 0) {
      var elem = elems[j];
      if (!elem) continue;
      if (elem === "{") {
        this.fontSize += 4;
      } else if (elem === "}") {
        this.fontSize -= 4;
      } else if (elem[1] === "[") {
        var escapeChara = elem[0];
        var code = elem.substr(2, elem.length - 3);
        switch (escapeChara) {
          case "C":
            break;
          case "I":
            x += iconSize;
            break;
        }
      } else {
        //text
        x += this.measureTextWidth(elem);
      }
    }
    this.fontSize = fontSize;
    return x;
  };

  //=============================================================================
  // GameInterpreter
  //=============================================================================

  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command.toLowerCase() === "window" || command === "ウィンドウ") {
      $gameCustomWindows.processCommand(args);
      return;
    }
  };

  //=============================================================================
  // DataManager
  //=============================================================================
  var _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    _DataManager_createGameObjects.call(this);

    // TRP_CORE.setupTRPSkitConfigParametersIfNeeded();
    $gameCustomWindows = new Game_CustomWindows();
  };

  var _DataManager_makeSaveContents_ = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    var contents = _DataManager_makeSaveContents_.call(this);
    contents.customWindows = $gameCustomWindows;
    return contents;
  };
  var _DataManager_extractSaveContents_ = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents_.call(this, contents);
    $gameCustomWindows = contents.customWindows;
    if (!$gameCustomWindows) {
      $gameCustomWindows = new Game_CustomWindows();
    }
  };

  //=============================================================================
  // Game_CustomWindows
  //=============================================================================

  Game_CustomWindows.prototype.initialize = function () {
    this.clear();
  };
  Game_CustomWindows.prototype.clear = function () {
    this._windows = {};
    this._windowIds = [];
    this._parts = {};
    this._showingIds = [];
  };

  /* update
	===================================*/
  Game_CustomWindows.prototype.update = function () {
    var windowIds = this._windowIds;
    var length = windowIds.length;
    var windows = this._windows;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var id = windowIds[i];
      windows[id].update();
    }
  };

  /* interpret command
	===================================*/
  Game_CustomWindows.prototype.processCommand = function (args) {
    var i, length;
    var command = args.shift().toLowerCase();
    switch (command) {
      case "create":
      case "作成":
        this.commandCreateWindow(args);
        break;
      case "createparts":
      case "パーツ作成":
        this.commandCreateParts(args);
        break;
      case "setparts":
      case "パーツ設定":
        this.commandSetParts(args);
        break;
      case "registerparts":
      case "パーツ登録":
        this.commandRegisterParts(args);
        break;
      case "sprite":
      case "スプライト":
        this.commandUpdatePartsSprite(args);
        break;
      case "show":
      case "表示":
        this.commandShow(args);
        break;
      case "hide":
      case "非表示":
        this.commandHide(args);
        break;
      case "clear":
      case "クリア":
      case "廃棄":
        this.commandClear(args);
        break;
      case "pos":
      case "position":
      case "move":
      case "位置":
      case "移動":
        this.commandMove(args);
        break;
      case "relativepos":
      case "relativeposition":
      case "relativemove":
      case "相対位置":
      case "相対移動":
        this.commandRelativeMove(args);
        break;
    }
  };

  /* create
	===================================*/
  Game_CustomWindows.prototype.commandCreateWindow = function (args) {
    var id = supplementDef(0, args[0]);
    var width = supplementDefNum(0, args[1]);
    var height = supplementDefNum(0, args[2]);
    var underPicture = supplementDefBool(false, args[3]);
    var skippable = supplementDefBool(false, args[5]);

    if (this._windows[id]) {
      if (!skippable) {
        throwError("すでにウィンドウID" + id + "は作成されています。");
        return;
      }
    }
    var setting = new Game_WindowSetting(id, width, height, underPicture);
    this._windows[id] = setting;
    this._windowIds.push(id);
  };

  /* show & hide
	===================================*/
  Game_CustomWindows.prototype.commandShow = function (args) {
    var id = supplementDef(0, args[0]);
    var setting = this.settingWithCheckingError(id);

    var x, y;
    if (isNaN(args[1])) {
      var pos = args[1].toLowerCase();
      switch (pos) {
        case "leftup":
        case "upleft":
        case "左上":
          x = 0;
          y = 0;
          break;
        case "rightup":
        case "upright":
        case "右上":
          x = Graphics.boxWidth - setting.windowWidth();
          y = 0;
          break;
        case "leftdown":
        case "downleft":
        case "左下":
          x = 0;
          y = Graphics.boxHeight - setting.windowHeight();
          break;
        case "rightdown":
        case "downright":
        case "右下":
          x = Graphics.boxWidth - setting.windowWidth();
          y = Graphics.boxHeight - setting.windowHeight();
          break;
      }
    } else {
      x = supplementDefNum(0, args[1]);
      y = supplementDefNum(0, args[2]);
    }

    setting.show(x, y);

    if (!this._showingIds.contains(id)) {
      this._showingIds.push(id);
    }
  };
  Game_CustomWindows.prototype.commandHide = function (args) {
    var args0 = args[0].toLowerCase();
    var id, setting;
    if (Game_CustomWindows.TARGET_ALL_PARAMS.contains(args0)) {
      var ids = this._showingIds;
      var length = ids.length;
      for (var i = 0; i < length; i = (i + 1) | 0) {
        id = ids[i];
        setting = this.settingWithCheckingError(id);
        setting.hide();
      }
    } else {
      id = supplementDef(0, args[0]);
      setting = this.settingWithCheckingError(id);
      setting.hide();
    }
  };

  Game_CustomWindows.TARGET_ALL_PARAMS = ["all", "全て", "全部"];
  Game_CustomWindows.prototype.commandClear = function (args) {
    var args0 = args[0].toLowerCase();
    if (Game_CustomWindows.TARGET_ALL_PARAMS.contains(args0)) {
      this.clear();
    } else {
      var id = supplementDef(0, args[0]);
      var setting = this.settingWithCheckingError(id);
      setting.hide();

      delete this._windows[id];

      var index = this._windowIds.indexOf(id);
      if (index >= 0) {
        this._windowIds.splice(index, 1);
      }

      index = this._showingIds.indexOf(id);
      if (index >= 0) {
        this._showingIds.splice(index, 1);
      }
    }
  };

  /* move
	===================================*/
  Game_CustomWindows.prototype.commandMove = function (args) {
    var id = supplementDef(0, args[0]);
    var setting = this.settingWithCheckingError(id);

    var x = supplementDefNum(Graphics.boxWidth / 2, args[1]);
    var y = supplementDefNum(Graphics.boxHeight / 2, args[2]);
    var duration = supplementDefNum(0, args[3]);

    setting.move(x, y, duration, false);
  };
  Game_CustomWindows.prototype.commandRelativeMove = function (args) {
    var id = supplementDef(0, args[0]);
    var setting = this.settingWithCheckingError(id);

    var x = supplementDefNum(Graphics.boxWidth / 2, args[1]);
    var y = supplementDefNum(Graphics.boxHeight / 2, args[2]);
    var duration = supplementDefNum(0, args[3]);

    setting.move(x, y, duration, true);
  };

  /* parts
	===================================*/
  Game_CustomWindows.prototype.commandCreateParts = function (args) {
    var partsId = supplementDef(0, args.shift());
    var type = PARTS_TYPE[supplementDef(PARTS_TYPE.text, args.shift())];

    var width = supplementDefNum(200, args.shift());
    var height = supplementDefNum(100, args.shift());
    var format = args.shift();
    this.createParts(partsId, type, width, height, format);
  };

  Game_CustomWindows.prototype.createParts = function (
    partsId,
    type,
    width,
    height,
    format
  ) {
    this._parts[partsId] = [type, width, height, format || null, null];
  };

  //setParts
  Game_CustomWindows.prototype.commandSetParts = function (args) {
    var partsId = supplementDef(0, args.shift());
    var parts = this._parts[partsId];
    if (!parts) {
      throwError(
        "パーツID" +
          partsId +
          "が存在しません。パーツ作成コマンドを事前に実行して下さい。"
      );
      return;
    }

    var params = parts[PARTS_INDEX.params];
    if (!params) params = parts[PARTS_INDEX.params] = {};

    var length = args.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var elems = args[i].split(":");
      var key = elems[0];
      var value = elems[1];
      if (value.indexOf("eval_") === 0) {
        params[key] = eval(value.replace("eval_", ""));
      } else if (value === "true" || value === "t") {
        params[key] = true;
      } else if (value === "false" || value === "f") {
        params[key] = false;
      } else if (isNaN(elems[1])) {
        params[key] = value;
      } else {
        params[key] = Number(value);
      }
    }
  };

  //registerParts
  Game_CustomWindows.prototype.commandRegisterParts = function (args) {
    var id = supplementDef(0, args[0]);
    var partsId = supplementDef(0, args[1]);
    var x = supplementDefNum(0, args[2]);
    var y = supplementDefNum(0, args[3]);
    var format = args[4];

    var setting = this.settingWithCheckingError(id);
    setting.registerParts(partsId, x, y, format);
  };

  Game_CustomWindows.prototype.commandUpdatePartsSprite = function (args) {
    var windowId = args.shift();
    var setting = this.setting(windowId);
    if (!setting) {
      throwError("ウィンドウID「" + windowId + "」が存在しません。");
      return;
    }

    setting.updatePartsSprite(args);
  };

  /* accessor
	===================================*/
  Game_CustomWindows.prototype.settingWithCheckingError = function (id) {
    var setting = this.setting(id);
    if (!setting) {
      throwError("ウィンドウID「" + id + "」が存在しません。");
      return;
    }
    return setting;
  };
  Game_CustomWindows.prototype.setting = function (id) {
    return this._windows[id];
  };
  Game_CustomWindows.prototype.parts = function (id) {
    return this._parts[id];
  };
  Game_CustomWindows.prototype.showingIds = function () {
    return this._showingIds;
  };

  //=============================================================================
  // Game_WindowSetting
  //=============================================================================
  Game_WindowSetting.prototype.initialize = function (
    id,
    width,
    height,
    underPicture
  ) {
    this._id = id;
    this.clear();

    this._width = width;
    this._height = height;
    this._underPicture = underPicture || false;
    this._padding = 10;
  };

  Game_WindowSetting.prototype.clear = function () {
    this._showing = false;

    this._x = 0;
    this._y = 0;
    this._width = Graphics.boxWidth / 2;
    this._height = Graphics.boxHeight / 2;
    this._parts = [];
    this._changedIndexes = [];

    this._moving = null;
  };

  /* update
	===================================*/
  Game_WindowSetting.prototype.update = function () {
    //udpate move
    if (this._moving) {
      this._updateMoving();
    }

    if (!this._showing) return;
  };

  /* show & hide
	===================================*/
  Game_WindowSetting.prototype.show = function (x, y) {
    this._showing = true;
    this._x = supplement(this._x, x);
    this._y = supplement(this._y, y);
  };
  Game_WindowSetting.prototype.hide = function () {
    this._showing = false;
  };

  /* parts
	===================================*/
  Game_WindowSetting.prototype.registerParts = function (
    partsId,
    x,
    y,
    format
  ) {
    if (this._showing) {
      throw new Error("パーツ作成コマンドはウィンドウ表示前に行えます");
    }
    var partsData = $gameCustomWindows.parts(partsId);
    if (!partsData) {
      throw new Error(
        "パーツID:" +
          partsId +
          "が存在しません。パーツ作成コマンドを事前に実行して下さい。"
      );
    }

    format = format || partsData[PARTS_INDEX.format] || null;
    var parts = {
      id: partsId,
      x: x,
      y: y,
      format: format,
      params: {},
    };
    this._parts.push(parts);
  };

  Game_WindowSetting.prototype.updatePartsSprite = function (args) {
    var target = args.shift();
    var parts = null;
    var allParts = this._parts;
    var index = -1;
    if (isNaN(target)) {
      target = target.replace("id:", "");
      var length = allParts.length;
      for (var i = 0; i < length; i = (i + 1) | 0) {
        parts = allParts[i];
        if (parts.id === target) {
          index = i;
          break;
        }
      }
    } else {
      index = Number(target) - 1;
      parts = allParts[index];
    }

    if (index < 0) {
      throwError(
        "パーツ" +
          target +
          "が存在しません。パーツ作成コマンドを事前に実行して下さい。"
      );
      return;
    }

    if (!this._changedIndexes.contains(index)) {
      this._changedIndexes.push(index);
    }
    var length = args.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var elems = args[i].split(":");
      var key = elems[0];
      var value = elems[1];
      var paramObj = key === "x" || key === "y" ? parts : parts.params;

      if (value.indexOf("eval_") === 0) {
        paramObj[key] = eval(value.replace("eval_", ""));
      } else if (value === "true" || value === "t") {
        paramObj[key] = true;
      } else if (value === "false" || value === "f") {
        paramObj[key] = false;
      } else if (isNaN(elems[1])) {
        paramObj[key] = value;
      } else {
        paramObj[key] = Number(value);
      }
    }
  };

  /* move
	===================================*/
  Game_WindowSetting.prototype.move = function (x, y, duration, relative) {
    if (relative) {
      if (this._moving) {
        x += this._moving.x;
        y += this._moving.y;
      } else {
        x += this._x;
        y += this._y;
      }
    }
    if (duration <= 0) {
      this._x = x;
      this._y = y;
      this._moving = null;
    } else {
      this._moving = {
        x: x,
        y: y,
        duration: duration,
      };
    }
  };

  Game_WindowSetting.MOVE_ACCEL = 0.6;
  Game_WindowSetting.prototype._updateMoving = function () {
    var moving = this._moving;
    var d = moving.duration;
    var tx = moving.x;
    var ty = moving.y;
    this._x += (tx - this._x) / Math.pow(d, Game_WindowSetting.MOVE_ACCEL);
    this._y += (ty - this._y) / Math.pow(d, Game_WindowSetting.MOVE_ACCEL);

    moving.duration -= 1;
    if (moving.duration <= 0) {
      this._moving = null;
    }
  };

  /* accessor
	===================================*/
  Game_WindowSetting.prototype.x = function () {
    return this._x;
  };
  Game_WindowSetting.prototype.y = function () {
    return this._y;
  };
  Game_WindowSetting.prototype.isUnderPicture = function () {
    return this._underPicture;
  };
  Game_WindowSetting.prototype.padding = function () {
    return this._padding;
  };
  Game_WindowSetting.prototype.windowWidth = function () {
    return this._width + 2 * this._padding;
  };
  Game_WindowSetting.prototype.windowHeight = function () {
    return this._height + 2 * this._padding;
  };
  Game_WindowSetting.prototype.width = function () {
    return this._width;
  };
  Game_WindowSetting.prototype.height = function () {
    return this._height;
  };
  Game_WindowSetting.prototype.parts = function () {
    return this._parts;
  };
  Game_WindowSetting.prototype.isShowing = function () {
    return this._showing;
  };
  Game_WindowSetting.prototype.isPartsChanged = function () {
    return this._changedIndexes.length > 0;
  };
  Game_WindowSetting.prototype.changedPartsIndexes = function () {
    return this._changedIndexes;
  };
  Game_WindowSetting.prototype.didPartsUpdate = function () {
    this._changedIndexes.length = 0;
  };

  //=============================================================================
  // Scene_Map
  //=============================================================================
  var _Scene_Map_initialize = Scene_Map.prototype.initialize;
  Scene_Map.prototype.initialize = function () {
    _Scene_Map_initialize.call(this);
    this._trpCustomWindows = {};
    this._trpCustomWindowIds = [];
  };

  var _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);

    this.updateTrpCustomWindow();
  };

  Scene_Map.prototype.updateTrpCustomWindow = function () {
    $gameCustomWindows.update();

    var needsShowingIds = $gameCustomWindows.showingIds();
    var currentShowingIds = this._trpCustomWindowIds;
    var windows = this._trpCustomWindows;

    var length = needsShowingIds.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var id = needsShowingIds[i];
      if (!currentShowingIds.contains(id)) {
        this.addTrpCustomWindow(id);
        currentShowingIds.push(id);
      }
    }

    var length = currentShowingIds.length;
    for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
      var id = currentShowingIds[i];
      if (!needsShowingIds.contains(id)) {
        var closingWindow = windows[id];
        if (closingWindow.isClosed()) {
          this.removeTrpCustomWindow(id, closingWindow);
          currentShowingIds.splice(i, 1);
        }
      }
    }
  };

  Scene_Map.prototype.addTrpCustomWindow = function (id) {
    var window = new Window_TrpCustom(id);
    this._trpCustomWindows[id] = window;
    if (window.isUnderPicture()) {
      var parent = this._spriteset;
      var index = parent.children.indexOf(
        this._diceContainer || parent._pictureContainer
      );
      if (index >= 0) {
        parent.addChildAt(window, index);
      } else {
        parent.addChild(window);
      }
    } else {
      this.addWindow(window);
    }
  };

  Scene_Map.prototype.removeTrpCustomWindow = function (id, targetWindow) {
    this._trpCustomWindows[id] = null;
    var parent = targetWindow.isUnderPicture() ? null : this._windowLayer;
    var index = parent.children.indexOf(targetWindow);
    if (index >= 0) {
      parent.children.splice(index, 1);
    }
  };

  //=============================================================================
  // Window_TrpCustom
  //=============================================================================
  function Window_TrpCustom() {
    this.initialize.apply(this, arguments);
  }
  Window_TrpCustom.prototype = Object.create(Window_Base.prototype);
  Window_TrpCustom.prototype.constructor = Window_TrpCustom;
  Window_TrpCustom.prototype.initialize = function (windowId) {
    var setting = $gameCustomWindows.setting(windowId);
    this._setting = setting;

    var x = setting.x();
    var y = setting.y();
    var width = setting.windowWidth();
    var height = setting.windowHeight();

    Window_Base.prototype.initialize.call(this, x, y, width, height);

    this._variableObservers = [];
    this._switchObservers = [];

    this._partsIds = [];
    this._partsSprites = [];
    this._partsDrawRects = [];

    this.initAllParts();

    this.openness = 0;
    this.hidePartsSprites();
  };

  Window_TrpCustom.prototype.standardPadding = function () {
    return this._setting.padding();
  };

  /* parts
	===================================*/
  Window_TrpCustom.prototype.initAllParts = function () {
    this.contents.clear();

    var allParts = this._setting.parts();
    var length = allParts.length;

    for (var i = 0; i < length; i = (i + 1) | 0) {
      var parts = allParts[i];
      this._partsIds.push(parts.id);

      var format = parts.format;
      format = format.replace(/\\/g, "\x1b");
      format = format.replace(/\x1b\x1b/g, "\\");
      //check switched
      var match = format.match(/\x1bS\[(\d+)\]/gi);
      var value;
      if (match) {
        for (var j = 1; ; j = (j + 1) | 0) {
          value = RegExp["$" + j];
          if (!value) break;
          this.registerSwitchObserver(value, i);
        }
        value = RegExp.$1;
      }
      //check variables
      match = format.match(/\x1bV\[(\d+)\]/gi);
      if (match) {
        for (var j = 1; ; j = (j + 1) | 0) {
          value = RegExp["$" + j];
          if (!value) break;
          this.registerVariableObserver(value, i);
        }
      }
      this.refreshParts(i);
    }
    this.updateAllPartsSprites();
  };

  var DUMMY_PARAM = {};

  Window_TrpCustom.prototype.refreshParts = function (index) {
    var contents = this.contents;
    var parts = this._setting.parts()[index];

    var partsId = parts.id;
    var x = parts.x;
    var y = parts.y;
    var format = parts.format;
    format = convertEscapeCharacters(format);

    var partsData = $gameCustomWindows.parts(partsId);
    var type = partsData[PARTS_INDEX.type];
    var width = partsData[PARTS_INDEX.width];
    var height = partsData[PARTS_INDEX.height];
    var params = partsData[PARTS_INDEX.params] || DUMMY_PARAM;

    var sprite = null;
    var useSprite = params
      ? params.sprite || params["スプライト"] || false
      : false;
    var tx, ty;
    if (useSprite) {
      sprite = this._partsSprites[index];
      tx = 0;
      ty = 0;
      if (!sprite) {
        sprite = new Sprite();
        this._partsSprites[index] = sprite;
        if (params.underContents || params["コンテンツの下"]) {
          this.addChildAt(
            sprite,
            this.children.indexOf(this._windowContentsSprite)
          );
        } else {
          this.addChild(sprite);
        }
        sprite.x = x + this.padding;
        sprite.y = y + this.padding;
      } else if (sprite.bitmap && !sprite.bitmap._image) {
        sprite.bitmap.clear();
      }
    } else {
      tx = x;
      ty = y;

      //clear rect
      var rect = this._partsDrawRects[index];
      if (rect && rect.width && rect.height) {
        contents.clearRect(rect.x, rect.y, rect.width, rect.height);
      }
      this.registerDrawRects(index, x, y, width, height);
    }

    if (type === PARTS_TYPE.image) {
      this.refreshImageParts(
        index,
        sprite,
        contents,
        tx,
        ty,
        format,
        width,
        height,
        params
      );
    } else if (type === PARTS_TYPE.text) {
      this.refreshTextParts(
        index,
        sprite,
        contents,
        tx,
        ty,
        format,
        width,
        height,
        params
      );
    }
  };

  Window_TrpCustom.prototype.registerDrawRects = function (
    index,
    x,
    y,
    width,
    height
  ) {
    this._partsDrawRects[index] = {
      x: x,
      y: y,
      width: width,
      height: height,
    };
  };

  Window_TrpCustom.prototype.refreshTextParts = function (
    index,
    sprite,
    contents,
    x,
    y,
    format,
    width,
    height,
    params
  ) {
    var contents = sprite ? sprite.bitmap : this.contents;
    if (sprite && !contents) {
      contents = sprite.bitmap = new Bitmap(width, height);
    }

    var align = params.align || params["アライン"] || "left";
    switch (align) {
      case "左":
      case "左寄せ":
        align = "left";
        break;
      case "右":
      case "右寄せ":
        align = "right";
        break;
      case "中央":
      case "中央寄せ":
        align = "center";
        break;
    }

    contents.textColor = params.textColor || params["文字色"] || "white";
    contents.fontSize = params.fontSize || params["フォントサイズ"] || 24;
    contents.outlineWidth =
      params.outlineWidth || params["アウトライン幅"] || 4;
    contents.outlineColor =
      params.outlineColor || params["アウトライン色"] || "rgba(0,0,0,0.5)";
    contents.drawTextEx(format, x, y, width, height, align);
  };

  Window_TrpCustom.prototype.refreshImageParts = function (
    index,
    sprite,
    contents,
    x,
    y,
    format,
    width,
    height,
    params
  ) {
    var elems = format.split("/");
    var length = elems.length;
    var filename = elems[length - 1];
    var folder = "img/";
    if (length >= 2) {
      for (var i = 0; i < length - 1; i = (i + 1) | 0) {
        folder += elems[i] + "/";
      }
    } else {
      folder += "system/";
    }

    var contents = this.contents;
    var src = ImageManager.loadBitmap(folder, filename, 0, false);
    this.registerDrawRects(x, y, width, height);
    if (!sprite) {
      this.registerDrawRects(index, x, y, 0, 0);
    }
    src.addLoadListener(
      function () {
        var sw = src.width;
        var sh = src.height;
        if (sprite) {
          sprite.bitmap = src;
          if (width || height) {
            var scale = width / sw;
            sprite.scale.set(scale, height / sh || scale);
          }
        } else {
          var dw = width || src.width;
          var dh = height || src.height;
          contents.bltImage(src, 0, 0, sw, sh, x, y, dw, dh);
          this.registerDrawRects(index, x, y, dw, dh);
        }
      }.bind(this)
    );
  };

  /* observers
	===================================*/
  Window_TrpCustom.prototype.registerVariableObserver = function (
    variableId,
    partsIndex
  ) {
    var cache = $gameVariables.value(variableId);
    this._variableObservers.push([variableId, partsIndex, cache]);
  };
  Window_TrpCustom.prototype.registerSwitchObserver = function (
    switchId,
    partsIndex
  ) {
    var cache = $gameSwitches.value(switchId);
    this._switchObservers.push([switchId, partsIndex, cache]);
  };

  Window_TrpCustom.prototype.updateObservers = function () {
    var observers = this._variableObservers;
    var length = observers.length;

    var refreshedParts = [];
    var partsIndex;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var data = observers[i];
      if ($gameVariables.value(data[0]) !== data[2]) {
        partsIndex = data[1];
        data[2] = $gameVariables.value(data[0]);
        if (!refreshedParts.contains(partsIndex)) {
          this.refreshParts(partsIndex);
          refreshedParts.push(partsIndex);
        }
      }
    }

    observers = this._switchObservers;
    length = observers.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var data = observers[i];
      if ($gameSwitches.value(data[0]) !== data[2]) {
        partsIndex = data[1];
        data[2] = $gameSwitches.value(data[0]);
        if (!refreshedParts.contains(partsIndex)) {
          this.refreshParts(partsIndex);
          refreshedParts.push(partsIndex);
        }
      }
    }
  };

  /* update
	===================================*/
  Window_TrpCustom.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    var setting = this._setting;
    if (setting.isShowing()) {
      this.open();
      this.updateObservers();
    } else {
      this.close();
    }

    this.x = setting.x();
    this.y = setting.y();

    if (setting.isPartsChanged()) {
      this.updatePartsSprites();
    }
  };

  Window_TrpCustom.prototype.updateAllPartsSprites = function () {
    var setting = this._setting;
    var allParts = setting.parts();
    var length = allParts.length;
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var sprite = this._partsSprites[i];
      if (sprite) {
        var parts = allParts[i];
        this.updatePartsSprite(sprite, parts);
      }
    }
  };
  Window_TrpCustom.prototype.updatePartsSprites = function () {
    var setting = this._setting;
    var indexes = setting.changedPartsIndexes();
    var length = indexes.length;
    var allParts = setting.parts();
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var index = indexes[i];
      var sprite = this._partsSprites[index];
      if (sprite) {
        var parts = allParts[index];
        this.updatePartsSprite(sprite, parts);
      }
    }
    setting.didPartsUpdate();
  };
  Window_TrpCustom.prototype.updatePartsSprite = function (sprite, parts) {
    var params = parts.params;
    sprite.x = parts.x + this.padding;
    sprite.y = parts.y + this.padding;

    if (params.visible !== undefined) {
      sprite.visible = params.visible;
    }
    if (params.opacity !== undefined) {
      sprite.opacity = params.opacity;
    } else if (params["不透明度"] !== undefined) {
      sprite.opacity = params["不透明度"];
    }

    if (params.anchorX !== undefined) {
      sprite.anchor.x = params.anchorX;
    } else if (params["アンカーX"] !== undefined) {
      sprite.anchor.x = params["アンカーX"];
    }
    if (params.anchorY !== undefined) {
      sprite.anchor.y = params.anchorY;
    } else if (params["アンカーX"] !== undefined) {
      sprite.anchor.y = params["アンカーY"];
    }

    if (params.rotation !== undefined) {
      sprite.rotation = params.rotation;
    } else if (params["角度"] !== undefined) {
      sprite.rotation = (params["角度"] * Math.PI) / 180;
    } else if (params.angle !== undefined) {
      sprite.rotation = (params.angle * Math.PI) / 180;
    }
  };

  Window_TrpCustom.prototype.updateOpen = function () {
    var opening = this._opening;
    Window_Base.prototype.updateOpen.call(this);
    if (opening && !this._opening) {
      this.showPartsSprites();
    }
  };

  Window_TrpCustom.prototype.close = function () {
    Window_Base.prototype.close.call(this);
    this.hidePartsSprites();
  };

  Window_TrpCustom.prototype.showPartsSprites = function () {
    this._setPartsSpritesVisible(true);
  };
  Window_TrpCustom.prototype.hidePartsSprites = function () {
    this._setPartsSpritesVisible(false);
  };
  Window_TrpCustom.prototype._setPartsSpritesVisible = function (visible) {
    var sprites = this._partsSprites;
    var keys = Object.keys(sprites);
    var length = keys.length;
    var allParts = this._setting.parts();
    for (var i = 0; i < length; i = (i + 1) | 0) {
      var sprite = sprites[keys[i]];
      if (sprite) {
        if (visible === true) {
          var parts = allParts[i];
          if (parts.params.visible === false) {
            continue;
          }
        }
        sprite.visible = visible;
      }
    }
  };

  /* accessor
	===================================*/
  Window_TrpCustom.prototype.isUnderPicture = function () {
    return this._setting.isUnderPicture();
  };
})();
