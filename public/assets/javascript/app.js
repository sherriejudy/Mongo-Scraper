$(".comment-btn").on("click", function() {
  $.ajax({
    url: "/api/getComment/" + $(this).attr("data-id"),
    success: function(result) {
      $(".modal-body").html(result.body);
    }
  });
  console.log($(this).text());
});
