/**
 * by yanchao
 * Created by Administrator on 2017/11/7.
 */
;(function () {
    'use strict';
    var $form_add_task = $('.add-task')
        ,$delete_task_item
        ,$task_detail_item
        ,$task_detail = $('.task-detail')
        ,$task_detail_mask = $('.task-detail-mask')
        ,$updata_form
        ,$task_detail_content
        ,$task_detail_content_input
        ,$checkbox_complete
        ,current_index
        ,task_list = {};

    init();
    console.log($('input[type = checkbox]'))
    // $form_add_task.on('submit',function (e) {
    //     var new_task = {};
    //     //禁用默认行为
    //     e.preventDefault();
    //     //获取TASK的值
    //     new_task.content = $(this).find('input[name=content]').val();
    //     //如果task为空则返回
    //     if(!new_task.content) return;
    //     console.log('newtask', new_task);
    //     if(add_task(new_task)){
    //         $(this).find('input[name=content]').val(null);
    //     }
    // });

    $form_add_task.on('submit',on_add_task_form_submit);
    $task_detail_mask.on('click',hide_task);
    //每次都能监听
    function listen_delete_task_item() {
        $delete_task_item.on('click',function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            var tmp = confirm('are you sure to delete?');
            // console.log('$item.data(index)',$item.data('index'));
            tmp ? delete_task(index) : null;
        });
    }

    function listen_task_detail_item() {
        var index;
        $('.task-item').on('dblclick',function () {
            index = $(this).data('index');
            show_task(index);
        });
        $task_detail_item.on('click',function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            index = $item.data('index');
            show_task(index);
        })
    }
    
    function listen_checkbox_complete() {
        $checkbox_complete.on('click',function () {
            var completeOrUncomplete = $(this).is(':checked');
            var custr;
            // completeOrUncomplete ? custr = 'task complete' : custr = 'task uncomplete';
            // if (completeOrUncomplete){
            //     custr = 'task complete'
            // }else {
            //     custr = 'task uncomplete'
            // }
            console.log($(this).is(':checked'));
        })
    }
    
    function init() {
         task_list = store.get('task_list') || [];
         console.log('task_list.length',task_list.length);
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
        refresh_task_list();
        console.log('task_list',task_list);
        /*更新localStorage*/
         return true;
    }

    function delete_task(index) {
        if (index === undefined || !task_list[index])return;
        delete task_list[index];
        refresh_task_list();
    }

    function show_task(index) {
        if (index === undefined || !task_list[index])return;
        current_index = index;
        render_task_detail(index);
        $task_detail.show();
        $task_detail_mask.show();
        refresh_task_list();
    }
    
    function update_task(index,data) {
        if (index === undefined || !task_list[index])return;
        // task_list[index] = $.merge({},task_list[index],data);
        task_list[index] = data;
        console.log(data);
        refresh_task_list();
    }
    
    function hide_task() {
        $task_detail.hide();
        $task_detail_mask.hide();
        refresh_task_list();
    }

    function refresh_task_list() {
        store.set('task_list',task_list);
        render_task_list()
    }

    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (var i = 0; i < task_list.length; i++){
            var $task = render_task_item(task_list[i],i);
            $task_list.prepend($task)
        }
        $delete_task_item = $('.action.delete');
        $task_detail_item = $('.action.detail');
        $checkbox_complete = $('.task-list .complete');
        listen_delete_task_item();
        listen_task_detail_item();
        listen_checkbox_complete();
        console.log('监听成功');
    }

    function render_task_detail(index) {
        var item = task_list[index];
        var tpl = '<form>' +
                      // '<div name= "content" class="task-detail-content">'+ item.content +
                      // '</div>'+
                      '<div class="task-detail-content">'+item.content +
                      '</div>'+
                      '<div class="task-detail-content-input">'+
                          '<input style = "display: none;" type="text" name="content" value=" ' + (item.content || '') + '">'+
                      '</div>'+
                      '<div class="desc">'+
                          '<textarea name= "desc" style="width: 100%;height: 150px">' + (item.desc || '')+ '</textarea>' +
                      '</div>'+
                      '<div class="remind">'+
                          '<input type="date" name="remind_date" value=" ' + item.remind_date + '">'+
                      '</div>'+
                      '<button type="submit">submit</button>'+
                  '</form>';
        $task_detail.html('');
        $task_detail.html(tpl);
        $updata_form = $task_detail.find('form');
        $task_detail_content = $updata_form.find('.task-detail-content');
        $task_detail_content_input = $updata_form.find('[name=content]');
        $task_detail_content.on('dblclick',function () {
           $task_detail_content_input.show();
           $task_detail_content.hide();
        });
        $updata_form.on('submit',function (e) {
            e.preventDefault();
            var data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remind_date = $(this).find('[name=remind_date]').val();
            console.log(data);
            update_task(index,data);
            hide_task();
        })
    }

    function render_task_item(data,index) {
        if (!data || !index)return;
        var list_item_tpl = '<div class="task-item" data-index="' + index + '">'+
                                '<span class="complete"><input type="checkbox"></span>'+
                                '<span class="task-content">'+(data.content).replace(/(^\s*)/g, "")+'</span>'+
                                '<span style="float:right;">'+
                                    '<span class="action delete"> delete </span>'+
                                    '<span class="action detail"> detail </span>'+
                                '</span>'+
                            '</div>';
        return $(list_item_tpl)
    }
})();