var preview = document.querySelector('.previewPhoto');
var file = document.querySelector('input[type=file]').files[0];
var reader = new FileReader();

reader.onloadend = function() {
    preview.src = reader.result;
}

if (file) {
    reader.readAsDataURL(file);
    $scope.file = file;
} else {
    preview.src = "";
}