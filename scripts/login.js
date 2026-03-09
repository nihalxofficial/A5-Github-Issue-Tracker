function getInputValue(){
    const userName = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(userName !== "admin"){
        alert("Invalid Username");
        return;
    }
    if(password !== "admin123"){
        alert("Invalid Password")
        return;
    }
    window.location.assign("./home.html");
}