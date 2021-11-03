const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '24153303-b71540bd4e8e8349448d6bfbf';
// show images 
const showImages = (images) => {
  toggleSpinner();
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);    
  })
}

const getImages = (query) => {
  toggleSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)
  .then(response => response.json())
    .then(data => {
          if(data.hits.length === 0 || query === "" ){
            alert('Please search image by name');
            galleryHeader.style.display = 'none';
            gallery.innerHTML = '';
          }else{
            showImages(data.hits);
          }
    } )
    .catch(err => getError(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
  let item = sliders.indexOf(img);
  
  if (item === -1) {
    sliders.push(img);
  } else {
    // alert('Hey, Already added !')
    element.classList.toggle('d-none');
  }
 let selectedImgCount = sliders.length; 
 document.getElementById('selected-img').innerHTML = selectedImgCount; 
}
var timer
const createSlider = () => {
  toggleSpinner();
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
// condition for slider duration
  let  duration = document.getElementById('duration').value;
    if(typeof(duration) === 'number' || duration >= 500){
      duration = document.getElementById('duration').value;
    }
    else{
      alert('Duration must be minimum 500 mill seconds');
	    imagesArea.style.display = 'block';
		return;
    }

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration || 1000);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };
  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }
  items.forEach(item => {
    item.style.display = "none"
  })
  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value);
  sliders.length = 0;
  search.value = ""; 
  document.getElementById('selected-img').innerHTML = 0; 
  document.getElementById('duration').value = ""; 
 })

sliderBtn.addEventListener('click', function () {
  createSlider();
  toggleSpinner();
})
// error handling
const getError = (err) => {
  document.getElementById('network-error').innerHTML = err.message;
}

const search = document.getElementById('search');
search.addEventListener("keyup", function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchBtn.click();
  }
});

const duration = document.getElementById('duration')
duration.addEventListener("keyup", function(e){
  if(e.key === 'Enter'){
    e.preventDefault();
    sliderBtn.click();
  }
})
// loading spinner
const toggleSpinner = () => {
  const spinnerLoad = document.getElementById('spinner-loading');
  spinnerLoad.classList.toggle('d-none');
}



