//=============================================================================
// K_OriginalMenuScreen.js
//=============================================================================

/*:
 * @plugindesc メニュー画面をオリジナルのものに変更します。
 * @author Kota (http://www.nine-yusha.com/)
 *
 * @param Add_LocationInfo
 * @desc 現在のマップ名・プレイ時間の表示設定です。
 * 0: 表示しない、1: 表示する
 * @default 1
 *
 * @param Information_item
 * @desc 「アイテム」コマンドの説明文です。
 * @default 入手したアイテムを使用します。
 *
 * @param Information_skill
 * @desc 「スキル」コマンドの説明文です。
 * @default 習得したスキルを使用します。
 *
 * @param Information_equip
 * @desc 「装備」コマンドの説明文です。
 * @default 装備を変更します。
 *
 * @param Information_statAllocate
 * @desc 「能力強化」コマンドの説明文です。
 * @default 能力強化画面を開きます。
 *
 * @param Information_status
 * @desc 「ステータス」コマンドの説明文です。
 * @default ステータスを確認します。
 * 
 * @param Information_glossary1
 * @desc 「冒険手帳」の説明文です。
 * @default 冒険に役立つ情報を確認します。
 * 
 * @param Information_formation
 * @desc 「陣形」コマンドの説明文です。
 * @default 陣形画面を開きます。
 * 
 * @param Information_materia
 * @desc 「メモリア」コマンドの説明文です。
 * @default メモリア画面を開きます。
 *
 * @param Information_options
 * @desc 「オプション」コマンドの説明文です。
 * @default オプション画面を開きます。
 *
 * @param Information_save
 * @desc 「セーブ」コマンドの説明文です。
 * @default これまでのデータをセーブします。
 *
 * @param Information_load
 * @desc 「ロード」コマンドの説明文です。
 * @default これまでのデータをロードします。
 *
 * @help このプラグインには、プラグインコマンドはありません。

 メニュー画面に、下記の項目を追加します。
 ・インフォメーションウィンドウ
 ・現在のマップ名
 ・現在のプレイ時間

 利用規約:
   ・著作権表記は必要ございません。
   ・利用するにあたり報告の必要は特にございません。
   ・商用・非商用問いません。
   ・R18作品にも使用制限はありません。
   ・ゲームに合わせて自由に改変していただいて問題ございません。
   ・プラグイン素材としての再配布（改変後含む）は禁止させていただきます。

 ライセンスについての詳細は下記をご確認ください。
 https://nine-yusha.com/plugin/

 作者: ルルの教会
 作成日: 2020/10/13
*/

