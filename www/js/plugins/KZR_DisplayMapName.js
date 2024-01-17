//=============================================================================
// KZR_DisplayMapName.js
// Version : 1.01
// -----------------------------------------------------------------------------
// [Homepage]: かざり - ホームページ名なんて飾りです。偉い人にはそれがわからんのですよ。 -
//             http://nyannyannyan.bake-neko.net/
// -----------------------------------------------------------------------------
// [Version]
// 1.01 2017/01/07 ロード時にマップ名を表示するように
// 1.00 2017/01/06 公開
//=============================================================================

/*:
 * @plugindesc 現在と同名のマップに移動した際、マップ名を表示しません。
 * @author ぶちょー
 *
 * @help
 * プラグインコマンドはありません。
 */

//-----------------------------------------------------------------------------
// Scene_Map
//
var _kzr_DMN_Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function () {
  _kzr_DMN_Scene_Map_start.call(this);
  this._mapNameWindow.open();
};

//-----------------------------------------------------------------------------
// Window_MapName
//
var _kzr_DMN_Window_MapName_open = Window_MapName.prototype.open;
Window_MapName.prototype.open = function () {
  if ($gameMap.displayName() !== $gameTemp._kzr_displayName) {
    _kzr_DMN_Window_MapName_open.call(this);
    $gameTemp._kzr_displayName = $gameMap.displayName();
  }
};

//-----------------------------------------------------------------------------
// Game_Temp
//
var _kzr_DMN_Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function () {
  _kzr_DMN_Game_Temp_initialize.call(this);
  this._kzr_displayName = "";
};
