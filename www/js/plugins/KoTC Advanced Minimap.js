/*:
 * @target MZ
 * @plugindesc v1.73 Allows one to have a high performance Advanced minimap
 * for their game.
 * @Author Knight of the Celestial Developer Team.
 *
 *
 * @help
 * ============================================================================
 *
 * For any event you wish to be visible on the minimap, put into its notes at
 * the top of the event editor interface:
 *
 * <KoTC Minimap: NameOfPicture>
 *
 * It is case sensitive.
 *
 * Example: <KoTC Minimap: Goblin1>
 *
 * If you want it to only be visible when it is in a certain range of the player,
 * you add a space and the range number.
 *
 * Example: <KoTC Minimap: Goblin1 10>
 *
 * This means when it is within 10 game tiles, it will show, but once it leaves
 * that range it will stop being visible on the map.
 *
 * -- Map Book Info ---
 * If using the map book and you wish an event to be drawn on the map when it is
 * saved, you set its minimap icon as you wish, then put in the notes of the event:
 *
 * <KoTC MapBook Event>
 *
 * Exactly like that, and it will be drawn in the mapbook as the chosen icon.
 * But if you set a limited range it'll only be drawn on the map when it is in range.
 * Best used for events that have no range limit.
 *
 *
 *
 *
 *
 *
 *
 * >>> Map Book Plugin Commands <<<
 *  If you want a map to have a description in the map book you put in the maps notes:
 *
 * <KoTC Map Description 1:  This is a map!>
 *
 * <KoTC Map Description 2:  This is a map!>
 *
 * <KoTC Map Description 3:  This is a map!>
 *
 * <KoTC Map Description 4:  This is a map!>
 *
 * Each note represents one line of the Description, up to a total of 4.
 *
 * Plugin Command: KoTCOpenMapBook         Opens up the mapbook for usage.
 * Script Call: SceneManager.push(Scene_KoTCMapBook);
 *
 * Plugin Command: KoTCMapBookClear        Clears the mapbook of all entries.
 * Script Call: clearKoTCMapBook()
 *
 * Plugin Command: KoTCRemoveMapToMapBook 5  Removes the MAPID 5 from the mapbook.
 * Script Call: kotcAddMapToBook(5)
 *
 * Plugin Command: KoTCAddMapToMapBook 7    Adds the MAPID 7 to the mapbook.
 * Script Call: kotcRemoveMapFromBook(7)
 *
 * Scene name is :   Scene_KoTCMapBook
 *
 * >>> Advanced Minimap Notes <<<
 *
 * Works for page comments as well, exact same format.
 * If page changes, and the new page has a minimap comment, it will
 * adapt to the new pages comment setup. If the new page has no comment,
 * the event will be removed from the minimap.
 *
 * Do not use both Event Notes, and Page Comments for this at the same
 * time, only one is needed.
 *
 * If an event is erased, it will be removed from the minimap.
 *
 * Range Limit Example: <KoTC Minimap 10>
 * Example: <KoTC Minimap>
 * Typing this into an events notes will use its current texture as the minimap
 * icon.
 *
 * Range Limit Example: <KoTC Minimap Dot: #FFFF00 10>
 * Example: <KoTC Minimap Dot: green>    Example: <KoTC Minimap Dot: red>
 * Typing this into an events notes will use a circle as its minimap icon.
 * color.
 *
 * Range Limit Example: <KoTC Minimap Square: red 10>
 * Example: <KoTC Minimap Square: #00FF00>    Example: <KoTC Minimap Square: red>
 * Typing this into an events notes will use a square as its minimap icon.
 *
 * >>> Map Book Plugin Commands <<<
 *
 * Plugin Command: KoTCOpenMapBook         Opens up the mapbook for usage.
 * Script Call: SceneManager.push(Scene_KoTCMapBook);
 *
 * Plugin Command: KoTCMapBookClear        Clears the mapbook of all entries.
 * Script Call: clearKoTCMapBook()
 *
 * Plugin Command: KoTCRemoveMapToMapBook 5  Removes the MAPID 5 from the mapbook.
 * Script Call: kotcAddMapToBook(5)
 *
 * Plugin Command: KoTCAddMapToMapBook 7    Adds the MAPID 7 to the mapbook.
 * Script Call: kotcRemoveMapFromBook(7)
 *
 *
 *
 *  Scene name is Scene_KoTCMapBook
 *
 * >>> Plugin Commands <<<
 *
 *
 * Plugin Command: KoTCMinimapOff
 * Script Call: KoTCMinimapOff();
 *
 * -Disables the minimap.
 *
 *
 * Plugin Command: KoTCMinimapOn
 * Script Call: KoTCMinimapOn();
 *
 * -Enables the minimap.
 *
 *
 *
 * Plugin Command: KoTCMinimapFollowPlayerOn ZOOMSCALE
 * Script Call: KoTCMinimapFollowPlayerOn(ZOOMSCALE);
 *
 * -Map centers on players position, and zooms in
 * the by the specified scale. If set to 2, the zoom
 * is twice the normal level.
 *
 *
 * Plugin Command: KoTCMinimapFollowPlayerOff
 * Script Call: KoTCMinimapFollowPlayerOff();
 *
 * -Returns map to full map mode.
 *
 *
 * Plugin Command: SetKoTCMinimapWallColor
 * Script Call: KoTCMinimapSetWallColor(wallcolor)
 *
 * -Sets the collision map color of the minimap.
 * -Doesnt matter if you are using the Terrain map.
 *
 * Example Plugin Command: SetKoTCMinimapWallColor red
 * Example Plugin Command: SetKoTCMinimapWallColor blue
 * Example Plugin Command: SetKoTCMinimapWallColor #FF0000
 * Example Script Call:    KoTCMinimapSetWallColor("green")
 *
 *
 * Plugin Command: SetKoTCMinimapBackgroundColor
 * Script Call: KoTCMinimapSetBackgroundColor(backgroundcolor)
 *
 * -Sets the background color of the minimap.
 * -When Terrain map is enabled, only applies to empty tiles,
 * such as the ones used for parallax.
 *
 * Example Plugin Command: SetKoTCMinimapBackgroundColor red
 * Example Plugin Command: SetKoTCMinimapBackgroundColor blue
 * Example Plugin Command: SetKoTCMinimapBackgroundColor #FF0000
 * Example Script Call:    KoTCMinimapSetBackgroundColor("yellow")
 *
 *
 * Plugin Command: SetKoTCMinimapBorderColor
 * Script Call: KoTCMinimapSetBorderColor(bordercolor)
 *
 * -Sets the border color of the minimap.
 *
 * Example Plugin Command: SetKoTCMinimapBorderColor red
 * Example Plugin Command: SetKoTCMinimapBorderColor blue
 * Example Plugin Command: SetKoTCMinimapBorderColor #FF0000
 * Example Script Call:    KoTCMinimapSetBorderColor("cyan")
 *
 *
 * Plugin Command: SetKoTCMinimapPlayerColor
 * Script Call: KoTCMinimapSetPlayerColor(playercolor)
 *
 * !Important! If you ever change the color of other things at the same time
 * as this, make sure this plugin command or script call is first in the order.
 * -Sets the player color of the minimap.
 *
 * Example Plugin Command: SetKoTCMinimapPlayerColor red
 * Example Plugin Command: SetKoTCMinimapPlayerColor blue
 * Example Plugin Command: SetKoTCMinimapPlayerColor #FF0000
 * Example Script Call:    KoTCMinimapSetPlayerColor("cyan")
 *
 *
 *
 * Plugin Command: SetKoTCMinimapSize
 * Script Call: KoTCMinimapSetSize(size)
 *
 * -Sets the scale of the minimap based on your chosen size.
 * Starts at a scale of 1, which equals 100%. If you want it twice as
 * large, you set it to 2, if you want it 50% larger, you set it to 1.5.
 *
 *
 *
 * I originally made this for my game, but I felt the community needed a more
 * up to date, auto scaling, cpu friendly minimap, so I decided to share this.
 *
 *
 *
 *
 *
 * @command DisableKoTCMinimap
 * @desc Disables the minimap until next enabled.
 * @text Disable Minimap
 *
 *
 * @command EnableKoTCMinimap
 * @desc Enable the minimap until next disabled.
 * @text Enable Minimap
 *
 *
 * @command SetKoTCMinimapWallColor
 * @desc Sets the collision map color of the minimap.
 * Does not matter when using Terrain Map.
 * @text Set Collision Map Color
 *
 * @arg Color
 * @desc Example: red, blue, #00FF00
 * @text Collision Map Color
 * @default green
 * @type string
 *
 *
 * @command SetKoTCMinimapBackgroundColor
 * @desc Sets the background color of the minimap.
 * Only applies to empty tiles with Terrain Map enabled.
 * @text Set Map Background Color
 *
 * @arg Color
 * @desc Example: red, blue, #00FF00
 * @text Minimap Background Color
 * @default darkblue
 * @type string
 *
 *
 * @command SetKoTCMinimapBorderColor
 * @desc Sets the border color of the minimap.
 * @text Set Map Border Color
 *
 * @arg Color
 * @desc Example: red, blue, #00FF00
 * @text Minimap Border Color
 * @default gold
 * @type string
 *
 *
 * @command SetKoTCMinimapPlayerColor
 * @desc Sets the player color on the minimap.
 * @text Set Map Player Color
 *
 * @arg Color
 * @desc Example: red, blue, #00FF00
 * @text Minimap Player Color
 * @default gold
 * @type string
 *
 *
 *
 * @command SetKoTCMinimapSize
 * @desc Sets the scale of the minimap. 2 is double.
 * 1 is default size.
 * @text Set Map Scale
 *
 * @arg Size
 * @desc Example: 2 is double, 1.5 is 50% larger.
 * @text Minimap Scale
 * @default 2
 * @type number
 *
 *
 * @command KoTCMinimapFollowPlayerOff
 * @desc Disables player follow mode if it is on.
 * @text Disable Player Follow
 *
 *
 * @command KoTCMinimapFollowPlayerOn
 * @desc Enables map follow mode on the player.
 * And zooms the map the set amount.
 * @text Enable Player Follow
 *
 * @arg ZoomScale
 * @desc Example: 2 is double, 1.5 is 50% larger.
 * @text Zoom Scale
 * @default 2
 * @type number
 *
 *
 * @command KoTCOpenMapBook
 * @desc Opens the Map Book for usage.
 * @text Open KoTC Map Book
 *
 * @command KoTCMapBookFill
 * @desc Adds all map entries to the Map Book.
 * @text Open KoTC Map Book
 *
 * @command KoTCMapBookClear
 * @desc Clears all map entries from the Map Book.
 * @text Open KoTC Map Book
 *
 *
 *
 * @command KoTCAddMapToMapBook
 * @desc Unlocks the map entry in the Map Book.
 * @text Add Map to Map Book
 *
 * @arg MapID
 * @desc The ID of the map.
 * @text Map ID
 * @default 1
 * @type number
 *
 *
 * @command KoTCRemoveMapToMapBook
 * @desc Removes the map entry from the Map Book.
 * @text Add Map to Map Book
 *
 * @arg MapID
 * @desc The ID of the map.
 * @text Map ID
 * @default 1
 * @type number
 *
 *
 *
 *
 * @param Minimap Scale
 * @desc Change Scale of Minimap in pixels.
 * @default 150
 *
 *
 * @param Minimap X Horizontal Position
 * @desc Change X coordinates of Minimap's upper left corner location.
 * Increasing it by 100 moves it 100 pixels right.
 * @default 0
 *
 *
 * @param Minimap Y Vertical Position
 * @desc Change Y coordinates of Minimap's upper left corner location.
 * Increasing it by 100 moves it 100 pixels down.
 * @default 0
 *
 *
 *
 *
 *
 * @param Minimap Wall Color
 * @desc Change color of collision map on the minimap.
 * @default green
 *
 *
 * @param Player Map Indicator Color
 * @desc Change color of players indicator on the map.
 * @default cyan
 *
 *
 * @param Minimap Background Color
 * @desc Change color of background of minimap.
 * Example: red, yellow, or hex codes like #FF00FF.
 * @default darkblue
 *
 * @param Use Default Game Border
 * @desc Uses the default game borders texture and colors if enabled.
 * @default false
 * @type boolean
 * @on Enabled
 * @off Disabled
 *
 *
 * @param Minimap Border Thickness
 * @desc Change thickness of minimapborder in pixels.
 * @default 2
 *
 *
 * @param Minimap Border Color
 * @desc Change color of border of minimap.
 * Example: red, yellow, or hex codes like #FF00FF.
 * @default cyan
 *
 *
 * @param Minimap Refresh Rate
 * @desc Rate in which minimap refreshes locations of things.
 * 1000 = 1 second, 500 = half a second.
 * @default 250
 *
 *
 * @param Draw Parallax as Background
 * @desc Uses the current maps Parallax in the place of the
 * background color on the map if enabled.
 * @default true
 * @type boolean
 * @on Enabled
 * @off Disabled
 *
 *
 *
 *
 * @param Minimap Mode
 * @desc Choose one of the 3 modes to suit your purposes.
 * @type select
 * @option Collision Map Mode
 * @value 0
 * @option Terrain/Pixel Mode
 * @value 1
 * @option Picture Mode
 * @value 2
 * @default 2
 *
 *
 * @param Exploration Map Mode
 * @desc Draws map as one explores it if enabled.
 * @default true
 * @type boolean
 * @on Enabled
 * @off Disabled
 *
 *
 * @param Exploration Refresh Rate
 * @desc Rate in which minimap performs explored map checks.
 * 1000 = 1 second, 500 = half a second.
 * @default 500
 *
 *
 * @param Map Exploration Notification
 * @desc Disable if you dont wish to see a notification when
 * map is 100% explored.
 * @default true
 * @type boolean
 * @on Enabled
 * @off Disabled
 *
 *
 * @param Map Fully Explored Sound
 * @desc Audio to play when all pathable areas are 100% explored.
 * Only when Map Exploration Notification is enabled
 * @default Bell1
 * @type string
 *
 *
 * @param Map Fully Explored Sound Volume
 * @desc Volume of the audio to be played.
 * @default 100
 * @type number
 *
 *
 * @param KoTC Map Book
 * @desc Enables a book of maps to be displayed. If exploration map
 * mode is on, it saves fog of war to maps image as as well.
 * @default true
 * @type boolean
 * @on Enabled
 * @off Disabled
 *
 * @param Auto Add Maps to Map Book
 * @desc Disable if you want to manually add map entries.
 * Put <KoTC Map Deny> in a maps notes to prevent auto adding.
 * @default true
 * @type boolean
 * @on Enabled
 * @off Disabled
 *
 *
 * @param Big Map X Position
 * @desc X Position of Big Map when it is toggled on.
 * @default 0
 *
 *
 * @param Big Map Y Position
 * @desc Y Position of Big Map when it is toggled on.
 * @default 0
 *
 * @param Big Map Scale
 * @desc How much to scale the map when big map key
 * is pressed. Scales the pixel size. 2 = double.
 * @default 2.5
 *
 *
 * @param Big Map Hotkey
 * @desc Enlarge Map Hotkey. letter or number works.
 * Some side keys are supported like tab, alt, ctrl, enter.
 * @default M
 *
 *
 * @param Player Follow Mode
 * @desc Enable to center map on player by default.
 * @default false
 * @type boolean
 * @on Enabled
 * @off Disabled
 *
 *
 * @param Follow Mode Zoom
 * @desc The scale of the zoom. 2 is double regular level.
 * 1.5 is 50% more than regular level.
 * @default 2
 *
 *
 * @param Follow Mode Hotkey
 * @desc For toggling follow mode.
 * Some side keys are supported like tab, alt, ctrl, enter.
 * @default N
 */

if (Utils.RPGMAKER_NAME == "MZ") {
  function KoTCMinimapWindow() {
    this.initialize(...arguments);
  }

  KoTCMinimapWindow.prototype = Object.create(Window_Base.prototype);
  KoTCMinimapWindow.prototype.constructor = KoTCMinimapWindow;
  KoTCMinimapWindow.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._time = 0;
  };
} else {
  function KoTCMinimapWindow() {
    this.initialize.apply(this, arguments);
  }

  KoTCMinimapWindow.prototype = Object.create(Window_Base.prototype);
  KoTCMinimapWindow.prototype.constructor = KoTCMinimapWindow;

  KoTCMinimapWindow.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
  };

  KoTCMinimapWindow.prototype.update = function () {
    Window_Base.prototype.update.call(this);
  };
}

(function () {
  var KOTCINITMAP = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    KOTCINITMAP.call(this); // Makes sure to do the stuff that was in the function before
    this.MapExplorationData = {};
    this.KoTCMapCache = [];
  };
  var KOTCMAPTITLEBOOT = Scene_Title.prototype.initialize;
  Scene_Title.prototype.initialize = function () {
    KOTCMAPTITLEBOOT.call(this);
    KoTCMinimapStart();
  };

  var KOTCMAPBOOT = Scene_Boot.prototype.initialize;
  Scene_Boot.prototype.initialize = function () {
    KOTCMAPBOOT.call(this);
    KoTCMinimapStart();
  };

  var kotcmapsetupcopy = Scene_Map.prototype.createDisplayObjects;

  Scene_Map.prototype.createDisplayObjects = function () {
    kotcmapsetupcopy.call(this);
    KoTCMinimapEnable();
  };
  window.addEventListener("keypress", (event) => {
    if (event.keyCode == $KoTCMinimapSystem.BigMapHotkey) {
      if ($KoTCMinimapSystem.BigMapOn == false) {
        $KoTCMinimapSystem.DefaultXY = [
          Number($KoTCMinimapSystem.CurrentMinimapX),
          Number($KoTCMinimapSystem.CurrentMinimapY),
        ];
        $KoTCMinimapSystem.CurrentMinimapX =
          $KoTCMinimapSystem.BigMinimapX +
          $KoTCMinimapSystem.CurrentMinimapBorderThickness;
        $KoTCMinimapSystem.CurrentMinimapY =
          $KoTCMinimapSystem.BigMinimapY +
          $KoTCMinimapSystem.CurrentMinimapBorderThickness;
        $KoTCMinimapSystem.MainMinimapSprite.x =
          $KoTCMinimapSystem.CurrentMinimapX;
        $KoTCMinimapSystem.MainMinimapSprite.y =
          $KoTCMinimapSystem.CurrentMinimapY;
        $KoTCMinimapSystem.SecondaryMinimapSprite.filterArea.x =
          $KoTCMinimapSystem.CurrentMinimapX +
          $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2;
        $KoTCMinimapSystem.SecondaryMinimapSprite.filterArea.y =
          $KoTCMinimapSystem.CurrentMinimapY +
          $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2;

        $KoTCMinimapSystem.BigMapOn = true;
        KoTCMinimapSetSize($KoTCMinimapSystem.BigMapScale);
      } else {
        $KoTCMinimapSystem.CurrentMinimapX = Number(
          $KoTCMinimapSystem.DefaultXY[0]
        );
        $KoTCMinimapSystem.CurrentMinimapY = Number(
          $KoTCMinimapSystem.DefaultXY[1]
        );
        $KoTCMinimapSystem.MainMinimapSprite.x =
          $KoTCMinimapSystem.CurrentMinimapX;
        $KoTCMinimapSystem.MainMinimapSprite.y =
          $KoTCMinimapSystem.CurrentMinimapY;
        $KoTCMinimapSystem.SecondaryMinimapSprite.filterArea.x =
          $KoTCMinimapSystem.CurrentMinimapX +
          $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2;
        $KoTCMinimapSystem.SecondaryMinimapSprite.filterArea.y =
          $KoTCMinimapSystem.CurrentMinimapY +
          $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2;

        $KoTCMinimapSystem.BigMapOn = false;
        KoTCMinimapSetSize(1);
      }
    }
    if (event.keyCode == $KoTCMinimapSystem.PlayerFollowModeHotkey) {
      if ($KoTCMinimapSystem.FollowModeOn == false) {
        KoTCMinimapFollowPlayerOn($KoTCMinimapSystem.PlayerFollowModeZoom);
      } else {
        KoTCMinimapFollowPlayerOff();
      }
    }
  });
})();

