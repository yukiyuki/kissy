/**
 * test loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    var d = window.location.href.replace(/[^/]*$/, "") + "../data/";

    describe("getStyle", function () {

        it("should callback after css onload", function () {

            var html = "\
                <div id='special'>\
                33px\
            </div>\
            <div id='special2'>\
            44px\
            </div>";

            $(html).appendTo('body');

            var state = 0;

            expect($('#special').css("height")).not.toBe("330px");

            S.getScript(d + "getStyle/height.css", function () {
                setTimeout(function () {
                    expect($('#special').css("height")).toBe("330px");
                    state++;
                    // breath
                }, 100);

            });

            // cross domain
            var d2 = d.replace(":8888", ":9999");
            S.getScript(d2 + "getStyle/height2.css", function () {
                setTimeout(function () {
                    expect($('#special2').css("height")).toBe("440px");
                    state++;
                    // breath
                }, 100);
            });

            waitsFor(function () {
                return state == 2;
            }, 10000);

            runs(function () {
                $('#special').remove();
                $('#special2').remove();
            });
        });
    });

    describe("loader", function () {

        it("should load and attach custom mods correctly", function () {

            KISSY.config({
                packages: [
                    {
                        name: "1.2", //包名
                        tag: "20110323",
                        path: d //包对应路径，相对路径指相对于当前页面路径

                    }
                ]
            });

            $(document.body).append("<div id='k11x'/>");
            $(document.body).append("<div id='k12'/>");

            var ok = false;

            S.use("1.2/mod", function (S, Mod) {
                ok = true;
                expect(Mod).toBe(2);
                var mod12;
                var flag = S.config('combine') ? "1.2/??mod.js" : "1.2/mod.js";
                var scripts = document.getElementsByTagName("script");
                for (var i = 0; i < scripts.length; i++) {
                    var script = scripts[i];
                    if (script.src.indexOf(flag) > -1) {
                        mod12 = script;
                        break;
                    }
                }
                expect(mod12.async).toBe(true);
                expect(mod12.charset).toBe("utf-8");
                expect($("#k12").css("width")).toBe('111px');

            });

            waitsFor(function () {
                return ok;
            }, "1.2/mod never loaded");


        });

        it("detect cyclic dependency", function () {

            // 弹框！
            if (S.UA.ie == 6) {
                return;
            }

            var old = KISSY.Config.base;
            KISSY.config({
                packages: [
                    {
                        name: "cyclic",
                        path: "../others/loader/"
                    }
                ]

            });
            var oldError = S.error, err = [];

            S.error = function (args) {
                err.push(args);
                oldError(args[0]);
            };

            KISSY.use("cyclic/a");

            waitsFor(function () {
                if (err.length == 1) {
                    return err[0] == 'find cyclic dependency between mods: cyclic/a,cyclic/b,cyclic/c,cyclic/a';
                }
            }, 10000);

            runs(function () {
                S.error = oldError;
                KISSY.Config.base = old;
            });
        });

        it("map config works", function () {

            S.clearLoader();

            KISSY.config({
                packages: [
                    {
                        name: "1.2", //包名
                        tag: "20110323",
                        path: d //包对应路径，相对路径指相对于当前页面路径

                    }
                ],
                map: [
                    [/(.+)mod.js(.+)$/, "$1mod-min.js$2"]
                ]
            });

            var ok = 0;

            S.use("1.2/mod", function (S, Mod) {
                ok = 1;
                expect(Mod).toBe(2);
            });

            waitsFor(function () {
                return ok;
            }, "1.2/mod never loaded");

        });

    });


})(KISSY);

