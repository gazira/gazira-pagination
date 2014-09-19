var $ = require('component/jquery@1.0.0');
var Pagination = require('../index');

$(function () {
    var p1 = new Pagination({
        parentNode: '#p1',
        action: function (node, page) {
            this.render({
                current: page
            });
        }
    });
    var nodes = {
        total: $('#total'),
        pageSize: $('#per_page'),
        current: $('#current')
    };
    var pages = function (total, pageSize) {
        var totalPage = Math.ceil(total / pageSize);
        var html = [];
        for (var i = 1; i <= totalPage; i++) {
            html[i] = '<option value="' + i + '">' + i + '</option>';
        }
        nodes.current.html(html.join(''));
    };
    pages(nodes.total.val(), nodes.pageSize.val());

    p1.render({
        total: nodes.total.val(),
        pageSize: nodes.pageSize.val(),
        current: nodes.current.val()
    });

    nodes.total.change(function () {
        pages(this.value, nodes.pageSize.val());
        p1.render({
            total: this.value,
            current: nodes.current.val()
        });
    });
    nodes.pageSize.change(function () {
        pages(nodes.total.val(), this.value);
        p1.render({
            pageSize: this.value,
            current: nodes.current.val()
        });
    });
    nodes.current.change(function () {
        p1.render({
            current: this.value
        });
    });

    // ajax例子
    var req = function (page) {
        var box = $('#data2');
        $.ajax({
            url: './data.php',
            data: {
                page: page
            },
            beforeSend: function () {
                box.html('loading...');
                p2.render({ // 点击后就将分页视图切换
                    current: page
                });
            },
            single: { // 最佳实践: 使用ajax single auto模式
                name: p2.cid,
                rule: 'auto'
            }
        }).done(function (data) {
            box.html('数据取到');
            p2.render({
                total: data.data.total
            });
        });
    };
    var p2 = new Pagination({
        parentNode: '#p2',
        action: function (node, page) {
            req(page);
        }
    });
    req(1);

    // 自定义模板
    var MyPagination = Pagination.extend({
        view: function() {
            var total = this.get('total');
            var current = this.get('current');
            var pageSize = this.get('pageSize');
            var totalPage = Math.ceil(total / pageSize);
            var html = '';
            html += '<span>总共' + total + '条，' + totalPage + '页</span>，';
            html += '<span>每页' + pageSize + '条</span>，';
            html += '<span>当前第：' + current + '页</span>';
            html += '<button data-page="' + (current - 1) + '"';
            if(current <= 1) {
                html += ' disabled ';
            }
            html += '>&lt;</button>';
            html += '<button data-page="' + (current + 1) + '"';
            if(current >= totalPage) {
                html += ' disabled ';
            }
            html += '>&gt;</button>';

            return html;
        }
    });
    var p3 = new MyPagination({
        parentNode: '#p3',
        action: function (node, page) {
            this.render({
                current: page
            });
        }
    });
    p3.render({
        total: 135
    });


});