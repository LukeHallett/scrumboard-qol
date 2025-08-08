let sprintStartDate1 = new Date();
let daysInSprint1 = 0;
const todayDate1 = new Date();
let idealTimeCalc = 0;

fetch('https://lukeh.nz/scrumboard').then((response) => {
    return response.json();
}).then((data) => {
    sprintStartDate1 = new Date(data.sprintStartDate.year, data.sprintStartDate.month - 1, data.sprintStartDate.day);
    daysInSprint1 = Math.ceil((todayDate1 - sprintStartDate1) / (1000 * 3600 * 24));
    idealTimeCalc = (13 * (daysInSprint1 / 7));
});

const hoursWorked = document.getElementById('my-statistics-report-container').childNodes[0].childNodes[5].childNodes[1].childNodes[0].childNodes[1].childNodes[3].childNodes[8].childNodes[6].innerText;
let testingPercentage = document.getElementById('my-statistics-report-container').childNodes[0].childNodes[7].childNodes[0].childNodes[1].childNodes[3].childNodes[1].childNodes[3].innerText;
testingPercentage = testingPercentage.substring(0, testingPercentage.length - 1);

let previousUrl = '';

const urlObserver = new MutationObserver((mutations) => {
    if (location.href !== previousUrl) {
        previousUrl = location.href;

        if (location.href.includes('report/5')) {

            setTimeout(() => {
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
                                            "value": (idealTimeCalc - hoursWorked) < 0 ? 0 : (idealTimeCalc - hoursWorked)
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
            }, 500);

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
        }
    }
});

urlObserver.observe(document, {
    subtree: true,
    childList: true
});