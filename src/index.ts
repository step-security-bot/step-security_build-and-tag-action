import { Toolkit } from 'actions-toolkit'
import buildAndTagAction from './lib'
import validateSubscription from './subscription'

async function run() {
  await validateSubscription()

  Toolkit.run(buildAndTagAction, {
    secrets: ['GITHUB_TOKEN']
  })
}

run()
