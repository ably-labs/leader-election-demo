import { Types } from "ably";
import Swarm from "./Swarm";

let counter = 0;
const counterUi = document.getElementById("counter-value");
const clientIdUi = document.getElementById("client-id");
const leaderUi = document.getElementById("leader");
const presenceUi = document.getElementById("presence-members");

const swarm = new Swarm("some-channel-name");

clientIdUi.innerText = swarm.id;
leaderUi.innerText = "false";

swarm.onSwarmPresenceChanged = (members: Types.PresenceMessage[]) => {
    presenceUi.innerText = JSON.stringify(members);
};

swarm.onElection = (channel: Types.RealtimeChannelPromise) => {
    leaderUi.innerText = "true";

    setInterval(() => {
        channel.publish("message", { counter: ++counter });
        console.log("Sent counter", counter);
    }, 5000);
};

swarm.onConnection = (channel: Types.RealtimeChannelPromise) => {
    channel.subscribe("message", (message: Types.Message) => {
        counter = message.data.counter;
        counterUi.innerText = counter.toString();
    });
};

swarm.connect();

export { };