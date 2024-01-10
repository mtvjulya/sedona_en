let navToggle  = document.querySelector(".nav-toggle");
let mainNav  = document.querySelector(".main-nav");

navToggle.addEventListener("click",function(){
  console.log("hello");
  if(mainNav.classList.contains("main-nav--closed")){
    mainNav.classList.add("main-nav--opened");
    mainNav.classList.remove("main-nav--closed");
  }else{
    mainNav.classList.remove("main-nav--opened");
    mainNav.classList.add("main-nav--closed");
  }
})
