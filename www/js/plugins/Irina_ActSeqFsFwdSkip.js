/*:
 * @plugindesc <ActSeqFsFwdSkip> for RPG Maker MV version 1.6.2.
 * @author RPG Maker Irina
 *
 * @help
 * *** Introduction ***
 *
 *      Battle Action Sequences are lots of fun to watch. But for all players
 * alike, seeing the same long-drawn out Battle Action Sequences for the
 * hundredth time will get old. This plugin gives players the ability to fast
 * forward or skip entire Battle Action Sequeneces altogether and show that you,
 * as a game developer, respects the player's time and decision on how they wish
 * to play your game.
 *
 *      You could change the buttons to perform these actions, but from the
 * plugin's default settings, you could fast forward by holding down the
 * designated OK button (Z or Space on keyboard or holding the left mouse
 * button down). To toggle Auto-Fast Forward, pressing Page Up or Q can do that
 * or by pressing the Fast Forward button on the screen.
 *
 *      If you haven't changed the button setup, skipping animations can be done
 * by holding down the designated Cancel Button (X or Escape on keyboard by the
 * right mouse button). To toggle Auto-Skip Forward, pressing Page Down or W
 * will toggle the Auto-Skip Forward feature or by pressing the Skip Forward
 * button on the screen.
 *
 *
 *
 * *** Plugin Requirements ***
 *
 *      This plugin requires Yanfly's Battle Engine Core to work. It is also
 * recommended that you download all of Yanfly's other Action Sequence Packs,
 * in addition to the Battle Engine Core, too. You can find them here:
 *
 * https://yanflyengineplugins.itch.io/battle-engine-core
 * https://yanflyengineplugins.itch.io/action-sequence-pack-1
 * https://yanflyengineplugins.itch.io/action-sequence-pack-2
 * https://yanflyengineplugins.itch.io/action-sequence-pack-3
 *
 *
 *
 * *** Button UI Graphics ***
 *
 *      There are two UI buttons that I've made for you all to use freely with
 * your projects if you don't know how to make them or just want to use it to
 * temporarily take place until you make your own graphics.
 *
 *      You can download them from here:
 *
 *      https://atelieririna.itch.io/action-sequence-fast-forward-skip
 *
 *      If you wish to make your own UI graphics, just make them like a regular
 * 1x2 spritesheet, where the off graphic is on the left and the on graphic is
 * on the right. There are no frame dimension limitations, but you must use the
 * same dimensions for both frames.
 *
 *
 *
 * *** Plugin Parameters ***
 *
 * Fast Forward:
 *
 *      The settings below this all pertain to the Fast Forward feature added
 * by this plugin. You can adjust the Fast Forward speed, the buttons used for
 * it, the window information displayed, and the UI button for toggling Fast
 * Forward on or off.
 *
 * Settings:
 *
 *      These adjust the main components of the Fast Forward effect. The Hold
 * Button is the button that's pressed and held down for Fast Forward to occur
 * and stops when the button is released. The Toggle Button will actually switch
 * between on and off for Auto-Fast Forward, where the player does not need to
 * hold down the Fast Forward button. The Speed adjusts the speed at which the
 * fast forwarding occurs.
 *
 * Options:
 *
 *      These options determine how the Auto-Fast Forward feature appear in the
 * in-game Options menu. If you want to learn how to add the option to Yanfly's
 * Options Core, look in the section below this one.
 *
 * Window:
 *
 *      When Fast Forward is on, a message will appear on the screen to alert
 * the player of what's going on. This section lets you change the window's
 * message, font settings, coordinates, and more.
 *
 * Button:
 *
 *      If you wish, you can have a UI button appear on screen for players to
 * click with their mouse to turn on/off Auto-Fast Forward. In this section,
 * you can select the graphic used and the coordinates it's placed at.
 *
 * Skip Forward:
 *
 *      The settings below this all pertain to the Skip Forward feature added
 * by this plugin. You can adjust the Skip Forward power, the buttons used for
 * it, the window information displayed, and the UI button for toggling Skip
 * Forward on or off.
 *
 * Settings:
 *
 *      These adjust the main components of the Skip Forward effect. The Hold
 * Button is the button that's pressed and held down for Skip Forward to occur
 * and stops when the button is released. The Toggle Button will actually switch
 * between on and off for Auto-Skip Forward, where the player does not need to
 * hold down the Skip Forward button. The Speed adjusts the speed at which the
 * skip forwarding occurs since skipping is actually a higher powered fast
 * forward. Damage Tally Timing lets you determine what damage counts will
 * appear at the end of the skip. Fade Duration is how many frames the game will
 * take fading in and out between skipping.
 *
 * Options:
 *
 *      These options determine how the Auto-Skip Forward feature appear in the
 * in-game Options menu. If you want to learn how to add the option to Yanfly's
 * Options Core, look in the section below this one.
 *
 * Window:
 *
 *      When Skip Forward is on, a message will appear on the screen to alert
 * the player of what's going on. This section lets you change the window's
 * message, font settings, coordinates, and more.
 *
 * Button:
 *
 *      If you wish, you can have a UI button appear on screen for players to
 * click with their mouse to turn on/off Auto-Skip Forward. In this section,
 * you can select the graphic used and the coordinates it's placed at.
 *
 *
 *
 * *** Notetags ***
 *
 *      There are some notetags that you can use with this plugin. Place these
 * inside your items or skills that you want them to affect.
 *
 * <Cannot Fast Forward>
 * <Cannot Skip Forward>
 * - Prevents this specific item/skill from being able to Fast Forward or Skip
 * Forward. Possible reasons on why you want to use such a notetag on such an
 * item/skill could be that this is an item that involves button inputs, or
 * displays data on screen (like a Scan) that you don't want the player to miss
 * out on.
 *
 * <Fast Forward Speed: x>
 * - Replace x with a number above 1. This is how fast the Fast Forward function
 * will occur for this particular item/skill. To be used with longer action
 * sequences. *See Note*
 *
 * <Skip Forward Speed: x>
 * - Replace x with a number above 1. This is how much Skip Forward will speed
 * through the action sequence at. To be used with longer action sequences.
 * *See Note*
 *
 * Note: Making the speed too high will have possible unforeseen consequences
 * that the plugin cannot foresee nor fix. This is because the fast forward
 * and skip functions function off a macroscale that speeds up the game's
 * update frequency. This does not take into consideration the game's delta
 * time since that's impossible to do without causing other problems. It is your
 * own due diligence as a game developer to find the right speeds for each
 * item/skill that won't break the system.
 *
 *
 *
 * *** Plugin Commands ***
 *
 *      If your item/skill's battle action sequence runs a common event that
 * requires you to temporarily stop Fast Forward and Skip Forward, you can use
 * these plugin commands to control them:
 *
 * STOP ACTION SEQUENCE FORWARD
 * - This will stop Fast Forward and Skip Forward at this point onward.
 *
 * ALLOW ACTION SEQUENCE FORWARD
 * - This will reenable Fast Forward and Skip Forward from this point onward.
 *
 *
 *
 * *** YEP_OptionsCore Integration ***
 *
 *      If you want to integrate Auto-Fast Forward and Auto-Skip Forward into
 * Yanfly's Options Core plugin, use the settings below:
 *
 * -------------------------------
 * Settings for Auto-Fast Forward:
 * -------------------------------
 *
 * Name:
 * \i[87]Auto-Fast Forward
 *
 * Help Description:
 * Automatically fast forwards battle animations.
 *
 * Symbol:
 * actionSequenceAutoFastForward
 *
 * Show/Hide:
 * show = true;
 *
 * Enable:
 * enabled = true;
 *
 * Ext:
 * ext = 0;
 *
 * ----------
 * Functions:
 * ----------
 *
 * Make Option Code:
 * this.addCommand(name, symbol, enabled, ext);
 *
 * Draw Option Code:
 * var rect = this.itemRectForText(index);
 * var statusWidth = this.statusWidth();
 * var titleWidth = rect.width - statusWidth;
 * this.resetTextColor();
 * this.changePaintOpacity(this.isCommandEnabled(index));
 * this.drawOptionsName(index);
 * this.drawOptionsOnOff(index);
 *
 * Process OK Code:
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * this.changeValue(symbol, !value);
 *
 * Cursor Right Code:
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * this.changeValue(symbol, true);
 *
 * Cursor Left Code:
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * this.changeValue(symbol, false);
 *
 * Default Config Code:
 * // Empty.
 *
 * Save Config Code:
 * // Empty.
 *
 * Load Config Code:
 * // Empty.
 *
 * -------------------------------
 * Settings for Auto-Skip Forward:
 * -------------------------------
 *
 * Name:
 * \i[87]Auto-Skip Forward
 *
 * Help Description:
 * Automatically skips battle animations to the end.
 *
 * Symbol:
 * actionSequenceAutoSkipForward
 *
 * Show/Hide:
 * show = true;
 *
 * Enable:
 * enabled = true;
 *
 * Ext:
 * ext = 0;
 *
 * ----------
 * Functions:
 * ----------
 *
 * Make Option Code:
 * this.addCommand(name, symbol, enabled, ext);
 *
 * Draw Option Code:
 * var rect = this.itemRectForText(index);
 * var statusWidth = this.statusWidth();
 * var titleWidth = rect.width - statusWidth;
 * this.resetTextColor();
 * this.changePaintOpacity(this.isCommandEnabled(index));
 * this.drawOptionsName(index);
 * this.drawOptionsOnOff(index);
 *
 * Process OK Code:
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * this.changeValue(symbol, !value);
 *
 * Cursor Right Code:
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * this.changeValue(symbol, true);
 *
 * Cursor Left Code:
 * var index = this.index();
 * var symbol = this.commandSymbol(index);
 * var value = this.getConfigValue(symbol);
 * this.changeValue(symbol, false);
 *
 * Default Config Code:
 * // Empty.
 *
 * Save Config Code:
 * // Empty.
 *
 * Load Config Code:
 * // Empty.
 *
 *
 *
 * *** RPG Maker Version ***
 *
 * This plugin is made for and tested on RPG Maker MV with version 1.6.2.
 * I cannot guarantee if it works on lower versions.
 *
 *
 *
 * *** Terms of Use ***
 *
 * 1. These plugins may be used in free or commercial games.
 * 2. 'RPG Maker Irina' must be given credit in your games.
 * 3. You are allowed to edit the code.
 * 4. Do NOT change the filename, parameters, and information of the plugin.
 * 5. You are NOT allowed to redistribute these Plugins.
 * 6. You may NOT take code for your own released Plugins.
 *
 * *** Help End ***
 *
 * @param
 *
 * @param FastForward
 * @text Fast Forward
 *
 * @param FastForwardSettings
 * @text Settings
 * @parent FastForward
 *
 * @param fastForwardHoldButton
 * @text Hold Button
 * @parent FastForwardSettings
 * @type combo
 * @option ok
 * @option cancel
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @desc If this button is held down, Fast Forward will be in play
 * @default ok
 *
 * @param fastForwardToggleButton
 * @text Toggle Button
 * @parent FastForwardSettings
 * @type combo
 * @option ok
 * @option cancel
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @desc If this button is pressed, Auto-Fast Forward will be toggled
 * @default pageup
 *
 * @param fastForwardSpeed
 * @text Speed
 * @parent FastForwardSettings
 * @desc Default speed for Fast Forward. 1 = regular speed. Higher = faster.
 * @default 2
 *
 * @param FastForwardOptions
 * @text Options
 * @parent FastForward
 *
 * @param fastForwardOptionShow
 * @parent FastForwardOptions
 * @text Show
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show Auto-Fast Forward in the Options menu?
 * @default true
 *
 * @param fastForwardOptionName
 * @parent FastForwardOptions
 * @text Text
 * @desc Text displayed for Auto-Fast Forward
 * @default Auto-Fast Forward
 *
 * @param FastForwardWindow
 * @text Window
 * @parent FastForward
 *
 * @param fastForwardMsg
 * @parent FastForwardWindow
 * @text Message
 * @desc Text displayed when Fast Forward is on
 * @default ⏩Fast Forward
 *
 * @param fastForwardFont
 * @parent FastForwardWindow
 * @text Font name
 * @desc Font name for text
 * @default Arial
 *
 * @param fastForwardSize
 * @parent FastForwardWindow
 * @text Font Size
 * @desc Font size for text
 * @default 36
 *
 * @param fastForwardWidth
 * @parent FastForwardWindow
 * @text Width
 * @desc Window width for message. Formulas allowed.
 * @default 400
 *
 * @param fastForwardScreenX
 * @parent FastForwardWindow
 * @text Screen X
 * @desc Screen X position for message. Formulas allowed.
 * @default 0
 *
 * @param fastForwardScreenY
 * @parent FastForwardWindow
 * @text Screen Y
 * @desc Screen Y position for message. Formulas allowed.
 * @default Graphics.boxHeight - height - 18
 *
 * @param fastForwardWindowFadeSpeed
 * @parent FastForwardWindow
 * @text Fade Speed
 * @desc Speed at which the message fades in and out
 * @default 16
 *
 * @param fastForwardWindowDrawCode
 * @parent FastForwardWindow
 * @text Draw Code
 * @type note
 * @desc JavaScript code for the drawn commands.
 * @default "this.contents.gradientFillRect(0, 0, this.contents.width / 2, this.contents.height, this.dimColor2(), this.dimColor1());\nthis.contents.gradientFillRect(this.contents.width / 2, 0, this.contents.width / 2, this.contents.height, this.dimColor1(), this.dimColor2());\nthis.contents.drawText(text, this.textPadding(), 0, this.contents.width, this.contents.height, 'left');"
 *
 * @param FastForwardButton
 * @text Button
 * @parent FastForward
 *
 * @param fastForwardButtonShow
 * @parent FastForwardButton
 * @text Show
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show Auto-Fast Forward toggle button?
 * @default true
 *
 * @param fastForwardButtonImg
 * @parent FastForwardButton
 * @text File
 * @type file
 * @dir img/system/
 * @desc img/system/ image used for the graphic
 * @default ActSeqFastForward
 *
 * @param fastForwardButtonX
 * @parent FastForwardButton
 * @text Screen X
 * @desc Screen X position for button
 * @default Graphics.boxWidth - 200
 *
 * @param fastForwardButtonY
 * @parent FastForwardButton
 * @text Screen Y
 * @desc Screen X position for button
 * @default Graphics.boxHeight - 250
 *
 * @param
 *
 * @param SkipForward
 * @text Skip Forward
 *
 * @param SkipForwardSettings
 * @text Settings
 * @parent SkipForward
 *
 * @param skipforwardHoldButton
 * @text Hold Button
 * @parent SkipForwardSettings
 * @type combo
 * @option ok
 * @option cancel
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @desc If this button is held down, Skip Forward will be in play
 * @default cancel
 *
 * @param skipForwardToggleButton
 * @text Toggle Button
 * @parent SkipForwardSettings
 * @type combo
 * @option ok
 * @option cancel
 * @option pageup
 * @option pagedown
 * @option shift
 * @option control
 * @desc If this button is pressed, Auto-Skip Forward will be toggled
 * @default pagedown
 *
 * @param skipforwardSpeed
 * @text Speed
 * @parent SkipForwardSettings
 * @desc Default speed for Skip Forward. 1 = regular speed. Higher = more. Don't make this too high.
 * @default 5
 *
 * @param skipforwardTiming
 * @text Damage Tally Timing
 * @parent SkipForwardSettings
 * @type combo
 * @option start
 * @option moment
 * @desc Determines when to start tallying total damage for skipped animations
 * @default start
 *
 * @param skipforwardFadeDuration
 * @text Fade Duration
 * @parent SkipForwardSettings
 * @desc Fade In/Out duration for skipped forward animations
 * @default 20
 *
 * @param SkipForwardOptions
 * @text Options
 * @parent SkipForward
 *
 * @param skipforwardOptionShow
 * @parent SkipForwardOptions
 * @text Show
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show Auto-Skip Forward in the Options menu?
 * @default true
 *
 * @param skipforwardOptionName
 * @parent SkipForwardOptions
 * @text Text
 * @desc Text displayed for Auto-Skip Forward
 * @default Auto-Skip Forward
 *
 * @param SkipForwardWindow
 * @text Window
 * @parent SkipForward
 *
 * @param skipforwardMsg
 * @parent SkipForwardWindow
 * @text Message
 * @desc Text displayed when Skip Forward is on
 * @default ⏭Skip Animation
 *
 * @param skipforwardFont
 * @parent SkipForwardWindow
 * @text Font name
 * @desc Font name for text
 * @default Arial
 *
 * @param skipforwardSize
 * @parent SkipForwardWindow
 * @text Font Size
 * @desc Font size for text
 * @default 36
 *
 * @param skipforwardWidth
 * @parent SkipForwardWindow
 * @text Width
 * @desc Window width for message. Formulas allowed.
 * @default 400
 *
 * @param skipforwardScreenX
 * @parent SkipForwardWindow
 * @text Screen X
 * @desc Screen X position for message. Formulas allowed.
 * @default 0
 *
 * @param skipforwardScreenY
 * @parent SkipForwardWindow
 * @text Screen Y
 * @desc Screen Y position for message. Formulas allowed.
 * @default Graphics.boxHeight - height - 18
 *
 * @param skipforwardWindowFadeSpeed
 * @parent SkipForwardWindow
 * @text Fade Speed
 * @desc Speed at which the message fades in and out
 * @default 16
 *
 * @param skipForwardWindowDrawCode
 * @parent SkipForwardWindow
 * @text Draw Code
 * @type note
 * @desc JavaScript code for the drawn commands.
 * @default "this.contents.gradientFillRect(0, 0, this.contents.width / 2, this.contents.height, this.dimColor2(), this.dimColor1());\nthis.contents.gradientFillRect(this.contents.width / 2, 0, this.contents.width / 2, this.contents.height, this.dimColor1(), this.dimColor2());\nthis.contents.drawText(text, this.textPadding(), 0, this.contents.width, this.contents.height, 'left');"
 *
 * @param SkipForwardButton
 * @text Button
 * @parent SkipForward
 *
 * @param skipForwardButtonShow
 * @parent SkipForwardButton
 * @text Show
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show Auto-Skip Forward toggle button?
 * @default true
 *
 * @param skipForwardButtonImg
 * @parent SkipForwardButton
 * @text File
 * @type file
 * @dir img/system/
 * @desc img/system/ image used for the graphic
 * @default ActSeqSkipForward
 *
 * @param skipForwardButtonX
 * @parent SkipForwardButton
 * @text Screen X
 * @desc Screen X position for button
 * @default Graphics.boxWidth - 100
 *
 * @param skipForwardButtonY
 * @parent SkipForwardButton
 * @text Screen Y
 * @desc Screen X position for button
 * @default Graphics.boxHeight - 250
 *
 * @param
 *
 */