function KoTCMinimapStart() {
  if ($gameSystem) {
    $gameSystem.MapExplorationData = {};
    $gameSystem.KoTCMapCache = [];
  }
  $KoTCMinimapSystem = {};
  $KoTCMinimapSystem = {
    Parameters: PluginManager.parameters("KoTC Advanced Minimap"),
  };
  if ($KoTCMinimapSystem.FogOfWarSprite) {
    $KoTCMinimapSystem.FogOfWarSprite = undefined;
  }
  $KoTCMapImageCache = [];
  $KoTCMapImageCache[0] = {};
  $KoTCMapImageCache[0][0] = {};
  $KoTCMinimapSystem.BigMapOn = false;

  $KoTCMinimapSystem.MapExploredNotificationOn =
    $KoTCMinimapSystem.Parameters["Map Exploration Notification"] !== "false";

  $KoTCMinimapSystem.FollowModeOn =
    $KoTCMinimapSystem.Parameters["Player Follow Mode"] !== "false";
  $KoTCMinimapSystem.PlayerFollowModeZoom = Number(
    $KoTCMinimapSystem.Parameters["Follow Mode Zoom"]
  );
  $KoTCMinimapSystem.PlayerFollowModeHotkey = ConvertKeyNameToCode(
    $KoTCMinimapSystem.Parameters["Follow Mode Hotkey"]
  );

  $KoTCMinimapSystem.BigMinimapX = Number(
    $KoTCMinimapSystem.Parameters["Big Map X Position"]
  );
  $KoTCMinimapSystem.BigMinimapY = Number(
    $KoTCMinimapSystem.Parameters["Big Map Y Position"]
  );
  $KoTCMinimapSystem.BigMapScale = Number(
    $KoTCMinimapSystem.Parameters["Big Map Scale"]
  );
  $KoTCMinimapSystem.BigMapHotkey = ConvertKeyNameToCode(
    $KoTCMinimapSystem.Parameters["Big Map Hotkey"]
  );
  $KoTCMinimapSystem.CurrentMinimapRefreshRate = Number(
    $KoTCMinimapSystem.Parameters["Minimap Refresh Rate"]
  );
  $KoTCMinimapSystem.CurrentMinimapBackgroundcolor = String(
    $KoTCMinimapSystem.Parameters["Minimap Background Color"]
  );
  $KoTCMinimapSystem.CurrentMinimapWallcolor = String(
    $KoTCMinimapSystem.Parameters["Minimap Wall Color"]
  );
  $KoTCMinimapSystem.CurrentMinimapSize = Number(
    $KoTCMinimapSystem.Parameters["Minimap Scale"]
  );
  $KoTCMinimapSystem.UseDefaultBorder =
    $KoTCMinimapSystem.Parameters["Use Default Game Border"] === "true";
  if ($KoTCMinimapSystem.UseDefaultBorder !== false) {
    $KoTCMinimapSystem.CurrentMinimapBorderThickness = Number(
      $KoTCMinimapSystem.Parameters["Minimap Border Thickness"] * 2
    );
  } else {
    $KoTCMinimapSystem.CurrentMinimapBorderThickness = Number(
      $KoTCMinimapSystem.Parameters["Minimap Border Thickness"]
    );
    $KoTCMinimapSystem.CurrentMinimapBordercolor = String(
      $KoTCMinimapSystem.Parameters["Minimap Border Color"]
    );
  }
  $KoTCMinimapSystem.CurrentMinimapX =
    Number($KoTCMinimapSystem.Parameters["Minimap X Horizontal Position"]) +
    $KoTCMinimapSystem.CurrentMinimapBorderThickness;
  $KoTCMinimapSystem.CurrentMinimapY =
    Number($KoTCMinimapSystem.Parameters["Minimap Y Vertical Position"]) +
    $KoTCMinimapSystem.CurrentMinimapBorderThickness;
  $KoTCMinimapSystem.MinimapMode = Number(
    $KoTCMinimapSystem.Parameters["Minimap Mode"]
  );
  $KoTCMinimapSystem.ExplorationMapMode =
    $KoTCMinimapSystem.Parameters["Exploration Map Mode"] === "true";
  $KoTCMinimapSystem.ExplorationMapRefreshRate = Number(
    $KoTCMinimapSystem.Parameters["Exploration Refresh Rate"]
  );
  $KoTCMinimapSystem.KoTCDrawParallax =
    $KoTCMinimapSystem.Parameters["Draw Parallax as Background"] === "true";
  $KoTCMinimapSystem.MapBookEnabled =
    $KoTCMinimapSystem.Parameters["KoTC Map Book"] === "true";
  if ($KoTCMinimapSystem.MapBookEnabled !== false) {
    $KoTCMinimapSystem.AutoAddMapsToMapBook =
      $KoTCMinimapSystem.Parameters["Auto Add Maps to Map Book"] === "true";
  }

  var color = String(
    $KoTCMinimapSystem.Parameters["Player Map Indicator Color"]
  );
  if (color[0] == "#") {
    var value = hexToRgb(color);
    var colorarray = [value.r, value.g, value.b, 1];
  } else if (typeof color == "string") {
    color = ConvertColorNameToHex(color);
    var value = hexToRgb(color);
    var colorarray = [value.r, value.g, value.b, 1];
  } else {
    var colorarray = [color[0], color[1], color[2], 1];
  }
  $KoTCMinimapSystem.CurrentMapIndex = 0;
  $KoTCMinimapSystem.CurrentMinimapPlayerColor = colorarray;
  $KoTCMinimapSystem.MainMinimapSprite = new Sprite(
    new Bitmap(
      $KoTCMinimapSystem.CurrentMinimapSize,
      $KoTCMinimapSystem.CurrentMinimapSize
    )
  );
  $KoTCMinimapSystem.SecondaryMinimapSprite = new Sprite(
    new Bitmap(
      $KoTCMinimapSystem.CurrentMinimapSize,
      $KoTCMinimapSystem.CurrentMinimapSize
    )
  );

  // Black Background Init
  var background = new Bitmap(
    $KoTCMinimapSystem.CurrentMinimapSize,
    $KoTCMinimapSystem.CurrentMinimapSize
  );
  background.fillAll("black");
  $KoTCMinimapSystem.BackgroundSprite = new Sprite(background);
  $KoTCMinimapSystem.MainMinimapSprite.addChild(
    $KoTCMinimapSystem.BackgroundSprite
  );
  $KoTCMinimapSystem.MainMinimapSprite.x = $KoTCMinimapSystem.CurrentMinimapX;
  $KoTCMinimapSystem.MainMinimapSprite.y = $KoTCMinimapSystem.CurrentMinimapY;

  if (Utils.RPGMAKER_NAME !== "MZ") {
    $KoTCMinimapSystem.SecondaryMinimapSprite.filters = [
      new PIXI.filters.VoidFilter(),
    ];
  } else {
    $KoTCMinimapSystem.SecondaryMinimapSprite.filters = [
      new PIXI.filters.AlphaFilter(),
    ];
  }
  $KoTCMinimapSystem.SecondaryMinimapSprite.filterArea = new PIXI.Rectangle(
    $KoTCMinimapSystem.CurrentMinimapX +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2,
    $KoTCMinimapSystem.CurrentMinimapY +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2,
    $KoTCMinimapSystem.CurrentMinimapSize -
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 4,
    $KoTCMinimapSystem.CurrentMinimapSize -
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 4
  );

  $KoTCMinimapSystem.MainMinimapSprite.addChild(
    $KoTCMinimapSystem.SecondaryMinimapSprite
  );
  if ($KoTCMinimapSystem.ExplorationMapMode !== false) {
    //     var KOTCBOOKMAPStartTransfer = Game_Player.prototype.reserveTransfer;
    //     Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
    //         if ($gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap]) {
    //             KoTCCountExploredArea($KoTCMinimapSystem.CurrentMapIndex);

    //         }
    //         KOTCBOOKMAPStartTransfer.call(this, mapId, x, y, d, fadeType);
    //     };
    $KoTCMinimapSystem.MapFullyExploredAudio =
      $KoTCMinimapSystem.Parameters["Map Fully Explored Sound"];
    $KoTCMinimapSystem.MapFullyExploredAudioVolume = Number(
      $KoTCMinimapSystem.Parameters["Map Fully Explored Sound Volume"]
    );
  }
  // Map Wall Sprite Init

  $KoTCMinimapSystem.MapWallSprite = new Bitmap(
    $KoTCMinimapSystem.CurrentMinimapSize,
    $KoTCMinimapSystem.CurrentMinimapSize
  );
  $KoTCMinimapSystem.MapWallSprite = new Sprite(
    $KoTCMinimapSystem.MapWallSprite
  );

  // Border Init
  if ($KoTCMinimapSystem.UseDefaultBorder !== true) {
    var borderx = 0 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    var bordery = 0 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    var borderwidth =
      $KoTCMinimapSystem.CurrentMinimapSize +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2;
    var borderheight =
      $KoTCMinimapSystem.CurrentMinimapSize +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2;
    $KoTCMinimapSystem.MapBorderSprite = new Bitmap(borderwidth, borderheight);
    $KoTCMinimapSystem.MapBorderSprite.fillRect(
      0,
      0,
      $KoTCMinimapSystem.CurrentMinimapBorderThickness,
      borderheight,
      $KoTCMinimapSystem.CurrentMinimapBordercolor
    );
    $KoTCMinimapSystem.MapBorderSprite.fillRect(
      0 + borderwidth - $KoTCMinimapSystem.CurrentMinimapBorderThickness,
      0,
      $KoTCMinimapSystem.CurrentMinimapBorderThickness,
      borderheight,
      $KoTCMinimapSystem.CurrentMinimapBordercolor
    );
    $KoTCMinimapSystem.MapBorderSprite.fillRect(
      0,
      0,
      borderwidth,
      $KoTCMinimapSystem.CurrentMinimapBorderThickness,
      $KoTCMinimapSystem.CurrentMinimapBordercolor
    );
    $KoTCMinimapSystem.MapBorderSprite.fillRect(
      0,
      0 + borderheight - $KoTCMinimapSystem.CurrentMinimapBorderThickness,
      borderwidth,
      $KoTCMinimapSystem.CurrentMinimapBorderThickness,
      $KoTCMinimapSystem.CurrentMinimapBordercolor
    );

    $KoTCMinimapSystem.MapBorderSprite = new Sprite(
      $KoTCMinimapSystem.MapBorderSprite
    );
    $KoTCMinimapSystem.MapBorderSprite.x =
      0 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    $KoTCMinimapSystem.MapBorderSprite.y =
      0 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    $KoTCMinimapSystem.MainMinimapSprite.addChild(
      $KoTCMinimapSystem.MapBorderSprite
    );
  }

  // Blocker Init
  var blocker = new Bitmap(
    $KoTCMinimapSystem.CurrentMinimapSize,
    $KoTCMinimapSystem.CurrentMinimapSize
  );
  blocker.fillAll("black");
  $KoTCMinimapSystem.BlockerSprite = new Sprite(blocker);
  $KoTCMinimapSystem.BlockerSprite.x =
    $KoTCMinimapSystem.CurrentMinimapBorderThickness;
  $KoTCMinimapSystem.BlockerSprite.y =
    $KoTCMinimapSystem.CurrentMinimapBorderThickness;

  $KoTCMinimapSystem.SecondaryMinimapSprite.addChild(
    $KoTCMinimapSystem.MapWallSprite
  );

  if (Utils.RPGMAKER_NAME !== "MZ") {
    var playerbitmap = ImageManager.loadPicture("Player");
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite = new Sprite(playerbitmap);
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite.anchor.x = 0.5;
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite.anchor.y = 0.5;
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite.setColorTone(
      $KoTCMinimapSystem.CurrentMinimapPlayerColor
    );
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite.setBlendColor(
      $KoTCMinimapSystem.CurrentMinimapPlayerColor
    );
  }
  if ($KoTCMinimapSystem.FollowModeOn == true) {
    KoTCMinimapFollowPlayerOn($KoTCMinimapSystem.PlayerFollowModeZoom);
  }

  $KoTCMinimapSystem.ArrayofMinimapPictureSprites = [];
  if (Utils.RPGMAKER_NAME == "MZ") {
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "DisableKoTCMinimap",
      (data) => {
        KoTCMinimapOff();
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "EnableKoTCMinimap",
      (data) => {
        KoTCMinimapOn();
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "SetKoTCMinimapWallColor",
      (data) => {
        KoTCMinimapSetWallColor(data.Color);
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "SetKoTCMinimapBackgroundColor",
      (data) => {
        KoTCMinimapSetBackgroundColor(data.Color);
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "SetKoTCMinimapPlayerColor",
      (data) => {
        KoTCMinimapSetPlayerColor(data.Color);
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "SetKoTCMinimapBorderColor",
      (data) => {
        KoTCMinimapSetBorderColor(data.Color);
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "SetKoTCMinimapSize",
      (data) => {
        KoTCMinimapSetSize(data.Size);
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "KoTCOpenMapBook",
      (data) => {
        SceneManager.push(Scene_KoTCMapBook);
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "KoTCMapBookClear",
      (data) => {
        clearKoTCMapBook();
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "KoTCAddMapToMapBook",
      (data) => {
        kotcAddMapToBook(data.MapID);
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "KoTCRemoveMapToMapBook",
      (data) => {
        kotcRemoveMapFromBook(data.MapID);
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "KoTCMinimapFollowPlayerOn",
      (data) => {
        KoTCMinimapFollowPlayerOn(data.ZoomScale);
      }
    );
    PluginManager.registerCommand(
      "KoTC Advanced Minimap",
      "KoTCMinimapFollowPlayerOff",
      (data) => {
        KoTCMinimapFollowPlayerOff();
      }
    );
  } else {
    var kotcmapplugin = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
      kotcmapplugin.call(this, command, args);
      if (command.includes("KoTCMinimap") || command.includes("MapBook")) {
        switch (command) {
          case "KoTCMinimapOff":
            KoTCMinimapOff();
            break;

          case "KoTCMinimapOn":
            KoTCMinimapOn();
            break;

          case "SetKoTCMinimapWallColor":
            KoTCMinimapSetWallColor(args[0]);
            break;

          case "SetKoTCMinimapBackgroundColor":
            KoTCMinimapSetBackgroundColor(args[0]);

            break;

          case "SetKoTCMinimapBorderColor":
            KoTCMinimapSetBorderColor(args[0]);

            break;

          case "SetKoTCMinimapPlayerColor":
            KoTCMinimapSetPlayerColor(args[0]);

            break;

          case "SetKoTCMinimapSize":
            KoTCMinimapSetSize(args[0]);

            break;

          case "KoTCOpenMapBook":
            SceneManager.push(Scene_KoTCMapBook);
            break;

          case "KoTCMapBookClear":
            clearKoTCMapBook();
            break;

          case "KoTCAddMapToMapBook":
            kotcAddMapToBook(Number(args[0]));
            break;

          case "KoTCRemoveMapToMapBook":
            kotcRemoveMapFromBook(Number(args[0]));
            break;

          case "KoTCMinimapFollowPlayerOn":
            KoTCMinimapFollowPlayerOn(Number(args[0]));
            break;

          case "KoTCMinimapFollowPlayerOff":
            KoTCMinimapFollowPlayerOff();
            break;

          default:
        }
      }
    };
  }
  if ($KoTCMinimapSystem.MinimapMode == 1) {
    PopulateTilesetColors(8);
    if (!MVNodeFS.checkFile("data/", "ColorStorageRepository.txt")) {
      setTimeout(() => {
        PopulateTilesetColors(8);
      }, 3000);
      setTimeout(() => {
        MVNodeFS.writeFile(
          "data/",
          "ColorStorageRepository.txt",
          JSON.stringify($KoTCMinimapSystem.TilesetColorRepository)
        );
      }, 4000);
    }
  }
}

var KOTCMapTransferCompleted = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function () {
  KOTCMapTransferCompleted.call(this);
  KoTCMinimapEnable();
};

function KoTCNewMapID() {
  var MapIDArray = $KoTCMapImageCache[$gameMap._mapId].IDStorage;
  var m = 0;
  for (; m < 1; m++) {
    var newmapid = Math.round(Math.random() * 100000000) + 10000;
    if (!MapIDArray.includes(newmapid)) {
      m = 1;
      return Number(newmapid);
    }
  }
}

KoTCMinimapEnable = function () {
  if (
    $dataMap &&
    !$gamePlayer.isTransferring() &&
    typeof KoTCMapDisabled == "undefined"
  ) {
    if (
      !$KoTCMinimapSystem.MapBorderSprite &&
      $KoTCMinimapSystem.UseDefaultBorder !== false
    ) {
      var borderx = 0 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
      var bordery = 0 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
      var borderwidth =
        $KoTCMinimapSystem.CurrentMinimapSize +
        $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2;
      var borderheight =
        $KoTCMinimapSystem.CurrentMinimapSize +
        $KoTCMinimapSystem.CurrentMinimapBorderThickness * 2;
      if (Utils.RPGMAKER_NAME == "MZ") {
        $KoTCMinimapSystem.MapBorderSprite = new KoTCMinimapWindow(
          new Rectangle(borderx, bordery, borderwidth, borderheight)
        );
      } else {
        $KoTCMinimapSystem.MapBorderSprite = new KoTCMinimapWindow(
          borderx,
          bordery,
          borderwidth,
          borderheight
        );
      }
      $KoTCMinimapSystem.MainMinimapSprite.addChildAt(
        $KoTCMinimapSystem.MapBorderSprite,
        0
      );
    }
    if ($gameSystem.MapExplorationData && $KoTCMinimapSystem.FogOfWarSprite) {
      clearInterval($KoTCMinimapSystem.PlayerKoTCMinimapInterval2);
      $KoTCMinimapSystem.PlayerKoTCMinimapInterval2 = undefined;
    }
    if (Utils.RPGMAKER_NAME == "MZ") {
      $KoTCMinimapSystem.SecondaryMinimapSprite.removeChild(
        $KoTCMinimapSystem.KoTCMinimapPlayerSprite
      );
      var playerbitmap = ImageManager.loadPicture("Player", 0);
      $KoTCMinimapSystem.KoTCMinimapPlayerSprite = new Sprite(playerbitmap);
      $KoTCMinimapSystem.KoTCMinimapPlayerSprite.anchor.x = 0.5;
      $KoTCMinimapSystem.KoTCMinimapPlayerSprite.anchor.y = 0.5;
      $KoTCMinimapSystem.KoTCMinimapPlayerSprite.setColorTone(
        $KoTCMinimapSystem.CurrentMinimapPlayerColor
      );
      $KoTCMinimapSystem.KoTCMinimapPlayerSprite.setBlendColor(
        $KoTCMinimapSystem.CurrentMinimapPlayerColor
      );
    }
    $KoTCMinimapSystem.MainMinimapSprite.addChild(
      $KoTCMinimapSystem.BlockerSprite
    );

    var minimapsize = $KoTCMinimapSystem.CurrentMinimapSize;
    var width = $KoTCMinimapSystem.CurrentMinimapSize;
    var height = $KoTCMinimapSystem.CurrentMinimapSize;
    // console.log("Enabling Minimap.");
    if ($KoTCMinimapSystem.MinimapMode == 2) {
      if ($KoTCMinimapSystem.KoTCMinimapPictureInterval) {
        clearInterval($KoTCMinimapSystem.KoTCMinimapPictureInterval);
        $KoTCMinimapSystem.KoTCMinimapPictureInterval == undefined;
      }
    }
    if ($KoTCMinimapSystem.PlayerKoTCMinimapInterval) {
      clearInterval($KoTCMinimapSystem.PlayerKoTCMinimapInterval);
      $KoTCMinimapSystem.PlayerKoTCMinimapInterval = undefined;
    }

    switch ($KoTCMinimapSystem.MinimapMode) {
      case 0:
        $KoTCMinimapSystem.MapWallSprite.bitmap.fillRect(
          0,
          0,
          $KoTCMinimapSystem.CurrentMinimapSize,
          $KoTCMinimapSystem.CurrentMinimapSize,
          $KoTCMinimapSystem.CurrentMinimapBackgroundcolor
        );
        var x = 0;
        for (; x < width; x++) {
          var xtarget = Math.round(x * ($dataMap.width / minimapsize));
          var y = 0;
          for (; y < height; y++) {
            var ytarget = Math.round(y * ($dataMap.height / minimapsize));
            if ($gameMap.checkPassage(xtarget, ytarget, 0x0f) !== true) {
              $KoTCMinimapSystem.MapWallSprite.bitmap.fillRect(
                x,
                y,
                1,
                1,
                $KoTCMinimapSystem.CurrentMinimapWallcolor
              );
            }
          }
        }

        break;

      case 1:
        $KoTCMinimapSystem.MapWallSprite.bitmap.clear();
        var x = 0;
        for (; x < width; x++) {
          var xtarget = Math.round(x * ($dataMap.width / minimapsize));
          var y = 0;
          for (; y < height; y++) {
            var ytarget = Math.round(y * ($dataMap.height / minimapsize));
            var t = 0;
            switch (true) {
              case $KoTCMinimapSystem.TilesetColorRepository[
                $gameMap.tileset().name
              ][$gameMap.tileId(xtarget, ytarget, 3)] !== undefined:
                var tilecolor =
                  $KoTCMinimapSystem.TilesetColorRepository[
                    $gameMap.tileset().name
                  ][$gameMap.tileId(xtarget, ytarget, 3)];
                $KoTCMinimapSystem.MapWallSprite.bitmap.fillRect(
                  x,
                  y,
                  1,
                  1,
                  tilecolor
                );
                break;

              case $KoTCMinimapSystem.TilesetColorRepository[
                $gameMap.tileset().name
              ][$gameMap.tileId(xtarget, ytarget, 1)] !== undefined:
                var tilecolor =
                  $KoTCMinimapSystem.TilesetColorRepository[
                    $gameMap.tileset().name
                  ][$gameMap.tileId(xtarget, ytarget, 1)];
                var darkcheck = hexToRgb(tilecolor);
                if (darkcheck.r < 40 && darkcheck.g < 40 && darkcheck.b < 40) {
                } else {
                  $KoTCMinimapSystem.MapWallSprite.bitmap.fillRect(
                    x,
                    y,
                    1,
                    1,
                    tilecolor
                  );
                  break;
                }

              case $KoTCMinimapSystem.TilesetColorRepository[
                $gameMap.tileset().name
              ][$gameMap.tileId(xtarget, ytarget, 0)] !== undefined:
                var tilecolor =
                  $KoTCMinimapSystem.TilesetColorRepository[
                    $gameMap.tileset().name
                  ][$gameMap.tileId(xtarget, ytarget, 0)];
                $KoTCMinimapSystem.MapWallSprite.bitmap.fillRect(
                  x,
                  y,
                  1,
                  1,
                  tilecolor
                );

                break;

              default:
                if ($KoTCMinimapSystem.KoTCDrawParallax !== false) {
                  var tilecolor = $KoTCMinimapSystem.CurrentMinimapWallcolor;
                  $KoTCMinimapSystem.MapWallSprite.bitmap.fillRect(
                    x,
                    y,
                    1,
                    1,
                    tilecolor
                  );
                }
            }
          }
        }

        break;

      case 2:
        if (
          $KoTCMinimapSystem.KoTCMinimapPictureSprite &&
          $KoTCMinimapSystem.SecondaryMinimapSprite.children.includes(
            $KoTCMinimapSystem.KoTCMinimapPictureSprite
          ) &&
          $KoTCMinimapSystem.MapMemory == String($dataMap.data)
        ) {
          KoTCStartMapInterval(width, height);
        } else {
          if ($KoTCMinimapSystem.KoTCMinimapPictureSprite !== undefined) {
            $KoTCMinimapSystem.KoTCMinimapPictureSprite.bitmap.clear();
          }
          $KoTCMinimapSystem.KoTCMinimapPictureInterval = setInterval(() => {
            if (
              $dataMap &&
              SceneManager._scene instanceof Scene_Map &&
              SceneManager._scene._spriteset !== undefined
            ) {
              $KoTCMinimapSystem.MainMinimapSprite.removeChild(
                $KoTCMinimapSystem.KoTCMinimapPictureSprite
              );
              clearInterval($KoTCMinimapSystem.KoTCMinimapPictureInterval);
              $KoTCMinimapSystem.MapMemory = String($dataMap.data);
              $KoTCMinimapSystem.KoTCMinimapPicture = ShrinkBitmapToMapSize(
                OrangeKoTCHybrid.getMapshot()
              );
              $KoTCMinimapSystem.KoTCMinimapPictureSprite = new Sprite(
                $KoTCMinimapSystem.KoTCMinimapPicture
              );
              $KoTCMinimapSystem.SecondaryMinimapSprite.addChild(
                $KoTCMinimapSystem.KoTCMinimapPictureSprite
              );
              $KoTCMinimapSystem.MainMinimapSprite.removeChild(
                $KoTCMinimapSystem.BlockerSprite
              );
              $KoTCMinimapSystem.MainMinimapSprite.addChild(
                $KoTCMinimapSystem.BlockerSprite
              );

              KoTCStartMapInterval(width, height);
            }
          }, 300);
        }

        break;

      default:
    }
    SceneManager._scene.addChild($KoTCMinimapSystem.MainMinimapSprite);
    if (Utils.RPGMAKER_NAME == "MZ") {
      var timeoutfordatainput = 1000;
    } else {
      var timeoutfordatainput = 1000;
    }
    if ($KoTCMinimapSystem.MapBookTimeout) {
      $KoTCMinimapSystem.MapBookTimeout = setTimeout(() => {
        $KoTCMapImageCache[$gameMap._mapId].ImageDataStorage[
          $KoTCMinimapSystem.CurrentMapIndex
        ] = CreateMapBookPictureImageData();
        $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[
          $KoTCMinimapSystem.CurrentMapIndex
        ] = CreateMapBookPictureImageData(1);
        $KoTCMinimapSystem.MapBookTimeout = undefined;
      }, timeoutfordatainput);
    }
    if ($KoTCMinimapSystem.ExplorationCountTimeout) {
      $KoTCMinimapSystem.ExplorationCountTimeout = setTimeout(() => {
        KoTCCountExploredArea($KoTCMinimapSystem.CurrentMapIndex);
        $KoTCMinimapSystem.ExplorationCountTimeout = undefined;
      }, timeoutfordatainput);
    }
    if ($KoTCMinimapSystem.MinimapMode !== 2) {
      KoTCStartMapInterval(width, height);
    }
  }
};

function KoTCStartMapInterval(width, height) {
  if (
    $KoTCMinimapSystem.KoTCDrawParallax !== false &&
    $gameMap.parallaxName() !== ""
  ) {
    var parallaxbitmap = ImageManager.loadParallax($gameMap.parallaxName());
    parallaxbitmap.addLoadListener(function () {
      if ($KoTCMinimapSystem.ParallaxSprite) {
        $KoTCMinimapSystem.MainMinimapSprite.removeChild(
          $KoTCMinimapSystem.ParallaxSprite
        );
      }
      $KoTCMinimapSystem.ParallaxSprite = new Sprite(parallaxbitmap);
      $KoTCMinimapSystem.ParallaxSprite.scale.x =
        $KoTCMinimapSystem.CurrentMinimapSize /
        $KoTCMinimapSystem.ParallaxSprite.width;
      $KoTCMinimapSystem.ParallaxSprite.scale.y =
        $KoTCMinimapSystem.CurrentMinimapSize /
        $KoTCMinimapSystem.ParallaxSprite.height;
      $KoTCMinimapSystem.SecondaryMinimapSprite.addChildAt(
        $KoTCMinimapSystem.ParallaxSprite,
        1
      );
    });
  } else if (
    $KoTCMinimapSystem.ParallaxSprite &&
    $gameMap.parallaxName() == ""
  ) {
    $KoTCMinimapSystem.SecondaryMinimapSprite.removeChild(
      $KoTCMinimapSystem.ParallaxSprite
    );
  }
  $KoTCMinimapSystem.SecondaryMinimapSprite.addChildAt(
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite,
    $KoTCMinimapSystem.SecondaryMinimapSprite.children.length
  );
  $KoTCMinimapSystem.MainMinimapSprite.removeChild(
    $KoTCMinimapSystem.BlockerSprite
  );
  $KoTCMinimapSystem.PlayerKoTCMinimapInterval = setInterval(function () {
    KoTCUpdateMinimapLocations();
  }, $KoTCMinimapSystem.CurrentMinimapRefreshRate);
  if ($KoTCMinimapSystem.ExplorationMapMode !== false) {
    if (
      $KoTCMinimapSystem.MapMemory2 !== String($dataMap.data) &&
      $KoTCMinimapSystem.FogOfWarSprite
    ) {
      $KoTCMinimapSystem.MapMemory2 = String($dataMap.data);
      $KoTCMinimapSystem.SecondaryMinimapSprite.removeChild(
        $KoTCMinimapSystem.FogOfWarSprite
      );
      var fogofwar = new Bitmap(
        $KoTCMinimapSystem.CurrentMinimapSize,
        $KoTCMinimapSystem.CurrentMinimapSize
      );
      fogofwar.fillRect(
        0,
        0,
        $KoTCMinimapSystem.CurrentMinimapSize,
        $KoTCMinimapSystem.CurrentMinimapSize,
        "black"
      );
      var fogofwarsprite = new Sprite(fogofwar);
      $KoTCMinimapSystem.FogOfWarSprite = fogofwarsprite;
      $KoTCMinimapSystem.SecondaryMinimapSprite.addChild(
        $KoTCMinimapSystem.FogOfWarSprite
      );
    }

    UpdateMapVision();
    $KoTCMinimapSystem.PlayerKoTCMinimapInterval2 = setInterval(function () {
      MapVisionCheck();
    }, $KoTCMinimapSystem.ExplorationMapRefreshRate);
  } else {
    if ($KoTCMapImageCache[$gameMap._mapId] == undefined) {
      //console.log("New Map Detected, creating image data storage, name is ", $dataMapInfos[$gameMap._mapId].name)
      $KoTCMapImageCache[$gameMap._mapId] = {
        DataStorage: [String($dataMap.data)],
        IDStorage: [Number($gameMap._mapId)],
        AmountExplored: [0],
        AmountToExplore: [0],
      };
      if ($KoTCMinimapSystem.MapBookEnabled !== false) {
        Object.assign($KoTCMapImageCache[$gameMap._mapId], {
          NameStorage: [$dataMapInfos[$gameMap._mapId].name],
          MapNote: [$dataMap.note],
          SelfIndex: [0],
          ImageDataStorage: [],
          MapFullImageStorage: [],
        });
      }
    }
    if (
      $KoTCMapImageCache[$gameMap._mapId].DataStorage.includes(
        String($dataMap.data)
      )
    ) {
      //console.log("Stored Map Detected, stored full image data, name is ", $dataMapInfos[$gameMap._mapId].name)

      var index = $KoTCMapImageCache[$gameMap._mapId].DataStorage.indexOf(
        String($dataMap.data)
      );
      var chosenmapid = $KoTCMapImageCache[$gameMap._mapId].IDStorage[index];
      if (
        $KoTCMinimapSystem.MapBookEnabled !== false &&
        $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] ==
          undefined
      ) {
        switch ($KoTCMinimapSystem.MinimapMode) {
          case 0:
            $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
              CreateMapBookPictureImageData(1);

            break;

          case 1:
            $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
              CreateMapBookPictureImageData(1);

            break;

          case 2:
            $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
              CreateMapBookPictureImageData(1);

            break;

          default:
        }
      }
    } else {
      //console.log("New Map on Old ID Detected, stored full image data, name is ", $dataMapInfos[$gameMap._mapId].name)
      var index = $KoTCMapImageCache[$gameMap._mapId].DataStorage.length;
      var chosenmapid = KoTCNewMapID();
      $KoTCMapImageCache[$gameMap._mapId].DataStorage.push(
        String($dataMap.data)
      );
      $KoTCMapImageCache[$gameMap._mapId].IDStorage.push(chosenmapid);
      $KoTCMapImageCache[$gameMap._mapId].AmountExplored.push(0);
      $KoTCMapImageCache[$gameMap._mapId].AmountToExplore.push(0);
      if ($KoTCMinimapSystem.MapBookEnabled !== false) {
        $KoTCMapImageCache[$gameMap._mapId].NameStorage.push(
          $dataMapInfos[$gameMap._mapId].name + index
        );
        $KoTCMapImageCache[$gameMap._mapId].MapNote.push($dataMap.note);
        $KoTCMapImageCache[$gameMap._mapId].SelfIndex.push(index);
        $KoTCMapImageCache[$gameMap._mapId].ImageDataStorage.push([]);
        $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage.push([]);
        if (
          $KoTCMinimapSystem.MapBookEnabled !== false &&
          $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] ==
            undefined
        ) {
          switch ($KoTCMinimapSystem.MinimapMode) {
            case 0:
              $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
                CreateMapBookPictureImageData(1);

              break;

            case 1:
              $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
                CreateMapBookPictureImageData(1);

              break;

            case 2:
              $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
                CreateMapBookPictureImageData(1);

              break;

            default:
          }
        }
      }
    }
    $KoTCMinimapSystem.CurrentMapIndex = index;
    if ($KoTCMinimapSystem.MapBookEnabled !== false) {
      $KoTCMapImageCache[$gameMap._mapId].ImageDataStorage[
        $KoTCMinimapSystem.CurrentMapIndex
      ] = CreateMapBookPictureImageData(1);
    }
    var notecheckreg = new RegExp(/<KoTC Map Deny>/i);
    if (
      $KoTCMinimapSystem.AutoAddMapsToMapBook !== false &&
      $KoTCMapImageCache[0][$KoTCMinimapSystem.CurrentMap] == undefined &&
      notecheckreg.exec($dataMap.note) == null
    ) {
      kotcAddMapToBook($KoTCMinimapSystem.CurrentMap);
    }
  }
}

function KoTCMinimapFollowPlayerOn(zoom) {
  $KoTCMinimapSystem.SecondaryMinimapSpriteXY = [
    Number($KoTCMinimapSystem.SecondaryMinimapSprite.x),
    Number($KoTCMinimapSystem.SecondaryMinimapSprite.y),
  ];
  $KoTCMinimapSystem.FollowModeOn = true;
  $KoTCMinimapSystem.SecondaryMinimapSprite.scale.y = zoom;
  $KoTCMinimapSystem.SecondaryMinimapSprite.scale.x = zoom;
}

function KoTCMinimapFollowPlayerOff() {
  $KoTCMinimapSystem.FollowModeOn = false;
  $KoTCMinimapSystem.SecondaryMinimapSprite.scale.y = 1;
  $KoTCMinimapSystem.SecondaryMinimapSprite.scale.x = 1;
  $KoTCMinimapSystem.SecondaryMinimapSprite.x =
    $KoTCMinimapSystem.SecondaryMinimapSpriteXY[0];
  $KoTCMinimapSystem.SecondaryMinimapSprite.y =
    $KoTCMinimapSystem.SecondaryMinimapSpriteXY[1];
}

KoTCUpdateMinimapLocations = function () {
  if (
    $dataMap &&
    !$gamePlayer.isTransferring() &&
    SceneManager._scene instanceof Scene_Map
  ) {
    var xmin = $KoTCMinimapSystem.CurrentMinimapX;
    var ymin = $KoTCMinimapSystem.CurrentMinimapY;
    var xmax =
      $KoTCMinimapSystem.CurrentMinimapX +
      $KoTCMinimapSystem.CurrentMinimapSize;
    var ymax =
      $KoTCMinimapSystem.CurrentMinimapY +
      $KoTCMinimapSystem.CurrentMinimapSize;
    if (
      $KoTCMinimapSystem.BigMapOn == false &&
      $gamePlayer.screenX() > xmin &&
      $gamePlayer.screenX() < xmax &&
      $gamePlayer.screenY() > ymin &&
      $gamePlayer.screenY() < ymax
    ) {
      $KoTCMinimapSystem.MainMinimapSprite.opacity = 50;
    } else {
      $KoTCMinimapSystem.MainMinimapSprite.opacity = 255;
    }

    var width = $dataMap.width - 1;
    var height = $dataMap.height - 1;
    if ($KoTCMinimapSystem.FollowModeOn == true) {
      $KoTCMinimapSystem.SecondaryMinimapSprite.y =
        -$KoTCMinimapSystem.KoTCMinimapPlayerSprite.y *
          $KoTCMinimapSystem.SecondaryMinimapSprite.scale.y +
        $KoTCMinimapSystem.CurrentMinimapSize / 2;
      $KoTCMinimapSystem.SecondaryMinimapSprite.x =
        -$KoTCMinimapSystem.KoTCMinimapPlayerSprite.x *
          $KoTCMinimapSystem.SecondaryMinimapSprite.scale.x +
        $KoTCMinimapSystem.CurrentMinimapSize / 2;
    }
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite.x =
      Math.round(
        $gamePlayer.x / ($dataMap.width / $KoTCMinimapSystem.CurrentMinimapSize)
      ) + $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite.y =
      Math.round(
        $gamePlayer.y /
          ($dataMap.height / $KoTCMinimapSystem.CurrentMinimapSize)
      ) + $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite.scale.x =
      0.1 / ($dataMap.width / $KoTCMinimapSystem.CurrentMinimapSize);
    $KoTCMinimapSystem.KoTCMinimapPlayerSprite.scale.y =
      0.1 / ($dataMap.height / $KoTCMinimapSystem.CurrentMinimapSize);
    if ($KoTCMinimapSystem.KoTCMinimapPlayerSprite.scale.x < 0.3) {
      $KoTCMinimapSystem.KoTCMinimapPlayerSprite.scale.x = 0.3;
      $KoTCMinimapSystem.KoTCMinimapPlayerSprite.scale.y = 0.3;
    }
    switch ($gamePlayer.direction()) {
      case 2:
        $KoTCMinimapSystem.KoTCMinimapPlayerSprite.rotation =
          (180 * Math.PI) / 180;

        break;
      case 4:
        $KoTCMinimapSystem.KoTCMinimapPlayerSprite.rotation =
          (270 * Math.PI) / 180;

        break;

      case 6:
        $KoTCMinimapSystem.KoTCMinimapPlayerSprite.rotation =
          (90 * Math.PI) / 180;

        break;

      case 8:
        $KoTCMinimapSystem.KoTCMinimapPlayerSprite.rotation =
          (0 * Math.PI) / 180;

        break;
      default:
    }
    var eventlength = $gameMap.events().length;
    var l = 0;
    var regexcode1 = new RegExp(/<KoTC Minimap\s?(\d+)?>/i);
    var regexcode2 = new RegExp(/<KoTC Minimap: (\w+)\s?(\d+)?>/i);
    var regexcode3 = new RegExp(/<KoTC Minimap Dot: (\S+)\s?(\d+)?>/i);
    var regexcode4 = new RegExp(/<KoTC Minimap Square: (\S+)\s?(\d+)?>/i);
    for (; l < eventlength; l++) {
      if ($gameMap.events()[l] !== undefined) {
        if (!$gameMap.events()[l]._erased) {
          if ($gameMap.events()[l].page()) {
            var found = 0;

            $gameMap
              .events()
              [l].list()
              .forEach(function (pageindex) {
                if (pageindex.code === 108) {
                  var comment = pageindex.parameters[0].split(" : ");
                  if (comment[0].includes("KoTC Minimap")) {
                    // console.log(comment[0]);
                    $gameMap.events()[l].KoTCMapComment = comment[0];
                    found = 1;
                  }
                }
              }, this);
            if (found == 0) {
              $gameMap.events()[l].KoTCMapComment = 0;
            }
          }

          switch (true) {
            case regexcode1.exec($gameMap.events()[l].event().note) !== null ||
              regexcode1.exec($gameMap.events()[l].KoTCMapComment) !== null:
              // console.log("Event detected",$gameMap.events()[l])
              if (
                (RegExp.$1 !== "" &&
                  Math.round(
                    Math.hypot(
                      $gamePlayer.x - $gameMap.events()[l].x,
                      $gamePlayer.y - $gameMap.events()[l].y
                    ) <= RegExp.$1
                  )) ||
                RegExp.$1 == ""
              ) {
                if (
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] == null ||
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] ==
                    undefined
                ) {
                  //      //console.log("Setting Sprite for event.", $gameMap.events()[l]._eventId)
                  var KoTCMapSprite = KoTCGetImageFromPicture(
                    $gameMap.events()[l].characterName(),
                    "characters",
                    $gameMap.events()[l].characterIndex(),
                    100,
                    100
                  );
                  KoTCMapSprite.scale.x =
                    0.1 / (width / $KoTCMinimapSystem.CurrentMinimapSize);
                  KoTCMapSprite.scale.y =
                    0.1 / (height / $KoTCMinimapSystem.CurrentMinimapSize);
                  if (KoTCMapSprite.scale.x < 0.5) {
                    KoTCMapSprite.scale.x = 0.5;
                    KoTCMapSprite.scale.y = 0.5;
                  }
                  KoTCMapSprite.PreviousTexture = $gameMap
                    .events()
                    [l].characterName();
                  KoTCMapSprite.PreviousTextureIndex = $gameMap
                    .events()
                    [l].characterIndex();

                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] =
                    KoTCMapSprite;
                }
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].x =
                  Math.round(
                    $gameMap.events()[l].x /
                      (width / $KoTCMinimapSystem.CurrentMinimapSize)
                  );
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].y =
                  Math.round(
                    $gameMap.events()[l].y /
                      (height / $KoTCMinimapSystem.CurrentMinimapSize)
                  );

                if (
                  !$KoTCMinimapSystem.SecondaryMinimapSprite.children.includes(
                    $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                  )
                ) {
                  $KoTCMinimapSystem.SecondaryMinimapSprite.addChild(
                    $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                  );
                }
                if (
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                    .PreviousTexture !== $gameMap.events()[l].characterName() ||
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                    .PreviousTextureIndex !==
                    $gameMap.events()[l].characterIndex()
                ) {
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] =
                    undefined;
                }
              } else if ($KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]) {
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] = undefined;
              }

              break;

            case regexcode2.exec($gameMap.events()[l].event().note) !== null ||
              regexcode2.exec($gameMap.events()[l].KoTCMapComment) !== null:
              if (
                (RegExp.$2 !== "" &&
                  Math.round(
                    Math.hypot(
                      $gamePlayer.x - $gameMap.events()[l].x,
                      $gamePlayer.y - $gameMap.events()[l].y
                    ) <= RegExp.$2
                  )) ||
                RegExp.$2 == ""
              ) {
                if (
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] == null ||
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] ==
                    undefined
                ) {
                  var ebitmap = ImageManager.loadPicture(RegExp.$1, 0);
                  var KoTCMapSprite = new Sprite(ebitmap);
                  KoTCMapSprite.anchor.x = 0.5;
                  KoTCMapSprite.anchor.y = 0.5;
                  KoTCMapSprite.scale.x =
                    0.1 / (width / $KoTCMinimapSystem.CurrentMinimapSize);
                  KoTCMapSprite.scale.y =
                    0.1 / (height / $KoTCMinimapSystem.CurrentMinimapSize);
                  if (KoTCMapSprite.scale.x < 0.6) {
                    KoTCMapSprite.scale.x = 0.6;
                    KoTCMapSprite.scale.y = 0.6;
                  }
                  KoTCMapSprite.PreviousTexture = $gameMap
                    .events()
                    [l].characterName();
                  KoTCMapSprite.PreviousTextureIndex = $gameMap
                    .events()
                    [l].characterIndex();

                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] =
                    KoTCMapSprite;
                }
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].x =
                  Math.round(
                    $gameMap.events()[l].x /
                      (width / $KoTCMinimapSystem.CurrentMinimapSize)
                  );
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].y =
                  Math.round(
                    $gameMap.events()[l].y /
                      (height / $KoTCMinimapSystem.CurrentMinimapSize)
                  );

                if (
                  !$KoTCMinimapSystem.SecondaryMinimapSprite.children.includes(
                    $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                  )
                ) {
                  $KoTCMinimapSystem.SecondaryMinimapSprite.addChild(
                    $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                  );
                }
                if (
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                    .PreviousTexture !== $gameMap.events()[l].characterName() ||
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                    .PreviousTextureIndex !==
                    $gameMap.events()[l].characterIndex()
                ) {
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] =
                    undefined;
                }
              } else if ($KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]) {
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] = undefined;
              }

              break;

            case regexcode3.exec($gameMap.events()[l].event().note) !== null ||
              regexcode3.exec($gameMap.events()[l].KoTCMapComment) !== null:
              if (
                (RegExp.$2 !== "" &&
                  Math.round(
                    Math.hypot(
                      $gamePlayer.x - $gameMap.events()[l].x,
                      $gamePlayer.y - $gameMap.events()[l].y
                    ) <= RegExp.$2
                  )) ||
                RegExp.$2 == ""
              ) {
                if (
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] == null ||
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] ==
                    undefined
                ) {
                  var KoTCMapSprite = KoTCDrawCircle(24, RegExp.$1);
                  KoTCMapSprite.scale.x =
                    0.1 / (width / $KoTCMinimapSystem.CurrentMinimapSize);
                  KoTCMapSprite.scale.y =
                    0.1 / (height / $KoTCMinimapSystem.CurrentMinimapSize);
                  if (KoTCMapSprite.scale.x < 0.6) {
                    KoTCMapSprite.scale.x = 0.6;
                    KoTCMapSprite.scale.y = 0.6;
                  }
                  KoTCMapSprite.PreviousTexture = $gameMap
                    .events()
                    [l].characterName();
                  KoTCMapSprite.PreviousTextureIndex = $gameMap
                    .events()
                    [l].characterIndex();

                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] =
                    KoTCMapSprite;
                }
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].x =
                  Math.round(
                    $gameMap.events()[l].x /
                      (width / $KoTCMinimapSystem.CurrentMinimapSize)
                  );
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].y =
                  Math.round(
                    $gameMap.events()[l].y /
                      (height / $KoTCMinimapSystem.CurrentMinimapSize)
                  );

                if (
                  !$KoTCMinimapSystem.SecondaryMinimapSprite.children.includes(
                    $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                  )
                ) {
                  $KoTCMinimapSystem.SecondaryMinimapSprite.addChild(
                    $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                  );
                }
                if (
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                    .PreviousTexture !== $gameMap.events()[l].characterName() ||
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                    .PreviousTextureIndex !==
                    $gameMap.events()[l].characterIndex()
                ) {
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] =
                    undefined;
                }
              } else if ($KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]) {
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] = undefined;
              }

              break;

            case regexcode4.exec($gameMap.events()[l].event().note) !== null ||
              regexcode4.exec($gameMap.events()[l].KoTCMapComment) !== null:
              if (
                (RegExp.$2 !== "" &&
                  Math.round(
                    Math.hypot(
                      $gamePlayer.x - $gameMap.events()[l].x,
                      $gamePlayer.y - $gameMap.events()[l].y
                    ) <= RegExp.$2
                  )) ||
                RegExp.$2 == ""
              ) {
                if (
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] == null ||
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] ==
                    undefined
                ) {
                  var KoTCMapSprite = KoTCDrawSquare(48, RegExp.$1);
                  KoTCMapSprite.scale.x =
                    0.1 / (width / $KoTCMinimapSystem.CurrentMinimapSize);
                  KoTCMapSprite.scale.y =
                    0.1 / (height / $KoTCMinimapSystem.CurrentMinimapSize);
                  if (KoTCMapSprite.scale.x < 0.6) {
                    KoTCMapSprite.scale.x = 0.6;
                    KoTCMapSprite.scale.y = 0.6;
                  }
                  KoTCMapSprite.PreviousTexture = $gameMap
                    .events()
                    [l].characterName();
                  KoTCMapSprite.PreviousTextureIndex = $gameMap
                    .events()
                    [l].characterIndex();

                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] =
                    KoTCMapSprite;
                }
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].x =
                  Math.round(
                    $gameMap.events()[l].x /
                      (width / $KoTCMinimapSystem.CurrentMinimapSize)
                  );
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].y =
                  Math.round(
                    $gameMap.events()[l].y /
                      (height / $KoTCMinimapSystem.CurrentMinimapSize)
                  );

                if (
                  !$KoTCMinimapSystem.SecondaryMinimapSprite.children.includes(
                    $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                  )
                ) {
                  $KoTCMinimapSystem.SecondaryMinimapSprite.addChild(
                    $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                  );
                }
                if (
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                    .PreviousTexture !== $gameMap.events()[l].characterName() ||
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]
                    .PreviousTextureIndex !==
                    $gameMap.events()[l].characterIndex()
                ) {
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
                  $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] =
                    undefined;
                }
              } else if ($KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]) {
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] = undefined;
              }

              break;

            default:
              if ($KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]) {
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
                $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] = undefined;
              }
          }
        } else {
          if ($KoTCMinimapSystem.ArrayofMinimapPictureSprites[l]) {
            $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l].destroy();
            $KoTCMinimapSystem.ArrayofMinimapPictureSprites[l] = undefined;
          }
        }
      }
    }
    if (
      $KoTCMinimapSystem.FogOfWarSprite == undefined ||
      $KoTCMinimapSystem.FogOfWarSprite.width == 1
    ) {
      var fogofwar = new Bitmap(
        $KoTCMinimapSystem.CurrentMinimapSize,
        $KoTCMinimapSystem.CurrentMinimapSize
      );
      fogofwar.fillRect(
        0,
        0,
        $KoTCMinimapSystem.CurrentMinimapSize,
        $KoTCMinimapSystem.CurrentMinimapSize,
        "black"
      );
      var fogofwarsprite = new Sprite(fogofwar);
      $KoTCMinimapSystem.FogOfWarSprite = fogofwarsprite;
    }
    if (
      $KoTCMinimapSystem.ExplorationMapMode !== false &&
      $KoTCMinimapSystem.SecondaryMinimapSprite.children.indexOf(
        $KoTCMinimapSystem.FogOfWarSprite
      ) !==
        $KoTCMinimapSystem.MainMinimapSprite.children.length - 1 &&
      $KoTCMinimapSystem.FogOfWarSprite
    ) {
      $KoTCMinimapSystem.SecondaryMinimapSprite.addChild(
        $KoTCMinimapSystem.FogOfWarSprite
      );
    }
  }
};

