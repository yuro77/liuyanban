var postRequest, getRequest;
if (window.XMLHttpRequest) {
  postRequest = new XMLHttpRequest();
  getRequest = new XMLHttpRequest();
}
else {
  postRequest = new ActiveXObject("Microsoft.XMLHTTP");
  getRequest = new ActiveXObject("Microsoft.XMLHTTP");
}
var BaseURL = 'http://8.129.238.142/djf';//查看是否有错误
var boxnumber;//



function postLogin() {//用户登录
  if (document.getElementById("username1").value == "" || document.getElementById("password1").value == "") {
    document.getElementById('loginmsg').innerHTML = '请输入用户名和密码'
  }
  else {
    var username1 = document.getElementById("username1").value;
    var password1 = document.getElementById("password1").value;
    var postData1 = {
      username: username1,
      password: password1,
    }
    postRequest.open("POST", BaseURL + '/login');

    postRequest.send(JSON.stringify(postData1))
    console.log("登陆的账号和密码已发送")

    postRequest.onreadystatechange = function () {
      if (postRequest.readyState == 4 && postRequest.status == 200) {
        console.log(postRequest.responseText)
        document.getElementById('loginmsg').innerHTML = '登陆成功';

        localStorage.setItem('username', username1)
        window.location.href = "./userpage.html";/*要检查一下这行代码是否可行 */


        getpersonalData();/*获取个人信息*/

        admit()/*允许登陆用户修改和删除*/

      }
      else {
        document.getElementById('loginmsg').innerHTML = '用户名或密码错误';
      }
    }
  }

}
//
function toUserPage() {//用户页面加载时
  document.getElementById('pageusername').innerText = localStorage.getItem('username');
  admit()/*允许登陆用户修改和删除*/
}

function admit() {//允许登陆用户修改和删除留言
  var pageusername = document.getElementById('pageusername').innerHTML;
  var username = localStorage.getItem('username')
  var alreadyusername = new Array();
  getRequest.open('GET', BaseURL + '/');
  getRequest.send();
  getRequest.onreadystatechange = function () {
    if (getRequest.readyState == 4) {
      if (getRequest.status == 200) {
        boxnumber = Number(localStorage.getItem('box_number')) - 1;
        console.log('获取留言数目')
      }
    }
  }
  d = boxnumber;
  for (a = 0; a <= d; a++) {
    alreadyusername[a] = document.getElementsByClassName("displayBoxone")[a].children[0].children[0].children[0].children[0].innerText
  }/*遍历用户名*/


  if (alreadyusername.indexOf(pageusername) > -1) {
    for (b = 0; b <= d; b++) {
      if (pageusername === alreadyusername[b]) {
        document.getElementsByClassName("displayBoxone")[b].children[0].children[0].children[4].children[0].style.visibility = "visible";
        document.getElementsByClassName("displayBoxone")[b].children[0].children[0].children[5].children[0].style.visibility = "visible";
      }/*如果存在此用户的留言，这些留言可删除和修改 */
    }

  }
  /*管理员账号*/
  if (username == "管理员") {
    for (e = 0; e <= d; e++) {
      document.getElementsByClassName("displayBoxone")[b].children[0].children[0].children[4].children[0].style.visibility = "visible";
      document.getElementsByClassName("displayBoxone")[b].children[0].children[0].children[5].children[0].style.visibility = "visible"
    }
  }

}//