//=============================================================================

var parameters = $plugins.filter(function (e) {
  return e.description.contains("<ActSeqFsFwdSkip>");
})[0].parameters;
var Imported = Imported || {};
if (!Imported.YEP_BattleEngineCore) {
  alert(
    "Irina_ActionSequenceImpact plugin requires YEP_BattleEngineCore plugin installed."
  );
  SceneManager.exit();
}
Imported.Irina_ActSeqFsFwdSkip = {};
(function (parameters) {
  var keys = [
    "fastForwardSpeed",
    "fastForwardSize",
    "fastForwardWindowFadeSpeed",
    "skipforwardSpeed",
    "skipforwardFadeDuration",
    "skipforwardSize",
    "skipforwardWindowFadeSpeed",
  ];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    Imported.Irina_ActSeqFsFwdSkip[key] = Number(parameters[key]) || 0;
  }
  var keys = [
    "fastForwardHoldButton",
    "fastForwardToggleButton",
    "fastForwardOptionName",
    "fastForwardMsg",
    "fastForwardFont",
    "fastForwardWidth",
    "fastForwardScreenX",
    "fastForwardScreenY",
    "fastForwardButtonImg",
    "fastForwardButtonX",
    "fastForwardButtonY",
    "skipforwardHoldButton",
    "skipForwardToggleButton",
    "skipforwardTiming",
    "skipforwardOptionName",
    "skipforwardMsg",
    "skipforwardFont",
    "skipforwardWidth",
    "skipforwardScreenX",
    "skipforwardScreenY",
    "skipForwardButtonImg",
    "skipForwardButtonX",
    "skipForwardButtonY",
  ];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    Imported.Irina_ActSeqFsFwdSkip[key] = String(parameters[key]) || "";
  }
  var keys = [
    "fastForwardOptionShow",
    "fastForwardButtonShow",
    "skipforwardOptionShow",
    "skipForwardButtonShow",
  ];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    Imported.Irina_ActSeqFsFwdSkip[key] = eval(parameters[key]) || false;
  }
  var keys = ["fastForwardWindowDrawCode", "skipForwardWindowDrawCode"];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    Imported.Irina_ActSeqFsFwdSkip[key] = JSON.parse(parameters[key]);
  }
})(parameters);
ConfigManager.actionSequenceAutoFastForward = false;
ConfigManager.actionSequenceAutoSkipForward = false;
Imported.Irina_ActSeqFsFwdSkip.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function () {
  var e = Imported.Irina_ActSeqFsFwdSkip.ConfigManager_makeData.call(this);
  e.actionSequenceAutoFastForward = this.actionSequenceAutoFastForward;
  e.actionSequenceAutoSkipForward = this.actionSequenceAutoSkipForward;
  return e;
};
Imported.Irina_ActSeqFsFwdSkip.ConfigManager_applyData =
  ConfigManager.applyData;
ConfigManager.applyData = function (e) {
  Imported.Irina_ActSeqFsFwdSkip.ConfigManager_applyData.call(this, e);
  this.actionSequenceAutoFastForward = this.readFlag(
    e,
    "actionSequenceAutoFastForward"
  );
  this.actionSequenceAutoSkipForward = this.readFlag(
    e,
    "actionSequenceAutoSkipForward"
  );
};
TouchInput.isLongCancelled = function () {
  return this._cancelled;
};
Imported.Irina_ActSeqFsFwdSkip.BattleManager_startAction =
  BattleManager.startAction;
BattleManager.startAction = function () {
  Imported.Irina_ActSeqFsFwdSkip.BattleManager_startAction.call(this);
  this.startActionPrepareActionSequenceFastForwardSkipForward();
  if (Imported.Irina_ActSeqFsFwdSkip.skipforwardTiming === "start")
    this.processActionSequenceSkipForwardClearTotalDamagePopups();
};
BattleManager.startActionPrepareActionSequenceFastForwardSkipForward =
  function () {
    $gameTemp._allowActionSequenceToggles = true;
    if (
      this._action &&
      this._action.item() &&
      !this._action.item().note.match(/<CANNOT FAST FORWARD>/i)
    ) {
      $gameTemp._actionSequenceFastForwardSpeed =
        Imported.Irina_ActSeqFsFwdSkip.fastForwardSpeed;
      $gameTemp._allowActionSequenceFastForward = true;
      if (
        this._action.item().note.match(/<FAST FORWARD (?:SPEED|POWER): (.*)>/i)
      ) {
        $gameTemp._actionSequenceFastForwardSpeed = Math.round(
          Number(eval(RegExp.$1))
        );
      }
    }
    if (
      this._action &&
      this._action.item() &&
      !this._action.item().note.match(/<CANNOT SKIP FORWARD>/i)
    ) {
      $gameTemp._actionSequenceSkipForwardSpeed =
        Imported.Irina_ActSeqFsFwdSkip.skipforwardSpeed;
      $gameTemp._allowActionSequenceSkipForward = true;
      if (
        this._action.item().note.match(/<SKIP FORWARD (?:SPEED|POWER): (.*)>/i)
      ) {
        $gameTemp._actionSequenceSkipForwardSpeed = Math.round(
          Number(eval(RegExp.$1))
        );
      }
      if (ConfigManager.actionSequenceAutoSkipForward)
        SceneManager._scene.processActionSequenceSkipForward();
    }
  };
