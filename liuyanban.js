var postRequest, getRequest;
if (window.XMLHttpRequest) {
  postRequest = new XMLHttpRequest();
  getRequest = new XMLHttpRequest();
}
else {
  postRequest = new ActiveXObject("Microsoft.XMLHTTP");
  getRequest = new ActiveXObject("Microsoft.XMLHTTP");
}
var BaseURL = 'http://127.0.0.1:5000';//查看是否有错误
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
        document.getElementById('tipBox').style.display = "none";
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


function admit() {//允许登陆用户修改和删除留言
  var pageusername = document.getElementById('username3').innerHTML;
  var alreadyusername = new Array();
  getRequest.open('GET', BaseURL + '/');
  getRequest.send();
  getRequest.onreadystatechange = function () {
    if (getRequest.readyState == 4) {
      if (getRequest.status == 200) {
        console.log("请求刷新成功")
        boxnumber = getRequest.responseText.length - 1;
      }
    }
  }
  var d = 13/*目前的留言数*/
  d = boxnumber;
  for (a = 0; a <= d; a++) {
    alreadyusername[a] = document.getElementsByClassName("displayBoxone")[a].children[0].children[0].children[0].children[0].innerText
  }/*遍历用户名*/


  if (alreadyusername.indexOf(pageusername) > -1) {
    for (b = 0; b <= d; b++) {
      if (pageusername === alreadyusername[b]) {
        document.getElementsByClassName("displayBoxone")[b].children[0].children[0].children[3].children[0].style.visibility = "visible";
        document.getElementsByClassName("displayBoxone")[b].children[0].children[0].children[4].children[0].style.visibility = "visible";
      }/*如果存在此用户的留言，这些留言可删除和修改 */
    }

  }
  /*管理员账号*/
  if(postData1.username==""){
    for(e=0;e <= d;e++){
      document.getElementsByClassName("displayBoxone")[b].children[0].children[0].children[3].children[0].style.visibility = "visible";
        document.getElementsByClassName("displayBoxone")[b].children[0].children[0].children[4].children[0].style.visibility = "visible"
    }
  }

}//

function motifyText(id){/*修改功能 */
  document.getElementById(id).removeAttribute('disabled');
  document.getElementById(id).parentElement.previousElementSibling.children[0].children[5].children[0].style.visibility = "visible";
  document.getElementById(id).parentElement.previousElementSibling.children[0].children[3].children[0].style.visibility = "hidden";}


  function finishmotifyText(id) {/*修改后的发送 */
  
  /*把修改发送*/
  var motifytext = document.getElementById(id).children[1].children[0].innerText;
  
  motifytext_={comment:motifytext}
  postRequest.open("POST", BaseURL + '/update_comment');
  postRequest.send(JSON.stringify(motifytext_));
  postRequest.onreadystatechange = function () {
    if (postRequest.status == 200) {
      console.log(postRequest.responseText)
        ;
      /*添加修改时间*/
      var motifyTextTime_li = document.createElement('li');
      var motifyTextTime_li_span = document.createElement('span');
      motifyTextTime_li_span.className = "font";
      document.getElementById(id).children[0].children[0].appendChild(motifyTextTime_li)
      motifyTextTime_li.appendChild(motifyTextTime_li_span)
      var time1 = new Date()
      var month1 = time1.getMonth() + 1; var date1 = time1.getDate(); var hour1 = time1.getHours();
      var minute1 = time1.getMinutes();
      motifyTextTime_li_span.innerText = "修改时间:" + JSON.stringify(month1) + "-" + JSON.stringify(date1) + "&nbsp;&nbsp;&nbsp;&nbsp;"
        + JSON.stringify(hour1) + ":" + JSON.stringify(minute1)

    }
    else {
      console.log(postRequest.responseText)
      document.getElementById('msgfontBox').style.display = "block"
      document.getElementById('msg').innerText = "修改失败"
      setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
    }
    document.getElementById(id).children[1].children[0].setAttribute('disabled', "disabled");
    document.getElementById(id).children[0].children[0].children[5].children[0].style.visibility = "hidden";
    document.getElementById(id).children[0].children[0].children[3].children[0].style.visibility = "visible"
    ;
  }




}
function deleteText(id) {/*删除 */
  var box = document.getElementById(id);
  var r = confirm("是否要删除你的留言")
  if (r == true) {
    postRequest.open("DELETE", BaseURL + '/delete_comment');
    postRequest.send();//
    postRequest.onreadystatechange = function () {
      if (postRequest.status == 200) {
        console.log(postRequest.responseText); box.remove()
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "删除成功"
        setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
      }
      else {
        console.log(postRequest.responseText)
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "删除失败"
        setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
        //提示删除失败
      }
    }
  }
  
}

