// app.js
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        alert("登录成功！");
        // 可以在这里加入登录的API调用
    } else {
        alert("请输入用户名和密码");
    }
});