(function () {

	var parameters = PluginManager.parameters('K_OriginalMenuScreen');
	var Add_LocationInfo = Number(parameters['Add_LocationInfo'] || 1);
	var Information_Msg = {
		'item': String(parameters['Information_item'] || '入手したアイテムを使用します。'),
		'skill': String(parameters['Information_skill'] || '習得したスキルを確認します。'),
		'equip': String(parameters['Information_equip'] || '武器や防具などを装着します。'),
		'class': String(parameters['Information_class'] || '職業を変更します。戦闘を重ねることで職業が成長します。'),
		'status': String(parameters['Information_status'] || 'ステータスを確認します。'),
		'EQS': String(parameters['Information_EQS'] || '職業の変更やアビリティの装着を行います。'),
		'materia': String(parameters['Information_materia'] || 'メモリアを装着し、武器を強化します。'),
		'skilltree': String(parameters['Information_skilltree'] || 'アビリティを習得し、強化します。'),
		'statAllocate': String(parameters['Information_statAllocate'] || 'ステータスを強化します。'),
		'glossary1': String(parameters['Information_glossary1'] || '冒険に役立つ情報や回想、性経験を確認します。'),
		'formation': String(parameters['Information_formation'] || 'キャラクターの隊列を変更します。'),
		'options': String(parameters['Information_options'] || 'オプション画面を開きます。'),
		'battleFormation': String(parameters['Information_battleFormation'] || '陣形を選択することで、特殊な効果が得られます。'),
		'save': String(parameters['Information_save'] || 'これまでのデータを保存します。'),
		'load': String(parameters['Information_load'] || '保存したデータを読み込みます。'),
		'parent\\I[850] システム0': String(parameters['Information_parent\\I[850] システム0'] || 'データの保存、読み込み、オプションの変更などを行います。'),
		'parent\\I[893] 育成0': String(parameters['Information_parent\\I[893] 育成0'] || '職業の変更や能力の強化、アビリティの装着を行います。'),
		'parent\\I[883] 編成0': String(parameters['Information_parent\\I[883] 編成0'] || '並び替えや陣形の変更をします。'),
	}

	var _Scene_Menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function () {
		_Scene_Menu_create.call(this);
		// インフォメーションウィンドウの追加
		this.createInformationWindow();
		// コマンドウィンドウとステータスウィンドウを下にずらす
		this._commandWindow.y = this._informationWindow.height;
		this._statusWindow.y = this._informationWindow.height;
		this._statusWindow.height -= this._informationWindow.height;
	};

	Scene_Menu.prototype.createInformationWindow = function () {
		this._informationWindow = new Window_Information();
		this.addWindow(this._informationWindow);
	};

	var _Scene_Menu_update = Scene_Menu.prototype.update;
	Scene_Menu.prototype.update = function () {
		_Scene_Menu_update.call(this);
		// インフォメーションウィンドウの更新
		this._informationWindow.setText(Information_Msg[this._commandWindow.currentSymbol()]);
	};

	var _Window_MenuStatus_drawItemImage = Window_MenuStatus.prototype.drawItemImage;
	Window_MenuStatus.prototype.drawItemImage = function (index) {
		var actor = $gameParty.members()[index];
		var rect = this.itemRect(index);
		this.changePaintOpacity(actor.isBattleMember());
		// ステータスウィンドウの高さに合わせ顔グラフィックの高さを縮める (heightが516px時のみ)
		if (this.height == 516) {
			this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight - 24);
		} else {
			this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
		}
		this.changePaintOpacity(true);
	};

	//-----------------------------------------------------------------------------
	// Window_Information
	//

	function Window_Information() {
		this.initialize.apply(this, arguments);
	}

	Window_Information.prototype = Object.create(Window_Base.prototype);
	Window_Information.prototype.constructor = Window_Information;

	Window_Information.prototype.initialize = function () {
		var width = Graphics.boxWidth;
		var height = (Add_LocationInfo == 1) ? this.fittingHeight(2) : this.fittingHeight(1);
		//var height = this.fittingHeight(2);
		Window_Base.prototype.initialize.call(this, 10, 0, width, height);
		this._text = '';
	};

	Window_Information.prototype.setText = function (text) {
		//if (this._text !== text) {
		this._text = text;
		this.refresh();
		//}
	};

	Window_Information.prototype.clear = function () {
		this.setText('');
	};

	Window_Information.prototype.refresh = function () {
		this.contents.clear();
		if (Add_LocationInfo == 1) {
			this.drawTextEx(this._text, this.textPadding(), this.fittingHeight(0));
			// マップ名
			this.drawIcon(605, 1, 1);
			this.changeTextColor(this.systemColor());
			this.drawText('Location', 32 + this.textPadding(), -3, 140, 'left');
			this.resetTextColor();
			this.drawText($gameMap.displayName(), 172 + this.standardPadding(), -3, 280, 'left');

			// プレイ時間
			this.drawIcon(590, 420, 1);
			this.changeTextColor(this.systemColor());
			this.drawText('PlayTime', 435 + this.standardPadding(), -3, 250, 'left');
			this.resetTextColor();
			this.drawText($gameSystem.playtimeText(), 620 + this.standardPadding(), -3, 112, 'left');

			// 所持金
			this.changeTextColor(this.systemColor());
			this.drawIcon(591, 790, 1);
			this.drawText('Rill', 808 + this.standardPadding(), -3, 250, 'left');
			this.resetTextColor();
			this.drawText($gameParty.gold(), 830 + this.standardPadding(), -3, 190, 'right');

			// ダイスの数
			this.changeTextColor(this.systemColor());
			this.drawIcon(87, 790, 42);
			this.drawText('Dice', 808 + this.standardPadding(), 35, 250, 'left');
			this.resetTextColor();
			this.drawText($gameVariables.value(9), 830 + this.standardPadding(), 35, 190, 'right');

		} else {
			this.drawTextEx(this._text, this.textPadding(), 0);
		}
	};

})();