function motifyText(event) {/*修改功能 */
  var x = event.target
  x.parentElement.nextElementSibling.nextElementSibling.children[0].style.visibility = "visible";
  x.parentElement.parentElement.parentElement.nextElementSibling.children[0].removeAttribute('disabled');
  x.style.visibility = "hidden"
  //找到该留言的id
  var theComment = x.parentElement.parentElement.parentElement.nextElementSibling.children[0].value
    localStorage.removeItem('commentID')
    var boxnumber1 = Number(localStorage.getItem('box_number'))-1;
    var comments = new Array();
    for (g = 0; g <= boxnumber1; g++) {//找到留言
      var s = localStorage.getItem(JSON.stringify(g));
          var m=JSON.parse(s);var y=m[2]
          
      if (theComment == y) {
        comments.push(m)//此数组里是相同留言或仅此留言
      }
    }
    if (comments.length > 0) {
      if (comments.length = 1) {
        localStorage.setItem('commentID', JSON.stringify(comments[0][0]))
      }
      else{//内容和用户名相同
        var comments_username = new Array()
       var commentName = x.parentElement.parentElement.children[0].innerText//发表此留言的用户名
        for(n=0;n=comments.length-1;n++){
          if(commentName===comments[n][1]){
          comments_username.push(comments_id[n])//与此用户名相同的留言
        }}
        if (comments_username.length=1){
          localStorage.setItem('commentID', JSON.stringify(comments[0][0]))
        }
        else {
          //同一名用户同内容但不同时间的
          var comments_time = new Array()
       var commentTime = x.parentElement.parentElement.children[0].innerText
       for(f=0;f=comments_username;f++){
         if(commentTime===comments_username[f][3]){
           comments_time.push(comments_username[f]) }
       }
        localStorage.setItem('commentID', JSON.stringify(comments[0][0]))
        }
      }
}
//
for(u=0;u<boxnumber1;u++){//其余不能修改
  boxNumber='box'+JSON.stringify(u)
  document.getElementById(boxNumber).children[0].children[0].children[3].setAttribute('disabled','disabled')
  document.getElementById(boxNumber).children[0].children[0].children[4].setAttribute('disabled','disabled')
}
}


function finishmotifyText(event) {/*修改后的发送 */
  var x = event.target
  var boxnumber1=Number( localStorage.getItem('box_number'))-1
  for(u=0;u<boxnumber1;u++){//其余可以修改
    boxNumber='box'+JSON.stringify(u)
    document.getElementById(boxNumber).children[0].children[0].children[3].removeAttribute('disabled')
  document.getElementById(boxNumber).children[0].children[0].children[4].removeAttribute('disabled')

  }
  /*把修改发送*/
  var motifytext = x.parentElement.parentElement.parentElement.nextElementSibling.children[0].value;
  
  idNumber_ = Number(localStorage.getItem('commentID'))

  motifytext_ = { id: idNumber_, comment: motifytext }
  postRequest.open("PUT", BaseURL + '/update_comment');

  postRequest.send(JSON.stringify(motifytext_));


  postRequest.onreadystatechange = function () {
    if (postRequest.readyState == 4) {
      if (postRequest.status == 200) {
        console.log(postRequest.responseText)
          ;
        /*添加修改时间*/


        var time1 = new Date()
        var month1 = time1.getMonth() + 1; var date1 = time1.getDate(); var hour1 = time1.getHours();
        var minute1 = time1.getMinutes();
        x.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerText = 
        "上次修改时间:" + JSON.stringify(month1) + "-" + JSON.stringify(date1) + "  "
          + JSON.stringify(hour1) + ":" + JSON.stringify(minute1)
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "修改成功"
        setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)

      }
      else {
        console.log(postRequest.responseText)

      }


    }
  }
  
  x.parentElement.parentElement.parentElement.nextElementSibling.children[0].setAttribute('disabled', "disabled");
  x.parentElement.previousElementSibling.previousElementSibling.style.visibility = "visible"
  x.style.visibility = "hidden";

}

function deleteText(event) {/*删除 */
  var r = confirm("是否要删除你的留言")
  if (r == true) {
    var x = event.target
    var theComment = x.parentElement.parentElement.parentElement.nextElementSibling.children[0].value
    var commentBoxID= x.parentElement.parentElement.parentElement.parentElement.id;
    var boxnumber1 = Number(localStorage.getItem('box_number'))-1;
    var comments = new Array();;
    for (g = 0; g <= boxnumber1; g++) {//找到留言
      var s = localStorage.getItem(JSON.stringify(g));
          var m=JSON.parse(s);var y=m[2]
          
      if (theComment == y) {
        comments.push(m)//此数组里是相同留言或仅此留言
      }
    }
    if (comments.length > 0) {
      if (comments.length = 1) {
        var putData = { id: comments[0][0] }
      }
      else{//内容和用户名相同
        var comments_username = new Array()
       var commentName = x.parentElement.parentElement.children[0].innerText//发表此留言的用户名
        for(n=0;n=comments.length-1;n++){
          if(commentName===comments[n][1]){
          comments_username.push(comments_id[n])//与此用户名相同的留言
        }}
        if (comments_username.length=1){
          var putData = { id: comments_sametextAndusername[0][0] }
        }
        else {
          //同一名用户同内容但不同时间的
          var comments_time = new Array()
       var commentTime = x.parentElement.parentElement.children[0].innerText
       for(f=0;f=comments_username;f++){
         if(commentTime===comments_username[f][3]){
           comments_time.push(comments_username[f]) }
       }
       var putData = { id: comments_time[0][0] }
        }
      }
      postRequest.open("DELETE", BaseURL + '/delete_comment');
      postRequest.send(JSON.stringify(putData));//
      postRequest.onreadystatechange = function () {
        if (postRequest.readyState == 4) {
          if (postRequest.status == 200) {
            console.log(postRequest.responseText);
            document.getElementById(commentBoxID).previousElementSibling.remove()
            document.getElementById(commentBoxID).remove()
            document.getElementById('msgfontBox').style.display = "block"
            document.getElementById('msg').innerText = "删除成功"
            setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)
          }
          else {
            console.log(postRequest.responseText)
            //提示删除失败
          }
        }
      }
    }
  }
}