function postRegistersend() {/*注册 */
  console.log("注册的信息已发送")
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
  postRequest.open("POST", BaseURL + '/login');
  postRequest.send(JSON.stringify(postData2))
  postRegistersend()
  postRequest.onreadystatechange = function () {
    if (postRequest.readyState == 4 && postRequest.status == 200) {
      console.log(postRequest.responseText)
      document.getElementById('registermsg').innerHTML = '注册成功';
      window.location.href = "./loginpage"

    }
    else {
      document.getElementById('registermsg').innerHTML = postRequest.responseText;

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
        document.getElementById('username3').innerHTML = getRequest.responseText[0];
        document.getElementById("pageusername").innerText = document.getElementById('username3').innerHTML;
        document.getElementById('sex1').innerHTML = getRequest.responseText[1];
        document.getElementById('age1').innerHTML = getRequest.responseText[2];
        document.getElementById('address1').innerHTML = getRequest.responseText[3];
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
        console.log("请求刷新成功")
        boxnumber = getRequest.responseText.length - 1;
        for (c = 0; c <= boxnumber; c++) {
          getRequest.responseText[c][3]
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
          newTextBoxoneUL_li_1.children[0].innerText = getRequest.responseText[c][0]/*用户名*/

          var newTextBoxoneUL_li_2 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_2)
          var newTextBoxoneUL_li_font_=document.createElement('span')
          newTextBoxoneUL_li_font_.className = "font"
          newTextBoxoneUL_li_2.appendChild(newTextBoxoneUL_li_font_)

          var time_ = new Date(getRequest.responseText[c][2])
          var month_ = time_.getMonth() + 1; var date_ = time_.getDate(); var hour_ = time_.getHours();
          var minute_ = time_.getMinutes();
          newTextBoxoneUL_li_2.children[0].innerText = JSON.stringify(month_) + "-" + JSON.stringify(date_) /*月+日*/

          var newTextBoxoneUL_li_3 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_3)
          var newTextBoxoneUL_li_font__=document.createElement('span')
          newTextBoxoneUL_li_font__.className = "font"
          newTextBoxoneUL_li_3.appendChild(newTextBoxoneUL_li_font__)
          newTextBoxoneUL_li_3.children[0].innerText = JSON.stringify(hour_) + ":" + JSON.stringify(minute_)/*时+分*/

          var newTextBoxoneUL_li_4 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_4)
          var newTextBoxoneUL_li_font1 = document.createElement('span')
          newTextBoxoneUL_li_font1.className = "font1";
          var boxnumber_ = Number(boxnumber)
          boxnumber_ = boxnumber_ + 1
          textareaNumber = 'textarea' + JSON.stringify(boxnumber_)
          newTextBoxoneUL_li_font1.setAttribute('onclick','motifyText(textareaNumber)')
          newTextBoxoneUL_li_4.appendChild(newTextBoxoneUL_li_font1)
          newTextBoxoneUL_li_font1.innerText = "修改"/*修改*/
          
          var newTextBoxoneUL_li_5 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_5)
          var newTextBoxoneUL_li_font2 = document.createElement('span');
          newTextBoxoneUL_li_font2.className = "font1";
          newTextBoxoneUL_li_font2.setAttribute('onclick','deleteText(newTextBox.id)')
          newTextBoxoneUL_li_5.appendChild(newTextBoxoneUL_li_font2)
          newTextBoxoneUL_li_font2.innerText = "删除"/*删除*/
          
          var newTextBoxoneUL_li_6 = document.createElement('li');
          newTextBoxoneUL.appendChild(newTextBoxoneUL_li_6)
          var newTextBoxoneUL_li_font3 = document.createElement('span');
          newTextBoxoneUL_li_font3.className = "font1";
          newTextBoxoneUL_li_font3.setAttribute('onclick','finishmotifyText(newTextBox.id)')
          newTextBoxoneUL_li_font3.innerText = "完成"/*完成*/
          //上次修改时间
          if (getRequest.responseText[c][3] != getRequest.responseText[c][2]) {
            var motifyTextTime_li_lastMotifyTime = document.createElement('li');
            var motifyTextTime_li_span = document.createElement('span');
            motifyTextTime_li_span.className = "font";
            newTextBoxoneUL.appendChild(motifyTextTime_li_lastMotifyTime);
            motifyTextTime_li_lastMotifyTime.appendChild(motifyTextTime_li_span)
            var time2 = new Date(getRequest.responseText[c][3])
            var month2 = time2.getMonth() + 1; var date2 = time2.getDate(); var hour2 = time2.getHours();
            var minute2 = time2.getMinutes();
            motifyTextTime_li_span.innerText = "上次修改时间:" + JSON.stringify(month2)
             + "-" + JSON.stringify(date2) + "&nbsp;&nbsp;&nbsp;&nbsp;"
              + JSON.stringify(hour2) + ":" + JSON.stringify(minute2)
          }//
          //留言
          var newTextTwoTextarea = document.createElement('textarea')
          newTextTwoTextarea.className = "mydisplaytext"
          newTextTwoTextarea.cols = "52";newTextTwoTextarea.wrap="hard"
          newTextTwoTextarea.id = textareaNumber
          newTextTwoTextarea.innerText = getRequest.responseText[c][1]
          newTextBoxtwo.appendChild(newTextTwoTextarea)//
          var hr = document.createElement('hr')
          hr.className = "hr"
          newTextBox.appendChild(hr)
        }
        console.log("刷新成功")

      }

    }
    else {//留言刷新失败提示
      console.log(postRequest.responseText)
      document.getElementById('msgfontBox').style.display = "block"
      document.getElementById('msg').innerText = "留言刷新失败"
      setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
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
        console.log("请求刷新成功")
        boxnumber = getRequest.responseText.length


        var postedText = document.getElementById('writeMytext').innerText
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
            newTextBoxoneUL_li_font1.setAttribute('onclick', 'motifyText(textareaNumber)')
            newTextBoxoneUL_li_4.appendChild(newTextBoxoneUL_li_font1)
            newTextBoxoneUL_li_font1.innerText = "修改"/*修改*/

            var newTextBoxoneUL_li_5 = document.createElement('li');
            newTextBoxoneUL.appendChild(newTextBoxoneUL_li_5)
            var newTextBoxoneUL_li_font2 = document.createElement('span');
            newTextBoxoneUL_li_font2.className = "font1";
            newTextBoxoneUL_li_5.appendChild(newTextBoxoneUL_li_font2)
            newTextBoxoneUL_li_font2.setAttribute('onclick', 'deleteText(newTextBox.id)')
            newTextBoxoneUL_li_font2.innerText = "删除"/*删除*/



            var newTextBoxoneUL_li_6 = document.createElement('li');
            newTextBoxoneUL.appendChild(newTextBoxoneUL_li_6)
            var newTextBoxoneUL_li_font3 = document.createElement('span');
            newTextBoxoneUL_li_font3.className = "font1";
            newTextBoxoneUL_li_font3.setAttribute('onclick','finishmotifyText(newTextBox.id)')
            newTextBoxoneUL_li_6.appendChild(newTextBoxoneUL_li_font3)
            newTextBoxoneUL_li_font3.innerText = "完成"/*完成*/


            var newTextTwoTextarea = document.createElement('textarea')
            newTextTwoTextarea.className = "mydisplaytext"
            newTextTwoTextarea.cols = "52"
            newTextTwoTextarea.wrap="hard"
            newTextTwoTextare.innerTexta = postedText/*发表的留言*/
            newTextTwoTextarea.id = textareaNumber
            newTextBoxtwo.appendChild(newTextTwoTextarea)
            var hr = document.createElement('hr')
            hr.className = "hr"
            newTextBox.appendChild(hr)

          }
          else {
            console.log(postRequest.responseText)
            document.getElementById('msgfontBox').style.display = "block"
            document.getElementById('msg').innerText = "留言发表失败"
            setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
              ;/*提示发送失败*/
          }
        }
      }
    }
  }
}

