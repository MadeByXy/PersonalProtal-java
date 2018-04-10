var app = angular.module('app', ['ui.router', 'oc.lazyLoad']);
localStorage.clear();

//图片404后可以由指定错误图片代替，用法： err-src='src'
app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return attrs['ngSrc'];
            }, function (value) {
                if (!value) {
                    element.attr('src', attrs.errSrc);
                }
            });
            element.bind('error', function () {
                element.attr('src', attrs.errSrc);
            });
        }
    }
});

//输入enter键后执行指定方法，用法： ng-enter=func
app.directive('ngEnter', function () {
    return {
        link: function (scope, element, attrs) {
            $(element[0]).keydown(function (event) {
                if (event.which == 13) {
                    if (attrs.ngEnter) {
                        eval(attrs.ngEnter.replace(/([\[\]a-zA-Z0-9$\.]+)/g, 'scope.$1'));
                        scope.$apply();
                    }
                }
            })
        }
    }
});

//通用提示窗体
app.Hint = function (message) {
    $.niftyNoty({message: message, timer: 2000, container: '.nifty-noty', type: 'info primary-fix'})
};

//日期选择器，用法： ng-date
app.directive('ngDate', function () {
    return {
        require: 'ngModel',
        link: (scope, element, attrs, ctrl) => {
            $(element[0]).datetimepicker({
                language: 'zh-CN',
                autoclose: true,  //选中关闭
                todayHighlight: true,
                format: 'yyyy-mm-dd',
                minView: "month"  //设置只显示到月份
            })

            $(element[0]).click(function () {
                $(element[0]).datetimepicker('update');
            })

            $(element[0]).change(function () {
                scope.$apply(function () {
                    ctrl.$setViewValue($(element[0]).val());
                })
            })
        }
    }
});

//时间选择器，用法： ng-time
app.directive('ngTime', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            $(element[0]).datetimepicker({
                language: 'zh-CN',
                format: 'yyyy-mm-dd hh:ii:00',
                todayHighlight: true,
                autoclose: true  //选中关闭
            })

            $(element[0]).click(function () {
                $(element[0]).datetimepicker('update');
            })

            $(element[0]).change(function () {
                scope.$apply(function () {
                    ctrl.$setViewValue($(element[0]).val());
                })
            })
        }
    }
});

//文件在线预览，用法： ng-preview="fileId"
app.directive('ngPreview', function () {
    return {
        scope: {
            ngPreview: '='
        },
        link: function (scope, element, attrs, ctrl) {
            var fileId = scope.ngPreview;
            $(element[0]).click(function () {
                $.get("/Api/Attach/GetAttachInfo", {fileid: fileId}, function (file) {
                    bootbox.dialog({
                        className: 'file_preview',
                        title: '文件预览【' + file.RealName + '】',
                        message: '<iframe src="/views/attach/view.html?fileId=' + fileId + '"></iframe>'
                    })
                    $('.file_preview .modal-dialog .modal-content .modal-header').append(
                        '<a href="' + file.FilePath + '" target="_blank" class="ion-archive download" title="下载" download="' + file.RealName + '"></a>');
                }, "json");
            })
        }
    }
});

//拖动控件， 用法：ng-sortable=options, ngSortableComplete=callback
app.directive('ngSortable', function () {
    return {
        scope: {
            ngSortable: "=ngSortable",
            ngSortableComplete: "&ngSortableComplete"
        },
        link: function (scope, element, attrs, ctrl) {
            scope.$watch(function () {
                return scope.ngSortable;
            }, function (value) {
                $(element[0]).sortable($.extend({
                    scroll: false,
                    axis: 'y',
                    revert: true,
                    update: function (event, ui) {
                        //回调方法
                        if (attrs.ngSortableComplete) {
                            scope.ngSortableComplete({
                                id: ui.item.attr('sortable-id'),
                                dom: ui.item,
                                order: ui.item.index() + 1
                            })
                        }
                    }
                }, value || {}));

                $(element[0]).disableSelection();
            })
        }
    }
});

