$(function() {
  var $menu = $('#menu'),
      $moreoptionBtn = $menu.find('#moreoption-btn');

  var showOption = (function($) {
    var $root = $menu.find('#showoption'),
        $template = $root.find('.template');

    // 显示更多选项
    function show () {
      $root.addClass('show');
    }

    function hide () {
      $root.removeClass('show');
    }

    function add (argu) {
      // 显示更多选项
      // 参数
      // type: type,
      // value: value,
      // txt: txt,
      // multiselect: multiselect

      this.show();

      var $newItem = $template.clone();

      $newItem.removeClass('template')
              .addClass(argu.type)
              .addClass('js-showoption-item')
              .attr('data-value', argu.value)
              .attr('data-type', argu.type);
      $newItem.find('.js-txt').text(argu.txt);

      if(argu.multiselect == '1') {
        // 允许多选
        $root.append($newItem);
      } else {
        // 不允许多选
        $root.find('.'+argu.type).remove();
        $root.append($newItem);
      }
      _sendData();
    }

    function remove (argu) {
      $root.find('.js-showoption-item[data-value='+argu.value+']')
           .remove();
      _sendData();
    }

    function _sendData () {
      var allOption = {};
      $root.find('.js-showoption-item').each(function() {
        var $this = $(this),
            value = $this.data('value'),
            type  = $this.data('type');
        if(typeof allOption[type] != 'undefined') {
          allOption[type] += '&' + value;
        } else {
          allOption[type] = value;
        }
      });
      $('#ajaxdata').text(JSON.stringify(allOption));
    }

    return {
      show: show,
      hide: hide,
      add: add,
      remove: remove
    };
  })($);

  var moreOption = (function() {
    var $root = $menu.find('#moreoption');
    return {
      show: function() {
        $root.addClass('show');
        $moreoptionBtn.remove();
      },
      hide: function() {
        $root.removeClass('show');
      }
    };
  })();

  var toggleMultiSelect = function($dom) {
    var action = $dom.data('action');
    var $parent = $dom.parents('.js-option-item');
    if(typeof action !== 'undefined' && action == '0') {
      // 如果有action则是第二次点击，即关闭多选
      $parent.data('multiselect', '0');
      $dom.removeClass('on').data('action', '1');
    } else {
      $parent.data('multiselect', '1');
      $dom.addClass('on').data('action', '0');
    }

  };
  /********   事件侦听加载   *******/

  $moreoptionBtn.on('click', function() {
    // 展开更多选项
    moreOption.show();
  });

  // 点击每个选项
  $menu.find('.js-detail a').on('click', function() {
    // 缓存this
    var $this = $(this);

    // 所有选项类别、是否允许多选等信息存储在此DOM
    var $parents = $this.parents('.js-option-item');

    // 1. 得到该选项类型
    var type = $parents.data('option');

    // 2. 得到该选项值
    var value = $this.data('value');

    // 3. 得到选项表达名称
    var txt = $this.text();

    // 4. 是否允许多选
    var multiselect = $parents.data('multiselect');

    // 5.校验唯一性能，如果已经有了该选项则视为取消
    var isSole = $menu.
      find('#showoption .js-showoption-item[data-value='+value+']').length;

    var info = {
      type: type,
      value: value,
      txt: txt,
      multiselect: multiselect
    };

    if(isSole == '0') {
      // 交给showOption自行处理
      showOption.add(info);
      // 重载已选选项点击时间监听
      reloadOptionHide();
    } else {
      // 取消该选项限制
      showOption.remove(info);
    }

  });

  // 多选按钮
  $menu.find('.js-addmore-button').on('click', function() {
    toggleMultiSelect($(this));
  });

  // 已选择区域的选项点击
  function reloadOptionHide () {
    // 因为已选择区域选项按钮为动态加载，所以每次add事件后需要重新监听
    $menu.find('#showoption .js-showoption-item').on('click', function() {
      showOption.remove({
        value: $(this).data('value')
      });
    });
  }
  reloadOptionHide();


});
