/*:
 * @plugindesc 戦闘モーションとコマを追加します。
 * @author Lib
 *
 * @param motionCol
 * @desc モーションカラーでループ制御をするか。
 * 初期値: true
 * @default true
 *
 * @param blueFps
 * @desc 画像の青要素でスピードを調整するかどうか。
 * 初期値: true
 * @default true
 *
 * @param drawWeapon
 * @desc 武器を描画するかどうか。
 * 初期値: false
 * @default false
 *
 * @help
 * プラグインコマンドはありません。
 * 使い方がわかりにくい場合は添付の画像も参考にして下さい。
 *
 *■素材規格
 *・各モーションの最後のコマ(以下カラーコマ)に色を置く事で長さと挙動を制御できます。(以下モーションカラー)
 *・１コマのタテヨコ比率は１：１にして下さい。(デフォルトだと64*64)
 *・各コマの左上から右１ドット下１ドットの位置をチェックするため、ドットを置かないで下さい。
 *・各モーションのコマ数は「そのキャラクターのモーションの中で最大のコマ数のもの」に合わせて下さい。
 *・各キャラクターの総モーション数は同じにして下さい。
 *・使わないモーションの場所でも最低１コマ確保し、カラーコマは必ず置いて下さい。
 *・スキル、魔法、道具、ステートのメモ欄に<motionSP0>と書くと追加したモーションの０番目を使用するようになります。
 *
 *・モーションカラーの設定(カラーコマの左半分)
 *　赤(#ff0000) 最後のコマまで再生して停止する一方通行モーション
 *　黄(#ffff00) コマの間を往復する往復ループモーション
 *　緑(#00ff00) 最後のコマまで再生して最初に戻る一方通行ループモーション
 *　青要素でモーションの速度を制御できます。(値が小さいほど早い)
 *
 *・モーションカラーの設定(カラーコマの右上1/4)
 *	青要素で次のモーションナンバーを指定してモーションへ繋げることができます。
 *　ループモーションに設定した場合はループが優先されます。(繋がりません。)
 *  赤と緑要素は0にして下さい。
 *　この機能を使用しない場合は左と同色で構いません。
 *
 *　例：#00ff06　:　一方通行ループで6フレームに一回モーションを更新する。
 *
 *■高度な設定
 *※モーションカラー無しで新しくモーションを増やしたいときは、「Sprite_Actor.MOTIONS」に「６個単位で」追加して下さい。
 *　デフォルトで6個追加してあるので参考に追加して下さい。
 *　余白は作れないため全てのモーションでコマ数が同じになります。(デフォルトと同じです。)
 *
 */

(function () {
  var parameters = PluginManager.parameters("BattleMotion");
  Sprite_Battler.motionCol = eval(String(parameters["motionCol"])); //デフォルト素材ならfalse
  Sprite_Battler.blueFps = eval(String(parameters["blueFps"])); //デフォルト素材ならfalse
  Sprite_Battler.drawWeapon = eval(String(parameters["drawWeapon"])); //デフォルト素材ならtrue

  Sprite_Battler.MOTIONS = {
    walk: { index: 0, loop: true, speed: 12 },
    wait: { index: 1, loop: true, speed: 12 },
    chant: { index: 2, loop: true, speed: 12 },
    guard: { index: 3, loop: true, speed: 12 },
    damage: { index: 4, loop: false, speed: 12 },
    evade: { index: 5, loop: false, speed: 12 },
    thrust: { index: 6, loop: false, speed: 12 },
    swing: { index: 7, loop: false, speed: 12 },
    missile: { index: 8, loop: false, speed: 12 },
    skill: { index: 9, loop: false, speed: 12 },
    spell: { index: 10, loop: false, speed: 12 },
    item: { index: 11, loop: false, speed: 12 },
    escape: { index: 12, loop: true, speed: 12 },
    victory: { index: 13, loop: true, speed: 12 },
    dying: { index: 14, loop: true, speed: 12 },
    abnormal: { index: 15, loop: true, speed: 12 },
    sleep: { index: 16, loop: true, speed: 12 },
    dead: { index: 17, loop: true, speed: 12 },
    //	motionSP0:{ index: 18, loop: false, speed: 12 },
    //	motionSP1:{ index: 19, loop: false, speed: 12 },
    //	motionSP2:{ index: 20, loop: false, speed: 12 },
    //	motionSP3:{ index: 21, loop: false, speed: 12 },
    //	motionSP4:{ index: 22, loop: false, speed: 12 },
    //	motionSP5:{ index: 23, loop: false, speed: 12 }
  };

  Sprite_Battler.prototype.forceMotion = function (motionType) {
    motionType = this.remakeDeadMotion(motionType);

    this.setup_Motion();
    this.setupValue(motionType);
  };

  Sprite_Battler.prototype.startMotion = function (motionType) {
    motionType = this.remakeDeadMotion(motionType);
    var newMotion = Sprite_Battler.MOTIONS[motionType];
    if (!this._motion || this._motion.index !== newMotion.index) {
      this.setup_Motion();
      this.setupValue(motionType);
    }
  };

  Sprite_Battler.prototype.remakeDeadMotion = function (motionType) {
    if (motionType === "dead") {
      var note = $dataStates[1].note;
      var xx = note.match(/<motionSP(\w+)>/);
      if (xx) {
        motionType = "motionSP" + RegExp.$1;
      }
    } else {
      var x2 = motionType.match(/motionsp(\w+)/);
      if (x2) {
        motionType = "motionSP" + RegExp.$1;
      }
    }

    return motionType;
  };

  Sprite_Battler.prototype.setup_Motion = function () {
    if (!this._motion) {
      this._motion = { index: 0, loop: true, speed: 12 };
    }
  };

  Sprite_Battler.prototype.setupValue = function (motionType) {
    this._motion.index = Sprite_Battler.MOTIONS[motionType].index;
    this._motion.loop = Sprite_Battler.MOTIONS[motionType].loop;
    this._motion.speed = Sprite_Battler.MOTIONS[motionType].speed;
    this._motionCount = 0;
    this._pattern = 0;
    this._animCount = 0;
    this.fpsMotion = 0;
    this.motionType = motionType;
    this.absStop = false;
    this.animLoop = true;
    this.remake = true;
    this.speed = Sprite_Battler.MOTIONS[motionType].speed;
    this.nextMotionNo = -1;
  };

  Sprite_Battler.prototype.getRemake = function () {
    return this.remake;
  };

  Sprite_Battler.prototype.setRemake = function (flg) {
    this.remake = flg;
  };

  Sprite_Battler.prototype.oneMotionFps = function (mainSprite) {
    var bitmap = mainSprite.bitmap;
    var cw = bitmap.height / 6; //タテヨコサイズは固定するのでこれでいい
    var length = Object.keys(Sprite_Battler.MOTIONS).length;
    var oneMotion = bitmap.width / (length / 6); //１ﾓｰｼｮﾝの大きさ
    var fpsMotion = oneMotion / cw; //１ﾓｰｼｮﾝの最大ﾌﾚｰﾑ数

    return fpsMotion;
  };

  Sprite_Battler.prototype.addMotionData = function (mainSprite) {
    //画像サイズと最大モーションサイズからSprite_Battler.MOTIONSにハッシュを追加する。
    //(motionColがONの時のみ。)
    if (Sprite_Battler.motionCol === false) {
      return;
    }

    var bitmap = mainSprite.bitmap;
    var size = this.cs(mainSprite);
    var comaNum = bitmap.width / size;

    var colNum = 0;
    for (var i = 1; i < comaNum; i++) {
      //前のコマのカラー
      var x0 = (i - 1) * size + 1;
      var col0 = bitmap.getPixel(x0, 1);
      var r0 = col0.substring(1, 3);
      var g0 = col0.substring(3, 5);

      //今のコマのカラー
      var x1 = i * size + 1;
      var col1 = bitmap.getPixel(x1, 1);
      var r1 = col1.substring(1, 3);
      var g1 = col1.substring(3, 5);

      if ((r1 === "ff" || g1 === "ff") && r0 === "00" && g0 === "00") {
        colNum++;
      }
    }

    var allMotionNum = colNum * 6; //モーション総数

    for (var i = 18; i < allMotionNum; i++) {
      var hashbuf = {};
      var hash0 = { index: 18, loop: false, speed: 12 }; //とりあえずデフォルトの値を入れていく。
      hash0.index = i;
      var name = "motionSP" + String(i - 18);
      Sprite_Battler.MOTIONS[name] = hash0;
    }
  };

  Sprite_Battler.prototype.setMotionFps = function (mainSprite) {
    //このモーションのフレーム数を計算する。
    this.motionMax = this.oneMotionFps(mainSprite);
    var cs = this.cs(mainSprite);
    var motionIndex = this.motionIndex();
    var cx = this.cx();
    var cy = this.cy();
    var bitmap = mainSprite.bitmap;

    if (Sprite_Battler.motionCol && this._motion) {
      this.fpsMotion = 0;
      for (var i = 0; i < this.motionMax; i++) {
        this.fpsMotion += 1;

        var col = bitmap.getPixel((cx + i) * cs + 1, cy * cs + 1);

        if (col !== "#000000") {
          //黒の透明と見なすので黒塗りはダメ
          //各ビットのフラグで見るとさすがにわかりにくのでやめました。
          var r = col.substring(1, 3);
          var g = col.substring(3, 5);
          var b = col.substring(5, 7);
          this._motion.loop = true; //とりあえず。最終的には無視？

          if (r === "ff" && g === "ff") {
            this.animLoop = true; //往復ループ(黄色)
          } else {
            this.animLoop = false;
          }
          if (r === "ff" && g !== "ff") {
            this.absStop = true; //一方通行(赤)
            this._motion.loop = false;
            this.animLoop = false;
          }
          //その他は一方通行ループ仕様

          //速度の取得
          if (Sprite_Battler.blueFps === true) {
            this.speed = parseInt(b, 16);
          }

          //次のモーションNoの取得
          var col1 = bitmap.getPixel((cx + i) * cs + 1 + cs / 2, cy * cs + 1);
          if (col != col1) {
            var b1 = col1.substring(5, 7);
            this.nextMotionNo = parseInt(b1, 16);
          }

          break;
        }
      }
    } else {
      this.fpsMotion = this.motionMax;
    }
  };

  Sprite_Battler.prototype.setMotionArray = function () {
    //モーションパターンの設定
    this.motionArray = [];
    for (var i = 0; i < this.fpsMotion; i++) {
      this.motionArray.push(i);
    }
    if (this.animLoop) {
      for (var i = 1; i < this.fpsMotion - 1; i++) {
        this.motionArray.push(this.fpsMotion - 1 - i);
      }
    }
  };

  Sprite_Battler.prototype.cs = function (mainSprite) {
    if (mainSprite) {
      return mainSprite.bitmap.height / 6;
    } else {
      return 0;
    }
  };

  Sprite_Battler.prototype.cx = function () {
    var pattern = this._pattern < this.fpsMotion ? this._pattern : 1;

    var motionIndex = this.motionIndex();
    var cx = Math.floor(motionIndex / 6) * this.motionMax + pattern;
    return cx;
  };

  Sprite_Battler.prototype.cy = function () {
    var motionIndex = this.motionIndex();
    var cy = motionIndex % 6;
    return cy;
  };

  Sprite_Battler.prototype.motionIndex = function () {
    if (this._motion) {
      return this._motion.index;
    }
    return 0;
  };

  Sprite_Battler.prototype.updateMotionCount = function () {
    if (this._motion && ++this._motionCount >= this.motionSpeed()) {
      if (this.absStop) {
        //終端ストップ仕様
        this._animCount++;
        if (this._animCount > this.fpsMotion - 1) {
          this._animCount = this.fpsMotion - 1;

          if (this.nextMotionNo !== -1) {
            var array = Object.keys(Sprite_Battler.MOTIONS);
            this.forceMotion(array[this.nextMotionNo]);
          }
        }
        this._pattern = this.motionArray[this._animCount];
      } else if (this._motion.loop) {
        if (this.animLoop === true) {
          //足踏みループ仕様
          this._animCount = (this._animCount + 1) % (this.fpsMotion * 2 - 2);
        } else {
          //一方通行ループ仕様
          this._animCount = (this._animCount + 1) % this.fpsMotion;
        }
        if (this.motionArray) {
          this._pattern = this.motionArray[this._animCount];
        }
      } else if (this._pattern < this.fpsMotion - 1) {
        this._pattern++;
      } else {
        this.refreshMotion();
      }
      this._motionCount = 0;
    }
  };

  Sprite_Battler.prototype.motionSpeed = function () {
    return this.speed;
  };

  var _Sprite_Actor_prototype_refreshMotion =
    Sprite_Actor.prototype.refreshMotion;
  Sprite_Actor.prototype.refreshMotion = function () {
    _Sprite_Actor_prototype_refreshMotion.call(this);
    var actor = this._actor;
    if (actor) {
      var stateMotion = actor.stateMotionIndex();
      if (stateMotion > 17) {
        this.startMotion("motionSP" + (stateMotion - 18).toString(10));
      }
    }
  };

  Sprite_Actor.prototype.forceMotion = function (motionType) {
    Sprite_Battler.prototype.forceMotion.call(this, motionType);
  };

  Sprite_Actor.prototype.startMotion = function (motionType) {
    Sprite_Battler.prototype.startMotion.call(this, motionType);
  };

  Sprite_Actor.prototype.updateMotionCount = function () {
    Sprite_Battler.prototype.updateMotionCount.call(this);
  };

  Sprite_Actor.prototype.motionSpeed = function () {
    return Sprite_Battler.prototype.motionSpeed.call(this);
  };

  Sprite_Actor.prototype.updateFrame = function () {
    if (this._mainSprite) {
      var bitmap = this._mainSprite.bitmap;
      if (bitmap.width <= 0) return;

      if (this._weaponSprite) {
        this._weaponSprite.visible = Sprite_Battler.drawWeapon;
      }

      var flg = this.getRemake();
      if (flg === true && bitmap.width !== 0) {
        this.addMotionData(this._mainSprite);
        this.setMotionFps(this._mainSprite);
        this.setMotionArray();
        this.setRemake(false);
      }

      var ch = this.cs(this._mainSprite);
      var cw = this.cs(this._mainSprite);
      var cx = this.cx();
      var cy = this.cy();

      this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
    }
  };

  var _Sprite_Enemy_prototype_refreshMotion =
    Sprite_Enemy.prototype.refreshMotion;
  Sprite_Enemy.prototype.refreshMotion = function () {
    _Sprite_Enemy_prototype_refreshMotion.call(this);
    var enemy = this._enemy;
    if (enemy) {
      var stateMotion = enemy.stateMotionIndex();
      if (stateMotion > 17) {
        this.startMotion("motionSP" + (stateMotion - 18).toString(10));
      }
    }
  };

  Sprite_Enemy.prototype.forceMotion = function (motionType) {
    Sprite_Battler.prototype.forceMotion.call(this, motionType);
  };

  var _Sprite_Enemy_prototype_startMotion = Sprite_Enemy.prototype.startMotion;
  Sprite_Enemy.prototype.startMotion = function (motionType) {
    _Sprite_Enemy_prototype_startMotion.call(this);
    Sprite_Battler.prototype.startMotion.call(this, motionType);
  };

  Sprite_Enemy.prototype.updateMotionCount = function () {
    Sprite_Battler.prototype.updateMotionCount.call(this); //機能的に競合してるのは諦めて？
  };

  Sprite_Enemy.prototype.motionSpeed = function () {
    return Sprite_Battler.prototype.motionSpeed.call(this); //速度はモーションカラーで決まるので。
  };

  var _Sprite_Enemy_prototype_updateFrame = Sprite_Enemy.prototype.updateFrame;
  Sprite_Enemy.prototype.updateFrame = function () {
    if (this._mainSprite) return this.updateSVFrame();
    _Sprite_Enemy_prototype_updateFrame.call(this);
  };

  //上書き注意！（特にyanflyEngine系）
  Sprite_Enemy.prototype.updateSVFrame = function () {
    Sprite_Battler.prototype.updateFrame.call(this);
    var bitmap = this._mainSprite.bitmap;
    if (!bitmap) return;
    if (bitmap.width <= 0) return;
    this._effectTarget = this._mainSprite;

    var flg = this.getRemake();
    if (flg === true && bitmap.width !== 0) {
      this.addMotionData(this._mainSprite);
      this.setMotionFps(this._mainSprite);
      this.setMotionArray();
      this.setRemake(false);
    }

    var ch = this.cs(this._mainSprite);
    var cw = this.cs(this._mainSprite);
    var cx = this.cx();
    var cy = this.cy();
    var cdh = 0;
    if (this._effectType === "bossCollapse") {
      cdh = ch - this._effectDuration;
    }
    // this.setFrame(cx * cw, cy * ch, cw, ch);
    this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch - cdh);
    this.adjustMainBitmapSettings(bitmap);
    this.adjustSVShadowSettings();
  };

  Game_Action.prototype.note = function () {
    obj = this.item();
    return obj.note;
  };

  Game_Battler.prototype.makeSPName = function (action) {
    var name = "skill";
    var note = action.note(action);
    var xx = note.match(/<motionSP(\w+)>/);
    if (xx) {
      name = "motionSP" + RegExp.$1;
    } else {
      if (action.isMagicSkill()) {
        name = "spell";
      } else if (action.isSkill()) {
        name = "skill";
      } else if (action.isItem()) {
        name = "item";
      }
    }
    return name;
  };

  Game_Battler.prototype.stateMotionIndex = function () {
    var states = this.states();
    if (states.length > 0) {
      var note = states[0].note;
      var xx = note.match(/<motionSP(\w+)>/);
      if (xx) {
        return parseInt(RegExp.$1, 10) + 18;
      } else {
        return states[0].motion;
      }
    } else {
      return 0;
    }
  };

  Game_Actor.prototype.performAction = function (action) {
    Game_Battler.prototype.performAction.call(this, action);
    if (action.isAttack()) {
      this.performAttack();
    } else if (action.isGuard()) {
      this.requestMotion("guard");
    } else if (action.isMagicSkill()) {
      this.requestMotion(this.makeSPName(action));
    } else if (action.isSkill()) {
      this.requestMotion(this.makeSPName(action));
    } else if (action.isItem()) {
      this.requestMotion(this.makeSPName(action));
    }
  };
})();