function postRegister() {//注册
  var username2 = document.getElementById("username2").value;
  var password2 = document.getElementById("password2").value;
  var age = document.getElementById("age").value;
  var sex = document.getElementById("sex").value;
  var address = document.getElementById("address").value;
  var postData2 = {
    username: username2,
    password: password2,
    age: age,
    sex: sex,
    address: address
  };
  postRequest.open("POST", BaseURL + '/add');
  postRequest.send(JSON.stringify(postData2))
  console.log("注册的信息已发送")
  postRequest.onreadystatechange = function () {
    if (postRequest.readyState == 4 && postRequest.status == 200) {
      console.log(postRequest.responseText)
      document.getElementById('registermsg').innerHTML = '注册成功';
      window.location.href = "http://8.129.238.142:5000/static/loginpage.html"

    }
    else {
      document.getElementById('registermsg').innerHTML = postRequest.responseText.msg;

    }
  }

}//
function personalData() {//个人页面
  getpersonalData();
  document.getElementById('displayBox').style.display = "none";
  document.getElementById('personalDatabox').style.display = "block";
  document.getElementById("postmytextBox").style.display = "none";
}//

function page() {//首页
  document.getElementById('personalDatabox').style.display = "none";
  document.getElementById('displayBox').style.display = "block";
  document.getElementById("postmytextBox").style.display = "none";
  admit()
}//

function postmytextpage() {//发表留言页面
  document.getElementById('personalDatabox').style.display = "none";
  document.getElementById('displayBox').style.display = "none";
  document.getElementById('postmytextBox').style.display = "block";
}//


function getpersonalData() {//获取个人信息
  getRequest.open('GET', BaseURL + '/me');
  getRequest.send();
  getRequest.onreadystatechange = function () {
    if (getRequest.readyState == 4) {
      if (getRequest.status == 200) {
        console.log(getRequest.responseText)
        var a = JSON.parse(getRequest.responseText)
        document.getElementById('username3').removeAttribute('disabled');
        document.getElementById('sex1').removeAttribute('disabled');
        document.getElementById('age1').removeAttribute('disabled');
        document.getElementById('address1').removeAttribute('disabled');
        document.getElementById('username3').value = a[0][0];
        document.getElementById('sex1').value = a[0][1];
        document.getElementById('age1').value = a[0][2];
        document.getElementById('address1').value = a[0][3];
        document.getElementById('username3').setAttribute('disabled', 'disabled');
        document.getElementById('sex1').setAttribute('disabled', 'disabled');
        document.getElementById('age1').setAttribute('disabled', 'disabled');
        document.getElementById('address1').setAttribute('disabled', 'disabled');

      }
    }
  }
}
//

