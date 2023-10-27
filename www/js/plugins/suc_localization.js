//=============================================================================
// suc_localization.js
//=============================================================================
/*:ja
 * @plugindesc サキュバス専用
 * 
 * @param id_desc_cost
 * @default (コスト:{0})
 * @param id_empty_state
 * @default ステート異常なし
 * @param id_zukan_name
 * @default 男図鑑
 * @param id_status_life
 * @default HP
 * @param id_status_tension
 * @default テンション
 * @param id_status_trunk
 * @default ハツジョウ
 * @param id_battle_turn
 * @default ターン
 * @param id_battle_turnend
 * @default ターン終了
 */
Nnfs.localization = Nnfs.parseDeep(PluginManager.parameters('suc_localization'));
