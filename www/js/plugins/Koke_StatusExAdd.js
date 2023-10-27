//=============================================================================
// Koke_StatusExAdd - ステータス表示拡張
//=============================================================================

/*:
 * @plugindesc ステータスシーンの装備を上書き。
 *
 * @author Koke
 *
 */

var Imported = Imported || {};
Imported.StatusExLabel = true;

(function () {

    Window_Status.prototype.drawEquipments = function (x, y) {
        // console.log(this._actor);
        if (this._actor._actorId === 1) {
            //ザラキエルの場合はエロステを表示

            //エロステの項目名
            var koumoku = ['　胸回数', 'Sex', 'Anal', 'Pussy', 'Masturbated', 'Climaxes']
            //エロステの項目に入れる変数
            var numEro = [1, 2, 3, 4, 5, 6]

            //6行回す
            for (var i = 0; i < 6; i++) {
                //1行目
                this.changeTextColor(this.systemColor());
                this.drawText(koumoku[i], x, y + this.lineHeight() * i, 'left');
                this.resetTextColor();
                this.drawText($gameVariables.value(numEro[i]), x + 200, y + this.lineHeight() * i, 60, 'right');
            }

        } else {
            //他キャラの場合はエロステを消す
            //6行回す
            for (var i = 0; i < 6; i++) {
                //1行目
                this.drawText('', x, y + this.lineHeight() * i, 'left');
                this.drawText('', x + 200, y + this.lineHeight() * i, 60, 'right');
            }

        };

    };

})();