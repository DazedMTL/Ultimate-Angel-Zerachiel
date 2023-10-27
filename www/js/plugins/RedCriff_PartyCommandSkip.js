(function () {
    'use strict';

    var _BattleManager_startInput = BattleManager.startInput;
    BattleManager.startInput = function () {
        _BattleManager_startInput.apply(this, arguments);
        if (this._phase === 'input' && $gameTroop.turnCount() > 0) {
            BattleManager.selectNextCommand();
        }
    };
})();