function KoTCMinimapSetSize(size) {
  $KoTCMinimapSystem.MainMinimapSprite.scale.x = size;
  $KoTCMinimapSystem.MainMinimapSprite.scale.y = size;
  $KoTCMinimapSystem.SecondaryMinimapSprite.filterArea.width =
    Math.round($KoTCMinimapSystem.CurrentMinimapSize * size) -
    $KoTCMinimapSystem.CurrentMinimapBorderThickness * 4;
  $KoTCMinimapSystem.SecondaryMinimapSprite.filterArea.height =
    Math.round($KoTCMinimapSystem.CurrentMinimapSize * size) -
    $KoTCMinimapSystem.CurrentMinimapBorderThickness * 4;
}

function KoTCMinimapSetWallColor(wallcolor) {
  $KoTCMinimapSystem.CurrentMinimapWallcolor = wallcolor;
  KoTCMinimapEnable();
}

function KoTCMinimapSetBackgroundColor(backgroundcolor) {
  $KoTCMinimapSystem.CurrentMinimapBackgroundcolor = backgroundcolor;
  KoTCMinimapEnable();
}

function KoTCMinimapSetBorderColor(bordercolor) {
  $KoTCMinimapSystem.CurrentMinimapBordercolor = bordercolor;
  KoTCMinimapEnable();
}

