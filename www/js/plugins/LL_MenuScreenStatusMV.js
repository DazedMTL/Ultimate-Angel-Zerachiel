//=============================================================================
// RPGツクールMV - LL_MenuScreenStatusMV.js v1.0.2
//-----------------------------------------------------------------------------
// ルルの教会 (Lulu's Church)
// https://nine-yusha.com/
//
// URL below for license details.
// https://nine-yusha.com/plugin/
//=============================================================================

/*:
 * @target MV
 * @plugindesc ステータス画面に立ち絵を表示します。
 * @author ルルの教会
 * @url https://nine-yusha.com/plugin-menuscreen/
 * @base LL_MenuScreenBaseMV
 * @orderAfter LL_MenuScreenBaseMV
 *
 * @help LL_MenuScreenStatusMV.js
 *
 * ステータス画面に立ち絵を表示します。
 * ※表示する立ち絵リストは「LL_MenuScreenBase」で設定してください。
 *
 * 立ち絵を優先して見せたい場合は、下記の通り設定してください。
 *   X座標基点・Y座標基点: 右側寄りに設定
 *   不透明度: 255
 *   経験値情報の表示: 次のレベルのみ
 *   装備品リストの表示: false
 *   区切り線の表示: false
 *
 * プラグインコマンドはありません。
 *
 * 利用規約:
 *   ・著作権表記は必要ございません。
 *   ・利用するにあたり報告の必要は特にございません。
 *   ・商用・非商用問いません。
 *   ・R18作品にも使用制限はありません。
 *   ・ゲームに合わせて自由に改変していただいて問題ございません。
 *   ・プラグイン素材としての再配布（改変後含む）は禁止させていただきます。
 *
 * 作者: ルルの教会
 * 作成日: 2020/11/11
 *
 * @param pictureSettings
 * @text 立ち絵表示の設定
 * @desc ※この項目は使用しません
 *
 * @param statusWindowPictureX
 * @text X座標始点
 * @desc ステータス画面に表示する立ち絵の表示位置(X)です。
 * @default 0
 * @min -2000
 * @max 2000
 * @type number
 * @parent pictureSettings
 *
 * @param statusWindowPictureY
 * @text Y座標始点
 * @desc ステータス画面に表示する立ち絵の表示位置(Y)です。
 * @default 0
 * @min -2000
 * @max 2000
 * @type number
 * @parent pictureSettings
 *
 * @param statusWindowPictureOpacity
 * @text 不透明度
 * @desc 立ち絵の不透明度(0～255)です。 (初期値: 160)
 * @type number
 * @default 160
 * @min 0
 * @max 255
 * @parent pictureSettings
 *
 * @param windowSettings
 * @text ウィンドウの設定
 * @desc ※この項目は使用しません
 *
 * @param showActorFace
 * @text 顔グラフィックの表示
 * @desc 顔グラフィックを表示します。
 * @default true
 * @type boolean
 * @parent windowSettings
 *
 * @param showExpInfos
 * @text 経験値情報の表示
 * @desc 経験値情報の表示方法を選択します。
 * @default all
 * @type select
 * @option 全て表示
 * @value all
 * @option 次のレベルのみ
 * @value nextLevel
 * @option 表示しない
 * @value off
 * @parent windowSettings
 *
 * @param showEquipLists
 * @text 装備品リストの表示
 * @desc 装備品のリストを表示します。
 * @default true
 * @type boolean
 * @parent windowSettings
 *
 * @param showLines
 * @text 区切り線の表示
 * @desc ウィンドウ内の区切り線を表示します。
 * @default true
 * @type boolean
 * @parent windowSettings
 */