function refreshComment() {//刷新留言列表
  getRequest.open('GET', BaseURL + '/');
  getRequest.send();
  getRequest.onreadystatechange = function () {
    if (getRequest.readyState == 4) {
      if (getRequest.status == 200) {
        //时间不同是因为数据库数据不同
        var a = JSON.parse(getRequest.responseText)
        var boxnumber1 = a.length - 1;
        localStorage.removeItem('box_number')
        var v = JSON.stringify(a.length)
        //储存留言数目
        localStorage.setItem('box_number',v)
        for (t = 0; t <= boxnumber1; t++) {
          commentname = JSON.stringify(t)
          localStorage.setItem(commentname, JSON.stringify(a[t]))
        }

        document.getElementById('displayBox').innerHTML = "";
        for (var c = 0; c <= boxnumber1; c++) {

          var newTextBox = document.createElement('div');
          newTextBox.id = "box" + JSON.stringify(c);
          newTextBox.className = "displayBoxone"
          document.getElementById("displayBox").appendChild(newTextBox);

          var newTextBoxone = document.createElement('div');
          newTextBoxone.className = "usernameAndtime";
          newTextBox.appendChild(newTextBoxone);

          var newTextBoxtwo = document.createElement('div');
          newTextBoxtwo.className = "displaytextBox";
          newTextBox.appendChild(newTextBoxtwo);

          var newTextBoxoneUL = document.createElement('ul');
          newTextBoxoneUL.className = "the-ul";
          newTextBoxone.appendChild(newTextBoxoneUL);

          var newTextBoxoneUL_li_1 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_1)
          var newTextBoxoneUL_li_font = document.createElement('span')
          newTextBoxoneUL_li_font.className = "font"
          newTextBoxoneUL_li_1.appendChild(newTextBoxoneUL_li_font)
          newTextBoxoneUL_li_1.children[0].innerText = a[c][1]/*用户名*/

          var newTextBoxoneUL_li_2 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_2)
          var newTextBoxoneUL_li_font_ = document.createElement('span')
          newTextBoxoneUL_li_font_.className = "font"
          newTextBoxoneUL_li_2.appendChild(newTextBoxoneUL_li_font_)

          var time_ = new Date(a[c][3])
          var month_ = time_.getMonth() + 1; var date_ = time_.getDate(); var hour_ = time_.getHours();
          var minute_ = time_.getMinutes();
          newTextBoxoneUL_li_2.children[0].innerText = JSON.stringify(month_) + "-" + JSON.stringify(date_) /*月+日*/

          var newTextBoxoneUL_li_3 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_3)
          var newTextBoxoneUL_li_font__ = document.createElement('span')
          newTextBoxoneUL_li_font__.className = "font"
          newTextBoxoneUL_li_3.appendChild(newTextBoxoneUL_li_font__)
          newTextBoxoneUL_li_3.children[0].innerText = JSON.stringify(hour_) + ":" + JSON.stringify(minute_)/*时+分*/

          //上次修改时间

          if (a[c][3] != a[c][4]) {
            var motifyTextTime_li_lastMotifyTime = document.createElement('li');
            var motifyTextTime_li_span = document.createElement('span');
            motifyTextTime_li_span.className = "font";
            newTextBoxoneUL.appendChild(motifyTextTime_li_lastMotifyTime);
            motifyTextTime_li_lastMotifyTime.appendChild(motifyTextTime_li_span)
            var time2 = new Date(a[c][4])
            var month2 = time2.getMonth() + 1; var date2 = time2.getDate(); var hour2 = time2.getHours();
            var minute2 = time2.getMinutes();
            motifyTextTime_li_span.innerText = "上次修改时间:" + JSON.stringify(month2)
              + "-" + JSON.stringify(date2) + "    "
              + JSON.stringify(hour2) + ":" + JSON.stringify(minute2)
          }
          else {
            var motifyTextTime_li_lastMotifyTime = document.createElement('li');
            var motifyTextTime_li_span = document.createElement('span');
            motifyTextTime_li_span.className = "font";
            newTextBoxoneUL.appendChild(motifyTextTime_li_lastMotifyTime);
            motifyTextTime_li_lastMotifyTime.appendChild(motifyTextTime_li_span)
            motifyTextTime_li_span.innerText = "最新上传"
          }//

          var newTextBoxoneUL_li_4 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_4)
          var newTextBoxoneUL_li_font1 = document.createElement('span')
          newTextBoxoneUL_li_font1.className = "font1";
          textareaNumber = 'textarea' + JSON.stringify(c)
          newTextBoxoneUL_li_4.appendChild(newTextBoxoneUL_li_font1)
          document.getElementById(newTextBox.id).children[0].children[0].children[4].children[0].onclick = function () { motifyText(event) }
          newTextBoxoneUL_li_font1.innerText = "修改"/*修改*/

          var newTextBoxoneUL_li_5 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_5)
          var newTextBoxoneUL_li_font2 = document.createElement('span');
          newTextBoxoneUL_li_font2.className = "font1";
          newTextBoxoneUL_li_5.appendChild(newTextBoxoneUL_li_font2)
          document.getElementById(newTextBox.id).children[0].children[0].children[5].children[0].onclick = function () { deleteText(event) }
          newTextBoxoneUL_li_font2.innerText = "删除"/*删除*/

          var newTextBoxoneUL_li_6 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_6)
          var newTextBoxoneUL_li_font3 = document.createElement('span');
          newTextBoxoneUL_li_font3.className = "font1";
          newTextBoxoneUL_li_6.appendChild(newTextBoxoneUL_li_font3)
          document.getElementById(newTextBox.id).children[0].children[0].children[6].children[0].onclick = function () { finishmotifyText(event) }
          newTextBoxoneUL_li_font3.innerText = "完成"/*完成*/

          //留言
          var newTextTwoTextarea = document.createElement('textarea')
          newTextBoxtwo.appendChild(newTextTwoTextarea)
          newTextTwoTextarea.className = "mydisplaytext"
          newTextTwoTextarea.setAttribute('disabled', 'disabled')
          newTextTwoTextarea.cols = "52"; newTextTwoTextarea.wrap = "hard"
          newTextTwoTextarea.id = textareaNumber
          newTextTwoTextarea.innerText = a[c][2]
          //

          if (c < boxnumber1) {
            var hr = document.createElement('hr')
            hr.className = "hr"
            document.getElementById("displayBox").appendChild(hr)
          }

          if (a[c][1] == document.getElementById('pageusername').innerText || a[c][1] == "管理员") {
            document.getElementsByClassName("displayBoxone")[c].children[0].children[0].children[4].children[0].style.visibility = "visible";
            document.getElementsByClassName("displayBoxone")[c].children[0].children[0].children[5].children[0].style.visibility = "visible";
          }
        }
        console.log("刷新成功")
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "留言刷新成功"
        setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)

      }

    }
    else {//留言刷新失败提示
      console.log(postRequest.responseText)

    }//
  }
}

