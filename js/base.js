/**
 * Created by Administrator on 2017/11/7.
 */
;(function () {
    'use strict';
    var $form_add_task = $('.add-task')
        ,new_task = {}
        ,task_list = {};

    init();

    $form_add_task.on('submit',function (e) {
        e.preventDefault();
        new_task.content = $(this).find('input[name=content]').val()
        console.log('newtask', new_task);
    })

    function init() {
         task_list = store.get('task_list') || [];
    }

    function on_add_task_form_submit(e) {
        var new_task = {}, $input;
        /*禁用默认行为*/
        e.preventDefault();
        /*获取新Task的值*/
        $input = $(this).find('input[name=content]');
        new_task.content = $input.val();
        /*如果新Task的值为空 则直接返回 否则继续执行*/
        if (!new_task.content) return;
        /*存入新Task*/
        if (add_task(new_task)) {
            // render_task_list();
            $input.val(null);
        }
        console.log('newtask', new_task);
    }
    function add_task(new_task) {
        /*将新Task推入task_list*/
        task_list.push(new_task);
        /*更新localStorage*/
        // refresh_task_list();
        return true;
    }
})();