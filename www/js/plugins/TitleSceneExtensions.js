//=============================================================================
// TitleSceneExtensions.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017 Tsumio
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/07/20 公開。
// ----------------------------------------------------------------------------
// [Blog]   : http://ntgame.wpblog.jp/
// [Twitter]: https://twitter.com/TsumioNtGame
//=============================================================================

/*:
 * @plugindesc This plugin change title scene.
 * @author Tsumio
 *
 *
 * @param CommandImage
 * @type file[]
 * @require 1
 * @desc This is a setting sets the files for using the command images. You need as many files as the number of commands. (Read from img\tsumio folder)
 * @dir img/tsumio
 * @default
 *
 * @param RotationType
 * @type number
 * @desc This is a setting sets the rotation type.1 = TrueCircle, 2 = Ellipse1, 3 = Ellipse2.Please refer to the help for details of each type.
 * @default 1
 *
 * @param CenterX
 * @type number
 * @desc This is a setting sets X location that is the center of rotation.
 * @default 320
 *
 * @param CenterY
 * @type number
 * @desc This is a setting sets Y location that is the center of rotation.
 * @default 300
 *
 * @param AmountOfRotation
 * @type number
 * @desc This is a setting sets amout of rotation.（120＝120 degrees）
 * @default 120
 *
 * @param CorrectPos
 * @type number
 * @desc This is a setting sets the angle to correct the initial position of the image。(90=90 degrees）
 * @default 90
 *
 * @param Offset
 * @type number
 * @desc This is a setting sets the distance from the center XY. The larger it is, the farther away from the center position.
 * @default 120
 *
 *
 * @help If you introduce this plugin , the title screen is changed.
 * On the screen after change, it is necessary to use the number of images as many as the number of commands.
 * Especially if you do not change, the number of commands is 3 (New Game Contents Option).
 *
 * ----feature----
 * You can realize a title command with using pseudo 3D.Pseudo 3D has depth.
 *
 * ----how to use----
 * After adding this plugin, set each plugin parameter.
 * 'CommandImage' parameter needs images as many as the number of the commands.
 * Especially if you do not change, three images required.
 * Also, add images in the order of the commands on the title screen.
 * In the default case, please add images in the following order.
 * 1.New Game
 * 2.Contents
 * 3.Options
 *
 * ----about rotation type----
 * There are trhee rotation type.
 * 1.TrueCircle
 *  This is not truely 'TrueCircle' but it looks like 'TrueCircle'.
 * 2.Ellipse1
 *  This means vertically long rotation.
 * 3.Ellipse2
 *  This means horizontally long rotation.
 *
 * You should set only number when you set plugin parameter.
 * ex.If you want to set 'TrueCircle', you should set 1。
 *
 * ----about CorrectPos----
 * Depending on the number and size of images, the selected image may be hidden behind.
 * Also, there may be discrepancies between the position of each image and the selected image.
 * 'CorrectPos' parameter can solve those problems.
 *
 * ----about rotation speed----
 * The speed of rotation can not be set from plugin parameter.
 * If you want to change the speed of rotation, change "var speed = 2;" of Scene_Title.prototype.initializePseudo3DData method.
 * However, manipulating this variable may cause problems.
 *
 * ----about images ratio----
 * The ratio of the rotating image can not be set from plugin parameter.
 * If you want to change the ratio of the rotating image, please change the following methods.
 * もしも回転している画像の拡大率を変えたい場合、NTMO.Data_Pseudo3D.prototype.initializeメソッドの
 *
 * "NTMO.Data_Pseudo3D.prototype.initialize" method.
 * this._default_scale   = 0.7;
 * this._range           = 0.3;
 *
 * It looks natural if you add two numbers and make it 1.
 *
 * ----plugin command----
 * There is no plugin command.
 *
 *
 */
/*:ja
 * @plugindesc タイトル画面を変更します。
 * @author ツミオ
 *
 * @param 選択肢の画像
 * @type file[]
 * @require 1
 * @desc 選択肢の画像に使うファイルを設定します。ファイルは選択肢の数だけ必要です。（img\tsumioフォルダから読み込み）
 * @dir img/tsumio
 * @default
 *
 * @param 回転タイプ
 * @type number
 * @desc 回転のタイプを設定します。1 = TrueCircle, 2 = Ellipse1, 3 = Ellipse2。各タイプの詳細はヘルプを参照してください。
 * @default 1
 *
 * @param 回転の中心X座標
 * @type number
 * @desc 回転の中心となるX座標を設定します。
 * @default 320
 *
 * @param 回転の中心Y座標
 * @type number
 * @desc 回転の中心となるY座標を設定します。
 * @default 300
 *
 * @param 回転する量
 * @type number
 * @desc 回転する量を設定します。（120＝120度）
 * @default 120
 *
 * @param 初期位置の補正
 * @type number
 * @desc 画像の初期位置を補正する角度を設定します。(90=90度）
 * @default 90
 *
 * @param オフセット
 * @type number
 * @desc 各画像の中心位置からの距離を設定します。大きければ大きほど中心位置から離れます。
 * @default 120
 *
 * @help このプラグインを導入すると、タイトル画面が変更されます。
 * 変更後の画面では、必ずコマンドの数だけ画像を使用する必要があります。
 * コマンドの数はデフォルトでは3です（ニューゲーム・コンテニュー・オプション）。
 *
 * 【プラグインの特徴】
 * 疑似3Dを用いた奥行きのあるタイトルコマンドを実現できます。
 *
 * 【使用方法】
 * プラグイン導入後、各プラグインパラメーターを設定します。
 * 「タイトル画像」パラメーターには、メニューのコマンド数と同じだけの画像を必ず設定してください（デフォルトのタイトル画面の場合は3つの画像が必要）。
 * また、画像はタイトル画面のコマンド順に追加していってください（デフォルトの場合はニューゲーム→コンテニュー→オプションの順に追加する）。
 *
 * 【回転タイプについて】
 * 回転のタイプは3種類あります。
 * 1.TrueCircle
 *  真円のように見える回転タイプ。
 * 2.Ellipse1
 *  縦に長い円の回転タイプ。
 * 3.Ellipse2
 *  横に長い円の回転タイプ
 *
 * 各タイプをプラグインパラメーターに設定する場合、数字のみを指定します。
 * ex.TrueCircleを設定したいなら「1」を入力。
 *
 * 【初期位置の補正について】
 * 画像の数や大きさによっては、選択されている画像が後ろに隠れてしまう場合があります。
 * 初期位置の補正パラメーターを調整することによって、各画像の位置と、選択されている画像に齟齬が出ないようにします。
 *
 * 【回転の速さについて】
 * 回転の速さはプラグインパラメーターから設定できないようにしています。
 * もしも回転の速さを変えたい場合、Scene_Title.prototype.initializePseudo3DDataメソッドの
 * 「var speed = 2;」
 * を変更してください。
 * ただし、この変数を操作すると不具合が生じる可能性があります。
 *
 * 【画像の拡大率について】
 * 回転している画像の拡大率はプラグインパラメーターから設定できないようにしています。
 * もしも回転している画像の拡大率を変えたい場合、NTMO.Data_Pseudo3D.prototype.initializeメソッドの
 * this._default_scale   = 0.7;
 * this._range           = 0.3;
 * を変更してください。
 * 2つの数値を足して1になるようにすると自然に見えます。
 *
 * 【プラグインコマンド】
 * このプラグインにプラグインコマンドはありません。
 *
 *
 * 利用規約：
 * 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 * についても制限はありません。
 * 自由に使用してください。
 */

(function () {
  "use strict";
  var pluginName = "TitleSceneExtensions";

  //Declare NTMO namespace.
  var NTMO = NTMO || {};
  //Create circle type(enum).
  NTMO.Circle_Type = {
    TrueCircle: 1,
    Ellipse1: 2,
    Ellipse2: 3,
  };

  //-----------------------------------------------------------------------------
  // Settings for plugin command.
  //-----------------------------------------------------------------------------
  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
  };

  //==============================
  // Add original folder to ImageManager.
  //==============================
  ImageManager.loadTsumio = function (filename) {
    return this.loadBitmap("img/tsumio/", filename, 0, true);
  };

  //=============================================================================
  // Local function
  //  These functions checks & formats pluguin's command parameters.
  //  I borrowed these functions from Triacontane.Thanks!
  //=============================================================================
  var getParamString = function (paramNames) {
    if (!Array.isArray(paramNames)) paramNames = [paramNames];
    for (var i = 0; i < paramNames.length; i++) {
      var name = PluginManager.parameters(pluginName)[paramNames[i]];
      if (name) return name;
    }
    return "";
  };

  var getParamNumber = function (paramNames, min, max) {
    var value = getParamString(paramNames);
    if (arguments.length < 2) min = -Infinity;
    if (arguments.length < 3) max = Infinity;
    return (parseInt(value) || 0).clamp(min, max);
  };

  //=============================================================================
  // Get and set pluguin parameters.
  //=============================================================================
  var param = {};
  param.titleImages = getParamString(["CommandImage", "選択肢の画像"]);
  param.rotation = getParamNumber(["AmountOfRotation", "回転する量"]);
  param.correction = getParamNumber(["CorrectPos", "初期位置の補正"]);
  param.centerX = getParamNumber(["CenterX", "回転の中心X座標"]);
  param.centerY = getParamNumber(["CenterY", "回転の中心Y座標"]);
  param.offset = getParamNumber(["Offset", "オフセット"]);
  param.type = getParamNumber(["RotationType", "回転タイプ"]);
  //Convert
  param.titleImages = JSON.parse(param.titleImages);

  //=============================================================================
  // Scene_Title
  //  Expanded Scene_Title class for displaying NTMO.Data_Pseudo3D objects.
  //=============================================================================
  Scene_Title._lastCommand3D = null;

  var _Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function () {
    _Scene_Title_create.call(this);
    this._isContinueEnabled = this._commandWindow.isContinueEnabled();
    this.commandLen_TSE = this._commandWindow._list.length;
    if (Scene_Title._lastCommand3D) {
      this.selected3DCommand = Scene_Title._lastCommand3D;
    } else {
      this.selected3DCommand = this._commandWindow._index;
    }
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this.initializePseudo3DData();
    this.initializePseudo3DImage();
  };

  Scene_Title.prototype.initializePseudo3DData = function () {
    this.data_Pseudo3D = new Array();
    var speed = 2; //If you want to change the speed, you should change this variable.
    for (var i = 0; i < this.commandLen_TSE; i++) {
      this.data_Pseudo3D[i] = new NTMO.Data_Pseudo3D(
        param.centerX,
        param.centerY,
        speed,
        param.correction + (i - this.selected3DCommand) * param.rotation,
        param.offset,
        i,
        param.type
      );
    }
  };

  Scene_Title.prototype.initializePseudo3DImage = function () {
    this.sprite_Pseudo3D = new Array();
    for (var i = 0; i < this.commandLen_TSE; i++) {
      var bitmap = ImageManager.loadTsumio(param.titleImages[i]);
      this.sprite_Pseudo3D[i] = new Sprite(bitmap);
      this.addChild(this.sprite_Pseudo3D[i]);
    }
  };

  Scene_Title.prototype.updateRotateObject = function () {
    for (var i = 0; i < this.commandLen_TSE; i++) {
      this.data_Pseudo3D[i].rotateObject();
      //Set sprite.
      this.sprite_Pseudo3D[i].x = this.data_Pseudo3D[i]._x;
      this.sprite_Pseudo3D[i].y = this.data_Pseudo3D[i]._y;
      this.sprite_Pseudo3D[i].scale.x = this.data_Pseudo3D[i]._real_scale;
      this.sprite_Pseudo3D[i].scale.y = this.data_Pseudo3D[i]._real_scale;
      if (this.data_Pseudo3D[i]._control_number === this.selected3DCommand) {
        this.sprite_Pseudo3D[i].setColorTone([0, 0, 0, 0]);
      } else {
        this.sprite_Pseudo3D[i].setColorTone([-130, -130, -130, 0]);
      }
    }
  };

  Scene_Title.prototype.updateInputRotate = function () {
    if (Input.isRepeated("right")) {
      this.prevChoice();
      for (var i = 0; i < this.commandLen_TSE; i++) {
        this.data_Pseudo3D[i].rotateSpecifiedAngle(param.rotation);
      }
    }
    if (Input.isRepeated("left")) {
      this.nextChoice();
      for (var i = 0; i < this.commandLen_TSE; i++) {
        this.data_Pseudo3D[i].rotateSpecifiedAngle(-param.rotation);
      }
    }
    if (Input.isRepeated("up")) {
      this.prevChoice();
      for (var i = 0; i < this.commandLen_TSE; i++) {
        this.data_Pseudo3D[i].rotateSpecifiedAngle(param.rotation);
      }
    }
    if (Input.isRepeated("down")) {
      this.nextChoice();
      for (var i = 0; i < this.commandLen_TSE; i++) {
        this.data_Pseudo3D[i].rotateSpecifiedAngle(-param.rotation);
      }
    }
    if (Input.isTriggered("ok")) {
      this.ok3D();
      //this._commandWindow.callHandler(this._commandWindow._list[this.selected3DCommand].symbol);
    }
  };

  var _Scene_Title_update = Scene_Title.prototype.update;
  Scene_Title.prototype.update = function () {
    _Scene_Title_update.call(this);
    this.updateRotateObject();
    this.updateInputRotate();
  };

  Scene_Title.prototype.isContinueEnabled = function () {
    return this._isContinueEnabled;
  };

  Scene_Title.prototype.nextChoice = function () {
    if (this.data_Pseudo3D[0].isRealAngleReachSpecifiedAngle()) {
      this.selected3DCommand =
        (this.selected3DCommand + 1) % this.commandLen_TSE;
      SoundManager.playCursor();
    }
  };

  Scene_Title.prototype.prevChoice = function () {
    if (this.data_Pseudo3D[0].isRealAngleReachSpecifiedAngle()) {
      this.selected3DCommand =
        (this.selected3DCommand + (this.commandLen_TSE - 1)) %
        this.commandLen_TSE;
      SoundManager.playCursor();
    }
  };

  Scene_Title.prototype.ok3D = function () {
    var symbol = this._commandWindow._list[this.selected3DCommand].symbol;
    if (this._commandWindow.isHandled(symbol)) {
      Scene_Title._lastCommand3D = this.selected3DCommand;
      this._commandWindow.callHandler(symbol);
    }
    SoundManager.playOk();
  };

  //=============================================================================
  // NTMO.Data_Pseudo3D
  //  You can set three rotation type.
  //  One   : 'TrueCircle'.Of course, This is not truely 'TrueCircle' but it looks like 'TrueCircle'.
  //  Two   : 'Ellipse1'. This means vertically long rotation.
  //  Three : 'Ellipse2'. This means horizontally long rotation.
  //  If you don't decide any type, this class automatically set the type One('TrueCircle').
  //=============================================================================
  NTMO.Data_Pseudo3D = function (
    centerX,
    centerY,
    speed,
    realAngle,
    rotateSize,
    controlNumber,
    type
  ) {
    //General settings for presudo 3D object.
    this._x;
    this._y;
    this._radian;
    this._default_scale;
    this._real_scale;
    this._real_angle;
    this._range; //This means scale size;
    this._isClockwise;
    this._control_number; //This variable is used to distinguish from other 3D objects.

    //For rotation settings.
    this._center_x;
    this._center_y;
    this._angleSpeed; //This means rotation speed.
    this._rotateSize; //This means rotation size.
    this._type; //This means rotation type.
    this._direction; //This means rotate direction.Right,Left,Upper,Bottom.

    //For destination positions.
    this._destinate_x;
    this._destinate_y;
    this._destinate_scale;
    this._specified_angle;

    this.initialize.apply(this, arguments);
    //this.initialize.apply(centerX,centerY,speed,realAngle,rotateSize,controlNumber,type);
  };

  NTMO.Data_Pseudo3D.prototype.initialize = function (
    centerX,
    centerY,
    speed,
    realAngle,
    rotateSize,
    controlNumber,
    type
  ) {
    this._center_x = centerX;
    this._center_y = centerY;
    this._angleSpeed = speed;
    this._real_angle = realAngle;
    this._rotateSize = rotateSize;
    if (type === undefined) {
      this._type = NTMO.Circle_Type.TrueCircle;
    } else {
      this._type = type;
    }
    this._control_number = controlNumber;

    //Default Settings
    this._default_scale = 0.7;
    this._range = 0.3;
    this._specified_angle = this._real_angle;
    this._isClockwise = true;

    //Set default position.
    if (this._type === NTMO.Circle_Type.TrueCircle) {
      this._radian = (this._real_angle * Math.PI) / 180.0;
      this._x = this._center_x + Math.cos(this._radian) * this._rotateSize;
      this._y = this._center_y + Math.sin(this._radian) * this._rotateSize;
      this._real_scale =
        this._default_scale + Math.sin(this._radian) * this._range;
    } else if (this._type === NTMO.Circle_Type.Ellipse1) {
      this._radian = (this._real_angle * Math.PI) / 180.0;
      this._x =
        this._center_x + (Math.cos(this._radian) * this._rotateSize) / 2;
      this._y = this._center_y + Math.sin(this._radian) * this._rotateSize;
      this._real_scale =
        this._default_scale + Math.sin(this._radian) * this._range;
    } else {
      this._radian = (this._real_angle * Math.PI) / 180.0;
      this._x = this._center_x + Math.cos(this._radian) * this._rotateSize;
      this._y =
        this._center_y + (Math.sin(this._radian) * this._rotateSize) / 2;
      this._real_scale =
        this._default_scale + Math.sin(this._radian) * this._range;
    }
  };

  NTMO.Data_Pseudo3D.prototype.rotateObject = function () {
    switch (this._type) {
      case NTMO.Circle_Type.TrueCircle:
        this.setTrueCircle();
        break;
      case NTMO.Circle_Type.Ellipse1:
        this.setEllipse1();
        break;
      case NTMO.Circle_Type.Ellipse2:
        this.setEllipse2();
        break;
      default:
        this.setTrueCircle();
        break;
    }
  };

  NTMO.Data_Pseudo3D.prototype.rotateSpecifiedAngle = function (angle) {
    if (this.isRealAngleReachSpecifiedAngle()) {
      if (angle > 0) {
        this._isClockwise = true;
      } else {
        this._isClockwise = false;
      }
      this._specified_angle = this._real_angle + angle;
    }
  };

  NTMO.Data_Pseudo3D.prototype.initializeAngle = function (angle) {
    this._real_angle = angle;
  };

  NTMO.Data_Pseudo3D.prototype.isRealAngleReachSpecifiedAngle = function () {
    if (this._real_angle === this._specified_angle) {
      return true;
    }
    return false;
  };

  NTMO.Data_Pseudo3D.prototype.setTrueCircle = function () {
    if (!this.isRealAngleReachSpecifiedAngle()) {
      //Set Radian.
      this._radian = (this._real_angle * Math.PI) / 180.0;
      //Set position.
      this._x = this._center_x + Math.cos(this._radian) * this._rotateSize;
      this._y = this._center_y + Math.sin(this._radian) * this._rotateSize;
      //Set Scale
      this._real_scale =
        this._default_scale + Math.sin(this._radian) * this._range;

      //Update Real_angle.
      if (this._isClockwise) {
        this._real_angle += this._angleSpeed;
      } else {
        this._real_angle += -this._angleSpeed;
      }
    }
  };

  NTMO.Data_Pseudo3D.prototype.setEllipse1 = function () {
    if (!this.isRealAngleReachSpecifiedAngle()) {
      //Set Radian.
      this._radian = (this._real_angle * Math.PI) / 180.0;
      //Set position.
      this._x =
        this._center_x + (Math.cos(this._radian) * this._rotateSize) / 2;
      this._y = this._center_y + Math.sin(this._radian) * this._rotateSize;
      //Set Scale
      this._real_scale =
        this._default_scale + Math.sin(this._radian) * this._range;

      //Update Real_angle.
      if (this._isClockwise) {
        this._real_angle += this._angleSpeed;
      } else {
        this._real_angle += -this._angleSpeed;
      }
    }
  };

  NTMO.Data_Pseudo3D.prototype.setEllipse2 = function () {
    if (!this.isRealAngleReachSpecifiedAngle()) {
      //Set Radian.
      this._radian = (this._real_angle * Math.PI) / 180.0;
      //Set position.
      this._x = this._center_x + Math.cos(this._radian) * this._rotateSize;
      this._y =
        this._center_y + (Math.sin(this._radian) * this._rotateSize) / 2;
      //Set Scale
      this._real_scale =
        this._default_scale + Math.sin(this._radian) * this._range;

      //Update Real_angle.
      if (this._isClockwise) {
        this._real_angle += this._angleSpeed;
      } else {
        this._real_angle += -this._angleSpeed;
      }
    }
  };
})();
