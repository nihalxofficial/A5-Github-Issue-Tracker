const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
const issueContainer = document.getElementById("issueContainer");
const spinner = document.getElementById("spinner");
const search = document.getElementById("search");
let issueCounter = document.getElementById("issueCounter");
let allIssues = [];



function toggle(id){
    allBtn.classList.remove("btn-primary");
    openBtn.classList.remove("btn-primary");
    closedBtn.classList.remove("btn-primary");

    const target = document.getElementById(id);
    target.classList.add("btn-primary");
}

const counter = (arr) => {
    issueCounter.innerText = arr.length;
}

const showLoading = (status) => {
    if(status){
        spinner.classList.remove("hidden");
    }else{
        spinner.classList.add("hidden")
    }
}
allBtn.addEventListener("click", () => {
    displayIssues(allIssues);
    counter(allIssues);
    
});
openBtn.addEventListener("click", () => {
    const openIssues = allIssues.filter(issue => issue.status === "open");
    displayIssues(openIssues);
    counter(openIssues);
});

closedBtn.addEventListener("click", () => {
    const closedIssues = allIssues.filter(issue => issue.status === "closed");
    displayIssues(closedIssues);
    counter(closedIssues);
});

async function loadIssues(){
    showLoading(true);
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    const res = await fetch(url);
    const data = await res.json();
    allIssues = data.data;    
    displayIssues(allIssues);

    showLoading(false);
    
}

function displayIssues(issues){
    issueContainer.innerHTML = "";
    issues.forEach(issue => {
        const card = document.createElement("div");
        card.className = `card shadow-md rounded-md p-4 bg-white border-t-4 ${issue.status === "open" ? "border-green-600": "border-purple-600"}  cursor-pointer`
        card.innerHTML = `
        <div class="flex justify-between items-center">
            <img src="${issue.status === "open" ? "./assets/Open-Status.png": "./assets/Closed- Status .png"}" alt="">
            <div class="flex justify-center items-center uppercase w-[80px] ${issue.priority === "high" ? "bg-[#FEECEC]" : issue.priority === "medium" ? "bg-[#FFF6D1]" : "bg-[#EEEFF2]"}  rounded-full p-1">
                <h4 class=" text-sm   ${issue.priority === "high" ? "text-red-600" : issue.priority === "medium" ? "text-orange-600" : "text-purple-600"} font-semibold">${issue.priority}</h4>
            </div>
        </div>

        <h2 class="font-semibold mt-3 mb-1 text-xl">${issue.title}</h2>
        <p class="text-sm text-gray-600">${issue.description}</p>
    
        <div class="labels my-3 flex justify-start items-center gap-1.5 mt-3 ">
            
            ${createLabelElements(issue.labels)}
            
        </div>
    
        <hr class="text-gray-300 -mx-4 my-3">

        <p class="text-gray-500 text-sm">#1 by ${issue.author}</p>
        <p class="text-gray-500 text-sm mt-3">${issue.createdAt.split("T")[0]}</p>
        `;
        issueContainer.appendChild(card);
    });
    
}

const createLabelElements = (labels) => {
    return labels.map(el => {

        let labelClass = "bg-gray-50 text-gray-500 border-gray-300"; 
            if (el === "bug"){
                labelClass =  "bg-red-50 text-red-500 border-red-300";
            }else if(el === "help wanted"){
                labelClass = "bg-orange-50 text-orange-500 border-orange-300";
            }else if (el === "enhancement"){
                labelClass = "bg-green-50 text-green-500 border-green-300";
            }else if( el === "good first issue"){
                labelClass = "bg-blue-50 text-blue-500 border-blue-300";
            }else{
                labelClass = "bg-purple-50 text-purple-500 border-purple-300";
            }
        return `
        <div class="${labelClass} border rounded-full whitespace-nowrap font-semibold px-3 py-1 capitalize">
            <h4 class="text-xs"> <i class="fa-solid fa-life-ring"></i> ${el} </h4>
        </div>
        `;
    }).join("");
}

search.addEventListener("keyup", (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const searchValue = search.value;

        fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`)
        .then(res => res.json())
        .then(data => {
            const searchIssues = data.data;
            displayIssues(searchIssues);
            
            search.value = ''; 
            counter(searchIssues);
        })
        
        toggle("allBtn")
    }
})

loadIssues();