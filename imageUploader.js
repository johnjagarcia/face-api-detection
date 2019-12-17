function readURL(input) {
  if (input.files && input.files[0]) {
    var file = input.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      let result = e.target.result;
      addFaceToPersonByBinaryData(result);
      $("#blah").attr("src", result);
    };

    reader.readAsDataURL(file);
  }
}