Imported.Irina_ActSeqFsFwdSkip.BattleManager_endAction =
  BattleManager.endAction;
BattleManager.endAction = function () {
  Imported.Irina_ActSeqFsFwdSkip.BattleManager_endAction.call(this);
  this.endActionPrepareActionSequenceFastForwardSkipForward();
};
BattleManager.endActionPrepareActionSequenceFastForwardSkipForward =
  function () {
    $gameTemp._allowActionSequenceToggles = false;
    $gameTemp._allowActionSequenceFastForward = false;
    $gameTemp._allowActionSequenceSkipForward = false;
    $gameTemp._actionSequenceSkippingForward = false;
  };
Imported.Irina_ActSeqFsFwdSkip.BattleManager_checkBattleEnd =
  BattleManager.checkBattleEnd;
BattleManager.checkBattleEnd = function () {
  if ($gameTemp._allowActionSequenceSkipForward) return false;
  return Imported.Irina_ActSeqFsFwdSkip.BattleManager_checkBattleEnd.call(this);
};
BattleManager.processActionSequenceSkipForwardClearTotalDamagePopups =
  function () {
    var e = this.allBattleMembers();
    for (var t = 0; t < e.length; t++) {
      e[t].clearTotalDamagePopupForActionSequenceSkipForward();
    }
  };
