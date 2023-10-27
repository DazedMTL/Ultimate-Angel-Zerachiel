//=============================================================================
/*:
*@plugindesc v1.0 Action Sequence Live Editor
* @author ManuGamingCreations
*
*/
//=============================================================================

'use strict';

Imported = Imported || {};
Imported.MGC_AS_EDITOR = true;

class MGCASEDITOR {
  static OpenWindow() {
    const scripts = document.querySelectorAll("script[src]");
    const currentScript = scripts[scripts.length - 1];
    const scriptUrl = currentScript.src;
    const windowUrl = scriptUrl.split('MGC_AS_Editor.js')[0] + "MGC_AS_Editor/ASEditor.html";
    const AsEditorWindow = window.open(windowUrl);
    AsEditorWindow.gameWindow = window;
  }
}


const _mgcAsEditorSceneBoot = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function () {
  _mgcAsEditorSceneBoot.call(this);
  MGCASEDITOR.OpenWindow();
}
