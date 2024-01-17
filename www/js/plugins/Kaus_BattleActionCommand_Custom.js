//=============================================================================
// Kaus BattleActionCommand
// Kaus_BattleActionCommand.js
// Version: 1.00
// Date Created: December 10, 2019
// Scripted By: Kaus
//=============================================================================
/*:
 * @plugindesc v1.00 Animated Battle Action Commands for Kujilabo project 'Last of fantasm'.
 * @author Kaus
 *
 * @param partycommandExpulsion
 * @desc パーティコマンドウインドウを強制的に画面外に移動します。
 * @type boolean
 * @default true
 *
 * @help
 *
 * このプラグインはまっつＵＰによる改変が施されています。
 *
 * ---導入---
 *
 * Kaus_BattleActionCommand.jsは
 * 可能な限り下（特に名前にMOGとつくプラグインより下）
 * での導入を推奨します。
 *
 * ---改変内容など---
 *
 * ・一部の記述の整理
 * また、this._commandLS.blendMode = PIXI.blendModes.SCREEN;を
 * this._commandLS.blendMode = PIXI.BLEND_MODES.SCREEN;
 * に変更。
 *
 * ・プラグインパラメータの追加
 *
 * ・左クリックでアクターコマンドやパーティコマンド（デスティニー）を
 * 選択できるようにしました。
 * （アイテム・スキル対象者の選択の処理のいくらかは従来通りに
 * 　他プラグイン等の機能が使われていると思います。）
 *
 *
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害もまっつＵＰは一切の責任を負いません。
 */

var Imported = Imported || {};
Imported.Kaus_BattleActionCommand = 1.0;

const parameters = PluginManager.parameters("Kaus_BattleActionCommand");
const KauspartycommandExpulsion =
  parameters["partycommandExpulsion"] === "true";

SceneManager.Kausinputok = function (obj) {
  return Input.isRepeated("ok") || SceneManager.Kausistouchvalid(obj);
};

//クリック判定とクリック処理を同時に行う。
//console.log(tx, ty, currentindex);console.log(posarr);
SceneManager.Kausistouchvalid = function (obj) {
  if (!TouchInput.isTriggered()) return false;
  if (!obj) return true;
  const win = obj.targetwin;
  if (!win) return false;
  const tx = TouchInput.x;
  const ty = TouchInput.y;
  const arr = obj.condposarr || [];
  const currentindex = win.index();

  const nextindex = arr.findIndex(function (posarr) {
    if (!posarr) return false;
    var px = Number(posarr[0] || 0);
    var py = Number(posarr[1] || 0);
    var pw = Number(posarr[2] || 0);
    var ph = Number(posarr[3] || 0);
    return tx >= px && ty >= py && tx <= px + pw && ty <= py + ph;
  });
  if (nextindex < 0) return false;
  if (currentindex === nextindex) {
    win.processOk();
    return true;
  } else {
    win.select(nextindex);
    SoundManager.playCursor();
    return false;
  }
};

SceneManager.Kausinputcancel = function () {
  return Input.isRepeated("cancel") || TouchInput.isCancelled();
};

const _Scene_Battle_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function () {
  _Scene_Battle_create.call(this);
  this.Kausinitmember();
  this.Kausmaincreate();
};

//さすがにグローバルに放っておくのはまずいので。
Scene_Battle.prototype.Kausinitmember = function () {
  this._Kaus_CommandCall = false;
  this._Kaus_DestinyCall = false;
  this._Kaus_TargetCall = false;
  this._Kausbounce = false;
  this._Kausbonus_y = 0;
  this._KausArrowData = [];
  this._KaustoggleArrow = false;
  this._KaustoggleHL = false;
  this._Kausmovement = 0;
};

//位置の初期化等にも使う、addchildで同じものが重複しないように注意。
Scene_Battle.prototype.Kausmaincreate = function () {
  if (!this._Kaus_CommandCall) {
    this.createCommandGraphics();
    this._Kaus_CommandCall = true;
  }
  if (!this._Kaus_DestinyCall) {
    this.createDestinyGraphics();
    this._Kaus_DestinyCall = true;
  }
  if (!this._Kaus_TargetCall) {
    this.createTargetGraphics();
    this._Kaus_TargetCall = true;
  }
};