BattleManager.processActionSequenceSkipForwardFinishRemoveDamagePopups =
  function () {
    var e = this.allBattleMembers();
    for (var t = 0; t < e.length; t++) {
      var a = e[t].battler();
      if (a) {
        var i = 60;
        while (i > 0) {
          i--;
          a.updateDamagePopup();
        }
      }
      e[t].createActionSequenceSkipForwardTotalDamagePopup();
    }
  };
Imported.Irina_ActSeqFsFwdSkip.AudioManager_playSe = AudioManager.playSe;
AudioManager.playSe = function (e) {
  if (
    $gameTemp._actionSequenceSkippingForward &&
    !$gameTemp._actionSequenceSkipTemporarilyAllowSE
  )
    return;
  Imported.Irina_ActSeqFsFwdSkip.AudioManager_playSe.call(this, e);
};
Imported.Irina_ActSeqFsFwdSkip.AudioManager_playStaticSe =
  AudioManager.playStaticSe;
AudioManager.playStaticSe = function (e) {
  if (
    $gameTemp._actionSequenceSkippingForward &&
    !$gameTemp._actionSequenceSkipTemporarilyAllowSE
  )
    return;
  Imported.Irina_ActSeqFsFwdSkip.AudioManager_playStaticSe.call(this, e);
};
Imported.Irina_ActSeqFsFwdSkip.AudioManager_playMe = AudioManager.playMe;
AudioManager.playMe = function (e) {
  if (
    $gameTemp._actionSequenceSkippingForward &&
    !$gameTemp._actionSequenceSkipTemporarilyAllowSE
  )
    return;
  Imported.Irina_ActSeqFsFwdSkip.AudioManager_playMe.call(this, e);
};
Game_Temp.prototype.isActionSequenceFastForwarding = function () {
  if ($gameTemp.isActionSequenceSkippingForward()) return false;
  if (!$gameTemp._allowActionSequenceFastForward) return false;
  if ($gameTemp._actionSequenceSkippingForward) return false;
  if (ConfigManager.actionSequenceAutoFastForward) return true;
  if (TouchInput.isLongPressed()) return true;
  return Input.isLongPressed(
    Imported.Irina_ActSeqFsFwdSkip.fastForwardHoldButton
  );
};
Game_Temp.prototype.isActionSequenceSkippingForward = function () {
  return $gameTemp._actionSequenceSkippingForward;
};
Imported.Irina_ActSeqFsFwdSkip.Game_Battler_startAnimation =
  Game_Battler.prototype.startAnimation;
Game_Battler.prototype.startAnimation = function (e, t, a) {
  if ($gameTemp._actionSequenceSkippingForward) return;
  Imported.Irina_ActSeqFsFwdSkip.Game_Battler_startAnimation.call(
    this,
    e,
    t,
    a
  );
};
Game_Battler.prototype.clearTotalDamagePopupForActionSequenceSkipForward =
  function () {
    this._totalResult = {
      hpDamage: 0,
      mpDamage: 0,
      missed: false,
      evaded: false,
    };
  };
Imported.Irina_ActSeqFsFwdSkip.Game_Battler_startDamagePopup =
  Game_Battler.prototype.startDamagePopup;
Game_Battler.prototype.startDamagePopup = function () {
  if ($gameTemp._actionSequenceSkippingForward) {
    var e = this.result();
    this._totalResult.hpDamage += Math.round(e.hpDamage);
    this._totalResult.mpDamage += Math.round(e.mpDamage);
    if (e.missed)
      this._totalResult.missed =
        this._totalResult.hpDamage === 0 && this._totalResult.mpDamage === 0;
    if (e.evaded)
      this._totalResult.evaded =
        this._totalResult.hpDamage === 0 && this._totalResult.mpDamage === 0;
  }
  Imported.Irina_ActSeqFsFwdSkip.Game_Battler_startDamagePopup.call(this);
};
Game_Battler.prototype.createActionSequenceSkipForwardTotalDamagePopup =
  function () {
    this.clearResult();
    if (this._totalResult.hpDamage !== 0) {
      this._result.hpAffected = true;
      this._result.hpDamage = this._totalResult.hpDamage;
    }
    this._result.mpDamage = this._totalResult.mpDamage;
    this._result.missed = this._totalResult.missed;
    this._result.evaded = this._totalResult.evaded;
    this.startDamagePopup();
    this.clearResult();
  };
Imported.Irina_ActSeqFsFwdSkip.Game_Interpreter_pluginCommand =
  Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (e, t) {
  Imported.Irina_ActSeqFsFwdSkip.Game_Interpreter_pluginCommand.call(
    this,
    e,
    t
  );
  if (!$gameParty.inBattle()) return;
  if (this._params[0].match(/STOP ACTION SEQUENCE FORWARD/i)) {
    BattleManager.endActionPrepareActionSequenceFastForwardSkipForward();
  } else if (this._params[0].match(/ALLOW ACTION SEQUENCE FORWARD/i)) {
    BattleManager.startActionPrepareActionSequenceFastForwardSkipForward();
  }
};
Imported.Irina_ActSeqFsFwdSkip.Scene_Battle_initialize =
  Scene_Battle.prototype.initialize;
