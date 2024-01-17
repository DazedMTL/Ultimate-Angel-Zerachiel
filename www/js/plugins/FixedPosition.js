//=============================================================================
// FixedPosition.js
//=============================================================================

/*:
 * @plugindesc サイドビューバトルにおけるアクターの各種移動を制限します。
 * @author こま
 *
 * @param Fixed Start Position
 * @desc バトル開始に画面外から登場せず、最初から並んでいる状態にする場合はtrueを指定してください。（true/false）
 * @default true
 *
 * @param Fixed Input Position
 * @desc 行動選択時に一歩前に出ないようにする場合はtrueを指定してください。（true/false）
 * @default true
 *
 * @param Fixed Attack Position
 * @desc 攻撃時に一歩前に出ないようにする場合はtrueを指定してください。（true/false）
 * @default true
 *
 * @help *このプラグインには、プラグインコマンドはありません。
 *
 * [ 利用規約 ] ...................................................................
 *  本プラグインの利用者は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  商用、非商用、ゲームの内容（年齢制限など）を問わず利用可能です。
 *  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
 *  二次配布や転載、ソースコードURLやダウンロードURLへの直接リンクは禁止します。
 *  （プラグインを利用したゲームに同梱する形での結果的な配布はOKです）
 *  不具合対応以外のサポートやリクエストは受け付けておりません。
 *  本プラグインにより生じたいかなる問題においても、一切の責任を負いかねます。
 * [ 改訂履歴 ] ...................................................................
 *   Version 1.00  2016/03/01  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  Web Site: http://i.gmobb.jp/nekoma/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 */

(function () {
  var plugin = "FixedPosition";

  var params = PluginManager.parameters(plugin);
  var fixedStartPosition =
    params["Fixed Start Position"].toLowerCase() === "true";
  var fixedInputPosition =
    params["Fixed Input Position"].toLowerCase() === "true";
  var fixedAttackPosition =
    params["Fixed Attack Position"].toLowerCase() === "true";

  // Object Property for Plugin
  function pprop(obj) {
    return (obj[plugin] = obj[plugin] || {});
  }

  //=========================================================================
  // Sprite_Actor
  //=========================================================================

  var _alias_Sprite_Actor_moveToStartPosition =
    Sprite_Actor.prototype.moveToStartPosition;
  Sprite_Actor.prototype.moveToStartPosition = function () {
    _alias_Sprite_Actor_moveToStartPosition.call(this);
    if (fixedStartPosition) {
      this.startMove(0, 0, 0);
    }
  };

  var _alias_Sprite_Actor_updateTargetPosition =
    Sprite_Actor.prototype.updateTargetPosition;
  Sprite_Actor.prototype.updateTargetPosition = function () {
    _alias_Sprite_Actor_updateTargetPosition.call(this);
    if (
      (this._actor.isInputting() && fixedInputPosition) ||
      (this._actor.isActing() && fixedAttackPosition)
    ) {
      this.startMove(0, 0, 0);
    }
  };
})();