function KoTCBitmapLoadCheck(bitmap) {
  var imageData = bitmap.context.getImageData(
    0,
    0,
    bitmap.width,
    bitmap.height
  );
  for (var i = 0; i < imageData.data.length; i++) {
    if (imageData.data[i] !== 0 && imageData.data[i] !== 255) return true;
  }
  return false;
}

KoTCMinimapDisable = function () {
  if (typeof KoTCMapDisabled == "undefined") {
    if ($KoTCMinimapSystem.MinimapMode == 2) {
      if ($KoTCMinimapSystem.KoTCMinimapPictureInterval) {
        clearInterval($KoTCMinimapSystem.KoTCMinimapPictureInterval);
        $KoTCMinimapSystem.KoTCMinimapPictureInterval == undefined;
      }
    }
    if ($KoTCMinimapSystem.ExplorationMapMode !== false) {
      if ($KoTCMinimapSystem.FogOfWarSprite) {
        clearInterval($KoTCMinimapSystem.PlayerKoTCMinimapInterval2);
        $KoTCMinimapSystem.PlayerKoTCMinimapInterval2 = undefined;
      }
    }
    if ($KoTCMinimapSystem.MapBookTimeout) {
      clearTimeout($KoTCMinimapSystem.MapBookTimeout);
    }
    if ($KoTCMinimapSystem.ExplorationCountTimeout) {
      clearTimeout($KoTCMinimapSystem.ExplorationCountTimeout);
    }
    clearInterval($KoTCMinimapSystem.PlayerKoTCMinimapInterval);
    $KoTCMinimapSystem.PlayerKoTCMinimapInterval = undefined;
    $KoTCMinimapSystem.PlayerKoTCMinimapInterval2 = undefined;
  }
};

KoTCMinimapOff = function () {
  if (typeof KoTCMapDisabled == "undefined") {
    if (
      $KoTCMinimapSystem.MainMinimapSprite &&
      SceneManager._scene.children.includes(
        $KoTCMinimapSystem.MainMinimapSprite
      )
    ) {
      SceneManager._scene.removeChild($KoTCMinimapSystem.MainMinimapSprite);
    }
    if ($KoTCMinimapSystem.MinimapMode == 2) {
      if ($KoTCMinimapSystem.KoTCMinimapPictureInterval) {
        clearInterval($KoTCMinimapSystem.KoTCMinimapPictureInterval);
        $KoTCMinimapSystem.KoTCMinimapPictureInterval == undefined;
      }
    }
    if ($KoTCMinimapSystem.ExplorationMapMode !== false) {
      if ($KoTCMinimapSystem.FogOfWarSprite) {
        clearInterval($KoTCMinimapSystem.PlayerKoTCMinimapInterval2);
        $KoTCMinimapSystem.PlayerKoTCMinimapInterval2 = undefined;
      }
    }
    if ($KoTCMinimapSystem.MapBookTimeout) {
      clearTimeout($KoTCMinimapSystem.MapBookTimeout);
    }
    if ($KoTCMinimapSystem.ExplorationCountTimeout) {
      clearTimeout($KoTCMinimapSystem.ExplorationCountTimeout);
    }
    clearInterval($KoTCMinimapSystem.PlayerKoTCMinimapInterval);
    $KoTCMinimapSystem.PlayerKoTCMinimapInterval = undefined;
    $KoTCMinimapSystem.PlayerKoTCMinimapInterval2 = undefined;
    KoTCMapDisabled = 1;
  }
};

KoTCMinimapOn = function () {
  if (typeof KoTCMapDisabled !== "undefined") {
    KoTCMapDisabled = undefined;
    KoTCMinimapEnable();
  }
};

function PopulateTilesetColors(spacebetweenpixelscans) {
  if (!MVNodeFS.checkFile("data/", "ColorStorageRepository.txt")) {
    $KoTCMinimapSystem.TilesetColorRepository = {};
    var t = 1;
    for (; t < $dataTilesets.length; t++) {
      var n = 0;
      $KoTCMinimapSystem.TilesetColorRepository[$dataTilesets[t].name] = [];
      for (; n < $dataTilesets[t].tilesetNames.length; n++) {
        if ($dataTilesets[t].tilesetNames[n] !== "") {
          switch (n) {
            case 0:
              var totalgridamount = 16;
              var gridmax = 16;

              break;

            case 1:
              var totalgridamount = 32;
              var gridmax = 32;

              break;

            case 2:
              var totalgridamount = 32;
              var gridmax = 32;

              break;

            case 3:
              var totalgridamount = 48;
              var gridmax = 48;

              break;

            case 4:
              var totalgridamount = 128;
              var gridmax = 128;

              break;

            case 5:
              var totalgridamount = 255;
              var gridmax = 254;

              break;

            case 6:
              var totalgridamount = 255;
              var gridmax = 255;

              break;

            case 7:
              var totalgridamount = 255;
              var gridmax = 255;

              break;

            case 8:
              var totalgridamount = 255;
              var gridmax = 255;

              break;

            default:
          }

          var p = 0;
          for (; p < gridmax; p++) {
            switch (n) {
              case 0:
                var tilestart = 2048 + p * 48;
                var tileend = tilestart + 48;

                break;

              case 1:
                var tilestart = 2816 + p * 48;
                var tileend = tilestart + 48;

                break;

              case 2:
                var tilestart = 4352 + p * 48;
                var tileend = tilestart + 48;

                break;

              case 3:
                var tilestart = 5888 + p * 48;
                var tileend = tilestart + 48;

                break;

              case 4:
                var tilestart = 1536 + p;
                var tileend = tilestart + 1;

                break;
              case 5:
                var tilestart = 1 + p;
                var tileend = tilestart + 1;

                break;
              case 6:
                var tilestart = 256 + p;
                var tileend = tilestart + 1;

                break;

              case 7:
                var tilestart = 512 + p;
                var tileend = tilestart + 1;

                break;

              case 8:
                var tilestart = 768 + p;
                var tileend = tilestart + 1;

                break;

              default:
            }
            var tiletoscan = KoTCGetImageFromPicture(
              $dataTilesets[t].tilesetNames[n],
              "tilesets",
              p,
              20,
              20,
              undefined,
              undefined,
              n
            );
            var averagecolor = GetAverageBitmapColor(
              tiletoscan.bitmap,
              spacebetweenpixelscans
            );
            averagecolor = rgbToHex(
              averagecolor.r,
              averagecolor.g,
              averagecolor.b
            );
            tiletoscan.destroy();

            var g = tilestart;

            for (; g < tileend; g++) {
              $KoTCMinimapSystem.TilesetColorRepository[$dataTilesets[t].name][
                g
              ] = averagecolor;
            }
          }
          $KoTCMinimapSystem.TilesetColorRepository[$dataTilesets[t].name] =
            Object.assign(
              {},
              $KoTCMinimapSystem.TilesetColorRepository[$dataTilesets[t].name]
            );
        }
      }
    }
  } else {
    $KoTCMinimapSystem.TilesetColorRepository = JSON.parse(
      MVNodeFS.readFile("data/", "ColorStorageRepository.txt")
    );
  }
}

function MapVisionCheck() {
  if (
    $gameSystem.MapExplorationData !== undefined &&
    $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap] &&
    $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][
      Math.round($gamePlayer.y)
    ] &&
    $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][
      Math.round($gamePlayer.y)
    ][Math.round($gamePlayer.x)] == 0 &&
    !$gamePlayer.isTransferring() &&
    $dataMap
  ) {
    var radius = 11 / ($dataMap.width / $KoTCMinimapSystem.CurrentMinimapSize);
    var x = Math.round(
      $gamePlayer.x / ($dataMap.width / $KoTCMinimapSystem.CurrentMinimapSize)
    );
    var y = Math.round(
      $gamePlayer.y / ($dataMap.height / $KoTCMinimapSystem.CurrentMinimapSize)
    );
    $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.save();
    $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.beginPath();
    $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.arc(
      x,
      y,
      radius,
      0,
      2 * Math.PI,
      false
    );
    $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.clip();
    $KoTCMinimapSystem.FogOfWarSprite.bitmap.clearRect(
      0,
      0,
      $KoTCMinimapSystem.FogOfWarSprite.width,
      $KoTCMinimapSystem.FogOfWarSprite.height
    );
    $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.restore();
    var width = $KoTCMinimapSystem.CurrentMinimapSize;
    var height = $KoTCMinimapSystem.CurrentMinimapSize;
    if ($KoTCMinimapSystem.MapBookEnabled !== false) {
      $KoTCMapImageCache[$gameMap._mapId].ImageDataStorage[
        $KoTCMinimapSystem.CurrentMapIndex
      ] = CreateMapBookPictureImageData();
    }

    var w = $dataMap.width;
    var h = $dataMap.height;
    var hh = 0;
    for (; hh < h; hh++) {
      var ww = 0;
      for (; ww < w; ww++) {
        var rangedifference = Math.round(
          Math.hypot($gamePlayer.x - ww, $gamePlayer.y - hh)
        );
        if (
          $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap] !==
            undefined &&
          $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][hh] !==
            undefined &&
          rangedifference < 10 &&
          $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][hh][
            ww
          ] !== 2
        ) {
          $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][hh][
            ww
          ] = 1;
        }
      }
    }
    if (
      $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap] !==
      undefined
    ) {
      $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][
        Math.round($gamePlayer.y)
      ][Math.round($gamePlayer.x)] = 2;
    }
    //  console.log("Map Vision Check", Math.round($gamePlayer.x), Math.round($gamePlayer.y))
    if (
      $KoTCMapImageCache[0][0][$gameMap._mapId] == undefined ||
      $KoTCMapImageCache[0][0][$gameMap._mapId][
        $KoTCMinimapSystem.CurrentMapIndex
      ] == undefined
    ) {
      KoTCCountExploredArea($KoTCMinimapSystem.CurrentMapIndex);
      if (
        $KoTCMinimapSystem.MapExploredNotificationOn == true &&
        $KoTCMapImageCache[$gameMap._mapId].AmountExplored[
          $KoTCMinimapSystem.CurrentMapIndex
        ] ==
          $KoTCMapImageCache[$gameMap._mapId].AmountToExplore[
            $KoTCMinimapSystem.CurrentMapIndex
          ]
      ) {
        if ($KoTCMapImageCache[0][0][$gameMap._mapId] == undefined) {
          $KoTCMapImageCache[0][0][$gameMap._mapId] = {};
        }
        var notificationbit = new Bitmap(
          Graphics.boxWidth / 2,
          Graphics.boxHeight / 2
        );
        var notificationsprite = new Sprite(notificationbit);
        notificationsprite.bitmap.drawText(
          "Map Fully Explored",
          notificationsprite.width / 2,
          notificationsprite.height / 2,
          600,
          64
        );
        notificationsprite.anchor.x = 0.5;
        notificationsprite.anchor.y = 0.5;
        notificationsprite.scale.y = 2;
        notificationsprite.scale.x = 2;
        notificationsprite.y = Graphics.boxHeight / 2.75;
        notificationsprite.x = Graphics.boxWidth / 2.75;
        SceneManager._scene.addChild(notificationsprite);

        $KoTCMapImageCache[0][0][$gameMap._mapId][
          $KoTCMinimapSystem.CurrentMapIndex
        ] = 1;
        AudioManager.playSe({
          name: $KoTCMinimapSystem.MapFullyExploredAudio,
          pan: 0,
          pitch: Math.randomInt(50) + 75,
          volume: $KoTCMinimapSystem.MapFullyExploredAudioVolume,
        });
        setTimeout(() => {
          SceneManager._scene.removeChild(notificationsprite);
        }, 3000);
      }
    }
  }
}

function UpdateMapVision() {
  if (
    !$gamePlayer.isTransferring() &&
    $dataMap &&
    SceneManager._scene instanceof Scene_Map
  ) {
    if ($KoTCMapImageCache[$gameMap._mapId] == undefined) {
      //console.log("New Map Detected, creating image data storage, name is ", $dataMapInfos[$gameMap._mapId].name)
      $KoTCMapImageCache[$gameMap._mapId] = {
        DataStorage: [String($dataMap.data)],
        IDStorage: [Number($gameMap._mapId)],
        AmountExplored: [0],
        AmountToExplore: [0],
      };
      if ($KoTCMinimapSystem.MapBookEnabled !== false) {
        Object.assign($KoTCMapImageCache[$gameMap._mapId], {
          NameStorage: [$dataMapInfos[$gameMap._mapId].name],
          MapNote: [$dataMap.note],
          SelfIndex: [0],
          ImageDataStorage: [],
          MapFullImageStorage: [],
        });
      }
    }
    if (
      $KoTCMapImageCache[$gameMap._mapId].DataStorage.includes(
        String($dataMap.data)
      )
    ) {
      //console.log("Stored Map Detected, stored full image data, name is ", $dataMapInfos[$gameMap._mapId].name)

      var index = $KoTCMapImageCache[$gameMap._mapId].DataStorage.indexOf(
        String($dataMap.data)
      );
      var chosenmapid = $KoTCMapImageCache[$gameMap._mapId].IDStorage[index];
      if (
        $KoTCMinimapSystem.MapBookEnabled !== false &&
        $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] ==
          undefined
      ) {
        switch ($KoTCMinimapSystem.MinimapMode) {
          case 0:
            $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
              CreateMapBookPictureImageData(1);

            break;

          case 1:
            $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
              CreateMapBookPictureImageData(1);

            break;

          case 2:
            $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
              CreateMapBookPictureImageData(1);

            break;

          default:
        }
      }
    } else {
      //console.log("New Map on Old ID Detected, stored full image data, name is ", $dataMapInfos[$gameMap._mapId].name)
      var index =
        $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage.length;
      var chosenmapid = KoTCNewMapID();
      $KoTCMapImageCache[$gameMap._mapId].DataStorage.push(
        String($dataMap.data)
      );
      $KoTCMapImageCache[$gameMap._mapId].IDStorage.push(chosenmapid);
      $KoTCMapImageCache[$gameMap._mapId].AmountExplored.push(0);
      $KoTCMapImageCache[$gameMap._mapId].AmountToExplore.push(0);
      if ($KoTCMinimapSystem.MapBookEnabled !== false) {
        $KoTCMapImageCache[$gameMap._mapId].NameStorage.push(
          $dataMapInfos[$gameMap._mapId].name + index
        );
        $KoTCMapImageCache[$gameMap._mapId].MapNote.push($dataMap.note);
        $KoTCMapImageCache[$gameMap._mapId].SelfIndex.push(index);
        $KoTCMapImageCache[$gameMap._mapId].ImageDataStorage.push([]);
        $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage.push([]);

        if (
          $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] ==
          undefined
        ) {
          switch ($KoTCMinimapSystem.MinimapMode) {
            case 0:
              $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
                CreateMapBookPictureImageData(1);

              break;

            case 1:
              $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
                CreateMapBookPictureImageData(1);

              break;

            case 2:
              $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[index] =
                CreateMapBookPictureImageData(1);

              break;

            default:
          }
        }
      }
    }
    if ($KoTCMapImageCache[$gameMap._mapId].AmountToExplore[index] == 0) {
      KoTCBuildExplorableArea(index);
    }
    if (Utils.RPGMAKER_NAME == "MZ") {
      var timeoutfordatainput = 1000;
    } else {
      var timeoutfordatainput = 1000;
    }
    if ($KoTCMinimapSystem.MapBookEnabled !== false) {
      $KoTCMinimapSystem.CurrentMapIndex = index;
      $KoTCMinimapSystem.MapBookTimeout = setTimeout(() => {
        $KoTCMapImageCache[$gameMap._mapId].ImageDataStorage[
          $KoTCMinimapSystem.CurrentMapIndex
        ] = CreateMapBookPictureImageData();
        $KoTCMapImageCache[$gameMap._mapId].MapFullImageStorage[
          $KoTCMinimapSystem.CurrentMapIndex
        ] = CreateMapBookPictureImageData(1);
        $KoTCMinimapSystem.MapBookTimeout = undefined;
      }, timeoutfordatainput);
    }
    $KoTCMinimapSystem.ExplorationCountTimeout = setTimeout(() => {
      KoTCCountExploredArea($KoTCMinimapSystem.CurrentMapIndex);
      $KoTCMinimapSystem.ExplorationCountTimeout = undefined;
    }, timeoutfordatainput);
    $KoTCMinimapSystem.CurrentMap = chosenmapid;
    var width =
      $KoTCMinimapSystem.CurrentMinimapSize +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    var height =
      $KoTCMinimapSystem.CurrentMinimapSize +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness;

    if (
      $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap] == undefined
    ) {
      $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap] = [];
      var w = $dataMap.width;
      var h = $dataMap.height;
      var hh = 0;
      for (; hh < h; hh++) {
        var ww = 0;
        $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][hh] = [];
        for (; ww < w; ww++) {
          var rangedifference = Math.round(
            Math.hypot($gamePlayer.x - ww, $gamePlayer.y - hh)
          );

          if (
            rangedifference <= 10 &&
            $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][hh][
              ww
            ] !== 2
          ) {
            $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][hh][
              ww
            ] = 1;
          } else {
            $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][hh][
              ww
            ] = 0;
          }
        }
      }
      $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][
        Math.round($gamePlayer.y)
      ][Math.round($gamePlayer.x)] = 2;
      //  console.log("Update Map Vision", Math.round($gamePlayer.x), Math.round($gamePlayer.y))
    }

    if (
      $KoTCMinimapSystem.FogOfWarSprite == undefined ||
      $KoTCMinimapSystem.FogOfWarSprite.width == 1
    ) {
      var fogofwar = new Bitmap(
        $KoTCMinimapSystem.CurrentMinimapSize,
        $KoTCMinimapSystem.CurrentMinimapSize
      );
      fogofwar.fillRect(
        0,
        0,
        $KoTCMinimapSystem.CurrentMinimapSize,
        $KoTCMinimapSystem.CurrentMinimapSize,
        "black"
      );
      var fogofwarsprite = new Sprite(fogofwar);
      $KoTCMinimapSystem.FogOfWarSprite = fogofwarsprite;
    }

    var minimapsize = $KoTCMinimapSystem.CurrentMinimapSize;
    var width =
      $dataMap.width / ($dataMap.width / minimapsize) +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    var height =
      $dataMap.height / ($dataMap.height / minimapsize) +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    var radius = 11 / ($dataMap.width / $KoTCMinimapSystem.CurrentMinimapSize);
    var x = 0;
    for (; x < width; x++) {
      var ytarget = Math.round(x * ($dataMap.width / minimapsize));
      var y = 0;
      for (; y < height; y++) {
        var xtarget = Math.round(y * ($dataMap.height / minimapsize));
        if (
          $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][
            xtarget
          ] !== undefined
        ) {
          if (
            $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][
              xtarget
            ][ytarget] == 2
          ) {
            $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.save();
            $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.beginPath();
            $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.arc(
              x,
              y,
              radius,
              0,
              2 * Math.PI,
              false
            );
            $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.clip();
            $KoTCMinimapSystem.FogOfWarSprite.bitmap.clearRect(
              0,
              0,
              $KoTCMinimapSystem.FogOfWarSprite.width,
              $KoTCMinimapSystem.FogOfWarSprite.height
            );
            $KoTCMinimapSystem.FogOfWarSprite.bitmap.context.restore();
          }
        }
      }
    }
    var notecheckreg = new RegExp(/<KoTC Map Deny>/i);
    if (
      $KoTCMinimapSystem.AutoAddMapsToMapBook !== false &&
      $KoTCMapImageCache[0][$KoTCMinimapSystem.CurrentMap] == undefined &&
      notecheckreg.exec($dataMap.note) == null
    ) {
      kotcAddMapToBook($KoTCMinimapSystem.CurrentMap);
    }
  }
}

