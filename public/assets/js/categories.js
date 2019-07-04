$('#addCategory').on('submit', function() {
  console.log($(this).serialize());
  $.ajax({
    type: 'post',
    url: '/categories',
    data: $(this).serialize(),
    success: function(result) {
      // console.log(result)
      location.reload()
    }
  })
  return false;
})

// 展示分类列表数据
$.ajax({
  type: 'get',
  url: '/categories',
  success: function(result) {
    // console.log(result);
    var html = template('categoryListTpl', {data: result});
    $('#categoryList').html(html);
  }
})

// 当点击编辑按钮的时候，让当前这一行的内容展示在左侧的表单里
$('#categoryList').on('click', '.edit', function() {
  var id = $(this).attr('data-id');
  // console.log(id);
  $.ajax({
    type: 'get',
    url: '/categories/' + id,
    success: function(result) {
      console.log(result);
      var html = template('modifyCategoryTpl', result);
      $('#formBox').html(html);
    }
  })
})

// 当提交修改表单的时候，发送Ajax请求
$('#formBox').on('submit', '#modifyCategory', function() {
  // 收集表单数据
 console.log($(this).serialize());
 var id = $(this).attr('data-id');
 $.ajax({
   type: 'put',
   url: '/categories/' + id,
   data: $(this).serialize(),
   success: function(result) {
     console.log(result);
     location.reload();
   }
 })
  return false;
})

// 删除功能
$('#categoryList').on('click', '.delete', function() {
 if(confirm('确定要删除吗？') == true) {
  var id = $(this).attr('data-id');
  console.log(id);
  $.ajax({
    type: 'delete',
    url: '/categories/' + id,
    success: function(result) {
      // console.log(result);
      location.reload();
    }
  })
 }
})