//=============================================================================
// TMPlugin - エネミー行動予測
// バージョン: 1.1.0
// 最終更新日: 2018/08/21
// 配布元    : http://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2016 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 敵キャラの次の行動のヒントなどをテキストで表示します。
 * より戦略的なターンバトルが実現できるかもしれません。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param width
 * @type number
 * @desc 行動予測表示の横幅
 * 初期値: 240
 * @default 240
 *
 * @param maxLines
 * @type number
 * @desc 行動予測表示の最大行数
 * 初期値: 3
 * @default 3
 *
 * @param lineHeight
 * @type number
 * @desc 行動予測表示の 1 行の高さ
 * 初期値: 36
 * @default 36
 *
 * @param color
 * @desc 行動予測表示の文字色
 * 初期値: white
 * @default white
 *
 * @param backColor
 * @desc 行動予測表示の背景の色
 * 初期値: black
 * @default black
 *
 * @param backOpacity
 * @type number
 * @max 255
 * @desc 行動予測表示の背景の不透明度
 * 初期値: 128 ( 0 ～ 255 )
 * @default 128
 *
 * @param textAlign
 * @type select
 * @option left
 * @option center
 * @option right
 * @desc 行動予測表示の行揃え
 * @default center
 * 
 * @param showIcon
 * @type boolean
 * @desc スキル名の頭にアイコンも表示する
 * 初期値: ON（ ON = 表示 / OFF = 非表示 )
 * @default true
 * 
 * @param headerText
 * @desc 行動予測表示のヘッダーテキスト
 * 初期値: Next
 * @default Next
 *
 * @param headerHeight
 * @type number
 * @desc 行動予測表示のヘッダーの高さ
 * 初期値: 20
 * @default 20
 *
 * @param headerFontSize
 * @type number
 * @desc 行動予測表示のヘッダーのフォントサイズ
 * 初期値: 16
 * @default 16
 *
 * @param headerColor
 * @desc 行動予測表示のヘッダーの文字色
 * 初期値: red
 * @default red
 *
 * @param cornerRadius
 * @type number
 * @desc TMBitmapEx.js導入時の、角丸矩形の丸部分の半径
 * 初期値: 6
 * @default 6

 * @param posFrame
 * @type number[]
 * @desc 位置,width, height #[0, -75, 200, 100]
 * @default [0, -75, 200, 100]
 *
 * @param posMsgbox
 * @type number[]
 * @desc 敵メッセージボックスの位置 #[0, -300]
 * @default [0, -300]
 *
 * @param posMsg
 * @type number[]
 * @desc 敵メッセージのオフセット位置 #[20, 0]
 * @default [20, 0]
 *
 * @param fontSizeMsg
 * @type number
 * @desc 吹き出し内文字のフォントサイズ#15
 * @default 15
 *
 * @param fontSizeShield
 * @type number
 * @desc シールドのフォントサイズ #28
 * @default 28
 *
 * @param fontSizeBoost
 * @type number
 * @desc ブーストのフォントサイズ #28
 * @default 28
 *
 * @param fontSizeHp
 * @type number[]
 * @desc HPのフォントサイズ #[28, 28]
 * @default [28, 28]
 *
 * @param textStateTurn
 * @type number[]
 * @desc ステートターン数のXオフセット位置、Yオフセット位置、フォントサイズ #[15, 5, 20]
 * @default [15, 5, 20]
 *
 * @param buffColors
 * @type string[]
 * @desc 0=バフ・1=デバフ時の数値色 #["#0000ff","#ff0000"]
 * @default ["#0000ff","#ff0000"]
 *
 * @help
 * TMPlugin - エネミー行動予測 ver1.1.0
 * 
 * 使い方:
 *
 *   スキルのメモ欄に <fsText:予測テキスト> のようなタグで行動予測の設定を
 *   してください。
 *   戦闘シーンでパーティのコマンドを入力している間、敵グラフィックに
 *   重なるように予測テキストが表示されるようになります。
 *
 *   このプラグインは RPGツクールMV Version 1.6.1 で動作確認をしています。
 *
 *   このプラグインはMITライセンスのもとに配布しています、商用利用、
 *   改造、再配布など、自由にお使いいただけます。
 *
 * 
 * メモ欄タグ（スキル）:
 *
 *   <fsText:予測テキスト>
 *     敵がこのスキルを使用するターンのコマンド入力中に、予測テキストが
 *     敵グラフィックに重なるように表示されます。
 *     このタグがない場合はスキル名を代わりに表示します。
 *
 *     予測テキストを途中で改行することで、行動予測の表示も複数行になります。
 *     ただしプラグインパラメータ maxLines で設定した行数を超えることは
 *     できません。
 * 
 *   <fsIcon:5>
 *     予測テキストの頭に 5 番のアイコンを表示します。
 *     このタグがない場合はスキルアイコンを代わりに表示します。
 * 
 *     プラグインパラメータ showIcon がOFF(false)の場合は表示しません。
 *
 *
 * メモ欄タグ（敵キャラ）:
 *
 *   <fsOffsetX:50>
 *     この敵の行動予測の表示位置を右に 50 ドットずらします。左にずらす場合は
 *     負の値を設定してください。
 *
 *   <fsOffsetY:80>
 *     この敵の行動予測の表示位置を下に 80 ドットずらします。上にずらす場合は
 *     負の値を設定してください。
 *
 *
 * プラグインコマンド:
 *
 *   fsStop
 *     行動予測機能を無効にします。ゲーム開始時は行動予測機能が有効に
 *     なっています。行動予測機能の状態はセーブデータに保存されます。
 *
 *   fsStart
 *     無効にした行動予測機能を有効にします。
 *
 *
 * プラグインパラメータ補足:
 *
 *   maxLines
 *     行動予測表示の最大行数を設定します。行数が多いほど大きなビットマップが
 *     生成されるため、必要以上に大きな値は設定しないでください。
 * 
 *     1ターンに複数回の行動がある場合、行動回数分の行数が必要になります。
 *     行動予測表示に改行を利用する場合はさらに必要な行数が増えます。
 *
 *   color / backColor / headerColor
 *     このパラメータには、black や blue といったカラーネームと、
 *     #000000 や #0000ff のようなカラーコードを設定することができます。
 *
 *   headerText
 *     行動予測の左上に表示するヘッダーテキストです。何も入力しなければ
 *     ヘッダーテキストは非表示になります。
 *
 *   cornerRadius
 *     TMBitmapEx.js をこのプラグインよりも上の位置に導入しつつ、
 *     このパラメータの値を 1 以上にすることで、行動予測の背景を
 *     角丸の矩形にすることができます。
 */

var Imported = Imported || {};
Imported.TMFutureSight = true;

(function () {
  var parameters = PluginManager.parameters("TMFutureSight");
  var SightWidth = +(parameters["width"] || 240);
  var SightMaxLines = +(parameters["maxLines"] || 3);
  var SightLineHeight = +(parameters["lineHeight"] || 36);
  var SightColor = parameters["color"] || "white";
  var SightBackColor = parameters["backColor"] || "black";
  var SightBackOpacity = +(parameters["backOpacity"] || 128);
  var SightCornerRadius = +(parameters["cornerRadius"] || 6);
  var SightTextAlign = parameters["textAlign"] || "center";
  var SightShowIcon = JSON.parse(parameters["showIcon"] || "true");
  var SightHeaderText = parameters["headerText"];
  var SightHeaderHeight = +(parameters["headerHeight"] || 20);
  var SightHeaderFontSize = +(parameters["headerFontSize"] || 16);
  var SightHeaderColor = parameters["headerColor"] || "red";
  const params = {
    fontSizeMsg: parameters.fontSizeMsg
      ? JSON.parse(parameters.fontSizeMsg)
      : 15,
    fontSizeShield: +(parameters.fontSizeShield || 28),
    fontSizeBoost: +(parameters.fontSizeBoost || 28),
    fontSizeHp: parameters.fontSizeHp
      ? JSON.parse(parameters.fontSizeHp)
      : [28, 28],
    textStateTurn: parameters.textStateTurn
      ? JSON.parse(parameters.textStateTurn)
      : [15, 5, 20],
    posFrame: parameters.posFrame
      ? JSON.parse(parameters.posFrame)
      : [0, -75, 200, 100],
    posMsgbox: parameters.posMsgbox
      ? JSON.parse(parameters.posMsgbox)
      : [0, -300],
    posMsg: parameters.posMsg ? JSON.parse(parameters.posMsg) : [20, 0],
    buffColors: parameters.buffColors
      ? JSON.parse(parameters.buffColors)
      : ["#0000ff", "#ff0000"],
  };
  // 事前ロード
  // ImageManager.loadPicture('card_system/status_n1');

  //-----------------------------------------------------------------------------
  // Game_System
  //

  Game_System.prototype.isFutureSightEnabled = function () {
    if (this._futureSightEnabled == null) {
      this._futureSightEnabled = true;
    }
    return this._futureSightEnabled;
  };

  Game_System.prototype.disableFutureSight = function () {
    this._futureSightEnabled = false;
  };

  Game_System.prototype.enableFutureSight = function () {
    this._futureSightEnabled = true;
  };

  //-----------------------------------------------------------------------------
  // Game_BattlerBase
  //
  const Game_BattlerBase_prototype_addNewState =
    Game_BattlerBase.prototype.addNewState;
  Game_BattlerBase.prototype.addNewState = function (stateId) {
    Game_BattlerBase_prototype_addNewState.call(this, stateId);
    this._requestStateUpdate = true;
  };
  const Game_BattlerBase_prototype_eraseState =
    Game_BattlerBase.prototype.eraseState;
  Game_BattlerBase.prototype.eraseState = function (stateId) {
    Game_BattlerBase_prototype_eraseState.call(this, stateId);
    this._requestStateUpdate = true;
  };

  const Game_BattlerBase_prototype_updateStateTurns =
    Game_BattlerBase.prototype.updateStateTurns;
  Game_BattlerBase.prototype.updateStateTurns = function () {
    Game_BattlerBase_prototype_updateStateTurns.call(this);
    this._requestStateUpdate = true;
  };

  //-----------------------------------------------------------------------------
  // Game_Action
  //
  const Game_Action_prototype_applyItemUserEffect =
    Game_Action.prototype.applyItemUserEffect;
  Game_Action.prototype.applyItemUserEffect = function (target) {
    Game_Action_prototype_applyItemUserEffect.call(this);
    target._requestStateUpdate = true;
  };

  //-----------------------------------------------------------------------------
  // Game_Enemy
  //

  Game_Enemy.prototype.setFutureSightTexts = function () {
    this._futureSightTexts = [];
    this._futureSightIcons = [];
    for (var i = 0; i < this._actions.length; i++) {
      if (this._actions[i]) {
        var skill = this._actions[i].item();
        if (skill) {
          if (skill.meta.fsText) {
            // let v0 = 0;
            // if (0 < skill.damage.type) {
            // 	v0 = this._actions[i].makeDamageValue($gameParty.members()[0], 0);
            // 	// v0 = Nnfs.evalDamageFormulaEx(this, skill, skill.damage.formula);
            // 	// v0 = Math.round(Nnfs.applyVariance(v0, skill.damage.variance, this._variances));
            // }
            const v1 = skill.meta.formula1
              ? Nnfs.evalDamageFormulaEx(this, skill, skill.meta.formula1)
              : 0;
            const v2 = skill.meta.formula2
              ? Nnfs.evalDamageFormulaEx(this, skill, skill.meta.formula2)
              : 0;
            const text = skill.meta.fsText
              .replace("\\skill", skill.name)
              .replace("\\icon", "\\I[" + skill.iconIndex + "]");
            // makedamageValueで計算した最終ダメージの差異から増減色付けをしているので、varianceの値も見てしまうことになるので、それを避けるための処理
            const tmp = this._variances;
            this._variances = null;
            this._futureSightTexts.push(
              Nnfs.replaceFormulaTag(
                text,
                this._actions[i],
                $gameParty.members()[0],
                v1,
                v2
              )
            );
            this._variances = tmp;
          } else {
            //\{\icon\}\skill
            this._futureSightTexts.push(
              "\\{\\I[" + skill.iconIndex + "]\\}" + skill.name
            );
          }
        }
      }
    }
    this._requestFutureSightUpdate = true;
  };

  Game_Enemy.prototype.fsIconIndex = function (skill) {
    if (!SightShowIcon) {
      return 0;
    }
    if (skill.meta.fsIcon) {
      return +skill.meta.fsIcon;
    }
    return skill.iconIndex;
  };

  Game_Enemy.prototype.resetFutureSightTexts = function () {
    this._futureSightTexts = [];
  };

  Game_Enemy.prototype.futureSightTexts = function () {
    return this._futureSightTexts || [];
  };

  Game_Enemy.prototype.calcVariance = function () {
    this._variances = [Math.random(), Math.random()];
  };
  //-----------------------------------------------------------------------------
  // Game_Troop
  //

  var _Game_Troop_makeActions = Game_Troop.prototype.makeActions;
  Game_Troop.prototype.makeActions = function () {
    _Game_Troop_makeActions.call(this);
    if ($gameSystem.isFutureSightEnabled() && !BattleManager._preemptive) {
      this.members().forEach(function (member) {
        member.calcVariance();
        member.setFutureSightTexts();
      });
    }
  };

  // var _Game_Troop_increaseTurn = Game_Troop.prototype.increaseTurn;
  // Game_Troop.prototype.increaseTurn = function() {
  // 	_Game_Troop_increaseTurn.call(this);
  // 	this.members().forEach(function(member) {
  // 		member.resetFutureSightTexts();
  // 	});
  // };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === "fsStart") {
      $gameSystem.enableFutureSight();
    } else if (command === "fsStop") {
      $gameSystem.disableFutureSight();
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_Enemy
  //

  var _Sprite_Battler_update = Sprite_Battler.prototype.update;
  Sprite_Battler.prototype.update = function () {
    _Sprite_Battler_update.call(this);
    if (this._battler) {
      this.updateFutureSight();
    }
  };

  Sprite_Battler.prototype.updateFutureSight = function () {
    if (
      !this._futureSightSprite &&
      this
        .parent /*&& this.mainSprite().bitmap.isReady() spine対応でコメント、必要だったのかこれは*/
    ) {
      this._futureSightSprite = new Sprite_FutureSight(this);
      // this.parent.addChildAt(this._futureSightSprite, 7);
      this.addChild(this._futureSightSprite);
    }
  };

  Sprite_Actor.prototype.mainSprite = function () {
    return this._mainSprite;
  };
  Sprite_Enemy.prototype.mainSprite = function () {
    return this;
  };
  // var Sprite_Enemy_createStateIconSprite = Sprite_Enemy.prototype.createStateIconSprite;
  // var state_icon_ofsx = 20;
  // Sprite_Enemy.prototype.createStateIconSprite = function() {
  // 	Sprite_Enemy_createStateIconSprite.call(this);
  // 	this._stateIconSprite.x = -state_icon_ofsx;
  // };
  Sprite_Enemy.prototype.createStateIconSprite = function () {};
  Sprite_Enemy.prototype.updateStateSprite = function () {};
  Sprite_Enemy.prototype.setBattler = function (battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.setHome(battler.screenX(), battler.screenY());
  };

  //-----------------------------------------------------------------------------
  // Sprite_FutureSight
  //

  function Sprite_FutureSight() {
    this.initialize.apply(this, arguments);
  }

  Sprite_FutureSight.prototype = Object.create(Sprite.prototype);
  Sprite_FutureSight.prototype.constructor = Sprite_FutureSight;

  Sprite_FutureSight.prototype.initialize = function (battlerSprite) {
    Sprite.prototype.initialize.call(this);
    this._battlerSprite = battlerSprite;
    this._active = true;
    // シールド
    this._shield = new Sprite(
      ImageManager.loadPicture("card_system/status_shield")
    );
    this._shield.visible = false;
    this._shield.anchor.set(0.5);
    this.addChild(this._shield);
    // frame
    this._frame = new Sprite(
      ImageManager.loadPicture("card_system/status_frame1")
    );
    this._frame.anchor.set(0.5);
    this.addChild(this._frame);
    // 文字系
    this._text = new Sprite();
    this._text.anchor.set(0.5);
    // this._text.makeFontBitmap(params.posFrame[2], params.posFrame[3] || 60);
    this._text.bitmap = new Bitmap(
      params.posFrame[2],
      params.posFrame[3] || 60
    );
    this._text.bitmap.smooth = true;
    // this._text.bitmap.fillAll('rgba(0, 0, 0, 0.5)');
    this.addChild(this._text);
    // ゲージ系
    this.x = params.posFrame[0];
    this.y = params.posFrame[1];
    this.bitmap = new Bitmap(params.posFrame[2], params.posFrame[3] || 60);
    this.anchor.set(0.5);
    // 吹き出し
    if (battlerSprite._battler.isEnemy()) {
      const enemy = battlerSprite._battler.enemy();
      // metaにステータス位置の指定があればそれを優先
      if (enemy.meta.fsPosX) this.x = +enemy.meta.fsPosX;
      if (enemy.meta.fsPosY) this.y = +enemy.meta.fsPosY;
      // this.bitmap = new Bitmap(battlerSprite.width + 30/*stateと重ならないようにしたら敵によってはみ出てしまったので伸ばす*/, battlerSprite.height + SightLineHeight*2 + 10/*stateと同じ高さに調整*/);
      // 吹き出し
      this._msgbox = new Sprite();
      this._msgbox.anchor.set(0.5);
      this._msgbox.x = params.posMsgbox[0] + (+enemy.meta.fsMsgBoxOffsetX || 0);
      this._msgbox.y = params.posMsgbox[1] + (+enemy.meta.fsMsgBoxOffsetY || 0);
      this.addChild(this._msgbox);
      // 吹き出し文字
      this._msg = new Sprite_Font();
      this._msgbox.addChild(this._msg);
    } else {
      $gameTemp._spriteFutureSightActor = this;
    }
    // this.z = 10;
    this._texts = [];
    // this._icons = [];
    this._shieldTemps = [0, 0];
    // this._hpTemps = [true/*初回更新*/, false, battlerSprite._battler.hp, battlerSprite._battler.mhp, 0];
    this._hpTemps = [false, false, 0, 0, 0];
    this._trunkTemps = [1 /*初回更新*/, 0];
    // HIME_EnemyReinforcementsが使われるとスプライト含め再作成されてしまう
    // 情報を保存して、最初から表示する
    if (this._battlerSprite._battler._initedFutureSightAtLeastOnce) {
      this._hpTemps[2] = this._battlerSprite._battler.hp;
      this._hpTemps[3] = this._battlerSprite._battler.mhp;
      this.drawGaugeHp(
        this.bitmap,
        this._hpTemps[2] / this._hpTemps[3],
        this._hpTemps[0]
      );
      this.drawHp(this._text.bitmap, this._hpTemps[2], this._hpTemps[3]);
    }
  };

  // Sprite_FutureSight.prototype.refresh = function(isUpdateSight) {
  // 	const battler = this._battlerSprite._battler;
  // 	// this._text.bitmap.clear();
  // 	// this.drawShield(this._text.bitmap, battler._shieldValue);
  // 	// this.drawGauge(this.bitmap, 45, 42, 129, 10, battler.hpRate(), 0 < battler._shieldValue);
  // 	// this.drawHp(this._text.bitmap, 40, 40, battler);
  // 	this.drawBoost(this._text.bitmap, 45, 65, battler._boostValue);
  // 	this.drawStates(this._text.bitmap, battler, true);
  // 	if (isUpdateSight) {
  // 		this.drawSightText(0, 10);
  // 	}
  // };

  // Sprite_FutureSight.prototype.drawSightBack = function(x, y, width, height) {
  // 	this.bitmap.paintOpacity = SightBackOpacity;
  // 	if (Imported.TMBitmapEx && SightCornerRadius) {
  // 		this.bitmap.fillRoundRect(x, y, width, height, SightCornerRadius, SightBackColor);
  // 	} else {
  // 		this.bitmap.fillRect(x, y, width, height, SightBackColor);
  // 	}
  // 	this.bitmap.paintOpacity = 255;
  // };

  // Sprite_FutureSight.prototype.drawSightHeader = function(x, y, width, height) {
  // 	if (SightHeaderText) {
  // 		this.bitmap.fontSize = SightHeaderFontSize;
  // 		this.bitmap.textColor = SightHeaderColor;
  // 		this.bitmap.drawText(SightHeaderText, x, y, width, height);
  // 	}
  // };

  Sprite_FutureSight.prototype.resetShield = function (value) {
    this._shieldTemps[0] = this._battlerSprite._battler._shieldValue =
      value || 0;
    this._hpTemps[1] = false;
    this.drawShield(
      this._text.bitmap,
      this._shieldTemps[0],
      params.fontSizeShield,
      true
    );
  };

  Sprite_FutureSight.prototype.drawSightText = function (
    buffAttack,
    buffShield
  ) {
    ImageManager.loadPicture("card_system/msgbox_enemy").addLoadListener(
      function (tex) {
        const w = tex.width;
        const h = tex.height;
        if (this._msgbox.bitmap == null) {
          this._msgbox.bitmap = new Bitmap(w, h);
          this._msgbox.bitmap.smooth = true;
          this._msg.makeFontBitmap(w, h);
        }
        const bitmap = this._msg.bitmap;
        bitmap.clear();
        if (0 == this._texts.length) return;
        bitmap.bltImage(tex, 0, 0, w, h, 0, 0);
        // text
        bitmap.textColor = SightColor;
        bitmap.fontSize = params.fontSizeMsg;
        let x = params.posMsg[0],
          y = params.posMsg[1];
        for (let i = 0; i < this._texts.length; i++) {
          const text = this._texts[i];
          this._msg.drawTextEx(text, x, y);
        }
      }.bind(this)
    );
  };

  Sprite_FutureSight.prototype.drawGaugeHp = function (bitmap, rate, isShield) {
    const x = 45,
      y = 42,
      w = 129,
      h = 10;
    // bitmap.fillRect(x, y, w, h, isShield ? '#ffffff' : '#202040');
    bitmap.fillRect(x, y, w, h, "#202040");
    let fillW = Math.floor(w * rate).clamp(0, w);
    fillW = Math.max(fillW - 2, 0);
    if (isShield)
      bitmap.gradientFillRect(x + 1, y + 1, fillW, h - 2, "#085FD4", "#497BF5");
    else
      bitmap.gradientFillRect(x + 1, y + 1, fillW, h - 2, "#e08040", "#f0c040");
  };

  Sprite_FutureSight.prototype.drawGaugeTrunk = function (bitmap, rate) {
    const x = 45,
      y = 53,
      w = 129,
      h = 10;
    // var color = rate >= 1 ? '#ff0000' : rate >= (Nnfs._pinchTrunk || 50) * 0.01 ? '#e08020' : '#e0e020';
    bitmap.fillRect(x, y, w, h, "#202040");
    let fillW = Math.floor(w * rate).clamp(0, w);
    fillW = Math.max(fillW - 2, 0);
    bitmap.fillRect(x + 1, y + 1, fillW, h - 2, "#db00f8");
  };

  Sprite_FutureSight.prototype.drawHp = function (bitmap, hp, mhp) {
    let x = 40,
      y = 40;
    var bitmap1 = ImageManager.loadPicture("card_system/status_n1");
    var bitmap2 = ImageManager.loadPicture("card_system/status_n2");
    bitmap1.addLoadListener(function () {
      bitmap2.addLoadListener(function () {
        bitmap.clearRect(-20, 0, 200, 40);
        bitmap.adjustTone(0, 0, 0);
        let w = Nnfs.drawDigit(
          bitmap,
          bitmap2,
          hp,
          x,
          y,
          params.fontSizeHp[0],
          0,
          1
        );
        x += w;
        w = Nnfs.drawDigitSlash(bitmap, bitmap1, x, y, params.fontSizeHp[1]);
        x += w;
        Nnfs.drawDigit(bitmap, bitmap1, mhp, x, y, params.fontSizeHp[1], 0, 1);
      });
    });
  };

  Sprite_FutureSight.prototype.drawShield = function (
    bitmap,
    shield,
    fontSize,
    clear
  ) {
    const x = 22;
    const y = 70;
    if (clear) {
      bitmap.clearRect(x - 16, y - 30, 40, 30);
      // bitmap.fillRect(x-16, y-30, 40, 30, '#ff0000');
    }
    if (shield <= 0) {
      this._shield.visible = false;
      return;
    }
    this._shield.visible = true;
    ImageManager.loadPicture("card_system/status_n1").addLoadListener(
      function (tex) {
        Nnfs.drawDigit(bitmap, tex, shield, x, y, fontSize);
      }.bind(this)
    );
  };

  Sprite_FutureSight.prototype.drawBoost = function (bitmap, battler) {
    if (this._boostValue == battler._boostValue) return;
    this._boostValue = battler._boostValue;
    if (0 < this._boostValue) {
      const x = 45,
        y = 65;
      bitmap.clearRect(
        x,
        y,
        Window_Base._iconWidth + 2,
        Window_Base._iconHeight + 2
      );
      this.drawSightIcon(bitmap, 96, x, y);
      ImageManager.loadPicture("card_system/status_n1").addLoadListener(
        function (tex) {
          Nnfs.drawDigit(
            bitmap,
            tex,
            this._boostValue,
            x + 18,
            y + 35,
            params.fontSizeBoost
          );
        }.bind(this)
      );
    }
  };

  Sprite_FutureSight.prototype.drawStates = function (bitmap, battler, force) {
    if (!force && !battler._requestStateUpdate) return;
    battler._requestStateUpdate = false;
    if (battler.isEnemy()) {
      battler.resetFutureSightTexts();
      battler.setFutureSightTexts();
    } else if (battler.isActor()) {
      BattleManager._skillWindow.refreshHands();
    }
    let x = 80;
    const y = 65;
    bitmap.clearRect(x, y, 120, Window_Base._iconHeight);
    bitmap.fontSize = params.fontSizeStateTurn;
    battler._states.forEach((id) => {
      const data = $dataStates[id];
      if (data.iconIndex <= 0) return;
      this.drawSightIcon(bitmap, data.iconIndex, x, y);
      bitmap.fontSize = params.textStateTurn[2];
      if (data.autoRemovalTiming != 0) {
        bitmap.drawText(
          battler._stateTurns[id],
          x + params.textStateTurn[0],
          y + params.textStateTurn[1],
          16,
          36,
          "left"
        );
      }
      x += Window_Base._iconWidth;
    });
  };

  Sprite_FutureSight.prototype.sightIconX = function (text, width) {
    var textWidth = this._text.bitmap.measureTextWidth(text);
    if (SightTextAlign === "left") {
      return 0;
    } else if (SightTextAlign === "center") {
      return (width - textWidth) / 2 - SightLineHeight;
    } else {
      return width - textWidth - SightLineHeight;
    }
  };

  Sprite_FutureSight.prototype.drawSightIcon = function (
    bitmap,
    iconIndex,
    x,
    y
  ) {
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = (iconIndex % 16) * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    var dw = SightLineHeight - 4;
    var dh = SightLineHeight - 4;
    // var n = Math.floor((bitmap.fontSize / 28) * Window_Base._iconWidth);
    var n = Window_Base._iconWidth;
    bitmap.bltImage(
      ImageManager.loadSystem("IconSet"),
      sx,
      sy,
      pw,
      ph,
      x,
      y,
      n,
      n
    );
  };

  Sprite_FutureSight.prototype.update = function () {
    if (!this._active) {
      if (!this._battlerSprite._battler.isDead()) {
        this._active = true;
        this.opacity = 255;
      }
      return;
    }
    if (!this._text.bitmap.isReady()) {
      return;
    }
    Sprite.prototype.update.call(this);
    const battler = this._battlerSprite._battler;
    // ステート更新
    this.drawStates(this._text.bitmap, battler);
    // ブースト値
    this.drawBoost(this._text.bitmap, battler);
    // シールド値
    if (this._shieldTemps[0] !== battler._shieldValue) {
      this._hpTemps[1] = true;
      const diff = battler._shieldValue - this._shieldTemps[0];
      const sign = Math.sign(diff);
      this._shieldTemps[1] += this.digitSpeed(diff, 1);
      if (1 <= this._shieldTemps[1]) {
        this._shieldTemps[1] = 0;
        this._shieldTemps[0] += sign;
      }
      if (0 < sign && this._shieldTemps[0] !== battler._shieldValue)
        this.drawShield(
          this._text.bitmap,
          this._shieldTemps[0],
          params.fontSizeShield + 5,
          true
        );
      else {
        this.drawShield(
          this._text.bitmap,
          this._shieldTemps[0],
          params.fontSizeShield,
          true
        );
        if (this._shieldTemps[0] === 0) {
          this._hpTemps[1] = false;
          if (sign < 0) {
            Nnfs.ParticleContainer.makeParticle(
              "ShieldBreak1",
              this,
              true,
              true,
              true,
              true,
              true
            ).play();
            Nnfs.ParticleContainer.makeParticle(
              "ShieldBreak2",
              this,
              true,
              true,
              true,
              true,
              true
            ).play();
          }
        }
      }
    }
    // if (this._hpTemps[0] !== this._hpTemps[1]) {
    // 	this._hpTemps[0] = this._hpTemps[1];
    // }
    // if (this._hpTemps[2] !== battler.hp || this._hpTemps[3] !== battler.mhp) {
    // 	this._hpTemps[3] = battler.mhp;
    // 	update_lifegauge = true;
    // }
    // ライフゲージ
    if (
      this._hpTemps[0] !== this._hpTemps[1] ||
      this._hpTemps[2] !== battler.hp ||
      this._hpTemps[3] !== battler.mhp
    ) {
      this._hpTemps[3] = battler.mhp;
      this._hpTemps[0] = this._hpTemps[1];
      const diff = battler.hp - this._hpTemps[2];
      const sign = Math.sign(battler.hp - this._hpTemps[2]);
      if (1 <= (this._hpTemps[4] += this.digitSpeed(diff, 2))) {
        this._hpTemps[4] = 0;
        this._hpTemps[2] +=
          sign * (80 < Math.abs(diff) ? Math.floor(Math.abs(diff) * 0.05) : 1);
      }
      this.drawGaugeHp(
        this.bitmap,
        this._hpTemps[2] / this._hpTemps[3],
        this._hpTemps[0]
      );
      this.drawHp(this._text.bitmap, this._hpTemps[2], this._hpTemps[3]);
      if (this._hpTemps[0]) this._frame.setColorTone([0, 0, 100, 0]);
      else this._frame.setColorTone([0, 0, 0, 0]);
      if (battler.isDead() && this._hpTemps[2] === 0) {
        this._active = false;
        Coroutine.pushTask(this.animationFinish());
      }
      battler._initedFutureSightAtLeastOnce = true;
    }
    // 体感ゲージ
    if (battler.isActor()) {
      const trunk = battler.trunk();
      if (this._trunkTemps[0] !== trunk) {
        const diff = trunk - this._trunkTemps[0];
        const sign = Math.sign(trunk - this._trunkTemps[0]);
        this._trunkTemps[0] += this.digitSpeed(diff, 10) * sign;
        if (
          (0 < sign && trunk <= this._trunkTemps[0]) ||
          (sign < 0 && this._trunkTemps[0] <= trunk)
        ) {
          this._trunkTemps[0] = trunk;
        }
        // this._trunkTemps[1] += this.digitSpeed(diff, 5);
        // if (1 <= this._trunkTemps[1]) {
        // 	this._trunkTemps[1] = 0;
        // 	this._trunkTemps[0] += sign;
        // }
        this.drawGaugeTrunk(
          this.bitmap,
          this._trunkTemps[0] / battler.trunkMax()
        );
      }
    }
    let is_enemy = battler.isEnemy();
    // 敵なら
    if (is_enemy && battler._requestFutureSightUpdate) {
      battler._requestFutureSightUpdate = false;
      const futureSightTexts = battler.futureSightTexts(); //.concat();
      // const futureSightIcons = battler.futureSightIcons();//.concat();
      // const is_update_sight = this._texts.toString() !== futureSightTexts.toString() || this._icons[0] !== futureSightIcons[0];
      // if (is_update_sight) {
      this._texts = futureSightTexts;
      // this._icons = futureSightIcons;
      this.drawSightText(
        battler._futureSightAttackBuff,
        battler._futureSightShieldBuff
      );
      // }
      // ステート変化時にぶれるのでコメント化したらぶれなくなった
      // var enemy = battler.enemy();
      // this.x = this._battlerSprite._homeX + (+enemy.meta.fsOffsetX || 0);
      // this.y = this._battlerSprite._homeY + (+enemy.meta.fsOffsetY || 0);// + SightLineHeight;
    }
    // 味方なら
    // else {
    // 	this.x = this._battlerSprite._homeX + params.posFrame[0];
    // 	this.y = this._battlerSprite._homeY + params.posFrame[1];
    // }
  };

  Sprite_FutureSight.prototype.digitSpeed = function (diff, speed) {
    diff = Math.abs(diff);
    if (10 <= diff) return 0.5 * speed;
    else if (5 <= diff) return 0.3 * speed;
    else return 0.1 * speed;
  };

  Sprite_FutureSight.prototype.startShakeShield = function () {
    Coroutine.pushTask(
      function* () {
        const r = 3;
        for (let i = 0; i < 30; ++i) {
          this._shield.x = Math.randomRangeInt(-r, r);
          this._shield.y = Math.randomRangeInt(-r, r);
          yield;
        }
        this._shield.x = 0;
        this._shield.y = 0;
      }.bind(this)()
    );
  };
  Sprite_FutureSight.prototype.startShakeFrame = function () {
    Coroutine.pushTask(
      function* () {
        const r = 3;
        for (let i = 0; i < 30; ++i) {
          this._frame.x = Math.randomRangeInt(-r, r);
          this._frame.y = Math.randomRangeInt(-r, r);
          yield;
        }
        this._frame.x = 0;
        this._frame.y = 0;
      }.bind(this)()
    );
  };
  Sprite_FutureSight.prototype.animationFinish = function* () {
    let i = 0,
      frame = 30;
    while (i < frame) {
      const t = i / frame;
      this.opacity = 255 * (1 - t);
      ++i;
      yield;
    }
    // this.parent.removeChild(this);
  };
})();