function KoTCMinimapSetPlayerColor(color) {
  if (color[0] == "#") {
    var value = hexToRgb(color);
    var colorarray = [value.r, value.g, value.b, 1];
  } else if (typeof color == "string") {
    color = ConvertColorNameToHex(color);
    var value = hexToRgb(color);
    var colorarray = [value.r, value.g, value.b, 1];
  } else {
    var colorarray = [color[0], color[1], color[2], 1];
  }
  $KoTCMinimapSystem.CurrentMinimapPlayerColor = colorarray;
  $KoTCMinimapSystem.KoTCMinimapPlayerSprite.setColorTone(colorarray);
  $KoTCMinimapSystem.KoTCMinimapPlayerSprite.setBlendColor(colorarray);
}

var KOTCMAPTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function () {
  if ($KoTCMinimapSystem) {
    if ($KoTCMinimapSystem.MinimapMode == 2) {
      if ($KoTCMinimapSystem.KoTCMinimapPictureInterval) {
        clearInterval($KoTCMinimapSystem.KoTCMinimapPictureInterval);
        $KoTCMinimapSystem.KoTCMinimapPictureInterval == undefined;
      }
      SceneManager._scene.removeChild(
        $KoTCMinimapSystem.KoTCMinimapPictureSprite
      );
    }
    if ($KoTCMinimapSystem.PlayerKoTCMinimapInterval2) {
      clearInterval($KoTCMinimapSystem.PlayerKoTCMinimapInterval2);
      $KoTCMinimapSystem.PlayerKoTCMinimapInterval2 = undefined;
    }
    if ($KoTCMinimapSystem.ExplorationCountTimeout) {
      clearTimeout($KoTCMinimapSystem.ExplorationCountTimeout);
      $KoTCMinimapSystem.ExplorationCountTimeout = undefined;
    }
    if ($KoTCMinimapSystem.MapBookTimeout) {
      clearTimeout($KoTCMinimapSystem.MapBookTimeout);
      $KoTCMinimapSystem.MapBookTimeout = undefined;
    }
    if (Utils.RPGMAKER_NAME !== "MZ") {
      var m = 0;
      var mmmlength = $KoTCMinimapSystem.ArrayofMinimapPictureSprites.length;
      for (; m < mmmlength; m++) {
        if ($KoTCMinimapSystem.ArrayofMinimapPictureSprites[m]) {
          $KoTCMinimapSystem.ArrayofMinimapPictureSprites[m].destroy();
          $KoTCMinimapSystem.ArrayofMinimapPictureSprites[m] = undefined;
        }
      }
    }
  }
  KOTCMAPTransfer.call(this);
};

//var KOTCMAPINITALIZATION = Scene_Map.prototype.createAllWindows;
//Scene_Map.prototype.createAllWindows = function () {
//    KOTCMAPINITALIZATION.call(this);
//    if (typeof KoTCMapDisabled == 'undefined') {
//        //  console.log("Map Enabled")
//
//        KoTCMinimapEnable();
//    };
//};

var KOTCMAPDISABLE2 = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function () {
  if (typeof KoTCMapDisabled == "undefined") {
    SceneManager._scene.removeChild($KoTCMinimapSystem.MainMinimapSprite);
    KoTCMinimapDisable();
  }
  KOTCMAPDISABLE2.call(this);
};

var KOTCMAPDISABLE = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function () {
  KOTCMAPDISABLE.call(this);
  if (typeof KoTCMapDisabled == "undefined") {
    //console.log("Storing current map with all layers, the name is ", $dataMapInfos[$gameMap._mapId].name)
    if ($KoTCMinimapSystem.MapBookEnabled !== false) {
      $KoTCMapImageCache[$gameMap._mapId].ImageDataStorage[
        $KoTCMinimapSystem.CurrentMapIndex
      ] = CreateMapBookPictureImageData();
    }
    SceneManager._scene.removeChild($KoTCMinimapSystem.MainMinimapSprite);
    KoTCMinimapDisable();
  }
};

if (Utils.RPGMAKER_NAME == "MZ") {
  var KOTCNAMESTART = Scene_Name.prototype.initialize;
  Scene_Name.prototype.initialize = function () {
    if (typeof KoTCMapDisabled == "undefined") {
      SceneManager._scene.removeChild($KoTCMinimapSystem.MainMinimapSprite);
      KoTCMinimapDisable();
    }
    KOTCNAMESTART.call(this);
  };

  var KOTCBATTLESTART = Scene_Map.prototype.stop;
  Scene_Map.prototype.stop = function () {
    KOTCBATTLESTART.call(this);
    Scene_Message.prototype.stop.call(this);
    $gamePlayer.straighten();
    this._mapNameWindow.close();
    if (SceneManager.isNextScene(Scene_Battle)) {
      SceneManager._scene.removeChild($KoTCMinimapSystem.MainMinimapSprite);
    }
  };
}
(function () {
  function setup() {
    function MVNodeFS() {}

    MVNodeFS.fs = require("fs");

    IsOldVersionn = window.location.pathname != "/index.html";

    MVNodeFS.writeFile = function (filePath, filename, data) {
      filePath = this.createPath(filePath);
      this.fs.writeFileSync(filePath + filename, data);
    };

    MVNodeFS.checkFile = function (filePath, filename) {
      filePath = this.createPath(filePath);
      if (this.fs.existsSync(filePath + filename)) {
        return !0;
      } else {
        return !1;
      }
    };

    MVNodeFS.append = function (filePath, filename, data) {
      if (MVNodeFS.checkFile(filePath, filename)) {
        filePath = this.createPath(filePath);
        return this.fs.appendFile(filePath + filename, data);
      } else {
        console.log(
          "File does not exist! Tried to append " +
            filePath +
            "/" +
            filename +
            "/"
        );
      }
    };

    MVNodeFS.readFile = function (filePath, filename) {
      if (MVNodeFS.checkFile(filePath, filename)) {
        filePath = this.createPath(filePath);
        return this.fs.readFileSync(filePath + filename, "utf8");
      } else {
        console.log(
          "File does not exist! Tried to read " +
            filePath +
            "/" +
            filename +
            "/"
        );
      }
    };

    MVNodeFS.erase = function (filePath, filename) {
      if (MVNodeFS.checkFile(filePath, filename)) {
        filePath = this.createPath(filePath);
        return this.fs.unlink(filePath + filename);
      } else {
        console.log(
          "File does not exist! Tried to erase " +
            filePath +
            "/" +
            filename +
            "/"
        );
      }
    };

    MVNodeFS.rename = function (filePath, filename, newName) {
      if (MVNodeFS.checkFile(filePath, filename)) {
        filePath = this.createPath(filePath);
        return this.fs.rename(filePath + filename, filePath + newName);
      } else {
        console.log(
          "File does not exist! Tried to rename " +
            filePath +
            "/" +
            filename +
            "/"
        );
      }
    };

    MVNodeFS.createPath = function (relativePath) {
      if (IsOldVersionn && (relativePath = "/" + relativePath)) {
        relativePath += relativePath === "" ? "./" : "/";
      }
      !(Utils.isNwjs() && Utils.isOptionValid("test")) &&
        (relativePath = "www/" + relativePath);
      var path = window.location.pathname.replace(
        /(\/www|)\/[^\/]*$/,
        relativePath
      );
      if (path.match(/^\/([A-Z]\:)/)) {
        path = path.slice(1);
      }
      path = decodeURIComponent(path);
      return path;
    };

    window.MVNodeFS = MVNodeFS;
  }

  setup();
})();

function KoTCGetImageFromPicture(
  picture,
  picturefoldername,
  gridindex,
  xlocation,
  ylocation,
  gridwidth,
  gridheight,
  indexoftileset
) {
  switch (picturefoldername) {
    case "characters":
      var targetimagebitmap = ImageManager.loadCharacter(picture);
      var x = 0;
      var y = 0;
      var gridxamount = 4;
      var gridyamount = 2;
      var gridwidth = Math.round(targetimagebitmap.width / gridxamount);
      var gridheight = Math.round(targetimagebitmap.height / gridyamount);
      var gridtargetx = (gridindex % gridxamount) * gridwidth + gridwidth / 3;
      var gridtargety = Math.floor(gridindex / gridxamount) * gridheight;
      var gridwidth = Math.round(gridwidth / 3);
      var gridheight = Math.round(gridheight / 4);
      break;

    case "pictures":
      var targetimagebitmap = ImageManager.loadPicture(picture);
      var gridxamount = 1;
      var gridyamount = 1;
      var x = 0;
      var y = 0;

      break;

    case "system":
      var targetimagebitmap = ImageManager.loadSystem(picture);
      var x = 0;
      var y = 0;

      break;

    case "tilesets":
      var targetimagebitmap = ImageManager.loadTileset(picture);
      var x = 0;
      var y = 0;

    default:
  }
  switch (picture) {
    case "iconset":
      var gridwidth = 32;
      var gridheight = 32;

      break;

    default:
  }
  if (indexoftileset !== undefined) {
    switch (indexoftileset) {
      case 0:
        switch (gridindex) {
          case 0:
            var gridtargetx = 0;
            var gridtargety = 0;
            var gridwidth = 288;
            var gridheight = 144;
            break;
          case 1:
            var gridtargetx = 0;
            var gridtargety = 144;
            var gridwidth = 288;
            var gridheight = 144;
            break;
          case 4:
            var gridtargetx = 386;
            var gridtargety = 0;
            var gridwidth = 288;
            var gridheight = 144;
            break;
          case 6:
            var gridtargetx = 386;
            var gridtargety = 144;
            var gridwidth = 288;
            var gridheight = 144;
            break;
          case 8:
            var gridtargetx = 0;
            var gridtargety = 288;
            var gridwidth = 288;
            var gridheight = 144;
            break;
          case 10:
            var gridtargetx = 384;
            var gridtargety = 288;
            var gridwidth = 288;
            var gridheight = 144;
            break;
          case 12:
            var gridtargetx = 0;
            var gridtargety = 432;
            var gridwidth = 288;
            var gridheight = 144;

            break;
          case 14:
            var gridtargetx = 386;
            var gridtargety = 432;
            var gridwidth = 288;
            var gridheight = 144;

            break;

          case 2:
            var gridtargetx = 288;
            var gridtargety = 0;
            var gridwidth = 96;
            var gridheight = 144;
            break;
          case 3:
            var gridtargetx = 288;
            var gridtargety = 144;
            var gridwidth = 96;
            var gridheight = 144;
            break;
          case 5:
            var gridtargetx = 674;
            var gridtargety = 0;
            var gridwidth = 96;
            var gridheight = 144;
            break;
          case 7:
            var gridtargetx = 674;
            var gridtargety = 144;
            var gridwidth = 96;
            var gridheight = 144;
            break;
          case 9:
            var gridtargetx = 288;
            var gridtargety = 288;
            var gridwidth = 96;
            var gridheight = 144;
            break;
          case 11:
            var gridtargetx = 674;
            var gridtargety = 288;
            var gridwidth = 96;
            var gridheight = 144;

            break;
          case 13:
            var gridtargetx = 674;
            var gridtargety = 432;
            var gridwidth = 96;
            var gridheight = 144;

            break;
          case 15:
            var gridtargetx = 672;
            var gridtargety = 432;
            var gridwidth = 96;
            var gridheight = 144;

            break;

          default:
        }

        break;

      case 1:
        var gridxamount = 8;
        var gridyamount = 4;
        var gridwidth = 96;
        var gridheight = 144;
        var gridtargetx = (gridindex % gridxamount) * gridwidth;
        var gridtargety = Math.floor(gridindex / gridxamount) * gridheight;

        break;

      case 2:
        var gridxamount = 8;
        var gridyamount = 4;
        var gridwidth = 96;
        var gridheight = 96;
        var gridtargetx = (gridindex % gridxamount) * gridwidth;
        var gridtargety = Math.floor(gridindex / gridxamount) * gridheight;

        break;

      case 3:
        var gridxamount = 8;
        var gridyamount = 6;
        switch (gridindex) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 16:
          case 17:
          case 18:
          case 19:
          case 20:
          case 21:
          case 22:
          case 23:
          case 32:
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 38:
          case 39:
            var gridwidth = 96;
            var gridheight = 144;

            break;

          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
          case 15:
          case 24:
          case 25:
          case 26:
          case 27:
          case 28:
          case 29:
          case 30:
          case 31:
          case 40:
          case 41:
          case 42:
          case 43:
          case 44:
          case 45:
          case 46:
          case 47:
            var gridwidth = 96;
            var gridheight = 96;
            break;

          default:
        }
        var gridtargetx = (gridindex % gridxamount) * gridwidth;
        var gridtargety = Math.floor(gridindex / gridxamount) * gridheight;

        break;

      case 4:
        var gridxamount = 8;
        var gridyamount = 16;
        var gridwidth = 48;
        var gridheight = 48;
        var gridtargetx = (gridindex % gridxamount) * gridwidth;
        var gridtargety = Math.floor(gridindex / gridxamount) * gridheight;

        break;

      case 5:
        var gridxamount = 8;
        var gridyamount = 32;
        switch (true) {
          case gridindex < 128:
            var gridwidth = 48;
            var gridheight = 48;
            var gridtargetx = (gridindex % gridxamount) * gridwidth;
            var gridtargety = Math.floor(gridindex / gridxamount) * gridheight;

            break;

          case gridindex > 127:
            var gridwidth = 48;
            var gridheight = 48;
            var gridtargetx = (gridindex % gridxamount) * gridwidth + 384;
            var gridtargety =
              Math.floor(gridindex / gridxamount) * gridheight - 768;
            // console.log("X:"+gridtargetx,"Y:"+gridtargety)
            break;

          default:
        }

        break;

      case 6:
        var gridxamount = 8;
        var gridyamount = 32;
        switch (true) {
          case gridindex < 384:
            var gridwidth = 48;
            var gridheight = 48;
            var gridtargetx = (gridindex % gridxamount) * gridwidth;
            var gridtargety = Math.floor(gridindex / gridxamount) * gridheight;

            break;

          case gridindex > 383:
            var gridwidth = 48;
            var gridheight = 48;
            var gridtargetx = (gridindex % gridxamount) * gridwidth + 384;
            var gridtargety =
              Math.floor(gridindex / gridxamount) * gridheight - 768;
            break;

          default:
        }

        break;

      case 7:
        var gridxamount = 8;
        var gridyamount = 32;
        switch (true) {
          case gridindex < 640:
            var gridwidth = 48;
            var gridheight = 48;
            var gridtargetx = (gridindex % gridxamount) * gridwidth;
            var gridtargety = Math.floor(gridindex / gridxamount) * gridheight;

            break;

          case gridindex > 639:
            var gridwidth = 48;
            var gridheight = 48;
            var gridtargetx = (gridindex % gridxamount) * gridwidth + 384;
            var gridtargety =
              Math.floor(gridindex / gridxamount) * gridheight - 768;
            break;

          default:
        }

        break;

      case 8:
        var gridxamount = 8;
        var gridyamount = 32;
        switch (true) {
          case gridindex < 896:
            var gridwidth = 48;
            var gridheight = 48;
            var gridtargetx = (gridindex % gridxamount) * gridwidth;
            var gridtargety = Math.floor(gridindex / gridxamount) * gridheight;

            break;

          case gridindex > 895:
            var gridwidth = 48;
            var gridheight = 48;
            var gridtargetx = (gridindex % gridxamount) * gridwidth + 384;
            var gridtargety =
              Math.floor(gridindex / gridxamount) * gridheight - 768;
            break;

          default:
        }

        break;

      default:
    }
  }
  var CanvasToPaintOn = new Bitmap(gridwidth + 1, gridheight + 1);
  CanvasToPaintOn.blt(
    targetimagebitmap,
    gridtargetx,
    gridtargety,
    gridwidth,
    gridheight,
    1,
    1
  );
  var endresultsprite = new Sprite(CanvasToPaintOn);
  if (endresultsprite.width <= 1) {
    endresultsprite = new Sprite(CanvasToPaintOn);
  }
  endresultsprite.x = xlocation;
  endresultsprite.y = ylocation;
  endresultsprite.anchor.x = 0.5;
  endresultsprite.anchor.y = 0.5;
  return endresultsprite;
}

function GetAverageBitmapColor(bitmaptarget, spacebetweenpixelscans) {
  var rgbstorage = {
    r: 0,
    g: 0,
    b: 0,
  };
  var count = 0;
  var width = bitmaptarget.width;
  var height = bitmaptarget.height;
  var x = 0;
  for (; x < width; x += spacebetweenpixelscans) {
    var y = 0;
    for (; y < height; y += spacebetweenpixelscans) {
      // console.log(bitmaptarget.getAlphaPixel(x, y))
      if (bitmaptarget.getAlphaPixel(x, y) !== 0) {
        var hexcode = bitmaptarget.getPixel(x, y);
        var color = hexToRgb(hexcode);
        rgbstorage.r += color.r;
        rgbstorage.g += color.g;
        rgbstorage.b += color.b;
        count++;
      }
    }
  }
  rgbstorage.r = Math.floor(rgbstorage.r / count);
  rgbstorage.g = Math.floor(rgbstorage.g / count);
  rgbstorage.b = Math.floor(rgbstorage.b / count);
  return rgbstorage;
}

