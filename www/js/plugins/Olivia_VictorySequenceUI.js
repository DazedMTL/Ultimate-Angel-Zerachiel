//=============================================================================
// Olivia Engine - Victory Sequence UI - for RPG Maker MV version 1.6.1
// Olivia_VictorySequenceUI.js
//=============================================================================
/*:
 * @plugindesc <VictorySequenceUI> for RPG Maker MV version 1.6.1.
 * @author Fallen Angel Olivia
 *
 * @help
 * This is a RPG Maker MV plugin that makes the battle system's victory sequence
 * only a single screen. It puts together all of the reward information gained
 * from battle onto a compact screen to display everything at once before the
 * player goes back to the map scene.
 *
 * This plugin best works in a game with a higher resolution. I recommend a
 * 16:9 screen ratio of roughly 1280x720 size. If you want to change your game
 * screen's resolution, please use Yanfly's Core Engine plugin:
 * http://yanfly.moe/2015/10/09/yep-1-core-engine/
 *
 * For the best camera panning effect, I suggest you use Yanfly's Battle Engine
 * Core and Action Sequence Packs 1 through 3 together in your game alongside
 * this plugin. You can find them here:
 * http://yanfly.moe/2015/10/10/yep-3-battle-engine-core/
 * http://yanfly.moe/2015/10/11/yep-4-action-sequence-pack-1/
 * http://yanfly.moe/2015/10/12/yep-5-action-sequence-pack-2/
 * http://yanfly.moe/2015/10/12/yep-6-action-sequence-pack-3/
 *
 * There are many plugin parameters to set up.
 *
 * -----------------
 * Plugin Parameters
 * -----------------
 *
 * Audio: Lets you adjust the settings for the sound effect played when a level
 * up occurs and the BGM that plays during the victory sequence.
 *
 * Transition: There is a brief moment of wait after the battle ends before
 * fading into the victory sequence. These plugin parameters let you control
 * all of that.
 *
 * Background: These plugin parameters adjust the many entities placed on the
 * victory sequence UI. Each one should be named after the section they are
 * responsible for managing.
 *
 * Rewards: These plugin parameters handle the displayed rewards found such as
 * money, EXP, and JP if you are using Yanfly's Job Points plugin.
 *
 * Status Windows: The status windows are in the lower left corner of the screen
 * and they display the actor's progress at the start of the victory sequence to
 * what they become after it. The plugin parameters manage those aspects.
 *
 * Continue Button: The continue button at the bottom right corner of the screen
 * appears after the status windows finish loading. They tell the player how to
 * exit the battle from the victory sequence.
 *
 * ---------------
 * Plugin Commands
 * ---------------
 *
 * If you want to turn on or off the victory sequence or the music, use these
 * plugin commands:
 *
 * EnableVictoryAftermath
 * DisableVictoryAftermath
 * This turns on or off the victory sequence. This one matches Yanfly's plugin
 * command so you don't have to change your game's plugin command call if you
 * are switching over.
 *
 * EnableVictoryMusic
 * DisableVictoryMusic
 * This turns on or off the victory BGM and ME. This one matches Yanfly's
 * plugin command so you don't have to change your game's plugin command call
 * if you are switching over.
 *
 * -------------------
 * W A R N I N G ! ! !
 * -------------------
 *
 * This plugin is made for RPG Maker MV versions 1.6.1 and below. If you update
 * RPG Maker MV past that and this plugin breaks, I am NOT responsible for it.
 *
 * -------------
 * Compatibility
 * -------------
 *
 * This plugin is compatible with the following plugins:
 *
 * - YEP Core Engine
 * - YEP Battle Engine Core
 * - YEP Action Sequence Packs 1, 2, 3
 * - YEP Animated Sideview Enemies
 * - YEP Buffs & States Core
 * - YEP Damage Core
 * - YEP Element Core
 * - YEP Item Core
 * - YEP Equip Core
 * - YEP Job Points
 *
 * Place this plugin under those in the Plugin Manager list.
 *
 * ------------
 * Terms of Use
 * ------------
 *
 * 1. These plugins may be used in free or commercial games.
 * 2. 'Fallen Angel Olivia' must be given credit in your games.
 * 3. You are allowed to edit the code.
 * 4. Do NOT change the filename, parameters, and information of the plugin.
 * 5. You are NOT allowed to redistribute these Plugins.
 * 6. You may NOT take code for your own released Plugins without credit.
 *
 * -------
 * Credits
 * -------
 *
 * If you are using this plugin, credit the following people:
 *
 * - Fallen Angel Olivia
 *
 * @param
 * @param
 * @param ATTENTION!!!
 * @default READ THE HELP FILE
 * @param
 * @param
 *
 * @param Victory Screen Audio
 * @text Audio
 * @parent Victory Screen UI
 *
 * @param Victory Screen Level Sound
 * @text Level Sound
 * @parent Victory Screen Audio
 * @type file
 * @dir audio/se/
 * @desc Filename for the sound effect used when a level up occurs
 * @default Skill2
 *
 * @param Victory Screen Level Sound Volume
 * @text Volume
 * @parent Victory Screen Level Sound
 * @type number
 * @desc Volume of this sound effect
 * @default 90
 *
 * @param Victory Screen Level Sound Pitch
 * @text Pitch
 * @parent Victory Screen Level Sound
 * @type number
 * @desc Pitch of this sound effect
 * @default 100
 *
 * @param Victory Screen Level Sound Pan
 * @text Pan
 * @parent Victory Screen Level Sound
 * @type number
 * @desc Pan of this sound effect
 * @default 0
 *
 * @param Victory Screen BGM
 * @text BGM
 * @parent Victory Screen Audio
 * @type file
 * @dir audio/bgm/
 * @desc Filename for the BGM used during the victory sequence
 * @default Ship3
 *
 * @param Victory Screen BGM Volume
 * @text Volume
 * @parent Victory Screen BGM
 * @type number
 * @desc Volume of this sound effect
 * @default 90
 *
 * @param Victory Screen BGM Pitch
 * @text Pitch
 * @parent Victory Screen BGM
 * @type number
 * @desc Pitch of this sound effect
 * @default 100
 *
 * @param Victory Screen BGM Pan
 * @text Pan
 * @parent Victory Screen BGM
 * @type number
 * @desc Pan of this sound effect
 * @default 0
 *
 * @param Victory Screen Transition
 * @text Transition
 * @parent Victory Screen UI
 *
 * @param Victory Screen Transition Power
 * @text Transition Power
 * @parent Victory Screen Transition
 * @type number
 * @min 1
 * @desc Transition power when entering victory sequence. Use higher numbers to make transition faster.
 * @default 8
 *
 * @param Victory Screen Hide Window Delay
 * @text Hide Window Delay
 * @parent Victory Screen Transition
 * @type number
 * @desc Milliseconds used to wait before hiding the status windows
 * @default 500
 *
 * @param Victory Screen Display Delay
 * @text Display Delay
 * @parent Victory Screen Transition
 * @type number
 * @desc Milliseconds used to wait before showing the display
 * @default 1000
 *
 * @param Victory Screen Zoom
 * @text Zoom?
 * @parent Victory Screen Transition
 * @type boolean
 * @on On
 * @off Off
 * @desc Zoom in to the party during the transition?
 * @default true
 *
 * @param Victory Screen Zoom X
 * @text X
 * @parent Victory Screen Zoom
 * @type number
 * @desc X coordinate to zoom in at
 * @default 700
 *
 * @param Victory Screen Zoom Y
 * @text Y
 * @parent Victory Screen Zoom
 * @type number
 * @desc Y coordinate to zoom in at
 * @default 460
 *
 * @param Victory Screen Zoom Scale
 * @text Scale
 * @parent Victory Screen Zoom
 * @desc Scale to zoom in at
 * @default 2.0
 *
 * @param Victory Screen Zoom Duration
 * @text Duration
 * @parent Victory Screen Zoom
 * @type number
 * @desc Duration in frames for the whole zoom
 * @default 300
 *
 * @param Victory Screen Background
 * @text Background
 * @parent Victory Screen UI
 *
 * @param Victory Screen Background Dimmer Height
 * @text Dim Start Rate
 * @parent Victory Screen Background
 * @desc The veritcal portion of the screen to start dimming at
 * @default 0.2
 *
 * @param Victory Screen Background Side Thickness
 * @text Side Thickness
 * @parent Victory Screen Background
 * @type number
 * @desc Amount of distance between the side of the screen and the contents
 * @default 96
 *
 * @param Victory Screen Background Middle Thickness
 * @text Middle Thickness
 * @parent Victory Screen Background
 * @type number
 * @desc Amount of distance between content in the middle of the screen
 * @default 96
 *
 * @param Victory Screen Background Text Items
 * @text Item Reward Text
 * @parent Victory Screen Background
 * @desc Text used to display the items received from battle
 * @default Items Obtained
 *
 * @param Victory Screen Background Text Items Font Size
 * @text Font Size
 * @parent Victory Screen Background Text Items
 * @type number
 * @min 1
 * @desc Font size used for Item Reward Text
 * @default 36
 *
 * @param Victory Screen Background Text Victory
 * @text Victory Text
 * @parent Victory Screen Background
 * @desc Text to display for Victory screen title
 * @default Victory!
 *
 * @param Victory Screen Background Text Victory Font Size
 * @text Font Size
 * @parent Victory Screen Background Text Victory
 * @type number
 * @min 1
 * @desc Font size used for Victory Text
 * @default 60
 *
 * @param Victory Screen Rewards
 * @text Rewards
 * @parent Victory Screen Background
 *
 * @param Victory Screen Rewards Category Font Size
 * @text Category Font Size
 * @parent Victory Screen Rewards
 * @type number
 * @min 1
 * @desc Font size used for reward categories
 * @default 20
 *
 * @param Victory Screen Rewards Category Font Color
 * @text Category Font Color
 * @parent Victory Screen Rewards
 * @type number
 * @desc Text color used for reward categories
 * @default 8
 *
 * @param Victory Screen Rewards Results Font Size
 * @text Results Font Size
 * @parent Victory Screen Rewards
 * @type number
 * @min 1
 * @desc Font size used for reward results
 * @default 28
 *
 * @param Victory Screen Rewards Results Font Color
 * @text Results Font Color
 * @parent Victory Screen Rewards
 * @type number
 * @desc Text color used for reward results
 * @default 0
 *
 * @param Victory Screen Status Windows
 * @text Status Windows
 * @parent Victory Screen UI
 *
 * @param Victory Screen Status Actor Font Size
 * @text Actor Name Font Size
 * @parent Victory Screen Status Windows
 * @type number
 * @min 1
 * @desc Font size used for actor names
 * @default 20
 *
 * @param Victory Screen Status Level Font Size
 * @text Level Font Size
 * @parent Victory Screen Status Windows
 * @type number
 * @min 1
 * @desc Font size used for levels
 * @default 20
 *
 * @param Victory Screen Status Level Format
 * @text Level Format
 * @parent Victory Screen Status Windows
 * @desc Text format used for levels. %1 is
 * @default Lv.%1
 *
 * @param Victory Screen Status JP Font Size
 * @text JP Font Size
 * @parent Victory Screen Status Windows
 * @type number
 * @min 1
 * @desc Font size used for JP
 * @default 16
 *
 * @param Victory Screen Status EXP Font Size
 * @text EXP Label Font Size
 * @parent Victory Screen Status Windows
 * @type number
 * @min 1
 * @desc Font size used for the EXP label
 * @default 16
 *
 * @param Victory Screen Status Update Duration
 * @text Update Duration
 * @parent Victory Screen Status Windows
 * @type number
 * @min 1
 * @desc Duration in frames for updating actors in the status windows
 * @default 180
 *
 * @param Victory Screen Status Current EXP Font Size
 * @text Current EXP Font Size
 * @parent Victory Screen Status Windows
 * @type number
 * @min 1
 * @desc Font size for current EXP
 * @default 20
 *
 * @param Victory Screen Status Current EXP Font Color
 * @text Current EXP Font Color
 * @parent Victory Screen Status Windows
 * @type number
 * @desc Text color for current EXP
 * @default 0
 *
 * @param Victory Screen Status Next EXP Font Size
 * @text Next EXP Font Size
 * @parent Victory Screen Status Windows
 * @type number
 * @min 1
 * @desc Font size for next level's EXP
 * @default 18
 *
 * @param Victory Screen Status Next EXP Font Color
 * @text Next EXP Font Color
 * @parent Victory Screen Status Windows
 * @type number
 * @desc Font color for next level's EXP
 * @default 8
 *
 * @param Victory Screen Status Exp Gauge Height
 * @text Gauge Height
 * @parent Victory Screen Status Windows
 * @type number
 * @min 3
 * @desc Height for EXP gauge
 * @default 18
 *
 * @param Victory Screen Status Exp Gauge Color 1
 * @text Gauge Color 1
 * @parent Victory Screen Status Windows
 * @type number
 * @desc Text color 1 for EXP gauge
 * @default 30
 *
 * @param Victory Screen Status Exp Gauge Color 2
 * @text Gauge Color 2
 * @parent Victory Screen Status Windows
 * @type number
 * @desc Text color 2 for EXP gauge
 * @default 31
 *
 * @param Victory Screen Status Level Up Text
 * @text Level Up Text
 * @parent Victory Screen Status Windows
 * @desc Text to display when a level is reached
 * @default Level Up!
 *
 * @param Victory Screen Status Level Up Font Size
 * @text Level Up Font Size
 * @parent Victory Screen Status Windows
 * @type number
 * @min 1
 * @desc Font size for Level Up Text
 * @default 36
 *
 * @param Victory Screen Status Level Up Color
 * @text Level Up Font Color
 * @parent Victory Screen Status Windows
 * @type number
 * @desc Text color for Level Up Text
 * @default 17
 *
 * @param Victory Screen Continue Button
 * @text Continue Button
 * @parent Victory Screen UI
 *
 * @param Victory Screen Continue Duration
 * @text Duration
 * @parent Victory Screen Continue Button
 * @type number
 * @min 1
 * @desc Duration in frames to wait before continue button appears
 * @default 180
 *
 * @param Victory Screen Continue Text
 * @text Text
 * @parent Victory Screen Continue Button
 * @desc Text to display to show at the bottom of the screen when ready to exit battle
 * @default Press \c[27]Z\c[0] or \c[27]X\c[0] to continue
 *
 * @param
 * @param　強引にmaster2015hp_OliviaVictoryAddonを合体
 *
 * @param acquired stats title
 * @desc the text display above Actor's Stat window
 * @type string[]
 * @default Acquired Stats
 *
 * @param acquired skills title
 * @desc the text display above Actor's Skill window
 * @type string[]
 * @default Acquired Skills
 *
 * @param acquire title font size
 * @desc font size for the titles
 * @type number
 * @min = 1
 * @default 16
 *
 * @param stats window width
 * @desc the width of Actors' Stat Window
 * @type number
 * @min = 0
 * @default 450
 *
 * @param stats window height
 * @desc the height for a single row of Actors' Stat Window
 * @type number
 * @min = 0
 * @default 68
 *
 * @param stats window x
 * @desc x position where the stats window be drawn
 * @type number
 * @min = 0
 * @default 300
 *
 * @param stats window y
 * @desc y position where the stats window be drawn
 * @type number
 * @min = 0
 * @default 200
 *
 * @param text indent
 * @desc amount of pixels that text being indented
 * @type number
 * @min = 0
 * @default 10
 *
 * @param portrait offsetX
 * @desc offset actors portrait on X axis
 * @type text
 * @default -10
 *
 * @param portrait offsetY
 * @desc offset actors portrait on Y axis
 * @type text
 * @default 10
 *
 * @param levelup sound
 * @desc sound to play at level up
 * @type file
 * @dir audio/se/
 * @default Raise1
 *
 * @param switchpage sound
 * @desc sound to play when switch skill page
 * @type file
 * @dir audio/se/
 * @default Cursor1
 *
 * @param
 * @param
 *
 */
