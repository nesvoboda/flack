    function logout() {
      localStorage.removeItem("display_name");
      location.href("/index")
    }
    
    function setStorage(link) {

        localStorage.setItem("channel_name", link.innerHTML);
    }

    if (localStorage.getItem("channel_name")) {

        alert('You have channel name. You will be redirected')
        //window.location.replace(`/channel/${localStorage.getItem("channel_name")}`);
    }

    document.addEventListener('DOMContentLoaded', () => {

         document.querySelector('#channel_name_input').onkeyup = function() {

        if (this.value.length > 0) {
            document.getElementById('channel_name_submit').disabled = false;
        } else {
            document.getElementById('channel_name_submit').disabled = true;
    }
    };


        document.querySelector('#channel_name_form').onsubmit = () => {

            // Initialize new request
            const request = new XMLHttpRequest();
            const channel_name = document.querySelector('#channel_name_input').value;
            request.open('POST', '/create_channel');


            // Callback function for when request completes
            request.onload = () => {

                // Extract JSON data from request
                const data = JSON.parse(request.responseText);

                // Update the result div
                if (data.success) {
                    // add to localStorage
                    localStorage.setItem("channel_name", channel_name);

                    window.location.href = `/channel/${channel_name}`;
                    // redirect to next page

                } else {

                    document.querySelector('#result').innerHTML = 'It seems that a channel with this name already exists. Please try choosing another name.';
                }
            };

            // Add data to send with request
            const data = new FormData();
            data.append('channel_name', channel_name);

            // Send request
            request.send(data);


            return false;
        };

    });