(function () {
  "use strict";
  var pluginName = "LL_MenuScreenStatusMV";

  var parameters = PluginManager.parameters(pluginName);
  var statusWindowPictureX = Number(parameters["statusWindowPictureX"] || 0);
  var statusWindowPictureY = Number(parameters["statusWindowPictureY"] || 0);
  var statusWindowPictureOpacity = Number(
    parameters["statusWindowPictureOpacity"] || 255
  );
  var showActorFace = eval(parameters["showActorFace"] || "true");
  var showExpInfos = String(parameters["showExpInfos"] || "all");
  var showEquipLists = eval(parameters["showEquipLists"] || "true");
  var showLines = eval(parameters["showLines"] || "true");

  Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    // ステータス画面に立ち絵を表示する場合、独自Windowに差し替え
    this.createStatusWithPictureWindow();
  };

  Scene_Status.prototype.refreshActor = function () {
    var actor = this.actor();
    this._statusWithPictureWindow.setActor(actor);
  };

  Scene_Status.prototype.onActorChange = function () {
    // Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this._statusWithPictureWindow.activate();
  };

  Scene_Status.prototype.createStatusWithPictureWindow = function () {
    // const rect = this.statusWithPictureWindowRect();
    // this._statusWithPictureWindow = new Window_StatusWithPicture(rect);
    // this._statusWithPictureWindow.setHandler("cancel", this.popScene.bind(this));
    // this._statusWithPictureWindow.setHandler("pagedown", this.nextActor.bind(this));
    // this._statusWithPictureWindow.setHandler("pageup", this.previousActor.bind(this));
    // this.addWindow(this._statusWithPictureWindow);
    // for MV
    this._statusWithPictureWindow = new Window_StatusWithPicture();
    this._statusWithPictureWindow.setHandler(
      "cancel",
      this.popScene.bind(this)
    );
    this._statusWithPictureWindow.setHandler(
      "pagedown",
      this.nextActor.bind(this)
    );
    this._statusWithPictureWindow.setHandler(
      "pageup",
      this.previousActor.bind(this)
    );
    this._statusWithPictureWindow.reserveFaceImages();
    this.addWindow(this._statusWithPictureWindow);
  };

  Scene_Status.prototype.statusWithPictureWindowRect = function () {
    var wx = 0;
    var wy = this.mainAreaTop();
    var ww = Graphics.boxWidth;
    var wh = Graphics.boxHeight - wy;
    return new Rectangle(wx, wy, ww, wh);
  };

  //-----------------------------------------------------------------------------
  // Window_StatusWithPicture
  //
  // The window for displaying full status on the status screen.

  function Window_StatusWithPicture() {
    this.initialize.apply(this, arguments);
  }

  Window_StatusWithPicture.prototype = Object.create(
    Window_Selectable.prototype
  );
  Window_StatusWithPicture.prototype.constructor = Window_StatusWithPicture;

  Window_StatusWithPicture.prototype.initialize = function () {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this._actor = null;
    this._backStandingPicture = null;
    this.refresh();
    this.activate();
  };

  Window_StatusWithPicture.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
      this._actor = actor;
      this.refresh();
    }
  };

  Window_StatusWithPicture.prototype.refresh = function () {
    Window_Selectable.prototype.refresh.call(this);
    if (this._actor) {
      var lineHeight = this.lineHeight();
      this.drawPicture();
      this.drawBlock1();
      this.drawBlock2();
      this.drawHorzLine(lineHeight * 6);
      this.drawBlock3(lineHeight * 7);
      this.drawHorzLine(lineHeight * 13);
      this.drawBlock4(lineHeight * 14);
    }
  };

  Window_StatusWithPicture.prototype.drawBlock1 = function () {
    var y = this.block1Y();
    this.drawActorName(this._actor, 6, y, 168);
    this.drawActorClass(this._actor, 192, y, 168);
    this.drawActorNickname(this._actor, 432, y, 270);
  };

  Window_StatusWithPicture.prototype.block1Y = function () {
    return 0;
  };

  Window_StatusWithPicture.prototype.drawBlock2 = function () {
    var y = this.block2Y();
    if (showActorFace) this.drawActorFace(this._actor, 12, y);
    this.drawBasicInfo(showActorFace ? 204 : 12, y);
    this.drawExpInfo(456, y);
  };

  Window_StatusWithPicture.prototype.block2Y = function () {
    // const lineHeight = this.lineHeight();
    // const min = lineHeight;
    // const max = this.innerHeight - lineHeight * 4;
    // return Math.floor((lineHeight * 1.4).clamp(min, max));
    // for MV
    var lineHeight = this.lineHeight();
    var innerHeight = this.height - this.padding * 2;
    var min = lineHeight;
    var max = innerHeight - lineHeight * 4;
    return Math.floor((lineHeight * 1.4).clamp(min, max));
  };

  Window_StatusWithPicture.prototype.drawBlock3 = function (y) {
    this.drawParameters(12, y);
    this.drawEquipments(312, y);
  };

  Window_StatusWithPicture.prototype.drawBlock4 = function (y) {
    this.drawProfile(12, y);
  };

  Window_StatusWithPicture.prototype.drawBasicInfo = function (x, y) {
    var lineHeight = this.lineHeight();
    this.drawActorLevel(this._actor, x, y + lineHeight * 0);
    this.drawActorIcons(this._actor, x, y + lineHeight * 1);
    // this.placeBasicGauges(this._actor, x, y + lineHeight * 2);
    // for MV
    this.drawActorHp(this._actor, x, y + lineHeight * 2);
    this.drawActorMp(this._actor, x, y + lineHeight * 3);
  };

  Window_StatusWithPicture.prototype.drawExpInfo = function (x, y) {
    var lineHeight = this.lineHeight();
    var expTotal = TextManager.expTotal.format(TextManager.exp);
    var expNext = TextManager.expNext.format(TextManager.level);
    // 設定により、表示情報を切り替え
    switch (showExpInfos) {
      case "off":
        return;
      case "nextLevel":
        //this.changeTextColor(ColorManager.systemColor());
        this.changeTextColor(this.systemColor());
        this.drawText(expNext, x, y + lineHeight * 0, 270);
        this.resetTextColor();
        this.drawText(this.expNextValue(), x, y + lineHeight * 1, 270, "right");
        break;
      default:
        //this.changeTextColor(ColorManager.systemColor());
        this.changeTextColor(this.systemColor());
        this.drawText(expTotal, x, y + lineHeight * 0, 270);
        this.drawText(expNext, x, y + lineHeight * 2, 270);
        this.resetTextColor();
        this.drawText(
          this.expTotalValue(),
          x,
          y + lineHeight * 1,
          270,
          "right"
        );
        this.drawText(this.expNextValue(), x, y + lineHeight * 3, 270, "right");
    }
  };

  Window_StatusWithPicture.prototype.expTotalValue = function () {
    if (this._actor.isMaxLevel()) {
      return "-------";
    } else {
      return this._actor.currentExp();
    }
  };

  Window_StatusWithPicture.prototype.expNextValue = function () {
    if (this._actor.isMaxLevel()) {
      return "-------";
    } else {
      return this._actor.nextRequiredExp();
    }
  };

  Window_StatusWithPicture.prototype.drawItem = function (index) {
    var rect = this.itemLineRect(index);
    var paramId = index + 2;
    var name = TextManager.param(paramId);
    var value = this._actor.param(paramId);

    //this.changeTextColor(ColorManager.systemColor());
    // for MV
    this.changeTextColor(this.systemColor());
    this.drawText(name, rect.x, rect.y, 160);
    this.resetTextColor();
    this.drawText(value, rect.x + 160, rect.y, 60, "right");
  };

  Window_StatusWithPicture.prototype.drawParameters = function (x, y) {
    var lineHeight = this.lineHeight();
    for (var i = 0; i < 6; i++) {
      var paramId = i + 2;
      var y2 = y + lineHeight * i;
      this.changeTextColor(this.systemColor());
      this.drawText(TextManager.param(paramId), x, y2, 160);
      this.resetTextColor();
      this.drawText(this._actor.param(paramId), x + 160, y2, 60, "right");
    }
  };

  Window_StatusWithPicture.prototype.drawEquipments = function (x, y) {
    var equips = this._actor.equips();
    var count = Math.min(equips.length, this.maxEquipmentLines());
    for (var i = 0; i < count; i++) {
      this.changeTextColor(this.systemColor());
      this.drawText(
        this.actorSlotName(this._actor, i),
        x,
        y + this.lineHeight() * i,
        160
      );
      this.resetTextColor();
      this.drawItemName(equips[i], x + 160, y + this.lineHeight() * i);
    }
  };

  Window_StatusWithPicture.prototype.maxEquipmentLines = function () {
    return showEquipLists ? 6 : 0;
  };

  Window_StatusWithPicture.prototype.drawHorzLine = function (y) {
    if (!showLines) return;
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
    this.contents.paintOpacity = 255;
  };

  Window_StatusWithPicture.prototype.lineColor = function () {
    //return ColorManager.normalColor();
    // for MV
    return this.normalColor();
  };

  Window_StatusWithPicture.prototype.drawProfile = function (x, y) {
    this.contents.fontSize;
    this.drawTextEx(this._actor.profile(), x, y);
  };

  Window_StatusWithPicture.prototype.drawPicture = function () {
    var actor = this._actor;
    if (this._backStandingPicture) this._backStandingPicture.bitmap = null;

    // 立ち絵描画
    var mPicture = ExMenuScreenBase.getImageName(actor._actorId);
    if (mPicture) {
      var x = statusWindowPictureX + Number(mPicture.x);
      var y = statusWindowPictureY + Number(mPicture.y);
      var scaleX = Number(mPicture.scaleX) / 100;
      var scaleY = Number(mPicture.scaleY) / 100;
      // ピンチ判定
      if (
        ExMenuScreenBase.getHpRate(actor._actorId) >
          Number(mPicture.pinchPercentage) ||
        !mPicture.pinchImageName
      ) {
        // 通常
        this.drawBackStandingPicture(
          String(mPicture.imageName),
          x,
          y,
          scaleX,
          scaleY
        );
      } else {
        // ピンチ
        this.drawBackStandingPicture(
          String(mPicture.pinchImageName),
          x,
          y,
          scaleX,
          scaleY
        );
      }
    }
  };

  Window_StatusWithPicture.prototype.drawBackStandingPicture = function (
    imageName,
    x,
    y,
    scaleX,
    scaleY
  ) {
    var spacing = 8;
    this._backStandingPicture = new Sprite();
    this._backStandingPicture.bitmap = ImageManager.loadPicture(imageName);
    this._backStandingPicture.x = x;
    this._backStandingPicture.y = y;
    this._backStandingPicture.scale.x = scaleX;
    this._backStandingPicture.scale.y = scaleY;

    // マスク処理
    var mask = new PIXI.Graphics();
    var paddingHelfX = (Graphics.width - Graphics.boxWidth - 8) / 2;
    var paddingHelfY = (Graphics.height - Graphics.boxHeight - 8) / 2;
    mask.beginFill(0xffffff, 1);
    mask.drawRect(
      this.x + 12 + paddingHelfX,
      this.y + 12 + paddingHelfY,
      this.width - 16,
      this.height - 16
    );
    mask.endFill();
    this._backStandingPicture.mask = mask;

    this._backStandingPicture.opacity = statusWindowPictureOpacity;
    this.addChildToBack(this._backStandingPicture);
  };

  Window_StatusWithPicture.prototype.actorSlotName = function (actor, index) {
    var slots = actor.equipSlots();
    return $dataSystem.equipTypes[slots[index]];
  };
})();
