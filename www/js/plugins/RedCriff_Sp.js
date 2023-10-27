//=============================================================================
// RedCriff_Sp.js
//=============================================================================
//以下プロジェクトより先に読み込む
//EasingPicture.js
//
/*:
 * @plugindesc 軽量化ピクチャ
 * @author RedCriff
 */

//PicturePriorityCustomize.js ピクチャ表示優先度プラグインに乗っかり、スプライトを追加する
//N_Sprite::Spriteテスト
var NS_createPictures = Spriteset_Base.prototype.createPictures;
Spriteset_Base.prototype.createPictures = function () {
    NS_createPictures.apply(this, arguments);
    this.removeChild(this._pictureContainer);
    this.N_Sprite_Create(); //N_Sprite_L と N_Sprite_Tの作成
};
//描写SpriteArr
var ViewSpriteArr = []; //現在表示されているスプライト
var ViewSpriteArr_Add = function (_No) {
    if (ViewSpriteArr.indexOf(_No) == -1) {
        ViewSpriteArr.push(_No);
    }
}
var ViewSpriteArr_Remove = function (_No) {
    if (ViewSpriteArr.indexOf(_No) != -1) {
        ViewSpriteArr.splice(ViewSpriteArr.indexOf(_No), 1);
    }
}
var ViewSpriteArr_Reset = function (_No) {
    ViewSpriteArr = [];
}
//N_Spriteの作成
var N_Sprite_L = null; //下層ピクチャの上
var N_Sprite_M = null; //中層（Live2Dより後ろ）
var N_Sprite_T = null; //上層ピクチャの下
Spriteset_Base.prototype.N_Sprite_Create = function () {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    N_Sprite_L = new Sprite();
    N_Sprite_L.setFrame(x, y, width, height);
    N_Sprite_M = new Sprite();
    N_Sprite_M.setFrame(x, y, width, height);
    N_Sprite_T = new Sprite();
    N_Sprite_T.setFrame(x, y, width, height);
    this.Set_N_Sprite_L();
}
//下層部:_N_Sprite_L::設定
Spriteset_Base.prototype.Set_N_Sprite_L = function () {
    this.addChild(N_Sprite_L);
};
//上層部:_N_Sprite_T:作成
var NS_createWindowLayer = Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function () {
    if (this._spriteset) {
        this._spriteset.SetUp_N_Sprite_T(this);
    }
    NS_createWindowLayer.apply(this, arguments);
}
//上層部:_N_Sprite_T:設定
Spriteset_Base.prototype.SetUp_N_Sprite_T = function (parentScene) {
    //上部ピクチャの一つ下にINさせる。
    var _INNo = parentScene.children.length - 1;
    if (_INNo < 0) _INNo = 0;
    parentScene.addChildAt(N_Sprite_T, _INNo);
};
//対象スプライトコンテナの選択
var N_Sprite_MNo = 0; //中層番号No::移行の番号は中層となる
var N_Sprite_TNo = 0; //描写レイヤーの自動変更番号::指定数以上の場合トップに切り替わる
var SpriteLayer = 0; //描画を行うレイヤー指定
var SelSprite = function (_No) { //Spriteレイヤーの取得
    var _No = typeof _No !== 'undefined' ? _No : 0;

    if (_No >= N_Sprite_TNo) { //上層レイヤー
        return N_Sprite_T;
    }
    if (_No >= N_Sprite_MNo && N_Sprite_MNo != 0) { //中層レイヤー
        return N_Sprite_M;
    }
    return N_Sprite_L; //下層レイヤー
}

//■デバッグ用■■■■■■■■■■■■■■■■■■■■■■■
var DebugSpriteNo = function (_CkPNo, _PlsStr) {
    var _PlsStr = typeof _PlsStr !== 'undefined' ? _PlsStr : "";
    var _DrawArr = [];
    for (var cdi = 0; cdi <= DbgPNo.length - 1; cdi++) {
        if (DbgPNo[cdi] == _CkPNo) {
            _DrawArr.push("[デバッグ]Sprite:" + DbgPNo[cdi] + ":" + _PlsStr);
        }
    }
    for (var i = 0; i <= _DrawArr.length - 1; i++) {
        console.log(_DrawArr[i]);
    }
}

