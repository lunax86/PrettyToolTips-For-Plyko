
const _TOOLTIP_CONFIG_ = {

    followCursor: true,
    inheritColors: true,

}

function makeToolTipElement() 
{
    let tooltip = document.createElement('div');

    tooltip.id = 'pretty-tooltip';

    document.body.appendChild(tooltip);
}

function formatToolTipText(text)
{
    let formattedText = '<table>';

    const rows = text.split(/\r?\n/);

    rows.forEach((row) => {
        if (row.trim() === '') return;

        formattedText += '<tr>';

        row.split(':').forEach((cell) => {
            formattedText += '<td>' + cell + '</td>';
        });

        formattedText += '</tr>';
    });

    return (formattedText += '</table>');
}

function inheritBackground(element)
{
    const compStyles = getComputedStyle(element);
    const root = document.querySelector(':root');

    if (compStyles.backgroundColor.includes('rgba')) {
        root.style.setProperty('--prettyTooltip-background', 'rgb(230,230,230)');
    } else {
        root.style.setProperty('--prettyTooltip-background', compStyles.backgroundColor);
    }
}


function addToolTipEventListener()
{
    const tooltip = document.getElementById('pretty-tooltip');

    document.addEventListener('mousemove', function (event) {

        if (event.target === undefined) return;

        if (event.target.hasAttribute('data-tooltip')) {

            tooltip.innerHTML = formatToolTipText(
                event.target.getAttribute('data-tooltip')
            );

            if (_TOOLTIP_CONFIG_.followCursor) {
                tooltip.style.left = event.pageX + 10 + 'px';
                tooltip.style.top = event.pageY + 10 + 'px';
            }

            if (_TOOLTIP_CONFIG_.inheritColors) colors = inheritBackground(event.target);

            tooltip.classList.add('show');
        } else {
            tooltip.classList.remove('show');
        }
    });
}

function swapTitleForDataAttr(element)
{
    if (element.getAttribute('title').trim() === '') return;

    element.setAttribute('data-tooltip', element.title);
    element.removeAttribute('title');
}

function initToolTips()
{
    const elements = document.querySelectorAll('*[title]');

    if (elements.length === 0) {
        console.warn('PrettyToolTip: Not a single element with title attribute found.');
        return;
    }

    makeToolTipElement();

    elements.forEach((element) => {
        swapTitleForDataAttr(element);
    });

    addToolTipEventListener();
}

initToolTips();
