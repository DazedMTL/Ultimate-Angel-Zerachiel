//=============================================================================
// MessageBackLog.js
// Copyright (c) 2023- Lulu
//=============================================================================

/*:ja
 * @plugindesc メッセージバックログ機能を実装するよ。
 * @author Lulu
 *
 * @help
 *
 * _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
 *
 * ========================================
 * 以下ヘルプ
 * ========================================
 *
 * このプラグインはメッセージ系プラグインよりも下に配置してください。
 * 9/26追記　IZ_MessageWindow.jsよりも下に配置することで競合対策が有効となります。
 *
 * 9/16追記　MessageWindowHidden.jsよりも下に配置することで競合対策が有効となります。
 *
 * このプラグインを適用するとメッセージウィンドウが開いているときにプラグインパラ
 * メータ「バックログキー」にて指定したキーを押下することでバックログが表示されま
 * す。
 * バックログ画面の背景の画像は
 *
 * img/system/backlogBack.png
 *
 * として保存してください。
 * ボイスを再生するボタンとして使用する画像は
 *
 * img/system/backlogVoiceButton.png
 *
 * として保存してください。
 *
 *
 * @param s1
 * @text バックログキー
 * @desc メッセージ中バックログを開くキーを指定します。
 * @type combo
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @default shift
 *
 * @param sa1
 * @text バックログを閉じるキー
 * @desc バックログを閉じるキーを指定します。複数指定することができます。
 * @type combo[]
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @option cancel
 * @option Esc
 * @default ["cancel","Esc"]
 *
 * @param n1
 * @text 保存する最大のログ数
 * @desc ログとして保存しておく最大のメッセージ数を指定します。これを超えたメッセージはログから削除されます。
 * @type number
 * @default 20
 *
 * @param n2
 * @text バックログの文字の大きさ
 * @desc バックログウィンドウに表示する文字の大きさを指定します。
 * @type number
 * @default 28
 *
 * @param n3
 * @text バックログ表示範囲上余白
 * @desc バックログを表示する範囲の上の余白を幅を指定します。
 * @type number
 * @default 100
 *
 * @param n4
 * @text バックログスクロールバーの太さ
 * @desc バックログ横に表示するスクロールバーの幅を指定します。
 * @type number
 * @default 30
 *
 * @param s2
 * @text バックログスクロールバーの色
 * @desc バックログ横に表示するスクロールバーの表示色を16進数で指定します。
 * @default ffffff
 *
 * @param n5
 * @text 左にずらすスイッチ
 * @desc ログウィンドウに表示するテキストについて左にずらして表示するスイッチIDを指定します。
 * @type switch
 * @default 1
 *
 * @param n6
 * @text ずらす距離
 * @desc 特定のスイッチがONの際にずらす距離（ピクセル）を指定します。0で左端となります。
 * @min -999
 * @max 999
 * @type number
 * @default -200
 *
 */