function ConvertRGBStorageToColor(rgbstorage) {
  var target =
    "rgba(" +
    rgbstorage[0] +
    ", " +
    rgbstorage[1] +
    ", " +
    rgbstorage[2] +
    ", 1)";
  return target;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function KoTCDrawCircle(size, color) {
  var bitmaptodrawon = new Bitmap(size, size);
  bitmaptodrawon.drawCircle(
    Math.round(bitmaptodrawon.width / 2),
    Math.round(bitmaptodrawon.height / 2),
    Math.round(bitmaptodrawon.width / 2),
    color
  );
  var spritetoexport = new Sprite(bitmaptodrawon);
  spritetoexport.anchor.x = 0.5;
  spritetoexport.anchor.y = 0.5;
  return spritetoexport;
}

function KoTCDrawSquare(size, color) {
  var bitmaptodrawon = new Bitmap(size, size);
  bitmaptodrawon.fillRect(
    Math.round(bitmaptodrawon.width / 2),
    Math.round(bitmaptodrawon.height / 2),
    Math.round(bitmaptodrawon.width / 2),
    Math.round(bitmaptodrawon.height / 2),
    color
  );
  var spritetoexport = new Sprite(bitmaptodrawon);
  spritetoexport.anchor.x = 0.5;
  spritetoexport.anchor.y = 0.5;
  return spritetoexport;
}

function LineOfSightBetweenPoints(x0, y0, x1, y1) {
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;
  var array = [];
  while (true) {
    array.push([x0, y0]);

    if (x0 === x1 && y0 === y1) {
      break;
    }
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return array;
}

function MoveSpriteSmoothly(sprite, x, y, traveltimeseconds) {
  var sx = sprite.x;
  var sy = sprite.y;
  var travelpath = LineOfSightBetweenPoints(sx, sy, x, y);
  var travelpathlength = travelpath.length;
  var partialtraveltime = (traveltimeseconds * 1000) / travelpathlength;
  var t = 0;
  for (; t < travelpathlength; t++) {
    (function (t) {
      setTimeout(() => {
        sprite.x = travelpath[t][0];
        sprite.y = travelpath[t][1];
      }, partialtraveltime * t);
    })(t);
  }
}

function KoTCPopSprite(event, sprite, popperimage, size, speed) {
  if (typeof popperimage !== "undefined") {
    var popimage = ImageManager.loadPicture(popperimage);
    popimage.addLoadListener(function () {
      var popsprite = new Sprite(popimage);
      popsprite.x = sprite.x;
      popsprite.y = sprite.y;
      popsprite.scale.x = sprite.x;
      popsprite.scale.y = sprite.y;
      SceneManager._scene.addChild(popsprite);
      sprite.destroy();
    });
    ResizeSpriteSmoothly(popsprite, size, speed);
    SetSpriteTransparencySmoothly(popsprite, 0, speed);
    setTimeout(() => {
      if (typeof sprite !== "undefined") {
        popsprite.destroy();
        popsprite = undefined;
      }
    }, speed);
  } else {
    ResizeSpriteSmoothly(sprite, size, speed);
    SetSpriteTransparencySmoothly(sprite, 0, speed);
    setTimeout(() => {
      if (typeof sprite !== "undefined") {
        sprite.destroy();
        sprite = undefined;
      }
    }, speed);
  }
}

function ResizeSpriteSmoothly(sprite, targetscale, milliseconds) {
  var partialtransformtime = milliseconds / milliseconds;
  // console.log(partialtransformtime)
  var timeelapsed = 0;
  for (; milliseconds > 0; milliseconds--) {
    (function (milliseconds, timeelapsed) {
      setTimeout(() => {
        sprite.scale.x =
          (sprite.scale.x * (milliseconds - 1) + targetscale) / milliseconds;
        sprite.scale.y =
          (sprite.scale.y * (milliseconds - 1) + targetscale) / milliseconds;
      }, partialtransformtime * timeelapsed);
    })(milliseconds, timeelapsed);
    timeelapsed++;
  }
}

function SetSpriteTransparencySmoothly(sprite, targetalpha, milliseconds) {
  var partialtransformtime = milliseconds / milliseconds;
  // console.log(partialtransformtime)
  var timeelapsed = 0;
  for (; milliseconds > 0; milliseconds--) {
    (function (milliseconds, timeelapsed) {
      setTimeout(() => {
        sprite.alpha =
          (sprite.alpha * (milliseconds - 1) + targetalpha) / milliseconds;
      }, partialtransformtime * timeelapsed);
    })(milliseconds, timeelapsed);
    timeelapsed++;
  }
}

function ConvertColorNameToHex(name) {
  name = name.toLowerCase();
  var namearray = [
    "indianred",
    "crimson",
    "lightpink",
    "lightpink1",
    "lightpink2",
    "lightpink3",
    "lightpink4",
    "pink",
    "pink1",
    "pink2",
    "pink3",
    "pink4",
    "palevioletred",
    "palevioletred1",
    "palevioletred2",
    "palevioletred3",
    "palevioletred4",
    "lavenderblush",
    "lavenderblush2",
    "lavenderblush3",
    "lavenderblush4",
    "violetred1",
    "violetred2",
    "violetred3",
    "violetred4",
    "hotpink",
    "hotpink1",
    "hotpink2",
    "hotpink3",
    "hotpink4",
    "raspberry",
    "deeppink",
    "deeppink2",
    "deeppink3",
    "deeppink4",
    "maroon1",
    "maroon2",
    "maroon3",
    "mediumvioletred",
    "violetred",
    "orchid",
    "orchid1",
    "orchid2",
    "orchid3",
    "orchid4",
    "thistle",
    "thistle1",
    "thistle2",
    "thistle3",
    "thistle4",
    "plum1",
    "plum2",
    "plum3",
    "plum4",
    "plum",
    "violet",
    "magenta",
    "magenta2",
    "magenta3",
    "darkmagenta",
    "purple",
    "mediumorchid",
    "mediumorchid1",
    "mediumorchid2",
    "mediumorchid3",
    "mediumorchid4",
    "darkviolet",
    "darkorchid",
    "darkorchid1",
    "darkorchid2",
    "darkorchid3",
    "darkorchid4",
    "indigo",
    "blueviolet",
    "purple1",
    "purple2",
    "purple3",
    "purple4",
    "mediumpurple",
    "mediumpurple1",
    "mediumpurple2",
    "mediumpurple3",
    "mediumpurple4",
    "darkslateblue",
    "lightslateblue",
    "mediumslateblue",
    "slateblue",
    "slateblue1",
    "slateblue2",
    "slateblue3",
    "slateblue4",
    "ghostwhite",
    "lavender",
    "blue",
    "blue2",
    "mediumblue",
    "darkblue",
    "navy",
    "midnightblue",
    "cobalt",
    "royalblue",
    "royalblue1",
    "royalblue2",
    "royalblue3",
    "royalblue4",
    "cornflowerblue",
    "lightsteelblue",
    "lightsteelblue1",
    "lightsteelblue2",
    "lightsteelblue3",
    "lightsteelblue4",
    "lightslategray",
    "slategray",
    "slategray1",
    "slategray2",
    "slategray3",
    "slategray4",
    "dodgerblue",
    "dodgerblue2",
    "dodgerblue3",
    "dodgerblue4",
    "aliceblue",
    "steelblue",
    "steelblue1",
    "steelblue2",
    "steelblue3",
    "steelblue4",
    "lightskyblue",
    "lightskyblue1",
    "lightskyblue2",
    "lightskyblue3",
    "lightskyblue4",
    "skyblue1",
    "skyblue2",
    "skyblue3",
    "skyblue4",
    "skyblue",
    "deepskyblue",
    "deepskyblue2",
    "deepskyblue3",
    "deepskyblue4",
    "peacock",
    "lightblue",
    "lightblue1",
    "lightblue2",
    "lightblue3",
    "lightblue4",
    "powderblue",
    "cadetblue1",
    "cadetblue2",
    "cadetblue3",
    "cadetblue4",
    "turquoise1",
    "turquoise2",
    "turquoise3",
    "turquoise4",
    "cadetblue",
    "darkturquoise",
    "azure",
    "azure2",
    "azure3",
    "azure4",
    "lightcyan",
    "lightcyan2",
    "lightcyan3",
    "lightcyan4",
    "paleturquoise1",
    "paleturquoise",
    "paleturquoise3",
    "paleturquoise4",
    "darkslategray",
    "darkslategray1",
    "darkslategray2",
    "darkslategray3",
    "darkslategray4",
    "cyan",
    "cyan2",
    "cyan3",
    "darkcyan",
    "teal",
    "mediumturquoise",
    "lightseagreen",
    "manganeseblue",
    "turquoise",
    "coldgrey",
    "turquoiseblue",
    "aquamarine",
    "aquamarine2",
    "mediumaquamarine",
    "aquamarine4",
    "mediumspringgreen",
    "mintcream",
    "springgreen",
    "springgreen1",
    "springgreen2",
    "springgreen3",
    "mediumseagreen",
    "seagreen1",
    "seagreen2",
    "seagreen3",
    "seagreen",
    "emeraldgreen",
    "mint",
    "cobaltgreen",
    "honeydew",
    "honeydew2",
    "honeydew3",
    "honeydew4",
    "darkseagreen",
    "darkseagreen1",
    "darkseagreen2",
    "darkseagreen3",
    "darkseagreen4",
    "palegreen",
    "palegreen1",
    "lightgreen",
    "palegreen3",
    "palegreen4",
    "limegreen",
    "forestgreen",
    "lime",
    "green2",
    "green3",
    "green4",
    "green",
    "darkgreen",
    "sapgreen",
    "lawngreen",
    "chartreuse",
    "chartreuse2",
    "chartreuse3",
    "chartreuse4",
    "greenyellow",
    "darkolivegreen1",
    "darkolivegreen2",
    "darkolivegreen3",
    "darkolivegreen4",
    "darkolivegreen",
    "olivedrab",
    "olivedrab1",
    "olivedrab2",
    "yellowgreen",
    "olivedrab4",
    "ivory",
    "ivory2",
    "ivory3",
    "ivory4",
    "beige",
    "lightyellow",
    "lightyellow2",
    "lightyellow3",
    "lightyellow4",
    "lightgoldenrodyellow",
    "yellow",
    "yellow2",
    "yellow3",
    "yellow4",
    "warmgrey",
    "olive",
    "darkkhaki",
    "khaki1",
    "khaki2",
    "khaki3",
    "khaki4",
    "khaki",
    "palegoldenrod",
    "lemonchiffon",
    "lemonchiffon2",
    "lemonchiffon3",
    "lemonchiffon4",
    "lightgoldenrod1",
    "lightgoldenrod2",
    "lightgoldenrod3",
    "lightgoldenrod4",
    "banana",
    "gold",
    "gold2",
    "gold3",
    "gold4",
    "cornsilk",
    "cornsilk2",
    "cornsilk3",
    "cornsilk4",
    "goldenrod",
    "goldenrod1",
    "goldenrod2",
    "goldenrod3",
    "goldenrod4",
    "darkgoldenrod",
    "darkgoldenrod1",
    "darkgoldenrod2",
    "darkgoldenrod3",
    "darkgoldenrod4",
    "orange",
    "orange2",
    "orange3",
    "orange4",
    "floralwhite",
    "oldlace",
    "wheat",
    "wheat1",
    "wheat2",
    "wheat3",
    "wheat4",
    "moccasin",
    "papayawhip",
    "blanchedalmond",
    "navajowhite",
    "navajowhite2",
    "navajowhite3",
    "navajowhite4",
    "eggshell",
    "tan",
    "brick",
    "cadmiumyellow",
    "antiquewhite",
    "antiquewhite1",
    "antiquewhite2",
    "antiquewhite3",
    "antiquewhite4",
    "burlywood",
    "burlywood1",
    "burlywood2",
    "burlywood3",
    "burlywood4",
    "bisque",
    "bisque2",
    "bisque3",
    "bisque4",
    "melon",
    "carrot",
    "darkorange",
    "darkorange1",
    "darkorange2",
    "darkorange3",
    "darkorange4",
    "orange",
    "tan1",
    "tan2",
    "peru",
    "tan4",
    "linen",
    "peachpuff",
    "peachpuff2",
    "peachpuff3",
    "peachpuff4",
    "seashell",
    "seashell2",
    "seashell3",
    "seashell4",
    "sandybrown",
    "rawsienna",
    "chocolate",
    "chocolate1",
    "chocolate2",
    "chocolate3",
    "saddlebrown",
    "ivoryblack",
    "flesh",
    "cadmiumorange",
    "burntsienna",
    "sienna",
    "sienna1",
    "sienna2",
    "sienna3",
    "sienna4",
    "lightsalmon",
    "lightsalmon2",
    "lightsalmon3",
    "lightsalmon4",
    "coral",
    "orangered",
    "orangered2",
    "orangered3",
    "orangered4",
    "sepia",
    "darksalmon",
    "salmon1",
    "salmon2",
    "salmon3",
    "salmon4",
    "coral1",
    "coral2",
    "coral3",
    "coral4",
    "burntumber",
    "tomato",
    "tomato2",
    "tomato3",
    "tomato4",
    "salmon",
    "mistyrose",
    "mistyrose2",
    "mistyrose3",
    "mistyrose4",
    "snow",
    "snow2",
    "snow3",
    "snow4",
    "rosybrown",
    "rosybrown1",
    "rosybrown2",
    "rosybrown3",
    "rosybrown4",
    "lightcoral",
    "indianred",
    "indianred1",
    "indianred2",
    "indianred4",
    "indianred3",
    "brown",
    "brown1",
    "brown2",
    "brown3",
    "brown4",
    "firebrick",
    "firebrick1",
    "firebrick2",
    "firebrick3",
    "firebrick4",
    "red",
    "red2",
    "red3",
    "darkred",
    "maroon",
    "sgibeet",
    "sgislateblue",
    "sgilightblue",
    "sgiteal",
    "sgichartreuse",
    "sgiolivedrab",
    "sgibrightgray",
    "sgisalmon",
    "sgidarkgray",
    "sgigray12",
    "sgigray16",
    "sgigray32",
    "sgigray36",
    "sgigray52",
    "sgigray56",
    "sgilightgray",
    "sgigray72",
    "sgigray76",
    "sgigray92",
    "sgigray96",
    "white",
    "whitesmoke96",
    "gainsboro",
    "lightgrey",
    "silver",
    "darkgray",
    "gray",
    "dimgray",
    "black",
    "gray99",
    "gray98",
    "gray97",
    "whitesmoke",
    "gray95",
    "gray94",
    "gray93",
    "gray92",
    "gray91",
    "gray90",
    "gray89",
    "gray88",
    "gray87",
    "gray86",
    "gray85",
    "gray84",
    "gray83",
    "gray82",
    "gray81",
    "gray80",
    "gray79",
    "gray78",
    "gray77",
    "gray76",
    "gray75",
    "gray74",
    "gray73",
    "gray72",
    "gray71",
    "gray70",
    "gray69",
    "gray68",
    "gray67",
    "gray66",
    "gray65",
    "gray64",
    "gray63",
    "gray62",
    "gray61",
    "gray60",
    "gray59",
    "gray58",
    "gray57",
    "gray56",
    "gray55",
    "gray54",
    "gray53",
    "gray52",
    "gray51",
    "gray50",
    "gray49",
    "gray48",
    "gray47",
    "gray46",
    "gray45",
    "gray44",
    "gray43",
    "gray42",
    "dimgray",
    "gray40",
    "gray39",
    "gray38",
    "gray37",
    "gray36",
    "gray35",
    "gray34",
    "gray33",
    "gray32",
    "gray31",
    "gray30",
    "gray29",
    "gray28",
    "gray27",
    "gray26",
    "gray25",
    "gray24",
    "gray23",
    "gray22",
    "gray21",
    "gray20",
    "gray19",
    "gray18",
    "gray17",
    "gray16",
    "gray15",
    "gray14",
    "gray13",
    "gray12",
    "gray11",
    "gray10",
    "gray9",
    "gray8",
    "gray7",
    "gray6",
    "gray5",
    "gray4",
    "gray3",
    "gray2",
    "gray1",
  ];
  var hexarray = [
    "#B0171F",
    "#DC143C",
    "#FFB6C1",
    "#FFAEB9",
    "#EEA2AD",
    "#CD8C95",
    "#8B5F65",
    "#FFC0CB",
    "#FFB5C5",
    "#EEA9B8",
    "#CD919E",
    "#8B636C",
    "#DB7093",
    "#FF82AB",
    "#EE799F",
    "#CD6889",
    "#8B475D",
    "#FFF0F5",
    "#EEE0E5",
    "#CDC1C5",
    "#8B8386",
    "#FF3E96",
    "#EE3A8C",
    "#CD3278",
    "#8B2252",
    "#FF69B4",
    "#FF6EB4",
    "#EE6AA7",
    "#CD6090",
    "#8B3A62",
    "#872657",
    "#FF1493",
    "#EE1289",
    "#CD1076",
    "#8B0A50",
    "#FF34B3",
    "#EE30A7",
    "#CD2990",
    "#C71585",
    "#D02090",
    "#DA70D6",
    "#FF83FA",
    "#EE7AE9",
    "#CD69C9",
    "#8B4789",
    "#D8BFD8",
    "#FFE1FF",
    "#EED2EE",
    "#CDB5CD",
    "#8B7B8B",
    "#FFBBFF",
    "#EEAEEE",
    "#CD96CD",
    "#8B668B",
    "#DDA0DD",
    "#EE82EE",
    "#FF00FF",
    "#EE00EE",
    "#CD00CD",
    "#8B008B",
    "#800080",
    "#BA55D3",
    "#E066FF",
    "#D15FEE",
    "#B452CD",
    "#7A378B",
    "#9400D3",
    "#9932CC",
    "#BF3EFF",
    "#B23AEE",
    "#9A32CD",
    "#68228B",
    "#4B0082",
    "#8A2BE2",
    "#9B30FF",
    "#912CEE",
    "#7D26CD",
    "#551A8B",
    "#9370DB",
    "#AB82FF",
    "#9F79EE",
    "#8968CD",
    "#5D478B",
    "#483D8B",
    "#8470FF",
    "#7B68EE",
    "#6A5ACD",
    "#836FFF",
    "#7A67EE",
    "#6959CD",
    "#473C8B",
    "#F8F8FF",
    "#E6E6FA",
    "#0000FF",
    "#0000EE",
    "#0000CD",
    "#00008B",
    "#000080",
    "#191970",
    "#3D59AB",
    "#4169E1",
    "#4876FF",
    "#436EEE",
    "#3A5FCD",
    "#27408B",
    "#6495ED",
    "#B0C4DE",
    "#CAE1FF",
    "#BCD2EE",
    "#A2B5CD",
    "#6E7B8B",
    "#778899",
    "#708090",
    "#C6E2FF",
    "#B9D3EE",
    "#9FB6CD",
    "#6C7B8B",
    "#1E90FF",
    "#1C86EE",
    "#1874CD",
    "#104E8B",
    "#F0F8FF",
    "#4682B4",
    "#63B8FF",
    "#5CACEE",
    "#4F94CD",
    "#36648B",
    "#87CEFA",
    "#B0E2FF",
    "#A4D3EE",
    "#8DB6CD",
    "#607B8B",
    "#87CEFF",
    "#7EC0EE",
    "#6CA6CD",
    "#4A708B",
    "#87CEEB",
    "#00BFFF",
    "#00B2EE",
    "#009ACD",
    "#00688B",
    "#33A1C9",
    "#ADD8E6",
    "#BFEFFF",
    "#B2DFEE",
    "#9AC0CD",
    "#68838B",
    "#B0E0E6",
    "#98F5FF",
    "#8EE5EE",
    "#7AC5CD",
    "#53868B",
    "#00F5FF",
    "#00E5EE",
    "#00C5CD",
    "#00868B",
    "#5F9EA0",
    "#00CED1",
    "#F0FFFF",
    "#E0EEEE",
    "#C1CDCD",
    "#838B8B",
    "#E0FFFF",
    "#D1EEEE",
    "#B4CDCD",
    "#7A8B8B",
    "#BBFFFF",
    "#AEEEEE",
    "#96CDCD",
    "#668B8B",
    "#2F4F4F",
    "#97FFFF",
    "#8DEEEE",
    "#79CDCD",
    "#528B8B",
    "#00FFFF",
    "#00EEEE",
    "#00CDCD",
    "#008B8B",
    "#008080",
    "#48D1CC",
    "#20B2AA",
    "#03A89E",
    "#40E0D0",
    "#808A87",
    "#00C78C",
    "#7FFFD4",
    "#76EEC6",
    "#66CDAA",
    "#458B74",
    "#00FA9A",
    "#F5FFFA",
    "#00FF7F",
    "#00EE76",
    "#00CD66",
    "#008B45",
    "#3CB371",
    "#54FF9F",
    "#4EEE94",
    "#43CD80",
    "#2E8B57",
    "#00C957",
    "#BDFCC9",
    "#3D9140",
    "#F0FFF0",
    "#E0EEE0",
    "#C1CDC1",
    "#838B83",
    "#8FBC8F",
    "#C1FFC1",
    "#B4EEB4",
    "#9BCD9B",
    "#698B69",
    "#98FB98",
    "#9AFF9A",
    "#90EE90",
    "#7CCD7C",
    "#548B54",
    "#32CD32",
    "#228B22",
    "#00FF00",
    "#00EE00",
    "#00CD00",
    "#008B00",
    "#008000",
    "#006400",
    "#308014",
    "#7CFC00",
    "#7FFF00",
    "#76EE00",
    "#66CD00",
    "#458B00",
    "#ADFF2F",
    "#CAFF70",
    "#BCEE68",
    "#A2CD5A",
    "#6E8B3D",
    "#556B2F",
    "#6B8E23",
    "#C0FF3E",
    "#B3EE3A",
    "#9ACD32",
    "#698B22",
    "#FFFFF0",
    "#EEEEE0",
    "#CDCDC1",
    "#8B8B83",
    "#F5F5DC",
    "#FFFFE0",
    "#EEEED1",
    "#CDCDB4",
    "#8B8B7A",
    "#FAFAD2",
    "#FFFF00",
    "#EEEE00",
    "#CDCD00",
    "#8B8B00",
    "#808069",
    "#808000",
    "#BDB76B",
    "#FFF68F",
    "#EEE685",
    "#CDC673",
    "#8B864E",
    "#F0E68C",
    "#EEE8AA",
    "#FFFACD",
    "#EEE9BF",
    "#CDC9A5",
    "#8B8970",
    "#FFEC8B",
    "#EEDC82",
    "#CDBE70",
    "#8B814C",
    "#E3CF57",
    "#FFD700",
    "#EEC900",
    "#CDAD00",
    "#8B7500",
    "#FFF8DC",
    "#EEE8CD",
    "#CDC8B1",
    "#8B8878",
    "#DAA520",
    "#FFC125",
    "#EEB422",
    "#CD9B1D",
    "#8B6914",
    "#B8860B",
    "#FFB90F",
    "#EEAD0E",
    "#CD950C",
    "#8B6508",
    "#FFA500",
    "#EE9A00",
    "#CD8500",
    "#8B5A00",
    "#FFFAF0",
    "#FDF5E6",
    "#F5DEB3",
    "#FFE7BA",
    "#EED8AE",
    "#CDBA96",
    "#8B7E66",
    "#FFE4B5",
    "#FFEFD5",
    "#FFEBCD",
    "#FFDEAD",
    "#EECFA1",
    "#CDB38B",
    "#8B795E",
    "#FCE6C9",
    "#D2B48C",
    "#9C661F",
    "#FF9912",
    "#FAEBD7",
    "#FFEFDB",
    "#EEDFCC",
    "#CDC0B0",
    "#8B8378",
    "#DEB887",
    "#FFD39B",
    "#EEC591",
    "#CDAA7D",
    "#8B7355",
    "#FFE4C4",
    "#EED5B7",
    "#CDB79E",
    "#8B7D6B",
    "#E3A869",
    "#ED9121",
    "#FF8C00",
    "#FF7F00",
    "#EE7600",
    "#CD6600",
    "#8B4500",
    "#FF8000",
    "#FFA54F",
    "#EE9A49",
    "#CD853F",
    "#8B5A2B",
    "#FAF0E6",
    "#FFDAB9",
    "#EECBAD",
    "#CDAF95",
    "#8B7765",
    "#FFF5EE",
    "#EEE5DE",
    "#CDC5BF",
    "#8B8682",
    "#F4A460",
    "#C76114",
    "#D2691E",
    "#FF7F24",
    "#EE7621",
    "#CD661D",
    "#8B4513",
    "#292421",
    "#FF7D40",
    "#FF6103",
    "#8A360F",
    "#A0522D",
    "#FF8247",
    "#EE7942",
    "#CD6839",
    "#8B4726",
    "#FFA07A",
    "#EE9572",
    "#CD8162",
    "#8B5742",
    "#FF7F50",
    "#FF4500",
    "#EE4000",
    "#CD3700",
    "#8B2500",
    "#5E2612",
    "#E9967A",
    "#FF8C69",
    "#EE8262",
    "#CD7054",
    "#8B4C39",
    "#FF7256",
    "#EE6A50",
    "#CD5B45",
    "#8B3E2F",
    "#8A3324",
    "#FF6347",
    "#EE5C42",
    "#CD4F39",
    "#8B3626",
    "#FA8072",
    "#FFE4E1",
    "#EED5D2",
    "#CDB7B5",
    "#8B7D7B",
    "#FFFAFA",
    "#EEE9E9",
    "#CDC9C9",
    "#8B8989",
    "#BC8F8F",
    "#FFC1C1",
    "#EEB4B4",
    "#CD9B9B",
    "#8B6969",
    "#F08080",
    "#CD5C5C",
    "#FF6A6A",
    "#EE6363",
    "#8B3A3A",
    "#CD5555",
    "#A52A2A",
    "#FF4040",
    "#EE3B3B",
    "#CD3333",
    "#8B2323",
    "#B22222",
    "#FF3030",
    "#EE2C2C",
    "#CD2626",
    "#8B1A1A",
    "#FF0000",
    "#EE0000",
    "#CD0000",
    "#8B0000",
    "#800000",
    "#8E388E",
    "#7171C6",
    "#7D9EC0",
    "#388E8E",
    "#71C671",
    "#8E8E38",
    "#C5C1AA",
    "#C67171",
    "#555555",
    "#1E1E1E",
    "#282828",
    "#515151",
    "#5B5B5B",
    "#848484",
    "#8E8E8E",
    "#AAAAAA",
    "#B7B7B7",
    "#C1C1C1",
    "#EAEAEA",
    "#F4F4F4",
    "#FFFFFF",
    "#F5F5F5",
    "#DCDCDC",
    "#D3D3D3",
    "#C0C0C0",
    "#A9A9A9",
    "#808080",
    "#696969",
    "#000000",
    "#FCFCFC",
    "#FAFAFA",
    "#F7F7F7",
    "#F5F5F5",
    "#F2F2F2",
    "#F0F0F0",
    "#EDEDED",
    "#EBEBEB",
    "#E8E8E8",
    "#E5E5E5",
    "#E3E3E3",
    "#E0E0E0",
    "#DEDEDE",
    "#DBDBDB",
    "#D9D9D9",
    "#D6D6D6",
    "#D4D4D4",
    "#D1D1D1",
    "#CFCFCF",
    "#CCCCCC",
    "#C9C9C9",
    "#C7C7C7",
    "#C4C4C4",
    "#C2C2C2",
    "#BFBFBF",
    "#BDBDBD",
    "#BABABA",
    "#B8B8B8",
    "#B5B5B5",
    "#B3B3B3",
    "#B0B0B0",
    "#ADADAD",
    "#ABABAB",
    "#A8A8A8",
    "#A6A6A6",
    "#A3A3A3",
    "#A1A1A1",
    "#9E9E9E",
    "#9C9C9C",
    "#999999",
    "#969696",
    "#949494",
    "#919191",
    "#8F8F8F",
    "#8C8C8C",
    "#8A8A8A",
    "#878787",
    "#858585",
    "#828282",
    "#7F7F7F",
    "#7D7D7D",
    "#7A7A7A",
    "#787878",
    "#757575",
    "#737373",
    "#707070",
    "#6E6E6E",
    "#6B6B6B",
    "#696969",
    "#666666",
    "#636363",
    "#616161",
    "#5E5E5E",
    "#5C5C5C",
    "#595959",
    "#575757",
    "#545454",
    "#525252",
    "#4F4F4F",
    "#4D4D4D",
    "#4A4A4A",
    "#474747",
    "#454545",
    "#424242",
    "#404040",
    "#3D3D3D",
    "#3B3B3B",
    "#383838",
    "#363636",
    "#333333",
    "#303030",
    "#2E2E2E",
    "#2B2B2B",
    "#292929",
    "#262626",
    "#242424",
    "#212121",
    "#1F1F1F",
    "#1C1C1C",
    "#1A1A1A",
    "#171717",
    "#141414",
    "#121212",
    "#0F0F0F",
    "#0D0D0D",
    "#0A0A0A",
    "#080808",
    "#050505",
    "#030303",
  ];
  return hexarray[namearray.indexOf(name)];
}

OrangeKoTCHybrid = {};

OrangeKoTCHybrid.imageType = function () {
  return "image/png";
};

OrangeKoTCHybrid.imageRegex = function () {
  return /^data:image\/png;base64,/;
};

OrangeKoTCHybrid.fileExtension = function () {
  return ".png";
};

OrangeKoTCHybrid.imageQuality = function () {
  return 1;
};

OrangeKoTCHybrid.baseFileName = function () {
  var mapName = $gameMap._mapId.padZero(3);
  mapName = "Map" + mapName;
  return mapName;
};

OrangeKoTCHybrid.getMapshot = function () {
  var lowerBitmap;
  var upperBitmap;

  lowerBitmap = new Bitmap(
    $dataMap.width * $gameMap.tileWidth(),
    $dataMap.height * $gameMap.tileHeight()
  );
  upperBitmap = new Bitmap(
    $dataMap.width * $gameMap.tileWidth(),
    $dataMap.height * $gameMap.tileHeight()
  );
  SceneManager._scene._spriteset._tilemap._paintEverything(
    lowerBitmap,
    upperBitmap
  );

  var bitmap = new Bitmap(
    $dataMap.width * $gameMap.tileWidth(),
    $dataMap.height * $gameMap.tileHeight()
  );
  bitmap.blt(
    lowerBitmap,
    0,
    0,
    lowerBitmap.width,
    lowerBitmap.height,
    0,
    0,
    lowerBitmap.width,
    lowerBitmap.height
  );
  bitmap.blt(
    upperBitmap,
    0,
    0,
    upperBitmap.width,
    upperBitmap.height,
    0,
    0,
    upperBitmap.width,
    upperBitmap.height
  );
  return bitmap;
};

function MapShotTileMap() {}

MapShotTileMap.prototype = Object.create(Tilemap.prototype);
MapShotTileMap.prototype.constructor = MapShotTileMap;

MapShotTileMap.prototype._drawAutotile = function (bitmap, tileId, dx, dy) {
  var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
  var kind = Tilemap.getAutotileKind(tileId);
  var shape = Tilemap.getAutotileShape(tileId);
  var tx = kind % 8;
  var ty = Math.floor(kind / 8);
  var bx = 0;
  var by = 0;
  var setNumber = 0;
  var isTable = false;

  if (Tilemap.isTileA1(tileId)) {
    var waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
    setNumber = 0;
    if (kind === 0) {
      bx = waterSurfaceIndex * 2;
      by = 0;
    } else if (kind === 1) {
      bx = waterSurfaceIndex * 2;
      by = 3;
    } else if (kind === 2) {
      bx = 6;
      by = 0;
    } else if (kind === 3) {
      bx = 6;
      by = 3;
    } else {
      bx = Math.floor(tx / 4) * 8;
      by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;
      if (kind % 2 === 0) {
        bx += waterSurfaceIndex * 2;
      } else {
        bx += 6;
        autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
        by += this.animationFrame % 3;
      }
    }
  } else if (Tilemap.isTileA2(tileId)) {
    setNumber = 1;
    bx = tx * 2;
    by = (ty - 2) * 3;
    isTable = this._isTableTile(tileId);
  } else if (Tilemap.isTileA3(tileId)) {
    setNumber = 2;
    bx = tx * 2;
    by = (ty - 6) * 2;
    autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
  } else if (Tilemap.isTileA4(tileId)) {
    setNumber = 3;
    bx = tx * 2;
    by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
    if (ty % 2 === 1) {
      autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
    }
  }

  var table = autotileTable[shape];
  if (Utils.RPGMAKER_NAME !== "MZ") {
    var source = this.bitmaps[setNumber];
  } else {
    var source = this._bitmaps[setNumber];
  }

  if (table && source) {
    var w1 = this._tileWidth / 2;
    var h1 = this._tileHeight / 2;
    for (var i = 0; i < 4; i++) {
      var qsx = table[i][0];
      var qsy = table[i][1];
      var sx1 = (bx * 2 + qsx) * w1;
      var sy1 = (by * 2 + qsy) * h1;
      var dx1 = dx + (i % 2) * w1;
      var dy1 = dy + Math.floor(i / 2) * h1;
      if (isTable && (qsy === 1 || qsy === 5)) {
        var qsx2 = qsx;
        var qsy2 = 3;
        if (qsy === 1) {
          qsx2 = [0, 3, 2, 1][qsx];
        }
        var sx2 = (bx * 2 + qsx2) * w1;
        var sy2 = (by * 2 + qsy2) * h1;
        bitmap.blt(source, sx2, sy2, w1, h1, dx1, dy1, w1, h1);
        dy1 += h1 / 2;
        bitmap.blt(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
      } else {
        bitmap.blt(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
      }
    }
  }
};

MapShotTileMap.prototype._drawNormalTile = function (bitmap, tileId, dx, dy) {
  var setNumber = 0;

  if (Tilemap.isTileA5(tileId)) {
    setNumber = 4;
  } else {
    setNumber = 5 + Math.floor(tileId / 256);
  }

  var w = this._tileWidth;
  var h = this._tileHeight;
  var sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * w;
  var sy = (Math.floor((tileId % 256) / 8) % 16) * h;

  if (Utils.RPGMAKER_NAME !== "MZ") {
    var source = this.bitmaps[setNumber];
  } else {
    var source = this._bitmaps[setNumber];
  }
  if (source) {
    bitmap.blt(source, sx, sy, w, h, dx, dy, w, h);
  }
};

MapShotTileMap.prototype._drawTableEdge = function (bitmap, tileId, dx, dy) {
  if (Tilemap.isTileA2(tileId)) {
    var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    var kind = Tilemap.getAutotileKind(tileId);
    var shape = Tilemap.getAutotileShape(tileId);
    var tx = kind % 8;
    var ty = Math.floor(kind / 8);
    var setNumber = 1;
    var bx = tx * 2;
    var by = (ty - 2) * 3;
    var table = autotileTable[shape];

    if (table) {
      if (Utils.RPGMAKER_NAME !== "MZ") {
        var source = this.bitmaps[setNumber];
      } else {
        var source = this._bitmaps[setNumber];
      }
      var w1 = this._tileWidth / 2;
      var h1 = this._tileHeight / 2;
      for (var i = 0; i < 2; i++) {
        var qsx = table[2 + i][0];
        var qsy = table[2 + i][1];
        var sx1 = (bx * 2 + qsx) * w1;
        var sy1 = (by * 2 + qsy) * h1 + h1 / 2;
        var dx1 = dx + (i % 2) * w1;
        var dy1 = dy + Math.floor(i / 2) * h1;
        bitmap.blt(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
      }
    }
  }
};

Tilemap.prototype._drawTileOldStyle = function (bitmap, tileId, dx, dy) {
  if (Tilemap.isVisibleTile(tileId)) {
    if (Tilemap.isAutotile(tileId)) {
      MapShotTileMap.prototype._drawAutotile.call(this, bitmap, tileId, dx, dy);
    } else {
      MapShotTileMap.prototype._drawNormalTile.call(
        this,
        bitmap,
        tileId,
        dx,
        dy
      );
    }
  }
};

Tilemap.prototype._paintEverything = function (lowerBitmap, upperBitmap) {
  var tileCols = $dataMap.width;
  var tileRows = $dataMap.height;

  for (var y = 0; y < tileRows; y++) {
    for (var x = 0; x < tileCols; x++) {
      this._paintTilesOnBitmap(lowerBitmap, upperBitmap, x, y);
    }
  }
};

Tilemap.prototype._paintLayered = function (
  groundBitmap,
  ground2Bitmap,
  lowerBitmap,
  upperLayer,
  shadowBitmap,
  lowerEvents,
  normalEvents,
  upperEvents
) {
  var tileCols = $dataMap.width;
  var tileRows = $dataMap.height;

  for (var y = 0; y < tileRows; y++) {
    for (var x = 0; x < tileCols; x++) {
      this._paintTileOnLayers(
        groundBitmap,
        ground2Bitmap,
        lowerBitmap,
        upperLayer,
        shadowBitmap,
        x,
        y
      );
    }
  }

  this._paintCharacters(lowerEvents, 0);
  this._paintCharacters(normalEvents, 1);
  this._paintCharacters(upperEvents, 2);
};

Tilemap.prototype._paintCharacters = function (bitmap, priority) {
  this.children.forEach(function (child) {
    if (child instanceof Sprite_Character) {
      if (child._character !== null) {
        if (
          child._character instanceof Game_Player ||
          child._character instanceof Game_Follower ||
          child._character instanceof Game_Vehicle
        )
          return;
      }

      child.update();

      if (child._characterName === "" && child._tileId === 0) return;
      if (priority !== undefined && child._character._priorityType !== priority)
        return;

      var x =
        child.x -
        child._frame.width / 2 +
        $gameMap._displayX * $gameMap.tileWidth();
      var y =
        child.y -
        child._frame.height +
        $gameMap._displayY * $gameMap.tileHeight();

      bitmap.blt(
        child.bitmap,
        child._frame.x,
        child._frame.y,
        child._frame.width,
        child._frame.height,
        x,
        y,
        child._frame.width,
        child._frame.height
      );
    }
  });
};

Tilemap.prototype._paintTileOnLayers = function (
  groundBitmap,
  ground2Bitmap,
  lowerBitmap,
  upperBitmap,
  shadowBitmap,
  x,
  y
) {
  var tableEdgeVirtualId = 10000;
  var mx = x;
  var my = y;
  var dx = mx * this._tileWidth;
  var dy = my * this._tileHeight;
  var lx = dx / this._tileWidth;
  var ly = dy / this._tileHeight;
  var tileId0 = this._readMapData(mx, my, 0);
  var tileId1 = this._readMapData(mx, my, 1);
  var tileId2 = this._readMapData(mx, my, 2);
  var tileId3 = this._readMapData(mx, my, 3);
  var upperTileId1 = this._readMapData(mx, my - 1, 1);

  if (groundBitmap !== undefined) {
    groundBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
  }

  if (ground2Bitmap !== undefined) {
    ground2Bitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
  }

  if (lowerBitmap !== undefined) {
    lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
  }

  if (upperBitmap !== undefined) {
    upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
  }

  if (shadowBitmap !== undefined) {
    shadowBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
  }

  var me = this;

  function drawTiles(bitmap, tileId, shadowBits, upperTileId1) {
    if (tileId < 0) {
    } else if (tileId >= tableEdgeVirtualId) {
      MapShotTileMap.prototype._drawTableEdge.call(
        me,
        bitmap,
        upperTileId1,
        dx,
        dy
      );
    } else {
      me._drawTileOldStyle(bitmap, tileId, dx, dy);
    }
  }

  if (groundBitmap !== undefined) {
    drawTiles(groundBitmap, tileId0, undefined, upperTileId1);
  }

  if (ground2Bitmap !== undefined) {
    drawTiles(ground2Bitmap, tileId1, undefined, upperTileId1);
  }

  if (lowerBitmap !== undefined) {
    drawTiles(lowerBitmap, tileId2, undefined, upperTileId1);
  }

  if (upperBitmap !== undefined) {
    drawTiles(upperBitmap, tileId3, shadowBits, upperTileId1);
  }
};

Tilemap.prototype._paintTilesOnBitmap = function (
  lowerBitmap,
  upperBitmap,
  x,
  y
) {
  var tableEdgeVirtualId = 10000;
  var mx = x;
  var my = y;
  var dx = mx * this._tileWidth;
  var dy = my * this._tileHeight;
  var lx = dx / this._tileWidth;
  var ly = dy / this._tileHeight;
  var tileId0 = this._readMapData(mx, my, 0);
  var tileId1 = this._readMapData(mx, my, 1);
  var tileId2 = this._readMapData(mx, my, 2);
  var tileId3 = this._readMapData(mx, my, 3);
  var upperTileId1 = this._readMapData(mx, my - 1, 1);
  var lowerTiles = [];
  var upperTiles = [];

  if (this._isHigherTile(tileId0)) {
    upperTiles.push(tileId0);
  } else {
    lowerTiles.push(tileId0);
  }
  if (this._isHigherTile(tileId1)) {
    upperTiles.push(tileId1);
  } else {
    lowerTiles.push(tileId1);
  }

  if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
    if (!Tilemap.isShadowingTile(tileId0)) {
      lowerTiles.push(tableEdgeVirtualId + upperTileId1);
    }
  }

  if (this._isOverpassPosition(mx, my)) {
    upperTiles.push(tileId2);
    upperTiles.push(tileId3);
  } else {
    if (this._isHigherTile(tileId2)) {
      upperTiles.push(tileId2);
    } else {
      lowerTiles.push(tileId2);
    }
    if (this._isHigherTile(tileId3)) {
      upperTiles.push(tileId3);
    } else {
      lowerTiles.push(tileId3);
    }
  }

  lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
  upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);

  for (var i = 0; i < lowerTiles.length; i++) {
    var lowerTileId = lowerTiles[i];
    if (lowerTileId < 0) {
    } else if (lowerTileId >= tableEdgeVirtualId) {
      MapShotTileMap.prototype._drawTableEdge.call(
        this,
        lowerBitmap,
        upperTileId1,
        dx,
        dy
      );
    } else {
      this._drawTileOldStyle(lowerBitmap, lowerTileId, dx, dy);
    }
  }

  for (var j = 0; j < upperTiles.length; j++) {
    this._drawTileOldStyle(upperBitmap, upperTiles[j], dx, dy);
  }
};

function ShrinkBitmap(bitmap, divideby) {
  var width = bitmap.width;
  var height = bitmap.height;
  var newwidth = Math.round(bitmap.width / divideby);
  var newheight = Math.round(bitmap.height / divideby);
  var newbitmap = new Bitmap(newwidth, newheight);
  var w = 0;
  for (; w < newwidth; w++) {
    var h = 0;
    for (; h < newheight; h++) {
      var targetpixel = bitmap.getPixel(
        Math.round(w * divideby),
        Math.round(h * divideby)
      );
      newbitmap.fillRect(w, h, 1, 1, targetpixel);
    }
  }

  return newbitmap;
}

function ShrinkBitmapToMapSize(bitmap) {
  var bigCanvas = bitmap.canvas;
  var bigContext = bigCanvas.getContext("2d");
  var smallcanvas = new Bitmap(
    $KoTCMinimapSystem.CurrentMinimapSize,
    $KoTCMinimapSystem.CurrentMinimapSize
  ).canvas;
  var smallContext = smallcanvas.getContext("2d");
  smallContext.scale(
    $KoTCMinimapSystem.CurrentMinimapSize / bitmap.width,
    $KoTCMinimapSystem.CurrentMinimapSize / bitmap.height
  );
  smallContext.drawImage(bigCanvas, 0, 0);
  var smallImageData = smallContext.getImageData(
    0,
    0,
    bigCanvas.width,
    bigCanvas.height
  );
  var newbitmap = new Bitmap(
    $KoTCMinimapSystem.CurrentMinimapSize,
    $KoTCMinimapSystem.CurrentMinimapSize
  );
  newbitmap.context.putImageData(smallImageData, 0, 0);

  return newbitmap;
}

function CreateMapBookPicture(nofog) {
  var newbitmap = new Bitmap(
    $KoTCMinimapSystem.CurrentMinimapSize,
    $KoTCMinimapSystem.CurrentMinimapSize
  );
  if ($KoTCMinimapSystem.KoTCDrawParallax !== false) {
    var parabitmap = ShrinkBitmapToMapSize(
      $KoTCMinimapSystem.ParallaxSprite.bitmap
    );
    newbitmap.blt(parabitmap, 0, 0, parabitmap.width, parabitmap.height, 0, 0);
  }
  switch ($KoTCMinimapSystem.MinimapMode) {
    case 0:
      var bitmap1 = $KoTCMinimapSystem.MapWallSprite.bitmap;
      newbitmap.blt(bitmap1, 0, 0, bitmap1.width, bitmap1.height, 0, 0);

      break;

    case 1:
      var bitmap1 = $KoTCMinimapSystem.MapWallSprite.bitmap;
      newbitmap.blt(bitmap1, 0, 0, bitmap1.width, bitmap1.height, 0, 0);

      break;

    case 2:
      var bitmap1 = $KoTCMinimapSystem.KoTCMinimapPictureSprite.bitmap;
      newbitmap.blt(bitmap1, 0, 0, bitmap1.width, bitmap1.height, 0, 0);

      break;
    default:
  }
  if (
    $KoTCMinimapSystem.ExplorationMapMode !== false &&
    typeof nofog == "undefined"
  ) {
    var fogofwarbitmap = $KoTCMinimapSystem.FogOfWarSprite.bitmap;
    newbitmap.blt(
      fogofwarbitmap,
      0,
      0,
      fogofwarbitmap.width,
      fogofwarbitmap.height,
      0,
      0
    );
  }
  if ($KoTCMinimapSystem.UseDefaultBorder !== true) {
    var borderbitmap = $KoTCMinimapSystem.MapBorderSprite.bitmap;
    newbitmap.blt(
      borderbitmap,
      0,
      0,
      borderbitmap.width,
      borderbitmap.height,
      0,
      0
    );
  }
  return newbitmap;
}

function CreateMapBookPictureImageData(nofog) {
  var newbitmap = new Bitmap(
    $KoTCMinimapSystem.CurrentMinimapSize,
    $KoTCMinimapSystem.CurrentMinimapSize
  );
  if (
    $KoTCMinimapSystem.ParallaxSprite !== undefined &&
    $KoTCMinimapSystem.KoTCDrawParallax !== false &&
    $gameMap.parallaxName() !== ""
  ) {
    var parabitmap = ShrinkBitmapToMapSize(
      $KoTCMinimapSystem.ParallaxSprite.bitmap
    );
    newbitmap.blt(parabitmap, 0, 0, parabitmap.width, parabitmap.height, 0, 0);
  }
  switch ($KoTCMinimapSystem.MinimapMode) {
    case 0:
      var bitmap1 = $KoTCMinimapSystem.MapWallSprite.bitmap;
      newbitmap.blt(bitmap1, 0, 0, bitmap1.width, bitmap1.height, 0, 0);

      break;

    case 1:
      var bitmap1 = $KoTCMinimapSystem.MapWallSprite.bitmap;
      newbitmap.blt(bitmap1, 0, 0, bitmap1.width, bitmap1.height, 0, 0);

      break;

    case 2:
      var bitmap1 = $KoTCMinimapSystem.KoTCMinimapPictureSprite.bitmap;
      newbitmap.blt(bitmap1, 0, 0, bitmap1.width, bitmap1.height, 0, 0);

      break;
    default:
  }
  var b = 0;
  var bookregcode = new RegExp(/<KoTC MapBook Event>/i);
  var spritearraylength =
    $KoTCMinimapSystem.ArrayofMinimapPictureSprites.length;
  for (; b < spritearraylength; b++) {
    if (
      $KoTCMinimapSystem.ArrayofMinimapPictureSprites[b] &&
      $gameMap.events()[b] !== null &&
      bookregcode.exec($gameMap.events()[b].event().note) !== null
    ) {
      //console.log("Drawing Map Book Event")
      var spritebitmap;
      var sprite;
      spritebitmap = $KoTCMinimapSystem.ArrayofMinimapPictureSprites[b].bitmap;
      sprite = $KoTCMinimapSystem.ArrayofMinimapPictureSprites[b];
      var width = spritebitmap.width * sprite.scale.x;
      var height = spritebitmap.height * sprite.scale.y;
      var xtodraw = sprite.x - sprite.width / 2.5;
      var ytodraw = sprite.y - sprite.height / 2.5;
      newbitmap.blt(
        spritebitmap,
        0,
        0,
        spritebitmap.width,
        spritebitmap.height,
        xtodraw,
        ytodraw,
        width,
        height
      );
    }
  }
  if (
    $KoTCMinimapSystem.ExplorationMapMode !== false &&
    typeof nofog == "undefined"
  ) {
    var fogofwarbitmap = $KoTCMinimapSystem.FogOfWarSprite.bitmap;
    newbitmap.blt(
      fogofwarbitmap,
      0,
      0,
      fogofwarbitmap.width,
      fogofwarbitmap.height,
      0,
      0
    );
  }

  return newbitmap.context.getImageData(
    0,
    0,
    $KoTCMinimapSystem.CurrentMinimapSize,
    $KoTCMinimapSystem.CurrentMinimapSize
  );
}

function KoTCExportMapImages() {
  if (Utils.RPGMAKER_NAME == "MZ") {
    MVNodeFS.writeFile(
      "data/",
      "MapImageData" + $gameSystem.savefileId() + ".json",
      JSON.stringify($KoTCMapImageCache)
    );
  } else {
    MVNodeFS.writeFile(
      "data/",
      "MapImageData" + DataManager.lastAccessedSavefileId() + ".json",
      JSON.stringify($KoTCMapImageCache)
    );
  }
}

function KoTCImportMapImages() {
  if (Utils.RPGMAKER_NAME == "MZ") {
    var savefileId = $gameSystem.savefileId();
  } else {
    var savefileId = DataManager.lastAccessedSavefileId();
  }
  if (MVNodeFS.checkFile("data/", "MapImageData" + savefileId + ".json")) {
    $KoTCMapImageCache = JSON.parse(
      MVNodeFS.readFile("data/", "MapImageData" + savefileId + ".json")
    );

    var a = 1;
    var length1 = $KoTCMapImageCache.length;
    for (; a < length1; a++) {
      var b = 0;
      if (
        $KoTCMapImageCache[a] !== null &&
        $KoTCMapImageCache[a] !== undefined
      ) {
        var length2 = $KoTCMapImageCache[a].MapFullImageStorage.length;
        if (
          $KoTCMapImageCache[a].MapFullImageStorage[b] !== undefined &&
          $KoTCMapImageCache[a].MapFullImageStorage[b] !== null
        ) {
          for (; b < length2; b++) {
            var datatemp1 = Object.values(
              $KoTCMapImageCache[a].MapFullImageStorage[b].data
            );
            var datatemp2 = Object.values(
              $KoTCMapImageCache[a].ImageDataStorage[b].data
            );
            $KoTCMapImageCache[a].MapFullImageStorage[b] = new ImageData(
              new Uint8ClampedArray(datatemp1),
              $KoTCMinimapSystem.CurrentMinimapSize,
              $KoTCMinimapSystem.CurrentMinimapSize
            );
            $KoTCMapImageCache[a].ImageDataStorage[b] = new ImageData(
              new Uint8ClampedArray(datatemp2),
              $KoTCMinimapSystem.CurrentMinimapSize,
              $KoTCMinimapSystem.CurrentMinimapSize
            );
          }
        }
      }
    }
  }
}

var oldsavegame = Scene_Save.prototype.onSaveSuccess;
Scene_Save.prototype.onSaveSuccess = function () {
  oldsavegame.call(this);
  if ($KoTCMinimapSystem.MapBookEnabled !== false) {
    KoTCExportMapImages();
  }
};

var oldloadgame = Scene_Load.prototype.onLoadSuccess;
Scene_Load.prototype.onLoadSuccess = function () {
  oldloadgame.call(this);
  if ($KoTCMinimapSystem.MapBookEnabled !== false) {
    KoTCImportMapImages();
  }
};

function KoTCBuildExplorableArea(mapindex) {
  if ($dataMap) {
    var width = $dataMap.width - 1;
    var height = $dataMap.height - 1;
    var a = 0;
    for (; a < width; a++) {
      var b = 0;
      for (; b < height; b++) {
        if ($gameMap.checkPassage(a, b, 0x0f) !== false) {
          $KoTCMapImageCache[$gameMap._mapId].AmountToExplore[mapindex] += 1;
        }
      }
    }
  }
}
function KoTCCountExploredArea(mapindex) {
  if ($dataMap) {
    var width = $dataMap.width - 1;
    var height = $dataMap.height - 1;
    var amount = 0;
    var a = 0;
    for (; a < width; a++) {
      var b = 0;
      for (; b < height; b++) {
        if ($gameMap.checkPassage(a, b, 0x0f) !== false) {
          if (
            $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][b][
              a
            ] == 1 ||
            $gameSystem.MapExplorationData[$KoTCMinimapSystem.CurrentMap][b][
              a
            ] == 2
          ) {
            amount += 1;
          }
        }
      }
    }
    $KoTCMapImageCache[$gameMap._mapId].AmountExplored[mapindex] = amount;
  }
}

kotcAddMapToBook = function (mapid) {
  if (!$KoTCMapImageCache[0]) {
    clearKoTCMapBook();
  }
  $KoTCMapImageCache[0][mapid] = 1;
};

kotcRemoveMapFromBook = function (mapid) {
  if ($KoTCMapImageCache[0]) {
    $KoTCMapImageCache[0][mapid] = undefined;
  }
};

clearKoTCMapBook = function () {
  $KoTCMapImageCache[0][0] = {};
};

isInKoTCMapBook = function (currentmap) {
  //console.log(currentmap)
  if ($KoTCMapImageCache[0] && currentmap) {
    return $KoTCMapImageCache[0][currentmap.IDStorage[0]];
  } else {
    return false;
  }
};

function Scene_KoTCMapBook() {
  this.initialize.apply(this, arguments);
}

Scene_KoTCMapBook.prototype = Object.create(Scene_MenuBase.prototype);
Scene_KoTCMapBook.prototype.constructor = Scene_KoTCMapBook;

Scene_KoTCMapBook.prototype.initialize = function () {
  KoTCCountExploredArea($KoTCMinimapSystem.CurrentMapIndex);
  SceneManager._scene.removeChild($KoTCMinimapSystem.MainMinimapSprite);
  KoTCMinimapDisable();
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_KoTCMapBook.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);
  if (Utils.RPGMAKER_NAME == "MZ") {
    this._indexWindow = new Window_KoTCMapIDIndex(new Rectangle(0, 0, 0, 0));
  } else {
    this._indexWindow = new Window_KoTCMapIDIndex(0, 0);
  }
  this._indexWindow.setHandler("cancel", this.popScene.bind(this));
  var wy = this._indexWindow.height;
  var ww = Graphics.boxWidth;
  var wh = Graphics.boxHeight - wy;
  if (Utils.RPGMAKER_NAME == "MZ") {
    this._statusWindow = new Window_KoTCMapBook(new Rectangle(0, wy, ww, wh));
  } else {
    this._statusWindow = new Window_KoTCMapBook(0, wy, ww, wh);
  }
  this.addWindow(this._indexWindow);
  this.addWindow(this._statusWindow);
  this._indexWindow.setStatusWindow(this._statusWindow);
};

if (Utils.RPGMAKER_NAME == "MZ") {
  function Window_KoTCMapIDIndex() {
    this.initialize(...arguments);
  }

  Window_KoTCMapIDIndex.prototype = Object.create(Window_Selectable.prototype);
  Window_KoTCMapIDIndex.prototype.constructor = Window_KoTCMapIDIndex;

  Window_KoTCMapIDIndex.lastTopRow = 0;
  Window_KoTCMapIDIndex.lastIndex = 0;

  Window_KoTCMapIDIndex.prototype.initialize = function (rect) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(6);
    Window_Selectable.prototype.initialize.call(
      this,
      new Rectangle(rect.x, rect.y, width, height)
    );
    this.refresh();
    this.setTopRow(Window_KoTCMapIDIndex.lastTopRow);
    this.select(Window_KoTCMapIDIndex.lastIndex);
    this.activate();
  };
} else {
  function Window_KoTCMapIDIndex() {
    this.initialize.apply(this, arguments);
  }

  Window_KoTCMapIDIndex.prototype = Object.create(Window_Selectable.prototype);
  Window_KoTCMapIDIndex.prototype.constructor = Window_KoTCMapIDIndex;

  Window_KoTCMapIDIndex.lastTopRow = 0;
  Window_KoTCMapIDIndex.lastIndex = 0;

  Window_KoTCMapIDIndex.prototype.initialize = function (x, y) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(6);
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.setTopRow(Window_KoTCMapIDIndex.lastTopRow);
    this.select(Window_KoTCMapIDIndex.lastIndex);
    this.activate();
  };
}

