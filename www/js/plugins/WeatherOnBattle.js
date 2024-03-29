//=============================================================================
// WeatherOnBattle.js
//=============================================================================
/*:
 * @plugindesc display weather not only map but also battle
 * @author Sasuke KANNAZUKI
 * *
 * @help This plugin does not provide plugin commands.
 *
 * This plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */
/*:ja
 * @plugindesc 戦闘中も天候アニメを表示します
 * @author 神無月サスケ
 * *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */
(function () {
  var _Spriteset_Battle_createLowerLayer =
    Spriteset_Battle.prototype.createLowerLayer;
  Spriteset_Battle.prototype.createLowerLayer = function () {
    _Spriteset_Battle_createLowerLayer.call(this);
    Spriteset_Map.prototype.createWeather.call(this);
  };

  var _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
  Spriteset_Battle.prototype.update = function () {
    _Spriteset_Battle_update.call(this);
    this.updateWeather();
  };

  Spriteset_Battle.prototype.updateWeather = function () {
    this._weather.type = $gameScreen.weatherType();
    this._weather.power = $gameScreen.weatherPower();
  };
})();