//title美化（支持html），用法： ng-tooltip
app.directive('ngTooltip', function () {
    return {
        link: function (scope, element, attrs, ctrl) {
            $(element[0]).mouseover(function () {
                $(element[0]).tooltip({html: true});
                $(element[0]).tooltip('show');
            })

            //离开时销毁tooltip，防止title值更改引起的显示异常
            $(element[0]).mouseleave(function () {
                try {
                    $(element[0]).tooltip('destroy');
                } catch (e) {
                }
            })
        }
    }
});

//下拉控件， 用法：ng-select
//ps: 搜索模式：data-live-search="true"
app.directive('ngSelect', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            $(element[0]).change(function (e) {
                // 从 onchange 函数中更新数据
                scope.$apply(function () {
                    var value = $(element[0]).val();
                    var match = value.match(new RegExp('^([a-z]*):'));
                    if (match) {
                        value = value.replace(match[0], '');
                        switch (match[1]) {
                            case 'number':
                                value = parseFloat(value);
                                break;
                            case 'boolean':
                                value = value.toLowerCase() == 'true';
                                break;
                            default:
                                break;
                        }
                    }
                    ctrl.$setViewValue(value);
                });
            })

            $(element[0]).selectpicker({noneSelectedText: '未选择', noneResultsText: '未搜索到 {0}'});

            var optionsModel = '';
            if (attrs.ngOptions) {
                //如果是通过ng-options绑定的option，获取数据源名称
                optionsModel = attrs.ngOptions.split(' in ')[1].trim();
            }

            scope.$watch(function () {
                if (optionsModel) {
                    //如果是通过ng-options绑定的option，同时监听值和内容
                    return {value: ctrl.$modelValue, options: scope[optionsModel]};
                } else {
                    return ctrl.$modelValue;
                }
            }, function (value) {
                setTimeout(function () {
                    $(element[0]).selectpicker('refresh');
                }, 0)

            }, true)
        }
    };
});

//滚动条控件
app.directive('ngScrolling', function () {
    return {
        scope: {
            ngScrolling: '='
        },
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            $(element[0]).niceScroll($.extend({
                spacebarenabled: false,
                horizrailenabled: false,
                cursorcolor: "#428bca",
                cursoropacitymax: 1,
                touchbehavior: false,
                cursorwidth: "4px",
                cursorborder: "0",
                cursorborderradius: "0"
            }, scope.ngScrolling));
        }
    };
})

//CheckBox控件， 用法：ng-switch
app.directive('ngSwitch', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var switchChery = new Switchery(element[0]);
            $(element[0]).change(function (e) {
                scope.$apply(function () {
                    ctrl.$setViewValue($(e.currentTarget).prop('checked'));
                });
            });

            //当model值更新后，同步更新数据到控件中
            scope.$watch(function () {
                return ctrl.$modelValue
            }, function (value) {
                setTimeout(function () {
                    switchChery.handleOnchange(value);
                }, 0)
            })
        }
    };
})

