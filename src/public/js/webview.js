
var padding = { top: 20, right: 40, bottom: 0, left: 0 },
    w = 250 - padding.left - padding.right,
    h = 250 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    newRotation = 0,
    picked = 100000,
    oldpick = [],
    price = "",
    color = d3.scale.category20();//category20c()
//randomNumbers = getRandomNumbers();
//http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
var data = [
    { "label": "Dell LAPTOP", "value": 0, "question": "What CSS property is used for specifying the area between the content and its border?", "degree": 0, "percent": 1 }, // padding
    { "label": "IMAC PRO", "value": 1, "question": "What CSS property is used for changing the font?", "degree": 0, "percent": 95 }, //font-family
    { "label": "A1", "value": 2, "question": "What CSS property is used for changing the color of text?", "degree": 0, "percent": 1 },
    { "label": "A2", "value": 2, "question": "What CSS property is used for changing the color of text?", "degree": 0, "percent": 1 },
    { "label": "A3", "value": 2, "question": "What CSS property is used for changing the color of text?", "degree": 0, "percent": 1 },
    { "label": "A4", "value": 2, "question": "What CSS property is used for changing the color of text?", "degree": 0, "percent": 1 }, //color
];

var ps = 360 / data.length
var totalLength = data.length
var index = 0

// var degree = 0
data.map(function (i) {
    index++
    if (index === totalLength) {
        var degree = ((totalLength - index) * ps) + 360 * 4
        data[0]['degree'] = degree
    } else {
        var degree = ((totalLength - index) * ps) + 360 * 4
        data[index]['degree'] = degree
    }
})
console.log(data)


const expanded = data.flatMap(item => Array(item.percent).fill(item));

console.log(expanded)

console.log(data)

var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
var vis = container
    .append("g");

var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

arcs.append("path")
    .attr("fill", function (d, i) { return color(i); })
    .attr("d", function (d) { return arc(d); });
arcs.append("text").attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
}).attr("text-anchor", "end")
    .text(function (d, i) {
        return data[i].label;
    });

container.on("click", spin);

function spin() {
    container.on("click", null);
    const winner = expanded[Math.floor(Math.random() * expanded.length)];
    console.log(winner.label)

    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if (oldpick.length == data.length) {
        console.log("done");
        container.on("click", null);
        return;
    }

    // var ps = 360 / data.length,
    //     pieslice = Math.round(1440 / data.length),
    //     rng = Math.floor((Math.random() * 1440) + 360);



    // console.log(rng)
    // rotation = (Math.round(rng / ps) * ps);
    rotation = winner.degree
    console.log(rotation)
    // rotation = winner.degree
    // newRotation = winner.degree

    if ((rotation % 360) === 0) {
        picked = 0
    } else {
        picked = Math.round(data.length - (rotation % 360) / ps);
    }
    console.log(picked)

    rotation += 90 - Math.round(ps / 2);


    vis.transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function () {
            //mark question as seen
            // d3.select(".slice:nth-child(" + (picked + 1) + ") path")
            //     .attr("fill", "#111");
            //populate question
            // d3.select("#question h1")
            //     .text(data[picked].label);
            // alert(data[picked].label)
            oldrotation = rotation;

            /* Get the result value from object "data" */
            console.log(data[picked].value)
            price = winner.label
            Swal.fire({
                title: "What you want to do?",
                showConfirmButton: false,
                showCloseButton: true,
                html: `
                  <div>
                    <button class="btn btn-primary" onclick="onBtnClicked('ok')">Reply</button>
                    <div>select an action</div>
                    <button class="btn btn-danger" onclick="onBtnClicked('delete')">Delete</button>
                  </div>`
            });

            /* Comment the below line for restrict spin to sngle time */
            container.on("click", spin);
        });
}

function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
        return "rotate(" + i(t) + ")";
    };
}

//make arrow
svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
    .style({ "fill": "black" });
//draw spin circle
container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 30)
    .style({ "fill": "white", "cursor": "pointer" });
//spin text
container.append("text")
    .attr("x", 0)
    .attr("y", 7)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({ "font-weight": "bold", "font-size": "15px" });


var onBtnClicked = (btnId) => {
    Swal.close();
    var sender_psid = document.getElementById("psid").value
    if (btnId == "ok") {
        var data = {
            psid : sender_psid, 
            message: price 
        };

        fetch('https://website-chat-bot.herokuapp.com/results', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                console.log('Request succeeded with JSON response', data);
            })
            .catch(function(err){
                console.log(err)
            })
    }
};