//■ ピクチャ表示処理 ■■■■■
Game_Interpreter.prototype.SetSprite = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    var _x = typeof _x !== 'undefined' ? _x : 0;
    var _y = typeof _y !== 'undefined' ? _y : 0;
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;
    var _blendMode = typeof _blendMode !== 'undefined' ? _blendMode : 0;
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    var _FolPath = _FolPathGet(_Path);
    var _FileName = _FileNameGet(_Path);
    //すでに項目が入っている場合は削除→挿入となる
    this.DelSprite(_No);
    var _INNo = _GetSpriteInNo(_No);
    var _SetSprite = _NSprite(_No, _FolPath, _FileName, _x, _y, _opi, _mx, _my, _blendMode);
    _N_Sprite.addChildAt(_SetSprite, _INNo);
    ViewSpriteArr_Add(_No);

    DebugSpriteNo(_No, "SetSprite");
}
//スプライトの表示::中心
Game_Interpreter.prototype.SetSpriteC = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _NSprite_AncNo = 1;
    this.SetSprite(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
//スプライトの表示::右上
Game_Interpreter.prototype.SetSpriteR = function (_No, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    _NSprite_AncNo = 2;
    this.SetSprite(_No, _Path, _x, _y, _opi, _mx, _my, _blendMode);
}
var _FolPathGet = function (_Path) {
    var _FolPath = "img/";
    if (_Path.lastIndexOf("/") == -1) return (_FolPath + "pictures/")
    return (_FolPath + _Path.slice(0, _Path.lastIndexOf("/") + 1));
}
var _FileNameGet = function (_Path) {
    if (_Path.lastIndexOf("/") == -1) return _Path;
    return _Path.slice(_Path.lastIndexOf("/") + 1);
}

//スプライトのフェードイン
Game_Interpreter.prototype.SetSpriteFIn = function (_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my) {
    var _zureX = typeof _zureX !== 'undefined' ? _zureX : 0;
    var _zureY = typeof _zureY !== 'undefined' ? _zureY : 0;
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;
    this.SetSprite(_No, _Path, _x, _y, 0, _mx, _my);
    this.MoveSprite(_No, _x + _zureX, _y + _zureY, _time, _opi, _mx, _my);
}
Game_Interpreter.prototype.SetSpriteFInC = function (_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.SetSpriteFIn(_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my);
}
Game_Interpreter.prototype.SetSpriteFInR = function (_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.SetSpriteFIn(_No, _Path, _x, _y, _zureX, _zureY, _time, _opi, _mx, _my);
}

//■クリッカブルマップの設定■■■■■■■■■■■■■■■■■■特定地点に入っている場合のNoを返す
//Arrは[X地点,Y地点,横幅,縦幅] を 配列で渡し、配列の上から判定していき、Noを返す
function overSpriteClickable(_PicNo, _CMapArr) {
    if (this.overPointerSpCk(_PicNo)) {
        var _CkZureX = 0;
        var _CkZureY = 0;
        var _CkSprite = GetSpriteData(_PicNo);
        if (_CkSprite.anchor.x == 0.5 && _CkSprite.anchor.y == 0.5) { //中心座標の時
            _CkZureX = _CkSprite.width / 2;
            _CkZureY = _CkSprite.height / 2;
        }
        for (var i = 0; i <= _CMapArr.length - 1; i++) {
            if (_TcPosX >= _CMapArr[i][0] + _CkSprite._x - _CkZureX &&
                _TcPosX <= _CMapArr[i][0] + _CMapArr[i][2] + _CkSprite._x - _CkZureX &&
                _TcPosY >= _CMapArr[i][1] + _CkSprite._y - _CkZureY &&
                _TcPosY <= _CMapArr[i][1] + _CMapArr[i][3] + _CkSprite._y - _CkZureY) {
                return i;
            }
        }
    }
    return -1; //該当項目なし
}
//オーバーしているピクチャの触っている部分のX箇所が全体の何%の位置かを返す(0~100)
function overSpriteParX(_PicNo) {
    if (this.overPointerSpCk(_PicNo)) {
        var _CkZureX = 0;
        var _CkSprite = GetSpriteData(_PicNo);
        if (_CkSprite.anchor.x == 0.5 && _CkSprite.anchor.y == 0.5) { //中心座標の時
            _CkZureX = _CkSprite.width / 2;
        }
        return (_TcPosX - (_CkSprite._x - _CkZureX)) / _CkSprite.width * 100;
    }
    return -1; //そもそもオーバーしていない
}
//オーバーしているピクチャの触っている部分のY箇所が全体の何%の位置かを返す(0~100)
function overSpriteParY(_PicNo) {
    if (this.overPointerSpCk(_PicNo)) {
        var _CkZureY = 0;
        var _CkSprite = GetSpriteData(_PicNo);
        if (_CkSprite.anchor.x == 0.5 && _CkSprite.anchor.y == 0.5) { //中心座標の時
            _CkZureY = _CkSprite.height / 2;
        }
        return (_TcPosY - (_CkSprite._y - _CkZureY)) / _CkSprite.height * 100;
    }
    return -1; //そもそもオーバーしていない
}

//■ スプライト変更処理 ■■■■■■■■■■
Game_Interpreter.prototype.CngSprite = function (_No, _Path) {
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    for (var i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            var _FolPath = _FolPathGet(_Path);
            var _FileName = _FileNameGet(_Path);
            var _bitmap = ImageManager.loadBitmap(_FolPath, _FileName, 0, true)
            _N_Sprite.children[i].bitmap = _bitmap;
            break;
        }
    }
    DebugSpriteNo(_No, "CngSprite");
}
Game_Interpreter.prototype.ReDrawSprite = function (_No, _Path) {

}

//■ スプライト削除 ■■■■■
Game_Interpreter.prototype.DelSprite = function (_No, _SpStrFlg) {
    //_SpStrFlg::SpriteStr内での表示の時はtrueを入れる
    var _SpStrFlg = typeof _SpStrFlg !== 'undefined' ? _SpStrFlg : false;
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    for (var i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            _N_Sprite.removeChildAt(i);
            break;
        }
    }
    DebugSpriteNo(_No, "DelSprite");
    if (!_SpStrFlg) _SpriteStrArr_Dell(_No);
    _SpStrFlg = false;
};
var DelSprite = function (_No, _SpStrFlg) { //thisを付けなくても良いバージョン
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    for (var i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            _N_Sprite.removeChildAt(i);
            break;
        }
    }
    ViewSpriteArr_Remove(_No);
    DebugSpriteNo(_No, "DelSprite");
    if (!_SpStrFlg) _SpriteStrArr_Dell(_No);
    _SpStrFlg = false;
}

//画像の削除（配列
Game_Interpreter.prototype.DelSpriteArr = function (_PicArr) {
    for (var i = 0; i <= _PicArr.length - 1; i++) {
        this.DelSprite(_PicArr[i]);
    }
}
//画像の削除（範囲
Game_Interpreter.prototype.DelSpriteSpan = function (_SNo, _ENo) {
    for (var i = _SNo; i <= _ENo; i++) {
        this.DelSprite(i);
    }
}
//画像の削除（全て
Game_Interpreter.prototype.ALLDelSprite = function () {
    for (var i = 0; i <= N_Sprite_L.children.length - 1; i++) {
        N_Sprite_L.removeChild(N_Sprite_L.children[i]); i--;
    }
    for (var i = 0; i <= N_Sprite_M.children.length - 1; i++) {
        N_Sprite_M.removeChild(N_Sprite_M.children[i]); i--;
    }
    for (var i = 0; i <= N_Sprite_T.children.length - 1; i++) {
        N_Sprite_T.removeChild(N_Sprite_T.children[i]); i--;
    }
}