//Upload控件， 用法：ng-upload
//#如需批量上传请在dom元素中添加multiple，默认单个上传
//#如需控制上传类型请在dom元素中添加accept='{type}'，默认允许全部类型
app.directive('ngUpload', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            //随机生成id
            var id = Math.random().toString().replace('0.', '') + '_upload';
            $(element[0]).attr('id', id);

            //去除该值会造成a标签无法正确执行功能
            $(element[0]).attr('href', 'javascript:void(0);');

            var multiple = $(element[0]).attr('multiple') != undefined;
            var mimeTypes = $(element[0]).attr('accept') || '*';
            var uploader = WebUploader.create({
                auto: true,
                server: '/Api/Attach/UploadFile',
                pick: {id: '#' + id, multiple: multiple},
                chunked: true,
                resize: true,
                duplicate: true,
                formData: {},
                accept: {
                    title: '上传类型限制',
                    extensions: '*',
                    mimeTypes: mimeTypes
                }
            });

            //文件上传时触发
            uploader.onUploadStart = function (file) {
                //赋值guid--用来分片上传
                uploader.options.formData.guid = WebUploader.Base.guid();
            }

            // 当有文件添加进来的时候
            uploader.on('fileQueued', function (file) {
                //添加进度条
                if (file.name != 'Untitled') {
                    //上传时添加disabled属性，避免重复点击
                    $(element[0]).find('input[type=file]').attr('disabled', 'disabled');

                    $('#' + id + ' .progress').remove();
                    $('#' + id).append(
                        '<div class="progress" style="position: absolute; bottom: 0; width: 100%; margin: 0; height: 3px; ">\
                            <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>\
                         </div>');
                }
            });

            // 文件上传过程中创建进度条实时显示。
            uploader.on('uploadProgress', function (file, percentage) {
                $('#' + id + ' .progress .progress-bar').css('width', percentage * 100 + '%');
            });

            // 文件上传成功
            uploader.on('uploadSuccess', function (file, data) {
                var bar = $('#' + id + ' .progress .progress-bar');
                if (data.success) {
                    //上传成功，更新ng-model值
                    scope.$apply(function () {
                        console.log(data.obj)
                        ctrl.$setViewValue(data.obj);
                    });
                } else {
                    //上传失败
                    bar.removeClass('progress-bar-info');
                    bar.addClass('progress-bar-danger');
                    app.Hint(data.message);
                }
            });

            // 文件上传失败，显示上传出错。
            uploader.on('uploadError', function (file, reason) {
                var bar = $('#' + id + ' .progress .progress-bar');
                bar.removeClass('progress-bar-info');
                bar.addClass('progress-bar-danger');
                app.Hint('上传失败');
            });

            // 完成上传，无论成功或者失败，先删除进度条。
            uploader.on('uploadComplete', function (file) {
                setTimeout(function () {
                    //上传后移除disabled属性
                    $(element[0]).find('input[type=file]').removeAttr('disabled');

                    $('#' + id).find('.progress').remove();

                    //上传后清空文件
                    $(element[0]).find('input[type=file]').val('');
                }, 500);
            });
        }
    };
})

//富文本编辑器， 用法：ng-editor
app.directive('ngEditor', function () {
    return {
        scope: {
            ngEditor: '='
        },
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            // 创建编辑器
            var editor = new wangEditor(element[0]);
            if (attrs.ngEditor) {
                scope.ngEditor = editor;
            }

            editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'image',  // 插入图片
                'table',  // 表格
                'code',  // 插入代码
                'undo',  // 撤销
                'redo',  // 重复
            ]

            var priData = '';
            editor.customConfig.onchange = function (html) {
                priData = encodeURIComponent(encodeURIComponent(html));

                // 从 onchange 函数中更新数据
                scope.$apply(function () {
                    ctrl.$setViewValue(priData);
                });
            };
            editor.create();

            scope.$watch(function () {
                return ctrl.$modelValue;
            }, function (value) {
                //如果model值是因为内容数据引起变化， 不去更新控件
                if ((value || '') == priData) {
                    return;
                }

                setTimeout(function () {
                    editor.txt.html(decodeURIComponent(decodeURIComponent(value || '')));
                }, 0)
            })
        }
    };
});

//Angular注册器， 用于动态添加Controller
var ControllerProvider;
app.config(function ($controllerProvider) {
    ControllerProvider = $controllerProvider;
})

