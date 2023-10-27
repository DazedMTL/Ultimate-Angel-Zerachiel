//=============================================================================
// BordSkin.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 能力値にステートに設定した定数を加算します。
 * @author まっつＵＰ
 *
 * @help
 *
 * RPGで笑顔を・・・
 *
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 *
 * パラメータとプラグインコマンドともにありません。
 * 定数は基本能力値の倍率やバフの倍率によって変わることはありません。
 *
 * ステートのノートタグ
 *
 * <BSparamId:value>
 *
 * 例：atkを100上昇させる。
 * <BS2:100>
 *
 * 利用規約(2019/10/6変更)：
 * この作品は マテリアル・コモンズ・ブルー・ライセンスの下に提供されています。
 * https://materialcommons.tk/mtcm-b-summary/
 * クレジット表示：まっつＵＰ
 *
 */

(function () {

  //var parameters = PluginManager.parameters('BordSkin');

  Game_BattlerBase.prototype.paramPlus2 = function (paramId) { //新規
    var str1 = 'BS' + paramId;
    var amount = 0;
    this._states.forEach(function (stateId) {
      var val1 = Number($dataStates[stateId].meta[str1] || 0);
      if (val1) amount += val1;
    }, this);
    return amount;
  };

  Game_BattlerBase.prototype.param = function (paramId) {
    var value = this.paramBase(paramId) + this.paramPlus(paramId);
    value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
    value += this.paramPlus2(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
  };

})();