function postmytext() {/*把要发表的留言发送*/
  /*要先查看有多少条留言*/
  getRequest.open('GET', BaseURL + '/');
  getRequest.send();
  getRequest.onreadystatechange = function () {
    if (getRequest.readyState == 4) {
      if (getRequest.status == 200) {

        JSON.parse(getRequest.responseText)
        boxnumber = getRequest.responseText.length


        var postedText = document.getElementById('writeMytext').value
        var postedText_ = { comment: postedText }
        postRequest.open("POST", BaseURL + '/add_comment');
        postRequest.send(JSON.stringify(postedText_))
        console.log("发表的留言已经发送")
        postRequest.onreadystatechange = function () {
          if (postRequest.readyState == 4 && postRequest.status == 200) {
            console.log(postRequest.responseText)
            document.getElementById('personalDatabox').style.display = "none";
            document.getElementById('displayBox').style.display = "block";
            document.getElementById("postmytextBox").style.display = "none";
            /*创建一个新标签*/
            var hr = document.createElement('hr')
            hr.className = "hr"
            document.getElementById("displayBox").appendChild(hr)

            var newTextBox = document.createElement('div');
            newTextBox.id = "box" + JSON.stringify(boxnumber);
            newTextBox.className = "displayBoxone"
            document.getElementById("displayBox").appendChild(newTextBox);

            var newTextBoxone = document.createElement('div');
            newTextBoxone.className = "usernameAndtime";
            newTextBox.appendChild(newTextBoxone);

            var newTextBoxtwo = document.createElement('div');
            newTextBoxtwo.className = "displaytextBox";
            newTextBox.appendChild(newTextBoxtwo);

            var newTextBoxoneUL = document.createElement('ul');
            newTextBoxoneUL.className = "the-ul";
            newTextBoxone.appendChild(newTextBoxoneUL);

            var newTextBoxoneUL_li_1 = document.createElement('li');
            newTextBoxoneUL.appendChild(newTextBoxoneUL_li_1)
            var newTextBoxoneUL_li_font = document.createElement('span')
            newTextBoxoneUL_li_font.className = "font"
            newTextBoxoneUL_li_1.appendChild(newTextBoxoneUL_li_font)
            newTextBoxoneUL_li_1.children[0].innerText = document.getElementById("pageusername").innerText/*用户名*/

            var newTextBoxoneUL_li_2 = document.createElement('li');
            newTextBoxoneUL.appendChild(newTextBoxoneUL_li_2)
            var newTextBoxoneUL_li_font_ = document.createElement('span')
            newTextBoxoneUL_li_font_.className = "font"
            newTextBoxoneUL_li_2.appendChild(newTextBoxoneUL_li_font_)

            var time = new Date()
            var month = time.getMonth() + 1; var date = time.getDate(); var hour = time.getHours();
            var minute = time.getMinutes();
            newTextBoxoneUL_li_2.children[0].innerText = JSON.stringify(month) + "-" + JSON.stringify(date)/*月+日*/

            var newTextBoxoneUL_li_3 = document.createElement('li');
            newTextBoxoneUL.appendChild(newTextBoxoneUL_li_3)
            var newTextBoxoneUL_li_font__ = document.createElement('span')
            newTextBoxoneUL_li_font__.className = "font"
            newTextBoxoneUL_li_3.appendChild(newTextBoxoneUL_li_font__)
            newTextBoxoneUL_li_3.children[0].innerText = JSON.stringify(hour) + ":" + JSON.stringify(minute)/*时+分*/

            var newTextBoxoneUL_li_4 = document.createElement('li');
            newTextBoxoneUL.appendChild(newTextBoxoneUL_li_4)
            var newTextBoxoneUL_li_font1 = document.createElement('span')
            newTextBoxoneUL_li_font1.className = "font1";
            var boxnumber_ = Number(boxnumber)
            boxnumber_ = boxnumber_ + 1
            textareaNumber = 'textarea' + JSON.stringify(boxnumber_)
            newTextBoxoneUL_li_4.appendChild(newTextBoxoneUL_li_font1)
            document.getElementById(newTextBox.id).children[0].children[0].children[4].children[0].onclick = function () { motifyText(event) }
            newTextBoxoneUL_li_font1.innerText = "修改"/*修改*/

            var newTextBoxoneUL_li_5 = document.createElement('li');
            newTextBoxoneUL.appendChild(newTextBoxoneUL_li_5)
            var newTextBoxoneUL_li_font2 = document.createElement('span');
            newTextBoxoneUL_li_font2.className = "font1";
            newTextBoxoneUL_li_5.appendChild(newTextBoxoneUL_li_font2)
            document.getElementById(newTextBox.id).children[0].children[0].children[5].children[0].onclick = function () { deleteText(event) }
            newTextBoxoneUL_li_font2.innerText = "删除"/*删除*/



            var newTextBoxoneUL_li_6 = document.createElement('li');
            newTextBoxoneUL.appendChild(newTextBoxoneUL_li_6)
            var newTextBoxoneUL_li_font3 = document.createElement('span');
            newTextBoxoneUL_li_font3.className = "font1";
            newTextBoxoneUL_li_6.appendChild(newTextBoxoneUL_li_font3)

            newTextBoxoneUL_li_font3.innerText = "完成"/*完成*/
            document.getElementById(newTextBox.id).children[0].children[0].children[6].children[0].onclick = function () { finishmotifyText(event) }

            var newTextTwoTextarea = document.createElement('textarea')
            newTextBoxtwo.appendChild(newTextTwoTextarea)
            newTextTwoTextarea.id = textareaNumber
            newTextTwoTextarea.className = "mydisplaytext"
            newTextTwoTextarea.cols = "52"
            newTextTwoTextarea.wrap = "hard"
            document.getElementById(newTextTwoTextarea.id).value = postedText/*发表的留言*/

            document.getElementById('msgfontBox').style.display = "block"
            document.getElementById('msg').innerText = "留言发表成功"
            setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)


          }
          else {
            console.log(postRequest.responseText)

              ;/*提示发送失败*/
          }
        }
      }
    }
  }
}