const Kaus_BattleUpdate = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
  this.Kausmainupdate();
  Kaus_BattleUpdate.call(this);
};

//更新するかの条件等は実行する関数の方で処理。
Scene_Battle.prototype.Kausmainupdate = function () {
  this.KausupdatepartyCommand();
  this.updateCommandGraphics();
  this.updateDestinyGraphics();
  //this.updateTargetEnemyGraphics();
  this.updateTargetAllyGraphics();

  this.Kausmaincreate();
};

//mog系で操作している場合があるので注意。
Scene_Battle.prototype.KausupdatepartyCommand = function () {
  const win = this._partyCommandWindow;
  if (!(KauspartycommandExpulsion && win && win.x >= 0)) return;
  if (win.slide) win.slide = false;
  win.move(-win.width - 2, -win.height - 2);
};

Window_PartyCommand.prototype.maxCols = function () {
  return 2;
};

Window_BattleEnemy.prototype.maxCols = function () {
  return 3;
};

//====================================================================================================================
// T A R G E T    G R A P H I C S   M E T H O D S
//====================================================================================================================
Scene_Battle.prototype.createTargetGraphics = function () {
  if (!this._target) {
    this._target = new Sprite();
    this._targetEnemy = new Sprite();
    this._targetAlly = new Sprite();
    this._target.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "BattleCursor"
    );
    this._targetEnemy.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "SelectTargetL"
    );
    this._targetAlly.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "SelectTargetR"
    );
    this.addChild(this._targetAlly);
    this.addChild(this._targetEnemy);
    this.addChild(this._target);
  }

  this._target.opacity = 0;
  this._target.move(Graphics.width / 2, Graphics.height / 2);
  this._targetAlly.move(-1104, 0);
  this._targetEnemy.move(1104, 0);

  this._Kausbounce = false;
  this._Kausbonus_y = 0;
};

Scene_Battle.prototype.updateTargetEnemyGraphics = function () {
  const checkwin = this._enemyWindow;
  if (!(checkwin && checkwin.active)) return;
  if (SceneManager.Kausinputok() || SceneManager.Kausinputcancel()) {
    this.removeTargetGraphics();
    return;
  }

  if (Input.isRepeated("up") || Input.isRepeated("down")) {
    this._Kausbounce = false;
    this._Kausbonus_y = 0;
  }
  const i = checkwin.enemyIndex();
  const enemy = $gameTroop._enemies[i];
  const sh = enemy.spriteHeight() / 1.5;
  const x = Math.abs(enemy._screenX - 32);
  const y = Math.abs(enemy._screenY - sh - this._target.height);
  if (!this._Kausbounce) {
    if (this._Kausbonus_y != 10) this._Kausbonus_y += 1;
    else this._Kausbounce = true;
  }
  if (this._Kausbounce) {
    if (this._Kausbonus_y != 0) this._Kausbonus_y -= 1;
    else this._Kausbounce = false;
  }
  this._target.opacity = 255;
  const distance_x = Math.abs(this._target.x - x);
  const distance_y = Math.abs(this._target.y - y + this._Kausbonus_y);
  const moveX = distance_x / 5;
  const moveY = distance_y / 5;
  if (this._target.x > x) this._target.x -= moveX;
  if (this._target.x < x) this._target.x += moveX;
  if (this._target.y > y + this._Kausbonus_y) this._target.y -= moveY;
  if (this._target.y < y + this._Kausbonus_y) this._target.y += moveY;
  if (this._targetEnemy.x > 110.4) this._targetEnemy.x -= 110.4;
  if (this._targetAlly.x > -1104) this._targetAlly.x -= 110.4;
};

Scene_Battle.prototype.updateTargetAllyGraphics = function () {
  const checkwin = this._actorWindow;
  if (!(checkwin && checkwin.active)) return;
  if (SceneManager.Kausinputok() || SceneManager.Kausinputcancel()) {
    this.removeTargetGraphics();
    return;
  }
  const i = checkwin.index();
  const actor = $gameParty.battleMembers()[i];
  const sw = actor.spriteWidth() / 2;
  const sh = actor.spriteHeight();
  const x = Math.abs(actor.spritePosX() - sw);
  const y = Math.abs(actor.spritePosY() - sh - this._target.height);
  if (!this._Kausbounce) {
    if (this._Kausbonus_y != 10) this._Kausbonus_y += 1;
    else this._Kausbounce = true;
  }
  if (this._Kausbounce) {
    if (this._Kausbonus_y != 0) this._Kausbonus_y -= 1;
    else this._Kausbounce = false;
  }
  this._target.opacity += 20;
  const distance_x = Math.abs(this._target.x - x);
  const distance_y = Math.abs(this._target.y - y + this._Kausbonus_y);
  const moveX = distance_x / 10;
  const moveY = distance_y / 10;
  if (this._target.x >= x) this._target.x -= moveX;
  if (this._target.x <= x) this._target.x += moveX;
  if (this._target.y >= y + this._Kausbonus_y) this._target.y -= moveY;
  if (this._target.y <= y + this._Kausbonus_y) this._target.y += moveY;
  if (this._targetEnemy.x < 1104) this._targetEnemy.x += 110.4;
  if (this._targetAlly.x < -110.4) this._targetAlly.x += 110.4;
};

Scene_Battle.prototype.removeTargetGraphics = function () {
  this._Kaus_TargetCall = false;
};

//====================================================================================================================
// A C T I O N    C O M M A N D S   G R A P H I C S   M E T H O D S
//====================================================================================================================

Scene_Battle.prototype.createCommandGraphics = function () {
  if (!this._commandOrb) {
    this._commandOrb = new Sprite();
    this._commandIcon = new Sprite();
    this._commandHL = new Sprite();
    this._commandAttack = new Sprite();
    this._commandTech = new Sprite();
    this._commandGuard = new Sprite();
    this._commandItems = new Sprite();
    this._commandFrame = new Sprite();
    this._commandLS = new TilingSprite();
    this._commandOrb.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandOrb_Base"
    );
    this._commandLS.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandlifestream"
    );
    this._commandFrame.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandOrb_Frame"
    );
    this._commandIcon.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandOrb_Items"
    );
    this._commandIcon.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandOrb_Guard"
    );
    this._commandIcon.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandOrb_Tech"
    );
    this._commandIcon.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandOrb_Attack"
    );
    this._commandHL.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandHL"
    );
    this._commandAttack.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandTextAttack"
    );
    this._commandTech.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandTextTech"
    );
    this._commandGuard.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandTextGuard"
    );
    this._commandItems.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "commandTextItems"
    );
    this.addChild(this._commandHL);
    this.addChild(this._commandOrb);
    this.addChild(this._commandAttack);
    this.addChild(this._commandTech);
    this.addChild(this._commandGuard);
    this.addChild(this._commandItems);
    this.addChild(this._commandIcon);
    this.addChild(this._commandLS);
    this.addChild(this._commandFrame);
  }

  this._commandOrb.opacity =
    this._commandHL.opacity =
    this._commandAttack.opacity =
    this._commandGuard.opacity =
    this._commandTech.opacity =
    this._commandItems.opacity =
    this._commandIcon.opacity =
    this._commandFrame.opacity =
    this._commandLS.opacity =
      0;
  this._commandHL.move(45, 438 + 96); //Default X: 160
  this._commandOrb.move(100, 620 + 96); //Default Y: 520
  this._commandFrame.move(-1, 519 + 96); //Default Y: 419
  this._commandIcon.move(0, 420 + 96); //Default Y: 420
  this._commandAttack.move(215, 447 + 96); //Default X: 195
  this._commandTech.move(230, 487 + 96); //Default X: 210
  this._commandGuard.move(233, 526 + 96); //Default X: 213
  this._commandItems.move(212, 568 + 96); //Default X: 202
  this._commandLS.move(98.5, 522.5 + 96, 194, 65);

  this._commandLS.anchor.x = 0.5;
  this._commandLS.anchor.y = 0.5;
  this._commandOrb.anchor.x = 0.5;
  this._commandOrb.anchor.y = 0.5;
};