//■ スプライト移動処理 ■■■■■
//EasingStr = ◯◯;  //◯◯は以下の中から設定 //イージング処理
//easeInQuad , easeOutQuad , easeInOutQuad , easeOutBack , easeOutElastic , easeOutBounce
Game_Interpreter.prototype.MoveSprite = function (_No, _x, _y, _time, _opi, _mx, _my) {
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    //trueが指定されている時、前の値を保持する
    if (GetSpriteData(_No) == null) return;
    if (_x == true) _x = GetSpriteData(_No)._x;
    if (_y == true) _y = GetSpriteData(_No)._y;
    if (_opi == true) _opi = GetSpriteData(_No)._opacity;
    if (_mx == true) _mx = GetSpriteData(_No)._scaleX;
    if (_my == true) _my = GetSpriteData(_No)._scaleY;
    this.EMoveSet(EasingStr);
    for (var i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            var _setBlendMode = _N_Sprite.children[i].blendMode;
            _N_Sprite.children[i].move(_x, _y, _mx, _my, _opi, _setBlendMode, _time)
        }
    }
    DebugSpriteNo(_No, "MoveSprite");
}
//移動位置を追加する
Game_Interpreter.prototype.MoveSpriteAdd = function (_No, addx, addy, _time, _opi) {
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _mx = true;
    var _my = true;
    if (GetSpriteData(_No) == null) return;
    if (_opi == true) _opi = GetSpriteData(_No)._opacity;
    if (_mx == true) _mx = GetSpriteData(_No)._scaleX;
    if (_my == true) _my = GetSpriteData(_No)._scaleY;
    this.EMoveSet(EasingStr);
    setx = GetSpriteData(_No)._x + addx;
    sety = GetSpriteData(_No)._y + addy;
    this.MoveSprite(_No, setx, sety, _time, _opi, _mx, _my);
}
//スプライトの角度変更
Game_Interpreter.prototype.AngleSprite = function (_No, _Angle) {
    var _Sprite = GetSpriteData(_No);
    if (_Sprite == null) return;
    var _angl = Math.PI * (_Angle / 180);
    _Sprite.rotation = _angl
    DebugSpriteNo(_No, "AngleSprite");
}
//スプライトの回転設定
Game_Interpreter.prototype.RotateSprite = function (_No, _Speed) {
    var _Sprite = GetSpriteData(_No);
    if (_Sprite == null) return;
    _Sprite._rotationSpeed = _Speed;
    DebugSpriteNo(_No, "RotateSprite");
}
//スプライトの色調変更
Game_Interpreter.prototype.SpriteCngColor = function (_No, _ColArr) {
    var _ColArr = typeof _ColArr !== 'undefined' ? _ColArr : [0, 0, 0, 0]; //指定しない場合は元に戻す
    var _Sprite = GetSpriteData(_No);
    if (_Sprite == null) return;
    _Sprite._tone = _ColArr;
    _Sprite.setColorTone(_Sprite._tone);
    DebugSpriteNo(_No, "SpriteCngColor");
}
Game_Interpreter.prototype.SpriteCngColorArr = function (_NoArr, _ColArr) {
    var _ColArr = typeof _ColArr !== 'undefined' ? _ColArr : [0, 0, 0, 0]; //指定しない場合は元に戻す
    for (var i = 0; i <= _NoArr.length - 1; i++) {
        this.SpriteCngColor(_NoArr[i], _ColArr);
    }
}
//スプライトのフィルター設定::FilterController.jsが前提
Game_Interpreter.prototype.SpriteFilterSet = function (_No, _FilterName) {
    var _SetArr = [6000 + _No, _FilterName, 6000 + _No];
    this.N_Plgin("createFilter", _SetArr);
    DebugSpriteNo(_No, "SpriteFilterSet");
}
Game_Interpreter.prototype.SpriteFilterPraSet = function (_No, _PraArr) {
    var _SetArr = [6000 + _No];
    for (var i = 0; i <= _PraArr.length - 1; i++) {
        _SetArr.push(_PraArr[i]);
    }
    this.N_Plgin("setFilter", _SetArr);
}

//スプライトの合成処理：Update
//★この処理は、NUpdateScに記述させる
Game_Interpreter.prototype.spCmp_Update = function () {
    this.CmpSprite_Update();
    this.CmpSprite_Setting_Update(); //
}
//■ スプライトの合成：スプライト番号形式 ■■■■■
var _SpCmpKeepArr = []; //合成待機時はループさせる
class SpCmpKeep {
    constructor(_ANo, _Sprite, _xPos, _yPos) {
        this._ANo = _ANo;
        this._Sprite = _Sprite; //ここがSpriteになる可能性もある
        this._xPos = _xPos;
        this._yPos = _yPos;
    }
};
Game_Interpreter.prototype.CmpSprite_Update = function () {
    var _CkArr = _SpCmpKeepArr.slice();
    _SpCmpKeepArr = []; //リセット
    for (var i = 0; i <= _CkArr.length - 1; i++) {
        this.CmpSprite(_CkArr[i]._ANo, _CkArr[i]._Sprite, _CkArr[i]._xPos, _CkArr[i]._yPos);
    }
}
//すでに表示されているピクチャを合成する。
Game_Interpreter.prototype.CmpSprite = function (_ANo, _BNo, _xPos, _yPos) {
    var _xPos = typeof _xPos !== 'undefined' ? _xPos : 0;
    var _yPos = typeof _yPos !== 'undefined' ? _yPos : 0;
    var _N_Sprite = SelSprite(_ANo); //選択Spriteを取得
    var _ASprite = GetSpriteData(_ANo);
    var _BSprite = null;
    if (!isNaN(_BNo)) {
        _BSprite = GetSpriteData(_BNo);
        this.DelSprite(_BNo);
    } else {
        _BSprite = _BNo; //保持されたSpriteを使用
    }
    if (_ASprite == null || _BSprite == null) return; //合成失敗::そもそもスプライト自体が存在しないので待機させない
    if (!_ASprite.bitmap.isReady() || !_BSprite.bitmap.isReady()) {
        //ビットマップがロードされていない場合
        _SpCmpKeepArr.push(new SpCmpKeep(_ANo, _BSprite, _xPos, _yPos));
        return;
    }
    //合成開始
    var bitmap_d = _ASprite.bitmap; //合成元
    var bitmap_s = _BSprite.bitmap; //合成先
    //合成処理の実施
    var _bitmap_c = new Bitmap(bitmap_d.width, bitmap_d.height);
    _bitmap_c.smooth = true;
    _bitmap_c.bltImage(bitmap_d, 0, 0, bitmap_d.width, bitmap_d.height, 0, 0);
    _bitmap_c.bltImage(bitmap_s, 0, 0, bitmap_s.width, bitmap_s.height, _xPos, _yPos);

    var _cmpSprite = new NSprite(_bitmap_c);
    _cmpSprite.Sprite_Data_Copy(_ASprite);

    this.DelSprite(_ANo);

    var _INNo = _GetSpriteInNo(_ANo);
    _N_Sprite.addChildAt(_cmpSprite, _INNo)
    ViewSpriteArr_Add(_ANo);
    DebugSpriteNo(_ANo, "SpriteFilterSet");
}

