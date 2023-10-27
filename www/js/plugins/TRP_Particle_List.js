/*: @target MZ
 * @base TRP_ParticleMZ
 * @plugindesc 自作パーティクル設定の一覧
 * @help
 * Gutyu1 <weather> ＠2020/7/20
 * Gutyu2 <weather> ＠2020/7/20
 * Gutyu_Elun <weather> ＠2020/7/21
 * Gutyu_Elun2 <weather> ＠2020/7/21
 * diamonddust_1 <weather> ＠2020/5/12
 * diamonddust_w <weather> ＠2020/5/15
 * faia1 <character> ＠2020/8/17
 * faia10 <character> ＠2020/8/17
 * faia12 <character> ＠2020/8/17
 * faia2 <character> ＠---
 * faia20 <character> ＠2020/8/17
 * faia22 <character> ＠2020/8/17
 * faia3 <character> ＠2020/8/17
 * faia4 <character> ＠2020/8/17
 * faia6 <character> ＠2020/8/17
 * faia8 <character> ＠2020/8/17
 * fire <character> ＠2020/5/12
 * fire2 <character> ＠2020/5/12
 * fire3 <character> ＠2020/5/12
 * fire_c <character> ＠---
 * fire_d <character> ＠2020/8/17
 * flare_s <screen> ＠2020/5/14
 * flare_s2 <screen> ＠2020/5/14
 * illumination_1 <weather> ＠2020/5/14
 * illumination_2 <weather> ＠2020/5/14
 * kaen1 <character> ＠2020/5/12
 * kemuri1 <character> ＠2020/8/17
 * kemuri11 <character> ＠2020/8/17
 * kemuri13 <character> ＠2020/8/17
 * kemuri21 <character> ＠2020/8/17
 * kemuri23 <character> ＠2020/8/17
 * kemuri3 <character> ＠2020/8/17
 * kemuri4 <character> ＠2020/8/17
 * kemuri5 <character> ＠2020/8/17
 * kemuri7 <character> ＠2020/8/17
 * kemuri9 <character> ＠2020/8/17
 * kira_blue_c <character> ＠2020/10/5
 * kira_blue_d <character> ＠2020/10/4
 * kira_blue_e <character> ＠2020/10/4
 * kira_blue_f <character> ＠2020/10/5
 * kira_blue_g <character> ＠2020/10/5
 * kira_blue_h <character> ＠2020/10/5
 * panpan <weather> ＠2020/7/21
 * smoke_c2 <character> ＠---
 * smoke_c3 <character> ＠2020/8/17
 * test <character> ＠2023/3/5
 * test_2 <character> ＠2020/6/29
 * test_3 <character> ＠2020/5/12
 * test_4 <character> ＠2020/5/12
 * test_5 <character> ＠2020/6/29
 * test_6 <character> ＠2020/5/12
 * test_7 <character> ＠2020/7/20
 * white_1 <weather> ＠2020/5/12
 *
 * @command set_character
 * @text set/表示 > キャラ対象(40)
 * @desc パーティクル表示
 *
 * @arg id
 * @text 管理ID
 * @desc 他と被らない管理ID。「def」で設定名,「-EID」で設定名-EID
 * @default def
 *
 * @arg target
 * @text ターゲット
 * @desc thisでこのイベント。「event:イベントID」「player」「weather」など
 * @default weather
 *
 * @arg name
 * @text 《データ名》
 * @desc データ名。defとすると管理IDをデータ名として使用。（重み同じデータ名を複数表示するときは管理IDを分ける）
 * @default 《呼び出す設定を選択》
 * @type select
 * @option faia1 <character> ＠2020/8/17
 * @value faia1
 * @option faia10 <character> ＠2020/8/17
 * @value faia10
 * @option faia12 <character> ＠2020/8/17
 * @value faia12
 * @option faia2 <character> ＠---
 * @value faia2
 * @option faia20 <character> ＠2020/8/17
 * @value faia20
 * @option faia22 <character> ＠2020/8/17
 * @value faia22
 * @option faia3 <character> ＠2020/8/17
 * @value faia3
 * @option faia4 <character> ＠2020/8/17
 * @value faia4
 * @option faia6 <character> ＠2020/8/17
 * @value faia6
 * @option faia8 <character> ＠2020/8/17
 * @value faia8
 * @option fire <character> ＠2020/5/12
 * @value fire
 * @option fire2 <character> ＠2020/5/12
 * @value fire2
 * @option fire3 <character> ＠2020/5/12
 * @value fire3
 * @option fire_c <character> ＠---
 * @value fire_c
 * @option fire_d <character> ＠2020/8/17
 * @value fire_d
 * @option kaen1 <character> ＠2020/5/12
 * @value kaen1
 * @option kemuri1 <character> ＠2020/8/17
 * @value kemuri1
 * @option kemuri11 <character> ＠2020/8/17
 * @value kemuri11
 * @option kemuri13 <character> ＠2020/8/17
 * @value kemuri13
 * @option kemuri21 <character> ＠2020/8/17
 * @value kemuri21
 * @option kemuri23 <character> ＠2020/8/17
 * @value kemuri23
 * @option kemuri3 <character> ＠2020/8/17
 * @value kemuri3
 * @option kemuri4 <character> ＠2020/8/17
 * @value kemuri4
 * @option kemuri5 <character> ＠2020/8/17
 * @value kemuri5
 * @option kemuri7 <character> ＠2020/8/17
 * @value kemuri7
 * @option kemuri9 <character> ＠2020/8/17
 * @value kemuri9
 * @option kira_blue_c <character> ＠2020/10/5
 * @value kira_blue_c
 * @option kira_blue_d <character> ＠2020/10/4
 * @value kira_blue_d
 * @option kira_blue_e <character> ＠2020/10/4
 * @value kira_blue_e
 * @option kira_blue_f <character> ＠2020/10/5
 * @value kira_blue_f
 * @option kira_blue_g <character> ＠2020/10/5
 * @value kira_blue_g
 * @option kira_blue_h <character> ＠2020/10/5
 * @value kira_blue_h
 * @option smoke_c2 <character> ＠---
 * @value smoke_c2
 * @option smoke_c3 <character> ＠2020/8/17
 * @value smoke_c3
 * @option test_2 <character> ＠2020/6/29
 * @value test_2
 * @option test_3 <character> ＠2020/5/12
 * @value test_3
 * @option test_4 <character> ＠2020/5/12
 * @value test_4
 * @option test_5 <character> ＠2020/6/29
 * @value test_5
 * @option test_6 <character> ＠2020/5/12
 * @value test_6
 * @option test_7 <character> ＠2020/7/20
 * @value test_7
 *
 * @arg z
 * @text Z値
 * @desc 重なり順。above:上、below:後ろ、screen、spritesetなど。数値指定も可
 * @default def
 *
 * @arg tag
 * @text 管理タグ
 * @desc 管理用のタグ名
 *
 * @arg edit
 * @text Editモード
 * @desc ONにするとエディタを呼び出し(テストプレイ時のみ有効)
 * @default false
 * @type boolean
 *
 * @arg delay
 * @text _ディレイ
 * @desc 1以上とすると、指定フレーム後にコマンドを実効
 * @default 0
 * @type number
 * @min 0
 *
 *
 * @command set_screen
 * @text set/表示 > スクリーン/天候/リージョン(12)
 * @desc パーティクル表示
 *
 * @arg id
 * @text 管理ID
 * @desc 他と被らない管理ID。「def」で設定名,「-EID」で設定名-EID
 * @default def
 *
 * @arg target
 * @text ターゲット
 * @desc thisでこのイベント。「event:イベントID」「player」「weather」など
 * @default this
 *
 * @arg name
 * @text 《データ名》
 * @desc データ名。defとすると管理IDをデータ名として使用。（重み同じデータ名を複数表示するときは管理IDを分ける）
 * @default 《呼び出す設定を選択》
 * @type select
 * @option Gutyu1 <weather> ＠2020/7/20
 * @value Gutyu1
 * @option Gutyu2 <weather> ＠2020/7/20
 * @value Gutyu2
 * @option Gutyu_Elun <weather> ＠2020/7/21
 * @value Gutyu_Elun
 * @option Gutyu_Elun2 <weather> ＠2020/7/21
 * @value Gutyu_Elun2
 * @option diamonddust_1 <weather> ＠2020/5/12
 * @value diamonddust_1
 * @option diamonddust_w <weather> ＠2020/5/15
 * @value diamonddust_w
 * @option flare_s <screen> ＠2020/5/14
 * @value flare_s
 * @option flare_s2 <screen> ＠2020/5/14
 * @value flare_s2
 * @option illumination_1 <weather> ＠2020/5/14
 * @value illumination_1
 * @option illumination_2 <weather> ＠2020/5/14
 * @value illumination_2
 * @option panpan <weather> ＠2020/7/21
 * @value panpan
 * @option white_1 <weather> ＠2020/5/12
 * @value white_1
 *
 * @arg z
 * @text Z値
 * @desc 重なり順。above:上、below:後ろ、screen、spritesetなど。数値指定も可
 * @default def
 *
 * @arg tag
 * @text 管理タグ
 * @desc 管理用のタグ名
 *
 * @arg edit
 * @text Editモード
 * @desc ONにするとエディタを呼び出し(テストプレイ時のみ有効)
 * @default false
 * @type boolean
 *
 * @arg delay
 * @text _ディレイ
 * @desc 1以上とすると、指定フレーム後にコマンドを実効
 * @default 0
 * @type number
 * @min 0
 *
 *
 * @command play_character
 * @text play/１回再生 > キャラ対象(1)
 * @desc パーティクルを１回だけ再生
 *
 * @arg id
 * @text 管理ID
 * @desc 他と被らない管理ID。「def」で設定名,「-EID」で設定名-EID
 * @default def
 *
 * @arg target
 * @text ターゲット
 * @desc thisでこのイベント。「event:イベントID」「player」「weather」など
 * @default weather
 *
 * @arg name
 * @text 《データ名》
 * @desc データ名。defとすると管理IDをデータ名として使用。（重み同じデータ名を複数表示するときは管理IDを分ける）
 * @default 《呼び出す設定を選択》
 * @type select
 * @option test <character> ＠2023/3/5
 * @value test
 *
 * @arg z
 * @text Z値
 * @desc 重なり順。above:上、below:後ろ、screen、spritesetなど。数値指定も可
 * @default def
 *
 * @arg tag
 * @text 管理タグ
 * @desc 管理用のタグ名
 *
 * @arg edit
 * @text Editモード
 * @desc ONにするとエディタを呼び出し(テストプレイ時のみ有効)
 * @default false
 * @type boolean
 *
 * @arg delay
 * @text _ディレイ
 * @desc 1以上とすると、指定フレーム後にコマンドを実効
 * @default 0
 * @type number
 * @min 0
 *
 *
 *
 * @requiredAssets img/particles/star_thin
 * @requiredAssets img/particles/star2
 * @requiredAssets img/particles/shine_thin3
 * @requiredAssets img/particles/smoke2
 * @requiredAssets img/particles/smoke1
 * @requiredAssets img/particles/smog1
 * @requiredAssets img/particles/smog2
 * @requiredAssets img/particles/flare2
 * @requiredAssets img/particles/particle4
 * @requiredAssets img/particles/heart2
 * @requiredAssets img/particles/star_thin2
 * @requiredAssets img/particles/heart1g
 * @requiredAssets img/particles/particle2
 * @requiredAssets img/particles/shine2
 */