//工厂类
app.factory('factory', function ($http, $sce, $q, $rootScope, $ocLazyLoad) {
    var service = {};

    //网络请求(异步)
    //@url：接口地址
    //@data：接口参数
    //@func：返回后执行的操作
    service.Query = function (url, data, func) {
        if (service.IsNull(url)) {
            service.Alert('请求地址不能为空', '操作失败');
            return;
        }

        var cacheName = url + JSON.stringify(data || {});
        var cache = localStorage.getItem(cacheName);

        //禁止缓存接口列表
        var lowerUrl = url.toLowerCase();
        var disabledCaching = ['add', 'set', 'del', 'remove', 'edit', 'sort', 'insert'];
        if (disabledCaching.any(item => lowerUrl.contains(item))) {
            cache = null;
        }

        var httpQuery = {
            //开始网络请求
            query: function (url, data, func, loadCache) {
                var array = [];
                $.each(data, function (key, value) {
                    array.push({
                        key: key,
                        value: encodeURIComponent(typeof(value) == "object" ? JSON.stringify(value) : value)
                    });
                })
                var obj = this;
                $http({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: array.select(item => item.key + '=' + item.value).join('&')
                }).success(data => {
                    obj.dealResult(data, func, false, loadCache);
                }).error(data => {
                    obj.dealResult(data, func, true);
                })
            },
            //对请求结果的处理
            //@data: 接口返回的数据
            //@func: 回调方法
            //@isFail: 接口是否成功返回(200)
            dealResult: function (data, func, isFail, loadCache) {
                loadCache = loadCache || false;
                if (isFail) {
                    //打印异常接口及信息，方便调试
                    //console.log(url, data);

                    service.Alert(data.ExceptionMessage || data.Message || data.message || data, '接口发生异常');
                } else {
                    try {
                        if (!data.success) {
                            //打印异常接口及信息，方便调试
                            //console.log(url, data);

                            service.Alert(data.message, '操作失败');
                            return;
                        }
                    } catch (e) {
                    }

                    if (cache.isUpdate) {
                        //console.log('更新成功')
                    }

                    if (loadCache) {
                        if ((!loadCache || !_.isEqual(cache.result, data))) {
                            //console.log('数据二次更新成功', cache.result, data)
                        } else {
                            //console.log('数据无须二次更新', cache.result, data)
                        }
                    }

                    if (func && (!loadCache || JSON.stringify(cache.result) != JSON.stringify(data))) {
                        //如果读取缓存模式，仅当接口结果与缓存不同时更新数据
                        func(service.Clone(data));
                    }

                    //更新缓存结果数据
                    cache.isUpdate = false;
                    cache.time = Date.parse(new Date());
                    cache.result = data;
                    localStorage.setItem(cacheName, JSON.stringify(cache));
                }
            }
        }

        if (cache) {
            cache = JSON.parse(cache);

            if (Date.parse(new Date()) - cache.time > Enum.CacheExpirationTime) {
                //console.log('过期缓存请求')
                //缓存过期同未缓存做相同处理
                cache = {
                    time: Date.parse(new Date()),
                    isUpdate: true,
                    result: null
                }
                localStorage.setItem(cacheName, JSON.stringify(cache));

                //开始网络请求
                httpQuery.query(url, data, func);
            } else {
                if (!cache.isUpdate) {
                    //如果缓存没有更新，更新缓存
                    cache.isUpdate = true;
                    localStorage.setItem(cacheName, JSON.stringify(cache));

                    if (cache.result) {
                        if (Date.parse(new Date()) - cache.time > Enum.CacheIgnoredTime) {
                            //如果已存在结果，先返回请求，再更新数据
                            //console.log('缓存返回（更新）')
                            httpQuery.dealResult(cache.result, func);
                            httpQuery.query(url, data, func, true);
                        } else {
                            //如果多次重复请求, 合并成一次请求
                            //console.log('缓存返回（合并）')
                            httpQuery.dealResult(cache.result, func);
                        }
                    } else {
                        //console.log('无结果更新')
                        //如果不存在结果，请求接口以获取结果数据
                        httpQuery.query(url, data, func);
                    }
                } else {
                    if (cache.result) {
                        //如果已存在结果，直接返回缓存结果
                        //console.log('缓存返回')
                        httpQuery.dealResult(cache.result, func);
                    } else {
                        //console.log('无结果等待')
                        //如果不存在结果，等待接口返回结果
                        setTimeout(function () {
                            service.Query(url, data, func);
                        }, 50)
                    }
                }
            }
        } else {
            //console.log('无缓存请求')
            cache = {
                time: Date.parse(new Date()),
                isUpdate: true,
                result: null
            }
            localStorage.setItem(cacheName, JSON.stringify(cache));

            //开始网络请求
            httpQuery.query(url, data, func);
        }
    }

    //网络请求(同步)
    //@url：接口地址
    //@data：接口参数
    //@func：返回后执行的操作
    service.QuerySync = function (url, data, func) {
        jQuery.ajax({
            method: 'POST',
            url: url,
            async: false,
            contentType: 'application/x-www-form-urlencoded',
            data: data,
            success: function (data) {
                if (func) {
                    func(data);
                }
            },
            error: function (data) {
                service.Alert(data.ExceptionMessage || data.Message || data, '接口发生异常');
            }
        })
    }

    //安全转换Html
    service.Html = function (text) {
        text = text || '';
        try {
            text = decodeURIComponent(text);
        } catch (e) {
        }
        return $sce.trustAsHtml(text);
    }

    //返回元素的深度克隆体
    service.Clone = function (obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    //打开新页面
    //@templateUrl: 页面地址
    //@title: 页面标题
    //@data: 页面参数
    //@options: 额外按钮
    //@files: controller文件
    service.OpenNewPage = function (templateUrl, title, data, options, files) {
        //打开页面前先加载页面所需控制器js
        service.LoadControllers(files || templateUrl.replace('.html', '.js'), function () {
            $rootScope.$broadcast('OpenNewPage', {
                templateUrl: templateUrl,
                title: title,
                data: data,
                options: options || []
            })
        })
    }

    //非空判断
    service.IsNull = function (text) {
        return text == null || text == undefined || text == '';
    }

    //获取请求参数
    //@name: 参数名称
    service.GetQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    //提示窗
    service.Alert = function (message, title, callback, buttonText) {
        bootbox.alert({
            title: title || '提示',
            message: message,
            buttons: {
                ok: {
                    label: buttonText || '关闭',
                    className: "btn-primary"
                }
            },
            callback: callback
        })
    }

    //警告窗
    service.Confirm = function (message, title, callback, successText, errorText) {
        bootbox.confirm({
            title: title || '警告',
            message: message,
            buttons: {
                confirm: {
                    label: successText || '确定',
                    className: 'btn-success'
                },
                cancel: {
                    label: errorText || '关闭',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    (callback || function () {
                    })()
                }
            }
        })
    }

    //提示框（自动隐藏）
    service.Hint = function (message) {
        app.Hint(message);
    }

    //当前IP所在城市
    service.City = remote_ip_info.city;

    //异步加载控制器
    //@files: 控制器文件
    //@callback: 回调方法
    service.LoadControllers = function (files, callback) {
        $ocLazyLoad.load([
            {files: Array.isArray(files) ? files : [files], serie: true}
        ]).then(function () {
            if (callback) {
                callback();
            }
        }, function (err) {
            service.Alert(err, '控制器加载失败');
        });
    }

    //加载右边框模板文件
    $http.get('/Views/Plugins/rightDialog.html').success(function (data) {
        service.rightDialog = data;
    });

    //打开右边框
    //@templateUrl: 内容url
    //@title: 弹框标题
    //@buttons: 操作按钮，第一个会被置为高亮，dataCheck中传入数据验证值， 其中enumArray为enum.js中AllowType枚举
    //          格式：[{text: 'button1', action: func, dataCheck: [{key: '', name: '', allowTypes: enumArray}]}]
    //@width: 页面宽度(px)，未传入将按照默认宽度展示
    //@initData: 初始化参数，用于需要注入初始值的页面
    //@options：自定义按钮，格式：[{icon: 'icon_edit', action: func}]
    service.OpenDialog = function (templateUrl, title, buttons, width, initData, options) {
        if (service.IsNull(templateUrl)) {
            return;
        }

        var id = templateUrl.replace(/[^a-zA-Z]/g, '');
        var scope = $('div[ng-controller="RightDialog_' + id + 'Controller"]').scope();
        if (scope) {
            //第二次弹窗时直接初始化
            scope.Init(templateUrl, title, buttons, width, initData, options);
        } else {
            var data = service.rightDialog.replace('ReplaceId', id);
            $('body').append(data);

            registerController(id, "RightDialog_" + id + "Controller", function ($scope, factory) {
                $scope.IsOpen = false;
                $scope.factory = factory;

                $scope.Init = function (templateUrl, title, buttons, width, initData, options) {
                    //打开页面前先加载页面所需控制器js
                    factory.LoadControllers(templateUrl.replace('.html', '.js'), function () {
                        $scope.Options = options || [];

                        $scope.Width = width || 300;
                        $scope.Title = title || '';
                        $scope.Buttons = buttons || [{text: '关闭'}];
                        $scope.Src = templateUrl;

                        //延迟开启，避免直接出现
                        setTimeout(function () {
                            //重计算内容高度
                            $('.srolling').css('height', 'calc(100% - ' + $scope.FixHeight() + 'px)');

                            $scope.Open();

                            //传递初始化数据
                            $scope.$broadcast('Init', initData);
                            $scope.$apply();
                        }, 100);
                    })
                }

                //执行自定义按钮
                $scope.CustomButton = function (index) {
                    ($scope.Options[index].action || function () {
                    })();
                }

                $scope.Close = function () {
                    $scope.IsOpen = false;
                }

                $scope.Open = function () {
                    $scope.IsOpen = true;
                }

                //重计算内容高度
                $scope.FixHeight = function () {
                    var height = 20;
                    if (!factory.IsNull($scope.Title)) {
                        height += 43;
                    }

                    if ($scope.Buttons.length > 0) {
                        height += 55;
                    }
                    return height;
                }

                //执行按键功能
                $scope.ButtonClick = function (func, dataCheck) {
                    $scope.InvokeFunc = func || function () {
                        return true;
                    }
                    $scope.InvokeDataCheck = dataCheck || [];

                    if ($scope.InvokeFunc.length == 0) {
                        //不需要数据的方法，直接返回结果
                        if ($scope.InvokeFunc()) {
                            $scope.Close();
                        }
                    } else {
                        //通知子controller准备结果数据
                        $scope.$broadcast('ReadyFinish');
                    }
                }

                //获取子级结果
                $scope.$on('Finish', function (event, data) {
                    if ($scope.CheckData(data, $scope.InvokeDataCheck) && $scope.InvokeFunc(data)) {
                        $scope.Close();
                    }
                })

                //数据检测
                $scope.CheckData = function (data, checks) {
                    var result = true;
                    $.each(checks || [], function (index, check) {
                        if (result == false) {
                            return false;
                        }

                        var currentData;
                        if (typeof (check.key) == 'function') {
                            currentData = check.key(data);
                        } else {
                            currentData = factory.IsNull(check.key) ? data : data[check.key];
                        }

                        $.each(check.allowTypes || [], function (typeIndex, checkType) {
                            switch (checkType) {
                                case Enum.AllowType.NonEmpty:  //非空验证
                                    if (factory.IsNull(currentData)) {
                                        factory.Hint(check.name + '不能为空');
                                        result = false;
                                        return false;
                                    }
                                    break;
                                case Enum.AllowType.Boolean:  //布尔值验证
                                    var match = new RegExp('^(true|false|1|0)$', 'ig');
                                    if ((currentData || '').toString().match(match) == null) {
                                        factory.Hint(check.name + '必须为布尔类型');
                                        result = false;
                                        return false;
                                    }
                                    break;
                                case Enum.AllowType.PositiveInteger:  //正整数验证
                                    var match = new RegExp('^[0-9]*$');
                                    if ((currentData || '').toString().match(match) == null) {
                                        factory.Hint(check.name + '必须为正整数');
                                        result = false;
                                        return false;
                                    }
                                    break;
                                case Enum.AllowType.Integer:  //整数验证
                                    var match = new RegExp('^(-[0-9]+|[0-9]*)$');
                                    if ((currentData || '').toString().match(match) == null) {
                                        factory.Hint(check.name + '必须为整数');
                                        result = false;
                                        return false;
                                    }
                                    break;
                                case Enum.AllowType.Digital:  //数字验证
                                    if (isNaN(currentData)) {
                                        factory.Hint(check.name + '必须为数字');
                                        result = false;
                                        return false;
                                    }
                                    break;
                                case Enum.AllowType.Email:  //邮箱验证
                                    var match = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$');
                                    if ((currentData || '').toString().match(match) == null) {
                                        factory.Hint(check.name + '不是正确的邮箱类型');
                                        result = false;
                                        return false;
                                    }
                                    break;
                                case Enum.AllowType.Mobile:  //手机号码验证
                                    var match = new RegExp('^1[3|4|5|8][0-9]\d{4,8}$ ');
                                    if ((currentData || '').toString().match(match) == null) {
                                        factory.Hint(check.name + '不是正确的手机号码');
                                        result = false;
                                        return false;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        })
                    })
                    return result;
                }

                $scope.Init(templateUrl, title, buttons, width, initData, options);
            })
        }

        //注册控制器
        function registerController(elementId, controllerName, func) {
            $("#" + elementId).attr("ng-controller", controllerName);

            ControllerProvider.register(controllerName, func);

            $("#" + elementId).injector().invoke(function ($compile, $rootScope) {
                $compile($("#" + elementId))($rootScope);
            });
        }
    }

    return service;
});