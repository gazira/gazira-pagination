var $ = require('jquery');
var Widget = require('widget');
var Templatable = require('templatable');
require('ajax.single');

var Pagination = Widget.extend({
    Implements: Templatable,
    attrs: {
        pageSize: 10, // 每页数量
        current: { // 当前页
            value: 1,
            setter: function (val) {
                var totalPage = Math.ceil(this.get('total') / this.get('pageSize'));
                if (!val) {
                    return Math.min(Math.max(val, 1), totalPage);
                } else {
                    val = +val || 1;
                    if (val > totalPage) {
                        val = totalPage;
                    }
                    return val < 1 ? 1 : val;
                }
            }
        },
        total: { // 数据总数
            value: 0,
            setter: function (val) {
                var current = this.get('current');
                val = +val || 0;
                var totalPage = Math.ceil(val / this.get('pageSize'));
                if(totalPage < current) {
                    this.set('current', totalPage);
                }
                return val;
            }
        },
        classPrefix: 'ui-pagination',
        template: '<div class="{{classPrefix}}"></div>',
        action: function (page, node) { // 点击分页响应
        }
    },
    parseElement: function () {
        this.set("model", {
            classPrefix: this.get('classPrefix')
        });
        Pagination.superclass.parseElement.call(this);
    },
    setup: function () {
        Pagination.superclass.setup.call(this);
        this._init = true;
    },
    events: {
        'click [data-page]': function (e) { // 点击分页事件
            var node = $(e.target);
            if (!node.attr('data-disabled')) {
                this.get('action').call(this, node, node.attr('data-page'));
            }
            e.preventDefault();
        }
    },
    /**
     * 视图，自定义显示的话需要重写此方法
     */
    render: function (params) {
        params = params || {};
        if (params.total) {
            this.set('total', params.total);
        }
        if (params.current) {
            this.set('current', params.current);
        }
        if (params.pageSize) {
            this.set('pageSize', params.pageSize);
        }
        this.element.html(this.view());
        Pagination.superclass.render.call(this);
        return this;
    },
    view: function () {
        var total = this.get('total');
        var totalPage = Math.ceil(total / this.get('pageSize'));
        var current = this.get('current');
        var i;
        var split = '<span>...</span>';
        var html = '';

        html += '<span>总数：' + total + '</span>';
        html += this.prevTemplate();

        if (totalPage > 5 && current > 3) {
            html += this.itemTemplate(1);
        }

        if (totalPage <= 5) {
            for (i = 1; i < totalPage + 1; i++) {
                html += this.itemTemplate(i);
            }
        } else {
            if (current <= 3) {
                for (i = 1; i <= 5; i++) {
                    html += this.itemTemplate(i);
                }
                html += split;
            } else if (current >= totalPage - 2) {
                html += split;
                for (i = 1; i <= 5; i++) {
                    var p = totalPage - 5 + i;
                    html += this.itemTemplate(p);
                }
            } else {
                html += split;
                html += this.itemTemplate(current - 1);
                html += this.itemTemplate(current);
                html += this.itemTemplate(current + 1);
                html += split;
            }
        }
        if (totalPage > 5 && current < totalPage - 2) {
            html += this.itemTemplate(totalPage);
        }
        html += this.nextTemplate();

        return html;
    },
    itemTemplate: function (page) {
        var html = '<a href="#" ';
        if (page == this.get('current')) {
            html += 'class="active" ';
        }
        html += 'data-page="' + page + '">' + page + '</a>';
        return html;
    },
    prevTemplate: function () {
        var current = this.get('current');
        var html = '<a class="previous ';
        if (current <= 1) {
            html += 'disabled" data-disabled="1 ';
        }
        html += '" href="#" data-page="' + (current - 1) + '">上一页</a>';
        return html;
    },
    nextTemplate: function () {
        var current = this.get('current');
        var totalPage = Math.ceil(this.get('total') / this.get('pageSize'));
        var html = '<a class="next ';
        if (current >= totalPage) {
            html += 'disabled " data-disabled="1 ';
        }
        html += '" href="#" data-page="' + (current + 1) + '">下一页</a>';
        return html;
    }
});

module.exports = Pagination;
