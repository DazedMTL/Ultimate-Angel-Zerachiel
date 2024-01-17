//=============================================================================
// Plugin for RPG Maker MV and MZ
// RatesSum.js
//=============================================================================
/*:
 * @target MV MZ
 * @plugindesc Change plural rate calculate from multiply to addition
 * @author Sasuke KANNAZUKI
 *
 * @param doApplyToElement
 * @text Apply to Element Rate?
 * @desc
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param doApplyToDebuff
 * @text Apply to Debuff Rate?
 * @desc
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param doApplyToState
 * @text Apply to State Rate?
 * @desc
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV(Ver1.6.0 or later) and MZ.
 * This plugin changes calcurate method to addition.
 *
 * [Summary]
 * At default system, Element Rate, Debuff Rate and State Rate are
 * multiplied when set plural at traits.
 * This plugin changes this specification...
 * - When rate is set plural traits, add each percentage.
 *
 * [Note]
 * Rate basis is 100%. If rate is less than 100%, it subtracs.
 * Ex. The rate is 80%, it means -20%.
 * If rate is more than 100%, it adds.
 * Ex. The rate is 140%, it means +40%
 *
 * [An Example]
 * When an actor equips armor that fire rate 80% and
 * helmet that fire rate 60%, -20% by the former and
 * -40% by the latter, these sum is -60%,
 * so in this case, the fire rate become 40% (100-60=40).
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc 有効度が複数ある時、乗算ではなく加算で算出します
 * @author 神無月サスケ
 *
 * @param doApplyToElement
 * @text 属性有効度に適用？
 * @desc
 * @type boolean
 * @on する
 * @off しない
 * @default true
 *
 * @param doApplyToDebuff
 * @text 弱体有効度に適用？
 * @desc
 * @type boolean
 * @on する
 * @off しない
 * @default true
 *
 * @param doApplyToState
 * @text ステート有効度に適用？
 * @desc
 * @type boolean
 * @on する
 * @off しない
 * @default true
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMV(Ver1.6.0以降)およびMZに対応しています。
 * このプラグインは、特徴の有効度の計算方法を、加算に変更します。
 *
 * ■概要
 * 通常、属性有効度、弱体有効度、ステート有効度は、
 * 複数指定された場合、掛け算によって有効度を算出しますが、
 * これを、足し算に変更します。
 *
 * 100％を基準として、少なければマイナス、多ければプラスとなります。
 * 例1：80％にした場合、-20%になります。
 * 例2：140％にした場合、+40%になります。
 *
 * ■実例
 * 特定の属性に対して、80％の耐性の鎧と、60％の耐性の兜を装備した場合、
 * 前者で、-20％、後者で-40％となり、足し合わせて、-60％、
 * すなわち、40％の耐性になります。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = "RatesSum";
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const doApplyToElement = eval(parameters["doApplyToElement"] || "true");
  const doApplyToDebuff = eval(parameters["doApplyToDebuff"] || "true");
  const doApplyToState = eval(parameters["doApplyToState"] || "true");

  //
  // new trait sum routine
  //
  Game_BattlerBase.prototype.traitsSum2 = function (code, id) {
    const rate = this.traitsWithId(code, id).reduce((r, trait) => {
      return r + trait.value - 1;
    }, 1);
    return Math.max(rate, 0);
  };

  //
  // Element Rate
  //
  if (doApplyToElement) {
    Game_BattlerBase.prototype.elementRate = function (elementId) {
      return this.traitsSum2(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
    };
  }

  //
  // Debuff Rate
  //
  if (doApplyToDebuff) {
    Game_BattlerBase.prototype.debuffRate = function (paramId) {
      return this.traitsSum2(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
    };
  }

  //
  // State Rate
  //
  if (doApplyToState) {
    Game_BattlerBase.prototype.stateRate = function (stateId) {
      return this.traitsSum2(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
    };
  }
})();
