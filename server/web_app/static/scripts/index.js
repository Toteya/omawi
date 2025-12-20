// Handles standard interactivy of web application
export function isLoggedIn() {
  const isLoggedIn = document.querySelector('#isLoggedIn');
  return isLoggedIn.value == 'True';
}

$(document).ready(() => {
  const burgerIcon = $('#burger')[0];
  const navbarMenu = $('#navbar-links')[0];

  burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
    burgerIcon.classList.toggle('is-active');
  })

  if (isLoggedIn()) {
    $('#signup').hide();
    $('#login').hide();
    $('#logout').show();
    $('#profile').show();
  } else {
    console.log('LOGGED OUT!')
    $('#signup').show();
    $('#login').show();
    $('#logout').hide();
    $('#profile').hide();
  }
});