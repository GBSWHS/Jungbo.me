import dotenv from 'dotenv'
import problem from './utils/problem'
import { Client, Intents, MessageEmbed } from 'discord.js'

dotenv.config()
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

bot.on('ready', () => console.log('Ready!'))

bot.on('message', async (input) => {
  if (input.author.bot) return
  if (!input.content.startsWith('-')) return
  const msg = input.content.slice(1)

  if (msg.startsWith('GET') || msg.startsWith('get')) {
    const id = msg.split(' ')[1] as string
    if (!id) {
      input.reply('아이디를 입력해주세요.')
      return
    }
    const info = await problem(id.toUpperCase())

    if (!info.success) {
      input.channel.send('문제를 찾을 수 없습니다!')
      return
    }
    const embed = new MessageEmbed({ color: 'RED' })
    const embed2 = new MessageEmbed({ color: 'RED' })
    input.channel.send({
      embeds: [
        embed.setTitle(id.toUpperCase() + ' 문제를 불러온 결과입니다.')
          .addField('문제 설명', '```' + info.head + '```')
          .addField('입력 설명', '```' + info.idesc + '```')
          .addField('출력 설명', '```' + info.odesc + '```'),
        embed2.setTitle('입출력')
          .addField('입력', '```' + info.input + '```', true)
          .addField('출력', '```' + info.output + '```', true)
          .addField('문제 조지기', `[${info.url}](${info.url})`, false)
      ]
    })
  }
})

bot.login(process.env.TOKEN)