//rotation調整も含む。
Scene_Battle.prototype.updateCommandGraphics = function () {
  const checkwin = this._actorCommandWindow;
  if (!(checkwin && checkwin.active)) return;
  const posat = this._commandAttack;
  const poste = this._commandTech;
  const posgu = this._commandGuard;
  const posit = this._commandItems;
  const inputobjcond = {
    targetwin: checkwin,
    condposarr: [
      [posat.x, posat.y, posat.width, posat.height],
      [poste.x, poste.y, poste.width, poste.height],
      [posgu.x, posgu.y, posgu.width, posgu.height],
      [posit.x, posit.y, posit.width, posit.height],
    ],
  };
  const preindex = checkwin.index();
  if (
    SceneManager.Kausinputok(inputobjcond) ||
    SceneManager.Kausinputcancel()
  ) {
    this.removeCommandGraphics();
    return;
  }
  if (
    preindex !== checkwin.index() ||
    Input.isRepeated("up") ||
    Input.isRepeated("down")
  ) {
    this._commandHL.x = 45;
    this._commandIcon.opacity = 0;
  }

  //Orb Animation
  if (this._commandOrb.opacity != 255) {
    this._commandOrb.opacity += 40;
    this._commandFrame.opacity += 40;
    this._commandLS.opacity += 40;
  }
  if (this._commandOrb.y != 520 + 96) {
    this._commandOrb.y -= 20;
    this._commandFrame.y -= 20;
  }
  this._commandOrb.rotation += 0.002;
  //Icon Animation
  this._commandLS.blendMode = PIXI.BLEND_MODES.SCREEN;
  if ((this._commandIcon.opacity != 255) & (this._commandOrb.y == 520 + 96))
    this._commandIcon.opacity += 5;
  this._commandLS.origin.x += 0.5;
  //Command Text Intro
  if (this._commandAttack.opacity != 255)
    this._commandAttack.opacity =
      this._commandGuard.opacity =
      this._commandTech.opacity =
      this._commandItems.opacity +=
        10;
  if (this._commandAttack.x != 195) {
    this._commandAttack.x -= 1;
    this._commandTech.x -= 1;
    this._commandGuard.x -= 1;
    this._commandItems.x -= 1;
  }
  //Highlight X Insist
  if ((this._commandHL.opacity != 255) & (this._commandOrb.y == 520 + 96))
    this._commandHL.opacity += 20;
  if ((this._commandHL.x != 155) & (this._commandOrb.y == 520 + 96))
    this._commandHL.x += 10;
  //Command Selection Update
  switch (checkwin.index()) {
    case 0:
      if (this._commandHL.y < 438 + 96) this._commandHL.y += 10;
      if (this._commandHL.y > 438 + 96) this._commandHL.y -= 10;
      this._commandIcon.bitmap = ImageManager.loadBitmap(
        "img/battlehud/",
        "commandOrb_Attack"
      );
      this._commandAttack.setBlendColor([0, 0, 0, 0]);
      this._commandTech.setBlendColor([0, 0, 0, 255]);
      this._commandGuard.setBlendColor([0, 0, 0, 255]);
      this._commandItems.setBlendColor([0, 0, 0, 255]);
      if (this._commandLS.rotation >= -0.65) this._commandLS.rotation -= 0.04;
      break;
    case 1:
      if (this._commandHL.y < 478 + 96) this._commandHL.y += 10;
      if (this._commandHL.y > 478 + 96) this._commandHL.y -= 10;
      this._commandIcon.bitmap = ImageManager.loadBitmap(
        "img/battlehud/",
        "commandOrb_Tech"
      );
      this._commandAttack.setBlendColor([0, 0, 0, 255]);
      this._commandTech.setBlendColor([0, 0, 0, 0]);
      this._commandGuard.setBlendColor([0, 0, 0, 255]);
      this._commandItems.setBlendColor([0, 0, 0, 255]);
      if (this._commandLS.rotation <= -0.25) this._commandLS.rotation += 0.04;
      if (this._commandLS.rotation >= -0.25) this._commandLS.rotation -= 0.04;
      break;
    case 2:
      if (this._commandHL.y < 518 + 96) this._commandHL.y += 10;
      if (this._commandHL.y > 518 + 96) this._commandHL.y -= 10;
      this._commandIcon.bitmap = ImageManager.loadBitmap(
        "img/battlehud/",
        "commandOrb_Guard"
      );
      this._commandAttack.setBlendColor([0, 0, 0, 255]);
      this._commandTech.setBlendColor([0, 0, 0, 255]);
      this._commandGuard.setBlendColor([0, 0, 0, 0]);
      this._commandItems.setBlendColor([0, 0, 0, 255]);
      if (this._commandLS.rotation <= 0.15) this._commandLS.rotation += 0.04;
      if (this._commandLS.rotation >= 0.15) this._commandLS.rotation -= 0.04;
      break;
    case 3:
      if (this._commandHL.y < 558 + 96) this._commandHL.y += 10;
      if (this._commandHL.y > 558 + 96) this._commandHL.y -= 10;
      this._commandIcon.bitmap = ImageManager.loadBitmap(
        "img/battlehud/",
        "commandOrb_Items"
      );
      this._commandAttack.setBlendColor([0, 0, 0, 255]);
      this._commandTech.setBlendColor([0, 0, 0, 255]);
      this._commandGuard.setBlendColor([0, 0, 0, 255]);
      this._commandItems.setBlendColor([0, 0, 0, 0]);
      if (this._commandLS.rotation <= 0.65) this._commandLS.rotation += 0.04;
      break;
  }
};

