/* jshint -W008 */
/* jshint -W124 */
/* jshint -W082 */
/* jshint -W084 */
/* jshint -W061 */
//=============================================================================
// suc_main.js
//=============================================================================
/*:ja
 * @plugindesc サキュバス専用
 * 
 * @help 
 * プラグインコマンド
 * ・mp_heal [数値] 数値分MPを回復する 

 * @param _mute
 * @type boolean
 * @default false
 *
 * @param _pinchTrunk
 * @desc ピンチゲージの値
 * @default 50
 * @type number
 *
 * @param _colorId
 * @desc カラー値 0=バフ値、1=デバフ値 #[1, 18]
 * @type number[]
 *
 * @param _iconIndexBoost
 * @desc アイコンインデクス：ブースト
 * @type number
 * @default 96
 *
 * @param _back1SpritePos
 * @desc 背景スプライトの位置 #[512, 576]
 * @type Number[]
 * @default [512, 576]
 *
 * @param _isUntransformTest
 * @desc 次ターン即変身が解除されます
 * @type boolean
 * @default false

 * @param _LifeLowPct
 * @desc 低HPパーセンテージ
 * @type number
 * @default 30

 * @param _transformTurnCountDec
 * @desc 毎ターン、Hポイントを消費する数
 * @type number
 * @default 1

 * @param CAT_COMMON
 * @text 【共通関連】
 * @default ====================================

 * @param _commonFont1
 * @desc 共通フォント１　フォント名
 * @type string
 * @default "nicomoji-plus"
 * @parent CAT_COMMON
 *
 * @param CAT_TURN
 * @text 【ターン表示関連】
 * @default ====================================

 * @param _turnFont
 * @desc ターン文字のフォント [フォント名, フォント色, フォントサイズ, アウトライン色, アウトラインサイズ]
 * @type string[]
 * @default ["NotoSansJP-Bold", "#ffffff", "25", "#000000", "3"]
 * @parent CAT_TURN
 *
 * @param _turnCountPos
 * @desc ターン数値の位置 [x, y, w, h]
 * @type number[]
 * @default [100, 18, 20, 40]
 * @parent CAT_TURN
 *
 * @param _turnCountFont
 * @desc ターン数値のフォント、フォントサイズ [フォント名, フォント色, フォントサイズ, アウトライン色, アウトラインサイズ]
 * @type string[]
 * @default ["NotoSansJP-Bold", "#ffffff", "35", "#000000", "3"]
 * @parent CAT_TURN
 *
 * @param _turnEndFont
 * @desc ターン終了文字のフォント [フォント名, フォント色, フォントサイズ, アウトライン色, アウトラインサイズ]
 * @type string[]
 * @default ["NotoSansJP-Bold", "#000000", "15", "#ffffff", "3"]
 * @parent CAT_TURN
 *
 * @param CAT_TENSION
 * @text 【テンション表示関連】
 * @default ====================================

 * @param _tensionPointMax
 * @desc 手札に変身カードが入る必要テンションポイント
 * @type number
 * @default 5
 * @parent CAT_TENSION

 * @param _tensionGaugePos
 * @desc 変身ゲージの位置 [X, Y]
 * @type number[]
 * @default [900, 300]
 * @parent CAT_TENSION

 * @param _tensionNgIconPos
 * @desc 変身NGアイコンの位置 [X, Y]
 * @type number[]
 * @default [0, 0]
 * @parent CAT_TENSION

 * @param _tensionGaugeValuePos
 * @desc 変身ポイントの位置,サイズ [x, y, w, h]
 * @type number[]
 * @default [0, 0, 20, 40]
 * @parent CAT_TENSION

 * @param _tensionGaugeValueFont
 * @desc 変身ポイントのフォント、フォントサイズ [fontName, fontSize]
 * @type string[]
 * @default ["NotoSansJP-Bold", 30]
 * @parent CAT_TENSION

 * @param CAT_ID
 * @text 【変数ID・イベントID関連】
 * @default ====================================

 * @param _commonEventIdUntransform
 * @desc 変身解除時のコモンイベントID
 * @type number
 * @default 12
 * @parent CAT_ID
 *
 * @param _hPointVarId
 * @desc 変身ポイント格納変数ID
 * @type number
 * @default 118
 * @parent CAT_ID
 *
 * @param _swIdStopDealTransform
 * @desc 変身カードの入手中止スイッチ変数ID
 * @type number
 * @parent CAT_ID
 *
 * @param CAT_SE
 * @text 【サウンド関連】
 * @default ====================================

 * @param _seVoiceBattleStart
 * @desc ボイスSE:戦闘開始時
 * @type string[]
 * @parent CAT_SE
 *
 * @param _seVoiceBattleWin
 * @desc ボイスSE:戦闘勝利時
 * @type string[]
 * @parent CAT_SE
 * @param _seVoiceBattleWinTransform
 * @desc ボイスSE:戦闘勝利時(変身時)
 * @type string[]
 * @parent CAT_SE
 *
 * @param _seVoiceBattleLose
 * @desc ボイスSE:戦闘敗北時
 * @type string[]
 * @parent CAT_SE
 * @param _seVoiceBattleLoseTransform
 * @desc ボイスSE:戦闘敗北時(変身時)
 * @type string[]
 * @parent CAT_SE
 *
 * @param _seVoiceBattleActorTurn
 * @desc ボイスSE:自ターン時
 * @type string[]
 * @parent CAT_SE
 * @param _seVoiceBattleActorTurnTransform
 * @desc ボイスSE:自ターン時(変身時)
 * @type string[]
 * @parent CAT_SE
 *
 * @param _seVoiceBattleActorDamage
 * @desc ボイスSE:被ダメージ時
 * @type string[]
 * @parent CAT_SE
 * @param _seVoiceBattleActorDamageTransform
 * @desc ボイスSE:被ダメージ時(変身時)
 * @type string[]
 * @parent CAT_SE
 *
 * @param _seVoiceBattleUseCard
 * @desc ボイスSE:カード使用時
 * @type string[]
 * @parent CAT_SE
 * @param _seVoiceBattleUseCardTransform
 * @desc ボイスSE:カード使用時(変身時)
 * @type string[]
 * @parent CAT_SE
 *
 * @param _seShield
 * @desc SE:シールドガード
 * @type string
 * @default shield
 * @parent CAT_SE

 * @param _seShieldBreak
 * @desc SE:シールドガードブレイク
 * @type string
 * @default shield_break
 * @parent CAT_SE

 * @param _seCardDeal
 * @desc SE:カード配り
 * @type string
 * @default card_system_deal1
 * @parent CAT_SE

 * @param _seCardDealNew
 * @desc SE:カード挿入
 * @type string
 * @default se_maoudamashii_element_water08
 * @parent CAT_SE

 * @param _seCardCrack
 * @desc SE:カードひび割れ
 * @type string
 * @default glass-crack1
 * @parent CAT_SE

 * @param _seCardBreak
 * @desc SE:カード壊れる
 * @type string
 * @default glass-break2
 * @parent CAT_SE

 * @param _seUseItem
 * @desc SE:アイテム使用
 * @type string
 * @default useitem
 * @parent CAT_SE

 * @param BattleActorParam
 * @desc バトルアクタ情報
 * @type struct<BattleActorParam>
 *
 * @param CharaImageParam
 * @desc 立ち絵情報
 * @type struct<CharaImageParam>
 
 * @param CameraParam
 * @desc カメラ情報
 * @type struct<CameraParam>

 * @param CardInfo
 * @desc カード情報
 * @type struct<CardInfo>

 * @param DescWindowParam
 * @desc 説明ウィンドウ情報
 * @type struct<DescriptionWindow>

 */
//=========================================================================
/*~struct~BattleActorParam:

 * @param _scale
 * @desc Spineモデルのスケールを調整します。
 * @type number

 * @param _skins
 * @desc スキン
 * @type string[]

 * @param _animIdle
 * @desc 待機アニメーション
 * @param _animUseItem
 * @desc カード・アイテム使用時アニメーション
 * @type string[]
 * @param _animDash
 * @desc ダッシュアニメーション
 * @param _animDamage
 * @desc ダメージ時アニメーション
 * @param _animBattleEndWin
 * @desc 戦闘勝利時アニメーション
 * @param _animBattleEndLose
 * @desc 戦闘敗北時アニメーション

 * @param _varIdxCurrentActorState
 * @desc 現在のアクタの状態を格納する変数のインデクス。
 * @type number
 * @min 1
 * @default 70

 * @param _varIdxCurrentEnemyType
 * @desc 現在のエロ攻撃対象の敵のタイプが格納される変数のインデクス。敵のタイプは敵キャラのメモで定義する。
 * @type number
 * @min 1
 * @default 71

 * @param _varIdxCurrentSkillId
 * @desc 現在の実行スキルID
 * @type number
 * @min 1
 * @default 72

 * @param _antialias
 * @type boolean
 * @default false

 */
//=========================================================================
/*~struct~AtlasAnimationParam:
 *
 * @param _filename
 * @desc アトラス画像ファイル名
 *
 * @param _count
 * @desc アニメーション数
 * @type number
 *
 * @param _rows
 * @desc アトラスファイルの横分割数
 * @type number
 *
 * @param _columns
 * @desc アトラスファイルの横分割数
 * @type number
 */
//=========================================================================
/*~struct~CharaImageParam:
 *
 * @param _posChara
 * @desc 右キャラクタの位置　移動元X, 移動元Y, 移動先X, 移動先Y
 * @type number[]
 * @default [1000, 0, 850, 0]

 * @param _scaleChara
 * @desc 右キャラクタのスケール
 * @type number
 * @default 0.5

 * @param _spineName
 * @desc 右キャラクタのSpineファイル名
 * @default battle

 * @param _skinsNormal
 * @desc 右キャラクタのSpineスキン名(通常時) [0]=100-60％, [1]=59-30%, [2]=29-0%
 * @type string[]
 * @param _skinsTransform
 * @desc 右キャラクタのSpineスキン名(変身時) [0]=100-60％, [1]=59-30%, [2]=29-0%
 * @type string[]

 * @param _animAndAtcmSetNormal100
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 通常時ランダム　100%時
 * @type string[]
 * @default ["p/battle","怒り"]
 
 * @param _animAndAtcmSetNormal70
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 通常時ランダム　70-99%時
 * @type string[]
 * @default ["p/hatena","エロ微笑み"]
 
 * @param _animAndAtcmSetNormal50
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 通常時ランダム　50-69%時
 * @type string[]
 * @default ["p/hatena_R","照れ不満"]
 
 * @param _animAndAtcmSetNormal30
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 通常時ランダム　30-49%時
 * @type string[]
 * @default ["p/tukare","ベロ出し"]
 
 * @param _animAndAtcmSetNormal0
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 通常時ランダム　0-29%時
 * @type string[]
 * @default ["p/hiki","照れ"],["p/sakyu","サキュ"]
 
 * @param _animAndAtcmSetTransform100
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 変身時ランダム　100%時
 * @type string[]
 
 * @param _animAndAtcmSetTransform70
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 変身時ランダム　70-99%時
 * @type string[]
 
 * @param _animAndAtcmSetTransform50
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 変身時ランダム　50-69%時
 * @type string[]
 
 * @param _animAndAtcmSetTransform30
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 変身時ランダム　30-49%時
 * @type string[]
 
 * @param _animAndAtcmSetTransform0
 * @desc 右立ち絵キャラクタのアニメーション・アタッチメントセット名 変身時ランダム　0-29%時
 * @type string[]

 * @param _antialias
 * @type boolean
 * @default false

 */
//=========================================================================
/*~struct~CameraParam:
 *
 * @param _propDefault
 * @desc デフォルト時のカメラプロパティ　[X位置, Y位置, スケール]
 * @type number[]
 * @default [0, 0, 1]

 * @param _propPlayerTurn
 * @desc 味方ターン時のカメラプロパティ　[X位置, Y位置, スケール]
 * @type number[]
 * @default [50, 0, 1.1]

 * @param _propEnemyTurn
 * @desc 敵ターン時のカメラプロパティ　[X位置, Y位置, スケール]
 * @type number[]
 * @default [-50, 0, 1.1]

 * @param _propBattleEnd
 * @desc デフォルト時のカメラプロパティ　[X位置, Y位置, スケール]
 * @type number[]
 * @default [110, 0, 1.5]

 * @param _calcFrame
 * @desc lerp計算フレーム
 * @type number
 * @default 150

 * @param _moveT
 * @desc カメラの移動係数 0-1で設定する
 * @type number
 * @default 0.1

 * @param _moveWeightBack
 * @desc スクロール処理に対する遠景のスクロール量のウェイト　0が通常
 * @type number
 * @default 0.1

 * @param _scaleWeightBack
 * @desc ズーム処理に対する近景のスケール量のウェイト　0が通常
 * @type number
 * @default 0.5

 * @param _moveWeightFront
 * @desc スクロール処理に対する近景のスクロール量のウェイト　0が通常
 * @type number
 * @default 0.5

 * @param _scaleWeightFront
 * @desc ズーム処理に対する近景のスケール量のウェイト　0が通常
 * @type number
 * @default 2

 * @param _cameraShakeDefault
 * @desc デフォルト時のカメラシェイク値
 * @type number[]
 * @default [0.005, 10]

 * @param _cameraShakeDamage
 * @desc ダメージ時のカメラシェイク値
 * @type number[]
 * @default [400, 200, 12]

 */
//=========================================================================
/*~struct~CardInfo:
 *
 * @param _on
 * @desc 有効化
 * @type boolean
 * @default false
 *
 * @param _forceUseDeck
 * @desc 常にdeckファイルを使用する
 * @type boolean
 * @default true
 *
 * @param _handCount
 * @desc デフォルトハンド数
 * @type Number
 * @default 5
 *
 * @param _cardSpacing
 * @desc カードとカードの間隔（3.141592 で約90度）
 * @type Number
 * @default 0.2
 *
 * @param _cardArrowSpacing
 * @desc 矢印とカードの間隔（3.141592 で約90度）
 * @type Number
 * @default 0.2
 *
 * @param _pos
 * @desc カードの位置
 * @type Number[]
 * @default [0, 600]

 * @param _posOfs
 * @desc カードの位置オフセット
 * @type Number[]
 * @default [100, 15]

 * @param _posOfs2
 * @desc カードの位置オフセット2 選択時に横に動く量
 * @type Number
 * @default 60

 * @param _posOfs3
 * @desc カードの位置オフセット3  選択時に上に動く量
 * @type Number
 * @default -100

 * @param _rotOfsMax
 * @desc カードの最大角度オフセット
 * @type Number
 * @default 16

 * @param _posTp
 * @desc TPの位置, width, 
 * @type number[]
 * @default [850, 500, 64]

 * @param _fontInfoName
 * @desc カードのタイトル　　参照フォント名（fontsフォルダに入ってるもの）,位置X, 位置Y, width, lineheight,align,テキストサイズ,テキスト色,アウトラインサイズ, アウトライン色
 * @type string[]
 * @default ["NotoSansJP-Bold","40","25","125","0","center","13","#fff3ca","5","rgb(0, 0, 0)"]

 * @param _fontInfoCost
 * @desc カードのコスト　　参照フォント名（fontsフォルダに入ってるもの）,位置X, 位置Y, width, lineheight,align,テキストサイズ,テキスト色,アウトラインサイズ, アウトライン色
 * @type string[]
 * @default ["NotoSansJP-Bold","14","8","14","28","center","28","#ff0000","4","rgb(0, 0, 0)"]

 * @param _fontInfoDesc
 * @desc カードの説明文　　参照フォント名（fontsフォルダに入ってるもの）,位置X, 位置Y, width, lineheight,align,テキストサイズ,テキスト色,アウトラインサイズ, アウトライン色
 * @type string[]
 * @default ["NotoSansJP-Light","14","110","-","-","-","12","#ffffff","4","rgb(0, 0, 0)"]
 */
//=========================================================================
/*~struct~DescriptionWindow:
 *
 * @param _cardDescWindowWidth
 * @desc カードの横に表示されるウィンドウの横幅 #175
 * @type number
 * @default 175

 * @param _cardDescWindowOffset
 * @desc カードの横に表示されるウィンドウのオフセットXY #[80, -120]
 * @type number[]
 * @default [80, -120]

 * @param _fontInfo
 * @desc フォント設定　　参照フォント名（fontsフォルダに入ってるもの）,位置X, 位置Y, width, lineheight,align,テキストサイズ,テキスト色,アウトラインサイズ, アウトライン色
 * @type string[]
 * @default ["GameFont","0","2","-","-","-","14","#ffffff","4","rgb(0, 0, 0)"]
 */