Scene_Battle.prototype.initialize = function () {
  $gameTemp._allowActionSequenceFastForward = false;
  $gameTemp._allowActionSequenceSkipForward = false;
  $gameTemp._actionSequenceSkippingForward = false;
  Imported.Irina_ActSeqFsFwdSkip.Scene_Battle_initialize.call(this);
};
Imported.Irina_ActSeqFsFwdSkip.Scene_Battle_create =
  Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function () {
  Imported.Irina_ActSeqFsFwdSkip.Scene_Battle_create.call(this);
  this.createActionSequenceFastForwardWindow();
  this.createActionSequenceSkipForwardWindow();
  this.createActionSequenceFastSkipButtons();
};
Scene_Battle.prototype.createActionSequenceFastForwardWindow = function () {
  this._actionSequenceFastForwardWindow =
    new Window_ActionSequenceFastForward();
  this.addChild(this._actionSequenceFastForwardWindow);
};
Scene_Battle.prototype.createActionSequenceSkipForwardWindow = function () {
  this._actionSequenceSkipForwardWindow =
    new Window_ActionSequenceSkipForward();
  this.addChild(this._actionSequenceSkipForwardWindow);
};
Scene_Battle.prototype.createActionSequenceFastSkipButtons = function () {
  this._actionSequenceFastForwardButton =
    new Sprite_ActionSequenceSkipForwardButton("fastForward");
  this._actionSequenceSkipForwardButton =
    new Sprite_ActionSequenceSkipForwardButton("skipForward");
  this.addChild(this._actionSequenceFastForwardButton);
  this.addChild(this._actionSequenceSkipForwardButton);
};
Imported.Irina_ActSeqFsFwdSkip.Scene_Battle_update =
  Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
  this.updateActionSequenceFastForwardSkipForwardToggles();
  if ($gameTemp.isActionSequenceFastForwarding()) {
    this.updateActionSequenceFastForward();
  } else if ($gameTemp.isActionSequenceSkippingForward()) {
    this.updateActionSequenceSkippingForward();
  } else {
    Imported.Irina_ActSeqFsFwdSkip.Scene_Battle_update.call(this);
    this.updateActionSequenceSkipForwardHold();
  }
};
Scene_Battle.prototype.updateActionSequenceFastForward = function () {
  var e = Math.round($gameTemp._actionSequenceFastForwardSpeed);
  while (e > 0) {
    e--;
    Imported.Irina_ActSeqFsFwdSkip.Scene_Battle_update.call(this);
  }
};
Scene_Battle.prototype.updateActionSequenceFastForwardSkipForwardToggles =
  function () {
    if (!$gameTemp._allowActionSequenceToggles) return;
    if (
      Input.isTriggered(Imported.Irina_ActSeqFsFwdSkip.fastForwardToggleButton)
    ) {
      ConfigManager.actionSequenceAutoFastForward =
        !ConfigManager.actionSequenceAutoFastForward;
      ConfigManager.save();
    }
    if (
      Input.isTriggered(Imported.Irina_ActSeqFsFwdSkip.skipForwardToggleButton)
    ) {
      ConfigManager.actionSequenceAutoSkipForward =
        !ConfigManager.actionSequenceAutoSkipForward;
      ConfigManager.save();
      if (ConfigManager.actionSequenceAutoSkipForward === true)
        this.processActionSequenceSkipForward();
    }
  };
Scene_Battle.prototype.updateActionSequenceSkipForwardHold = function () {
  if (!$gameTemp._allowActionSequenceSkipForward) return;
  if (
    Input.isLongPressed(Imported.Irina_ActSeqFsFwdSkip.skipforwardHoldButton) ||
    TouchInput.isLongCancelled()
  ) {
    this.processActionSequenceSkipForward();
  }
};
Scene_Battle.prototype.processActionSequenceSkipForward = function () {
  $gameTemp._allowActionSequenceSkipForward = false;
  $gameTemp._actionSequenceSkippingForward = true;
  $gameTemp._allowActionSequenceFastForward = false;
  this.startFadeOut(Imported.Irina_ActSeqFsFwdSkip.skipforwardFadeDuration);
  if (Imported.Irina_ActSeqFsFwdSkip.skipforwardTiming === "moment")
    BattleManager.processActionSequenceSkipForwardClearTotalDamagePopups();
  this.removeChild(this._actionSequenceFastForwardButton);
  this.removeChild(this._actionSequenceSkipForwardButton);
  this.removeChild(this._actionSequenceSkipForwardWindow);
  this.addChild(this._actionSequenceFastForwardButton);
  this.addChild(this._actionSequenceSkipForwardButton);
  this.addChild(this._actionSequenceSkipForwardWindow);
};
Scene_Battle.prototype.updateActionSequenceSkippingForward = function () {
  this._actionSequenceSkipForwardWindow.update();
  if (this._fadeDuration > 0) {
    this._actionSequenceFastForwardButton.update();
    this._actionSequenceSkipForwardButton.update();
    return this.updateFade();
  }
  var e = Math.round(Imported.Irina_ActSeqFsFwdSkip.skipforwardSpeed);
  while (e > 0) {
    e--;
    Imported.Irina_ActSeqFsFwdSkip.Scene_Battle_update.call(this);
    if (!$gameTemp.isActionSequenceSkippingForward()) break;
    if (
      Input.isTriggered(
        Imported.Irina_ActSeqFsFwdSkip.skipForwardToggleButton
      ) &&
      ConfigManager.actionSequenceAutoSkipForward
    ) {
      ConfigManager.actionSequenceAutoSkipForward = false;
      ConfigManager.save();
    }
  }
  if (!$gameTemp.isActionSequenceSkippingForward())
    this.processActionSequenceSkipForwardFinish();
};
Scene_Battle.prototype.processActionSequenceSkipForwardFinish = function () {
  BattleManager.processActionSequenceSkipForwardFinishRemoveDamagePopups();
  this.startFadeIn(Imported.Irina_ActSeqFsFwdSkip.skipforwardFadeDuration);
};
Scene_Battle.prototype.updateFade = function () {
  Scene_Base.prototype.updateFade.call(this);
  if (
    this._fadeDuration > 0 &&
    this._fadeSign > 0 &&
    Input.isTriggered(Imported.Irina_ActSeqFsFwdSkip.skipForwardToggleButton) &&
    ConfigManager.actionSequenceAutoSkipForward
  ) {
    ConfigManager.actionSequenceAutoSkipForward = false;
    ConfigManager.save();
  }
};
function Sprite_ActionSequenceSkipForwardButton() {
  this.initialize.apply(this, arguments);
}
Sprite_ActionSequenceSkipForwardButton.prototype = Object.create(
  Sprite.prototype
);
Sprite_ActionSequenceSkipForwardButton.prototype.constructor =
  Sprite_ActionSequenceSkipForwardButton;
