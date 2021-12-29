import { get } from 'superagent'
import cheerio from 'cheerio'

const problem = async (id: string) => {
  try {
    const url = (await problems()).filter(p => p.id === id.trim())[0].src
    const { text } = await get(`http://ot.jungbo.me/${url}/`)
    const $ = cheerio.load(text)

    const head = $('div.panel:nth-child(1) > div:nth-child(2)').text().trim()
    const idesc = $('.container > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)').text().trim()
    const odesc = $('div.panel:nth-child(3) > div:nth-child(2)').text().trim()
    const input = $('#sampleinput').text().trim()
    const output = $('#sampleoutput').text().trim()

    return { success: true, head, idesc, odesc, input, output, url: `http://ot.jungbo.me/${url}` }
  } catch {
    return { success: false }
  }
}

const problems = async () => {
  const { text } = await get('http://ot.jungbo.me/contest.php?cid=1018')
  const $ = cheerio.load(text)

  const data = [] as { id: string, src: string }[]
  const table = $('tbody>tr')
  table.each((i, el) => {
    const td = $(el).find('td')
    const id = td.eq(1).text().trim()
    const src = td.eq(1).find('a').attr('href') || ''
    data.push({ id, src })
  })
  return data
}

export default problem
