﻿/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Dec 20 22:27
*/
/**
 * strikeThrough button
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/strike-through/index", function (S, Editor, ui, cmd) {

    function StrikeThrough() {
    }

    S.augment(StrikeThrough, {
        pluginRenderUI:function (editor) {
            cmd.init(editor);
            editor.addButton("strikeThrough", {
                cmdType:"strikeThrough",
                tooltip:"删除线 "
            }, ui.Button);
        }
    });

    return StrikeThrough;
}, {
    requires:['editor', '../font/ui', './cmd']
});