function personalDataChange() {/*修改个人信息*/
  document.getElementById("username3").removeAttribute('disabled');
  document.getElementById("sex1").removeAttribute('disabled');
  document.getElementById("age1").removeAttribute('disabled');
  document.getElementById("address1").removeAttribute('disabled');
  document.getElementById("personalDataChangeFinish").style.display = "block";
  document.getElementById('personalDataChange').style.display = "none";
}



function changePassword() {/*修改密码*/
  var r = confirm('您真的要修改密码吗？')
  if (r == true) {
    document.getElementById('personalDatabox').style.display = "none";
    document.getElementById('displayBox').style.display = "none";
    document.getElementById("postmytextBox").style.display = "none";
    document.getElementById("changePasswordPage").style.display = "block";

  }
}
function finishPasswordChange() {/*完成修改密码*/
  var newPassword_ = document.getElementById("newPassword").innerText
  var newPassword = { password: newPassword_ }
  postRequest.open("PUT", BaseURL + '/password');
  postRequest.send(JSON.stringify(newPassword))

  postRequest.onreadystatechange = function () {
    if (postRequest.readyState == 4 && postRequest.status == 200) {
      console.log(postRequest.responseText)
      document.getElementById('msgfontBox').style.display = "block"
      document.getElementById('msg').innerText = "密码修改成功"
      setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)
    }
    else {
      console.log(postRequest.responseText)
      document.getElementById('msgfontBox').style.display = "block"
      document.getElementById('msg').innerText = "密码修改失败"
      setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)
    }

  }
  document.getElementById('personalDatabox').style.display = "block";
  document.getElementById('displayBox').style.display = "none";
  document.getElementById("postmytextBox").style.display = "none";
  document.getElementById("changePasswordPage").style.display = "none";

}

