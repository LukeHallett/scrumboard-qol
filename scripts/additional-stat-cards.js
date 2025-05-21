const todayDate1 = new Date();
const daysInSprint1 = Math.ceil((todayDate1 - new Date(2025, 3, 28)) / (1000 * 3600 * 24));
const idealTime = (13 * (daysInSprint1 / 7));

const hoursWorked = document.getElementById('my-statistics-report-container').childNodes[0].childNodes[5].childNodes[1].childNodes[0].childNodes[1].childNodes[3].childNodes[8].childNodes[6].innerText;
let testingPercentage = document.getElementById('my-statistics-report-container').childNodes[0].childNodes[7].childNodes[0].childNodes[1].childNodes[3].childNodes[1].childNodes[3].innerText;
testingPercentage = testingPercentage.substring(0, testingPercentage.length - 1);

new Chart(
    document.getElementById("chart-custom"),
    {
        type: "doughnut",
        options: {
            "responsive": true,
            "aspectRatio": 1,
            "cutout": 40,
            "layout": {
                "autoPadding": false,
                "padding": 0
            },
            "plugins": {
                "tooltip": {
                    "enabled": false
                },
                "hover": {
                    "filter": {
                        "type": "none"
                    }
                }
            }
        },
        data: {
            "datasets": [
                {
                    "data": [
                        {
                            "value": hoursWorked
                        },
                        {
                            "value": (idealTime - hoursWorked) < 0 ? 0 : (idealTime - hoursWorked)
                        }
                    ],
                    "backgroundColor": [
                        "DodgerBlue",
                        "Gray"
                    ],
                    "borderColor": [
                        "DodgerBlue",
                        "Gray"
                    ],
                    "borderWidth": 0.1,
                    "hoverBackgroundColor": [
                        "DodgerBlue",
                        "Gray"
                    ]
                }
            ]
        },
    }
);

const highlightColour = testingPercentage >= 30 && testingPercentage <= 45 ? 'ForestGreen' : 'FireBrick';

new Chart(
    document.getElementById("chart-custom-testing"),
    {
        type: "doughnut",
        options: {
            "responsive": true,
            "aspectRatio": 1,
            "cutout": 40,
            "layout": {
                "autoPadding": false,
                "padding": 0
            },
            "plugins": {
                "tooltip": {
                    "enabled": false
                },
                "hover": {
                    "filter": {
                        "type": "none"
                    }
                }
            }
        },
        data: {
            "datasets": [
                {
                    "data": [
                        {
                            "value": testingPercentage
                        },
                        {
                            "value": 100 - testingPercentage
                        }
                    ],
                    "backgroundColor": [
                        highlightColour,
                        "Gray"
                    ],
                    "borderColor": [
                        highlightColour,
                        "Gray"
                    ],
                    "borderWidth": 0.1,
                    "hoverBackgroundColor": [
                        highlightColour,
                        "Gray"
                    ]
                }
            ]
        },
    }
);