Sprite_ActionSequenceSkipForwardButton.prototype.initialize = function (e) {
  this._type = e;
  Sprite.prototype.initialize.call(this);
  this.setupPosition();
  this.loadBitmap();
  this.opacity = 0;
};
Sprite_ActionSequenceSkipForwardButton.prototype.setupPosition = function () {
  if (this._type === "fastForward") {
    this.x = eval(Imported.Irina_ActSeqFsFwdSkip.fastForwardButtonX);
    this.y = eval(Imported.Irina_ActSeqFsFwdSkip.fastForwardButtonY);
  } else {
    this.x = eval(Imported.Irina_ActSeqFsFwdSkip.skipForwardButtonX);
    this.y = eval(Imported.Irina_ActSeqFsFwdSkip.skipForwardButtonY);
  }
};
Sprite_ActionSequenceSkipForwardButton.prototype.loadBitmap = function () {
  var e =
    this._type === "fastForward"
      ? Imported.Irina_ActSeqFsFwdSkip.fastForwardButtonImg
      : Imported.Irina_ActSeqFsFwdSkip.skipForwardButtonImg;
  if (e !== "") this.bitmap = ImageManager.loadSystem(e);
};
Sprite_ActionSequenceSkipForwardButton.prototype.update = function () {
  Sprite.prototype.update.call(this);
  this.updateFrame();
  this.updateOpacity();
  this.processTouch();
};
Sprite_ActionSequenceSkipForwardButton.prototype.updateFrame = function () {
  if (!this.bitmap) return;
  if (!this.bitmap.width) return;
  var e = 0;
  if (
    this._type === "fastForward" &&
    ConfigManager.actionSequenceAutoFastForward
  )
    e = 1;
  if (
    this._type === "skipForward" &&
    ConfigManager.actionSequenceAutoSkipForward
  )
    e = 1;
  var t = Math.floor(this.bitmap.width / 2);
  var a = this.bitmap.height;
  var i = e * t;
  this.setFrame(i, 0, t, a);
};
Sprite_ActionSequenceSkipForwardButton.prototype.updateOpacity = function () {
  if (this._type === "fastForward") {
    var e = Imported.Irina_ActSeqFsFwdSkip.fastForwardButtonShow;
  } else {
    var e = Imported.Irina_ActSeqFsFwdSkip.skipForwardButtonShow;
  }
  if (BattleManager._victoryPhase) e = false;
  this.opacity += e ? 8 : -8;
};
Sprite_ActionSequenceSkipForwardButton.prototype.processTouch = function () {
  if (
    this.visible &&
    this.opacity >= 255 &&
    TouchInput.isTriggered() &&
    this.isButtonTouched()
  ) {
    TouchInput.clear();
    if (this._type === "fastForward") {
      ConfigManager.actionSequenceAutoFastForward =
        !ConfigManager.actionSequenceAutoFastForward;
      var e = ConfigManager.actionSequenceAutoFastForward;
    } else {
      ConfigManager.actionSequenceAutoSkipForward =
        !ConfigManager.actionSequenceAutoSkipForward;
      var e = ConfigManager.actionSequenceAutoSkipForward;
      this.processSkipForwardIfPossible();
    }
    ConfigManager.save();
    $gameTemp._actionSequenceSkipTemporarilyAllowSE = true;
    if (e) {
      SoundManager.playEquip();
    } else {
      SoundManager.playCancel();
    }
    $gameTemp._actionSequenceSkipTemporarilyAllowSE = false;
  }
};
Sprite_ActionSequenceSkipForwardButton.prototype.processSkipForwardIfPossible =
  function () {
    if (!ConfigManager.actionSequenceAutoSkipForward) return;
    if (!$gameTemp._allowActionSequenceSkipForward) return;
    if ($gameTemp._actionSequenceSkippingForward) return;
    if (!BattleManager._action) return;
    if (!BattleManager._action.item()) return;
    if (BattleManager._action.item().note.match(/<CANNOT SKIP FORWARD>/i))
      return;
    SceneManager._scene.processActionSequenceSkipForward();
    setTimeout(this.delaySetTrue.bind(this), 1);
  };
Sprite_ActionSequenceSkipForwardButton.prototype.delaySetTrue = function () {
  ConfigManager.actionSequenceAutoSkipForward = true;
};
Sprite_ActionSequenceSkipForwardButton.prototype.isButtonTouched = function () {
  var e = this.canvasToLocalX(TouchInput.x);
  var t = this.canvasToLocalY(TouchInput.y);
  return e >= 0 && t >= 0 && e < this.width && t < this.height;
};
Sprite_ActionSequenceSkipForwardButton.prototype.canvasToLocalX = function (e) {
  var t = this;
  while (t) {
    e -= t.x;
    t = t.parent;
  }
  return e;
};
Sprite_ActionSequenceSkipForwardButton.prototype.canvasToLocalY = function (e) {
  var t = this;
  while (t) {
    e -= t.y;
    t = t.parent;
  }
  return e;
};
function Window_ActionSequenceFastForward() {
  this.initialize.apply(this, arguments);
}
Window_ActionSequenceFastForward.prototype = Object.create(
  Window_Base.prototype
);
Window_ActionSequenceFastForward.prototype.constructor =
  Window_ActionSequenceFastForward;