function test(event) {//测试
  var x= event.target
  x.parentElement.nextElementSibling.nextElementSibling.children[0].style.visibility="visible"
  x.style.visibility="hidden";
  x.parentElement.parentElement.parentElement.nextElementSibling.children[0].removeAttribute('disabled')

}

function personalDataChangeFinish() {/*完成个人信息和用户名修改*/
  document.getElementById("personalDataChangeFinish").style.display = "none";
  document.getElementById('personalDataChange').style.display = "block";
  //发送修改
  if (document.getElementById("username3").value != document.getElementById('pageusername').innerText) {/*修改用户名*/
    var username_change = { username: document.getElementById("username3").value }
    postRequest.open("PUT", BaseURL + '/username');
    postRequest.send(JSON.stringify(username_change))

    postRequest.onreadystatechange = function () {
      if (postRequest.readyState == 4 && postRequest.status == 200) {
        console.log(postRequest.responseText)
        document.getElementById("personalDataChangeFinish").style.display = "none";
        document.getElementById('personalDataChange').style.display = "block";
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "用户名修改成功"
        setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)
      }
      else {
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "用户名修改失败"
        setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)

      }
    }
  }
  else {/*修改个人信息*/
    var sex_ = document.getElementById("sex1").value
    var age_ = document.getElementById('age1').value
    var address_ = document.getElementById('address1').value
    var personalDataChange = {
      sex: sex_,
      age: age_,
      address: address_
    }
    postRequest.open("PUT", BaseURL + '/information');
    postRequest.send(JSON.stringify(personalDataChange))

    postRequest.onreadystatechange = function () {
      if (postRequest.readyState == 4 && postRequest.status == 200) {
        console.log(postRequest.responseText);
        document.getElementById("personalDataChangeFinish").style.display = "none";
        document.getElementById('personalDataChange').style.display = "block";
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "个人信息修改成功"
        setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)

      }
      else {
        console.log(postRequest.responseText)
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "个人信息修改失败"
        setTimeout(function () { document.getElementById('msgfontBox').style.display = "none" }, 10000)
      }

    }
  }
}
function checkPersonalData(id) {
  var username_ = document.getElementById(id).children[0].children[0].children[0].children[0].innerText
  var sendData = { username: username_ }
  getRequest.open('GET', BaseURL + '/');//接口还没有
  getRequest.send(JSON.stringify(sendData));
  getRequest.onreadystatechange = function () {
    if (getRequest.readyState == 4) {
      if (getRequest.status == 200) {
        console.log(getRequest.responseText)
        var a = JSON.parse(getRequest.responseText);
        localStorage.setItem(username, a[0][0])
        localStorage.setItem(sex, a[0][1])
        localStorage.setItem(age, a[0][2])
        localStorage.setItem(address, a[0][3])
        //待补充
        document.getElementById('username3').value = a[0][0];
        document.getElementById('sex1').value = a[0][1];
        document.getElementById('age1').value = a[0][2];
        document.getElementById('address1').value = a[0][3];
        document.getElementById('username3').setAttribute('disabled', 'disabled');
        document.getElementById('sex1').setAttribute('disabled', 'disabled');
        document.getElementById('age1').setAttribute('disabled', 'disabled');
        document.getElementById('address1').setAttribute('disabled', 'disabled');

      }
    }
  }
}