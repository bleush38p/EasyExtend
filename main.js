var site = {
  changingPage: true,
  page: 'landing',
  pages: [
    'start',
    'faq',
    'exts',
    'dev'
  ],
  resources: {
    start: 'pages/start.md',
    faq: 'pages/faq.md',
    dev: 'pages/dev.md',
    exts: 'pages/exts.md'
  }
};

site.start = function () {
  
  setTimeout(site.update, 2000);
  
  $('[data-change-page]').click(function(){
    if (site.changingPage) return false;
    site.changingPage = true;
    setTimeout(site.update, 100)
  });
  
  $(window).on('popstate', site.update);
};

site.update = function () {
  var hash = document.location.hash;
  var pageindex = $.inArray(hash.substr(1), site.pages)
  site.page = hash.substr(1);
  if (pageindex < 0){
    document.location.hash = '';
    site.page = '';
    $('body').addClass('noscroll page-landing');
    site.loadPage();
  } else {
    site.changingPage = true;
    $('body').removeClass('noscroll page-landing');
    site.loadPage();
  }
};

site.loadPage = function () {
  if (site.page !== '') {
    $('.body-text').addClass('transparent');
    setTimeout(function () {
      $('.body-text').empty();
      $.ajax({
        url: site.resources[site.page]
      }).done(function (data) {
        $('.body-text').html(marked(data)).removeClass('transparent');
        setTimeout(function() {
          site.changingPage = false;
        }, 500);
      }).fail(function (data) {
        document.location.hash = '';
        site.update();
      });
    }, 500)
  } else {
    $('.body-text').addClass('transparent');
    setTimeout(function() {
      $('.body-text').empty();
      site.changingPage = false;
    }, 500);
  }
};

$(site.start);