{
  ("use strict");

  if (!AudioManager.playVoice) {
    throw new Error(
      "MessageBackLog.jsをSimpleVoice.jsより下部に配置してください。"
    );
  }

  const param = PluginManager.parameters("MessageBackLog");
  let _ = {};
  Object.keys(param).forEach((key) => {
    if (key[0] == "n" && key[1] == "a") {
      _[key] = param[key].toNumArray();
    } else if (key[0] == "n") {
      _[key] = Number(param[key]);
    } else if (key[0] == "s" && key[1] == "a" && key[2] == "a") {
      _[key] = JSON.parse(param[key]).map((str) => str.split(","));
    } else if (key[0] == "s" && key[1] == "a") {
      _[key] = JSON.parse(param[key]);
    } else if (key[0] == "s") {
      _[key] = param[key];
    } else if (key[0] == "a") {
      _[key] = param[key].toAudioParam();
    }
  });

  //23/04/18 追記
  Input.keyMapper[243] = "Esc";

  //-----------------------------------------------------------------------------
  // AudioManager
  //

  const _alias_AudioManager_playVoice = AudioManager.playVoice;
  AudioManager.playVoice = function (voice, loop, channel) {
    _alias_AudioManager_playVoice.call(this, voice, loop, channel);
    if (!loop) {
      $gameSystem.nearVoiceInfo = [voice, loop, channel];
    }
    if (voice.name) {
      const buffer = this._voiceBuffers[this._voiceBuffers.length - 1];
      buffer.forSimpleVoiceLoopInfo = loop;
    }
  };

  AudioManager.reservedVoiceTimeoutArray = [];
  AudioManager._savedLoopVoice = [];

  //23/04/18 追記
  AudioManager.stopAllAndSave = function () {
    AudioManager.filterPlayingVoice();
    AudioManager._savedLoopVoice = this._voiceBuffers
      .filter((webaudio) => webaudio._loop)
      .map((webaudio) => {
        return [
          {
            name: webaudio.name,
            volume: webaudio._volume * 100,
            pitch: webaudio._pitch * 100,
            pan: webaudio._pan * 100,
          },
          webaudio.channel,
        ];
      });
    AudioManager.reservedVoiceTimeoutArray.forEach((arr) => {
      if (!arr) {
        return;
      }
      clearTimeout(arr[1]);
      arr[1] = null;
    });
    AudioManager.stopVoice();
  };

  //23/04/18 追記
  AudioManager.replayReserveLoopVoice = function () {
    AudioManager.reservedVoiceTimeoutArray.forEach((arr) => {
      if (!arr) {
        return;
      }
      arr[0].execReserveVoice(arr[2], arr[3]);
    });
    AudioManager.reservedVoiceTimeoutArray = [];
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  const _alias_Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _alias_Game_Interpreter_pluginCommand.call(this, command, args);
    if (command == "SV_ボイスの演奏" || command == "SV_PLAY_VOICE") {
      const channel = args.length >= 5 ? Number(args[4]) : 2;
      $gameSystem.nearVoiceChannel = channel;
    }
  };

  //-----------------------------------------------------------------------------
  // Game_System
  //

  const _alias_Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _alias_Game_System_initialize.call(this);
    this.backLogInfo = [];
    this.nearVoiceInfo = null;
    this.nearVoiceChannel = 0;
  };

  Game_System.prototype.addToBackLog = function (text, fName, fIndex) {
    const voice = this.nearVoiceInfo ? this.nearVoiceInfo.concat() : null;
    //23/04/24 スイッチ追加
    this.backLogInfo.push([
      text,
      fName,
      fIndex,
      voice,
      !!$gameSwitches.value(_.n5),
    ]);
    if (_.n1 < this.backLogInfo.length) {
      this.backLogInfo.shift();
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Load
  //

  SceneManager.mBLFromSaveScene = false;

  const _alias_Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
  Scene_Load.prototype.onLoadSuccess = function () {
    _alias_Scene_Load_onLoadSuccess.call(this);
    SceneManager.mBLFromSaveScene = true;
  };

  //-----------------------------------------------------------------------------
  // Scene_Map
  //

  const _alias_Scene_Map_createAllWindows =
    Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function () {
    _alias_Scene_Map_createAllWindows.call(this);
    this.createBackLogWindow();
  };

  Scene_Map.prototype.createBackLogWindow = function () {
    this.backLogLayer = new Sprite();
    this.backLogLayer.visible = false;
    this.addChild(this.backLogLayer);
    this.backLogBack = new Sprite();
    this.backLogBack.bitmap = ImageManager.loadSystem("backlogBack");
    this.backLogLayer.addChild(this.backLogBack);
    this._backLogWindowLayer = new WindowLayer();
    this._backLogWindowLayer.move(
      0,
      _.n3,
      Graphics.width,
      Graphics.height - _.n3
    );
    this.backLogLayer.addChild(this._backLogWindowLayer);
    this.backLogwfvWindow = new Window_BackLogWithFaceAndVoice(
      0,
      _.n3,
      Graphics.width,
      Graphics.height * 10
    );
    this._backLogWindowLayer.addChild(this.backLogwfvWindow);
    this.backLogwfvWindow.y = 0;
    this._coverWindow = new Window_Base(0, 0, Graphics.width, _.n3);
    this._coverWindow.opacity = 0;
    this._backLogWindowLayer.addChild(this._coverWindow);
    this.backlogScrollSpeed = 0;
    this.initBacklogScrollSpeed = 0;
    this._scrollBarSprite = new Sprite_BackLogScrollBar();
    this._scrollBarSprite.x = Graphics.width - 60;
    this._scrollBarSprite.y = _.n3;
    this.backLogLayer.addChild(this._scrollBarSprite);
    this.openMessageBackLog = false;
  };

  Scene_Map.prototype.openBackLog = function () {
    this.openMessageBackLog = true;
    this.backLogLayer.visible = true;
    this.backLogwfvWindow.active = true;
    this._scrollBarSprite.refreshBarLength();
    this.backLogwfvWindow.initPos();
    this.backLogwfvWindow.refresh();
    //23/04/18 追記
    AudioManager.stopAllAndSave();
  };

  Scene_Map.prototype.closeBackLog = function () {
    this.openMessageBackLog = false;
    AudioManager.stopVoice(null, $gameSystem.nearVoiceChannel);
    this.backLogLayer.visible = false;
    this.backLogwfvWindow.active = false;
    //23/04/18 追記
    AudioManager.replayReserveLoopVoice();
    if (AudioManager._savedLoopVoice.length != 0) {
      AudioManager._savedLoopVoice.forEach((a) =>
        AudioManager.playVoice(a[0], true, a[1])
      );
      AudioManager._savedLoopVoice = [];
    }
  };

  const _alias_Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _alias_Scene_Map_update.call(this);
    this.updateBackLogMouseWheel();
    this.updateScrollByKey();
    this.updateScroll();
    this.updateTouchScrollArea();
  };

  Scene_Map.prototype.updateBackLogMouseWheel = function () {
    if (!this.backLogLayer.visible) {
      return;
    }
    const threshold = 20;
    if (Math.abs(TouchInput.wheelY) >= threshold) {
      const plus =
        this.backlogScrollSpeed > 0 &&
        this.initBacklogScrollSpeed < TouchInput.wheelY;
      const minus =
        this.backlogScrollSpeed < 0 &&
        this.initBacklogScrollSpeed > TouchInput.wheelY;
      const stopPlus = this.backlogScrollSpeed < 0 && TouchInput.wheelY > 0;
      const stopMinus = this.backlogScrollSpeed > 0 && TouchInput.wheelY < 0;
      if (
        plus ||
        minus ||
        stopPlus ||
        stopMinus ||
        this.backlogScrollSpeed == 0
      ) {
        this.backlogScrollSpeed = Math.round(TouchInput.wheelY / 8);
        this.initBacklogScrollSpeed = TouchInput.wheelY;
      }
    }
  };

  Scene_Map.prototype.updateScrollByKey = function () {
    if (Input.isTriggered("up")) {
      this.backlogScrollSpeed = this.initBacklogScrollSpeed = -13;
    } else if (Input.isTriggered("down")) {
      this.backlogScrollSpeed = this.initBacklogScrollSpeed = 13;
    }
  };

  Scene_Map.prototype.updateScroll = function () {
    if (this.backlogScrollSpeed == 0) {
      return;
    }
    const mh =
      (Window_Base._faceHeight + _.n2) * ($gameSystem.backLogInfo.length - 1);
    this.backLogwfvWindow.y = (
      this.backLogwfvWindow.y - this.backlogScrollSpeed
    ).clamp(-mh, 0);
    this.backlogScrollSpeed -=
      this.backlogScrollSpeed / Math.abs(this.backlogScrollSpeed) / 2;
    if (this.backLogwfvWindow.y == 0 || this.backLogwfvWindow.y == -mh) {
      this.backlogScrollSpeed = 0;
    }
    if (Math.abs(this.backlogScrollSpeed) < 1) {
      this.backlogScrollSpeed = 0;
      this.initBacklogScrollSpeed = 0;
    }
  };

  Scene_Map.prototype.updateTouchScrollArea = function () {
    if (!TouchInput.isTriggered()) {
      return;
    }
    const [sx, sy] = [this._scrollBarSprite.x, this._scrollBarSprite.y];
    const h = Graphics.height - _.n3 - 100;
    const tx = TouchInput.x;
    const ty = TouchInput.y;
    if (sx <= tx && tx <= sx + _.n4) {
      if (sy <= ty && ty <= sy + _.n4) {
        this.backLogwfvWindow.y = 0;
      } else if (sy + _.n4 <= ty && ty <= sy + _.n4 * 2) {
        this.backLogwfvWindow.y += Graphics.height - _.n3;
        if (this.backLogwfvWindow.y > 0) {
          this.backLogwfvWindow.y = 0;
        }
      } else if (sy + h - _.n4 * 2 <= ty && ty <= sy + h - _.n4) {
        this.backLogwfvWindow.y -= Graphics.height - _.n3;
        if (
          this.backLogwfvWindow.y <
          -(Window_Base._faceHeight + _.n2) *
            ($gameSystem.backLogInfo.length - 1)
        ) {
          this.backLogwfvWindow.y =
            -(Window_Base._faceHeight + _.n2) *
            ($gameSystem.backLogInfo.length - 1);
        }
      } else if (sy + h - _.n4 <= ty && ty <= sy + h) {
        this.backLogwfvWindow.y =
          -(Window_Base._faceHeight + _.n2) *
          ($gameSystem.backLogInfo.length - 1);
      }
    }
    Input.update();
  };

  //-----------------------------------------------------------------------------
  // Window_BackLogWithFaceAndVoice
  //

  function Window_BackLogWithFaceAndVoice() {
    this.initialize.apply(this, arguments);
  }

  Window_BackLogWithFaceAndVoice.prototype = Object.create(
    Window_Base.prototype
  );
  Window_BackLogWithFaceAndVoice.prototype.constructor =
    Window_BackLogWithFaceAndVoice;

  Window_BackLogWithFaceAndVoice.prototype.initialize = function (
    x,
    y,
    width,
    height
  ) {
    this.buttonSpritesArr = [];
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.opacity = 0;
    this.refresh();
    this.active = false;
  };

  Window_BackLogWithFaceAndVoice.prototype.initPos = function () {
    const mh =
      -(Window_Base._faceHeight + _.n2) *
      Math.max(0, $gameSystem.backLogInfo.length - 2);
    this.y = mh;
  };

  Window_BackLogWithFaceAndVoice.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this.active && _.sa1.some((str) => Input.isTriggered(str))) {
      SceneManager._scene.closeBackLog();
    }
    const nv = AudioManager._voiceBuffers.filter(
      (v) => v.channel == $gameSystem.nearVoiceChannel
    );
    if (this.startVoiceTime && nv.length != 0) {
      const v = nv[0];
      const dt = (Date.now() - this.startVoiceTime) / 1000;
      if (
        v._totalTime != 0 &&
        (Date.now() - this.startVoiceTime) / 1000 > v._totalTime
      ) {
        AudioManager._savedLoopVoice.forEach((a) =>
          AudioManager.playVoice(a[0], true, a[1])
        );
        AudioManager._savedLoopVoice = [];
        this.startVoiceTime = 0;
      }
    }
  };

  Window_BackLogWithFaceAndVoice.prototype.refresh = function () {
    this.contents.clear();
    const _this = this;
    this.buttonSpritesArr.forEach((sprite) => _this.removeChild(sprite));
    this.buttonSpritesArr = [];
    $gameSystem.backLogInfo.forEach((a, i) => {
      const h = (Window_Base._faceHeight + _.n2) * i;
      const s = 50;
      const st = this.standardPadding();
      //23/04/24 引数４追加
      const diffX = a[4] ? _.n6 : 200;
      this.drawTextEx(a[0], diffX, h);
      this.drawFace(a[1], a[2], s, h);
      if (a[3]) {
        const sprite = new Sprite_VoiceButton();
        sprite.setColdFrame(0, 0, s, s);
        sprite.setHotFrame(0, 0, s, s);
        sprite.x = st;
        sprite.y = h + st;
        const _this = this;
        const func = function (args) {
          AudioManager.playVoice(args, false, $gameSystem.nearVoiceChannel);
          if (AudioManager._savedLoopVoice.length != 0) {
            return;
          }
          _this.startVoiceTime = Date.now();
          AudioManager._savedLoopVoice = [];
          AudioManager._voiceBuffers.forEach((v) => {
            if (v.forSimpleVoiceLoopInfo) {
              AudioManager.stopVoice(null, v.channel);
              var voice = {};
              voice.name = v.name;
              voice.volume = (100 * v._volume) / 0.4;
              voice.pitch = 100 * v._pitch;
              voice.pan = 100 * v._pan;
              AudioManager._savedLoopVoice.push([voice, v.channel]);
            }
          });
          $gameSystem.nearVoiceInfo = null;
        };
        sprite.setClickHandler(func, a[3]);
        this.buttonSpritesArr.push(sprite);
        this.addChild(sprite);
        sprite.setHoverSprite();
      }
    });
  };

  Window_BackLogWithFaceAndVoice.prototype.drawTextEx = function (text, x, y) {
    if (text) {
      var textState = { index: 0, x: x, y: y, left: x };
      textState.text = this.convertEscapeCharacters(text);
      textState.height = this.calcTextHeight(textState, false);
      this.resetFontSettings();
      this.contents.fontSize = _.n2;
      while (textState.index < textState.text.length) {
        this.processCharacter(textState);
      }
      return textState.x - x;
    } else {
      return 0;
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_BackLogScrollBar
  //

  function Sprite_BackLogScrollBar() {
    this.initialize.apply(this, arguments);
  }

  Sprite_BackLogScrollBar.prototype = Object.create(Sprite.prototype);
  Sprite_BackLogScrollBar.prototype.constructor = Sprite_BackLogScrollBar;

  Sprite_BackLogScrollBar.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.createScrollBar();
  };

  Sprite_BackLogScrollBar.prototype.createScrollBar = function () {
    const c = "#" + _.s2;
    const h = Graphics.height - _.n3 - 100;
    this.bitmap = new Bitmap(_.n4, h);
    this.bitmap.fillAll(c);
    this.bitmap.clearRect(1, 1, _.n4 - 2, h - 2, c);
    this.bitmap.fillRect(0, _.n4, _.n4, 1, c);
    this.bitmap.fillRect(0, _.n4 * 2, _.n4, 1, c);
    this.bitmap.fillRect(0, h - _.n4, _.n4, 1, c);
    this.bitmap.fillRect(0, h - _.n4 * 2, _.n4, 1, c);

    for (let i = 0; i < _.n4 / 2; i++) {
      this.bitmap.fillRect(_.n4 / 2 - Math.round(i / 2), _.n4 / 8 + i, i, 1, c);
    }
    for (let i = 0; i < _.n4 / 2; i++) {
      if ((_.n4 * 3) / 8 + i >= (_.n4 * 5) / 8) {
        this.bitmap.fillRect(
          _.n4 / 2 - Math.round(i / 2),
          (_.n4 * 3) / 8 + i,
          i,
          1,
          c
        );
      }
    }
    for (let i = 0; i < _.n4 / 2; i++) {
      this.bitmap.fillRect(
        _.n4 / 2 - Math.round(i / 2),
        (_.n4 * 5) / 4 + i,
        i,
        1,
        c
      );
    }
    for (let i = 0; i < _.n4 / 2; i++) {
      this.bitmap.fillRect(
        _.n4 / 4 + Math.round(i / 2),
        h - _.n4 / 2 - _.n4 / 8 + i,
        _.n4 / 2 - i,
        1,
        c
      );
    }
    for (let i = 0; i < _.n4 / 2; i++) {
      if ((_.n4 * 3) / 8 + i + 1 <= (_.n4 * 5) / 8) {
        this.bitmap.fillRect(
          _.n4 / 4 + Math.round(i / 2),
          h - _.n4 / 2 - (_.n4 * 3) / 8 + i,
          _.n4 / 2 - i,
          1,
          c
        );
      }
    }
    for (let i = 0; i < _.n4 / 2; i++) {
      this.bitmap.fillRect(
        _.n4 / 4 + Math.round(i / 2),
        h - (_.n4 * 3) / 2 - _.n4 / 4 + i,
        _.n4 / 2 - i,
        1,
        c
      );
    }
    this.bar = new Sprite();
    this.bar.bitmap = new Bitmap(_.n4, Graphics.height);
    this.addChild(this.bar);
    this.refreshBarLength();
  };

  Sprite_BackLogScrollBar.prototype.refreshBarLength = function () {
    this.bar.bitmap.clear();
    const mh =
      (Window_Base._faceHeight + _.n2) * $gameSystem.backLogInfo.length;
    const h = Graphics.height - _.n3 - 100;
    this.barH = (h - _.n4 * 4) / Math.max(mh / (Graphics.height - _.n3), 1);
    this.bar.bitmap.fillRect(0, 0, _.n4, this.barH, "#" + _.s2);
    this.bar.y = _.n4 * 2;
  };

  Sprite_BackLogScrollBar.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateScrollBar();
  };

  Sprite_BackLogScrollBar.prototype.updateScrollBar = function () {
    if ($gameSystem.backLogInfo.length < 3) {
      return;
    }
    const wy = SceneManager._scene.backLogwfvWindow.y;
    const mh =
      -(Window_Base._faceHeight + _.n2) * ($gameSystem.backLogInfo.length - 1);
    const h = Graphics.height - _.n3 - 100;
    this.bar.y = ((h - this.barH - _.n4 * 4) * wy) / mh + _.n4 * 2;
  };

  //-----------------------------------------------------------------------------
  // Sprite_VoiceButton
  //

  function Sprite_VoiceButton() {
    this.initialize.apply(this, arguments);
  }

  Sprite_VoiceButton.prototype = Object.create(Sprite_Button.prototype);
  Sprite_VoiceButton.prototype.constructor = Sprite_VoiceButton;

  Sprite_VoiceButton.prototype.initialize = function () {
    Sprite_Button.prototype.initialize.call(this);
    this.bitmap = ImageManager.loadSystem("backlogVoiceButton");
  };

  Sprite_VoiceButton.prototype.setHoverSprite = function () {
    this.hoverSprite = new Sprite();
    this.hoverSprite.bitmap = ImageManager.loadSystem(
      "hoverBacklogVoiceButton"
    );
    this.hoverSprite.visible = false;
    this.hoverSprite.x = this.x;
    this.hoverSprite.y = this.y;
    this.parent.addChild(this.hoverSprite);
  };

  Sprite_VoiceButton.prototype.setClickHandler = function (
    method,
    args = null
  ) {
    this._clickHandler = method;
    this._args = args;
  };

  Sprite_VoiceButton.prototype.callClickHandler = function () {
    if (this._clickHandler) {
      this._clickHandler(...this._args);
    }
  };

  const _alias_Sprite_VoiceButton_update = Sprite_VoiceButton.prototype.update;
  Sprite_VoiceButton.prototype.update = function () {
    _alias_Sprite_VoiceButton_update.call(this);
    this.updateHover();
  };

  Sprite_VoiceButton.prototype.updateHover = function () {
    if (this.visible && this.isButtonHovered()) {
      this.hoverSprite.visible = true;
      this.visible = false;
    } else if (!this.visible && !this.isButtonHovered()) {
      this.hoverSprite.visible = false;
      this.visible = true;
    }
  };

  Sprite_VoiceButton.prototype.isButtonHovered = function () {
    var x = this.canvasToLocalX(TouchInput._hoverX);
    var y = this.canvasToLocalY(TouchInput._hoverY);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  };

  Sprite_VoiceButton.prototype.isActive = function () {
    var node = this.parent;
    while (node) {
      if (!node.visible) {
        return false;
      }
      node = node.parent;
    }
    return true;
  };

  const _alais_TouchInput_onMouseMove = TouchInput._onMouseMove;
  TouchInput._onMouseMove = function (event) {
    _alais_TouchInput_onMouseMove.call(this, event);
    this._hoverX = Graphics.pageToCanvasX(event.pageX);
    this._hoverY = Graphics.pageToCanvasY(event.pageY);
  };

  //-----------------------------------------------------------------------------
  // Window_Message
  //

  if (typeof Game_System.prototype.setChapterTitle == "undefined") {
    const _alias_Window_Message_startMessage =
      Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
      const text = this.convertEscapeCharacters($gameMessage.allText());
      $gameSystem.addToBackLog(
        text,
        $gameMessage._subValFaceName,
        $gameMessage._subValFaceIndex
      );
      _alias_Window_Message_startMessage.call(this);
      $gameSystem.nearVoiceInfo = null;
    };
  } else {
    //NobleMushroom.js競合対策
    SceneManager.isChangedImplementationWindowMessageMethod = false;

    const _alias_Scene_Map_changeImplementationWindowMessage =
      Scene_Map.prototype.changeImplementationWindowMessage;
    Scene_Map.prototype.changeImplementationWindowMessage = function (type) {
      _alias_Scene_Map_changeImplementationWindowMessage.call(this, type);
      if (!SceneManager.isChangedImplementationWindowMessageMethod) {
        SceneManager.isChangedImplementationWindowMessageMethod = true;
        const _aluas_Window_Message_startMessage =
          Window_Message.prototype.startMessage;
        Window_Message.prototype.startMessage = function () {
          if (!SceneManager.mBLFromSaveScene) {
            const text = this.convertEscapeCharacters($gameMessage.allText());
            $gameSystem.addToBackLog(
              text,
              $gameMessage._subValFaceName,
              $gameMessage._subValFaceIndex
            );
          }
          _aluas_Window_Message_startMessage.call(this);
          $gameSystem.nearVoiceInfo = null;
          SceneManager.mBLFromSaveScene = false;
        };
      }
    };

    const _alias_Window_Message_isTriggeredPause =
      Window_Message.prototype.isTriggeredPause;
    Window_Message.prototype.isTriggeredPause = function () {
      if (
        SceneManager._scene.backLogwfvWindow &&
        SceneManager._scene.backLogwfvWindow.active
      ) {
        return false;
      }
      return _alias_Window_Message_isTriggeredPause.call(this);
    };
  }

  const _alis_Window_Message_updateInput = Window_Message.prototype.updateInput;
  Window_Message.prototype.updateInput = function () {
    if (this.isAnySubWindowActive()) {
      return true;
    }
    this.updateBacklogInput();
    return _alis_Window_Message_updateInput.call(this);
  };

  Window_Message.prototype.updateBacklogInput = function () {
    if (!this.pause) return;
    if (SceneManager._scene.constructor != Scene_Map) {
      return;
    }
    if (Input.isTriggered(_.s1)) {
      SceneManager._scene.openBackLog();
      Input.update();
    }
  };

  const _alias_Window_Message_isAnySubWindowActive =
    Window_Message.prototype.isAnySubWindowActive;
  Window_Message.prototype.isAnySubWindowActive = function () {
    const d = _alias_Window_Message_isAnySubWindowActive.call(this);
    if (SceneManager._scene.constructor == Scene_Map) {
      return d || SceneManager._scene.backLogwfvWindow.active;
    } else {
      return d;
    }
  };

  //=====================================
  //以下MessageWindowHidden.js競合対策
  //=====================================

  if (Window_Message.prototype.disableWindowHidden) {
    const _alias_Window_Message_disableWindowHidden =
      Window_Message.prototype.disableWindowHidden;
    Window_Message.prototype.disableWindowHidden = function () {
      const d = _alias_Window_Message_disableWindowHidden.call(this);
      if (SceneManager._scene.constructor == Scene_Map) {
        return d || SceneManager._scene.backLogLayer.visible;
      } else {
        return d;
      }
    };
  }

  //=====================================
  //以下IZ_MessageWindow.js競合対策
  //=====================================

  const _alias_Game_Message_clear = Game_Message.prototype.clear;
  Game_Message.prototype.clear = function () {
    _alias_Game_Message_clear.call(this);
    this._subValFaceName = "";
    this._subValFaceIndex = 0;
  };

  const _alias_Game_Message_setFaceImage = Game_Message.prototype.setFaceImage;
  Game_Message.prototype.setFaceImage = function (faceName, faceIndex) {
    this._subValFaceName = faceName;
    this._subValFaceIndex = faceIndex;
    _alias_Game_Message_setFaceImage.call(this, faceName, faceIndex);
  };

  const _alias_Window_Message_loadMessageFace =
    Window_Message.prototype.loadMessageFace;
  Window_Message.prototype.loadMessageFace = function () {
    _alias_Window_Message_loadMessageFace.call(this);
    this._faceBitmap = ImageManager.loadFace($gameMessage._subValFaceName);
  };
}
