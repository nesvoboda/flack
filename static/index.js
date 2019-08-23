function req() {
    //    document.querySelector('#form').onsubmit = event => {

    // Initialize new request
    const request = new XMLHttpRequest();
    const display_name = document.querySelector('#display_name').value;
    request.open('POST', '/login');

    // Callback function for when request completes
    request.onload = () => {

        // Extract JSON data from request
        const data = JSON.parse(request.responseText);

        // Update the result div
        if (data.success) {
            // add to localStorage
            localStorage.setItem("display_name", document.querySelector('#display_name').value);

            window.location.replace("/success");
            // redirect to next page

        } else {

            document.querySelector('#result').innerHTML = 'There was an error.';
        }
    };

    // Add data to send with request
    const data = new FormData();
    data.append('display_name', document.querySelector('#display_name').value);

    // Send request
    request.send(data);
    return false;
}


document.ontouchmove = function(e) {
    e.preventDefault();
};

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#display_name').onkeyup = function() {

        if (this.value.length > 0) {

            document.getElementById('signed-in').disabled = false;
            document.getElementById('signed-in-2').disabled = false;
            document.querySelector('#signed-div').onclick = req;
            document.querySelector('#signed-div-2').onclick = req;
        } else {
            document.getElementById('signed-in').disabled = true;
            document.getElementById('signed-in-2').disabled = true;
            document.querySelector('#signed-div').onclick = void(0);
            document.querySelector('#signed-div-2').onclick = void(0);
        }
    };

    if (localStorage.getItem("display_name")) {
        window.location.replace("/success");
    }

    // document.querySelector('#signed-div').onclick = req;
    // document.querySelector('#signed-div-2').onclick = req;

    //
});