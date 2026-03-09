const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
const issueContainer = document.getElementById("issueContainer");
const spinner = document.getElementById("spinner");
const search = document.getElementById("search");
const detailsContainer = document.getElementById("detailsContainer");
const newIssue = document.getElementById("newIssue");
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
        card.onclick = () => {
            showDetails(`${issue.id}`)
        }
        card.className = ` card shadow-md rounded-md p-4 bg-white border-t-4 ${issue.status === "open" ? "border-green-600": "border-purple-600"}  cursor-pointer`
        card.innerHTML = `
        <div  class="flex justify-between items-center">
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

        let labelClass; 
        let labelSign;
            if (el === "bug"){
                labelClass =  "bg-red-50 text-red-500 border-red-300";
                labelSign = '<i class="fa-solid fa-bug"></i>';
            }else if(el === "help wanted"){
                labelClass = "bg-orange-50 text-orange-500 border-orange-300";
                labelSign = '<i class="fa-solid fa-life-ring"></i>';
            }else if (el === "enhancement"){
                labelClass = "bg-green-50 text-green-500 border-green-300";
                labelSign = '<i class="fa-solid fa-wand-magic-sparkles"></i>';
            }else if( el === "good first issue"){
                labelClass = "bg-blue-50 text-blue-500 border-blue-300";
                labelSign = '<i class="fa-solid fa-star"></i>';
            }else{
                labelClass = "bg-purple-50 text-purple-500 border-purple-300";
                labelSign = '<i class="fa-solid fa-book"></i>';
            }
        return `
        <div class="${labelClass} border rounded-full whitespace-nowrap font-semibold px-3 py-1 capitalize">
            <h4 class="text-xs"> ${labelSign} ${el} </h4>
        </div>
        `;
    }).join("");
}

search.addEventListener("keyup", (event) => {
    if (event.key === 'Enter'){
        searchIssues();
        event.preventDefault();
    }
})

newIssue.addEventListener("click", ()=> {
    searchIssues();
})

const searchIssues =() => {
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

loadIssues();

const  showDetails = async (id) => {
    // console.log(id);
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    const data = await res.json();
    const details = data.data;

    detailsContainer.innerHTML = `
    <div class="modal-box p-7">
                <h2 class="font-bold mb-1 text-xl">${details.title}</h2>
                <div class="mt-3 mb-6">
                    <span class=" ${details.status==="open"? "bg-green-600" : "bg-purple-600"} text-white py-1 px-2 rounded-full text-xs capitalize">${details.status}</span> &bull; <span class="text-xs">Opened by ${details.author}</span> &bull; <span class="text-xs">${details.createdAt.split("T")[0]}</span>
                </div>

                <div class="labels my-3 flex justify-start items-center gap-1.5 mt-3 ">
                
                    ${createLabelElements(details.labels)}
                
                </div>
                <p class="text-sm text-gray-600 my-6">${details.description}</p>

                <div class="flex justify-between items-center bg-[#F8FAFC] p-4 rounded-lg">
                    <div>
                        <p class="text-gray-600 text-sm">Assignee:</p>
                        <h2 class="font-semibold">${details.assignee ? details.assignee: "Not Assigned"}</h2>
                    </div>

                    <div>
                        <h2 class="text-gray-600 text-sm">Priority:</h2>
                        <h2 class="0  ${details.priority==="high"? "bg-red-600" : details.priority==="medium" ?"bg-orange-600" : "bg-purple-600"} text-white py-1 px-3 rounded-full text-xs uppercase">${details.priority}</h2>
                    </div>
                </div>

                <div class="modal-action">
                    <form method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn btn btn-primary">Close</button>
                    </form>
                </div>
            </div>
    `;

    issue_modal.showModal();
    
}