//=============================================================================

var Imported = Imported || {};

//↓20220501 koke Add
(function () {
  //↑20220501 koke Add

  Imported.Olivia_OctoBattle = true;

  var Olivia = Olivia || {};
  Olivia.OctoBattle = Olivia.OctoBattle || {};

  var parameters = $plugins.filter(function (p) {
    return p.description.contains("<VictorySequenceUI>");
  })[0].parameters;

  Olivia.OctoBattle.VictoryUI = {
    Enabled: true,
    // Audio
    LevelUpSound: {
      name: String(parameters["Victory Screen Level Sound"]),
      volume: Number(parameters["Victory Screen Level Sound Volume"]),
      pitch: Number(parameters["Victory Screen Level Sound Pitch"]),
      pan: Number(parameters["Victory Screen Level Sound Pan"]),
    },
    VictoryBgm: {
      name: String(parameters["Victory Screen BGM"]),
      volume: Number(parameters["Victory Screen BGM Volume"]),
      pitch: Number(parameters["Victory Screen BGM Pitch"]),
      pan: Number(parameters["Victory Screen BGM Pan"]),
    },
    // Transition Phase
    TransitionPower: Number(parameters["Victory Screen Transition Power"]),
    WaitHideWindows: Number(parameters["Victory Screen Hide Window Delay"]),
    WaitDisplayVictory: Number(parameters["Victory Screen Display Delay"]),
    ZoomInTransition: eval(parameters["Victory Screen Zoom"]),
    ZoomX: Number(parameters["Victory Screen Zoom X"]),
    ZoomY: Number(parameters["Victory Screen Zoom Y"]),
    ZoomScale: Number(parameters["Victory Screen Zoom Scale"]),
    ZoomDuration: Number(parameters["Victory Screen Zoom Duration"]),
    // Background Visuals
    BackgroundDimHeight: Number(
      parameters["Victory Screen Background Dimmer Height"]
    ),
    SideThickness: Number(
      parameters["Victory Screen Background Side Thickness"]
    ),
    MiddleThickness: Number(
      parameters["Victory Screen Background Middle Thickness"]
    ),
    TextItems: String(parameters["Victory Screen Background Text Items"]),
    TextItemsFontSize: Number(
      parameters["Victory Screen Background Text Items Font Size"]
    ),
    TextVictory: String(parameters["Victory Screen Background Text Victory"]),
    TextVictoryFontSize: Number(
      parameters["Victory Screen Background Text Victory Font Size"]
    ),
    RewardCategoryFontSize: Number(
      parameters["Victory Screen Rewards Category Font Size"]
    ),
    RewardCategoryFontColor: Number(
      parameters["Victory Screen Rewards Category Font Color"]
    ),
    RewardResultsFontSize: Number(
      parameters["Victory Screen Rewards Results Font Size"]
    ),
    RewardResultsFontColor: Number(
      parameters["Victory Screen Rewards Results Font Color"]
    ),
    // Status Windows
    ActorNameFontSize: Number(
      parameters["Victory Screen Status Actor Font Size"]
    ),
    ActorLevelFontSize: Number(
      parameters["Victory Screen Status Level Font Size"]
    ),
    ActorLevelFormat: String(parameters["Victory Screen Status Level Format"]),
    ActorJPFontSize: Number(parameters["Victory Screen Status JP Font Size"]),
    ActorEXPFontSize: Number(parameters["Victory Screen Status EXP Font Size"]),
    ActorUpdateDuration: Number(
      parameters["Victory Screen Status Update Duration"]
    ),
    ExpCurrentFontSize: Number(
      parameters["Victory Screen Status Current EXP Font Size"]
    ),
    ExpCurrentFontColor: Number(
      parameters["Victory Screen Status Current EXP Font Color"]
    ),
    ExpNextFontSize: Number(
      parameters["Victory Screen Status Next EXP Font Size"]
    ),
    ExpNextFontColor: Number(
      parameters["Victory Screen Status Next EXP Font Color"]
    ),
    ExpGaugeHeight: Number(
      parameters["Victory Screen Status Exp Gauge Height"]
    ),
    ExpGaugeColor1: Number(
      parameters["Victory Screen Status Exp Gauge Color 1"]
    ),
    ExpGaugeColor2: Number(
      parameters["Victory Screen Status Exp Gauge Color 2"]
    ),
    LevelUpText: String(parameters["Victory Screen Status Level Up Text"]),
    LevelUpTextFontSize: Number(
      parameters["Victory Screen Status Level Up Font Size"]
    ),
    LevelUpTextColor: Number(
      parameters["Victory Screen Status Level Up Color"]
    ),
    // Continue Button
    ContinueDuration: Number(parameters["Victory Screen Continue Duration"]),
    ContinueText: String(parameters["Victory Screen Continue Text"]),
  };

  //↓20220501 koke Add
  var parameters = PluginManager.parameters("Olivia_VictorySequenceUI");
  var str1 = parameters["acquired stats title"];
  var str2 = parameters["acquired skills title"];
  var cFontSize = Math.floor(Number(parameters["acquire title font size"]));
  var actorStat_w = Math.floor(Number(parameters["stats window width"]));
  var actorStat_h = Math.floor(Number(parameters["stats window height"]));
  var actorStat_x = Math.floor(Number(parameters["stats window x"]));
  var actorStat_y = Math.floor(Number(parameters["stats window y"]));
  var portraitOffsetX = Math.floor(Number(parameters["portrait offsetX"])) || 0;
  var portraitOffsetY = Math.floor(Number(parameters["portrait offsetY"])) || 0;
  var levelUpSE = parameters["levelup sound"];
  var turnPageSE = parameters["switchpage sound"];
  var subStat_y = 0;
  var actorStat_index = -1;
  var actorSkill_index = -1;
  var subSkill_y = 0;
  var ckeIndent = Math.floor(Number(parameters["text indent"]));
  var ckeLevelUpPhase = false;
  //↑20220501 koke Add

  //=============================================================================
  // Victory HUD
  //
  // 1. Display Gold earned, EXP earned, JP earned
  // 2. Display EXP progress and JP total
  // 3. Display item list

  // if (Olivia.OctoBattle.VictoryUI.Enabled) {

  Olivia.OctoBattle.Victory = Olivia.OctoBattle.Victory || {};

  //-----------------------------------------------------------------------------
  // Bitmap
  //
  // Draw Functions

  Bitmap.prototype.drawBattlePolygon = function (
    points,
    color,
    weight,
    opacity,
    stroke
  ) {
    var context = this._context;
    context.save();
    context.beginPath();
    context.moveTo(points[0], points[1]);
    for (var i = 2; i < points.length; i += 2) {
      context.lineTo(points[i], points[i + 1]);
    }
    context.lineTo(points[0], points[1]);
    context.strokeStyle = color;
    context.lineWidth = weight;
    if (stroke) {
      context.stroke();
    }
    context.globalAlpha = opacity;
    context.fillStyle = color;
    context.fill();
    context.globalAlpha = 1;
    context.restore();
    this._setDirty();
  };

  //-----------------------------------------------------------------------------
  // BattleManager
  //
  // The static class that manages battle progress.

  Olivia.OctoBattle.Victory.___BattleManager_initMembers___ =
    BattleManager.initMembers;
  BattleManager.initMembers = function () {
    Olivia.OctoBattle.Victory.___BattleManager_initMembers___.call(this);
    this._victoryPhase = false;
  };

  Olivia.OctoBattle.Victory.___BattleManager_isBusy___ = BattleManager.isBusy;
  BattleManager.isBusy = function () {
    if (this._phase === "battleEnd" && this._victoryPhase) {
      return true;
    } else {
      return Olivia.OctoBattle.Victory.___BattleManager_isBusy___.call(this);
    }
  };

  BattleManager.processVictory = function () {
    this._logWindow.clear();
    this._victoryPhase = true;
    if (this._windowLayer) {
      this._windowLayer.x = 0;
    }
    this._phase = "battleEnd";
    $gameParty.removeBattleStates();
    if (
      !$gameSystem.skipVictoryMusic() &&
      !$gameSystem.skipVictoryAftermath()
    ) {
      this.playVictoryMe();
      this.playVictoryBgm();
    }
    this.makeTempActors();
    this.makeRewards();
    this.gainRewards();
    this.endBattle(0);
    if ($gameSystem.skipVictoryAftermath()) {
      setTimeout(BattleManager.updateBattleEnd.bind(this), 1000);
    } else {
      if (Olivia.OctoBattle.VictoryUI.ZoomInTransition) {
        this.startVictoryZoom();
      }
      $gameParty.performVictory();
      setTimeout(
        SceneManager._scene.hideAllWindows.bind(SceneManager._scene),
        Olivia.OctoBattle.VictoryUI.WaitHideWindows
      );
      setTimeout(
        SceneManager._scene.createVictoryWindows.bind(SceneManager._scene),
        Olivia.OctoBattle.VictoryUI.WaitDisplayVictory
      );
    }
  };

  BattleManager.playVictoryBgm = function () {
    AudioManager.playBgm(Olivia.OctoBattle.VictoryUI.VictoryBgm);
  };

  BattleManager.makeTempActors = function () {
    var members = $gameParty.members();
    this._tempActors = [];
    for (var i = 0; i < members.length; i++) {
      var member = members[i];
      this._tempActors[i] = JsonEx.makeDeepCopy(member);
    }
  };

  BattleManager.startVictoryZoom = function () {
    var x = Olivia.OctoBattle.VictoryUI.ZoomX;
    var y = Olivia.OctoBattle.VictoryUI.ZoomY;
    var scale = Olivia.OctoBattle.VictoryUI.ZoomScale;
    var duration = Olivia.OctoBattle.VictoryUI.ZoomDuration;
    if (Imported.YEP_BattleEngineCore && Imported.YEP_X_ActSeqPack3) {
      this._cameraX = x;
      this._cameraY = y;
      $gameScreen.setCameraDuration(duration);
      $gameScreen.startBattleZoom(scale, duration);
    } else {
      $gameScreen.startZoom(x, y, scale, duration);
    }
  };

  BattleManager.endVictoryPhase = function () {
    this.updateBattleEnd();
    this.replayBgmAndBgs();
  };

  //-----------------------------------------------------------------------------
  // Game_System
  //
  // The game object class for the system data.

  Olivia.OctoBattle.Victory.___Game_System_initialize___ =
    Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    Olivia.OctoBattle.Victory.___Game_System_initialize___.call(this);
    this._skipVictoryAftermath = false;
    this._skipVictoryMusic = false;
  };

  Game_System.prototype.skipVictoryAftermath = function () {
    return this._skipVictoryAftermath;
  };

  Game_System.prototype.skipVictoryMusic = function () {
    return this._skipVictoryMusic;
  };

  //-----------------------------------------------------------------------------
  // Game_Actor
  //
  // The game object class for an actor.

  Olivia.OctoBattle.Victory.___Game_Actor_shouldDisplayLevelUp___ =
    Game_Actor.prototype.shouldDisplayLevelUp;
  Game_Actor.prototype.shouldDisplayLevelUp = function () {
    if ($gameParty.inBattle()) {
      return false;
    }
    return Olivia.OctoBattle.Victory.___Game_Actor_shouldDisplayLevelUp___.call(
      this
    );
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //
  // The interpreter for running event commands.

  Olivia.OctoBattle.Victory.___Game_Interpreter_pluginCommand___ =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    Olivia.OctoBattle.Victory.___Game_Interpreter_pluginCommand___.call(
      this,
      command,
      args
    );
    if (command.match(/DisableVictoryAftermath/i)) {
      $gameSystem._skipVictoryAftermath = true;
    } else if (command.match(/EnableVictoryAftermath/i)) {
      $gameSystem._skipVictoryAftermath = false;
    } else if (command.match(/DisableVictoryMusic/i)) {
      $gameSystem._skipVictoryMusic = true;
    } else if (command.match(/EnableVictoryMusic/i)) {
      $gameSystem._skipVictoryMusic = false;
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Battle
  //
  // The scene class of the battle screen.

  Scene_Battle.prototype.hideAllWindows = function () {
    for (var i = 0; i < this._windowLayer.children.length; i++) {
      var child = this._windowLayer.children[i];
      if (!!child) {
        child.hide();
      }
    }
  };

  Scene_Battle.prototype.createVictoryWindows = function () {
    this._victoryWindow = new Window_BattleVictory();
    this.addWindow(this._victoryWindow);
  };

  Olivia.OctoBattle.Victory.___Scene_Battle_terminate___ =
    Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function () {
    Olivia.OctoBattle.Victory.___Scene_Battle_terminate___.call(this);
    if (Olivia.OctoBattle.VictoryUI.ZoomInTransition) {
      $gameScreen.clearZoom();
    }
  };

  //-----------------------------------------------------------------------------
  // Window_BattleVictory
  //
  // The window for displaying the victory results of battle

  function Window_BattleVictory() {
    this.initialize.apply(this, arguments);
  }

  Window_BattleVictory.prototype = Object.create(Window_Base.prototype);
  Window_BattleVictory.prototype.constructor = Window_BattleVictory;

  Window_BattleVictory.prototype.initialize = function () {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.opacity = 0;
    this.contentsOpacity = 0;
    this.createSubWindows();
    this.refresh();
  };

  Window_BattleVictory.prototype.standardPadding = function () {
    return 0;
  };

  Window_BattleVictory.prototype.createSubWindows = function () {
    if (BattleManager._rewards.items.length > 0) {
      this.createItemListWindow();
    }
    this.createActorWindows();
    this.createContinueWindow();
  };

  Window_BattleVictory.prototype.createItemListWindow = function () {
    var x = Math.round(
      (this.width + Olivia.OctoBattle.VictoryUI.MiddleThickness) / 2
    );
    var y =
      Math.round(
        this.height * Olivia.OctoBattle.VictoryUI.BackgroundDimHeight
      ) + Math.round(this.lineHeight() * 2.5);
    var w = this.width - x - Olivia.OctoBattle.VictoryUI.SideThickness;
    var h =
      this.height -
      y -
      this.lineHeight() * 1.5 -
      Window_Base.prototype.standardPadding.call(this) * 2;
    this._itemWindow = new Window_BattleVictoryItems(x, y, w, h);
    this.addChild(this._itemWindow);
  };

  Window_BattleVictory.prototype.createActorWindows = function () {
    var members = $gameParty.members();
    for (var i = 0; i < members.length; i++) {
      var member = members[i];
      if (!!member) {
        var actorWindow = new Window_BattleVictoryActor(i, member);
        this.addChild(actorWindow);
      }
    }
  };

  Window_BattleVictory.prototype.createContinueWindow = function () {
    this._continueWindow = new Window_BattleVictoryContinue();
    this.addChild(this._continueWindow);
  };

  Window_BattleVictory.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.contentsOpacity += Olivia.OctoBattle.VictoryUI.TransitionPower;
  };

  Window_BattleVictory.prototype.refresh = function () {
    this.contents.clear();
    this.drawBackground();
    this.drawForeground();
  };

  Window_BattleVictory.prototype.drawBackground = function () {
    this.drawBackgroundMajorFadeOut();
    this.drawBackgroundRewardStrips();
  };

  Window_BattleVictory.prototype.drawBackgroundMajorFadeOut = function () {
    var y = Math.round(
      this.height * Olivia.OctoBattle.VictoryUI.BackgroundDimHeight
    );
    var lowerHeight =
      this.lineHeight() + Window_Base.prototype.standardPadding.call(this) * 2;
    var height = this.height - y - lowerHeight;
    var width = this.width * 2;
    this.contents.gradientFillRect(
      0,
      y,
      width,
      height,
      this.dimColor1(),
      this.dimColor2()
    );
    this.contents.gradientFillRect(
      0,
      this.height - lowerHeight + 2,
      this.width,
      lowerHeight - 2,
      this.dimColor2(),
      this.dimColor1()
    );
    this.changePaintOpacity(false);
    this.contents.fillRect(0, y - 2, width, 2, this.normalColor());
    this.contents.fillRect(
      0,
      this.height - lowerHeight,
      width,
      2,
      this.normalColor()
    );
    if (BattleManager._rewards.items.length > 0) {
      var lx = Math.round(this.width / 2);
      var ly = y + this.lineHeight() * 2;
      var lw = this.width - lx - Olivia.OctoBattle.VictoryUI.SideThickness;
      this.contents.fillRect(lx, ly, lw, 2, this.normalColor());
    }
  };

  Window_BattleVictory.prototype.drawBackgroundRewardStrips = function () {
    var x = Olivia.OctoBattle.VictoryUI.SideThickness;
    var y1 =
      Math.round(
        this.height * Olivia.OctoBattle.VictoryUI.BackgroundDimHeight
      ) + this.lineHeight();
    var y2 = y1 + this.lineHeight() + 2;
    var y3 = y2 + this.lineHeight() + 2;
    var width =
      Math.round(this.width / 2) -
      Olivia.OctoBattle.VictoryUI.SideThickness -
      Math.round(Olivia.OctoBattle.VictoryUI.MiddleThickness / 2);
    var width1 = Math.round(width * 0.8);
    var width2 = width - width1;
    this.changePaintOpacity(false);
    this.drawBackgroundRewardStrip(x, y1, width1, width2);
    this.drawBackgroundRewardStrip(x, y2, width1, width2);
    if (Imported.YEP_JobPoints) {
      this.drawBackgroundRewardStrip(x, y3, width1, width2);
    }
  };

  Window_BattleVictory.prototype.drawBackgroundRewardStrip = function (
    x,
    y,
    width1,
    width2
  ) {
    var lh = this.lineHeight();
    var hlh = Math.round(this.lineHeight() / 2);
    x += hlh;
    width1 -= hlh;
    var points = [x, y, x - hlh, y + hlh, x, y + lh];
    this.changePaintOpacity(false);
    var opacity = this.translucentOpacity() / 255;
    this.contents.drawBattlePolygon(
      points,
      this.normalColor(),
      0,
      opacity,
      false
    );
    this.contents.fillRect(x, y, width1, lh, this.normalColor());
    this.contents.gradientFillRect(
      x + width1,
      y,
      width2,
      lh,
      this.normalColor(),
      this.dimColor2()
    );
  };

  Window_BattleVictory.prototype.drawForeground = function () {
    this.drawForgreoundVictoryText();
    this.drawForegroundRewardText();
    if (BattleManager._rewards.items.length > 0) {
      this.drawForegroundItemsObtained();
    }
  };

  Window_BattleVictory.prototype.drawForgreoundVictoryText = function () {
    this.changePaintOpacity(true);
    this.resetFontSettings();
    var text = Olivia.OctoBattle.VictoryUI.TextVictory;
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.TextVictoryFontSize;
    var x = Olivia.OctoBattle.VictoryUI.SideThickness;
    var y =
      Math.round(
        this.height * Olivia.OctoBattle.VictoryUI.BackgroundDimHeight
      ) - Math.round(Olivia.OctoBattle.VictoryUI.TextVictoryFontSize / 2);
    this.drawText(text, x, y, this.width);
  };

  Window_BattleVictory.prototype.drawForegroundRewardText = function () {
    this.changePaintOpacity(true);
    this.resetFontSettings();
    var x =
      Olivia.OctoBattle.VictoryUI.SideThickness +
      Math.round(this.lineHeight() / 2);
    var y1 =
      Math.round(
        this.height * Olivia.OctoBattle.VictoryUI.BackgroundDimHeight
      ) + this.lineHeight();
    var y2 = y1 + this.lineHeight() + 2;
    var y3 = y2 + this.lineHeight() + 2;
    var width =
      Math.round(this.width / 2) -
      Olivia.OctoBattle.VictoryUI.SideThickness -
      Math.round(Olivia.OctoBattle.VictoryUI.MiddleThickness / 2);
    var width1 = Math.round(width * 0.5);
    var width2 = Math.round(width * 0.75);

    this.drawForegroundRewards(x, y1, width1, width2, "gold");
    this.drawForegroundRewards(x, y2, width1, width2, "exp");
    if (Imported.YEP_JobPoints) {
      this.drawForegroundRewards(x, y3, width1, width2, "jp");
    }
  };

  Window_BattleVictory.prototype.drawForegroundRewards = function (
    x,
    y,
    width1,
    width2,
    type
  ) {
    if (type === "gold") {
      var text1 = TextManager.currencyUnit;
      var text2 = BattleManager._rewards.gold;
    } else if (type === "exp") {
      var text1 = TextManager.exp;
      var text2 = BattleManager._rewards.exp;
    } else if (type === "jp") {
      var text1 = Yanfly.Param.Jp;
      var text2 = BattleManager._rewards.jp;
    } else {
      return;
    }
    if (Imported.YEP_CoreEngine) {
      text2 = Yanfly.Util.toGroup(text2);
    }
    this.changePaintOpacity(false);
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.RewardCategoryFontSize;
    this.changeTextColor(
      this.textColor(Olivia.OctoBattle.VictoryUI.RewardCategoryFontColor)
    );
    this.drawText(text1, x, y, width1, "left");
    this.changePaintOpacity(true);
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.RewardResultsFontSize;
    this.changeTextColor(
      this.textColor(Olivia.OctoBattle.VictoryUI.RewardResultsFontColor)
    );
    this.drawText(text2, x, y, width2, "right");
  };

  Window_BattleVictory.prototype.drawForegroundItemsObtained = function () {
    this.changePaintOpacity(true);
    this.resetFontSettings();
    var text = Olivia.OctoBattle.VictoryUI.TextItems;
    var x = Math.round(
      (this.width + Olivia.OctoBattle.VictoryUI.MiddleThickness) / 2
    );
    var y = Math.round(
      this.height * Olivia.OctoBattle.VictoryUI.BackgroundDimHeight
    );
    var w = this.width - x - Olivia.OctoBattle.VictoryUI.SideThickness;
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.TextItemsFontSize;
    this.contents.drawText(text, x, y, w, this.lineHeight() * 2, "left");
  };

  //-----------------------------------------------------------------------------
  // Window_BattleVictoryContinue
  //
  // The window for displaying the description of the selected item.

  function Window_BattleVictoryContinue() {
    this.initialize.apply(this, arguments);
  }

  Window_BattleVictoryContinue.prototype = Object.create(Window_Base.prototype);
  Window_BattleVictoryContinue.prototype.constructor =
    Window_BattleVictoryContinue;

  Window_BattleVictoryContinue.prototype.initialize = function () {
    this._duration = Olivia.OctoBattle.VictoryUI.ContinueDuration;
    Window_Base.prototype.initialize.call(
      this,
      0,
      0,
      Graphics.boxWidth,
      this.lineHeight()
    );
    this.opacity = 0;
    this.contentsOpacity = 0;
    this.refresh();
  };

  Window_BattleVictoryContinue.prototype.standardPadding = function () {
    return 0;
  };

  Window_BattleVictoryContinue.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._duration > 0) {
      if (
        Input.isRepeated("ok") ||
        Input.isRepeated("cancel") ||
        TouchInput.isTriggered()
      ) {
        Input.clear();
        TouchInput.clear();
        this._duration = 1;
      } else {
        this._duration--;
      }
    } else if (
      !this._ending &&
      (Input.isRepeated("ok") ||
        Input.isRepeated("cancel") ||
        TouchInput.isTriggered())
    ) {
      Input.clear();
      TouchInput.clear();
      this._ending = true;
      BattleManager.endVictoryPhase();
    } else {
      this.contentsOpacity += Olivia.OctoBattle.VictoryUI.TransitionPower;
    }
  };

  Window_BattleVictoryContinue.prototype.refresh = function () {
    this.contents.clear();
    var text = Olivia.OctoBattle.VictoryUI.ContinueText;
    this.drawTextEx(text, this.textPadding(), 0);
    var width = this.textWidthEx(text) + this.textPadding() * 2;
    this.x =
      Graphics.boxWidth - Olivia.OctoBattle.VictoryUI.SideThickness - width;
    this.y = Graphics.boxHeight - Math.round(this.lineHeight() * 1.5);
  };

  Window_BattleVictoryContinue.prototype.textWidthEx = function (text) {
    return this.drawTextEx(text, 0, this.contents.height);
  };

  //-----------------------------------------------------------------------------
  // Window_BattleVictoryItems
  //
  // The window for displaying the items acquired from battle

  function Window_BattleVictoryItems() {
    this.initialize.apply(this, arguments);
  }

  Window_BattleVictoryItems.prototype = Object.create(
    Window_ItemList.prototype
  );
  Window_BattleVictoryItems.prototype.constructor = Window_BattleVictoryItems;

  Window_BattleVictoryItems.prototype.initialize = function (
    x,
    y,
    width,
    height
  ) {
    height = Math.floor(height / this.lineHeight()) * this.lineHeight();
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    this.opacity = 0;
    this.contentsOpacity = 0;
    this.show();
    this.refresh();
    var delay = Math.ceil(255 / Olivia.OctoBattle.VictoryUI.TransitionPower);
    setTimeout(this.processReady.bind(this), delay);
  };

  Window_BattleVictoryItems.prototype.standardPadding = function () {
    return 0;
  };

  Window_BattleVictoryItems.prototype.maxCols = function () {
    return 1;
  };

  Window_BattleVictoryItems.prototype.processReady = function () {
    if (this._data.length > this.height / this.lineHeight()) {
      this.activate();
      this.select(0);
    }
  };

  Window_BattleVictoryItems.prototype.update = function () {
    Window_ItemList.prototype.update.call(this);
    this.contentsOpacity += Olivia.OctoBattle.VictoryUI.TransitionPower;
  };

  Window_BattleVictoryItems.prototype.makeItemList = function () {
    this._data = [];
    this._dropItems = [];
    this._dropWeapons = [];
    this._dropArmors = [];
    this.extractDrops();
  };

  Window_BattleVictoryItems.prototype.isEnabled = function (item) {
    return true;
  };

  // Code borrowed from Yanfly Victory Aftermath
  Window_BattleVictoryItems.prototype.extractDrops = function () {
    BattleManager._rewards.items.forEach(function (item) {
      if (!item) return;
      if (DataManager.isItem(item)) this._dropItems.push(item.id);
      if (DataManager.isWeapon(item)) this._dropWeapons.push(item.id);
      if (DataManager.isArmor(item)) this._dropArmors.push(item.id);
    }, this);
    this._dropItems.sort(function (a, b) {
      return a - b;
    });
    this._dropWeapons.sort(function (a, b) {
      return a - b;
    });
    this._dropArmors.sort(function (a, b) {
      return a - b;
    });
    this._dropItems.forEach(function (id) {
      var item = $dataItems[id];
      if (item && !this._data.contains(item)) this._data.push(item);
    }, this);
    this._dropWeapons.forEach(function (id) {
      var item = $dataWeapons[id];
      if (item && !this._data.contains(item)) this._data.push(item);
    }, this);
    this._dropArmors.forEach(function (id) {
      var item = $dataArmors[id];
      if (item && !this._data.contains(item)) this._data.push(item);
    }, this);
  };

  // Code borrowed from Yanfly Victory Aftermath
  Window_BattleVictoryItems.prototype.drawItemNumber = function (
    item,
    x,
    y,
    width
  ) {
    if (!this.needsNumber()) return;
    var numItems = this.numItems(item);
    if (Imported.YEP_CoreEngine) {
      numItems = Yanfly.Util.toGroup(this.numItems(item));
      this.contents.fontSize = Yanfly.Param.ItemQuantitySize || 28;
    } else {
      this.contents.fontSize = 20;
    }
    this.drawText("\u00d7" + numItems, x, y, width, "right");
    this.resetFontSettings();
  };

  // Code borrowed from Yanfly Victory Aftermath
  Window_BattleVictoryItems.prototype.numItems = function (item) {
    if (DataManager.isItem(item)) {
      return this.getCount(item.id, this._dropItems);
    }
    if (DataManager.isWeapon(item)) {
      return this.getCount(item.id, this._dropWeapons);
    }
    if (DataManager.isArmor(item)) {
      return this.getCount(item.id, this._dropArmors);
    }
    return 0;
  };

  // Code borrowed from Yanfly Victory Aftermath
  Window_BattleVictoryItems.prototype.getCount = function (value, arr) {
    var occur = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === value) occur++;
    }
    return occur;
  };

  // Code borrowed from Yanfly Core Engine
  Yanfly.Util.toGroup = function (inVal) {
    if (typeof inVal === "string") return inVal;
    return inVal.toLocaleString("en");
    return inVal.replace(/(^|[^\w.])(\d{4,})/g, function ($0, $1, $2) {
      return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
  };

  //-----------------------------------------------------------------------------
  // Window_BattleVictoryActor
  //
  // The window for displaying the description of the selected item.

  function Window_BattleVictoryActor() {
    this.initialize.apply(this, arguments);
  }

  Window_BattleVictoryActor.prototype = Object.create(Window_Base.prototype);
  Window_BattleVictoryActor.prototype.constructor = Window_BattleVictoryActor;

  Window_BattleVictoryActor.prototype.initialize = function (index, actor) {
    this._index = index;
    this._actor = actor;
    this._tempActor = BattleManager._tempActors[index];
    var x = Olivia.OctoBattle.VictoryUI.SideThickness;
    var y =
      Math.round(
        Graphics.boxHeight * Olivia.OctoBattle.VictoryUI.BackgroundDimHeight
      ) +
      this.lineHeight() * 5 -
      4;
    y +=
      index * this.lineHeight() * 2 +
      index * Math.ceil(this.lineHeight() / 4) -
      Math.round(this.lineHeight() / 4);
    if (!Imported.YEP_JobPoints) {
      y -= Math.round(this.lineHeight() / 2) + 2;
    }
    var width =
      Math.round(Graphics.boxWidth / 2) -
      Olivia.OctoBattle.VictoryUI.SideThickness -
      Math.round(Olivia.OctoBattle.VictoryUI.MiddleThickness / 2);
    var height = this.lineHeight() * 2;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.createSubWindow();
    this.opacity = 0;
    this.contentsOpacity = 0;
    this.refresh();
  };

  Window_BattleVictoryActor.prototype.standardPadding = function () {
    return 0;
  };

  Window_BattleVictoryActor.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.contentsOpacity += Olivia.OctoBattle.VictoryUI.TransitionPower;
  };

  Window_BattleVictoryActor.prototype.createSubWindow = function () {
    this._subWindow = new Window_BattleVictoryActorSub(
      this,
      this._actor,
      this._tempActor
    );
    this.addChild(this._subWindow);
  };

  Window_BattleVictoryActor.prototype.refresh = function () {
    this.contents.clear();
    this.drawBackgroundStrip();
    this.drawForegroundGaugeBack();
    this.drawForegroundActorName();
    if (Imported.YEP_JobPoints) {
      this.drawForegroundJPLabel();
    }
  };

  Window_BattleVictoryActor.prototype.drawBackgroundStrip = function () {
    this.changePaintOpacity(false);
    var lh = this.lineHeight();
    var hlh = Math.round(this.lineHeight() / 2);
    var width = this.width - lh;
    var points = [
      hlh,
      0,
      0,
      hlh,
      hlh,
      lh,
      hlh + width,
      lh,
      width + lh,
      hlh,
      width + hlh,
      0,
    ];
    this.contents.drawBattlePolygon(points, this.dimColor1(), 0, 255, false);
    this.contents.fillRect(hlh, this.height - 2, width, 2, this.normalColor());
  };

  Window_BattleVictoryActor.prototype.drawForegroundGaugeBack = function () {
    this.changePaintOpacity(false);
    var width = this.width - this.lineHeight();
    var height = Olivia.OctoBattle.VictoryUI.ExpGaugeHeight;
    var x = Math.round(this.lineHeight() / 2);
    var y = this.height - height - 6;
    this.contents.fillRect(x, y, width, height, this.gaugeBackColor());
  };

  Window_BattleVictoryActor.prototype.drawForegroundActorName = function () {
    this.changePaintOpacity(true);
    this.resetFontSettings();
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.ActorNameFontSize;
    this.drawText(
      this._actor.name(),
      Math.round(this.lineHeight() / 2),
      0,
      this.width - this.lineHeight()
    );
  };

  Window_BattleVictoryActor.prototype.drawForegroundJPLabel = function () {
    this.changePaintOpacity(true);
    this.resetFontSettings();
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.ActorJPFontSize;
    this.drawText(
      Yanfly.Param.Jp,
      Math.round(this.lineHeight() / 2),
      0,
      this.width - this.lineHeight(),
      "right"
    );
  };

  //-----------------------------------------------------------------------------
  // Window_BattleVictoryActorSub
  //
  // The window for displaying the description of the selected item.

  function Window_BattleVictoryActorSub() {
    this.initialize.apply(this, arguments);
  }

  Window_BattleVictoryActorSub.prototype = Object.create(Window_Base.prototype);
  Window_BattleVictoryActorSub.prototype.constructor =
    Window_BattleVictoryActorSub;

  Window_BattleVictoryActorSub.prototype.initialize = function (
    parent,
    actor,
    tempActor
  ) {
    this._actor = actor;
    this._tempActor = tempActor;
    this._duration = Olivia.OctoBattle.VictoryUI.ActorUpdateDuration || 1;
    Window_Base.prototype.initialize.call(
      this,
      0,
      0,
      parent.width,
      parent.height
    );
    this.setupConstants();
    this.calculateNextLevelConstants();
    this.createGaugeSprite();
    this.createLevelUpSprite();
    this.opacity = 0;
    this.contentsOpacity = 0;
    this.refresh();
  };

  Window_BattleVictoryActorSub.prototype.standardPadding = function () {
    return 0;
  };

  Window_BattleVictoryActorSub.prototype.setupConstants = function () {
    this._expWidth = this.width - this.lineHeight();
    this._exp = this._tempActor.currentExp();
    this._expTarget = this._actor.currentExp();
    this._level = this._tempActor.level;
    this._levelText = this._level;
    this._levelText = Yanfly.Util.toGroup(this._levelText);
    this._levelText = Olivia.OctoBattle.VictoryUI.ActorLevelFormat.format(
      this._levelText
    );
    this._maxLevel = this._tempActor.isMaxLevel();
    if (Imported.YEP_JobPoints) {
      this.contents.fontSize = Olivia.OctoBattle.VictoryUI.ActorJPFontSize;
      this._jpTextWidth = this.textWidth(Yanfly.Param.Jp + " ");
      this._jp = this._tempActor.jp();
      this._jpTarget = this._actor.jp();
    }
  };

  Window_BattleVictoryActorSub.prototype.calculateNextLevelConstants =
    function () {
      if (this._level >= this._actor.maxLevel()) {
        this._level = this._actor.maxLevel();
        this._currentLevelExp = "-";
        this._nextLevelExp = "-";
        this._maxLevel = true;
      } else {
        this._currentLevelExp = this._actor.expForLevel(this._level);
        this._nextLevelExp = this._actor.expForLevel(this._level + 1);
      }
    };

  Window_BattleVictoryActorSub.prototype.createGaugeSprite = function () {
    var width = this.width - this.lineHeight();
    var height = Olivia.OctoBattle.VictoryUI.ExpGaugeHeight;
    var x = Math.round(this.lineHeight() / 2);
    var y = this.height - height - 6;
    var color1 = this.textColor(Olivia.OctoBattle.VictoryUI.ExpGaugeColor1);
    var color2 = this.textColor(Olivia.OctoBattle.VictoryUI.ExpGaugeColor2);
    if (Imported.YEP_CoreEngine && Yanfly.Param.GaugeOutline) {
      x += 1;
      y += 1;
      width -= 2;
      height -= 2;
    }
    this._gaugeWidth = width;
    this._gaugeSprite = new Sprite();
    this.addChildToBack(this._gaugeSprite);
    this._gaugeSprite.x = x;
    this._gaugeSprite.y = y;
    this._gaugeSprite.opacity = 0;
    this._gaugeSprite.bitmap = new Bitmap(width, height);
    this._gaugeSprite.bitmap.gradientFillRect(
      0,
      0,
      width,
      height,
      color1,
      color2
    );
  };

  Window_BattleVictoryActorSub.prototype.createLevelUpSprite = function () {
    this.resetFontSettings();
    var text = Olivia.OctoBattle.VictoryUI.LevelUpText;
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.LevelUpTextFontSize;
    var width = this.textWidth(text);
    +this.lineHeight();
    this._levelUpSprite = new Sprite();
    this.addChild(this._levelUpSprite);
    this._levelUpSprite.x = Math.round(this.width * 0.5);
    if (Imported.YEP_JobPoints) {
      this._levelUpSprite.y = Math.round(this.lineHeight() * 1.5);
    } else {
      this._levelUpSprite.y = Math.round(this.lineHeight() * 0.5);
    }
    this._levelUpSprite.anchor.x = 0.5;
    this._levelUpSprite.anchor.y = 0.5;
    this._levelUpSprite.scale.x = 0;
    this._levelUpSprite.scale.y = 0;
    this._levelUpSprite.bitmap = new Bitmap(width, this.lineHeight() * 2);
    this._levelUpSprite.bitmap.textColor = this.textColor(
      Olivia.OctoBattle.VictoryUI.LevelUpTextColor
    );
    this._levelUpSprite.bitmap.fontSize =
      Olivia.OctoBattle.VictoryUI.LevelUpTextFontSize;
    this._levelUpSprite.bitmap.drawText(
      text,
      0,
      0,
      width,
      this.lineHeight() * 2,
      "center"
    );
    this._levelUp = false;
    this._levelUpSpriteFade = 0;
    this.resetFontSettings();
  };

  Window_BattleVictoryActorSub.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.contentsOpacity += Olivia.OctoBattle.VictoryUI.TransitionPower;
    if (!!this._gaugeSprite) {
      this._gaugeSprite.opacity = this.contentsOpacity;
    }
    if (this._duration > 0) {
      this.refresh();
      if (Input.isRepeated("ok") || Input.isRepeated("cancel")) {
        this._duration = 1;
      } else {
        this._duration--;
      }
    }
    if (this._levelUp) {
      this.updateLevelUpSpriteScale();
    }
    if (this._levelUpSpriteFade !== 0) {
      this.updateLevelUpSpriteFade();
    }
  };

  Window_BattleVictoryActorSub.prototype.updateLevelUpSpriteScale =
    function () {
      this._levelUpSprite.scale.x = Math.min(
        1,
        this._levelUpSprite.scale.x + 0.02
      );
      this._levelUpSprite.scale.y = Math.min(
        1,
        this._levelUpSprite.scale.y + 0.02
      );
      if (this._levelUpSprite.scale.x >= 1) {
      }
    };

  Window_BattleVictoryActorSub.prototype.updateLevelUpSpriteFade = function () {
    this._levelUpSprite.opacity += this._levelUpSpriteFade;
    if (
      this._levelUpSprite.opacity >= 255 ||
      this._levelUpSprite.opacity <= 0
    ) {
      this._levelUpSpriteFade *= -1;
    }
  };

  Window_BattleVictoryActorSub.prototype.refresh = function () {
    this.contents.clear();
    if (Imported.YEP_JobPoints) {
      this.drawActorJpInformation();
    }
    this.updateActorExp();
    this.drawActorLevelInformation();
    this.drawActorExpInformation();
    this.updateGaugeSpriteWidth();
    this.playLevelUpSound();
  };

  Window_BattleVictoryActorSub.prototype.drawActorJpInformation = function () {
    this.changePaintOpacity(true);
    this.resetFontSettings();
    var d = this._duration || 1;
    this._jp = (this._jp * (d - 1) + this._jpTarget) / d;
    var text = Yanfly.Util.toGroup(Math.round(this._jp));
    var x = Math.round(this.lineHeight() / 2);
    var width = this.width - this.lineHeight() - this._jpTextWidth;
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.ActorJPFontSize;
    this.drawText(text, x, 0, width, "right");
  };

  Window_BattleVictoryActorSub.prototype.updateActorExp = function () {
    var d = this._duration || 1;
    this._exp = (this._exp * (d - 1) + this._expTarget) / d;
    while (this._exp >= this._nextLevelExp) {
      this.levelUp();
    }
  };

  Window_BattleVictoryActorSub.prototype.levelUp = function () {
    if (!this._maxLevel) {
      this._level += 1;
      this._levelUp = true;
      this._playLevelUpSound = true;
      this._levelUpSpriteFade = this._levelUpSpriteFade || 4;
      this.calculateNextLevelConstants();
      this._levelText = this._level;
      this._levelText = Yanfly.Util.toGroup(this._levelText);
      this._levelText = Olivia.OctoBattle.VictoryUI.ActorLevelFormat.format(
        this._levelText
      );
    }
  };

  Window_BattleVictoryActorSub.prototype.drawActorLevelInformation =
    function () {
      this.changePaintOpacity(true);
      this.resetFontSettings();
      var x = Math.round(this.lineHeight() / 2);
      var width = this.width - this.lineHeight();
      if (Imported.YEP_JobPoints) {
        var align = "center";
      } else {
        var align = "right";
      }
      this.contents.fontSize = Olivia.OctoBattle.VictoryUI.ActorLevelFontSize;
      this.drawText(this._levelText, x, 0, width, align);
    };

  Window_BattleVictoryActorSub.prototype.drawActorExpInformation = function () {
    if (this._maxLevel) {
      var nextExp = this._nextLevelExp;
      var currentExp = this._currentLevelExp;
    } else {
      var nextExp = this._nextLevelExp - this._currentLevelExp;
      var currentExp = Math.round(this._exp - this._currentLevelExp);
      if (Imported.YEP_CoreEngine) {
        nextExp = Yanfly.Util.toGroup(nextExp);
        currentExp = Yanfly.Util.toGroup(currentExp);
      }
    }
    nextExp = "/" + nextExp;
    var x = Math.round(this.lineHeight() / 2) + this.textPadding();
    var width = this.width - this.lineHeight() - this.textPadding() * 2;
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.ActorEXPFontSize;
    this.drawText(TextManager.exp, x, this.lineHeight(), width, "left");
    this.changeTextColor(
      this.textColor(Olivia.OctoBattle.VictoryUI.ExpNextFontColor)
    );
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.ExpNextFontSize;
    this.drawText(nextExp, x, this.lineHeight(), width, "right");
    width -= this.textWidth(nextExp);
    this.changeTextColor(
      this.textColor(Olivia.OctoBattle.VictoryUI.ExpCurrentFontColor)
    );
    this.contents.fontSize = Olivia.OctoBattle.VictoryUI.ExpCurrentFontSize;
    this.drawText(currentExp, x, this.lineHeight(), width, "right");
  };

  Window_BattleVictoryActorSub.prototype.updateGaugeSpriteWidth = function () {
    if (this._maxLevel) {
      var width = this._gaugeWidth;
    } else {
      var nextExp = this._nextLevelExp - this._currentLevelExp;
      var currentExp = Math.round(this._exp - this._currentLevelExp);
      var rate = Math.min(currentExp / nextExp, 1);
      var width = Math.round(this._gaugeWidth * rate);
    }
    this._gaugeSprite.width = width;
  };

  Window_BattleVictoryActorSub.prototype.playLevelUpSound = function () {
    if (this._playLevelUpSound) {
      this._playLevelUpSound = false;
      AudioManager.playSe(Olivia.OctoBattle.VictoryUI.LevelUpSound);
    }
  };

  // //=============================================================================
  // } // End Victory HUD
  // //=============================================================================

  //↓20220501 koke Add

  //-----------------------------------------------------------------------------
  // BattleManager
  //
  // The static class that manages battle progress.
  var cke_bm_init = BattleManager.initMembers;
  BattleManager.initMembers = function () {
    cke_bm_init.call(this);
    this.tempActors = JsonEx.makeDeepCopy($gameParty.battleMembers());
  };

  BattleManager.processActorLevelUpPhase = function () {
    setTimeout(
      SceneManager._scene.hideAllWindows.bind(SceneManager._scene),
      150
    );
    setTimeout(
      SceneManager._scene.createActorLevelUp.bind(SceneManager._scene),
      150
    );
  };

  // //↓20220501 koke Add
  // //ifで囲まれているところ全部コメントアウトでもＯＫなはず
  // //ifの判定もこれでなぜtrueになるのかよく分からないけど
  // //これ入れとかないとOlivia_OctoBattle.jsへの参照エラーになる
  // if(!Imported.Olivia_OctoBattle){
  // //↑20220501 koke Add

  //re-write update function
  Window_BattleVictoryContinue.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._duration > 0) {
      if (
        Input.isRepeated("ok") ||
        Input.isRepeated("cancel") ||
        TouchInput.isTriggered()
      ) {
        Input.clear();
        TouchInput.clear();
        this._duration = 1;
      } else {
        if (ckeLevelUpPhase) {
          this._duration -= 5;
        } else {
          this._duration--;
        }
      }
    } else if (
      !this._ending &&
      (Input.isRepeated("ok") ||
        Input.isRepeated("cancel") ||
        TouchInput.isTriggered())
    ) {
      Input.clear();
      TouchInput.clear();
      this._ending = true;
      actorStat_index++;
      while (!this.checkLevelUp()) {
        actorStat_index++;
        if (actorStat_index >= $gameParty.battleMembers().length) {
          break;
        }
      }
      if (actorStat_index < $gameParty.battleMembers().length) {
        ckeLevelUpPhase = true;
        subStat_y = 0; //reset StatWindows align
        subSkill_y = 0;
        actorSkill_index = -1;
        BattleManager.processActorLevelUpPhase();
      } else {
        ckeLevelUpPhase = false;
        actorStat_index = -1;
        BattleManager.endVictoryPhase();
      }
    } else {
      this.contentsOpacity += Olivia.OctoBattle.VictoryUI.TransitionPower;
    }
  };

  Window_BattleVictoryContinue.prototype.checkLevelUp = function () {
    if (!$gameParty.battleMembers()[actorStat_index]) {
      return false;
    }
    return (
      $gameParty.battleMembers()[actorStat_index]._level !=
      BattleManager.tempActors[actorStat_index]._level
    );
  };
  // //↓20220501 koke Add
  // }
  // //↑20220501 koke Add

  //-----------------------------------------------------------------------------
  // Scene_Battle
  //
  // The scene class of the battle screen.
  Scene_Battle.prototype.createActorLevelUp = function () {
    this._actorLevelUp = new Window_ActorLevelUp();
    this.addWindow(this._actorLevelUp);
    AudioManager.playSe({ name: levelUpSE, volume: 80, pitch: 100, pan: 100 });
  };

  //-----------------------------------------------------------------------------
  // Window_ActorLevelUp
  //
  // The window for displaying the victory results of battle
  function Window_ActorLevelUp() {
    this.initialize.apply(this, arguments);
  }

  Window_ActorLevelUp.prototype = Object.create(Window_Base.prototype);
  Window_ActorLevelUp.prototype.constructor = Window_ActorLevelUp;

  Window_ActorLevelUp.prototype.initialize = function () {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.opacity = 0;
    this.contentsOpacity = 0;
    this.createSubWindows();
    this.refresh();
  };

  Window_ActorLevelUp.prototype.standardPadding = function () {
    return 0;
  };

  Window_ActorLevelUp.prototype.createSubWindows = function () {
    this.createPortraitWindow();
    this.createStatWindow();
    this.createContinueWindow();
  };

  Window_ActorLevelUp.prototype.createStatWindow = function () {
    this._statWindow = new Window_ActorStats();
    this.addChild(this._statWindow);
  };

  Window_ActorLevelUp.prototype.createSkillWindow = function (lx, ly, lw) {
    this._skillWindow = new Window_ActorSkills(lx, ly, lw);
    this.addChild(this._skillWindow);
  };

  Window_ActorLevelUp.prototype.createPortraitWindow = function () {
    this._portraitWindow = new Window_ActorPortrait();
    this.addChild(this._portraitWindow);
  };

  Window_ActorLevelUp.prototype.createContinueWindow = function () {
    this._continueWindow = new Window_BattleVictoryContinue();
    this.addChild(this._continueWindow);
  };

  Window_ActorLevelUp.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.contentsOpacity += Olivia.OctoBattle.VictoryUI.TransitionPower;
  };

  Window_ActorLevelUp.prototype.refresh = function () {
    this.contents.clear();
    this.drawBackground();
    this.drawBackgroundRewardStrip(
      actorStat_x - 20,
      actorStat_y - this.lineHeight(),
      actorStat_w - 100,
      100
    );
    this.contents.fontSize = cFontSize;
    this.drawText(
      str1,
      actorStat_x - 20 + ckeIndent * 5,
      actorStat_y - this.lineHeight(),
      actorStat_w - 100,
      this.lineHeight(),
      "left"
    );
    //this.drawForeground();
  };

  Window_ActorLevelUp.prototype.drawBackground = function () {
    this.drawBackgroundMajorFadeOut();
    //this.drawBackgroundRewardStrips();
  };

  Window_ActorLevelUp.prototype.drawBackgroundMajorFadeOut = function () {
    var y = Math.round(
      this.height * Olivia.OctoBattle.VictoryUI.BackgroundDimHeight
    );
    var lowerHeight =
      this.lineHeight() + Window_Base.prototype.standardPadding.call(this) * 2;
    var height = this.height - y - lowerHeight;
    var width = this.width * 2;
    this.contents.fillRect(
      0,
      y,
      width,
      height,
      this.dimColor1(),
      this.dimColor2()
    );
    this.contents.fillRect(
      0,
      this.height - lowerHeight + 2,
      this.width,
      lowerHeight - 2,
      this.dimColor2(),
      this.dimColor1()
    );
    this.changePaintOpacity(false);
    this.contents.fillRect(0, y - 2, width, 2, this.normalColor());
    this.contents.fillRect(
      0,
      this.height - lowerHeight,
      width,
      2,
      this.normalColor()
    );
    if (this.checkAcquiredSkill()) {
      //this could be skill window
      var lx = Math.round(this.width * 0.7);
      var ly = y + this.lineHeight() * 2;
      var lw = this.width - lx - ckeIndent;
      //this.contents.fillRect(lx, ly, lw, 2, this.normalColor());
      this.drawBackgroundRewardStrip(
        lx - 20,
        ly - this.lineHeight(),
        lw - 100,
        100
      );
      this.contents.fontSize = cFontSize;
      this.drawText(
        str2,
        lx - 20 + ckeIndent * 5,
        ly - this.lineHeight(),
        lw - 100,
        this.lineHeight(),
        "left"
      );
      this.createSkillWindow(lx, ly, lw);
    }
  };

  Window_ActorLevelUp.prototype.drawBackgroundRewardStrip = function (
    x,
    y,
    width1,
    width2
  ) {
    var lh = this.lineHeight();
    var hlh = Math.round(this.lineHeight() / 2);
    x += hlh;
    width1 -= hlh;
    var points = [x, y, x - hlh, y + hlh, x, y + lh];
    this.changePaintOpacity(false);
    var opacity = this.translucentOpacity() / 255;
    this.contents.drawBattlePolygon(
      points,
      this.normalColor(),
      0,
      opacity,
      false
    );
    this.contents.fillRect(x, y, width1, lh, this.normalColor());
    this.contents.gradientFillRect(
      x + width1,
      y,
      width2,
      lh,
      this.normalColor(),
      this.dimColor2()
    );
  };

  Window_ActorLevelUp.prototype.checkAcquiredSkill = function () {
    if (!$gameParty.battleMembers()[actorStat_index]) {
      return false;
    }
    return (
      $gameParty.battleMembers()[actorStat_index]._skills.length !=
      BattleManager.tempActors[actorStat_index]._skills.length
    );
  };

  //-----------------------------------------------------------------------------
  // Window_ActorStats
  //
  // The window for displaying the victory results of battle
  function Window_ActorStats() {
    this.initialize.apply(this, arguments);
  }

  Window_ActorStats.prototype = Object.create(Window_Base.prototype);
  Window_ActorStats.prototype.constructor = Window_ActorStats;

  Window_ActorStats.prototype.initialize = function () {
    Window_Base.prototype.initialize.call(
      this,
      actorStat_x,
      actorStat_y,
      actorStat_w,
      actorStat_h
    );
    this.opacity = 0;
    this.createSubWindows();
  };

  Window_ActorStats.prototype.createSubWindows = function () {
    var statData = "";
    for (i = 0; i < 9; i++) {
      switch (i) {
        case 0:
          statData = "Level";
          break;
        case 1:
          statData = "Max HP";
          break;
        case 2:
          statData = "Max MP";
          break;
        case 3:
          statData = "ATK";
          break;
        case 4:
          statData = "DEF";
          break;
        case 5:
          statData = "MAT";
          break;
        case 6:
          statData = "MDF";
          break;
        case 7:
          statData = "AGI";
          break;
        case 8:
          statData = "CRI";
          break;
        default:
          statData = "Test";
      }
      this._subWindows = new Window_SubStats(statData);
      this.addChild(this._subWindows);
      subStat_y += this.lineHeight();
    }
  };
  //-----------------------------------------------------------------------------
  // Window_SubStats
  //
  // The window for displaying the victory results of battle
  function Window_SubStats() {
    this.initialize.apply(this, arguments);
  }

  Window_SubStats.prototype = Object.create(Window_Base.prototype);
  Window_SubStats.prototype.constructor = Window_SubStats;

  Window_SubStats.prototype.initialize = function (statData) {
    Window_Base.prototype.initialize.call(
      this,
      0,
      subStat_y,
      actorStat_w,
      actorStat_h
    );
    this.opacity = 0;
    this.value = 0;
    this.valueOld = 0;
    this.actor = $gameParty.members()[actorStat_index];
    this.drawBackground();
    this.getData(statData);
    this.getDataOld(statData);
    this.drawData();
  };

  Window_SubStats.prototype.getData = function (statData) {
    this.title = statData;
    switch (statData) {
      case "Level":
        this.value = this.actor._level;
        break;
      case "Max HP":
        this.value = this.actor.param(0);
        break;
      case "Max MP":
        this.value = this.actor.param(1);
        break;
      case "ATK":
        this.value = this.actor.param(2);
        break;
      case "DEF":
        this.value = this.actor.param(3);
        break;
      case "MAT":
        this.value = this.actor.param(4);
        break;
      case "MDF":
        this.value = this.actor.param(5);
        break;
      case "AGI":
        this.value = this.actor.param(6);
        break;
      case "CRI":
        this.value = this.actor.param(7);
        break;
    }
  };

  Window_SubStats.prototype.getDataOld = function (statData) {
    this.title = statData;
    switch (statData) {
      case "Level":
        this.valueOld = BattleManager.tempActors[actorStat_index]._level;
        break;
      case "Max HP":
        this.valueOld = BattleManager.tempActors[actorStat_index].param(0);
        break;
      case "Max MP":
        this.valueOld = BattleManager.tempActors[actorStat_index].param(1);
        break;
      case "ATK":
        this.valueOld = BattleManager.tempActors[actorStat_index].param(2);
        break;
      case "DEF":
        this.valueOld = BattleManager.tempActors[actorStat_index].param(3);
        break;
      case "MAT":
        this.valueOld = BattleManager.tempActors[actorStat_index].param(4);
        break;
      case "MDF":
        this.valueOld = BattleManager.tempActors[actorStat_index].param(5);
        break;
      case "AGI":
        this.valueOld = BattleManager.tempActors[actorStat_index].param(6);
        break;
      case "CRI":
        this.valueOld = BattleManager.tempActors[actorStat_index].param(7);
        break;
    }
  };

  Window_SubStats.prototype.drawData = function (statData) {
    this.drawText(this.title, ckeIndent, 0, this.width, this.height, "left");
    this.drawText(
      String(this.valueOld),
      150,
      0,
      this.width,
      this.height,
      "left"
    );
    if (this.valueOld != this.value) {
      this.drawText("→", 200, 0, this.width, this.height, "left");
      this.drawText(
        String(this.value),
        250,
        0,
        this.width,
        this.height,
        "left"
      );
      var str = "(+" + String(this.value - this.valueOld) + ")";
      this.changeTextColor(this.textColor(17));
      this.drawText(str, 300, 0, this.width, this.height, "left");
    }
  };

  Window_SubStats.prototype.drawBackground = function () {
    this.contents.fillRect(0, 0, this.width, this.height, this.dimColor1());
  };

  //-----------------------------------------------------------------------------
  // Window_ActorSkill
  //
  // The window for displaying the victory results of battle
  function Window_ActorSkills() {
    this.initialize.apply(this, arguments);
  }

  Window_ActorSkills.prototype = Object.create(Window_Base.prototype);
  Window_ActorSkills.prototype.constructor = Window_ActorSkills;

  Window_ActorSkills.prototype.initialize = function (lx, ly, lw) {
    Window_Base.prototype.initialize.call(
      this,
      lx,
      ly,
      lw,
      this.lineHeight() * 10
    );
    this.lw = lw;
    this.opacity = 0;
    this.contentsOpacity = 0;
    this.iniSkill = 0;
    this._cSkillList = [];
    this.getDifferentSkills();
    this.createSubWindows(this.lw);
  };

  Window_ActorSkills.prototype.getDifferentSkills = function (lw) {
    var cOld = BattleManager.tempActors[actorStat_index]._skills || [];
    var cNew = $gameParty.battleMembers()[actorStat_index]._skills || [];
    cNew.forEach(
      function (skillId) {
        if (!cOld.contains(skillId)) {
          this._cSkillList.push(skillId);
        }
      }.bind(this)
    );
  };

  Window_ActorSkills.prototype.createSubWindows = function (lw) {
    if (this.iniSkill >= this._cSkillList.length) {
      this.iniSkill = Math.floor(this._cSkillList.length / 8) * 8;
    }
    var skillMax = this.iniSkill + 8;
    if (skillMax > this._cSkillList.length) {
      skillMax = this._cSkillList.length;
    }
    for (i = this.iniSkill; i < skillMax; i++) {
      actorSkill_index = this._cSkillList[i];
      this._subWindows = new Window_SubSkills(lw);
      this.addChild(this._subWindows);
      subSkill_y += this.lineHeight();
    }
    if (this._cSkillList.length > 8) {
      this.contents.fontSize = cFontSize;
      var cp1 = String(this.iniSkill / 8 + 1);
      var cp2 = String(Math.floor(this._cSkillList.length / 8) + 1);
      var txt = "Page " + cp1 + " of " + cp2 + "/ ← →";
      this.contents.drawText(
        txt,
        0,
        this.lineHeight() * 3.5,
        this.width,
        this.height,
        "left"
      );
    }
  };

  Window_ActorSkills.prototype.update = function (lw) {
    Window_Base.prototype.update.call(this);
    if (Input.isTriggered("right") && this._cSkillList.length > 0) {
      AudioManager.playSe({
        name: turnPageSE,
        volume: 80,
        pitch: 100,
        pan: 100,
      });
      this.iniSkill += 8;
      this.contentsOpacity = 0;
      this.hideChild();
      this.createSubWindows(this.lw);
    } else if (Input.isTriggered("left") && this._cSkillList.length > 0) {
      AudioManager.playSe({
        name: turnPageSE,
        volume: 80,
        pitch: 100,
        pan: 100,
      });
      this.iniSkill = Math.max(this.iniSkill - 8, 0);
      this.contentsOpacity = 0;
      this.hideChild();
      this.createSubWindows(this.lw);
    } else {
      this.contentsOpacity += Olivia.OctoBattle.VictoryUI.TransitionPower;
    }
  };

  Window_ActorSkills.prototype.hideChild = function () {
    subSkill_y = 0; //reset start Y
    this.contents.clear();
    while (this.children.length > 3) {
      this.removeChildAt(this.children.length - 1);
    }
  };

  //-----------------------------------------------------------------------------
  // Window_SubSkills
  //
  // The window for displaying the victory results of battle
  function Window_SubSkills() {
    this.initialize.apply(this, arguments);
  }

  Window_SubSkills.prototype = Object.create(Window_Base.prototype);
  Window_SubSkills.prototype.constructor = Window_SubSkills;

  Window_SubSkills.prototype.initialize = function (lw) {
    Window_Base.prototype.initialize.call(this, 0, subSkill_y, lw, actorStat_h);
    this.opacity = 0;
    this.skillName = "";
    this.drawBackground();
    console.log($gameParty.battleMembers()[actorStat_index]);
    this.getData();
    this.drawData();
  };

  Window_SubSkills.prototype.drawBackground = function () {
    this.contents.fillRect(0, 0, this.width, this.height, this.dimColor1());
  };

  Window_SubSkills.prototype.getData = function () {
    var cid = $dataSkills[actorSkill_index];
    this.icon = cid.iconIndex;
    this.name = cid.name;
  };

  Window_SubSkills.prototype.drawData = function () {
    this.drawIcon(this.icon, ckeIndent, 0);
    this.drawText(this.name, 50, 0, this.width * 0.7, this.height, "left");
  };

  //-----------------------------------------------------------------------------
  // Window_ActorPortrait
  //
  // The window for displaying the victory results of battle
  function Window_ActorPortrait() {
    this.initialize.apply(this, arguments);
  }

  Window_ActorPortrait.prototype = Object.create(Window_Base.prototype);
  Window_ActorPortrait.prototype.constructor = Window_ActorPortrait;

  Window_ActorPortrait.prototype.initialize = function () {
    Window_Base.prototype.initialize.call(
      this,
      0,
      0,
      Graphics.boxWidth / 2,
      Graphics.boxHeight
    );
    this.opacity = 0;
    this.createSubWindows();
  };

  Window_ActorPortrait.prototype.createSubWindows = function () {
    this.createActorImage();
  };

  Window_ActorPortrait.prototype.createActorImage = function () {
    var porName = $gameParty.battleMembers()[actorStat_index]._levelupface;
    if (porName == "") {
      var porName =
        "actor_" + String($gameParty.battleMembers()[actorStat_index]._actorId);
    }
    this.cbm = ImageManager.loadPicture(porName);
    this.cbm.addLoadListener(this.drawActorImage.bind(this));
  };

  Window_ActorPortrait.prototype.drawActorImage = function () {
    this.contents.blt(
      this.cbm,
      0,
      0,
      this.cbm.width,
      this.cbm.height,
      -5 * ckeIndent + portraitOffsetX,
      2 * ckeIndent + portraitOffsetY,
      this.cbm.width,
      this.cbm.height
    );
    this.contents.textColor = "#ffffff";
    this.contents.fontSize = cFontSize * 3;
    this.drawText(
      "Level Up",
      ckeIndent * 5,
      ckeIndent * 5,
      this.width,
      this.height,
      "left"
    );
  };

  //gameActors
  var cke_ga_ini = Game_Actor.prototype.initMembers;
  Game_Actor.prototype.initMembers = function () {
    cke_ga_ini.call(this);
    this._levelupface = "";
  };
  //interperter
  var cke_gi_pc = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    cke_gi_pc.call(this, command, args);
    if (command == "lvupface") {
      $gameActors.actor(args[0])._levelupface = String(args[1]);
    } else if (command == "lvupface_clear") {
      $gameActors.actor(args[0])._levelupface = "";
    }
  };
})();
//↑20220501 koke Add
