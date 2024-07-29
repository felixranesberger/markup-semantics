import jsdomLib from 'jsdom'
import linter from 'ibg-html-pretty';

const { JSDOM } = jsdomLib

function removeTextContent(element: HTMLElement): void {
    for (let i = element.childNodes.length - 1; i >= 0; i--) {
        const node = element.childNodes[i];
        if (node.nodeType === 3) { // Node.TEXT_NODE === 3
            // Remove text nodes
            element.removeChild(node);
        } else if (node.nodeType === 1) { // Node.ELEMENT_NODE === 1
            // Recursively process element nodes
            removeTextContent(node as HTMLElement);
        }
    }
}

function clearAttributesContent(element: HTMLElement, attributes: string[]): void {
    for (let i = element.childNodes.length - 1; i >= 0; i--) {
        const node = element.childNodes[i];
        if (node.nodeType === 1) { // Node.ELEMENT_NODE === 1
            const elem = node as HTMLElement;
            attributes.forEach(attr => {
                if (elem.hasAttribute(attr)) {
                    elem.setAttribute(attr, '');
                }
            });
            // Recursively process element nodes
            clearAttributesContent(elem, attributes);
        }
    }
}

async function getHtmlMarkupStructure(url: string, selector: string): string {
    const htmlString = await fetch(url)
        .then(response => response.text())

    const dom = new JSDOM(htmlString)
    const element = dom.window.document.querySelector(selector)

    // go through all child nodes and remove the text content from the elements
    removeTextContent(element)

    // remove unwanted attributes from the elements
    clearAttributesContent(element, ['style', 'src', 'srcset', 'href', 'alt', 'title'])

    return linter.lint(element.outerHTML) as string
}

export async function compareHTMLMarkup({ liveUrl, developmentUrl, selector }: { liveUrl: string, developmentUrl: string, selector: string }) {
    const [liveMarkupStructure, developmentMarkupStructure] = await Promise.all([
        getHtmlMarkupStructure(liveUrl, selector),
        getHtmlMarkupStructure(developmentUrl, selector)
    ])

    return {
        liveMarkupStructure,
        developmentMarkupStructure,
    }
}

