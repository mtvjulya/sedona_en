let hostelSearch = document.querySelector(".hostel-search");
let openFormButton = hostelSearch.querySelector(".button-search");
let mainForm = hostelSearch.querySelector(".main-form");
let adults = mainForm.querySelector("[id='adults']");
let children = mainForm.querySelector("[id='children']");

let isStorageSupport = true;
let storageChildren = "";
let storageAdults = "";


try {
  storageChildren = localStorage.getItem("children");
storageAdults = localStorage.getItem("adults");
} catch (err) {
  isStorageSupport = false;
}

if (storageAdults||storageChildren) {
  children.value = storageChildren;
  adults.value = storageAdults;
  console.log(children.value);
}

openFormButton.addEventListener("click", function(){
  console.log("hello");

  if(mainForm.classList.contains("open")){
    mainForm.classList.remove("open");
    mainForm.offsetWidth = mainForm.offsetWidth;
    mainForm.classList.add("hidden");

  }else{

    mainForm.classList.remove("hidden");
    mainForm.offsetWidth = mainForm.offsetWidth;
    mainForm.classList.add("open");

  }

})

mainForm.addEventListener("submit", function(evt){

  evt.preventDefault();
  console.log("hello");
  if (isStorageSupport) {
    localStorage.setItem("children", children.value);
    localStorage.setItem("adults",adults.value);
  }

})