Window_KoTCMapIDIndex.prototype.maxCols = function () {
  return 3;
};

Window_KoTCMapIDIndex.prototype.maxItems = function () {
  return this._list ? this._list.length : 0;
};

Window_KoTCMapIDIndex.prototype.setStatusWindow = function (statusWindow) {
  this._statusWindow = statusWindow;
  this.updateStatus();
};

Window_KoTCMapIDIndex.prototype.update = function () {
  Window_Selectable.prototype.update.call(this);
  this.updateStatus();
};

Window_KoTCMapIDIndex.prototype.updateStatus = function () {
  if (this._statusWindow && currentmap !== this._list[this.index()]) {
    var currentmap = this._list[this.index()];
    this._statusWindow.setKoTCMap(currentmap);
  }
};

Window_KoTCMapIDIndex.prototype.refresh = function () {
  this._list = [];
  var i = 1;
  var length = $KoTCMapImageCache.length;
  for (; i < length; i++) {
    var currentmap = $KoTCMapImageCache[i];
    if (
      currentmap !== undefined &&
      currentmap !== null &&
      $KoTCMapImageCache[0][currentmap.IDStorage[0]] !== undefined
    ) {
      this._list.push(currentmap);
      var u = 1;
      for (; u < currentmap.DataStorage.length; u++) {
        var submap = {
          IsSubMap: 1,
          SelfIndex: [u],
          IDStorage: [currentmap.IDStorage[0]],
          NameStorage: [currentmap.NameStorage[u]],
        };
        this._list.push(submap);
      }
    }
  }
  this.createContents();
  this.drawAllItems();
};

