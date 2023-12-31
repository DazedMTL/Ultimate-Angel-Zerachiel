//=============================================================================
// Mano_GamePadConfig.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2017 Sigureya
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 0.9.0 2017/04/13 初版 
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/Sigureya/
//=============================================================================


/*:
 * @plugindesc ゲームパッドの設定を変更するプラグインです。
 * ユーザーが入力を拡張する場合の補助も行います
 * @author しぐれん
 * 
 *
 * @param defaultGamepadMapper
 * @desc ゲーム初期時のボタン配置です。
 * 「初期設定に戻す」を押した場合、これが読み込まれます。
 * @type select
 * @option ツクールMVデフォルト
 * @value 0
 * @option MVデフォルト＋決定/キャンセル入れ替え
 * @value 1
 * @default 1
 * 
 * @param textApply
 * @desc 設定を適用するコマンドです。
 * 選択するとコンフィグが終了します。
 * @default 設定を保存
 * @parent text
 * 
 * @param textRollback
 * @desc コンフィグ開始前の状態に戻すコマンドです。
 * @default 変更前に戻す
 * 
 * @param textDefault
 * @desc 初期設定に戻すコマンドです。
 * @default 初期設定に戻す
 * 
 * @param textExit
 * @desc コンフィグを終了するときのコマンドです。
 * @default やめる
 * 
 * @param textEmpty
 * @desc 何も割り当てられていない時の説明
 * Explanation when no function is assigned
 * @default 設定を消去
 * @parent text
 * 
 * @param textOK
 * @desc okの機能の説明
 * Description of ok's function
 * @default 決定
 * @parent text
 * 
 * @param textCancel
 * @desc cancelの機能の説明
 * Description of cancel function
 * @default 取り消し
 * @parent text
 * 
 * @param textShift
 * @desc shiftの機能の説明
 * Description of shift function
 * @default ダッシュ
 * @parent text
 * 
 * @param textMenu
 * @desc menuの機能の説明
 * @default メニュー
 * @parent text
 * 
 * @param textPageup
 * @desc pageupの機能の説明
 * @default 前
 * @parent text
 * 
 * @param textPagedown
 * @desc pagedownの機能の説明
 * @default 次
 * @parent text
 * 
 * @param textSymbol6
 * @desc ユーザー拡張アクション6の説明
 * ※6なのは、既存の機能を0から数えているためです。
 * @default アクション6
 * 
 * @param extendSymbol6
 * @desc ユーザー拡張アクション6です。
 * Input.pressed('ここで設定した文字')で入力を取得できます。
 * @parent textSymbol6
 * 
 * @param textSymbol7
 * @desc ユーザー拡張アクション7の説明
 * @default アクション7
 * 
 * @param extendSymbol7
 * @desc ユーザー拡張アクション7です。
 * Input.pressed('ここで設定した文字')で入力を取得できます。
 * @parent textSymbol7
 * 
 * @param textSymbol8
 * @desc ユーザー拡張アクション8の説明
 * @default アクション8
 * @param extendSymbol8
 * @desc ユーザー拡張アクション8です。
 * Input.pressed('ここで設定した文字')で入力を取得できます。
 * @parent textSymbol8
 * 
 * 
 * @param symbols
 * @desc コンフィグでの変更先の一覧です。
 * ユーザー定義のコマンドも混ぜることができます。
 * @default ["ok","cancel","shift","menu","pageup","pagedown"]
 * @type combo[]
 * @option ok
 * @option cancel
 * @option shift
 * @option menu
 * @option pageup
 * @option pagedown
 * 
 * @param mandatorySymbols
 * @desc 必須シンボルです。
 * これらのシンボル全てがある場合のみ、変更を保存できます。
 * @type combo[]
 * @option ok
 * @option cancel
 * @option shift
 * @option menu
 * @option pageup
 * @option pagedown
 * @default ["ok","cancel","menu"]
 * 
 * @param buttons
 * @desc 使用できるボタンの一覧です。
 * 並び順の制御を兼ねています。
 * @type number[]
 * @default ["1","0","3","2","4","5","6","7","8","9","10","11","16"]
 * 
 * @param button0
 * @desc PS2コントローラ：×
 * @default {"buttonName":"B","action":""} 
 * @type struct<ButtonInfo>
 * @parent buttons
 * 
 * @param button1
 * @desc PS2コントローラ:〇
 * @type struct<ButtonInfo>
 * @default {"buttonName":"A","action":""}
 * @parent buttons
 * 
 * @param button2
 * @desc PS2コントローラ：□
 * @type struct<ButtonInfo>
 * @default {"buttonName":"Y","action":""}
 * @parent buttons
 * 
 * @param button3
 * @desc PS2コントローラ：△
 * @type struct<ButtonInfo>
 * @default {"buttonName":"X","action":""}
 * @parent buttons
 * 
 * @param button4
 * @desc PS2コントローラ：L1
 * @type struct<ButtonInfo>
 * @default {"buttonName":"L1","action":""}
 * @parent buttons
 * 
 * @param button5
 * @desc PS2コントローラ：R1
 * @type struct<ButtonInfo>
 * @default {"buttonName":"R1","action":""}
 * @parent buttons
 * 
 * @param button6
 * @desc PS2コントローラ：L2
 * @type struct<ButtonInfo>
 * @default {"buttonName":"L2","action":""}
 * @parent buttons
 * 
 * @param button7
 * @desc PS2コントローラ：R2
 * @type struct<ButtonInfo>
 * @default {"buttonName":"R2","action":""}
 * @parent buttons
 * 
 * @param button8
 * @desc PS2コントローラ：select
 * @type struct<ButtonInfo>
 * @default {"buttonName":"select","action":""}
 * @parent buttons
 * 
 * @param button9
 * @desc PS2コントローラ：start
 * @type struct<ButtonInfo>
 * @default {"buttonName":"start","action":""}
 * @parent buttons
 * 
 * @param button10
 * @desc PS2コントローラ：
 * @type struct<ButtonInfo>
 * @default {"buttonName":"button10","action":""}
 * @parent buttons
 * 
 * @param button11
 * @desc PS2コントローラ：
 * @type struct<ButtonInfo>
 * @default {"buttonName":"button11","action":""}
 * @parent buttons
 * 
 * @param moveButtons
 * @desc 十字キーをコンフィグ範囲に含めます。
 * 自動的に上下左右が必須ボタンに追加されます。
 * @type boolean
 * @default false
 * 
 * @param button12
 * @desc 上キー/UP_BUTTON
 * @type struct<ButtonInfo>
 * @default {"buttonName":"UP","action":""}
 * @parent moveButtons
 * 
 * @param textUp
 * @desc 上ボタンの説明
 * @default ↑
 * @parent moveButtons
 * 
 * @param button13
 * @desc 下キー/DOWN_BUTTON
 * @type struct<ButtonInfo>
 * @default {"buttonName":"DOWN","action":""}
 * @parent moveButtons
 * 
 * @param textDown
 * @desc 下ボタンの説明
 * Description of ok's function
 * @default ↓
 * @parent moveButtons
 * 
 * @param button14
 * @desc 左キー/LEFT_BUTTON
 * @type struct<ButtonInfo>
 * @default {"buttonName":"LEFT","action":""}
 * @parent moveButtons
 * 
 * @param textLeft
 * @desc 左の説明
 * @default ←
 * @parent moveButtons
 * 
 * @param button15
 * @desc 右キー/RIGHT_BUTTON
 * @type struct<ButtonInfo>
 * @default {"buttonName":"RIGHT","action":""}
 * @parent moveButtons
 * 
 * @param textRight
 * @desc 右の説明
 * @default →
 * @parent moveButtons
 * 
 * @param button16
 * @desc PS2コントローラ：
 * @type struct<ButtonInfo>
 * @default {"buttonName":"button16","action":""}
 * @parent buttons
 * @param button_unknow
 * 
 * @param windowPositionMode
 * @desc ウィンドウの位置
 * @type boolean
 * @on 中央
 * @off 数値指定
 * @default true
 * 
 * @param windowPositionX
 * @desc ウィンドウのX座標です。
 * @type number
 * @default 0
 * @parent windowPositonMode
 * 
 * @param windowPositionY
 * @desc ウィンドウのY座標です。
 * @type number
 * @default 0
 * @parent windowPositonMode
 * 
 * @param numVisibleRows
 * @desc 表示する縦方向の要素数です
 * @type number
 * @default 16
 * 
 * @param symbolAutoSelect
 * @desc キーに対応するシンボルを切り替えるときに、
 * そのキーに設定されているシンボルへ自動でカーソルを合わせます。
 * @type boolean
 * @on シンボルに合わせる
 * @off 先頭に合わせる
 * @default true
 * 
 * @param commandName
 * @desc
 * @type string
 * @default ゲームパッド
 * 
 * @param hookPoint
 * @desc ゲームパッドコンフィグの開き方を設定します。
 * @type select
 * @option オプション画面から開く
 * @value option
 * @option タイトル/メニューから開く
 * @value menu
 * @default option
 * 
 * @help
 * プラグインで設定したデータをデフォルトとして使います。
 * また、オススメカスタムがプラグイン本体に書いてあります。
 * ■extendActions
 * 定義することで、新たなアクションを定義できます。
 * ここにKeyと入力した場合、Input.presed('Key')で入力を取得できます。
 * ※API調整中です。仕様変更の可能性があります。
 * 
 * ■symbolsについて
 * ボタン選択画面で決定を押した後の一覧で表示する順番を定義します。
 * 
 * ■mandatorySymbolsについて
 * ゲームを操作するうえで、必須となるボタンの一覧です。
 * 決定や取り消しの設定を変更してゲームが動かなくなると困るので、
 * 一部のボタンが欠けている状態では設定の保存ができません。
 * 初期設定では決定・取り消し・メニューの3つが割り当てられています。
 * 
 * ■ボタンの第2パラメータ・actionについて
 * 本来はsymbolになるはずだったデータです。
 * デフォルトの設定に加えて、
 * ここに設定した内容を上書きで追加した物が初期設定になります。
 * 
 * ■新規シンボルの設定について
 * ゲーム固有の操作を設定する場合、ここで行います。
 * たとえば弾を発射するshotというシンボルを新たに設定したいとします。
 * この場合textSymbol6で「シンボルの説明」を設定します。
 * 次にextendSymbol6に「shot」と入力します。
 * 次にsymbolsにshotを追加します。
 * ゲーム中常に使うのであれば、mandatorySymbolsにも追加します。
 * これをすべて終えれば、input.pressed('shot')などで
 * 入力状態を取得できるようになります。
 * 
 * 更新履歴
 * 2017/10/05 ver 1.0　公開
*/
/**
 * TODO:適当にボタンを押させて、対応したボタンの部分にカーソル合わせる機能
 * 仕様を変えて、ガチャガチャ押して入力状態を表示するヤツ
 * 
 */
