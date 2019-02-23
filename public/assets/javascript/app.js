$(".comment-btn").on("click", function() {
  $.ajax({
    url: "/api/getComment/" + $(this).attr("data-id"),
    success: function(result) {
      if (!result.body) {
        let body = $(".modal-body p");
        body.html("No comments for this article yet.");
        return;
      }
      let body = $(".modal-body p");
      let form = $("<form></form>")
        .attr("action", "/api/deleteComment/" + result._id)
        .attr("method", "POST")
        .append(
          $("<button></button>")
            .attr("type", "submit")
            .attr("class", "btn btn-danger deleteComment")
            .text("X")
        );
      body.html(result.body);
      body.append(form);
    }
  });
});
