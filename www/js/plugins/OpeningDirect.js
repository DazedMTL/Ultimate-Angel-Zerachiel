//=============================================================================
// OpeningDirect.js
// ----------------------------------------------------------------------------
// Copyright (c) 2018 nomaldog
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/04/07 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/nomaldog/
//=============================================================================

/*:ja
 * メモ: イメージはimg／systemフォルダ内に保存されます。
 *
 * @plugindesc タイトル画面へ進む前のオープニング画面を演出します。このプラグインはMadeWithMvを元に作られています。
 * @author nomaldog(改造元：Dan "Liquidize" Deptula / MadeWithMv.js)
 *
 * @help  このプラグインにはプラグインコマンドはありません。
 *
 * @param File Names
 * @desc 使用する画像(","カンマ区切り)
 * デフォルト:MadeWithMv 
 * @default MadeWithMv
 *
 * @param Fade Time
 * @desc 画像のフェードに要する時間（フレーム数）
 * デフォルト: 30
 * @default 30
 * 
 * @param Wait Time
 * @desc 画像が表示された後に待つ時間（フレーム数）
 * デフォルト: 30
 * @default 30
 *
 * @param BGM
 * @desc 使用するBGM
 * デフォルト:Theme1
 * @default Theme1
 * @require 1
 * @dir audio/bgm/
 * @type file
 * 
 */
var Liquidize = Liquidize || {};
Liquidize.OpeningDirect = {};
Liquidize.OpeningDirect.Parameters = PluginManager.parameters('OpeningDirect');

Liquidize.OpeningDirect.FileNames = String(Liquidize.OpeningDirect.Parameters["File Names"]);
Liquidize.OpeningDirect.FadeTime = Number(Liquidize.OpeningDirect.Parameters["Fade Time"]) || 120;
Liquidize.OpeningDirect.WaitTime = Number(Liquidize.OpeningDirect.Parameters["Wait Time"]) || 160;
Liquidize.OpeningDirect.BGM = String(Liquidize.OpeningDirect.Parameters["BGM"]);

//-----------------------------------------------------------------------------
// Scene_Opening
//
// This is a constructor, implementation is done in the inner scope.

function Scene_Opening() {
    this.initialize.apply(this, arguments);
}

(function () {

    //-----------------------------------------------------------------------------
    // Scene_Boot
    //
    // The scene class for dealing with the game boot.

    var _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
    Scene_Boot.prototype.loadSystemImages = function () {
        _Scene_Boot_loadSystemImages.call(this);
        this._FileNames.forEach(function (value) {
            ImageManager.loadSystem(value);
        });
    };

    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        if (!DataManager.isBattleTest() && !DataManager.isEventTest()) {
            SceneManager.goto(Scene_Opening);
        } else {
            _Scene_Boot_start.call(this);
        }
    };

    //-----------------------------------------------------------------------------
    // Scene_Opening
    //
    // The scene class for dealing with the splash screens.

    Scene_Opening.prototype = Object.create(Scene_Base.prototype);
    Scene_Opening.prototype.constructor = Scene_Opening;

    Scene_Opening.prototype.initialize = function () {
        Scene_Base.prototype.initialize.call(this);
        this._Sheets = 0;
        this._Splash = [];
        this._FileNames = Liquidize.OpeningDirect.FileNames.split(',');
        this._FileNames.forEach(function (value) {
            this._Splash.push(new Sprite(ImageManager.loadSystem(value)));
            this.addChild(this._Splash[this._Sheets]);
            this._Splash[this._Sheets].alpha = 0;
            this._Sheets++;
        }, this);

        this._WaitTime = Liquidize.OpeningDirect.WaitTime;
        this._FadeTime = Liquidize.OpeningDirect.FadeTime;
        this._TotalTime = this._FadeTime * this._Sheets + this._WaitTime * this._Sheets;
        this._RemaininglTime = this._TotalTime;
        this._Bgm = {
            "name": Liquidize.OpeningDirect.BGM, // ogg、m4aファイルをそれぞれ準備する
            "pan": 0,
            "pitch": 100,
            "volume": 90
        };
        this._LastWaiteMode = false;
        this._GoToTitle = false;
    };

    Scene_Opening.prototype.create = function () {
        Scene_Base.prototype.create.call(this);
    };

    Scene_Opening.prototype.start = function () {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        if (this._Splash != null) {
            this.centerSprite(this._Splash[0]);
        }
        AudioManager.playBgm(this._Bgm);
    };

    Scene_Opening.prototype.update = function () {
        if (!this._LastWaiteMode) {
            for (var i = 0; i < this._Sheets; i++) {
                var min_time = (i) * (this._FadeTime + this._WaitTime);
                var max_time = (i + 1) * (this._FadeTime + this._WaitTime);
                var past_time = this._TotalTime - this._RemaininglTime;
                if (max_time > past_time && past_time > min_time) {
                    var alpha_rate = (past_time - min_time) / this._FadeTime;
                    if (alpha_rate > 1.0) {
                        alpha_rate = 1.0;
                    }
                    this._Splash[i].alpha = alpha_rate;
                }
            }
            if (this._RemaininglTime-- == 0) {
                this._LastWaiteMode = true;
                this._RemaininglTime += this._FadeTime + this._WaitTime;
                for (var i = 0; i < this._Sheets - 1; i++) {
                    this._Splash[i].alpha = 0;
                }
            }
        } else {
            if (this._RemaininglTime-- == 0) {
                this._GoToTitle = true;
            } else {
                var alpha_rate = (this._RemaininglTime - this._WaitTime) / this._FadeTime;
                if (alpha_rate > 1.0) {
                    alpha_rate = 1.0;
                }
                this._Splash[this._Sheets - 1].alpha = alpha_rate;
            }
        }

        if (this._GoToTitle || Input.isTriggered('ok')) {
            AudioManager.stopBgm();
            this.gotoTitleOrTest();
        }
        Scene_Base.prototype.update.call(this);
    };

    Scene_Opening.prototype.centerSprite = function (sprite) {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    };

    Scene_Opening.prototype.gotoTitleOrTest = function () {
        Scene_Base.prototype.start.call(this);
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        } else if (DataManager.isEventTest()) {
            DataManager.setupEventTest();
            SceneManager.goto(Scene_Map);
        } else {
            this.checkPlayerLocation();
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Title);
            Window_TitleCommand.initCommandPosition();
        }
        this.updateDocumentTitle();
    };

    Scene_Opening.prototype.updateDocumentTitle = function () {
        document.title = $dataSystem.gameTitle;
    };

    Scene_Opening.prototype.checkPlayerLocation = function () {
        if ($dataSystem.startMapId === 0) {
            throw new Error('Player\'s starting position is not set');
        }
    };
})();