/*~struct~ButtonInfo:
 *
 * @param buttonName
 * @desc ボタンの名前
 * 
 * @param action
 * @desc 割り当てる機能
 * @type combo
 * @option ok
 * @option cancel
 * @option shift
 * @option menu
 * @option pageup
 * @option pagedown
 * @default 
 */


(function () {
    'use strict'

    /**
     * @param {*} param 
     */
    function fetchButtonInfo(param) {
        const p = JSON.parse(param);
        return { buttonName: String(p.buttonName), symbol: String(p.action) };
    }
    /**
     * @return {String[]}
     */
    function paramToActionKeys(params) {
        const array = JSON.parse(params.symbols);
        array.push(null);
        return array;
    }

    const moveSymbols = ['up', 'down', 'left', 'right']
    /**
     * @return {string[]}
     */
    function createMandatorySymbols(params) {
        return JSON.parse(params.mandatorySymbols);
        return array;
    }

    function insertExtendAction(helpText, params) {
        for (var i = 6; i <= 8; ++i) {
            var actionKey = String(params['extendSymbol' + i]);
            if (actionKey) {
                helpText[actionKey] = helpText['symbol' + i];
            }
        }
    }
    /**
     * @return {String[]}
     * @param {any} params 
     */
    function createButtonList(params) {
        return JSON.parse(params.buttons);
    }
    function makeConfigSamples() {
        const RPGmakerDefault = Object.assign({}, Input.gamepadMapper);
        const ab_swaped = Object.assign({}, Input.gamepadMapper);
        ab_swaped[0] = RPGmakerDefault[1];
        ab_swaped[1] = RPGmakerDefault[0];
        return [RPGmakerDefault, ab_swaped];
    }

    function createSetting() {

        const params = PluginManager.parameters('Mano_GamePadConfig');
        const helpText = {
            ok: String(params.textOK),
            cancel: String(params.textCancel),
            shift: String(params.textShift),
            menu: String(params.textMenu),
            pageup: String(params.textPageup),
            pagedown: String(params.textPagedown),
            symbol6: String(params.textSymbol6),
            symbol7: String(params.textSymbol7),
            symbol8: String(params.textSymbol8),
            up: String(params.textUp),
            down: String(params.textDown),
            left: String(params.textLeft),
            right: String(params.textRight),
        };
        const commandText = {
            apply: String(params.textApply),
            rollback: String(params.textRollback),
            default_: String(params.textDefault),
            exit: String(params.textExit),
        };

        insertExtendAction(helpText, params);

        const buttonInfo = {
            0: fetchButtonInfo(params.button0),
            1: fetchButtonInfo(params.button1),
            2: fetchButtonInfo(params.button2),
            3: fetchButtonInfo(params.button3),
            4: fetchButtonInfo(params.button4),
            5: fetchButtonInfo(params.button5),
            6: fetchButtonInfo(params.button6),
            7: fetchButtonInfo(params.button7),
            8: fetchButtonInfo(params.button8),
            9: fetchButtonInfo(params.button9),
            10: fetchButtonInfo(params.button10),
            11: fetchButtonInfo(params.button11),
            12: fetchButtonInfo(params.button12),
            13: fetchButtonInfo(params.button13),
            14: fetchButtonInfo(params.button14),
            15: fetchButtonInfo(params.button15),
            16: fetchButtonInfo(params.button16),
        };
        const configSamples = makeConfigSamples(buttonInfo);
        for (var key in buttonInfo) {
            const x = buttonInfo[key];
            if (x.symbol) {
                configSamples.forEach(function (sample) {
                    sample[key] = x.symbol;
                });
            }
        }
        const result = {
            commandText: commandText,
            emptySymbolText: String(params.textEmpty),
            actionKey: paramToActionKeys(params),
            symbolText: helpText,
            buttonInfo: buttonInfo,
            buttonList: createButtonList(params),
            mandatorySymbols: createMandatorySymbols(params),
            symbolAutoSelect: (params.symbolAutoSelect === 'true'),
            configSamples: configSamples,
            configIndex: Number(params.defaultGamepadMapper),
            windowSymbolListWidht: Number(params.windowSymbolListWidth),
            hookPoint: String(params.hookPoint),
            commandName: String(params.commandName),

            moveButtonsConfig: (params.moveButtons === 'true'),

            windowPostionMode: (params.windowPositionMode === 'true'),
            windowCustom: {
                x: Number(params.windowPositionX),
                y: Number(params.windowPositionY),
            },
            numVisibleRows: Number(params.numVisibleRows),

        };
        if (result.moveButtonsConfig) {
            Array.prototype.push.apply(result.mandatorySymbols, moveSymbols);
            Array.prototype.push.apply(result.actionKey, moveSymbols);
            Array.prototype.push.apply(result.buttonList, ['12', '13', '14', '15']);
        }

        return result;
    };

    /**
     * 
     * @param {String} symbol 
     * @return {string}
     */
    function symbolToText(symbol) {
        return setting.symbolText[symbol];
    };

    /**
     * @return {string}
     * @param {number} buttonNumber 
     */
    function buttonName(buttonNumber) {
        return setting.buttonInfo[buttonNumber].buttonName;
    }
    /**
     * @return {string}
     * @param {number} buttonNumber 
     */
    function buttonAction(buttonNumber) {
        return Input.gamepadMapper[buttonNumber];
    };

    //ツクールのデフォルトと同様の設定です
    function RPGmakerDefault() {
        return Object.assign({}, setting.configSamples[setting.configIndex]);
    }

    function createGamepadMapper() {
        const index = setting.configIndex;
        return setting.configSamples[index];
    };
    const setting = createSetting();
    Input.gamepadMapper = createGamepadMapper();

    const MA_GAMEPAD_CONFIG = 'GAMEPAD_CONFIG';
    function readGamePadConfig(config) {
        const value = config[MA_GAMEPAD_CONFIG];
        if (value) {
            return value;
        }
        return createGamepadMapper();
    }
    const ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        const result = ConfigManager_makeData.call(this);
        result[MA_GAMEPAD_CONFIG] = Input.gamepadMapper;
        return result;
    };
    const ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        ConfigManager_applyData.call(this, config);
        Input.gamepadMapper = readGamePadConfig(config);
        Input.clear();
    };
    class ButtonActionItem {
        /**
         * @param {number} buttonNumber 
         */
        constructor(buttonNumber) {
            this.actionKey = String(Input.gamepadMapper[buttonNumber]);
            this.name = String(buttonName(buttonNumber) || '');
            this.buttonNumber = buttonNumber;
        }
    };

    function Window_GamepadConfig_MA() {
        this.initialize.apply(this, arguments);
    }
    Window_GamepadConfig_MA.baseType = Window_Selectable;
    Window_GamepadConfig_MA.prototype = Object.create(Window_GamepadConfig_MA.baseType.prototype);
    Window_GamepadConfig_MA.prototype.constructor = Window_GamepadConfig_MA;

    Window_GamepadConfig_MA.prototype.initialize = function (x, y) {
        this.setGamepadMapper(Input.gamepadMapper);
        Window_GamepadConfig_MA.baseType.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
        this.defineNameWidth();
        this.defineSymbolTextWidth();
        this.readGamePad();
        this.moveCenter();
    };
    Window_GamepadConfig_MA.prototype.moveCenter = function () {
        this.width = this._nameWidth + this._symbolTextWidth + this.textPadding() * 2;

        if (setting.windowPostionMode) {
            this.x = (Graphics.boxWidth - this.width) / 2;
            this.y = (Graphics.boxHeight - this.height) / 2;
        } else {
            this.x = setting.windowCustom.x;
            this.y = setting.windowCustom.y;
        }
    };
    Window_GamepadConfig_MA.prototype._updateGamepadState = function (gamepad) {

    };

    Window_GamepadConfig_MA.prototype.readGamePad = function () {
        if (navigator.getGamepads) {
            var gamepads = navigator.getGamepads();
            if (gamepads) {
                var gamepad = gamepads[1];
                if (gamepad && gamepad.connected) {
                    this._updateGamepadState(gamepad);
                }
            }
        }
    };

    Window_GamepadConfig_MA.prototype.callExitHandler = function () {
        this.callHandler('exit');
    };
    Window_GamepadConfig_MA.prototype.callApplyHandler = function () {
        this.callHandler('apply');
    };
    Window_GamepadConfig_MA.prototype.processApply = function () {
        if (this.canApplySetting() && this.active) {
            this.updateInputData();
            this.deactivate();
            SoundManager.playEquip();
            this.callApplyHandler();
        } else {
            this.playBuzzerSound();
        }
    };

    Window_GamepadConfig_MA.prototype.callDefaultHandler = function () {
        this.callHandler('default');
    };

    Window_GamepadConfig_MA.prototype.processDefault = function () {
        this.updateInputData();
        this.deactivate();
        SoundManager.playEquip();
        this.callDefaultHandler();
    };

    Window_GamepadConfig_MA.prototype.processOk = function () {
        const index = this.index();
        if (index < 0) {
            return;
        }
        if (index === this.defaultCommandIndex()) {
            this.processDefault();
            return;
        }
        if (index === this.applyCommandIndex()) {
            this.processApply();
            return;
        }
        if (index === this.exitCommandIndex()) {
            SoundManager.playCancel();
            this.callCancelHandler();
            return;
        }
        this.updateInputData();
        this.deactivate();
        this.playOkSound();
        this.callOkHandler();
    };
    Window_GamepadConfig_MA.prototype.processCancel = function () {
        SoundManager.playCancel();
        this.updateInputData();
        const index = this.index();
        const cancellationIndex = this.exitCommandIndex();
        if (index === cancellationIndex) {
            this.callCancelHandler();
        } else {
            this.select(cancellationIndex);
        }
    };
    Window_GamepadConfig_MA.prototype.windowWidth = function () {
        return 450;
    };

    Window_GamepadConfig_MA.prototype.numVisibleRows = function () {
        return setting.numVisibleRows;
    };

    Window_GamepadConfig_MA.prototype.windowHeight = function () {
        return this.fittingHeight(this.numVisibleRows());
    };
    Window_GamepadConfig_MA.prototype.makeMandatorySymbolTable = function () {
        var table = {};
        for (var i = 0; i < setting.mandatorySymbols.length; ++i) {
            var symbol = setting.mandatorySymbols[i];
            table[symbol] = 0;
        }
        for (var key in this._map) {
            var symbol2 = this._map[key];
            if (table.hasOwnProperty(symbol2)) {
                table[symbol2] += 1;
            }
        }
        this._mandatorySymbols = table;
    };
    /**
     * @return {number}
     */
    Window_GamepadConfig_MA.prototype.configItems = function () {
        return this._list.length;
    };
    Window_GamepadConfig_MA.prototype.setGamepadMapper = function (map) {
        this._map = Object.assign({}, map);
        this.makeItemList();
    };
    Window_GamepadConfig_MA.prototype.cloneGamepadMapper = function () {
        return Object.assign({}, this._map);
    };
    /**
     * @param {string}  buttonNumber
     * @return {string} actionKey
     */
    Window_GamepadConfig_MA.prototype.getAction = function (buttonNumber) {
        return this._map[buttonNumber];
    };
    Window_GamepadConfig_MA.prototype.currentSymbol = function () {
        return this.symbol(this.index());
        return this._list[this.index()].action;
    };
    /**
     * @param {number} index
     * @return {string} buttonNumber
     */
    Window_GamepadConfig_MA.prototype.buttonNumber = function (index) {
        return this._list[index].buttonNumber;
    };
    /**
     * @param {number} index
     * @return {string} buttonName
     */
    Window_GamepadConfig_MA.prototype.buttonName = function (index) {
        return this._list[index].name;
    };
    /**
     * @param {number} index
     * @return {string} symbol
     */
    Window_GamepadConfig_MA.prototype.symbol = function (index) {
        const buttonNumber = this.buttonNumber(index);
        return this._map[buttonNumber];
    };
    /**
     * @param {number} index
     * @return {string} symbol
     */
    Window_GamepadConfig_MA.prototype.symbolText = function (index) {
        return symbolToText(this.symbol(index));
    };


    Window_GamepadConfig_MA.prototype.addCommand = function (buttonNumber_) {
        const index = this._list.length;
        this._list.push({
            name: buttonName(buttonNumber_),
            buttonNumber: buttonNumber_
        });
        this.setButtonItem(index, buttonNumber_);
    };

    Window_GamepadConfig_MA.prototype.setButtonItem = function (index, buttonNumber) {
        const action = this.getAction(buttonNumber);
        const text = symbolToText(action) || '';
        const item = this._list[index];
        item.action = action;
        item.text = text;
    };
    Window_GamepadConfig_MA.prototype.makeItemList = function () {
        this._list = [];
        const length = setting.buttonList.length;
        for (var i = 0; i < length; i += 1) {
            var buttonId = setting.buttonList[i];
            this.addCommand(buttonId);
        }
    };
    Window_GamepadConfig_MA.prototype.defineSymbolTextWidth = function () {
        var width = 0;
        for (var key in setting.symbolText) {
            width = Math.max(width, this.textWidth(setting.symbolText[key]));
        }
        this._symbolTextWidth = width;
    };
    /**
     * @return {number}
     */
    Window_GamepadConfig_MA.prototype.symbolTextWidth = function () {
        return this._symbolTextWidth;
    };

    Window_GamepadConfig_MA.prototype.defineNameWidth = function () {
        var width = 0;
        for (var i = 0; i < this._list.length; ++i) {
            width = Math.max(width, this.textWidth(this.buttonName(i)));
        }
        this._nameWidth = width;
    };
    /**
     * @return {number}
     */
    Window_GamepadConfig_MA.prototype.nameWidth = function () {
        return this._nameWidth;
    };
    /**
     * @param {number} index
     */
    Window_GamepadConfig_MA.prototype.changeKeyMap = function (index, newSymbol) {
        const buttonNumber = this.buttonNumber(index);
        this._map[buttonNumber] = newSymbol;
        this.redrawItem(index);
        this.redrawApplyCommand();
    };
    Window_GamepadConfig_MA.prototype.drawAllItems = function () {
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this._list.length) {
                this.drawItem(index);
            }
        }
        this.drawExitCommand();
        this.drawApplyCommand();
        this.drawDefaultCommand();
    };

    Window_GamepadConfig_MA.prototype.drawItem = function (index) {
        this.changeTextColor(this.normalColor());
        const item = this.item(index);
        const rect = this.itemRectForText(index);
        this.drawText(this.buttonName(index), rect.x, rect.y);
        const nameWidth = this.nameWidth();
        const symbolWidth = rect.width - nameWidth;
        this.drawText(this.symbolText(index), rect.x + nameWidth + this.textPadding(), rect.y, symbolWidth);
    };
    Window_GamepadConfig_MA.prototype.hasSymbol = function (symbol) {
        for (var key in this._map) {
            if (this._map[key] === symbol) {
                return true;
            }
        }
        return false;
    };

    Window_GamepadConfig_MA.prototype.canApplySetting = function () {
        for (var i = 0; i < setting.mandatorySymbols.length; ++i) {
            var symbol = setting.mandatorySymbols[i];
            if (!this.hasSymbol(setting.mandatorySymbols[i])) {
                return false;
            }
        }
        return true;
    };
    Window_GamepadConfig_MA.prototype.exitCommandIndex = function () {
        return this._list.length + 2;
    };
    Window_GamepadConfig_MA.prototype.applyCommandIndex = function () {
        return this._list.length + 1;
    };
    Window_GamepadConfig_MA.prototype.defaultCommandIndex = function () {
        return this._list.length;
    };
    Window_GamepadConfig_MA.prototype.redrawApplyCommand = function () {

        this.clearItem(this.applyCommandIndex());
        this.drawApplyCommand();
    };

    Window_GamepadConfig_MA.prototype.drawDefaultCommand = function () {
        const index = this.defaultCommandIndex();
        const rect = this.itemRectForText(index);
        this.drawText(setting.commandText.default_, rect.x, rect.y, rect.width);
    };

    Window_GamepadConfig_MA.prototype.drawExitCommand = function () {
        const index = this.exitCommandIndex();
        const rect = this.itemRectForText(index);
        this.drawText(setting.commandText.exit, rect.x, rect.y, rect.width);
    };

    Window_GamepadConfig_MA.prototype.drawApplyCommand = function () {
        const ok = this.canApplySetting();
        const index = this.applyCommandIndex();
        this.changePaintOpacity(ok);
        const rect = this.itemRectForText(index);
        this.drawText(setting.commandText.apply, rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
    };
    //  Window_GamepadConfig_MA.prototype.maxRows =function(){
    //      return 8;
    //  };


    Window_GamepadConfig_MA.prototype.maxItems = function () {
        return this._list.length + 3;
    };

    /**
     * @param {number} index
     * @return {ButtonActionItem}
     */
    Window_GamepadConfig_MA.prototype.item = function (index) {
        const item = this._list[index]
        if (item) {
            return item;
        }
        return null;
    };

    function Window_InputSymbolList() {
        this.initialize.apply(this, arguments);
    }
    Window_InputSymbolList.baseType = Window_Selectable.prototype;
    Window_InputSymbolList.prototype = Object.create(Window_InputSymbolList.baseType);
    Window_InputSymbolList.prototype.constructor = Window_InputSymbolList;

    /**
     * @param {Window_GamepadConfig_MA} mainWidnow
     */
    Window_InputSymbolList.prototype.initialize = function (mainWindow) {
        this.makeCommandList();
        const x = mainWindow.x + mainWindow.width;
        const y = mainWindow.y;
        const width = mainWindow.symbolTextWidth() + this.textPadding() * 2;
        const height = this.windowHeight();
        Window_InputSymbolList.baseType.initialize.call(this, x, y, width, height);
        this.deactivate();
        this.deselect();
    };

    /**
     * @return {String}
     */
    Window_InputSymbolList.prototype.symbol = function () {
        return this.currentItem().symbol;
    };

    Window_InputSymbolList.prototype.windowHeight = function () {
        return this.fittingHeight(this.maxItems());
    };
    Window_InputSymbolList.prototype.maxItems = function () {
        return this._list.length;

    };
    Window_InputSymbolList.prototype.findSymbol = function (symbol) {
        for (var i = 0; i < this._list.length; ++i) {
            if (this._list[i].symbol === symbol) {
                return i;
            }
        }
        return -1;
    };

    Window_InputSymbolList.prototype.selectSymbol = function (action) {
        const index = this.findSymbol(action);
        if (this._list[index]) {
            this.select(index);
        } else {
            this.select(0);
        }
    };
    /**
     * @param {string} name
     * @param {string} symbol
     */
    Window_InputSymbolList.prototype.addCommand = function (name, symbol, ext) {
        if (ext === undefined) {
            ext = null;
        }
        this._list.push({
            name: name,
            symbol: symbol,
            ext: ext
        });
    };
    Window_InputSymbolList.prototype.symbol = function (index) {
        return this._list[index].symbol;
    };
    Window_InputSymbolList.prototype.currentSymbol = function () {
        const index = this.index();
        if (index >= 0) {
            return this.symbol(index);
        }
        return null;
    };

    Window_InputSymbolList.prototype.makeCommandList = function () {
        this._list = [];
        for (var i = 0; i < setting.actionKey.length; ++i) {
            const actionKey = setting.actionKey[i];
            this.addCommand(symbolToText(actionKey) || setting.emptySymbolText, actionKey, 'テスト' + i);
        }
    };
    /**
     * @param {number} index
     * @return {string}
     */
    Window_InputSymbolList.prototype.symbolName = function (index) {
        return this._list[index].name;
    };

    Window_InputSymbolList.prototype.drawItem = function (index) {
        const rect = this.itemRectForText(index);
        this.drawText(this.symbolName(index), rect.x, rect.y, rect.width)
    };

    Window_InputSymbolList.prototype.callOkHandler = function () {
        Window_InputSymbolList.baseType.callOkHandler.call(this);
    };

    function Scene_GamepadConfigMA() {
        this.initialize.apply(this, arguments);
    }
    Scene_GamepadConfigMA.baseType = Scene_MenuBase.prototype;
    Scene_GamepadConfigMA.prototype = Object.create(Scene_GamepadConfigMA.baseType);
    Scene_GamepadConfigMA.prototype.constructor = Scene_GamepadConfigMA;

    Scene_GamepadConfigMA.prototype.initialize = function () {
        Scene_GamepadConfigMA.baseType.initialize.apply(this, arguments);
    };
    /**
     * @param {object} [gamepadMapper=null] 読み込むコンフィグデータ 無指定の場合、現在の設定値を読み込む
     */
    Scene_GamepadConfigMA.prototype.setGamepadMapper = function (gamepadMapper) {
        if (this._gamepadWindow) {
            this._gamepadWindow.setGamepadMapper(gamepadMapper);
            this._gamepadWindow.refresh();
        }
    };


    Scene_GamepadConfigMA.prototype.create = function () {
        Scene_GamepadConfigMA.baseType.create.call(this);
        this.createAllWindows();
    };
    Scene_GamepadConfigMA.prototype.createGamepadConfigWindow = function () {
        const gcw = new Window_GamepadConfig_MA(0, 0);
        gcw.select(0);
        gcw.setHandler('ok', this.onConfigOk.bind(this));
        gcw.setHandler('cancel', this.onConfigCancel.bind(this));
        gcw.setHandler('apply', this.applyGamepadConfig.bind(this));
        gcw.setHandler('default', this.loadDefautConfig.bind(this));
        this._gamepadWindow = gcw;
        gcw.refresh();

        this.addWindow(gcw);
    };
    /**
     * @return {Rectangle}
     */
    Scene_GamepadConfigMA.prototype.SymbolListWindowRect = function () {
        const x = this._gamepadWindow.x + this._gamepadWindow.width;
        return new Rectangle(x, this._gamepadWindow.y, 0, 0);
    };
    Scene_GamepadConfigMA.prototype.createSymbolListWindow = function () {
        const rect = this.SymbolListWindowRect();
        const asw = new Window_InputSymbolList(this._gamepadWindow);
        asw.setHandler('ok', this.onSymbolListOk.bind(this));
        asw.setHandler('cancel', this.endActionSelect.bind(this));
        asw.hide();
        asw.refresh();
        this.addWindow(asw);

        this._actionListWindow = asw;
    };
    Scene_GamepadConfigMA.prototype.onActionListCancel = function () {
        this.endActionSelect();
    };
    Scene_GamepadConfigMA.prototype.onSymbolListOk = function () {
        const index = this._gamepadWindow.index();

        const symbol = this._actionListWindow.currentSymbol();
        this._gamepadWindow.changeKeyMap(index, symbol);
        this.endActionSelect();
    };
    Scene_GamepadConfigMA.prototype.endActionSelect = function () {
        this._actionListWindow.deselect();
        this._actionListWindow.hide();
        this._gamepadWindow.activate();
    };
    Scene_GamepadConfigMA.prototype.selectActionKey = function () {
        const symbol = this._gamepadWindow.currentSymbol();
        this._actionListWindow.show();
        this._actionListWindow.activate();
        if (setting.symbolAutoSelect) {
            this._actionListWindow.selectSymbol(symbol);
        } else {
            this._actionListWindow.select(0);
        }
    };
    Scene_GamepadConfigMA.prototype.loadDefautConfig = function () {
        this.setGamepadMapper(createGamepadMapper());
        this._gamepadWindow.activate();
    };

    Scene_GamepadConfigMA.prototype.applyGamepadConfig = function () {
        const test = this._gamepadWindow.canApplySetting();
        if (!test) {
            throw (new Error('GamepadConfigが不正です'));
        }

        Input.gamepadMapper = this._gamepadWindow.cloneGamepadMapper();
        Input.clear();
        SceneManager.pop();
    };

    Scene_GamepadConfigMA.prototype.onConfigOk = function () {
        this.selectActionKey();
    };

    Scene_GamepadConfigMA.prototype.onConfigCancel = function () {
        SceneManager.pop();
    };
    Scene_GamepadConfigMA.prototype.createAllWindows = function () {
        this.createGamepadConfigWindow();
        this.createSymbolListWindow();
        this._gamepadWindow.activate();
    };


    if (setting.hookPoint === 'menu') {
        const Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
        Window_TitleCommand.prototype.makeCommandList = function () {
            Window_TitleCommand_makeCommandList.call(this);

            this.addCommand(setting.commandName, MA_GAMEPAD_CONFIG, true);
        };
        const Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow
        Scene_Title.prototype.createCommandWindow = function () {
            Scene_Title_createCommandWindow.call(this);
            this._commandWindow.setHandler(MA_GAMEPAD_CONFIG, this.commandGamepadConfig.bind(this));
        };
        Scene_Title.prototype.commandGamepadConfig = function () {
            this._commandWindow.close();
            SceneManager.push(Scene_GamepadConfigMA);
        };
    } else if (setting.hookPoint === 'option') {

        Window_Options.prototype.addGamepadOptions_MA = function () {
            this._gamepadOptionIndex = this._list.length;
            this.addCommand(setting.commandName, MA_GAMEPAD_CONFIG);
        };
        const Window_Options_processOk = Window_Options.prototype.processOk;
        Window_Options.prototype.processOk = function () {
            const index = this.index();
            if (index === this._gamepadOptionIndex) {
                this.playOkSound();
                SceneManager.push(Scene_GamepadConfigMA);
            } else {
                Window_Options_processOk.call(this);
            }
        };
        const Window_Options_makeCommandList = Window_Options.prototype.makeCommandList
        Window_Options.prototype.makeCommandList = function () {
            Window_Options_makeCommandList.call(this);
            this.addGamepadOptions_MA();
        };
        const Window_Options_statusText = Window_Options.prototype.statusText;
        Window_Options.prototype.statusText = function (index) {
            if (index === this._gamepadOptionIndex) {
                return '';
            }
            return Window_Options_statusText.call(this, index);
        }
    }
})();