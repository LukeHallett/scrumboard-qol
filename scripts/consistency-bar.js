const consistencyBarObserver = new MutationObserver(function (mutations, observer) {
    for (const mutation of mutations) {
        for (const element of mutation.addedNodes) {
            if (location.href.includes('report/9') && element.nodeName === "CANVAS") {
                setTimeout(() => {
                    const chart = Chart.getChart("consistency-chart");
                    const totals = [];

                    for (const label of chart.data.labels) {
                        totals.push(0);
                    }

                    for (const dataset of chart.data.datasets) {
                        for (let i = 0; i < dataset.data.length; i++) {
                            totals[i] += dataset.data[i];
                        }
                    }

                    console.log(totals)
                    const totalsHtml = totals.map((total, index) => {
                        return `<span>${total.toFixed(1)}</span>`;
                    }).join('');

                    const div = document.createElement('div');
                    div.innerHTML = '<div class="d-flex justify-content-between" style="padding-left: 4em; padding-right: 2em;">' + totalsHtml + '</div>';

                    document.getElementsByClassName("container-fluid")[0].childNodes[8].appendChild(div)

                }, 1000)
            }
        }
    }
});

consistencyBarObserver.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });