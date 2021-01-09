var postRequest,getRequest;
if (window.XMLHttpRequest)
  {
    postRequest = new XMLHttpRequest();
   getRequest = new XMLHttpRequest(); 
  }
else 
  {
   postRequest = new ActiveXObject("Microsoft.XMLHTTP");
   getRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }
var BaseURL ='http://127.0.0.1:5000/';

function postloginsend(){
    console.log("登陆的账号和密码已发送")
  }
function postLogin(){
  if(document.getElementById("username1").value== undefined || document.getElementById("password1").value== undefined){
    document.getElementById('loginmsg').innerHTML='请输入用户名或密码' 
  }
  else {var username1 = document.getElementById("username1").value;
  var password1 = document.getElementById("password1").value;
  var postData1 = {
    username: username1,
    password: password1,
  };
  postRequest.open("POST",BaseURL+'/login');
  postRequest.send(JSON.stringify(postData1))
  postloginsend()
  postRequest.onreadystatechange =function(){
    if(postRequest.readyState==4&&postRequest.status == 200){
      console.log(postRequest.responseText)
      document.getElementById('loginmsg').innerHTML='登陆成功';
      document.getElementById('tipBox').style.display="none";
      document.getElementsByClassName('displayBoxtwo').style.display="block";
      document.getElementsByClassName('displayBoxthree').style.display="block";
      getpersonalData()
    }
    else {
      document.getElementById('loginmsg').innerHTML='用户名或密码错误';
    }
  }}
  
}



function postRegistersend(){
  console.log("注册的信息已发送")
}
function postRegister(){
  var username2 = document.getElementById("username2").value;
  var password2 = document.getElementById("password2").value;
  var age = document.getElementById("age").value;
  var sex = document.getElementById("sex").value;
  var address = document.getElementById("address").value;
  var postData2 = {
    username: username2,
    password: password2,
    age:age,
    sex:sex,
    address:address
  };
  postRequest.open("POST",BaseURL+'/login');
  postRequest.send(JSON.stringify(postData2))
  postRegistersend()
  postRequest.onreadystatechange =function(){
    if(postRequest.readyState==4&&postRequest.status == 200){
      console.log(postRequest.responseText)
      document.getElementById('registermsg').innerHTML='注册成功，请填写上方“登陆”';
    }
    else {
      document.getElementById('registermsg').innerHTML=postRequest.responseText;
    
    }
  }

}
function personalData(){
  document.getElementById('displayBox').style.display="none"
  document.getElementById('personalDatabox').style.display="block"}
  document.getElementById("motifytextBox").style.display="none";

function page(){
  document.getElementById('personalDatabox').style.display="none";
  document.getElementById('displayBox').style.display="block"
}

function motifytext(){
  document.getElementById("motifytextBox").style.display="block";
  
  document.getElementById('finish').style.display="block";
}

function finish(){
  document.getElementById('finish').style.display="none";
  var motifytext = document.getElementById('motifytextBox').innerText;
  document.getElementById('motifytextBox').style.display="none";
  document.getElementsByClassName('mydisplaytext').innerHTML= motifytext;
  postRequest.open("POST",BaseURL+'/add_comment');
  postRequest.send(JSON.stringify(motifytext));
  postRequest.onreadystatechange =function(){
    if(postRequest.status == 200){
      console.log(postRequest.responseText)
      
    }
    else {
      alert( postRequest.responseText)
    }
  }
}

function getpersonalData(){//获取个人信息
  getRequest.open('GET',BaseURL+'/me');
  getRequest.send();
  getRequest.onreadystatechange = function() {
    if (getRequest.readyState == 4) {  
      if (getRequest.status == 200) {  
        console.log(getRequest.responseText)
        document.getElementById('username3').innerHTML=getRequest.responseText[0];
        document.getElementById('sex1').innerHTML=getRequest.responseText[1];
        document.getElementById('age1').innerHTML=getRequest.responseText[2];
        document.getElementById('address1').innerHTML=getRequest.responseText[3];
      }
    }
  }
}