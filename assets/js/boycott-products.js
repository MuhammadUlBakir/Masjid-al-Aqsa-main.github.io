var boycottProducts = [];
var fuse;

// Use AJAX to fetch the data
function fetchData() {
    $.ajax({
        url: "https://masjidalaqsa.b-cdn.net/assets/js/boycott-product.json",
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.length) {
                boycottProducts = data;
                var options = {
                    isCaseSensitive: false,
                    shouldSort: true,
                    includeScore: true,
                    matchAllTokens: true,
                    findAllMatches: true,
                    includeMatches: true,
                    threshold: 0.0,
                    location: 0,
                    distance: 0,
                    maxPatternLength: 32,
                    keys: [
                        "original_title",
                        "general_title",
                        "short_title",
                        "sub_brand.sub_original_title",
                        "sub_brand.sub_general_title",
                        "sub_brand.sub_short_title",
                    ],
                };
                fuse = new Fuse(boycottProducts, options);
            } else {
                throw new Error("data not found");
            }
        },
        error: function (error) {
            console.error("Error fetching JSON:", error);
        },
    });
}

$(window).on("load", function () {
    if (!boycottProducts.length) {
        fetchData();
    }
});

$(document).ready(function () {
    var productSearchInput = $(".product-searchbar");
    var productSearchBtn = $(".product-btn");
    var productsContainer = $("#searchedProducts");
    var searchResultCounter = $(".result-counter");

    function doSearch() {
        if (productSearchInput.val().length > 0) {
            var resultJSON = fuse.search(
                productSearchInput.val().trimStart().trimEnd()
            );
            renderVisual(resultJSON);
            setResult(resultJSON);
        } else {
            productsContainer.html("");
            searchResultCounter.html("");
        }
    }

    function setResult(resultJSON) {
        if (productSearchInput.val().trim().length !== 0) {
            if (resultJSON.length === 0) {
                searchResultCounter.html(
                    `<p>${resultJSON.length} results for "${productSearchInput
                        .val()
                        .trimStart()
                        .trimEnd()}" <span class="text-success fw-semibold fst-italic"> — it should be safe to use</span></p>`
                );
            } else {
                searchResultCounter.html(
                    `<p>${resultJSON.length} results for "${productSearchInput
                        .val()
                        .trimStart()
                        .trimEnd()}"</p>`
                );
            }
        } else {
            searchResultCounter.html("");
        }
    }

    function renderVisual(resultJSON) {
        // let product = resultJSON.reduce((sum, curr) => {
        let productHTML = resultJSON
            .map((result) => {
                const item = result.item;
                let matchedSubBrand;

                result.matches.forEach((match) => {
                    if (match.key.startsWith("sub_brand.")) {

                        item.sub_brand.some((subBrand) => {
                            // Checks if subBrand has the property that matched
                            if (subBrand[match.key.split(".")[1]] == match.value) {
                                matchedSubBrand = subBrand;
                                return true;
                            }
                            return false;
                        });
                    }
                });

                const parentTitle = item.original_title;
                const logo = matchedSubBrand?.sub_logo || item.logo;
                const title = matchedSubBrand?.sub_original_title || item.original_title;
                const info =
                    matchedSubBrand && matchedSubBrand.sub_info ? matchedSubBrand.sub_info + " " + (matchedSubBrand.sub_extra_info || "") : item.info + " " + item.extra_info;

                const proof = (matchedSubBrand?.sub_proof?.[0]?.length > 0 ? matchedSubBrand.sub_proof[0] : item.proof?.[0]?.length > 0 ? item.proof[0] : "");



                // Main product
                let sum = `
                    <div class="product position-relative">
                    <p class="tagline fs-18 fst-italic text-red fw-semibold">Yes, boycott!</p>
                    <div class="d-flex flex-column flex-sm-row gap-2 gap-sm-3">
                        <div class="logo-wrapper">
                            <img src="https://masjidalaqsa.b-cdn.net/assets/images/boycott/${logo}" class="w-100 h-100 object-fit-contain" alt="">
                        </div>
                        <p>`;

                if (matchedSubBrand) {
                    sum += `<strong>${title} is a brand of ${parentTitle}</strong><br>`;
                }

                sum += `${info}`

                // Add proof link
                if (proof.length) {
                    sum += `<a href="${proof}" target="_blank" rel="noopener noreferrer nofollow" class="btn btn-sm btn-primary border-0 w-fit-content d-block d-sm-inline ms-0 ms-sm-2 mt-2 mt-sm-0">Proof</a>`;
                }

                sum += `</p></div>`;

                // Show sub-brands if available - up to 4
                if (item.sub_brand && item.sub_brand.length > 0) {
                    const subBrandsHTML = item.sub_brand.slice(0, 4).reduce((subSum, subItem) => {
                        const { sub_logo, sub_original_title } = subItem;
                        subSum += `
                                <div class="logo-wrapper">
                                    <img src="https://masjidalaqsa.b-cdn.net/assets/images/boycott/${sub_logo}"
                                        class="w-100 h-100 object-fit-contain p-0" data-bs-toggle="tooltip"
                                        data-bs-title="${sub_original_title}">
                                </div>`;

                        return subSum;
                    }, "");

                    // Add subBrandsHTML to the main product HTML
                    sum += `
                            <div class="d-flex flex-wrap align-items-center justify-content-center row-gap-3 row-gap-sm-4 column-gap-2 p-0 mt-4 sub-brands">
                                    ${subBrandsHTML}
                                    <p class="fs-14">All other ${parentTitle} products</p>
                            </div>
                        </div>`;
                } else {
                    // Close the main product div if there are no sub-brands
                    sum += "</div>";
                }

                return sum;
            })
            .join("");

        productHTML += productHTML.length
            ? `<div class="mb-4"><div class="fs-14 color-secondary pt-2 text-center fst-italic">End of results</div><div class="line-divider w-100"></div></div>`
            : "";

        productsContainer.html(productHTML);
        initToolTip();
    }

    function initToolTip() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }

    productSearchInput.on("input", () => {
        if (boycottProducts.length) {
            doSearch();
        } else {
            fetchData();
        }
    });
    productSearchBtn.on("click", () => {
        if (boycottProducts.length) {
            doSearch();
        } else {
            fetchData();
        }
    });
});
