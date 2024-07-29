import { describe, it, expect } from 'vitest'
import { compareHTMLMarkup } from '../helper.ts';

describe('News Markup Semantics', () => {
    it('Check news item semantics', async () => {
        const { liveMarkupStructure, developmentMarkupStructure } = await compareHTMLMarkup({
            liveUrl: 'https://www.hss.de',
            developmentUrl: 'https://www.hss.de',
            selector: '.c-teaserbox-grid'
        })

        expect(liveMarkupStructure).toBe(developmentMarkupStructure)
    })
})