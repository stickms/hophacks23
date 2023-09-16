
for (el of getArrayFromTextFile("OutputENCoursesCurrent.txt")) {
    console.log(el);
}

function getArrayFromTextFile(src) {
    return require("fs").readFileSync(src).toLocaleString().split("\n"); 
}

// Notes: use the course number to obtain the name of the course,
// Then use it to obtain the description. Use the course number and name 
// as the ML outputs. If it does not have a description, skip over it. We do not
// want it in our dataset. Store these information as a JSON file so it's easier to train
// the model on. 