function personalDataChange() {/*修改个人信息和用户名*/
  document.getElementById("username3").removeAttribute('disabled');
  document.getElementById("sex1").removeAttribute('disabled');
  document.getElementById("age1").removeAttribute('disabled');
  document.getElementById("address1").removeAttribute('disabled');
  document.getElementById("personalDataChangeFinish").style.display = "block";
  document.getElementById('personalDataChange').style.display = "none";
}

function personalDataChangeFinish() {/*完成个人信息和用户名修改*/
  document.getElementById("personalDataChangeFinish").style.display = "none";
  document.getElementById('personalDataChange').style.display = "block";
  //发送修改
  if (document.getElementById("username3").innerText != document.getElementById('pageusername')) {/*修改用户名*/
    var username_change = { username: document.getElementById("username3").innerText }
    postRequest.open("POST", BaseURL + '/username');
    postRequest.send(JSON.stringify(username_change))
   
    postRequest.onreadystatechange = function () {
      if (postRequest.readyState == 4 && postRequest.status == 200) {
        console.log(postRequest.responseText)
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "用户名修改成功"
        setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
      }
      else {
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "用户名修改失败"
        setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)

      }
    }
  }
  else {/*修改个人信息*/
    var sex_ = document.getElementById("sex1").innerText
    var age_ = document.getElementById('age1').innerText
    var address_ = document.getElementById('address1').innerText
    var personalDataChange = {
      sex: sex_,
      age: age_,
      address: address_
    }
    postRequest.open("POST", BaseURL + '/information');
    postRequest.send(JSON.stringify(personalDataChange))
    
    postRequest.onreadystatechange = function () {
      if (postRequest.readyState == 4 && postRequest.status == 200) {
        console.log(postRequest.responseText)
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "个人信息修改成功"
        setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
      }
      else {
        console.log(postRequest.responseText)
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "个人信息修改失败"
        setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
      }

    }
  }
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
function finishPasswordChange(){/*完成修改密码*/
  var newPassword_= document.getElementById("newPassword").innerText
  var newPassword = {password:newPassword_}
  postRequest.open("POST", BaseURL + '/password');
    postRequest.send(JSON.stringify(newPassword))
    
    postRequest.onreadystatechange = function () {
      if (postRequest.readyState == 4 && postRequest.status == 200) {
        console.log(postRequest.responseText)
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "密码修改成功"
        setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
      }
      else {
        console.log(postRequest.responseText)
        document.getElementById('msgfontBox').style.display = "block"
        document.getElementById('msg').innerText = "密码修改失败"
        setTimeout(function(){document.getElementById('msgfontBox').style.display = "none"}, 10000)
      }

    }
  document.getElementById('personalDatabox').style.display ="block";
    document.getElementById('displayBox').style.display = "none";
    document.getElementById("postmytextBox").style.display = "none";
    document.getElementById("changePasswordPage").style.display = "none";

}