Window_ActionSequenceFastForward.prototype.initialize = function () {
  var width = eval(Imported.Irina_ActSeqFsFwdSkip.fastForwardWidth);
  var height = this.windowHeight();
  var x = eval(Imported.Irina_ActSeqFsFwdSkip.fastForwardScreenX);
  var y = eval(Imported.Irina_ActSeqFsFwdSkip.fastForwardScreenY);
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this.opacity = 0;
  this.contentsOpacity = 0;
  this.refresh();
};
Window_ActionSequenceFastForward.prototype.windowHeight = function () {
  return this.fittingHeight(2);
};
Window_ActionSequenceFastForward.prototype.standardPadding = function () {
  return 18;
};
Window_ActionSequenceFastForward.prototype.update = function () {
  Window_Base.prototype.update.call(this);
  if ($gameTemp.isActionSequenceFastForwarding()) {
    this.updateFadeIn();
  } else {
    this.updateFadeOut();
  }
};
Window_ActionSequenceFastForward.prototype.updateFadeIn = function () {
  this.contentsOpacity +=
    Imported.Irina_ActSeqFsFwdSkip.fastForwardWindowFadeSpeed;
};
Window_ActionSequenceFastForward.prototype.updateFadeOut = function () {
  this.contentsOpacity -=
    Imported.Irina_ActSeqFsFwdSkip.fastForwardWindowFadeSpeed;
};
Window_ActionSequenceFastForward.prototype.refresh = function () {
  this.contents.clear();
  var text = Imported.Irina_ActSeqFsFwdSkip.fastForwardMsg;
  this.contents.fontSize = Imported.Irina_ActSeqFsFwdSkip.fastForwardSize;
  this.contents.fontFace = Imported.Irina_ActSeqFsFwdSkip.fastForwardFont;
  eval(Imported.Irina_ActSeqFsFwdSkip.fastForwardWindowDrawCode);
};
function Window_ActionSequenceSkipForward() {
  this.initialize.apply(this, arguments);
}
Window_ActionSequenceSkipForward.prototype = Object.create(
  Window_Base.prototype
);
Window_ActionSequenceSkipForward.prototype.constructor =
  Window_ActionSequenceSkipForward;
Window_ActionSequenceSkipForward.prototype.initialize = function () {
  var width = eval(Imported.Irina_ActSeqFsFwdSkip.skipforwardWidth);
  var height = this.windowHeight();
  var x = eval(Imported.Irina_ActSeqFsFwdSkip.skipforwardScreenX);
  var y = eval(Imported.Irina_ActSeqFsFwdSkip.skipforwardScreenY);
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this.opacity = 0;
  this.contentsOpacity = 0;
  this.refresh();
};
Window_ActionSequenceSkipForward.prototype.windowHeight = function () {
  return this.fittingHeight(2);
};
Window_ActionSequenceFastForward.prototype.standardPadding = function () {
  return 18;
};
Window_ActionSequenceSkipForward.prototype.update = function () {
  Window_Base.prototype.update.call(this);
  if ($gameTemp._actionSequenceSkippingForward) {
    this.updateFadeIn();
  } else {
    this.updateFadeOut();
  }
};
Window_ActionSequenceSkipForward.prototype.updateFadeIn = function () {
  this.contentsOpacity +=
    Imported.Irina_ActSeqFsFwdSkip.skipforwardWindowFadeSpeed;
};
Window_ActionSequenceSkipForward.prototype.updateFadeOut = function () {
  this.contentsOpacity -=
    Imported.Irina_ActSeqFsFwdSkip.skipforwardWindowFadeSpeed;
};
Window_ActionSequenceSkipForward.prototype.refresh = function () {
  this.contents.clear();
  var text = Imported.Irina_ActSeqFsFwdSkip.skipforwardMsg;
  this.contents.fontSize = Imported.Irina_ActSeqFsFwdSkip.skipforwardSize;
  this.contents.fontFace = Imported.Irina_ActSeqFsFwdSkip.skipforwardFont;
  eval(Imported.Irina_ActSeqFsFwdSkip.skipForwardWindowDrawCode);
};
Imported.Irina_ActSeqFsFwdSkip.Window_Options_addGeneralOptions =
  Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function () {
  Imported.Irina_ActSeqFsFwdSkip.Window_Options_addGeneralOptions.call(this);
  if (Imported.YEP_OptionsCore) return;
  if (Imported.Irina_ActSeqFsFwdSkip.fastForwardOptionShow)
    this.addCommand(
      Imported.Irina_ActSeqFsFwdSkip.fastForwardOptionName,
      "actionSequenceAutoFastForward"
    );
  if (Imported.Irina_ActSeqFsFwdSkip.skipforwardOptionShow)
    this.addCommand(
      Imported.Irina_ActSeqFsFwdSkip.skipforwardOptionName,
      "actionSequenceAutoSkipForward"
    );
};
Imported.Irina_ActSeqFsFwdSkip.BattleManager_actionWait =
  BattleManager.actionWait;
BattleManager.actionWait = function (e) {
  if ($gameTemp._actionSequenceSkippingForward) return false;
  return Imported.Irina_ActSeqFsFwdSkip.BattleManager_actionWait.call(this, e);
};
Imported.Irina_ActSeqFsFwdSkip.BattleManager_actionAniWait =
  BattleManager.actionAniWait;
BattleManager.actionAniWait = function (e) {
  if ($gameTemp._actionSequenceSkippingForward) return false;
  return Imported.Irina_ActSeqFsFwdSkip.BattleManager_actionAniWait.call(
    this,
    e
  );
};
Imported.Irina_ActSeqFsFwdSkip.Window_BattleLog_isFastForward =
  Window_BattleLog.prototype.isFastForward;
Window_BattleLog.prototype.isFastForward = function () {
  if ($gameTemp._actionSequenceSkippingForward) return true;
  return Imported.Irina_ActSeqFsFwdSkip.Window_BattleLog_isFastForward.call(
    this
  );
};
Imported.Irina_ActSeqFsFwdSkip.Window_BattleLog_setWaitMode =
  Window_BattleLog.prototype.setWaitMode;
Window_BattleLog.prototype.setWaitMode = function (e) {
  if ($gameTemp._actionSequenceSkippingForward) return (this._waitMode = "");
  Imported.Irina_ActSeqFsFwdSkip.Window_BattleLog_setWaitMode.call(this, e);
};
if (Imported.Irina_ActionSequenceImpact) {
  Imported.Irina_ActSeqFsFwdSkip.BattleManager_actionProjectileBase =
    BattleManager.actionProjectileBase;
  BattleManager.actionProjectileBase = function (e, t) {
    if ($gameTemp._actionSequenceSkippingForward) return [];
    return Imported.Irina_ActSeqFsFwdSkip.BattleManager_actionProjectileBase.call(
      this,
      e,
      t
    );
  };
}
