# Leader Election in the browser with Ably

When you run this application in your browser, and the first client joins, it'll be elected the leader and start incrementing the counter.

Subsequent clients that join will receive the counter messages and update their UI. If the `leader` closes their browser, the election process will run and a new leader will be elected who will take over updating and distributing the counter messages from where the last leader left off.

# Running the application

In order to run this demo you will need [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).

Clone the repository and run:

```bash
npm install
npm run start
```

Then open the browser to `http://localhost:8000`.

You'll need to edit `Swarm.ts` to provide an [Ably API Key](https://faqs.ably.com/setting-up-and-managing-api-keys) of your own for the example application to work.