Imported = Imported || {};
Imported.nnfs = true;
var Nnfs = {
  _isDebug: null,
  isDebug: function () {
    if (this._isDebug == null)
      this._isDebug = Utils.isOptionValid("test") || DataManager.isBattleTest();
    return this._isDebug;
  },
  d: function () {
    var obj = {};
    Error.captureStackTrace(obj);
    console.log(obj.stack);
  },
  parseDeep: function (params) {
    for (i in params) {
      let param = params[i];
      if (typeof param === "function" || param === "number") {
        continue;
      }
      // console.log(i, "=", param, param[0], typeof param);
      try {
        params[i] = JSON.parse(
          param,
          ((key, value) => {
            // console.log("key=", key, "value=", value, typeof value);
            try {
              return this.parseDeep(value);
            } catch (e) {
              // console.log(1);
              return value;
            }
          }).bind(this)
        );
        // console.log("result = ", params[i]);
      } catch (e) {}
    }
    return params;
    // try {
    // 	return JSON.parse(string, function(key, value) {
    // 		try {
    // 			return this.parseDeep(value);
    // 		} catch (e) {
    // 			return value;
    // 		}
    // 	}.bind(this));
    // } catch (e) {
    // 	return string;
    // }
  },
  shuffleArray: function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  },
  deepCopy: function (obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  Coroutine: {
    Start: function (...args) {
      const resume = function (i) {
        let next = args[i].next().value;
        if (next) next(resume.bind(null, i));
        else if (i < args.length - 1) resume(i + 1);
      };
      resume(0);
    },
    waitForSeconds: function (seconds) {
      seconds = seconds * 1000 || 1;
      return function (cb) {
        setTimeout(cb, seconds);
      };
    },
    Do: function* (cb) {
      cb();
    },
  },
  Easing: function (f, a, b, t) {
    t = t.clamp(0.0, 1.0);
    return Math.lerp(a, b, f(t));
  },
  EasingFunctions: {
    // no easing, no acceleration
    linear: function (t) {
      return t;
    },
    // accelerating from zero velocity
    easeInQuad: function (t) {
      return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function (t) {
      return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity
    easeInCubic: function (t) {
      return t * t * t;
    },
    // decelerating to zero velocity
    easeOutCubic: function (t) {
      return --t * t * t + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuart: function (t) {
      return 1 - --t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function (t) {
      return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function (t) {
      return 1 + --t * t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    },
  },
  drawDigit: function (
    bitmap,
    tex,
    value,
    x,
    y,
    fontSize,
    yOfs = 0,
    align = 0
  ) {
    let width = 0;
    const w = tex.width / 11;
    const h = tex.height;
    const sy = h * yOfs;
    const string = Math.abs(value).toString();
    const scale = fontSize / 28;
    const dw = ~~(w * scale);
    const dh = ~~(h * scale);
    let ax = 0;
    y -= dh;
    for (let i = 0; i < string.length; ++i) {
      const n = +string[i];
      const sx = n * w;
      if (align === 0) {
        ax = (i - (string.length - 1) / 2) * dw - dw * 0.5;
      } else {
        ax = i * dw;
      }
      width += dw;
      bitmap.bltImage(tex, sx, sy, w, h, x + ax, y, dw, dh);
    }
    return width;
  },
  drawDigitSlash: function (bitmap, tex, x, y, fontSize, color = 0) {
    const w = tex.width / 11;
    const h = tex.height;
    const sx = w * 10;
    const sy = h * color;
    const scale = fontSize / 28;
    const dw = ~~(w * scale);
    const dh = ~~(h * scale);
    y -= dh;
    bitmap.bltImage(tex, sx, sy, w, h, x, y, dw, dh);
    return dw;
  },
  replaceFormulaTag: function (desc, action, target, value1, value2) {
    if (desc.includes("%0")) {
      const final_value = action.makeDamageValue(target, 0);
      const item = action.item();
      // 攻撃値があったら
      if (item.damage.formula.contains("a.atk")) {
        const s = action.subject();
        let base_value = s.paramBase(2) + s.paramPlus(2);
        // a.atkにすでにステート補正が含まれている　ステート補正が含まれていない純正のダメージ値をベースとして比較したいためformulaのatkを置換した
        // 物理属性補正などはあとから計算される
        base_value = this.evalDamageFormulaEx(
          s,
          item,
          item.damage.formula.replace("a.atk", base_value)
        );
        // console.log(base_value, s.paramBase(2) + s.paramPlus(2));
        if (base_value < final_value)
          desc = desc.replace(
            "%0",
            "\\c[" + params._colorId[0] + "]" + final_value + "\\c[0]"
          );
        else if (final_value < base_value)
          desc = desc.replace(
            "%0",
            "\\c[" + params._colorId[1] + "]" + final_value + "\\c[0]"
          );
        else desc = desc.replace("%0", final_value);
      } else {
        desc = desc.replace("%0", final_value);
      }
    }
    if (desc.includes("%1")) {
      let s = action.subject();
      // 防御力ダウン
      let value = s.paramRate(3) * s.paramBuffRate(3);
      let buff =
        action.item().meta.id != "shield" || value == 1 ? null : 1 < value;
      if (buff === true)
        desc = desc.replace(
          "%1",
          "\\c[" + params._colorId[0] + "]" + value1 + "\\c[0]"
        );
      else if (buff === false)
        desc = desc.replace(
          "%1",
          "\\c[" + params._colorId[1] + "]" + value1 + "\\c[0]"
        );
      else desc = desc.replace("%1", value1);
    }
    if (desc.includes("%2")) {
      desc = desc.replace("%2", value2);
    }
    return desc;
  },
  evalDamageFormulaEx: function (a, item, formula) {
    try {
      var v = $gameVariables._data;
      // var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
      var value = Math.max(eval(formula), 0); /* * sign*/
      if (isNaN(value)) value = 0;
      return value;
    } catch (e) {
      return 0;
    }
  },
  applyVariance: function (damage, variance, varianceRates) {
    if (!varianceRates) return damage;
    var amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));
    var v = amp * varianceRates[0] + amp * varianceRates[1] - amp;
    return damage >= 0 ? damage + v : damage - v;
  },
  setHpoint: function (hpoint) {
    if ($gameSystem._hPoint == null) $gameSystem._hPoint = 0;
    $gameSystem._hPoint = hpoint.clamp(0, params._tensionPointMax);
    $gameVariables.setValue(params._hPointVarId, $gameSystem._hPoint);
  },
  addHpoint: function (hpoint) {
    if ($gameSystem._hPoint == null) $gameSystem._hPoint = 0;
    $gameSystem._hPoint = ($gameSystem._hPoint + hpoint).clamp(
      0,
      params._tensionPointMax
    );
    $gameVariables.setValue(params._hPointVarId, $gameSystem._hPoint);
  },
  getSpriteFromBattler: function (battler) {
    if (battler.isActor())
      return BattleManager._spriteset._actorSprites.find(
        (e) => e._battler == battler
      );
    else
      return BattleManager._spriteset._enemySprites.find(
        (e) => e._battler == battler
      );
  },
  isContainsPointFromRect: function (
    pointX,
    pointY,
    sx,
    sy,
    width,
    height,
    padX,
    padY
  ) {
    return (
      sx + padX < pointX &&
      pointX < sx + width - padX &&
      sy < pointY + padY &&
      pointY < sy + height - padY
    );
  },
  setFont: function (b, args) {
    b.fontFace = args[0];
    b.textColor = args[1];
    b.fontSize = +args[2];
    b.outlineColor = args[3];
    b.outlineWidth = +args[4];
  },
  enableCenteringForDrawTextEx: function (window, needContentWidth) {
    const centering = function (textState) {
      const buf_idx = textState.index;
      const buf_fontsize = this.contents.fontSize;
      let w = 0;
      while (textState.index < textState.text.length) {
        const c = textState.text[textState.index];
        if (c === "\n") break;
        else if (c === "\x1b") {
          const code = this.obtainEscapeCode(textState);
          switch (code) {
            case "{":
            case "}":
              this.processEscapeCharacter(code, textState);
              break;
          }
          this.obtainEscapeParam(textState);
        } else {
          w += this.textWidth(c);
          ++textState.index;
        }
      }
      if (needContentWidth) {
        const cw = this.contentsWidth();
        textState.x += cw / 2 - w / 2;
      } else {
        textState.x -= w / 2;
      }
      textState.index = buf_idx;
      this.contents.fontSize = buf_fontsize;
    }.bind(window);
    window.processCharacter = function (textState) {
      if (!textState._centeringFirst) {
        textState._centeringFirst = true;
        centering(textState);
      }
      Window_Base.prototype.processCharacter.apply(window, arguments);
    };
    window.processNewLine = function (textState) {
      Window_Base.prototype.processNewLine.apply(this, arguments);
      centering(textState);
    };
  },
  disableCenteringForDrawTextEx: function (window) {
    window.processCharacter = Window_Base.prototype.processCharacter;
    window.processNewLine = Window_Base.prototype.processNewLine;
  },
};
//=============================================================================
// nnfsプラグインオブジェクト
//=============================================================================
// for (var i in PluginManager.parameters('suc_main'))
// 	console.log(PluginManager.parameters('suc_main')[i]);
const params = Nnfs.parseDeep(PluginManager.parameters("suc_main"));
// init
params._colorId = params._colorId || [1, 18];
params._back1SpritePos = params._back1SpritePos || [512, 576];
params._iconIndexBoost = params._iconIndexBoost || 96;
params.CharaImageParam._skinsNormal = params.CharaImageParam._skinsNormal || [
  "normal",
  "nude huku pantu",
  "nude",
];
params.CharaImageParam._skinsTransform = params.CharaImageParam
  ._skinsTransform || ["change", "change", "change"];
params._tensionNgIconPos = params._tensionNgIconPos || [0, 0];
for (let i = 0; i < params.CharaImageParam._skinsNormal.length; ++i)
  params.CharaImageParam._skinsNormal[i] =
    params.CharaImageParam._skinsNormal[i].split(" ");
for (let i = 0; i < params.CharaImageParam._skinsTransform.length; ++i)
  params.CharaImageParam._skinsTransform[i] =
    params.CharaImageParam._skinsTransform[i].split(" ");
params.CardInfo._fontInfoName = params.CardInfo._fontInfoName || [
  "NotoSansJP-Bold",
  "40",
  "25",
  "125",
  "0",
  "center",
  "13",
  "#fff3ca",
  "5",
  "rgb(0, 0, 0)",
];
params.CardInfo._fontInfoCost = params.CardInfo._fontInfoCost || [
  "NotoSansJP-Bold",
  "14",
  "8",
  "14",
  "28",
  "center",
  "28",
  "#ff0000",
  "4",
  "rgb(0, 0, 0)",
];
params.CardInfo._fontInfoDesc = params.CardInfo._fontInfoDesc || [
  "NotoSansJP-Light",
  "14",
  "110",
  "-",
  "-",
  "-",
  "12",
  "#ffffff",
  "4",
  "rgb(0, 0, 0)",
];
params.DescWindowParam._cardDescWindowWidth =
  params.DescWindowParam._cardDescWindowWidth || 175;
params.DescWindowParam._cardDescWindowOffset = params.DescWindowParam
  ._cardDescWindowOffset || [80, -120];
params.DescWindowParam._fontInfo = params.DescWindowParam._fontInfo || [
  "GameFont",
  "0",
  "2",
  "-",
  "-",
  "-",
  "14",
  "#ffffff",
  "4",
  "rgb(0, 0, 0)",
];
for (let i = 0; i < params.BattleActorParam._skins.length; ++i)
  params.BattleActorParam._skins[i] =
    params.BattleActorParam._skins[i].split(" ");
// console.log(params);
Nnfs._pinchTrunk = params._pinchTrunk;
Nnfs._tensionPointMax = params._tensionPointMax;
Nnfs._bookData = [];
Nnfs._treasureSelfSwData = [];
Nnfs._selectEndScaleSize = 1.2;
Nnfs._autoVisibleCardWindow = true;
Nnfs._commonEventIdTurnEnd = 5; // スクリプトコマンドから設定される想定
Nnfs._iconIndexBoost = params._iconIndexBoost;
Nnfs._commonFont1 = params._commonFont1 || "nicomoji-plus";
const cardIdTransform = "transform";
//=============================================================================
// **Global Functions
//=============================================================================
const point_one = new PIXI.Point(1, 1);
const point_half = new PIXI.Point(0.5, 0.5);
//==============================
// * Math
//==============================
Math.lerp = function (value1, value2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
};
Math.deg2rad = function (deg) {
  return deg * (Math.PI / 180);
};
Math.randomRange = function (min, max) {
  if (Array.isArray(min)) return Math.randomRange.apply(this, min);
  else if (arguments.length == 1) return Math.randomRange(0, min);
  return Math.random() * (max - min) + min;
};
Math.randomRangeInt = function (min, max) {
  if (Array.isArray(min)) return Math.randomRangeInt.apply(this, min);
  else if (arguments.length == 1) return Math.randomRangeInt(0, min);
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
//==============================
// * Array
//==============================
Array.random = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};
//==============================
// ** Coroutine
//==============================
function Coroutine() {
  throw new Error("This is a static class");
}
Coroutine.setup = function () {
  this._tasks = [];
};
Coroutine.setup();
Coroutine.update = function () {
  let result = null;
  for (let i = 0; i < this._tasks.length; ++i) {
    const task_children = this._tasks[i].tasks;
    const l = task_children.length;
    result = task_children[l - 1].next();
    if (result.value != null) {
      task_children.push(result.value);
    } else if (result.done) {
      task_children.pop();
      if (0 == l - 1) {
        this._tasks.splice(i, 1);
        --i;
      }
    }
  }
};
Coroutine.removeTask = function (id) {
  this._tasks = this._tasks.filter((e) => e.id != id);
};
Coroutine.pushTask = function (...tasks) {
  this._tasks.push({ id: null, tasks: tasks });
};
Coroutine.overrideTask = function (id, ...tasks) {
  this.removeTask(id);
  this._tasks.push({ id: id, tasks: tasks });
};
Coroutine.pushTaskCancellable = function (id, ...tasks) {
  this._tasks.push({ id: id, tasks: tasks });
};
Coroutine.gWaitForSeconds = function* (seconds, ...cb) {
  const c = performance.now();
  while (performance.now() - c < seconds * 1000) {
    yield;
  }
  cb.forEach((e) => e());
};
Coroutine.gWaitForFrames = function* (frames, ...cb) {
  let c = 0;
  while (c++ < frames) {
    yield;
  }
  cb.forEach((e) => e());
};
Coroutine.gLerpVec2 = function* (
  target,
  frame,
  sx,
  sy,
  dx,
  dy,
  way = Nnfs.EasingFunctions.linear
) {
  for (let i = 0; i < frame; ++i) {
    const t = i / frame;
    target.x = Math.lerp(sx, dx, way(t));
    target.y = Math.lerp(sy, dy, way(t));
    yield;
  }
};
Coroutine.gLerp = function* (seconds, cb, way = Nnfs.EasingFunctions.linear) {
  const c = performance.now();
  let t = 0;
  do {
    t = (performance.now() - c) / (seconds * 1000);
    cb(way(t));
    yield;
  } while (t < 1);
};
Coroutine.gDo = function* (cb) {
  cb();
};
Coroutine.gIs = function* (cb) {
  while (cb()) yield;
};
const Scene_Battle_initialize = Scene_Battle.prototype.initialize;
Scene_Battle.prototype.initialize = function () {
  Scene_Battle_initialize.call(this);
  Coroutine.setup();
  if (params._mute) AudioManager.bgmVolume = 0;
};
const Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
  Scene_Battle_update.call(this);
  Coroutine.update();
};
//==============================
// *フォントスプライト
//==============================
function Sprite_Font() {
  this.initialize.apply(this, arguments);
}
Sprite_Font.prototype = Object.create(Sprite.prototype);
Sprite_Font.prototype.constructor = Sprite_Font;
Sprite_Font.prototype.initialize = function () {
  Sprite.prototype.initialize.call(this);
  this.fontFace = "GameFont";
  // this.fontSize = Window_Base.prototype.standardFontSize();
  // this.textColor = '#000000';
};
Sprite_Font.prototype.makeFontBitmap = function (w, h) {
  this.contents = this.bitmap = new Bitmap(w, h);
  this.bitmap.smooth = true;
  return this.bitmap;
};
Sprite_Font.prototype.isReady = function () {
  return this.contents != null && this.contents.isReady();
};
Sprite_Font.prototype.drawTextEx = function () {
  return Window_Base.prototype.drawTextEx.apply(this, arguments);
};
Sprite_Font.prototype.resetFontSettings = function () {
  /*return Window_Base.prototype.resetFontSettings.apply(this, arguments);*/
};
Sprite_Font.prototype.standardFontFace = function () {
  if ($gameSystem.isChinese()) return "SimHei, Heiti TC, sans-serif";
  else if ($gameSystem.isKorean()) return "Dotum, AppleGothic, sans-serif";
  else return this.fontFace;
};
Sprite_Font.prototype.standardFontSize = function () {
  return Window_Base.prototype.standardFontSize.apply(this, arguments);
};
// Sprite_Font.prototype.resetTextColor = function() { return Window_Base.prototype.resetTextColor.apply(this, arguments); };
// Sprite_Font.prototype.normalColor = function() { return this.textColor; };
Sprite_Font.prototype.convertEscapeCharacters = function () {
  return Window_Base.prototype.convertEscapeCharacters.apply(this, arguments);
};
Sprite_Font.prototype.convertExtraEscapeCharacters = function () {
  return Window_Base.prototype.convertExtraEscapeCharacters.apply(
    this,
    arguments
  );
};
Sprite_Font.prototype.convertWordWrapEscapeCharacters = function () {
  return Window_Base.prototype.convertWordWrapEscapeCharacters.apply(
    this,
    arguments
  );
};
Sprite_Font.prototype.calcTextHeight = function () {
  return /*this.textHeight ||*/ Window_Base.prototype.calcTextHeight.apply(
    this,
    arguments
  );
};
Sprite_Font.prototype.processCharacter = function () {
  return Window_Base.prototype.processCharacter.apply(this, arguments);
};
Sprite_Font.prototype.processNewLine = function () {
  return Window_Base.prototype.processNewLine.apply(this, arguments);
};
Sprite_Font.prototype.processNormalCharacter = function () {
  return Window_Base.prototype.processNormalCharacter.apply(this, arguments);
};
Sprite_Font.prototype.needWrap = function () {
  return Window_Base.prototype.needWrap.apply(this, arguments);
};
Sprite_Font.prototype.checkWordWrap = function () {
  return Window_Base.prototype.checkWordWrap.apply(this, arguments);
}; // needwrapと競合してるような
Sprite_Font.prototype.setWordWrap = function () {
  return Window_Base.prototype.setWordWrap.apply(this, arguments);
};
Sprite_Font.prototype.enableWordWrap = function () {
  return Window_Base.prototype.enableWordWrap.apply(this, arguments);
};
Sprite_Font.prototype.obtainEscapeCode = function () {
  return Window_Base.prototype.obtainEscapeCode.apply(this, arguments);
};
Sprite_Font.prototype.obtainEscapeParam = function () {
  return Window_Base.prototype.obtainEscapeParam.apply(this, arguments);
};
Sprite_Font.prototype.processEscapeCharacter = function (code, textState) {
  Window_Base.prototype.processEscapeCharacter.apply(this, arguments);
  switch (code) {
    case "N":
      this.processNewLine(textState);
      textState.index--;
      break;
  }
};
Sprite_Font.prototype.textWidth = function () {
  return Window_Base.prototype.textWidth.apply(this, arguments);
};
Sprite_Font.prototype.textColor = function () {
  return Window_Base.prototype.textColor.apply(
    BattleManager._skillWindow,
    arguments
  );
};
Sprite_Font.prototype.changeTextColor = function () {
  return Window_Base.prototype.changeTextColor.apply(this, arguments);
};
Sprite_Font.prototype.processDrawIcon = function () {
  return Window_Base.prototype.processDrawIcon.apply(this, arguments);
};
Sprite_Font.prototype.drawIcon = function () {
  return Window_Base.prototype.drawIcon.apply(this, arguments);
};
Sprite_Font.prototype.makeFontBigger = function () {
  return Window_Base.prototype.makeFontBigger.apply(this, arguments);
};
Sprite_Font.prototype.makeFontSmaller = function () {
  return Window_Base.prototype.makeFontSmaller.apply(this, arguments);
};
Sprite_Font.prototype.isValidFontRangeForPopup = function () {
  return false;
};

//=============================================================================
// **Local Process
//=============================================================================
(function () {
  // debug window 表示と位置ずらし
  // if(Nnfs.isDebug() && Utils.isNwjs()){
  // var current_window = require('nw.gui').Window.get();
  // current_window.moveTo(400, 50);
  // current_window.focus();
  // }
  Nnfs._itemMetaDescCaches = [];
  // WASD対応
  Input.keyMapper["65"] = "left";
  Input.keyMapper["68"] = "right";
  Input.keyMapper["87"] = "up";
  Input.keyMapper["83"] = "down";
  // 事前データロード
  (function () {
    const fs = require("fs");
    const path = require("path");
    const base = path.dirname(process.mainModule.filename).replace(/\\/g, "/");
    const font_files = fs.readdirSync(base + "/fonts/");
    font_files
      .filter((e) => e.endsWith(".ttf") || e.endsWith(".otf"))
      .forEach((e) => {
        Graphics.loadFont(e.slice(0, -4), base + "/fonts/" + e);
        // console.log("load font:", e);
      });
    // fs.readdir(base + '/data/', function(err, files) {
    // 	if (err) {
    // 		console.log(err);
    // 		return;
    // 	}
    // files.filter(e => /^Map\d/.test(e)).forEach(e => {
    const data_map_info = fs.readFileSync(base + "/data/MapInfos.json", "utf8");
    const data_map_info_json = JSON.parse(data_map_info);
    data_map_info_json.forEach((e) => {
      if (e == null) return;
      const filename = "Map%1.json".format(e.id.padZero(3));
      const read_text = fs.readFileSync(base + "/data/" + filename, "utf8");
      const json = JSON.parse(read_text);
      // const map_id = +e.replace(/[^0-9]/g, '');
      const map_id = e.id;
      // let title_output = false;
      json.events.forEach((ee) => {
        if (ee == null) return;
        if (ee.note.match("suc_book")) {
          let item = {};
          item.mapId = map_id;
          item.mapDisplayName = json.displayName;
          item.eventId = ee.id;
          // console.log(filename, ee)
          if (ee.pages[0].list[2].parameters.length !== 1) {
            console.log(
              "想定外のsuc_bookを発見 3番目が不正値:",
              item.mapDisplayName,
              item.eventId
            );
            return;
          }
          item.name = ee.pages[0].list[2].parameters[0]
            .replace(/text_indicator : */, "")
            .replace(/:.*/, "");
          if (ee.pages[0].list[3].parameters.length !== 5) {
            console.log(
              "想定外のsuc_bookを発見 4番目が不正値:",
              item.mapDisplayName,
              item.eventId
            );
            return;
          }
          item.star = ee.pages[0].list[3].parameters[4].replace(/\"/g, "");
          item.image = ee.pages[0].image;
          Nnfs._bookData.push(item);
        }
        // if (ee.note.match("(採取ポイント|汎用宝箱)")) {
        if (ee.note.match("(採取ポイント)")) {
          // if (!title_output && (title_output=true))
          // 	console.log('// ' + map_id + ' ' + json.displayName);
          // console.log('$gameSelfSwitches.setValue(['+map_id+', '+ee.id+', \'A\'], '+false+'); // ' +ee.name);
          Nnfs._treasureSelfSwData.push({ mapId: map_id, eventId: ee.id });
        }
      });
      // 昇順ソート
      Nnfs._bookData.sort((a, b) => {
        var na = Number(a.name.replace(/[^0-9^\.]/g, ""));
        var nb = Number(b.name.replace(/[^0-9^\.]/g, ""));
        return na < nb ? -1 : na > nb ? 1 : 0;
      });
    });
    // // 全角のやつ
    // for (var i = 0; i < Nnfs._bookData.length; ++i) {
    // 	if (0 == Number(Nnfs._bookData[i].name.replace(/[^0-9^\.]/g, ""))) {
    // 		console.log(Nnfs._bookData[i]);
    // 	}
    // }
    // });
  })();
  //==============================
  // *Local Functions
  //==============================
  const playSe = function (name) {
    AudioManager.playSe({ name: name, volume: 100, pitch: 100 });
  };
  const playVoice = function (name) {
    AudioManager.playVoice(
      { name: name, volume: 90, pitch: 100 },
      false,
      undefined
    );
  };
  //==============================
  // *カスタムプラグインコマンド
  //==============================
  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    const f_move = function (args, self, target) {
      const t = +args[0];
      args[1] = +args[1] || 0;
      args[2] = +args[2] || 0;
      args[3] = +args[3] || 1;
      args[4] = +args[4] || 0;
      args[5] = +args[5] || 0;
      if (self != null && target != null) {
        const dx = target.x - self._homeX + args[1];
        const dy = target.y - self._homeY + args[2];
        self.startMove(dx, dy, t);
        $gameTemp.setCameraProp([
          -(Graphics.boxWidth / 2 - target.x) + args[4],
          target.y - Graphics.boxHeight / 2 + args[5],
          args[3],
        ]);
        if (self._futureSightSprite) self._futureSightSprite.visible = false;
      }
      this.wait(t);
    }.bind(this);
    // 敵の前に移動
    if (command === "move_to_enemy") {
      Makonet.MpiShowSpine.setAnimation(
        BattleManager._spriteset._actorSprites[0]._spine,
        params.BattleActorParam._animDash,
        true
      );
      Coroutine.pushTask(
        Coroutine.gWaitForFrames(+args[0], () =>
          Makonet.MpiShowSpine.setAnimation(
            BattleManager._spriteset._actorSprites[0]._spine,
            params.BattleActorParam._animIdle,
            true
          )
        )
      );
      f_move(
        args,
        BattleManager._spriteset._actorSprites[0],
        Nnfs.getSpriteFromBattler(BattleManager._targets[0])
      );
      Nnfs._enableUpdateTargetPosition[0] = false;
    } else if (command === "move_to_actor") {
      const es = BattleManager._spriteset._enemySprites.find(
        (e) => e._battler == BattleManager._subject
      );
      f_move(args, es, BattleManager._spriteset._actorSprites[0]);
      es._futureSightSprite.visible = false;
      Nnfs._enableUpdateTargetPosition[1] = false;
    } else if (command === "move_to_home") {
      if (!Nnfs._enableUpdateTargetPosition[0]) {
        const actor = BattleManager.actor();
        if (actor != null) {
          actor_sprite = Nnfs.getSpriteFromBattler(actor);
          if (actor_sprite != null && actor_sprite._futureSightSprite) {
            actor_sprite._futureSightSprite.visible = true;
          }
        }
      }
      Nnfs._enableUpdateTargetPosition[0] = true; //
      Nnfs._enableUpdateTargetPosition[1] = true; // [0]のアクタ用にしか使ってないっぽい　多分未使用
      // 今んとこあるってことは敵
      if (BattleManager._subject != null) {
        const es = BattleManager._spriteset._enemySprites.find(
          (e) => e._battler == BattleManager._subject
        );
        if (es != null) {
          const t = +args[0] || 12;
          es.startMove(0, 0, t);
          es._futureSightSprite.visible = true;
          $gameTemp.setCameraProp(params.CameraParam._propEnemyTurn);
          if (es._futureSightSprite) es._futureSightSprite.visible = true;
          this.wait(t);
        }
      }
    }
    // キャラ返信
    else if (command === "refresh_chara") {
      BattleManager._spriteset._actorSprites[0].refreshChara(+args[0]);
    }
    // カメラシェイク
    else if (command === "camera_shake") {
      $gameTemp._shakePower = +args[0];
      $gameTemp._shakeSpeed = +args[1];
      $gameTemp._shakeDuration = +args[2];
    }
    // Hポイント増加
    else if (command === "hpoint_up" || command === "add_tension") {
      Nnfs.addHpoint(+args[0]);
    } else if (
      command === "hpoint_up_in_battle" ||
      command === "add_tension_in_battle"
    ) {
      Nnfs.addHpoint(+args[0]);
      BattleManager._skillWindow.refreshHPoint();
    }
    // カード追加
    else if (command === "add_card") {
      $gameTemp.gainCard = +args[0];
    }
    // セルフスイッチ
    else if (command === "self_sw") {
      const map_id = +args[0];
      const ev_id = +args[1];
      const self_sw_types = args[2];
      const on = args[3] == "true";
      if (0 < self_sw_types.length) {
        self_sw_types.forEach(function (selfSwitchType) {
          $gameSelfSwitches.setValue(
            [map_id, ev_id, selfSwitchType.toUpperCase()],
            on
          );
        });
      } else {
        $gameSelfSwitches.setValue(
          [map_id, ev_id, self_sw_types.toUpperCase()],
          on
        );
      }
    }
    // セルフスイッチ検出
    else if (command === "dump_self_sw_picked_by_memo_from_map") {
      const fs = require("fs");
      const path = require("path");
      const base = path.dirname(process.mainModule.filename);
      const note_filter = args[0] || /.*/;
      const is_on = args[1] === "true";
      console.log(
        "// 全マップのメモから「" + note_filter + "」で抽出したイベント"
      );
      fs.readdir(base + "/data/", function (err, files) {
        if (err) throw err;
        files
          .filter((e) => /^Map\d/.test(e))
          .forEach((e) => {
            const read_text = fs.readFileSync(base + "/data/" + e, "utf8");
            const json = JSON.parse(read_text);
            const map_id = +e.replace(/[^0-9]/g, "");
            let title_output = false;
            json.events.forEach((ee) => {
              if (ee == null) return;
              if (ee.note.match(note_filter)) {
                if (!title_output && (title_output = true))
                  console.log("// " + map_id + " " + json.displayName);
                console.log(
                  "$gameSelfSwitches.setValue([" +
                    map_id +
                    ", " +
                    ee.id +
                    ", 'A'], " +
                    is_on +
                    "); // " +
                    ee.name
                );
              }
            });
          });
      });
    }
    // 宝箱セルフスイッチ操作
    else if (command === "treasure_self_sw_reset") {
      Nnfs._treasureSelfSwData.forEach((e) => {
        $gameSelfSwitches.setValue([e.mapId, e.eventId, "A"], false);
      });
    }
    // 戦闘時立ち絵のアニメーション変更
    else if (command === "charaimage_anim") {
      BattleManager._skillWindow._charaStand._overrideAnimName =
        args[0] === "null" ? null : args[0];
    }
    // 戦闘時立ち絵のアニメーション変更
    else if (command === "mp_heal") {
      let actor = $gameParty.members()[0];
      actor._mp += +args[0];
      actor._mp = actor._mp.clamp(0, actor.mmp);
      BattleManager._skillWindow.drawDigitMp(actor.mp, actor.mmp);
    }
    // 体幹値の設定
    else if (command === "add_trunk") {
      const actor = $gameParty.members()[0];
      const value = +args[0];
      actor.setTrunk((actor.trunk() + value).clamp(0, actor.trunkMax()));
    }
    return false;
  };
  //==============================
  // *セーブパラメータ追加
  //==============================
  const Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    Game_System_initialize.call(this);
    this._trunk = 0;
  };
  //==============================
  // *ホームポジションに戻ってしまうタイミングをコントロール
  //==============================
  Nnfs._enableUpdateTargetPosition = [true, true];
  const Sprite_Actor_updateTargetPosition =
    Sprite_Actor.prototype.updateTargetPosition;
  Sprite_Actor.prototype.updateTargetPosition = function () {
    if (!Nnfs._enableUpdateTargetPosition[0]) return;
    Sprite_Actor_updateTargetPosition.call(this);
  };
  //=============================================================================
  // **カードバトルシステム
  //=============================================================================
  if (params.CardInfo._on) {
    let default_deck_obj = null;
    params.CardInfo._useWrap = true;
    params.CardInfo._forceUseDeck |= DataManager.isBattleTest();
    //==============================
    // *カードバトルシステム:汎用処理
    //==============================
    Sprite.prototype.getRectangle = function () {
      return new Rectangle(
        this.x - this.anchor.x * this.width,
        this.y - this.anchor.y * this.height,
        this.width,
        this.height
      );
    };
    //==============================
    // *カードバトルシステム:読み込み処理
    //==============================
    // const LoadDeckIfNeeded = function() {
    // 	if (default_deck_obj != null)
    // 		return Nnfs.deepCopy(default_deck_obj);
    // 	return LoadDeck();
    // };
    const LoadDeck = function () {
      if (params.CardInfo._forceUseDeck) return LoadDeckFromFile();
      else return LoadDeckFromPossession();
    };
    const LoadDeckFromPossession = function () {
      let obj = {};
      obj.deck = [];
      obj.discards = [];
      // 所持アイテム
      $gameParty
        .items()
        .filter((e) => DataManager.isItem(e) && e.itypeId === 1 && e.meta.cost)
        .forEach((e) =>
          Array.prototype.push.apply(
            obj.deck,
            Array($gameParty.numItems(e)).fill(e.id)
          )
        );
      // console.log("所持アイテムから追加されるカード:", $gameParty.items().filter(e => DataManager.isItem(e) && e.itypeId === 1 && e.meta.cost));
      // 所持装備
      $gameParty
        .members()[0]
        .equips()
        .filter((e) => e && e.meta.addcard)
        .forEach((e) => obj.deck.push(+e.meta.addcard));
      // console.log("所持装備から追加されるカード:", $gameParty.members()[0].equips().filter(e => e && e.meta.addcard));
      default_deck_obj = obj;
      return Nnfs.deepCopy(obj);
    };
    const LoadDeckFromFile = function () {
      const fs = require("fs");
      const path = require("path");
      const base = path.dirname(process.mainModule.filename);
      try {
        const read_text = fs.readFileSync(base + "/data/deck", "utf8");
        var obj = JSON.parse(read_text);
        var arr = [];
        obj.deck.forEach((v) => {
          for (let i = 0; i < v[1]; ++i) {
            arr.push(v[0]);
          }
        });
        // 所持装備
        $gameParty
          .members()[0]
          .equips()
          .filter((e) => e && e.meta.addcard)
          .forEach((e) => obj.deck.push(+e.meta.addcard));
        obj.deck = arr;
        obj.discards = [];
        default_deck_obj = obj;
        return Nnfs.deepCopy(obj);
      } catch (e) {
        throw new Error("Failed to load file\n" + e);
      }
    };
    const LoadCard = function (filename) {
      // 固定
      // return ImageManager.loadPicture('card_system/card0');
      if (!Nnfs.isDebug())
        return ImageManager.loadPicture("card_system/" + filename);
      const fs = require("fs");
      const path = require("path");
      const base = path.dirname(process.mainModule.filename);
      try {
        fs.statSync(base + "/img/pictures/card_system/" + filename + ".png");
      } catch (e) {
        console.log(
          "カード画像が見つかりません。",
          base + "/img/pictures/card_system/" + filename + ".png"
        );
        return ImageManager.loadPicture("card_system/card0");
      }
      return ImageManager.loadPicture("card_system/" + filename);
    };
    //==============================
    // *カードバトルシステム:開始時にカードウィンドウを作成する
    //==============================
    Scene_Battle.prototype.createSkillWindow = function () {
      this._skillWindow = new Window_BattleCard();
      this._skillWindow.hide();
      this._skillWindow.setHandler("ok", this.onBattleCardDecided.bind(this));
      this._skillWindow.setHandler(
        "cancel",
        function () {
          this._skillWindow._state = Window_BattleCard.STATE_SELECT_OPTION;
          this._skillWindow.hideCommand();
          this._partyCommandWindow.setup();
          Coroutine.overrideTask(
            "charaStandCoroutine",
            this._skillWindow._charaStand.coroutineHideChara()
          );
        }.bind(this)
      );
      this._skillWindow.setHandler(
        "cursorup",
        function () {
          this._skillWindow._state = Window_BattleCard.STATE_SELECT_OPTION;
          this._skillWindow.hideCommand();
          this._skillWindow.hide();
          this._windowBattleCardSelectBattler.show();
          Coroutine.overrideTask(
            "charaStandCoroutine",
            this._skillWindow._charaStand.coroutineHideChara()
          );
        }.bind(this)
      );
      this.addWindow(this._skillWindow);
      BattleManager._skillWindow = this._skillWindow;
      // 表示順
      this.addWindow(this._partyCommandWindow);
    };
    Scene_Battle.prototype.onBattleCardDecided = function () {
      let item = this._skillWindow.item();
      // ターン終了
      if (null == item) {
        // ターン終了時イベント
        if (Nnfs._commonEventIdTurnEnd) {
          BattleManager._interpreter.setup(
            $dataCommonEvents[Nnfs._commonEventIdTurnEnd].list,
            0
          );
          Coroutine.pushTask(
            function* () {
              while (BattleManager.isEventRunning()) yield;
              this._skillWindow.activate();
            }.bind(this)()
          );
          return;
        }
        BattleManager.actor().clearActions();
        this.selectNextCommand();
      }
      // カード
      else {
        var action = BattleManager.inputtingAction();
        action.setItem(item.id);
        // GameActionに情報を渡す
        const card = this._skillWindow.getSelectedCard();
        action._card = card;
        $gameParty.setLastItem(item);
        this.onSelectAction();
      }
      // キャラ隠し
      Coroutine.overrideTask(
        "charaStandCoroutine",
        this._skillWindow._charaStand.coroutineHideChara()
      );
    };
    Scene_Battle.prototype.onSelectAction = function () {
      var action = BattleManager.inputtingAction();
      this._itemWindow.hide();
      // アイテムウィンドウの場合
      if (this._skillWindow.isOptionState()) {
        this._skillWindow._lastTargetType = null;
        if (action.needsSelection()) this.selectEnemySelection();
        else this.selectNextCommand();
      }
      // カードを選択した場合
      else {
        this._skillWindow._lastTargetType =
          this._skillWindow.getSelectedCardType();
        if (
          action.needsSelection() ||
          this._skillWindow._lastTargetType !== Window_BattleCard.SELTYPE_NONE
        ) {
          switch (this._skillWindow._lastTargetType) {
            case Window_BattleCard.SELTYPE_ENEMY:
              this._windowBattleCardSelectEnemy.show();
              break;
            case Window_BattleCard.SELTYPE_CARD1:
            case Window_BattleCard.SELTYPE_CARDX:
              this._windowBattleCardSelectCard.show();
              break;
          }
          this._skillWindow._state = Window_BattleCard.STATE_SELECT_TARGET;
          this._skillWindow.hide();
          // this._cardTargetWindow.show(this._skillWindow);
        } else {
          this.selectNextCommand();
        }
      }
    };
    //==============================
    // *カードバトルシステム:開始時にターゲット選択ウィンドウを作成する
    // *カードバトルシステム:開始時に説明ウィンドウを作成する
    //==============================
    var Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
      Scene_Battle_createAllWindows.call(this);
      this.createWindowBattleCardSelectBattler();
      this.createWindowBattleCardSelectEnemy();
      this.createWindowBattleCardSelectCard();
    };
    Scene_Battle.prototype.createWindowBattleCardSelectBattler = function () {
      this._windowBattleCardSelectBattler =
        new Window_BattleCardSelectBattler();
      this._windowBattleCardSelectBattler.setHandler(
        "cancel",
        function () {
          this._windowBattleCardSelectBattler.hide();
          this.ReactivateBattleCardByCancel();
        }.bind(this)
      );
      this._windowBattleCardSelectBattler.setHandler(
        "cursordown",
        function () {
          this._windowBattleCardSelectBattler.hide();
          this.ReactivateBattleCardByCancel();
        }.bind(this)
      );
      this.addWindow(this._windowBattleCardSelectBattler);
    };
    Scene_Battle.prototype.createWindowBattleCardSelectEnemy = function () {
      this._windowBattleCardSelectEnemy = new Window_BattleCardSelectEnemy();
      this._windowBattleCardSelectEnemy.setHandler(
        "ok",
        function () {
          let action = BattleManager.inputtingAction();
          action.setTarget(this._windowBattleCardSelectEnemy.enemyIndex());
          this._windowBattleCardSelectEnemy.hide();
          this.selectNextCommand();
        }.bind(this)
      );
      this._windowBattleCardSelectEnemy.setHandler(
        "cancel",
        function () {
          this._windowBattleCardSelectEnemy.hide();
          this.ReactivateBattleCardByCancel();
        }.bind(this)
      );
      this.addWindow(this._windowBattleCardSelectEnemy);
    };
    Scene_Battle.prototype.createWindowBattleCardSelectCard = function () {
      this._windowBattleCardSelectCard = new Window_BattleCardSelectCard();
      this._windowBattleCardSelectCard.setHandler(
        "ok",
        function () {
          this._itemWindow.hide();
          const action = BattleManager.inputtingAction();
          switch (this._windowBattleCardSelectCard._baseCardType) {
            case Window_BattleCard.SELTYPE_CARD1:
              const card = this._windowBattleCardSelectCard.getSelectedCard();
              card._x = Graphics.boxWidth / 2 + card.width / 2;
              card._y =
                params.CardInfo._pos[1] + params.CardInfo._posOfs3 - 250;
              action._cardTargets = [card];
              this.selectNextCommand();
              this._windowBattleCardSelectCard.hide();
              break;
            case Window_BattleCard.SELTYPE_CARDX:
              // 選択完了
              if (this._windowBattleCardSelectCard.index() == 0) {
                action._cardTargets =
                  this._windowBattleCardSelectCard.getSelectedCardStack();
                this.selectNextCommand();
                this._windowBattleCardSelectCard.hide();
              } else {
                this._windowBattleCardSelectCard.pushStack();
              }
              break;
          }
        }.bind(this)
      );
      this._windowBattleCardSelectCard.setHandler(
        "cancel",
        function () {
          if (
            this._windowBattleCardSelectCard._baseCardType ===
            Window_BattleCard.SELTYPE_CARDX
          ) {
            if (
              0 < this._windowBattleCardSelectCard.getSelectedCardStack().length
            ) {
              this._windowBattleCardSelectCard.popStack();
              return;
            }
          }
          this._windowBattleCardSelectCard.hide(true);
          this.ReactivateBattleCardByCancel();
        }.bind(this)
      );
      // BattleManager._targetWindow = this._windowBattleCardSelectCard;
      this.addWindow(this._windowBattleCardSelectCard);
    };
    Scene_Battle.prototype.ReactivateBattleCardByCancel = function () {
      this._skillWindow._state = Window_BattleCard.STATE_SELECT_CARD;
      this._skillWindow.show();
      this._skillWindow.activate();
      BattleManager._skillWindow.refreshSelectedCard(null); // 変更した数値を元に戻す
      Coroutine.overrideTask(
        "charaStandCoroutine",
        this._skillWindow._charaStand.coroutineShowChara()
      );
      $gameTemp.setCameraProp(params.CameraParam._propPlayerTurn);
    };
    const Scene_Battle_selectNextCommand =
      Scene_Battle.prototype.selectNextCommand;
    Scene_Battle.prototype.selectNextCommand = function () {
      this._skillWindow.closeDescWindow();
      if (this._skillWindow.isOptionState()) {
        // アイテムは1ターンに一度だけ使用できる
        this._partyCommandWindow._usedItem = true;
        this._partyCommandWindow.close();
      } else {
        this._skillWindow.startCardAction();
      }
      Coroutine.pushTask(
        function* () {
          while (BattleManager.isEventRunning()) yield;
          Scene_Battle_selectNextCommand.call(this);
        }.bind(this)()
      );
    };
    //==============================
    // *カードバトルシステム:開始時にオプションウィンドウを作成する
    //==============================
    Scene_Battle.prototype.createPartyCommandWindow = function () {
      this._partyCommandWindow = new Window_PartyCommand();
      this._partyCommandWindow.x =
        Graphics.boxWidth / 2 - this._partyCommandWindow.windowWidth() / 2;
      this._partyCommandWindow.setHandler("item", this.commandItem.bind(this));
      this._partyCommandWindow.setHandler(
        "escape",
        this.commandEscape.bind(this)
      );
      this._partyCommandWindow.setHandler(
        "cancel",
        function () {
          this._partyCommandWindow.close();
          this.ReactivateBattleCardByCancel();
        }.bind(this)
      );
      this._partyCommandWindow._usedItem = false;
      this._partyCommandWindow.deselect();
    };
    Window_PartyCommand.prototype.makeCommandList = function () {
      this.addCommand(TextManager.item, "item", !this._usedItem);
      this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
    };
    Window_PartyCommand.prototype.numVisibleRows = function () {
      return 2;
    };
    //==============================
    // *カードバトルシステム:オプションウィンドウ.アイテムウィンドウでのコールバックを修正
    //==============================
    Scene_Battle.prototype.onItemCancel = function () {
      this._itemWindow.hide();
      this._partyCommandWindow.activate();
    };
    Scene_Battle.prototype.onEnemyCancel = function () {
      this._enemyWindow.hide();
      this._itemWindow.show();
      this._itemWindow.activate();
    };
    //==============================
    // *カードバトルシステム:オプションウィンドウ.アイテムウィンドウの一覧からカードを排除
    //==============================
    const Window_BattleItem_prototype_includes =
      Window_BattleItem.prototype.includes;
    Window_BattleItem.prototype.includes = function (item) {
      return (
        Window_BattleItem_prototype_includes.call(this, item) &&
        !item.meta.itemCategory
      );
    };
    //==============================
    // *カードバトルシステム:敵ターン開始時の初期化処理
    //==============================
    const BattleManager_startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
      BattleManager_startTurn.call(this);
      BattleManager._spriteset._enemySprites.forEach((e) =>
        e._futureSightSprite.resetShield()
      );
    };
    //==============================
    // *カードバトルシステム:ターン開始時の初期化処理
    //==============================
    const BattleManager_startInput = BattleManager.startInput;
    BattleManager.startInput = function () {
      BattleManager_startInput.call(this);
      // パーティーコマンドがないので、アクタコマンド選択へスキップした想定の処理
      this.selectNextCommand();
      const actor = this.actor();
      // MP初期化
      actor.setMp(actor.mmp + (BattleManager._mpAdd || 0));
      BattleManager._mpAdd = 0;
      // カスタムステート処理
      let shield = 0;
      let draw_plus = 0;
      actor.states().forEach((e) => {
        if (e.meta.id === "shield")
          shield += Math.round(
            Nnfs.evalDamageFormulaEx(actor, null, e.meta.formula1)
          );
        else if (e.meta.id === "addcard")
          draw_plus += Math.round(
            Nnfs.evalDamageFormulaEx(actor, null, e.meta.formula1)
          );
      });
      // シールド値初期化
      if (shield === 0)
        BattleManager._spriteset._actorSprites[0]._futureSightSprite.resetShield();
      else actor._shieldValue = shield;
      if (0 < draw_plus) BattleManager._drawPlusAtNow += draw_plus;
      // ターン限定ブースト値初期化
      if (actor._boostValueFor1Turn !== 0) {
        BattleManager._spriteset._actorSprites[0].showDamagePopup(
          -actor._boostValueFor1Turn,
          64
        );
        actor._boostValue -= actor._boostValueFor1Turn;
        actor._boostValueFor1Turn = 0;
      }
      // ポップアップ情報を削除　敵グループのイベントに記述されたステート付与が初回アクション時に表示されてしまうため
      this.allBattleMembers().forEach((e) => {
        e._statePopupInfo = [];
      });
      if (actor != null) {
        // ステータス画面非表示
        this._statusWindow.hide();
        // 手札作成
        this._skillWindow.startTurn(actor);
      }
    };
    Scene_Battle.prototype.changeInputWindow = function () {};
    Scene_Battle.prototype.updateStatusWindow = function () {};
    //==============================
    // *カードバトルシステム:戦闘終了時処理
    //==============================
    const BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
      BattleManager_endBattle.call(this, result);
      $gameTemp.setCameraProp(params.CameraParam._propBattleEnd);
      $gameTemp._cameraEnd = true;
      this._skillWindow.hideCommand();
      $gameParty.members().forEach((e) => {
        if (e.trunk() == e.trunkMax()) e.initTrunk();
      });
    };
    //==============================
    // *カードバトルシステム:コモンイベントの更新処理
    //==============================
    const BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function () {
      BattleManager_initMembers.call(this);
      this._interpreter = new Game_Interpreter();
      this._isEvent = false;
      this._isLifeLow = false;
      Nnfs._commonEventIdTurnEnd = null;
      Nnfs._autoVisibleCardWindow = true;
      this._duplicate = false;
      this._mpAdd = 0;
      this._drawPlusAtNow = 0;
      this._drawPlusAtFirst = 0;
    };
    const BattleManager_update = BattleManager.update;
    BattleManager.update = function () {
      BattleManager_update.call(this);
      this._interpreter.update();
      if (Nnfs._autoVisibleCardWindow) {
        var event_running = this._interpreter.isRunning();
        if (
          (event_running || $gameSkit._isSkitOn) &&
          this._skillWindow._parentCard.visible
        ) {
          this._skillWindow.hide();
          this._skillWindow.hideCommand();
          this._skillWindow.active = false;
          this._cardWindowHide = true;
        } else if (
          this._cardWindowHide &&
          !this._skillWindow.visible &&
          !$gameSkit._isSkitOn &&
          !event_running
        ) {
          this._skillWindow.show();
          this._cardWindowHide = false;
          // ここでthis._skillWindow.activeをtrueにすると、Scene_Battle.prototype.isAnyInputWindowActiveにより、BattleManager#updateが呼ばれなくなる
          // そうするとBAttleMAnager.Phaseが更新されなくなり、BattleManage#endactionが呼ばれるなくなる
        }
      }
    };
    BattleManager.isEventRunning = function () {
      return this._interpreter.isRunning() || this._isEvent;
    };
    const BattleManager_isBusy = BattleManager.isBusy;
    BattleManager.isBusy = function () {
      return BattleManager_isBusy.call(this) || this.isEventRunning();
    };
    //==============================
    // *カードバトルシステム:MPクランプ撤廃
    //==============================
    Game_BattlerBase.prototype.refresh = function () {
      this.stateResistSet().forEach(function (stateId) {
        this.eraseState(stateId);
      }, this);
      this._hp = this._hp.clamp(0, this.mhp);
      // this._mp = this._mp.clamp(0, this.mmp);
      this._tp = this._tp.clamp(0, this.maxTp());
    };
    Game_Actor.prototype.setMp = function (mp) {
      Game_BattlerBase.prototype.setMp.call(this, mp);
      BattleManager._skillWindow.drawDigitMp(this.mp, this.mmp);
    };
    //==============================
    // *カードバトルシステム:ブースト、シールド値の初期化
    //==============================
    const Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function () {
      Game_BattlerBase_initMembers.call(this);
      this._boostValue = 0;
      this._boostValueFor1Turn = 0;
      this._shieldValue = 0;
      this._atkUp2 = false;
      this._atkUp2RequestEnd = false;
      this._statePopupInfo = [];
    };
    //==============================
    // *カードバトルシステム:ブースト、シールド値の計算
    //==============================
    const Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function (target, value) {
      const dmg_type = this.item().damage.type;
      // HPダメージ時
      if (dmg_type === 1) {
        const s = this.subject();
        // ブースト値計算
        value += s._boostValue;
        // シールド値計算
        const is_shield = 0 < target._shieldValue;
        const final_damage = Math.max(value - target._shieldValue, 0);
        if (is_shield) {
          const result_shield = Math.max(target._shieldValue - value, 0);
          $gameTemp._shieldValue = target._shieldValue - result_shield;
          target._shieldValue = result_shield;
          if (0 < target._shieldValue) playSe(params._seShield);
          else playSe(params._seShieldBreak);
        } else if (0 < final_damage) {
          $gameTemp._shakePower = params.CameraParam._cameraShakeDamage[0];
          $gameTemp._shakeSpeed = params.CameraParam._cameraShakeDamage[1];
          $gameTemp._shakeDuration = params.CameraParam._cameraShakeDamage[2];
        }
        Game_Action_executeHpDamage.call(this, target, final_damage);
        // ダメージ条件表情切り替え　ダメージ時
        if (target.isActor()) {
          if (
            !BattleManager._isLifeLow &&
            target._hp <= target.mhp * (params._LifeLowPct * 0.01)
          ) {
            BattleManager._isLifeLow = true;
          }
          // // HP吸収時
          // else if (BattleManager._isLifeLow && target.mhp * (params._LifeLowPct * 0.01) < target._hp) {
          // 	BattleManager._isLifeLow = false;
          // }
          playVoice(
            Array.random(
              target._isTransform
                ? params._seVoiceBattleActorDamageTransform
                : params._seVoiceBattleActorDamage
            )
          );
        } else {
          if (s._atkUp2) {
            s._atkUp2RequestEnd = true;
          }
        }
      } else if (dmg_type === 3 || dmg_type === 5) {
        Game_Action_executeHpDamage.call(this, target, value);
        // ダメージ条件表情切り替え　回復時
        if (target.isActor()) {
          if (
            BattleManager._isLifeLow &&
            target.mhp * (params._LifeLowPct * 0.01) < target._hp
          ) {
            BattleManager._isLifeLow = false;
          }
        }
      } else {
        Game_Action_executeHpDamage.call(this, target, value);
      }
    };
    //==============================
    // *カードバトルシステム:カードコストの消費
    //==============================
    const Game_Battler_useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function (item) {
      Game_Battler_useItem.call(this, item);
      if (item.meta.cost) {
        // MP消費
        if (this.isActor() && !this.currentAction()._skillInsert) {
          this.setMp(this.mp - this.currentAction()._card.getRealCost());
          BattleManager._skillWindow.drawDigitMp(this.mp, this.mmp);
          playVoice(
            Array.random(
              this._isTransform
                ? params._seVoiceBattleUseCardTransform
                : params._seVoiceBattleUseCard
            )
          );
        }
      }
    };
    //==============================
    // *カードバトルシステム:カードのカスタム効果
    //==============================
    const Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
      Game_Action_apply.call(this, target);
      if (!$gameParty.inBattle()) return;
      const result = target.result();
      if (result.isHit()) {
        // 追加
        const item = this.item();
        const skill_window = BattleManager._skillWindow;
        const s = this.subject();
        switch (item.meta.id) {
          // mp増加
          case "mpup":
            s.setMp(
              s.mp +
                Math.round(
                  Nnfs.evalDamageFormulaEx(s, item, item.meta.formula1)
                )
            );
            skill_window.drawDigitMp(s.mp, s.mmp);
            break;
          // ガード
          case "shield":
            // 敵に攻撃して、シールド値を得る場合、常にsubject参照する
            let t = this.isForOpponent() ? s : target;
            t._shieldValue += Math.round(
              Nnfs.evalDamageFormulaEx(t, item, item.meta.formula1)
            );
            t._shieldValue = Math.max(0, t._shieldValue);
            break;
          // ガード+ドロー
          case "shielddraw":
            s._shieldValue += Math.round(
              Nnfs.evalDamageFormulaEx(s, item, item.meta.formula1)
            );
            s._shieldValue = Math.max(0, s._shieldValue);
            BattleManager._drawPlusAtNow += Math.max(
              0,
              Math.round(Nnfs.evalDamageFormulaEx(s, item, item.meta.formula2))
            );
            break;
          // 手札の攻撃カード2倍
          case "atkup2":
            s._atkUp2 = true;
            s._atkUp2RequestEnd = false;
            break;
          // 次のカードが手札に戻ってくるMP0の状態で
          case "duplicate":
            BattleManager._duplicate = true;
            break;
          // ブースト値+
          case "boost": {
            const t = this.isForOpponent() ? s : target;
            const add_boost = Math.round(
              Nnfs.evalDamageFormulaEx(t, item, item.meta.formula1)
            );
            t._boostValue += add_boost;
            Nnfs.getSpriteFromBattler(t).showDamagePopup(
              add_boost,
              Nnfs._iconIndexBoost
            );
            break;
          }
          // 1ターンだけブースト値+
          case "boost1turn": {
            const t = this.isForOpponent() ? s : target;
            const add_boost = Math.round(
              Nnfs.evalDamageFormulaEx(t, item, item.meta.formula1)
            );
            t._boostValue += add_boost;
            t._boostValueFor1Turn += add_boost;
            Nnfs.getSpriteFromBattler(t).showDamagePopup(
              add_boost,
              Nnfs._iconIndexBoost
            );
            break;
          }
          // 全MP消費したぶんだけ攻撃する
          case "mpattack":
            //numRepeatsで実装
            break;
          // 全MP消費したぶんだけシールド値加算する
          case "mpshield":
            s._shieldValue += Math.round(
              Nnfs.evalDamageFormulaEx(s, item, item.meta.formula1)
            );
            Nnfs.getSpriteFromBattler(s).showDamagePopup(
              this._card._value1,
              81
            );
            break;
          // x枚ドロー
          case "draw":
            BattleManager._drawPlusAtNow += Math.max(
              0,
              Math.round(Nnfs.evalDamageFormulaEx(s, item, item.meta.formula1))
            );
            break;
          // 次のターンでMP回復＆x枚ドロー
          case "readynext":
            BattleManager._mpAdd = Math.round(
              Nnfs.evalDamageFormulaEx(s, item, item.meta.formula1)
            );
            BattleManager._drawPlusAtFirst += Math.max(
              0,
              Math.round(Nnfs.evalDamageFormulaEx(s, item, item.meta.formula2))
            );
            break;
          // 指定したカードのコスト0
          case "cost0":
            this._cardTargets[0]._cost = 0;
            this._cardTargets[0].refresh();
            break;
          // すべてのカードをコスト0
          case "cost0all":
            skill_window._hands.forEach((e) => {
              e._cost = 0;
              e.refresh();
            });
            break;
          // 手札のカードを1枚デッキの先頭に移動
          case "hold":
            skill_window.discardHandByReturnDeck(this._cardTargets[0]);
            BattleManager._drawPlusAtFirst += 1;
            break;
          // 捨て札から好きなカードを手札に加える
          case "getfromdiscard": {
            const rem_idx = skill_window._deck_info.discards.findIndex(
              (e) => e == this._cardTargets[0]._id,
              this
            );
            if (0 <= rem_idx) {
              skill_window._deck_info.discards.splice(rem_idx, 1);
            }
            skill_window._hands.push(this._cardTargets[0]);
            skill_window._hands.forEach((v, i) => (v._index = i + 1));
            skill_window.makeHandMedIdx();
            skill_window.drawDigitDiscard(
              skill_window._deck_info.discards.length
            );
            break;
          }
          // デッキから好きなカードを手札に加える
          case "getfromdeck": {
            const rem_idx = skill_window._deck_info.deck.findIndex(
              (e) => e == this._cardTargets[0]._id,
              this
            );
            if (0 <= rem_idx) {
              skill_window._deck_info.deck.splice(rem_idx, 1);
            }
            skill_window._hands.push(this._cardTargets[0]);
            skill_window._hands.forEach((v, i) => (v._index = i + 1));
            skill_window.makeHandMedIdx();
            skill_window.drawDigitDeck(skill_window._deck_info.deck.length);
            break;
          }
          // 手札から好きな数だけ捨てて、その分MP回復
          case "mpupbydiscard":
            const targets = this._cardTargets; // lambda capture
            skill_window.show();
            Coroutine.pushTask(
              function* () {
                const sprite = Nnfs.getSpriteFromBattler(s);
                for (let i = 0, l = targets.length; i < l; ++i) {
                  skill_window.discardHand(targets[i]);
                  yield Coroutine.gWaitForSeconds(0.15);
                  target.setMp(target._mp + 1);
                  if (target.isActor())
                    skill_window.drawDigitMp(target.mp, target.mmp);
                  sprite.showMPDamagePopup(1);
                }
              }.bind(this)()
            );
            break;
          // 体感ゲージ回復
          case "resetgauge":
            target.initTrunk();
            Nnfs.getSpriteFromBattler(s).refreshChara();
            break;
          case "addgauge": {
            const v1 = Math.round(
              Nnfs.evalDamageFormulaEx(s, item, item.meta.formula1)
            );
            target.initTrunk();
            const trunkMax = target.trunkMax();
            const trunk = target.trunk();
            target.setTrunk((v1 + trunk).clamp(0, trunkMax));
            Nnfs.getSpriteFromBattler(s).refreshChara();
            break;
          }
          // ランプオン
          case "hpointup":
            if (!target._isTransform) {
              const v1 = Math.round(
                Nnfs.evalDamageFormulaEx(target, item, item.meta.formula1)
              );
              Nnfs.addHpoint(v1);
              skill_window.refreshHPoint();
            }
            break;
          case "hpointup1":
            if (!target._isTransform) {
              Nnfs.addHpoint(1);
              skill_window.refreshHPoint();
            }
            break;
          case "hpointup5":
            if (!target._isTransform) {
              Nnfs.addHpoint(5);
              skill_window.refreshHPoint();
            }
            break;
          case "hpointup10":
            if (!target._isTransform) {
              Nnfs.addHpoint(10);
              skill_window.refreshHPoint();
            }
            break;
          // 変身
          case "transform":
            skill_window.transforming(item);
            break;
        }
      }
      // ステートポップアップ
      // console.log(target._statePopupInfo);
      const sprite = Nnfs.getSpriteFromBattler(target);
      sprite.showPopupStateAttached();
    };
    // const Game_Action_prototype_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
      const s = this.subject();
      let item = this.item();
      let value = this.evalDamageFormula(target);
      if (s._atkUp2) {
        value *= 2;
      }
      if (target) {
        value = value * this.calcElementRate(target);
        if (this.isPhysical()) value *= target.pdr;
        if (this.isMagical()) value *= target.mdr;
        if (value < 0) value *= target.rec;
      }
      if (s.isEnemy())
        value = Nnfs.applyVariance(value, item.damage.variance, s._variances);
      return Math.round(value);
    };

    Game_Action.prototype.numRepeats = function () {
      const item = this.item();
      if (item.meta.id == "mpattack" || item.meta.id == "mpshield") {
        return this.subject().mp;
      }
      var repeats = item.repeats;
      if (this.isAttack()) {
        repeats += this.subject().attackTimesAdd();
      }
      return Math.floor(repeats);
    };

    const Game_Action_isValid = Game_Action.prototype.isValid;
    Game_Action.prototype.isValid = function () {
      return Game_Action_isValid.call(this) || this.item().meta.cost;
    };
    Sprite_Battler.prototype.showMPDamagePopup = function (value) {
      var damage = new Sprite_Damage();
      damage.x = params.CardInfo._posTp[0] + 30;
      damage.y = params.CardInfo._posTp[1];
      this._damages.push(damage);
      this.parent.addChild(damage);
      damage._animeType = 0 < value ? 1 : 0;
      damage.createDigits(2, value);
    };
    Sprite_Battler.prototype.showDamagePopup = function (value, iconIndex) {
      var damage = new Sprite_Damage();
      damage.x = this.x + this.damageOffsetX();
      damage.y = this.y + this.damageOffsetY();
      this._damages.push(damage);
      this.parent.addChild(damage);
      damage._animeType = 0 < value ? 1 : 0;
      let sprite = damage.createChildSprite();
      sprite.bitmap = new Bitmap(80, 64);
      sprite.dy = -1;
      sprite.bitmap.fontSize = 21;
      let x = 0,
        y = 0;
      if (iconIndex) {
        var bitmap = ImageManager.loadSystem("IconSet");
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = (iconIndex % 16) * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        var dw = 36 - 4;
        var dh = 36 - 4;
        var n = Math.floor(
          (sprite.bitmap.fontSize / 28) * Window_Base._iconWidth
        );
        sprite.bitmap.bltImage(bitmap, sx, sy, pw, ph, x + 2, y + 2, n, n);
        x += n;
      }
      sprite.bitmap.textColor = 0 < value ? "#bbbbff" : "#ffbbbb";
      const sign = 0 < value ? "+" : "";
      const w = sprite.bitmap.measureTextWidth(sign + value);
      sprite.bitmap.drawText(sign + value, x, y, w, 36, "left");
    };

    Sprite_Battler.prototype.showPopupStateAttached = function () {
      let cnt = 0;
      this._battler._statePopupInfo.forEach((e) => {
        const state = $dataStates[e._stateId];
        const value = e._turns;
        var damage = new Sprite_Damage();
        damage.x = this.x + this.damageOffsetX();
        damage.y = this.y + this.damageOffsetY();
        damage._animeType = 9;
        let sprite = damage.createChildSprite();
        sprite.bitmap = new Bitmap(256, 64);
        sprite.dy = -5;
        sprite.bitmap.fontFace = Nnfs._commonFont1;
        sprite.bitmap.fontSize = 30;
        let x = 0,
          y = 0;
        const icon_index = state.iconIndex;
        if (icon_index) {
          var bitmap = ImageManager.loadSystem("IconSet");
          var pw = Window_Base._iconWidth;
          var ph = Window_Base._iconHeight;
          var sx = (icon_index % 16) * pw;
          var sy = Math.floor(icon_index / 16) * ph;
          var dw = 36 - 4;
          var dh = 36 - 4;
          var n = Math.floor(
            (sprite.bitmap.fontSize / 28) * Window_Base._iconWidth
          );
          sprite.bitmap.bltImage(bitmap, sx, sy, pw, ph, x + 2, y + 2, n, n);
          x += n;
        }
        sprite.bitmap.textColor = "#bbbbff";
        let msg = state.name;
        if (state.autoRemovalTiming != 0) {
          const sign = 0 < value ? "+" : value < 0 ? "-" : "";
          msg += sign + value;
        }
        const w = sprite.bitmap.measureTextWidth(msg);
        sprite.bitmap.drawText(msg, x, y, w, 36, "left");
        if (1 <= cnt) {
          // console.log(e);
          Coroutine.pushTask(
            Coroutine.gWaitForFrames(
              10 * cnt,
              function () {
                this._damages.push(damage);
                this.parent.addChild(damage);
              }.bind(this)
            )
          );
        } else {
          this._damages.push(damage);
          this.parent.addChild(damage);
        }
        ++cnt;
      });

      this._battler._statePopupInfo = [];
    };

    //==============================
    // *カードバトルシステム：シールド時のダメージポップアップ
    //==============================
    Sprite_Battler.prototype.setupDamagePopup = function () {
      if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
          const result = this._battler.result();
          const is_hp_damage =
            result.hpAffected && 0 < result.hpDamage && !result.drain;
          let interrupt = false;
          if (0 < $gameTemp._shieldValue) {
            let sprite = new Sprite_Damage();
            this._futureSightSprite.startShakeShield();
            const r = 30;
            sprite._initX =
              this._futureSightSprite.x - 90 + Math.randomRange(-r, r);
            sprite._initY = this._futureSightSprite.y + Math.randomRange(-r, r);
            sprite._shieldValue = $gameTemp._shieldValue;
            $gameTemp._shieldValue = 0;
            sprite.scale.set(1);
            const w = sprite.digitWidth();
            const h = sprite.digitHeight();
            const string = sprite._shieldValue.toString();
            sprite.bitmap = new Bitmap(w * string.length, h);
            sprite.bitmap.smooth = true;
            for (let i = 0; i < string.length; ++i) {
              const n = +string[i];
              sprite.bitmap.bltImage(
                sprite._damageBitmap,
                w * n,
                h * 2,
                w,
                h,
                i * w,
                0
              );
            }
            this._damages.push(sprite);
            this.parent.addChild(sprite);
            if (!is_hp_damage) {
              this._battler.clearDamagePopup();
              this._battler.clearResult();
              return;
            }
          }
          let sprite = new Sprite_Damage();
          sprite.x = this.x + this.damageOffsetX();
          sprite.y = this.y + this.damageOffsetY();
          sprite.setup(this._battler);
          if (is_hp_damage) {
            this._futureSightSprite.startShakeFrame();
          }
          this._damages.push(sprite);
          this.parent.addChild(sprite);
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
      }
    };
    const Sprite_Damage_update = Sprite_Damage.prototype.update;
    Sprite_Damage.prototype.update = function () {
      if (this._shieldValue) {
        this.x = this._initX + (Math.random() - 0.5) * 10;
        this.y = this._initY + (Math.random() - 0.5) * 10;
      }
      Sprite_Damage_update.call(this);
    };
    //==============================
    // *カードバトルシステム：敵選択ウィンドウ
    //==============================
    function Window_BattleCardSelectEnemy() {
      this.initialize.apply(this, arguments);
    }
    Window_BattleCardSelectEnemy.prototype = Object.create(
      Window_BattleEnemy.prototype
    );
    Window_BattleCardSelectEnemy.prototype.constructor =
      Window_BattleCardSelectEnemy;
    Window_BattleCardSelectEnemy.prototype.drawItem = function (index) {};
    Window_BattleCardSelectEnemy.prototype._refreshAllParts = function () {};
    Window_BattleCardSelectEnemy.prototype._refreshBack = function () {};
    Window_BattleCardSelectEnemy.prototype._refreshFrame = function () {};
    Window_BattleCardSelectEnemy.prototype._refreshArrows = function () {};
    Window_BattleCardSelectEnemy.prototype._refreshPauseSign = function () {};
    Window_BattleCardSelectEnemy.prototype.initialize = function () {
      Window_BattleEnemy.prototype.initialize.call(this, 0, 0);
      this._cursor = new Sprite(ImageManager.loadPicture("card_system/cursor"));
      this._cursor.anchor.x = 0.5;
      this._cursor.anchor.y = 1;
      this._cursor.bitmap.addLoadListener(
        function () {
          this._ratio = this._cursor.bitmap.height / this._cursor.bitmap.width;
        }.bind(this)
      );
      this.addChild(this._cursor);
      this._cnt = 0;
    };

    Window_BattleCardSelectEnemy.prototype.show = function () {
      Window_BattleEnemy.prototype.show.call(this);
      this.active = true; // reselect回避
    };
    Window_BattleCardSelectEnemy.prototype.hide = function () {
      Window_BattleEnemy.prototype.hide.call(this);
      this.active = false; // reselect回避
    };
    Window_BattleCardSelectEnemy.prototype.update = function (index) {
      if (!this.visible) return;
      Window_BattleEnemy.prototype.update.call(this, index);
      this._cursor.scale.x = Math.sin((this._cnt += 0.1));
    };

    Window_BattleCardSelectEnemy.prototype.scrollDown = function () {
      Window_BattleCard.prototype.scrollDown.call(this);
    };
    Window_BattleCardSelectEnemy.prototype.scrollUp = function () {
      Window_BattleCard.prototype.scrollUp.call(this);
    };
    Window_BattleCardSelectEnemy.prototype.select = function (index) {
      if (index < 0) return;
      Window_BattleEnemy.prototype.select.call(this, index);
      // const is_updated = this._index != index;
      // if (is_updated) {
      let enemy = this.enemy();
      BattleManager._skillWindow.refreshSelectedCard(enemy);
      const sprite = Nnfs.getSpriteFromBattler(enemy);
      // カメラが固定の場合、
      // this._cursor.x = sprite.x - sprite.width / 2;
      // this._cursor.y = sprite.y - sprite.height;
      // カメラが動く場合
      this._cursor.x = Graphics.boxWidth * 0.5;
      this._cursor.y = Graphics.boxHeight * 0.25;
      $gameTemp.setCameraTarget(sprite, 0, -sprite.height / 2);
      // }
    };
    Window_BattleCardSelectEnemy.prototype.isTouchedInsideFrame = () => true;
    Window_BattleCardSelectEnemy.prototype.isCursorMovable = function () {
      return this.isOpenAndActive();
    };
    Window_BattleCardSelectEnemy.prototype.isContentsArea = () => true;
    Window_BattleCardSelectEnemy.prototype.topIndex = () => 0;
    Window_BattleCardSelectEnemy.prototype.maxPageItems = function () {
      return this.maxItems();
    };
    Window_BattleCardSelectEnemy.prototype.maxPageRows = () => 1;
    Window_BattleCardSelectEnemy.prototype.standardPadding = () => 0;
    Window_BattleCardSelectEnemy.prototype.ensureCursorVisible = () => {};
    Window_BattleCardSelectEnemy.prototype.isCursorVisible = function () {
      return false;
    };
    Window_BattleCardSelectEnemy.prototype.itemRect = function (index) {
      const enemy_sprite = Nnfs.getSpriteFromBattler(this._enemies[index]);
      if (enemy_sprite == null) return Rectangle.emptyRectangle;
      let r = enemy_sprite.getRectangle();
      r.x += $gameTemp._cameraPos.x;
      r.y += $gameTemp._cameraPos.y;
      r.width *= $gameTemp._cameraScale;
      r.height *= $gameTemp._cameraScale;
      return r;
    };

    Window_BattleCardSelectEnemy.prototype.processTouch = function () {
      if (!this.isOpenAndActive()) return;
      if (!TouchInput.isMoved() && !TouchInput.isTriggered()) return;
      var x = this.canvasToLocalX(TouchInput.x);
      var y = this.canvasToLocalY(TouchInput.y);
      var hitIndex = this.hitTest(x, y);
      if (hitIndex < 0) return;
      if (this.index() != hitIndex) {
        this.select(hitIndex);
        SoundManager.playCursor();
      }
      // ok処理
      else if (
        TouchInput.isTriggered() &&
        this.isTouchOkEnabled() &&
        hitIndex === this.index()
      )
        this.processOk();
      // cancel処理
      else if (TouchInput.isCancelled())
        if (this.isCancelEnabled()) this.processCancel();
    };

    //==============================
    // *カードバトルシステム：敵・味方選択ウィンドウ
    //==============================
    function Window_BattleCardSelectBattler() {
      this.initialize.apply(this, arguments);
    }
    Window_BattleCardSelectBattler.prototype = Object.create(
      Window_Selectable.prototype
    );
    Window_BattleCardSelectBattler.prototype.constructor =
      Window_BattleCardSelectBattler;
    Window_BattleCardSelectBattler.prototype.drawItem = function (index) {};
    Window_BattleCardSelectBattler.prototype._refreshAllParts = function () {};
    Window_BattleCardSelectBattler.prototype._refreshBack = function () {};
    Window_BattleCardSelectBattler.prototype._refreshFrame = function () {};
    Window_BattleCardSelectBattler.prototype._refreshArrows = function () {};
    Window_BattleCardSelectBattler.prototype._refreshPauseSign = function () {};
    Window_BattleCardSelectBattler.prototype.initialize = function () {
      Window_Selectable.prototype.initialize.call(this, 0, 0);
      this._cursor = new Sprite(ImageManager.loadPicture("card_system/cursor"));
      this._cursor.anchor.x = 0.5;
      this._cursor.anchor.y = 1;
      this._cursor.bitmap.addLoadListener(
        function () {
          this._ratio = this._cursor.bitmap.height / this._cursor.bitmap.width;
        }.bind(this)
      );
      this.addChild(this._cursor);
      this._cnt = 0;
    };

    Window_BattleCardSelectBattler.prototype.show = function () {
      Window_Selectable.prototype.show.call(this);
      this.active = true; // reselect回避
      this._battlers = BattleManager.allBattleMembers();
      this._index = -1;
      this.select(0);
    };
    Window_BattleCardSelectBattler.prototype.hide = function () {
      Window_Selectable.prototype.hide.call(this);
      this.active = false; // reselect回避
      $gameTroop.select(null);
    };
    Window_BattleCardSelectBattler.prototype.update = function (index) {
      if (!this.visible) return;
      Window_Selectable.prototype.update.call(this);
      this._cursor.scale.x = Math.sin((this._cnt += 0.1));
    };

    Window_BattleCardSelectBattler.prototype.cursorDown = function () {
      this.callHandler("cursordown");
    };
    Window_BattleCardSelectBattler.prototype.cursorUp = function () {};
    Window_BattleCardSelectBattler.prototype.scrollDown = function () {
      Window_BattleCard.prototype.scrollDown.call(this);
    };
    Window_BattleCardSelectBattler.prototype.scrollUp = function () {
      Window_BattleCard.prototype.scrollUp.call(this);
    };
    Window_BattleCardSelectBattler.prototype.select = function (index) {
      if (index < 0) return;
      const is_updated = this._index != index;
      Window_Selectable.prototype.select.call(this, index);
      if (is_updated) {
        $gameTroop.select(this._battlers[index]);
        const sprite = Nnfs.getSpriteFromBattler(this._battlers[index]);
        this._cursor.x = sprite.x - sprite.width / 2;
        this._cursor.y = sprite.y - sprite.height;
        BattleManager._skillWindow.showBattlerDescWindow(sprite);
      }
    };
    Window_BattleCardSelectBattler.prototype.isTouchedInsideFrame = () => true;
    Window_BattleCardSelectBattler.prototype.isCursorMovable = function () {
      return this.isOpenAndActive();
    };
    Window_BattleCardSelectBattler.prototype.isContentsArea = () => true;
    Window_BattleCardSelectBattler.prototype.topIndex = () => 0;
    Window_BattleCardSelectBattler.prototype.maxItems = function () {
      return this._battlers.length;
    };
    Window_BattleCardSelectBattler.prototype.maxPageItems = function () {
      return this.maxItems();
    };
    Window_BattleCardSelectBattler.prototype.maxPageRows = () => 1;
    Window_BattleCardSelectBattler.prototype.maxCols = () => 2;
    Window_BattleCardSelectBattler.prototype.maxRows = () => 1;
    Window_BattleCardSelectBattler.prototype.standardPadding = () => 0;
    Window_BattleCardSelectBattler.prototype.ensureCursorVisible = () => {};
    Window_BattleCardSelectBattler.prototype.isCursorVisible = function () {
      return false;
    };
    Window_BattleCardSelectBattler.prototype.itemRect = function (index) {
      const sprite = Nnfs.getSpriteFromBattler(this._battlers[index]);
      if (sprite == null) return Rectangle.emptyRectangle;
      let r = sprite.getRectangle();
      r.x += $gameTemp._cameraPos.x;
      r.y += $gameTemp._cameraPos.y;
      r.width *= $gameTemp._cameraScale;
      r.height *= $gameTemp._cameraScale;
      return r;
    };

    Window_BattleCardSelectBattler.prototype.processTouch = function () {
      if (!this.isOpenAndActive()) return;
      if (!TouchInput.isMoved() && !TouchInput.isTriggered()) return;
      var x = this.canvasToLocalX(TouchInput.x);
      var y = this.canvasToLocalY(TouchInput.y);
      var hitIndex = this.hitTest(x, y);
      if (hitIndex < 0) return;
      if (this.index() != hitIndex) {
        this.select(hitIndex);
        SoundManager.playCursor();
      }
      // // ok処理
      // else if (TouchInput.isTriggered() && this.isTouchOkEnabled() && hitIndex === this.index())
      // 	this.processOk();
      // cancel処理
      if (TouchInput.isCancelled())
        if (this.isCancelEnabled()) this.processCancel();
    };

    //==============================
    // *カードバトルシステム：カード選択ウィンドウ
    //==============================
    function Window_BattleCardSelectCard() {
      this.initialize.apply(this, arguments);
    }
    Window_BattleCardSelectCard.prototype = Object.create(
      Window_Selectable.prototype
    );
    Window_BattleCardSelectCard.prototype.constructor =
      Window_BattleCardSelectCard;
    Window_BattleCardSelectCard.prototype.drawItem = function (index) {};
    Window_BattleCardSelectCard.prototype._refreshAllParts = function () {};
    Window_BattleCardSelectCard.prototype._refreshBack = function () {};
    Window_BattleCardSelectCard.prototype._refreshFrame = function () {};
    Window_BattleCardSelectCard.prototype._refreshArrows = function () {};
    Window_BattleCardSelectCard.prototype._refreshPauseSign = function () {};
    Window_BattleCardSelectCard.prototype.initialize = function () {
      Window_Selectable.prototype.initialize.call(
        this,
        0,
        0,
        Graphics.width,
        Graphics.height
      );
      this._cursor = new Sprite();
      this._cursor.bitmap = ImageManager.loadPicture("card_system/cursor", 90);
      this._cursor.anchor.x = 0.5;
      this._cursor.anchor.y = 0;
      this._cursor.visible = false;
      this._cursor.bitmap.addLoadListener(
        function () {
          this._ratio = this._cursor.bitmap.height / this._cursor.bitmap.width;
        }.bind(this)
      );
      SceneManager._scene.addChild(this._cursor);
      this._ratio = 0;
      this._cnt = 0;
      this._distance = 0;
      this._cards = [];
      this._baseCard = null;
      this._cardMedIdx = [];
      this._selectedStack = [];
      this._ofsEven = 0;
      this._posSelectEnd = new PIXI.Point(50, 500);
      this._systemCursorVisible = false;
      this._refFromDeckOrDiscards = false;
      // 選択終了
      this._spriteSelectEnd = new Sprite(
        ImageManager.loadPicture("card_system/ui_selectend")
      );
      this._spriteSelectEnd.x = 10;
      this._spriteSelectEnd.y = Graphics.boxHeight - 150;
      this._spriteSelectEnd.visible = false;
      SceneManager._scene.addChild(this._spriteSelectEnd);
      this.hide();
    };
    Window_BattleCardSelectCard.prototype.show = function () {
      Window_Selectable.prototype.show.call(this);
      const card_window = BattleManager._skillWindow;
      card_window._spriteBg.visible = true;
      this._baseCard = card_window.getSelectedCard();
      this._baseCardType = this._baseCard.getTargetType();
      this._index = -1;
      this.active = true;
      this._cursor.visible = true;
      let deck_or_discard = false;
      switch (this._baseCard.item().meta.id) {
        case "getfromdeck":
          this.makeSpriteList(card_window._deck_info.deck);
          deck_or_discard = true;
          break;
        case "getfromdiscard":
          this.makeSpriteList(card_window._deck_info.discards);
          deck_or_discard = true;
          break;
        default:
          this._cards = card_window._hands.filter(
            (e) => e != this._baseCard && !e.isTransformCard()
          );
          // 変身カードを消す
          const sprite_transform = card_window._hands.find((e) =>
            e.isTransformCard()
          );
          if (sprite_transform) sprite_transform._y = Graphics.boxHeight + 140;
          break;
      }
      if (deck_or_discard) {
        this._refFromDeckOrDiscards = true;
        card_window._hands
          .filter((e) => e != this._baseCard)
          .forEach((e) => e.hide());
        this._baseCard.show();
      }
      this.select(
        this._baseCardType === Window_BattleCard.SELTYPE_CARD1 ? 0 : 1
      );
      this._systemCursorVisible =
        this._baseCardType === Window_BattleCard.SELTYPE_CARDX;
      this._spriteSelectEnd.visible =
        this._baseCardType === Window_BattleCard.SELTYPE_CARDX;
      if (this._cards.length % 2) {
        this._ofsEven = 0;
        const l = this._cards.length;
        this._cardMedIdx = Array.from(new Array(l)).map(
          (v, i) => i - ~~(l / 2)
        );
      } else {
        this._ofsEven = this._baseCard.width / 2;
        const l = this._cards.length + 1;
        this._cardMedIdx = Array.from(new Array(l))
          .map((v, i) => i - ~~(l / 2))
          .filter((i) => i != 0);
      }
    };
    Window_BattleCardSelectCard.prototype.makeSpriteList = function (copyFrom) {
      for (let i = 0, l = copyFrom.length; i < l; ++i) {
        const card = BattleManager._skillWindow.getCacheCard();
        card.setup(i + 1, copyFrom[i]);
        BattleManager._skillWindow._parentCard.addChild(card.parent);
        this._cards.push(card);
        card.show();
        card._blurMultiplier = 0;
      }
    };
    Window_BattleCardSelectCard.prototype.hide = function (whenCancel) {
      Window_Selectable.prototype.hide.call(this);
      this._cursor.visible = false;
      this._spriteSelectEnd.visible = false;
      BattleManager._skillWindow._spriteBg.visible = false;
      this._selectedStack.forEach((e) => (e.opacity = 255));
      this._cards.forEach((e) => {
        e.opacity = 255;
        e._s = 1;
      });
      if (this._refFromDeckOrDiscards) {
        this._refFromDeckOrDiscards = false;
        BattleManager._skillWindow._hands.forEach((e) => e.show());
        if (!whenCancel) {
          const selected =
            0 < this._selectedStack.length
              ? this._selectedStack
              : [this.getSelectedCard()];
          selected.forEach((e) => {
            e._blurMultiplier = 0;
          });
          this._cards.forEach((e) => {
            if (!selected.includes(e)) {
              e.hide();
              e._use = false;
            }
          });
        } else {
          this._cards.forEach((e) => {
            e.hide();
            e._use = false;
          });
        }
      }
      this._cards = [];
      this._selectedStack = [];
      this._baseCard = null;
      this.active = false;
    };
    Window_BattleCardSelectCard.prototype.update = function (index) {
      if (!this.visible || !this.active) return;
      Window_Selectable.prototype.update.call(this, index);
      if (this._baseCardType === Window_BattleCard.SELTYPE_CARD1)
        this.updateTypeCard1();
      else this.updateTypeCardX();
      this._cursor.scale.x = Math.sin((this._cnt += 0.1));
      // 選択終了アニメ
      if (this.index() == 0)
        this._spriteSelectEnd.scale.set(
          Math.lerp(
            this._spriteSelectEnd.scale.x,
            Nnfs._selectEndScaleSize,
            0.2
          )
        );
      else
        this._spriteSelectEnd.scale.set(
          Math.lerp(this._spriteSelectEnd.scale.x, 1.0, 0.2)
        );
    };
    Window_BattleCardSelectCard.prototype.updateTypeCard1 = function (
      isMultiple = 0
    ) {
      if (this._baseCard) {
        this._baseCard._x = Graphics.boxWidth / 2 - this._baseCard.width / 2;
        this._baseCard._y =
          params.CardInfo._pos[1] + params.CardInfo._posOfs3 - 250;
        this._baseCard._r = 0;
      }
      const len = this._cards.length;
      const sx = 250;
      let scrx = 0;
      if (5 < len) {
        scrx = Math.max(0, this._index - 2);
      }
      for (let i = 0; i < len; ++i) {
        const card = this._cards[i];
        const m = this._cardMedIdx[i];
        card._x = sx + i * card.width - scrx * card.width;
        card._y = params.CardInfo._pos[1] + params.CardInfo._posOfs3;
        card._r = 0;
        const x = card.getPositionX();
        card.opacity = 255 * (x / 250);
        if (this._index === i + isMultiple) {
          card._s = 1.2;
          this._cursor.x = x;
          this._cursor.y = card.getPositionY() - card.height;
        } else card._s = 1;
      }
    };
    Window_BattleCardSelectCard.prototype.updateTypeCardX = function () {
      this.updateTypeCard1(1);
      for (let i = 0, l = this._selectedStack.length; i < l; ++i) {
        const card = this._selectedStack[i];
        card._r = 0;
        card._x = Graphics.boxWidth / 2 + card.width / 2 + i * 50;
        card._y = params.CardInfo._pos[1] + params.CardInfo._posOfs3 - 250;
      }
    };
    Window_BattleCardSelectCard.prototype.scrollDown = function () {
      Window_BattleCard.prototype.scrollDown.call(this);
    };
    Window_BattleCardSelectCard.prototype.scrollUp = function () {
      Window_BattleCard.prototype.scrollUp.call(this);
    };
    Window_BattleCardSelectCard.prototype.select = function (index) {
      if (index < 0) return;
      const is_updated = this._index != index;
      Window_Selectable.prototype.select.call(this, index);
      if (is_updated) {
        if (this._baseCardType === Window_BattleCard.SELTYPE_CARD1) {
          const selected_card = this.getSelectedCard();
          selected_card.updateOwnOrderTop();
          BattleManager._skillWindow.showCardDescWindow(selected_card);
        } else {
          this._cursor.visible = index != 0;
          if (this._cursor.visible) {
            const selected_card = this.getSelectedCard();
            selected_card.updateOwnOrderTop();
            BattleManager._skillWindow.showCardDescWindow(selected_card);
          }
        }
      }
    };
    Window_BattleCardSelectCard.prototype.isTouchedInsideFrame = () => true;
    Window_BattleCardSelectCard.prototype.isCursorMovable = function () {
      return this.isOpenAndActive();
    };
    Window_BattleCardSelectCard.prototype.isContentsArea = () => true;
    Window_BattleCardSelectCard.prototype.topIndex = () => 0;
    Window_BattleCardSelectCard.prototype.maxPageItems = function () {
      return this.maxItems();
    };
    Window_BattleCardSelectCard.prototype.maxPageRows = () => 1;
    Window_BattleCardSelectCard.prototype.maxCols = () => 2;
    Window_BattleCardSelectCard.prototype.standardPadding = () => 0;
    Window_BattleCardSelectCard.prototype.ensureCursorVisible = () => {};
    Window_BattleCardSelectCard.prototype.isCursorVisible = function () {
      return this._systemCursorVisible && this.index() == 0;
    };
    Window_BattleCardSelectCard.prototype.itemRect = function (index) {
      if (this._baseCardType === Window_BattleCard.SELTYPE_CARD1) {
        return this._cards[index].getRectangle();
      } else {
        if (index == 0) {
          const b = this._spriteSelectEnd.getRectangle();
          b.width *= Nnfs._selectEndScaleSize;
          b.height *= Nnfs._selectEndScaleSize;
          return b;
        }
        return this._cards[index - 1].getRectangle();
      }
    };
    Window_BattleCardSelectCard.prototype.maxItems = function () {
      if (this._baseCard == null) return 0;
      switch (this._baseCardType) {
        case Window_BattleCard.SELTYPE_CARD1:
          return this._cards.length;
        case Window_BattleCard.SELTYPE_CARDX:
          return this._cards.length + 1;
      }
    };
    Window_BattleCardSelectCard.prototype.isCurrentItemEnabled = function () {
      return !(
        this._systemCursorVisible &&
        this.index() == 0 &&
        this._selectedStack.length == 0
      );
    };
    Window_BattleCardSelectCard.prototype.getSelectedCard = function () {
      const selectable_cards = this._cards.filter((e) => e != this._baseCard);
      switch (this._baseCardType) {
        case Window_BattleCard.SELTYPE_CARD1:
          return selectable_cards[this._index];
        case Window_BattleCard.SELTYPE_CARDX:
          return selectable_cards[this._index - 1];
      }
    };
    Window_BattleCardSelectCard.prototype.getSelectedCardStack = function () {
      return this._selectedStack;
    };
    Window_BattleCardSelectCard.prototype.pushStack = function () {
      this.activate();
      const i = this.getSelectedCard();
      i.opacity = 255;
      i._s = 1;
      this._selectedStack.push(i);
      this._cards = this._cards.filter((e) => e != i);
      i.updateOwnOrderTop();
      this.select(this._cards.length == 0 ? 0 : 1);
      this.refresh();
    };
    Window_BattleCardSelectCard.prototype.popStack = function () {
      this.activate();
      const i = this._selectedStack.pop();
      this._cards.push(i);
      this._cards.sort((a, b) => a._index - b._index);
      this._cards.forEach((v) => v.updateOwnOrderTop());
      this.select(this._cards.indexOf(i) + 1);
      this.refresh();
    };
    //==============================
    // *カードバトルシステム：用語説明ウィンドウ
    //==============================
    function Sprite_Description() {
      this.initialize.apply(this, arguments);
    }
    function Sprite_Description() {
      this.initialize.apply(this, arguments);
    }
    Sprite_Description.prototype = Object.create(Sprite.prototype);
    Sprite_Description.prototype.constructor = Sprite_Description;
    // Sprite_Description.prototype.updatePadding = function() {this.padding = 5;}
    Sprite_Description.prototype.initialize = function () {
      Sprite.prototype.initialize.call(this);
      this.desc = new Sprite_Font();
      this.desc.makeFontBitmap(
        params.DescWindowParam._cardDescWindowWidth,
        200
      );
      this.desc.bitmap.fontFace = params.DescWindowParam._fontInfo[0];
      this.desc.bitmap.fontSize = +params.DescWindowParam._fontInfo[6];
      this.desc.bitmap.textColor = params.DescWindowParam._fontInfo[7];
      this.desc.bitmap.outlineWidth = +params.DescWindowParam._fontInfo[8];
      this.desc.bitmap.outlineColor = params.DescWindowParam._fontInfo[9];
      this.alpha = 0.9;
      this.addChild(this.desc);
    };
    Sprite_Description.prototype.refreshState = function (
      state,
      subject,
      x,
      y
    ) {
      this.x = x;
      this.y = y;
      this.desc.contents.clear();
      let h = 0;
      if (0 < state.iconIndex)
        this.desc.drawTextEx(
          "\\c[1]" + state.name + "\\I[" + state.iconIndex + "]",
          2,
          h
        );
      else this.desc.drawTextEx("\\c[1]" + state.name, 2, h);
      h += 22;
      let msg = state.meta.desc;
      if (msg.includes("%1"))
        msg = msg.replace(
          "%1",
          Math.round(
            Nnfs.evalDamageFormulaEx(subject, null, state.meta.formula1)
          )
        );
      if (msg.includes("%2"))
        msg = msg.replace(
          "%2",
          Math.round(
            Nnfs.evalDamageFormulaEx(subject, null, state.meta.formula2)
          )
        );
      const lines = msg.split("\n");
      for (let i = 0; i < lines.length; ++i) {
        this.desc.drawTextEx("\\c[0]" + lines[i], 2, h);
        h += 15;
      }
      this.drawFrame(params.DescWindowParam._cardDescWindowWidth, h + 10);
    };
    Sprite_Description.prototype.refreshContent = function (contents, x, y) {
      this.x = x;
      this.y = y;
      this.desc.contents.clear();
      this.desc.drawTextEx(
        "\\c[1]" + contents,
        +params.DescWindowParam._fontInfo[1],
        +params.DescWindowParam._fontInfo[2]
      );
      this.drawFrame(params.DescWindowParam._cardDescWindowWidth, 50);
    };
    Sprite_Description.prototype.drawFrame = function (w, h) {
      var pad = 0;
      var m = 4;
      // var x2 = Math.max(x, pad);
      // var y2 = Math.max(y, pad);
      var ox = 0; //x - x2;
      var oy = 0; //y - y2;
      var w2 = w; //Math.min(w, this._width - pad - x2);
      var h2 = h; //Math.min(h, this._height - pad - y2);
      this.bitmap = new Bitmap(w2, h2);
      this.setFrame(0, 0, w2, h2);
      // this.move(x2, y2);
      var skin = BattleManager._skillWindow.windowskin;
      var p = 96;
      var q = 48;
      // this.bitmap.blt(skin, p+m, p+m, q-m*2, q-m*2, ox+m, oy+m, w-m*2, h-m*2);
      this.bitmap.blt(skin, 0, 0, p, p, 0, 0, w, h);
      this.bitmap.blt(
        skin,
        p + m,
        p + 0,
        q - m * 2,
        m,
        ox + m,
        oy + 0,
        w - m * 2,
        m
      );
      this.bitmap.blt(
        skin,
        p + m,
        p + q - m,
        q - m * 2,
        m,
        ox + m,
        oy + h - m,
        w - m * 2,
        m
      );
      this.bitmap.blt(
        skin,
        p + 0,
        p + m,
        m,
        q - m * 2,
        ox + 0,
        oy + m,
        m,
        h - m * 2
      );
      this.bitmap.blt(
        skin,
        p + q - m,
        p + m,
        m,
        q - m * 2,
        ox + w - m,
        oy + m,
        m,
        h - m * 2
      );
      this.bitmap.blt(skin, p + 0, p + 0, m, m, ox + 0, oy + 0, m, m);
      this.bitmap.blt(skin, p + q - m, p + 0, m, m, ox + w - m, oy + 0, m, m);
      this.bitmap.blt(skin, p + 0, p + q - m, m, m, ox + 0, oy + h - m, m, m);
      this.bitmap.blt(
        skin,
        p + q - m,
        p + q - m,
        m,
        m,
        ox + w - m,
        oy + h - m,
        m,
        m
      );
    };
    //==============================
    // *カードバトルシステム：カードセレクトウィンドウ
    //==============================
    function Window_BattleCard() {
      this.initialize.apply(this, arguments);
    }
    Window_BattleCard.prototype = Object.create(Window_Selectable.prototype);
    Window_BattleCard.prototype.constructor = Window_BattleCard;
    Window_BattleCard.SELTYPE_NONE = 0;
    Window_BattleCard.SELTYPE_ENEMY = 1;
    Window_BattleCard.SELTYPE_CARD1 = 2;
    Window_BattleCard.SELTYPE_CARDX = 3;
    Window_BattleCard.TYPE_DECK = 4;
    Window_BattleCard.TYPE_DISCARD = 5;
    Window_BattleCard.STATE_NONE = 0;
    Window_BattleCard.STATE_WAIT = 1;
    Window_BattleCard.STATE_SELECT_CARD = 2;
    Window_BattleCard.STATE_SELECT_TARGET = 3;
    Window_BattleCard.STATE_SELECT_OPTION = 4;
    Window_BattleCard.prototype.isWaitState = function () {
      return this._state === Window_BattleCard.STATE_WAIT;
    };
    Window_BattleCard.prototype.isCardState = function () {
      return this._state === Window_BattleCard.STATE_SELECT_CARD;
    };
    Window_BattleCard.prototype.isTargetState = function () {
      return this._state === Window_BattleCard.STATE_SELECT_TARGET;
    };
    Window_BattleCard.prototype.isOptionState = function () {
      return this._state === Window_BattleCard.STATE_SELECT_OPTION;
    };
    // Window_BattleCard.prototype.isTargetHandState = function() { return this.isTargetState() && this.isLastCardTypeSelectCard(); };
    Window_BattleCard.prototype.isLastCardTypeSelectCard = function () {
      const type = this._lastTargetType;
      return (
        type == Window_BattleCard.SELTYPE_CARD1 ||
        type == Window_BattleCard.SELTYPE_CARDX
      );
    };
    Window_BattleCard.prototype.initialize = function () {
      this._hands = [];
      this._selectMainIdx = -1;
      this._excludeCardIds = [];
      this._handMedIdx = [];
      this._index = -1;
      this._cacheCards = [];
      this._adjust_by_even = 0;
      this._state = Window_BattleCard.STATE_NONE;
      this._lastTargetType = Window_BattleCard.SELTYPE_NONE;
      this._lastCardItem = null;
      this._transAddCards = [];
      this._transRemoveCards = [];
      this._tempDiscard = [1 /*value*/, 0 /*animframe*/, 1.1 /*scale*/];
      this._tempDeck = [-1 /*value*/, 0 /*animframe*/, 1.1 /*scale*/];
      this._descWindows = [];
      this._descWindowEstimatePx = 0;
      this._descWindowEstimatePx = 0;
      this._descWindowBattlerSelectIndex = -1;
      this.resetDeck();
      Window_Selectable.prototype.initialize.call(
        this,
        0,
        0,
        Graphics.boxWidth,
        Graphics.boxHeight
      );
      this.deactivate();
      // カードparent
      this._parentCard = new PIXI.Container();
      this._parentCard.update = function () {
        if (this.activate) Sprite.prototype.update.call(this);
      };
      this._spriteBg = new Sprite(ImageManager.loadPicture("card_system/bg1"));
      this._spriteBg.visible = false;
      this._spriteBg.bitmap.addLoadListener(
        function (tex) {
          this._spriteBg.scale.x = Graphics.boxWidth / tex.width;
          this._spriteBg.scale.y = Graphics.boxHeight / tex.height;
        }.bind(this)
      );
      SceneManager._scene.addChild(this._spriteBg);
      SceneManager._scene.addChild(this._parentCard);
      // 現在ターンフレーム
      this._spriteTurn = new Sprite();
      ImageManager.loadPicture("card_system/ui_turn").addLoadListener((tex) => {
        this._spriteTurn.bitmap = new Bitmap(tex.width, tex.height);
        this._spriteTurn.bitmap.bltImage(
          tex,
          0,
          0,
          tex.width,
          tex.height,
          0,
          0
        );
        Nnfs.setFont(this._spriteTurn.bitmap, params._turnFont);
        this._spriteTurn.bitmap.drawText(
          Nnfs.localization.id_battle_turn,
          20,
          20,
          this.textWidth(Nnfs.localization.id_battle_turn),
          this.lineHeight()
        );
      });
      this.addChild(this._spriteTurn);
      // 現在ターン数
      this._spriteTurnCount = new Sprite_Font();
      this._spriteTurnCount.makeFontBitmap(
        params._turnCountPos[2],
        params._turnCountPos[3]
      );
      this._spriteTurnCount.x = params._turnCountPos[0];
      this._spriteTurnCount.y = params._turnCountPos[1];
      Nnfs.setFont(this._spriteTurnCount.bitmap, params._turnCountFont);
      this._spriteTurn.addChild(this._spriteTurnCount);
      // ターンエンド
      this._spriteTurnEnd = new Sprite();
      this._spriteTurnEnd.x = 10;
      this._spriteTurnEnd.y = Graphics.boxHeight - 150;
      ImageManager.loadPicture("card_system/ui_turnend").addLoadListener(
        (tex) => {
          this._spriteTurnEnd.bitmap = new Bitmap(tex.width, tex.height);
          this._spriteTurnEnd.bitmap.bltImage(
            tex,
            0,
            0,
            tex.width,
            tex.height,
            0,
            0
          );
          Nnfs.setFont(this._spriteTurnEnd.bitmap, params._turnEndFont);
          this._spriteTurnEnd.bitmap.drawText(
            Nnfs.localization.id_battle_turnend,
            0,
            -4,
            tex.width,
            this.lineHeight(),
            "center"
          );
        }
      );
      this.addChildAt(this._spriteTurnEnd, 0);
      // デッキアイコン
      {
        const offset = 5;
        this._spriteDeck = [
          new Sprite(ImageManager.loadPicture("card_system/ui_discard")),
          new Sprite(ImageManager.loadPicture("card_system/ui_deck")),
        ];
        this._spriteDeck[0].bitmap.addLoadListener(
          function (tex) {
            this._spriteDeck[0].x = tex.width / 2 + offset;
            this._spriteDeck[0].y =
              Graphics.boxHeight - tex.height / 2 - offset;
            tex.smooth = false;
            this.drawDigitDiscard(0);
          }.bind(this)
        );
        this._spriteDeck[0].anchor.set(0.5);
        this._spriteDeck[1].bitmap.addLoadListener(
          function (tex) {
            this._spriteDeck[1].x = Graphics.boxWidth - tex.width / 2 - offset;
            this._spriteDeck[1].y =
              Graphics.boxHeight - tex.height / 2 - offset;
            tex.smooth = false;
          }.bind(this)
        );
        this._spriteDeck[1].anchor.set(0.5);
        this.addChildAt(this._spriteDeck[0], 0);
        this.addChildAt(this._spriteDeck[1], 0);
      }
      // キャラクタ立ち絵
      this._charaStand = new CharaStand();
      this.addChildAt(this._charaStand, 0);
      // mp背景
      this._spriteMpBack = new Sprite(
        ImageManager.loadPicture("card_system/ui_mpback")
      );
      this._spriteMpBack.x = Graphics.boxWidth - 80;
      this._spriteMpBack.y = Graphics.boxHeight - 162;
      this.addChildAt(this._spriteMpBack, 1);
      // 変身ゲージ
      this._spriteHeart = new Sprite(
        ImageManager.loadPicture("card_system/ui_heart")
      );
      this._spriteHeart.x = params._tensionGaugePos[0];
      this._spriteHeart.y = params._tensionGaugePos[1];
      this.addChild(this._spriteHeart);
      // 変身不可アイコン
      if ($gameSwitches.value(params._swIdStopDealTransform)) {
        this._cantTransforming = new Sprite(
          ImageManager.loadPicture("card_system/ui_cant_transform")
        );
        this._cantTransforming.x = params._tensionNgIconPos[0];
        this._cantTransforming.y = params._tensionNgIconPos[1];
        this._spriteHeart.addChild(this._cantTransforming);
      }
      if ($gameSystem._hPoint == null)
        // セーブデータになかった場合
        Nnfs.setHpoint(0);
      // 変身ゲージの数値
      this._spriteHpoint = new Sprite_Font();
      this._spriteHpoint.makeFontBitmap(
        params._tensionGaugeValuePos[2],
        params._tensionGaugeValuePos[3]
      );
      this._spriteHpoint.x = params._tensionGaugeValuePos[0];
      this._spriteHpoint.y = params._tensionGaugeValuePos[1];
      this._spriteHpoint.bitmap.fontFace = params._tensionGaugeValueFont[0];
      this._spriteHpoint.bitmap.fontSize = params._tensionGaugeValueFont[1];
      this._spriteHeart.addChild(this._spriteHpoint);
      this.refreshHPoint();
    };
    Window_BattleCard.prototype._refreshArrows = function () {};
    Window_BattleCard.prototype._refreshFrame = function () {};
    Window_BattleCard.prototype._refreshBack = function () {};
    // Window_BattleCard.prototype.loadWindowskin = function() {
    // 	this.windowskin = ImageManager.loadSystem('Window_grade');
    // };
    Window_BattleCard.prototype.show = function () {
      Window_Selectable.prototype.show.call(this);
      // this._hands.forEach(v => v.show());
      this._parentCard.visible = true;
      this._parentCard.activate = true;
      // this.refresh(true);
    };
    Window_BattleCard.prototype.hideCommand = function () {
      // this._hands.forEach(v => v.hide());
      this._parentCard.visible = false;
      this._parentCard.activate = false;
      this.closeDescWindow();
      // this.refresh(true, false);
    };

    Window_BattleCard.prototype.resetDeck = function () {
      // console.log('RESET DECK');
      if (this._deck_info == null) this._deck_info = LoadDeck();
      // 新しく追加された手札はこの時点ではまだ_idがない
      // デッキがあと1枚のときとかに、2枚引くとデッキのリセットがかかる、そのときにonceのカードが2枚手に入らないようにしてる処理
      const once_card_ids = this._hands
        .filter((e) => e._id && e.item().meta.once)
        .map((e) => e._id);
      // console.log(this._hands.map(e => e._id), once_card_ids);
      this._deck_info.deck = Array.from(default_deck_obj.deck).filter(
        (e) =>
          !this._excludeCardIds.includes(e) &&
          !this._transRemoveCards.includes(e) &&
          !once_card_ids.includes(e),
        this
      );
      // 追加カード
      this._transAddCards.forEach((e) => {
        this._deck_info.deck.push(e);
      }, this);
      this._deck_info.discards = [];
      Nnfs.shuffleArray(this._deck_info.deck);
    };

    Window_BattleCard.prototype.startTurn = function (actor) {
      this._index = -1;
      this._actor = actor;
      actor._atkUp2 = false;
      actor._atkUp2RequestEnd = false;
      this.drawDigitMp(actor.mp, actor.mmp);
      const transform_card = this._hands.find((e) => e.isTransformCard());
      if (transform_card) transform_card._index = 1;
      this.show();
      // カメラ
      $gameTemp.setCameraProp(params.CameraParam._propPlayerTurn);
      // ランプ消す
      if (this._actor._isTransform) {
        if (params._isUntransformTest) Nnfs.setHpoint(0);
        else Nnfs.addHpoint(-params._transformTurnCountDec);
        this.refreshHPoint();
        // 変身解除
        if ($gameSystem._hPoint === 0) {
          BattleManager._interpreter.setup(
            $dataCommonEvents[params._commonEventIdUntransform].list,
            0
          );
          // 山札と捨札から追加したカードを取り除く
          this._deck_info.deck = this._deck_info.deck.filter(
            (e) => !this._transAddCards.includes(e),
            this
          );
          this._deck_info.discards = this._deck_info.discards.filter(
            (e) => !this._transAddCards.includes(e),
            this
          );
          // 山札に除外したカードを追加する?
          // リセット
          this._transAddCards = [];
          this._transRemoveCards = [];
          this.drawDigitDiscard(this._deck_info.discards.length);
        }
      }
      this.drawFromDeck(
        params.CardInfo._handCount + (BattleManager._drawPlusAtFirst || 0)
      );
      BattleManager._drawPlusAtFirst = 0; //reset
      // なぜここ
      this.activate();
      // 演出
      Coroutine.pushTask(
        this._charaStand.coroutineShowChara(),
        function* () {
          // event待機
          while (BattleManager._interpreter.isRunning())
            yield Coroutine.gWaitForSeconds(0.5);
          this.active = true;
          // カード引く
          yield this.coroutineDealCards(true);
          // 追加カードを手に入れる
          yield this.coroutineDealAddCard();
          // 挿入カードを手に入れる
          yield this.coroutineDealGainCard();
          // 変身カードを手に入れる
          yield this.coroutineDealTransform();
          this._state = Window_BattleCard.STATE_SELECT_CARD;
          this.select(0 < this._hands.length ? 1 : 0);
          // spine立ち絵更新
          this._charaStand.refreshSpine(actor);
        }.bind(this)()
      );
      // SE
      if ($gameTroop._turnCount == 0)
        playVoice(Array.random(params._seVoiceBattleStart));
      else
        playVoice(
          Array.random(
            this._actor._isTransform
              ? params._seVoiceBattleActorTurnTransform
              : params._seVoiceBattleActorTurn
          )
        );
      // ターン数を更新
      this.refreshTurnCount();
    };
    // カードを使用して戻ってくるとき
    Window_BattleCard.prototype.restart = function () {
      Coroutine.pushTask(this.coroutineRestart());
    };

    Window_BattleCard.prototype.startCardAction = function () {
      const idx = this.index();
      // ターン終了
      if (idx == 0) {
        Coroutine.pushTask(this.coroutineTurnEnd());
        return;
      }
      // 手札から削除
      const card = this.getSelectedCard();
      this.discardHandByUse(card);
      // 次戻ってきたときにカーソルが光ったままになってしまう対応
      this._index = -1;
      // コモンイベント実行
      const item = card.item();
      this._lastCardItem = item;
      // アクション前？にイベントが発生してしまうので、BattleManager.startActionへ移動
      // if (item.meta.commonevent)
      // 	BattleManager._interpreter.setup($dataCommonEvents[item.meta.commonevent].list, 0);
      // カメラ
      $gameTemp.setCameraProp(params.CameraParam._propDefault);
    };

    Window_BattleCard.prototype.update = function () {
      Window_Selectable.prototype.update.call(this);
      this.update2(); // select内で呼び出したいけど、WindowSSelectable#updateは呼び出したくないから分けてる
    };
    Window_BattleCard.prototype.update2 = function () {
      // デッキスプライトのアニメーション
      if (0 < this._tempDiscard[1]) {
        --this._tempDiscard[1];
        const scale = Math.lerp(
          1,
          this._tempDiscard[2],
          this._tempDiscard[1] / 10
        );
        this._spriteDeck[0].scale.set(scale);
      }
      if (0 < this._tempDeck[1]) {
        --this._tempDeck[1];
        const scale = Math.lerp(1, this._tempDeck[2], this._tempDeck[1] / 10);
        this._spriteDeck[1].scale.set(scale);
      }
      if (!this.active) return;
      // 選択終了アニメ
      if (this.index() == 0)
        this._spriteTurnEnd.scale.set(
          Math.lerp(this._spriteTurnEnd.scale.x, Nnfs._selectEndScaleSize, 0.2)
        );
      else
        this._spriteTurnEnd.scale.set(
          Math.lerp(this._spriteTurnEnd.scale.x, 1.0, 0.2)
        );
      // 角度
      let len = this._hands.length;
      if (len === 0) return;
      let rot_ofs =
        1 < len ? params.CardInfo._rotOfsMax / this._handMedIdx[len - 1] : 0;
      let pos_ofs = params.CardInfo._posOfs;
      let px = Graphics.boxWidth / 2 + params.CardInfo._pos[0],
        py = params.CardInfo._pos[1];
      let c_idx = this.index();
      for (let i = 0; i < len; ++i) {
        const card = this._hands[i];
        const medidx = this._handMedIdx[i];
        const is_selected1 = c_idx === card._index;
        // 角度
        if (is_selected1) card._r = 0;
        else card._r = Math.deg2rad(medidx * rot_ofs);
        // 位置
        // 選択されてるカードから少し離す 後ろの方は重なるから気にしなくてよし
        let ofs_x = 0;
        if (!is_selected1 && 1 <= c_idx) {
          ofs_x = params.CardInfo._posOfs2 / Math.abs(c_idx - card._index);
          ofs_x = c_idx < card._index ? ofs_x : -ofs_x;
        }
        card._x = px + pos_ofs[2][i] + this._adjust_by_even + ofs_x;
        if (is_selected1) card._y = py + pos_ofs[1] + params.CardInfo._posOfs3;
        else card._y = py + Math.abs(medidx) * pos_ofs[1];
      }
    };

    Window_BattleCard.prototype.coroutineDealCards = function* (
      hideAllPreProp
    ) {
      this._state = Window_BattleCard.STATE_WAIT;
      this.drawDigitDeck(this._deck_info.deck.length);
      this.drawDigitDiscard(this._deck_info.discards.length);
      // 変身カードがデッキから配られる演出されると困るのでコメント
      // if (hideAllPreProp)
      // 	this._hands.forEach(v => v.hide());
      yield;
      const spos = this.posDeck();
      for (let i = 0, l = this._hands.length; i < l; ++i) {
        const card = this._hands[i];
        if (!card.parent.visible) {
          playSe(params._seCardDeal);
          card.setPosition(spos[0], spos[1]);
          card.setScale(0.1);
          card.opacity = 0;
          card._lerpT = 0.1;
          card.show();
          yield Coroutine.gLerp(0.1, (t) => (card.opacity = 255 * t));
        }
      }
      this._hands.forEach((v) => {
        v._blurMultiplier = 0;
        v._lerpT = 0.2;
      });
    };

    Window_BattleCard.prototype.coroutineTurnEnd = function* () {
      this._lastCardItem = null;
      this._lastTargetType = Window_BattleCard.SELTYPE_NONE;
      SceneManager._scene._partyCommandWindow._usedItem = false; // 次ターンでアイテム使用できるようにする
      // 特殊カード効果初期化
      const actor = BattleManager.actor();
      actor._atkUp2 = false;
      actor._atkUp2RequestEnd = false;
      BattleManager._duplicate = false;
      BattleManager._isEvent = true; // カード演出終了待機
      $gameTemp.setCameraProp(params.CameraParam._propDefault);
      for (let i = 0; i < this._hands.length; ++i) {
        if (this._hands[i].isTransformCard()) {
          this._hands[i]._y = Graphics.boxHeight + 140;
        } else this._hands[i].discard(true, false);
        yield Coroutine.gWaitForSeconds(0.1);
      }
      $gameTemp.setCameraProp(params.CameraParam._propEnemyTurn);
      BattleManager._isEvent = false;
      while (this._hands.some((e) => e.isBusy())) {
        yield;
      }
      this._hands = this._hands.filter((e) => e.isTransformCard());
      yield Coroutine.gWaitForSeconds(0.1);
      this.hide();
      this.hideCommand();
    };

    Window_BattleCard.prototype.coroutineRestart = function* () {
      // 前のアニメーションが終わるまで待機する
      while (
        BattleManager.isEventRunning() ||
        this._cacheCards.some((e) => e.isBusy())
      )
        yield Coroutine.gWaitForSeconds(0.5);
      // 敵の予測文字の再計算
      $gameTroop.members().forEach((e) => {
        e.setFutureSightTexts();
      });
      // 攻撃力2倍の効果を除去
      const actor = BattleManager.actor();
      if (actor._atkUp2RequestEnd) {
        actor._atkUp2 = false;
        actor._atkUp2RequestEnd = false;
        BattleManager._skillWindow.refreshHands();
      }
      // セックスカードの情報MP消費値を更新する

      // アクタステータスを表示
      const actor_sprite = Nnfs.getSpriteFromBattler(actor);
      if (actor_sprite._futureSightSprite)
        actor_sprite._futureSightSprite.visible = true;
      this.show();
      this._state = Window_BattleCard.STATE_SELECT_CARD;
      // this.refreshMsg(this.getSelectedCard());
      this._index = 0 < this._hands.length ? 1 : 0;
      // spine立ち絵更新
      this._charaStand.refreshSpine(BattleManager.actor());
      Coroutine.pushTask(this._charaStand.coroutineShowChara());
      $gameTemp.setCameraProp(params.CameraParam._propPlayerTurn);
      // 追加カードを手に入れる
      yield this.coroutineDealAddCard();
      // 挿入カードを手に入れる
      yield this.coroutineDealGainCard();
      // 変身カードを手に入れる
      yield this.coroutineDealTransform();
      // 変身カード使用後
      if (
        this._lastCardItem &&
        this._lastCardItem.meta.id === cardIdTransform
      ) {
        // this._state = Window_BattleCard.STATE_WAIT;
        const items = default_deck_obj.deck;
        // Hカードを全開放
        this._transAddCards = JSON.parse(
          this._lastCardItem.meta.adddeck
        ).filter((e) => !items.includes(e));
        this._transRemoveCards = JSON.parse(this._lastCardItem.meta.remdeck);
        for (let i = 0; i < this._hands.length; ++i) {
          this._hands[i].discardSilent();
        }
        this._hands = [];
        this.resetDeck();
        this.drawFromDeck(params.CardInfo._handCount);
        this.activate();
        this._index = -1;
        this._hands.forEach((v) => v.hide());
        yield this.coroutineDealCards();
        // 特定のカードがHカードに代わる
      } else this.activate(); // この中でselect処理がある
      this._state = Window_BattleCard.STATE_SELECT_CARD;
      this.select(0 < this._hands.length ? 1 : 0);
    };

    Window_BattleCard.prototype.coroutineDealAddCard = function* () {
      if (0 < BattleManager._drawPlusAtNow) {
        this.drawFromDeck(BattleManager._drawPlusAtNow);
        BattleManager._drawPlusAtNow = 0;
        this.activate();
        yield this.coroutineDealCards(false);
      }
    };

    Window_BattleCard.prototype.coroutineDealGainCard = function* () {
      if ($gameTemp.gainCard != null) {
        const new_card_item = $dataItems.find(
          (e) => e != null && e.id === $gameTemp.gainCard
        );
        $gameParty.gainItem(new_card_item, 1);
        yield this.coroutineDealNewCard(new_card_item);
        $gameTemp.gainCard = null;
      }
    };

    Window_BattleCard.prototype.coroutineDealTransform = function* () {
      if (
        this._actor._isTransform ||
        $gameSystem._hPoint < params._tensionPointMax ||
        this._hands.find((e) => e.item().meta.id === cardIdTransform) ||
        $gameSwitches.value(params._swIdStopDealTransform)
      )
        return;
      // スプライト
      const sprite = this.getCacheCard();
      this._hands.push(sprite);
      this._parentCard.addChild(sprite.parent);
      sprite.updateOwnOrderTop();
      sprite.setup(
        this._hands.length /*index=0はturnend用*/,
        $dataItems.find((e) => e != null && e.meta.id === cardIdTransform).id
      );
      sprite._activate = false;
      sprite._word.visible = false;
      this.makeHandMedIdx();
      BattleManager._skillWindow._spriteBg.visible = true;
      BattleManager._skillWindow._spriteBg.opacity = 0;
      let i = 0,
        frame = 15;
      while (i < frame) {
        const t = i++ / frame;
        BattleManager._skillWindow._spriteBg.opacity = 255 * t;
        yield;
      }
      i = 0;
      frame = 60;
      Nnfs.ParticleContainer.makeParticle(
        "Light",
        this.parent.parent,
        true,
        true,
        true,
        true,
        true
      )
        .setDuration(frame)
        .play();
      Nnfs.ParticleContainer.makeParticle(
        "ShowTransformCard",
        sprite.parent,
        true,
        true,
        false,
        true,
        true
      )
        .setDuration(frame)
        .setSizeStart(sprite.width, [sprite.height * 0.1, sprite.height])
        .setSizeEnd(sprite.width, [sprite.height * 1, sprite.height * 3])
        .play();
      Nnfs.ParticleContainer.makeParticle(
        "Kira",
        sprite.parent,
        true,
        true,
        true,
        true,
        true
      )
        .setDuration(frame)
        .setColor([128, 0, 255, 150])
        .play();
      // アニメーション
      let sprite_frame = sprite._frame;
      sprite.parent.visible = true;
      sprite.anchor.y = 1;
      sprite.setPosition(
        Graphics.boxWidth / 2,
        Graphics.boxHeight / 2 + sprite.height / 2
      );
      while (!sprite.bitmap.isReady()) yield;
      playSe(params._seCardDealNew);
      while (i < frame) {
        const t = i++ / frame;
        sprite.setFrame(
          0,
          sprite_frame.height - sprite_frame.height * t,
          sprite_frame.width,
          sprite_frame.height
        );
        yield;
      }
      i = 0;
      frame = 15;
      while (i < frame) {
        const t = i++ / frame;
        BattleManager._skillWindow._spriteBg.opacity = 255 * (1 - t);
        yield;
      }
      const p = Nnfs.ParticleContainer.makeParticle(
        "Outline",
        sprite.parent,
        true,
        true,
        false,
        true,
        true
      )
        .setTag("transform")
        .setColor([128, 0, 255, 150])
        .play();
      sprite._particleContainers.push(p);
      BattleManager._skillWindow._spriteBg.visible = false;
      sprite.anchor.y = 0.5;
      sprite._activate = true;
      sprite._blurMultiplier = 0;
      sprite._lerpT = 0.2;
      sprite._word.visible = true;
    };

    Window_BattleCard.prototype.coroutineDealNewCard = function* (newCardItem) {
      // スプライト
      const sprite = this.getCacheCard();
      this._hands.push(sprite);
      this._parentCard.addChild(sprite.parent);
      sprite.updateOwnOrderTop();
      // アイテム入手
      sprite.setup(this._hands.length /*index=0はturnend用*/, newCardItem.id);
      sprite._activate = false;
      this.makeHandMedIdx();
      BattleManager._skillWindow._spriteBg.visible = true;
      BattleManager._skillWindow._spriteBg.opacity = 0;
      let i = 0,
        frame = 15;
      while (i < frame) {
        const t = i++ / frame;
        BattleManager._skillWindow._spriteBg.opacity = 255 * t;
        yield;
      }
      i = 0;
      frame = 60;
      Nnfs.ParticleContainer.makeParticle(
        "Light",
        this.parent.parent,
        true,
        true,
        true,
        true,
        true
      )
        .setDuration(frame)
        .play();
      Nnfs.ParticleContainer.makeParticle(
        "Kira",
        sprite.parent,
        true,
        true,
        true,
        true,
        true
      )
        .setDuration(frame)
        .setColor([0, 0, 0, 150])
        .play();
      // アニメーション
      let sprite_frame = sprite._frame;
      sprite.parent.visible = true;
      let sy = -150,
        ey = Graphics.boxHeight / 2;
      sprite.setPosition(
        Graphics.boxWidth / 2,
        Graphics.boxHeight / 2 + sprite.height / 2
      );
      while (!sprite.bitmap.isReady()) yield;
      playSe(params._seCardDeal);
      while (i < frame) {
        const t = i++ / frame;
        sprite.setPositionY(
          Math.lerp(sy, ey, Nnfs.EasingFunctions.easeOutQuart(t))
        );
        yield;
      }
      i = 0;
      frame = 15;
      while (i < frame) {
        const t = i++ / frame;
        BattleManager._skillWindow._spriteBg.opacity = 255 * (1 - t);
        yield;
      }
      BattleManager._skillWindow._spriteBg.visible = false;
      sprite.anchor.y = 0.5;
      sprite._activate = true;
      sprite._blurMultiplier = 0;
      sprite._lerpT = 0.2;
      sprite._word.visible = true;
    };

    Window_BattleCard.prototype.drawFromDeck = function (count) {
      for (let i = 0; i < count; ++i) {
        let sprite = this.getCacheCard();
        this._hands.push(sprite);
        this._parentCard.addChild(sprite.parent);
        if (0 == this._deck_info.deck.length) this.resetDeck();
        sprite.setup(
          this._hands.length /*index=0はturnend用*/,
          this._deck_info.deck.pop()
        );
      }
      this.makeHandMedIdx();
    };

    Window_BattleCard.prototype.getCacheCard = function () {
      for (let i = 0, l = this._cacheCards.length; i < l; ++i) {
        const c = this._cacheCards[i];
        if (!c._use) {
          c._use = true;
          return c;
        }
      }
      // console.log("キャッシュ上限に到達");
      const sprite = new Sprite_CardItem();
      // this._cacheCards.push(sprite);
      const sprite_container = new Sprite();
      sprite_container.addChild(sprite);
      this._cacheCards.push(sprite);
      return sprite;
    };

    Window_BattleCard.prototype.makeHandMedIdx = function () {
      let len = this._hands.length;
      let med = Math.floor(len / 2);
      if (len % 2 == 0)
        this._handMedIdx = Array.from(new Array(len + 1))
          .map((v, i) => i - med)
          .filter((i) => i != 0);
      else this._handMedIdx = Array.from(new Array(len)).map((v, i) => i - med);
      // 位置オフセットの計算をここでしてしまう
      params.CardInfo._posOfs[2] = [];
      let ofsx = params.CardInfo._posOfs[0];
      for (let i = 0, x = -ofsx * med; i < len; ++i, x += ofsx)
        params.CardInfo._posOfs[2].push(x);
      this._adjust_by_even =
        len % 2 == 0 ? ((len - 1) * params.CardInfo._posOfs[0]) / len : 0;
    };

    Window_BattleCard.prototype.discardHand = function (card) {
      card.discard(true, false, card.item().meta.once);
      // 捨て札にカードが捨てられたら、ハンドを再計算
      this._hands = this._hands.filter((v) => v._index != -1);
      this._hands.forEach((v, i) => (v._index = i + 1));
      this.makeHandMedIdx();
    };
    Window_BattleCard.prototype.discardHandByUse = function (card) {
      const item = card.item();
      card.discard(false, false, item.meta.once, false);
      // 捨て札にカードが捨てられたら、ハンドを再計算
      this._hands = this._hands.filter((v) => v._index != -1);
      this._hands.forEach((v, i) => (v._index = i + 1));
      this.makeHandMedIdx();
      // 戦闘中一度のみ使えるカードを使用したか
      if (item.meta.once) {
        this._excludeCardIds.push(item.id);
      }
      // console.log(item.name, "結果", this._hands);
    };
    Window_BattleCard.prototype.discardHandByReturnDeck = function (card) {
      card.discard(false, true, card.item().meta.once, false);
      // 捨て札にカードが捨てられたら、ハンドを再計算
      this._hands = this._hands.filter((v) => v._index != -1);
      this._hands.forEach((v, i) => (v._index = i + 1));
      this.makeHandMedIdx();
      // console.log(item.name, "結果", this._hands);
    };

    Window_BattleCard.prototype.transforming = function (item) {};

    Window_BattleCard.prototype.posDiscard = function () {
      return [this._spriteDeck[0].x, this._spriteDeck[0].y];
    };
    Window_BattleCard.prototype.posDeck = function () {
      return [this._spriteDeck[1].x, this._spriteDeck[1].y];
    };
    Window_BattleCard.prototype.getSelectedCard = function () {
      let index = this.index();
      if (index <= 0) return null;
      return this._hands[index - 1];
    };
    Window_BattleCard.prototype.getSelectedCardType = function () {
      return this.getSelectedCard().getTargetType();
    };

    Window_BattleCard.prototype.item = function () {
      let sprite = this.getSelectedCard();
      if (null == sprite) return null;
      return sprite.item();
    };

    Window_BattleCard.prototype.isOpenAndActive = function () {
      return (
        this._state === Window_BattleCard.STATE_SELECT_CARD &&
        Window_Selectable.prototype.isOpenAndActive.call(this)
      );
    };

    Window_BattleCard.prototype.isEnabled = function (card) {
      if (
        this._actor &&
        /*this._actor.canUse(item) && */ card != null &&
        card._cost <= this._actor.mp
      ) {
        switch (card.item().meta.id) {
          case "hold":
          case "cost0":
          case "mpupbydiscard":
            return 2 <= this._hands.length;
          case "getfromdeck":
            return 0 < this._deck_info.deck.length;
          case "getfromdiscard":
            return 0 < this._deck_info.discards.length;
          case "duplicate":
            return !BattleManager._duplicate;
          case "mpattack":
          case "mpshield":
            return 0 < this._actor.mp;
          case "hpointup1":
            return !this._actor._isTransform;
          default:
            return true;
        }
      }
      return false;
    };

    Window_BattleCard.prototype.isCurrentItemEnabled = function () {
      return 0 == this.index() || this.isEnabled(this.getSelectedCard());
    };
    Window_BattleCard.prototype.maxItems = function () {
      return this._hands.length + 1;
    };
    Window_BattleCard.prototype.maxPageItems = function () {
      return this._hands.length + 1;
    };
    Window_BattleCard.prototype.maxPageRows = () => 1;
    Window_BattleCard.prototype.maxCols = function () {
      return this._hands.length + 1;
    };
    Window_BattleCard.prototype.topIndex = () => 0;
    Window_BattleCard.prototype.isCursorVisible = function () {
      return (
        0 == this.index() && this._state === Window_BattleCard.STATE_SELECT_CARD
      );
    };
    Window_BattleCard.prototype.isCursorMovable = function () {
      return this.isOpenAndActive();
    };
    Window_BattleCard.prototype.updateArrows = () => {};
    Window_BattleCard.prototype.standardPadding = () => 0;
    Window_BattleCard.prototype.ensureCursorVisible = () => {};
    // Window_BattleCard.prototype.updateCursor = () => {};
    Window_BattleCard.prototype.itemRect = function (index) {
      // ターン終了ボタン
      if (index === 0) {
        const b = this._spriteTurnEnd.getRectangle();
        b.width *= Nnfs._selectEndScaleSize;
        b.height *= Nnfs._selectEndScaleSize;
        return b;
      }
      // カード
      else {
        const card = this._hands[index - 1];
        const x = card.getPositionX();
        const y = card.getPositionY();
        return new Rectangle(
          x - card.anchor.x * card.width,
          y - card.anchor.y * card.height,
          card.width,
          card.height
        );
      }
    };

    Window_BattleCard.prototype.drawDigitDiscard = function (n) {
      if (this._tempDiscard[0] !== n) {
        this._tempDiscard[0] = n;
        this._tempDiscard[1] = 10;
        const x = this._spriteDeck[0].x,
          y = this._spriteDeck[0].y;
        this.contents.clearRect(x - 20, y - 24, 50, 40);
        ImageManager.loadPicture("card_system/status_n2").addLoadListener(
          function (tex) {
            Nnfs.drawDigit(this.contents, tex, n, x + 4, y + 16, 28);
          }.bind(this)
        );
        playSe("card_system_deal2");
      }
    };
    Window_BattleCard.prototype.drawDigitDeck = function (n) {
      if (this._tempDeck[0] !== n) {
        this._tempDeck[0] = n;
        this._tempDeck[1] = 10;
        ImageManager.loadPicture("card_system/status_n2").addLoadListener(
          function (tex) {
            const x = this._spriteDeck[1].x,
              y = this._spriteDeck[1].y;
            this.contents.clearRect(x - 30, y - 24, 50, 40);
            Nnfs.drawDigit(this.contents, tex, n, x - 4, y + 16, 28);
          }.bind(this)
        );
      }
    };
    Window_BattleCard.prototype.drawDigitMp = function (mp, mmp) {
      this._hands.forEach((e) => e.refreshCostAndNg(), this);
      bitmap2 = ImageManager.loadPicture("card_system/status_n2");
      bitmap3 = ImageManager.loadPicture("card_system/status_n3");
      const x = this._spriteMpBack.x,
        y = this._spriteMpBack.y;
      const contents = this.contents;
      bitmap2.addLoadListener(function () {
        bitmap3.addLoadListener(
          function () {
            contents.clearRect(x - 30, y - 30, 120, 80, 0xfffffff);
            Nnfs.drawDigit(contents, bitmap3, mp, x, y + 45, 28);
            Nnfs.drawDigitSlash(contents, bitmap2, x + 20, y + 45, 28);
            Nnfs.drawDigit(contents, bitmap2, mmp, x + 55, y + 45, 28);
          }.bind(this)
        );
      });
    };

    Window_BattleCard.prototype.refreshSelectedCard = function (target) {
      if (this._actor == null) return;
      const card = this.getSelectedCard();
      if (card) {
        card.refresh(target);
      }
    };
    Window_BattleCard.prototype.refreshHPoint = function () {
      const s = this._spriteHeart;
      s.bitmap.addLoadListener(function (tex) {
        const w = tex.width / (params._tensionPointMax + 1);
        // const sx = Math.round($gameSystem._hPoint/(params._tensionPointMax/4));
        s.setFrame(w * $gameSystem._hPoint, 0, w, tex.height);
      });
      this._spriteHpoint.bitmap.clear();
      this._spriteHpoint.drawTextEx($gameSystem._hPoint.toString(), 0, 0);
    };

    Window_BattleCard.prototype.refreshTurnCount = function () {
      this._spriteTurnCount.bitmap.clear();
      this._spriteTurnCount.drawTextEx(
        ($gameTroop._turnCount + 1).toString(),
        0,
        0
      );
    };

    Window_BattleCard.prototype.refreshHands = function () {
      this._hands.forEach((e) => e.refresh());
    };

    Window_BattleCard.prototype.processTouch = function () {
      if (!this.isOpenAndActive()) return;
      // 最初のアニメーション中は選択させない
      if (!this.isCardState()) this.updateMouse();
      if (!TouchInput.isMoved() && !TouchInput.isTriggered()) return;
      var x = this.canvasToLocalX(TouchInput.x);
      var y = this.canvasToLocalY(TouchInput.y);
      var hitIndex = this.hitTest(x, y);
      if (hitIndex < 0) {
        // actor hitting
        let sprite = BattleManager._spriteset._actorSprites[0];
        // 反転してるからしらんがpivotが右下
        let left = sprite.x - sprite.width;
        let up = sprite.y - sprite.height;
        let is_hit = false;
        if (
          Nnfs.isContainsPointFromRect(
            x,
            y,
            left,
            up,
            sprite.width,
            sprite.height,
            sprite.width * 0.2,
            sprite.height * 0.2
          )
        ) {
          is_hit = true;
          // 初回ヒット
          if (this._descWindowBattlerSelectIndex != 0) {
            this._descWindowBattlerSelectIndex = 0;
            this.showBattlerDescWindow(sprite);
          }
          return;
        }
        // enemies hitting
        for (
          let i = 0, l = BattleManager._spriteset._enemySprites.length;
          i < l;
          ++i
        ) {
          sprite = BattleManager._spriteset._enemySprites[i];
          // 反転してるからしらんがpivotが右下
          left = sprite.x - sprite.width;
          up = sprite.y - sprite.height;
          if (
            Nnfs.isContainsPointFromRect(
              x,
              y,
              left,
              up,
              sprite.width,
              sprite.height,
              sprite.width * 0.2,
              sprite.height * 0.2
            )
          ) {
            is_hit = true;
            // 初回ヒット
            if (this._descWindowBattlerSelectIndex != 0) {
              this._descWindowBattlerSelectIndex = i + 1;
              this.showBattlerDescWindow(sprite);
            }
            return;
          }
        }
        // どこにもヒットしなかった
        if (!is_hit) {
          if (this._descWindowBattlerSelectIndex != -1) {
            this._descWindowBattlerSelectIndex = -1;
            this.closeDescWindow();
            const selected_card = this.getSelectedCard();
            if (selected_card) this.showCardDescWindow(selected_card);
          }
        }
        return;
      }
      if (this.index() != hitIndex) {
        if (this._descWindowBattlerSelectIndex != -1) {
          this._descWindowBattlerSelectIndex = -1;
          this.closeDescWindow();
          const selected_card = this.getSelectedCard();
          if (selected_card) this.showCardDescWindow(selected_card);
        }
        this.select(hitIndex);
        SoundManager.playCursor();
      }
      // ok処理
      else if (
        TouchInput.isTriggered() &&
        this.isTouchOkEnabled() &&
        hitIndex === this.index()
      )
        this.processOk();
      // cancel処理
      else if (TouchInput.isCancelled())
        if (this.isCancelEnabled()) this.processCancel();
    };

    var wheel_cnt = 0;
    var wheel_cnt_max = 2;
    Window_BattleCard.prototype.cursorDown = function (wrap) {};
    Window_BattleCard.prototype.cursorUp = function (wrap) {
      this.callHandler("cursorup");
    };
    Window_BattleCard.prototype.scrollDown = function () {
      if (wheel_cnt_max < ++wheel_cnt && 0 == (wheel_cnt = 0)) {
        this.cursorLeft(true);
        SoundManager.playCursor();
      }
    };
    Window_BattleCard.prototype.scrollUp = function () {
      if (wheel_cnt_max < ++wheel_cnt && 0 == (wheel_cnt = 0)) {
        this.cursorRight(true);
        SoundManager.playCursor();
      }
    };

    Window_BattleCard.prototype.select = function (index) {
      Window_Selectable.prototype.select.call(this, index);
      // if (this._charaStand) {
      // 	this._charaStand.refreshMsg(this.getSelectedCard());
      // }
      // 前面に出す
      this._hands.forEach((v, i) => v.setOrderIndex(i));
      if (0 < this._index) {
        const selected_card = this.getSelectedCard();
        selected_card.updateOwnOrderTop();
        this.update2();
        this.showCardDescWindow(selected_card);
      } else this.closeDescWindow();
    };

    Window_BattleCard.prototype.showCardDescWindow = function (spriteCard) {
      const item = spriteCard.item();
      this.closeDescWindow();
      if (item.meta.desc == null) {
        return;
      }
      var state_ids = Nnfs._itemMetaDescCaches[item.id];
      if (!state_ids) {
        Nnfs._itemMetaDescCaches[item.id] = state_ids = JSON.parse(
          item.meta.desc
        );
        // console.log("cache created:", item.id);
      }
      const px =
        spriteCard._x < Graphics.boxWidth / 2
          ? spriteCard._x + params.DescWindowParam._cardDescWindowOffset[0]
          : spriteCard._x -
            params.DescWindowParam._cardDescWindowOffset[0] -
            params.DescWindowParam._cardDescWindowWidth;
      let py = spriteCard._y + params.DescWindowParam._cardDescWindowOffset[1];
      let subject = BattleManager.actor();
      state_ids.forEach((e, i) => {
        const state = $dataStates[e];
        const w = this.makeDescWindowSpriteIfNeeded();
        w.refreshState(state, subject, px, py);
        py += w.height;
      }, this);
      let last = this._descWindows[this._descWindows.length - 1];
      // 画面はみ出したら
      if (Graphics.boxHeight < py) {
        py = Graphics.boxHeight;
        for (let i = this._descWindows.length - 1; 0 <= i; --i) {
          py -= this._descWindows[i].height;
          this._descWindows[i].y = py;
        }
      }
    };
    Window_BattleCard.prototype.showBattlerDescWindow = function (
      battlerSprite
    ) {
      this.closeDescWindow();
      const battler = battlerSprite._battler;
      let px = battlerSprite.x;
      let py = battlerSprite.y - battlerSprite.height;
      if (battler.isActor()) {
        const data = battler.actor();
        px = data.meta.stateDescPosX
          ? battlerSprite.x + +data.meta.stateDescPosX
          : battlerSprite.x -
            battlerSprite.width * 0.5 -
            params.DescWindowParam._cardDescWindowWidth;
        py = data.meta.stateDescPosY
          ? battlerSprite.y + +data.meta.stateDescPosY
          : battlerSprite.y - battlerSprite.height;
      } else if (battler.isEnemy) {
        var data = battler.enemy();
        px = data.meta.stateDescPosX
          ? battlerSprite.x + +data.meta.stateDescPosX
          : battlerSprite.x;
        py = data.meta.stateDescPosY
          ? battlerSprite.y + +data.meta.stateDescPosY
          : battlerSprite.y - battlerSprite.height;
      }
      let has_state = false;
      battler._states.forEach((id) => {
        const state = $dataStates[id];
        if (!state.meta.desc) return;
        has_state = true;
        const w = this.makeDescWindowSpriteIfNeeded();
        w.refreshState(state, battler, px, py);
        py += w.height;
      });
      if (!has_state) {
        this.makeDescWindowSpriteIfNeeded().refreshContent(
          Nnfs.localization.id_empty_state,
          px,
          py
        );
      }
    };
    Window_BattleCard.prototype.closeDescWindow = function () {
      this._descWindows.forEach((e) => {
        e.visible = false;
      });
    };
    Window_BattleCard.prototype.makeDescWindowSpriteIfNeeded = function () {
      for (let i = 0, l = this._descWindows.length; i < l; ++i) {
        let w = this._descWindows[i];
        if (!w.visible) {
          w.visible = true;
          return w;
        }
      }
      let w = new Sprite_Description();
      this._descWindows.push(w);
      SceneManager._scene.addChild(w);
      return w;
    };

    //==============================
    // *カードバトルシステム：キャラクタ立ち絵
    //==============================
    function CharaStand() {
      this.initialize.apply(this, arguments);
    }
    CharaStand.prototype = Object.create(PIXI.Container.prototype);
    CharaStand.prototype.constructor = CharaStand;
    CharaStand.prototype.initialize = function () {
      PIXI.Container.call(this);
      this._spine = new PIXI.spine.Spine(
        Makonet.MpiShowSpine.spineData[params.CharaImageParam._spineName]
      );
      this._spine.scale.set(params.CharaImageParam._scaleChara);
      // this._spine.state.setAnimation(0, params.CharaImageParam._animations[0], false);
      this._spine.visible = false;
      this._spine.alpha = 0;
      this._spine.x = params.CharaImageParam._posChara[0];
      this._spine.y = params.CharaImageParam._posChara[1];
      if (params.CharaImageParam._antialias) {
        PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
        this._spine.filters = [new PIXI.filters.FXAAFilter()];
      }
      this.addChild(this._spine);
      // 吹き出し
      // this._msgBox = new Sprite(ImageManager.loadPicture('card_system/msgbox'));
      // this._msgBox.visible = false;
      // this._msgBox.opacity = 0;
      // this.addChild(this._msgBox);
      // this._msg = new Sprite_Font();
      // this._msg.makeFontBitmap(params.CharaImageParam._posCharaMsg[2], params.CharaImageParam._posCharaMsg[3]);
      // this._msg.bitmap.fontSize = params.CharaImageParam._fontSizeCharaMsg;
      // this._msg.x = params.CharaImageParam._posCharaMsg[0];
      // this._msg.y = params.CharaImageParam._posCharaMsg[1];
      // this._msgBox.addChild(this._msg);
      this._charaState = 0;
    };
    CharaStand.prototype.refreshSpine = function (actor) {
      // skin
      const hp_ratio = actor.hp / actor.mhp;
      const skins = actor._isTransform
        ? params.CharaImageParam._skinsTransform
        : params.CharaImageParam._skinsNormal;
      if (0.6 <= hp_ratio)
        Makonet.MpiShowSpine.setSkinEx(this._spine, skins[0]);
      else if (0.3 <= hp_ratio)
        Makonet.MpiShowSpine.setSkinEx(this._spine, skins[1]);
      else Makonet.MpiShowSpine.setSkinEx(this._spine, skins[2]);
      this._spine.skeleton.setSlotsToSetupPose();
      // attachment
      const trunk_ratio = actor.trunk() / 100;
      let anim_and_atcm_set = null;
      if (1 <= trunk_ratio)
        anim_and_atcm_set = actor._isTransform
          ? params.CharaImageParam._animAndAtcmSetTransform100
          : params.CharaImageParam._animAndAtcmSetNormal100;
      else if (0.7 <= trunk_ratio)
        anim_and_atcm_set = actor._isTransform
          ? params.CharaImageParam._animAndAtcmSetTransform70
          : params.CharaImageParam._animAndAtcmSetNormal70;
      else if (0.5 <= trunk_ratio)
        anim_and_atcm_set = actor._isTransform
          ? params.CharaImageParam._animAndAtcmSetTransform50
          : params.CharaImageParam._animAndAtcmSetNormal50;
      else if (0.3 <= trunk_ratio)
        anim_and_atcm_set = actor._isTransform
          ? params.CharaImageParam._animAndAtcmSetTransform30
          : params.CharaImageParam._animAndAtcmSetNormal30;
      else
        anim_and_atcm_set = actor._isTransform
          ? params.CharaImageParam._animAndAtcmSetTransform0
          : params.CharaImageParam._animAndAtcmSetNormal0;
      let r = Math.randomRangeInt(anim_and_atcm_set.length / 2);
      let anim = anim_and_atcm_set[r * 2];
      let atcm = anim_and_atcm_set[r * 2 + 1];
      // animation
      if (this._overrideAnimName) anim = this._overrideAnimName;
      // console.log("立ち絵アニメーション更新:", anim, atcm);
      Makonet.MpiShowSpine.setAnimation(this._spine, anim, false);
      Makonet.MpiShowSpine.setAttachmentFromSet(this._spine, atcm);
    };
    // CharaStand.prototype.refreshMsg = function(card) {
    // 	if (this._msgBox == null)
    // 		return;
    // 	const bitmap = this._msg.bitmap;
    // 	bitmap.clear();
    // 	// bitmap.textColor = this.normalColor();
    // 	if (card == null) {
    // 		this._msgBox.visible = false;
    // 	}
    // 	else {
    // 		const item = card.item();
    // 		let d = item.meta.msg;
    // 		if (d != null) {
    // 			this._msgBox.visible = true;
    // 			this._msg.drawTextEx(d, 0, 0);
    // 		}
    // 	}
    // };
    CharaStand.prototype.coroutineShowChara = function* () {
      this._spine.visible = true;
      let i = 0;
      const frame = 13;
      while (i < 13) {
        const t = i / frame;
        this._spine.x = Math.lerp(
          this._spine.x,
          params.CharaImageParam._posChara[2],
          0.2
        );
        this._spine.y = Math.lerp(
          this._spine.y,
          params.CharaImageParam._posChara[3],
          0.2
        );
        this._spine.alpha = Math.min(this._spine.alpha + 0.1, 1);
        ++i;
        yield;
      }
      // i = 0;
      // while (i < 13) {
      // 	const t = i / frame;
      // 	this._msgBox.opacity += 20;
      // 	++i;
      // 	yield;
      // }
    };

    CharaStand.prototype.coroutineHideChara = function* () {
      let i = 0;
      const frame = 13;
      while (i < 13) {
        const t = i / frame;
        this._spine.x = Math.lerp(
          this._spine.x,
          params.CharaImageParam._posChara[0],
          0.2
        );
        this._spine.y = Math.lerp(
          this._spine.y,
          params.CharaImageParam._posChara[1],
          0.2
        );
        this._spine.alpha = Math.max(this._spine.alpha - 0.1, 0);
        // this._msgBox.opacity -= 20;
        ++i;
        yield;
      }
      this._spine.visible = false;
      // this._msgBox.visible = false;
    };

    //==============================
    // *カードバトルシステム：カードアイテム
    //==============================
    // 	var shaderFrag = `
    //   precision mediump float;
    //   varying vec2 vTextureCoord;
    //   uniform sampler2D uSampler;
    //   uniform float time;
    //   uniform vec3 color;
    //   void main(void) {
    // 	vec4 color = texture2D(uSampler, vTextureCoord) + vec4(color.r, time, 1, 1);
    // 	gl_FragColor = color;
    //   }
    // `;
    function Sprite_CardItem() {
      this.initialize.apply(this, arguments);
    }
    Sprite_CardItem.prototype = Object.create(Sprite.prototype);
    Sprite_CardItem.prototype.constructor = Sprite_CardItem;
    Sprite_CardItem.prototype.setPosition = function (x, y = x) {
      this.parent.x = x;
      this.parent.y = y;
    };
    Sprite_CardItem.prototype.setPositionX = function (a) {
      this.parent.x = a;
    };
    Sprite_CardItem.prototype.setPositionY = function (a) {
      this.parent.y = a;
    };
    Sprite_CardItem.prototype.getPosition = function () {
      return new PIXI.Point(this.parent.x, this.parent.y);
    };
    Sprite_CardItem.prototype.getPositionX = function () {
      return this.parent.x;
    };
    Sprite_CardItem.prototype.getPositionY = function () {
      return this.parent.y;
    };
    Sprite_CardItem.prototype.setScale = function (x, y = x) {
      this.parent.scale.set(x, y);
    };
    Sprite_CardItem.prototype.getScale = function () {
      return this.parent.scale.set(x, y);
    };
    Sprite_CardItem.prototype.setRotation = function (r) {
      this.parent.rotation = r;
    };
    Sprite_CardItem.prototype.getRotation = function (r) {
      return this.parent.rotation;
    };
    Sprite_CardItem.prototype.getRectangle = function () {
      return new Rectangle(
        this.parent.x - this.anchor.x * this.width,
        this.parent.y - this.anchor.y * this.height,
        this.width,
        this.height
      );
    };

    Sprite_CardItem.prototype.initialize = function () {
      Sprite.prototype.initialize.call(this);
      this.anchor.x = 0.5;
      this.anchor.y = 0.5;
      this._s = 1;
      this._r = 0;
      this._x = 0;
      this._y = 0;
      this._word = new Sprite_Font();
      this._word.anchor.x = 0.5;
      this._word.anchor.y = 0.5;
      this.addChild(this._word);
      this._ng = new Sprite();
      this._ng.bitmap = ImageManager.loadPicture("card_system/ng");
      this._ng.anchor.x = 0.5;
      this._ng.anchor.y = 0.5;
      this._ng.visible = false;
      this.addChild(this._ng);
      this._use = false;
      this._activate = false;
      this._isBusy = false;
      this._blur = new PIXI.filters.BlurFilter();
      // this._blur = new PIXI.filters.MotionBlurFilter();
      // console.log(PIXI.filters);
      // this._blur.velocity.set(10, 10);
      // this._blur.offset = 10;
      this._blur.blurX = 0;
      this._blur.blurY = 0;
      // this.filters = [new Filter_Controller.filterNameMap.glow(15, 3, 1, 0xff0000, 1), this._blur];
      this.filters = [this._blur];
      // this.filterArea = new PIXI.Rectangle(0, 0, 1024, 1024);
      this._prev = new PIXI.Point();
      this._blurMultiplier = 1;
      this._lerpT = 0.2;
      this._particleContainers = [];
      this._resetBitmap = false;
    };

    Sprite_CardItem.prototype.show = function () {
      this.parent.visible = true;
      this._activate = true;
    };
    Sprite_CardItem.prototype.hide = function () {
      this.parent.visible = false;
      this._activate = false;
    };

    Sprite_CardItem.prototype.setup = function (index, id) {
      const item = $dataItems[id];
      this.hide();
      this.visible = true;
      this._index = index;
      this._cost = Math.max(0, item.meta.cost);
      let aa = BattleManager.actor();
      this._value1 = item.meta.formula1
        ? Math.round(Nnfs.evalDamageFormulaEx(aa, item, item.meta.formula1))
        : 0;
      this._value2 =
        item.meta.formula2 != null
          ? Math.round(Nnfs.evalDamageFormulaEx(aa, item, item.meta.formula2))
          : 0;
      this._use = true;
      this._selectedMain = false;
      this._selectedSub = false;
      this.setScale(1);
      this.setRotation((this._r = 0));
      this._blurMultiplier = 1;
      this._duplicate = false;
      this._ng.visible = false;
      if (this._id !== id || this._resetBitmap) {
        this._id = id;
        const tex = LoadCard("card" + id);
        tex.addLoadListener(
          function () {
            const w = tex.width;
            const h = tex.height;
            if (this.bitmap == null) {
              this.bitmap = new Bitmap(w, h);
              this.bitmap.smooth = true;
            } else this.bitmap.clear();
            this.bitmap.bltImage(tex, 0, 0, w, h, 0, 0);
            // nameの変更はないので初期化時に書き込み
            const fontinfo = params.CardInfo._fontInfoName;
            this.bitmap.fontFace = fontinfo[0];
            // const name_len = item.name.length;
            // const size = name_len < 9 ? 14 : 14-(name_len-8);
            this.bitmap.fontSize = +fontinfo[6];
            this.bitmap.textColor = fontinfo[7];
            this.bitmap.outlineWidth = +fontinfo[8];
            this.bitmap.outlineColor = fontinfo[9];
            this.bitmap.drawText(
              item.name,
              +fontinfo[1],
              +fontinfo[2],
              +fontinfo[3],
              +fontinfo[4],
              fontinfo[5]
            );
            // 文字系
            if (this._word.bitmap == null) {
              this._word.makeFontBitmap(w, h);
            }
            this.refresh();
          }.bind(this)
        );
      } else {
        this.refresh(); // 前と同じカードが配られても、ng画像について更新したい。リサイクルでNGが表示されないバグがあった。
      }
    };

    Sprite_CardItem.prototype.update = function () {
      Sprite.prototype.update.call(this);
      if (!this._activate) {
        return;
      }
      this.setPosition(
        Math.lerp(this.parent.x, this._x, this._lerpT),
        Math.lerp(this.parent.y, this._y, this._lerpT)
      );
      this.setRotation(Math.lerp(this.getRotation(), this._r, this._lerpT));
      this.setScale(Math.lerp(this.parent.scale.x, this._s, this._lerpT));
      this._blur.blurX =
        Math.abs(this.parent.x - this._prev.x) * this._blurMultiplier;
      this._blur.blurY =
        Math.abs(this.parent.y - this._prev.y) * this._blurMultiplier;
      this._prev.x = this.parent.x;
      this._prev.y = this.parent.y;
    };

    Sprite_CardItem.prototype.discard = function (
      isTurnEnd,
      isReturnDeck,
      isOnce,
      isStartPositionStay
    ) {
      this._isBusy = true;
      Coroutine.pushTask(
        this.coroutineDiscard(
          isTurnEnd,
          isReturnDeck,
          isOnce,
          isStartPositionStay
        )
      );
      if (
        isTurnEnd ||
        isReturnDeck ||
        !BattleManager._duplicate ||
        this.isTransformCard()
      ) {
        // this._use = false; useは手札捨てるアニメーション終わってからfalseにして、キャッシュで取得されないように管理する
        this._index = -1;
      }
    };
    Sprite_CardItem.prototype.discardSilent = function () {
      this._use = false;
      this._index = -1;
      this.hide();
      this._particleContainers.forEach((v) => v.destroy());
      this._particleContainers = [];
    };

    Sprite_CardItem.prototype.coroutineDiscard = function* (
      isTurnEnd,
      isReturnDeck,
      isOnce,
      isStartPositionStay
    ) {
      this._activate = false;
      this.setRotation(0);
      let pos = this.getPosition();
      let sx = pos.x,
        sy = pos.y;
      let ex = Graphics.boxWidth * 0.82,
        ey = Graphics.boxHeight * 0.8;
      const skill_window = BattleManager._skillWindow;
      let type_is_select = skill_window.isLastCardTypeSelectCard();
      /*if (isStartPositionStay) {
				ex = this._x;
				ey = this._y;
			}
			else*/ if (type_is_select) {
        ex += isReturnDeck ? this.width / 2 : -this.width / 2;
        ey = params.CardInfo._pos[1] + params.CardInfo._posOfs3 - 250;
      }
      let i = 0,
        frame = 20;
      let duplicate = BattleManager._duplicate;
      this._blurMultiplier = 1;
      this._particleContainers.forEach((v) => {
        if (v) v.stop();
        // v.rotation = this.getRotation();
      }, this);
      // 移動
      if (!isTurnEnd && !type_is_select) {
        while (i < frame) {
          // const t = i / frame;
          pos = this.getPosition();
          this.setPosition(
            Math.lerp(pos.x, ex, 0.2),
            Math.lerp(pos.y, ey, 0.2)
          );
          ++i;
          yield;
        }
        i = 0;
        frame = 60;
        while (i < frame) {
          const t = i / frame;
          pos = this.getPosition();
          this.setPosition(
            Math.lerp(pos.x, ex, 0.1453 * t),
            Math.lerp(pos.y, ey, 0.1 * t)
          );
          ++i;
          yield;
        }
      }
      if (!isTurnEnd) {
        // 効果が終わるまで待機
        // Battlemanager._phaseはBattleManager.endActionで更新される。
        while (BattleManager._phase !== "input") {
          // console.log(BattleManager._phase, BattleManager._skillWindow.active);
          yield;
        }
        // console.log(BattleManager._phase);
      }
      // エフェクト削除
      this._particleContainers.forEach((v) => v.destroy());
      this._particleContainers = [];
      // 手札に戻る
      if (!isTurnEnd && !isReturnDeck && duplicate && !this.isTransformCard()) {
        BattleManager._duplicate = false;
        this._duplicate = true;
        this._cost = 0;
        this.refresh();
        yield Coroutine.gWaitForSeconds(1);
        this._blurMultiplier = 0;
        this._activate = true;
      }
      // 消える
      else if (isOnce) {
        pos = this.getPosition();
        i = 0;
        frame = 100;
        const sy = pos.y;
        const ofsy = -200;
        this._resetBitmap = true;
        this.parent.visible = false;
        const fragments = new FragmentParent(LoadCard("card" + this._id), 32);
        skill_window._parentCard.addChild(fragments);
        fragments.x = this.getPositionX();
        fragments.y = this.getPositionY();
        const c = Nnfs.ParticleContainer.makeParticle(
          "Blast",
          skill_window._parentCard,
          true,
          true,
          true,
          true,
          true
        )
          .setColor([255, 0, 0, 128])
          .play();
        c.x = this.getPositionX();
        c.y = this.getPositionY();
        playSe(params._seCardCrack);
        yield Coroutine.gWaitForSeconds(0.5);
        playSe(params._seCardBreak);
        yield Coroutine.gWaitForSeconds(0.25);
        this.discardSilent();
      } else {
        // 捨て札へGO
        i = 0;
        frame = 20;
        const spos = this.getPosition();
        const epos = isReturnDeck
          ? skill_window.posDeck()
          : skill_window.posDiscard();
        const erad = isReturnDeck ? 0 : Math.PI;
        const ofsy = Math.abs(parent.y - epos[1]);
        const r = Math.abs(sx - epos[0]);
        while (i < frame) {
          const t = i / frame;
          let rad = Math.lerp(Math.PI * 0.5, erad, t);
          let xx = epos[0]; //sx2 + Math.cos(rad) * r;
          let yy = epos[1] - Math.sin(rad) * r;
          this.setPosition(Math.lerp(spos.x, xx, t), Math.lerp(spos.y, yy, t));
          this.setScale(Math.lerp(1, 0.3, t));
          this.setRotation(t * 10);
          ++i;
          yield;
        }
        if (isReturnDeck) {
          skill_window._deck_info.deck.push(this._id);
          skill_window.drawDigitDeck(skill_window._deck_info.deck.length);
        } else {
          skill_window._deck_info.discards.push(this._id);
          skill_window.drawDigitDiscard(
            BattleManager._skillWindow._deck_info.discards.length
          );
        }

        this.discardSilent();
      }
      // BattleManager._skillWindow.refresh(true);
      this._coroutine = null;
      this._isBusy = false;
    };

    Sprite_CardItem.prototype.returnHandLastCard = function () {
      Coroutine.pushTask(this.coroutineReturnHandLastCard());
      this._isBusy = true;
    };

    Sprite_CardItem.prototype.coroutineReturnHandLastCard = function* () {
      this._activate = false;
      this.parent.visible = true;
      this._blurMultiplier = 1;
      const spos = BattleManager._skillWindow.posDiscard();
      const epos = [Graphics.boxWidth / 2, 500];
      let i = 0,
        frame = 20;
      while (i < frame) {
        const t = i / frame;
        this.setPosition(
          Math.lerp(spos[0], epos[0], t),
          Math.lerp(spos[1], epos[1], t)
        );
        this.setScale(Math.lerp(0.3, 1, t));
        ++i;
        yield;
      }
      this._isBusy = false;
    };

    Sprite_CardItem.prototype.deactivate = function () {
      this.hide();
      this._use = false;
      this._index = -1;
    };
    Sprite_CardItem.prototype.updateOwnOrderTop = function () {
      // console.log(this.parent.parent.children);
      this.parent.parent.addChild(this.parent);
      // this._particleContainers.forEach(v => this.parent.addChild(v), this);
    };
    Sprite_CardItem.prototype.setOrderIndex = function (i) {
      this.parent.parent.setChildIndex(this.parent, i);
    };
    Sprite_CardItem.prototype.item = function () {
      return $dataItems[this._id];
    };
    Sprite_CardItem.prototype.isBusy = function () {
      return this._isBusy;
    };
    Sprite_CardItem.prototype.getRealCost = function () {
      return this.item().meta.cost < 0 ? BattleManager.actor().mp : this._cost;
    };
    Sprite_CardItem.prototype.getTargetType = function () {
      const item = this.item();
      switch (item.meta.id) {
        case "hold":
        case "cost0":
        case "getfromdiscard":
        case "getfromdeck":
          return Window_BattleCard.SELTYPE_CARD1;
        case "mpupbydiscard":
          return Window_BattleCard.SELTYPE_CARDX;
        default:
          if ([1].includes(item.scope)) return Window_BattleCard.SELTYPE_ENEMY;
          else return Window_BattleCard.SELTYPE_NONE;
      }
    };
    Sprite_CardItem.prototype.isTargetTypeHand = function () {
      const type = this.getTargetType();
      return (
        type === Window_BattleCard.SELTYPE_CARD1 ||
        type === Window_BattleCard.SELTYPE_CARDX
      );
    };
    Sprite_CardItem.prototype.refresh = function (target) {
      if (!this._word.isReady()) return;
      const actor = BattleManager.actor();
      if (actor == null) return;
      const w = this.bitmap.width;
      const h = this.bitmap.height;
      const item = $dataItems[this._id];
      // cost and ng
      this.refreshCostAndNg();
      // desc
      let bitmap = this._word.bitmap;
      let fontinfo = params.CardInfo._fontInfoDesc;
      bitmap.fontFace = fontinfo[0];
      bitmap.clearRect(0, 110, w, 100);
      bitmap.fontSize = +fontinfo[6];
      bitmap.textColor = fontinfo[7];
      bitmap.outlineWidth = +fontinfo[8];
      bitmap.outlineColor = fontinfo[9];
      let action = new Game_Action(actor);
      action.setItemObject(item);
      let desc = Nnfs.replaceFormulaTag(
        item.description,
        action,
        target,
        this._value1,
        this._value2
      );
      this._word.drawTextEx(
        desc,
        +fontinfo[1],
        +fontinfo[2],
        +fontinfo[3],
        +fontinfo[4],
        fontinfo[5]
      );
      // 特殊効果
      if (item.damage.type === 1) {
        const is_play_atkup = this._particleContainers.find(
          (v) => v._tag === "atkup"
        );
        if (actor._atkUp2 && !is_play_atkup) {
          const p = Nnfs.ParticleContainer.makeParticle(
            "Outline",
            this.parent,
            true,
            true,
            false,
            true,
            true
          )
            .setTag("atkup")
            .setColor([255, 0, 0, 128])
            .play();
          this._particleContainers.push(p);
        } else if (!actor._atkUp2 && is_play_atkup) {
          is_play_atkup.stop();
        }
      } else if (
        this._duplicate &&
        !this._particleContainers.some((v) => v._tag === "duplicate")
      ) {
        const p = Nnfs.ParticleContainer.makeParticle(
          "Outline",
          this.parent,
          true,
          true,
          false,
          true,
          true
        )
          .setTag("duplicate")
          .setColor([0, 0, 255, 128])
          .play();
        this._particleContainers.push(p);
      }
    };

    Sprite_CardItem.prototype.refreshCostAndNg = function () {
      // cost
      let bitmap = this._word.bitmap;
      let fontinfo = params.CardInfo._fontInfoCost;
      bitmap.fontFace = fontinfo[0];
      bitmap.clearRect(10, 10, 30, 30);
      bitmap.fontSize = +fontinfo[6];
      bitmap.textColor = fontinfo[7];
      bitmap.outlineWidth = +fontinfo[8];
      bitmap.outlineColor = fontinfo[9];
      bitmap.drawText(
        this.getRealCost(),
        +fontinfo[1],
        +fontinfo[2],
        +fontinfo[3],
        +fontinfo[4],
        fontinfo[5]
      );
      // ng
      this._ng.visible = !BattleManager._skillWindow.isEnabled(this);
    };

    Sprite_CardItem.prototype.isTransformCard = function () {
      return this.item().meta.id === cardIdTransform;
    };
    //==============================
    // *カードバトルシステム：カードアイテムのパーティクルコンテナ
    //==============================
    DataManager.loadParticleConfig("ps");
    Nnfs.ParticleContainer = function ParticleContainer() {
      this.initialize.apply(this, arguments);
    };
    Nnfs.ParticleContainer.prototype = Object.create(
      PIXI.particles.ParticleContainer.prototype
    );
    Nnfs.ParticleContainer.prototype.constructor = Nnfs.ParticleContainer;
    Nnfs.ParticleContainer.makeParticle = function (
      id,
      parent,
      scale,
      position,
      rotation,
      uvs,
      alpha
    ) {
      const pc = new Nnfs.ParticleContainer({
        scale: scale,
        position: position,
        rotation: rotation,
        uvs: uvs,
        alpha: alpha,
        _id: id,
      });
      parent.addChild(pc);
      return pc;
    };
    Nnfs.ParticleContainer.prototype.initialize = function (properties) {
      PIXI.particles.ParticleContainer.call(
        this,
        properties._maxSize,
        properties,
        undefined,
        undefined
      );
      this._id = properties._id;
      this._tag = properties._id;
      const config = (this.config = $particleConfig.ps[this._id]);
      if (config == null) {
        console.log("not found", this._id);
        return;
      }
      this._activate = false;
      this._ready = false;
      this._tick = -1;
      this._loop = config.loop;
      this.setDuration(config.duration);
      this.setLifetime(
        config.lifetime.length == null ? config.lifetime : config.lifetime[0],
        config.lifetime[1]
      );
      if (config.emit.bursts) {
        this._emitBurst = config.emit.bursts;
      }
      if (config.emit.interval)
        this.setEmitInterval(
          config.emit.interval.length == null
            ? config.emit.interval
            : config.emit.interval[0],
          config.emit.interval[1]
        );
      const p = config.position;
      if (p.startX)
        this._positionStart = [
          p.startX,
          p.startY != null ? p.startY : p.startX,
        ];
      if (p.endX)
        this._positionEnd = [p.endX, p.endY != null ? p.endY : p.endX];
      if (p.start) this._positionStart2 = p.start;
      if (p.end) this._positionEnd2 = p.end;
      if (config.rotation.start) {
        this._rotationStart = config.rotation.start;
      }
      if (config.rotation.end) {
        this._rotationEnd =
          config.rotation.end != null
            ? config.rotation.end
            : config.rotation.start;
      }
      const s = config.scale;
      if (s.startX) {
        this._scaleStart = [s.startX, s.startY != null ? s.startY : s.startX];
      }
      if (s.endX) {
        this._scaleEnd = [s.endX, s.endY != null ? s.endY : s.endX];
      }
      if (s.start) {
        this._scaleStart2 = s.start;
      }
      if (s.end) {
        this._scaleEnd2 = s.end;
      }
      const size = config.size;
      if (size.startX) {
        this._sizeStart = [
          size.startX,
          size.startY != null ? size.startY : size.startX,
        ];
      }
      if (size.endX) {
        this._sizeEnd = [size.endX, size.endY != null ? size.endY : size.endX];
      }
      if (config.color.start) {
        this._colorStart = config.color.start;
        // this._colorEnd = config.color.end!= null ? config.color.end:config.color.start;
      }
      if (config.opacity.start) {
        this._opacityStart = config.opacity.start;
        this._opacityEnd =
          config.opacity.end != null
            ? config.opacity.end
            : config.opacity.start;
      }
      if (config.velocity && config.velocity.initX != null) {
        const v = config.velocity;
        this._velocityInit = [v.initX, v.initY];
        this._velocitySpeed = [v.speedX, v.speedY];
        this._velocityDampen = v.dampen;
      }
      this._tick = 0;
      this._childProps = [];
      this._isPlay = false;
      // NORMAL:0
      // ADD:1
      // MULTIPLY:2
      // SCREEN:3
      // OVERLAY:4
      // DARKEN:5
      // LIGHTEN:6
      // COLOR_DODGE:7
      // COLOR_BURN:8
      // HARD_LIGHT:9
      // SOFT_LIGHT:10
      // DIFFERENCE:11
      // EXCLUSION:12
      // HUE:13
      // SATURATION:14
      // COLOR:15
      // LUMINOSITY:16
      // NORMAL_NPM:17
      // ADD_NPM:18
      // SCREEN_NPM:19
      this.blendMode = config.blendMode;
      for (let i = 0; i < config.maxSize; ++i) {
        const sprite = new Sprite(ImageManager.loadPicture(config.filepath));
        //const sprite = new TilingSprite(ImageManager.loadPicture(config.filepath), 512, 512);
        sprite.visible = false;
        sprite.anchor.x = config.anchor[0];
        sprite.anchor.y = config.anchor[1];
        sprite._use = false;
        sprite.opacity = 0;
        sprite.x = 50;
        sprite.y = -150;
        // sprite.setFrame(180, 0, 512, 512);
        sprite.bitmap.addLoadListener(
          function () {
            this._ready = true;
          }.bind(this)
        );
        this.addChild(sprite);
      }
      // this._frame.width = Graphics.boxWidth;
      // this._frame.height = Graphics.boxHeight;
    };
    Nnfs.ParticleContainer.prototype.destroy = function () {
      this._activate = false;
      if (this.parent) {
        this.parent.removeChild(this);
        PIXI.particles.ParticleContainer.prototype.destroy.call(this);
      }
    };

    Nnfs.ParticleContainer.prototype.setTag = function (a) {
      this._tag = a;
      return this;
    };
    Nnfs.ParticleContainer.prototype.setDuration = function (a) {
      this._duration = a;
      return this;
    };
    Nnfs.ParticleContainer.prototype.setEmitBurst = function (...a) {
      this._emitBurst = a;
      return this;
    };
    Nnfs.ParticleContainer.prototype.setEmitInterval = function (a, b = a) {
      this._emitInterval = [a, b, Math.randomRangeInt(a, b)];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setLifetime = function (a, b = a) {
      this._lifetime = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setLoop = function (a) {
      this._loop = a;
      return this;
    };
    Nnfs.ParticleContainer.prototype.setColor = function (a, b) {
      this._colorStart = b == null ? a : [a, b];
      return this;
    };
    // Nnfs.ParticleContainer.prototype.setOpacity = function(a, b=a) { this._opacity = [a, b]; return this; };
    Nnfs.ParticleContainer.prototype.setPositionStart = function (a, b = a) {
      this._positionStart = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setPositionEnd = function (a, b = a) {
      this._positionEnd = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setRotationStart = function (a, b = a) {
      this._rotationStart = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setRotationEnd = function (a, b = a) {
      this._rotationEnd = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setScaleStart = function (a, b = a) {
      this._scaleStart = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setScaleStart2 = function (a, b = a) {
      this._scaleStart2 = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setScaleEnd = function (a, b = a) {
      this._scaleEnd = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setSizeStart = function (a, b = a) {
      this._sizeStart = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.setSizeEnd = function (a, b = a) {
      this._sizeEnd = [a, b];
      return this;
    };
    Nnfs.ParticleContainer.prototype.play = function () {
      if (!this._isPlay) this._tick = -1;
      this._isPlay = true;
      this._activate = true;
      return this;
    };
    Nnfs.ParticleContainer.prototype.stop = function () {
      this._isPlay = false;
      return this;
    };
    Nnfs.ParticleContainer.prototype.get = function () {
      for (let i = 0, l = this.children.length; i < l; ++i)
        if (!this.children[i]._use) return this.children[i];
      return null;
    };
    Nnfs.ParticleContainer.prototype.make = function (n) {
      let result = false;
      for (let i = 0; i < n; ++i) {
        let p = this.get();
        if (p == null) {
          break;
        }
        result = true;
        p._use = true;
        this._childProps.push(this.makeChildProp(p));
      }
      return result;
    };
    Nnfs.ParticleContainer.prototype.makeChildProp = function (p) {
      let prop = {
        particle: p,
        _lifetime: Math.randomRange(this._lifetime),
        _tick: 0,
      };
      p.visible = true;
      p.x = p.y = 0;
      p.rotation = 0;
      p.scale.set(1);
      p.opacity = 255;
      if (this._positionStart != null) {
        p.x =
          this._positionStart[0].length == null
            ? this._positionStart[0]
            : Math.randomRange(
                this._positionStart[0][0],
                this._positionStart[0][1]
              );
        p.y =
          this._positionStart[1].length == null
            ? this._positionStart[1]
            : Math.randomRange(
                this._positionStart[1][0],
                this._positionStart[1][1]
              );
        if (this._positionEnd != null) {
          prop._sp = new PIXI.Point(p.x, p.y);
          prop._ep = new PIXI.Point(
            this._positionEnd[0].length == null
              ? this._positionEnd[0]
              : Math.randomRange(
                  this._positionEnd[0][0],
                  this._positionEnd[0][1]
                ),
            this._positionEnd[1].length == null
              ? this._positionEnd[1]
              : Math.randomRange(
                  this._positionEnd[1][0],
                  this._positionEnd[1][1]
                )
          );
        }
      } else if (this._positionStart2 != null) {
        p.x = p.y =
          this._positionStart2.length == null
            ? this._positionStart2
            : Math.randomRange(
                this._positionStart2[0],
                this._positionStart2[1]
              );
        if (this._positionEnd2 != null) {
          prop._sp = new PIXI.Point(p.x, p.y);
          prop._ep = new PIXI.Point();
          prop._ep.set(
            this._positionEnd2.length == null
              ? this._positionEnd2
              : Math.randomRange(this._positionEnd2[0], this._positionEnd2[1])
          );
        }
      }
      if (this._rotationStart != null) {
        p.rotation =
          this._rotationStart.length == null
            ? this._rotationStart
            : Math.randomRange(this._rotationStart[0], this._rotationStart[1]);
        if (this._rotationEnd != null) {
          prop._sr = p.rotation;
          prop._er =
            this._rotationEnd.length == null
              ? this._rotationEnd
              : Math.randomRange(this._rotationEnd[0], this._rotationEnd[1]);
        }
      }
      if (this._scaleStart != null) {
        p.scale.x =
          this._scaleStart[0].length == null
            ? this._scaleStart[0]
            : Math.randomRange(this._scaleStart[0][0], this._scaleStart[0][1]);
        p.scale.y =
          this._scaleStart[1].length == null
            ? this._scaleStart[1]
            : Math.randomRange(this._scaleStart[1][0], this._scaleStart[1][1]);
        if (this._scaleEnd != null) {
          prop._ss = new PIXI.Point(p.scale.x, p.scale.y);
          prop._es = new PIXI.Point(
            this._scaleEnd[0].length == null
              ? this._scaleEnd[0]
              : Math.randomRange(this._scaleEnd[0][0], this._scaleEnd[0][1]),
            this._scaleEnd[1].length == null
              ? this._scaleEnd[1]
              : Math.randomRange(this._scaleEnd[1][0], this._scaleEnd[1][1])
          );
        }
      } else if (this._scaleStart2 != null) {
        p.scale.set(
          this._scaleStart2.length == null
            ? this._scaleStart2
            : Math.randomRange(this._scaleStart2[0], this._scaleStart2[1])
        );
        if (this._scaleEnd2 != null) {
          prop._ss = new PIXI.Point(p.scale.x, p.scale.y);
          prop._es = new PIXI.Point();
          prop._es.set(
            this._scaleEnd2.length == null
              ? this._scaleEnd2
              : Math.randomRange(this._scaleEnd2[0], this._scaleEnd2[1])
          );
        }
      } else if (this._sizeStart != null) {
        const w = p.width;
        const h = p.height;
        p.scale.x =
          this._sizeStart[0].length == null
            ? this._sizeStart[0] / w
            : Math.randomRange(
                this._sizeStart[0][0] / w,
                this._sizeStart[0][1] / w
              );
        p.scale.y =
          this._sizeStart[1].length == null
            ? this._sizeStart[1] / h
            : Math.randomRange(
                this._sizeStart[1][0] / h,
                this._sizeStart[1][1] / h
              );
        if (this._sizeEnd != null) {
          prop._ss = new PIXI.Point(p.scale.x, p.scale.y);
          prop._es = new PIXI.Point(
            this._sizeEnd[0].length == null
              ? this._sizeEnd[0] / w
              : Math.randomRange(
                  this._sizeEnd[0][0] / w,
                  this._sizeEnd[0][1] / w
                ),
            this._sizeEnd[1].length == null
              ? this._sizeEnd[1] / h
              : Math.randomRange(
                  this._sizeEnd[1][0] / h,
                  this._sizeEnd[1][1] / h
                )
          );
        }
      }
      if (this._colorStart != null) {
        p.setBlendColor(
          this._colorStart.length == 4
            ? this._colorStart
            : [
                Math.randomRange(
                  this._colorStart[0][0],
                  this._colorStart[1][0]
                ),
                Math.randomRange(
                  this._colorStart[0][1],
                  this._colorStart[1][1]
                ),
                Math.randomRange(
                  this._colorStart[0][2],
                  this._colorStart[1][2]
                ),
                Math.randomRange(
                  this._colorStart[0][3],
                  this._colorStart[1][3]
                ),
              ]
        );
      }
      if (this._opacityStart) {
        p.opacity =
          this._opacityStart.length == null
            ? this._opacityStart
            : Math.randomRange(this._opacityStart[0], this._opacityStart[1]);
        if (this._opacityEnd != null) {
          prop._so = p.opacity;
          prop._eo =
            this._opacityEnd.length == null
              ? this._opacityEnd
              : Math.randomRange(this._opacityEnd[0], this._opacityEnd[1]);
        }
      }
      if (this._velocityInit) {
        prop._v = new PIXI.Point();
        prop._v.x =
          this._velocityInit[0].length == null
            ? this._velocityInit[0]
            : Math.randomRange(
                this._velocityInit[0][0],
                this._velocityInit[0][1]
              );
        prop._v.y =
          this._velocityInit[1].length == null
            ? this._velocityInit[1]
            : Math.randomRange(
                this._velocityInit[1][0],
                this._velocityInit[1][1]
              );
        prop._vs = new PIXI.Point();
        prop._vs.x =
          this._velocitySpeed[0].length == null
            ? this._velocitySpeed[0]
            : Math.randomRange(
                this._velocitySpeed[0][0],
                this._velocitySpeed[0][1]
              );
        prop._vs.y =
          this._velocitySpeed[1].length == null
            ? this._velocitySpeed[1]
            : Math.randomRange(
                this._velocitySpeed[1][0],
                this._velocitySpeed[1][1]
              );
      }
      // console.log(this._id, this._opacityStart, this._opacityEnd, prop._so, prop._eo);
      return prop;
    };
    Nnfs.ParticleContainer.prototype.update = function () {
      if (!this._ready) return;
      let all_stop = true;
      for (let i = 0, l = this._childProps.length; i < l; ++i) {
        let prop = this._childProps[i];
        const p = prop.particle;
        if (prop._lifetime <= ++prop._tick) {
          p.visible = false;
          p.opacity = 0;
          p._use = false;
          this._childProps.splice(i, 1);
          --i;
          --l;
          continue;
        }
        all_stop = false;
        const t = Math.min(1, prop._tick / prop._lifetime);
        if (prop._sp) {
          p.x = Math.lerp(prop._sp.x, prop._ep.x, t);
          p.y = Math.lerp(prop._sp.y, prop._ep.y, t);
        }
        if (prop._v) {
          prop._v.x += prop._vs.x;
          prop._v.y += prop._vs.y;
          if (this.config.velocity.dampen) {
            const limit = this.config.velocity.dampen[0];
            const dampen = this.config.velocity.dampen[1];
            const absx = Math.abs(prop._v.x);
            const absy = Math.abs(prop._v.y);
            if (limit < absx) {
              prop._v.x -= (absx - limit) * dampen * Math.sign(prop._v.x);
            }
            if (limit < absy)
              prop._v.y -= (absy - limit) * dampen * Math.sign(prop._v.y);
          }
          p.x += prop._v.x;
          p.y += prop._v.y;
        }
        if (prop._sr) {
          p.rotation = Math.lerp(prop._sr, prop._er, t);
        }
        if (prop._ss) {
          p.scale.x = Math.lerp(prop._ss.x, prop._es.x, t);
          p.scale.y = Math.lerp(prop._ss.y, prop._es.y, t);
        }
        if (prop._so) {
          p.opacity = Math.lerp(prop._so, prop._eo, t);
        }
        // p.tilePosition.set(prop._tick);
        // p.tileScale.set(prop._tick % 10);
        // if (this._color) {
        // const c = Math.lerp(this._color[0], this._color[1], t);
        // p.setBlendColor([
        // 	Math.lerp(this._color[0][0], this._color[1][0], t),
        // 	Math.lerp(this._color[0][1], this._color[1][1], t),
        // 	Math.lerp(this._color[0][2], this._color[1][2], t),
        // 	Math.lerp(this._color[0][3], this._color[1][3], t),
        // ]);
        // p.setBlendColor([c >> 24 & 0xFF, c >> 16 & 0xFF, c >> 8 & 0xFF, 255]);
        // p._blendColor = ([c >> 24 & 0xFF, c >> 16 & 0xFF, c >> 8 & 0xFF, 255]);
        // }
      }
      if (!this._loop && this._duration <= this._tick) {
        this.stop();
      }
      if (this._isPlay) {
        if (this._emitBurst) {
          for (let i = 0, l = this._emitBurst.length; i < l; ++i) {
            if (this._tick % this._duration === this._emitBurst[i][0]) {
              this.make(this._emitBurst[i][1]);
              break;
            }
          }
        }
        if (this._emitInterval) {
          if (0 < this._emitInterval[2]) {
            if (this._tick % this._emitInterval[2] === 0) {
              this._emitInterval[2] = Math.randomRangeInt(this._emitInterval);
              this.make(1);
            }
          }
        }
        ++this._tick;
      }
      if (all_stop && !this._isPlay) {
        // console.log('particle removed: ', this._id);
        this.destroy();
      }
    };

    //==============================
    // *カードバトルシステム：カード破片
    //==============================
    FragmentParent = function FragmentParent() {
      this.initialize.apply(this, arguments);
    };
    FragmentParent.prototype = Object.create(Sprite.prototype);
    FragmentParent.prototype.constructor = FragmentParent;
    FragmentParent.prototype.initialize = function (texture, fragmentNum) {
      Sprite.prototype.initialize.call(this);
      // this.visible = false;
      texture.addLoadListener(
        function (tex) {
          const w = tex.width;
          const h = tex.height;
          let vertices = new Array(fragmentNum),
            i,
            x,
            y;
          vertices[0] = [0, 0];
          vertices[1] = [w, 0];
          vertices[2] = [0, h];
          vertices[3] = [w, h];
          for (i = 4; i < vertices.length; ++i) {
            x = Math.random() * w;
            y = Math.random() * h;
            vertices[i] = [x, y];
          }
          const triangles = Delaunay.triangulate(vertices);
          let ctx = tex.context;
          // ctx.save();
          for (i = triangles.length; i; ) {
            const s = new Fragment(new Bitmap(w, h));
            const ctx = s.bitmap.context;
            ctx.beginPath();
            ctx.lineWidth = Math.randomRangeInt(1, 3);
            --i;
            ctx.moveTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
            --i;
            ctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
            --i;
            ctx.lineTo(vertices[triangles[i]][0], vertices[triangles[i]][1]);
            ctx.stroke();
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(tex.canvas, 0, 0, w, h, 0, 0, w, h);
            // ctx.clearRect(0, 0, w, h);
            this.addChild(s);
          }
        }.bind(this)
      );
      this.activate = true;
    };
    FragmentParent.prototype.update = function () {
      Sprite.prototype.update.call(this);
      if (this.children.length == 0) {
        this.parent.removeChild(this);
      }
    };
    Fragment = function Fragment() {
      this.initialize.apply(this, arguments);
    };
    Fragment.prototype = Object.create(Sprite.prototype);
    Fragment.prototype.constructor = Fragment;
    Fragment.prototype.initialize = function () {
      Sprite.prototype.initialize.apply(this, arguments);
      this._x = Math.randomRange(-3, 3);
      this._y = Math.randomRange(-0.8, -0.1);
      this._r = Math.randomRange(-0.02, 0.02);
      this._o = Math.randomRange(-5, -3);
      this.anchor.set(0.5);
      this._delay = Math.randomRangeInt(40, 50);
    };
    Fragment.prototype.update = function () {
      if (0 < this._delay) {
        --this._delay;
        return;
      }
      this._x *= 0.98;
      this._y *= 1.05;
      this.x += this._x;
      this.y += this._y;
      this.rotation += this._r;
      this.opacity += this._o;
      if (this.opacity <= 0) this.parent.removeChild(this);
    };
  } // カードバトルシステム
  //==============================
  // *カメラ
  //==============================
  const Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    Game_Temp_initialize.call(this);
    this._cameraPos = new Point();
    this._cameraFCount = 0;
    this.clearCameraShakeParam();
    this.setCameraProp(params.CameraParam._propDefault);
  };
  Game_Temp.prototype.setCameraProp = function (prop) {
    this._cameraScale = prop[2];
    const w2 = Graphics.boxWidth / 2;
    const h2 = Graphics.boxHeight / 2;
    const real_x = -(prop[0] + w2) * this._cameraScale;
    const real_y = -(prop[1] + h2) * this._cameraScale;
    this._cameraPos.x = real_x + w2;
    this._cameraPos.y = real_y + h2;
    this._cameraFCount = 0;
    this._cameraEnd = false;
  };
  Game_Temp.prototype.setCameraTarget = function (
    battlerSprite,
    ofsx,
    ofsy,
    scale
  ) {
    $gameTemp.setCameraProp([
      -(Graphics.boxWidth / 2 - battlerSprite.x) + (ofsx || 0),
      battlerSprite.y - Graphics.boxHeight / 2 + (ofsy || 0),
      scale || 1,
    ]);
  };
  Game_Temp.prototype.clearCameraShakeParam = function () {
    perlin.seed(Math.random());
    this._shakeSpeed = params.CameraParam._cameraShakeDefault[0];
    this._shakePower = params.CameraParam._cameraShakeDefault[1];
    this._shakeDuration = 0;
    this._shakeCnt = Math.random() * 100 - 50;
  };
  Game_Temp.prototype.getPerlin2d = function (x, y) {
    const i =
      perlin.simplex2(this._shakeCnt + x, this._shakeCnt + y) *
      this._shakePower;
    return Number.isNaN(i) ? 0 : i;
  };
  Game_Temp.prototype.updatePerlin = function () {
    this._shakeCnt += this._shakeSpeed;
    if (0 < this._shakeDuration) {
      if (--this._shakeDuration <= 0) {
        this.clearCameraShakeParam();
      }
    }
  };
  const Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
  Spriteset_Battle.prototype.initialize = function () {
    Spriteset_Battle_initialize.call(this);
    this._cameraEnabled = true;
    this._cameraEnd = false;
    $gameTemp.setCameraProp(params.CameraParam._propDefault);
  };
  Spriteset_Battle.prototype.updateBattleback = function () {};
  Spriteset_Battle.prototype.locateBattleback = function () {};
  const Spriteset_Battle_update = Spriteset_Battle.prototype.update;
  Spriteset_Battle.prototype.update = function () {
    Spriteset_Battle_update.call(this);
    if (!this._cameraEnabled) return;
    let noise_target = this._baseSprite;
    if ($gameTemp._cameraFCount++ < params.CameraParam._calcFrame) {
      // ベーススプライト
      this._baseSprite.x = Math.lerp(
        this._baseSprite.x,
        $gameTemp._cameraPos.x + $gameTemp.getPerlin2d(0.0, 0.01),
        params.CameraParam._moveT
      );
      this._baseSprite.y = Math.lerp(
        this._baseSprite.y,
        $gameTemp._cameraPos.y + $gameTemp.getPerlin2d(0.98, 1.0),
        params.CameraParam._moveT
      );
      this._baseSprite.scale.set(
        Math.lerp(
          this._baseSprite.scale.x,
          $gameTemp._cameraScale,
          params.CameraParam._moveT
        )
      );
      noise_target = $gameTemp._cameraPos;
      // 遠景
      const b0 = this._battleField.children[0];
      b0.x = Math.lerp(
        b0.x,
        params._back1SpritePos[0] +
          this._baseSprite.x * params.CameraParam._moveWeightBack,
        params.CameraParam._moveT
      );
      b0.y = Math.lerp(
        b0.y,
        params._back1SpritePos[1] +
          this._baseSprite.y * params.CameraParam._moveWeightBack,
        params.CameraParam._moveT
      );
      b0.scale.set(
        Math.lerp(
          b0.scale.x,
          1 +
            ($gameTemp._cameraScale - 1) * params.CameraParam._scaleWeightBack,
          params.CameraParam._moveT
        )
      );
      // クランプ処理
      const clamp_x_left = 630;
      const clamp_x_right = 410;
      const clamp_y_up = 800;
      const clamp_y_down = 580;
      // console.log(b0.worldTransform.tx, b0.worldTransform.ty);
      if (clamp_x_left < b0.worldTransform.tx) {
        const d = b0.worldTransform.tx - clamp_x_left;
        b0.x -= d;
      }
      if (b0.worldTransform.tx < clamp_x_right) {
        const d = clamp_x_right - b0.worldTransform.tx;
        b0.x += d;
      }
      if (clamp_y_up < b0.worldTransform.ty) {
        const d = b0.worldTransform.ty - clamp_y_up;
        b0.y -= d;
      }
      // if (b0.worldTransform.ty < clamp_y_down) {
      // 	const d = clamp_y_down - b0.worldTransform.ty;
      // 	b0.y += d;
      // }
      // 近景
      if (this._backSpriteEx != null) {
        const ex = this._backSpriteEx[0];
        ex.x = Math.lerp(
          ex.x,
          ex._defaultX +
            this._baseSprite.x * params.CameraParam._moveWeightFront,
          params.CameraParam._moveT
        );
        ex.y = Math.lerp(
          ex.y,
          ex._defaultY +
            this._baseSprite.y * params.CameraParam._moveWeightFront,
          params.CameraParam._moveT
        );
        ex.scale.set(
          Math.lerp(
            ex.scale.x,
            1 +
              ($gameTemp._cameraScale - 1) *
                params.CameraParam._scaleWeightFront,
            params.CameraParam._moveT
          )
        );
      }
      // 終了時
      this._cameraEnabled = !(
        $gameTemp._cameraEnd &&
        $gameTemp._cameraFCount == params.CameraParam._calcFrame
      );
    } else {
      this._baseSprite.x =
        $gameTemp._cameraPos.x + $gameTemp.getPerlin2d(0.0, 0.01);
      this._baseSprite.y =
        $gameTemp._cameraPos.y + $gameTemp.getPerlin2d(1.01, 1.02);
    }
    $gameTemp.updatePerlin();
  };
  //==============================
  // *敵の行動時にスキルIDを変数に格納
  //==============================
  const battleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function () {
    battleManager_startAction.call(this);
    if (this._subject.isEnemy()) {
      const item = this._subject.currentAction().item();
      $gameVariables.setValue(
        params.BattleActorParam._varIdxCurrentSkillId,
        item.id
      );
      // console.log("skillId set to var:", params.BattleActorParam._varIdxCurrentSkillId, $gameVariables.value(params.BattleActorParam._varIdxCurrentSkillId));
      if (item.meta.commonevent) {
        const meta = this._subject.enemy().meta;
        if (meta.enemy_type != null)
          $gameVariables.setValue(
            params.BattleActorParam._varIdxCurrentEnemyType,
            +meta.enemy_type
          );
        if (meta.enemy_eroskins != null)
          $gameTemp.battle_eroskins = meta.enemy_eroskins.split(" ");
        BattleManager._interpreter.setup(
          $dataCommonEvents[item.meta.commonevent].list,
          0
        );
      }
    } else if (this._subject.isActor()) {
      const item = this._subject.currentAction().item();
      $gameVariables.setValue(
        params.BattleActorParam._varIdxCurrentSkillId,
        item.id
      );
      // console.log("skillId set to var:", params.BattleActorParam._varIdxCurrentSkillId, $gameVariables.value(params.BattleActorParam._varIdxCurrentSkillId));
      if (item.meta.commonevent) {
        if (this._targets[0]._enemyId != null) {
          const meta = this._targets[0].enemy().meta;
          if (meta.enemy_type != null)
            $gameVariables.setValue(
              params.BattleActorParam._varIdxCurrentEnemyType,
              +meta.enemy_type
            );
          if (meta.actor_eroskins != null)
            $gameTemp.battle_eroskins = meta.actor_eroskins.split(" ");
        }
        BattleManager._interpreter.setup(
          $dataCommonEvents[item.meta.commonevent].list,
          0
        );
      }
    }
  };
  BattleManager.isTargetDie = function () {
    const action = this._action;
    const damage = action.makeDamageValue(BattleManager._targets[0]);
    const target_life = BattleManager._targets[0].hp;
    return target_life - damage <= 0;
  };

  //==============================
  // *背景追加
  //==============================
  const Spriteset_Battle_createLowerLayer =
    Spriteset_Battle.prototype.createLowerLayer;
  Spriteset_Battle.prototype.createLowerLayer = function () {
    Spriteset_Battle_createLowerLayer.call(this);
    this._battleField.addChildAt(this._back2Sprite, 0);
    this._battleField.addChildAt(this._back1Sprite, 1);

    const name = $dataTroops[$gameTroop._troopId].name;
    const idx = name.indexOf("1=");
    if (idx === -1) return;
    const filename = name[idx + 2];
    const i = 0;
    if (this._backSpriteEx == null) this._backSpriteEx = [];
    this._backSpriteEx[i] = new TilingSprite();
    var margin = 32;
    var x = -this._battleField.x - margin;
    var y = -this._battleField.y - margin;
    var width = Graphics.width + margin * 2;
    var height = Graphics.height + margin * 2;
    this._backSpriteEx[i].move(x, y, width, height);
    this._backSpriteEx[i]._defaultX = x;
    this._backSpriteEx[i]._defaultY = y;
    if (i == 0) {
      this._backSpriteEx[i].bitmap = ImageManager.loadBattleback1(filename);
      this._battleField.addChild(this._backSpriteEx[i]);
    } else {
      this._backSpriteEx[i].bitmap = ImageManager.loadBattleback2(filename);
      this._battleField.addChildAt(this._backSpriteEx[i], 1);
    }
  };
  //==============================
  // *スキルツリー
  //==============================
  const Game_Actor_stsLearnSkill = Game_Actor.prototype.stsLearnSkill;
  Game_Actor.prototype.stsLearnSkill = function (skillId) {
    Game_Actor_stsLearnSkill.call(this, skillId);
    const skill = $dataSkills[skillId];
    if (skill.meta.addcard) {
      $gameParty.gainItem($dataItems[skill.meta.addcard], 1);
    }
  };
  var Game_Actor_forgetSkill = Game_Actor.prototype.forgetSkill;
  Game_Actor.prototype.forgetSkill = function (skillId) {
    Game_Actor_forgetSkill.call(this, skillId);
    const skill = $dataSkills[skillId];
    if (skill.meta.addcard) {
      $gameParty.loseItem($dataItems[skill.meta.addcard], 1);
    }
  };
  //==============================
  // *カスタムバトルアクタ
  //==============================
  // スプライト読み込みを中止
  Sprite_Actor.prototype.createMainSprite = function () {};
  // Sprite_Actor.prototype.createShadowSprite = function() {};
  // Sprite_Actor.prototype.updateShadow = function() {};
  Sprite_Actor.prototype.createWeaponSprite = function () {};
  Sprite_Actor.prototype.setupWeaponAnimation = function () {};
  // Spineモデルのロード
  var Sprite_Battler_setBattler = Sprite_Battler.prototype.setBattler;
  Sprite_Actor.prototype.setBattler = function (battler) {
    Sprite_Battler_setBattler.call(this, battler);
    var changed = battler !== this._actor;
    if (changed) {
      // アクタがない＝ロード
      if (this._actor == null) {
        this._actor = battler;
        this._isSpine = true; //$dataActors[this._actor._actorId] && $dataActors[this._actor._actorId].meta.spine;
        this.load();
        this.setActorHome(battler.index());
      }
      // アクタはあるがバトラーがない＝消す
      else if (battler == null) {
        this.remove();
      }
      // アクタが変わった＝古いのは消して新しいので作る
      else {
        this.remove();
        this._isSpine = true; //$dataActors[this._actor._actorId] && $dataActors[this._actor._actorId].meta.spine;
        this._actor = battler;
        this.load();
      }
      this.startEntryMotion();
      this._stateSprite.setup(battler);
    }
  };
  Sprite_Actor.prototype.load = function () {
    // すでにロードしていた場合
    if (!this._isSpine || this._container != null) return;
    // コンテナ作成
    this._container = new PIXI.Container();
    this._container.position.x = 0;
    this._container.position.y = 0;
    this.addChild(this._container);
    // ロード
    this._spine = new PIXI.spine.Spine(
      Makonet.MpiShowSpine.spineData["actor" + this._actor._actorId]
    );
    this._spine.scale.set(params.BattleActorParam._scale);
    this._battler._isTransform = false;
    Makonet.MpiShowSpine.setSkinEx(
      this._spine,
      params.BattleActorParam._skins[this._battler._isTransform ? 2 : 5]
    );
    Makonet.MpiShowSpine.setAnimation(
      this._spine,
      params.BattleActorParam._animIdle,
      true
    );
    if (params.BattleActorParam._antialias) {
      PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
      this._spine.filters = [new PIXI.filters.FXAAFilter()];
    }
    // this._spine.state.addListener({
    // 	  start: 	this.spineAnimationOnStart
    // 	, end: 		this.spineAnimationOnEnd
    // });
    this.width = this._spine.width;
    this.height = this._spine.height;
    this._container.addChild(this._spine);
  };
  // Spineモデルの削除
  Sprite_Actor.prototype.remove = function () {
    this._container.removeChild(this._spine);
    this._spine = null;
    this.removeChild(this._container);
    this._container.destroy(true);
    this._container = null;
  };
  // bitmapアクセスの中止
  const Sprite_Actor_updateBitmap = Sprite_Actor.prototype.updateBitmap;
  Sprite_Actor.prototype.updateBitmap = function () {
    if (this._isSpine) {
      Sprite_Battler.prototype.updateBitmap.call(this); // Sprite_Battler
      var name = this._actor.battlerName();
      if (this._battlerName !== name) {
        this._battlerName = name;
      }
    } else {
      Sprite_Actor_updateBitmap.call(this);
    }
  };
  // bitmapアクセスの中止
  // spineアニメーションの更新
  const Sprite_Actor_updateFrame = Sprite_Actor.prototype.updateFrame;
  Sprite_Actor.prototype.updateFrame = function () {
    if (this._spine) {
      Sprite_Battler.prototype.updateFrame.call(this);
      // // アニメーション更新
      // if (this._updateSpineMotion) {
      // 	// アニメ更新
      // 	this._spine.state.setAnimation(0, this._updateSpineMotion._motionName, this._updateSpineMotion._loop);
      // 	this._updateSpineMotion = null;
      // }
      // // アタッチメント更新
      // if (this._currentNakedState != this._actor.isNakedStateAffected()) {
      // 	this.updateAttachment();
      // }
      // // スケール
      // this._scale = Math.lerp(this._scale, this._scale_target, 0.1);
      // this.scale.set(this._scale);
      // // アルファ値
      // this._alpha = Math.lerp(this._alpha, this._alpha_target, 0.3);
      // this.opacity = this._alpha * 255;
      // // ステートによる色更新
      // this.updateStateColor();
    } else {
      Sprite_Actor_updateFrame.call(this);
    }
  };
  // モーション切り替えタイミングをグラブ
  Sprite_Actor.prototype.startMotion = function (motionType) {
    var newMotion = Sprite_Actor.MOTIONS[motionType];
    if (this._motion !== newMotion) {
      this._motion = newMotion;
      this._motionCount = 0;
      this._pattern = 0;
      this.refreshChara();
    }
  };
  Sprite_Actor.prototype.refreshChara = function (force) {
    switch (force) {
      case 1:
        this._battler._isTransform = false;
        break;
      case 2:
        this._battler._isTransform = true;
        break;
      default:
        break;
    }
    let state_idx = 0;
    // if (100 <= this._battler.trunk()) {
    // 	state_idx = this._battler._isTransform ? 5 : 2;
    // }
    // else if (params._pinchTrunk <= this._battler.trunk()) {
    // 	state_idx = this._battler._isTransform ? 4 : 1;
    // }
    // else {
    // 	state_idx = this._battler._isTransform ? 3 : 0;
    // }
    const hp_ratio = this._battler.hp / this._battler.mhp;
    if (0.6 <= hp_ratio) {
      state_idx = this._battler._isTransform ? 3 : 0;
    } else if (0.3 <= hp_ratio) {
      state_idx = this._battler._isTransform ? 4 : 1;
    } else {
      state_idx = this._battler._isTransform ? 5 : 2;
    }
    Makonet.MpiShowSpine.setSkinEx(
      this._spine,
      params.BattleActorParam._skins[state_idx]
    );
    $gameVariables.setValue(
      params.BattleActorParam._varIdxCurrentActorState,
      +state_idx
    );
    if (
      this._motion == Sprite_Actor.MOTIONS.walk ||
      this._motion == Sprite_Actor.MOTIONS.wait
    )
      Makonet.MpiShowSpine.setAnimation(
        this._spine,
        params.BattleActorParam._animIdle,
        true
      );
    else if (this._motion == Sprite_Actor.MOTIONS.damage)
      Makonet.MpiShowSpine.setAnimation(
        this._spine,
        params.BattleActorParam._animDamage,
        false
      );
    else if (
      this._motion == Sprite_Actor.MOTIONS.spell ||
      this._motion == Sprite_Actor.MOTIONS.item
    ) {
      Makonet.MpiShowSpine.setAnimation(
        this._spine,
        params.BattleActorParam._animUseItem[
          Math.randomRangeInt(0, params.BattleActorParam._animUseItem.length)
        ],
        false
      );
      playSe(params._seUseItem);
    } else if (this._motion == Sprite_Actor.MOTIONS.victory) {
      Makonet.MpiShowSpine.setAnimation(
        BattleManager._spriteset._actorSprites[0]._spine,
        params.BattleActorParam._animBattleEndWin,
        false
      );
      playVoice(
        Array.random(
          this._battler._isTransform
            ? params._seVoiceBattleWinTransform
            : params._seVoiceBattleWin
        )
      );
      if (this._battler._isTransform) Nnfs.setHpoint(0);
    } else if (this._motion == Sprite_Actor.MOTIONS.dead) {
      Makonet.MpiShowSpine.setAnimation(
        BattleManager._spriteset._actorSprites[0]._spine,
        params.BattleActorParam._animBattleEndLose,
        false
      );
      playVoice(
        Array.random(
          this._battler._isTransform
            ? params._seVoiceBattleLoseTransform
            : params._seVoiceBattleLose
        )
      );
      Nnfs.setHpoint(0);
    } else if (this._motion == Sprite_Actor.MOTIONS.escape) {
      // 逃げたとき、カメラの更新タイミングが遅いのでここで処理してしまう
      $gameTemp.setCameraProp(params.CameraParam._propBattleEnd);
      $gameTemp._cameraEnd = true;
      if (this._battler._isTransform) Nnfs.setHpoint(0);
    }
    // // 戦闘終了時に返信解除
    // if (this._motion == Sprite_Actor.MOTIONS.victory || this._motion == Sprite_Actor.MOTIONS.dead || this._motion == Sprite_Actor.MOTIONS.escape) {
    // }
  };
  // bitmapアクセスの中止
  const Sprite_Actor_updateMove = Sprite_Actor.prototype.updateMove;
  Sprite_Actor.prototype.updateMove = function () {
    if (this._spine) {
      Sprite_Battler.prototype.updateMove.call(this);
    } else {
      Sprite_Actor_updateMove.call(this);
    }
  };

  Window_EquipStatus.prototype.standardFontFace = function () {
    return Nnfs._commonFont1;
  };
  Window_EquipCommand.prototype.standardFontFace = function () {
    return Nnfs._commonFont1;
  };
  Window_EquipSlot.prototype.standardFontFace = function () {
    return Nnfs._commonFont1;
  };
  Window_EquipItem.prototype.standardFontFace = function () {
    return Nnfs._commonFont1;
  };
  Window_Status.prototype.standardFontFace = function () {
    return Nnfs._commonFont1;
  };
  Window_Options.prototype.standardFontFace = function () {
    return Nnfs._commonFont1;
  };
  Window_SavefileList.prototype.standardFontFace = function () {
    return Nnfs._commonFont1;
  };
  Window_ItemList.prototype.standardFontFace = function () {
    return Nnfs._commonFont1;
  };
  Window_ItemCategory.prototype.standardFontFace = function () {
    return Nnfs._commonFont1;
  };
  const Scene_Item_createHelpWindow = Scene_Item.prototype.createHelpWindow;
  Scene_Item.prototype.createHelpWindow = function () {
    Scene_Item_createHelpWindow.call(this);
    this._helpWindow.standardFontFace = function () {
      return Nnfs._commonFont1;
    };
  };
  const Scene_Equip_createHelpWindow = Scene_Equip.prototype.createHelpWindow;
  Scene_Equip.prototype.createHelpWindow = function () {
    Scene_Equip_createHelpWindow.call(this);
    this._helpWindow.standardFontFace = function () {
      return Nnfs._commonFont1;
    };
  };
  Scene_File.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help(1);
    this._helpWindow.standardFontFace = function () {
      return Nnfs._commonFont1;
    };
    this._helpWindow.setText(this.helpWindowText());
    this.addWindow(this._helpWindow);
  };
  //==============================
  // *ステートポップアップ
  //==============================
  const Game_BattlerBase_prototype_resetStateCounts =
    Game_BattlerBase.prototype.resetStateCounts;
  Game_BattlerBase.prototype.resetStateCounts = function (stateId) {
    if (stateId == 1) return;
    let turns = this._stateTurns[stateId];
    if (turns == null) turns = 0;
    Game_BattlerBase_prototype_resetStateCounts.call(this, stateId);
    turns = this._stateTurns[stateId] - turns;
    if (0 < turns) {
      if (!this._statePopupInfo) this._statePopupInfo = [];
      const idx = this._statePopupInfo.findIndex((e) => e._stateId == stateId);
      if (0 <= idx) {
        this._statePopupInfo[idx]._turns += turns;
      } else {
        this._statePopupInfo.push({ _stateId: stateId, _turns: turns });
      }
    }
  };
  //=======================================================================
})();