var _CmpSprite_Setting_Keep = [];
class _CmpSprite_Setting {
    constructor(_No, _CmpSpriteArr) {
        this._No = _No;
        this._CmpSpriteArr = _CmpSpriteArr;
    }
};
class _CmpSprite {
    constructor(_Path, _x, _y) {
        var _x = typeof _x !== 'undefined' ? _x : 0;
        var _y = typeof _y !== 'undefined' ? _y : 0;
        this._Path = _Path;
        this._Sprite = null;
        this._x = _x; //合成予定X位置
        this._y = _y; //合成予定Y位置
    }
};
Game_Interpreter.prototype.CmpSprite_Setting = function (_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my) {
    //合成ピクチャを指定箇所に表示する
    //_CmpSpriteArr :: _CmpSpriteクラスの配列
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;
    //[0]はとりあえず表示
    this.SetSprite(_No, _CmpSpriteArr[0]._Path, _xPos, _yPos, _opi, _mx, _my);
    //各項目のロード開始
    for (var i = 1; i <= _CmpSpriteArr.length - 1; i++) {
        var _FolPath = _FolPathGet(_CmpSpriteArr[i]._Path);
        var _FileName = _FileNameGet(_CmpSpriteArr[i]._Path);
        var _bitmap = ImageManager.loadBitmap(_FolPath, _FileName, 0, true);
        _CmpSpriteArr[i]._Sprite = new NSprite(_bitmap);
    }
    _CmpSprite_Setting_Keep.push(new _CmpSprite_Setting(_No, _CmpSpriteArr));
    _NSprite_AncNo = 0;
    DebugSpriteNo(_No, "CmpSprite_Setting");
}
Game_Interpreter.prototype.CmpSprite_SettingC = function (_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.CmpSprite_Setting(_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my);
}
Game_Interpreter.prototype.CmpSprite_SettingR = function (_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.CmpSprite_Setting(_No, _CmpSpriteArr, _xPos, _yPos, _opi, _mx, _my);
}
Game_Interpreter.prototype.CmpSprite_Setting_Update = function () {
    for (var i = 0; i <= _CmpSprite_Setting_Keep.length - 1; i++) {
        //描画に成功した場合はTrueが入る
        if (this.CmpSprite_Setting_Draw(_CmpSprite_Setting_Keep[i]._No, _CmpSprite_Setting_Keep[i]._CmpSpriteArr)) {
            _CmpSprite_Setting_Keep.splice(i, 1);
            i--; //実行完了したので削除
        }
    }
}
Game_Interpreter.prototype.CmpSprite_Setting_Draw = function (_No, _CmpSpriteArr) {
    for (var i = 1; i <= _CmpSpriteArr.length - 1; i++) {
        if (!_CmpSpriteArr[i]._Sprite.bitmap.isReady()) { //準備ができていない項目が存在する
            return false;
        }
    }
    if (GetSpriteData(_No) == null) return true; //ベースがnullの場合はキャンセル
    if (!GetSpriteData(_No).bitmap.isReady()) {
        return false;
    }
    //以下描画
    var _bitmap_base = GetSpriteData(_No).bitmap;
    var _bitmap_c = new Bitmap(_bitmap_base.width, _bitmap_base.height);
    _bitmap_c.smooth = true;
    _bitmap_c.bltImage(_bitmap_base, 0, 0, _bitmap_base.width, _bitmap_base.height, 0, 0);
    for (var i = 1; i <= _CmpSpriteArr.length - 1; i++) {
        var bitmap_s = _CmpSpriteArr[i]._Sprite.bitmap
        _bitmap_c.bltImage(bitmap_s, 0, 0, bitmap_s.width, bitmap_s.height,
            _CmpSpriteArr[i]._x, _CmpSpriteArr[i]._y);
    }
    var _cmpSprite = new NSprite(_bitmap_c);
    _cmpSprite.Sprite_Data_Copy(GetSpriteData(_No));

    this.DelSprite(_No);
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    var _INNo = _GetSpriteInNo(_No);
    _N_Sprite.addChildAt(_cmpSprite, _INNo)
    ViewSpriteArr_Add(_No);
    return true;
}

