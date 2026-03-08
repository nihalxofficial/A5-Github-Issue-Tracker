function getInputValue(){
    const userName = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(userName !== "admin"){
        alert("Invalid Username")
    }
    if(password !== "admin123"){
        alert("Invalid Password")
    }

    // window.location.href = "https://www.example.com";
    window.location.assign("./home.html");
}