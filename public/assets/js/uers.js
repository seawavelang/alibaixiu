// 监听提交事件
$('#userForm').on('submit', function(){
  // form表单每一个input有name属性，serialize自动收集表单数据
  console.log($('#userForm').serialize());
  $.ajax({
    type: 'post',
    url: '/users',
    data: $('#userForm').serialize(),
    success: function(result) {
      location.reload(); // 刷新当前页面
    }
  })
  // 阻止表单默认提交行为
  return false;
});

// 头像上传
// 事件委托  一定要委托给一直存在的元素
$('#formBox').on('change', '#avatar', function() {
  // ajax在上传图片的时候必须要使用FormData
  var formData = new FormData();
  // console.dir($(this));
  formData.append('avatar', this.files[0]);
  // console.log(this.files[0])

  $.ajax({
    type:'post',//get或post
    url:'/upload',//请求的地址
    contentType: false,  // 取消默认的参数的形式 application/x-www-form-urlencoded
    processData: false,   // 取消参数解析成键值对形式
    data: formData,//如果不需要传，则注释掉 请求的参数，a=1&b=2或{a:1,b:2}或者jq中的serialize方法，或者formData收集
    success:function(result){//成功的回调函数
      // console.log(result)
      $('#preview').attr('src', result[0].avatar);
      $('#hiddenImg').val(result[0].avatar);
    }
  })
})

// 显示用户关联
$.ajax({
  type:'get',//get或post
  url:'/users',//请求的地址
  data:{},//如果不需要传，则注释掉 请求的参数，a=1&b=2或{a:1,b:2}或者jq中的serialize方法，或者formData收集
  dataType:'json',
  success:function(result){//成功的回调函数
    // console.log(result);
    var html = template('userTpl', {
      data: result
    });
    $('#userBox').html(html);
  }
})

// 修改分为两步  事件委托
$('#userBox').on('click', '.edit', function() {
  // 点击获取当前这个编辑按钮的id值
  // 你想获取一个东西，必须先提前把这个东西存起来
  var id = $(this).attr('data-id');
  // console.log(id);
  // 通过ajax把当前这个用户的信息查询出来
  $.ajax({
    type: 'get',
    url: '/users/' + id,
    success: function(result) {
      // console.log(result);
      var html = template('modifyFormTpl', result);
      $('#formBox').html(html);
    }
  })
})

$('#formBox').on('submit', '#modifyForm', function() {
  // 收集表单数据
  // console.log($(this).serialize());
  var id = $(this).attr('data-id');
  console.log(id)
  $.ajax({
    type: 'put',
    url: '/users/' + id,
    data: $(this).serialize(),
    success: function(result) {
      location.reload();
    }
  })
  return false;
})

// 删除功能 事件委托
$('#userBox').on('click', '.delete', function() {
  var id = $(this).attr('data-id');
  console.log(id);
  $.ajax({
    type: 'delete',
    url: '/users/' + id,
    success: function(result) {
      // console.log(result)
      location.reload()
    }
  })
})

// 当input状态改变的时候，其他的input状态也要跟着改变
$('#selectAll').on('change', function() {
  console.log($(this).prop('checked'));
  var bool = $(this).prop('checked');
  $('#userBox').find('.status').prop('checked', bool);
  if(bool == true) {
    $('#deleteMany').show();
  }else{
    $('#deleteMany').hide();
  }
})

// 当tbody中的input全部选中的时候，我们就让全选也是选中的状态
$('#userBox').on('change', '.status', function() {
  if($('#userBox').find('.status').length == $('#userBox').find('.status').filter(':checked').length){
    $('#selectAll').prop('checked', true);
  }else{
    $('#selectAll').prop('checked', false);
  }

  if($('#userBox').find('.status').filter(':checked').length >= 2) {
    $('#deleteMany').show();
  }else{
    $('#deleteMany').hide();
  }
})

//
$('#deleteMany').on('click', function() {
 if(confirm('确定要删除吗？')){
   // 找到所有的选中的input
   var selectAll = $('#userBox').find('.status').filter(':checked');
   var arr = [];
   selectAll.each(function(index, element) {
     console.log($(element).attr('data-id'));
     arr.push($(element).attr('data-id'));
   })
   $.ajax({
     type: 'delete',
     url: '/users/' + arr.join('-'),
     success: function(result) {
       // console.log(result);
       location.reload();
     }
   })
 }
})