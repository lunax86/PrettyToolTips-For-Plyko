class PrettyToolTip {

    constructor() {
        this._TOOLTIP_CONFIG_ = {
            followCursor: true,
            curOffsetX: 8,
            curOffsetY: 8,
            inheritBackground: true,
        };

        if (!document.getElementById('pretty-tooltip')) {
            this.makeToolTipDiv();
        }

        this.tooltip = document.getElementById('pretty-tooltip');
        this.root = document.querySelector(':root');
        this.root.style.setProperty('--pretty-tooltip-background', 'rgb(89, 89, 89)');
    }

    init = () => {
        const elements = document.querySelectorAll('*[title]');

        if (elements.length === 0) {
            console.warn('PrettyToolTip: Not a single element with title attribute found.');
            return;
        }

        elements.forEach((element) => {
            this.swapTitleForDataAttr(element);
        });

        this.addToolTipEventListener();
    };

    makeToolTipDiv = () => {
        let tooltip = document.createElement('div');
        tooltip.id = 'pretty-tooltip';
        document.body.appendChild(tooltip);
    };

    swapTitleForDataAttr = (element) => {
        if (element.getAttribute('title').trim() === '') return;

        element.setAttribute('data-tooltip', element.title);
        element.removeAttribute('title');
    };

    inheritBackground = (element) => {
        const compStyles = getComputedStyle(element);

        if (compStyles.backgroundColor.includes('rgba')) {
            this.root.style.setProperty('--pretty-tooltip-background', 'rgb(89, 89, 89)');
        } else {
            this.root.style.setProperty('--pretty-tooltip-background', compStyles.backgroundColor);
        }
    };

    formatToolTipText = (text) => {
        let formattedText = '<div class="table">';

        const rows = text.split(/\r?\n/);

        rows.forEach((row) => {
            if (row.trim() === '') return;

            formattedText += '<div class="table-row">';

            row.split(':').forEach((cell) => {
                if (cell.trim() === '') return;
                formattedText += '<div class="table-cell">' + cell + '</div>';
            });

            formattedText += '</div>';
        });

        return (formattedText += '</div>');
    };

    calcToolTipPos = (event) => {
        const toolTipBox = this.tooltip.getBoundingClientRect();
        const pageHeight = window.innerHeight;
        const pageWidth = window.innerWidth;

        const pixFromLeftEdge =
            toolTipBox.width + this._TOOLTIP_CONFIG_.curOffsetX * 2 + event.clientX - pageWidth;
        const pixFromBottomEdge =
            toolTipBox.height + this._TOOLTIP_CONFIG_.curOffsetY * 2 + event.clientY - pageHeight;

        if (pixFromLeftEdge > 0) {
            this.tooltip.style.left =
            event.pageX - pixFromLeftEdge + this._TOOLTIP_CONFIG_.curOffsetX + 'px';
        } else {
            this.tooltip.style.left = event.pageX + this._TOOLTIP_CONFIG_.curOffsetX + 'px';
        }

        if (pixFromBottomEdge > 0) {
            this.tooltip.style.top =
            event.pageY - this._TOOLTIP_CONFIG_.curOffsetY - toolTipBox.height + 'px';
        } else {
            this.tooltip.style.top = event.pageY + this._TOOLTIP_CONFIG_.curOffsetY + 'px';
        }
    };

    updateToolTip = (event) => {
        this.tooltip.innerHTML = this.formatToolTipText(event.target.getAttribute('data-tooltip'));
        if (this._TOOLTIP_CONFIG_.followCursor) this.calcToolTipPos(event);

        if (this._TOOLTIP_CONFIG_.inheritBackground) this.inheritBackground(event.target);
    };

    addToolTipEventListener = () => {
        document.addEventListener('mousemove', (event) => {
            if (event.target.hasAttribute === undefined) return;

            if (event.target.hasAttribute('data-tooltip')) {
                this.updateToolTip(event);
                this.tooltip.classList.add('show');
            } else {
                this.tooltip.classList.remove('show');
            }
        });
    };
}

let prettyTooltip = new PrettyToolTip();
prettyTooltip.init();
