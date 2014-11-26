var site = {
  changingPage: true,
  page: 'landing',
  pages: [
    'start',
    'guides',
    'guides/start',
    'guides/firstproj',
    'faq',
    'exts',
    'dev',
    'dev/manifest',
    'dev/submit',
    'ts'
  ],
  resources: {
    start: 'pages/quickstart.md',
    guides: 'pages/guides/index.md',
    'guides/firstproj': 'pages/guides/firstproject.md',
    'guides/start': 'pages/guides/quickstart.md',
    faq: 'pages/faq.md',
    exts: 'pages/extensions.md',
    dev: 'pages/developers/index.md',
    'dev/manifest': 'pages/developers/manifest.md',
    'dev/submit': 'pages/developers/submit.md',
    ts: 'pages/troubleshoot.md',
  }
};

site.start = function () {
  setTimeout(site.update, 100);
  
  $(window).on('popstate', site.update);
};

site.update = function () {
  $('.na').removeClass('na');
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