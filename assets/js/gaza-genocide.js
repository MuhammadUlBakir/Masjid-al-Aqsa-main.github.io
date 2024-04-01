// VIDEOS dynamic addition code
// VIDEOS dynamic addition code
// VIDEOS dynamic addition code
// VIDEOS dynamic addition code
// VIDEOS dynamic addition code
// VIDEOS dynamic addition code

let videosCurrentPage = 1;
const loadMoreVideosBtn = $("#load-more-videos");

// Function to check if the next page exists
function ensureNextVideosPage(page) {

  return $.ajax({
    url: `/dynamic/gaza-genocide/videos-${page}.html`,
    method: "GET",
  })
    .done((data, textStatus, jqXHR) => {

      // Next page does not exist
      if (jqXHR.status === 404) {
        loadMoreVideosBtn.addClass("d-none");
        loadMoreVideosBtn.find(".spinner-loader").hide();
        return false; 
      }

      // Next page exists
      return true; 
    })

    .fail((jqXHR, textStatus, errorThrown) => {
      console.error("Error checking next page:", errorThrown);

      if (jqXHR.status === 404) {
        loadMoreVideosBtn.addClass("d-none");
      }

      return false;
    });
}

// Function to load more videos
function loadVideos(page) {

  // Show spinner loader
  loadMoreVideosBtn.find(".spinner-loader").show();

  $.ajax({
    url: `/dynamic/gaza-genocide/videos-${page}.html`,
    method: "GET",
  })
    .done((data) => {

      $("#dynamic-video-grid").append(data);
      loadMoreVideosBtn.siblings(".dynamic-message").hide();
      loadMoreVideosBtn.find(".spinner-loader").hide();

      videosCurrentPage++;

      // Check for the next page after loading the current page
      ensureNextVideosPage(page + 1);
    })

    .fail((jqXHR, textStatus, errorThrown) => {
      console.error("Error loading more videos:", errorThrown);
      loadMoreVideosBtn.siblings(".dynamic-message").show();
      loadMoreVideosBtn.find(".spinner-loader").hide();
    });
}

// Initial check for the existence of page 1 on page load
ensureNextVideosPage(1);

// Event listener for the Load More button
loadMoreVideosBtn.on("click", function () {
  loadVideos(videosCurrentPage);
});




// IMAGES dynamic addition code
// IMAGES dynamic addition code
// IMAGES dynamic addition code
// IMAGES dynamic addition code
// IMAGES dynamic addition code
// IMAGES dynamic addition code


let imagesCurrentPage = 1;
const loadMoreImagesBtn = $("#load-more-images");

// Function to check if the next page exists
function ensureNextImagesPage(page) {

  return $.ajax({
    url: `/dynamic/gaza-genocide/images-${page}.html`,
    method: "GET",
  })
    .done((data, textStatus, jqXHR) => {

      // Next page does not exist
      if (jqXHR.status === 404) {
        loadMoreImagesBtn.addClass("d-none");
        loadMoreImagesBtn.find(".spinner-loader").hide();
        return false; 
      }

      // Next page exists
      return true; 
    })

    .fail((jqXHR, textStatus, errorThrown) => {
      console.error("Error checking next page:", errorThrown);

      if (jqXHR.status === 404) {
        loadMoreImagesBtn.addClass("d-none");
      }

      return false;
    });
}

// Function to load more images
function loadImages(page) {

  // Show spinner loader
  loadMoreImagesBtn.find(".spinner-loader").show();

  $.ajax({
    url: `/dynamic/gaza-genocide/images-${page}.html`,
    method: "GET",
  })
    .done((data) => {

      $("#dynamic-image-grid").append(data);
      loadMoreImagesBtn.siblings(".dynamic-message").hide();
      loadMoreImagesBtn.find(".spinner-loader").hide();

      imagesCurrentPage++;

      // Process new insta embeds
      if (typeof instgrm !== 'undefined' && instgrm.Embeds) {
        instgrm.Embeds.process();
      }

      // Check for the next page after loading the current page
      ensureNextImagesPage(page + 1);

    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.error("Error loading more images:", errorThrown);
      loadMoreImagesBtn.siblings(".dynamic-message").show();
      loadMoreImagesBtn.find(".spinner-loader").hide();
    });
}

// Initial check for the existence of page 1 on page load
ensureNextImagesPage(1);

// Event listener for the Load More button
loadMoreImagesBtn.on("click", function () {
  loadImages(imagesCurrentPage);
});