Window_KoTCMapIDIndex.prototype.drawItem = function (index) {
  var currentmap = this._list[index];
  if (Utils.RPGMAKER_NAME == "MZ") {
    var rect = this.itemRectWithPadding(index);
  } else {
    var rect = this.itemRectForText(index);
  }
  var name;
  name = currentmap.NameStorage[0];
  this.drawText(name, rect.x, rect.y, rect.width);
};

Window_KoTCMapIDIndex.prototype.processCancel = function () {
  Window_Selectable.prototype.processCancel.call(this);
  Window_KoTCMapIDIndex.lastTopRow = this.topRow();
  Window_KoTCMapIDIndex.lastIndex = this.index();
};

function Window_KoTCMapBook() {
  this.initialize.apply(this, arguments);
}

Window_KoTCMapBook.prototype = Object.create(Window_Base.prototype);
Window_KoTCMapBook.prototype.constructor = Window_KoTCMapBook;

if (Utils.RPGMAKER_NAME == "MZ") {
  function Window_KoTCMapBook() {
    this.initialize(...arguments);
  }

  Window_KoTCMapBook.prototype = Object.create(Window_Base.prototype);
  Window_KoTCMapBook.prototype.constructor = Window_KoTCMapBook;
  Window_KoTCMapBook.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._time = 0;
    this._KoTCCurrentMapChosen = null;
    this._kotcMapSprite = new Sprite();
    this._kotcMapSprite.anchor.x = 0.5;
    this._kotcMapSprite.anchor.y = 0.5;
    this._kotcMapSprite.x = rect.width / 1.22 - 20;
    this._kotcMapSprite.y = rect.height / 2;
    this.addChildToBack(this._kotcMapSprite);
    var borderwidth =
      $KoTCMinimapSystem.CurrentMinimapSize +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 4;
    var borderheight =
      $KoTCMinimapSystem.CurrentMinimapSize +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 4;
    var borderx =
      rect.width / 1.22 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    var bordery =
      rect.height / 2 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    this._mapwindowsprite = new KoTCMinimapWindow(
      new Rectangle(borderx, bordery, borderwidth, borderheight)
    );
    this.addChildToBack(this._mapwindowsprite);

    this.refresh();
  };
} else {
  function Window_KoTCMapBook() {
    this.initialize.apply(this, arguments);
  }

  Window_KoTCMapBook.prototype = Object.create(Window_Base.prototype);
  Window_KoTCMapBook.prototype.constructor = Window_KoTCMapBook;

  Window_KoTCMapBook.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._KoTCCurrentMapChosen = null;
    this._kotcMapSprite = new Sprite();
    this._kotcMapSprite.anchor.x = 0.5;
    this._kotcMapSprite.anchor.y = 0.5;
    this._kotcMapSprite.x = width / 1.22 - 20;
    this._kotcMapSprite.y = height / 2;
    this.addChildToBack(this._kotcMapSprite);
    var borderwidth =
      $KoTCMinimapSystem.CurrentMinimapSize +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 4;
    var borderheight =
      $KoTCMinimapSystem.CurrentMinimapSize +
      $KoTCMinimapSystem.CurrentMinimapBorderThickness * 4;
    var borderx =
      width / 1.22 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    var bordery = height / 2 - $KoTCMinimapSystem.CurrentMinimapBorderThickness;
    this._mapwindowsprite = new KoTCMinimapWindow(
      borderx,
      bordery,
      borderwidth,
      borderheight
    );
    this.addChildToBack(this._mapwindowsprite);

    this.refresh();
  };
}

Window_KoTCMapBook.prototype.update = function () {
  Window_Base.prototype.update.call(this);
  if (this._kotcMapSprite.bitmap) {
    var bitmapHeight = this._kotcMapSprite.bitmap.height;
    var contentsHeight = this.contents.height;
    var scale = contentsHeight / bitmapHeight;
    this._kotcMapSprite.scale.x = scale;
    this._kotcMapSprite.scale.y = scale;
    this._mapwindowsprite.scale.x = scale + 0.06;
    this._mapwindowsprite.scale.y = scale + 0.06;
    this._mapwindowsprite.x =
      this._kotcMapSprite.x -
      (this._mapwindowsprite.width / 2) * this._mapwindowsprite.scale.x;
    this._mapwindowsprite.y =
      this._kotcMapSprite.y -
      (this._mapwindowsprite.height / 2) * this._mapwindowsprite.scale.y;
  }
};

Window_KoTCMapBook.prototype.setKoTCMap = function (currentmap) {
  if (this._KoTCCurrentMapChosen !== currentmap) {
    this._KoTCCurrentMapChosen = currentmap;
    this.refresh();
  }
};

Window_KoTCMapBook.prototype.refresh = function () {
  var currentmap = this._KoTCCurrentMapChosen;
  if (currentmap !== null) {
    var currentmapid = currentmap.IDStorage[0];
    var currentmapindex = currentmap.SelfIndex[0];
    var x = 0;
    var y = 0;
    var lineHeight = this.lineHeight();
    //console.log("Currentmap", currentmap)

    this.contents.clear();

    if (!currentmap || isInKoTCMapBook(currentmap) == undefined) {
      //console.log("Destroyed")
      this._kotcMapSprite.bitmap = null;
      return;
    }

    var name = currentmap.NameStorage[currentmapindex];
    var bitmap;
    var bitmap = new Bitmap(
      $KoTCMinimapSystem.CurrentMinimapSize,
      $KoTCMinimapSystem.CurrentMinimapSize
    );
    if ($KoTCMinimapSystem.ExplorationMapMode !== true) {
      bitmap.context.putImageData(
        $KoTCMapImageCache[currentmapid].MapFullImageStorage[currentmapindex],
        0,
        0
      );
    } else {
      bitmap.context.putImageData(
        $KoTCMapImageCache[currentmapid].ImageDataStorage[currentmapindex],
        0,
        0
      );
    }
    this._kotcMapSprite.bitmap = bitmap;

    this.resetTextColor();
    this.drawText(currentmap.NameStorage[0], x, y);

    if (Utils.RPGMAKER_NAME == "MZ") {
      x = this.itemPadding();
      y = lineHeight + this.itemPadding();
    } else {
      x = this.textPadding();
      y = lineHeight + this.textPadding();
    }

    for (var i = 0; i < 1; i++) {
      // i was 8
      var tempamountexplored =
        $KoTCMapImageCache[currentmapid].AmountExplored[currentmapindex];
      var tempamounttoexplore =
        $KoTCMapImageCache[currentmapid].AmountToExplore[currentmapindex];
      if ($KoTCMinimapSystem.ExplorationMapMode !== false) {
        this.drawTextEx(
          "\\C[17]" +
            Math.round((tempamountexplored / tempamounttoexplore) * 100) +
            "% Explored",
          x,
          y,
          160
        );
      }
      this.resetTextColor();
      this.drawText("", x + 160, y, 60, "right");
      y += lineHeight;
    }

    x = 20;
    if (Utils.RPGMAKER_NAME == "MZ") {
      x = this.itemPadding();
      y = this.itemPadding() + lineHeight;
    } else {
      x = this.textPadding();
      y = this.textPadding() + lineHeight;
    }
    var mapnoteregex1 = new RegExp(
      /<KoTC Map Description 1: ([^ \r\n][^!?\.\r\n]+[\w!?\.]+)>/i
    );
    var mapnoteregex2 = new RegExp(
      /<KoTC Map Description 2: ([^ \r\n][^!?\.\r\n]+[\w!?\.]+)>/i
    );
    var mapnoteregex3 = new RegExp(
      /<KoTC Map Description 3: ([^ \r\n][^!?\.\r\n]+[\w!?\.]+)>/i
    );
    var mapnoteregex4 = new RegExp(
      /<KoTC Map Description 4: ([^ \r\n][^!?\.\r\n]+[\w!?\.]+)>/i
    );
    if (mapnoteregex1.exec($KoTCMapImageCache[currentmapid].MapNote) !== null) {
      this.drawTextEx(RegExp.$1, x, y + lineHeight);
      y += lineHeight;
    }
    if (mapnoteregex2.exec($KoTCMapImageCache[currentmapid].MapNote) !== null) {
      this.drawTextEx(RegExp.$1, x, y + lineHeight);
      y += lineHeight;
    }
    if (mapnoteregex3.exec($KoTCMapImageCache[currentmapid].MapNote) !== null) {
      this.drawTextEx(RegExp.$1, x, y + lineHeight);
      y += lineHeight;
    }
    if (mapnoteregex4.exec($KoTCMapImageCache[currentmapid].MapNote) !== null) {
      this.drawTextEx(RegExp.$1, x, y + lineHeight);
      y += lineHeight;
    }
  }
};

function ConvertKeyNameToCode(key) {
  var regexalphabet = new RegExp(/[A-Z]|[a-z]/);
  var codes = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    "pause break": 19,
    "caps lock": 20,
    esc: 27,
    space: 32,
    "page up": 33,
    "page down": 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete: 46,
    command: 91,
    "left command": 91,
    "right command": 93,
    "numpad *": 106,
    "numpad +": 107,
    "numpad -": 109,
    "numpad .": 110,
    "numpad /": 111,
    "num lock": 144,
    "scroll lock": 145,
    "my computer": 182,
    "my calculator": 183,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222,
  };
  if (regexalphabet !== null && key.length == 1) {
    return key.toLowerCase().charCodeAt();
  } else {
    return codes[key.toLowerCase()];
  }
}