Scene_Battle.prototype.removeCommandGraphics = function () {
  this._Kaus_CommandCall = false;
};

//====================================================================================================================
// D E S T I N Y   G R A P H I C S   M E T H O D S
//====================================================================================================================

//this._DestinyArrow.opacityに注意
Scene_Battle.prototype.createDestinyGraphics = function () {
  if (!this._fadeBlackRIGHT) {
    this._fadeBlackRIGHT = new Sprite();
    this._fadeBlackLEFT = new Sprite();
    this._DestinyFight = new Sprite();
    this._DestinyEscape = new Sprite();
    this._Destiny = new Sprite();
    this._DestinyHL = new Sprite();
    this._DestinyArrow = new Sprite();
    this._fadeBlackRIGHT.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "BattleFate_FadeRight"
    );
    this._fadeBlackLEFT.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "BattleFate_FadeLeft"
    );
    this._DestinyFight.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "BattleFate_Fight"
    );
    this._DestinyEscape.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "BattleFate_Escape"
    );
    this._Destiny.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "BattleFate_Destiny"
    );
    this._DestinyHL.bitmap = ImageManager.loadBitmap(
      "img/battlehud/",
      "BattleFate_HL"
    );
    this.addChild(this._fadeBlackRIGHT);
    this.addChild(this._fadeBlackLEFT);
    this.addChild(this._DestinyHL);
    this.addChild(this._DestinyFight);
    this.addChild(this._DestinyEscape);
    this.addChild(this._Destiny);
    this.addChild(this._DestinyArrow);
  }

  this._fadeBlackLEFT.move(-1104, 0);
  this._fadeBlackRIGHT.move(1104, 0);
  this._DestinyFight.move(239, 187);
  this._DestinyEscape.move(611, 190);
  this._Destiny.move(449, 142);
  this._DestinyHL.move(172, 170);
  this._DestinyArrow.move(480, 203);
  this._DestinyHL.blendMode = 1;

  this._DestinyFight.opacity = 0;
  this._DestinyEscape.opacity = 0;
  this._Destiny.opacity = 0;
  this._DestinyHL.opacity = 0;
  this._DestinyArrow.opacity = 0;

  this._KausArrowData = []; //Array: 0=R 1=L
  this._KausArrowData[0] = 480;
  this._KausArrowData[1] = 550;
  this._KaustoggleArrow = false;
  this._KaustoggleHL = false;
  this._Kausmovement = 0;
};

//Arrowの動きの制御に注意。
Scene_Battle.prototype.updateDestinyGraphics = function () {
  const checkwin = this._partyCommandWindow;
  if (!(checkwin && checkwin.active)) return;
  const posdesf = this._DestinyFight;
  const posdese = this._DestinyEscape;
  const inputobjcond = {
    targetwin: checkwin,
    condposarr: [
      [posdesf.x, posdesf.y, posdesf.width, posdesf.height],
      [posdese.x, posdese.y, posdese.width, posdese.height],
    ],
  };
  const preindex = checkwin.index();
  if (SceneManager.Kausinputok(inputobjcond)) {
    this.removeDestinyGraphics();
    return;
  }
  if (
    preindex !== checkwin.index() ||
    Input.isRepeated("left") ||
    Input.isRepeated("right")
  ) {
    this._Kausmovement = 0;
    this._KaustoggleArrow = false;
    this._KaustoggleHL = false;
    this._DestinyHL.opacity = 0;
  }
  this._DestinyArrow.opacity = 255;

  checkwin.visible = false;
  if (this._Destiny.opacity != 255) this._Destiny.opacity += 20;
  if (!this._KaustoggleHL) {
    if (this._DestinyHL.opacity != 255) this._DestinyHL.opacity += 5;
    else this._KaustoggleHL = true;
  } else {
    if (this._DestinyHL.opacity != 0) this._DestinyHL.opacity -= 5;
    else this._KaustoggleHL = false;
  }

  //Command Selection Update, Arrow Movement
  switch (checkwin.index()) {
    case 0:
      this._DestinyArrow.bitmap = ImageManager.loadBitmap(
        "img/battlehud/",
        "BattleFate_ArrowR"
      );
      this._DestinyHL.move(172, 170);
      if (
        (this._DestinyArrow.x != this._KausArrowData[0] + 10) &
        !this._KaustoggleArrow
      )
        this._Kausmovement += 0.5;
      else this._KaustoggleArrow = true;
      if (
        (this._DestinyArrow.x != this._KausArrowData[0]) &
        this._KaustoggleArrow
      )
        this._Kausmovement -= 0.5;
      else this._KaustoggleArrow = false;
      this._DestinyArrow.move(480 + this._Kausmovement, 203);
      if (this._fadeBlackRIGHT.x > 110.4) this._fadeBlackRIGHT.x -= 110.4;
      if (this._fadeBlackLEFT.x > -1104) this._fadeBlackLEFT.x -= 110.4;
      this._DestinyFight.setColorTone([0, 0, 0, 0]);
      this._DestinyEscape.setColorTone([-255, -255, -255, 255]);
      this._DestinyFight.opacity += 25;
      this._DestinyEscape.opacity += 25;
      break;
    case 1:
      this._DestinyArrow.bitmap = ImageManager.loadBitmap(
        "img/battlehud/",
        "BattleFate_ArrowL"
      );
      this._DestinyHL.move(558, 170);
      if (
        (this._DestinyArrow.x != this._KausArrowData[1] - 10) &
        !this._KaustoggleArrow
      )
        this._Kausmovement -= 0.5;
      else this._KaustoggleArrow = true;
      if (
        (this._DestinyArrow.x != this._KausArrowData[1]) &
        this._KaustoggleArrow
      )
        this._Kausmovement += 0.5;
      else this._KaustoggleArrow = false;
      this._DestinyArrow.move(550 + this._Kausmovement, 203);
      if (this._fadeBlackRIGHT.x < 1104) this._fadeBlackRIGHT.x += 110.4;
      if (this._fadeBlackLEFT.x < -110.4) this._fadeBlackLEFT.x += 110.4;
      this._DestinyFight.setColorTone([-255, -255, -255, 255]);
      this._DestinyEscape.setColorTone([0, 0, 0, 0]);
      this._DestinyFight.opacity += 25;
      this._DestinyEscape.opacity += 25;
      break;
  }
};

Scene_Battle.prototype.removeDestinyGraphics = function () {
  this._Kaus_DestinyCall = false;
};