//◆テキスト文字表示：メモリーリーク対策
//同じ内容を表示させない為、各ピクチャNoの表示状態を常に確認する。
class _DrawStr {
    constructor(_No, _Text, _Size, _x, _y, _opi, _mx, _my, _Font) {
        this._No = _No;
        this._Text = _Text;
        this._Size = _Size;
        this._x = _x;
        this._y = _y;
        this._opi = _opi; //ここが違う場合は
        this._mx = _mx;
        this._my = _my;
        this._Font = _Font;
    }
};
var _SpriteStrArr = [];
var SpriteSkipCk = function (DrawStr) {
    var _AddFlg = true;
    for (var i = 0; i <= _SpriteStrArr.length - 1; i++) {
        if (_SpriteStrArr[i]._No == DrawStr._No) {
            _AddFlg = false;
            //テキスト又はサイズが違う場合は新規描画を行わせる
            if (_SpriteStrArr[i]._Text != DrawStr._Text ||
                _SpriteStrArr[i]._Size != DrawStr._Size ||
                _SpriteStrArr[i]._Font != DrawStr._Font) {
                _SpriteStrArr[i] = DrawStr;
                return false; //スキップしない
            }
            //以下情報変更
            if (GetSpriteData(DrawStr._No) == null) return true;
            GetSpriteData(DrawStr._No)._x = DrawStr._x;
            GetSpriteData(DrawStr._No)._y = DrawStr._y;
            GetSpriteData(DrawStr._No)._opacity = DrawStr._opi;
            GetSpriteData(DrawStr._No)._scaleX = DrawStr._mx;
            GetSpriteData(DrawStr._No)._scaleY = DrawStr._my;
            _SpriteStrArr[i] = DrawStr;
            return true;
        }
    }
    if (_AddFlg) {
        _SpriteStrArr.push(DrawStr);
        return false; //スキップしない
    }
}
var _SpriteStrArr_Dell = function (_No) {
    for (var i = 0; i <= _SpriteStrArr.length - 1; i++) {
        if (_SpriteStrArr[i]._No == _No) {
            _SpriteStrArr.splice(i, 1);
        }
    }
}
//■ テキストの表示 ■■■■■ 
var SpriteStrDataGet = function (_PNo) {
    if (GetSpriteData(_PNo) != null) {
        if (GetSpriteData(_PNo).dTextInfo != null) {
            GetSpriteData(_PNo).dTextInfo.originalValue =
                GetSpriteData(_PNo).dTextInfo.originalValue.replace("\n", "");
        }
        return GetSpriteData(_PNo).dTextInfo;
    }
}
var _SetdTextInfo = null;
Game_Interpreter.prototype.SpriteStr = function (_No, _Text, _Size, _x, _y, _opi, _mx, _my) {
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;

    var _Font = "MainFont";
    if (D_Text_Cng_font != "") _Font = D_Text_Cng_font;
    if (_OneShotFont != "") _Font = _OneShotFont;
    if (_Font != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", _Font]);

    // var _ckDrawStr = new _DrawStr(_No, _Text, _Size , _x, _y , _opi , _mx , _my , _Font);
    // if(SpriteSkipCk(_ckDrawStr)){
    //     return; //◆同一表示内容をスキップ：メモリリーク対応◆
    // }
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    var args = new Array(_Text, String(_Size));
    if (SpriteStrDataGet(_No) != null) {
        //文字 / サイズ / フォントが同じ場合は新規での記述はせず情報変更のみにする
        if (SpriteStrDataGet(_No).originalValue == _Text &&
            SpriteStrDataGet(_No).size == _Size &&
            SpriteStrDataGet(_No).font == _Font) {
            GetSpriteData(_No)._x = _x;
            GetSpriteData(_No)._y = _y;
            GetSpriteData(_No)._opacity = _opi;
            GetSpriteData(_No)._scaleX = _mx;
            GetSpriteData(_No)._scaleY = _my;
            //設定を初期化
            this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
            _NSprite_AncNo = 0;
            _OneShotFont = "";
            ViewSpriteArr_Add(_No);
            DebugSpriteNo(_No, "SpriteStr");
            return;
        }
    }
    this.pluginCommand("D_TEXT", args);
    if ($gameScreen.isSettingDText()) {
        _SetdTextInfo = $gameScreen.getDTextPictureInfo();
        $gameScreen.clearDTextPicture();
        //Spriteの作成
        this.DelSprite(_No, true);
        var _sprite = new NSprite();
        _sprite.loadBitmap(); //文字スプライトの作成::_SetdTextInfoがある時は、文字BitmapをLoadする
        _sprite.No = _No;
        _sprite._x = _x;
        _sprite._y = _y;
        _sprite._opacity = _opi;
        _sprite._scaleX = _mx;
        _sprite._scaleY = _my;
        _sprite.dTextInfo = _SetdTextInfo;
        _sprite.dLayer = N_Sprite_DLayer; //ディスプレイレイヤー
        _sprite.ParaSet(); //パラメーター反映

        var _INNo = _GetSpriteInNo(_No);
        _N_Sprite.addChildAt(_sprite, _INNo);
        _SetdTextInfo = null;
    }
    //設定を初期化
    this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
    _OneShotFont = "";
    ViewSpriteArr_Add(_No);
    DebugSpriteNo(_No, "SpriteStr");
    //console.log("◆SpriteStr::文字表示中::メモリーリーク注意◆");
}
Game_Interpreter.prototype.SpriteStrC = function (_No, _Text, _Size, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.SpriteStr(_No, _Text, _Size, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.SpriteStrR = function (_No, _Text, _Size, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.SpriteStr(_No, _Text, _Size, _x, _y, _opi, _mx, _my);
}
//テキストポップアップ
Game_Interpreter.prototype.SpriteStrPop = function (_No, _Text, _Size, _x, _y, _time, _popY) {
    var _time = typeof _time !== 'undefined' ? _time : 60;
    var _popY = typeof _popY !== 'undefined' ? _popY : 30;
    this.SpriteStr(_No, _Text, _Size, _x, _y);
    this.MoveSprite(_No, _x, _y - _popY, _time, 0);
}
Game_Interpreter.prototype.SpriteStrPopC = function (_No, _Text) {
    _NSprite_AncNo = 1;
    this.SpriteStrPop(_No, _Text, _Size, _x, _y, _time, _popY);
}
Game_Interpreter.prototype.CngSpriteStr = function (_No, _Text, _Size) {
    //スプライト情報の取得
    if (SpriteStrDataGet(_No) != null) {
        var _Font = "MainFont";
        if (D_Text_Cng_font != "") _Font = D_Text_Cng_font;
        if (_OneShotFont != "") _Font = _OneShotFont;
        if (_Font != "") this.pluginCommand("D_TEXT_SETTING", ["FONT", _Font]);

        var _Size = typeof _Size !== 'undefined' ? _Size : SpriteStrDataGet(_No).size;

        //文字 / サイズ / フォントが同じ場合は新規での記述はせず情報変更のみにする
        if (SpriteStrDataGet(_No).originalValue == _Text &&
            SpriteStrDataGet(_No).size == _Size) {
            return; //変化が無いので処理をしない
        } else {
            var _StData = GetSpriteData(_No);
            _NSprite_AncNo = 0;
            if (_StData._anchor._x == 0.5 && _StData._anchor._y == 0.5) _NSprite_AncNo = 1;
            if (_StData._anchor._x == 1 && _StData._anchor._y == 0) _NSprite_AncNo = 2;
            this.SpriteStr(_No, _Text, _Size, _StData._x, _StData._y, _StData._opacity
                , _StData._scaleX, _StData._scaleY)
        }
        this.pluginCommand("D_TEXT_SETTING", ["FONT", "MainFont"]);
        _OneShotFont = "";
        DebugSpriteNo(_No, "CngSpriteStr");
    }
}
//■ スプライトアニメの表示 ■■■■■
var SpriteAnimeLoopFlg = true;
Game_Interpreter.prototype.PlaySpriteAnime = function (_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my) {
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    var _FolPath = _FolPathGet(_Path);
    var _FileName = _FileNameGet(_Path);
    //すでに項目が入っている場合は削除→挿入となる
    this.DelSprite(_No);
    var _INNo = _GetSpriteInNo(_No);
    var _SetSprite = _NSprite(_No, _FolPath, _FileName, _x, _y, _opi, _mx, _my);
    _SetSprite.AnimeSetting(_CellSu, _CellFlm, SpriteAnimeLoopFlg);
    SpriteAnimeLoopFlg = true;
    _N_Sprite.addChildAt(_SetSprite, _INNo);
    ViewSpriteArr_Add(_No);
    DebugSpriteNo(_No, "PlaySpriteAnime");
}
Game_Interpreter.prototype.PlaySpriteAnimeC = function (_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.PlaySpriteAnime(_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.PlaySpriteAnimeR = function (_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.PlaySpriteAnime(_No, _Path, _CellSu, _CellFlm, _x, _y, _opi, _mx, _my);
}

//■ 特定セルの表示 ■■■■■
Game_Interpreter.prototype.SetSpriteCell = function (_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my) {
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    var _FolPath = _FolPathGet(_Path);
    var _FileName = _FileNameGet(_Path);
    //すでに項目が入っている場合は削除→挿入となる
    this.DelSprite(_No);
    var _INNo = _GetSpriteInNo(_No);
    var _SetSprite = _NSprite(_No, _FolPath, _FileName, _x, _y, _opi, _mx, _my);
    _SetSprite.CellSet(_CellSu, _CellNo);
    _N_Sprite.addChildAt(_SetSprite, _INNo);
    ViewSpriteArr_Add(_No);
    DebugSpriteNo(_No, "SetSpriteCell");
}
Game_Interpreter.prototype.SetSpriteCellC = function (_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 1;
    this.SetSpriteCell(_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.SetSpriteCellR = function (_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my) {
    _NSprite_AncNo = 2;
    this.SetSpriteCell(_No, _Path, _CellSu, _CellNo, _x, _y, _opi, _mx, _my);
}
Game_Interpreter.prototype.SpriteCellCng = function (PicNo, _CellNo) {
    _SetSprite = GetSpriteData(PicNo);
    _SetSprite.CellSet(_SetSprite.cellCnt, _CellNo);
}

//_SaveSpriteは配列 [[],[],[]]
Game_Interpreter.prototype.KeepSprite = function (_SaveSprite) {
    for (var i = 0; i <= N_Sprite_L.children.length - 1; i++) {
        _SaveSprite[0].push(N_Sprite_L.children[i]);
        N_Sprite_L.removeChild(N_Sprite_L.children[i]); i--;
    }
    for (var i = 0; i <= N_Sprite_M.children.length - 1; i++) {
        _SaveSprite[1].push(N_Sprite_M.children[i]);
        N_Sprite_M.removeChild(N_Sprite_M.children[i]); i--;
    }
    for (var i = 0; i <= N_Sprite_T.children.length - 1; i++) {
        _SaveSprite[2].push(N_Sprite_T.children[i]);
        N_Sprite_T.removeChild(N_Sprite_T.children[i]); i--;
    }
}
Game_Interpreter.prototype.ReturnSprite = function (_SaveSprite) {
    for (var i = 0; i <= _SaveSprite[0].length - 1; i++) {
        N_Sprite_L.addChild(_SaveSprite[0][i]);
    }
    for (var i = 0; i <= _SaveSprite[1].length - 1; i++) {
        N_Sprite_M.addChild(_SaveSprite[1][i]);
    }
    for (var i = 0; i <= _SaveSprite[2].length - 1; i++) {
        N_Sprite_T.addChild(_SaveSprite[2][i]);
    }
}

//スプライト情報の取得（汎用利用用）
var GetSpriteData = function (_No) {
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    for (var i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No == _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            return _N_Sprite.children[i];
        }
    }
    return null;
}
//スプライトの番号取得
var _GetSpriteInNo = function (_No) {
    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    for (var i = 0; i <= _N_Sprite.children.length - 1; i++) {
        if (_N_Sprite.children[i].No > _No && _N_Sprite.children[i].dLayer == N_Sprite_DLayer) {
            return i;
        }
    }
    return _N_Sprite.children.length;
}
//保持していたスプライト情報から指定位置へ描画※文字列
Game_Interpreter.prototype.KeepSetSpriteStr = function (_No, _Data, _x, _y, _opi, _mx, _my, _blendMode) {
    var _x = typeof _x !== 'undefined' ? _x : 0;
    var _y = typeof _y !== 'undefined' ? _y : 0;
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;
    var _blendMode = typeof _blendMode !== 'undefined' ? _blendMode : 0;
    this.DelSprite(_No, true);

    var _sprite = _Data; //Dataをスプライトに設定
    _sprite.No = _No;
    _sprite._x = _x;
    _sprite._y = _y;
    _sprite._opacity = _opi;
    _sprite._scaleX = _mx;
    _sprite._scaleY = _my;
    _sprite.ParaSet(); //パラメーター反映

    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    var _INNo = _GetSpriteInNo(_No);
    _N_Sprite.addChildAt(_sprite, _INNo);
    DebugSpriteNo(_No, "KeepSetSpriteStr");
}


//■ スプライトのオーバーチェック
function overPointerSpCk(_No) {
    if (MouseStopFlame > MouseMukoFlame) return false; //マウスが停止している時は無効
    return $gameScreen.isPointerInnerSprite(_No);
};
function overPointerSpCkTm(_No) {
    if (MouseStopFlame > MouseMukoFlame) return false; //マウスが停止している時は無効
    return $gameScreen.isPointerInnerSpriteTm(_No);
};
var _p_sp_tmFlg = false;
function overPointerSpCkArr(_NoArr) {
    if (MouseStopFlame > MouseMukoFlame) return -1; //マウスが停止している時は無効
    var _RtnNo = -1;
    for (var i = 0; i <= _NoArr.length - 1; i++) {
        if (_p_sp_tmFlg) {
            if (overPointerSpCkTm(_NoArr[i])) {
                if (_RtnNo < _NoArr[i]) _RtnNo = _NoArr[i];
            }
        } else {
            if (overPointerSpCk(_NoArr[i])) {
                if (_RtnNo < _NoArr[i]) _RtnNo = _NoArr[i];
            }
        }
    }
    _p_sp_tmFlg = false;
    return _RtnNo;
}
function overPointerSpCkArrTm(_NoArr) {
    _p_sp_tmFlg = true;
    return overPointerSpCkArr(_NoArr);
}
//スプライト情報の確保（メモリ）・反映
//指定Noに確保しておいたSpriteを入れる
Game_Interpreter.prototype.SpriteObjGet = function (_No) {
    return GetSpriteData(_No);
}
Game_Interpreter.prototype.SpriteInObj = function (_No, _Sprite, _x, _y, _opi, _mx, _my, _blendMode) {
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _rot = typeof _rot !== 'undefined' ? _rot : 0;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;
    var _blendMode = typeof _blendMode !== 'undefined' ? _blendMode : 0;

    //すでに項目が入っている場合は削除→挿入となる
    this.DelSprite(_No);
    _Sprite.No = _No;
    _Sprite._x = _x;
    _Sprite._y = _y;
    _Sprite._opacity = _opi;
    _Sprite._scaleX = _mx; _Sprite._scaleY = _my;
    _Sprite.blendMode = _blendMode;

    var _N_Sprite = SelSprite(_No); //選択Spriteを取得
    var _INNo = _GetSpriteInNo(_No);
    _Sprite.No = _No;

    _N_Sprite.addChildAt(_Sprite, _INNo);
    ViewSpriteArr_Add(_No);
    DebugSpriteNo(_No, "SpriteInObj");
}

//■ テスト用 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
var _NTCnt = 0;
Game_Interpreter.prototype.NTest = function () {
    var _FolPath = "enemies/";
    var _CmpArr = [
        new _CmpSprite(_FolPath + "Trash_WB"),
        new _CmpSprite(_FolPath + "spina"),
        new _CmpSprite(_FolPath + "Trash_W"),
        new _CmpSprite(_FolPath + "kajua_A", 100)
    ]
    this.CmpSprite_Setting(1, _CmpArr, 100, 100);
}
Game_Interpreter.prototype.NTest2 = function () {
    var _FolPath = "enemies/";
    this.SetSprite(1, _FolPath + "Trash_WB", 100, 100)
}
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

var N_Sprite_DLayer = 0; //ディスプレイレイヤー:同じピクチャ番号を並列で振り分ける
//Spriteの作成::
//_FolPath:画像のフォルダパスを指定:例:"img/pictures/Btl_Face/"
//_Path:実際の画像名:"image"
//0:左上 1:中心 2:右上
var _NSprite = function (_No, _FolPath, _Path, _x, _y, _opi, _mx, _my, _blendMode) {
    var _opi = typeof _opi !== 'undefined' ? _opi : 255;
    var _rot = typeof _rot !== 'undefined' ? _rot : 0;
    var _mx = typeof _mx !== 'undefined' ? _mx : 100;
    var _my = typeof _my !== 'undefined' ? _my : 100;
    var _blendMode = typeof _blendMode !== 'undefined' ? _blendMode : 0;

    var _bitmap = ImageManager.loadBitmap(_FolPath, _Path, 0, true);
    var _sprite = new NSprite(_bitmap);
    _sprite._name = _Path;
    _sprite.No = _No;
    _sprite._x = _x; _sprite._y = _y;
    _sprite._opacity = _opi;
    _sprite._scaleX = _mx; _sprite._scaleY = _my;
    _sprite.blendMode = _blendMode;
    _sprite.dLayer = N_Sprite_DLayer; //ディスプレイレイヤー
    _sprite.ParaSet(); //パラメーター反映
    return _sprite;
}

//■ NSpriteクラス ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■ Pictureと同じ処理をさせながら、軽量化を目指す ■■■■■■■■■■■■■■■■■■■
function NSprite() {
    this.initialize.apply(this, arguments);
}
NSprite.prototype = Object.create(Sprite.prototype);
NSprite.prototype.constructor = NSprite;
//初期値設定
NSprite.prototype.initialize = function (_bitmap) {
    Sprite.prototype.initialize.call(this, _bitmap);
    this.initBasic();
    this.initTarget();
    this.initTone();
    this.initRotation();
    this.AnchorSet(); //アンカーセット

    this.initAnimation(); //アニメ用初期化
};

NSprite.prototype.initBasic = function () {
    this._name = '';
    this._origin = 0;
    this._x = 0;
    this._y = 0;
    this._scaleX = 100;
    this._scaleY = 100;
    this._opacity = 255;
    this._blendMode = 0;

    this.dTextInfo = null;
};
NSprite.prototype.initTarget = function () {
    this._targetX = this._x;
    this._targetY = this._y;
    this._targetScaleX = this._scaleX;
    this._targetScaleY = this._scaleY;
    this._targetOpacity = this._opacity;
    this._duration = 0;
};
NSprite.prototype.initTone = function () {
    this._tone = null;
    this._toneTarget = null;
    this._toneDuration = 0;
};
NSprite.prototype.initRotation = function () {
    this._angle = 0;
    this._rotationSpeed = 0;
};

NSprite.prototype.move = function (x, y, scaleX, scaleY, opacity, blendMode, duration) {
    this._targetX = x;
    this._targetY = y;
    this._targetScaleX = scaleX;
    this._targetScaleY = scaleY;
    this._targetOpacity = opacity;
    this._blendMode = blendMode;
    this._duration = duration;
};

//Update
NSprite.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateMove();
    this.updateTone();
    this.updateRotation();
    //Spriteアニメーション対応
    this.updateAnimation();
}
NSprite.prototype.ParaSet = function () {
    this.x = this._x;
    this.y = this._y;
    this.opacity = this._opacity;
    this.scale.x = (this._scaleX / 100);
    this.scale.y = (this._scaleY / 100);
}
NSprite.prototype.updateMove = function () {
    if (this._duration > 0) {
        var d = this._duration;
        this._x = (this._x * (d - 1) + this._targetX) / d;
        this._y = (this._y * (d - 1) + this._targetY) / d;
        this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;
        this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;
        this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
        this._duration--;
    }
    this.ParaSet(); //パラメーターを合わせる
}
NSprite.prototype.updateTone = function () {
    if (this._toneDuration > 0) {
        var d = this._toneDuration;
        for (var i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
};
NSprite.prototype.updateRotation = function () {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
    }
};
var _NSprite_AncNo = 0; //アンカーポイントの設定用
NSprite.prototype.AnchorSet = function () {
    switch (_NSprite_AncNo) {
        case 0: //左上
            this.anchor.x = 0;
            this.anchor.y = 0;
            break;
        case 1: //中心
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            break;
        case 2: //右上
            this.anchor.x = 1;
            this.anchor.y = 0;
            break;
    }
    _NSprite_AncNo = 0; //原点を左上に戻す
}
NSprite.prototype.Sprite_Data_Copy = function (_SetSprite) {
    this.No = _SetSprite.No;
    this._x = _SetSprite._x;
    this._y = _SetSprite._y;
    this._scaleX = _SetSprite._scaleX;
    this._scaleY = _SetSprite._scaleY;
    this._opacity = _SetSprite._opacity;
    this._blendMode = _SetSprite._blendMode;

    this._targetX = _SetSprite._targetX;
    this._targetY = _SetSprite._targetY;
    this._targetScaleX = _SetSprite._targetScaleX;
    this._targetScaleY = _SetSprite._targetScaleY;
    this._targetOpacity = _SetSprite._targetOpacity;
    this._duration = _SetSprite._duration;

    this._tone = _SetSprite._tone;
    this._toneTarget = _SetSprite._toneTarget;
    this._toneDuration = _SetSprite._toneDuration;

    this._angle = _SetSprite._angle;
    this._rotationSpeed = _SetSprite._rotationSpeed;

    this.anchor.x = _SetSprite.anchor.x;
    this.anchor.y = _SetSprite.anchor.y;

    //※EasingPicture.js対応
    this._time = _SetSprite._time;
    this._easingX = _SetSprite._easingX;
    this._easingY = _SetSprite._easingY;
    this._easingSx = _SetSprite._easingSx;
    this._easingSy = _SetSprite._easingSy;
    this._easingOp = _SetSprite._easingOp;
}

//■NSprite_アニメーション処理 -----------------------------
NSprite.prototype.initAnimation = function () {
    this.AnimeFlg = false; //アニメフラグ
    this.Aflame = 0;    //アニメフレーム
    this.ACngFlame = 0; //アニメ変更フレーム
    this.cellCnt = 0;   //横分割数
    this.ALoopFlg = false;  //アニメループフラグ

    //以下：セル表示処理用
    this.CellFlg = false; //セル表示フラグ
    this.CellNo = 0; //セル表示No
};
NSprite.prototype.AnimeSetting = function (_CellCnt, _ACngFlame, _LoopFlg) {
    var _LoopFlg = typeof _LoopFlg !== 'undefined' ? _LoopFlg : true;
    this.AnimeFlg = true;
    this.cellCnt = _CellCnt;   //横分割数
    this.ACngFlame = _ACngFlame; //アニメ変更フレーム
    this.ALoopFlg = _LoopFlg;  //アニメループフラグ
    var width = this.bitmap.width / this.cellCnt;
    //setFrameでSpriteの一部分だけを表示するようにする
    this.setFrame(0, 0, width, this.bitmap.height);
}
NSprite.prototype.updateAnimation = function () {
    if (this.AnimeFlg) {
        this.Aflame++; //アニメフレームをプラス
        if (this.Aflame % this.ACngFlame == 0) { //0のタイミングで変化
            var width = this.bitmap.width / this.cellCnt;
            var _NowCell = Math.floor(this.Aflame / this.ACngFlame);
            if (_NowCell == this.cellCnt) {
                if (this.ALoopFlg) {
                    this.Aflame = 0;
                    _NowCell = 0;
                } else {
                    this.AnimeFlg = false;
                    return;
                }
            }
            var x = _NowCell * width;
            this.setFrame(x, 0, width, this.bitmap.height);
        }
    }
    if (this.CellFlg && this.bitmap.isReady()) {
        var width = this.bitmap.width / this.cellCnt;
        var x = this.CellNo * width;
        this.setFrame(x, 0, width, this.bitmap.height);
        this.CellFlg = false;
    }
}
//特定Cellの表示
NSprite.prototype.CellSet = function (_CellSu, _CellNo) {
    this.cellCnt = _CellSu;   //横分割数
    this.CellNo = _CellNo;
    this.CellFlg = true;
    this.AnimeFlg = false;
}
