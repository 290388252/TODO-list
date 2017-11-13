/**
 * Created by Administrator on 2017/11/7.
 */
;(function () {
    'use strict';
    var $form_add_task = $('.add-task')
        ,task_list = {};
    init();

    $form_add_task.on('submit',function (e) {
        var new_task = {}
        //禁用默认行为
        e.preventDefault();
        //获取TASK的值
        new_task.content = $(this).find('input[name=content]').val()
        //如果task为空则返回
        if(!new_task.content) return;
        console.log('newtask', new_task);
        if(add_task(new_task)){
            render_task_list();
        }
        // if(add_task(new_task)){
            // render_task_list();
        // };
    })

    function init() {
         task_list = store.get('task_list') || [];
         console.log('task_list.length',task_list.length)
         if (task_list.length){
             render_task_list();
         }
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
        store.set('task_list',task_list);
        console.log('task_list',task_list);
        /*更新localStorage*/
         return true;
        // refresh_task_list();

    }
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (var i = 0; i < task_list.length; i++){
            var $task = render_task_tpl(task_list[i]);
            $task_list.append($task)
        }
        console.log('1',1)
    }
    
    function render_task_tpl(data) {
        var list_item_tpl = '<div class="task-item">'+
                                '<span><input type="checkbox"></span>'+
                                '<span class="task-content">'+data.content+'</span>'+
                                '<span style="float:right;">'+
                                    '<span class="action"> delete </span>'+
                                    '<span class="action"> detail </span>'+
                                '</span>'+
                            '</div>';
        return $(list_item_tpl)
    }
})();