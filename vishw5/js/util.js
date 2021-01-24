function updatePicture(name, position) {
    d3.select('#leaderName').html(name);
    d3.select('#leaderRole').html(position)
    var imageUrl = 'data/images/' + name + '.jpg'
    var newUrl = imageUrl.split(' ').join('');
    d3.select('#leader').attr('src', newUrl);
}

function findMax(data) {
    let maxCount = 0;
    data.forEach(element => {
        let temp = parseInt(element.n)
        if (temp >= maxCount) {
            maxCount = temp;
        }
    });

    return maxCount;
}

function playSound() {
    // let soundObj = document.getElementById('senate');
    document.getElementById('senate').play();

    // soundObj.play();

}

function stopSound() {
    let soundObj = document.getElementById('senate');
    document.getElementById('senate').pause();

    // soundObj.pause();
    soundObj.currentTime = 0;
}