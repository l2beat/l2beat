import { getEnv } from '@l2beat/backend-tools'
import { DiscordClient, HttpClient } from '@l2beat/shared'

async function main() {
  const env = getEnv()
  const httpClient = new HttpClient()

  console.log('\n--- Testing Discord Clients ---\n')

  const token = env.optionalString('DISCORD_TOKEN')
  const internalChannelId = env.optionalString('INTERNAL_DISCORD_CHANNEL_ID')
  const webhookUrl = env.optionalString('ANOMALIES_DISCORD_WEBHOOK_URL')

  // 1. Test Normal DiscordClient (Bot Authorization)
  if (token && internalChannelId) {
    console.log('Testing DiscordClient (Normal Bot - Internal Channel)...')
    const discordClient = new DiscordClient(httpClient, {
      token,
      internalChannelId,
      callsPerMinute: 3000,
    })

    try {
      await discordClient.sendMessage(
        'Hello from standalone test script! (Normal Bot Client)',
        'INTERNAL',
      )
      console.log(
        '✅ DiscordClient: Message sent successfully to INTERNAL channel.',
      )
    } catch (e: any) {
      console.error('❌ DiscordClient (Normal Bot) error:', e.message || e)
    }
  } else {
    console.log(
      'ℹ️ DiscordClient (Normal Bot): Skipping (DISCORD_TOKEN or INTERNAL_DISCORD_CHANNEL_ID missing)',
    )
  }

  console.log('')

  // 2. Test DiscordClient Webhook Methods (Configured with Webhook URL)
  if (webhookUrl) {
    console.log('Testing DiscordClient with default Webhook URL...')
    const discordClient = new DiscordClient(httpClient, {
      token: token ?? 'dummy',
      internalChannelId: internalChannelId ?? 'placeholder',
      callsPerMinute: 3000,
      webhookUrl, // Initialized here!
    })

    try {
      console.log('  -> Sending message (using default URL)...')
      const messageId = await discordClient.sendMessageToWebhook(
        'Hello! Testing default webhook URL.',
      )
      console.log(
        `  ✅ DiscordClient.sendMessageToWebhook: Success (ID: ${messageId})`,
      )

      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('  -> Deleting message (using default URL)...')
      await discordClient.deleteWebhookMessage(messageId)
      console.log('  ✅ DiscordClient.deleteWebhookMessage: Success')
    } catch (e: any) {
      console.error('  ❌ DiscordClient Webhook error:', e.message || e)
    }
  } else {
    console.log(
      'ℹ️ DiscordClient Webhook methods: Skipping (ANOMALIES_DISCORD_WEBHOOK_URL missing)',
    )
  }

  console.log('\n--- Test Complete ---\n')
}

main().catch(console.error)
