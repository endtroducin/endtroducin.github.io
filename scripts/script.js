//current position
var scrollPosition = window.scrollY;


//TBD - Preloader
//document.body.classList.add('test');
//document.body.classList.remove('disable_scrolling');

//qa variable
const title = document.querySelector('#title');
const category = document.querySelector('#category');


// const progress = document.getElementById('nav_progress');
// const intro = document.getElementById('intro');
// const navbar = document.getElementById('navbar');


// var elements = document.querySelectorAll('.className');
// for(var i = 0; i < elements.length; i++){
//     var str = elements[i].innerHTML;
//     elements[i].innerHTML = str.replace(":smile:", "<i class='em em-smile'></i>");
// }






window.addEventListener('scroll', function() {

//body height
const pageHeight = document.documentElement.scrollHeight;
//main
const sectionCount = document.querySelector('main').childElementCount;


    // current position updated on scroll
    scrollPosition = window.scrollY;

    //percentage between sections
    var transitionPosition = 1-((scrollPosition / pageHeight * sectionCount)-Math.floor((scrollPosition / pageHeight * sectionCount)))
    // if (transitionPosition === 1) {
    //   transitionPosition = 0;  
    // }

    const currentPage = Math.floor((scrollPosition / pageHeight * sectionCount)+1);

    var number = 0;
    var header = 100;

    // title.innerHTML = transitionPosition;

    switch (currentPage) {
      case 1:
        title.innerHTML = ""
        category.innerHTML = "";
        break;
      case 2:
        title.innerHTML = "Moving Up"
        category.innerHTML = "Postcards";
        break;
      case 3:
        title.innerHTML = "Going Green"
        category.innerHTML = "Postcards";
        break;
      case 4:
        title.innerHTML = "Peace Frogs"
        category.innerHTML = "Catalog";
        break;
      case 5:
        title.innerHTML = "BizPort"
        category.innerHTML = "Marketing";
        break;
      case 6:
        title.innerHTML = "Allegra"
        category.innerHTML = "Calendar";
        break;
      case 7:
        title.innerHTML = "Konikoff"
        category.innerHTML = "Brochures";
        break;
      case 8:
        title.innerHTML = "Promo Power"
        category.innerHTML = "Mailer";
        break;
      case 9:
        title.innerHTML = "Reopening"
        category.innerHTML = "Mailer";
        break;
      case 10:
        title.innerHTML = "Bay Daze"
        category.innerHTML = "Catalog";
        break;
      case 11:
        title.innerHTML = "Capabilities"
        category.innerHTML = "Folder";
        break;
      case 12:
        title.innerHTML = ""
        category.innerHTML = "";
        break;
      default:
        break;    
      }
    
      if (transitionPosition < 0.75) {
        title.style.filter = "opacity(0)";
        category.style.filter = "opacity(0)";
      } else {
        title.style.filter = "opacity(1)";
        category.style.filter = "opacity(1)";
      }

});


