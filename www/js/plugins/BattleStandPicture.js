//============================================
// PassiveSkillPoint.js
//--------------------------------------------
// 戦闘＆メニュー画面立ち絵表示プラグイン
//============================================

/*:ja
 * @plugindesc 戦闘中に立ち絵を表示するプラグインです。
 * @author 村人Ａ
 *
 * @param 立ち絵サイズ
 * @desc 立ち絵のサイズを指定します。幅,高さの順で記述してください。
 * @default 546,624
 *
 * @param 戦闘中立ち絵x座標
 * @desc 戦闘中の立ち絵のx座標表示位置です。
 * @default 600
 * @type number
 * @max 99999
 * @min -99999
 *
 * @param 戦闘中立ち絵y座標
 * @desc 戦闘中の立ち絵のy座標表示位置です。
 * @default 100
 * @type number
 * @max 99999
 * @min -99999
 *
 * @param 戦闘中アクターへのアニメーションx座標
 * @desc 戦闘中の立ち絵に表示するアニメーションのｘ座標を指定します。
 * @default 400
 * @type number
 * @max 99999
 * @min -99999
 *
 * @param 戦闘中アクターへのアニメーションy座標
 * @desc 戦闘中の立ち絵に表示するアニメーションのy座標を指定します。
 * @default 300
 * @type number
 * @max 99999
 * @min -99999
 *
 * @param メニュー画面立ち絵x座標
 * @desc メニュー画面の立ち絵のx座標表示位置です。
 * @default 600
 * @type number
 * @max 99999
 * @min -99999
 *
 * @param メニュー画面立ち絵y座標
 * @desc メニュー画面の立ち絵のy座標表示位置です。
 * @default 100
 * @type number
 * @max 99999
 * @min -99999
 *
 * @param 異常状態優先度
 * @desc 立ち絵を変更するステート名の羅列をカンマを挟んで記述してください。先頭（左側）に記述するほど表示する優先度が上がります。
 * @default 毒,暗闇,睡眠
 *
 * @help
 * --------------------------------------------
 * ◯バージョン管理◯
 * --------------------------------------------
 *　2019/3/21 ver1.1
 *　アクターへのアニメーションの位置が0,0の位置だった点を修正しました。
 * アニメーションの位置はプラグインパラメータの
 * 「戦闘中アクターへのアニメーションx座標」
 * 「戦闘中アクターへのアニメーションy座標」
 * にて指定してください。
 *
 *　2018/6/29 ver0.91
 *　コマンド選択時立ち絵が通常のものに戻る仕様を変更
 *
 *　2018/6/26 ver0.90
 *　試作品リリース
 *
 * --------------------------------------------
 * ◯ヘルプ◯
 * --------------------------------------------
 * 〇立ち絵に使用する画像の配置の仕方〇
 * 立ち絵に使用する画像はimg/pictures/stand_images/の中に保存してください。
 * 立ち絵に使用する画像の名前は決まっていますのでサンプルの画像を参考になさって
 * ください。
 *
 * 立ち絵には状態ごとにそれぞれ体力が半分以上の場合、半分未満1/4以上の場合、
 * 1/4未満の場合で設定できます。
 * それぞれ接尾語として_nomal、_near_pinch、_pinchが付きます。
 * 通常立ち絵の場合は
 *
 * wait_nomal、wait_near_pinch、wait_pinch
 *
 * という名前になります。
 * この通常の立ち絵は必ず用意してください。
 * この名前の画像がない場合はエラーが起きるようにしてあります。
 *
 * ダメージを受けた時と勝利時、各異常ステート時で立ち絵が変更されるようにしてあり
 * ます。
 * 各異常ステートの立ち絵を作る場合はデータベースのステート名に体力による接尾語を
 * つけてください。
 * 例えば毒ステートの時には
 *
 * 毒_nomal、毒_near_pinch、毒_pinch
 *
 * という名前を付けてください。
 * 画像形式はいずれもpngでお願いします。
 *
 * 〇プラグインパラメータについて〇
 * プラグインパラメータでは戦闘中の立ち絵の位置とメニュー画面での立ち絵の位置、
 * 状態異常の優先度を設定することができます。
 * 立ち絵のサイズはダメージポップアップの位置の設定に使用しています。
 * デフォルトでは頂いた画像のサイズを設定してありますが画像のサイズを変更したり
 * 拡縮する際はこちらを変更してください。
 *
 */

(function () {
  "use strict";

  var parameters = PluginManager.parameters("BattleStandPicture");
  var villaA_StandPicture_Size = String(parameters["立ち絵サイズ"])
    .split(",")
    .map(function (ele) {
      return Number(ele);
    }) || [546, 624];
  var villaA_battle_StandAnimationPositionX = Number(
    parameters["戦闘中アクターへのアニメーションx座標"]
  );
  var villaA_battle_StandAnimationPositionY = Number(
    parameters["戦闘中アクターへのアニメーションy座標"]
  );
  var villaA_battle_StandPositionX = Number(parameters["戦闘中立ち絵x座標"]);
  var villaA_battle_StandPositionY = Number(parameters["戦闘中立ち絵y座標"]);
  var villaA_menu_StandPositionX = Number(
    parameters["メニュー画面立ち絵x座標"]
  );
  var villaA_menu_StandPositionY = Number(
    parameters["メニュー画面立ち絵y座標"]
  );
  var villaA_battle_stand_ValidStateArray = String(
    parameters["異常状態優先度"] || "毒,暗闇,睡眠"
  ).split(",");

  var _alias_villaA_battle_stand_Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _alias_villaA_battle_stand_Scene_Boot_start.call(this);
    this.checkPluginParameters();
  };

  Scene_Boot.prototype.checkPluginParameters = function () {
    var stateNameArray = $dataStates.map(function (state) {
      if (!state) return "";
      return state.name;
    });
    villaA_battle_stand_ValidStateArray.forEach(function (stateName) {
      if (stateNameArray.indexOf(stateName) < 0) {
        throw new Error(
          stateName +
            "という名前のステートがデータベースにありません。プラグインパラメータに間違いがないか確認してください。"
        );
      }
    });
  };

  ImageManager.loadBattleStandImage = function (filename, crisis, hue) {
    if (StorageManager.CheckImgFilePath(filename)) {
      return this.loadBitmap("img/pictures/stand_images/", filename, hue, true);
    } else {
      var escapeFileName = "wait" + crisis;
      if (StorageManager.CheckImgFilePath(escapeFileName)) {
        return this.loadBitmap(
          "img/pictures/stand_images/",
          escapeFileName,
          hue,
          true
        );
      } else {
        throw new Error(
          "通常状態のＨＰ1/4未満、半分未満、半分以上の立ち絵が見つかりません。wait_nomal.png、wait_near_pinch.png、wait_pinch.pngをstand_imagesフォルダ内にご用意ください。"
        );
      }
    }
  };

  StorageManager.CheckImgFilePath = function (name) {
    var filePath = this.localImgFilePath(name);
    var fs = require("fs");
    return fs.existsSync(filePath);
  };

  StorageManager.localImgFilePath = function (name) {
    var fileName = name + ".png";
    return this.localImgFileDirectoryPath() + fileName;
  };

  StorageManager.localImgFileDirectoryPath = function () {
    var path = require("path");
    var base = path.dirname(process.mainModule.filename);
    return path.join(base, "img/pictures/stand_images/");
  };

  //-----------------------------------------------------------------------------
  // Sprite_StandCharaPicture

  function Sprite_StandCharaPicture() {
    this.initialize.apply(this, arguments);
  }

  Sprite_StandCharaPicture.prototype = Object.create(Sprite.prototype);
  Sprite_StandCharaPicture.prototype.constructor = Sprite_StandCharaPicture;

  Sprite_StandCharaPicture.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.initStandPicture();
    this._preMotionType = null;
    if (!$gameParty.inBattle()) {
      this.updateStandPictureForMenu();
    } else {
      this.updateStandPictureForBattle("wait");
    }
  };

  Sprite_StandCharaPicture.prototype.initStandPicture = function () {
    var bitmap = ImageManager.loadBattleStandImage("wait_nomal", "nomal");
    this._standPicture = new Sprite(bitmap);
    if ($gameParty.inBattle()) {
      this._standPicture.x = villaA_battle_StandPositionX;
      this._standPicture.y = villaA_battle_StandPositionY;
    } else {
      this._standPicture.x = villaA_menu_StandPositionX;
      this._standPicture.y = villaA_menu_StandPositionY;
    }
    this.addChild(this._standPicture);
  };

  Sprite_StandCharaPicture.prototype.update = function () {
    Sprite.prototype.update.call(this);
  };

  Sprite_StandCharaPicture.prototype.crisisSuffix = function () {
    var playerActorHpRate = $gameParty.leader().hp / $gameParty.leader().mhp;
    var crisis = "_nomal";
    if (playerActorHpRate < 0.25) {
      crisis = "_pinch";
    } else if (playerActorHpRate < 0.5) {
      crisis = "_near_pinch";
    }
    return crisis;
  };

  Sprite_StandCharaPicture.prototype.stateDescribeOnMenu = function () {
    var actor = $gameParty.leader();
    var stateMotion = actor.stateMotionIndex();
    if (stateMotion === 2) {
      return "sleep";
    } else if (stateMotion === 1) {
      return this.setAbnomalDescribe() ? this.setAbnomalDescribe() : "wait";
    } else {
      return "wait";
    }
  };

  Sprite_StandCharaPicture.prototype.updateStandPictureForMenu = function () {
    var pictureName = this.stateDescribeOnMenu() + this.crisisSuffix();
    this._standPicture.bitmap = ImageManager.loadBattleStandImage(
      pictureName,
      this.crisisSuffix()
    );
  };

  Sprite_StandCharaPicture.prototype.updateStandPictureForBattle = function (
    motionType
  ) {
    if (!this._standPicture) return;
    var crisis = this.crisisSuffix();
    var actor = $gameParty.leader();
    if (motionType == "walk") motionType = "wait";
    if (
      this.hasCheckedState() &&
      motionType != "damage" &&
      motionType != "victory"
    ) {
      motionType = "abnormal";
    }
    if (motionType == "abnormal" || motionType == "sleep") {
      var abnomalDescribe = this.setAbnomalDescribe();
      if (abnomalDescribe) {
        var abnomalDescribeName = abnomalDescribe;
        var pictureName = abnomalDescribeName + crisis;
        this._standPicture.bitmap = ImageManager.loadBattleStandImage(
          pictureName,
          crisis
        );
        if (this._preMotionType == pictureName) return;
        this._preMotionType = pictureName;
      } else {
        motionType = "wait";
      }
    }
    if (
      motionType == "damage" ||
      motionType == "wait" ||
      motionType == "victory"
    ) {
      var pictureName = motionType + crisis;
      this._standPicture.bitmap = ImageManager.loadBattleStandImage(
        pictureName,
        crisis
      );
      if (this._preMotionType == pictureName) return;
      this._preMotionType = pictureName;
    }
  };

  Sprite_StandCharaPicture.prototype.hasCheckedState = function () {
    var states = $gameParty
      .leader()
      .states()
      .map(function (state) {
        return villaA_battle_stand_ValidStateArray.indexOf(state.name);
      });
    var applyStateIndexMax = Math.max.apply(null, states);
    if (applyStateIndexMax < 0) {
      return false;
    } else {
      return true;
    }
  };

  Sprite_StandCharaPicture.prototype.setAbnomalDescribe = function () {
    var tesArr = $gameParty
      .leader()
      .states()
      .map(function (state) {
        return state.name;
      });
    var changeState = $gameParty
      .leader()
      .states()
      .map(function (state) {
        return villaA_battle_stand_ValidStateArray.indexOf(state.name);
      });
    var validChangeState = changeState.filter(function (element) {
      return element >= 0;
    });
    var applyStateIndexMin = Math.min.apply(null, validChangeState);
    if (validChangeState.length == 0) return false;
    var name = villaA_battle_stand_ValidStateArray[applyStateIndexMin];
    return name;
  };

  Sprite_StandCharaPicture.prototype.standCharaPicture = function () {
    return this._standPicture.bitmap.width;
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Battle

  Spriteset_Battle.prototype.createLowerLayer = function () {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleField();
    this.createBattleback();
    this.createStandPicture();
    this.createEnemies();
    this.createActors();
    this.settingDamagePopupLayer();
  };

  Spriteset_Battle.prototype.createStandPicture = function () {
    this.standPictureSprite = new Sprite_StandCharaPicture();
    this._battleField.addChild(this.standPictureSprite);
    this._damagePopupContainer = new Sprite();
    this.addChild(this._damagePopupContainer);
  };

  Spriteset_Battle.prototype.settingDamagePopupLayer = function () {
    this.battlerSprites().forEach(
      function (sprite) {
        sprite.setDamagePopupLayer(this._damagePopupContainer);
      }.bind(this)
    );
    this._actorSprites[0].getStandPicture(this.standPictureSprite);
  };

  Spriteset_Battle.prototype.createActors = function () {
    this._actorSprites = [];
    this._actorSprites[0] = new Sprite_Actor();
    this._battleField.addChild(this._actorSprites[0]);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Battler

  Sprite_Battler.prototype.setDamagePopupLayer = function (container) {
    this._damagePopupContainer = container;
  };

  var _alias_villaA_battle_stand_Sprite_Battler_setupDamagePopup =
    Sprite_Battler.prototype.setupDamagePopup;
  Sprite_Battler.prototype.setupDamagePopup = function () {
    if (this._battler.isDamagePopupRequested()) {
      if (this._battler.isSpriteVisible()) {
        var sprite = new Sprite_Damage();
        if (this._battler.isActor()) {
          sprite.x =
            villaA_battle_StandPositionX + villaA_StandPicture_Size[0] / 2;
          sprite.y =
            villaA_battle_StandPositionY + villaA_StandPicture_Size[1] / 2;
        } else {
          sprite.x = this.x + this.damageOffsetX();
          sprite.y = this.y + this.damageOffsetY();
        }
        sprite.setup(this._battler);
        this._damages.push(sprite);
        this._damagePopupContainer.addChild(sprite);
      }
      this._battler.clearDamagePopup();
      this._battler.clearResult();
    }
  };

  Sprite_Actor.prototype.initMembers = function () {
    Sprite_Battler.prototype.initMembers.call(this);
    this._battlerName = "";
    this._motion = null;
    this._motionCount = 0;
    this._pattern = 0;
    this.createMainSprite();
  };

  Sprite_Actor.prototype.setBattler = function (battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    if (battler !== this._actor) {
      this._actor = battler;
      this.setActorHome(battler.index());
    }
  };

  Sprite_Actor.prototype.updateMain = function () {};

  Sprite_Actor.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);
    if (this._battler) {
      this.updateMain();
      this.updateAnimation();
      this.updateDamagePopup();
      this.updateSelectionEffect();
    } else {
      this.bitmap = null;
    }

    if (this._actor) {
      this.updateMotion();
    }
  };

  Sprite_Actor.prototype.setActorHome = function (index) {
    this.setHome(
      villaA_battle_StandAnimationPositionX,
      villaA_battle_StandAnimationPositionY
    );
  };

  Sprite_Actor.prototype.setupWeaponAnimation = function () {};

  Sprite_Actor.prototype.getStandPicture = function (standSprite) {
    this.standSprite = standSprite;
  };

  var _alias_villaA_battle_stand_Sprite_Actor_startMotion =
    Sprite_Actor.prototype.startMotion;
  Sprite_Actor.prototype.startMotion = function (motionType) {
    _alias_villaA_battle_stand_Sprite_Actor_startMotion.call(this, motionType);
    if (!this.standSprite) return;
    this.standSprite.updateStandPictureForBattle(motionType);
  };

  //=================================================================================
  //<--------------------------------以下メニュー画面立ち絵------------------------------->
  //=================================================================================

  var _alias_villaA_battle_stand_Scene_Menu_create =
    Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function () {
    _alias_villaA_battle_stand_Scene_Menu_create.call(this);
    this.createMenuStandPicture();
  };

  Scene_Menu.prototype.createMenuStandPicture = function () {
    this.standPictureSprite = new Sprite_StandCharaPicture();
    this.addChild(this.standPictureSprite);
  };
})();
