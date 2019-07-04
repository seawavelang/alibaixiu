$('#logout').on('click', function() {
 var isLogout = confirm('您确定要退出吗？');
 if(isLogout == true) {
   $.ajax({
     type: 'post',
     url: '/logout',
     success: function(result) {
      //  console.log(result);
      location.href = './login.html';
     }
   })
 }
})