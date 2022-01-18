import { Types } from 'ably';
import Ably from 'ably/promises';

export default class Swarm {
    public readonly id: string;
    private readonly ably: Ably.Realtime;
    private readonly channel: Types.RealtimeChannelPromise;

    public onElection: (channel: Types.RealtimeChannelPromise) => void = () => { };
    public onConnection: (channel: Types.RealtimeChannelPromise) => void = () => { };
    public onSwarmPresenceChanged: (members: Types.PresenceMessage[]) => void = () => { };

    constructor(channelName: string) {
        this.id = Math.floor(Math.random() * 1000000) + "";
        this.ably = new Ably.Realtime({ key: "api-key-here", clientId: this.id });
        this.channel = this.ably.channels.get(channelName);
    }

    public async connect() {
        this.channel.presence.subscribe(this.onPresenceChanged.bind(this));
        await this.channel.presence.enter('connected');
        this.onConnection(this.channel);
    }

    private async onPresenceChanged() {
        const members = await this.channel.presence.get();
        this.ensureLeaderElected(members);
        this.onSwarmPresenceChanged(members);
    }

    private async ensureLeaderElected(members: Types.PresenceMessage[]) {
        const leader = members.find(s => s.data === "leader");

        if (leader) {
            return;
        }

        const sortedMembers = members.sort((a, b) => (a.connectionId as any) - (b.connectionId as any));

        if (sortedMembers[0].clientId === this.id) {
            await this.channel.presence.update("leader");
            this.onElection(this.channel);
        }
    }
}
