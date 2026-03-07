const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");


function toggle(id){
    allBtn.classList.remove("btn-primary");
    openBtn.classList.remove("btn-primary");
    closedBtn.classList.remove("btn-primary");

    const target = document.getElementById(id);
    target.classList.add("btn-primary");
}