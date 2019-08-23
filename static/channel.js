function pad(d) {
    return (parseInt(d, 10) < 10) ? '0' + d.toString() : d.toString();
}

function addMessageNode(message_object) {

    var subdiv = document.createElement("DIV");
    subdiv.classList.add("row");
    subdiv.classList.add("justify-content-start");
    subdiv.id = "a_message";

    var date_div = document.createElement("DIV");
    date_div.id = "message_date";
    date_text = document.createTextNode(`${pad(message_object.hour)}:${pad(message_object.minute)}`);
    date_div.appendChild(date_text);
    date_div.classList.add('col-auto');
    date_div.classList.add('align-self-center');

    subdiv.appendChild(date_div);

    message_wrapper = document.createElement("DIV");
    message_wrapper.classList.add('col-auto');
    message_wrapper.classList.add('align-self-center');

    message_body = document.createElement("DIV");
    message_body.classList.add('row');
    message_body.classList.add('align-self-center');

    from_div = document.createElement("DIV");
    // from_div.classList.add("col-2");
    //from_div.classList.add('align-self-center');

    from = document.createTextNode(`${message_object.display_name}:  `);
    from_div.appendChild(from);
    from_div.id = "message_from";

    message_contents_div = document.createElement("DIV");

    message_contents = document.createTextNode(message_object.text);
    message_contents_div.appendChild(message_contents);
    message_contents_div.id = "message_contents";

    message_body.appendChild(from_div);
    message_body.appendChild(message_contents_div);

    message_wrapper.appendChild(message_body);

    subdiv.appendChild(message_wrapper);

    document.querySelector("#messages_area").appendChild(subdiv);



}


var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.emit('join', { 'room': localStorage.getItem('channel_name') });


socket.on('Messages total', data => {

    var div = document.createElement("DIV");
    div.id = "messages_area";

    if (!document.querySelector("#messages_zone").hasChildNodes()) {
        document.querySelector("#messages_zone").appendChild(div);
            data.forEach(function(value) {

        addMessageNode(value);
    });
    }




});

socket.on('New message', data => {

    document.querySelector('#result').innerHTML = "Got a new message";

    addMessageNode(data);


});


document.addEventListener('DOMContentLoaded', () => {


     document.querySelector('#message_text').onkeyup = function() {

    if (this.value.length > 0) {
        document.getElementById('message_submit').disabled = false;
    } else {
        document.getElementById('message_submit').disabled = true;
}
};


    document.querySelector("#back-link").onclick = function() {
        alert("it worked!");
        localStorage.removeItem("channel_name");
    };

    document.querySelector('#message_form').onsubmit = () => {

        // Initialize new request
        const request = new XMLHttpRequest();
        const message_text = document.querySelector('#message_text').value;
        request.open('POST', '/send_message');


        // Add data to send with request
        const data = new FormData();
        data.append('channel_name', localStorage.getItem('channel_name'));
        data.append('display_name', localStorage.getItem('display_name'));
        data.append('text', message_text);

        // Send request
        request.send(data);
        document.querySelector('#message_text').value = "";

        return false;
    };
});
