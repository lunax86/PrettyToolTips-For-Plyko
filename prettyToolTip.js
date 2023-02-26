
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

function addToolTipEventListener()
{
    const tooltip = document.getElementById('pretty-tooltip');

    document.addEventListener('mousemove', function (event) {
        if (event.target === undefined) return;
        if (
            event.target.hasAttribute('data-tooltip') &&
            event.target.getAttribute('data-tooltip').trim() !== ''
        ) {
            tooltip.classList.add('show');
            tooltip.innerHTML = formatToolTipText(
                event.target.getAttribute('data-tooltip')
            );
            tooltip.style.left = event.pageX + 10 + 'px';
            tooltip.style.top = event.pageY + 10 + 'px';
        } else {
            tooltip.classList.remove('show');
        }
    });
}

function swapTitleForDataAttr(element)
{
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
