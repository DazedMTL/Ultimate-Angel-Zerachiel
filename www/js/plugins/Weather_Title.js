/*:
 * @plugindesc Plugin to rain, storm or snow on Title Screen.
 * @author Kanji the Grass
 *
 * @help This plugin does not provide plugin commands.
 *
 * @param weatherType
 * @desc the type of weather (none/rain/storm/snow)
 * @default rain
 *
 * @param weatherPower
 * @desc to controll the power of weather. Enter number within 0 to 9.
 * @default 9
 *
 */

/*:ja
 * @plugindesc タイトル画面に雨、雪、嵐を降らせるプラグインです。
 * @author 莞爾の草
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * @param weatherType
 * @desc 天候 (none/rain/storm/snow)
 * @default rain
 *
 * @param weatherPower
 * @desc 天候の強さ。０から９の数字を入れてください。
 * @default 9
 */

(function () {
  var parameters = PluginManager.parameters("Weather_Title");
  var weatherType = parameters["weatherType"];
  var weatherPower = Number(parameters["weatherPower"]);

  Scene_Title.prototype.createWeather = function () {
    this.weatherEffect = new Weather();
    this.addChild(this.weatherEffect);
    this.weatherEffect.type = weatherType;
    this.weatherEffect.power = weatherPower;
  };

  var _Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function () {
    _Scene_Title_create.call(this);
    this.createWeather();
  };

  var _Scene_Title_update = Scene_Title.prototype.update;
  Scene_Title.prototype.update = function () {
    _Scene_Title_update.call(this);
    this.weatherEffect.update();
  };
})();
