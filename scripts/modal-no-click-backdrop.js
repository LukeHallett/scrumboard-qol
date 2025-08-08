let loaded = false;
let consistencyBarScriptLoaded = false;
let hoursWorked = 0;
let sprintStartDate = new Date();
let daysInSprint = 0;
const todayDate = new Date();

fetch('https://lukeh.nz/scrumboard').then((response) => {
    return response.json();
}).then((data) => {
    sprintStartDate = new Date(data.sprintStartDate.year, data.sprintStartDate.month - 1, data.sprintStartDate.day);
    daysInSprint = Math.ceil((todayDate - sprintStartDate) / (1000 * 3600 * 24));
});

let testTime = 0;
let testManualTime = 0;
let featureTime = 0;
let fixTime = 0;
let refactorTime = 0;
let reengineerTime = 0;
let testTimePercentage = 0;

const observer = new MutationObserver(function (mutations, observer) {
    if (!consistencyBarScriptLoaded) {
        const consistencyBarScript = document.createElement('script');
        consistencyBarScript.src = chrome.runtime.getURL('scripts/consistency-bar.js');
        consistencyBarScript.onload = function() { this.remove(); };
        (document.body || document.documentElement).appendChild(consistencyBarScript);
        consistencyBarScriptLoaded = true;
    }

    mutations.forEach(function (mutation) {
        for (const element of mutation.addedNodes) {
            if (element.nodeType === 1) {
                const node = element;

                if (node.classList.contains('modal-backdrop')) {
                    node.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }

                if (node.id === 'my-statistics-report-container') {
                    const cards = node.childNodes[0];

                    const cardOne = document.createElement('div');
                    cardOne.classList.add('col-auto');
                    cardOne.innerHTML =
                        '<div class="card p-2 mb-4">' +
                        '   <div class="card-body">' +
                        '       <div class="card-title"><h5 id="stat-card-title">Time Logged</h5></div>' +
                        '       <div class="row d-flex align-items-center">' +
                        '           <div class="col-auto position-relative">' +
                        '               <div>' +
                        '                   <canvas id="chart-custom" width="200" height="200" style="margin-top: -8px; display: block; box-sizing: border-box; touch-action: auto; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); height: 100px; width: 100px;"></canvas>' +
                        '               </div>' +
                        '               <div class="position-absolute" style="left: 50%; top: 50%; transform: translate(-50%, -50%)" id="worked-hours-chart"></div>' +
                        '           </div>' +
                        '           <div id="stat-card-text" class="col text-center">' +
                        '               <span id="text-token-text-content" class="ps-1 ">You have spent</span>' +
                        '               <div>' +
                        '                   <span class="fs-1">' +
                        `                       <span class="ps-1 text-secondary" id="worked-hours">0</span>` +
                        '                   </span>' +
                        '               </div>' +
                        '               <div>' +
                        '                   <span id="text-token-text-content" class="ps-1 ">out of the</span>' +
                        `<span id="value-token-text-content" class="ps-1 text-secondary">${(13 * (daysInSprint / 7)).toFixed(1)}</span><!--!--><!--!-->` +
                        '<span id="text-token-text-content" class="ps-1">hours expected.</span>' +
                        '               </div>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>';

                    const cardTwo = document.createElement('div');
                    cardTwo.classList.add('col-auto');

                    cardTwo.innerHTML =
                        '<div class="card p-2 mb-4">' +
                        '   <div class="card-body">' +
                        '       <div class="card-title"><h5 id="stat-card-title">Testing Time</h5></div>' +
                        '       <div class="row d-flex align-items-center">' +
                        '           <div class="col-auto position-relative">' +
                        '               <div>' +
                        '                   <canvas id="chart-custom-testing" width="200" height="200" style="margin-top: -8px; display: block; box-sizing: border-box; touch-action: auto; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); height: 100px; width: 100px;"></canvas>' +
                        '               </div>' +
                        '               <div class="position-absolute" style="left: 50%; top: 50%; transform: translate(-50%, -50%)" id="test-percentage-chart"></div>' +
                        '           </div>' +
                        '           <div id="stat-card-text" class="col text-center">' +
                        '               <span id="text-token-text-content" class="ps-1 ">You have spent</span>' +
                        '               <div>' +
                        '                   <span class="fs-1">' +
                        `                       <span class="ps-1 text-secondary" id="test-percentage">0</span>` +
                        '                   </span>' +
                        '               </div>' +
                        '               <div>' +
                        '                   <span id="text-token-text-content" class="px-3">of your feature time testing.</span>' +
                        '               </div>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>';

                    cards.appendChild(cardOne);
                    cards.appendChild(cardTwo);
                }

                if (node.classList.contains('card-body') && node.innerHTML.includes('Work Efficiency')) {
                    hoursWorked = node.childNodes[1].childNodes[3].childNodes[8].childNodes[6].innerText;
                    const percentWorkedRaw = (hoursWorked / (13 * (daysInSprint / 7))) * 100;
                    const percentWorked = percentWorkedRaw > 100 ? 100 : percentWorkedRaw;

                    document.getElementById('worked-hours').innerText = hoursWorked;
                    document.getElementById('worked-hours-chart').innerText = `${percentWorked.toFixed(0)}%`;

                    if (!loaded) {
                        const s1 = document.createElement('script');
                        s1.src = chrome.runtime.getURL('scripts/additional-stat-cards.js');
                        s1.onload = function() { this.remove(); };
                        (document.body || document.documentElement).appendChild(s1);
                        loaded = true;
                    }
                }

                if (node.classList.toString().includes('row mt-2 p-2 bg-light rounded')) {
                    for(const child of node.childNodes) {
                        const time = child.childNodes[0].childNodes[3].innerText.split(' ');

                        switch (time[0]) {
                            case 'Test':
                                testTime += parseFloat(time[2]);
                                break;
                            case 'Testmanual':
                                testManualTime += parseFloat(time[2]);
                                break;
                            case 'Feature':
                                featureTime += parseFloat(time[2]);
                                break;
                            case 'Fix':
                                fixTime += parseFloat(time[2]);
                                break;
                            case 'Refactor':
                                refactorTime += parseFloat(time[2]);
                                break;
                            case 'Reengineer':
                                reengineerTime += parseFloat(time[2]);
                                break;
                        }

                        testTimePercentage = ((testTime + testManualTime) / (testTime + testManualTime + featureTime + fixTime + refactorTime + reengineerTime)) * 100;

                        document.getElementById('test-percentage').innerText = `${testTimePercentage.toFixed(0)}%`;
                        document.getElementById('test-percentage-chart').innerText = `${testTimePercentage.toFixed(0)}%`;
                    }
                }
            }
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });