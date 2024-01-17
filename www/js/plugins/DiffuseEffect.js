//=============================================================================
// DiffuseEffect.js
//=============================================================================
// [Update History]
// 2017.Feb.12 Ver0.0.0 Closed Version
// 2019.Jun.27 Ver1.0.0 First Release

/*:
 * @plugindesc Display light diffusion effect on map and title scene
 * @author Sasuke KANNAZUKI (thx to Rokan)
 *
 * @param Title Effect Type
 * @desc 0:none >=1: display the same effect as plugin parameter at title
 * @default 0
 *
 * @requiredAssets img/system/RE_001
 * @requiredAssets img/system/RE_002
 * @requiredAssets img/system/RE_003
 *
 * @help
 * At first you have to do:
 * This plugin requires 3 image files to run.
 * Put RE_001, RE_002, RE_003 at img/system.
 *
 * Plugin commands:
 * at map scene, use plugin command to set.
 * DiffuseEffect start [param]
 * - [param] is number that represents the sort of light behaviour.
 *  1 : diffuse from center
 *  2 : converge to center
 *  3 : from top to the bottom of center
 *  4 : from top to the bottom of all horizontal position
 *  5 : from right up to left down
 * 21 : go up with drawing irregular spiral
 * 22 : go up with waving
 * 23 : go up with drawing regular spiral
 * 31 : go down like the snow falling down
 *  0 : disappear
 * ex:
 * DiffuseEffect start 1    # start effect "diffuse from center"
 *
 * DiffuseEffect end        # effects disappear immidiately
 * DiffuseEffect fade       # effects fade out and then disappear
 *
 * Copyright: This plugin is based on Rokan's RGSS3 script material.
 * see "Kaisou Ryouiki" http://kaisou-ryouiki.sakura.ne.jp/
 * Thanks to Rokan.
 *
 * License:
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */
/*:ja
 * @plugindesc マップ画面とタイトル画面に拡散する光を表示します
 * @author 神無月サスケ (原案:ろかん)
 *
 * @param Title Effect Type
 * @desc タイトル画面での光拡散の表示 0:しない 1以上:する(プラグインコマンドの引数と同じ)
 * @default 0
 *
 * @requiredAssets img/system/RE_001
 * @requiredAssets img/system/RE_002
 * @requiredAssets img/system/RE_003
 *
 * @help
 * 最初にすべきこと:
 * このプラグインの実行には、添付の画像ファイルが必要です。
 * img/system フォルダに、RE_001, RE_002, RE_003を置いて下さい。
 *
 * プラグイン概要:
 * マップ画面で表示する場合は、プラグインコマンドを呼びだしてください。
 * プラグインコマンド:
 * DiffuseEffect start [param]
 * - [param] エフェクトの種類
 *  1 : 中心から発散
 *  2 : 中心へ収束
 *  3 : 中央上部から下へ
 *  4 : 上部全体から下へ
 *  5 : 右上から左下へ
 * 21 : 不規則な螺旋を描いて上昇
 * 22 : ゆらゆらと上昇
 * 23 : 規則正しい螺旋を描いて上昇
 * 31 : 雪
 *  0 : 消去
 * ex:
 * DiffuseEffect start 1    # "中心から発散" エフェクトを開始
 *
 * DiffuseEffect end        # エフェクトの終了（即時）
 * DiffuseEffect fade       # フェードアウトしながらエフェクトを終了
 *
 * 著作権表記:
 * このプラグインは、ろかん氏のRGSS3素材をベースに作成しました。
 * Webサイト：回想領域 http://kaisou-ryouiki.sakura.ne.jp/
 * ろかん氏に謝意を示します。
 *
 * ライセンス表記:
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function () {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters("DiffuseEffect");
  var titleType = Number(parameters["Title Effect Type"] || 0);

  //
  // process plugin command
  //
  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === "DiffuseEffect") {
      switch (args[0]) {
        case "start":
          $gameScreen.startREffect(Number(args[1]) || 0);
          break;
        case "end":
          $gameScreen.endREffect();
          break;
        case "fade":
          $gameScreen.fadeREffect();
          break;
      }
    }
  };

  //
  // Game_Screen
  //
  var _Game_Screen_initialize = Game_Screen.prototype.initialize;
  Game_Screen.prototype.initialize = function () {
    _Game_Screen_initialize.call(this);
    this.rEffectType = 0;
    this.requestResetREffect = false;
  };

  Game_Screen.prototype.startREffect = function (type) {
    this.rEffectType = type;
  };

  Game_Screen.prototype.endREffect = function () {
    this.requestResetREffect = true;
    this.rEffectType = 0;
  };

  Game_Screen.prototype.fadeREffect = function () {
    this.rEffectType = 0;
  };

  //
  // Game_Temp
  //
  var _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);
    this.rEffects = new REffects();
  };

  //
  // Spriteset_Map
  //
  var _Spriteset_Base_createScreenSprites =
    Spriteset_Base.prototype.createScreenSprites;
  Spriteset_Base.prototype.createScreenSprites = function () {
    this.addChild($gameTemp.rEffects);
    _Spriteset_Base_createScreenSprites.call(this);
  };

  // ------------------------------------------------------
  //
  // Sprite_REffect : an element of the light
  //
  function Sprite_REffect() {
    this.initialize.apply(this, arguments);
  }

  Sprite_REffect.prototype = Object.create(Sprite.prototype);
  Sprite_REffect.prototype.constructor = Sprite_REffect;

  Sprite_REffect.span = false;

  Sprite_REffect.prototype.initialize = function (type) {
    Sprite.prototype.initialize.call(this);
    this.reset();
    this.effectType = type || 0;
    if (type) {
      this.setup(type);
    }
  };

  Sprite_REffect.prototype.reset = function () {
    this.effectType = 0;
    this.initialPos = new Point(0, 0);
    this.moveAngle = new Point(0.0, 0.0); // radian
    this.radius = 0.0;
    this.blendMode = Graphics.BLEND_ADD;
    this.bitmap = null;
    Sprite_REffect.span = !Sprite_REffect.span;
    return this;
  };

  Sprite_REffect.prototype.setZoom = function (value) {
    this.scale.set(value, value);
  };

  Sprite_REffect.prototype.setGraphic = function (filename) {
    this.bitmap = ImageManager.loadSystem(filename);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
  };

  Sprite_REffect.prototype.setStartPos = function (typeX, typeY) {
    switch (typeX) {
      case 0: // random
        this.initialPos.x = Math.randomInt(Graphics.width + 150) - 75;
        break;
      case 1: // out of screen (left)
        this.initialPos.x = -45;
        break;
      case 2: // center
        this.initialPos.x = Graphics.width / 2;
        break;
      case 3: // out of screen (right)
        this.initialPos.x = Graphics.width + 45;
        break;
    }
    switch (typeY) {
      case 0: // random
        this.initialPos.y = Math.randomInt(Graphics.height + 75) - 36;
        break;
      case 1: // out of screen (upper)
        this.initialPos.y = -45;
        break;
      case 2: // center
        this.initialPos.y = Graphics.height / 2;
        break;
      case 3: // out of screen (down)
        this.initialPos.y = Graphics.height + 45;
        break;
    }
    this.x = this.initialPos.x;
    this.y = this.initialPos.y;
  };

  Sprite_REffect.prototype.setMoveAngle = function (ax, ay) {
    this.moveAngle.x = Math.cos(ax * 0.01);
    this.moveAngle.y = Math.sin((ay || ax) * 0.01);
  };

  Sprite_REffect.prototype.getX = function () {
    return this.initialPos.x + this.radius * this.moveAngle.x;
  };

  Sprite_REffect.prototype.getY = function () {
    return this.initialPos.y + this.radius * this.moveAngle.y;
  };

  Sprite_REffect.prototype.getZoom = function () {
    return (
      ((this.radius * this.moveAngle.y) / Graphics.width / 1.5 + 0.8) *
      (this.opacity / 200.0)
    );
  };

  Sprite_REffect.prototype.setup = function (type) {
    this.effectType = type;
    switch (Math.floor(this.effectType / 10)) {
      case 0:
        this.setupDiffusion();
        break;
      case 2:
        this.setupSpiral();
        break;
      case 3:
        this.setupSnow();
        break;
    }
    return this;
  };

  Sprite_REffect.prototype.setupDiffusion = function () {
    switch (this.effectType) {
      case 1:
        this.radius = Math.randomInt(Graphics.width / 3) + 1.0;
        this.moveSpeed = (Math.randomInt(75) + 1) * 0.01 + 0.75;
        this.duration = Math.randomInt(100) + 80;
        this.setStartPos(2, 2);
        this.setMoveAngle(Math.randomInt(2 * Math.PI * 100));
        this.setGraphic("RE_001");
        break;
      case 2:
        this.radius = Math.randomInt(Graphics.width / 3) + 45.0;
        this.moveSpeed = (Math.randomInt(75) + 1) * -0.01 - 0.75;
        this.duration = Math.randomInt(100) + 90;
        this.setStartPos(2, 2);
        this.setMoveAngle(Math.randomInt(2 * Math.PI * 100));
        this.setGraphic("RE_001");
        break;
      case 3:
        this.radius = Math.randomInt(Graphics.width / 2) + 1.0;
        this.moveSpeed = (Math.randomInt(75) + 1) * 0.01 + 0.75;
        this.duration = Math.randomInt(100) + 80;
        this.setStartPos(2, 1);
        this.setMoveAngle(
          Math.randomInt(2 * Math.PI * 100),
          Math.randomInt(Math.PI * 100)
        );
        this.setGraphic("RE_001");
        break;
      case 4:
        this.radius = Math.randomInt(Graphics.width / 2) + 1.0;
        this.moveSpeed = (Math.randomInt(75) + 1) * 0.01 + 0.75;
        this.duration = Math.randomInt(100) + 80;
        this.setStartPos(0, 1);
        this.setMoveAngle(
          Math.randomInt(2 * Math.PI * 100),
          Math.randomInt(Math.PI * 100)
        );
        this.setGraphic("RE_001");
        break;
      case 5:
        this.radius = Math.randomInt(Graphics.width / 2) + 1.0;
        this.moveSpeed = (Math.randomInt(75) + 1) * 0.01 + 0.75;
        this.duration = Math.randomInt(100) + 120;
        this.setStartPos(3, 1);
        this.setMoveAngle(
          Math.randomInt(Math.PI * 100) + 90,
          Math.randomInt(Math.PI * 100)
        );
        this.setGraphic("RE_001");
        break;
    }
    this.maxOpacity = Math.randomInt(160) + 40;
    this.opacity = 1;
  };

  Sprite_REffect.prototype.setupSpiral = function () {
    switch (this.effectType) {
      case 21:
        this.radius = Math.randomInt(300) + 1.0;
        this.moveSpeed = 7.5 - this.radius / 50.0;
        this.nextAngle = Math.randomInt(360) * 1.0;
        this.collapseSpeed = 1;
        this.setStartPos(2, 3);
        this.setGraphic("RE_002");
        break;
      case 22:
        this.radius = Math.randomInt(60) + 1.0;
        this.moveSpeed = (Math.randomInt(150) + 1.0) * 0.01 + 1.0;
        this.nextAngle = Math.randomInt(360) * 1.0;
        this.collapseSpeed = Math.randomInt(3) === 0 ? 2 : 1;
        this.setStartPos(0, 3);
        this.setGraphic("RE_002");
        break;
      case 23:
        this.radius = 270;
        this.moveSpeed = 2.55;
        this.nextAngle = Sprite_REffect.span ? 0.0 : 180.0;
        this.collapseSpeed = 0;
        this.setStartPos(2, 3);
        this.setGraphic("RE_002");
        break;
    }
    this.opacity = 255;
    this.floatY = this.y * 1.0;
  };

  Sprite_REffect.prototype.setupSnow = function () {
    this.setStartPos(0, 1);
    this.setGraphic("RE_003");
    var z = Math.randomInt(100);
    if (z <= 49) {
      this.setZoom((3 + Math.randomInt(2)) / 10.0);
    } else if (z <= 89) {
      this.setZoom((6 + Math.randomInt(2)) / 10.0);
    } else {
      this.setZoom((9 + Math.randomInt(2)) / 10.0);
    }
    this.moveSpeed = this.scale.x * 2.4;
    this.floatY = this.y * 1.0;
    this.radius = Math.randomInt(15) + 1.0;
    this.nextAngle = Math.randomInt(360);
    this.duration = 1500;
    this.opacity = 255;
  };

  Sprite_REffect.prototype.update = function () {
    Sprite.prototype.update.call(this);
    switch (Math.floor(this.effectType / 10)) {
      case 0:
        this.updateDiffusion();
        break;
      case 2:
        this.updateSpiral();
        break;
      case 3:
        this.updateSnow();
        break;
    }
  };

  Sprite_REffect.prototype.updateDiffusion = function () {
    this.duration--;
    this.radius = Math.max(this.radius + this.moveSpeed, 0.0);
    this.x = Math.floor(this.getX());
    this.y = Math.floor(this.getY());
    this.setZoom(this.getZoom());
    this.opacity = Math.min(
      this.opacity + (this.duration > 0 ? 1 : -1),
      this.maxOpacity
    );
  };

  Sprite_REffect.prototype.updateSpiral = function () {
    this.nextAngle += Math.min(this.moveSpeed / 1.5, 2);
    if (this.nextAngle >= 360) {
      this.nextAngle = 0;
    }
    this.setMoveAngle(this.nextAngle * 1.74533);
    this.x = this.getX();
    this.y = Math.round((this.floatY -= this.moveSpeed));
    this.setZoom(this.getZoom());
    this.opacity -= this.collapseSpeed;
  };

  Sprite_REffect.prototype.updateSnow = function () {
    this.duration -= 3;
    this.nextAngle += Math.min(this.moveSpeed / 1.5, 2);
    if (this.nextAngle >= 360) {
      this.nextAngle = 0;
    }
    this.setMoveAngle(this.nextAngle * 1.74533);
    this.x = this.getX();
    this.y = Math.round((this.floatY += this.moveSpeed));
    this.opacity = this.duration;
  };

  Sprite_REffect.prototype.needDispose = function () {
    switch (Math.floor(this.effectType / 10)) {
      case 0:
        return this.opacity === 0;
      case 2:
        return this.y <= -(this.height * this.anchor.y) || this.opacity === 0;
      case 3:
        return this.y > Graphics.height || this.opacity === 0;
      default:
        return true;
    }
  };

  // ------------------------------------------------------
  //
  // REffects : manage Sprite_REffect objects
  //
  function REffects() {
    this.initialize.apply(this, arguments);
  }

  REffects.prototype = Object.create(Sprite.prototype);
  REffects.prototype.constructor = REffects;

  REffects.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.reset();
  };

  REffects.prototype.reset = function () {
    if (this.sprites) {
      while (this.sprites.length > 0) {
        this.removeChild(this.sprites.shift());
      }
    }
    this.sprites = [];
    this.spriteFactory = [];
    this.effectType = 0;
    this.waitCount = 0;
  };

  REffects.prototype.restoreSprites = function () {
    var sprite;
    while (this.sprites.length > 0) {
      sprite = this.sprites.shift();
      this.removeChild(sprite);
      this.spriteFactory.push(sprite.reset());
    }
    this.waitCount = 0;
  };

  REffects.prototype.newSprite = function () {
    if (this.spriteFactory.length > 0) {
      return this.spriteFactory.shift().setup(this.effectType);
    } else {
      return new Sprite_REffect(this.effectType);
    }
  };

  REffects.prototype.setNewSprite = function () {
    var sprite = this.newSprite();
    this.addChild(sprite);
    this.sprites.push(sprite);
    return sprite;
  };

  REffects.prototype.update = function () {
    this.updateReset();
    this.updateChangeType();
    this.updateWaitCount();
    Sprite.prototype.update.call(this);
    this.updateRestoreSprites();
  };

  REffects.prototype.updateReset = function () {
    if ($gameScreen.requestResetREffect) {
      this.restoreSprites();
      $gameScreen.requestResetREffect = false;
    }
  };

  REffects.prototype.updateChangeType = function () {
    $gameScreen.rEffectType = $gameScreen.rEffectType || 0;
    if (this.effectType != $gameScreen.rEffectType) {
      this.effectType = $gameScreen.rEffectType;
    }
  };

  REffects.prototype.updateWaitCount = function () {
    if (this.effectType) {
      if (this.waitCount === 0) {
        this.setNewSprite();
        this.waitCount = this.effectType > 30 ? 20 : 10;
      }
      this.waitCount--;
    }
  };

  REffects.prototype.updateRestoreSprites = function () {
    var rEffects = this;
    this.sprites = this.sprites.filter(function (sprite) {
      if (sprite.needDispose()) {
        rEffects.removeChild(sprite);
        rEffects.spriteFactory.push(sprite.reset());
        return false;
      }
      return true;
    });
  };

  // ------------------------------------------------------
  //
  // REffectsTitle : REffect for Title.
  //
  function REffectsTitle() {
    this.initialize.apply(this, arguments);
  }

  REffectsTitle.prototype = Object.create(REffects.prototype);
  REffectsTitle.prototype.constructor = REffectsTitle;

  REffectsTitle.prototype.initialize = function () {
    REffects.prototype.initialize.call(this);
    this.effectType = titleType;
  };

  REffectsTitle.prototype.updateReset = function () {};

  REffectsTitle.prototype.updateChangeType = function () {};

  var _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
  Scene_Title.prototype.createForeground = function () {
    _Scene_Title_createForeground.call(this);
    if (titleType) {
      this.addChild(new REffectsTitle());
    }
  };
})();
