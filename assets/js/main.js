// Loads components on the page
// IMPORTANT: Must be the first thing to load in the JS
document.addEventListener("DOMContentLoaded", function () {
  //Navbar
  fetch("/components/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;

      // Navbar additional JS
      var navbar = $("#navbar");
      $(".navbar-toggler").click(function () {
        navbar.toggleClass("active");
        $("body").toggleClass("navOpen");
      });
    });

  // Footer
  fetch("/components/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;

      // important for twitter follow btn
      document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach(function (element) {
          new bootstrap.Tooltip(element);
        });
    });
});

window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('../../sw.js');
  }
}


// Document ready
// Document ready
// Document ready
$(document).ready(function () {
  var modalHtml =
    '<div class="modal fade" id="copyrightModal" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog"><div class="modal-content">' +
    '<div class="modal-header"><h6 class="modal-title">Copyright Info</h6>' +
    '<div type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></div></div>' +
    '<div class="modal-body"></div></div></div></div>';
  $("body").append(modalHtml);

  // Ensure lazy loading works
  ensureLazyloadWorks();

  /*
    Fancybox
  */
  $(".fancy-box").each(function (index) {
    var images = $(this).find("img");
    var galleryName = "gallery-" + index;
    images.attr("data-fancybox", galleryName);

    Fancybox.bind("[data-fancybox]", {
      compact: false,
      groupAll: false,
      Thumbs: false,
      contentClick: false,
      autoFocus: true,
      idle: false,
      Images: {
        Panzoom: {
          maxScale: 3,
        },
      },
      Toolbar: {
        display: {
          right: ["zoomOut", "zoomIn", "fullscreen", "close"],
        },
      },

      caption: function (fancybox, slide) {
        var title = slide.triggerEl?.dataset.ccTitle || "";
        var source = slide.triggerEl?.dataset.ccSource || "";
        var author = slide.triggerEl?.dataset.ccAuthor || "";
        var status = slide.triggerEl?.dataset.ccStatus || "";
        var link = slide.triggerEl?.dataset.ccLink || "";
        var caption = slide.caption ? slide.caption : "";

        var finalCaption = caption;
        if (source) {
          finalCaption += (caption ? " " : "") + "&nbsp; (© " + source + ")";
        }

        var copyrightButton = "";
        if (title || author || status || link) {
          copyrightButton = `<button type='button' class='image-copyright'
                                       data-cc-title='${title}'
                                       data-cc-source='${source}'
                                       data-cc-author='${author}'
                                       data-cc-status='${status}'
                                       data-cc-link='${link}'>
                                       View copyright info
                                    </button>`;
        }

        return finalCaption + copyrightButton;
      },
    });
  });

  /*
    Fancy carousel
  */
  const carouselContainers = document.querySelectorAll(".fancy-carousel");
  carouselContainers.forEach(function (container, index) {
    const options = {
      Dots: false,
      Navigation: false,
      Thumbs: {
        type: "classic",
      },
    };

    new Carousel(container, options, { Thumbs });
  });

  // Masonry
  if ($(".masonry-gallery").length) {
    $(".masonry-gallery").imagesLoaded(function () {
      $(".masonry-gallery").masonry({
        itemSelector: ".grid-item",
      });
    });
  }

  // Table of contents
  if ($(".js-toc").length) {
    tocbot.init({
      // Where to render the table of contents.
      tocSelector: ".js-toc",

      // Where to grab the headings to build the table of contents.
      contentSelector: ".js-toc-content",

      // Which headings to grab inside of the contentSelector element.
      headingSelector: "h2",
      // headingsOffset: 50,
      // scrollSmoothOffset: -50
    });

    tocbot.refresh();

    var $tocAccordion = $(".toc-wrapper .accordion-collapse");
    $(".toc-link").click(function () {
      $tocAccordion.collapse("hide");
    });
  }

  // Scroll to top when the button is clicked
  $(".go-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });

  // Initialize tooltips
  document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(function (element) {
      new bootstrap.Tooltip(element);
    });
});

// Modal show and data addition when we click copyright button
$(document).on("click", ".image-copyright", function (event) {
  event.stopPropagation();
  var info = $(this).data("ccTitle") || "";
  var source = $(this).data("ccSource") || "";
  var author = $(this).data("ccAuthor") || "";
  var status = $(this).data("ccStatus") || "";
  var link = $(this).data("ccLink") || "";

  var modalBodyHtml = "";
  if (info) {
    modalBodyHtml += "<p><strong>Title</strong>: " + info + "</p>";
  }
  if (source) {
    modalBodyHtml += "<p><strong>Source</strong>: " + source + "</p>";
  }
  if (author) {
    modalBodyHtml += "<p><strong>Author</strong>: " + author + "</p>";
  }
  if (status) {
    modalBodyHtml += "<p><strong>Status</strong>: " + status + "</p>";
  }
  if (link) {
    modalBodyHtml +=
      '<p><strong>Link</strong>: <a href="' +
      link +
      '" target="_blank" rel="nofollow noreferrer noopener" style="word-break: break-all;" >' +
      link +
      "</a></p>";
  }

  var modalBody = $("#copyrightModal .modal-body");
  modalBody.html(modalBodyHtml);
  $("#copyrightModal").modal("show");
});
// checking
/*
    Ensure lazyloading works otherwise work fallback
  */
function ensureLazyloadWorks() {
  if (typeof lazysizes === "undefined" || lazysizes === null) {
    $(".lazyload").each(function () {
      var dataLazySrc = $(this).data("lazy");
      if (dataLazySrc) {
        $(this).attr("src", dataLazySrc);
      }
    });
  }
}

// Fade in/out the button based on scroll position
$(window).scroll(function () {
  if ($(this).scrollTop() < 1000) {
    $(".go-to-top").removeClass("d-flex");
  } else {
    $(".go-to-top").addClass("d-flex");
  }
});
